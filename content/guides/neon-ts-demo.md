---
title: Manage Neon projects with neon.ts
subtitle: 'Provision your entire Neon backend from a single TypeScript config: Postgres, auth, functions, storage, AI Gateway, and triggers.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-06-24T00:00:00.000Z'
updatedOn: '2026-09-30T12:39:17.064Z'
---

[`neon.ts`](/docs/reference/neon-ts) is Neon's native **Infrastructure-as-Code (IaC)** file for full-stack TypeScript projects. Traditional IaC tools such as [Terraform](/docs/reference/terraform), [Pulumi](/guides/neon-pulumi), or [OpenTofu](/guides/opentofu-neon) require learning a new DSL, managing state files, and wiring outputs into your application by hand. `neon.ts` is part of your local development loop instead. It provisions infrastructure through the [Neon CLI (`neon`)](/docs/cli) and syncs connection strings directly into `.env.local`.

With `neon.ts`, you can:

- **Provision every Neon backend service** in one file: [Lakebase Postgres](/docs/postgres/overview), [Managed Better Auth](/docs/auth/overview), the [Data API](/docs/data-api/overview), [Functions](/docs/compute/functions/overview), [Object Storage](/docs/storage/overview), and the [AI Gateway](/docs/ai-gateway/overview).
- **Declare event-driven work** with [Function Triggers](/docs/compute/functions/triggers/overview), so a function runs on a cron schedule or when a file lands in a bucket.
- **Configure branch policies** in code, for example, capping compute on preview branches or setting TTLs so they're deleted automatically.
- **Skip state files entirely**, since `neon` reads live state directly from your Neon project.

Every service you declare in `neon.ts` is provisioned on every branch. A preview or feature branch gets its own database, buckets, functions, auth environment, and AI Gateway endpoint. See [the Neon backend is generally available](/docs/changelog/2026-09-18) and [How a Neon backend fits together](/docs/get-started/backend-overview).

<Admonition type="note" title="Backend services are GA in neon.ts">
The GA release moved `aiGateway`, `functions`, and `buckets` to top-level keys in `defineConfig`, alongside `auth` and `dataApi`. Declaring them under a `preview` block still works but logs a deprecation warning. This guide uses the top-level form. If you're on `@neon/config` earlier than 1.6.0, upgrade with `npm install @neon/config@latest`. See the [`neon.ts` reference](/docs/reference/neon-ts#services).
</Admonition>

This guide walks through using `neon.ts` on a minimal TypeScript project, so you can see how the config provisions services, how credentials land in your environment, and how the branch-first workflow ties it together. It demonstrates the following workflow:

- **Declare** every service you use, plus per-branch policy, in one `neon.ts`.
- **Preview** a change with `neon config plan`, then **apply** it with `neon deploy`.
- **Read** the injected credentials from `.env.local` instead of hand-copying them.
- **Inspect** the branch's live state with `neon config status`.
- **Fork** the whole backend from your policy with `neon checkout`.
- **Compare** branches with `neon diff` before you merge.

The example function is deliberately minimal. In a real project, this is where your business logic lives: the handlers that query your database, call models through the AI Gateway, and process uploads from Object Storage.

## Prerequisites

Before you begin, make sure you have:

1. **Node.js**: Version 22 or later (v24 recommended). Download from [nodejs.org](https://nodejs.org/).
2. **Neon account**: Sign up for a free Neon account at [console.neon.tech](https://console.neon.tech/signup).
3. **Neon CLI**: Installed globally (`npm i -g neon@latest`) and authenticated (`neon login`). See the [Neon CLI quickstart](/docs/cli/quickstart) for details.

<Admonition type="note" title="Plan and feature limits">
Object Storage and Functions are available on any plan, subject to usage limits. The AI Gateway requires a paid plan. The Data API and Managed Better Auth don't support projects with [IP Allow](/docs/manage/projects#configure-ip-allow) or [Private Networking](/docs/guides/neon-private-networking) enabled.
</Admonition>

<Steps>

## Set up the project

Create a plain TypeScript project and initialize it with `npm`:

```bash
mkdir neon-demo && cd neon-demo
npm init -y
npm pkg set type=module
npm install typescript --save-dev
npx tsc --init
```

Link the directory to a Neon project:

```bash
neon link
```

You'll be prompted to select your organization, then a project. **Create a new project** (or pick an existing one). Next:

- Select a region. Choose **AWS US East (Ohio)** (`aws-us-east-2`), **AWS US East (N. Virginia)** (`aws-us-east-1`), **AWS Europe (Frankfurt)** (`aws-eu-central-1`), or **AWS Asia Pacific (Singapore)** (`aws-ap-southeast-1`). Functions, Object Storage, and the AI Gateway are currently available in these regions. Support is expanding toward [all regions](/docs/introduction/regions).
- Confirm that you want to manage your setup as code, which generates a `neon.ts` file in your project root.
- When asked which Neon services you require, select **Managed Better Auth**, **Data API**, **Functions**, **Object Storage**, and **AI Gateway**.

The CLI creates a `neon.ts` file which declares the services you selected. It also creates a `.env.local` file with the connection strings and credentials for those services.

`neon link` also creates a placeholder function, `hello.ts`, at your project root. This guide replaces it with its own function, so delete the placeholder:

```bash
rm hello.ts
```

Install the dependencies the example function needs:

```bash
npm install @neon/functions @neon/env hono pg
npm install --save-dev @types/pg
```

- `@neon/functions`: the function runtime helpers.
- `@neon/env`: type-safe access to the injected variables.
- `hono`: the web framework the function uses for routing.
- `pg`: the Postgres driver, used to query the branch's database.

## Define your backend in `neon.ts`

Open `neon.ts` and replace its contents with the following. It declares every service, plus triggers and per-branch policy:

```typescript filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  dataApi: true,
  aiGateway: true,
  buckets: {
    uploads: {},
  },
  functions: {
    api: {
      name: "API",
      source: "./functions/api.ts",
      // Optional: serve the function from a domain you own (default branch only).
      // customDomains: ["api.example.com"],
    },
  },
  triggers: {
    "process-upload": {
      type: "storage_object_created",
      function: "api",
      bucket: "uploads",
      prefix: "uploads/",
      functionPath: "/tasks/upload-created",
    },
    "daily-report": {
      type: "schedule",
      function: "api",
      cron: "0 6 * * 1", // 06:00 UTC every Monday
      functionPath: "/tasks/daily",
    },
  },
  branch: (branch) => {
    if (branch.isDefault) {
      return {
        // protected: true, // requires a paid plan
        postgres: {
          computeSettings: {
            autoscalingLimitMinCu: 0.5,
            autoscalingLimitMaxCu: 2,
          },
        },
      };
    }

    if (!branch.exists) {
      if (branch.name.startsWith("dev")) {
        return {
          ttl: "7d",
          postgres: {
            computeSettings: {
              autoscalingLimitMinCu: 0.25,
              autoscalingLimitMaxCu: 1,
            },
          },
        };
      }

      return {
        ttl: "2d",
        postgres: {
          computeSettings: {
            autoscalingLimitMinCu: 0.25,
            autoscalingLimitMaxCu: 0.25,
          },
        },
      };
    }

    return {};
  },
});
```

### What this config does

The config has two independent parts: static service declarations and the `branch` closure.

**Services** are the top-level keys. Each one declares that a Neon service exists on the project and is available on every branch:

- `auth: true` enables [Managed Better Auth](/docs/auth/overview). Neon creates and maintains the auth tables in your database's `neon_auth` schema and injects `NEON_AUTH_BASE_URL` and `NEON_AUTH_JWKS_URL`.
- `dataApi: true` enables the [Neon Data API](/docs/data-api/overview), a REST endpoint over your Postgres tables. It injects `NEON_DATA_API_URL`. It requires `auth` unless you configure an external identity provider.
- `aiGateway: true` enables the [AI Gateway](/docs/ai-gateway/overview), a single endpoint for calling models from any provider. It injects `NEON_AI_GATEWAY_TOKEN` and `NEON_AI_GATEWAY_BASE_URL`.
- `buckets` declares [Object Storage](/docs/storage/overview) buckets. Here, one bucket named `uploads`. Buckets are branched with your database, and each branch gets its own S3-compatible credentials.
- `functions` declares [Neon Functions](/docs/compute/functions/overview), long-running Node.js compute. Each key is the function's slug, used in CLI commands and the invocation URL. The `source` field points at the entry file relative to `neon.ts`. At runtime, the function receives the branch's service credentials as environment variables.
- `triggers` declares [Function Triggers](/docs/compute/functions/triggers/overview). `process-upload` fires when an object is created under the `uploads/` prefix and calls the function at `/tasks/upload-created`. `daily-report` fires on the cron schedule and calls `/tasks/daily`. Both invoke the `api` function by slug.

**The `branch` closure** is per-branch tuning. It receives a read-only description of the branch and returns the settings to apply:

- **Production** (the default branch): Allows scaling up to 2 compute units (CU). You can also mark the main branch as `protected` to prevent accidental deletion by uncommenting the `protected: true` line. Protected branches require a paid plan. Learn more about [protected branches](/docs/guides/protected-branches).
- **Development branches** (`dev*`): New branches whose name starts with `dev` are capped at 1 CU and scheduled for deletion after 7 days.
- **Other new branches**: Get an even more minimal profile with a 2-day TTL and a fixed 0.25 CU ceiling.
- **Existing branches**: Left untouched. Returning `{}` for branches that already exist avoids overwriting settings on branches already in use. `neon checkout` only applies policy when _creating_ a new branch, never when checking out an existing one.

The closure can only tune settings; it can't add or remove services. Services exist on every branch by design, so a preview branch always has the same backend as production.

The above config is an example. You can customize compute limits, idle suspend behavior (`suspendTimeout`), branch lifetime (`ttl`), protected status, `parent`, and per-function options such as `env` and `customDomains`. See the [`neon.ts` reference](/docs/reference/neon-ts) for the complete list of available options.

The config declares a function whose `source` points at `./functions/api.ts`, so that file must exist before you deploy. Create a minimal placeholder now; you'll replace it with a working implementation later in the guide:

```typescript filename="functions/api.ts"
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.json({ ok: true }));

export default app;
```

<Admonition type="tip" title="Type-safe infrastructure validation">
If you remove `auth: true` while keeping `dataApi: true`, your IDE shows a TypeScript error on the `dataApi` field:

```text
Type 'true' is not assignable to type '`dataApi` with Managed Better Auth (the default
`authProvider: 'neon'`) requires Managed Better Auth, so add `auth: true`. To enable the
Data API WITHOUT Managed Better Auth, verify a third-party IdP instead: `dataApi: {
authProvider: 'external', jwksUrl: 'https://your-idp/.well-known/jwks.json' }`'
```

Rather than the generic `Type 'true' is not assignable to type 'never'`, `neon.ts` encodes the dependency rule and its fixes into the expected type. Your IDE tells you that the Data API requires Managed Better Auth unless you specify a [different](/docs/reference/neon-ts#dataapi) `authProvider`, and how to fix it either way.
</Admonition>

## Deploy and pull credentials

Preview the changes `neon.ts` will make to your Neon project with:

```bash
neon config plan
```

You should see output like this, showing the services that will be created:

```bash
$ neon config plan
INFO: → Planning against branch main (br-cool-forest-a1b2c3d4)
Planned changes
  + Neon Auth
  + bucket uploads
  + Data API
  + function api
  + trigger:api:process-upload
  + trigger:api:daily-report
  ~ main
      computeSettings.autoscalingLimitMaxCu  → 2
      computeSettings.autoscalingLimitMinCu  → 0.5

Utilized services: Postgres, Neon Auth, Data API, Object Storage, Functions, AI Gateway
```

When you are ready, apply the changes:

```bash
neon deploy
```

<Admonition type="tip">
`neon deploy` is an alias for `neon config apply`. Use `neon config plan` first if you want to preview changes before applying.
</Admonition>

<Admonition type="note" title="Conflicting remote state">
If your Neon project has different compute settings on the main branch (for example, set from the Neon Console), `neon deploy` may fail with:

```text
ERROR: pushConfig refused to apply: local config conflicts with remote state.
```

The CLI won't silently overwrite existing remote settings. To override and apply your `neon.ts` configuration, pass the `--update-existing` flag:

```bash
neon deploy --update-existing
```

For a full list of available flags, see the [neon config reference](/docs/cli/config).
</Admonition>

The output shows the services being provisioned:

```bash
$ INFO: → Applying to branch main (br-cool-forest-a1b2c3d4)
Applied changes
  + function api
  + trigger:api:process-upload
  + trigger:api:daily-report

Function URLs
  • api: https://br-cool-forest-a1b2c3d4-api.compute.c-13.us-east-1.aws.neon.tech/

Utilized services: Postgres, Neon Auth, Data API, Object Storage, Functions, AI Gateway
INFO: Pulled 13 Neon variables into .env.local: DATABASE_URL, DATABASE_URL_UNPOOLED, NEON_BRANCH, NEON_AUTH_BASE_URL, NEON_AUTH_JWKS_URL, NEON_DATA_API_URL, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ENDPOINT_URL_S3, AWS_REGION, NEON_AI_GATEWAY_TOKEN, NEON_AI_GATEWAY_BASE_URL, NEON_FUNCTION_API_BASE_URL
INFO: Wrote credential secrets (these now hold fresh values): AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, NEON_AI_GATEWAY_TOKEN
```

After the deploy completes, `neon` updates `.env.local` with the connection strings and credentials for the services you provisioned, so you don't have to copy them by hand. The CLI also prints the function's invocation URL, which you can hit to confirm the function is live.

You now have a fully provisioned backend with Postgres, Managed Better Auth, the Data API, Object Storage, the AI Gateway, and a function with two triggers. To verify the branch's live state, including every service and its current settings, run:

```bash
neon config status
```

## Implement the function

The function is where your business logic lives. Everything else in `neon.ts` is infrastructure; this file is the code that runs. The example below keeps the logic minimal on purpose: it echoes the credentials it received, queries the branch's database, and handles both trigger paths. Replace the code with your own logic in a real project.

Update `functions/api.ts` with the following:

```typescript filename="functions/api.ts"
import { Hono } from "hono";
import { cors } from "hono/cors";
import { attachDatabasePool } from "@neon/functions";
import { parseEnv } from "@neon/env";
import { Pool } from "pg";
import config from "../neon.js"

const env = parseEnv(config);

const pool = new Pool({ connectionString: env.postgres.databaseUrl, max: 5 });
attachDatabasePool(pool);

const app = new Hono();

app.use(
    "/*",
    cors({
        origin: "*",
        allowMethods: ["GET", "POST", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
    }),
);

app.get("/", (c) => {
    return c.json({
        ok: true,
        branch: env.branch?.name,
        authUrl: env.auth.baseUrl,
        dataApiUrl: env.dataApi.url,
        aiGatewayUrl: env.aiGateway.baseUrl,
        storageEndpoint: env.storage.endpoint,
    });
});

app.post("/tasks/daily", async (c) => {
    if (!c.req.header("x-neon-trigger-invocation-id")) {
        return c.json({ error: "not a trigger call" }, 403);
    }

    const { rows } = await pool.query("select count(*) from pg_tables");
    console.log(`daily task ran, ${rows[0].count} tables visible`);
    return c.json({ ok: true, tables: Number(rows[0].count) });
});

app.post("/tasks/upload-created", async (c) => {
    if (!c.req.header("x-neon-trigger-invocation-id")) {
        return c.json({ error: "not a trigger call" }, 403);
    }

    const { data } = await c.req.json<{
        data: { bucket_name: string; object_key: string };
    }>();

    console.log(`object ${data.object_key} landed in ${data.bucket_name}`);
    // Your processing logic goes here: download the object, transform it,
    // write results to Postgres, call a model through the AI Gateway, and so on.
    return c.json({ ok: true });
});

export default app;
```

Here's what the function demonstrates:

- **Typed credentials**: `parseEnv` from `@neon/env` reads the injected variables and validates them against the config you import from `neon.ts`. If a variable is missing or empty, it throws with a clear error instead of handing you `undefined` deep in your logic. The `/` route returns a few of the typed values, so you can see them without exposing secrets like `NEON_AI_GATEWAY_TOKEN`. Namespaces exist only for services your config declares: remove `aiGateway` from `neon.ts` and `env.aiGateway` becomes a TypeScript error. See [Type-safe environment variables](/docs/reference/neon-ts#type-safe-environment-variables) for the full shape.
- **Database access**: The `/tasks/daily` route queries the branch's database through `DATABASE_URL`. `attachDatabasePool` from `@neon/functions` registers the pool with the runtime so connections are managed across invocations. In a real project, this is where your queries, ORM setup, and data access layer go.
- **Trigger guard**: Both trigger routes reject any request without the `X-Neon-Trigger-Invocation-Id` header. Neon strips client-supplied `X-Neon-*` headers at the edge, so a request that carries one came from Neon's trigger system. See [Confirming a request came from Neon](/docs/compute/functions/triggers/overview#confirming-a-request-came-from-neon) for details.
- **Where business logic goes**: The `/tasks/upload-created` handler receives the bucket name and object key from the trigger payload. In the demo it just logs the event. In a real project, this handler would download the object from the bucket using the injected `AWS_*` credentials, process it, and write results to Postgres. Similarly, a route that needs a model would call the AI Gateway with `NEON_AI_GATEWAY_BASE_URL` and `NEON_AI_GATEWAY_TOKEN`. See the [AI Gateway Quickstart](/docs/ai-gateway/get-started) for an example of calling a model.

Deploy the updated function:

```bash
neon deploy
```

## Test the flow

With the function deployed, visit the `/` route in a browser to verify that it has the correct credentials and can successfully connect to the database. Use the function's invocation URL from the `.env.local` file or the `neon deploy` step.

The response should display your branch name and the URLs for Auth, the Data API, the AI Gateway, and Storage, all resolved by `parseEnv` from the injected environment variables.

To iterate on the trigger handlers without redeploying, run the function locally with `neon dev` and replay trigger payloads yourself. See [Test triggers locally](/docs/compute/functions/triggers/overview#test-triggers-locally).

### Confirm the triggers are registered

```bash
neon triggers list
```

```text
Trigger Id                                    Name            Type                    Function Slug  Function Path         Schedule   Storage   Enabled
trigger-1a2b3c4d-5e6f-7890-abcd-ef1234567890  process-upload  storage_object_created  api            /tasks/upload-created            uploads uploads/  true
trigger-8f7e6d5c-4b3a-2190-fedc-ba9876543210  daily-report    schedule                api            /tasks/daily          0 6 * * 1            true
```

</Steps>

## Add a custom domain (optional)

A function has a native Neon URL. You can also serve it from a domain you own, such as `api.example.com`, and Neon provisions the TLS certificate automatically. Add `customDomains` to the function in `neon.ts` and deploy:

```typescript filename="neon.ts" {5}
functions: {
  api: {
    name: "API",
    source: "./functions/api.ts",
    customDomains: ["api.example.com"],
  },
},
```

```bash
neon deploy
```

`neon deploy` registers the domain and prints a CNAME target. At your DNS provider, create a CNAME record for `api.example.com` pointing at that target. Configure it as DNS-only: if your provider proxies the record, Neon can't validate the domain. Once the domain reports `active`, make an HTTPS request to confirm certificate issuance.

Static `customDomains` apply on the default branch only, since a hostname is globally unique and can't be inherited by child branches. Adding a custom domain doesn't authenticate the function or disable its native URL; both remain publicly reachable, so keep authentication on any route that handles user data. For the full DNS setup, status codes, and deletion steps, see [Custom domains for Neon Functions](/docs/compute/functions/custom-domains).

## The branch-first dev loop

`neon.ts` makes the dev loop branch-first: every branch gets its own database, buckets, function deployments, auth environment, and Data API endpoint. You can work on a feature in isolation without affecting the main branch or other developers. For example, create a new git branch for your feature:

```bash
git checkout -b dev-new-feature
```

Then create an isolated Neon branch from your `neon.ts` policy. `--create` makes the branch if it doesn't exist and pins it locally:

```bash
neon checkout dev-new-feature --create
```

Because of your `neon.ts`, `neon` recognizes this is a new branch. Since the name starts with `dev`, it applies the `7d` TTL and restricts compute to `0.25 - 1 CU`. It also pulls the new branch's credentials into `.env.local`, including its own `DATABASE_URL`, Data API URL, auth URLs, AI Gateway credentials, storage credentials, and function URL.

You now have an isolated environment for your feature: a git branch, a database branch, its own buckets, its own deployed functions, and the matching environment variables. Your app talks to the new branch, so your changes don't affect the main branch or other developers. To apply the branch's services after changing `neon.ts`, run `neon deploy` again on that branch.

When the feature is done, merge your git branch back into `main`, apply the schema changes to the main database branch, and delete the feature branch:

```bash
git checkout main
git merge dev-new-feature

# Apply any schema changes to the main database branch here

git branch -d dev-new-feature
neon branches delete dev-new-feature
```

Before you merge, compare the two branches' schemas. `neon diff` prints a git-style diff between the branch you review and the branch you compare against, so you can see exactly what the feature changed:

```bash
neon diff main --branch dev-new-feature
```

Because the feature branch was created from your `neon.ts` policy, it also has its own database, buckets, function deployments, auth environment, and Data API endpoint. The only manual step is applying schema changes; everything else follows the branch.

<Admonition type="note" title="Triggers on branches">
A child branch inherits its parent's triggers, but they arrive disabled so you don't double-send scheduled work or re-fire uploads. Enable them on the branch if you want them to run there. See [Triggers and branching](/docs/compute/functions/triggers/overview#triggers-and-branching).
</Admonition>

## Verify

Run these quick checks after deploying:

| Capability | Quick check                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------- |
| Postgres   | `neon psql main -- -c "select 1;"` connects                                                        |
| Functions  | `neon functions get api` prints an `invocation_url` that responds                                  |
| Triggers   | `neon triggers list` shows both triggers, and `neon logs query --source function` shows their runs |
| Branching  | `neon checkout dev-new-feature --create` gives the branch its own `DATABASE_URL` and function URL  |

Auth, the Data API, Object Storage, and the AI Gateway are provisioned and visible in `neon config status`, but they only become useful once your business logic consumes them. Each service's get-started guide covers that side: [Managed Better Auth](/docs/auth/overview), [Data API](/docs/data-api/overview), [Object Storage](/docs/storage/overview), and [AI Gateway](/docs/ai-gateway/overview).

## Security and best practices

- **Protect the main branch.** Uncomment `protected: true` in the `branch` closure on a paid plan so the default branch can't be deleted by accident.
- **Keep the function authenticated.** The function's native URL and any custom domain are publicly reachable. When your function handles user requests, verify the caller's JWT before touching data; the trigger routes rely on the `X-Neon-Trigger-Invocation-Id` header.
- **Scope database access.** If you expose data through the Data API, use [Row-Level Security](/docs/guides/row-level-security) so users only see their own rows. The function connects as the table owner, which bypasses RLS by default, so always scope its queries by the verified user.

## Conclusion

You declared an entire Neon backend in one `neon.ts`: Postgres policy, Managed Better Auth, the Data API, a function, a bucket, the AI Gateway, and two triggers. You applied it with `neon config plan` and `neon deploy`, and read the injected credentials from `.env.local`. Then you forked the whole backend onto a feature branch with `neon checkout` and compared it with `neon diff`.

The same loop scales to your real project: grow the `neon.ts` declaration as you adopt services, and put your business logic in the functions it provisions. Each new service is a small edit to `neon.ts` followed by `neon deploy`.

## Resources

- [`neon.ts` reference](/docs/reference/neon-ts)
- [Neon CLI reference](/docs/cli)
- [`neon config` and `neon deploy`](/docs/cli/config)
- [`neon checkout`](/docs/cli/checkout)
- [`neon diff`](/docs/cli/diff)
- [Functions overview](/docs/compute/functions/overview)
- [Branching overview](/docs/manage/branches)

<NeedHelp/>
