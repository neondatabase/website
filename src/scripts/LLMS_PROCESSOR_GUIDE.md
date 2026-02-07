# LLMs Markdown Processor - Developer Guide

This guide documents the MDX-to-markdown processor for LLM consumption.

## Overview

The processor converts MDX documentation files into clean markdown that AI agents can understand. It:
- Parses MDX using the unified/remark ecosystem (AST-based)
- Transforms MDX components into plain markdown equivalents
- Preserves standard HTML elements like `<details>`
- Converts relative URLs to absolute
- Adds an index pointer and navigation footer to every page
- Uses zero new dependencies (leverages existing transitive deps: `unified`, `remark-parse`, `remark-mdx`, `remark-gfm`, `unist-util-visit`, `mdast-util-to-markdown`, `mdast-util-mdx`, `mdast-util-gfm`, plus direct deps `gray-matter` and `js-yaml`)

This is an **isolated post-build script** -- no changes to React components. A more integrated approach (Markdown as a first-class render target in the component layer) is a potential next step as AI agent traffic grows.

## Files

- `process-md-for-llms.js` - Main processor (MDX -> markdown), includes navigation map/footer
- `process-md-for-llms.test.js` - Vitest unit tests
- `generate-llms-index.js` - Generates `llms.txt` Table of Contents (output: `public/docs/llms.txt`)
- `copy-md-content.js` - Postbuild entry point that calls the processor
- `compare-md-conversion.js` - Dev tool for comparing single file conversions
- `generate-legacy-llms-output.js` - Dev tool: generates `public/llms/` in old flat `.txt` format for comparison
- `generate-llms-redirect-map.js` - One-time script: generated the legacy `/llms/*.txt` redirect map
- `../utils/llms-redirect-map.json` - Static redirect map (committed, maps 493 old `.txt` filenames to canonical `.md` URLs)

## Architecture

### Build Pipeline

```
npm run build
    |
postbuild: copy-md-content.js
    | calls processAllContent(CONTENT_ROUTES)
    |
buildNavigationMap(rootDir)       <-- parses navigation.yaml files once
    | for each MDX file:
    |-- gray-matter (extract frontmatter)
    |-- unified + remark-parse + remark-gfm + remark-mdx (parse to AST)
    |-- remarkTransformMdxComponents (transform MDX nodes)
    |-- remarkCleanCodeBlocks (remove shouldWrap, Shiki annotations)
    |-- remarkAbsoluteUrls (convert /docs/... to https://neon.com/docs/...)
    |-- toMarkdown (serialize back to markdown)
    |-- Add index pointer + navigation footer
    |-- Write to public/md/{route}/{slug}.md
    |
Build verification (fail if 0 files generated)
    |
postbuild: generate-llms-index.js
    |
Write public/docs/llms.txt
```

`CONTENT_ROUTES` from `src/constants/content.js` (docs, docs/changelog, postgresql, use-cases, guides, branching, programs) drives the processor, rewrites, middleware, and index generator.

### Runtime: How Agents Access Content

All paths serve from the same source: `public/md/`.

- **Explicit `.md` URL**: `GET /docs/guides/prisma.md` -> `next.config.js` rewrite (`afterFiles`) -> `public/md/docs/guides/prisma.md`
- **User-Agent detection**: `GET /docs/guides/prisma` with AI User-Agent -> `middleware.js` -> `isAIAgentRequest()` -> fetch from `/md/docs/guides/prisma.md`
- **Legacy redirect**: `GET /llms/guides-prisma.txt` -> middleware -> `llms-redirect-map.json` lookup -> 301 to `/docs/guides/prisma.md`
- **Discoverability**: HTML pages include `<link rel="alternate" type="text/markdown" href="...">` via `markdownPath` in `getMetadata()` (`src/utils/get-metadata.js`)
- **llms.txt**: Served at both `/docs/llms.txt` (canonical, `public/docs/llms.txt`) and `/llms.txt` (via rewrite)

## Page Structure

Each processed markdown file has this structure:

```markdown
# Title (from frontmatter)

Subtitle (from frontmatter, if present)

> Summary (from frontmatter `summary` field, if present)

> **Documentation Index**
> A complete list of all documentation pages is at: https://neon.com/docs/llms.txt
> Refer to this index to find and navigate available topics.

[converted content body...]

---

## Related docs (Section Name)

- [Sibling Page](https://neon.com/docs/path/to/sibling)
- [Another Sibling](https://neon.com/docs/path/to/other)
```

The **navigation footer** is built from `content/docs/navigation.yaml` and `content/postgresql/navigation.yaml`. The current page is omitted, only immediate siblings are shown, and URLs use standard format (no `.md`). Pages not in `navigation.yaml` get no footer.

## Component Handlers

