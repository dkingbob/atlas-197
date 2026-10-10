/**
 * Party lobby — up to 4 players, the host runs the room.
 *
 * Topology: star. The host's browser is the referee: every player connects to
 * the host, the host keeps the player list and scores and tells everyone what
 * happens. There is no server of our own.
 *
 * Messages (JSON over a WebRTC data channel)
 *   player → host   hello    { name }
 *                   progress { score, found }
 *                   finish   { score, found, passed }
 *   host → player   welcome  { id }
 *                   lobby    { phase, players, settings }
 *                   start    { settings, sequence, countdown }
 *                   scores   { players }
 *                   results  { players }
 *                   refused  { reason: 'full' | 'playing' }
 *
 * The host is also a player (id 'host'); its own actions go through the same
 * handler as messages coming from the network.
 */
import { CONFIG } from '../config.js';
import { buildRushSequence, DEFAULT_RUSH_SETTINGS } from '../game/rush.js';
import { openPeer, connectToRoom, peerIdForRoom } from './peer-transport.js';

const HOST_ID = 'host';
const CODE_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I / O (look like 1 / 0)
const CODE_LENGTH = 5;
const MAX_NAME_LENGTH = 16;
const RESULTS_GRACE_S = 8;  // results are sent even if a player never reports back

export const randomRoomCode = () => Array.from({ length: CODE_LENGTH },
  () => CODE_LETTERS[Math.floor(Math.random() * CODE_LETTERS.length)]).join('');
export const cleanRoomCode = text => String(text || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, CODE_LENGTH);
export const cleanName = text => String(text || '').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME_LENGTH);
export const isRoomCode = code => code.length === CODE_LENGTH;

/** Public view of a player (what is sent over the network). */
const publicPlayer = p => ({ id: p.id, name: p.name, isHost: p.isHost, score: p.score, found: p.found, done: p.done });

export class Lobby {
  /**
   * @param {object} handlers
   *   onChange(view)          players / settings / phase changed
   *   onStart({ settings, sequence, countdown })
   *   onScores(players)       live scores during a game
   *   onResults(players)      final scores
   *   onClosed(reason)        'hostLeft' | 'roomFull' | 'roomPlaying' | 'connError'
   */
  constructor(handlers) {
    this.on = handlers;
    this.peer = null;
    this.code = '';
    this.myId = null;
    this.isHost = false;
    this.phase = 'lobby';
    this.players = [];           // public players (as last received / computed)
    this.settings = { ...DEFAULT_RUSH_SETTINGS };
    this.closed = false;
    // host only
    this.members = new Map();    // id → { ...player, conn }
    this.deadline = 0;
    // player only
    this.hostConn = null;
  }

  get view() {
    return { code: this.code, myId: this.myId, isHost: this.isHost, phase: this.phase, players: this.players, settings: this.settings };
  }

  /* ===================== HOST ===================== */
  async create(name, settings) {
    this.isHost = true;
    this.myId = HOST_ID;
    this.settings = { ...settings };
    for (let attempt = 0; attempt < 4 && !this.peer; attempt++) {
      const code = randomRoomCode();
      try {
        this.peer = await openPeer(peerIdForRoom(code));
        this.code = code;
      } catch (err) {
        if (err.message !== 'unavailable-id') throw err; // code already used: try another one
      }
    }
    if (!this.peer) throw new Error('unavailable-id');
    this.members.set(HOST_ID, { id: HOST_ID, name: cleanName(name), isHost: true, score: 0, found: 0, done: false, conn: null });
    this.peer.on('connection', conn => this.acceptConnection(conn));
    this.peer.on('disconnected', () => { if (!this.closed) this.peer.reconnect(); });
    this.refreshPlayers();
    this.on.onChange(this.view);
  }

  acceptConnection(conn) {
    conn.on('data', msg => this.handle(conn.peer, msg, conn));
    conn.on('close', () => this.removeMember(conn.peer));
    conn.on('error', () => this.removeMember(conn.peer));
  }

  removeMember(id) {
    if (!this.members.has(id)) return;
    this.members.delete(id);
    this.refreshPlayers();
    this.broadcastLobby();
    if (this.phase === 'playing') { this.broadcast({ type: 'scores', players: this.players }); this.checkAllDone(); }
  }

