# Operation page smoke checklist

Manual verification gate for changes to the read-only API operation page:
`api-operation.jsx` → `OperationDoc`, `DocQuickStart`, `DocBodySection`,
`operation-response.jsx`, and the right-rail table of contents (`operation-toc.js`).
Run this on a local `npm run dev` against the four pages below before merging.

The shipped operation page is read-only documentation. There are no editable
fields, no live-updating command block, and no interface tabs. Examples are
prebuilt by the generator and copyable.

> The older interactive editor stack (`operation-client.jsx`, `operation-body.jsx`,
> `operation-params.jsx`, the depth/reset controls, and the `store.js` state surface)
> is preserved in the tree but is **not** rendered on operation pages. If you revive
> it, derive a separate checklist for that path. The items below do not cover it.

## Pages under test

Each page exercises a distinct shape. Together they cover the behavior surface of
the read-only page.

| Slug                                                | Why it's in the checklist                                                       |
| --------------------------------------------------- | ------------------------------------------------------------------------------- |
| `/docs/reference/api/projects/create-project`       | Rich nested body, grouped section cards, representative example, large response  |
| `/docs/reference/api/projects/list-projects`        | Query params, no request body, CLI + SDK pills, table output                    |
| `/docs/reference/api/branches/update-project-branch`| Multi-command CLI snippet (`rename` + `set-expiration`)                          |
| `/docs/reference/api/users/get-current-user-info`   | Minimal shape: GET, no body, no path params                                     |

## Per-page checks

Run each numbered check on each page where it applies.

1. **Header.** Method badge and path render. `stability` / `deprecated` tags show
   when present; a deprecated operation shows the deprecation note (and the sunset
   date when set). Summary, description, and the `Auth: Bearer token required` line
   appear.

2. **Quick start (REST first).** The REST API `curl` card renders first with a
   working Copy button (shows "Copied" for ~1.8s, then reverts; paste to confirm the
   right content). On `create-project`, the example uses representative seed values
   rather than bare placeholders.

3. **"Also available in" pills.** CLI / SDK / MCP / Console pills appear only for
   interfaces that have data. Clicking a pill swaps the secondary code card and sets
   the pressed state (`aria-pressed`). Copy works on the swapped card.
   `get-current-user-info` shows SDK and CLI (`neon me`) but no body-derived content.

4. **Parameters.** On pages with parameters (`list-projects`,
   `update-project-branch`), the Parameters section lists each one read-only with a
   type badge, default (if any), and description. Nothing is editable.

5. **Request body.** On `create-project` / `update-project-branch`: the required
   summary reads correctly — it lists the required leaf fields ("N required ...") or
   states no field is required (and whether an empty body is valid). Grouped section
   cards render when the operation is configured in `field-group-config.mjs`,
   otherwise a flat field tree renders. Each field row shows a type badge, enum
   pills, default, and description. Cards and nested fields expand/collapse via the
   chevron and toggle `aria-expanded` / `aria-controls`.

6. **Response.** On pages with a response, the Schema / Example toggle works: Schema
   renders the tree with type badges; Example renders highlighted JSON. The response
   Copy button works.

7. **Errors.** When present, the Errors section lists each status code with its
   description.

8. **On this page (TOC).** The right-rail table of contents lists only sections that
   actually render (Quick start, Parameters, Request body, Response, Errors as
   applicable) and each anchor scrolls to its heading. Confirm `request-body` is
   absent on `get-current-user-info` (no body).

9. **No regressions.** No browser console errors on load or interaction, and nothing
   on the page is editable.

## Output format issues to watch for

- Multi-command CLI (`update-project-branch`): the CLI pill shows two commands, each
  prefixed with a `# <name>` comment line.
- CLI table output (`list-projects`) and long `curl` lines wrap or fit without
  breaking layout at a 1280px viewport.
- JSON syntax highlighting in response examples reads cleanly in both light and dark
  mode.
- MCP snippet renders as a JSON tool call with representative seed values, falling
  back to `$PLACEHOLDER` for required arguments without a seed.

## When to re-run this checklist

- Before merging any change to `api-operation.jsx`, `operation-doc.jsx`,
  `doc-quick-start.jsx`, `doc-body.jsx`, `operation-response.jsx`,
  `operation-shared.jsx`, `operation-toc.js`, or `field-label.js`.
- Before merging any change to `src/utils/api-ref.mjs` (the curl / CLI / SDK command
  builders) or to the example/section output in `scripts/generate-api-ref.mjs`.
- Before merging any change to the structure of `src/data/api-ref/*.json` (the
  generator output the page consumes).

If the request body renders wrong, the issue is usually in `doc-body.jsx` or the
generator's `sections` / `labels` output. If a pill is missing or its snippet is
wrong, look at `availableExamples` in `doc-quick-start.jsx` and the matching builder
in `api-ref.mjs`. If the TOC is out of sync, check `buildOperationToc` in
`operation-toc.js`.
