/* global d3 */
/**
 * Highlight layer — a second, transparent SVG on top of the map that draws
 * the hover "lift" and the pulsing outline of game targets.
 *
 * Why a separate layer? The map SVG holds ~240 detailed shapes. Changing
 * anything inside it (re-ordering a hovered shape, animating a pulse) makes
 * the browser repaint the whole map, which is what caused the lag. This layer
 * is promoted to its own GPU layer, so hover and pulses only repaint a copy
 * of one shape.
 */

const MARKER_HOVER_R = 7.5; // px
const MARKER_RING_R = 8;    // px

export function createHighlightLayer(container) {
  const svg = d3.select(container).append('svg').attr('class', 'fx-layer').attr('aria-hidden', 'true');
  const root = svg.append('g');
  const targetGroup = root.append('g');
  const hoverGroup = root.append('g');
  const pinGroup = root.append('g');
  let scale = 1;
  let targets = [];
  let pins = [];     // [{ xy, cls }] — capital pin game: your guess and the answer

  /** Pins keep the same size on screen whatever the zoom; a dashed line joins the first two. */
  function drawPins() {
    pinGroup.selectAll('*').remove();
    if (pins.length >= 2) {
      pinGroup.append('line').attr('class', 'fx-pinline')
        .attr('x1', pins[0].xy[0]).attr('y1', pins[0].xy[1]).attr('x2', pins[1].xy[0]).attr('y2', pins[1].xy[1])
        .style('stroke-width', 2.2 / scale).style('stroke-dasharray', `${6 / scale} ${5 / scale}`);
    }
    for (const pin of pins) {
      pinGroup.append('circle').attr('class', `fx-pin ${pin.cls}`)
        .attr('cx', pin.xy[0]).attr('cy', pin.xy[1]).attr('r', 7 / scale).style('stroke-width', 2.5 / scale);
    }
  }

  function liftScale(rec) {
    const [[x0, y0], [x1, y1]] = rec.boxAll;
    const span = Math.max(x1 - x0, y1 - y0) * scale;
    if (span > 400) return 1.012;
    if (span > 150) return 1.025;
    if (span > 40) return 1.05;
    return 1.12;
  }

  /** The copy should look like the original (flag, target colour…) but a bit darker when plain. */
  function copyFill(el, plainFill) {
    const special = el.classList.contains('flagged') || el.classList.contains('target')
      || el.classList.contains('matched') || el.classList.contains('flash-ok') || el.classList.contains('flash-bad');
    return special ? getComputedStyle(el).fill : plainFill;
  }

  function drawTargets() {
    targetGroup.selectAll('*').remove();
    for (const rec of targets) {
      if (rec.pathEl) targetGroup.append('path').attr('class', 'fx-pulse').attr('d', rec.pathEl.getAttribute('d'));
      if (rec.markerEl && rec.markerEl.style.display !== 'none') {
        targetGroup.append('circle').attr('class', 'fx-ring')
          .attr('cx', rec.markerXY[0]).attr('cy', rec.markerXY[1]).attr('r', MARKER_RING_R / scale);
      }
    }
  }

  return {
    /** Keep in sync with the map's zoom transform. */
    setTransform(transform) {
      root.attr('transform', transform);
      scale = transform.k;
      drawTargets();
      drawPins();
    },

    showHover(rec) {
      hoverGroup.selectAll('*').remove();
      if (rec.pathEl) {
        hoverGroup.append('path').attr('class', 'fx-lift')
          .attr('d', rec.pathEl.getAttribute('d'))
          .style('fill', copyFill(rec.pathEl, rec.kind === 'country' ? 'var(--land-hover)' : 'var(--terr-hover)'))
          .style('--lift', liftScale(rec));
      }
      if (rec.markerEl && rec.markerEl.style.display !== 'none') {
        hoverGroup.append('circle').attr('class', 'fx-lift fx-dot')
          .attr('cx', rec.markerXY[0]).attr('cy', rec.markerXY[1]).attr('r', MARKER_HOVER_R / scale)
          .style('fill', copyFill(rec.markerEl, '#fff'))
          .style('--lift', 1);
      }
    },

    clearHover() { hoverGroup.selectAll('*').remove(); },

    /** Records that should pulse (game targets). Pass [] to clear. */
    setTargets(list) { targets = list; drawTargets(); },

    /** Points to mark on the map ([{ xy, cls }]); [] to clear. */
    setPins(list) { pins = list; drawPins(); },

    /** Shapes moved (resize / re-projection): redraw what is shown. */
    redraw() { drawTargets(); hoverGroup.selectAll('*').remove(); },
  };
}
