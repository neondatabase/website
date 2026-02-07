# Doc AI tools available in this repo

When the user asks "what doc AI tools are available" or "what AI tools for docs" or similar, output the following list.

---

## Cursor (`.cursor/`)

- **neon-changelog.rules** — Generates next Friday's changelog draft (or a specific date). Uses a template with Fixes & improvements and timezone (America/New_York).
- **docs-editing rule** — Applies when editing docs/guides/changelog: Neon voice, shared content, cross-doc consistency, glossary links, redirect workflow. Based on the Docs contribution guide and Style Guide.
- **docs-use-claude rule** — Tells Cursor to load the right `.claude/` command or agent (e.g. golden-corpus, write-content, redirect-update) for the current task so behavior matches Claude.
- **Consistency-check skill** — Finds other places that say the same thing; suggests a single source or aligned wording. Invoke when the user asks to check consistency for a page.
- **Glossary-sync skill** — Compares a doc to the glossary and lists missing or review terms. Invoke when the user asks to check glossary for a file.
- **Version/SDK-check skill** — Reports doc vs latest package/SDK versions for a guide. Invoke when the user asks to check versions in a guide.
- **Redirect-and-links skill** — After moving a file, ensures redirectFrom and suggests link/nav updates. Invoke when the user asks to check redirects and links.

## Claude (`.claude/`)

- **golden-corpus** — Curated exemplary doc files by type (tutorial, get-started, concept, how-to, reference, etc.). Use for style, tone, and structure.
- **write-content** — Full orchestrated workflow: IA specialist → content-drafter → content-refiner → syntax-validator, then git/optional PR.
- **simple-content** — Lighter workflow with user confirmation at each step (plan, draft, review).
- **review-content** — One-off review of content for style, standards, and technical accuracy. No write step.
- **redirect-update** — Step-by-step for moving or renaming docs: add redirectFrom, update links and navigation, preserve redirect chains.
- **triage-changelog** — Extracts PRs from Console, CLI, MCP, Storage, Compute and drafts a changelog. User can scope by repo.
- **docs-prime** — Primes the agent with project structure and key paths for the doc ecosystem.
- **improve-intro** — Improves the first paragraph of a doc page to match Neon style.
- **navigation-principles** — Reference for how `navigation.yaml` works (nav, subnav, items and placement).
- **doc-context-bridge** — Points to `.cursor/` rules and skills so Claude follows the same Cursor-side guidance when working on docs.
- **list-doc-ai-tools** — Run this (or ask "what doc AI tools are available") to print this list in Claude.
- **Agents** — content-drafter (writes/revises), content-planner (plans specs), content-refiner (reviews), ia-specialist (structure/nav), syntax-validator (MDX/build), supervisor (orchestrates); extract-analyze-console, -cli, -mcp, -storage, -compute for changelog extraction.

---

For more detail, see `content/docs/community/ai-tools.md` and the files under `.cursor/` and `.claude/commands/` or `.claude/agents/`.
