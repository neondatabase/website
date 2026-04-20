# Doc AI tools available in this repo

When the user asks "what doc AI tools are available" or "what AI tools for docs" or similar, output the following list.

---

## Claude (`.claude/`)

**Commands** (`.claude/commands/`) — run with `/command-name`

- **create-pr-report** — Runs a report of merged PRs across monitored Neon repos (default: since last Friday) so you can see what shipped and what may need documenting. Also supports deep-diving into a specific PR to assess documentation impact and follow on to draft a changelog entry or open a docs PR.
- **create-changelog** — Creates the changelog file for next Friday (or a date you specify) with the correct structure and placeholder content. Run this at the start of changelog week to get the file ready to fill in.
- **post-changelog** — Posts the changelog preview link and PR to all Lakebase Slack channels so the team can review before it publishes. Databricks employees only — requires Slack MCP access.
- **update-roadmap** — Reads the recent changelog (default: past month) and updates the introduction roadmap page: moves shipped items out of "What we're working on now" and into "What we've shipped recently," and adds any major changelog features that are missing.
- **write-content** — Writes a new doc page end-to-end using a pipeline of specialized agents: structure is planned, content is drafted, style is reviewed, and MDX is validated. Use for new pages or major rewrites where you want a thorough, well-structured first draft.
- **simple-content** — Walks you through writing or updating a page in a single conversation, with a confirmation step after each stage (plan → draft → review). Use for edits to existing pages, shorter additions, or when you want more control at each step.
- **review-content** — Reviews a page against Neon standards and produces a structured findings report grouped by category: terminology violations, voice and style issues, structure problems, and MDX errors. Each finding includes the original text, the issue, and a suggested fix. You can apply fixes interactively or use the report as a reference.
- **validate** — Catches common errors before you commit: missing `title` frontmatter, stray h1 headings, new pages not added to `navigation.yaml`, broken image paths, malformed `redirectFrom` entries, and em dashes. Then runs lint and format.
- **check-consistency** — Checks whether a doc page duplicates instructions or definitions that exist elsewhere. Surfaces overlapping content so you can align wording, add a cross-reference, or consolidate into shared content. Outputs a report only — does not rewrite anything.
- **update-glossary** — Mode A: reads a doc file and lists Neon product terms that are missing from the glossary, with suggested definitions. Mode B: audits the glossary itself for alphabetical order, missing cross-links, best-practice violations, and obsolete entries.
- **redirect-update** — Handles the full redirect workflow after moving or renaming a doc: adds `redirectFrom` to the destination file, finds and updates all internal links, updates `navigation.yaml`, and flags any redirect chain issues.
- **golden-corpus** — Loads curated examples of well-written Neon docs by page type (tutorial, how-to, reference, concept, integration, etc.). Use before writing or reviewing to understand what good looks like for that type — structure, voice, component usage, and level of detail.
- **improve-intro** — Rewrites the opening paragraph of a doc page so it clearly tells the reader what the page covers and what they'll be able to do. Removes generic filler ("In this guide, you will...") and makes the intro useful to someone who arrives from search.
- **navigation-principles** — Reference for how `navigation.yaml` is structured. Use when adding a new page or section to the docs nav — explains nav, subnav, section, items, slug, and tag with examples of each.
- **docs-prime** — Loads context about how this repo is organized (directory structure, key files, content conventions) so Claude can give accurate answers without reading the whole codebase first. Run at the start of a session when asking structural or architectural questions.
- **create-doc-ticket** — Creates a JIRA task in the Databricks LKB project and assigns it to you. Accepts a Slack thread URL, PR link, or plain description as input and drafts the ticket from it. Databricks employees only — requires the JIRA MCP.
- **list-doc-tools** — Run this (or ask "what doc tools are available") to print this list.

**Agents** (`.claude/agents/`)

- **content-drafter**, **content-planner**, **content-refiner**, **ia-specialist**, **syntax-validator**, **supervisor** — Specialized agents used by `/write-content`. Not invoked directly.

---

For more detail, see `content/docs/community/ai-tools.md` and the files under `.claude/commands/` or `.claude/agents/`.
