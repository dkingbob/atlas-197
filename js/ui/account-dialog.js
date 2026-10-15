/**
 * Account dialog: sign in, create an account, forgotten password, and the
 * signed-in panel (sync status, sign out). Two halves: the form on the left,
 * a dark panel with what an account gives you on the right.
 *
 * Creating an account plays a short celebration (check mark + flags).
 */
import { COUNTRIES } from '../data/countries/index.js';
import { $, escapeHtml, shuffle } from '../core/utils.js';
import { t } from '../i18n/i18n.js';
import { Account, PASSWORD_RULES, passwordOk } from '../net/account.js';
import { ICONS } from './icons.js';
import { flagImage, redrawDialog, Modal, Toast } from './components.js';

const ID = 'account-modal';
const SUCCESS_MS = 2600;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

let screen = 'signin';   // signin | signup | forgot | sent | success | account | recovery
let busy = false;
let error = '';
let notice = '';
let draft = { name: '', email: '', password: '' };
let onSignedIn = () => {};

const modal = () => $('#' + ID);

/* =====================================================================
   PIECES
   ===================================================================== */
const field = ({ name, type = 'text', label, icon, placeholder, value = '', auto }) => `
  <label class="a-field"><span>${label}</span>
    <span class="a-input">${icon}<input name="${name}" type="${type}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}"
      autocomplete="${auto}" ${type === 'email' ? 'inputmode="email" autocapitalize="off" spellcheck="false"' : ''} required>
      ${type === 'password' ? `<button type="button" class="a-eye" data-act="eye" aria-label="${t('accShowPassword')}">${ICONS.eye}</button>` : ''}
    </span></label>`;

const emailField = () => field({ name: 'email', type: 'email', label: t('accEmail'), icon: ICONS.mail, placeholder: t('accEmailPh'), value: draft.email, auto: 'email' });
const passwordField = (auto = 'current-password', label = t('accPassword')) =>
  field({ name: 'password', type: 'password', label, icon: ICONS.lock, placeholder: t('accPasswordPh'), value: draft.password, auto });

/** Live checklist: 8 characters, a capital letter, a number. */
const rulesHtml = password => `<ul class="a-rules">${PASSWORD_RULES.map(r => `
  <li class="${r.test(password) ? 'ok' : ''}" data-rule="${r.id}">${ICONS.check}${t('accRule_' + r.id)}</li>`).join('')}</ul>`;

const messages = () => `${error ? `<p class="a-msg bad" role="alert">${escapeHtml(error)}</p>` : ''}${notice ? `<p class="a-msg ok">${escapeHtml(notice)}</p>` : ''}`;
const submit = label => `<button class="btn btn-primary a-submit" ${busy ? 'disabled' : ''}>${busy ? '<span class="a-spin"></span>' : ''}${label}</button>`;

function formHtml() {
  switch (screen) {
    case 'signup': return `
      <h2>${t('accSignupTitle')}</h2><p class="lead">${t('accSignupLead')}</p>
      <form data-form="signup" novalidate>
        ${field({ name: 'name', label: t('accName'), icon: ICONS.user, placeholder: t('accNamePh'), value: draft.name, auto: 'nickname' })}
        ${emailField()}
        ${passwordField('new-password')}
        ${rulesHtml(draft.password)}
        ${messages()}${submit(t('accCreate'))}
      </form>
      <p class="a-switch">${t('accHaveAccount')} <button data-go="signin">${t('accSignIn')}</button></p>`;
    case 'forgot': return `
      <h2>${t('accForgotTitle')}</h2><p class="lead">${t('accForgotLead')}</p>
      <form data-form="forgot" novalidate>${emailField()}${messages()}${submit(t('accSendLink'))}</form>
      <p class="a-switch"><button data-go="signin">← ${t('accBack')}</button></p>`;
    case 'sent': return `
      <div class="a-sent">${ICONS.mail}<h2>${t('accCheckInbox')}</h2>
        <p class="lead">${t('accSentLead', { email: escapeHtml(draft.email) })}</p></div>
      <p class="a-switch"><button data-go="signin">← ${t('accBack')}</button></p>`;
    case 'recovery': return `
      <h2>${t('accNewPasswordTitle')}</h2><p class="lead">${t('accNewPasswordLead')}</p>
      <form data-form="recovery" novalidate>${passwordField('new-password', t('accNewPassword'))}${rulesHtml(draft.password)}${messages()}${submit(t('accSave'))}</form>`;
    case 'account': return accountHtml();
    default: return `
      <h2>${t('accWelcome')}</h2><p class="lead">${t('accSigninLead')}</p>
      <form data-form="signin" novalidate>
        ${emailField()}${passwordField()}
        <button type="button" class="a-forgot" data-go="forgot">${t('accForgot')}</button>
        ${messages()}${submit(t('accSignIn'))}
      </form>
      <p class="a-switch">${t('accNoAccount')} <button data-go="signup">${t('accSignUp')}</button></p>`;
  }
}

