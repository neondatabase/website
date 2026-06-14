// synth.mjs — deterministic synthesis + coverage gate for docs-fact-conflicts.
//
// WHY THIS EXISTS
//   The check has two front-ends: the Workflow script (docs-fact-conflicts.js) and the
//   agent-orchestrated runbook (docs-fact-conflicts.agents.md, the fallback when the Workflow
//   tool is unavailable). Both stages hand their per-fact results off as JSON files;
//   this script does the final merge for EITHER front-end. Keeping it as one shared, runnable
//   script means the synthesis is identical whichever engine ran, and — critically — it is
//   DETERMINISTIC, not eyeballed.
//
//   It also enforces the COVERAGE GATE: every extracted fact must have been judged. Dispatch
//   judge work BY FACT ID (not by array-index range, which can silently drop facts), then run
//   this script to confirm every fact was covered before trusting the result.
//
// SCOPE-AGNOSTIC
//   Works for single-page (one target) and full-corpus (facts from many pages) runs. Facts and
//   judgements may carry a per-item `source_file`; if absent, the `target` meta/flag is used.
//
// USAGE
//   node synth.mjs <scratchDir> [--target <repo-relative-path>] [--mode intra|cross] [--json-only]
//
// READS (in <scratchDir>)
//   facts.json     { facts: [ { id, subject, qualifier, claim, source_file?, source_line } ... ] }
//   judge-*.json   { judged: [ { fact_id, subject, qualifier, claim, source_file?, source_line,
//                                conflict, conflicting_locations: [ {file,line,value} ],
//                                explanation, confidence } ... ] }
//   verify-*.json  (optional) { verdicts: [ { fact_id, still_conflict, reason } ... ] }
//   meta.json      (optional) { target, mode, scope } — flags override these.
//
// WRITES
//   <scratchDir>/report.json   — structured result.
//   stdout                     — markdown summary (unless --json-only).
//
// EXIT CODES
//   0  coverage complete, report written.
//   2  COVERAGE GAP — some facts were never judged (listed). Dispatch a judge for exactly those
//      ids (BY ID) and re-run. report.json is still written for inspection.
//   1  usage / IO error.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const argv = process.argv.slice(2)
const scratchDir = argv.find((a) => !a.startsWith('--'))
if (!scratchDir) {
  console.error('usage: node synth.mjs <scratchDir> [--target <path>] [--mode intra|cross] [--json-only]')
  process.exit(1)
}
const flag = (name) => {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 ? argv[i + 1] : undefined
}
const jsonOnly = argv.includes('--json-only')

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))
const tryReadJson = (path) => {
  try {
    return existsSync(path) ? readJson(path) : null
  } catch (e) {
    console.error(`! could not parse ${path}: ${e.message}`)
    process.exit(1)
  }
}

const meta = tryReadJson(join(scratchDir, 'meta.json')) || {}
const target = flag('target') || meta.target || '(unknown target)'
const mode = flag('mode') || meta.mode || 'cross'
const scope = meta.scope || (target.includes(',') ? 'corpus' : 'page')

const factsDoc = tryReadJson(join(scratchDir, 'facts.json'))
const facts = (factsDoc && factsDoc.facts) || []

let files
try {
  files = readdirSync(scratchDir)
} catch (e) {
  console.error(`! cannot read scratch dir ${scratchDir}: ${e.message}`)
  process.exit(1)
}

const judged = []
for (const f of files.filter((f) => /^judge-.*\.json$/.test(f)).sort()) {
  const doc = tryReadJson(join(scratchDir, f))
  if (doc && Array.isArray(doc.judged)) judged.push(...doc.judged)
}
const verdicts = new Map()
for (const f of files.filter((f) => /^verify-.*\.json$/.test(f)).sort()) {
  const doc = tryReadJson(join(scratchDir, f))
  if (doc && Array.isArray(doc.verdicts)) {
    for (const v of doc.verdicts) verdicts.set(v.fact_id, v)
  }
}

// ---- coverage gate: every extracted fact judged exactly once ---------------
const judgedIds = judged.map((j) => j.fact_id)
const judgedSet = new Set(judgedIds)
const factIds = facts.map((f) => f.id)
const missing = factIds.filter((id) => !judgedSet.has(id))
const dupes = [...new Set(judgedIds.filter((id, i) => judgedIds.indexOf(id) !== i))]
// Full-corpus runs cluster-judge (judges emit conflicts, not a verdict per fact), so the per-fact
// gate does not apply — coverage there is enforced at the clustering step (every fact routed to a
// bucket or reviewed as single-source). Only gate single-page runs.
const perFactGate = scope !== 'corpus'
const coverageOk = !perFactGate || facts.length === 0 || missing.length === 0

