# neonctl docs: validation + generated reference

One committed artifact, `schema.json`, drives three things:

1. **Validation** of every `neonctl`/`neon` CLI example in `content/**/*.md`
   (unknown commands, unknown options, invalid `choices` values fail).
2. **Generated reference sections** on the CLI doc pages
   (`content/docs/cli/*.md`): MDX components `<CliUsage/>`, `<CliOptions/>`,
   `<CliSubcommands/>`, `<CliGlobalOptions/>`, and `<CliCommandIndex/>`
   (defined in `src/components/pages/doc/cli-reference/`) render markdown
   from the schema at build time.
3. **The agent-facing `.md` mirror**: `src/scripts/process-md-for-llms.js`
   expands the same components using the SAME renderer functions, so the
   web page and the mirror cannot disagree.

The schema is parsed from the neonctl TypeScript source (not `--help`
output, which has known per-subcommand bugs) and patched by `overrides.json`
for values the parser can't resolve.

## Run

All commands run through a single `cli-docs` dispatcher. Run it with no
subcommand for the full help listing:

```bash
npm run cli-docs                          # print help
npm run cli-docs -- check                 # validation + renderer contract tests
npm run cli-docs -- refresh               # full refresh from the latest GitHub release
npm run cli-docs -- schema --src <path>   # regenerate schema.json from a CLI checkout
npm run cli-docs -- scaffold <name> --group <group-id>   # wire a new command
npm run cli-docs -- preview               # emit fragments to fragments/ (local preview)
```

For a local Markdown validation report:

```bash
node scripts/docs-checks/neonctl/validate.js --out /tmp/report.md
```

## Maintenance: when neonctl releases

```bash
npm run cli-docs -- refresh
```

That downloads the latest release tarball, regenerates `schema.json`,
prints added/removed commands and options, and runs the test suite. Review
the diff and commit `schema.json` — pages and the mirror pick it up at the
next build with no page edits. New top-level commands additionally need a
doc page (`content/docs/cli/<name>.md`), a `navigation.yaml` entry, and a
group mapping in
`src/components/pages/doc/cli-reference/cli-command-index/groups.js` — all
three are enforced by the coverage tests. Scaffold them in one step:

```bash
npm run cli-docs -- scaffold <name> --group <group-id>
```

That adds the group mapping, creates the doc page from a template (seeded
with the command's `describe` text), and inserts the nav entry. Fill in the
page's TODOs, then run `npm run cli-docs -- check`.
Optionally add curated overview copy (description, examples)
in `cli-command-index/meta.js`; without an entry the row falls back to the
schema's describe text and signature. meta.js examples are themselves
validated against the schema by the same test file, so CLI changes that
invalidate curated copy fail the suite instead of shipping.

A passive staleness check on `predev`/`prebuild` warns when `schema.json`
is behind the latest neonctl on npm (fail-silent offline, never breaks a
build).

If the parser can't resolve a description, default, or choices list
(enum-derived values, descriptions missing from the upstream OpenAPI spec,
server-side behavioral defaults), patch it in `overrides.json` — verify
values against the neonctl source or with the docs owner first; a `null`
override deletes a stale key.

## Page conventions (content/docs/cli/)

- Full-path headings with short custom anchors:
  `## neonctl branches restore (#restore)`; nested leaves use prefixed
  anchors (`### neonctl vpc endpoint list (#endpoint-list)`) matching the
  links `<CliSubcommands anchorParts="..."/>` emits.
- Options tables are generated; link-rich caveats live as prose below them.
- Example outputs go in ```` ```text ```` / ```` ```json ```` fences, never
  ```` ```bash ```` (the validator parses bash blocks as commands). Short
  outputs (18 lines or fewer) sit inline under the command; long outputs
  and JSON dumps collapse in `<details><summary>Show output</summary>`.
  Never invent output: reuse captured output or ship command-only examples.
- The binary is `neonctl` everywhere.

## Files

| File                              | Role                                                          |
| --------------------------------- | ------------------------------------------------------------- |
| `schema.json`                     | Committed schema. Canonical, version-pinned, the only refresh artifact. |
| `generate-schema.js`              | Parses neonctl's TS source → `schema.json`.                   |
| `overrides.json`                  | Hand-maintained patches for parser-unresolvable values.       |
| `generate-docs.js`                | Markdown renderers shared by components + llms mirror; `--fragments` preview. |
| `cli.js`                          | The `npm run cli-docs` dispatcher; routes to the scripts below. |
| `fragments/`                      | Local-only preview dump from `npm run cli-docs -- preview` (gitignored). |
| `refresh.js`                      | `npm run cli-docs -- refresh` implementation.                 |
| `scaffold-command.js`             | `npm run cli-docs -- scaffold` implementation.                |
| `check-staleness.js`              | predev/prebuild version nudge.                                |
| `schema.js`                       | Loads schema; resolves argv to command node + valid options.  |
| `extract-examples.js`             | Scans Markdown for fenced bash blocks and inline backticks.   |
| `validate.js`                     | Extractor + schema → Markdown report. CLI entry point.        |
| `__tests__/neonctl-docs.test.js`  | Integration test: runs `validate()`, asserts 0 errors.        |
| `__tests__/generate-docs.test.js` | Renderer output contract tests.                               |
| `__tests__/units.test.js`         | Unit tests for parsing helpers.                               |

## Why parse source instead of `neonctl --help`?

yargs help is unreliable for a validator:

- `neonctl roles create --help` falls back to the parent's help (missing `--name`).
- `neonctl vpc endpoint list --help` same (missing `--org-id`).
- Subcommand aliases (`sd` for `schema-diff`) aren't always reachable.

The TypeScript source is canonical. CI only reads `schema.json`.

## Known gaps

- **Positional choices not validated.** Option-level `choices` lists are
  checked; positional choices (e.g. `set-context`'s second arg) are not.
- **Placeholders aren't checked semantically.** `--project-id <project-id>`
  passes — we verify the option, not the value shape.
- **Output-line heuristic is regex-based.** Fenced blocks mixing commands
  and prose output without a `$` prompt may confuse the filter. See the
  border-char filter in `extract-examples.js`. (Converted pages avoid this
  by keeping output out of bash fences entirely.)
- **Enum-reference defaults render as source text** unless patched via
  `overrides.json`.
- **Server-side defaults** (generated branch names, default CU) exist only
  in the control plane; they are documented as verified `defaultText`
  overrides, never inferred.
