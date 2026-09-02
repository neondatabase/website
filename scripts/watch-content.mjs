#!/usr/bin/env node
/**
 * Live-reload watcher for docs, blog, and guide content.
 * Watches the markdown content dirs and tells open browser tabs to reload when a
 * content file changes.
 * The browser side is a dev-only inline script in the root layout
 * (src/app/layout.jsx) that connects to this WebSocket server.
 * PORT must match the value in src/app/layout.jsx.
 */
import { watch } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ws from 'ws';

const WebSocketServer = ws.WebSocketServer || ws.Server;

const PORT = 3549;
const DEBOUNCE_MS = 100;
const WATCHED_EXTENSIONS = ['.md', '.mdx'];

// Content areas to watch
const WATCHED_DIRS = ['content/docs', 'content/blog', 'content/guides'];

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const log = (message) => {
  console.log(`[watch:content] ${message}`);
};

const wss = new WebSocketServer({ port: PORT });

wss.on('listening', () => {
  log(`watching ${WATCHED_DIRS.join(', ')} (${WATCHED_EXTENSIONS.join(', ')})`);
  log(`ws://localhost:${PORT} ready, reloads open tabs on save`);
});

wss.on('error', (error) => {
  // Never exit the process. This may be embedded in the dev server (see
  // src/instrumentation.js), and exiting would take the dev server down with it.
  if (error.code === 'EADDRINUSE') {
    log(`port ${PORT} already in use, live reload disabled (another watcher running?).`);
  } else {
    log(`server error: ${error.message}`);
  }
});

const broadcastReload = () => {
  let sent = 0;
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) {
      client.send('reload');
      sent += 1;
    }
  }
  return sent;
};

let timer = null;
const onChange = (filename) => {
  if (!filename || !WATCHED_EXTENSIONS.some((ext) => filename.endsWith(ext))) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    const sent = broadcastReload();
    log(`changed ${filename} → reloaded ${sent} tab(s)`);
  }, DEBOUNCE_MS);
};

for (const dir of WATCHED_DIRS) {
  const absDir = path.join(rootDir, dir);
  try {
    watch(absDir, { recursive: true }, (_event, filename) => onChange(filename));
  } catch (error) {
    log(`could not watch ${dir}: ${error.message}`);
  }
}
