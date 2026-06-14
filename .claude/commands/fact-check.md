---
description: 'Check docs for facts that contradict the rest of content/docs — one page or the whole corpus. Auto-detects the Workflow engine, falls back to agents. Report only.'
---

Find factual contradictions inside the Neon docs: one page against the rest, or every page
against each other. Extracts cross-referenceable facts (plan limits, prices, defaults, units,
product-name casing), finds where pages disagree, adversarially verifies each disagreement, and
reports confirmed conflicts. It does **not** modify any docs.

**Arguments:**

- A repo-relative page path (e.g. `content/docs/introduction/plans.md`) → **single-page** scope.
- `--all` or a directory → **full-corpus** scope (heavier).
- No argument → ask the user whether they mean a specific page or `--all`.

**Freshness guard (run first):** the check is only meaningful against current docs — a stale tree
surfaces already-fixed "findings."

```bash
git fetch -q origin main && echo "behind origin/main by $(git rev-list --count HEAD..origin/main)"
```

If behind, warn that any findings may already be fixed upstream and suggest checking against
current `main` first. Let the user decide whether to proceed or update.

## Pick the engine (auto-detect)

Check whether the **`Workflow` tool** is available this session (e.g. `ToolSearch` for `Workflow`).

- **Workflow available + single-page** → run the headless engine:
  ```
  Workflow({ scriptPath: ".claude/workflows/docs-fact-conflicts.js", args: "<page path>" })
  ```
  (Add `{ path, semantic: true }` for higher recall — see the script header.)
- **Workflow unavailable, OR full-corpus scope** → run the agent runbook
  `.claude/workflows/docs-fact-conflicts.agents.md`. Follow it stage by stage: extract → search →
  judge (dispatched **by fact id**) → coverage gate → verify → `synth.mjs`.

  > Note: the Workflow engine (`docs-fact-conflicts.js`) is single-page only, so **full-corpus
  > always uses the agent runbook** until a full-corpus workflow script exists. Both engines share
  > `lib/synth.mjs`, so the report shape is identical.

## Report

Summarize what `report.json` / the engine returns: facts checked, candidates, **confirmed**
conflicts (each as `file:line` on both sides, with the suggested correction), and **low-confidence
/ unverified** ones listed separately as "needs human confirmation" (a single-verifier dissent may
be a deliberate exception, not a bug).

**Do not apply edits.** Findings are leads — open each cited `file:line` pair and confirm by hand.
Offer to apply a specific suggested edit only if the user asks, one page at a time.
