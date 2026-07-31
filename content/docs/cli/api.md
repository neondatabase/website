---
title: 'Neon CLI command: api'
subtitle: 'Call any Neon API route directly as an authenticated passthrough'
summary: >-
  The Neon CLI `api` command sends an authenticated request to any Neon API
  route and prints the response. Pass a path like `/projects`, set the method
  with `--method`, build a body from `--field` or `--data`, and add query
  parameters and headers. Run `neon api --list` to browse every endpoint.
enableTableOfContents: true
---

The `api` command sends an authenticated request to any [Neon API](/docs/reference/api) route and prints the response. Pass an API path as the first argument. The method defaults to `GET`, or `POST` when you supply a body.

By default the request uses your [`neon auth`](/docs/cli/auth) credentials. To use a specific key, pass `--api-key` or set `NEON_API_KEY`. The [key's permissions](/docs/manage/api-keys#types-of-api-keys) determine what the request can do.

<Admonition type="note">
`api` is a raw passthrough: it does not read your [context file](/docs/cli/set-context) or auto-fill parameters. Pass what each route needs explicitly. For example, `neon api /projects` returns `ERROR: org_id is required` unless you add `-Q org_id=<org_id>` or authenticate with an organization API key. Get your organization ID from [`neon orgs list`](/docs/cli/orgs).
</Admonition>

## Usage

<CliUsage command="api" />

## Options

<CliOptions command="api" />

## Examples

### GET request

Pass required parameters with `--query` (`-Q`); add `--include` (`-i`) to print the status and headers before the body:

```bash
neon api /projects -Q org_id=org-cool-darkness-12345678 -i
```

The response is the route's raw JSON. For the fields each route returns, see the [Neon API Reference](/docs/reference/api).

### Request body

Set body fields with `--field` (`-F`) as `key=value`. Values are typed automatically (numbers, booleans, `null`, and JSON), and dot-notation nests objects. A body switches the default method to `POST`:

```bash
neon api /projects/{project_id}/branches -F branch.name=dev
```

This sends `{ "branch": { "name": "dev" } }`. Use `--raw-field` (`-f`) to keep a value as a literal string. For a full JSON body, use `--data` (`-d`) with a string, `@file`, or `-` (stdin).

### Create a project

`POST /projects` takes a `project` object. To create it under an organization, set `project.org_id` in the body (unlike `GET /projects`, which takes `org_id` as a query parameter):

```bash
neon api /projects -X POST -F project.name=my-project -F project.org_id=org-cool-darkness-12345678
```

For a larger body, put the JSON in a file and pass it with `-d @<file>`:

```json filename="project.json"
{
  "project": {
    "name": "my-project",
    "org_id": "org-cool-darkness-12345678"
  }
}
```

```bash
neon api /projects -X POST -d @project.json
```

### List endpoints

`--list` prints every route from the Neon OpenAPI spec; `--refresh` refetches the cached spec:

```bash
neon api --list
```

### YAML output

Responses print as JSON. Use the global `--output yaml` (`-o yaml`) for YAML:

```bash
neon api /projects -Q org_id=org-cool-darkness-12345678 -o yaml
```
