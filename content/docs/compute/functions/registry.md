---
title: Function Registry
subtitle: Add a reusable Neon Function to an existing project from a public catalog.
summary: >-
  Public catalog of Neon Function templates. Install with neon functions new,
  browse /docs/compute/functions/registry/templates, fetch
  https://neon.com/functions/registry/registry.json.
enableTableOfContents: true
---

The Function Registry is a public catalog of [Neon Functions](/docs/compute/functions/overview). [`neon functions new`](/docs/cli/functions#new) copies a template into `functions/<slug>/` and declares it in [`neon.ts`](/docs/reference/neon-ts), creating that file if needed. Use [`neon bootstrap`](/docs/cli/bootstrap) when you're starting from an empty directory.

Browse the live catalog on the [templates](/docs/compute/functions/registry/templates) page. Each template has a docs page at `/docs/compute/functions/registry/templates/<id>`, for example [basic](/docs/compute/functions/registry/templates/basic).

## Install

```bash
neon functions templates list
neon functions new basic
```

<p className="mt-2! text-[13px] leading-snug text-gray-new-50 dark:text-gray-new-60">Registry commands need Neon CLI 8.11.0 or later.</p>

The catalog `id` is what you pass to `neon functions new`. Installing doesn't deploy. Run [`neon dev`](/docs/cli/dev) locally, then [`neon deploy`](/docs/compute/functions/deploy) or [`neon functions deploy`](/docs/cli/functions#deploy).

## Environment variables

If a template lists secrets, `neon functions new` adds their names (no values) to [`neon.ts`](/docs/reference/neon-ts) and `.env.example`. In `neon.ts`, `process.env` is the shell at deploy time, not the function runtime:

```ts filename="neon.ts"
env: {
  API_KEY: process.env.API_KEY!,
},
```

Load values with `neon deploy --env .env.production`. Only keys you declare under `env` are uploaded, not the whole file. At runtime, the handler reads these values, plus Neon-injected branch credentials such as `DATABASE_URL`, from `process.env`:

```ts
const apiKey = process.env.API_KEY;
```

See [Environment variables](/docs/compute/functions/environment-variables).

## Catalog

The CLI reads the catalog from neon.com, which proxies [`registry/`](https://github.com/neondatabase/examples/tree/main/registry) on the `main` branch of `neondatabase/examples`.

| File            | URL                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Catalog index   | [https://neon.com/functions/registry/registry.json](https://neon.com/functions/registry/registry.json)                               |
| Catalog schema  | [https://neon.com/functions/registry/schemas/registry.schema.json](https://neon.com/functions/registry/schemas/registry.schema.json) |
| Template schema | [https://neon.com/functions/registry/schemas/template.schema.json](https://neon.com/functions/registry/schemas/template.schema.json) |

If neon.com is unreachable, the CLI falls back to [the same files on GitHub](https://raw.githubusercontent.com/neondatabase/examples/main/registry/registry.json). Installing a template still downloads the `neondatabase/examples` tarball from GitHub and extracts that template's folder.

## Test a template locally

Set `NEON_FUNCTION_REGISTRY_DIR` to a local `registry/` directory to list and install templates you're developing:

```bash
NEON_FUNCTION_REGISTRY_DIR=./registry neon functions templates list
NEON_FUNCTION_REGISTRY_DIR=./registry neon functions new basic
```

The CLI reads the files in that folder and doesn't download the GitHub tarball.

## Contribute

Open a pull request in [`registry/`](https://github.com/neondatabase/examples/tree/main/registry) that adds a template folder and an index entry in `registry.json`. See [CONTRIBUTING.md](https://github.com/neondatabase/examples/blob/main/registry/CONTRIBUTING.md) for field rules and the review checklist.

<NeedHelp/>
