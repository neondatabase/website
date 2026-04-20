# neonctl docs check

Validates every `neonctl`/`neon` CLI example in `content/**/*.md` against a
schema parsed from the [neonctl](https://github.com/neondatabase/neonctl)
TypeScript source.

## Run

```bash
npm run check:docs:neonctl
```

Fails on unknown commands, unknown options, or invalid `choices` values.

For a local Markdown report:

```bash
node scripts/docs-checks/neonctl/validate.js --out /tmp/report.md
```

## Refresh `schema.json` after a neonctl release

```bash
git clone https://github.com/neondatabase/neonctl ~/src/neonctl        # or git pull
node scripts/docs-checks/neonctl/generate-schema.js --src ~/src/neonctl
npm run check:docs:neonctl                                             # fix any new misses
git add scripts/docs-checks/neonctl/schema.json && git commit
```

`--src` is required (or set `NEONCTL_SRC`).

## Files

| File                             | Role                                                         |
| -------------------------------- | ------------------------------------------------------------ |
| `schema.json`                    | Committed schema. Canonical, version-pinned.                 |
| `generate-schema.js`             | Parses neonctl's TS source → `schema.json`.                  |
| `schema.js`                      | Loads schema; resolves argv to command node + valid options. |
| `extract-examples.js`            | Scans Markdown for fenced bash blocks and inline backticks.  |
| `validate.js`                    | Extractor + schema → Markdown report. CLI entry point.       |
| `__tests__/neonctl-docs.test.js` | Integration test: runs `validate()`, asserts 0 errors.       |
| `__tests__/units.test.js`        | Unit tests for parsing helpers.                              |

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
  border-char filter in `extract-examples.js`.