  /** Host: handle a message from a player (or from the host itself). */
  handle(id, msg, conn = null) {
    if (this.closed || !msg || typeof msg !== 'object') return;
    if (msg.type === 'hello' && conn) {
      if (this.members.size >= CONFIG.PARTY_MAX_PLAYERS) return this.refuse(conn, 'full');
      if (this.phase !== 'lobby') return this.refuse(conn, 'playing');
      this.members.set(id, { id, name: cleanName(msg.name) || '?', isHost: false, score: 0, found: 0, done: false, conn });
      conn.send({ type: 'welcome', id });
      this.refreshPlayers();
      this.broadcastLobby();
      return;
    }
    const member = this.members.get(id);
    if (!member || this.phase !== 'playing') return;
    if (msg.type === 'progress' || msg.type === 'finish') {
      member.score = Math.max(0, Number(msg.score) || 0);
      member.found = Math.max(0, Number(msg.found) || 0);
      if (msg.type === 'finish') member.done = true;
      this.refreshPlayers();
      this.broadcast({ type: 'scores', players: this.players });
      this.checkAllDone();
    }
  }

  refuse(conn, reason) {
    conn.send({ type: 'refused', reason });
    setTimeout(() => conn.close(), 500);
  }

  refreshPlayers() { this.players = [...this.members.values()].map(publicPlayer); }

  /** Send to every player; the host's own copy goes to `local`. */
  broadcast(msg) {
    for (const m of this.members.values()) if (m.conn?.open) m.conn.send(msg);
    this.receive(msg);
  }

  broadcastLobby() { this.broadcast({ type: 'lobby', phase: this.phase, players: this.players, settings: this.settings }); }

  updateSettings(settings) {
    if (!this.isHost || this.phase === 'playing') return;
    this.settings = { ...settings };
    this.broadcastLobby();
  }

  startGame() {
    if (!this.isHost || this.phase === 'playing') return;
    const sequence = buildRushSequence(this.settings);
    if (!sequence.length) return;
    for (const m of this.members.values()) Object.assign(m, { score: 0, found: 0, done: false });
    this.phase = 'playing';
    this.refreshPlayers();
    const countdown = CONFIG.PARTY_COUNTDOWN_S;
    clearTimeout(this.deadline);
    this.deadline = setTimeout(() => this.sendResults(), (countdown + this.settings.duration + RESULTS_GRACE_S) * 1000);
    this.broadcastLobby();
    this.broadcast({ type: 'start', settings: this.settings, sequence, countdown });
  }

  checkAllDone() {
    if (this.phase === 'playing' && [...this.members.values()].every(m => m.done)) this.sendResults();
  }

  sendResults() {
    if (this.phase !== 'playing') return;
    clearTimeout(this.deadline);
    this.phase = 'results';
    this.refreshPlayers();
    this.broadcast({ type: 'results', players: this.players });
    this.broadcastLobby();
  }

  /** Host: everyone back to the waiting room. */
  backToLobby() {
    if (!this.isHost || this.phase !== 'results') return;
    this.phase = 'lobby';
    this.broadcastLobby();
  }

  /* ===================== PLAYER ===================== */
  async join(code, name) {
    this.code = code;
    this.peer = await openPeer(null);
    try {
      this.hostConn = await connectToRoom(this.peer, code);
    } catch (err) {
      this.peer.destroy();
      throw err;
    }
    this.hostConn.on('data', msg => this.receive(msg));
    this.hostConn.on('close', () => this.lost('hostLeft'));
    this.hostConn.on('error', () => this.lost('hostLeft'));
    this.hostConn.send({ type: 'hello', name: cleanName(name) });
  }

  lost(reason) {
    if (this.closed) return;
    this.close();
    this.on.onClosed(reason);
  }

  /* ===================== BOTH ===================== */
  /** A message from the host (players), or the host's own broadcast. */
  receive(msg) {
    if (this.closed || !msg) return;
    switch (msg.type) {
      case 'welcome': this.myId = msg.id; break;
      case 'lobby':
        this.phase = msg.phase;
        this.players = msg.players;
        this.settings = msg.settings;
        this.on.onChange(this.view);
        break;
      case 'start': this.on.onStart({ settings: msg.settings, sequence: msg.sequence, countdown: msg.countdown }); break;
      case 'scores': this.players = msg.players; this.on.onScores(msg.players); break;
      case 'results': this.players = msg.players; this.on.onResults(msg.players); break;
      case 'refused': this.lost(msg.reason === 'full' ? 'roomFull' : 'roomPlaying'); break;
      default: break;
    }
  }

  /** Send my game progress (score so far, or final). */
  report(type, { score, found, passed = 0 }) {
    const msg = { type, score, found, passed };
    if (this.isHost) this.handle(HOST_ID, msg);
    else if (this.hostConn?.open) this.hostConn.send(msg);
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    clearTimeout(this.deadline);
    try { this.peer?.destroy(); } catch { /* already gone */ }
  }
}