function accountHtml() {
  const user = Account.user();
  const name = Account.displayName();
  const sync = Account.syncState();
  return `
    <div class="a-profile"><span class="a-avatar big">${escapeHtml(name.slice(0, 1).toUpperCase())}</span>
      <div><h2>${escapeHtml(name)}</h2><p class="lead flush">${escapeHtml(user?.email || '')}</p></div></div>
    <div class="a-sync ${sync}">${sync === 'error' ? ICONS.close : ICONS.check}<span>${t('accSync_' + sync)}</span></div>
    <p class="note">${t('accSyncNote')}</p>
    <div class="a-actions">
      <button class="btn btn-soft" data-act="save-now">${ICONS.upload}${t('accSaveNow')}</button>
      <button class="btn btn-soft" data-act="signout">${t('accSignOut')}</button>
    </div>`;
}

/** Right half: what an account is for (no invented testimonials). */
function sideHtml() {
  const flags = shuffle(COUNTRIES).slice(0, 12).map((c, i) => `<span style="animation-delay:${i * 60}ms">${flagImage(c.id)}</span>`).join('');
  return `
    <div class="a-side-in">
      <h3>${t('accSideTitle')}</h3>
      <ul class="a-perks">
        <li>${ICONS.repeat}<span>${t('accPerk1')}</span></li>
        <li>${ICONS.book}<span>${t('accPerk2')}</span></li>
        <li>${ICONS.check}<span>${t('accPerk3')}</span></li>
      </ul>
      <div class="a-flags" aria-hidden="true">${flags}</div>
    </div>`;
}

/* =====================================================================
   RENDER
   ===================================================================== */
function render() {
  if (screen === 'success') return renderSuccess();
  redrawDialog(modal(), `
    <div class="dialog a-dialog">
      <button class="d-close" data-act="close" aria-label="${t('close')}">${ICONS.close}</button>
      <div class="a-main"><div class="a-brand"><span class="globe">${ICONS.globe}</span>Atlas<sup>197</sup></div>
        ${Account.isConfigured() ? formHtml() : `<h2>${t('accSoonTitle')}</h2><p class="lead">${t('accSoonLead')}</p>`}</div>
      <aside class="a-side">${sideHtml()}</aside>
    </div>`, screen);
  // focus the first empty field — but never steal the focus from a field being typed in
  const empty = [...modal().querySelectorAll('form input')].find(i => !i.value);
  if (empty && !busy && !modal().contains(document.activeElement)) empty.focus({ preventScroll: true });
}

/** Account created: the check mark draws itself and flags burst out. */
function renderSuccess() {
  const confetti = shuffle(COUNTRIES).slice(0, 18).map((c, i) => {
    // a fan over the check mark (upwards and sideways), so the flags never cover the text
    const angle = Math.PI * (1.05 + (i / 17) * 0.9) + (Math.random() - 0.5) * 0.15;
    const dist = 110 + Math.random() * 80;
    return `<span class="a-burst" style="--x:${Math.cos(angle) * dist * 1.5}px;--y:${Math.sin(angle) * dist}px;--r:${(Math.random() * 120 - 60).toFixed(0)}deg;--d:${(Math.random() * 0.25).toFixed(2)}s">${flagImage(c.id)}</span>`;
  }).join('');
  modal().innerHTML = `
    <div class="dialog a-dialog a-success">
      <div class="a-done">
        <div class="a-check">${confetti}
          <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52"/><path d="M38 62l15 15 30-34"/></svg></div>
        <h2>${t('accCreated', { name: escapeHtml(Account.displayName() || draft.name) })}</h2>
        <p class="lead">${t('accCreatedLead')}</p>
      </div>
    </div>`;
  setTimeout(() => { if (screen === 'success') Modal.close(ID); }, SUCCESS_MS);
}

