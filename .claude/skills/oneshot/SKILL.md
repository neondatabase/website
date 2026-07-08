---
name: oneshot
description: >
  Test whether an AI coding agent can complete a Neon setup/quickstart guide in a
  single shot — no clarifying questions, no leaving the doc page — the way a
  developer would when they drop the guide URL into Cursor or Claude Code while
  building an app. Provisions a real throwaway Neon project, runs an isolated
  test-subject agent against the doc content alone, verifies the result against
  the live database, and produces a report with token cost, friction points tied
  to doc headings, and a scored rubric. Use when asked to test, evaluate, or
  audit whether a Neon guide is agent-friendly or "one-shottable".
---

# OneShot

Live-test whether a Neon setup guide can be completed by an AI agent in one shot.
This is a **publishing-quality gate for agentic UX**: "If a developer pastes this
guide into their coding agent, does it just work?"

Distinct from `/doc-tester`: doc-tester checks whether code samples are
*technically correct*. OneShot checks whether the *whole page*, given to an agent
with nothing else, is *sufficient* — no outside lookups, no guessing, no
questions.

## Usage

```
/oneshot <guide slug | local file path | doc URL | PR URL>
/oneshot --all-with-prompts     # run the full slice of supported guides that have a CopyPrompt file
```

Examples:
```
/oneshot guides/nextjs
/oneshot content/docs/guides/express.md
/oneshot https://neon.tech/docs/guides/python
/oneshot https://github.com/neondatabase/website/pull/1234
```

**Scope note:** this tests *this session's model* (Claude) at one-shotting a
guide, not "any model." Say so plainly in the report — don't imply a
model-agnostic result.

---

## Supported guides (first slice)

Verification logic is guide-specific, so only these five are supported end to
end today. They were chosen for language/framework diversity and because all
five already ship a companion `public/prompts/<slug>-prompt.md` (surfaced via
`<CopyPrompt>` on the page) to compare against.

| Slug | Doc file | Scaffold | Run command | Ground-truth query |
|---|---|---|---|---|
| `guides/nextjs` | `content/docs/guides/nextjs.md` | `npx create-next-app@latest app --js --no-tailwind --no-eslint --app --src-dir=false --import-alias "@/*" --no-git` | `npm run build && npm run dev &` then `curl -s localhost:3000/<route the doc adds>` | Doc's own `SELECT version()` sample — grep for the Postgres version string in the response |
| `guides/python` | `content/docs/guides/python.md` | empty dir (no venv — doc Step 2 covers it) | `python3 create_table.py && python3 read_data.py` per the doc's own filenames | `run_sql` on the table the doc creates |
| `guides/django` | `content/docs/guides/django.md` | empty dir | the doc's own "test the connection" command (`python manage.py <cmd>`) | `run_sql` confirming Django's migrations table or the doc's sample table exists |
| `guides/go` | `content/docs/guides/go.md` | bare `go.mod` (`go mod init oneshot-test`) | `go run main.go` | compare stdout to the doc's documented expected output block, then `run_sql` |
| `guides/express` | `content/docs/guides/express.md` | bare `package.json` + empty `index.js` | `node index.js` | `run_sql` confirming the doc's sample query ran |

To add a guide: add a row here (scaffold command, run command, ground-truth
query) before running `/oneshot` against it. Do not guess at verification for
an unlisted guide — report "not yet supported" instead.

---

## Step 1 — Resolve the guide

| Argument type | Action |
|---|---|
| Slug (e.g. `guides/nextjs`) | Resolve repo root via `git rev-parse --show-toplevel` if cwd is inside a website checkout; else ask once for the local path. Read `content/docs/<slug>.md` |
| Local file path | Read directly |
| Doc URL (`neon.tech/docs/...` or `neon.com/docs/...`) | WebFetch the **published** page — this is what a real developer sees, useful for testing content already live |
| GitHub PR URL | Fetch the diff via the GitHub MCP or `gh pr diff`, find the changed guide file, read it — lets you test a draft before merge |

