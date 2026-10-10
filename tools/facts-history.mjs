/** Pick history sentences from the Factbook "Background" of each country (EN). */
import fs from 'node:fs'; import path from 'node:path';
const FB = process.argv[2];
const map = JSON.parse(fs.readFileSync('tools/factbook-map.json'));
map.VA = 'europe/vt.json';
const clean = s => s.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, m => ({ '&ldquo;': '"', '&rdquo;': '"', '&rsquo;': "'", '&ndash;': '–', '&mdash;': '—', '&eacute;': 'é', '&amp;': '&', '&nbsp;': ' ' }[m] || '')).replace(/\s+/g, ' ').trim();
const out = {};
let total = 0, chars = 0;
for (const [id, file] of Object.entries(map)) {
  const d = JSON.parse(fs.readFileSync(path.join(FB, file)));
  const bg = clean(d.Introduction?.Background?.text || '');
  const sentences = bg.match(/[^.!?]+(?:\.(?=\s|$)|[!?])/g) || [];
  const picked = sentences.map(s => s.trim())
    .filter(s => s.length >= 50 && s.length <= 240)
    .map(s => ({ s, years: (s.match(/\b(1[0-9]{3}|20[01][0-9]|[1-9][0-9]{2}) ?(?:B\.?C\.?|A\.?D\.?)?\b/g) || []).map(Number).filter(y => y > 0) }))
    .filter(x => x.years.length && Math.max(...x.years) <= 2015 && !/\b(currently|today|now|ongoing|recent)\b/i.test(x.s))
    .slice(0, 6)
    .map(x => x.s);
  out[id] = picked; total += picked.length; chars += picked.join('').length;
}
fs.writeFileSync('tools/history-en.json', JSON.stringify(out, null, 1));
const counts = Object.values(out).map(a => a.length);
console.log('sentences', total, 'chars', chars, 'min', Math.min(...counts), 'zero:', Object.entries(out).filter(([, a]) => a.length < 2).map(([k]) => k).join(' '));
