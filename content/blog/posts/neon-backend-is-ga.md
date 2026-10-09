---
title: 'The Neon backend is GA: a complete set of primitives so agents can build'
description: We started with Postgres, now we expand to the backend
excerpt: >-
  Neon is now a complete suite of backend primitives built around the database
  and rooted on the lakebase architecture: Lakebase Postgres, Object Storage,
  Functions, Managed Better Auth, and AI Gateway. All tools are GA and ready
  for production. Tell your agent to deploy them.
date: '2026-09-17T12:00:00'
updatedOn: '2026-09-16T21:06:00'
category: company
categories:
  - company
  - product
authors:
  - bryan-clark
cover:
  image: https://cdn.neonapi.io/public/images/pages/blog/neon-backend-is-ga/cover.jpg
  alt: 'The Neon backend is GA'
isFeatured: true
seo:
  title: 'The Neon backend is GA: a complete set of primitives so agents can build - Neon'
  description: We started with Postgres, now we expand to the backend
  keywords: []
  noindex: false
  ogTitle: 'The Neon backend is GA: a complete set of primitives so agents can build - Neon'
  ogDescription: We started with Postgres, now we expand to the backend
  image: https://cdn.neonapi.io/public/images/pages/blog/neon-backend-is-ga/social.jpg
---

<video autoPlay muted loop playsInline width="708" height="531" aria-label="The Neon backend is GA">
<source src="https://cdn.neonapi.io/public/images/pages/blog/neon-backend-is-ga/neon-ga.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/blog/neon-backend-is-ga/neon-ga.mp4" type="video/mp4" />
</video>

