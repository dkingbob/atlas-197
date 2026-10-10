/* global d3 */
/**
 * Converts the rough ocean/sea outlines from data/waters.js into GeoJSON
 * that d3 draws and tests correctly.
 */
import { WATERS } from '../data/waters.js';

const MAX_STEP_DEG = 2;

/** @returns {{ water, feature }[]} */
export function buildWaterShapes() {
  return WATERS.map(water => ({
    water,
    feature: {
      type: 'Feature',
      geometry: { type: 'MultiPolygon', coordinates: water.poly.map(ring => [closeAndOrient(densify(ring))]) },
    },
  }));
}

/**
 * d3 joins points with great-circle arcs, which bulge away from parallels over
 * long distances. Adding a point every 2° keeps the edges where they were drawn.
 */
function densify(ring) {
  const out = [];
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % ring.length];
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])) / MAX_STEP_DEG));
    for (let s = 0; s < steps; s++) out.push([a[0] + (b[0] - a[0]) * s / steps, a[1] + (b[1] - a[1]) * s / steps]);
  });
  return out;
}

/** Close the ring and make it clockwise (otherwise d3 fills the rest of the globe). */
function closeAndOrient(ring) {
  const closed = ring.concat([ring[0]]);
  const isInsideOut = d3.geoArea({ type: 'Polygon', coordinates: [closed] }) > 2 * Math.PI;
  return isInsideOut ? closed.reverse() : closed;
}
