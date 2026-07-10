# @neon/sdk doc checks

Validates code patterns in the SDK reference and migration guide.

## Type-check (no API key)

```bash
npx tsc --noEmit --module nodenext --moduleResolution nodenext --target es2022 --skipLibCheck scripts/docs-checks/sdk/typecheck-snippets.mts
```

Requires `@neon/sdk` (install at repo root if needed: `npm install @neon/sdk@1.0.0 --no-save`).

## Live smoke test

Read-only checks against a real Neon account using `NEON_API_KEY` from the environment or the `# TEST API SDK` block in `~/neon.env`:

```bash
node scripts/docs-checks/sdk/smoke-test.mjs
```

Covers: `user.organizations`, `projects.list().page()`, `branches.list().page()`, `postgres.connectionString`, `projects.list().all()` (both client modes), and `raw.getProject`.
