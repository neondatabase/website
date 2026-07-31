# docs-fact-conflicts — agent-orchestrated runbook (no-Workflow fallback)

This is the **fallback** for `docs-fact-conflicts.js` for when the Claude Code **Workflow tool is
unavailable**. It runs the same pipeline — extract → search → judge → verify → synth — but the
orchestration is performed by the main Claude session calling the `Agent` tool, instead of a
headless Workflow script.

The `/fact-check` command auto-detects: it uses the Workflow engine when available and falls back
to this runbook when not. You can also follow this runbook directly: "run the docs-fact-conflicts
agent runbook on `content/docs/introduction/plans.md`".

Same findings either way (the prompts below are lifted from `docs-fact-conflicts.js`); the agent
path just has no schema enforcement or built-in dispatcher, so it adds the **Guardrails** below.

## Scopes

- **Single-page** (default): does one page contradict the rest of `content/docs`? Cheap; good for
  a page you just edited. `args`: one repo-relative page path.
- **Full-corpus**: do any pages disagree with each other across the whole set? Heavier. `args`:
  `--all` (or a directory). Extract runs once per page; the corpus of facts is then clustered by
  subject and judged across pages.

## Modes (what counts as a conflict)

- **cross-page** (default): a fact on one page vs the same fact on *other* pages.
- **intra-page**: a page contradicting *itself*. REQUIRED to catch bugs like a page saying
  "0.5 GB per branch" in one line and "per project" in three others. To enable it, **do not
  exclude the target file** from the search, and make extract emit *each* conflicting same-page
  variant as its own fact (do not normalize to the majority value).

## Scratch protocol

All stages hand off via JSON files in a scratch dir (default `/tmp/docs-fact-conflicts/<run>/`).
Subagents WRITE their structured output to a file and return only a short summary — never paste
large JSON back into the main thread. Files:

| File | Written by | Shape |
| --- | --- | --- |
| `meta.json` | orchestrator | `{ target, mode, scope }` |
| `facts.json` | extract | `{ facts: [ {id, subject, qualifier, claim, source_file?, source_line} ] }` |
| `candidates.json` | search | `{ results: [ {fact_id, candidates:[{file,line,snippet}]} ] }` |
| `judge-<group>.json` | judge | `{ judged: [ {fact_id, subject, qualifier, claim, source_file?, source_line, conflict, conflicting_locations:[{file,line,value}], explanation, confidence} ] }` |
| `verify-<group>.json` | verify | `{ verdicts: [ {fact_id, still_conflict, reason} ] }` |
| `report.json` | `synth.mjs` | final result |

## Guardrails

1. **Dispatch judge/verify work BY FACT ID, never by array-index range** (index dispatch can
   silently drop facts). Give each judge agent an explicit list of fact ids.
2. **Run the coverage check every time.**
   - Single-page: `synth.mjs` exits non-zero and lists any fact ids never judged — dispatch a
     judge for exactly those ids and re-run.
   - Full-corpus: the per-fact gate does NOT apply (judges emit conflicts, not a verdict per
     fact); run `synth.mjs` with corpus scope and instead confirm every extracted fact was either
     routed to a bucket or reviewed as single-source.
   Never report a run that failed its coverage check.
3. **Prefix every agent prompt with "This message is your task; do not invoke any skill."** A
   skill-reminder injection can otherwise hijack an agent into doing nothing.
4. **Verify must reuse the judge's anchor `fact_id`** (do not invent a new id), so `synth.mjs`
   links each verdict to its finding.

## Steps

### 1. Setup

Resolve an ABSOLUTE docs root from the target worktree (e.g. `/abs/<worktree>/content/docs`) and
pass absolute paths to every agent — they otherwise grep a cwd-relative `content/docs` and can
silently check the wrong checkout. Create the scratch dir and write `meta.json`
(`{target, mode, scope}`). For full-corpus, list the target pages (`content/docs/**/*.md`, minus
anything intentionally divergent like `legacy-*`).

### 2. Extract — one agent per page

Prompt (per page):

