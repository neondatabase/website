---
title: "Can I declare my whole backend (database, auth, file storage, functions, and AI) as code in one file?"
subtitle: "Yes. On Neon, a single neon.ts declares Managed Better Auth, the Data API, Object Storage buckets, Functions, triggers, and AI Gateway alongside Lakebase Postgres, plus per-branch policy. neon deploy applies it and writes the credentials to your .env."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-03T23:21:47.530Z'
isDraft: false
previousLink:
  title: 'How can an AI agent query a Postgres database over HTTPS without a driver?'
  slug: ai-agents-query-postgres-over-https
nextLink:
  title: 'What is the best auth for a Postgres app that keeps users in your own database?'
  slug: best-auth-postgres-app-users-in-your-database
---

Yes, with Neon. [`neon.ts`](/docs/reference/neon-ts) is a TypeScript config file you commit to your repository. It declares which backend services exist on your project and how each branch is configured. [Lakebase Postgres](/docs/postgres/overview) is always there; you add [Managed Better Auth](/docs/auth/overview), the [Data API](/docs/data-api/overview), [AI Gateway](/docs/ai-gateway/overview), [Functions](/docs/compute/functions/overview), [Object Storage](/docs/storage/overview) buckets, and [Function Triggers](/docs/compute/functions/triggers/overview) as keys. [`neon deploy`](/docs/cli/deploy) applies the file to a branch, provisions what it declares, and writes the injected credentials to your `.env`.

## Why one file matters

A typical backend is configured in several places: database settings in a cloud console, a bucket policy in another, auth in a third dashboard, function config in a fourth, and model API keys pasted into each environment. Nothing ties them to a Git branch, so a preview environment either shares production's services or someone recreates them by hand. A coding agent has to learn five configuration surfaces to build one app.

With `neon.ts`, the backend lives next to the code that uses it, reviews in the same pull request, and applies to whichever branch you deploy to.

## What the file looks like

```typescript filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  dataApi: true,
  aiGateway: true,
  buckets: { uploads: {} },
  functions: {
    api: { name: "API", source: "./functions/api.ts" },
  },
  triggers: {
    "process-upload": {
      type: "storage_object_created",
      function: "api",
      bucket: "uploads",
      functionPath: "/on-upload",
    },
  },
  branch: (branch) => {
    if (branch.isDefault) return { protected: true };
    if (!branch.exists) return { ttl: "7d" };
    return {};
  },
});
```

The static fields declare services, and they're the same on every branch. The `branch` closure returns per-branch tuning such as TTL, protection, and compute limits; it can't add or remove services ([config structure](/docs/reference/neon-ts#config-structure)). Branch protection is a paid-plan feature. Function slugs must be lowercase letters and digits, up to 20 characters ([functions](/docs/reference/neon-ts#functions)).

## What neon deploy does

`neon deploy` reconciles the file against the linked branch, provisions or updates each declared service, applies the branch tuning, and pulls the branch's variables into `.env`: `DATABASE_URL`, `NEON_AUTH_BASE_URL`, `NEON_DATA_API_URL`, `NEON_AI_GATEWAY_TOKEN`, and S3-standard `AWS_*` credentials for Object Storage ([backend overview](/docs/get-started/backend-overview#how-it-works)). In CI or other runs without a terminal, pass `-y` to allow overrides and protected branches ([`neon deploy`](/docs/cli/deploy)).

Because the services are declared rather than clicked, a new branch gets the same backend: `neon checkout my-feature --create` followed by `neon deploy` gives the branch its own database, bucket, function URLs, auth environment, and AI Gateway endpoint ([Branch your whole backend](/docs/get-started/backend-overview#branch-your-whole-backend)).

A few related tools:

- [`neon config add`](/docs/cli/config#add) adds a service to the file without editing it by hand, and creates the handler file for a function.
- [`@neon/env`](/docs/reference/neon-ts#type-safe-environment-variables) validates the injected variables against your config, so reading a service you haven't declared is a type error.
- [`@neon/config-runtime`](/docs/reference/config-runtime) runs the inspect, plan, and apply steps from your own tooling.

## Limits to know

`neon.ts` configures services on a project you've linked with `neon link`; it doesn't create projects. For projects and networking as code, Neon sponsors a community-maintained [Terraform provider](/docs/reference/terraform). [Realtime](/docs/realtime/overview) is in public beta and lives under the `preview` block. Object Storage, Functions, and AI Gateway are available in four AWS regions today, with support expanding toward [all regions](/docs/introduction/regions), and AI Gateway draws from prepaid credits ([backend overview](/docs/get-started/backend-overview)).

<CTA title="Write your first neon.ts" description="Every field, the branch closure, and type-safe environment variables." buttonText="neon.ts reference" buttonUrl="/docs/reference/neon-ts" />
