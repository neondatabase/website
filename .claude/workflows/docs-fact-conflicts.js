/**
 * docs-fact-conflicts — find facts on ONE docs page that contradict the rest of content/docs.
 *
 * WHAT IT DOES
 *   Given a target page, it extracts the cross-referenceable facts on that page (plan limits,
 *   prices, defaults, units, version numbers, product-name casing), searches the rest of
 *   content/docs for other statements of the same fact, and reports only the ones that
 *   genuinely conflict. The judge is SCOPE-AWARE: a different plan/tier, a different product
 *   (e.g. agent plan), an explicitly legacy page, a different unit, or an included-allowance
 *   vs hard-maximum distinction is NOT a conflict. A final adversarial pass tries to refute
 *   each flagged conflict before it is reported, which is what keeps false positives near zero.
 *
 * HOW TO RUN
 *   This is a dynamic (scriptPath) workflow, not a registered named one.
 *   Grep-only (default, no deps):
 *     Workflow({ scriptPath: ".claude/workflows/docs-fact-conflicts.js",
 *                args: "content/docs/introduction/plans.md" })
 *   Grep + local semantic search (higher recall, see SEMANTIC SEARCH below):
 *     Workflow({ scriptPath: ".claude/workflows/docs-fact-conflicts.js",
 *                args: { path: "content/docs/introduction/plans.md", semantic: true } })
 *   `args` is the target page path (string) or { path, semantic }. Pass exactly one page.
 *   Agents inherit the repo working directory, so relative content/docs paths resolve directly.
 *
 * OUTPUT
 *   Returns { target, counts:{facts,searched,flagged,confirmed,refuted}, confirmed:[...], refuted:[...] }.
 *   Each confirmed item has the source file:line, the claim, and the conflicting file:line(s).
 *   Treat findings as LEADS, not verdicts — always open the cited file:line pairs and confirm by
 *   hand before editing docs. Real bugs found this way: plans.md "5,000 branches/project max" vs
 *   ai-agent-integration.md "1,000"; plans.md HIPAA "additional charge" vs hipaa.md "no additional
 *   cost". NOTE: the Extract stage is non-deterministic — different runs surface different facts,
 *   so re-running can find new conflicts. Run a few times for fuller coverage.
 *
 * COST / SCALE (measured on plans.md, ~550 lines, grep-only)
 *   ~52 facts extracted. The Search stage is now ONE batched agent (was ~52 per-fact agents),
 *   so total agents ≈ 1 extract + 1 search + ~52 judge + a few verify ≈ ~55 (down from ~107).
 *   Cost still scales with NUMBER OF FACTS, dominated by the per-fact Judge agents. To cut further:
 *     - run Extract/Search/Judge on a cheaper model (e.g. {model:'haiku'} on those agent calls);
 *     - batch the Judge stage too (groups of facts per agent) — trades some reasoning quality.
 *   Semantic mode adds one incremental index refresh (seconds if docs unchanged) + per-fact vector
 *   queries inside the single search agent; negligible token cost, small wall-clock add.
 *
 * SEMANTIC SEARCH (opt-in, args.semantic = true)
 *   Grep is lexical: it misses conflicting facts phrased with no shared keywords. The semantic
 *   path adds a local vector search to raise recall. It is fully LOCAL — no API keys:
 *     - lib/build-index.mjs embeds every content/docs chunk with Xenova/all-MiniLM-L6-v2
 *       (384-d, runs offline in Node) into a SQLite + sqlite-vec database at lib/.cache/.
 *     - lib/query-index.mjs embeds a query and runs a KNN lookup, returning file:line hits.
 *   The build is INCREMENTAL (sha1 per file), so refreshing before a run is cheap and also picks
 *   up edits to the page you are checking (fixes the staleness trap). Deps live in lib/package.json,
 *   isolated from the website build; lib/node_modules and lib/.cache are gitignored. First build
 *   downloads the ~90MB model once. Semantic is best as a COMPLEMENT to grep: grep nails exact
 *   numbers/units, vectors find paraphrases; the search agent merges both, deduped by file:line.
 *
 * KNOWN LIMITATIONS (inherent to single-page mode — verified, not bugs)
 *   1. Intra-page contradictions are invisible: the search EXCLUDES the target file, so a page
 *      that contradicts itself (e.g. "per branch" vs "per project") is not caught. To catch these,
 *      stop excluding the target file in the Search stage and let the judge compare same-page lines.
 *   2. It only finds conflicts that INVOLVE the target page. A mismatch between two OTHER pages
 *      (e.g. "2 CPUs" vs "2 CUs" in two get-started pages) is unreachable from a single target.
 *      Catching those requires a full-corpus sweep (extract all -> fact index -> all-pairs), a
 *      separate, pricier mode not implemented here.
 *
 * ARCHITECTURE NOTE
 *   Workflow scripts have NO filesystem/shell access, so all file I/O (grep AND the node-based
 *   index build/query) runs inside agents (which have Grep/Bash), not the script body. The script
 *   only orchestrates. Stage 2 is a single batched search agent; stages 3-4 (judge -> verify) are
 *   pipelined per fact (no barriers), so a fact's judge+verify runs as soon as it is ready.
 */