/* =====================================================================
   ACTIONS
   ===================================================================== */
const errorText = code => t('accErr_' + code) || t('accErr_unknown');

function go(next) {
  screen = next;
  error = '';
  notice = '';
  busy = false;
  render();
}

/** Keep what was typed (passwords exactly as typed, other fields trimmed). */
function readForm(form) {
  for (const input of form.querySelectorAll('input')) draft[input.name] = input.name === 'password' ? input.value : input.value.trim();
}

async function onSubmit(form) {
  readForm(form);
  error = '';
  const kind = form.dataset.form;
  const needsEmail = kind !== 'recovery';
  if (needsEmail && !EMAIL_RE.test(draft.email)) { error = t('accErr_email'); return render(); }
  if ((kind === 'signup' || kind === 'recovery') && !passwordOk(draft.password)) { error = t('accErr_weak_password'); return render(); }
  if (kind === 'signin' && !draft.password) { error = t('accErr_bad_login'); return render(); }
  if (kind === 'signup' && !draft.name) draft.name = draft.email.split('@')[0];

  busy = true;
  render();
  let result;
  if (kind === 'signin') result = await Account.signIn(draft.email, draft.password);
  if (kind === 'signup') result = await Account.signUp(draft.email, draft.password, draft.name);
  if (kind === 'forgot') result = await Account.resetPassword(draft.email);
  if (kind === 'recovery') result = await Account.updatePassword(draft.password);
  busy = false;

  if (!result.ok) { error = errorText(result.code); return render(); }
  draft.password = '';
  if (kind === 'signin') { Modal.close(ID); Toast.show(t('accHello', { name: Account.displayName() })); onSignedIn(); return; }
  if (kind === 'signup') {
    if (result.needsConfirmation) return go('sent');
    screen = 'success';
    onSignedIn();
    return render();
  }
  if (kind === 'forgot') return go('sent');
  if (kind === 'recovery') { Modal.close(ID); Toast.show(t('accPasswordChanged')); }
}

async function onClick(e) {
  if (e.target === modal()) return Modal.close(ID);
  const goTo = e.target.closest('[data-go]')?.dataset.go;
  if (goTo) {
    const form = $('form', modal());
    if (form) readForm(form);
    return go(goTo);
  }
  const action = e.target.closest('[data-act]')?.dataset.act;
  if (action === 'close') Modal.close(ID);
  if (action === 'eye') {
    const input = e.target.closest('.a-input').querySelector('input');
    input.type = input.type === 'password' ? 'text' : 'password';
    e.target.closest('.a-eye').classList.toggle('on', input.type === 'text');
  }
  if (action === 'save-now') { await Account.saveNow(); render(); }
  if (action === 'signout') {
    await Account.signOut();
    Toast.show(t('accSignedOut'));
    go('signin');
  }
}

function onInput(e) {
  if (e.target.name !== 'password') return;
  draft.password = e.target.value;
  for (const rule of PASSWORD_RULES) {
    $(`[data-rule="${rule.id}"]`, modal())?.classList.toggle('ok', rule.test(draft.password));
  }
}

/* =====================================================================
   PUBLIC API
   ===================================================================== */
export const AccountDialog = {
  /** @param {{ onSignedIn: () => void }} callbacks  (refresh the app with the account's progress) */
  init(callbacks) {
    onSignedIn = callbacks.onSignedIn;
    modal().addEventListener('click', onClick);
    modal().addEventListener('submit', e => { e.preventDefault(); onSubmit(e.target); });
    modal().addEventListener('input', onInput);
    Account.onChange(() => { if (Modal.isOpen(ID) && screen === 'account') render(); });
    Account.onRecovery(() => { draft.password = ''; screen = 'recovery'; render(); Modal.open(ID); });
  },
  open(start) {
    screen = Account.user() ? 'account' : start || 'signin';
    error = '';
    notice = '';
    busy = false;
    modal().innerHTML = '';
    render();
    Modal.open(ID);
  },
  refresh() { if (Modal.isOpen(ID) && screen !== 'success') render(); },
};
