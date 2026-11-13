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
updatedOn: '2026-11-13T22:15:00.528Z'
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
- **No AI-tell phrasing.** Avoid "seamlessly", "robust", "powerful", "comprehensive", and similar words used without specifics. Describe what actually happens instead.

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

### Consistent terminology

Pick one term per concept and stick to it. Don't mix synonyms such as "dashboard" and "control panel" for the same thing.

The full terminology system (preferred terms, terms to avoid, and the rules for product and feature names) lives in `.claude/neon-terminology.md` in this repository. That file is the terminology data source this style guide points to. Follow it when choosing product names, feature names, and concept nouns.

### Postgres vs PostgreSQL

Use **Postgres** in almost all cases. Use **PostgreSQL** only when:

- Referring specifically to the open source project ("the PostgreSQL project").
- Citing an official version release ("PostgreSQL 17").
- Making a formal reference to the official software product.

When in doubt, use Postgres. See `.claude/neon-terminology.md` for the full rule.

### Product-name casing

Follow the capitalization each product uses officially, even when it is non-standard. For example: PostgreSQL, GitHub, npm, Vercel. For Neon product and feature names, follow `.claude/neon-terminology.md`.

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

Include `?sslmode=require` in examples unless the surrounding text explains why SSL is omitted.

### Commands, parameters, and filenames

Enclose commands, parameters, values, filenames, error messages, and connection strings in backticks. For example: "Run the `neon projects list` command" and "Execute `git clone` to clone a repository". A command such as `git clone` stays lowercase even though Git the product is capitalized.

## How the doc tooling uses this page

The doc AI commands and agents in this repository treat this page as the source of truth for voice and style:

- `/humanize` and `/review-content` apply these voice principles and flag violations of the mechanical rules.
- `/validate` and `/review-content` enforce the no-em-dash rule and other mechanical checks.
- The writing agents under `.claude/agents/` draft against these rules.

<NeedHelp/>
