---
title: "A branch-first dev loop for Neon: link, checkout and env pull"
description: >-
  Three new Neon CLI commands - neonctl link, checkout and env pull - make
  branch-first development the default for you and your agents.
excerpt: >-
  We're hard at work on the private preview of Neon Platform and along the way
  we're rethinking Neon's branch-first developer experience. First up: three new
  Neon CLI commands that turn branch-first development into a tight, repeatable
  loop for both humans and agents.
date: "2026-06-10T12:00:00"
updatedOn: "2026-06-10T12:00:00"
category: product
categories:
  - product
  - workflows
  - ai
authors:
  - andre-landgraf
cover:
  image: "https://cdn.neonapi.io/public/images/pages/blog/branch-first-dev-loop/cover.png"
  alt: Dark blog cover graphic with the Neon logo and the headline "A branch-first dev loop".
isFeatured: false
seo:
  title: "A branch-first dev loop for Neon: link, checkout and env pull - Neon"
  description: >-
    Three new Neon CLI commands - neonctl link, checkout and env pull - make
    branch-first development the default for you and your agents.
  keywords: []
  noindex: false
  ogTitle: "A branch-first dev loop for Neon: link, checkout and env pull - Neon"
  ogDescription: >-
    Three new Neon CLI commands - neonctl link, checkout and env pull - make
    branch-first development the default for you and your agents.
  image: "https://cdn.neonapi.io/public/images/pages/blog/branch-first-dev-loop/cover.png"
---

We're hard at work shipping the private preview of [Neon Platform](https://neon.com/blog/were-building-backends) and while we're at it we're rethinking Neon's developer experience from the ground up. A lot of that work is about making branch-first development the default, not something you have to wire up yourself.

The first piece is shipping today: three new Neon CLI commands that make branch-first development easier than ever. `neonctl link`, `neonctl checkout` and `neonctl env pull`. They benefit you whether you only use Neon Serverless Postgres or you're reaching for more of the Neon Platform going forward. And they're especially useful once you hand the feature-dev loop to a coding agent.

## Link your workspace to a Neon project

`neonctl link` connects your local dev workspace to a Neon project, the same way `vercel link` does for your Vercel project.

```bash
neonctl link
```

It's interactive: pick a Neon org, pick or create a project and branch, then the CLI writes the org, project and branch IDs into a local `.neon` file. That file is git-ignored by default, so it stays a per-developer pointer.

And for agents that don't do interactive mode, there's `neonctl link --agent`.

If you're a long-time `neonctl` user, you'll know this was already possible through the lower-level `set-context` command. `link` is just an interactive wrapper on top of the lower-level primitive.

Once a workspace is linked, project- and branch-scoped commands stop needing `--project-id` and `--branch` flags. For example, this lists every branch in the linked project, no arguments required:

```bash
neonctl branch list
```

That's convenient on its own. It becomes a game-changer once you add `env pull`.

## Pull branch-scoped env vars with env pull

`neonctl env pull` fetches the current branch's Neon environment variables into your existing `.env` file, or `.env.local` if you don't have one. You can also point it at any file with `--file`.

```bash
neonctl env pull
```

It pulls the env variables based on your current branch's enabled services. You always get `DATABASE_URL` and `DATABASE_URL_UNPOOLED` (the pooled and direct Postgres connection strings), plus the Neon Auth and Data API secrets when those services are enabled on the branch. And as our preview features roll out (object storage and an AI gateway) you'll get those too if you're using them. Only the Neon-managed keys are written, so everything else in your file is left untouched.

There's no branch ID to pass, because it's already in `.neon`. Giving your teammates, both human and agent, an isolated Neon branch for development is great. Pulling all the branch-scoped connection details for that branch by hand is the annoying part. `env pull` is the fix.

In fact, you'll rarely run `env pull` yourself: as you'll see below, `link` and `checkout` run it for you, so pinning a branch and pulling its env are a single step.

## Switch branches with checkout

The last ingredient is switching branches. Neon brings git-like branching to Postgres (and soon the full suite of Neon backend primitives), so inspired by git again, we added a quick utility command for it: `checkout`.

```bash
neonctl checkout dev-add-search
```

`neonctl checkout <branch-name>` lets you create a branch or check out an existing one. Run it without a name and you get an interactive branch picker with a create option:

```bash
neonctl checkout
```

Checkout updates the branch identifier in your `.neon` file so the next CLI commands target that branch.

## The branch-first dev loop

Put them together and branching has never been easier to integrate tightly into your everyday dev workflow. Run `neonctl link` once when you start on a project:

