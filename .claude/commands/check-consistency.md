---
description: 'Check whether a doc page duplicates instructions or definitions that exist elsewhere in the docs. Surfaces overlapping content so you can align wording, add a cross-reference, or consolidate into shared content. Does not rewrite anything — outputs a report for the author to act on.'
---

# Check Consistency

Find other places in the docs that say the same or similar thing as the target page, so you can align wording, avoid drift, or consolidate into shared content.

## When to use

The user asks to "check consistency for this page," "find duplicates of this instruction," "where else do we say this?," or similar.

## Instructions

### 1. Identify the doc

Use the file the user named or the currently open/edited doc. If no file is specified, ask: "Which page should I check for consistency?"

### 2. Extract key sentences

Read the doc (or the section in scope). Pick 2-5 sentences that state a procedure, a definition, or a rule. For example:

- "You can create a read replica from the Console, CLI, or API"
- "Scale to Zero suspends the compute after 5 minutes of inactivity"

These are the phrases most likely to be duplicated elsewhere.

### 3. Search for similar phrasing

Search `content/docs` (and optionally `content/guides`) for phrases or keywords from those sentences. Find conceptual overlap, not only exact matches. For example, search "create read replica", "scale to zero", "5 minutes inactivity".

Note every file that contains similar instructions or definitions.

### 4. Report and suggest

Output:

- **Also appears in:** [file/section], [file/section], ...
- **Suggested action:** Prefer a single source. Options: add the content to `content/docs/shared-content/` and reference it from both places, or align wording so both say the same thing and one links to the other.

If no relevant matches are found, say so clearly.

### 5. Human decides

Do not rewrite other files unless the user explicitly asks. Output the report; the author decides whether to consolidate, add shared content, or align wording.

## Search scope

- **Primary:** `content/docs/` (all `.md` files)
- **Optional:** `content/guides/` if the doc is a guide or the instruction is guide-like
