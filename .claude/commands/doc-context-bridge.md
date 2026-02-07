---
description: 'When doing documentation work in this repo, follow Cursor-side guidance so behavior matches whether you use Claude or Cursor. Index of .cursor/ rules and skills. When user asks what doc AI tools are available, output the list.'
---

# Doc context bridge: Cursor rules and skills

When doing documentation work in the Neon website repo, also follow the guidance in `.cursor/` so the same standards apply in Claude and Cursor.

## When the user asks what doc AI tools are available

If the user asks "what doc AI tools are available", "what AI tools for docs", "what AI tools are available for documentation", or similar, read `.cursor/doc-ai-tools-list.md` and output the list of tools with their one- or two-sentence descriptions. Print the full list; do not summarize.

## When to load which file

- **Changelog generation:** Read `.cursor/rules/neon-changelog.rules` for next-Friday changelog creation, override date, and template (placeholder content, Fixes & improvements collapsible, timezone America/New_York).
- **Doc editing standards:** Read `.cursor/rules/docs-editing.mdc` for Neon voice, shared content, cross-doc consistency, glossary linking, and redirect workflow when editing `content/docs/`, `content/guides/`, or `content/changelog/`.
- **Components and icons (documentation definition):** When creating or editing docs and you need the full component and icon catalog, read the same community docs the Cursor docs-editing rule uses: `content/docs/community/component-guide.md` (component catalog), `content/docs/community/component-icon-guide.md` (icons), `content/docs/community/component-specialized.md` (specialized components), and `content/docs/community/mermaid-diagrams.md` (diagrams). This keeps Claude aligned with Cursor's documentation definition.
- **Cursor skills (on-demand checks):** Skill behavior is defined in `.cursor/doc-ai-tools-list.md` (Cursor section). When the user asks for these tasks, apply the same logic:
  - **Consistency check:** Extract key procedural/definitional sentences from current doc; search `content/docs` (and optionally `content/guides`) for similar phrasing; report overlaps and suggest single source or aligned wording.
  - **Glossary sync:** Scan file(s) for Neon product terms; compare to `content/docs/reference/glossary.md`; list missing terms and terms to review after doc changes.
  - **Version/SDK check:** Find package/version mentions in the guide; compare to latest (or tell user to check); report "doc says X, latest Y."
  - **Redirect and links:** After a move, ensure `redirectFrom` on destination; search content and nav for old path; suggest link and nav updates.

Use the Read tool on the relevant path (e.g. `Read(".cursor/rules/neon-changelog.rules")` or `Read(".cursor/rules/docs-editing.mdc")`) when the task involves changelog generation, doc edits, or the above checks.
