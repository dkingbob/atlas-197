/**
 * Small, dependency-free helpers shared across the app.
 */

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

/** Escape text before inserting it into HTML. */
export const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

/** Replace {placeholders} in a string: fill('Hi {name}', { name: 'Ana' }). */
export const fill = (str, vars = {}) => String(str).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

/**
 * Normalise a name for comparison: lower-case, no accents, no punctuation,
 * no leading article, "Saint" ≡ "St".   "Côte d’Ivoire" → "cotedivoire"
 */
export function normalize(s) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[’`´]/g, "'").replace(/&/g, ' and ')
    .replace(/^\s*(the|le|la|les)\s+/, '').replace(/^\s*l'/, '')
    .replace(/\bsaint\b/g, 'st').replace(/\bst\b\.?/g, 'st')
    .replace(/[^a-z0-9]/g, '');
}

/** Edit distance between two strings (used to tolerate small typos). */
export function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

/** Return a shuffled copy (Fisher–Yates). */
export function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export function debounce(fn, ms) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}
