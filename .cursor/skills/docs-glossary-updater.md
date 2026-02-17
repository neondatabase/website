# docs-glossary-updater

**When to use:** The user asks to "check glossary for this file," "glossary sync," "glossary review," "run docs-glossary-updater," "update the glossary," or similar. Can be run (1) on a doc file to find terms that should be in the glossary, or (2) on the glossary itself to check best practices, order, and cross-links.

**Goal:** Keep the Neon glossary accurate, complete, and aligned with glossary best practices—including alphabetical order, cross-linking, and consistent formatting. When run on a doc file, identify terms that are missing from the glossary but should be added.

---

## Glossary best practices (apply when suggesting or reviewing)

Use these when suggesting new entries, reviewing existing entries, or auditing the glossary:

1. **One concept, one entry** — Each defined concept has a single canonical entry. For synonyms or aliases, use a short entry that points to the main term: "See [Preferred term](#anchor)." Example: "access token" → See Token.

2. **Short, clear definitions** — Prefer one to three sentences. Link to full docs for more ("See [Topic](/docs/path).") rather than repeating long explanations.

3. **Cross-link in definitions** — When a definition uses another term that has its own glossary entry, link it: `[term](#anchor)`. Example: "A [branch](#branch) in a Neon project…" so readers can jump to the definition. Do not leave glossary terms as plain text when they have an entry.

4. **Stable, consistent anchors** — Markdown anchors are usually the heading text lowercased, with spaces and punctuation replaced by hyphens (e.g. `## Compute Unit (CU)` → `#compute-unit-cu`). Use the same anchor style everywhere. When linking between entries, use `[term](#anchor)` with the correct anchor for that heading.

5. **Preferred term for aliases** — When multiple names refer to one concept, choose one as the main entry and put the others as "See [Main term](#anchor)."

6. **Product scope** — Include terms that are specific to Neon or used in a special way in Neon docs. Generic terms (e.g. "RAM") can be included briefly if they appear often in Neon context.

7. **Opening the definition** — Do not repeat the term in the first phrase; the heading already names it. Prefer starting with the defining content: e.g. "Database compute that runs your workloads in Neon" or "In Neon, the compute resource that runs your database," not "A compute is…" or "The compute is…." Use the same style across entries (fragment or full sentence) for consistency.

8. **No circular definitions** — Avoid definitions that only point to each other without adding information. "See X" for an alias is fine; a full entry should add meaning.

9. **Also see / Related** — When an entry relates to another, add "Also see [Term](#anchor)." or "See [Term](#anchor)." at the end when it helps the reader.

10. **No em dashes** — Do not use em dashes (—) in glossary terms or definitions unless absolutely necessary (e.g. a proper name or technical notation that includes one). Use commas, periods, or rephrase instead.

11. **Docs-first** — Only include terms that are used in the docs. Do not add entries for features or concepts that are not documented. When a feature is removed from the product or docs, remove (or ask the author to remove) the corresponding glossary entries so the glossary does not reference obsolete features.

---

## Mode A: Run on a doc file (identify missing terms)

Use when the user names a doc file or is working on a specific page.

1. **Identify the file(s)** — Use the file(s) the user named or the currently open/edited doc. If none, ask: "Which doc or docs should I check against the glossary?"

2. **Load the glossary** — Read `content/docs/reference/glossary.md`. Build a list of terms that already have entries (use `## term` headings; normalize for comparison, e.g. "read replica" vs "read replicas"). Note anchor format used (e.g. `#term` or `#term-with-hyphens`).

3. **Scan the doc(s) for Neon product terms** — Read the specified doc file(s). Flag phrases that look like Neon product or feature terms: compute, branch, read replica, primary compute, Pageserver, Safekeeper, Autoscaling, Scale to Zero, endpoint, connection pooling, logical replication, restore window, IP Allow, and any other capitalized or technical terms that might belong in the glossary. Include terms that are defined or emphasized in the doc.

