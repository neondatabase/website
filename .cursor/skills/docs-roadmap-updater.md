# Docs Roadmap updater

**When to use:** The user asks to "update the roadmap," "sync roadmap with changelog," "review roadmap against changelog," "run roadmap updater," or similar.

**Always:** When doing any work on the roadmap (edits, new bullets, or reviews), read and follow this skill. Treat it as the single source of truth for roadmap structure, style, and workflow.

**Goal:** Keep the Neon introduction roadmap aligned with the changelog. Review changelog entries from a recent time window (default: past 1 month), then update the roadmap by (1) moving items from "What we're working on now" to "What we've shipped recently" when they have clearly shipped in the changelog, and (2) adding any major changelog features that are missing from "What we've shipped recently." If everything is already reflected, report that we're up to date and make no changes.

**Roadmap path:** `content/docs/introduction/roadmap.md`  
**Changelog path:** `content/changelog/` (files named `YYYY-MM-DD.md`).

---

## Roadmap structure (follow this style)

The roadmap has three main sections:

1. **What we're working on now** — Short bullet list. Each item: **Bold title**: brief description. Some have links (e.g. "Check the [Neon Auth roadmap](/docs/auth/roadmap) for details.").
2. **What's on the horizon** — Subsections (### Backups & restore, ### Security, etc.) with short bullets. No need to change these unless the user asks.
3. **What we've shipped recently** — Bullet list. Each item: **Bold title**: one-sentence description. Often ends with "[Learn more](/docs/...)" or "[Read the announcement](/blog/...)." Keep the same tone and format. New entries go at the **top** of this list (most recent first). Optionally there is a `<details><summary>Shipped in 2024</summary>...</details>` (or other year) at the bottom; do not add current-year items there.

**Style:** Short, clear bullets. Use existing roadmap wording patterns. Prefer docs links (`/docs/...`) or blog links (`/blog/...`) where relevant. **In the roadmap document (content users read), do not use em dashes (—).** Use commas, parentheses, or separate sentences instead.

---

## Workflow

### 1. Parse the time window

- **Default:** Past 1 month from today (use UTC or the repo's conventional date for consistency). If you run this regularly, the user can specify "past week"; if they forget for a while, the past month usually catches everything.
- **If the user specifies:** e.g. "past week," "past three months," "since 2025-11-01" — use that window.

### 2. Load the roadmap

- Read `content/docs/introduction/roadmap.md` in full.
- Extract and list:
  - Every bullet under **What we're working on now** (short labels/titles for matching).
  - Every bullet under **What we've shipped recently** (so you can avoid duplicates and match style).

### 3. Load the changelog for the window

- List files in `content/changelog/`. Each filename is `YYYY-MM-DD.md`.
- Include every changelog file whose date falls within the chosen window (e.g. from [today minus 3 months] through today).
- Read each included changelog file. From each, collect:
  - **Major features:** H2 headings (## Title) and the first sentence or two of content (these are the main "shipped" items).
  - **Notable items in &lt;details>:** If a &lt;details> section contains a significant shipped feature (e.g. "Consumption API," "Neon API"), consider it for the roadmap if it's user-facing and not already there.

### 4. Compare and decide

- **Match "working on now" to changelog:** For each item in "What we're working on now," check whether the changelog (in the window) clearly describes that feature as shipped or generally available. Examples: "Postgres 18 general availability" matches changelog "Postgres 18 support (Preview)" or "Postgres 18 GA"; "Connection pooling metrics" matches changelog about PgBouncer metrics. If there's a clear match, that item should **move** from "working on now" to "What we've shipped recently" (see step 5 for wording).
- **Changelog-only items:** Identify major changelog features (H2-level or equivalent) in the window that are **not** already listed in "What we've shipped recently." If they're user-facing and substantive, plan to **add** them to "What we've shipped recently" (again, at the top, in roadmap style).
- **Already up to date:** If every such changelog item is already represented in "What we've shipped recently" for the current year, and nothing in "working on now" clearly shipped in the window, then **do not edit** the roadmap. Output: **We're already up to date!** No changes needed. Stop.

### 5. Apply changes (unless user only wants a report)

- **Remove** from "What we're working on now": each item you identified as shipped (step 4).
- **Add** to the top of "What we've shipped recently": 
  - Each item you moved from "working on now," rewritten in shipped style: **Short title**: one-sentence description. Add "[Learn more](/docs/...)" or "[Read the announcement](/blog/...)" when there's an obvious doc or blog; otherwise keep it short.
  - Each new item from the changelog that you decided to add, in the same style. Use the changelog wording as a base but shorten to match existing roadmap bullets.
- **Preserve** all other roadmap content: horizon section, existing shipped bullets, any `<details>Shipped in 2024</details>`, and the closing sections (Early Access, timing note, Share your thoughts, CommunityBanner).
- **Order:** Newest shipped items at the top of "What we've shipped recently"; older ones below. Keep the existing relative order for items you didn't move or add.

### 6. Output

- **If no edits:** "We're already up to date! Changelog for the past [N] [week(s)/month(s)] is reflected in 'What we've shipped recently.' No changes made."
- **If edits:** Summarize what you did: "Moved from 'working on now' to 'shipped': [X, Y]. Added to 'shipped': [A, B]." Then apply the edits to `content/docs/introduction/roadmap.md` (edit the file). If the user asked for a report only, output the summary and the proposed bullet text for each change instead of editing.

---

## Important rules

- **Current-year shipped list only:** If an item from the changelog is already present in "What we've shipped recently" (the main list, not inside "Shipped in 2024"), do not add it again. We're already up to date for that item.
- **One bullet per feature:** One roadmap bullet per shipped feature; combine very small related items only when they're the same theme (e.g. "Postgres extension updates" if the changelog has a single section for multiple extension version bumps).
- **Don't invent links:** Only add "[Learn more](...)" or "[Read the announcement](...)" when the changelog or existing roadmap clearly points to that URL. Otherwise omit or use a generic docs path if obvious.
- **Don't change "What's on the horizon":** Unless the user explicitly asks to update that section, leave it as is.
- **No em dashes in the roadmap:** In `content/docs/introduction/roadmap.md` (the content users read), do not use em dashes (—). Use commas, parentheses, or separate sentences instead.

---

## Example triggers

- "Update the roadmap" — Run with default 1-month changelog window; apply edits.
- "Review the roadmap against the changelog for the past month" — Same.
- "Sync roadmap with changelog for the past week" — Use 1-week window; apply edits.
- "Check if the roadmap is up to date with the changelog" — Run comparison; if up to date, say so and don't edit. If not, report what would change and apply unless user says report only.