export const meta = {
  name: 'docs-fact-conflicts',
  description: 'Check one docs page for facts that conflict with the rest of content/docs',
  whenToUse:
    'Verify a docs page you just edited does not contradict facts (plan limits, prices, defaults, units, product-name casing) stated elsewhere in content/docs. Pass the target page path as args.',
  phases: [
    { title: 'Extract', detail: 'pull cross-referenceable facts from the target page' },
    { title: 'Search', detail: 'one batched agent greps (and optionally vector-searches) the corpus for every fact' },
    { title: 'Judge', detail: 'scope-aware conflict decision per fact' },
    { title: 'Verify', detail: 'adversarially refute each flagged conflict' },
  ],
}

// ---- args ------------------------------------------------------------------
// args may be:
//   - a plain page path string: "content/docs/..."
//   - an object: { path: "content/docs/...", semantic: true }
//   - a JSON STRING of that object (some callers stringify args), which we parse here.
// semantic=true adds a local sqlite-vec vector search alongside grep (see lib/).
let parsedArgs = args
if (typeof args === 'string') {
  const s = args.trim()
  if (s.startsWith('{')) {
    try {
      parsedArgs = JSON.parse(s)
    } catch {
      parsedArgs = { path: s }
    }
  } else {
    parsedArgs = { path: s }
  }
}
const TARGET = parsedArgs && typeof parsedArgs === 'object' ? parsedArgs.path : undefined
const SEMANTIC = !!(parsedArgs && parsedArgs.semantic)
if (!TARGET) {
  throw new Error(
    'Pass the target page path as args, e.g. "content/docs/introduction/plans.md" or { path, semantic: true }'
  )
}

// ---- schemas ---------------------------------------------------------------
const FACTS_SCHEMA = {
  type: 'object',
  required: ['facts'],
  properties: {
    facts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'subject', 'qualifier', 'claim', 'search_terms', 'source_line'],
        properties: {
          id: { type: 'string', description: 'short kebab id, unique within this page' },
          subject: { type: 'string', description: 'what the fact is about, e.g. "Free plan project limit"' },
          qualifier: {
            type: 'string',
            description:
              'scope that must match for a real conflict: plan name (Free/Launch/Scale), per-branch vs per-project, legacy?, unit, etc. Empty string if globally true.',
          },
          claim: { type: 'string', description: 'the asserted value, e.g. "100 projects"' },
          search_terms: {
            type: 'array',
            items: { type: 'string' },
            description: '2-5 ripgrep-friendly terms/regexes to find OTHER mentions of this subject',
          },
          source_line: { type: 'integer', description: 'line number in the target page' },
        },
      },
    },
  },
}

