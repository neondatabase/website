---
name: guide-authoring
description: Creates and edits Neon developer guides in content/guides and guide-style pages in content/docs. Use for tutorials, integrations, quickstarts, walkthroughs, and other task-based technical content.
---

# Guide authoring

Read `../neon-writing/SKILL.md` before drafting or editing a guide.

## Choose the correct content area

Determine the destination before writing:

- `content/docs/guides/` and `content/docs/auth/guides/`: Official Neon product documentation. New pages require an entry in `content/docs/navigation.yaml` and go through full docs review.
- `content/guides/`: Community and third-party integration guides. These pages don't use `content/docs/navigation.yaml` and surface through the `/guides` index.

If the request doesn't identify the destination, inspect related pages. Use `content/docs/` for maintained product procedures and reference material. Use `content/guides/` for end-to-end integrations, examples, and contributed tutorials.

For official docs guides, use `content/docs/guides/GUIDE_TEMPLATE.md` as a starting point when creating a new page.

## Research before drafting

1. Read the nearest current guides for structure, terminology, and reusable links.
2. Read the product's source documentation and current UI or API reference.
3. Confirm package names, supported versions, commands, API behavior, plan limits, and feature status.
4. Search for an existing page that already covers the task. Update or link it instead of duplicating it.
5. Run or otherwise verify the critical path when the environment permits. Don't present untested code as verified.

## Structure

Use the smallest structure that lets the reader complete and verify the task:

1. **Frontmatter**
2. **Introduction:** Name the outcome, intended reader, and approach in one or two short paragraphs.
3. **Prerequisites:** Include only requirements that can block the procedure.
4. **Steps:** Put actions in execution order. Use one clear result per step.
5. **Verification:** Tell the reader what success looks like and how to test it.
6. **Troubleshooting:** Include likely failures only when they're specific and actionable.
7. **Next steps:** Link the most relevant follow-on task. Don't add a generic recap.

Don't add a manual `h1`. The page title comes from frontmatter.

Use `<Steps>` when the page is a sequential procedure. Each `h2` inside it becomes a numbered step. Use ordinary `h2` sections when readers can complete sections independently.

## Frontmatter

For `content/docs/guides/` and `content/docs/auth/guides/`, use:

```yaml
---
title: [Required page title in sentence case]
subtitle: [Short outcome or audience]
summary: [Search-focused description; include on every new docs guide]
enableTableOfContents: true
---
```

Add only fields the page needs:

- `tag`: `new`, `beta`, `coming soon`, `deprecated`, or approved custom text. Repeat the tag in `content/docs/navigation.yaml`.
- `redirectFrom`: Old paths, each beginning and ending with `/`.
- `isDraft: true`: Hide the page in production while keeping it available in development.
- `ogImage`: Social preview image path.
- `layout: wide`: Required when using `TwoColumnLayout`.

For Managed Better Auth guides under `content/docs/auth/guides/`, include `<FeatureBetaProps feature_name="Managed Better Auth" />` immediately after frontmatter.

For `content/guides/`, use:

```yaml
---
title: [Required guide title in sentence case]
subtitle: [Short description of what the reader will build or learn]
author: [Existing author slug]
enableTableOfContents: true
createdAt: '[ISO 8601 timestamp for a new guide]'
---
```

Don't add or edit `updatedOn` manually. The pre-commit hook updates it on staged content files.

For community guides, register the author in `content/guides/authors/data.json` and add a photo under `public/guides/authors/`. Prev/next navigation is computed from `createdAt` sort order, not frontmatter.

## Write the procedure

- Start each step with the action or goal.
- Put context immediately before the action it explains.
- Use numbered lists for actions within a step and bullets for unordered choices or results.
- Tell the reader where to run each command and where to create each file.
- Use filename labels on code blocks when the file location matters.
- Use environment variables for credentials. Never put real secrets in examples.
- Use fake data that follows repository conventions, including `@example.com` email addresses.
- Keep sample code internally consistent across the guide.
- Explain each placeholder the reader must replace.
- Show only the output needed to confirm success or diagnose a likely failure.
- Use direct links to canonical docs for setup that isn't central to the guide.

## Components and media

Read [references/components.md](references/components.md) before choosing custom MDX components. It documents the available components and when to use each one.

For docs images:

- Put files under `public/docs/`, mirroring the content path where practical.
- Reference them with a root-relative path such as `/docs/guides/example.png`.
- Write alt text that describes the useful information in the image.
- Add the title `'no-border'` only for images that shouldn't use the default border.
- Don't use screenshots when text or code communicates the same information more clearly.

For community guide images, put files under `public/guides/` mirroring the guide path.

Official docs guides commonly end with `<NeedHelp/>`. Community guides often do the same. Don't add `<NeedHelp/>` to FAQ pages.

## Navigation

For a new page under `content/docs/`:

1. Add it to the appropriate location in `content/docs/navigation.yaml`.
2. Set `slug` to the file path relative to `content/docs/`, without `.md`.
3. Keep the navigation title short. It may differ from the page title.
4. Add the same `tag` used in frontmatter, if any.

Don't add `content/guides/` pages to docs navigation.

## Validate

Before finishing:

- Confirm the reader can identify the outcome and prerequisites from the opening.
- Verify code, commands, links, package versions, UI labels, and technical claims.
- Check that each step has an observable result.
- Check frontmatter and, for docs pages, the navigation entry.
- Confirm local image and prompt paths exist.
- Confirm MDX tags are balanced and component props are valid.
- Run the narrowest relevant validation. For a focused content change, use `npm run check:md` if formatting needs checking and `npm run build` when routing or MDX behavior changed.
- Don't run `npm run lint:md` or broad formatting commands as part of the normal workflow.