Check whether the slug is in the **Supported guides** table above. If not,
stop and tell the user which guides are supported today, and offer to add a
row (scaffold + run + verification command) if they can provide it.

Check for a matching `public/prompts/<slug-basename>-prompt.md` in the repo —
record whether it exists (`has_copy_prompt`), since the report compares "doc
alone" against "doc + would this prompt file have been needed."

For `--all-with-prompts`, run this step and every step below once per row in
the Supported guides table, and aggregate into a single report.

---

## Step 2 — Pre-flight

Confirm the Neon MCP tools are available (`mcp__Neon__create_project`,
`mcp__Neon__get_connection_string`, `mcp__Neon__run_sql`,
`mcp__Neon__delete_project`). If not, stop and tell the user the Neon MCP
server needs to be connected — this skill has no credentials of its own; it
only ever acts through whichever Neon account the *runner's own* MCP server
is authenticated as. Provisioning always happens in the runner's own Neon
account, never a shared or hardcoded one.

**Resolve the organization.** `create_project` requires an `org_id` whenever
the account belongs to more than one organization, and fails outright
without it — this is not an edge case, it's the default for any Neon account
that's part of a team. Resolve it once, up front, before asking for the
provisioning confirmation below:

```
mcp__Neon__list_organizations()
```

- **Zero or one organization returned** — use it automatically (or the
  account's personal default if the tool returns none). No need to ask.
- **More than one** — ask the user once which org to use for this whole run:

  > This Neon account belongs to multiple organizations: <list names/ids>.
  > Which one should the throwaway test project(s) go in?

  Cache the answer for every guide in this run (including `--all-with-prompts`
  batches) — never ask per guide.

**Network reachability check.** Before running any guide that requires package
installation (`pip`, `go get`/`go mod`, etc.), check whether the relevant
registry is actually reachable from this host:

```bash
curl -s -m 8 -o /dev/null -w "%{http_code}" https://pypi.org        # Python guides
curl -s -m 8 -o /dev/null -w "%{http_code}" https://proxy.golang.org # Go guides
```

On Databricks-managed machines, direct access to public registries
(`pypi.org`, `proxy.golang.org`, `registry.npmjs.org`) is blocked by policy —
this is intentional, not a fluke, and Databricks says not to work around it.
Approved internal proxies exist for exactly this (see
`reference_corporate_network_proxy` in memory for the full list and how to
verify each is configured):

```bash
pip3 config set global.index-url https://pypi-proxy.cloud.databricks.com/simple
go env -w GOPROXY=https://go-proxy.cloud.databricks.com
npm config set registry https://npm-proxy.cloud.databricks.com/   # usually already set
```

If the relevant proxy isn't configured yet, configure it (these are one-time,
non-destructive config changes) rather than skipping the guide or lowering
its score. Only if a registry is unreachable even through its approved proxy
should you avoid running the subject for that guide — in that case, classify
the run as `INCONCLUSIVE (test-infrastructure: no network access)`, not a doc
failure, and score the rubric from manual doc analysis instead of subject
behavior.

`create_project` and `delete_project` are marked destructive by the MCP
server itself and must never be called without explicit confirmation. Ask
**once**, up front, for the whole run (not once per guide in a batch),
naming the resolved org:

> This will create N throwaway Neon project(s) in **<org name>** — one per
> guide under test (`oneshot-<slug>-<timestamp>`) — and delete all of them at
> the end, once results are captured. Proceed?

Do not continue until confirmed.

---

## Step 3 — Provision

Per guide, passing the `org_id` resolved in Step 2:

```
mcp__Neon__create_project(name="oneshot-<slug>-<epoch>", org_id="<resolved org_id>")
mcp__Neon__get_connection_string(projectId=<id from above>)
```

This mirrors a real developer who already has a Neon project before opening
their editor — guide Step 1 ("create a project via the Neon Console") is pure
UI click-through with no agent-observable failure mode, so it's intentionally
out of scope for the test itself.

