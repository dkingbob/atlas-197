/**
 * Spaced repetition logic (Study mode). Runs in plain Node.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SessionQueue, planSession, nextCard, lapsedCard, deckSummary, DAY_MS, BOX_DAYS } from '../js/game/srs.js';

/** Play a whole session; `answer(id, step)` says whether a recall is right. */
function play(queue, answer, maxSteps = 500) {
  const log = [];
  for (let i = 0; i < maxSteps; i++) {
    const choices = queue.active.size + queue.waiting.length;
    const step = queue.next();
    if (!step) return log;
    log.push({ ...step, choices });
    if (step.step === 'recall') queue.report(step.id, answer(step.id, log));
  }
  throw new Error('session never ends');
}

test('every new country is shown first, then recalled twice with a gap', () => {
  const queue = new SessionQueue({ fresh: ['A', 'B', 'C'] });
  const log = play(queue, () => true);
  for (const id of ['A', 'B', 'C']) {
    const steps = log.map((s, i) => ({ ...s, i })).filter(s => s.id === id);
    assert.deepEqual(steps.map(s => s.step), ['present', 'recall', 'recall'], id);
    assert.ok(steps[1].i - steps[0].i >= 2, `${id}: not recalled straight after seeing it`);
  }
  assert.equal(queue.done, 3);
  assert.ok(queue.finished.every(f => f.clean));
});

test('a missed country is shown again and comes back until it is known', () => {
  const misses = { B: 2 };
  const queue = new SessionQueue({ fresh: ['A', 'B'] });
  const log = play(queue, id => {
    if (misses[id]) { misses[id]--; return false; }
    return true;
  });
  const b = log.filter(s => s.id === 'B').map(s => s.step);
  assert.equal(b.filter(s => s === 'present').length, 3, 'shown once + once after each miss');
  assert.equal(b.filter(s => s === 'recall').length, 4, '2 misses + 2 successes');
  assert.equal(queue.finished.find(f => f.id === 'B').clean, false);
});

test('never the same country twice in a row when there is a choice', () => {
  const queue = new SessionQueue({ fresh: ['A', 'B', 'C', 'D', 'E'], reviews: ['R1', 'R2'] });
  const tries = {};
  const log = play(queue, id => (tries[id] = (tries[id] || 0) + 1) > 1); // every country missed once
  for (let i = 1; i < log.length; i++) {
    if (log[i].id === log[i - 1].id) assert.equal(log[i].choices, 1, `repeat at ${i} with other countries left`);
  }
});

test('reviews are asked without presentation; a missed review is relearned', () => {
  const queue = new SessionQueue({ reviews: ['R'] });
  let first = true;
  const log = play(queue, () => { const ok = !first; first = false; return ok; });
  assert.deepEqual(log.map(s => s.step), ['recall', 'present', 'recall', 'recall']);
  assert.deepEqual(queue.finished[0], { id: 'R', kind: 'relearn', clean: false, misses: 1 });
});

test('working set: only a few new countries at a time', () => {
  const queue = new SessionQueue({ fresh: 'ABCDEFGH'.split(''), workingSet: 3 });
  let maxActive = 0;
  for (let step = queue.next(); step; step = queue.next()) {
    maxActive = Math.max(maxActive, queue.learningCount());
    if (step.step === 'recall') queue.report(step.id, true);
  }
  assert.ok(maxActive <= 3);
});

test('Leitner boxes: right → longer gap, wrong → tomorrow', () => {
  const now = 1e12;
  const fresh = nextCard(undefined, { wasReview: false, cleanReview: false, now });
  assert.equal(fresh.box, 1);
  assert.equal(fresh.due, now + DAY_MS);
  const up = nextCard({ box: 3, due: now, lapses: 0 }, { wasReview: true, cleanReview: true, now });
  assert.equal(up.box, 4);
  assert.equal(up.due, now + BOX_DAYS[4] * DAY_MS);
  const down = nextCard({ box: 5, due: now, lapses: 0 }, { wasReview: true, cleanReview: false, now });
  assert.equal(down.box, 1);
  assert.equal(down.lapses, 1);
  assert.equal(lapsedCard({ box: 5 }, now).due, now);
});

test('planning: due reviews first (most overdue first), then new ones in deck order', () => {
  const now = 1e12;
  const cards = { A: { box: 2, due: now - 10 }, B: { box: 1, due: now - 99 }, C: { box: 3, due: now + DAY_MS } };
  const plan = planSession({ deckIds: ['A', 'B', 'C', 'D', 'E', 'F'], cards, now, newLimit: 2 });
  assert.deepEqual(plan, { reviews: ['B', 'A'], fresh: ['D', 'E'] });
  const summary = deckSummary(['A', 'B', 'C', 'D'], { ...cards, C: { box: 5, due: now + 5 } }, now);
  assert.deepEqual(summary, { total: 4, fresh: 1, due: 2, learning: 2, mastered: 1, nextDue: now + 5 });
});
