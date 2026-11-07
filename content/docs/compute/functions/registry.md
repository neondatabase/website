---
title: Contribute a function template
subtitle: Share a reusable Neon Function that anyone can add to their project with neon functions new.
summary: >-
  How to contribute a template to the Neon Function Registry: module format,
  template.json and registry.json fields, layouts, categories, limits, local
  testing with NEON_FUNCTION_REGISTRY_DIR, and the review checklist.
enableTableOfContents: true
updatedOn: '2026-10-26T11:09:41.000Z'
---

The Function Registry is the public catalog behind [`neon functions new`](/docs/cli/functions#new). Each template is a folder in [`registry/`](https://github.com/neondatabase/examples/tree/main/registry) in `neondatabase/examples`. To add one, you open a pull request with the template folder and an index entry. Neon reviews it, and after it merges to `main`, the template shows up in the CLI and on [neon.com/functions/templates](/functions/templates) within about an hour. You don't publish anything yourself.

Merged files get copied straight into people's projects, so every template goes through review before it lands. To use a template rather than publish one, see [Use function templates](/docs/compute/functions/templates).

## How a template is laid out

```text
registry/
├── registry.json            # the index the CLI reads first
├── schemas/
│   ├── registry.schema.json
│   └── template.schema.json
└── <template-id>/
    ├── template.json        # metadata, no inline source
    ├── README.md            # setup and usage instructions
    └── functions/
        └── <operation>.ts   # one module per operation
```

The CLI lists templates from `registry.json`. Installing one downloads the `neondatabase/examples` tarball from GitHub and extracts only `registry/<id>/`. Every path is relative and must stay inside the registry: no absolute paths, no `..`, no backslashes, and no symlinks that lead outside it.

<Steps>

## Write the modules

Each module default-exports a fetch handler:

```ts filename="functions/send-email.ts"
export default {
  async fetch(request: Request): Promise<Response> {
    return Response.json({ ok: true });
  },
};
```

- Read configuration from `process.env`, and declare every variable you read in `environment`.
- Don't do network work at import time.
- Don't import a sibling module from the template folder. The CLI copies each module on its own.

## Write template.json

```json filename="sendgrid/template.json"
{
  "$schema": "https://neon.com/functions/registry/schemas/template.schema.json",
  "id": "sendgrid",
  "provider": "SendGrid",
  "title": "Send email with SendGrid",
  "description": "Send transactional email through the SendGrid v3 API.",
  "categories": ["email"],
  "layout": "separate",
  "dependencies": ["@sendgrid/mail@8.1.3"],
  "environment": [
    { "name": "SENDGRID_API_KEY", "description": "API key from the SendGrid dashboard." }
  ],
  "operations": [
    {
      "id": "send-email",
      "title": "Send an email",
      "description": "Send a single transactional email.",
      "source": "functions/send-email.ts",
      "slug": "sendemail",
      "recommended": true
    }
  ]
}
```

Keep `$schema` set to the neon.com URL for editor completion. The CLI's parser has the final say, so a template that passes the schema still has to pass the [local test](#test-your-template-locally).

## Add the index entry

Append the template to `templates` in `registry.json`:

```json filename="registry.json"
{
  "id": "sendgrid",
  "provider": "SendGrid",
  "title": "Send email with SendGrid",
  "description": "Send transactional email through the SendGrid v3 API.",
  "path": "sendgrid/template.json",
  "categories": ["community"],
  "logo": "https://example.com/sendgrid.svg",
  "website": "https://example.com/"
}
```

`id`, `title`, `description`, and `provider` should match `template.json`. `categories` differs: the entry holds the source label and `template.json` holds the topical labels. An entry that fails validation is dropped from the listing without an error, so always check that your template shows up.

## Test it and open a pull request

Run the [local test](#test-your-template-locally), go through the [review checklist](#review-checklist), then open a pull request on [`neondatabase/examples`](https://github.com/neondatabase/examples) with one template folder and one index entry.

</Steps>

## template.json fields

| Field                  | Required | Rule                                                                                                                                                    |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                   | yes      | Lowercase letters, digits, and hyphens, starting with a letter or digit. Must match the index entry. Use it as the folder name too.                     |
| `title`, `description` | yes      | Non-empty.                                                                                                                                              |
| `layout`               | yes      | `router` or `separate`. See [Layouts](#layouts).                                                                                                        |
| `categories`           | no       | Topical listing labels, such as `ai` or `email`. The source label goes in the index entry. See [Categories](#categories).                               |
| `provider`             | no       | Shown in listings. Defaults to `Neon`.                                                                                                                  |
| `dependencies`         | no       | Exact `name@version` pins, scoped packages included. No ranges and no `latest`, so users install the version a reviewer approved.                       |
| `environment`          | no       | `UPPER_SNAKE` names, each with a description. The CLI declares them in `neon.ts` and adds them to `.env.example`, using the description as the comment. |
| `operations`           | no       | 1 to 40 entries. Leave them out for a single-module template.                                                                                           |

Each operation takes these fields:

| Field                  | Rule                                                                                                                          |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `id`                   | Same rule as the template `id`, unique within the template. It names the scaffolded file (`<id>.ts`).                         |
| `title`, `description` | Non-empty.                                                                                                                    |
| `source`               | Path to the module, relative to `template.json`. Unique.                                                                      |
| `recommended`          | Boolean. At least one operation must be `true`. The recommended set is what `-y` and non-interactive runs scaffold.           |
| `route`                | `router` layout only. A unique URL path starting with `/`. Defaults to `/<id>`.                                               |
| `slug`                 | `separate` layout only, and required there. 1 to 20 lowercase letters and digits, no hyphens, unique. It's the function slug. |

## Index entry fields

The entry in `registry.json` repeats `id`, `title`, `description`, and `provider`, and adds:

| Field        | Required | Rule                                                                                       |
| ------------ | -------- | ------------------------------------------------------------------------------------------ |
| `path`       | yes      | Path to the template's `template.json`, relative to `registry.json`.                       |
| `categories` | yes      | The source label: `first-party`, `partner`, or `community`. See [Categories](#categories). |
| `logo`       | no       | Absolute `https://` URL. Display only. The CLI never fetches it.                           |
| `website`    | no       | Absolute `https://` URL to the provider's site. Display only. The CLI never fetches it.    |

## Layouts

A `router` template scaffolds one Neon Function. The CLI copies the selected modules and generates an `index.ts` that dispatches each request to an operation by its `route`. Any other path returns a 404 that lists the valid routes.

A `separate` template scaffolds one Neon Function per selected operation, each under its own `slug`. Use it when operations should scale, fail, or receive secrets independently.

If you leave out `operations`, the template ships exactly one module at `functions/index.ts`. Set `layout` to `router`.

## Categories

Categories drive filtering on [neon.com/functions/templates](/functions/templates), which combines the labels from both files. They're lowercase hyphenated strings, not a fixed list. The CLI ignores them.

The index entry in `registry.json` gets one source label that says who wrote the template:

| Category      | Use it for                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------- |
| `first-party` | Templates written and maintained by Neon, even when they wrap a third-party SDK.             |
| `partner`     | Templates written by a company Neon works with closely, such as Mastra, TanStack, or WorkOS. |
| `community`   | Templates written by anyone else.                                                            |

`template.json` gets at least one topical label. Reuse one from this table where it fits:

| Category            | Use it for                                        |
| ------------------- | ------------------------------------------------- |
| `ai`                | Templates that use AI Gateway or an AI framework. |
| `ai-infrastructure` | Third-party AI data or tooling providers.         |
| `api`               | HTTP APIs, with or without Postgres.              |
| `auth`              | Authentication or access control.                 |
| `bots`              | Chat or messaging bots.                           |
| `mcp`               | Model Context Protocol servers.                   |

To add a new category, use it in your entries and add a row to the categories table in the registry [README](https://github.com/neondatabase/examples/blob/main/registry/README.md).

## Limits

| Limit                                | Value          |
| ------------------------------------ | -------------- |
| Entries in `registry.json`           | 500            |
| `registry.json` or a `template.json` | 1 MB           |
| One module                           | 256 KB         |
| All modules of one template          | 2 MB           |
| Path length                          | 255 characters |

## Test your template locally

Point the CLI at your checkout with `NEON_FUNCTION_REGISTRY_DIR`. In this mode, the CLI reads the files in that folder and doesn't download the GitHub tarball.

```bash
export NEON_FUNCTION_REGISTRY_DIR=/path/to/examples/registry

# Your template should be listed. If it isn't, its index entry failed validation.
neon functions templates list

# Loads template.json and every module it references, then scaffolds into a scratch directory.
neon functions new <id> -y --dir /tmp/<id> --no-add-to-config --no-install
```

The last command prints a `neon dev --source …` line for each function it created. Run each one with [`neon dev`](/docs/cli/dev) and call every route or function once.

<p className="mt-2! text-[13px] leading-snug text-gray-new-50 dark:text-gray-new-60">Registry commands need Neon CLI 8.11.0 or later.</p>

## Review checklist

- The template is listed, and `neon functions new <id> -y` succeeds against a local checkout.
- Every operation was run once with `neon dev`.
- Dependencies are pinned and come from the provider's official SDK.
- Every `process.env` read is declared in `environment`, and no secret or default key is hard-coded.
- There are no network calls at import time and no telemetry the user didn't ask for.
- The recommended operations are the ones most users want on day one.
- `README.md` explains how to use the template: the Neon services to enable (for example, `neon config add ai-gateway`), environment variables to set, whether to deploy before running `neon dev`, and an example request. The `Next:` list from `neon functions new` doesn't cover services, so users rely on the README for them.

## Where the catalog is served

The CLI reads the catalog from neon.com, which proxies `registry/` on the `main` branch of `neondatabase/examples`. If neon.com is unreachable, the CLI falls back to [the same files on GitHub](https://raw.githubusercontent.com/neondatabase/examples/main/registry/registry.json).

| File            | URL                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Catalog index   | [https://neon.com/functions/registry/registry.json](https://neon.com/functions/registry/registry.json)                               |
| Catalog schema  | [https://neon.com/functions/registry/schemas/registry.schema.json](https://neon.com/functions/registry/schemas/registry.schema.json) |
| Template schema | [https://neon.com/functions/registry/schemas/template.schema.json](https://neon.com/functions/registry/schemas/template.schema.json) |

The CLI's parser and these schemas define the format together. If your template needs a field the parser doesn't know yet, see "Changing the schema" in [CONTRIBUTING.md](https://github.com/neondatabase/examples/blob/main/registry/CONTRIBUTING.md) before you use it.

<NeedHelp/>
