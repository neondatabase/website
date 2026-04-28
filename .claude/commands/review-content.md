---
description: 'Review a documentation page against Neon standards. Checks terminology, voice, structure, and MDX. Produces a structured findings report with an option to apply fixes.'
---

# Review Content

Review a documentation page against Neon standards and produce a structured findings report. Covers terminology, voice and style, structure, and MDX compliance.

## Usage

```
/review-content content/docs/guides/my-page.md
/review-content                   # uses the currently open file
```

---

## Step 1: Load reference files

Read both of these before doing anything else:

- `.claude/neon-terminology.md` — terminology rules, preferred terms, words to avoid
- `CLAUDE.md` — writing style, MDX components, frontmatter fields

---

## Step 2: Programmatic checks

Scan the file mechanically for the following. These are deterministic — flag everything that matches.

**Terminology violations**

Check every term in the "Avoid" columns of `neon-terminology.md`. Flag any instance where a preferred term is not used. Include the line, the term found, and the preferred replacement.

**Postgres / PostgreSQL**

Flag any use of "PostgreSQL" in general prose that isn't:
- Referring to the open source project specifically
- Citing an official version release (e.g. "PostgreSQL 17")
- In `content/postgresql/` (out of scope)

**Connection strings**

Flag any code example that uses `postgres://` instead of `postgresql://`.

Flag any connection string example missing `?sslmode=require` (unless the surrounding text explicitly explains why SSL is omitted).

**Em dashes**

Flag every em dash (—) in the body text.

**Stray h1 headings**

Flag any line starting with `# ` (single `#`) in the body — the h1 is auto-generated from frontmatter.

**Frontmatter**

Flag if `title` is missing. Note if `enableTableOfContents` is absent on a page longer than ~500 words.

---

## Step 3: Style and voice review

Read the full page with Neon's voice guidelines in mind. Flag issues in these categories:

**Voice**

- Passive voice where active would be clearer
- Impersonal constructions ("users can", "one should") instead of "you"
- Missing contractions where they'd sound natural (it is → it's, do not → don't)
- Sentences over ~25 words that could be split cleanly

**Tone**

- Filler phrases ("it's worth noting", "it's important to remember")
- Hedging language ("in some cases", "generally speaking", "may or may not")
- Minimizing language before steps ("simply", "just", "easily")
- AI-pattern tells ("seamlessly", "robust", "comprehensive", "powerful" used without specifics)

**Structure**

- Intro paragraph that restates the page title instead of adding context
- Section headings that are vague or don't tell the reader what they'll get
- Steps that aren't in a `<Steps>` component
- Missing `<Admonition>` for warnings or important notices buried in prose

**MDX**

- Code blocks missing a language tag
- Multi-language examples not using `<CodeTabs>`
- Inline code used for UI element names instead of bold

---

## Step 4: Structured findings report

Output findings grouped by category. Use this format:

```
## Terminology
[count] issue(s)

LINE 12 — "utilize" → use "use"
LINE 34 — "PostgreSQL" in general prose → use "Postgres"
LINE 67 — connection string uses postgres:// → use postgresql://

## Voice & Style
[count] issue(s)

LINE 8 — Passive voice: "is configured by" → "you configure"
LINE 23 — "In some cases" → be specific or cut
LINE 45 — Sentence is 31 words; consider splitting after "..."

## Structure
[count] issue(s)

LINE 1 — Intro restates the page title; rewrite to add context
LINE 89 — Warning buried in prose; consider <Admonition type="warning">

## MDX
[count] issue(s)

LINE 102 — Code block missing language tag
LINE 134 — Three language examples; use <CodeTabs>

---
Total: [n] issues — [n] terminology, [n] voice/style, [n] structure, [n] MDX
```

If a category has no issues, omit it from the report.

---

## Step 5: Offer to apply

After the report, ask:

> "Apply all fixes, review individually, or skip? (all / review / skip)"

- **All**: apply every suggested fix and save the file, then run `npm run fix`
- **Review**: walk through each finding one at a time, apply on approval, skip on rejection
- **Skip**: do nothing — the report is for reference only
