/**
 * Party (multiplayer) dialog: create or join a room, wait in the lobby,
 * play a Rush round together, see the ranking.
 *
 *   entry → connecting → lobby → (countdown → Rush round) → results → lobby …
 *
 * Networking lives in net/lobby.js; this file only draws and reacts.
 * A link like https://…/?room=ABCDE opens this dialog with the code filled in.
 */
import { CONFIG } from '../config.js';
import { Store } from '../core/store.js';
import { $, escapeHtml } from '../core/utils.js';
import { t } from '../i18n/i18n.js';
import { Lobby, cleanName, cleanRoomCode, isRoomCode } from '../net/lobby.js';
import { Rush, DEFAULT_RUSH_SETTINGS, rushPoolSize } from '../game/rush.js';
import { renderRushSettings, applyRushClick, rushSummary } from './rush-settings.js';
import { ICONS } from './icons.js';
import { Modal, Toast, redrawDialog } from './components.js';

const ID = 'party-modal';
const ERROR_KEYS = { 'not-found': 'roomNotFound', timeout: 'roomNotFound', roomFull: 'roomFull', roomPlaying: 'roomPlaying', hostLeft: 'hostLeft' };

let lobby = null;
let screen = 'entry';      // entry | connecting | lobby | results
let error = '';
let codeInput = '';
let lastResults = null;
let countdownTimer = 0;
let hostDraft = null;      // host's settings being edited

const modal = () => $('#' + ID);
const view = () => lobby?.view;
const savedName = () => Store.pref('partyName') || '';

function open({ code = '' } = {}) {
  if (Rush.isRunning()) return Toast.show(t('gameRunning'));
  if (code) codeInput = cleanRoomCode(code);
  if (!lobby) screen = 'entry';
  modal().innerHTML = ''; // opens fresh, at the top
  render();
  Modal.open(ID);
}

/* =====================================================================
   RENDERING
   ===================================================================== */
function render() {
  const body = {
    entry: entryScreen, connecting: connectingScreen, lobby: lobbyScreen, results: resultsScreen,
  }[screen]();
  redrawDialog(modal(), `<div class="dialog party">
    <button class="d-close" data-act="hide" aria-label="${t('close')}">${ICONS.close}</button>${body}</div>`, screen);
}

function entryScreen() {
  return `
    <h2>${t('partyTitle')}</h2><p class="lead">${t('partyLead')}</p>
    <div class="d-sec"><h3>${t('nickname')}</h3>
      <input class="c-search p-name" maxlength="16" placeholder="${t('nicknamePh')}" value="${escapeHtml(savedName())}"></div>
    <div class="p-entry">
      <div class="p-box">
        <button class="btn btn-primary p-big" data-act="create">${ICONS.users}${t('createRoom')}</button>
      </div>
      <div class="p-or">${t('or')}</div>
      <form class="p-box p-join" data-form="join">
        <input class="c-search p-code" maxlength="5" placeholder="${t('roomCodePh')}" aria-label="${t('roomCode')}"
          value="${escapeHtml(codeInput)}" autocapitalize="characters" autocomplete="off" spellcheck="false">
        <button class="btn btn-soft">${t('joinRoom')}</button>
      </form>
    </div>
    ${error ? `<p class="note bad-note">${escapeHtml(error)}</p>` : ''}
    <p class="note">${t('netNote')}</p>`;
}

const connectingScreen = () => `<div class="p-wait"><div class="spin"></div><b>${t('connecting')}</b></div>`;

function playerSlots(v) {
  const slots = [];
  for (let i = 0; i < CONFIG.PARTY_MAX_PLAYERS; i++) {
    const p = v.players[i];
    slots.push(p ? `
      <li class="p-slot ${p.id === v.myId ? 'me' : ''}"><span class="p-avatar">${escapeHtml(p.name.slice(0, 1).toUpperCase())}</span>
        <b>${escapeHtml(p.name)}</b>${p.isHost ? `<span class="p-tag host">${ICONS.crown}${t('host')}</span>` : ''}${p.id === v.myId ? `<span class="p-tag">${t('you')}</span>` : ''}</li>`
      : `<li class="p-slot empty"><span class="p-avatar"></span><span>${t('emptySlot')}</span></li>`);
  }
  return `<ul class="p-slots">${slots.join('')}</ul>`;
}

