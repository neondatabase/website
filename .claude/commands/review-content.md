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

Read all of these before doing anything else:

- `content/docs/community/contribution-guide.md` — the published Style Guide (canonical source for voice, capitalization, fake user data, connection strings, backtick conventions)
- `.claude/neon-terminology.md` — terminology rules, preferred terms, words to avoid
- `CLAUDE.md` — writing style, MDX components, frontmatter fields
- `content/docs/community/component-guide.md` and `component-specialized.md` — component props, required fields, valid types, and when to use each
- `content/docs/community/component-icon-guide.md` — valid icon names for `TechCards` and `DetailIconCards`

---

## Step 2: Programmatic checks

Scan the file mechanically for the following. These are deterministic — flag everything that matches.

**Terminology violations**

Check every term in the "Avoid" columns of `neon-terminology.md`, including the extended banned-word table, the "AI-tell words and phrases" section, and the "Product and plan naming" section (Neon Auth spacing, database not DB, Organization not workspace, Free plan not free tier, plan names, product prefixing). Flag any instance where a preferred term is not used. Include the line, the term found, and the preferred replacement.

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

**Emojis and exclamation marks**

Flag every emoji and every exclamation mark (`!`) in body prose and headings. Ignore `!` inside code blocks, inline code, and shell/SQL examples where it's syntax (e.g. `!=`, `[!code ++]`).

**US English spelling**

Flag British spellings and suggest the US form. Non-exhaustive list to check: colour→color, behaviour→behavior, organise/organisation→organize/organization, cancelled→canceled, licence→license, catalogue→catalog, centre→center, analyse→analyze, favourite→favorite, initialise→initialize, customise→customize, optimise→optimize, and other `-ise`/`-isation`/`-our` forms. Don't flag these inside code, identifiers, or third-party quoted strings.

**Fake user information**

Flag real-looking personal data in examples. Emails must end in `@example.com` or `@domain.com` — flag any other domain that looks like a person's address. For usernames, suggest `example_username` or one of Zhang Kai, Alex Lopez, Dana Smith. In generic connection-string examples, the password should be `AbC123dEf` and the database `dbname`. Don't flag real Neon hostnames (e.g. `ep-cool-darkness-123456.us-east-2.aws.neon.tech`) or third-party product names.

**Backticks for commands, parameters, filenames**

Flag commands, parameters, values, filenames, and connection strings that appear in prose without backticks (e.g. bare `neon projects list`, `git clone`, `DATABASE_URL`, `neon.ts`). Heuristic — flag clear cases, not every lowercase word.

**Component props and types**

- `Admonition` `type` must be one of `note`, `important`, `tip`, `info`, `warning`, `comingSoon`. Flag any other value.
- Required props: `FaqItem` needs `question`; `CheckItem` needs `title`; `CTA` needs `title`, `description`, `buttonText`, `buttonUrl`; `FeatureBetaProps` and `EarlyAccessProps` need `feature_name`; `ExternalCode` needs `url`.
- `ExternalCode` `url` must be a raw GitHub URL (`raw.githubusercontent.com`). Flag non-raw GitHub links.
- `CopyPrompt` `src` must point into `/prompts/`.
- `TechCards` / `DetailIconCards` `icon` values must be valid names from `component-icon-guide.md` (the two use different icon systems). Flag unknown icons.

**Component nesting and placement**

- `CheckItem` only inside `<CheckList>`; `TabItem` only inside `<Tabs>`.
- `<NeedHelp/>` and other shared blocks belong after `</Faq>`, never inside a `FaqItem`.
- A `<Faq>` block needs a `## Frequently asked questions` heading above it (sentence case) so it appears in the TOC.
- `TwoColumnLayout` requires `layout: wide` in the frontmatter.

**Restricted and deprecated components**

- `ChatOptions` is for internal sidebar navigation only. Flag any use in page content.
- `RequestForm` is being removed site-wide. Flag every instance — don't add new ones.

**Stray h1 headings**

Flag any line starting with `# ` (single `#`) in the body — the h1 is auto-generated from frontmatter.

**Frontmatter**

Flag if `title` is missing. Note if `enableTableOfContents` is absent on a page longer than ~500 words.

Flag `title` (and `subtitle`) that use Title Case instead of sentence case — only the first word and proper nouns are capitalized ("Create your first project", not "Create Your First Project"). Product names keep their official casing (PostgreSQL, GitHub, npm).

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

**AI-slop patterns**

Structural tells beyond single words (mirrors the `neon-writing-style` skill; `/humanize` covers these in depth). Flag:

- Throat-clearing and faux insight ("Here's the thing", "What most people get wrong", "Here's what nobody tells you")
- Binary contrasts and negative lists ("This isn't X. It's Y", "not just X but Y")
- Dramatic reveals (a noun phrase + colon manufacturing suspense: "The best part: it learns")
- Superficial analysis (trailing "highlighting/underscoring/reflecting/showcasing" clauses that just assert importance)
- Importance puffery ("marks a pivotal moment", "plays a vital role", "stands as a testament")
- Weasel attribution ("experts agree", "studies show") with no named source
- Synonym cycling (rotating near-synonyms for the same thing instead of repeating the clearest term)
- Fake-profound or recap endings; end on the last concrete point instead

**Structure**

- Intro paragraph that restates the page title instead of adding context
- Section headings that are vague or don't tell the reader what they'll get
- Steps that aren't in a `<Steps>` component
- Missing `<Admonition>` for warnings or important notices buried in prose
- Content that repeats an explanation available elsewhere instead of linking to it (deep dives belong in `/check-consistency`, but flag obvious duplication)

**CTAs and support links**

- CTAs telling readers to "contact support" — support is plan-gated and Free-plan users have no support channel. Point to the [Neon community on Discord](https://neon.com/discord) or the next docs step instead.
- Any link or reference to **GitHub Discussions** — it's not actively monitored. Flag every instance (CTAs, FAQs, error messages, anywhere). Point to Discord or the relevant docs page.

**Capitalization and UI**

- Methodologies should be capitalized (Continuous Integration, Continuous Deployment)
- UI text (button labels, menu items) should match the interface exactly — flag anything that looks paraphrased or re-cased

**MDX**

- Code blocks missing a language tag
- Multi-language examples not using `<CodeTabs>`
- Inline code used for UI element names instead of bold

**Component selection**

- Warning or error-preventing information in a plain paragraph that should be an `<Admonition>`; neutral "good to know" info dressed up as an `<Admonition>` that should be a `<Callout>`
- FAQs written as ad-hoc `### question` headings, `**Q:/A:**` text, or a `DefinitionList` instead of `<Faq>` / `<FaqItem>`
- A manually numbered sequence of instructions that should be a `<Steps>` block
- Cards picked for the wrong content: `TechCards` (colorful tech logos), `DetailIconCards` (monochrome feature/service), `DocsList` (simple links)
- Beta or preview features missing the right status indicator (`FeatureBetaProps`, `PublicPreview`, etc.) near the top
- A specialized component used where a simpler common one would do

---

## Step 4: Structured findings report

Output findings grouped by category. Use this format:

```
## Terminology
[count] issue(s)

LINE 12 — "utilize" → use "use"
LINE 34 — "PostgreSQL" in general prose → use "Postgres"
LINE 67 — connection string uses postgres:// → use postgresql://
LINE 71 — "organise" → US English "organize"
LINE 88 — email "jane@acme.io" → use "@example.com"
LINE 90 — "NeonAuth" → "Neon Auth" (with a space)
LINE 95 — "free tier" → "Free plan"
LINE 99 — "the DB" → "the database"

## Voice & Style
[count] issue(s)

LINE 8 — Passive voice: "is configured by" → "you configure"
LINE 23 — "In some cases" → be specific or cut
LINE 45 — Sentence is 31 words; consider splitting after "..."
LINE 52 — Exclamation mark in prose → remove
LINE 60 — Emoji in heading → remove
LINE 64 — "it's important to note" → cut, state it directly
LINE 78 — "contact support" CTA → point to Discord or next docs step
LINE 82 — links GitHub Discussions → not monitored; link Discord instead

## Structure
[count] issue(s)

LINE 1 — Intro restates the page title; rewrite to add context
LINE 89 — Warning buried in prose; consider <Admonition type="warning">
FRONTMATTER — title "Create Your First Project" is Title Case → sentence case

## MDX
[count] issue(s)

LINE 102 — Code block missing language tag
LINE 134 — Three language examples; use <CodeTabs>
LINE 140 — bare command `neon projects list` in prose → wrap in backticks
LINE 150 — Admonition type="caution" is invalid → use "warning"
LINE 162 — FaqItem missing required "question" prop
LINE 171 — RequestForm is being removed site-wide → remove
LINE 180 — Warning in a plain paragraph → use <Admonition type="warning">

---
Total: [n] issues — [n] terminology, [n] voice/style, [n] structure, [n] MDX
```

If a category has no issues, omit it from the report.

---

## Step 5: Offer to apply

After the report, ask:

> "Apply all fixes, review individually, or skip? (all / review / skip)"

- **All**: apply every suggested fix and save the file, then run `npm run fix:md`
- **Review**: walk through each finding one at a time, apply on approval, skip on rejection
- **Skip**: do nothing — the report is for reference only