4. **Compare and produce the checklist** — **Missing terms:** Terms that appear in the doc(s) but do not have a matching entry. List them and suggest a short definition following the best practices above (or "See [Existing term](#anchor)" if it's an alias). **Terms to review:** Terms in both doc and glossary where the doc's usage might have changed—suggest the author confirm the entry. **Already covered:** Optionally list terms already in the glossary so the author knows no action is needed.

5. **Output and apply** — Present a clear checklist: **Add to glossary:** [term 1], [term 2], with one-line definition suggestions. **Review glossary entry:** [term 1], … **Already in glossary (no action):** … Then apply your suggested changes to the glossary (add missing terms, update definitions) unless the user only wants the checklist.

---

## Mode B: Run on the glossary (best practices, order, cross-links, obsolete entries)

Use when the user asks to "review the glossary," "check glossary best practices," "ensure glossary is alphabetical," "check glossary cross-links," "check for obsolete glossary entries," or when no specific doc file is given and the focus is the glossary itself. Always include the obsolete-entries check (step 5).

1. **Load the glossary** — Read `content/docs/reference/glossary.md` in full.

2. **Check alphabetical order** — Extract all top-level headings (`## term`). Sort them alphabetically (ignore "the", "a"; treat numerals and symbols per your convention; case-insensitive for sort). Compare to the current order. List any entries that are out of order (e.g. "default branch" should come before "Private Networking"). Output: **Alphabetical order:** [List of entries that are out of order, with "should come after X" or "should come before Y."] If the glossary uses a different convention (e.g. "default branch" under D but placed after "Project" for a reason), note it and still report deviations from strict A–Z.

3. **Check cross-links** — For each entry, identify terms in the body that have their own glossary entry (e.g. "compute," "branch," "read replica"). Check if those terms are linked as `[term](#anchor)`. List entries where a glossary term is used in the definition but not linked. Output: **Missing cross-links:** In "[Entry name]", the term "[term]" should be linked to [term](#anchor). (Suggest the correct anchor based on the heading format in the file.)

4. **Check best practices** — Scan for: (a) Entries that are very long (suggest trimming or moving detail to a doc link). (b) Inconsistent "See" vs "Also see" for related terms. (c) Aliases that could use "See [Main term](#anchor)." (d) Definitions that use another glossary term as plain text instead of linking. (e) Em dashes (—) in terms or definitions; flag them and suggest rewording (commas, periods, or rephrase) unless the em dash is necessary (e.g. in a proper name). Output: **Best-practice suggestions:** [Bullet list of specific suggestions.]

5. **Check for obsolete entries** — For each glossary entry, search `content/docs` for the term or common variants (e.g. "read replica" and "read replicas"). Entries that have no matches in the docs may be obsolete (e.g. left over after a feature was removed). List them as **Candidates for removal:** [entry 1], [entry 2], with a note that the author should confirm the feature is no longer documented before removing. If all entries have at least one match, output **Candidates for removal:** None.

6. **Output and apply** — Present: **Alphabetical order:** … **Missing cross-links:** … **Best-practice suggestions:** … **Candidates for removal:** … Then apply your suggested changes to the glossary (reorder, add cross-links, fix best-practice issues, remove obsolete entries) unless the user only wants the report.

---

## Combined run (file + glossary)

If the user wants both: (1) run Mode A on the specified doc file(s) and (2) run Mode B on the glossary. Output both the "missing terms / review" checklist and the "order / cross-links / best practices" report in one response.

---

## Glossary location and format

- **Path:** `content/docs/reference/glossary.md`
- **Format:** Each entry is a `## term` heading (sentence case or lowercase as in the doc) followed by one or more paragraphs. Anchor for linking: heading lowercased, spaces and parentheses replaced by hyphens (e.g. `## Compute Unit (CU)` → `#compute-unit-cu`). Verify anchor format by checking how existing links in the file are written.

---

## Example triggers

- "Run docs-glossary-updater on content/docs/introduction/read-replicas.md" — Mode A: find terms in that file that should be in the glossary.
- "Check glossary for the file I'm working on" — Mode A on current doc.
- "Review the glossary for best practices and alphabetical order" — Mode B.
- "Ensure glossary entries link to each other where necessary" — Mode B (cross-links).
- "Run docs-glossary-updater on the glossary" — Mode B.
- "Run docs-glossary-updater on read-replica docs and then check the glossary" — Combined.