function lobbyScreen() {
  const v = view();
  const settings = v.isHost ? hostDraft : v.settings;
  const poolSize = rushPoolSize(settings);
  return `
    <div class="p-room">
      <div><small>${t('roomLabel')}</small><b class="p-code-big">${v.code}</b></div>
      <button class="btn btn-soft" data-act="copy">${ICONS.link}${t('copyLink')}</button>
    </div>
    <div class="d-sec"><h3>${t('players', { n: v.players.length })}</h3>${playerSlots(v)}</div>
    <div class="d-sec"><h3>${t('settings')}</h3>
      ${v.isHost ? renderRushSettings(settings) : `<p class="p-summary">${escapeHtml(rushSummary(settings))}</p>`}</div>
    <div class="d-foot">
      <span class="pool ${poolSize ? '' : 'bad'}">${v.isHost ? (poolSize ? t('poolCount', { n: poolSize }) : t('poolEmpty')) : t('waitingHost')}</span>
      <button class="btn btn-soft" data-act="leave">${t('leave')}</button>
      ${v.isHost ? `<button class="btn btn-primary" data-act="start" ${poolSize ? '' : 'disabled'}>${t('startGame')}</button>` : ''}
    </div>`;
}

const ranked = players => players.slice().sort((a, b) => b.score - a.score || b.found - a.found);

function resultsScreen() {
  const v = view();
  const list = ranked(lastResults || v.players);
  const top = list[0];
  const tie = list.length > 1 && list[1].score === top.score;
  const medals = ['🥇', '🥈', '🥉', '4'];
  return `
    <div class="end-hero">
      <div class="end-badge">${ICONS.trophy}</div>
      <div><h2>${tie ? t('tie') : t('winner', { name: escapeHtml(top.name) })}</h2>
        <p class="lead flush">${t('results')} · ${escapeHtml(rushSummary(v.settings))}</p></div>
    </div>
    <ol class="p-results">${list.map((p, i) => `
      <li class="${p.id === v.myId ? 'me' : ''}"><span class="p-medal">${medals[i]}</span><b>${escapeHtml(p.name)}</b>
        <small>${p.found} ${t('found').toLowerCase()}</small><strong>${p.score}</strong></li>`).join('')}</ol>
    <div class="d-foot">
      <span class="pool">${v.isHost ? '' : t('waitingHost')}</span>
      <button class="btn btn-soft" data-act="leave">${t('leave')}</button>
      ${v.isHost ? `<button class="btn btn-primary" data-act="again">${ICONS.repeat}${t('playAgain')}</button>` : ''}
    </div>`;
}

/* =====================================================================
   LOBBY EVENTS
   ===================================================================== */
const handlers = {
  onChange(v) {
    const backFromResults = screen === 'results' && v.phase === 'lobby';
    if (screen === 'connecting' || backFromResults) screen = 'lobby';
    if (v.isHost && !hostDraft) hostDraft = { ...v.settings };
    if (screen !== 'lobby' || v.phase === 'playing') return;
    render();
    if (backFromResults) Modal.open(ID);
  },
  onStart({ settings, sequence, countdown }) {
    Modal.close(ID);
    runCountdown(countdown, () => {
      if (!lobby) return;
      Rush.start({
        settings, sequence,
        party: {
          onProgress: stats => lobby?.report('progress', stats),
          onFinish: result => lobby?.report('finish', result),
          onQuit: () => leave(),
        },
      });
      Rush.showScoreboard(view().players, view().myId);
    });
  },
  onScores(players) { if (Rush.isRunning()) Rush.showScoreboard(players, view().myId); },
  onResults(players) {
    lastResults = players;
    clearCountdown();
    Rush.stop();
    Rush.showScoreboard(null);
    screen = 'results';
    render();
    Modal.open(ID);
  },
  onClosed(reason) {
    cleanup();
    error = t(ERROR_KEYS[reason] || 'hostLeft');
    screen = 'entry';
    render();
    Modal.open(ID);
  },
};

