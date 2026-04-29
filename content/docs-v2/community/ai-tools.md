---
title: AI tools for documentation
subtitle: Claude commands available when working on Neon docs
summary: >-
  Lists the Claude commands available in the website repo for documentation
  work, including writing, reviewing, quality checks, changelog management,
  and issue tracking.
enableTableOfContents: true
updatedOn: '2026-04-18T00:00:00.000Z'
---

The Neon website repo includes Claude commands for common documentation tasks. All changes are reviewed by humans via pull requests.

Run `/list-doc-tools` in Claude to see the full list with descriptions, or browse the files under `.claude/commands/` in the [website repository](https://github.com/neondatabase/website).

## Writing content

| Command           | Description                                                                                                                               |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `/write-content`  | Full orchestrated workflow for new pages or substantial rewrites: IA specialist → drafter → refiner → syntax validator.                   |
| `/simple-content` | Lighter single-thread workflow with confirmation at each step. Use for edits to existing pages or smaller additions.                      |
| `/review-content` | Review a page for terminology, voice, structure, and MDX compliance. Produces a structured findings report with an option to apply fixes. |
| `/humanize`       | Remove AI writing patterns and apply Neon voice: contractions, active voice, direct address, concise sentences.                           |
| `/improve-intro`  | Rewrite just the first paragraph of a page to match Neon style.                                                                           |
| `/golden-corpus`  | Load exemplary doc files by type for style and structure reference.                                                                       |

## Docs quality

| Command              | Description                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| `/validate`          | Pre-commit check: frontmatter, stray h1 headings, navigation entry, image paths, em dashes, lint. |
| `/check-consistency` | Find other pages that say the same thing; surface duplication and drift.                          |
| `/update-glossary`   | Find glossary gaps in a doc file (Mode A), or audit the glossary itself (Mode B).                 |
| `/redirect-update`   | After moving or renaming a file: add `redirectFrom`, update links and navigation.                 |

## Pull requests

| Command              | Description                                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| `/update-pr`         | Draft or update a PR title and description from changed files and commits.   |
| `/add-preview-links` | Add Vercel preview links to a PR description for every changed content file. |

## Changelog and roadmap

| Command             | Description                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `/create-pr-report` | Weekly report of merged PRs across monitored repos. Supports PR deep dives and follow-on changelog or docs PR workflows. |
| `/create-changelog` | Generate next Friday's changelog draft (or a specific date) with placeholder content and titled dropdown sections.       |
| `/update-roadmap`   | Sync the introduction roadmap with recent changelog entries.                                                             |

## Reference and navigation

| Command                  | Description                                                                  |
| ------------------------ | ---------------------------------------------------------------------------- |
| `/navigation-principles` | Reference for `navigation.yaml` structure and how to add pages and sections. |
| `/docs-prime`            | Load project structure and key paths into context.                           |
| `/list-doc-tools`        | Print the full list of available commands with descriptions.                 |

## Agents

The `.claude/agents/` directory contains specialized sub-agents used by the writing workflow commands:

- **content-drafter**, **content-planner**, **content-refiner**, **ia-specialist**, **syntax-validator**, **supervisor** — write, plan, review, structure, validate, and orchestrate multi-step workflows
- **extract-analyze-console**, **-cli**, **-mcp**, **-storage**, **-compute** — changelog extraction by repo, used by `/create-pr-report`

<NeedHelp/>
