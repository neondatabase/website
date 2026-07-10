---
title: "Introducing @neon/sdk, our new TypeScript client for the Neon API"
description: >-
  @neon/sdk is our new TypeScript client for the Neon API: fetch-based,
  zero-dependency and generated from our OpenAPI spec, with an ergonomic
  layer on top. It replaces @neondatabase/api-client.
excerpt: >-
  The Neon API is open and follows the OpenAPI spec, so you can provision and
  manage almost everything you see in the console programmatically. But
  provisioning infrastructure over REST means polling operations until
  resources are ready. @neon/sdk adds an ergonomic, type-safe layer on top so
  platforms and agents don't have to.
date: "2026-07-09T12:00:00"
updatedOn: "2026-07-09T12:00:00"
category: product
categories:
  - product
  - ai
  - app-platform
authors:
  - andre-landgraf
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-sdk/cover.jpg
  alt: 'Blog cover graphic on a blue dotted background with the Neon logo, the headline "Introducing @neon/sdk: TypeScript client for the Neon API", and a wireframe toolbox illustration labeled "SDK module" and "all-in-one".'
isFeatured: false
draft: true
seo:
  title: "Introducing @neon/sdk, our new TypeScript client for the Neon API - Neon"
  description: >-
    Meet @neon/sdk, the new fetch-based, zero-dependency TypeScript client for
    the Neon API. Generated from our OpenAPI spec with an ergonomic layer on
    top, it replaces @neondatabase/api-client.
  keywords: []
  noindex: false
  ogTitle: "Introducing @neon/sdk, our new TypeScript client for the Neon API - Neon"
  ogDescription: >-
    Meet @neon/sdk, the new fetch-based, zero-dependency TypeScript client for
    the Neon API. Generated from our OpenAPI spec with an ergonomic layer on
    top, it replaces @neondatabase/api-client.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-sdk/cover.jpg
---

Today, we're introducing [`@neon/sdk`](https://www.npmjs.com/package/@neon/sdk), the best way to work with the [Neon API](https://neon.com/docs/reference/api-reference) from TypeScript: project creation, branch & database management, project transfers and much more.

In this post, we'll highlight some of `@neon/sdk` capabitilies, cover how the package is structured, explain why we built it in the age of AI and discuss when you should use it.

Most importantly, you can install `@neon/sdk` today:

```bash
npm install @neon/sdk
```

And use ergonomic functions like `createAndConnect` to provision a Neon project, wait for the provisioning operations to finish and hand you back a ready-to-use Postgres connection string, all in a single call:

```ts
import { createNeonClient } from "@neon/sdk";

const neon = createNeonClient({ apiKey: process.env.NEON_API_KEY! });

const { data, error } = await neon.projects.createAndConnect({
  name: "my-app",
});
if (error) throw error;

const { project, connectionString } = data;
```

Now let's dig in.

## A generated core with an ergonomic layer on top

