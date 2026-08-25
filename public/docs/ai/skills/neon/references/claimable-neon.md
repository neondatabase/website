# Claimable Neon

Claimable Neon provisions a temporary Neon project — Lakebase Postgres, and optionally the Data API and Managed Better Auth — before a human creates an account. The agent holds an identity assertion, not a Neon API key. A human can later claim the project into their organization.

This flow follows the [auth.md](https://neon.com/auth.md) protocol. Fetch that file for request and response fields. REST is on `https://claimable.neon.tech`. Do not guess `POST /v1/agent/identity`.

Use this when there is no Neon account yet. The CLI is already authenticated if any of these is true:

- `NEON_API_KEY` is set
- `NEON_PROFILE` is set
- `neon profile list -o json` lists a profile whose `account` is not `-`

A `DEFAULT` row with `account: "-"` and `file: "missing"` is not an account.

If the CLI is authenticated, stop and use those credentials. If a command waits on a browser (`Awaiting authentication in web browser`) or authentication fails, stop and ask the user to sign in (`neon auth`) or mint an API key. Prefer that over Claimable Neon unless they say otherwise.

If they cannot sign in or provide a key right now, ask before continuing. Continue only after they say yes. That is a temporary workaround.

## Path

1. Install the CLI: `npm i -g neon@latest`
2. Write a `neon.ts` that declares the services you need, or skip the file and pass `--service` on create. Postgres is always requested.
3. Create the project: `neon claim create --env-pull` (add `--service data-api --service auth` if there is no `neon.ts`)
4. Pull env if create did not write it: `neon env pull`
5. Use the `neon-postgres` skill for connections, schemas, and queries. Install it if it is missing: `npx skills add neondatabase/agent-skills -s neon-postgres`

Do not run `npx neon@latest init --agent` or `neon auth` on this path; those need a human Neon account. `--api-key` and `--profile` are refused on `neon claim`.

```typescript
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  dataApi: true,
});
```

```bash
npm i @neon/config
neon claim create --env-pull
neon env pull
```

`neon claim create` reads `neon.ts` when it is present. It writes provisioned vars to an existing `.env`, otherwise `.env.local`, and gitignores that file. If `.env` or `.env.local` already has a `DATABASE_URL` (or other Neon-managed keys), pass `--file <path>` or `--no-env-pull`. The identity assertion is the pre-claim credential.

Before claim, Postgres is always granted; Auth and the Data API are granted when requested. Functions, Object Storage, and AI Gateway are recorded as `denied_capabilities` with reason `requires_claim`. Report that field. Do not retry or strip them.

After create, report the `project_id`, `expires_at`, and `denied_capabilities` the CLI printed. Do not invent the window.

## Claim

Do not run `neon claim accept` until the human is ready. Accept mints a claim URL. Credentials keep working until the human opens that URL and accepts the transfer; then the project is `claim_in_progress` and only claim-status polling remains.

When the human is ready, run `neon claim accept --no-open`. Bare `neon claim accept` opens a browser. Report the `verification_url`, `user_code`, and `expires_in_seconds` the CLI printed. If the code expires, run `neon claim accept --no-open` again. Claiming transfers the project and rotates `DATABASE_URL`. Auth and the Data API stay enabled.

```bash
neon claim accept --no-open
neon claim status
```

When `neon claim status` reports `reconciled: true`, the pre-claim `DATABASE_URL` no longer works. Auth and Data API URLs stay. The human signs in with `neon auth`. Then the agent runs `neon link --agent` and `neon env pull` to write the new `DATABASE_URL`. `neon link --agent` discovers the project after that sign-in.

Permanently delete the unclaimed project (this does not cancel a claim):

```bash
neon claim delete --yes
```

## If the Neon CLI cannot be used

Fall back to the REST API. Fetch `https://neon.com/auth.md` for request and response fields. The claimable resource is `/v1/projects/{id}` on `https://claimable.neon.tech`, not `/v1/databases/{id}`.

```http
POST https://claimable.neon.tech/v1/agent/identity
POST https://claimable.neon.tech/v1/oauth2/token
GET  https://claimable.neon.tech/v1/projects/{id}/credentials
POST https://claimable.neon.tech/v1/projects/{id}/claim
GET  https://claimable.neon.tech/v1/projects/{id}/claim
DELETE https://claimable.neon.tech/v1/projects/{id}
```

| CLI                           | REST                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------- |
| `neon claim create`           | `POST /v1/agent/identity`, then `POST /v1/oauth2/token`, then `GET /v1/projects/{id}/credentials` |
| `neon claim accept --no-open` | `POST /v1/projects/{id}/claim`                                                                    |
| `neon claim status`           | `GET /v1/projects/{id}/claim`                                                                     |
| `neon claim delete --yes`     | `DELETE /v1/projects/{id}`                                                                        |

An agent must not complete the claim. The human opens `verification_uri_complete` and accepts the transfer. If the claim code expires, `POST /v1/projects/{id}/claim` again.

When `error.code` is `capability_requires_claim`, preserve the denied capability and give the human a claim link instead of retrying or silently omitting it.

Only `invalid_grant`, `project_expired`, and `project_claimed` mean the stored identity assertion is dead. `token_expired` means re-exchange the assertion. `claim_in_progress` means only claim-status polling remains.