Handlers are defined in `componentHandlers` in `process-md-for-llms.js`. Each receives an AST node and returns `null` (remove), a node (replace), or an array of nodes.

### Patterns for adding handlers:

1. **Ignore (UI-only)**: Add to `IGNORED_COMPONENTS` array at the top of the file
2. **Extract children (wrapper)**: Return `node.children`
3. **Transform to markdown**: Build and return MDAST nodes using `getAttr()`, `childrenToMarkdown()`, etc.
4. **Find nested JSX**: Use `findJsxElements(node, 'a')` to find child elements before transformation
5. **Shared content**: Add to `SHARED_CONTENT_COMPONENTS` map (template loaded from `content/docs/shared-content/`)
6. **Dot-notation**: Use quoted key: `'Parent.Child'(node) { ... }`

Handler results are **recursively transformed**, so returned children containing nested MDX components will be processed automatically.

See existing handlers in the code for examples of each pattern.

### Component Reference

**Transform components** (MDX -> markdown):

| Component | Output |
|-----------|--------|
| Admonition | `**Type:** content` (handles camelCase like `comingSoon` -> `Coming Soon`) |
| CodeTabs | `Tab: label` + code blocks |
| Tabs/TabItem | `Tab: label` + content (labels from parent Tabs) |
| Steps, InfoBlock, DefinitionList, TestimonialsWrapper, FeatureList | Container -- extracts children |
| DetailIconCards | Bullet list with links and descriptions |
| TechCards | Bullet list using `title` attribute (self-closing `<a>` elements) |
| DocsList | Title + bullet list (handles nested `<a>` and `<p>`) |
| CheckList/CheckItem | Heading + checkbox items (CheckList collects items into single list via `buildCheckItem` helper) |
| ExternalCode | Fetches from GitHub, wrapped in code block (5s timeout, 1 retry, graceful fallback) |
| TwoColumnLayout.* | Section headings with method signatures |
| LinkPreview | Link with optional preview text |
| MegaLink | `**tag** title [Learn more](url)` |
| QuoteBlock | Blockquote with attribution |
| Testimonial | Blockquote with author name/company |
| YoutubeIframe | `Watch on YouTube: url` |
| CommunityBanner | Text + link |
| PromptCards | List of AI coding prompt links |
| CTA | Title, description (HTML links converted via `parseHtmlWithLinks`), command, button link |
| ProgramForm | Hardcoded text for form types |

**Shared content components** (load templates from `content/docs/shared-content/`):
FeatureBeta, FeatureBetaProps (`{feature_name}`), AIRule (`{name}`), EarlyAccess, EarlyAccessProps, MCPTools, LinkAPIKey, LRNotice, ComingSoon, PrivatePreview, PrivatePreviewEnquire, PublicPreview, LRBeta, MigrationAssistant, NextSteps, NewPricing

**HTML elements**: `<a>` -> markdown link (wrapped in paragraph when block-level), `<details>/<summary>` -> preserved as HTML, `<p>` -> paragraph, `<br/>` -> preserved

**Ignored (UI-only)**: CopyPrompt, NeedHelp, Comment, Video, UserButton, RequestForm, Suspense, SqlToRestConverter, LogosSection, ComputeCalculator, UseCaseContext

**Unknown components**: Components with children become `**[ComponentName]:** content`. Self-closing components get attributes extracted as `name: value` pairs. Warning logged to console.

**Code block cleaning**: Strips `shouldWrap`, Shiki annotations (`// [!code ++]` etc.), preserves `filename="..."`.

### Serialization options

Configured in `getMarkdownOptions()`: GFM table serialization via `gfmToMarkdown()`, underscores for emphasis (`_text_`), `---` for horizontal rules, `listItemIndent: 'one'` for compact list markers, trailing spaces for hard line breaks, custom text handler that uses `state.safe()` inside table cells (for pipe escaping) but returns raw `node.value` elsewhere (to prevent over-escaping), smart quotes normalized to straight quotes.

## llms.txt Index

`generate-llms-index.js` scans `CONTENT_ROUTES`, extracts title/subtitle from frontmatter, and generates a Table of Contents with canonical `.md` URLs. Large sections are collapsed via `COLLAPSED_ROUTES` to keep the index concise (~500 entries instead of ~1300): `docs/changelog`, `postgresql`, and `guides` each become a single entry under "Additional Resources".

## Middleware & Agent Detection

`src/utils/ai-agent-detection.js` detects AI agents by Accept header (`text/markdown`) and User-Agent patterns (`chatgpt`, `openai`, `claude`, `anthropic`, `cursor`, `windsurf`, `perplexity`, `copilot`, `axios`, `got`). The middleware has layered error handling (outer try-catch, inner try-catch for fetch, 404 fallback to HTML).

