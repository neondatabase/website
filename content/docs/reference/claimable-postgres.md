---
title: Claimable Postgres by Neon
subtitle: Let an agent create a temporary database before a human creates an account
summary: >-
  Claimable Postgres lets agents provision Lakebase Postgres on Neon through
  auth.md, the Neon CLI, or a REST API without a Neon account. The service
  issues scoped agent credentials for one temporary project, can add Data API
  and Managed Better Auth, and transfers the project into a Neon organization
  when a human claims it.
enableTableOfContents: true
redirectFrom:
  - /docs/reference/neon-launchpad
  - /docs/reference/instagres
---

Claimable Postgres lets an agent create a temporary database on Neon before a human signs up. The agent receives credentials scoped to one project, builds with standard Postgres tools, and gives the human a claim link when the project is worth keeping.

Start in the browser at [neon.com/claimable-postgres](/claimable-postgres), or give an agent the service's [`auth.md`](https://claimable.neon.tech/auth.md) document.

## Quick start

<Tabs labels={["Neon CLI", "Agent API"]}>

<TabItem>

Create a project and write its credentials to `.env`:

```bash
npx neon@latest claim create --env-pull
```

Request Data API or Managed Better Auth when the app needs them:

```bash
npx neon@latest claim create \
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
curl https://claimable.neon.tech/auth.md
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

Claimable Postgres implements [auth.md](https://auth.md/). Agents can discover the complete authentication and provisioning flow without a vendor-specific integration.

| Document or endpoint                          | Purpose                                                      |
| --------------------------------------------- | ------------------------------------------------------------ |
| `GET /auth.md`                                | Human-readable agent instructions and examples               |
| `GET /.well-known/oauth-protected-resource`   | Resource server metadata                                     |
| `GET /.well-known/oauth-authorization-server` | Token, revocation, identity, and skill endpoint discovery    |
| `GET /.well-known/jwks.json`                  | Public keys for verifying Claimable Neon tokens              |
| `POST /v1/agent/identity`                     | Provision a project and issue a durable identity assertion   |
| `POST /v1/oauth2/token`                       | Exchange the assertion for a short-lived bearer access token |
| `POST /v1/oauth2/revoke`                      | Revoke an access token or identity assertion                 |
| `GET /v1/projects/{project_id}/credentials`   | Read scoped project and service credentials                  |
| `POST /v1/projects/{project_id}/claim`        | Create a short-lived human claim code                        |
| `GET /v1/projects/{project_id}/claim`         | Read claim and reconciliation status                         |
| `DELETE /v1/projects/{project_id}`            | Delete an unclaimed project                                  |
| `/v1/projects/{project_id}/...`               | Use supported Neon Management API operations before claiming |

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

| Capability | Available before claim | Environment variable          |
| ---------- | ---------------------- | ----------------------------- |
| Postgres   | Yes                    | `DATABASE_URL`                |
| Data API   | When requested         | `NEON_DATA_API_URL`           |
| Auth       | When requested         | `NEON_AUTH_BASE_URL`          |
| Functions  | No                     | Requires claiming the project |
| Storage    | No                     | Requires claiming the project |
| AI Gateway | No                     | Requires claiming the project |

Unsupported pre-claim capabilities return the `capability_requires_claim` error code. Agents should preserve that code and give the user the claim URL instead of retrying.

## Use the Neon CLI

`neon claim` and its `neon claimable` alias manage anonymous projects:

```bash
# Create a Postgres project
npx neon@latest claim create --env-pull

# Request services explicitly
npx neon@latest claim create --service data-api --service auth --env-pull

# Check the current human-claim state
npx neon@latest claim status

# Generate and open a human claim link
npx neon@latest claim accept

# List claimable projects saved on this machine
npx neon@latest claim list

# Delete the unclaimed project and local credentials
npx neon@latest claim delete --yes
```

After `claim create`, regular Neon CLI commands exchange the saved identity assertion and route supported management operations through Claimable Neon. Explicit Neon account credentials take precedence when you pass them.

If a `neon.ts` file is present, `claim create` requests its declared services automatically:

```typescript filename="neon.ts"
import { defineConfig } from '@neon/config';

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

Open `verification_uri_complete`, sign in to Neon, and choose the destination organization. The project transfer then moves through these states:

1. `pending`: the claim code exists, but the transfer has not completed.
2. `accepted`: the project has left the unclaimed-project organization.
3. `reconciled`: Claimable Neon has revoked its project key, agent tokens, and derived credentials.

Poll claim status at the server-provided `interval`:

```bash
curl https://claimable.neon.tech/v1/projects/quiet-fog-12345678/claim \
  --header "Authorization: Bearer $ACCESS_TOKEN"
```

Stop using agent credentials when the state reaches `accepted`. Use credentials from the destination Neon organization after reconciliation.

## Errors

Errors use one JSON shape across provisioning, token, credential, and management endpoints:

```json
{
  "error": {
    "code": "capability_requires_claim",
    "origin": "service",
    "message": "Functions require claiming this project.",
    "retryable": false,
    "request_id": "req_..."
  }
}
```

Use `error.code` for control flow and show `error.message` to the user. Retry only when `retryable` is `true`.

Common codes include:

| Code                        | Meaning                                                       |
| --------------------------- | ------------------------------------------------------------- |
| `invalid_request`           | The request body or parameter is invalid                      |
| `invalid_grant`             | The identity assertion cannot be exchanged                    |
| `invalid_token`             | The access token is invalid, expired, or revoked              |
| `insufficient_scope`        | The access token does not permit the operation                |
| `capability_requires_claim` | The requested service or operation requires human ownership   |
| `claim_in_progress`         | Credential issuance is frozen while a claim is pending        |
| `project_claimed`           | The project transferred and agent credentials no longer apply |
| `upstream_unavailable`      | A Neon API or service dependency is temporarily unavailable   |

## Resources

- [Create a database in the browser](/claimable-postgres)
- [Claimable Neon auth.md](https://claimable.neon.tech/auth.md)
- [Neon CLI reference](/docs/cli)
- [Claimable database integration](/docs/workflows/claimable-database-integration)
