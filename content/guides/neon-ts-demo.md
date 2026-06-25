---
title: Manage Neon projects with neon.ts
subtitle: Use Neon's native TypeScript configuration to provision services, manage branch compute, and generate type-safe environment variables.
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-06-24T00:00:00.000Z'
updatedOn: '2026-06-25T04:44:21.969Z'
---

[`neon.ts`](/docs/reference/neon-ts) is Neon's native **Infrastructure-as-Code (IaC)** file designed for full-stack TypeScript projects. Unlike traditional IaC tools such as [Terraform](/docs/reference/terraform), [Pulumi](/guides/neon-pulumi), or [OpenTofu](/guides/opentofu-neon), which require learning a new DSL, managing complex state files, and wiring outputs into your application by hand, `neon.ts` is integrated into your local development loop. It provisions infrastructure through the [Neon CLI (`neonctl`)](/docs/cli), syncs connection strings directly into `.env.local`, and validates those variables inside your application code with strict TypeScript typing.

With `neon.ts`, you can:

- **Provision Neon services** like Postgres, [Neon Auth](/docs/auth/overview), and the [Data API](/docs/data-api/overview) directly from your codebase.
- **Configure branch policies** programmatically, for example, auto-suspending preview branches or applying cost-saving TTLs.
- **Generate type-safe environment variables** so your application knows exactly which services are available, complete with IDE autocomplete.
- **Skip state files entirely**, since `neonctl` reads live state directly from your Neon project.

In this guide, you will build a simple application that uses `neon.ts` to provision Neon services, enforce branch-level compute limits, and generate type-safe environment variables. You will learn how to:

- Define Neon services in code.
- Enforce branch-level compute limits for feature branches.
- Use `@neondatabase/env` to access type-safe environment variables.
- Automatically provision isolated database environments for each branch.

## Prerequisites

Before you begin, ensure you have the following:

