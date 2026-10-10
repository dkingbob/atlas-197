/**
 * Speed slider — a rounded bar with a point for each speed. The knob follows
 * your finger smoothly while dragging, then glides to the nearest point.
 * Keyboard: ← → (or ↓ ↑), Home, End.
 *
 *   const slider = createSpeedSlider({ values: [0.75, 1, 1.5, 2], value: 1, format: v => v + '×', onChange })
 *   container.appendChild(slider.el)
 *   slider.set(1.5)
 */
export function createSpeedSlider({ values, value, format = v => `${v}×`, label = 'Speed', onChange = () => {} }) {
  let index = Math.max(0, values.indexOf(value));
  const el = document.createElement('div');
  el.className = 'speed-slider';
  el.innerHTML = `
    <div class="ss-track" role="slider" tabindex="0" aria-label="${label}" aria-valuemin="${values[0]}" aria-valuemax="${values.at(-1)}">
      <div class="ss-fill"></div>
      ${values.map((v, i) => `<button type="button" class="ss-stop" data-i="${i}" tabindex="-1" aria-label="${format(v)}" style="left:${pct(i)}%"></button>`).join('')}
      <div class="ss-knob"></div>
    </div>
    <div class="ss-labels">${values.map((v, i) => `<span data-i="${i}" style="left:${pct(i)}%">${format(v)}</span>`).join('')}</div>`;
  const track = el.querySelector('.ss-track');
  const knob = el.querySelector('.ss-knob');
  const fill = el.querySelector('.ss-fill');

  function pct(i) { return values.length > 1 ? (i / (values.length - 1)) * 100 : 0; }

  /** Draw the knob at a position between 0 and 100 (smooth = glide there). */
  function place(percent, smooth) {
    el.classList.toggle('dragging', !smooth);
    knob.style.left = `${percent}%`;
    fill.style.width = `${percent}%`;
  }

  function select(i, { silent = false } = {}) {
    index = Math.max(0, Math.min(values.length - 1, i));
    place(pct(index), true);
    track.setAttribute('aria-valuenow', values[index]);
    track.setAttribute('aria-valuetext', format(values[index]));
    el.querySelectorAll('.ss-labels span').forEach(s => s.classList.toggle('on', Number(s.dataset.i) === index));
    el.querySelectorAll('.ss-stop').forEach(s => s.classList.toggle('passed', Number(s.dataset.i) <= index));
    if (!silent) onChange(values[index]);
  }

  const percentAt = clientX => {
    const r = track.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
  };
  const nearest = percent => Math.round((percent / 100) * (values.length - 1));

  track.addEventListener('pointerdown', e => {
    e.preventDefault();
    track.focus();
    track.setPointerCapture(e.pointerId);
    place(percentAt(e.clientX), false);
    const move = ev => place(percentAt(ev.clientX), false);
    const up = ev => {
      track.removeEventListener('pointermove', move);
      track.removeEventListener('pointerup', up);
      track.removeEventListener('pointercancel', up);
      select(nearest(percentAt(ev.clientX)));
    };
    track.addEventListener('pointermove', move);
    track.addEventListener('pointerup', up);
    track.addEventListener('pointercancel', up);
  });
  el.querySelector('.ss-labels').addEventListener('click', e => {
    const span = e.target.closest('[data-i]');
    if (span) select(Number(span.dataset.i));
  });
  track.addEventListener('keydown', e => {
    const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
    if (step) { e.preventDefault(); select(index + step); }
    if (e.key === 'Home') { e.preventDefault(); select(0); }
    if (e.key === 'End') { e.preventDefault(); select(values.length - 1); }
  });

  select(index, { silent: true });
  return {
    el,
    get value() { return values[index]; },
    set(v) { const i = values.indexOf(v); if (i >= 0) select(i, { silent: true }); },
  };
}