<Admonition type="tip" title="TL;DR">
Neon is now a complete suite of backend primitives built around the database and rooted on the lakebase architecture: [Lakebase Postgres](https://neon.com/lakebase), [Object Storage](https://neon.com/object-storage), [Functions](https://neon.com/functions), [Managed Better Auth](https://neon.com/auth), and [AI Gateway](https://neon.com/ai-gateway). All tools are GA and ready for production. Tell your agent to deploy them.
</Admonition>

[When Neon first launched in 2022](https://neon.com/blog/hello-world), there was a gap between how fast teams were moving and what Postgres let them do. Compute and storage were welded together into a monolith, and every copy of a database was expensive to create, slow to spin up, and painful to throw away. It was already the era of GitHub, Vercel, automated CI/CD. Teams wanted their database to move as smoothly as the rest of their stack but were stuck with an outdated design.

To close that gap, we rebuilt the architecture underneath Postgres, pioneering what would later become the [lakebase architecture](https://neon.com/docs/introduction/architecture-overview). We kept 100% of Postgres but we [separated compute from a distributed, versioned object storage engine.](https://neon.com/blog/wal-s3-lakebase-storage-for-the-era-of-agents) From this foundation, we were able to build features that gave the database a modern DX experience, like instant provisioning, real-time autoscaling, scale to zero, and branching.

Postgres was finally catching up with how developers worked. And then agents came along.

## Agents are the ones building now. They need backend primitives

The other side of the Neon API are now agents acting on behalf of developers. Giving Postgres the right DX turned out to be the perfect starting point to provide a great AX, but when agents build apps they don't build on databases alone - they deploy backends.

When a coding agent ships an app it deploys Postgres _and a set of tooling around it_. Apps need to store uploads, run jobs that touch that data, authenticate users, call AI models. If those are wired up as separate services on top of the Neon database, the Neon experience breaks - the bucket points at production from every branch, the function doesn't know the branch exists, auth users live in a different system, and so on. This is not the right AX, so we're building these tools ourselves from the same semantics as Lakebase Postgres, our database.

When we say "we're building backends", we think of "backend" as a set of solid primitives an agent can call, not a bundle of managed services behind one bill. The distinction is deliberate. A backend-as-a-service bundles features and asks you to adopt its way of doing things. That is not what we're building.

The reason comes down to how agents write software. An agent is good at composing primitives it already understands: Postgres, an S3 API, a standard model SDK. Give it well-established pieces with predictable interfaces and it might get the app right on the first try. Auth and ORMs already showed the pattern: Better Auth gave agents a primitive they reach for by default, Drizzle did the same for the ORM, and the code comes out right because the primitive is solid. Your entire backend should work the same way.

We're building our backend as a set of primitives, each with a standard interface and an understanding of the Neon [design principles](https://neon.com/docs/get-started/dev-experience): infra that adapts to the workload, instant deploys and restores, and branching-first, agents-first workflows. Nothing here asks you to learn a proprietary framework or trades your data for convenience, and you can point standard tools at any of it and leave whenever you want. But the primitives compose, and an agent can wire them together through one interface to build solid foundations for software.

## What's included in Neon

A full walkthrough:

<YoutubeIframe embedId="3NSc8rZJkec" isDocPost={false} />

### Lakebase Postgres

[Postgres at the center, setting up the stage for all workflows.](https://neon.com/lakebase)

<video autoPlay muted loop playsInline width="708" height="372" aria-label="Neon Lakebase Postgres demo">
<source src="https://cdn.neonapi.io/public/images/pages/shared/backend/lakebase.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/shared/backend/lakebase.mp4" type="video/mp4" />
</video>

```
> Create a Neon database for my app. Make the main branch autoscale up to 8 CU, make sure it suspends after 5 minutes of inactivity.
```

```
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  branch: (branch) => {
    if (branch.isDefault) {
      return {
        postgres: {
          computeSettings: {
            autoscalingLimitMinCu: 0.25,
            autoscalingLimitMaxCu: 8,
            suspendTimeout: "5m",
          },
        },
      };
    }
    return {};
  },
});
```

The Neon database you already know:

- 100% Postgres, with the [lakebase architecture](https://neon.com/docs/introduction/architecture-overview) - compute is separated from versioned, copy-on-write object storage
- Compute [provisions instantly](https://neon.com/claimable-neon), [autoscales](https://neon.com/docs/introduction/autoscaling) within limits you set, and [suspends](https://neon.com/docs/introduction/scale-to-zero) when idle
- [Branching](https://neon.com/docs/introduction/branching) gives every pull request, preview, dev environment, test run, or agent session an isolated copy of the database that's available instantly
- Query it over HTTP with a [PostgREST-compatible interface](https://neon.com/docs/data-api/overview)
- Run it with your agent

<Admonition type="note" title="Included in the Free Plan">
The Neon Free Plan comes with 100 projects. Every project gives you 100 CU-hours, 0.5 GB of database storage, and 10 branches.
</Admonition>

### Object Storage

[S3-compatible object storage that branches with your data.](https://neon.com/object-storage)

<video autoPlay muted loop playsInline width="708" height="372" aria-label="Neon Object Storage demo">
<source src="https://cdn.neonapi.io/public/images/pages/shared/backend/storage.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/shared/backend/storage.mp4" type="video/mp4" />
</video>

```
> Add a private bucket called `uploads` to this Neon backend. Keep it on the same branch as the database so preview uploads cannot change production files.
```

```
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  buckets: {
    uploads: { access: "public_read" },
  },
});
```

Your files now follow your database as you branch:

- Every Neon branch reflects a perfect copy of its parent's buckets and objects at the moment it is created
- But data is not duplicated: even if your bucket is huge, you don't pay for more storage just because you're branching
- Any file changes on the child branch stay isolated from the parent
- Standard S3 clients work

<Admonition type="note" title="Included in the Free Plan">
The Neon Free Plan includes 5 GB of Object Storage per project.
</Admonition>

### Functions

[Long-running Node.js compute for those jobs touching Postgres.](https://neon.com/functions)

<video autoPlay muted loop playsInline width="708" height="372" aria-label="Neon Functions demo">
<source src="https://cdn.neonapi.io/public/images/pages/shared/backend/functions.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/shared/backend/functions.mp4" type="video/mp4" />
</video>

```
> Add a function that reads an uploaded file and records its status in Postgres.
```

```
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  functions: {
    processupload: {
      name: "Process upload",
      source: "./functions/process-upload.ts",
    },
  },
});
```

Serverless functions you can deploy right next to Postgres:

- Node.js 24 HTTP handlers run on the same branch and in the same region as your database, with `DATABASE_URL` and credentials for other Neon primitives injected automatically
- Long-running enough for agents and realtime
- [Just shipped] You can use Function Triggers ([docs](https://neon.com/docs/cli/triggers))
- [Just shipped] We also support custom domains ([docs](https://neon.com/docs/cli/functions))

<Admonition type="note" title="Included in the Neon Free Plan">
The Free Plan comes with 10 active Capacity-Hours, 400 waiting Capacity-Hours, and 1 million invocations per project per month.
</Admonition>

### Managed Better Auth

[Auth that branches, with the Better Auth code you know.](https://neon.com/auth)

<video autoPlay muted loop playsInline width="708" height="372" aria-label="Neon Managed Better Auth demo">
<source src="https://cdn.neonapi.io/public/images/pages/shared/backend/auth.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/shared/backend/auth.mp4" type="video/mp4" />
</video>

```
> Add Managed Better Auth to this app and use it as the identity provider.
```

```
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
});
```

Your auth lives next to your database and branches with it:

- Users, sessions, organizations, and configuration live in the `neon_auth` schema, where they can be queried with SQL and used with RLS
- When the database branches, its auth state branches too, so preview signups reflect production accurately
- It uses Better Auth APIs and schema: agents work with an established auth primitive instead of a proprietary identity model

<Admonition type="note" title="Included in the Neon Free Plan">
Managed Better Auth is included in the Free Plan, with up to 60,000 monthly active users.
</Admonition>

### AI Gateway

[Frontier and open-weight models powered by Databricks Foundation APIs.](https://neon.com/ai-gateway)

<video autoPlay muted loop playsInline width="708" height="372" aria-label="Neon AI Gateway demo">
<source src="https://cdn.neonapi.io/public/images/pages/shared/backend/ai-gateway.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/shared/backend/ai-gateway.mp4" type="video/mp4" />
</video>

```
> Use Neon AI Gateway for model calls. Keep the model configurable so I can test another model in a preview branch without changing production.
```

```
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  aiGateway: true,
});
```

You can call AI models directly from Neon:

- A branch-scoped Neon credential reaches models from multiple providers. An agent can switch models without provisioning a separate provider account and key each time
- Models are served through Databricks Foundation Model APIs
- We pass through the labs' published per-token price with no additional markup

<Admonition type="note" title="Just shipped">
Prepaid credits are now available for AI Gateway ([docs](https://neon.com/docs/ai-gateway/prepaid-credits)). One credit equals $1 USD, the minimum purchase is $5, and purchased credits remain valid for 12 months. Check out the full model list with pricing [here](https://neon.com/docs/ai-gateway/models).
</Admonition>

## What's next

Our backend will keep growing on the same foundation. [The Electric team, who built PGlite and the Electric sync engine, is now part of Neon](https://neon.com/blog/electric-joins-neon), and realtime is exactly the kind of primitive agents should be able to find on Neon. We'll share more soon.

In the meantime, we want to see what you build with these tools. [Tag us on X](https://x.com/neondatabase), send us feedback, and tell us what to improve. [We're in Discord too](https://discord.com/invite/92vNTzKDGp).
