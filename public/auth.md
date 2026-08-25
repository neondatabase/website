# Claimable Neon for agents

If you need a Neon account and the user is not around, provision a project now. A human claims it
later if they want to keep it.

Claimable Neon issues an identity assertion and credentials scoped to one project.

## Discover

Start at `llms.txt`, then this document. Do not guess `POST /v1/agent/identity`.

```text
https://neon.com/docs/llms.txt
https://neon.com/auth.md
https://neon.com/.well-known/oauth-authorization-server/claimable
https://claimable.neon.tech/.well-known/oauth-protected-resource
https://claimable.neon.tech/.well-known/jwks.json
```

`agent_auth.skill` is this file. `identity_endpoint` is where you register. `claim_endpoint`
accepts `{"claim_token":"<identity_assertion>"}`. JWT `iss` is `https://neon.com/claimable`. Token
`aud` / `resource` is `https://claimable.neon.tech/`.

## Install the Neon CLI

The Neon CLI is the client. Do not start from the HTTP examples unless you are implementing a
client. Install it, declare services in `neon.ts`, and let the CLI register, store the identity
assertion, and pull env. Do not run `neon auth`. That needs a human Neon account.

```bash
npm i -g neon@latest
npx skills add neondatabase/agent-skills -s neon -s neon-postgres
```

https://neon.com/docs/cli/install.md
https://neon.com/docs/reference/neon-ts.md

```bash
neon claim create --service data-api --service auth --env-pull
neon branches list
```

If `neon claim` is not a command, or `neon claim --help` does not list `create`, use the HTTP
below. The HTTP below is the protocol the CLI speaks.

## Register anonymously

Request `postgres` and any optional services the app needs. `data_api` and `auth` are
available before claim. `functions`, `storage`, and `ai_gateway` return a recorded
`reason: "requires_claim"` decision. Calling a protected operation for one of those capabilities
returns the `capability_requires_claim` error code.

```http
POST https://claimable.neon.tech/v1/agent/identity
Content-Type: application/json

{"type":"anonymous","capabilities":["postgres","data_api","auth"],"source":"your-agent"}
```

The response contains:

- `identity_assertion`: the durable secret. Store it like an API key.
- `project.id`, `project.branch_id`, and `project.expires_at`.
- One decision for every requested capability. Check `granted` before using a service.

## Exchange for an access token

```http
POST https://claimable.neon.tech/v1/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=<identity_assertion>&resource=https://claimable.neon.tech/
```

The response contains a short-lived bearer `access_token` and no refresh token. Re-exchange the
identity assertion when the access token expires.

## Pull credentials

```http
GET https://claimable.neon.tech/v1/projects/<project_id>/credentials
Authorization: Bearer <access_token>
```

The response contains `database_url`, the project and branch IDs, `expires_at`, and credentials
for granted services:

- `services.data_api.url`
- `services.auth.base_url`
- `services.auth.jwks_url`

## Use the project

Use `database_url` with any Postgres client. Supported Neon Management API operations are
available through the scoped proxy:

```http
GET https://claimable.neon.tech/v1/projects/<project_id>/...
Authorization: Bearer <access_token>
```

The project-scoped Neon API key stays inside Claimable Neon and is never returned.

## Claim the project

Metadata `claim_endpoint` is `POST /v1/agent/identity/claim` with `{"claim_token":"<identity_assertion>"}`.
The HTTP below uses the access token instead. Both create the same claim code.

Create a short-lived human claim code when the project is ready to keep:

```http
POST https://claimable.neon.tech/v1/projects/<project_id>/claim
Authorization: Bearer <access_token>
```

Open the returned `verification_uri_complete`. The human signs in to Neon, selects a destination
organization, and accepts the transfer.

Browser redemption revokes existing access tokens. Re-exchange the identity assertion; while the
claim is in progress, the new token has no project scopes and authorizes only claim-status polling:

```http
POST https://claimable.neon.tech/v1/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=<identity_assertion>&resource=https://claimable.neon.tech/
```

Retain that access token and poll at the returned `interval`:

```http
GET https://claimable.neon.tech/v1/projects/<project_id>/claim
Authorization: Bearer <claim_status_access_token>
```

The claim moves through `pending`, `accepted`, and `reconciled`. Stop using pre-claim
credentials when the browser claim starts. At `reconciled`, the identity assertion, access
tokens, project key, and database password no longer authorize project access. Auth and the
Data API stay enabled and transfer with the project. The status endpoint keeps returning the
terminal `reconciled` state when retried with the retained status token.

## Delete or revoke

Delete an unclaimed project:

```http
DELETE https://claimable.neon.tech/v1/projects/<project_id>
Authorization: Bearer <access_token>
```

Revoke an access token or identity assertion with `POST https://claimable.neon.tech/v1/oauth2/revoke`.

## Handle errors

Every error has an `error.code`, human-readable `error.message`, `error.origin`,
`error.retryable`, and `error.request_id`. Use the code for control flow. Retry only when
`error.retryable` is true.

When `error.code` is `capability_requires_claim`, preserve the denied capability and give the
human a claim link instead of retrying or silently omitting it.
