---
description: 'Sync the Neon introduction roadmap with the changelog. Moves shipped items from "What we are working on now" and adds missing changelog features to "What we have shipped recently."'
---

# Update Roadmap

Keep the Neon introduction roadmap aligned with the changelog. Review changelog entries for a recent time window (default: past 1 month), then:

1. Move items from "What we're working on now" to "What we've shipped recently" when the changelog shows they shipped.
2. Add major changelog features missing from "What we've shipped recently."

If everything is already reflected, report that and make no changes.

**Roadmap path:** `content/docs/introduction/roadmap.md`
**Changelog path:** `content/changelog/` (files named `YYYY-MM-DD.md`)

## Roadmap structure

The roadmap has three main sections:

1. **What we're working on now** — Short bullet list. Each item: **Bold title**: brief description.
2. **What's on the horizon** — Subsections with short bullets. Do not change unless the user asks.
3. **What we've shipped recently** — Bullet list. Each item: **Bold title**: one-sentence description. Often ends with "[Learn more](/docs/...)" or "[Read the announcement](/blog/...)." New entries go at the **top** (most recent first). There may be a `<details><summary>Shipped in 2024</summary>...</details>` block at the bottom; do not add current-year items there.

**Style:** Short, clear bullets. Match existing wording patterns. Prefer docs links (`/docs/...`) or blog links (`/blog/...`). No em dashes in the roadmap document.

## Workflow

### 1. Parse the time window

- **Default:** Past 1 month from today.
- **If the user specifies:** e.g. "past week," "past three months," "since 2025-11-01" — use that window.

### 2. Load the roadmap

Read `content/docs/introduction/roadmap.md` in full. Extract every bullet under "What we're working on now" and "What we've shipped recently."

### 3. Load the changelog

List files in `content/changelog/`. Each filename is `YYYY-MM-DD.md`. Read every file whose date falls within the window. From each file, collect:

- **Major features:** `##` headings and the first sentence or two.
- **Notable `<details>` items:** If a dropdown contains a significant user-facing feature, consider it for the roadmap.

### 4. Compare

- **Match "working on now" to changelog:** For each item in "What we're working on now," check if the changelog clearly shows it shipped. If yes, plan to move it to "What we've shipped recently."
- **Changelog-only items:** Identify major changelog features not already in "What we've shipped recently." If user-facing and substantive, plan to add them.
- **Already up to date:** If all changelog items are already represented, do not edit the roadmap. Report: "We're already up to date! No changes needed."

### 5. Apply changes

Unless the user only wants a report:

- **Remove** from "What we're working on now": each item identified as shipped.
- **Add** to the top of "What we've shipped recently":
  - Moved items, rewritten in shipped style: **Short title**: one-sentence description. Add "[Learn more](/docs/...)" or "[Read the announcement](/blog/...)" when there's an obvious link.
  - New items from the changelog, in the same style.
- **Preserve** all other content: horizon section, existing shipped bullets, `<details>` blocks, and closing sections.

### 6. Output

- **If no edits:** "We're already up to date! Changelog for the past [N] covered. No changes made."
- **If edits:** Summarize what changed ("Moved from 'working on now' to 'shipped': [X]. Added to 'shipped': [Y].") then apply the edits.

## Rules

- **Current-year shipped list only.** Do not add to `<details>Shipped in 2024</details>` (or other years) unless explicitly asked.
- **One bullet per feature.** Combine very small related items only when they share the same theme.
- **Don't invent links.** Only add "[Learn more](...)" when the changelog or roadmap clearly points to that URL.
- **Don't change "What's on the horizon"** unless explicitly asked.
- **No em dashes** in `content/docs/introduction/roadmap.md`.