// One batched search agent returns candidates for every fact at once.
const BATCH_SEARCH_SCHEMA = {
  type: 'object',
  required: ['results'],
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        required: ['fact_id', 'candidates'],
        properties: {
          fact_id: { type: 'string' },
          candidates: {
            type: 'array',
            items: {
              type: 'object',
              required: ['file', 'line', 'snippet'],
              properties: {
                file: { type: 'string' },
                line: { type: 'integer' },
                snippet: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
}

const JUDGE_SCHEMA = {
  type: 'object',
  required: ['conflict', 'conflicting_locations', 'explanation', 'confidence'],
  properties: {
    conflict: { type: 'boolean' },
    conflicting_locations: {
      type: 'array',
      items: {
        type: 'object',
        required: ['file', 'line', 'value'],
        properties: {
          file: { type: 'string' },
          line: { type: 'integer' },
          value: { type: 'string', description: 'the conflicting value found there' },
        },
      },
    },
    explanation: { type: 'string' },
    confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
  },
}

const VERDICT_SCHEMA = {
  type: 'object',
  required: ['still_conflict', 'reason'],
  properties: {
    still_conflict: { type: 'boolean' },
    reason: { type: 'string' },
  },
}

// ---- stage 1: extract ------------------------------------------------------
phase('Extract')
const extracted = await agent(
  `Read the docs page at \`${TARGET}\` (use the Read tool).

Extract ONLY facts that are worth cross-referencing against other documentation pages —
facts that, if stated differently elsewhere, would be a contradiction. These are:
- quantitative limits (project/branch counts, storage, CU-hours, retention windows)
- prices and included allowances
- plan features and tier values (Free/Launch/Scale)
- defaults and configuration values
- version numbers
- product-name capitalization / unit terminology (e.g. "CU" vs "CPU", "Postgres" vs "PostgreSQL")

DO NOT extract: prose, marketing language, worked examples, or anything self-scoped to this
page (e.g. "in this guide we use X").

For each fact set \`qualifier\` to the scope that MUST match for a real conflict to exist
(which plan, per-branch vs per-project, legacy vs current, the unit). This is critical — it
lets a later step avoid false positives. Give 2-5 \`search_terms\` that would find OTHER
mentions of the same subject via ripgrep.`,
  { label: `extract:${TARGET.split('/').pop()}`, phase: 'Extract', schema: FACTS_SCHEMA },
)

const facts = (extracted && extracted.facts) || []
log(`Extracted ${facts.length} cross-referenceable facts from ${TARGET}`)
if (!facts.length) return { target: TARGET, counts: { facts: 0 }, confirmed: [] }

// ---- stage 2: ONE batched search agent ------------------------------------
// Collapsing the former per-fact search agents into a single agent that loops
// over all facts is the big cost win: ~N search agents -> 1. The mechanical
// grep work does not benefit from per-fact LLM parallelism; the reasoning
// (judge) still runs per fact below.
phase('Search')
const semanticInstructions = SEMANTIC
  ? `

SEMANTIC SEARCH (enabled): the corpus also has a local vector index under
\`.claude/workflows/lib\`. Use it to catch conflicting facts that share no keywords with grep.
  1. First refresh the index (incremental — only re-embeds changed files, so it also picks up
     edits to the target page):
       node .claude/workflows/lib/build-index.mjs --root "$(pwd)"
  2. For EACH fact, in addition to grep, run a vector query and merge the hits:
       node .claude/workflows/lib/query-index.mjs "<subject>. <claim>" --exclude "${TARGET}" --k 8
     (run it from the repo root; it prints JSON {results:[{file,line,distance,preview}]}).
  Merge semantic hits with the grep hits, de-duplicating by file:line. Keep a semantic hit only
  if its preview looks topically related to the fact.`
  : ''

const batch = await agent(
  `You are the retrieval step of a docs conflict checker. For EVERY fact below, find other
places in \`content/docs\` that state the same thing, so a later step can check for conflicts.

Facts (JSON array):
${JSON.stringify(facts)}

For each fact: run ripgrep over \`content/docs\` (case-insensitive, use Grep/Bash) for its
search_terms and for numeric variants of its claim. EXCLUDE the source file \`${TARGET}\`.
Collect plausibly-related lines as candidates (file, 1-based line, the matching line plus a
little context). Do NOT judge conflicts here — just retrieve. Cap each fact at ~15 of its most
relevant candidates.${semanticInstructions}

Return one results entry per fact (use the fact's \`id\` as \`fact_id\`), even if its candidates
array is empty.`,
  { label: 'search:all-facts', phase: 'Search', schema: BATCH_SEARCH_SCHEMA }
)

const byId = new Map(((batch && batch.results) || []).map((r) => [r.fact_id, r.candidates || []]))
const searched = facts.map((fact) => ({ fact, candidates: byId.get(fact.id) || [] }))
log(
  `Searched ${searched.length} facts -> ${searched.reduce((n, s) => n + s.candidates.length, 0)} candidate lines${SEMANTIC ? ' (grep + semantic)' : ' (grep)'}`
)

// ---- stages 3-4: pipeline per fact (judge -> verify) ----------------------
const results = await pipeline(
  searched,

  // stage 3: scope-aware judge (skip if nothing to compare)
  (sc) => {
    if (!sc.candidates.length) return { ...sc, judged: { conflict: false, conflicting_locations: [], explanation: 'no candidates', confidence: 'high' } }
    return agent(
      `Decide whether any candidate CONTRADICTS this fact.

Fact (from ${TARGET}, line ${sc.fact.source_line}): ${JSON.stringify(sc.fact)}

Candidates from other pages:
${sc.candidates.map((c) => `- ${c.file}:${c.line}  ${c.snippet}`).join('\n')}

A real conflict means the SAME thing under the SAME scope is given a DIFFERENT value.
NOT a conflict (be strict about this):
- a different plan/tier (Free vs Launch vs Scale), or a different product (e.g. agent plan)
- a page that is explicitly LEGACY/deprecated (e.g. legacy-plans.md) stating old values
- a different unit or a different per-branch vs per-project basis than the fact's qualifier
- the same value worded differently
Use the fact's \`qualifier\` to decide whether scope matches. Only report conflicting_locations
that genuinely clash. If unsure, set conflict=false.`,
      { label: `judge:${sc.fact.id}`, phase: 'Judge', schema: JUDGE_SCHEMA },
    ).then((judged) => ({ ...sc, judged }))
  },

  // stage 4: adversarial verify (only for flagged conflicts)
  (jr) => {
    if (!jr.judged || !jr.judged.conflict || !jr.judged.conflicting_locations.length) return jr
    return agent(
      `You are a skeptical reviewer. Try to REFUTE this reported documentation conflict.

Reported fact (${TARGET}:${jr.fact.source_line}): ${JSON.stringify(jr.fact)}
Reported conflicting locations: ${JSON.stringify(jr.judged.conflicting_locations)}
Judge's explanation: ${jr.judged.explanation}

Open the cited files/lines (Read tool) and check the surrounding context. Default to
still_conflict=FALSE if: the scope differs (different plan/product/unit/basis), one side is a
legacy/deprecated page, the context makes the two statements compatible, or the citation is
inaccurate. Only return still_conflict=TRUE if the same fact under the same scope truly has two
different values in current docs.`,
      { label: `verify:${jr.fact.id}`, phase: 'Verify', schema: VERDICT_SCHEMA },
    ).then((v) => ({ ...jr, verdict: v }))
  },
)

// ---- stage 5: synthesize ---------------------------------------------------
const clean = results.filter(Boolean)
const flagged = clean.filter((r) => r.judged && r.judged.conflict && r.judged.conflicting_locations.length)
const confirmed = flagged
  .filter((r) => r.verdict && r.verdict.still_conflict)
  .map((r) => ({
    fact_id: r.fact.id,
    subject: r.fact.subject,
    qualifier: r.fact.qualifier,
    source: `${TARGET}:${r.fact.source_line}`,
    claim: r.fact.claim,
    conflicts_with: r.judged.conflicting_locations,
    explanation: r.judged.explanation,
    confidence: r.judged.confidence,
  }))

const refuted = flagged
  .filter((r) => r.verdict && !r.verdict.still_conflict)
  .map((r) => ({ fact_id: r.fact.id, subject: r.fact.subject, reason: r.verdict.reason }))

log(`Confirmed ${confirmed.length} conflict(s); ${refuted.length} flagged-then-refuted`)

return {
  target: TARGET,
  counts: {
    facts: facts.length,
    searched: clean.length,
    flagged: flagged.length,
    confirmed: confirmed.length,
    refuted: refuted.length,
  },
  confirmed,
  refuted,
}
