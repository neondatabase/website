---
title: 'Neon CLI command: orgs'
subtitle: List and inspect organizations, and manage members, invitations, and the spending limit
summary: >-
  The `neon orgs` CLI command lists the Neon organizations you belong to and
  shows one organization's details. Its subcommands also list, inspect, update,
  and remove members, list and send invitations, and get, set, or remove the
  organization's monthly spending limit. Use it to look up an org ID before
  running org-scoped commands, or to manage an organization from the terminal.
enableTableOfContents: true
updatedOn: '2026-11-05T15:33:57.188Z'
redirectFrom:
  - /docs/reference/cli-orgs
  - /docs/cli/org
---

The `orgs` command lists the organizations you belong to, shows one organization, and manages its members, invitations, and monthly spending limit. For background, see [Manage organizations](/docs/manage/orgs-manage).

Every subcommand except `list` takes `--org-id`. Without it, the CLI uses the organization in your [`.neon` context file](/docs/cli/link#the-neon-context-file), then the only organization you belong to. Otherwise, it fails and asks you to pass `--org-id`. Changing a member's role, removing a member, and setting or removing the spending limit require an organization Admin.

<CliSubcommands command="orgs" />

## neon orgs list (#list)

Lists all organizations associated with the authenticated Neon CLI user.

<CliUsage command="orgs list" />

<CliOptions command="orgs list" />

List your organizations with the default `table` output format. The organization in your [`.neon` context file](/docs/cli/link#the-neon-context-file) is marked `[current]`:

```bash
neon orgs list
```

```text filename="Output"
Organizations
ID                     Name                   Plan
org-xxxxxxxx-xxxxxxxx  [current] Example Org  Launch
org-yyyyyyyy-yyyyyyyy  Another Org            Free
```

List your organizations with `--output json`, which also shows the fields omitted from the `table` output, such as the handle and timestamps. JSON keeps the API's plan ID (for example, `launch`) rather than the display name:

```bash
neon orgs list -o json
```

<details>
<summary>Show output</summary>

```json
[
  {
    "id": "org-xxxxxxxx-xxxxxxxx",
    "name": "Example Org",
    "handle": "example-org-xxxxxxxx",
    "plan": "launch",
    "created_at": "2026-04-22T16:50:41Z",
    "managed_by": "console",
    "updated_at": "2026-06-28T15:38:26Z",
    "require_mfa": false
  }
]
```

</details>

## neon orgs get (#get)

Shows an organization's details. Pass the organization ID as an argument or with `--org-id`.

<CliUsage command="orgs get" />

<CliOptions command="orgs get" />

```bash
neon orgs get org-xxxxxxxx-xxxxxxxx
```

```text filename="Output"
ID          org-xxxxxxxx-xxxxxxxx
Name        Example Org
Handle      example-org-xxxxxxxx
Plan        Scale
Created At  2026-09-10T16:36:29Z
```

## neon orgs members (#members)

Lists, inspects, updates, and removes the members of an organization.

<CliUsage command="orgs members" />

<CliOptions command="orgs members" />

<CliSubcommands command="orgs members" anchorParts="members" />

### neon orgs members list (#members-list)

Lists members with their email and organization role. Use the `ID` column as the `<member-id>` for the other `members` subcommands. JSON and YAML output keep the API's shape: each item has a `member` object and a `user` object.

<CliUsage command="orgs members list" />

<CliOptions command="orgs members list" />

```bash
neon orgs members list
```

```text filename="Output"
Members of org-xxxxxxxx-xxxxxxxx
ID                                    Email              Role   Joined At
a1b2c3d4-1111-4a2b-8c3d-0123456789ab  alex@example.com   admin  2026-09-10T16:36:29Z
b2c3d4e5-2222-4b3c-9d4e-123456789abc  dana@example.com   admin  2026-09-25T18:18:32Z
```

### neon orgs members get (#members-get)

Shows one member.

<CliUsage command="orgs members get" />

<CliOptions command="orgs members get" />

```bash
neon orgs members get a1b2c3d4-1111-4a2b-8c3d-0123456789ab
```

### neon orgs members update (#members-update)

Changes a member's organization role. The role sets the member's baseline access across every project in the organization. See [Organization roles](/docs/manage/user-permissions#organization-roles). `--role` accepts `admin`, `editor`, `viewer`, or `collaborator`. `member` is a legacy alias for `editor`. Some roles may not be available for every organization.

<CliUsage command="orgs members update" />

<CliOptions command="orgs members update" />

```bash
neon orgs members update b2c3d4e5-2222-4b3c-9d4e-123456789abc --role viewer
```

### neon orgs members remove (#members-remove)

Removes a member from the organization.

<CliUsage command="orgs members remove" />

<CliOptions command="orgs members remove" />

```bash
neon orgs members remove b2c3d4e5-2222-4b3c-9d4e-123456789abc
```

## neon orgs invitations (#invitations)

Lists and sends invitations to join an organization.

<CliUsage command="orgs invitations" />

<CliOptions command="orgs invitations" />

<CliSubcommands command="orgs invitations" anchorParts="invitations" />

### neon orgs invitations list (#invitations-list)

Lists pending invitations.

<CliUsage command="orgs invitations list" />

<CliOptions command="orgs invitations list" />

```bash
neon orgs invitations list
```

```text filename="Output"
Invitations to org-xxxxxxxx-xxxxxxxx
ID                                    Email              Role    Invited At
c3d4e5f6-3333-4c4d-8e5f-23456789abcd  zhang@example.com  viewer  2026-11-05T14:26:14Z
```

### neon orgs invitations create (#invitations-create)

Invites people by email. Repeat `--email` to invite several people at once. Every invitee gets the same `--role`. Neon emails each one, and anyone who already has a Neon account joins right away.

[Organization API keys](/docs/manage/api-keys#types-of-api-keys) can't send invitations. Use a personal API key instead.

<CliUsage command="orgs invitations create" />

<CliOptions command="orgs invitations create" />

```bash
neon orgs invitations create --email dana@example.com --email zhang@example.com --role editor
```

## neon orgs spending-limit (#spending-limit)

Gets, sets, and removes the organization's monthly spending limit, which the Console calls the [spending notification](/docs/introduction/spending-notifications) threshold. Available on the Launch and Scale plans.

<CliUsage command="orgs spending-limit" />

<CliOptions command="orgs spending-limit" />

<CliSubcommands command="orgs spending-limit" anchorParts="spending-limit" />

### neon orgs spending-limit get (#spending-limit-get)

Shows the monthly spending limit, or `Not set`. JSON and YAML output keep the API's `spending_limit_cents` field.

<CliUsage command="orgs spending-limit get" />

<CliOptions command="orgs spending-limit get" />

```bash
neon orgs spending-limit get
```

```text filename="Output"
Spending limit for org-xxxxxxxx-xxxxxxxx
Monthly Limit  $500.00
```

### neon orgs spending-limit set (#spending-limit-set)

Sets the monthly spending limit in US dollars, with up to two decimal places. Neon emails organization Admins at 80% and 100% of the limit. Reaching the limit doesn't suspend computes.

<CliUsage command="orgs spending-limit set" />

<CliOptions command="orgs spending-limit set" />

```bash
neon orgs spending-limit set 500
```

### neon orgs spending-limit delete (#spending-limit-delete)

Removes the monthly spending limit.

<CliUsage command="orgs spending-limit delete" />

<CliOptions command="orgs spending-limit delete" />

```bash
neon orgs spending-limit delete
```

```text filename="Output"
Spending limit removed from org-xxxxxxxx-xxxxxxxx
```
