// Server-only utilities for reading pre-generated API reference data.
// Module-level cache: the scan runs once per Node.js process (build time or dev server start).
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const API_DATA_DIR = resolve(process.cwd(), 'src/data/api-ref');
const TAG_CONFIG_PATH = resolve(process.cwd(), 'scripts/data/tag-config.json');

const STABILITY_RANK = { stable: 0, beta: 1, alpha: 2 };

function stabilitySort(a, b) {
  if (a.deprecated !== b.deprecated) return a.deprecated ? 1 : -1;
  const sa = a.stability == null ? 0 : (STABILITY_RANK[a.stability] ?? 0);
  const sb = b.stability == null ? 0 : (STABILITY_RANK[b.stability] ?? 0);
  if (sa !== sb) return sa - sb;
  return (a.specIndex ?? 0) - (b.specIndex ?? 0);
}

let _cache = null;

export function loadAllTagGroups() {
  if (_cache) return _cache;
  if (!existsSync(API_DATA_DIR)) return [];

  const tagOrder = existsSync(TAG_CONFIG_PATH)
    ? JSON.parse(readFileSync(TAG_CONFIG_PATH, 'utf8')).tags.map((t) => t.slug)
    : [];

  const tagMap = new Map();
  for (const entry of readdirSync(API_DATA_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const tag = entry.name;
    const ops = readdirSync(join(API_DATA_DIR, tag))
      .filter((f) => f.endsWith('.json'))
      .map((f) => JSON.parse(readFileSync(join(API_DATA_DIR, tag, f), 'utf8')))
      .sort(stabilitySort);
    if (ops.length > 0) {
      tagMap.set(tag, { tag, display: ops[0].tagDisplay ?? tag, operations: ops });
    }
  }

  const ordered = tagOrder.filter((t) => tagMap.has(t)).map((t) => tagMap.get(t));
  for (const [t, v] of tagMap) {
    if (!tagOrder.includes(t)) ordered.push(v);
  }

  _cache = ordered;
  return _cache;
}
