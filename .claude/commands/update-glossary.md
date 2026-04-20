---
description: 'Update or review the Neon glossary. Run on a doc file to find terms missing from the glossary, or on the glossary itself to check order, cross-links, and best practices.'
---

# Update Glossary

Keep the Neon glossary accurate, complete, and aligned with best practices. Two modes:

- **Mode A:** Run on a doc file to find Neon terms that should be in the glossary but aren't.
- **Mode B:** Run on the glossary itself to check alphabetical order, cross-links, best practices, and obsolete entries.

**Glossary path:** `content/docs/reference/glossary.md`

## Glossary best practices

Apply these when suggesting or reviewing entries:

1. **One concept, one entry.** For synonyms, use a short entry that points to the main term: "See [Preferred term](#anchor)."
2. **Short, clear definitions.** One to three sentences. Link to full docs rather than repeating long explanations.
3. **Cross-link in definitions.** When a definition uses another glossary term, link it: `[term](#anchor)`. Do not leave glossary terms as plain text.
4. **Stable anchors.** Anchors are the heading lowercased with spaces and punctuation replaced by hyphens. Example: `## Compute Unit (CU)` → `#compute-unit-cu`. Use the same anchor style everywhere.
5. **Preferred term for aliases.** When multiple names refer to one concept, choose one as the main entry; redirect aliases to it.
6. **Product scope.** Include terms specific to Neon or used in a special way in Neon docs.
7. **Opening the definition.** Do not repeat the term in the first phrase. Start with the defining content: "Database compute that runs your workloads in Neon," not "A compute is..."
8. **No circular definitions.** "See X" for an alias is fine; a full entry must add meaning.
9. **Also see / Related.** Add "Also see [Term](#anchor)." when it helps the reader.
10. **No em dashes.** Use commas, periods, or rephrase instead.
11. **Docs-first.** Only include terms used in the docs. Remove entries for features no longer documented.

## Mode A: Doc file — find missing terms

Use when the user names a doc file or is working on a specific page.

1. **Identify the file(s).** Use the file the user named or the currently open doc. If none, ask: "Which doc should I check against the glossary?"
2. **Load the glossary.** Read `content/docs/reference/glossary.md`. Build a list of existing terms from `## term` headings (normalize for comparison, e.g. "read replica" vs "read replicas").
3. **Scan the doc for Neon terms.** Flag phrases that look like Neon product or feature terms: compute, branch, read replica, primary compute, Pageserver, Safekeeper, Autoscaling, Scale to Zero, endpoint, connection pooling, logical replication, restore window, IP Allow, and any other capitalized or technical terms that might belong in the glossary.
4. **Compare and produce the checklist.**
   - **Missing terms:** In the doc but not the glossary. Suggest a short definition following the best practices above, or "See [Existing term](#anchor)" if it's an alias.
   - **Terms to review:** In both the doc and glossary where the doc's usage may have changed.
   - **Already covered:** Optionally list terms already in the glossary.
5. **Apply.** Add missing terms and update definitions in the glossary, unless the user only wants the checklist.

## Mode B: Glossary review — order, cross-links, best practices, obsolete entries

Use when the user asks to "review the glossary," "check glossary best practices," "ensure glossary is alphabetical," or when no specific doc file is given.

1. **Load the glossary.** Read `content/docs/reference/glossary.md` in full.
2. **Check alphabetical order.** Extract all `## term` headings. Sort alphabetically (case-insensitive; ignore leading "the" or "a"). List any entries out of order.
3. **Check cross-links.** For each entry, identify terms in the body that have their own glossary entry. Check if those terms are linked as `[term](#anchor)`. List entries where a glossary term appears as plain text.
4. **Check best practices.** Scan for: entries that are very long; inconsistent "See" vs "Also see"; aliases that could use "See [Main term](#anchor)"; definitions using glossary terms as plain text; em dashes (flag and suggest rewording).
5. **Check for obsolete entries.** For each entry, search `content/docs` for the term or common variants. Entries with no matches in the docs may be obsolete. List as **Candidates for removal** (author should confirm before removing).
6. **Apply.** Make the suggested changes to the glossary unless the user only wants the report.

## Combined run

If the user wants both: run Mode A on the specified doc file(s), then run Mode B on the glossary. Output both reports in one response.
