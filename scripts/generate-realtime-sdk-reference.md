# Realtime SDK reference

Build pipeline for the [TypeScript SDK reference](https://neon.com/docs/realtime/sdks/typescript). A vendored TypeDoc artifact generates seven shared-content partials, which the hand-written TypeScript page includes.

## What is generated and what is hand-written

| Path                                                                                      | Owner         | Edit by hand |
| ----------------------------------------------------------------------------------------- | ------------- | ------------ |
| `content/docs/shared-content/realtime-sdk-*.md` (7)                                       | generator     | No           |
| `vendor/realtime/sdk-docs.json`                                                           | update script | No           |
| [`config/realtime-sdk.json`](../config/realtime-sdk.json)                                 | humans        | Yes          |
| [`content/docs/realtime/sdks/typescript.md`](../content/docs/realtime/sdks/typescript.md) | docs team     | Yes          |

The partials are `backend`, `client`, `react`, `tanstack-db`, `drizzle`, `drizzle-client` and `kysely`. They have no frontmatter, banner, `h1` or `h2`. The TypeScript page owns its frontmatter, prose, module sections and includes, so a prose edit there needs no regeneration. Generated signatures and summaries come from the SDK's TSDoc comments, so revise those upstream.

The config holds one key, `modules`: each entry's `name` (its `@module` tag), `entryPoint` (relative to the neon-pkgs root) and `importSpecifier`, in render order.

The generator isn't part of `predev` or `prebuild`. The partials are committed, and CI checks them.

## Updating

```bash
npm run update:realtime-sdk   # run TypeDoc against neon-pkgs, write the artifact, regenerate the partials
```

This needs a neon-pkgs checkout with `pnpm install` done, checked out at the branch you want to document. Today that's `tmp/realtime-stack`. Once the rename merges, it's an up-to-date `main`. The script reads `NEON_PKGS_PATH`, or defaults to a sibling `../neon-pkgs`. There's no pin: it documents whatever is checked out.

Commit the vendored JSON and the partials together, and name the neon-pkgs branch and commit in the PR description.

## Changing the generator

Run `npm run generate:realtime-sdk-reference` and commit the partials. The generator reads only the committed artifact, so it needs no neon-pkgs checkout or network. It accepts an optional output root for inspecting output without touching the working tree:

```bash
node scripts/generate-realtime-sdk-reference.mjs /tmp/realtime-sdk-probe
```

## Adding a module

Add a `modules` entry. The generator fails if TypeDoc's `@module` names and the config disagree.

## Anchor ids and headings

Every generated heading declares an explicit id using the repository's trailing-anchor syntax:

```md
### createRealtimeClient (#client-createrealtimeclient)
```

All generated ids start with the module slug: `backend`, `client`, `react`, `tanstack-db`, `drizzle`, `drizzle-client` or `kysely`. This keeps anchors unique when the partials are included on the same TypeScript page. Explicit ids also avoid collisions between repeated headings such as `Members`.

| Content                                          | Heading level             | Id                                                                   |
| ------------------------------------------------ | ------------------------- | -------------------------------------------------------------------- |
| Import specifier                                 | Bold label, not a heading | None                                                                 |
| Symbols table                                    | `h3`                      | `<module>-symbols`                                                   |
| Exported symbol                                  | `h3`                      | `<module>-<symbol-slug>`                                             |
| Type parameters, Parameters, Returns, or Members | `h4`                      | Module prefix plus the slug of the symbol name and section name      |
| An overload's subsection                         | `h4`                      | As above, with the 1-based overload position before the section name |
| Documented member detail                         | `h4`                      | Module prefix plus the slug of `Symbol.member`                       |
| A collision                                      | Unchanged                 | The allocated id with `-2`, `-3`, and so on appended                 |

The slugger lowercases names, removes punctuation other than hyphens, and replaces spaces with hyphens. For example, `MaterializedLiveQuerySubscription.onChange` gets `client-materializedlivequerysubscriptiononchange`. Exports receive ids first, then member and subsection ids are allocated from the same per-module allocator. Case collisions are resolved in export order: `realtimeCollectionOptions` has `tanstack-db-realtimecollectionoptions`, while `RealtimeCollectionOptions` has `tanstack-db-realtimecollectionoptions-2`.

The symbol index and renderer share that allocation. Cross-links to exported symbols use `/docs/realtime/sdks/typescript#<allocated-id>`; links within each partial use its declared fragment ids. Moving the including page changes cross-link URLs, not the anchors.

## The TypeDoc pin

`SUPPORTED_TYPEDOC_VERSION` and `SUPPORTED_SCHEMA_VERSION` in the generator are the pin. The update script runs that TypeDoc version, and the generator rejects an artifact with any other schema version. Moving the pin means reviewing the supported artifact shapes. `renderType` and `renderComment` reject unknown type variants and comment tags instead of silently dropping them.

## Artifact details covered by tests

- Function comments live on signatures. Interfaces and properties carry comments directly.
- Destructured parameters named `__namedParameters` render as `props`.
- Default values and optional flags are separate. A defaulted parameter keeps its default value in the signature.
- Classes render as a `class` signature with a Members table, and variables as a `const` or `let` signature. An export of any other kind fails the build rather than rendering an empty fence.
- Pipes in table cells are escaped, so a union type stays in its column. Function and conditional types are parenthesized inside unions.
- Fenced examples remain fenced when rendered from TSDoc block tags.
- The vendored artifact carries no source locations or local paths.

## CI and tests

`.github/workflows/realtime-sdk-reference.yml` runs `npm run check:realtime-sdk-reference` on pull requests touching the SDK pages, generated partials, vendored artifact, config, SDK scripts, package files or the workflow itself. The check regenerates in memory and byte-compares against the committed partials. It never writes and is offline.

| Failure                                     | Fix                                                                                          |
| ------------------------------------------- | -------------------------------------------------------------------------------------------- |
| A partial was edited by hand or is missing  | Fix the generator or SDK source instead, then run `npm run generate:realtime-sdk-reference`. |
| A partial is stale after a generator change | Run `npm run generate:realtime-sdk-reference` and review the partial diff.                   |
| The SDK source changed                      | Run `npm run update:realtime-sdk` and review the artifact and partial diffs.                 |

The tests run through the normal unit suite and can be run directly:

```bash
npx vitest run scripts/generate-realtime-sdk-reference.test.js scripts/check-realtime-sdk-reference.test.js
```
