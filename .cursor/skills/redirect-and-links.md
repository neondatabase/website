# Redirect-and-links skill

**When to use:** The user has moved or renamed a doc and asks to "check redirects and links," "update links after moving [file]," or similar. Also use after any move/rename to ensure nothing is broken.

**Goal:** Ensure `redirectFrom` is set on the destination file and that all internal links and navigation references are updated so old URLs still work and new URLs are used everywhere.

---

## Instructions

1. **Identify the move**
   - Get the old path (or slug) and the new path. If the user only says "I moved a file," ask for the old and new paths, or infer from context (e.g. the file they just edited).

2. **Ensure redirectFrom on the destination**
   - Open the file at its **new** location.
   - In the frontmatter, add or update `redirectFrom` with the old path(s). Use array format: `redirectFrom: ['/docs/old-section/old-name']`.
   - If the file already had `redirectFrom` (e.g. from a previous move), keep those entries and add the current path that was just moved. See `.claude/commands/redirect-update.md` for daisy-chain rules.

3. **Search for references to the old path**
   - Search `content/` for the old path, old slug, or old filename (e.g. `rg "old-name" content/ --type md`, and search `content/docs/navigation.yaml`).
   - Search for URL patterns like `/docs/old-section/page` in markdown and in hub/landing pages (DetailIconCards, DocsList, etc.).

4. **Suggest link and nav updates**
   - List every file and location that still references the old path.
   - Suggest the exact change: e.g. "In `content/docs/guides/foo.md`, change `/docs/connect/old-name` to `/docs/guides/new-name`."
   - If `content/docs/navigation.yaml` has an entry pointing to the old slug, suggest the updated `slug` value.

5. **Output a checklist**
   - **redirectFrom:** Added on [new file path] with [old path(s)].
   - **Links to update:** [file and line or section], …
   - **Navigation:** [navigation.yaml entry to update], …
   - **Hub/landing pages:** [pages that link to moved content], …

---

## Reference

- **Full workflow and examples:** `.claude/commands/redirect-update.md` (step-by-step, multiple moves, consolidations).
- **Redirects:** Defined in frontmatter on the **destination** file; paths start with `/docs/`.
- **Internal links:** Use relative paths like `/docs/section/page`; avoid absolute URLs to neon.tech in source.

---

## Example triggers

- "Check redirects and links after moving the autoscaling page"
- "I moved content/docs/connect/foo.md to content/docs/guides/foo.md—update redirects and links"
- "Make sure redirects and links are correct for the read-replica guide"
