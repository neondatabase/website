# Docs PR Report (internal)

**Internal use only.** This Cursor rule and scripts support the documentation team’s PR report and deep-dive workflow.

## Quick start

1. Open the website repo in Cursor.
2. In chat, say: **"create a docs PR report"** (or "run docs pr report", "generate docs pr report").
3. The agent will run a dependency check. If anything is missing (jq, git, or cloned repos), it will tell you what’s missing and **ask if you want to proceed** with setup (e.g. run the script to clone repos). Say **yes** to have it run `./scripts/setup-repos.sh --yes`.
4. For **jq** or **git**: install manually (e.g. `brew install jq`) then say "create a docs PR report" again.
5. Reports are written to `~/docs-reviews/` (folder is created automatically).

## First-time setup (for colleagues)

- **Clone the website repo** (you already have it if you’re here).
- **Install once if missing:** `jq` (e.g. `brew install jq`), and for deep dive/PRs: `gh` and `gh auth login`.
- **Clone monitored repos:** From repo root run `./scripts/setup-repos.sh`. Or say "create a docs PR report" and when the agent reports missing repos, say **yes** to have it run the setup script.
- **Custom paths:** If your repos live under a different directory (e.g. `~/Projects`), set `export DOCS_REPORT_REPOS_BASE=~/Projects` before running. For fully custom paths, set `DOCS_REPORT_CONFIG` to the path of your own `monitored-repos.json`.

## What’s in this repo

- **`.cursor/rules/docs-pr-report.mdc`** – Cursor rule so the agent knows how to run the report and deep dive.
- **`scripts/check-docs-report-deps.sh`** – Checks jq, git, config, and repos; run first so the agent can tell you what’s missing and offer to set up.
- **`scripts/generate-docs-pr-report.sh`** – Generates the markdown report.
- **`scripts/setup-repos.sh`** – Clones missing monitored repos (use `--yes` for non-interactive).
- **`config/monitored-repos.json`** – List of repos and paths (uses `~`; override with env vars above).

Reports are saved to **`~/docs-reviews/`**, not in the repo.