```bash
neonctl link
```

Then run `neonctl checkout` whenever you'd reach for `git checkout -b`, at the start of every feature, fix or experiment, to give that work its own isolated Neon branch:

```bash
neonctl checkout dev-add-search
```

And as I mentioned earlier, `neonctl env pull` already runs under the hood for both `link` and `checkout`, so your `.env` (or `.env.local`) already holds the right Neon environment variables for the branch you just checked out. Your app always points at the branch you're actually working on and nothing leaks between features.

You can still run `neonctl env pull` directly to refresh a branch's env or pull a different branch into a specific file with `--file`.

## Hand these commands to your agent

Branching is great for devs but essential for agents (I make a ton of mistakes but my agents even more so). An agent can run `neonctl checkout` between tasks to give itself a fresh, isolated database per feature with no shared state to corrupt and no connection strings to copy around.

I'd add a small paragraph to my own `AGENTS.md` (and `CLAUDE.md`) so my agents pick up the loop by default. Something like:

```md
For every feature, whenever you run `git checkout -b`, also run `neonctl checkout <fitting-branch-name>` to create a matching Neon branch for that git branch. This also pulls the branch's Neon env variables into our local `.env`, so our database credentials are always branch scoped.
```

On top of that, install the new `neon` agent skill. It teaches your agent the full branch-first dev workflow with Neon plus other Neon Platform best practices:

```bash
npx skills add neondatabase/agent-skills -s neon -s neon-postgres
```

Then prompt your agent to do branch-first feature development and let it drive the loop.

## What if you don't want env vars on disk?

Writing secrets into a local `.env` is the right default for most local dev. I bet you have a bunch of `.env` files on your machine even though you post about using [varlock](https://varlock.dev) on X! However, `neonctl env pull` is optional. You can opt out and we give you alternative ways to inject your Neon env variables for local dev.

First, pass `--no-env-pull` to opt out of the bundled pull:

```bash
neonctl link --no-env-pull
neonctl checkout dev-add-search --no-env-pull
```

### Inject it at runtime

Our new `@neondatabase/env` package gives you a few ways to inject your branch's env at runtime instead of writing it to disk:

- `neon-env run` to inject env into your dev command
- `fetchEnv` to resolve env in code
- `neonctl dev` (coming soon) for Neon Functions

`neon-env run` fetches your branch's Neon variables and injects them into the child process, so nothing is written to disk:

```bash
npm i @neondatabase/env

neon-env run -- npm run dev
```

`fetchEnv` does the same in code. Pass it your `neon.ts` config and the branch to resolve and it hands you back a typed env object you can read at your app's bootstrap:

```typescript
import { fetchEnv } from "@neondatabase/env/v1";
import config from "./neon";

const env = await fetchEnv(config, { projectId, branchId });
console.log(env.postgres.databaseUrl);
```

`neonctl dev` is coming soon for Neon Functions. It runs your local dev server with that same branch env injected, so the branch-first loop carries straight over to Neon Functions development:

```bash
neonctl dev
```

### Pull it into your env manager

And if you're actually using varlock, `@neondatabase/env` also ships a `neon-env export` command that prints your branch's env to stdout as dotenv lines or JSON. You can pull Neon straight into a varlock `.env.schema` with a bulk loader:

```bash
# .env.schema
# @setValuesBulk(exec(`neon-env export --format json`), format=json)
```

Now varlock resolves your Neon branch's `DATABASE_URL` (and friends) on demand and you still get varlock's schema validation and secret redaction on top.

### Make it stick

To make sure you never forget the flag, wrap the commands in your `package.json` scripts:

```json
{
  "scripts": {
    "neon:checkout": "neonctl checkout --no-env-pull",
    "dev": "neon-env run -- next dev"
  }
}
```

And for your agents, add a line to your `AGENTS.md` so they follow the same rule. For example: _"Use `neonctl checkout <branch> --no-env-pull` and never run `neonctl env pull`; env is injected at runtime via `neon-env run`."_

## Wrapping up

Our agents ship feature after feature (or even in parallel). Branching is key to isolating your infra per feature. Our goal is to give you the best primitives for branch-first development: use them as documented here or make them your own and build your own abstractions on top!

This is the first of several DX improvements landing as we build toward the Neon Platform private preview, with more CLI commands and new SDKs on the way. If there's something you wish the Neon CLI did, drop into the [Neon Discord](https://discord.gg/tXC49r2M4q) and tell us.

And if the little Neon Platform teasers got you interested, sign up for the private preview [here](https://neon.com/blog/were-building-backends#access).

Happy coding!
