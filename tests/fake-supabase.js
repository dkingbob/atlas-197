/**
 * A tiny stand-in for the Supabase client, used by account.test.mjs (no
 * network). Accounts and progress live in this page's sessionStorage.
 */
(() => {
  const db = () => JSON.parse(sessionStorage.getItem('fake-sb') || '{"users":{},"progress":{}}');
  const write = d => sessionStorage.setItem('fake-sb', JSON.stringify(d));
  let session = null;
  window.supabase = {
    createClient: () => ({
      auth: {
        onAuthStateChange() { return { data: { subscription: { unsubscribe() {} } } }; },
        async getSession() { return { data: { session } }; },
        async signUp({ email, password, options }) {
          const d = db();
          if (d.users[email]) return { data: { user: { identities: [] }, session: null }, error: null };
          const user = { id: 'u-' + Object.keys(d.users).length, email, identities: [{}], user_metadata: options?.data || {} };
          d.users[email] = { password, user };
          write(d);
          session = { user };
          return { data: { user, session }, error: null };
        },
        async signInWithPassword({ email, password }) {
          const u = db().users[email];
          if (!u || u.password !== password) return { data: {}, error: { code: 'invalid_credentials', message: 'Invalid login credentials' } };
          session = { user: u.user };
          return { data: { user: u.user, session }, error: null };
        },
        async signOut() { session = null; return { error: null }; },
        async resetPasswordForEmail() { return { error: null }; },
        async updateUser() { return { error: null }; },
      },
      from: () => ({
        select: () => ({ eq: (_, id) => ({ maybeSingle: async () => ({ data: db().progress[id] ? { data: db().progress[id] } : null, error: null }) }) }),
        async upsert(row) { const d = db(); d.progress[row.user_id] = row.data; write(d); return { error: null }; },
      }),
    }),
  };
  window.ATLAS_ACCOUNT_OPTIONS = { url: 'https://fake.supabase.co', key: 'fake-anon-key' };
})();
