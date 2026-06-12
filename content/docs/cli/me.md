---
title: 'Neon CLI command: me'
subtitle: 'View current user info, login details, and project limits'
summary: >-
  The `neonctl me` CLI command prints the authenticated user's account details:
  login, email, name, plan type, projects limit, branches limit, and
  max autoscaling limit in compute units. Use it to confirm which account is
  active after authentication or to check plan-level quotas without opening
  the Neon console. JSON output (`-o json`) exposes additional fields including
  billing_account, auth_accounts, subscription_type, and numeric quota values
  not shown in the default table format.
enableTableOfContents: true
updatedOn: '2026-06-12T00:29:16.599Z'
redirectFrom:
  - /docs/reference/cli-me
---

The `me` command shows information about the authenticated Neon CLI user: login, email, name, and projects limit.

## Usage

<CliUsage command="me" />

## Options

Takes only the [global options](/docs/cli#global-options).

## Examples

- Show details for the current user:

  ```bash
  neonctl me
  ```

  ```text
  ┌────────────────┬──────────────────────────┬─────────────┬────────────────┐
  │ Login          │ Email                    │ Name        │ Projects Limit │
  ├────────────────┼──────────────────────────┼─────────────┼────────────────┤
  │ sally          │ sally@example.com        │ Sally Smith |       1        │
  └────────────────┴──────────────────────────┴─────────────┴────────────────┘
  ```

- Show details with `--output json`, which includes data omitted from the `table` output:

  ```bash
  neonctl me -o json
  ```

  <details>
  <summary>Show output</summary>

  ```json
  {
    "active_seconds_limit": 360000,
    "billing_account": {
      "payment_source": {
        "type": ""
      },
      "subscription_type": "free",
      "quota_reset_at_last": "2023-07-01T00:00:00Z",
      "email": "sally@example.com",
      "address_city": "",
      "address_country": "",
      "address_line1": "",
      "address_line2": "",
      "address_postal_code": "",
      "address_state": ""
    },
    "auth_accounts": [
      {
        "email": "sally@example.com",
        "image": "https://lh3.googleusercontent.com/a/AItbvml5rjEQkmt-h_abcdef-MwVtfpek7Aa_xk3cIS_=s96-c",
        "login": "sally",
        "name": "Sally Smith",
        "provider": "google"
      },
      {
        "email": "sally@example.com",
        "image": "",
        "login": "sally",
        "name": "sally@example.com",
        "provider": "hasura"
      }
    ],
    "email": "sally@example.com",
    "id": "8a9f604e-d04e-1234-baf7-e78909a5d123",
    "image": "https://lh3.googleusercontent.com/a/AItbvml5rjEQkmt-h_abcdef-MwVtfpek7Aa_xk3cIS_=s96-c",
    "login": "sally",
    "name": "Sally Smith",
    "projects_limit": 10,
    "branches_limit": 10,
    "max_autoscaling_limit": 0.25,
    "plan": "free"
  }
  ```

  </details>

  In JSON output, `max_autoscaling_limit` is a numeric value in compute units. A value of `0` means no autoscaling limit is configured.