// ---- classify --------------------------------------------------------------
const sourceOf = (j) => `${j.source_file || target}:${j.source_line ?? '?'}`
const isFlagged = (j) => j.conflict === true && Array.isArray(j.conflicting_locations) && j.conflicting_locations.length > 0
const flagged = judged.filter(isFlagged)

const confirmed = []
const refuted = []
const unverified = []
for (const j of flagged) {
  const v = verdicts.get(j.fact_id)
  const item = {
    fact_id: j.fact_id,
    subject: j.subject,
    qualifier: j.qualifier,
    source: sourceOf(j),
    claim: j.claim,
    conflicts_with: j.conflicting_locations,
    explanation: j.explanation,
    confidence: j.confidence,
  }
  if (!v) unverified.push(item)
  else if (v.still_conflict) confirmed.push({ ...item, verify_reason: v.reason })
  else refuted.push({ fact_id: j.fact_id, subject: j.subject, reason: v.reason })
}

const report = {
  target,
  mode,
  scope,
  counts: {
    facts: facts.length,
    judged: judgedSet.size,
    flagged: flagged.length,
    confirmed: confirmed.length,
    refuted: refuted.length,
    unverified: unverified.length,
  },
  coverage: { ok: coverageOk, missing, duplicates: dupes },
  confirmed,
  unverified,
  refuted,
}

writeFileSync(join(scratchDir, 'report.json'), JSON.stringify(report, null, 2))

// ---- output ----------------------------------------------------------------
if (jsonOnly) {
  console.log(JSON.stringify(report, null, 2))
} else {
  const L = []
  L.push(`# docs-fact-conflicts — ${scope === 'corpus' ? 'full-corpus' : 'single-page'} run`)
  L.push(``)
  L.push(`- target: \`${target}\``)
  L.push(`- mode: **${mode}**`)
  L.push(`- facts: ${report.counts.facts}  judged: ${report.counts.judged}  flagged: ${report.counts.flagged}`)
  L.push(`- confirmed: **${report.counts.confirmed}**  refuted: ${report.counts.refuted}  unverified: ${report.counts.unverified}`)
  L.push(``)
  if (scope === 'corpus') {
    L.push(`_full-corpus run: per-fact coverage gate N/A — confirm at the clustering step that every fact was routed to a bucket or reviewed as single-source._`)
    L.push(``)
  }
  if (!coverageOk) {
    L.push(`## ⚠ COVERAGE GAP — do not trust this run yet`)
    L.push(`${missing.length} fact(s) were never judged. Dispatch a judge for these ids (BY ID) and re-run synth:`)
    L.push('```')
    L.push(missing.join('\n'))
    L.push('```')
    L.push(``)
  }
  if (dupes.length) L.push(`_note: ${dupes.length} fact id(s) judged more than once: ${dupes.join(', ')}_\n`)
  const fmtLocs = (locs) => locs.map((c) => `\`${c.file}:${c.line}\` → ${c.value}`).join('; ')
  if (confirmed.length) {
    L.push(`## Confirmed conflicts (${confirmed.length})`)
    for (const c of confirmed) {
      L.push(`- **${c.subject}** (${c.qualifier || 'global'}) — \`${c.source}\` says "${c.claim}"`)
      L.push(`  - conflicts with: ${fmtLocs(c.conflicts_with)}`)
      L.push(`  - ${c.explanation} _(confidence: ${c.confidence})_`)
    }
    L.push(``)
  }
  if (unverified.length) {
    L.push(`## Flagged but NOT yet verified (${unverified.length}) — run the verify stage`)
    for (const c of unverified) {
      L.push(`- **${c.subject}** — \`${c.source}\` "${c.claim}" vs ${fmtLocs(c.conflicts_with)}`)
    }
    L.push(``)
  }
  if (refuted.length) {
    L.push(`## Flagged then refuted (${refuted.length}) — not bugs`)
    for (const r of refuted) L.push(`- ${r.subject}: ${r.reason}`)
    L.push(``)
  }
  if (!confirmed.length && !unverified.length && coverageOk) {
    L.push(`No conflicts found. (A clean result only means something on a fresh tree — run against current \`main\`.)`)
  }
  console.log(L.join('\n'))
}

process.exit(coverageOk ? 0 : 2)
