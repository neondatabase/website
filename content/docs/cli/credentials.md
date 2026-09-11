---
title: 'Neon CLI command: credentials'
subtitle: Issue, list, reveal, rotate, and revoke scoped credentials on a branch
summary: >-
  The Neon CLI `neon credentials` command manages branch-scoped credentials:
  issue a credential with storage, AI gateway, or function-invoke scopes, list
  the credentials on a branch, reveal a credential's secrets, rotate its secrets
  in place, and revoke it.
enableTableOfContents: true
---

The `credentials` command manages scoped credentials on a branch. A credential grants an application or agent direct access to a branch's surfaces without an account API key. Each credential carries one or more scopes and, when issued, a pair of secrets: an `api_token` and an `s3_secret_access_key`.

The available scopes are:

- `storage:read` and `storage:write` for [Neon Object Storage](/docs/storage/overview)
- `ai_gateway:invoke` for the [Neon AI Gateway](/docs/ai-gateway/overview)
- `functions:invoke` for invoking [Neon Functions](/docs/compute/functions/overview)

Credentials are branch-scoped. Pass `--project-id` and `--branch` to target a branch, or let the CLI resolve them from your [context file](/docs/cli/set-context). A credential's `token_id` has the form `nak_live_<hex>` and is stable across a rotation.

<Admonition type="important" title="Secrets are shown only once">
The `api_token` and `s3_secret_access_key` are returned only when you create or rotate a credential, or when you explicitly run `neon credentials reveal`. Store them securely as soon as they're issued.
</Admonition>

<CliSubcommands command="credentials" />

## neon credentials list (#list)

Lists the credentials on the branch. Secrets are never included; use [`neon credentials reveal`](#reveal) to see them.

<CliUsage command="credentials list" />

<CliOptions command="credentials list" />

```bash
neon credentials list --project-id solitary-heart-93902637 --branch main
```

```text filename="Output"
Token Id                                   Name                               Principal Type  Scopes                       Created At
nak_live_aaaa1111bbbb2222cccc3333dddd4444  Default AI gateway credential      user            ai_gateway:invoke            2026-09-10T20:02:49Z
nak_live_eeee5555ffff6666aaaa7777bbbb8888  Default object storage credential  user            storage:read, storage:write  2026-09-10T20:02:50Z
```

## neon credentials create (#create)

Issues a new credential. `--scope` is required and repeatable; pass one for each capability you want to grant. `--name` is an optional label.

<CliUsage command="credentials create" />

<CliOptions command="credentials create" />

```bash
neon credentials create --name uploads --scope storage:read --scope storage:write --project-id solitary-heart-93902637 --branch main
```

```text filename="Output"
Token Id  nak_live_0123456789abcdef0123456789abcdef
Name      uploads
Scopes    storage:read, storage:write
api_token: <api_token>
s3_secret_access_key: <s3_secret_access_key>
WARNING: Store these secrets now: they are not shown again unless you run neon credentials reveal.
```

With `--output json`, the secrets stay on the object so scripts can read them:

<details>
<summary>Show output</summary>

```json
{
  "token_id": "nak_live_0123456789abcdef0123456789abcdef",
  "token_id_short": "0123456789ab",
  "name": "uploads",
  "api_token": "<api_token>",
  "s3_secret_access_key": "<s3_secret_access_key>",
  "scopes": ["storage:read", "storage:write"],
  "branch_id": "br-morning-frost-a1b2c3d4",
  "created_at": "2026-09-10T20:02:49Z"
}
```

</details>

## neon credentials reveal (#reveal)

Shows a credential's `api_token` and `s3_secret_access_key` again, looked up by `token_id`.

<CliUsage command="credentials reveal" />

<CliOptions command="credentials reveal" />

```bash
neon credentials reveal nak_live_0123456789abcdef0123456789abcdef --project-id solitary-heart-93902637 --branch main
```

```text filename="Output"
Token Id  nak_live_0123456789abcdef0123456789abcdef
api_token: <api_token>
s3_secret_access_key: <s3_secret_access_key>
WARNING: These are live secrets. Treat them like a password.
```

## neon credentials rotate (#rotate)

Replaces a credential's secrets in place. The `token_id` is unchanged, so anything that references the credential by ID keeps working once you update the stored secrets.

<CliUsage command="credentials rotate" />

<CliOptions command="credentials rotate" />

```bash
neon credentials rotate nak_live_0123456789abcdef0123456789abcdef --project-id solitary-heart-93902637 --branch main
```

```text filename="Output"
Token Id  nak_live_0123456789abcdef0123456789abcdef
Name      uploads
Scopes    storage:read, storage:write
api_token: <new api_token>
s3_secret_access_key: <new s3_secret_access_key>
WARNING: Store the new secrets now: a retry mints another pair and does not recover a lost response. A replica may briefly accept the previous secret.
```

## neon credentials revoke (#revoke)

Revokes a credential. Its secrets stop working and the `token_id` can no longer be revealed or rotated.

<CliUsage command="credentials revoke" />

<CliOptions command="credentials revoke" />

```bash
neon credentials revoke nak_live_0123456789abcdef0123456789abcdef --project-id solitary-heart-93902637 --branch main
```

```text filename="Output"
INFO: Credential nak_live_0123456789abcdef0123456789abcdef revoked
```
