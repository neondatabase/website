---
title: Manage Neon projects with neon.ts
subtitle: Use Neon's native TypeScript configuration to provision services, manage branch compute, and generate type-safe environment variables.
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-06-24T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

[`neon.ts`](/docs/reference/neon-ts) is Neon's native **Infrastructure-as-Code (IaC)** file for full-stack TypeScript projects. Traditional IaC tools such as [Terraform](/docs/reference/terraform), [Pulumi](/guides/neon-pulumi), or [OpenTofu](/guides/opentofu-neon), require learning a new DSL, managing state files, and wiring outputs into your application by hand. `neon.ts` is part of your local development loop instead. It provisions infrastructure through the [Neon CLI (`neon`)](/docs/cli), syncs connection strings directly into `.env.local`, and validates those variables in your application code with TypeScript types.

With `neon.ts`, you can:

- **Provision Neon services** like Postgres, [Managed Better Auth](/docs/auth/overview), and the [Data API](/docs/data-api/overview) directly from your codebase.
- **Configure branch policies** in code, for example, capping compute on preview branches or setting TTLs so they're deleted automatically.
- **Generate type-safe environment variables** so your application knows which services are available, with IDE autocomplete.
- **Skip state files entirely**, since `neon` reads live state directly from your Neon project.

In this guide, you'll build a simple application that uses `neon.ts` to provision Neon services, enforce branch-level compute limits, and generate type-safe environment variables. You'll learn how to:

- Define Neon services in code.
- Enforce branch-level compute limits for feature branches.
- Use `@neon/env` to access type-safe environment variables.
- Automatically provision isolated database environments for each branch.

## Prerequisites

Before you begin, make sure you have:

