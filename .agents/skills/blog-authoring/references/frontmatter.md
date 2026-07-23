# Blog frontmatter

Use the current post schema below. Inspect a recently published post before adding a field not listed here.

```yaml
---
title: '[Post title in sentence case]'
description: >-
  [Concise search and page description.]
excerpt: >-
  [Listing preview that gives readers a reason to open the post.]
date: '2026-07-23T12:00:00'
updatedOn: '2026-07-23T12:00:00'
category: [primary-category-slug]
categories:
  - [primary-category-slug]
authors:
  - [author-slug]
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/<slug>/<filename>
  alt: '[Descriptive image alt text]'
isFeatured: false
draft: true
seo:
  title: '[Search title]'
  description: >-
    [Search description.]
  keywords: []
  noindex: false
  ogTitle: '[Social title]'
  ogDescription: >-
    [Social description.]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/<slug>/<filename>
---
```

## Fields

- `title`: Required display title. Don't add an `h1` to the body.
- `description`: Concise page and search description. State what the post covers.
- `excerpt`: Listing copy. It may be longer or more narrative than `description`, but it must accurately represent the post.
- `date`: Publication date and time.
- `updatedOn`: Last substantive update date and time. For a new post, use the publication time. Update it when revising published content.
- `category`: Primary category slug.
- `categories`: All applicable category slugs, with the primary category first.
- `authors`: One or more slugs from `content/blog/authors/data.json`.
- `cover.image`: Absolute public CDN URL. This field drives blog cards, listing thumbnails, and Open Graph / Twitter metadata. The post-page Hero component does not render it.
- `cover.alt`: Describes the useful content of the cover. Don't start with "Image of."
- `isFeatured`: Set only when the publishing plan calls for featured placement.
- `draft`: Keep `true` while the post isn't ready for listing or publication. Set `false` for publication.
- `seo.title`: Search title. Keep it accurate and avoid keyword stuffing.
- `seo.description`: Search description. It may match `description`.
- `seo.keywords`: Use only researched terms. An empty array is valid.
- `seo.noindex`: Use `true` only when the page should be excluded from search.
- `seo.ogTitle` and `seo.ogDescription`: Social sharing copy. They may match the SEO values.
- `seo.image`: Optional. Many posts include it for parity with `cover.image`, but the site's OG/Twitter pipeline reads `cover.image`, not `seo.image`. Keep both in sync when both are present.

## Consistency checks

- The Markdown filename must match the intended URL slug.
- `category` must appear in `categories`.
- Every author and category slug must already exist in its data file.
- The cover and SEO URLs must return successfully without authentication.
- Put a relevant lead image as the first body element after frontmatter. It may differ from the cover and SEO image.
- Keep title, description, excerpt, and social copy consistent with the published article.
- Don't set future publication claims or dates without an explicit publishing plan.
