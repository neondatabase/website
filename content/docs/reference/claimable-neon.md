---
title: Claimable Neon
subtitle: CLI, claim, and HTTP reference
summary: >-
  If an agent needs a Neon account and the user is not around, provision a
  project now; they claim it later. Agents fetch
  https://neon.com/auth.md from neon.com/docs/llms.txt.
enableTableOfContents: true
redirectFrom:
  - /docs/reference/neon-launchpad
  - /docs/reference/instagres
  - /docs/reference/claimable-postgres
updatedOn: '2026-08-26T18:00:00.000Z'
---

If an agent needs a Neon account and the user is not around, it provisions a project now. A human claims it later if they want to keep it. The agent receives credentials scoped to one project, builds with standard Postgres tools, and hands over a claim link. Unclaimed projects expire in 72 hours (`project.expires_at`) and are capped at 100 MB storage and 1 GB transfer. Claim codes expire in 15 minutes (`expires_in`). Those are two clocks.

Start in the browser at [neon.com/claimable-neon](/claimable-neon), or give an agent [`auth.md`](https://neon.com/auth.md).

## Quick start

<Tabs labels={["Neon CLI", "Agent API"]}>

<TabItem>

If `neon claim` is not a command, or `neon claim --help` does not list `create`, use the Agent API tab.

Create a project and write its credentials to `.env`:

```bash
neon claim create --env-pull
```

Request Data API or Managed Better Auth when the app needs them:

```bash
neon claim create \
  --service data-api \
  --service auth \
  --env-pull
```

The CLI saves the project's identity assertion in its secure credential store. Existing commands then use the claimable project automatically:

```bash
neon branches list
neon psql --role-name neondb_owner
```

</TabItem>

<TabItem>

An agent starts with the protocol document:

```bash
curl https://neon.com/auth.md
```

Register an anonymous agent identity:

```bash
curl --request POST https://claimable.neon.tech/v1/agent/identity \
  --header 'Content-Type: application/json' \
  --data '{
    "type": "anonymous",
    "capabilities": ["postgres", "data_api"],
    "source": "example-agent"
  }'
```

The response contains an `identity_assertion`, project metadata, and one decision for every requested capability. Exchange the assertion for a short-lived access token before calling project endpoints.

</TabItem>

</Tabs>

## Agent discovery

If an agent needs a Neon account and the user is not around, [neon.com/docs/llms.txt](https://neon.com/docs/llms.txt) points at [`auth.md`](https://neon.com/auth.md).

Claimable Neon implements [auth.md](https://workos.com/auth-md/docs/auth-md). Agents can discover the complete authentication and provisioning flow without a vendor-specific integration.

| Document or endpoint                                                    | Purpose                                                                               |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `GET https://neon.com/auth.md`                                          | Protocol file (`agent_auth.skill`)                                                    |
| `GET https://neon.com/.well-known/oauth-authorization-server/claimable` | Token, revocation, identity, and skill discovery. Issuer `https://neon.com/claimable` |
| `GET https://claimable.neon.tech/.well-known/oauth-protected-resource`  | Resource server metadata                                                              |
| `GET https://claimable.neon.tech/.well-known/jwks.json`                 | Public keys for verifying Claimable Neon tokens                                       |
| `POST https://claimable.neon.tech/v1/agent/identity`                    | Provision a project and issue a durable identity assertion                            |
| `POST https://claimable.neon.tech/v1/oauth2/token`                      | Exchange the assertion for a short-lived bearer access token                          |
| `POST https://claimable.neon.tech/v1/oauth2/revoke`                     | Revoke an access token or identity assertion                                          |
| `GET https://claimable.neon.tech/v1/projects/{project_id}/credentials`  | Read scoped project and service credentials                                           |
| `POST https://claimable.neon.tech/v1/projects/{project_id}/claim`       | Create a short-lived human claim code                                                 |
| `GET https://claimable.neon.tech/v1/projects/{project_id}/claim`        | Read claim and reconciliation status                                                  |
| `DELETE https://claimable.neon.tech/v1/projects/{project_id}`           | Delete an unclaimed project                                                           |
| `/v1/projects/{project_id}/...` on `claimable.neon.tech`                | Use supported Neon Management API operations before claiming                          |

The identity assertion is a secret. Store it like an API key. There are no refresh tokens. Exchange the assertion again when an access token expires.

## Register and provision

```http
POST /v1/agent/identity
Content-Type: application/json
```

```json
{
  "type": "anonymous",
  "capabilities": ["postgres", "data_api", "auth"],
  "source": "example-agent"
}
```

`postgres` is always requested. Add `data_api` or `auth` only when the app needs them.

The response has this shape:

```json
{
  "registration_id": "reg_...",
  "identity_assertion": "eyJ...",
  "project": {
    "id": "quiet-fog-12345678",
    "branch_id": "br-...",
    "expires_at": "2026-08-14T12:00:00.000Z"
  },
  "capabilities": [
    {
      "capability": "postgres",
      "granted": true,
      "scopes": ["postgres.read", "postgres.write"]
    },
    {
      "capability": "data_api",
      "granted": true,
      "scopes": ["data_api.query"]
    }
  ]
}
```

Check every capability decision. A successful registration can contain denied optional capabilities.

### Exchange the identity assertion

```bash
curl --request POST https://claimable.neon.tech/v1/oauth2/token \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer' \
  --data-urlencode 'assertion=YOUR_IDENTITY_ASSERTION' \
  --data-urlencode 'resource=https://claimable.neon.tech/'
```

The response contains a bearer `access_token`, its scope, and its expiration:

```json
{
  "access_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 900,
  "scope": "postgres.read postgres.write data_api.query"
}
```

### Pull credentials

```bash
curl https://claimable.neon.tech/v1/projects/quiet-fog-12345678/credentials \
  --header "Authorization: Bearer $ACCESS_TOKEN"
```

```json
{
  "project_id": "quiet-fog-12345678",
  "branch_id": "br-...",
  "database_url": "postgresql://neondb_owner:...@ep-...-pooler.../neondb?sslmode=require",
  "expires_at": "2026-08-14T12:00:00.000Z",
  "services": {
    "data_api": {
      "url": "https://ep-....apirest.c-2.us-east-2.aws.neon.tech/neondb/rest/v1"
    },
    "auth": {
      "base_url": "https://ep-....neonauth.c-2.us-east-2.aws.neon.tech/api/auth",
      "jwks_url": "https://ep-....neonauth.c-2.us-east-2.aws.neon.tech/.well-known/jwks.json"
    }
  }
}
```

Only requested and granted services appear under `services`.

## Capabilities

| Capability          | Available before claim | Environment variable          |
| ------------------- | ---------------------- | ----------------------------- |
| Postgres            | Yes                    | `DATABASE_URL`                |
| Data API            | When requested, or later with `neon deploy` | `NEON_DATA_API_URL`           |
| Managed Better Auth | When requested, or later with `neon deploy` | `NEON_AUTH_BASE_URL`          |
| Functions           | No                     | Requires claiming the project |
| Object Storage      | No                     | Requires claiming the project |
| AI Gateway          | No                     | Requires claiming the project |

Registration records those as `{ granted: false, reason: "requires_claim" }`. A later protected operation returns `capability_requires_claim`. Preserve the denied capability and give the human a claim link; do not retry or drop it.

After create, add Auth or the Data API with `neon.ts` and `neon deploy` on the unclaimed project. After claim, the same config talks to Neon directly.

## Use the Neon CLI

`neon claim` and its `neon claimable` alias manage anonymous projects. If `neon claim` is not a command, or `neon claim --help` does not list `create`, use the HTTP flow in this page.

```bash
neon claim create --env-pull

neon claim create --service data-api --service auth --env-pull

neon claim status

neon claim accept --no-open

neon claim list

neon claim delete --yes
```

`neon claim accept` opens a browser by default. `--no-open` prints the URL for a human to open.

After `claim create`, regular Neon CLI commands exchange the saved identity assertion and route supported management operations through Claimable Neon. Explicit Neon account credentials take precedence when you pass them.

If a `neon.ts` file is present, `claim create` requests its declared services automatically:

```typescript filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  auth: true,
  dataApi: true,
});
```

Services that require human ownership still run through normal Config-as-Code planning. Claimable Neon returns `capability_requires_claim` for those operations, so the agent can ask for a claim instead of silently omitting part of the configuration.

## Claim a project

Create a claim code with the API:

```bash
curl --request POST \
  https://claimable.neon.tech/v1/projects/quiet-fog-12345678/claim \
  --header "Authorization: Bearer $ACCESS_TOKEN"
```

```json
{
  "user_code": "ABCD-2345",
  "verification_uri": "https://claimable.neon.tech/claim",
  "verification_uri_complete": "https://claimable.neon.tech/claim?user_code=ABCD-2345",
  "expires_in": 900,
  "interval": 5
}
```

`expires_in` is 900 seconds (15 minutes) today. If the unused code expires, POST `/claim` again. Each POST cancels the previous unused code and returns a new one. Re-issue only while `project.expires_at` is still in the future.

Open `verification_uri_complete` and sign in to Neon. Opening the URL does not freeze access. Continuing to Neon starts a transfer with a new 15-minute window: it revokes the project key, access tokens, and database password before the console transfer URL is shown. Auth and the Data API stay enabled and transfer with the project if they were enabled. If that transfer window expires before you accept, POST `/claim` again. The project key and database password stay revoked.

Choose the destination organization. The project then moves through these states:

1. `pending`: the claim code exists, but the transfer has not completed.
2. `accepted`: the project has left the unclaimed-project organization.
3. `reconciled`: the identity assertion is revoked and the ceremony is finished.

Continuing to Neon revokes existing access tokens. Re-exchange the identity assertion, then poll claim status at the server-provided `interval`. The new token has no project scopes. It authorizes that poll, and a replacement claim code if the transfer window expires.

```bash
curl --request POST https://claimable.neon.tech/v1/oauth2/token \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer' \
  --data-urlencode "assertion=$IDENTITY_ASSERTION" \
  --data-urlencode 'resource=https://claimable.neon.tech/'

curl https://claimable.neon.tech/v1/projects/quiet-fog-12345678/claim \
  --header "Authorization: Bearer $ACCESS_TOKEN"
```

Only `reconciled` means the assertion is dead. Use credentials from the destination Neon organization after that. Fetch a new `DATABASE_URL` there; Auth and the Data API keep working if they were enabled.

Add Auth or the Data API with `neon.ts` and `neon deploy` before or after claim. Data API with the default auth provider requires Auth. An external JWKS is only accepted after claim:

```typescript filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  auth: true,
  dataApi: true,
});
```

```bash
neon deploy
```

`neon checkout` does not apply this to an existing branch. `neon deploy` (alias of `neon config apply`) does.

```typescript
dataApi: {
  authProvider: 'external',
  jwksUrl: 'https://example.com/.well-known/jwks.json',
}
```

## Errors

Errors use one JSON shape across provisioning, token, credential, and management endpoints:

```json
{
  "error": {
    "code": "capability_requires_claim",
    "origin": "proxy",
    "message": "Functions require claiming this project.",
    "retryable": false,
    "request_id": "req_..."
  }
}
```

Use `error.code` for control flow and show `error.message` to the user. Retry only when `retryable` is `true`.

Common codes include:

| Code                        | Meaning                                                      |
| --------------------------- | ------------------------------------------------------------ |
| `invalid_request`           | The request body or parameter is invalid                     |
| `invalid_grant`             | The identity assertion cannot be exchanged. Discard it       |
| `unauthorized`              | No credential was presented, or it did not verify            |
| `token_expired`             | The access token expired. Re-exchange the identity assertion |
| `scope_insufficient`        | The access token does not permit the operation               |
| `capability_requires_claim` | The requested service or operation requires human ownership  |
| `claim_in_progress`         | The transfer window is still live. Poll status; mint a new code after it expires |
| `project_claimed`           | The project transferred. Discard the identity assertion      |
| `project_expired`           | The unclaimed window closed. Discard the identity assertion  |
| `upstream_error`            | A Neon API or service dependency failed                      |

## Resources

- [Create a project in the browser](/claimable-neon)
- [Claimable Neon auth.md](https://neon.com/auth.md)
- [Neon CLI reference](/docs/cli)
- [Claimable database integration](/docs/workflows/claimable-database-integration)
