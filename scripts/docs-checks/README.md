# docs-checks

Validate `content/**/*.md` against authoritative sources (CLI schemas, type
defs, OpenAPI specs, etc.). Each check is self-contained in its own subfolder.

## Run

```bash
npm run check:docs              # all checks
npm run check:docs:neonctl      # one check
```

Exits non-zero on any validation error.

## Checks

| Check                   | Validates                                    |
| ----------------------- | -------------------------------------------- |
| [`neonctl`](./neonctl/) | Every `neonctl`/`neon` CLI example is valid. |

## Add a new check

1. Create `scripts/docs-checks/<name>/` with:

   ```text
   <name>/
     README.md
     validate.js             # exports validate() -> { invocations, errors }
     __tests__/
       <name>-docs.test.js   # asserts errors.length === 0
   ```

2. Each error must be `{ kind, file, line, raw, message }`.
3. Add to `package.json`:

   ```json
   "check:docs:<name>": "vitest run scripts/docs-checks/<name>/__tests__/<name>-docs.test.js"
   ```

   `check:docs` picks it up via glob.

4. External inputs (cloned repos, API calls) run at **schema-generation time**
   and emit a committed JSON file. Runtime needs only `node` + this repo. See
   [`neonctl/generate-schema.js`](./neonctl/generate-schema.js).

## Shared helpers

None yet. When a second check arrives, lift duplicated code into
`scripts/docs-checks/_lib/`. Don't pre-abstract.
