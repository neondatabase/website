---
title: 'Neon CLI command: me'
subtitle: 'View the authenticated user and login details'
summary: >-
  The `neon me` CLI command prints the authenticated user's login, email, name,
  and credential source in the default table output. Use it to confirm which
  account is active and how it's authenticated. JSON output (`-o json`) exposes
  additional fields, such as the account id, plan, and linked auth accounts.
enableTableOfContents: true
updatedOn: '2026-11-24T22:51:03.746Z'
redirectFrom:
  - /docs/reference/cli-me
---

The `me` command shows who the Neon CLI is authenticated as: a user (login, email, and name), the organization for an organization API key, or the Claimable project in a directory linked by `neon claim create`. It also shows how you're authenticated (the credential source, such as `OAuth` or an API key, and the profile in use).

## Usage

<CliUsage command="me" />

## Options

Takes only the [global options](/docs/cli#global-options).

## Examples

```bash
neon me
```

```text filename="Output"
Login           sally
Email           sally@example.com
Name            Sally Smith
Authentication  OAuth (profile DEFAULT)
```

An organization API key has no user, so `me` shows the organization ID instead:

```bash
neon me --profile work
```

```text filename="Output"
Organization    org-polished-surf-12345678
Authentication  API key (profile work)
```

With `-o json`, it prints `{"account_id": "org-…", "auth_method": "api_key_org"}`. Check `auth_method` to tell an organization key apart from a user.

When you're signed out, `me` doesn't start a browser sign-in. It prints a notice to stderr and exits with status `1`, so scripts and agents can run `neon me` as a sign-in check. The notice lists the ways to authenticate:

```text filename="Output"
Not signed in: profile "DEFAULT" has no stored credential.
Sign in with a browser on this machine: `neon login`
Or save an API key you already have: `echo "$KEY" | neon profile create DEFAULT --api-key -`
Or create a temporary project without an account: `neon claim create` (it expires in 72 hours unless claimed)
```

In a directory linked by [`neon claim create`](/docs/cli/claim), `me` shows the Claimable project the CLI authenticates as and when it expires:

```text filename="Output"
Project ID          lucky-haze-12345678
Project Expires At  2026-11-27T22:05:54.178Z
Authentication      Claimable project
```

With `-o json`, it prints `{"auth_method": "claimable", "project_id": "…", "project_expires_at": "…"}`.

Show details with `--output json`, which includes data omitted from the `table` output:

```bash
neon me -o json
```

<details>
<summary>Show output</summary>

```json
{
  "active_seconds_limit": 0,
  "auth_accounts": [
    {
      "email": "sally@example.com",
      "image": "",
      "login": "sally",
      "name": "Sally Smith",
      "provider": "google"
    }
  ],
  "email": "sally@example.com",
  "id": "8a9f604e-d04e-1234-baf7-e78909a5d123",
  "image": "",
  "login": "sally",
  "name": "Sally Smith",
  "last_name": "",
  "projects_limit": 0,
  "branches_limit": 0,
  "max_autoscaling_limit": 0,
  "plan": "free"
}
```

</details>

The `active_seconds_limit`, `projects_limit`, `branches_limit`, and `max_autoscaling_limit` fields report `0`. These are account-level limits from before Neon moved to organizations; project and branch quotas are now governed by your organization, not your user account.