Some routes serve HTML even to agents (`EXCLUDED_ROUTES` in `src/constants/content.js`): `docs/changelog`, `guides` (index only), `branching` (index only), and specific use-cases. These are **exact matches** -- `/guides` is excluded but `/guides/metabase-neon` is not.

## Legacy /llms/*.txt Redirects

`src/utils/llms-redirect-map.json` is a static, committed map of 493 old flat filenames to canonical `.md` URLs. Middleware performs 301 redirects for matches; non-matches 404. No new `.txt` files will ever be created. The map was generated once by `generate-llms-redirect-map.js`.

## Build & Verification

Postbuild (`package.json`): `copy-md-content.js && generate-llms-index.js && next-sitemap...`

The processor verifies files were generated in `processAllContent()` -- if zero `.md` files exist in the output directory, the build fails with `process.exit(1)`.

Output goes to `public/md/` (gitignored), served via rewrites (`/docs/x.md` -> `/md/docs/x.md`) and middleware (AI agents hitting `/docs/x`).

## Gotchas

1. **ESM dependencies**: The unified ecosystem uses ESM. Use dynamic `import()` in `loadDependencies()`.
2. **Over-escaping**: Default `toMarkdown` escapes special characters. Fixed with custom text handler that returns `node.value` directly, except inside table cells where `state.safe()` is used so `|` is escaped as `\|`.
3. **childrenToMarkdown must share options**: Otherwise content inside components (like Admonitions) gets over-escaped.
4. **Don't use visit() + splice()**: Causes inconsistent behavior. Use recursive `transformNode()` + `transformChildren()` instead.
5. **HTML elements are MDX JSX**: `<details>`, `<a>`, etc. are parsed as `mdxJsxFlowElement`/`mdxJsxTextElement`, not HTML. Handle them in `componentHandlers`.
6. **Anchor links need pageUrl**: To resolve `#section` to a full URL, `pageUrl` must be threaded through the processing chain.
7. **Tab labels live on parent**: `<Tabs labels={[...]}>` has the labels, `<TabItem>` children don't. Handler must assign by index.
8. **Nested components need recursive transform**: When a handler returns `node.children`, those may contain more MDX components. The `transformNode` function recursively transforms results.
9. **Self-closing components have no children**: Components like `<MegaLink ... />` have attributes only. The unknown component handler extracts attributes for these.
10. **Shiki annotations**: `// [!code ++]` etc. are stripped by `remarkCleanCodeBlocks`.
11. **Relative URLs without leading slash**: `subdir/page` is resolved relative to the current page's parent directory.
12. **TechCards vs DetailIconCards**: TechCards use self-closing `<a>` with `title` attribute for link text; DetailIconCards use `<a>` children.
13. **Navigation YAML has two patterns**: Both `navGroup.items` and `navGroup.subnav` exist in different sections.
14. **Handler results are recursively transformed**: This enables nested components (like `<DocsList>` inside `<InfoBlock>`) to work, and allows handlers to access original JSX elements (like `<a>` attributes) before transformation.
15. **Flow vs phrasing content**: Handlers that return inline nodes (like `link`) must wrap them in a `paragraph` when the source was a block-level element (`mdxJsxFlowElement`). Otherwise `toMarkdown` merges the content with surrounding nodes onto one line. Check `node.type === 'mdxJsxFlowElement'` to decide.
16. **Generated lists need `spread: false`**: Lists created by handlers (DetailIconCards, TechCards, DocsList, PromptCards) should set `spread: false` to avoid blank lines between items.
17. **GFM tables**: `remark-gfm` is needed so tables are parsed into proper AST nodes. Without it, tables are plain text and `\|` escapes are consumed by the parser as backslash escapes, breaking table columns.

## Testing & CLI

```bash
# Unit tests
npm run test:unit
npm run test:unit -- src/scripts/process-md-for-llms.test.js

# Process single file to stdout
node src/scripts/process-md-for-llms.js --file content/docs/guides/prisma.md

# Process all (production build)
node src/scripts/process-md-for-llms.js --all

# Compare single file conversion
node src/scripts/compare-md-conversion.js prisma

# Generate legacy format for bulk diff
node src/scripts/generate-legacy-llms-output.js && git diff public/llms/

# Verify after build (dev server on port 3001)
curl -I -s http://localhost:3001/docs/get-started/connect-neon.md | grep "200 OK"
curl -H "User-Agent: Cursor" -s http://localhost:3001/docs/get-started/connect-neon | head -5
curl -s http://localhost:3001/llms.txt | head -5
```

## Known Issues

- Near-empty files for `docs/shared-content/*` (template snippets, not standalone pages)
- Near-empty `docs/changelog.md` (content is dynamic, already excluded from serving)
- AI summary generation not implemented (would require OpenAI API)
- SDK components (SdkStackApp, etc.) not implemented (legacy StackAuth, not needed)
- ~1,400 files process in ~8 seconds
