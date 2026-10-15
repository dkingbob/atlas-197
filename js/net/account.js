/* global supabase */
/**
 * Account — sign up / sign in with email + password, and keep the progress
 * of a signed-in player in the cloud (Supabase), so it follows them on every
 * device.
 *
 *   Passwords never touch our code beyond the form: Supabase stores them
 *   hashed. The progress is one row per player in the `progress` table
 *   (see supabase/schema.sql); row-level security lets each player read and
 *   write only their own row.
 *
 * Sync:
 *   - on sign-in: this device's progress and the account's are MERGED
 *     (nothing learned on either side is lost), then saved to both
 *   - afterwards: every change is uploaded a few seconds later
 *   - sign out: the progress stays on this device
 *
 * Setup: put the project URL and anon key in CONFIG (js/config.js).
 */
import { CONFIG } from '../config.js';
import { Store, mergeStates } from '../core/store.js';

const UPLOAD_DELAY_MS = 3000;
const AUTH_KEY = 'atlas197.auth'; // where Supabase keeps the session in this browser
export const PASSWORD_RULES = [
  { id: 'length', test: p => p.length >= 8 },
  { id: 'upper', test: p => /\p{Lu}/u.test(p) },
  { id: 'number', test: p => /\d/.test(p) },
];
export const passwordOk = p => PASSWORD_RULES.every(r => r.test(p));

let client = null;
let loading = null;
let user = null;
let uploadTimer = 0;
let unsubscribeStore = null;
let syncing = false;
const listeners = new Set();
const recoveryListeners = new Set();
let syncState = 'idle'; // 'idle' | 'saving' | 'saved' | 'error'

/** Project URL + key (tests can point to a fake with window.ATLAS_ACCOUNT_OPTIONS). */
const settings = () => window.ATLAS_ACCOUNT_OPTIONS || { url: CONFIG.SUPABASE_URL, key: CONFIG.SUPABASE_ANON_KEY };
export const isConfigured = () => Boolean(settings().url && settings().key);

function loadLibrary() {
  if (typeof supabase !== 'undefined') return Promise.resolve();
  loading ||= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = CONFIG.SUPABASE_JS_URL;
    script.onload = () => resolve();
    script.onerror = () => { loading = null; reject(new Error('network')); };
    document.head.appendChild(script);
  });
  return loading;
}

async function getClient() {
  if (!isConfigured()) throw new Error('not_configured');
  if (client) return client;
  await loadLibrary();
  client = supabase.createClient(settings().url, settings().key, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: AUTH_KEY },
  });
  // link from a "reset your password" email: let the player choose a new one
  client.auth.onAuthStateChange(event => { if (event === 'PASSWORD_RECOVERY') recoveryListeners.forEach(fn => fn()); });
  return client;
}

function emit() { listeners.forEach(fn => fn({ user, syncState })); }
function setSync(state) { syncState = state; emit(); }

/** Turn Supabase errors into short codes the dialog can translate. */
function errorCode(error) {
  const m = `${error?.code || ''} ${error?.message || ''}`.toLowerCase();
  if (m.includes('invalid login') || m.includes('invalid_credentials')) return 'bad_login';
  if (m.includes('already registered') || m.includes('user_already_exists')) return 'exists';
  if (m.includes('email not confirmed') || m.includes('email_not_confirmed')) return 'not_confirmed';
  if (m.includes('rate limit') || m.includes('over_email_send_rate_limit')) return 'rate_limit';
  if (m.includes('password')) return 'weak_password';
  if (m.includes('fetch') || m.includes('network') || m.includes('not_configured')) return m.includes('not_configured') ? 'not_configured' : 'network';
  return 'unknown';
}

/* =====================================================================
   PROGRESS SYNC
   ===================================================================== */
async function pullAndMerge() {
  const db = await getClient();
  const { data, error } = await db.from('progress').select('data').eq('user_id', user.id).maybeSingle();
  if (error) throw error;
  const merged = data?.data ? mergeStates(Store.snapshot(), data.data) : Store.snapshot();
  syncing = true;
  Store.replaceState(merged);
  syncing = false;
  await upload();
}