> This message is your task; do not invoke any skill. Read the docs page at `<PAGE>` (use the Read tool). Extract ONLY facts worth cross-referencing
> against other documentation pages — facts that, if stated differently elsewhere, would be a
> contradiction: quantitative limits, prices and included allowances, plan/tier values
> (Free/Launch/Scale), defaults, version numbers, product-name capitalization / unit terminology
> (e.g. "CU" vs "CPU"). DO NOT extract prose, marketing, or anything self-scoped to this page.
> For each fact set `qualifier` to the scope that MUST match for a real conflict (which plan,
> per-branch vs per-project, legacy vs current, the unit). Give 2-5 ripgrep-friendly
> `search_terms`. **For intra-page mode: if the page states the same subject two different ways,
> emit BOTH as separate facts — do not normalize to the majority value.** Write strict JSON
> `{ facts: [...] }` to `<scratch>/facts.json` (full-corpus: append with a `source_file` on each
> fact). Return only the count + a 5-subject sample.

### 3. Search — one batched agent

> For EVERY fact in `<scratch>/facts.json`, find other places in `content/docs` that state the
> same thing (ripgrep, case-insensitive, on `search_terms` and numeric variants of the claim).
> cross-page mode: EXCLUDE the source file. intra-page mode: INCLUDE it. Cap ~15 candidates per
> fact. Write strict JSON `{ results: [...] }` to `<scratch>/candidates.json` (repo-relative file
> paths). Return total candidates + the 5 highest-candidate fact ids.
> _(Optional higher recall: refresh and query the local semantic index in `lib/` — see
> `docs-fact-conflicts.js` SEMANTIC SEARCH notes.)_

### 4. Judge — parallel agents, dispatched BY ID

Split the fact ids into N groups (≈12 per group). For each group, in one message, spawn a judge
agent with its **explicit list of fact ids**:

> This message is your task; do not invoke any skill. Decide whether any candidate CONTRADICTS each assigned fact. A real conflict = the SAME thing
> under the SAME scope given a DIFFERENT value. NOT a conflict: a different plan/tier or product,
> an explicitly legacy/deprecated page, a different unit or per-branch-vs-per-project basis, or
> the same value worded differently. Use the fact's `qualifier`. If unsure, conflict=false. You
> may Read a candidate's file around its line to confirm scope. Write strict JSON
> `{ judged: [...] }` to `<scratch>/judge-<group>.json` (one entry per assigned fact id). Return
> how many you flagged and their subjects.

### 5. Coverage gate + verify

Run `node .claude/workflows/lib/synth.mjs <scratch> --mode <mode>`. If it reports a COVERAGE GAP,
dispatch a judge for the listed ids (BY ID) into `judge-extra.json` and re-run. Once coverage is
clean, for each flagged conflict spawn a skeptical verify agent:

> This message is your task; do not invoke any skill. Try to REFUTE this reported conflict. Open
> the cited files/lines (Read) and check context. Default to still_conflict=FALSE if the scope
> differs (plan/product/unit/basis), one side is a legacy page, the context reconciles them, or
> the citation is inaccurate. Write strict JSON `{ verdicts: [{fact_id, still_conflict, reason}] }`
> to `<scratch>/verify-<group>.json`. Use the SAME `fact_id` the judge anchored the conflict on so
> the verdict links back.

### 6. Report

Re-run `synth.mjs` to fold in verdicts. It writes `report.json` and prints the summary
(confirmed / unverified / refuted). **The sweep stage is report-only.** Resolving a conflict
(confirm which value is canonical → propose aligning edits one page at a time, each reviewed) is a
separate human-in-the-loop step — see "Report and resolve" in `fact-check.md`. Never auto-edit, and
remember this checks consistency, not correctness. A clean result only means something on a fresh
tree, so run against current `origin/main`.

## Full-corpus — known gaps (TODO for a dedicated engine)

Limitations of the full-corpus path to harden in a dedicated engine:

- **Clustering**: the bucket step uses coarse keyword routing, which over-routes (very large
  buckets strain a single judge) and can miss a fact whose wording matches no bucket. Move to a
  controlled `subject_key` vocabulary or semantic clustering, and always review the unrouted set.
- **Page selection**: pick pages by fact *presence* (any page stating ≥1 cross-referenceable
  fact), not by hit-count density — a page with one critical fact ranks low but still matters.
- **Disagreement = must-verify**: when overlapping buckets give contradictory verdicts on the same
  subject, always send it to verify; that is how a borderline scope call gets resolved.
