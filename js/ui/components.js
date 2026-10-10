/**
 * Tiny shared UI pieces: flag <img>, toast messages and modal dialogs.
 */
import { CONFIG } from '../config.js';
import { $, escapeHtml } from '../core/utils.js';
import { t } from '../i18n/i18n.js';

/** <img> of a flag (whole flag shown, never cropped). */
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
