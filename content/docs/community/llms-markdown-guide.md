---
title: Getting Neon docs as Markdown
subtitle: How to get our documentation as plain Markdown for LLMs, tools, and scripts
summary: >-
  Describes how to request Neon documentation as Markdown (including for LLMs), how to discover
  content via the llms.txt index, how it's generated, and what we add to each page.
enableTableOfContents: true
updatedOn: '2026-02-17T22:07:33.079Z'
---

Neon provides its documentation in plain Markdown so that LLMs, API clients, and scripts can consume it easily. We follow the [llms.txt](https://llmstxt.org/) approach: same URLs as the website, with Markdown available when requested.

## How to get Markdown

You can get Markdown by requesting it explicitly: use the same docs URL with an `Accept` header, or append `.md` to the path.

1. **Same URL, request Markdown:** Use the same path you would use in a browser (for example, `/docs/connect/choose-connection`). Send an `Accept: text/markdown` or `Accept: text/plain` header, or make the request with a user agent string associated with ChatGPT, Claude, Cursor, etc. We respond with the Markdown version of that page. For example:

   ```bash
   curl -H "Accept: text/markdown" https://neon.com/docs/connect/choose-connection
   ```

2. **Append `.md` to the path:** Request the URL with `.md` at the end. For example:
   - HTML: https://neon.com/docs/connect/choose-connection
   - Markdown: https://neon.com/docs/connect/choose-connection.md

Whether you use the `Accept` header or the `.md` extension, you get the same Markdown output.

### Why not serve the source MDX?

Our docs are authored in MDX (Markdown plus components) and stored in the [neon-website](https://github.com/neondatabase/website/tree/main/content/docs) repository. If you read those source files directly, custom components and shared snippets can obscure the content or leave it incomplete (for example, a component might inject text that does not appear inline in the file).

The Markdown we serve is built from that MDX and gives you a single, flat page with all content in place. This is why we serve plain Markdown over the raw MDX.

## Finding content: the index

A full table of contents is available at:

- https://neon.com/docs/llms.txt (canonical)
- https://neon.com/llms.txt (also serves the same file)

The index lists our doc pages with titles and links. Use it to discover URLs or to feed a list of pages into your tool.

## What you get on each page

Each Markdown page is plain Markdown (no interactive components or JSX). We add a bit of structure so that consumers know where they are and what to read next:

- **At the top:** A short block with the page location in the doc tree (e.g. `Connect > Choose a connection`) and a link to the full index (llms.txt). That gives context and a way to jump to the full catalog.

- **Body:** The main content, converted from our source format into standard Markdown (headings, links, code blocks, lists, etc.).

- **At the bottom:** A "Related docs" section with links to sibling pages in the same section, which is visible in the HTML version in the navigation bar. That helps with discovery and follow-up reading.

Each URL gives you the page content plus lightweight navigation and discovery.

## Headers and discovery metadata

We set a number of headers on our doc responses. These are the ones relevant to Markdown discovery and retrieval:

- `<link rel="alternate" type="text/markdown" href="...">`: Each HTML doc page includes this tag in the head, so agents can discover the Markdown URL without knowing about `.md` or `Accept` header conventions.
- `X-Robots-Tag: noindex`: Markdown responses include this header so search engines don't index them alongside the HTML versions.
- `X-LLMs-Txt` and `Link: rel="llms-txt"`: HTML doc responses include these headers pointing to `/docs/llms.txt` (an index of all docs as Markdown URLs), so agents can find the index from any page without parsing HTML. We adopted this convention from [Mintlify](https://mintlify.com).

## Summary for agents

| Goal                        | What to do                                                                                                     |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Get one page as Markdown    | Request the HTML docs URL with `Accept: text/markdown` or append `.md` to the URL                              |
| Get the full list of docs   | https://neon.com/docs/llms.txt                                                                                 |
| Understand page context     | Read the short block at the top of each Markdown page (location + index link)                                  |
| Find related pages          | Use the "Related docs" section at the bottom of each page                                                      |
| Discover Markdown from HTML | Look for `<link rel="alternate" type="text/markdown" href="...">` in the page head, or the `X-LLMs-Txt` header |
