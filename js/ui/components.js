/**
 * Tiny shared UI pieces: flag <img>, toast messages and modal dialogs.
 */
import { CONFIG } from '../config.js';
import { $, escapeHtml } from '../core/utils.js';
import { Store } from '../core/store.js';
import { t } from '../i18n/i18n.js';

/** <img> of a flag (whole flag shown, never cropped). */
/**
 * End screens: save the score if it is a record for this game + settings,
 * and show "New record!" or "Best: 120".
 */
export function bestScoreHtml(key, label, score) {
  const { previous, isNew } = Store.recordBest(key, score, label);
  if (isNew) return `<div class="best-line new"><span class="best-ico">★</span>${t('bestNew')}${previous !== null ? ` <small>${t('bestBefore', { n: previous })}</small>` : ''}</div>`;
  if (previous === null) return '';
  return `<div class="best-line"><span class="best-ico">★</span>${t('bestScore', { n: previous })}</div>`;
}

/**
 * Replace a dialog's content without jumping: when the same screen is redrawn
 * (an option changed), keep the scroll position and skip the opening animation.
 */
export function redrawDialog(container, html, screen = '') {
  const previous = container.querySelector('.dialog');
  const same = previous && previous.dataset.screen === screen;
  const scrollTop = same ? previous.scrollTop : 0;
  container.innerHTML = html;
  const dialog = container.querySelector('.dialog');
  if (!dialog) return;
  dialog.dataset.screen = screen;
  if (same) { dialog.classList.add('still'); dialog.scrollTop = scrollTop; }
}

export function flagImage(code, className = '', alt = '') {
  if (!code) return '';
  return `<img class="${className}" src="${CONFIG.flagUrl(code)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">`;
}

/** Short message at the top of the screen. */
export const Toast = (() => {
  let timer = 0;
  return {
    show(message, ms = 2300) {
      const el = $('#toast');
      el.textContent = message;
      el.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(() => el.classList.remove('show'), ms);
    },
  };
})();

/** Open/close the modal containers declared in index.html. */
export const Modal = {
  open: id => $('#' + id).classList.add('open'),
  close: id => $('#' + id).classList.remove('open'),
  isOpen: id => $('#' + id).classList.contains('open'),

  /** Simple "are you sure?" dialog. */
  confirm({ title, text, okLabel }, onConfirm) {
    const modal = $('#confirm-modal');
    modal.innerHTML = `
      <div class="dialog narrow">
        <h2>${escapeHtml(title)}</h2>
        <p class="lead">${escapeHtml(text)}</p>
        <div class="d-foot">
          <span class="pool"></span>
          <button class="btn btn-soft" data-act="no">${t('cancel')}</button>
          <button class="btn btn-bad on" data-act="yes">${escapeHtml(okLabel)}</button>
        </div>
      </div>`;
    modal.onclick = e => {
      const button = e.target.closest('[data-act]');
      if (e.target === modal || button?.dataset.act === 'no') Modal.close('confirm-modal');
      if (button?.dataset.act === 'yes') { Modal.close('confirm-modal'); onConfirm(); }
    };
    Modal.open('confirm-modal');
  },
};
