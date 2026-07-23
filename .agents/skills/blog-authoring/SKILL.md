---
name: blog-authoring
description: Creates, edits, previews, and publishes Neon blog posts through the website repository's local working-copy flow. Use for content/blog posts, blog frontmatter, blog MDX components, cover images, object-storage uploads, and blog branch previews.
---

# Blog authoring

Read `../neon-writing/SKILL.md` before drafting or editing a blog post.

Use the website repository as the editing surface. Blog content is materialized under the ignored `content/blog/` working copy and published to the configured blog-content repository with the built-in CLI.

Do not default to editing the remote source-of-truth repository directly unless the user explicitly asks for it.

## Choose the post shape

Start with the subject, evidence, audience, and intended reader outcome. Choose a structure that fits the material:

- **Technical tutorial:** Problem, prerequisites, implementation, verification, and tradeoffs.
- **Technical explanation:** Concrete observation, mechanism, consequence, and examples.
- **Product announcement:** What changed, who can use it, how it works, limits, and how to try it.
- **Engineering story:** Problem, constraints, decisions, implementation, evidence, and lessons.
- **Customer story:** Customer context, problem, decision, implementation, measured result, and attributable quotes.
- **Opinion or analysis:** Clear thesis supported by evidence and technical reasoning.

Don't force a standard outline onto material that needs a different shape. Build the reasoning before stating a broad conclusion.

## Research

1. Verify product claims, names, dates, measurements, feature status, and availability.
2. Find primary sources for quotes, benchmarks, and comparisons.
3. Read related Neon posts and docs. Link the source instead of repeating volatile details.
4. Confirm code and commands in an environment that matches the post when possible.
5. Preserve the named author's point of view. Don't invent personal experience or opinions.

## Frontmatter

Read [references/frontmatter.md](references/frontmatter.md) before creating or substantially editing a post. It includes the required schema and cover-image consistency rules.

The filename is the URL slug:

```text
content/blog/posts/<slug>.md
```

Use existing slugs from:

- `content/blog/authors/data.json`
- `content/blog/categories/data.json`

Don't create a new author or category when an existing entry applies.

## Opening image

The post-page Hero renders title, date, authors, and category only. It does not display `cover.image`.

Start the post body with a relevant lead image immediately after frontmatter:

```md
![Descriptive alt text](https://cdn.neonapi.io/public/images/pages/blog/<slug>/<filename>)
```

The lead image may match `cover.image` or be a distinct content image. Set `cover.image` to the approved listing and social asset. Read [references/images.md](references/images.md) before uploading or replacing an image.

## Write the post

- Open with the concrete problem, change, observation, or result. Skip generic industry setup.
- Give readers enough context to understand why the subject matters, but don't explain basics the intended audience already knows.
- Connect sections logically. Each section should advance the argument or task.
- Use code, diagrams, measurements, and examples as evidence, not decoration.
- State constraints, tradeoffs, and failure modes.
- Attribute quotes and opinions to named people or sources.
- Use descriptive headings that help readers scan.
- End on the last concrete implication or next action. Don't add a recap that repeats the post.

## Components

Read [references/components.md](references/components.md) before adding custom MDX. Blog posts support a smaller component set than docs. An unregistered docs component will fail or render incorrectly.

## Required checks

Before changing content:

```bash
git branch --show-current
npm run blog:status
```

If `content/blog` is missing:

```bash
npm run blog:bootstrap
```

Use this only when the user explicitly wants to replace the working copy with remote state:

```bash
npm run blog:sync -- --force
```

## Core workflow

### 1. Edit locally

Edit only:

- `content/blog/posts/*.md`
- `content/blog/authors/data.json`
- `content/blog/categories/data.json`

Don't edit generated snapshots or a separate clone by default.

### 2. Review locally

```bash
npm run dev
```

Use the local app to review:

- `/blog`
- `/blog/<slug>`

Check the cover image, opening image, headings, code, links, responsive layout, and every custom component.

### 3. Publish to a branch in `blog`

Use the built-in CLI:

```bash
npm run blog:publish-branch -- --branch <branch-name>
```

Defaults:

- if `--branch` is omitted, the current git branch name is used
- the command pushes the current `content/blog` snapshot into the configured remote content repository
- the command prints preview URLs under `/blog-preview/...`

### 4. Review the branch preview

Open the generated preview URL, for example:

```text
/blog-preview/<slug>?branch=<branch>&secret=<secret>
```

If the preview returns `404`, treat that as “access denied or missing branch/slug”. Do not assume the route is public.

Before publishing to production, set `draft: false`, confirm dates and metadata, and follow the blog repository's review and merge process.

## Guardrails

- Prefer `content/blog` in the current repository as the editing surface.
- Do not overwrite existing `content/blog` automatically; only use `blog:sync -- --force` when the user explicitly wants a refresh.
- Do not push to the main source-of-truth remote accidentally. If you must work in a separate source repo directly, inspect `git remote -v` first and confirm which remote is safe to push to.
- When credentials are missing, limit yourself to local editing and local preview; explain exactly which publish/preview actions are blocked.
- Never print, commit, paste, or log object-storage credentials, GitHub tokens, or preview secrets.
- Don't upload an image until its final slug and filename are confirmed.
- Don't overwrite a cached CDN object in place. Use a new filename when replacing an existing asset.
- Do not touch unrelated local files such as `src/scripts/compare-sites.js`.

## Final review

- Verify the post's claims, code, links, names, dates, and measurements.
- Confirm frontmatter uses existing author and category slugs.
- Confirm the lead image appears first in the body and all cover, lead, and SEO image URLs are correct.
- Confirm all image alt text is useful and all embeds have written context.
- Confirm every MDX component is supported by the blog renderer.
- Check `npm run blog:status` after editing.
- Review both the local page and branch preview before treating the post as ready.

## References

Load only what you need:

- Commands and environment expectations: `references/commands.md`
- Frontmatter schema: `references/frontmatter.md`
- Supported MDX components: `references/components.md`
- Image preparation and R2 upload: `references/images.md`
