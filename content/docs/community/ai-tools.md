---
title: AI tools for documentation
subtitle: Claude and Cursor rules and commands used when working on Neon docs
summary: >-
  Lists the AI tools (Claude agents/commands and Cursor rules) available in the
  website repo for documentation work, so you can use the same standards in
  either environment.
enableTableOfContents: true
updatedOn: '2026-02-07T00:00:00.000Z'
---

The Neon website repo includes rules and commands for **Claude** and **Cursor** so that documentation work follows the same standards no matter which tool you use. All changes are reviewed by humans via pull requests.

## Cursor (`.cursor/`)

| Tool                     | Description                                                                                                                                                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **neon-changelog.rules** | Generate next Friday's changelog draft or a changelog for a specific date; template with Fixes & improvements.                                                                                                   |
| **docs-editing rule**    | When editing docs/guides/changelog: apply Neon voice (see [contribution guide](/docs/community/contribution-guide)), use shared content, keep cross-doc consistency, link to glossary, follow redirect workflow. |
| **docs-use-claude rule** | Points to `.claude/` agents and commands (golden corpus, write-content, review-content, redirect-update, etc.) so Cursor can load them for style and workflows.                                                  |
| **Skills (planned)**     | Consistency check, glossary sync, version/SDK check, redirect-and-links — on-demand checks invoked by the user.                                                                                                  |

## Claude (`.claude/`)

| Tool                      | Description                                                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **golden-corpus**         | Exemplary doc files by type; use for style, tone, and structure.                                                                  |
| **write-content**         | Full workflow: IA → drafter → refiner → syntax-validator, then git/PR.                                                            |
| **simple-content**        | Lighter workflow with user confirmation at each step.                                                                             |
| **review-content**        | One-off review for style, standards, and technical accuracy.                                                                      |
| **redirect-update**       | Step-by-step for moves/renames: redirectFrom, links, navigation.                                                                  |
| **triage-changelog**      | Extract PRs from Console/CLI/MCP/Storage/Compute and draft changelog.                                                             |
| **docs-prime**            | Project structure and key paths for the doc ecosystem.                                                                            |
| **improve-intro**         | Improve the first paragraph of a doc page.                                                                                        |
| **navigation-principles** | How `navigation.yaml` works (nav, subnav, items).                                                                                 |
| **doc-context-bridge**    | Points to `.cursor/` rules and skills so Claude follows the same Cursor-side guidance.                                            |
| **list-doc-ai-tools**     | Prints the list of doc AI tools when run or when asked (e.g. "what doc AI tools are available?").                                 |
| **Agents**                | content-drafter, content-planner, content-refiner, ia-specialist, syntax-validator, supervisor; extract-analyze-\* for changelog. |

For full details and when to use each tool, see the files under `.cursor/` and `.claude/commands/` or `.claude/agents/` in the [website repository](https://github.com/neondatabase/website).

<NeedHelp/>
