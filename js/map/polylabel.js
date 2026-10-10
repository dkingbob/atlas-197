/**
 * "Pole of inaccessibility": the point inside a polygon that is farthest from
 * its edges — the best spot for a label (a centroid can fall outside a C-shape).
 * Adapted from Mapbox's polylabel algorithm (planar coordinates).
 *
 * @param {number[][][]} rings  [outerRing, ...holes], each ring = [[x, y], ...]
 * @returns {number[]} [x, y]
 */
export function polylabel(rings, precision) {
  const outer = rings[0];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of outer) {
    if (x < minX) minX = x; if (y < minY) minY = y;
    if (x > maxX) maxX = x; if (y > maxY) maxY = y;
  }
  const width = maxX - minX, height = maxY - minY, size = Math.min(width, height);
  if (!size) return [minX, minY];
  precision = precision || Math.max(size / 60, 1e-4);

  const cell = (x, y, half) => {
    const d = signedDistance(x, y, rings);
    return { x, y, half, d, max: d + half * Math.SQRT2 };
  };

  // Simple priority queue (the number of cells stays small)
  const queue = [];
  const popBest = () => {
    let best = 0;
    for (let i = 1; i < queue.length; i++) if (queue[i].max > queue[best].max) best = i;
    return queue.splice(best, 1)[0];
  };

  let half = size / 2;
  for (let x = minX; x < maxX; x += size) {
    for (let y = minY; y < maxY; y += size) queue.push(cell(x + half, y + half, half));
  }
  let best = cell(minX + width / 2, minY + height / 2, 0);

  for (let guard = 0; queue.length && guard < 4000; guard++) {
    const c = popBest();
    if (c.d > best.d) best = c;
    if (c.max - best.d <= precision) continue;
    half = c.half / 2;
    queue.push(cell(c.x - half, c.y - half, half), cell(c.x + half, c.y - half, half),
      cell(c.x - half, c.y + half, half), cell(c.x + half, c.y + half, half));
  }
  return [best.x, best.y];
}

/** Ray-casting point-in-polygon test (holes supported). */
function isInside(x, y, rings) {
  let inside = false;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
    }
  }
  return inside;
}

/** Distance to the nearest edge; negative when outside. */
function signedDistance(x, y, rings) {
  let min = Infinity;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      min = Math.min(min, segmentDistanceSq(x, y, ring[i], ring[j]));
    }
  }
  return (isInside(x, y, rings) ? 1 : -1) * Math.sqrt(min);
}

function segmentDistanceSq(px, py, a, b) {
  let x = a[0], y = a[1], dx = b[0] - x, dy = b[1] - y;
  if (dx || dy) {
    const t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) { x = b[0]; y = b[1]; } else if (t > 0) { x += dx * t; y += dy * t; }
  }
  dx = px - x; dy = py - y;
  return dx * dx + dy * dy;
}
