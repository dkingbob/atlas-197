/**
 * Settings of the game modes that use the declarative forms (see form.js):
 * defaults, fields (a function, so labels follow the language) and the
 * "N countries in play" line. Add a mode here, list it in setup-dialog.js
 * MODES and start it in main.js.
 */
import { t } from '../i18n/i18n.js';
import { ICONS } from './icons.js';
import { DEFAULT_FLAG_SETTINGS, flagPool } from '../game/flag-quiz.js';
import { DEFAULT_FACTS_SETTINGS, factsPoolCountries } from '../game/facts.js';
import { DEFAULT_PIN_SETTINGS, pinPool } from '../game/capital-pin.js';

const copy = (defaults, saved) => {
  const s = { ...defaults, ...(saved || {}) };
  for (const key of ['levels', 'conts']) if (!Array.isArray(s[key]) || !s[key].length) s[key] = defaults[key].slice();
  return s;
};

const poolLine = count => ({ count, message: count ? t('poolCount', { n: count }) : t('poolEmpty') });

export const FORM_MODES = {
  flags: {
    defaults: DEFAULT_FLAG_SETTINGS,
    fields: () => [
      { type: 'cards', key: 'style', className: 'two', options: [
        { val: 'practice', icon: ICONS.infinity, label: t('fqPractice'), desc: t('fqPractice_d') },
        { val: 'game', icon: ICONS.heart(false), label: t('fqGame'), desc: t('fqGame_d') },
      ] },
      { type: 'count', key: 'count', when: s => s.style === 'game' },
      { type: 'switch', key: 'letters', label: t('fqLettersOption') },
      { type: 'levels', key: 'levels' },
      { type: 'conts', key: 'conts' },
    ],
    pool: s => poolLine(flagPool(s).length),
  },
  facts: {
    defaults: DEFAULT_FACTS_SETTINGS,
    fields: () => [
      { type: 'cards', key: 'difficulty', className: 'two', options: [
        { val: 'normal', icon: ICONS.book, label: t('fxNormal'), desc: t('fxNormal_d') },
        { val: 'hard', icon: ICONS.landmark, label: t('fxHard'), desc: t('fxHard_d') },
      ] },
      { type: 'chips', key: 'guess', label: t('fxGuess'), lockedInCapitals: true, options: [
        { val: 'country', label: t('fxGuessCountry') }, { val: 'capital', label: t('fxGuessCapital') },
      ] },
      { type: 'chips', key: 'answer', label: t('answerType'), options: [
        { val: 'type', label: t('a_type') }, { val: 'mc', label: t('a_mc') }, { val: 'click', label: t('fxAnswerMap') },
      ] },
      { type: 'note', text: t('fxMapCountryOnly'), when: s => s.answer === 'click' && s.guess === 'capital' },
      { type: 'count', key: 'count', infinite: true },
      { type: 'levels', key: 'levels' },
      { type: 'conts', key: 'conts' },
    ],
    pool: s => poolLine(factsPoolCountries(s).length),
  },
  pin: {
    defaults: DEFAULT_PIN_SETTINGS,
    fields: () => [
      { type: 'note', text: t('m_pin_d') },
      { type: 'count', key: 'count', infinite: true },
      { type: 'switch', key: 'showCountry', label: t('pinShowCountry') },
      { type: 'levels', key: 'levels' },
      { type: 'conts', key: 'conts' },
    ],
    pool: s => poolLine(pinPool(s).length),
  },
};

/** Settings of a form mode, from what was saved last time. */
export const formSettings = (mode, saved) => copy(FORM_MODES[mode].defaults, saved);