Record `project_id` and the connection string for this run. Never print the
connection string to the console summary or commit it anywhere — it's only
used in-memory to build the subject's prompt and gets invalidated by
`delete_project` at cleanup.

---

## Step 4 — Scaffold the starter app

Create `~/oneshot-tests/<slug>-<timestamp>/app/` and scaffold per the
**Supported guides** table above. Rules:

- Do **not** pre-install the driver the guide will tell the subject to
  install.
- Do **not** pre-create `.env` or set any Neon-related env var. Whether the
  subject correctly creates one and reads it per the guide's own instructions
  is itself part of what's scored (see rubric, Step 8).
- Scaffolders should be run non-interactively (pass all required flags so
  nothing prompts).

---

## Step 5 — Invoke the test subject

Use (or create if missing) a restricted agent definition at
`.claude/agents/oneshot-subject.md` in the website repo:

```yaml
---
name: oneshot-subject
description: Isolated coding agent used by the oneshot skill to attempt a one-shot Neon setup from doc content alone.
tools: Read, Write, Edit, Bash, Glob, Grep
---
```

It deliberately excludes `WebSearch`, `WebFetch`, `Agent`, and every
`mcp__Neon__*` tool. The subject must succeed on doc text + local filesystem +
package managers only — no jumping to Neon's live docs for help, no
re-provisioning its own project to dodge a broken connection string. Bash is
unrestricted (a real developer doesn't sandbox their agent's Bash either — if
the subject needs a command the doc never mentioned, that's a genuine
friction finding, not something to suppress by blocking it).

Launch via the Agent tool, `subagent_type: oneshot-subject`, working directory
set to the scaffolded `app/` dir, with this prompt:

```
Here's my Neon connection string: <connection string>

I need to connect this <framework/language> app to it. Here's the setup guide
I'm following:

---
<full doc content from Step 1>
---

Set it up.

If you have a genuine blocking question before you can proceed, ask it as
your only output and stop — do not guess and do not proceed with unstated
assumptions.
```

Run in the foreground (`run_in_background: false`) — the next steps depend on
its result. Capture the `<usage>` block (`subagent_tokens`, `tool_uses`,
`duration_ms`) from the result verbatim; this is the token-cost data for the
report.

---

## Step 6 — A clarifying question is a fail, not a retry

If the subject's entire output is a question (not code, not a completed
setup), do **not** answer it and do **not** resume the subagent. Mark this
run:

```
subject_run: FAIL (needed clarification)
question: "<verbatim question>"
```

Skip Step 7 (verification has nothing to check) and go straight to Step 8
(the rubric can still be scored against the doc text) and Step 9 (cleanup).

Answering and letting it continue would measure "can it finish with
hand-holding" — a different, less useful question than "is the doc one-shot."

---

## Step 7 — Verify against the live branch

Run the command from the **Supported guides** table in the scaffolded
`app/` dir. Then, independently of whatever the app printed, run the
ground-truth query from the same table via `mcp__Neon__run_sql` against the
project from Step 3. This decouples "the app printed success" from "the app
actually talked to Neon" — a subject can hallucinate success output without a
live check.

