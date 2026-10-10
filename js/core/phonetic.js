/**
 * Sound-alike key for names, tuned for English AND French spelling habits,
 * so "Filipines", "Djibuti", "Kazakstan", "Swizerland", "Ouzbekistan" or
 * "Kirgistan" reduce to (almost) the same key as the real name.
 *
 *   phoneticKey('Philippines') → 'filipins'
 *   phoneticKey('Filipines')   → 'filipins'
 *
 * It is deliberately simple: answers.js compares these keys with a typo
 * tolerance, and never accepts a name that is closer to ANOTHER country.
 */
const RULES = [
  [/eau/g, 'o'],
  [/tch/g, 'x'], [/sch/g, 'x'], [/sh/g, 'x'], [/ch/g, 'x'],
  [/ph/g, 'f'], [/gh/g, 'g'], [/ck/g, 'k'], [/qu/g, 'k'], [/q/g, 'k'],
  [/dj/g, 'j'], [/dg/g, 'j'], [/g(?=[eiy])/g, 'j'],
  [/c(?=[eiy])/g, 's'], [/c/g, 'k'],
  [/x(?=[aeiouy])/g, 'ks'],
  [/z/g, 's'], [/w/g, 'v'], [/y/g, 'i'],
  [/th/g, 't'], [/h/g, ''],
  [/ou/g, 'u'], [/oo/g, 'u'],
  [/ee/g, 'i'], [/ea/g, 'i'], [/ie/g, 'i'],
  [/ai/g, 'e'], [/ei/g, 'e'], [/ay/g, 'e'], [/ey/g, 'e'],
  [/au/g, 'o'], [/oa/g, 'o'],
  [/kn/g, 'n'],
  [/(.)\1+/g, '$1'],          // double letters → single
  [/(.{3,})e$/g, '$1'],       // silent final e (France / Chine / Ukraine)
  [/(.{3,})s$/g, '$1'],       // silent final s (Pays-Bas, Philippines / Philippine)
];

export function phoneticKey(text) {
  let s = String(text || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z]/g, '');
  for (const [pattern, replacement] of RULES) s = s.replace(pattern, replacement);
  return s;
}
