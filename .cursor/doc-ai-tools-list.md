# Doc AI tools available in this repo

When the user asks "what doc AI tools are available" or "what AI tools for docs" or similar, output the following list.

---

## Cursor (`.cursor/`)

**Rules**

- **Neon changelog** — Generates next Friday's changelog draft (or a specific date). Uses a template with Fixes & improvements and timezone (America/New_York). Rule: `neon-changelog.rules`.
- **Docs editing** — Applies when editing docs/guides/changelog: Neon voice, shared content, cross-doc consistency, glossary links, redirect workflow. Based on the Docs contribution guide and Style Guide. Rule: `docs-editing.mdc`.
- **Docs use Claude** — Tells Cursor to load the right `.claude/` command or agent (e.g. golden-corpus, write-content, redirect-update) for the current task so behavior matches Claude. Rule: `docs-use-claude.mdc`.
- **Docs PR report** — Weekly documentation review: generates a report of merged PRs across monitored Neon repos (default: since last Friday), grouped by category with docs-impact indicators. Saves to ~/docs-reviews/. Run from repo root. Rule: `docs-pr-report.mdc`. Scripts: `./scripts/generate-docs-pr-report.sh`, `./scripts/check-docs-report-deps.sh`; config: `config/monitored-repos.json`.

**Skills** (invoke on demand; instructions in `.cursor/skills/`)

- **Consistency check** — Finds other places that say the same thing; suggests a single source or aligned wording. Invoke when the user asks to check consistency for a page. Instructions: `.cursor/skills/consistency-check.md`.
- **Docs glossary updater** — Compares a doc to the glossary and lists missing or review terms. Invoke when the user asks to check glossary for a file. Instructions: `.cursor/skills/docs-glossary-updater.md`.
- **Redirect and links** — After moving a file, ensures redirectFrom and suggests link/nav updates. Invoke when the user asks to check redirects and links. Instructions: `.cursor/skills/redirect-and-links.md`.
- **Docs Roadmap updater** — Reviews the changelog (default: past 1 month) and syncs the introduction roadmap: moves shipped items from "What we're working on now" to "What we've shipped recently" and adds missing changelog features. If already up to date, reports and makes no changes. Invoke when the user asks to update the roadmap. Instructions: `.cursor/skills/docs-roadmap-updater.md`.

## Claude (`.claude/`)

**Commands** (`.claude/commands/`)

- **golden-corpus** — Curated exemplary doc files by type (tutorial, get-started, concept, how-to, reference, etc.). Use for style, tone, and structure.
- **write-content** — Full orchestrated workflow: IA specialist → content-drafter → content-refiner → syntax-validator, then git/optional PR.
- **simple-content** — Lighter workflow with user confirmation at each step (plan, draft, review).
- **review-content** — One-off review of content for style, standards, and technical accuracy. No write step.
- **redirect-update** — Step-by-step for moving or renaming docs: add redirectFrom, update links and navigation, preserve redirect chains. (Same workflow as Cursor skill **Redirect and links**.)
- **triage-changelog** — Extracts PRs from Console, CLI, MCP, Storage, Compute and drafts a changelog. User can scope by repo.
- **docs-prime** — Primes the agent with project structure and key paths for the doc ecosystem.
- **improve-intro** — Improves the first paragraph of a doc page to match Neon style.
- **navigation-principles** — Reference for how `navigation.yaml` works (nav, subnav, items and placement).
- **doc-context-bridge** — Points to `.cursor/` rules and skills so Claude follows the same Cursor-side guidance when working on docs (including Consistency check, Docs glossary updater, Redirect and links, Docs Roadmap updater).
- **list-doc-ai-tools** — Run this (or ask "what doc AI tools are available") to print this list in Claude.

**Agents** (`.claude/agents/`)

- **content-drafter**, **content-planner**, **content-refiner**, **ia-specialist**, **syntax-validator**, **supervisor** — Write/revise, plan specs, review, structure/nav, MDX/build, orchestrate.
- **extract-analyze-console**, **-cli**, **-mcp**, **-storage**, **-compute** — Changelog extraction by repo.

---

For more detail, see `content/docs/community/ai-tools.md` and the files under `.cursor/` and `.claude/commands/` or `.claude/agents/`.
