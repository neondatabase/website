// Query the local semantic docs index. Prints JSON results to stdout.
//
// Usage:
//   node query-index.mjs "the query text" [--k 8] [--exclude content/docs/introduction/plans.md] [--db <path>]
//
// Emits: { query, results: [{ file, line, distance, preview }] }

import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'
import * as sqliteVec from 'sqlite-vec'
import { pipeline } from '@xenova/transformers'

const HERE = dirname(fileURLToPath(import.meta.url))
const argv = process.argv.slice(2)
const opt = (name, def) => {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : def
}
const query = argv.find((a) => !a.startsWith('--') && argv[argv.indexOf(a) - 1] !== '--k' && argv[argv.indexOf(a) - 1] !== '--exclude' && argv[argv.indexOf(a) - 1] !== '--db')
const K = parseInt(opt('k', '8'), 10)
const EXCLUDE = opt('exclude', '')
const DB_PATH = resolve(opt('db', join(HERE, '.cache', 'docs-index.db')))

if (!query) {
  console.error('Provide a query string')
  process.exit(1)
}

const db = new DatabaseSync(DB_PATH, { allowExtension: true })
db.loadExtension(sqliteVec.getLoadablePath())

const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
const out = await extractor(query, { pooling: 'mean', normalize: true })
const qvec = Float32Array.from(out.data)
const blob = new Uint8Array(qvec.buffer, qvec.byteOffset, qvec.byteLength)

// over-fetch so we can drop excluded-file rows and still return K
const rows = db
  .prepare(
    `SELECT c.file AS file, c.line AS line, c.text AS text, v.distance AS distance
     FROM vec_chunks v JOIN chunks c ON c.id = v.rowid
     WHERE v.embedding MATCH ? AND k = ? ORDER BY v.distance`
  )
  .all(blob, K * 3)

const results = rows
  .filter((r) => r.file !== EXCLUDE)
  .slice(0, K)
  .map((r) => ({
    file: r.file,
    line: r.line,
    distance: Number(r.distance.toFixed(4)),
    preview: r.text.replace(/\s+/g, ' ').slice(0, 200),
  }))

console.log(JSON.stringify({ query, results }))
db.close()