1. **Node.js**: Version 22 or later. Download from [nodejs.org](https://nodejs.org/en/download/).
2. **Neon Account**: Sign up for a free Neon account at [console.neon.tech](https://console.neon.tech/signup).
3. **Neon CLI**: Installed globally (`npm i -g neonctl`) and authenticated (`neonctl auth`). Checkout [Neon CLI Quickstart](/docs/cli/quickstart) for more details.

<Steps>

## Initialize the project

Create a new Next.js project by running the following command:

```bash
npx create-next-app@latest neon-ts-demo --yes
cd neon-ts-demo
```

Install the Neon config and env packages:

```bash
npm install @neondatabase/config @neondatabase/env
```

Link your local project to a Neon project using the Neon CLI:

```bash
neonctl link
```

Follow the prompts to select an existing Neon project or create a new one. This command establishes the connection between your local environment and your Neon Project.

After linking, you will see a `.neon` file in your project root. This file contains the Neon project ID and other metadata. It is git-ignored by default.

## Define your infrastructure in `neon.ts`

Create a file named `neon.ts` in the root of your project directory. This file acts as the blueprint for your Neon services and branching logic:

```typescript
import { defineConfig } from "@neondatabase/config/v1";

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

### What this config does:

The `neon.ts` file defines the Neon services and branch policies for your project:

- **Services**: Enables Postgres, Neon Auth and the Neon Data API for your project.
- **Production**: Allows scaling up to 2 Compute Units (CU). You can additionally mark the main branch as `protected` to prevent accidental deletion by uncommenting the `protected: true` line. Protected branches require a paid plan. Learn more about [protected branches](/docs/guides/protected-branches).
- **Development branches** (`dev*`): Applies strict resource controls to new branches whose name starts with `dev`: capped at 1 CU, and scheduled for deletion after 7 days to prevent unnecessary costs.
- **Other new branches**: Gets an even more minimal profile with a 2-day TTL and a fixed 0.25 CU compute ceiling.
- **Existing branches**: Left untouched. Returning `{}` for branches that already exist avoids overwriting settings on branches already in use. This is important: `neonctl checkout` only applies policy when _creating_ a new branch, never when checking out an existing one.

The config above is just a starting point. Every field shown is configurable: compute limits (`autoscalingLimitMinCu`, `autoscalingLimitMaxCu`), idle suspend behavior (`suspendTimeout`), branch lifetime (`ttl`), protected status, and more. You can also set a `parent` branch for new branches to clone from. See the [`neon.ts` reference](/docs/reference/neon-ts) for the full list of available fields and their valid values.

<Admonition type="tip" title="Type-safe infrastructure validation">
If you remove `auth: true` while keeping `dataApi: true`, your IDE will instantly throw a TypeScript error on the `dataApi` field:

```text
Type 'true' is not assignable to type '`dataApi` with Neon Auth (the default
`authProvider: 'neon'`) requires Neon Auth, so add `auth: true`. To enable the
Data API WITHOUT Neon Auth, verify a third-party IdP instead: `dataApi: {
authProvider: 'external', jwksUrl: 'https://your-idp/.well-known/jwks.json' }`'
```

Instead of the usual unhelpful `Type 'true' is not assignable to type 'never'`, `neon.ts` encodes the actual dependency rule and its fixes directly into the expected type. This means your IDE immediately tells you that the Data API requires Neon Auth unless you specify a different `authProvider`, and how to fix it either way.
</Admonition>

## Deploy and sync environment variables

Now that your infrastructure is defined, apply it using the Neon CLI.

Preview what would change with a dry run:

```bash
neonctl config plan
```

This shows a table of pending changes without applying them:

```bash
$ neonctl config plan
  Planned changes
  ┌────────┬─────────┬────────────┐
  │ Action │ Kind    │ Identifier │
  ├────────┼─────────┼────────────┤
  │ create │ service │ auth       │
  ├────────┼─────────┼────────────┤
  │ create │ service │ dataApi    │
  └────────┴─────────┴────────────┘

  Utilized services: Postgres, Neon Auth, Data API
```

When you are ready, apply the changes:

```bash
neonctl deploy
```

<Admonition type="tip">
`neonctl deploy` is an alias for `neonctl config apply`. Use `neonctl config plan` first if you want to preview changes before applying.
</Admonition>

<Admonition type="note" title="Conflicting remote state">
If your Neon project has different compute settings on the main branch (for example, set from the Neon Console), `neonctl deploy` may fail with:

```text
ERROR: pushConfig refused to apply: local config conflicts with remote state.
```

This happens because the CLI will not silently overwrite existing remote settings. To override and apply your `neon.ts` configuration, pass the `--update-existing` flag:

```bash
neonctl deploy --update-existing
```

For a full list of available flags, see the [neonctl config reference](/docs/cli/config).
</Admonition>

You will see output indicating that the services are being provisioned:

```bash
$ neonctl deploy
  INFO: → Applying to branch main (br-polished-rain-ajh9uwwj)
  Applied changes
  ┌────────┬─────────┬────────────┐
  │ Action │ Kind    │ Identifier │
  ├────────┼─────────┼────────────┤
  │ create │ service │ auth       │
  ├────────┼─────────┼────────────┤
  │ create │ service │ dataApi    │
  └────────┴─────────┴────────────┘

  Utilized services: Postgres, Neon Auth, Data API
  INFO: Pulled 6 Neon variables into /home/neon-ts-demo/.env.local: NEON_BRANCH, DATABASE_URL, DATABASE_URL_UNPOOLED, NEON_AUTH_BASE_URL, NEON_AUTH_JWKS_URL, NEON_DATA_API_URL
```

After the deploy completes, `neonctl` automatically updates your `.env.local` file with the connection strings and URLs for the services you just provisioned. This ensures that your application can securely access the Neon services without manual configuration.

## Use type-safe environment variables

Traditional `.env` files are just strings, making it easy to make a typo or forget a variable. `neon.ts` fixes this by exporting a strictly typed environment parser that reads your configuration blueprint.

Create a new file `env.ts` at the root of your project to parse the environment variables from `.env.local`:

```typescript
import { parseEnv } from "@neondatabase/env/v1";
import config from "./neon";

export const env = parseEnv(config);
```

Because your `neon.ts` declared `auth: true` and `dataApi: true`, the `env` object now securely contains typed namespaces for those services.

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
          <h2 className="font-semibold text-green-600">Neon Auth</h2>
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

Visit `http://localhost:3000`. You will see your actual Neon configuration loaded. If you were to remove `auth: true` from `neon.ts`, your Next.js build would instantly fail, alerting you that `env.auth.jwksUrl` no longer exists.

<Admonition type="note" title="Demo purposes only">
The example above renders connection strings directly on the frontend for demonstration. In a real application, never expose database URLs or credentials to the client. Use `env.postgres.databaseUrl` in server-rendered pages, API routes, or server actions, and return only the query results to the frontend.
</Admonition>

### Validating a subset of variables

Not every process needs every environment variable. If you only need the database connection string, pass an array of keys to `parseEnv` to validate and return just those:

```typescript
import { parseEnv } from "@neondatabase/env/v1";
import config from "./neon";

const { postgres } = parseEnv(config, ["DATABASE_URL"]);

console.log(postgres.databaseUrl);
```

The keys autocomplete from your `neon.ts` config, so you can only select variables that the services in your config actually enable. This is useful for background jobs, scripts, or API routes that only need a single connection string.

## The branch-first dev loop

The **branch-first dev loop** is where `neon.ts` becomes most useful.

Imagine you are tasked with building a new feature called "User Profiles". You would initialize a new git branch for the feature:

```bash
git checkout -b dev-user-profiles
```

Then, run the Neon CLI to create a new isolated database branch for this feature:

```bash
neonctl checkout dev-user-profiles
```

> You can also run `neonctl checkout` without a name to get an interactive branch picker with a create option.

Neon will automatically provision a new isolated database branch for your feature. The following happens automatically:

1. **Database branch creation:** Neon creates an isolated clone of your database using Copy-on-Write.
2. **Apply Policy:** Because of your `neon.ts` file, `neonctl` recognizes this is a new branch. Since the branch name starts with `dev`, it automatically applies the `7d` TTL and restricts compute limits to `0.25 - 1 CU`.
3. **Sync environment:** `neonctl` automatically updates your `.env.local` file with the connection string and Auth URLs for this _specific_ branch.

Now you have a completely isolated environment for your feature: a git branch, a database branch, and the correct environment variables. You can immediately start coding. Your app is now talking to your isolated database branch, and any changes you make will not affect the main branch or other developers.

When you are done with the feature development, you can merge your git branch back into `main` and apply the schema changes to the main database branch. After merging, you can delete the feature branch and its associated Neon database branch:

```bash
git checkout main
git merge dev-user-profiles

# Apply schema changes to the main database branch
# npx drizzle-kit migrate

git branch -d dev-user-profiles
neonctl branches delete dev-user-profiles
```

To confirm the state of your current branch at any time you can run `neonctl config status` (similar to `git status`), which shows the current branch, its `expiresAt` date, and the services provisioned for it.

</Steps>

## Preview services

Neon is expanding into a broader serverless platform. If you are part of the platform private preview, you can use `neon.ts` to provision additional primitives, such as running Node.js **Functions**, S3-compatible **Storage**, and an **AI Gateway**.

You can declare these under a `preview` block in your `neon.ts`:

```typescript
preview: {
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
}
```

Running `neonctl deploy` will provision the buckets and deploy the functions, and `parseEnv` will automatically type your `env.aiGateway` and `env.preview.buckets` variables. For local development, you can run `neonctl dev` to hot-reload your functions against your linked branch.

_To request access to Neon Functions and Storage, see [Preview access](/docs/compute/functions/preview-access)._

## Conclusion

By using `neon.ts`, you bridge the gap between infrastructure and application code.

- You no longer have to manage out-of-sync `.env` files or navigate to the Neon Console to copy connection strings.
- You can enforce team-wide branch lifecycle rules (like TTLs) in pure TypeScript.
- Your application benefits from strict type safety regarding which services are currently provisioned.

## Resources

- [`neon.ts` Reference](/docs/reference/neon-ts)
- [neonctl CLI Reference](/docs/cli)
- [neonctl config/deploy Reference](/docs/cli/config)
- [Branching Overview](/docs/manage/branches)
- [Neon Auth](/docs/auth/overview)

<NeedHelp/>
