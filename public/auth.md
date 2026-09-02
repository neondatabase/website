# Claimable Neon

You need a Neon project and no human is signed in. Provision now. A human claims it later
if they want to keep it.

This file is https://neon.com/auth.md.

If `NEON_API_KEY` is set, use that account and stop. If `neon` is on `PATH`, run
`neon profile list -o json`. A profile whose `account` is not `-` is an account; use it and
stop. A `DEFAULT` row with `account: "-"` is not an account. Do not run `neon auth` on this
path.

## Provision

```bash
npm i -g neon@latest
```

If `neon claim --help` lists `create`:

```bash
neon claim create --service data-api --service auth
neon branches list
```

Drop `--service` flags the app does not need. Postgres is always included. The CLI writes
`DATABASE_URL` (and granted service URLs) to `.env` or `.env.local`. Then skip to Claim when
the human is ready.

If `create` is not a command, use HTTP.

### Register

`source` is your agent name, 1-100 characters. Replace `your-agent`. Request only services
the app needs. `postgres`, `data_api`, and `auth` can be granted now. `functions`,
`storage`, and `ai_gateway` return `granted: false` and `reason: "requires_claim"`. Do not
retry those. Finish provision with what was granted. If the app still needs a denied
service, claim after you have `project.id` and an access token.

```http
POST https://claimable.neon.tech/v1/agent/identity
Content-Type: application/json

{"type":"anonymous","capabilities":["postgres","data_api","auth"],"source":"your-agent"}
```

Keep:

- `identity_assertion`: the durable secret. Store it like an API key.
- `project.id`, `project.branch_id`, and `project.expires_at`. The unclaimed project dies at
  `expires_at` (72 hours today).
- One row per requested capability. Check `granted` before using a service.

Register returns 201 today. Treat any 2xx as success. Otherwise stop. Do not continue with
missing fields.

### Access token

The assertion is issued by https://neon.com/claimable. Exchange it for a short-lived bearer
token. There is no refresh token. Re-exchange the same assertion when the token expires.

```http
POST https://claimable.neon.tech/v1/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=<identity_assertion>&resource=https://claimable.neon.tech/
```

Keep `access_token`. Send it as `Authorization: Bearer <access_token>`.

### Credentials

`project_id` is `project.id` from register.

```http
GET https://claimable.neon.tech/v1/projects/<project_id>/credentials
Authorization: Bearer <access_token>
```

Keep `database_url`. If granted: `services.data_api.url`, `services.auth.base_url`,
`services.auth.jwks_url`. Use `database_url` with any Postgres client.

## Claim

Do not mint a claim URL until the human is ready to keep the project.

If the CLI created the project:

```bash
neon claim accept --no-open
```

Report the printed verification URL. Then run `neon claim status` until it reports
reconciled.

Otherwise HTTP. `project_id` is `project.id`. The access token is from the token call above.

```http
POST https://claimable.neon.tech/v1/projects/<project_id>/claim
Authorization: Bearer <access_token>
```

Keep `verification_uri_complete`, `user_code`, `expires_in`, and `interval`. Give the human
`verification_uri_complete`. They sign in to Neon, select a destination organization, and
accept the transfer.

An unused claim code dies in `expires_in` seconds (900 today). If they have not continued to
Neon and the code expired, POST this endpoint again. Each POST cancels the previous unused
code. Re-issue only while `project.expires_at` is still in the future.

Opening `verification_uri_complete` does not freeze access.

Start polling now, every `interval` seconds, with the current `access_token`:

```http
GET https://claimable.neon.tech/v1/projects/<project_id>/claim
Authorization: Bearer <access_token>
```

```json
{"state":"pending","expires_at":"<iso8601>","reconciled":false}
```

Stop when `reconciled` is `true`.

If GET returns 401, re-exchange with the same token POST as above and keep polling. When they
continue to Neon, `DATABASE_URL` is rotated. Do not restore the old `database_url`. If the
transfer window expires before they accept, POST claim again.

At `reconciled: true`, discard the identity assertion, access tokens, and pre-claim
`database_url`. They no longer authorize project access. Auth and the Data API stay enabled
and transfer with the project if they were granted. The human owns the project. You are
done.
