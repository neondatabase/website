---
description: 'Generate a weekly documentation PR report from monitored Neon repositories. Default time range: since last Friday 00:00 UTC. Also supports PR deep dives and follow-on documentation or changelog workflows.'
---

# Create PR Report

Generate a report of merged PRs across monitored Neon repositories to identify what needs documentation updates. Default time range: since last Friday 00:00 UTC.

Run all commands from the **repository root** (website repo).

## Time range

Parse from the user's request. Default if nothing is specified: since last Friday 00:00 UTC. All times use UTC.

Examples:
- "create pr report" → since last Friday
- "for last 24 hours" / "for last 3 days"
- "since 2026-01-20" / "from January 20 to January 23"

## Workflow

### 1. Parse the time range

Use the user's request or default to last Friday 00:00 UTC.

### 2. Run the dependency checker

```bash
./scripts/check-docs-report-deps.sh
```

If it fails (non-zero exit):
- Show the output to the user.
- Summarize in plain language what is missing (e.g. `jq`, `git`, config file, repos not cloned).
- Ask: "You don't have all the requirements yet. [Summary.] I can run `./scripts/setup-repos.sh --yes` to clone missing repos. For `jq` or `git`, install them first (e.g. `brew install jq`), then run `/create-pr-report` again. Do you want to proceed with setup? (yes/no)"
- If the user says yes: run `./scripts/setup-repos.sh --yes`, then re-run the checker.
- Do not run the report script until the checker passes.

### 3. Run the report

```bash
./scripts/generate-docs-pr-report.sh
# Or with a time range:
./scripts/generate-docs-pr-report.sh --since="24 hours ago"
./scripts/generate-docs-pr-report.sh --since="2026-01-20"
```

Report the summary, file location, and open the report for the user.

**Output location:** `~/docs-reviews/docs-pr-report-[timestamp].md`

---

## PR deep dive

When the user wants to investigate a specific PR: "review PR #[number]", "deep dive on PR #[number]", "tell me more about PR #[number]", or similar.

### 1. Identify the repository

Check the most recent report in `~/docs-reviews/` (the latest `docs-pr-report-*.md`). Search for the PR number to find which repo section it appears in. Use that repo. If not found, or if the user specifies a repo, use that. Common repos: `neon-cloud` (databricks-eng), `hadron` (databricks-eng), `neondatabase/website`. If still unclear, ask.

### 2. Check GitHub CLI

Run `gh auth status`. If not installed or not authenticated, tell the user to run `brew install gh` (if needed) and `gh auth login`, then retry.

### 3. Fetch PR details

```bash
gh pr view [PR-number] --repo [org]/[repo] --json title,body,author,labels,files
gh pr diff [PR-number] --repo [org]/[repo]
```

### 4. Present structured analysis

- Summary
- Changes overview
- Key technical changes
- Documentation impact assessment
- Suggested changelog entry
- Questions to consider

### 5. Present follow-on menu

After the analysis:

1. Create documentation PR
2. Add changelog entry
3. Both
4. Nothing (analysis only)

Wait for the user's response before proceeding.

---

## Documentation PR workflow (option 1 or 3)

1. Identify affected docs under `content/docs/` (ai/, auth/, guides/, manage/, introduction/, reference/).
2. Present a Documentation Update Plan (files to modify or create, navigation updates). Wait for approval.
3. Create branch `docs/pr-{PR_NUMBER}-{short-slug}`.
4. Make changes, run `npm run lint:md`.
5. Create PR: `gh pr create --repo neondatabase/website` with title and body linking to the original PR.

---

## Changelog entry workflow (option 2 or 3)

1. Classify the change: major feature (H2 section at top of changelog) or minor (bullet inside a `<details>` block). Ask the user if unclear.
2. Compute next Friday in America/New_York (see `/create-changelog` for date logic). Check for an existing `content/changelog/YYYY-MM-DD.md` or an open changelog PR.
3. Draft the entry and present for approval.
4. If a new changelog file is needed: create it using the template from `/create-changelog`. If the file exists: add the H2 section or bullet in the appropriate place.
5. Commit, push, and create or update a PR with `gh pr create` or `gh pr edit`.

All paths are relative to the repository root (`content/changelog/`, `content/docs/`).

---

## Notes

- The script automatically pulls all monitored repos before generating the report.
- Only shows commits from actual releases (tags or release branches).
- All PR numbers in the report are clickable links to GitHub.
- Documentation PRs and changelog PRs are separate.
- Config: `config/monitored-repos.json`. Scripts: `./scripts/`.
