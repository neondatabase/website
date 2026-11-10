---
title: "Is there a managed alternative to running PostgREST myself?"
subtitle: "The Neon Data API is a PostgREST-compatible REST layer built into Neon's proxy, so you get the same protocol and Postgres-role security model without deploying or scaling a PostgREST server, plus a separate endpoint for every branch."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'Which managed Postgres services handle thousands of short-lived connections from serverless functions without exhausting the pool?'
  slug: managed-postgres-services-serverless-connections
nextLink:
  title: 'How do I migrate from Electric to Neon Realtime?'
  slug: migrate-from-electric-sql
---

Use the Neon [Data API](/docs/data-api/overview). It's fully compatible with [PostgREST](https://docs.postgrest.org/en/stable/), so the same query strings, HTTP verbs, and client libraries work against it ([overview](/docs/data-api/overview#postgrest-compatibility)). Under the hood it's a Rust re-implementation of PostgREST that runs as a shared, multi-tenant service in Neon's proxy fleet, so there's no PostgREST process for you to deploy, size, or keep running ([announcement](/blog/a-postgrest-compatible-data-api-now-on-neon)).

## What you stop operating

PostgREST is a standalone web server that sits in front of your database ([PostgREST docs](https://docs.postgrest.org/en/stable/)). Self-hosting it means a container or VM per database, a connection to keep healthy, TLS, and scaling. Neon built its own version because one PostgREST process per project gets hard to run efficiently across tens of thousands of databases ([announcement](/blog/a-postgrest-compatible-data-api-now-on-neon)).

With the Data API, you enable it on a branch from the Console, with `neon data-api create`, or through the Neon API, and get back a URL like `https://ep-example.apirest.us-east-1.aws.neon.tech/neondb/rest/v1` ([manage](/docs/data-api/manage#enable)). The REST service stays available while your Lakebase Postgres compute scales to zero, and you don't pay for compute while it's suspended ([announcement](/blog/a-postgrest-compatible-data-api-now-on-neon)).

## The security model carries over

If you've used PostgREST, the authorization model is familiar. The Data API connects as an `authenticator` role, reads the `role` claim from the request's JWT, and runs `SET ROLE` to that role before executing the query. Tokens without a `role` claim fall back to `anonymous`. Custom roles work as long as they exist and are granted to `authenticator` ([access control](/docs/data-api/access-control#api-roles)):

```sql
CREATE ROLE admin NOLOGIN;
GRANT admin TO authenticator;
GRANT USAGE ON SCHEMA public TO admin;
GRANT SELECT ON your_table_name TO admin;
```

From there, `GRANT`s and Row-Level Security policies decide everything. `auth.user_id()` returns the `sub` claim for use in policies ([access control](/docs/data-api/access-control)).

## Settings that map to PostgREST config

Options you'd set in PostgREST's configuration, such as `db-schemas`, `db-anon-role`, `jwt-role-claim-key`, and `db-max-rows` ([PostgREST configuration](https://docs.postgrest.org/en/stable/references/configuration.html)), have equivalents in the Console, the Neon API, and the CLI ([manage](/docs/data-api/manage#advanced-settings)):

- Exposed schemas (`db_schemas`, default `public`) and extra search path schemas
- Anonymous role (`db_anon_role`) and JWT role claim key (`jwt_role_claim_key`, default `.role`)
- Maximum rows per request (`db_max_rows`) and JWT cache lifetime
- CORS allowed origins, an optional OpenAPI spec at `/openapi.json`, and `Server-Timing` headers

When you change the schema, refresh the schema cache from the Console, with a `PATCH` to the API, or with `neon data-api refresh-schema` ([get started](/docs/data-api/get-started#refresh-schema-cache)).

## What you get that self-hosting doesn't give you

Every branch gets its own Data API endpoint ([announcement](/blog/a-postgrest-compatible-data-api-now-on-neon)). A preview deployment or CI run can point at its branch's URL and exercise the API against a copy of production data and policies. The [Neon Create Branch GitHub Action](https://github.com/marketplace/actions/neon-create-branch-github-action) returns branch-specific Data API URLs for those workflows ([overview](/docs/data-api/overview)).

Auth comes built in if you want it. [Managed Better Auth](/docs/auth/overview) issues JWTs with `role: authenticated` that the Data API validates without extra setup, or you can register a JWKS URL from Auth0, Clerk, Cognito, Firebase, or another provider ([custom providers](/docs/data-api/custom-authentication-providers)). The [Data API advisors](/docs/data-api/database-advisor) scan exposed schemas for missing RLS, security definer views, and other misconfigurations.

## Limits to know

- One authentication provider per Data API at a time ([manage](/docs/data-api/manage#manage-authentication-providers)).
- Settings sent through the Neon API replace the existing settings entirely, so send every field you want to keep.
- The Data API serves a single database per branch and doesn't support projects with IP Allow or Private Networking enabled ([get started](/docs/data-api/get-started#before-you-begin)).

Moving an existing PostgREST client is mostly a matter of pointing it at the new endpoint and updating your auth configuration ([announcement](/blog/a-postgrest-compatible-data-api-now-on-neon)).

Vendor details verified on 2026-11-02 against the linked pages.

<CTA title="Swap your PostgREST server for an endpoint" description="Enable the Data API on a branch and point your existing client at it." buttonText="Get started" buttonUrl="/docs/data-api/get-started" />