Classify the result:
- **PASS** — run command succeeded AND `run_sql` confirms real state change
- **FAIL (app error)** — run command failed; capture the error
- **FAIL (silent wrong answer)** — run command "succeeded" but `run_sql`
  shows no matching state (e.g. wrong database, wrong branch, connection
  silently no-op'd)

---

## Step 8 — Score the rubric

Score the **doc text itself** (not the subject's transcript) against these
six criteria, 1–5, each with a one-line evidence quote from the doc:

| Criterion | What it measures |
|---|---|
| `self_containment` | Does the subject need anything outside this page? (e.g. multiple untagged driver options with no stated default forces a guess or a question — this is a real, observed gap in `guides/nextjs.md`'s driver-install step) |
| `step_ordering` | Are steps strictly sequential with no forward references? |
| `placeholder_clarity` | Is it unambiguous what to substitute in every placeholder? |
| `currency` | Any stale flags, deprecated calls, dead links? |
| `code_block_completeness` | Are code blocks runnable as-is, or pseudocode requiring the subject to fill gaps? |
| `failure_mode_guidance` | Does the doc say what to do if a step fails (e.g. connection error, missing env var)? |

If `subject_run` failed at Step 6 or Step 7, use that failure as primary
evidence for the relevant criterion (e.g. a clarifying question about driver
choice is direct evidence against `self_containment`).

If `has_copy_prompt` is true, read `public/prompts/<slug>-prompt.md` and note
in the report which of the gaps found above are already compensated for in
that file — i.e., whether the doc page alone was sufficient, or the subject
would have needed the more detailed prompt file to succeed
(`would_need_prompt_file: true/false`).

---

## Step 9 — Cleanup (always runs)

In order, even if Steps 5–8 failed or errored:

1. Kill any subject-started process (by PID captured at launch in Step 7).
2. `mcp__Neon__delete_project(projectId=<id>)` — cascades branch, endpoints,
   roles, databases. No separate branch cleanup needed. This was already
   confirmed once up front in Step 2 — don't ask again per guide.
3. Remove `~/oneshot-tests/<slug>-<timestamp>/app/`, unless `--keep-artifacts`
   was passed.
4. **Write the report (Step 10) before running steps 1–3**, so a crash during
   cleanup can never lose results.

---

## Step 10 — Write the report

`~/oneshot-tests/<slug>-<timestamp>/results.json` (one entry per guide, phase-keyed):

```json
{
  "run_id": "oneshot-nextjs-1751980800",
  "guide": "guides/nextjs.md",
  "tested_against": "local file",
  "has_copy_prompt": true,
  "prompt_file": "public/prompts/nextjs-prompt.md",
  "phases": {
    "provision":   { "status": "pass", "project_id": "...", "duration_ms": 4200 },
    "scaffold":    { "status": "pass" },
    "subject_run": {
      "status": "fail",
      "reason": "asked_clarifying_question",
      "question": "Which driver should I use — pg, postgres.js, or @neondatabase/serverless?",
      "subagent_tokens": { "input": 18234, "output": 1122 },
      "tool_uses": 14,
      "duration_ms": 96000
    },
    "verify":  { "status": "not_run" },
    "cleanup": { "status": "pass" }
  },
  "cost_estimate_usd": 0.31,
  "friction_log": [
    {
      "heading": "## Create a Next.js project and add dependencies",
      "issue": "Three driver options presented as equal-weight CodeTabs with no stated default or recommendation; agent had to ask which to use."
    }
  ],
  "rubric": {
    "self_containment":        { "score": 2, "evidence": "No default driver stated; forced a question." },
    "step_ordering":           { "score": 5, "evidence": "Steps are strictly sequential." },
    "placeholder_clarity":     { "score": 4, "evidence": "..." },
    "currency":                { "score": 5, "evidence": "..." },
    "code_block_completeness": { "score": 4, "evidence": "..." },
    "failure_mode_guidance":   { "score": 1, "evidence": "No section on connection errors." }
  },
  "would_need_prompt_file": true
}
```

`~/oneshot-tests/<slug>-<timestamp>/README.md`:
- Title, guide tested, date, model used (state plainly this reflects Claude,
  not other agents)
- Results table: `Guide | Verdict | Has CopyPrompt | Tokens | Tool calls | Est. cost`
- Rubric table with evidence quotes
- Friction log grouped by doc heading, each with a concrete rewrite
  suggestion
- Re-run command (`/oneshot guides/nextjs`)

For `--all-with-prompts`, write one `results.json` array and one combined
`README.md` with a summary table across all five guides plus per-guide
detail sections.

---

## Step 11 — Console summary

```
OneShot: guides/nextjs.md

Verdict: FAIL (needed clarification)
  Question: "Which driver should I use — pg, postgres.js, or @neondatabase/serverless?"

Tokens: 18,234 in / 1,122 out (~$0.31)
Tool calls: 14

Rubric: self_containment 2/5, step_ordering 5/5, placeholder_clarity 4/5,
        currency 5/5, code_block_completeness 4/5, failure_mode_guidance 1/5

Has CopyPrompt file: yes (public/prompts/nextjs-prompt.md)
Would the prompt file have closed this gap? yes — it names a default driver

Full report: ~/oneshot-tests/nextjs-1751980800/README.md
```

---

## Key lessons

1. **Subject isolation is the whole point.** If the test-subject agent can
   `WebFetch` or `WebSearch`, you're testing "can Claude find the answer
   somewhere," not "is this doc sufficient." Keep `oneshot-subject`'s tool
   list minimal and never widen it to make a run pass.
2. **A question is a fail, not friction to route around.** Resist the urge to
   answer it and let the subject continue — that measures a different
   (easier) task than one-shotting.
3. **Ground truth lives in the database, not the transcript.** Always verify
   with `run_sql` against the live branch. A subject can print `✅ Connected!`
   without having connected to anything.
4. **`create_project`/`delete_project` are destructive-flagged by the MCP
   server itself** — always get one up-front confirmation for the whole run,
   never skip it, never ask per-guide in a batch (that's just noise).
5. **Databricks blocks public registries by policy — use the approved proxy,
   don't work around it.** `pypi.org`, `proxy.golang.org`, and
   `registry.npmjs.org` are blocked directly on Databricks-managed machines,
   but each has an approved internal proxy
   (`pypi-proxy`/`go-proxy`/`npm-proxy.cloud.databricks.com` — see
   `reference_corporate_network_proxy` in memory). Configure the proxy before
   running a subject for a guide that needs package installation; don't treat
   a blocked-registry failure as a doc problem, and don't skip the guide if
   the fix is just a one-time `pip3 config set` / `go env -w`. Only mark a
   run `INCONCLUSIVE (test-infrastructure)` if the registry is unreachable
   even through its approved proxy.
6. **This skill has no credentials of its own — every run acts as whoever's
   Neon MCP server is connected.** There's nothing to configure to "give the
   skill access" beyond the runner having their own Neon MCP server
   authenticated. The one thing that *will* trip up a first-time runner:
   `create_project` fails outright if their account belongs to more than one
   org and no `org_id` is given — resolve this explicitly in Step 2
   (`list_organizations`, ask once if there's more than one) rather than
   letting a teammate hit a raw API error on their first run.
7. **CopyPrompt files are a live signal, not a workaround.** Guides that
   already ship a `public/prompts/*.md` companion are guides the docs team
   already suspected weren't self-sufficient for agents. Use that file as a
   diff target, not as something to feed the subject — feeding it to the
   subject would test the prompt file, not the doc page.

## Notes

- This skill establishes the first Neon MCP provision/verify/cleanup pattern
  in this environment — mirrors `lakebase-dabs-test`'s deploy → verify →
  cleanup-always shape, with `create_project`/`run_sql`/`delete_project`
  substituted for the Databricks CLI bundle lifecycle.
- Only the five guides in the Supported guides table are verified end to end
  today. Extend the table (scaffold + run + ground-truth query) before
  running against a new guide — don't improvise verification for one that
  isn't listed.
- `results.json` and `README.md` are always kept — they're the point of the
  run. The scaffolded `app/` directory itself is deleted at cleanup by
  default (it's disposable test fixture, not the report); pass
  `--keep-artifacts` to keep it too, e.g. to manually inspect what the
  subject wrote after a failing run.
- Never write a real Neon connection string, password, or API key into this
  file, into `results.json`/`README.md` reports, or into any git-tracked
  location. Connection strings only ever live in-memory for the duration of a
  run and in the throwaway `.env` inside the (gitignored, non-repo)
  `~/oneshot-tests/` scaffold directory, which is deleted at cleanup.
