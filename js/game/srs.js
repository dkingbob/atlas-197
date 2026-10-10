/**
 * Spaced repetition — the memory science behind Study mode. Pure logic, no DOM.
 *
 * Between days (Leitner boxes)
 *   Every studied country has a card { box, due, lapses }. Each correct review
 *   moves it up a box and the gap before the next review doubles:
 *   box 1 → 1 day, 2 → 2 days, 3 → 4 days … 7 → 64 days.
 *   A miss sends it back to box 1 (see it again tomorrow).
 *
 * Within a session (SessionQueue)
 *   - a few new countries at a time (working set), mixed with reviews (interleaving)
 *   - each new country must be recalled correctly TWICE, a few questions apart
 *     (expanding gaps), before it leaves the session
 *   - a miss shows the country again (re-study) and brings it back soon
 */

export const DAY_MS = 24 * 60 * 60 * 1000;
/** Days until the next review, by box. */
export const BOX_DAYS = [0, 1, 2, 4, 8, 16, 32, 64];
export const MAX_BOX = BOX_DAYS.length - 1;
/** A card in this box or above counts as "mastered". */
export const MASTERED_BOX = 4;

/** Questions to wait before asking a country again: after a miss, after 1st and 2nd success. */
const GAP_AFTER_MISS = 2;
const PRESENT_TO_RECALL_GAP = 2;
const GAPS_AFTER_SUCCESS = [0, 3, 6];
const RECALLS_NEEDED = { fresh: 2, review: 1, relearn: 2 };

/* =====================================================================
   CARDS (between days)
   ===================================================================== */
export const isDue = (card, now) => Boolean(card) && card.box > 0 && card.due <= now;

/** New card after a finished session item. `cleanReview` = review answered right first time. */
export function nextCard(card, { wasReview, cleanReview, now }) {
  const box = wasReview && cleanReview ? Math.min(MAX_BOX, (card?.box || 1) + 1) : 1;
  return { box, due: now + BOX_DAYS[box] * DAY_MS, lapses: (card?.lapses || 0) + (wasReview && !cleanReview ? 1 : 0), last: now };
}

/** Card right after a review is missed: back to box 1, due now. */
export const lapsedCard = (card, now) => ({ box: 1, due: now, lapses: (card?.lapses || 0) + 1, last: now });

/**
 * What a session will contain.
 * @param deckIds   countries in the chosen deck, easiest first
 * @param cards     { [id]: card } saved cards
 * @param reviewAll true = review everything already studied, due or not
 * @returns { reviews: ids due (most overdue first), fresh: ids never studied (up to newLimit) }
 */
export function planSession({ deckIds, cards, now, newLimit, reviewLimit = 50, reviewAll = false }) {
  // reviewAll: every country already studied (the "recap quiz"), not only those due today
  const reviews = deckIds.filter(id => (reviewAll ? Boolean(cards[id]) : isDue(cards[id], now)))
    .sort((a, b) => cards[a].due - cards[b].due).slice(0, reviewLimit);
  const fresh = deckIds.filter(id => !cards[id]).slice(0, newLimit);
  return { reviews, fresh };
}

/** Deck overview for the setup screen. */
export function deckSummary(deckIds, cards, now) {
  let fresh = 0, due = 0, learning = 0, mastered = 0, nextDue = Infinity;
  for (const id of deckIds) {
    const card = cards[id];
    if (!card) { fresh++; continue; }
    if (isDue(card, now)) due++;
    else nextDue = Math.min(nextDue, card.due);
    if (card.box >= MASTERED_BOX) mastered++; else learning++;
  }
  return { total: deckIds.length, fresh, due, learning, mastered, nextDue: nextDue === Infinity ? null : nextDue };
}

/* =====================================================================
   SESSION QUEUE (within a session)
   ===================================================================== */
export class SessionQueue {
  /**
   * @param reviews     ids due for review (asked straight away, no presentation)
   * @param fresh       new ids (presented first, then recalled)
   * @param workingSet  how many new countries are being learned at the same time
   * @param reviewsFirst  finish every review before the first new country (recap quiz)
   */
  constructor({ reviews = [], fresh = [], workingSet = 4, reviewsFirst = false }) {
    this.reviewsFirst = reviewsFirst;
    this.turn = 0;
    this.workingSet = workingSet;
    this.waiting = fresh.slice();            // new countries not introduced yet
    this.active = new Map();                 // id → item
    this.finished = [];                      // [{ id, kind, clean, misses }]
    this.lastId = null;
    this.total = reviews.length + fresh.length;
    // reviews are spread out so new countries can be slipped in between them
    reviews.forEach((id, i) => this.active.set(id, this.item(id, 'review', reviewsFirst ? 1 + i : 1 + i * 2)));
  }

  item(id, kind, dueAt) {
    return { id, kind, dueAt, streak: 0, needed: RECALLS_NEEDED[kind], misses: 0, present: kind !== 'review' };
  }

  get done() { return this.finished.length; }
  get remaining() { return this.total - this.finished.length; }
  learningCount() { return [...this.active.values()].filter(it => it.kind !== 'review').length; }

  /**
   * The next step, or null when the session is over.
   * @returns {{ id, step: 'present' | 'recall', kind: 'fresh'|'review'|'relearn', streak }}
   */
  next() {
    if (!this.active.size && !this.waiting.length) return null;
    this.turn++;
    let item = this.pick(it => it.dueAt <= this.turn);
    const reviewsLeft = this.reviewsFirst && [...this.active.values()].some(it => it.kind !== 'fresh');
    if (!item && this.waiting.length && !reviewsLeft && this.learningCount() < this.workingSet) item = this.introduce();
    if (!item) item = this.pick(() => true); // nothing is due yet: take the closest one
    this.lastId = item.id;
    const step = item.present ? 'present' : 'recall';
    if (item.present) {
      item.present = false;
      item.dueAt = this.turn + PRESENT_TO_RECALL_GAP; // test it after something else, not straight away
    }
    return { id: item.id, step, kind: item.kind, streak: item.streak };
  }

  /** Lowest dueAt among matching items, avoiding the same country twice in a row. */
  pick(filter) {
    const list = [...this.active.values()].filter(filter).sort((a, b) => a.dueAt - b.dueAt);
    return list.find(it => it.id !== this.lastId) || list[0] || null;
  }

  introduce() {
    const id = this.waiting.shift();
    const item = this.item(id, 'fresh', this.turn);
    this.active.set(id, item);
    return item;
  }

  /** After a full recall (name + place …): right first time or not. Returns the finished entry, if any. */
  report(id, correct) {
    const item = this.active.get(id);
    if (!item) return null;
    if (correct) {
      item.streak++;
      if (item.streak >= item.needed) {
        this.active.delete(id);
        const entry = { id, kind: item.kind, clean: item.misses === 0, misses: item.misses };
        this.finished.push(entry);
        return entry;
      }
      item.dueAt = this.turn + GAPS_AFTER_SUCCESS[Math.min(item.streak, GAPS_AFTER_SUCCESS.length - 1)];
    } else {
      item.misses++;
      item.streak = 0;
      if (item.kind === 'review') { item.kind = 'relearn'; item.needed = RECALLS_NEEDED.relearn; }
      item.present = true; // show it again before the next try
      item.dueAt = this.turn + GAP_AFTER_MISS;
    }
    return null;
  }
}
