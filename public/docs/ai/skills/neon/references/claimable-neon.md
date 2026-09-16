# Claimable Neon

Claimable Neon provisions a temporary Neon project — Lakebase Postgres, and optionally the Data API and Managed Better Auth — before a human creates an account. The agent holds an identity assertion, not a Neon API key. A human can later claim the project into their organization.

This flow follows the [auth.md](https://claimable.neon.tech/auth.md) protocol. Fetch `https://claimable.neon.tech/auth.md` for request and response fields. REST is on `https://claimable.neon.tech`. Use the table below; do not invent other identity paths.

Use this after the neon skill account check found no account.

## Path

1. Install the CLI: `npm i -g neon@latest`
2. If `neon claim --help` does not list `create`, skip to [If neon claim is missing](#if-neon-claim-is-missing).
3. Write a `neon.ts` that declares the services you need, or skip the file and pass `--service` on create. Postgres is always requested.
4. Create the project: `neon claim create --env-pull` (add `--service data-api --service auth` if there is no `neon.ts`)
5. If create did not write env, pull it: `neon env pull`
6. Use the `neon-postgres` skill for connections, schemas, and queries. Install it if it is missing: `neon skills -s neon-postgres`

Do not run `neon init --agent` or `neon auth` on this path; those need a human Neon account. `--api-key` and `--profile` are refused on `neon claim`.

```bash
npm i -g neon@latest
neon claim --help
```

If that help lists `create` and you need Auth or the Data API, `npm i @neon/config` and write `neon.ts`. Then `neon claim create --env-pull`.

```typescript
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  dataApi: true,
});
```

`neon claim create` reads `neon.ts` when it is present. It writes provisioned vars to an existing `.env`, otherwise `.env.local`, and gitignores that file. If `.env` or `.env.local` already has a `DATABASE_URL` (or other Neon-managed keys), pass `--file <path>` or `--no-env-pull`. The identity assertion is the pre-claim credential.

Before claim, Postgres is always granted; Auth and the Data API are granted when requested. Functions, Object Storage, and AI Gateway come back with `granted: false` and `reason: "requires_claim"`. The CLI prints those as `denied_capabilities`. Report what you were given. Do not retry or strip them.

After create, report the `project_id`, `project_expires_at`, and any denied capabilities. Do not invent the window. Unclaimed projects expire at `project_expires_at` (72 hours today). That clock is independent of the claim code.

## Claim

Do not mint a claim URL until the human is ready. Opening the URL does not freeze access. Continuing to Neon starts the transfer and rotates `DATABASE_URL`. Existing access tokens are revoked. Auth and the Data API stay enabled when they were granted.

A claim code expires in `expires_in` seconds (15 minutes / 900 today). If the unused code expires, mint another: `neon claim accept --no-open` or `POST /v1/projects/{id}/claim`. Each mint cancels the previous unused code. You can mint several times; only the latest unused code works. Re-issue only while `project_expires_at` is still in the future.

Continuing to Neon starts a transfer with a new 15-minute window and leaves the project key and database password revoked. If that window expires before the human accepts, mint again. Do not restore pre-claim `DATABASE_URL`.

When `reconciled` is true, the pre-claim `DATABASE_URL` no longer works. Auth and Data API URLs stay if they were granted. The human signs in with `neon auth`. Then the agent runs `neon link` and `neon env pull` to write the new `DATABASE_URL`. `neon link` discovers the project after that sign-in.

Auth and the Data API stay off unless requested at create or enabled later. On the unclaimed project, `neon.ts` plus `neon deploy` enables them. After claim, the same config talks to Neon directly. An external JWKS is only accepted after claim. Data API with the default auth provider requires Auth:

```typescript
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  dataApi: true,
});
```

```bash
neon deploy
```

```typescript
export default defineConfig({
  dataApi: {
    authProvider: "external",
    jwksUrl: "https://example.com/.well-known/jwks.json",
  },
});
```

`neon checkout` does not apply this to an existing branch. `neon deploy` (alias of `neon config apply`) does.

### With the CLI

When the human is ready, run `neon claim accept --no-open`. Bare `neon claim accept` opens a browser. Report the `verification_url`, `user_code`, and `expires_in_seconds` the CLI printed (HTTP names: `verification_uri_complete`, `user_code`, `expires_in`). If the code expires, run `neon claim accept --no-open` again. Poll with `neon claim status`. The CLI re-exchanges the assertion; do not call the token endpoint yourself.

```bash
neon claim accept --no-open
neon claim status
```

Permanently delete the unclaimed project (this does not cancel a claim):

```bash
neon claim delete --yes
```

### With REST

An agent must not complete the claim. Do not `POST /v1/projects/{id}/claim` until the human is ready. The human opens `verification_uri_complete` and accepts the transfer. If the claim code expires, `POST /v1/projects/{id}/claim` again. Each POST replaces the unused previous code. If the human continued to Neon and that transfer expired, POST again for a new code. The live claim response also includes `user_code` and `expires_in`. `auth.md` documents `verification_uri_complete` and the polling `interval`.

After the human continues to Neon, existing access tokens are revoked: re-exchange the identity assertion, then poll `GET /v1/projects/{id}/claim` with that token at the interval `auth.md` returns. `claim_in_progress` on a new mint means the transfer window is still live: poll, do not mint. After that window expires, POST claim again. Report `verification_uri_complete`, `user_code`, and `expires_in`.

When `error.code` is `capability_requires_claim`, preserve the denied capability and give the human a claim link instead of retrying or silently omitting it.

Only `invalid_grant`, `project_expired`, and `project_claimed` mean the stored identity assertion is dead. `token_expired` means re-exchange the assertion.

## If neon claim is missing

Fall back to the REST API. Fetch `https://claimable.neon.tech/auth.md` for request and response fields. The claimable resource is `/v1/projects/{id}` on `https://claimable.neon.tech`, not `/v1/databases/{id}`. Follow [Claim](#claim) for when to mint, what rotates, and what to do after `reconciled`.

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
