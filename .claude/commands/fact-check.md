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

**First, resolve the target to an ABSOLUTE path** inside the worktree you mean to check
(e.g. `/abs/path/<worktree>/content/docs/introduction/plans.md`). Both engines otherwise search
`content/docs` relative to the session's cwd — silently checking whatever checkout the session sits
in, which is the wrong tree when you mean to vet a different branch. Confirm which branch that
worktree is on (warn if it is stale vs `main`), then pass absolute paths so the corpus root is
unambiguous.

Check whether the **`Workflow` tool** is available this session (e.g. `ToolSearch` for `Workflow`).

- **Workflow available + single-page** → run the headless engine, passing the ABSOLUTE target so it
  roots its search at the right worktree (the script derives `docsRoot` from an absolute target, or
  pass `docsRoot` explicitly):
  ```
  Workflow({ scriptPath: "<abs>/.claude/workflows/docs-fact-conflicts.js",
             args: { path: "<abs>/content/docs/.../page.md" } })
  ```
  Never invoke it with a bare relative path unless the session cwd IS the target worktree — it
  checks the wrong tree silently otherwise. (Add `semantic: true` for higher recall.)
- **Workflow unavailable, OR full-corpus scope** → run the agent runbook
  `.claude/workflows/docs-fact-conflicts.agents.md`. Follow it stage by stage: extract → search →
  judge (dispatched **by fact id**) → coverage gate → verify → `synth.mjs`. Give every agent the
  absolute docs root too (same reason).

  > Note: the Workflow engine (`docs-fact-conflicts.js`) is single-page only, so **full-corpus
  > always uses the agent runbook** until a full-corpus workflow script exists. Both engines share
  > `lib/synth.mjs`, so the report shape is identical.

## Report and resolve

Lead with the honest scope: **this checks consistency, not correctness** — a clean result means the
docs agree with each other, not that they are right. Say so up front so a green run isn't
over-trusted.

Summarize what the engine returns: facts checked, **confirmed** conflicts (each as `file:line` on
both sides), and **low-confidence / unverified** ones flagged separately as "needs human
confirmation" (a single-verifier dissent may be a deliberate exception, not a bug).

Then resolve each confirmed conflict with the human in the loop. Never auto-decide which side is
right, and never mass-edit:

1. **Show both sides; ask which is canonical.** The tool cannot know which value is correct.
   Present both (`file:line` + value) and ask the user to choose the canonical one — ideally
   confirmed against the real source (control plane / pricing / product), not just "looks right."
2. **Propose aligning edits as reviewable diffs, one page at a time.** The user approves each
   before it is applied. Never edit silently; never touch legacy or out-of-scope pages.
3. **Flag scope.** Conflicting pages are often NOT in the user's PR. State which are in-PR vs not,
   and ask whether to fix the others here (this broadens the PR) or flag them for a separate change.
4. **Record the canonical value (only if a canonical-values config is in use).** Offer to record
   the user-confirmed value there as its own reviewable change — it gates CI for everyone, so it
   gets its own review, never a silent in-chat write.

Truth flows one direction: the human (or the real system) asserts the canonical value, and the tool
propagates it into the docs. Never infer the canonical value from the docs themselves.
