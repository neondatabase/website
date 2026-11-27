---
title: Style guide
subtitle: The voice and mechanical rules for writing Neon documentation
summary: >-
  The single source of truth for how Neon documentation reads. Covers the voice
  principles (plain, developer-first, direct) and the mechanical rules
  (sentence-case titles, no em dashes, consistent terminology,
  Postgres vs PostgreSQL, product-name casing, fake example data, and connection
  string format). Every other contribution guide, command, and agent references
  this page instead of restating the rules.
enableTableOfContents: true
updatedOn: '2026-11-26T13:59:26.519Z'
---

This page is the single source of truth for how Neon documentation reads. The contribution guide, the doc AI commands, and the writing agents all point here instead of repeating these rules, so there is one place to read and one place to change.

If you are contributing a page, read [Voice principles](#voice-principles) and [Mechanical rules](#mechanical-rules) once, then write. The reviewer tooling checks your page against the same rules.

## Voice principles

Write like one person explaining something to another: approachable and precise, not stiff or formal.

- **Plain and developer-first.** Write for developers who want clear, actionable information. State what something does and how to use it. Skip marketing language.
- **Use contractions.** "It's", "don't", "you're" keep the tone conversational. Don't overuse them to the point of hurting clarity.
- **Address the reader as "you".** Prefer "you can configure" over "users can configure" or "one can configure". Don't start every sentence with "You".
- **Active voice.** "The server reads the file", not "The file is read by the server". Some passive voice in reference material is intentional; leave it where it reads naturally.
- **Brief sentences.** Keep sentences to about 25 words. If a sentence runs long and has a natural split, break it in two.
- **US English.** Use US spelling and grammar throughout.
- **No emojis or exclamation marks** in documentation.
- **Cut minimizing words.** Remove "simply", "just", "easily", and "quick" before a step. Let the steps speak. Don't call something "easy" or "straightforward" when complexity follows.
- **No hedging or filler.** Cut "it's worth noting", "in order to", "it's important to remember", and stacked hedges like "could potentially" or "may or may not". Make the claim or cut it.
- **No AI-tell phrasing.** Avoid "seamlessly", "robust", "powerful", "comprehensive", and similar words used without specifics. Describe what actually happens instead. The full word list is in the terminology reference.
- **No filler patterns.** Cut openers that announce a point instead of making it ("Here's the thing", "Worth noting", "One thing to call out"), "it's not X, it's Y" contrasts, unsourced claims ("studies show", "experts agree"), and closing paragraphs that only recap. End on the last concrete point or next step.
- **Be precise.** Prefer specific, checkable claims ("branches are created in about a second") over vague ones ("branches are fast"). Don't write "the best", "the only", or "industry-leading" without a source.
- **Introduce before naming.** Describe what something does, or show a concrete case, before you name or define it. Don't use a term before the page explains it.
- **Explain, then instruct.** In conceptual sections, describe what the system does ("The compute scales to zero after five minutes"). Save imperatives for steps the reader performs.
- **Link, don't repeat.** Don't duplicate information from another page. Link to the original source and explain why it matters in context.

## Mechanical rules

These rules are deterministic. The `/validate` and `/review-content` commands check pages against them.

### No em dashes

No em dashes. Rewrite with a period, comma, colon, or parentheses. This targets the em dash (—) specifically; an en dash (–) for ranges (for example 0–23 or 50–100x) and a hyphen (-) for list bullets and compound words are fine and not affected. It is a house-style convention. Don't introduce a new em dash when rewriting a page.

### Sentence case for titles and headings

- Use sentence case for page titles and headings: "Create your first project", not "Create Your First Project".
- Use lowercase wherever possible elsewhere.
- UI text: match the interface exactly.
- Feature names: lowercase by default.
- Methods and methodologies: capitalize (Continuous Integration, Continuous Deployment).
- Keep headings short and literal: name what the section covers ("Pricing", "Connection limits"). Don't put a colon in a heading to set up a reveal or a subtitle ("Pooling: how it works").
- Use sentence case after a colon in body text, unless a proper noun or code follows.
- Don't put a heading over a single sentence, and don't use bold labels as fake headings ("**Solution:**"). Use a heading, or a sentence that names the fix.

### Consistent terminology

Pick one term per concept and stick to it. Don't mix synonyms such as "dashboard" and "control panel" for the same thing.

The full terminology system (preferred terms, terms to avoid, and the rules for product and feature names) lives in [`.claude/neon-terminology.md`](https://github.com/neondatabase/website/blob/main/.claude/neon-terminology.md) in this repository. That file is the terminology data source this style guide points to. Follow it when choosing product names, feature names, and concept nouns.

### Postgres vs PostgreSQL

Use **Postgres** in almost all cases. Use **PostgreSQL** only when:

- Referring specifically to the open source project ("the PostgreSQL project").
- Citing an official version release ("PostgreSQL 17").
- Making a formal reference to the official software product.

When in doubt, use Postgres. See `.claude/neon-terminology.md` for the full rule.

### Product-name casing

Follow the capitalization each product uses officially, even when it is non-standard. For example: PostgreSQL, GitHub, npm, Vercel. For Neon product and feature names, follow `.claude/neon-terminology.md`.

### Help and next steps

- Don't end with "contact support" as the only next step: support access depends on the plan. Link the [Support](/docs/introduction/support) page, which lists the options for each plan, or the next step in the docs flow.
- Don't link to GitHub Discussions for help or feedback. Use the [Neon Discord](https://neon.com/discord), the relevant docs page, or the [roadmap](/docs/introduction/roadmap) for feedback.
- Don't refer to "the Neon docs" as a separate source ("the Neon docs describe X"). State the fact and link the page that covers it.

### Fake user data only

Never use real user data in examples.

- Emails: use `@example.com` or `@domain.com`.
- Usernames: `example_username`, or one of these diverse, non-gendered names: Zhang Kai, Alex Lopez, Dana Smith.
- Passwords: `AbC123dEf`.
- Database names: `dbname`.

### Connection strings

Use `postgresql://` (not `postgres://`). Standard format:

```text
postgresql://[user]:[password]@[neon_hostname]/[dbname]
```

Example with realistic values:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

Include `?sslmode=require&channel_binding=require` in examples, which matches the connection string the Neon Console gives you. Omit `channel_binding` only when the example's driver or tool doesn't support it, and say so in the surrounding text. Omit `sslmode=require` only when the text explains why SSL isn't used.

### Commands, parameters, and filenames

Enclose commands, parameters, values, filenames, error messages, and connection strings in backticks. For example: "Run the `neon projects list` command" and "Execute `git clone` to clone a repository". A command such as `git clone` stays lowercase even though Git the product is capitalized.

## How the doc tooling uses this page

The doc AI commands and agents in this repository treat this page as the source of truth for voice and style:

- `/humanize` and `/review-content` apply these voice principles and flag violations of the mechanical rules.
- `/validate` and `/review-content` enforce the no-em-dash rule and other mechanical checks.
- The writing agents under `.claude/agents/` draft against these rules.

<NeedHelp/>