`@neon/sdk` is fetch-based, zero dependencies and ESM-only. The raw client is generated from our [OpenAPI spec](https://neon.com/api_spec/release/v2.json) with [Hey API](https://heyapi.dev), so every endpoint maps one-to-one to a TypeScript function. Shout-out to Hey API maintainer [Lubos](https://x.com/mrlubos) for the input and support! On top of that, we built a higher-level layer that provides ergonomics on top: retries, readiness polling, pagination, better errors, and multi-step workflows.

So the package ships two layers:

```ts
import { createNeonClient, raw } from "@neon/sdk";
```

- **`createNeonClient`**: the high-level ergonomic client, organized into resource namespaces like `neon.projects` and `neon.branches`.
- **`raw`**: the low-level generated surface, every endpoint as a standalone, tree-shakeable function.

Take readiness polling as an example. The Neon API provisions real infrastructure and a lot of that work happens in the background, so most mutations don't hand you a ready-to-use resource. They return `operations` that you'd normally poll yourself until the resource is ready. `@neon/sdk` offers an abstraction that does that polling behind the scenes, so a call only resolves once the resource is actually ready. `createAndConnect` does this by default and you can opt any other mutation into the same behavior.

We hope `createNeonClient` covers most of what you need to build platforms and programmatic automations on Neon: a type-safe, ergonomic way to use Neon's capabilities. That said, you can always reach for the raw API methods directly.

Let's walk through a few of the higher-level workflows we added!

### Restore a snapshot and preview it before you commit

[Neon Snapshots](https://neon.com/docs/guides/backup-restore#create-snapshots-manually) are point-in-time copies of a branch's schema & data that you can restore from later. Restoring one onto an existing branch is a two-step operation: Neon restores the snapshot to a new branch, then finalizes it by moving the target branch's compute onto the restored data, so your connection string doesn't change when restoring from a snapshot.

The `restore` function combines both steps into one call with an optional `preview` callback: it restores the not-yet-finalized branch, runs your callback against it, then finalizes if you return `true` or discards the preview branch if you return `false`.

```ts
await neon.snapshots.restore(projectId, snapshotId, {
  targetBranchId,
  preview: async (branch) => {
    // inspect the restored (not-yet-finalized) branch
    const ok = await runChecks(branch);
    return ok; // true commits the restore, false rolls it back
  },
});
```

No manual finalize step and no orphaned branch to clean up when you abort. Behind that one call, the SDK waits for the restore to be ready and then finalizes it (commit) or deletes the preview branch (abort) for you, so you don't have to wire up the operatino readiness polling and branch cleanup yourself.

### Transfer projects across organizations

If you're building a platform on Neon, we usually recommend you to set up two Neon organizations - one for your free plan and one for your paid plan: you provision each user's project in the free-plan org, then transfer it to a paid org once they upgrade, so your Neon Postgres fleet stays organized and billed cleanly across the two plans. The `transfer` function makes this super easy:

```ts
await neon.projects.transfer({
  fromOrgId: sponsoredOrgId,
  toOrgId: paidOrgId,
  projectIds: ["late-frost-12345"],
});
```

### Create a branch with its own compute

If you create a Neon branch through the API, you have to chain two calls:

1. Create the branch
2. Provision compute for the branch

If you're used to the Neon UI, this is done automatically for you, but over the REST API it's split into two calls, which usually takes both devs and agents a few attempts to get right. `createWithCompute` creates the branch, spins up a read-write endpoint, waits for it to be ready and returns a connection string, all in one call:

```ts
const { data, error } = await neon.branches.createWithCompute(projectId, {
  name: "preview/pr-123",
  compute: { minCu: 0.25, maxCu: 2 },
});
if (error) throw error;

const { branch, endpoint, connectionString } = data;
```

These are just three of the many workflows we added to make working with the Neon REST API as easy as possible for you and your agent! That said, you can always reach for the raw API client:

### Drop down to the raw client

The ergonomic namespaces don't wrap every endpoint and sometimes you just want the exact generated function. For those, the `raw` layer exposes every endpoint 1:1. Pass `neon.client` so the raw call reuses the client's auth:

```ts
import { raw } from "@neon/sdk";
// or, for guaranteed tree-shaking:
// import { getProjectBranchSchema } from "@neon/sdk/raw";

const { data } = await raw.getProjectBranchSchema({
  client: neon.client,
  path: { project_id, branch_id },
});
```

## Why we built a new client

An expansive open APIs matters more than ever. We aim to expose every platform capability through our open API and follow the OpenAPI spec. If you can do it in the Neon console, you should be able to do it through the API too. I made that case recently when I [slop forked the Neon console](https://neon.com/blog/slop-fork-neon) and rebuilt most of the dashboard on top of the public API alone. In fact, I've already moved that [Neon Slop Fork](https://github.com/andrelandgraf/neon-slop-fork) over to `@neon/sdk` under the hood.

We'd shipped a TypeScript client before this one: `@neondatabase/api-client`, generated with [openapi-typescript](https://openapi-ts.dev/). It did the job, but it was auto-generated and published straight from our private cloud platform repo, so there was no open source repo where we could add to it directly. That's why it stayed a thin generated wrapper and started to show its age (axios-based, no errors as values, etc.)

We think a type-safe layer on top of the raw REST API is worth a lot for developers and agents. It abstracts away the async operations and exposes ready-made workflows for the things that would otherwise take you or your agent a few attempts to get right, like creating a project and getting back a live connection string, or previewing a restore before you commit it.

Ultimately, we hope `@neon/sdk` makes building on Neon more productive and more enjoyable, for you and your agents.

## When to use @neon/sdk

We have the [Neon MCP server](https://neon.com/docs/ai/neon-mcp-server) and [CLI](https://neon.com/docs/cli) for local development and they shine when your coding agent is working right there in your editor or terminal. But `@neon/sdk` is what you should reach for whenever you're integrating Neon programmatically. That covers CI/CD where the CLI isn't enough, more sophisticated dev scripts and full platforms on Neon.

Notabely, the Neon open API is used by platforms like Replit, Netlify DB, Laravel Cloud and Vercel's [marketplace integration](https://vercel.com/marketplace/neon) to provision and manage fleets of Neon databases. All it takes is an API key: provision databases, configure them, enable Neon Auth, transfer projects across organizations, pull fine-grained project and branch-level [consumption metrics](https://neon.com/docs/guides/consumption-metrics) and much more.

## Give it a try

For any TypeScript project - a script, a CI/CD job, a backend - install it and go:

```bash
npm install @neon/sdk
```

If you're on the old `@neondatabase/api-client`, consider moving to `@neon/sdk` if you like what you see. However, there is no rush - we're not deprecating `@neondatabase/api-client` any time soon!

Building an agent platform on Neon? Our [neon-for-agent-platforms](https://github.com/neondatabase/neon-for-agent-platforms) agent skill is already educated on `@neon/sdk`, with runnable scripts for provisioning, branching, snapshots, project transfer and consumption metrics:

```bash
npx skills add neondatabase/agent-skills -s neon -s neon-postgres
npx skills add neondatabase/neon-for-agent-platforms
```

And if you haven't already, take a look at the [Neon Agent Plan](https://neon.com/programs/agents), with dedicated pricing for your agentic or cloud platform building on Neon.

Have feedback or run into something missing? Drop into the [Neon Discord](https://discord.gg/HjupxCjXXp) and let us know.

Happy coding!
