# Request-body field grouping

Editorial grouping of the API reference request body into display sections
(Basics, Compute, Project settings, Deprecated, ...). Layered on top of the
spec-derived structure: it only decides which section each top-level field
belongs to. Structure, field order, types, descriptions, and the `deprecated`
flag all still come from the OpenAPI spec.

## Files

- **Config + logic:** [`scripts/lib/field-group-config.mjs`](lib/field-group-config.mjs)
  (`FIELD_GROUPS` map + the pure `computeFieldGroups`)
- **Audit:** [`scripts/validate-field-groups.mjs`](validate-field-groups.mjs)
  (`npm run audit:field-groups`)
- **Generator wiring:** `buildOperationData` in [`generate-api-ref.mjs`](generate-api-ref.mjs)
  attaches `requestBody.sections`, `requestBody.labels`, `requestBody.seed`, and
  `examples.representative`
- **UI:** `DocBodySection` in
  [`doc-body.jsx`](../src/components/pages/doc/api-operation/doc-body.jsx)
  renders the read-only section cards from the emitted contract. The preserved
  interactive body renderer does not consume grouping metadata.

## What the generator emits

For each opted-in operation, `requestBody` gains:

- `sections`: ordered cards, each `{ id, label, common, blurb, collapsed,
  schemaPath, rows }` where every `row` is `{ path, common, outOfObject }` and
  `path` is the absolute dotted path of a node to render. `DocBodySection` finds
  each node in the generated body tree and renders it as a read-only `DocField`.
  `null` when the op is not configured, so the UI falls back to the flat tree.
- `labels`: optional per-field display overrides, keyed by dotted path. The
  read-only UI uses these for friendlier titles and default labels when
  `field-label.js`'s automatic humanization is not enough.
- `seed`: a curated `{ path: value }` representative request. Applied as a
  build-time source for `examples.representative.body`, curl, and TypeScript
  snippets. It is not written to client state and does not affect the dormant
  interactive renderer.

## Configuring an operation

Add an entry to `FIELD_GROUPS` keyed by `operationId`. A section claims fields
two ways:

- `object: 'a.b'` EXPANDS that object: its direct children become the section's
  rows. Prefer this. New spec children flow in automatically (zero maintenance).
- `paths` / `extra: [...]` lists explicit field paths as their own rows. Use
  `extra` for a top-level scalar you want placed thematically inside an
  object-based section (it gets a "top-level field" badge).

Optional per section: `common: true` (a "commonly set" card badge plus a
"common" badge on each row), `blurb`, `collapsed: true`.

Optional per op: `fallback: 'other'` (default behavior for this repo's configs),
`labels: { path: { title, defaultLabel } }`, and `seed: { path: value }`.

Deprecated top-level fields are auto-routed to a collapsed "Deprecated" section.

## Maintenance loop

1. `npm run generate:api-ref`
2. `npm run audit:field-groups`
3. Read the notes, edit `FIELD_GROUPS`, repeat.
4. Spot-check one configured operation page and its generated `.md` file. The
   page should still render if the grouping is incomplete, but representative
   examples and section placement should look intentional before shipping.

## Spec drift: what happens (the site build NEVER breaks)

The in-generator audit is WARN-ONLY. `npm run audit:field-groups` is STRICT
(non-zero exit) for CI / a maintenance agent. In both cases the site keeps
building and every field keeps rendering.

| Spec change | Behavior | Audit signal |
| --- | --- | --- |
| New top-level field on a configured op | Renders in the "Other" section when `fallback: 'other'` is set | `unassigned` (warn) |
| New child of an `object:` section | Renders in that section automatically | none |
| Field renamed/removed that a config referenced | Data falls back to "Other"; the label is just unused | `staleRefs` (strict-fail) |
| Whole operation removed from the spec | Its `FIELD_GROUPS` entry is inert | `orphanedOps` (strict-fail) |
| New operation, not configured | Renders as the flat read-only tree, with generated curl and SDK examples | none |
| New API tag/group | Handled by `tag-config.json`, unrelated to grouping | n/a |

To fix a `staleRef`, prefer extending an `{ object: ... }` section so future
spec children stay automatic. To fix `unassigned`, slot the new field into a
named section.

## Determinism

Same spec in -> same grouping out. `SPEC_URL` is intentionally a moving target
(the generator always fetches the latest release spec); grouping is a pure
function of the fetched spec plus this committed config.
