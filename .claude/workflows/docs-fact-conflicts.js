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
 *   This is a dynamic (scriptPath) workflow, not a registered named one. Run it with:
 *     Workflow({ scriptPath: ".claude/workflows/docs-fact-conflicts.js",
 *                args: "content/docs/introduction/plans.md" })
 *   `args` is the target page path, relative to the repo root. Pass exactly one page.
 *   Agents inherit the repo working directory, so relative content/docs paths resolve directly.
 *
 * OUTPUT
 *   Returns { target, counts:{facts,searched,flagged,confirmed,refuted}, confirmed:[...], refuted:[...] }.
 *   Each confirmed item has the source file:line, the claim, and the conflicting file:line(s).
 *   Treat `confidence: "medium"` findings as leads, not verdicts — always open the cited
 *   file:line pairs and confirm by hand before editing docs (a real bug was found this way:
 *   plans.md said 5,000 branches/project max while ai-agent-integration.md said 1,000).
 *
 * COST / SCALE (measured on plans.md, ~550 lines)
 *   ~52 facts extracted -> ~107 subagents, ~3.4M subagent tokens, ~5 min wall-clock.
 *   Cost scales with the NUMBER OF FACTS on the target page, not corpus size — the per-fact
 *   Search agents (one ripgrep+read pass each) dominate. To cut cost 3-5x on a big page:
 *     - run the Extract and Search stages on a cheaper model (e.g. {model:'haiku'} on those agents);
 *     - or batch ~5 facts per Search agent instead of one-each.
 *   The Search stage is the only exhaustive part and it is bounded per-fact (~40 candidates).
 *
 * KNOWN LIMITATIONS (both inherent to single-page mode — verified, not bugs)
 *   1. Intra-page contradictions are invisible: the candidate search EXCLUDES the target file,
 *      so a page that contradicts itself (e.g. "per branch" on one line, "per project" on
 *      another) is not caught. To catch these, stop excluding the target file in the Search
 *      stage and let the judge compare same-page lines.
 *   2. It only finds conflicts that INVOLVE the target page. A mismatch between two OTHER pages
 *      (e.g. "2 CPUs" vs "2 CUs" in two get-started pages) is unreachable from a single target.
 *      Catching those requires the full-corpus sweep (extract all -> fact index -> all-pairs),
 *      which is a separate, much pricier mode not implemented here.
 *
 * ARCHITECTURE NOTE
 *   Workflow scripts have NO filesystem/shell access, so the "deterministic ripgrep" step runs
 *   inside a lightweight Search agent (which has Grep/Bash) rather than in the script body.
 *   Stages 2-4 are pipelined per fact (no barriers): a fact's judge+verify runs as soon as its
 *   own search completes, so wall-clock is the slowest single fact's chain, not the sum.
 */
export const meta = {
  name: 'docs-fact-conflicts',
  description: 'Check one docs page for facts that conflict with the rest of content/docs',
  whenToUse:
    'Verify a docs page you just edited does not contradict facts (plan limits, prices, defaults, units, product-name casing) stated elsewhere in content/docs. Pass the target page path as args.',
  phases: [
    { title: 'Extract', detail: 'pull cross-referenceable facts from the target page' },
    { title: 'Search', detail: 'ripgrep the corpus for each fact (one retriever per fact)' },
    { title: 'Judge', detail: 'scope-aware conflict decision per fact' },
    { title: 'Verify', detail: 'adversarially refute each flagged conflict' },
  ],
}

// ---- target page -----------------------------------------------------------
const TARGET = typeof args === 'string' ? args.trim() : (args && args.path)
if (!TARGET) {
  throw new Error('Pass the target page path as args, e.g. "content/docs/introduction/plans.md"')
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

const CANDIDATES_SCHEMA = {
  type: 'object',
  required: ['candidates'],
  properties: {
    candidates: {
      type: 'array',
      items: {
        type: 'object',
        required: ['file', 'line', 'snippet'],
        properties: {
          file: { type: 'string' },
          line: { type: 'integer' },
          snippet: { type: 'string', description: 'the matching line plus a little context' },
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

// ---- stages 2-4: pipeline per fact ----------------------------------------
const results = await pipeline(
  facts,

  // stage 2: retrieve candidate mentions from OTHER files
  (fact) =>
    agent(
      `Search the Neon docs corpus for other mentions of this fact so we can check for conflicts.

Fact: ${JSON.stringify(fact)}

Run ripgrep over \`content/docs\` (case-insensitive) for each of the search_terms and for
numeric variants of the claim. Use Grep/Bash. EXCLUDE the source file \`${TARGET}\` itself.
Return every plausibly-related line as a candidate with its file, 1-based line number, and the
matching line plus one line of surrounding context. Cast a wide net — do NOT judge conflicts
here, just retrieve. Cap at ~40 candidates; if more, keep the most relevant.`,
      { label: `search:${fact.id}`, phase: 'Search', schema: CANDIDATES_SCHEMA },
    ).then((r) => ({ fact, candidates: (r && r.candidates) || [] })),

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
