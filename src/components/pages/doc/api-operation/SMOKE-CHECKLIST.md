# Operation page smoke checklist

Manual verification gate for any change to the operation-client component (and its
post-split successors). Run this on a local `npm run dev` against all four pages
below before merging.

Each page exercises a distinct interaction pattern — together they cover the
full behavior surface of `OperationClient`. If any interaction misbehaves, the
change is not ready to ship.

## Pages under test

| Slug                                                      | Why it's in the checklist                                          |
| --------------------------------------------------------- | ------------------------------------------------------------------ |
| `/docs/reference/api/projects/create-project`             | Rich nested request body, large response schema, all 4 interfaces  |
| `/docs/reference/api/projects/list-projects`              | CLI table output, no request body, all 4 interfaces                |
| `/docs/reference/api/branches/update-project-branch`      | Multi-command CLI (`rename` + `set-expiration`), uncovered fields  |
| `/docs/reference/api/users/get-current-user-info`         | Minimal shape: GET, no body, no path params                        |

## Per-page interaction matrix

Run each numbered interaction on each page in order. Don't skip — a couple of
items only fail on specific shapes (e.g. multi-command CLI rendering, table
output for list endpoints).

1. **Interface tab switching.** Click each of api / cli / sdk / mcp / console tabs
   in turn. For tabs marked unavailable (greyed), the fallback card appears with
   the curl equivalent (api/sdk/cli/mcp) or Neon Console breadcrumb prompt
   (console).

2. **Body field editing.** On a page with a request body (`create-project`,
   `update-project-branch`): click a value next to a body field, type something,
   blur (or press Enter). The live curl/TypeScript/CLI block at the top updates
   to include the typed value. The "Live from your edits" green badge shows in
   the live-block header.

3. **Optional checkbox include.** Same pages: tick the checkbox next to an
   optional body field. The field appears in the live block (with `null` if
   no schema default exists, or the default value if one does).
   This previously crashed in production with `null.trim()` — verify no
   console error.

4. **Path parameter editing.** Click a path param value (e.g. `<project_id>`).
   Type a value. The live block reflects it. Reload the page — the value is
   preserved (sessionStorage).

5. **Cross-page param persistence.** On `create-project`, fill in a value for
   `org_id` (if present) or any path param. Navigate to `get-project` via
   sidebar — the value pre-fills. Navigate to `list-projects` — the value is
   gone (list endpoints don't share these params). Reset and verify.

6. **Depth control.** On a page with deep nesting (`create-project` body):
   click the depth +/- control. The tree opens/closes the expected number of
   levels.

7. **Reset buttons.** Click each visible Reset button (body, params, cli).
   State clears, the live block reverts to the default, edit-count badges
   disappear, "Live from your edits" badge clears.

8. **Copy buttons.** Click each Copy button (live block, body JSON, response
   JSON). The button shows "✓ Copied" for ~1.8s then reverts. Paste somewhere
   to confirm the right content was copied.

9. **Response Schema/Example tabs.** On a page with a response (`create-project`,
   `list-projects`): toggle between Schema and Example tabs. Schema renders the
   tree with type badges; Example renders the JSON with syntax highlighting.

10. **CLI multi-command rendering.** Only on `update-project-branch`: the CLI
    tab shows TWO commands (`neon branches rename` and `neon branches
    set-expiration`) each with their own flag list. The "No CLI equivalent"
    section lists `protected` (the uncovered field). The collapsible
    `+ N global options` row at the bottom expands on click.

11. **Session-identity globals.** Cross-page params from
    `src/data/api-ref/cross-page-params.json` (build-derived; currently 14
    names including `project_id`, `org_id`, `branch_id`, `database_name`,
    `role_name`, etc.) behave as ONE value per session — type once anywhere,
    see it everywhere.
    Walk each sub-scenario, then clear sessionStorage between scenarios
    via DevTools so they don't bleed.

    **Sub-scenario A — single-page unification.** On `list-projects`:
    type `--org-id rough-scene-12345678` on the CLI tab. Switch to the API
    tab — the `org_id` query param shows the same value. Type a different
    value on the API tab — switch back to CLI — `--org-id` reflects the
    new value. (Body field unification is exercised in scenario E since
    list-projects has no body.)

    **Sub-scenario B — cross-page unification.** Continuing from A: navigate
    to `create-project`. CLI tab's `--org-id` shows the value from list-
    projects. Body field `project.org_id` shows the same value. Navigate
    to `get-organization` — the `org_id` path param pre-fills.

    **Sub-scenario C — reset cascade.** On any page with org_id surfaces:
    click Reset on the CLI section. Reload the page — `--org-id` is empty
    AND the API tab shows empty AND any body field with `project.org_id`
    is empty. Re-set, then Reset on the Body section: same cascade. Re-set,
    Reset on the Params section: same. Each section's Reset clears global
    state for fields it can touch; per-op-only fields stay scoped.

    **Sub-scenario D — per-op flags don't leak.** Type `--cursor abc123`
    on `list-projects` CLI tab (cursor is NOT a cross-page global, it's
    per-op). Reload page — `--cursor abc123` restored. Navigate to
    `list-shared-projects` — its `--cursor` is empty. Navigate back to
    `list-projects` — `abc123` still there.

    **Sub-scenario E — body field unification.** On `create-project`: type
    a value into the `project.org_id` body field. Switch to CLI tab —
    `--org-id` reflects it. Navigate to `list-projects` — both the API
    `org_id` param AND the CLI `--org-id` flag pre-fill. Inverse direction
    also works: type on `list-projects`, the body field on `create-project`
    pre-fills. Bare-`id` case: on any op whose request body contains a bare
    `id` field (e.g. `update-project-branch`), that field syncs with the
    resource's global (e.g. `branch_id`).

    **What WON'T unify** (intentional carveouts):
    - Body fields under arrays (e.g. `branches[].project_id`) stay per-op.
    - Body fields whose leaf name isn't one of the 14 derived globals.
    - Bare `id` fields on ops whose tag isn't in the resource map
      (projects/branches/endpoints/snapshots/organizations).

## Output format issues to watch for

- CLI table output (`list-projects`): the ASCII table fits without horizontal
  scroll on a 1280px viewport, headers align.
- JSON syntax highlighting: keys cyan-ish, strings orange-ish, numbers green,
  booleans/null blue.
- MCP description: `<workflow>`, `<important_notes>` etc. render as labeled
  sections with numbered or bulleted items. Code blocks (from `<example>`)
  render in a monospace box.
- No browser console errors at any point.

## When to re-run this checklist

- Before merging any PR that touches `operation-client.jsx`, `operation-body.jsx`,
  `operation-params.jsx`, `operation-cli.jsx`, `operation-cli-multi.jsx`,
  `operation-response.jsx`, `operation-mcp.jsx`, `operation-shared.jsx`, or
  `store.js` (the api-operation state surface).
- Before merging any PR that touches `src/utils/api-ref.mjs` (the curl/CLI/SDK
  command builders).
- Before merging any change to the structure of `src/data/api-ref/*.json`
  (the generator output the component consumes).

If interactions 2, 3, or 4 fail, the bug is almost certainly in body or param
state lifting. If interaction 10 fails, the bug is in CLI multi-command rendering
or the `cliCommands` / `multiCmdGlobalFlags` derivation. If interaction 5 fails,
the bug is in `store.js`'s persist/rehydrate path or selector wiring.
