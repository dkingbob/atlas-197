/* global Peer */
/**
 * Thin wrapper around PeerJS (WebRTC data channels).
 *
 * Players connect directly to each other; the free PeerJS cloud server is
 * only used to find each other (signaling). No game server is needed, so
 * the app stays a static site on Vercel.
 *
 * The library is loaded on demand, the first time someone opens a party.
 * Tests can point to a local signaling server with window.ATLAS_PEER_OPTIONS.
 */
import { CONFIG } from '../config.js';

const PEER_ID_PREFIX = 'atlas197-';
let loading = null;

/** Load the PeerJS script once. */
export function loadPeerLibrary() {
  if (typeof Peer !== 'undefined') return Promise.resolve();
  loading ||= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = CONFIG.PEERJS_URL;
    script.onload = () => resolve();
    script.onerror = () => { loading = null; reject(new Error('peerjs-load')); };
    document.head.appendChild(script);
  });
  return loading;
}

const peerOptions = () => ({ debug: 0, ...(window.ATLAS_PEER_OPTIONS || {}) });
export const peerIdForRoom = code => PEER_ID_PREFIX + code;

/**
 * Open a peer. `id` = null → random id (players joining a room).
 * Resolves with the open Peer, rejects with the PeerJS error type
 * ('unavailable-id', 'network', 'server-error', …).
 */
export async function openPeer(id = null) {
  await loadPeerLibrary();
  return new Promise((resolve, reject) => {
    const peer = id ? new Peer(id, peerOptions()) : new Peer(peerOptions());
    const fail = err => { peer.destroy(); reject(new Error(err?.type || 'network')); };
    peer.once('open', () => { peer.off('error', fail); resolve(peer); });
    peer.once('error', fail);
  });
}

/**
 * Connect to a room host. Resolves with an open DataConnection.
 * Rejects with 'not-found' if no host has that code.
 */
export function connectToRoom(peer, code, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const conn = peer.connect(peerIdForRoom(code), { reliable: true, serialization: 'json' });
    const timer = setTimeout(() => done(new Error('timeout')), timeoutMs);
    const onPeerError = err => done(new Error(err?.type === 'peer-unavailable' ? 'not-found' : err?.type || 'network'));
    function done(err) {
      clearTimeout(timer);
      peer.off('error', onPeerError);
      if (err) { conn.close(); reject(err); } else resolve(conn);
    }
    peer.on('error', onPeerError);
    conn.once('open', () => done(null));
    conn.once('error', err => done(new Error(err?.type || 'network')));
  });
}