1. **Node.js**: Version 22 or later. Download from [nodejs.org](https://nodejs.org/en/download/).
2. **Neon account**: Sign up for a free Neon account at [console.neon.tech](https://console.neon.tech/signup).
3. **Neon CLI**: Installed globally (`npm i -g neon`) and authenticated (`neon login`). See the [Neon CLI quickstart](/docs/cli/quickstart) for details.

<Steps>

## Initialize the project

Create a new Next.js project by running the following command:

```bash
npx create-next-app@latest neon-ts-demo --yes
cd neon-ts-demo
```

Install the Neon config and env packages:

```bash
npm install @neon/config @neon/env
```

Link your local project to a Neon project using the Neon CLI:

```bash
neon link
```

Follow the prompts to select an existing Neon project or create a new one. This command links your local environment to your Neon project.

After linking, you'll see a `.neon` file in your project root. It contains the Neon project ID and other metadata. The CLI adds `.neon` to `.gitignore` the first time it creates the file.

## Define your infrastructure in `neon.ts`

Create a file named `neon.ts` in the root of your project directory. This file defines your Neon services and branching logic:

```typescript
import { defineConfig } from "@neon/config/v1";

export default defineConfig({

  // Declare the Neon services you want to provision for your project
  auth: true,
  dataApi: true,

  // Define branch-level policies for your Neon project
  branch: (branch) => {
    // For the main branch use a more generous compute profile
    if (branch.isDefault) {
      return {
        // protected: true,
        postgres: {
          computeSettings: {
            autoscalingLimitMinCu: 0.5,
            autoscalingLimitMaxCu: 2,
          },
        },
      };
    }

    // For new feature branches, enforce cost-saving defaults
    if (!branch.exists) {
      if (branch.name.startsWith("dev")) {
        return {
          ttl: "7d",
          postgres: {
            computeSettings: {
              autoscalingLimitMinCu: 0.25,
              autoscalingLimitMaxCu: 1
            },
          },
        };
      }

      return {
        ttl: "2d",
        postgres: {
          computeSettings: {
            autoscalingLimitMinCu: 0.25,
            autoscalingLimitMaxCu: 0.25
          },
        },
      };
    }

    return {};
  },
});
```

### What this config does

The `neon.ts` file defines the Neon services and branch policies for your project:

- **Services**: Enables Postgres, Managed Better Auth, and the Neon Data API for your project.
- **Production**: Allows scaling up to 2 Compute Units (CU). You can also mark the main branch as `protected` to prevent accidental deletion by uncommenting the `protected: true` line. Protected branches require a paid plan. Learn more about [protected branches](/docs/guides/protected-branches).
- **Development branches** (`dev*`): Applies strict resource controls to new branches whose name starts with `dev`: capped at 1 CU and scheduled for deletion after 7 days.
- **Other new branches**: Gets an even more minimal profile with a 2-day TTL and a fixed 0.25 CU compute ceiling.
- **Existing branches**: Left untouched. Returning `{}` for branches that already exist avoids overwriting settings on branches already in use. `neon checkout` only applies policy when _creating_ a new branch, never when checking out an existing one.

The config above is just a starting point. Every field shown is configurable: compute limits (`autoscalingLimitMinCu`, `autoscalingLimitMaxCu`), idle suspend behavior (`suspendTimeout`), branch lifetime (`ttl`), protected status, and more. You can also set a `parent` branch for new branches to clone from. See the [`neon.ts` reference](/docs/reference/neon-ts) for the full list of available fields and their valid values.

<Admonition type="tip" title="Type-safe infrastructure validation">
If you remove `auth: true` while keeping `dataApi: true`, your IDE shows a TypeScript error on the `dataApi` field:

```text
Type 'true' is not assignable to type '`dataApi` with Managed Better Auth (the default
`authProvider: 'neon'`) requires Managed Better Auth, so add `auth: true`. To enable the
Data API WITHOUT Managed Better Auth, verify a third-party IdP instead: `dataApi: {
authProvider: 'external', jwksUrl: 'https://your-idp/.well-known/jwks.json' }`'
```

Instead of the usual unhelpful `Type 'true' is not assignable to type 'never'`, `neon.ts` encodes the dependency rule and its fixes into the expected type. Your IDE tells you that the Data API requires Managed Better Auth unless you specify a different `authProvider`, and how to fix it either way.
</Admonition>

## Deploy and sync environment variables

With your infrastructure defined, apply it using the Neon CLI.

Preview what would change with a dry run:

```bash
neon config plan
```

This shows a table of pending changes without applying them:

```bash
$ neon config plan
  Planned changes
  ┌────────┬─────────┬────────────┐
  │ Action │ Kind    │ Identifier │
  ├────────┼─────────┼────────────┤
  │ create │ service │ auth       │
  ├────────┼─────────┼────────────┤
  │ create │ service │ dataApi    │
  └────────┴─────────┴────────────┘

  Utilized services: Postgres, Managed Better Auth, Data API
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
$ neon deploy
  INFO: → Applying to branch main (br-polished-rain-ajh9uwwj)
  Applied changes
  ┌────────┬─────────┬────────────┐
  │ Action │ Kind    │ Identifier │
  ├────────┼─────────┼────────────┤
  │ create │ service │ auth       │
  ├────────┼─────────┼────────────┤
  │ create │ service │ dataApi    │
  └────────┴─────────┴────────────┘

  Utilized services: Postgres, Managed Better Auth, Data API
  INFO: Pulled 6 Neon variables into /home/neon-ts-demo/.env.local: NEON_BRANCH, DATABASE_URL, DATABASE_URL_UNPOOLED, NEON_AUTH_BASE_URL, NEON_AUTH_JWKS_URL, NEON_DATA_API_URL
```

After the deploy completes, `neon` updates your `.env.local` file with the connection strings and URLs for the services you just provisioned, so you don't have to copy them by hand.

## Use type-safe environment variables

Values in `.env` files are plain strings, so it's easy to make a typo or forget a variable. `@neon/env` provides a typed environment parser that reads your `neon.ts` config.

Create a new file `env.ts` at the root of your project to parse the environment variables from `.env.local`:

```typescript
import { parseEnv } from "@neon/env/v1";
import config from "./neon";

export const env = parseEnv(config);
```

Because your `neon.ts` declared `auth: true` and `dataApi: true`, the `env` object contains typed namespaces for those services.

Update your `app/page.tsx` to display the Neon configuration:

```tsx
import { env } from "@/env";

export default function Home() {
  return (
    <main className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-6">neon.ts Full-Stack Demo</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded bg-gray-50 dark:bg-gray-900">
          <h2 className="font-semibold text-blue-600">Postgres Database</h2>
          <p className="text-sm font-mono mt-2 break-all">
            {env.postgres.databaseUrl}
          </p>
        </div>

        <div className="p-4 border rounded bg-gray-50 dark:bg-gray-900">
          <h2 className="font-semibold text-green-600">Managed Better Auth</h2>
          <p className="text-sm font-mono mt-2">
            JWKS URL: {env.auth.jwksUrl}
          </p>
        </div>

        <div className="p-4 border rounded bg-gray-50 dark:bg-gray-900">
          <h2 className="font-semibold text-purple-600">Neon Data API</h2>
          <p className="text-sm font-mono mt-2">
            Endpoint: {env.dataApi.url}
          </p>
        </div>
      </div>
    </main>
  );
}
```

Run your Next.js development server:

```bash
npm run dev
```

Visit `http://localhost:3000`. You'll see your Neon configuration loaded. If you remove `auth: true` from `neon.ts`, your Next.js build fails, alerting you that `env.auth.jwksUrl` no longer exists.

<Admonition type="note" title="Demo purposes only">
The example above renders connection strings directly on the frontend for demonstration. In a real application, never expose database URLs or credentials to the client. Use `env.postgres.databaseUrl` in server-rendered pages, API routes, or server actions, and return only the query results to the frontend.
</Admonition>

### Validate a subset of variables

Not every process needs every environment variable. If you only need the database connection string, pass an array of keys to `parseEnv` to validate and return just those:

```typescript
import { parseEnv } from "@neon/env/v1";
import config from "./neon";

const { postgres } = parseEnv(config, ["DATABASE_URL"]);

console.log(postgres.databaseUrl);
```

The keys autocomplete from your `neon.ts` config, so you can only select variables that the services in your config actually enable. This is useful for background jobs, scripts, or API routes that only need a single connection string.

## The branch-first dev loop

The branch-first dev loop is where `neon.ts` is most useful.

Say you're building a new feature called "User Profiles". Start a new git branch for the feature:

```bash
git checkout -b dev-user-profiles
```

Then, run the Neon CLI to create a new isolated database branch for this feature:

```bash
neon checkout dev-user-profiles
```

> You can also run `neon checkout` without a name to get an interactive branch picker with a create option.

Neon provisions a new isolated database branch for your feature:

1. **Database branch creation:** Neon creates an isolated copy of your database using copy-on-write.
2. **Apply policy:** Because of your `neon.ts` file, `neon` recognizes this is a new branch. Since the branch name starts with `dev`, it applies the `7d` TTL and restricts compute limits to `0.25 - 1 CU`.
3. **Sync environment:** `neon` updates your `.env.local` file with the connection string and Auth URLs for this _specific_ branch.

You now have an isolated environment for your feature: a git branch, a database branch, and the matching environment variables. Your app talks to the new database branch, so your changes don't affect the main branch or other developers.

When the feature is done, you can merge your git branch back into `main` and apply the schema changes to the main database branch. After merging, you can delete the feature branch and its associated Neon database branch:

```bash
git checkout main
git merge dev-user-profiles

# Apply schema changes to the main database branch
# npx drizzle-kit migrate

git branch -d dev-user-profiles
neon branches delete dev-user-profiles
```

To check the state of your current branch at any time, run `neon config status` (similar to `git status`), which shows the current branch, its `expiresAt` date, and the services provisioned for it.

</Steps>

## Additional services

Neon includes backend primitives beyond Postgres, and you can provision them with `neon.ts` too: Node.js **Functions**, S3-compatible **Object Storage**, and the **AI Gateway**.

You can declare these as top-level keys in your `neon.ts` file. For example, to enable the AI Gateway, provision two storage buckets (one public, one private), and deploy a serverless function, you would add the following:

```typescript
aiGateway: true,
buckets: {
  dev_assets: {},                          // private (default)
  blog_posts: { access: "public_read" },   // public
},
functions: {
  api: {
    name: "My API",
    source: "./functions/api.ts",
  },
},
```

Running `neon deploy` will provision the buckets and deploy the functions, and `parseEnv` will automatically type your `env.aiGateway` and `env.storage` variables. For local development, you can run `neon dev` to hot-reload your functions against your linked branch.

_Functions and Object Storage are currently available in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore). Create your project in one of these regions to use them. Support is expanding toward [all regions](/docs/introduction/regions)._

## Conclusion

You used `neon.ts` to provision Postgres, Managed Better Auth, and the Data API, set branch policies for new branches, and read the resulting variables with type-safe `parseEnv`. Next, add Functions or Object Storage to the config and run `neon deploy` again.

## Resources

- [`neon.ts` reference](/docs/reference/neon-ts)
- [Neon CLI reference](/docs/cli)
- [neon config/deploy reference](/docs/cli/config)
- [Branching overview](/docs/manage/branches)
- [Managed Better Auth](/docs/auth/overview)

<NeedHelp/>
