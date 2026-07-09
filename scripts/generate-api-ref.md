# API Reference

Build pipeline and UI for the [Neon Management API reference](https://neon.com/docs/reference/api). Generates per-operation pages from the live OpenAPI spec and enriches them with neonctl, MCP, and Console coverage data.

## Quick links

- **Generator entry point:** [`scripts/generate-api-ref.mjs`](generate-api-ref.mjs)
- **Output/filesystem helpers:** [`scripts/lib/api-ref-output.mjs`](lib/api-ref-output.mjs)
- **Coverage builder:** [`scripts/build-coverage-data.mjs`](build-coverage-data.mjs) (run on upstream releases)
- **Spec audit:** [`scripts/audit-api-spec.mjs`](audit-api-spec.mjs) — run manually with `npm run audit:api-ref`
- **Request-body grouping:** [`scripts/field-group-config.md`](field-group-config.md) — editorial sections for the request body (`npm run audit:field-groups`)
- **Read-only operation UI:** [`src/components/pages/doc/api-operation/`](../src/components/pages/doc/api-operation/) (`ApiOperation`, `OperationDoc`, `DocQuickStart`, `DocBodySection`, response/errors, and TOC)
- **Manual UI verification:** [`SMOKE-CHECKLIST.md`](../src/components/pages/doc/api-operation/SMOKE-CHECKLIST.md)

## What it produces

| Output                             | Path                                              | Committed       |
| ---------------------------------- | ------------------------------------------------- | --------------- |
| Per-operation JSON (React data)    | `src/data/api-ref/{tag}/{slug}.json`              | No (gitignored) |
| API index Markdown                 | `public/md/docs/reference/api.md`                 | No (gitignored) |
| Per-operation Markdown (agent/LLM) | `public/md/docs/reference/api/{tag}/{slug}.md`    | No (gitignored) |
| Per-tag Markdown (tag overview)    | `public/md/docs/reference/api/{tag}.md`           | No (gitignored) |
| `llms.txt` index                   | `public/docs/reference/api/llms.txt`              | No (gitignored) |
| `llms-full.txt` (all ops)          | `public/docs/reference/api/llms-full.txt`         | No (gitignored) |
| Navigation YAML (sidebar)          | `content/docs/api-navigation.yaml`                | **Yes**         |

Navigation YAML is committed because it drives the sidebar and must be in the repo before `next build` reads it. Everything else is regenerated on every build.

## Running locally

```bash
npm run generate:api-ref     # one-shot
npm run dev                  # runs the generator first via `predev`
npm run build                # runs the generator first via `prebuild`
```

Or with a custom spec URL:

```bash
node scripts/generate-api-ref.mjs https://neon.com/api_spec/release/v2.json
```

## How it runs on Vercel

No special Vercel configuration is needed. The generator is wired into `prebuild` in `package.json`:

```text
prebuild → node scripts/generate-api-ref.mjs && (other site generators) && check:* validators
build    → next build
postbuild → copy generated md to /public + build llms.txt index + sitemaps
```

Vercel runs `npm run build`, which triggers `prebuild` first. The generator fetches `https://neon.com/api_spec/release/v2.json` over the network; Vercel allows outbound HTTPS by default, so no env vars or build-image tweaks are required.

After a successful generation run, the generator writes the validated spec to `.next/cache/api-reference/openapi-v2.json`. If the live fetch fails, it uses that cache only when it is fresh (default: 7 days). If the cache is missing or stale, the generator throws and the build fails fast. Override the cache path with `API_REF_SPEC_CACHE_PATH` and the TTL with `API_REF_SPEC_CACHE_TTL_MS` when needed.

`prebuild` also runs `npm run check:api-ref-nav` after generation. If the regenerated `content/docs/api-navigation.yaml` differs from the committed file, the build fails with a diff. Run `npm run generate:api-ref`, review the nav change, and commit it.

**Recovery:** check the Vercel build log for the HTTP error code, verify `https://neon.com/api_spec/release/v2.json` is reachable (open in a browser or `curl -I`), then trigger a redeploy. No code changes are needed for a transient outage.

## How it works

```text
OpenAPI spec (neon.com/api_spec/release/v2.json)
  └─ Dereferenced via @scalar/openapi-parser
       └─ buildOperationData()          — normalises each operation
            ├─ mergeParams()             — path-level + op-level params
            ├─ flattenAllOf()            — collapses allOf schemas
            ├─ toCurlExample()           — generates curl snippet
            ├─ toTypescriptExample()     — generates SDK snippet
            ├─ buildCliFlags()           — maps neonctl flags ↔ API params
       ├─ JSON files  → src/data/api-ref/{tag}/{slug}.json
       ├─ MD files    → toAgentMarkdown() → public/md/...
       ├─ llms.txt    → toLlmsTxtLine()
       └─ nav YAML    → toNavYaml() → content/docs/api-navigation.yaml

File reads, temp directories, atomic swaps, and final writes live in
[`api-ref-output.mjs`](lib/api-ref-output.mjs). Keep the entry point focused on
spec parsing and operation transformation.
```

The React UI in [`src/components/pages/doc/api-operation/`](../src/components/pages/doc/api-operation/) reads the per-op JSON and renders a read-only, API-first operation page:

- `DocQuickStart` shows the REST curl example first, then optional CLI, SDK, MCP, and Console examples as secondary pills.
- `DocBodySection` renders grouped request-body cards from `requestBody.sections`, with `requestBody.labels` for friendly field titles and defaults.
- `ResponseSection` and the errors block render documentation-style response details.
- `operation-toc.js` builds the right-rail TOC from sections that actually render.

The shipped operation-page UI is read-only and API-first. It does not include the earlier interactive request editor prototype.

## Committed inputs (under `scripts/data/`)

These files are read by the generator and must be in the repo. Some are hand-curated; some are produced by `build-coverage-data.mjs` and reviewed before commit.

| File                       | Maintained by                  | Purpose                                                        |
| -------------------------- | ------------------------------ | -------------------------------------------------------------- |
| `tag-config.json`          | Humans                         | Tag order, display names, descriptions, groupings, overrides   |
| `console-breadcrumbs.json` | Humans                         | `operationId` → Neon Console UI path (e.g. "Project > Branches") |
| `response-examples.json`   | Humans                         | Per-op response example overrides when the spec example is poor |
| `cli-table-output.json`    | Humans                         | Captured `neonctl ... list` table snippets for the CLI tab. **Entirely manual — no automated capture.** Re-run the relevant `neonctl ... list` commands after each neonctl release and update this file by hand. Each entry should include a comment noting the neonctl version it was captured from so staleness is detectable. |
| `cli-coverage.json`        | `build-coverage-data.mjs`      | `operationId` → `neonctl` command (parsed from neonctl source) |
| `mcp-coverage.json`        | `build-coverage-data.mjs`      | `operationId` → MCP tool name (parsed from mcp-server-neon)    |
| `mcp-tool-definitions.json`| `build-coverage-data.mjs`      | MCP tool descriptions + argument schemas                       |
| `cli-global-flags.json`    | Humans (rare)                  | Global neonctl flags (`--help`, `--api-key`, ...); imported by both the generator and the UI |
| `neonctl-command-files.json` | Humans (rare)                | Shared neonctl command source list used by CLI coverage and schema generation |

Additional manual exception lists (small, inline) live near the top of `build-coverage-data.mjs` (`CLI_MANUAL`) and `generate-api-ref.mjs` for cases where the heuristics need a nudge.

## Maintenance

### When the OpenAPI spec changes

The generator fetches the spec fresh on every build, so most spec changes ship on the next Vercel deploy with no action. The spec is the source of truth for operation structure, field order, types, defaults, enums, descriptions, the `deprecated` flag, and which fields are required. The committed config files (`tag-config.json`, `field-group-config.mjs`, `console-breadcrumbs.json`, `response-examples.json`, coverage data) only enrich and organize; they never gate rendering. The only committed generator output is `content/docs/api-navigation.yaml`, so changes that add or remove pages or sections require committing the regenerated nav file.

What happens for the common kinds of spec drift:

| Spec change | Ships automatically? | Human action |
| --- | --- | --- |
| New endpoint | Yes. Generates its own page, markdown, llms entry, and nav entry. Request body renders as the flat read-only tree (no editorial section cards) with generated curl + SDK examples. | Commit the regenerated `api-navigation.yaml`. Optional polish: add a `FIELD_GROUPS` entry for grouped cards + a representative `seed`, a `console-breadcrumbs.json` entry, and re-run `build-coverage-data.mjs` so the CLI/MCP pills appear. |
| Endpoint description changed | Yes. Flows into the page, per-op markdown, and llms files. | None. |
| Default value, type, enum, or required-ness changed | Yes. The rendered field rows, type badges, enum pills, and the "N required" summary update from the schema. | Only if a curated example now conflicts: `seed` values in `field-group-config.mjs` and `response-examples.json` overrides do not auto-track the spec. `npm run audit:api-ref` flags schema-invalid examples. |
| New tag (set of endpoints) | Yes, warn-only. `loadTagConfig(schema)` auto-injects a minimal entry (slug/display derived from the raw spec tag name) and the operations appear in nav. The build does not fail. | Add a proper entry to `scripts/data/tag-config.json` for display name, order, description, and groups (see [Adding a new tag](#adding-a-new-tag)), optionally a `content/api-docs/{tag}.md` intro, then commit `api-navigation.yaml`. |

For request-body grouping drift specifically (new/renamed/removed fields on a configured operation), see the table in [`field-group-config.md`](field-group-config.md#spec-drift-what-happens-the-site-build-never-breaks).

### When neonctl releases

```bash
GITHUB_TOKEN=$(gh auth token) node scripts/build-coverage-data.mjs
# inspect git diff scripts/data/cli-coverage.json scripts/data/mcp-coverage.json
git add scripts/data/cli-coverage.json scripts/data/mcp-coverage.json scripts/data/mcp-tool-definitions.json
```

Bump `NEONCTL_VERSION` (or `MCP_VERSION` for mcp-server-neon) at the top of [`build-coverage-data.mjs`](build-coverage-data.mjs) before running. Versions are pinned so re-running is deterministic; an unintended change is a real upstream change worth eyeballing in the diff.

If neonctl adds a new top-level command source file, add it once to
`scripts/data/neonctl-command-files.json`. Both `build-coverage-data.mjs` and
`scripts/docs-checks/neonctl/generate-schema.js` read that list. After updating
coverage, run `npm run check:docs:neonctl` and the generator tests. They include
tripwires for `neon neon-auth` schema coverage and for every `cli-coverage.json`
command resolving to the committed schema.

`GITHUB_TOKEN` is optional but avoids unauthenticated rate limits.

### When the Neon Console UI changes paths

Edit `scripts/data/console-breadcrumbs.json` by hand. Keys are operationIds; values are the breadcrumb shown on the Console tab when no other surface is available.

### When a new resource type ships (e.g. `clusters`)

1. Add a tag entry in `tag-config.json` (see [Adding a new tag](#adding-a-new-tag)).
2. Add or update field grouping only if the request body needs editorial sections instead of the generated flat tree.

### Validating changes

```bash
npm run test:unit:run -- scripts/generate-api-ref.test.js src/components/pages/doc/api-operation/__tests__/doc-body.test.jsx src/components/pages/doc/api-operation/__tests__/doc-quick-start.test.jsx src/components/pages/doc/api-operation/__tests__/operation-doc.test.jsx src/components/pages/doc/api-operation/__tests__/toc.test.js
npm run check:docs:neonctl
npm run audit:field-groups
npm run generate:api-ref
npm run check:api-ref-nav
```

Review generated `content/docs/api-navigation.yaml` separately from UI changes.
It is the only committed generator output and can drift when the upstream spec
changes. `prebuild` fails if the regenerated nav differs from `HEAD`; commit the
updated nav when the diff is expected.

For UI changes, walk [`SMOKE-CHECKLIST.md`](../src/components/pages/doc/api-operation/SMOKE-CHECKLIST.md) against a local `npm run dev`.

### Representative examples and SDK shape

`requestBody.seed` entries from [`field-group-config.mjs`](lib/field-group-config.mjs)
feed `examples.representative.body`, curl, and TypeScript SDK snippets. The
generator redacts password-shaped values and normalizes Postgres connection
strings before examples reach JSON, Markdown, or LLM output.

`toTypescriptExample()` and `buildTs()` mirror the generated
`@neondatabase/api-client` signatures: operations with query params receive one
params object, while path-only operations use positional path params before the
optional request body. Keep this locked with generator tests when upgrading the
SDK or changing example generation.

Per-operation Markdown includes complete response examples. The aggregate
`llms-full.txt` is size-aware and omits oversized response examples with a
pointer back to the per-operation Markdown so one operation cannot dominate the
full corpus.

### Spec audit

Run `npm run audit:api-ref` to generate a Markdown report against the live OpenAPI spec. It surfaces drift (missing examples, schema-invalid examples, parameter gaps) without blocking anything — redirect to a file if you want to save it:

```bash
npm run audit:api-ref > audit-report.md
```

## Tag configuration

Single source of truth: [`scripts/data/tag-config.json`](data/tag-config.json), loaded via [`scripts/lib/tag-config.mjs`](lib/tag-config.mjs). Each tag entry has:

- **`slug`** — URL segment (e.g. `projects`); array order is the display order
- **`specName`** — singular tag name as it appears in the OpenAPI spec (e.g. `project`); omit when it matches `slug`
- **`display`** — human-readable sidebar label
- **`description`** — short description for the API overview grid; omit to hide the tag from that grid
- **`groups`** — optional editorial grouping for the tag's operations on the tag landing page

Plus a top-level `operationOverrides` map for moving specific operations to a different tag than the spec assigns.

The loader fail-hard validates duplicate slugs, overrides pointing at unknown slugs, operation slugs listed in multiple groups, and (when called with the spec) any spec tag not mapped in the config.

## Tag intro pages

Each tag can have an intro file at `content/api-docs/{tag}.md`. This file:

- Appears at the top of the tag overview page (`/docs/reference/api/{tag}`)
- Is prepended to the per-tag agent markdown file
- Uses plain markdown only (no JSX components)

If no intro file exists, the tag overview page shows only the operation list.

## URL structure

Public docs URLs are the contract. The `/md/...` paths are internal static files
that middleware and rewrites fetch to serve markdown variants.

| URL                                          | Content                                      |
| -------------------------------------------- | -------------------------------------------- |
| `/docs/reference/api`                        | Human-facing API overview                    |
| `/docs/reference/api.md`                     | Agent/LLM markdown for the full API          |
| `/docs/reference/api-reference.md`           | Legacy alias to `/docs/reference/api.md`     |
| `/docs/reference/api/reference`              | Human-facing searchable endpoint index       |
| `/docs/reference/api/reference.md`           | Alias to `/docs/reference/api.md`            |
| `/docs/reference/api/{tag}`                  | Tag overview — all operations for the tag    |
| `/docs/reference/api/{tag}.md`               | Agent/LLM markdown for entire tag            |
| `/docs/reference/api/{tag}/{slug}`           | Single operation detail page                 |
| `/docs/reference/api/{tag}/{slug}.md`        | Agent/LLM markdown for one operation         |
| `/md/docs/reference/api.md`                  | Internal static file behind `api.md` routes  |
| `/md/docs/reference/api/{tag}/{slug}.md`     | Agent/LLM markdown for one operation         |
| `/md/docs/reference/api/{tag}.md`            | Agent/LLM markdown for entire tag            |
| `/docs/reference/api/llms.txt`               | One-line index of all operations             |
| `/docs/reference/api/llms-full.txt`          | Full markdown for all operations             |

## Adding a new tag

1. Add an entry to [`scripts/data/tag-config.json`](data/tag-config.json) — at minimum `{ slug, display }`. Add `specName` if the spec uses a different singular form.
2. Run `npm run generate:api-ref`. If a spec tag has no config entry, the loader warns and auto-generates a minimal entry for that run so the build can continue.
3. Optionally add a `description` (replaces the generated fallback text on the overview grid), `groups` (editorial grouping on the tag landing page), and `content/api-docs/{tag}.md` (intro paragraph).
4. Commit the updated `content/docs/api-navigation.yaml`.

## Tests

```bash
npx vitest run
npx vitest run scripts/generate-api-ref.test.js   # generator only
```

Pure transformation helpers (slug generation, param merging, schema flattening, curl/TypeScript example generation, markdown rendering, navigation YAML structure, CLI flag mapping) are covered as unit tests. React component tests under [`src/components/pages/doc/api-operation/__tests__/`](../src/components/pages/doc/api-operation/__tests__/) cover the shipped read-only operation page.
