---
name: faq-authoring
description: Creates and edits Neon FAQ pages in content/faqs. Use for direct product questions, troubleshooting answers, comparison questions, and programmatic FAQ content.
---

# FAQ authoring

Read `../neon-writing/SKILL.md` before drafting or editing an FAQ.

FAQ pages live in `content/faqs/` and render through the docs MDX system at `/faqs/<slug>`. Don't put standalone FAQ pages in `content/docs/`.

The FAQ index page injects a programmatic CTA banner above the content automatically. Don't duplicate that banner in the body.

Production visibility is controlled by `isDraft` only. Legacy `status: draft` frontmatter does **not** hide a page from the index or search.

## Decide whether the content is an FAQ

Use an FAQ when the reader has one specific question and can get a useful answer without following a full tutorial.

Use another content type when:

- The task requires a sequence of setup or implementation steps: write or update a guide.
- The subject needs a complete conceptual treatment: update product documentation.
- The content is news, opinion, or a technical narrative: write a blog post.
- An existing FAQ asks the same question with different wording: update it or add a redirect instead of creating a duplicate.

## Research

1. Search `content/faqs/` for the question, likely synonyms, and the intended search phrase.
2. Find the canonical docs pages that support the answer.
3. Verify current product behavior, plan limits, feature status, UI labels, commands, and API examples.
4. Identify claims likely to change and link them to the source of truth.
5. Inspect neighboring FAQ files for current frontmatter and previous/next navigation.

## Answer structure

1. Use the reader's natural-language question as `title`.
2. Answer it directly in the first paragraph. A reader should understand the result without scrolling.
3. Add only the explanation, procedure, constraints, or troubleshooting needed to make the answer useful.
4. Use descriptive `h2` sections for longer answers.
5. End with the relevant next action or canonical docs link. Don't add a recap.

Don't add an `h1`; the title is rendered from frontmatter.

For a short factual question, one or two paragraphs may be enough. Don't inflate every answer into a guide.

## Frontmatter

Use this shape for new FAQ pages:

```yaml
---
title: '[Question in sentence case?]'
subtitle: '[Direct one-sentence answer suitable for metadata and listings.]'
enableTableOfContents: true
createdAt: '[ISO 8601 timestamp]'
isDraft: false
redirectFrom: []
previousLink:
  title: '[Previous FAQ title]'
  slug: previous-faq-slug
nextLink:
  title: '[Next FAQ title]'
  slug: next-faq-slug
---
```

Guidance:

- Use a question mark when the title is a direct question.
- Keep `subtitle` specific and self-contained. Don't use "Learn how" or repeat the title without answering it.
- Set `enableTableOfContents: false` or omit it for an answer with no useful `h2` outline.
- Use `isDraft: true` until an incomplete answer is ready. This is the only field that hides a page in production.
- Add previous and next links that match the intended sequence, and update adjacent files when inserting a page into an existing sequence. The FAQ index sorts by `createdAt` descending; prev/next links are manual frontmatter, not derived from sort order.
- Use `redirectFrom` for replaced FAQ paths, with each path beginning and ending with `/`.
- Don't add or edit `updatedOn` manually. The pre-commit hook manages it.
- Preserve legacy frontmatter fields on existing pages unless the task includes normalizing them. Don't copy legacy `status`, `category`, `date`, or `slug` fields into a new FAQ. In particular, `status: draft` on legacy pages does not control visibility; use `isDraft` instead.

## Write the answer

- Lead with "Yes," "No," a command, a location, a limit, or the product behavior when one of those directly answers the question.
- Use the same terms the reader used, then introduce Neon's exact terminology.
- Explain conditions and exceptions immediately after the answer.
- Link each volatile detail, such as pricing or plan limits, to its canonical page.
- Use a short procedure when needed. Link to a full guide for substantial setup.
- Include commands or code only when they answer the question faster than prose.
- Explain placeholders and keep examples safe to copy.
- Don't claim Neon is the best, cheapest, most popular, or uniquely capable without current, cited evidence.
- For comparison questions, define criteria first and support each comparison. Don't invent competitor behavior.
- For troubleshooting, connect symptom, likely cause, diagnostic step, and fix.

## Components

Read [references/components.md](references/components.md) before adding custom MDX. It lists every component available to FAQ pages and when it is appropriate.

Default to prose, lists, tables, and code blocks. In most FAQs:

- Use `Admonition` for a risk or easy-to-miss requirement.
- Use `Callout` for optional context.
- Use `Tabs` for Console, CLI, or API alternatives.
- Use `CodeTabs` for equivalent code options.
- Use `CTA` for one relevant next action at the end of the answer.

Don't add `<NeedHelp/>` to FAQ pages. Don't add a component only to make a short answer look more substantial.

## Validate

Before finishing:

- Confirm the first paragraph directly answers the title.
- Check for a duplicate or overlapping FAQ.
- Verify claims, commands, code, links, plan limits, UI labels, and feature status.
- Confirm `subtitle` works as a standalone answer and metadata description.
- Check previous and next links in this file and adjacent files.
- Confirm MDX tags and props are valid.
- Run the narrowest relevant check. Use `npm run check:md` if formatting needs checking and `npm run build` when routing or MDX behavior changed.
- Don't run `npm run lint:md` or broad formatting commands as part of the normal workflow.
