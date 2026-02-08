# Consistency-check skill

**When to use:** The user asks to "check consistency for this page," "find duplicates of this instruction," "where else do we say this?," or similar.

**Goal:** Find other places in the docs that say the same or similar thing so the author can use a single source (e.g. shared content) or align wording and avoid drift.

---

## Instructions

1. **Identify the doc (and optionally the section)**
   - Use the file the user named or the currently open/edited doc.
   - If no file is specified, ask: "Which page should I check for consistency?" or use the file from context.

2. **Extract key procedural or definitional sentences**
   - Read the doc (or the section in scope).
   - Pick 2–5 sentences that state a procedure, a definition, or a rule (e.g. "You can create a read replica from the Console, CLI, or API"; "Scale to Zero suspends the compute after 5 minutes of inactivity"). These are the phrases that might be duplicated elsewhere.

3. **Search for similar phrasing**
   - Search `content/docs` (and optionally `content/guides`) for phrases or keywords from those sentences. Use search that finds conceptual overlap, not only exact matches (e.g. "create read replica", "scale to zero", "5 minutes inactivity").
   - Note any files that contain similar instructions or definitions.

4. **Report overlaps and suggest actions**
   - List: "Same or similar instruction also appears in: [file/section], [file/section], …"
   - Suggest: Prefer a single source—e.g. add the content to `content/docs/shared-content/` and reference it from both places, or align wording so both say the same thing and one links to the other.
   - If nothing relevant is found, say so so the author knows no duplicate was detected.

5. **Human decides**
   - Do not rewrite other files unless the user explicitly asks. The skill outputs the report; the author decides whether to consolidate, add shared content, or align wording.

---

## Search scope

- **Primary:** `content/docs/` (all `.md` under docs).
- **Optional:** `content/guides/` if the doc is a guide or the instruction is guide-like.

---

## Example triggers

- "Check consistency for this page"
- "Find duplicates of this instruction"
- "Where else do we say the same thing about read replicas?"
