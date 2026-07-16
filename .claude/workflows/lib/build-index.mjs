// Build a local-only semantic index of content/docs into a SQLite + sqlite-vec database.
//
// Usage:
//   node build-index.mjs [--rebuild] [--root <repoRoot>] [--db <path>]
//
// - Embeddings: Xenova/all-MiniLM-L6-v2 (384-d), runs fully offline in Node (no API key).
//   The model (~90MB) downloads once to the transformers.js cache, then is reused.
// - Storage: node:sqlite + sqlite-vec extension. One row per heading-delimited chunk.
// - Incremental: skips files whose sha1 is unchanged since the last build (unless --rebuild).
//
// This file lives under .claude/workflows/ and is intentionally NOT wired into the website
// build. Its deps live in ./package.json here, isolated from the repo root.

import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync, mkdirSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'
import * as sqliteVec from 'sqlite-vec'
import { pipeline } from '@xenova/transformers'

const HERE = dirname(fileURLToPath(import.meta.url))
const argv = process.argv.slice(2)
const flag = (name) => argv.includes(`--${name}`)
const opt = (name, def) => {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : def
}

const REPO_ROOT = resolve(opt('root', resolve(HERE, '../../..')))
const DOCS_DIR = join(REPO_ROOT, 'content', 'docs')
const DB_PATH = resolve(opt('db', join(HERE, '.cache', 'docs-index.db')))
const REBUILD = flag('rebuild')
const DIM = 384

mkdirSync(dirname(DB_PATH), { recursive: true })

// ---- collect markdown files ------------------------------------------------
function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) walk(p, acc)
    else if (entry.isFile() && entry.name.endsWith('.md')) acc.push(p)
  }
  return acc
}

// ---- chunk a file by heading ----------------------------------------------
// Each ## / ### (and the leading preamble) becomes one chunk, tagged with its
// 1-based start line. Long sections are truncated for embedding only (the line
// pointer still lands the reader at the section start).
function chunkFile(absPath) {
  const text = readFileSync(absPath, 'utf8')
  const lines = text.split('\n')
  const chunks = []
  let buf = []
  let startLine = 1
  const flush = (endIdx) => {
    const body = buf.join('\n').trim()
    if (body) chunks.push({ line: startLine, text: body.slice(0, 2000) })
    buf = []
    startLine = endIdx + 2 // next line, 1-based
  }
  lines.forEach((ln, idx) => {
    if (/^#{1,4}\s/.test(ln) && buf.length) flush(idx - 1)
    if (/^#{1,4}\s/.test(ln) && !buf.length) startLine = idx + 1
    buf.push(ln)
  })
  flush(lines.length - 1)
  return chunks
}

// ---- db setup --------------------------------------------------------------
const db = new DatabaseSync(DB_PATH, { allowExtension: true })
db.loadExtension(sqliteVec.getLoadablePath())
db.exec(`
  CREATE TABLE IF NOT EXISTS files (file TEXT PRIMARY KEY, hash TEXT);
  CREATE TABLE IF NOT EXISTS chunks (id INTEGER PRIMARY KEY, file TEXT, line INTEGER, text TEXT);
  CREATE VIRTUAL TABLE IF NOT EXISTS vec_chunks USING vec0(embedding float[${DIM}]);
`)
if (REBUILD) {
  db.exec('DELETE FROM files; DELETE FROM chunks; DELETE FROM vec_chunks;')
}

// ---- embedder --------------------------------------------------------------
process.stderr.write('loading embedding model (first run downloads ~90MB)...\n')
const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
const embed = async (s) => {
  const out = await extractor(s, { pooling: 'mean', normalize: true })
  return Float32Array.from(out.data)
}
const toBlob = (f32) => new Uint8Array(f32.buffer, f32.byteOffset, f32.byteLength)

// ---- index -----------------------------------------------------------------
const files = walk(DOCS_DIR)
const getHash = db.prepare('SELECT hash FROM files WHERE file = ?')
const delChunks = db.prepare('DELETE FROM chunks WHERE file = ?')
const delVec = db.prepare(
  'DELETE FROM vec_chunks WHERE rowid IN (SELECT id FROM chunks WHERE file = ?)'
)
const upFile = db.prepare('INSERT INTO files(file, hash) VALUES(?, ?) ON CONFLICT(file) DO UPDATE SET hash=excluded.hash')
const insChunk = db.prepare('INSERT INTO chunks(file, line, text) VALUES(?, ?, ?)')
const insVec = db.prepare('INSERT INTO vec_chunks(rowid, embedding) VALUES(?, ?)')

let changed = 0
let chunkCount = 0
for (const abs of files) {
  const rel = relative(REPO_ROOT, abs)
  const raw = readFileSync(abs)
  const hash = createHash('sha1').update(raw).digest('hex')
  const prev = getHash.get(rel)
  if (prev && prev.hash === hash && !REBUILD) continue

  delVec.run(rel)
  delChunks.run(rel)
  for (const c of chunkFile(abs)) {
    const vec = await embed(c.text)
    const info = insChunk.run(rel, c.line, c.text)
    insVec.run(BigInt(info.lastInsertRowid), toBlob(vec)) // vec0 rowid must bind as BigInt
    chunkCount++
  }
  upFile.run(rel, hash)
  changed++
  if (changed % 25 === 0) process.stderr.write(`  ${changed} files indexed...\n`)
}

const total = db.prepare('SELECT COUNT(*) n FROM chunks').get().n
console.log(
  JSON.stringify({ db: DB_PATH, filesScanned: files.length, filesChanged: changed, chunksWritten: chunkCount, chunksTotal: total })
)
db.close()