async function upload() {
  if (!user) return;
  clearTimeout(uploadTimer);
  setSync('saving');
  try {
    const db = await getClient();
    const { error } = await db.from('progress').upsert({ user_id: user.id, data: Store.snapshot(), updated_at: new Date().toISOString() });
    if (error) throw error;
    setSync('saved');
  } catch {
    setSync('error');
  }
}

function startSync() {
  unsubscribeStore?.();
  unsubscribeStore = Store.subscribe(() => {
    if (syncing || !user) return;
    clearTimeout(uploadTimer);
    uploadTimer = setTimeout(upload, UPLOAD_DELAY_MS);
  });
  window.addEventListener('pagehide', () => { if (uploadTimer) upload(); });
}

async function signedIn(newUser) {
  user = newUser;
  emit();
  try { await pullAndMerge(); } catch { setSync('error'); }
  startSync();
}

/* =====================================================================
   PUBLIC API
   ===================================================================== */
export const Account = {
  isConfigured,
  user: () => user,
  syncState: () => syncState,
  /** fn({ user, syncState }) on every change. */
  onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },

  /** Restore the session saved in this browser (if any). Safe to call when not configured. */
  async restore() {
    // only load the account library for players who signed in on this browser before
    // (or who arrive from a confirmation / password-reset email link)
    const fromEmailLink = /access_token|type=recovery|code=/.test(location.hash + location.search);
    if (!isConfigured() || (!localStorage.getItem(AUTH_KEY) && !fromEmailLink)) return;
    try {
      const db = await getClient();
      const { data } = await db.auth.getSession();
      if (data.session?.user) await signedIn(data.session.user);
    } catch { /* offline: stay signed out for now */ }
  },

  /**
   * @returns {{ ok: true, needsConfirmation: boolean } | { ok: false, code }}
   */
  async signUp(email, password, name) {
    if (!passwordOk(password)) return { ok: false, code: 'weak_password' };
    try {
      const db = await getClient();
      const { data, error } = await db.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo: location.origin } });
      if (error) return { ok: false, code: errorCode(error) };
      // Supabase hides "already registered" behind an empty identities list
      if (data.user && Array.isArray(data.user.identities) && !data.user.identities.length) return { ok: false, code: 'exists' };
      if (data.session) await signedIn(data.user);
      return { ok: true, needsConfirmation: !data.session };
    } catch (e) {
      return { ok: false, code: errorCode(e) };
    }
  },

  async signIn(email, password) {
    try {
      const db = await getClient();
      const { data, error } = await db.auth.signInWithPassword({ email, password });
      if (error) return { ok: false, code: errorCode(error) };
      await signedIn(data.user);
      return { ok: true };
    } catch (e) {
      return { ok: false, code: errorCode(e) };
    }
  },

  async resetPassword(email) {
    try {
      const db = await getClient();
      const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo: location.origin });
      return error ? { ok: false, code: errorCode(error) } : { ok: true };
    } catch (e) {
      return { ok: false, code: errorCode(e) };
    }
  },

  /** fn() when the player arrives from a password-reset email. */
  onRecovery(fn) { recoveryListeners.add(fn); },

  async updatePassword(password) {
    if (!passwordOk(password)) return { ok: false, code: 'weak_password' };
    try {
      const { error } = await (await getClient()).auth.updateUser({ password });
      return error ? { ok: false, code: errorCode(error) } : { ok: true };
    } catch (e) {
      return { ok: false, code: errorCode(e) };
    }
  },

  async signOut() {
    if (uploadTimer) await upload();
    unsubscribeStore?.();
    unsubscribeStore = null;
    try { await (await getClient()).auth.signOut(); } catch { /* already signed out */ }
    user = null;
    setSync('idle');
  },

  /** Save now (used by the account panel). */
  saveNow: upload,
  displayName: () => user?.user_metadata?.name || user?.email?.split('@')[0] || '',
};
