---
title: 'Neon CLI command: api-keys'
subtitle: Create, list, and revoke Neon API keys
summary: >-
  The `neon api-keys` CLI command manages API keys for your account, an
  organization, or a single project. Use it to create a key for scripts and CI,
  list existing keys and when they were last used, and revoke a key you no
  longer trust.
enableTableOfContents: true
updatedOn: '2026-08-04T19:37:07.626Z'
---

The `api-keys` command creates, lists, and revokes the API keys that authenticate requests to the Neon API. Keys belong to your account unless you pass `--org-id` or `--project-id`.

A key is shown once, at creation. There is no way to retrieve it later.

For key types, revocation permissions, and rotation, see [Manage API keys](/docs/manage/api-keys).

<CliSubcommands command="api-keys" />

## neon api-keys list (#list)

Lists key metadata, never the keys themselves.

<CliUsage command="api-keys list" />

<CliOptions command="api-keys list" />

List your account keys:

```bash
neon api-keys list
```

```text filename="Output"
Account API keys
┌─────────┬──────────────────────┬──────────────────────┬──────────────────────┬─────────────────────┐
│ Id      │ Name                 │ Created At           │ Last Used At         │ Last Used From Addr │
├─────────┼──────────────────────┼──────────────────────┼──────────────────────┼─────────────────────┤
│ 3225782 │ ci-deploy            │ 2026-07-29T00:50:26Z │ 2026-07-29T18:06:55Z │ 192.0.2.10          │
└─────────┴──────────────────────┴──────────────────────┴──────────────────────┴─────────────────────┘
```

Organization keys are invisible to your account, so listing them needs `--org-id`:

```bash
neon api-keys list --org-id org-example-12345678
```

This covers both scopes, since a project-scoped key is owned by the project's organization. The `Project` column tells them apart:

```text filename="Output"
API keys in org-example-12345678
┌─────────┬─────────────┬───────────────────────┬──────────────────────┬──────────────────────┬─────────────────────┐
│ Id      │ Name        │ Project               │ Created At           │ Last Used At         │ Last Used From Addr │
├─────────┼─────────────┼───────────────────────┼──────────────────────┼──────────────────────┼─────────────────────┤
│ 3243240 │ preview-bot │ green-breeze-12345678 │ 2026-08-04T18:51:36Z │ 2026-08-05T18:51:36Z │ 192.0.2.10          │
├─────────┼─────────────┼───────────────────────┼──────────────────────┼──────────────────────┼─────────────────────┤
│ 3177950 │ org-key     │ (all projects)        │ 2026-07-08T01:28:49Z │ 2026-07-08T01:31:20Z │ 192.0.2.10          │
└─────────┴─────────────┴───────────────────────┴──────────────────────┴──────────────────────┴─────────────────────┘
```

`(all projects)` is a table label only. In JSON and YAML the field is `project_id`, and it is `null` for an organization-wide key:

```bash
neon api-keys list --org-id org-example-12345678 -o json
```

```json
[
  { "id": 3243240, "name": "preview-bot", "project_id": "green-breeze-12345678" },
  { "id": 3177950, "name": "org-key", "project_id": null }
]
```

## neon api-keys create (#create)

Creates a key and prints it once. `--name` is required.

By default the key reaches everything your account can, in every organization. Two mutually exclusive flags change that:

- `--project-id` limits the key to one project. Use this for anything deployed, so a leaked key cannot reach your other projects.
- `--org-id` transfers ownership to an organization. This is not a restriction: the key reaches every project in that organization, including ones created later.

Both organization forms need organization admin permissions. Each form prints a notice describing what the key can reach.

<CliUsage command="api-keys create" />

<CliOptions command="api-keys create" />

Create an account key:

```bash
neon api-keys create --name ci-deploy
```

```text filename="Output"
API key
┌─────────┬───────────┐
│ Id      │ Name      │
├─────────┼───────────┤
│ 3225782 │ ci-deploy │
└─────────┴───────────┘

napi_examplekey1234567890abcdefghijklmnopqrstuvwxyz
WARNING: Store this key now: it is not shown again.
WARNING: This key reaches everything your account can, in every organization. Pass --org-id or --project-id to narrow it.
```

Create a key owned by an organization:

```bash
neon api-keys create --name org-key --org-id org-example-12345678
```

```text filename="Output"
API key
┌─────────┬─────────┐
│ Id      │ Name    │
├─────────┼─────────┤
│ 3177950 │ org-key │
└─────────┴─────────┘

napi_examplekey1234567890abcdefghijklmnopqrstuvwxyz
WARNING: Store this key now: it is not shown again.
WARNING: This key reaches every project in org-example-12345678, including ones created later. Pass --project-id instead to restrict it to one.
```

Create a key limited to one project. The output adds a `Project` column:

```bash
neon api-keys create --name preview-bot --project-id green-breeze-12345678
```

```text filename="Output"
API key
┌─────────┬─────────────┬───────────────────────┐
│ Id      │ Name        │ Project               │
├─────────┼─────────────┼───────────────────────┤
│ 3243240 │ preview-bot │ green-breeze-12345678 │
└─────────┴─────────────┴───────────────────────┘

napi_examplekey1234567890abcdefghijklmnopqrstuvwxyz
WARNING: Store this key now: it is not shown again.
INFO: Limited to green-breeze-12345678: it cannot create projects, mint API keys, or read any other project. It can still change and delete everything inside that project.
```

<Admonition type="important">
A project-scoped key is owned by the project's organization, so it needs `--org-id` to list or revoke.
</Admonition>

The key is the last line of stdout, and the notices go to stderr, so you can capture it directly:

```bash
echo "NEON_API_KEY=$(neon api-keys create --name local-dev -o json | jq -r .key)" >> .env
```

## neon api-keys revoke (#revoke)

Revokes a key immediately and permanently. Anything using it starts failing, so confirm the ID with `api-keys list` first.

Takes the numeric key ID, not the name. Organization and project-scoped keys need organization admin permissions. See [who can revoke keys](/docs/manage/api-keys#who-can-revoke-keys).

<CliUsage command="api-keys revoke" />

<CliOptions command="api-keys revoke" />

Revoke an account key:

```bash
neon api-keys revoke 3225782
```

```text filename="Output"
API key
┌─────────┬───────────┬─────────┬──────────────────────┐
│ Id      │ Name      │ Revoked │ Last Used At         │
├─────────┼───────────┼─────────┼──────────────────────┤
│ 3225782 │ ci-deploy │ true    │ 2026-07-29T18:06:55Z │
└─────────┴───────────┴─────────┴──────────────────────┘
```

`Last Used At` is empty for a key that was never used.

Revoke an organization or project-scoped key:

```bash
neon api-keys revoke 3243240 --org-id org-example-12345678
```

Without `--org-id`, the same command fails:

```text filename="Output"
ERROR: No account API key with id 3243240. If it belongs to an organization, pass --org-id. Organization keys are not visible to your account.
```
