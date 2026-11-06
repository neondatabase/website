---
title: 'Neon CLI command: me'
subtitle: 'View the authenticated user and login details'
summary: >-
  The `neon me` CLI command prints the authenticated user's login, email, name,
  and credential source in the default table output. Use it to confirm which
  account is active and how it's authenticated. JSON output (`-o json`) exposes
  additional fields, such as the account id, plan, and linked auth accounts.
enableTableOfContents: true
updatedOn: '2026-10-09T15:17:33.920Z'
redirectFrom:
  - /docs/reference/cli-me
---

The `me` command shows information about the authenticated Neon CLI user: login, email, name, and how you're authenticated (the credential source, such as `OAuth` or an API key, and the profile in use).

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

When you're signed out, `me` doesn't start a browser sign-in. It prints a notice to stderr and exits with status `1`, so scripts and agents can run `neon me` as a sign-in check:

```text filename="Output"
Not signed in: profile "DEFAULT" has no stored credential. Run `neon login --profile DEFAULT` to sign in, or use an API key with --api-key or NEON_API_KEY.
```

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
