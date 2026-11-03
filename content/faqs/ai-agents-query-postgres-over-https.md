---
title: "How can an AI agent query a Postgres database over HTTPS without a driver?"
subtitle: "The Neon Data API exposes your Lakebase Postgres tables as a PostgREST-compatible HTTPS endpoint, so an agent can read and write with fetch or curl while a scoped JWT and Row-Level Security limit what it can touch."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-03T23:21:47.530Z'
isDraft: false
previousLink:
  title: 'Which managed Postgres options are affordable for early-stage startups that need a production database but have unpredictable traffic?'
  slug: affordable-managed-postgres-options-startups
nextLink:
  title: 'Can I declare my whole backend (database, auth, file storage, functions, and AI) as code in one file?'
  slug: backend-as-code-single-config-file
---

Use the Neon [Data API](/docs/data-api/overview). It speaks HTTPS the way the OpenAI or Stripe APIs do, so an agent can query your Lakebase Postgres database with `fetch()` or `curl` and no Postgres client library ([announcement](/blog/a-postgrest-compatible-data-api-now-on-neon)). Each request carries a JWT, and the role in that token plus your Row-Level Security policies decide which rows the agent can read or change ([access control](/docs/data-api/access-control)).

## Why not hand the agent a connection string

A connection string gives whoever holds it the full privileges of that Postgres role, and it needs a Postgres driver over a persistent TCP connection. Standard drivers don't work in browsers and struggle in edge runtimes ([overview](/docs/data-api/overview)). Short-lived HTTP requests avoid both problems: there's no connection pool to exhaust when many agents run at once, and access is scoped per token rather than per shared password.

## A request is one HTTP call

The Data API follows the PostgREST protocol. Reading and writing look like this ([get started](/docs/data-api/get-started#option-2-direct-http-requests)):

```bash
# Read
curl 'https://ep-example.apirest.us-east-1.aws.neon.tech/neondb/rest/v1/posts?is_published=eq.true&order=created_at.desc' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'

# Write
curl -X POST 'https://ep-example.apirest.us-east-1.aws.neon.tech/neondb/rest/v1/posts' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"content": "Hello world"}'
```

If you turn on the OpenAPI setting, `GET /rest/v1/openapi.json` returns a schema of your tables, columns, and endpoints, which an agent can read to discover what it's allowed to call. Fetching the spec needs a valid JWT, like any other request ([manage](/docs/data-api/manage#openapi-specification)). To translate SQL the agent already knows into PostgREST query strings, see the [SQL to REST converter](/docs/data-api/sql-to-rest).

## Scope each agent with a role and RLS

The Data API runs every request as the Postgres role named in the token's `role` claim ([access control](/docs/data-api/access-control#api-roles)). That lets you give agents their own role with narrower grants than your app users. For a read-only agent:

```sql
CREATE ROLE agent_readonly NOLOGIN;
GRANT agent_readonly TO authenticator;
GRANT USAGE ON SCHEMA public TO agent_readonly;
GRANT SELECT ON posts TO agent_readonly;
```

Issue the agent a token with `"role": "agent_readonly"` and it can't insert, update, or delete, whatever it tries. RLS policies then narrow which rows it sees, using `auth.user_id()` to read the token's `sub` claim. On tables with RLS enabled, the role also needs a policy before it sees any rows ([access control](/docs/data-api/access-control#understanding-rls-states)).

Tokens can come from [Managed Better Auth](/docs/auth/overview), when an agent acts on behalf of a signed-in user, or from any JWT issuer you register with a JWKS URL ([custom providers](/docs/data-api/custom-authentication-providers)). Managed Better Auth JWTs expire after about 15 minutes, so long-running agents need to refresh them ([get started](/docs/data-api/get-started#testing-with-managed-better-auth)).

## Give each agent run its own branch

The Data API is enabled per branch, and every branch gets its own endpoint ([get started](/docs/data-api/get-started#before-you-begin)). An agent that's about to try a migration or bulk edit can work against a branch: same schema, same policies, a copy of the data, and a separate URL. If the run goes wrong, delete the branch. A [`neon.ts`](/docs/reference/neon-ts) branch policy can set a `ttl` so throwaway branches expire on their own.

The REST service stays available while the branch's compute scales to zero, so the first request after a quiet period still succeeds ([announcement](/blog/a-postgrest-compatible-data-api-now-on-neon)). Agents that provision their own backend can enable the API with the Neon MCP server's `provision_neon_data_api` tool or `neon data-api create` ([get started](/docs/data-api/get-started#enable-the-data-api)).

## Limits to know

- The Data API has no permission layer of its own. A table with RLS disabled returns every row to any role granted access to it, so run the [Data API advisors](/docs/data-api/database-advisor) before giving agents access.
- After schema changes, refresh the schema cache so new tables show up ([get started](/docs/data-api/get-started#refresh-schema-cache)).
- Projects with IP Allow or Private Networking enabled aren't supported.

<CTA title="Give your agent an HTTPS endpoint" description="Enable the Data API on a branch and make your first request with curl." buttonText="Get started" buttonUrl="/docs/data-api/get-started" />