function runCountdown(seconds, then) {
  const el = $('#countdown');
  let left = seconds;
  const step = () => {
    if (left <= 0) { el.classList.remove('show'); return then(); }
    el.innerHTML = `<b>${left}</b><span>${t('starting', { n: left })}</span>`;
    el.classList.add('show');
    left--;
    countdownTimer = setTimeout(step, 1000);
  };
  clearCountdown();
  step();
}

function clearCountdown() {
  clearTimeout(countdownTimer);
  $('#countdown').classList.remove('show');
}

/* =====================================================================
   ACTIONS
   ===================================================================== */
function readName() {
  const name = cleanName($('.p-name', modal())?.value);
  if (!name) { error = t('needName'); render(); return null; }
  Store.setPref('partyName', name);
  return name;
}

const networkError = err => t(ERROR_KEYS[err.message] || 'connError', { msg: err.message });

async function create() {
  const name = readName();
  if (!name) return;
  const base = Store.pref('partySettings') || {};
  hostDraft = { ...DEFAULT_RUSH_SETTINGS, ...base };
  await connect(l => l.create(name, hostDraft));
}

async function join() {
  const name = readName();
  if (!name) return;
  codeInput = cleanRoomCode($('.p-code', modal())?.value);
  if (!isRoomCode(codeInput)) { error = t('needCode'); return render(); }
  await connect(l => l.join(codeInput, name));
}

async function connect(action) {
  error = '';
  screen = 'connecting';
  render();
  lobby = new Lobby(handlers);
  try {
    await action(lobby);
    history.replaceState(null, '', `?room=${lobby.code}`);
  } catch (err) {
    cleanup();
    error = networkError(err);
    screen = 'entry';
    render();
  }
}

function cleanup() {
  clearCountdown();
  if (Rush.isRunning()) Rush.stop();
  Rush.showScoreboard(null);
  lobby?.close();
  lobby = null;
  hostDraft = null;
  lastResults = null;
  if (location.search.includes('room=')) history.replaceState(null, '', location.pathname);
}

function leave() {
  cleanup();
  screen = 'entry';
  error = '';
  render();
  Modal.close(ID);
}

function copyLink() {
  const url = `${location.origin}${location.pathname}?room=${view().code}`;
  const done = () => Toast.show(t('linkCopied'));
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(url).then(done, () => Toast.show(url, 6000));
  else Toast.show(url, 6000);
}

function onClick(e) {
  if (e.target === modal()) return Modal.close(ID);
  if (screen === 'lobby' && view()?.isHost && applyRushClick(hostDraft, e)) {
    Store.setPref('partySettings', hostDraft);
    lobby.updateSettings(hostDraft);
    return render();
  }
  const action = e.target.closest('[data-act]')?.dataset.act;
  switch (action) {
    case 'hide': return Modal.close(ID);
    case 'create': return create();
    case 'leave': return leave();
    case 'copy': return copyLink();
    case 'start': lobby.updateSettings(hostDraft); return lobby.startGame();
    case 'again': return lobby.backToLobby();
    default: return undefined;
  }
}

function onSubmit(e) {
  if (e.target.dataset.form !== 'join') return;
  e.preventDefault();
  join();
}

export const PartyDialog = {
  init() {
    modal().addEventListener('click', onClick);
    modal().addEventListener('submit', onSubmit);
    window.addEventListener('beforeunload', () => lobby?.close());
  },
  open,
  isInParty: () => Boolean(lobby),
  refresh() { if (Modal.isOpen(ID)) render(); },
  /** Debug/test handle. */
  get lobby() { return lobby; },
};
