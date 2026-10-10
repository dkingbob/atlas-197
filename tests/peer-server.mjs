/**
 * Minimal PeerJS-compatible signaling server for the party tests, so they
 * run without the public PeerJS cloud. It only relays OFFER / ANSWER /
 * CANDIDATE messages between browsers; game data goes peer-to-peer.
 *
 *   GET  /peerjs/id              → a random peer id
 *   WS   /peerjs?id=…&token=…    → OPEN, or ID-TAKEN; relays { type, dst, payload }
 */
import http from 'node:http';
import crypto from 'node:crypto';
import { WebSocketServer } from 'ws';

export function startPeerServer() {
  const clients = new Map(); // id → socket
  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (new URL(req.url, 'http://x').pathname === '/peerjs/id') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end(crypto.randomUUID());
    }
    res.writeHead(404); res.end();
  });
  const wss = new WebSocketServer({ server, path: '/peerjs' });
  wss.on('connection', (socket, req) => {
    const id = new URL(req.url, 'http://x').searchParams.get('id');
    if (!id || clients.has(id)) {
      socket.send(JSON.stringify({ type: 'ID-TAKEN', payload: { msg: 'ID is taken' } }));
      return socket.close();
    }
    clients.set(id, socket);
    socket.send(JSON.stringify({ type: 'OPEN' }));
    socket.on('message', raw => {
      let msg;
      try { msg = JSON.parse(raw); } catch { return; }
      if (!msg.dst) return; // HEARTBEAT
      const target = clients.get(msg.dst);
      if (target) target.send(JSON.stringify({ ...msg, src: id }));
      else if (msg.type === 'OFFER') socket.send(JSON.stringify({ type: 'EXPIRE', src: msg.dst, dst: id }));
    });
    socket.on('close', () => { if (clients.get(id) === socket) clients.delete(id); });
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve({
    port: server.address().port,
    close: () => { wss.clients.forEach(s => s.terminate()); wss.close(); server.close(); },
  })));
}
