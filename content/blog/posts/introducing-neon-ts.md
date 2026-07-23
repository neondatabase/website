---
title: "Introducing neon.ts: infrastructure as code for your Neon projects"
description: >-
  neon.ts is Neon's branch config and infrastructure-as-code file for full
  stack projects. Declare your services, get type-safe env vars and program
  your branch settings, all in TypeScript.
excerpt: >-
  As Neon turns into a platform with backend primitives for apps and agents,
  provisioning those primitives matters more than ever. neon.ts is our branch
  config and infrastructure-as-code file: declare your Neon services, get
  type-safe environment variables and program your branch settings, all in
  TypeScript. And you can try it today.
date: "2026-06-15T12:00:00"
updatedOn: "2026-06-15T12:00:00"
category: product
categories:
  - product
authors:
  - andre-landgraf
cover:
  image: "https://cdn.neonapi.io/public/images/pages/blog/introducing-neon-ts/cover.png"
  alt: Dark blog cover graphic with the Neon logo and the headline "Introducing neon.ts".
isFeatured: false
seo:
  title: "Introducing neon.ts: infrastructure as code for your Neon projects - Neon"
  description: >-
    neon.ts is Neon's branch config and infrastructure-as-code file for full
    stack projects. Declare your services, get type-safe env vars and program
    your branch settings, all in TypeScript.
  keywords: []
  noindex: false
  ogTitle: "Introducing neon.ts: infrastructure as code for your Neon projects - Neon"
  ogDescription: >-
    neon.ts is Neon's branch config and infrastructure-as-code file for full
    stack projects. Declare your services, get type-safe env vars and program
    your branch settings, all in TypeScript.
  image: "https://cdn.neonapi.io/public/images/pages/blog/introducing-neon-ts/cover.png"
---

As Neon turns into a platform with backend primitives for apps and agents, including functions, object storage, an AI gateway and of course serverless Postgres, provisioning those primitives matters more than ever.

Using the Neon MCP and CLI you can already create projects and branches and pull the associated database connection string into your local `.env` file. That's a pretty good developer (and agent) experience on its own. In fact, our open REST API exposes enough endpoints to [rebuild the Neon Console from scratch](https://neon.com/blog/slop-fork-neon)!

But as you add more Neon services to a project, managing them one CLI command at a time with `neonctl bucket list` and friends stops scaling. Your dev workflow needs a higher-order primitive that sits above those per-primitive commands. This is where infrastructure as code comes in.

IaC has always been a great idea, just a bit cumbersome to manage in practice. As Dax [put it on X](https://x.com/thdxr/status/2064114820295618808):

> IaC was always such a beautiful idea with imperfections. Things always went sideways and you'd have to clean up resources or state manually. But now it's actually as magical as it could be because your agent deals with that for you.

I agree. That's why we're shipping `neon.ts`, Neon's branch config and infrastructure-as-code file for your full stack projects.

We started building it because Neon Functions needs a config file for declaring your function sources for local dev, build and deployment. But it's 2026 and `neon.json` isn't as fun as `neon.ts`, so we decided to go big and ship a full IaC config runtime. And you can try it today.

Install the Neon CLI globally:

```bash
npm i -g neonctl
```

Add the config package to your project:

```bash
npm i @neondatabase/config
```

Link your project root to a Neon project:

```bash
neonctl link
```

And create a `neon.ts` file:

```typescript
// neon.ts
import { defineConfig } from "@neondatabase/config/v1";

export default defineConfig({});
```

So what does it do? There are three main use cases:

- **Declare your Neon services** in your `neon.ts` and run `neonctl config` commands to provision them.
- **Type-safe environment variables** for your Neon services (`DATABASE_URL`, the Neon Auth URL and more).
- **Branch configuration**: declare the settings new branches should get (TTL, autoscaling limits, scale to zero) with your own TypeScript logic.

## Infrastructure as code

First, you can use `neon.ts` to declare which Neon services your project's branches should include. Every project ships with serverless Postgres and with `neon.ts` you can already enable the Neon Data API and Neon Auth today:

```typescript
// neon.ts
import { defineConfig } from "@neondatabase/config/v1";

export default defineConfig({
  auth: true,
  dataApi: true,
});
```

Then `neonctl config plan` shows you what would change and `neonctl config apply` provisions it:

```bash
% neonctl config plan
Planned changes
┌────────┬─────────┬────────────┐
│ Action │ Kind    │ Identifier │
├────────┼─────────┼────────────┤
│ create │ service │ auth       │
├────────┼─────────┼────────────┤
│ create │ service │ dataApi    │
└────────┴─────────┴────────────┘

Utilized services: Postgres, Neon Auth, Data API

% neonctl config apply
Applied changes
┌────────┬─────────┬────────────┐
│ Action │ Kind    │ Identifier │
├────────┼─────────┼────────────┤
│ create │ service │ auth       │
├────────┼─────────┼────────────┤
│ create │ service │ dataApi    │
└────────┴─────────┴────────────┘

Utilized services: Postgres, Neon Auth, Data API
INFO: Pulled 5 Neon variables into .env.local: DATABASE_URL, DATABASE_URL_UNPOOLED, NEON_AUTH_BASE_URL, NEON_AUTH_JWKS_URL, NEON_DATA_API_URL
```

And soon you'll declare functions and buckets and enable the AI gateway the same way, under a `preview` block:

```typescript
// neon.ts
import { defineConfig } from "@neondatabase/config/v1";

export default defineConfig({
  auth: true,
  dataApi: true,
  preview: {
    functions: { /* ... */ },
    buckets: { /* ... */ },
    aiGateway: true,
  },
});
```

These preview primitives are rolling out gradually, so [sign up for the Neon Platform Preview here](https://neon.com/blog/were-building-backends#access) to get access.

### The neon.ts CLI commands

`neonctl deploy` is shorthand for `neonctl config apply` when you just want to push your changes:

```bash
neonctl deploy
```

`neonctl link` and `neonctl checkout` set up the branch you work against - link your project root to a Neon project or switch to (and create) a branch:

```bash
neonctl link               # link your project root to a Neon project
neonctl checkout my-branch # switch to (or create) a branch
```

We shipped `link` and `checkout` recently as part of our [branch-first dev loop](https://neon.com/blog/branch-first-dev-loop); that post walks through the full flow.

And two more for inspecting state:

```bash
neonctl config status   # print the branch's live config to the CLI
neonctl config plan     # dry run of apply
```

Anytime you provision or switch branches (`neonctl config apply` / `neonctl deploy`, `neonctl link` and `neonctl checkout`), Neon pulls that branch's environment variables into your local `.env.local`, so your env always matches the branch you're working against.

Which brings us to type-safe env management and the new `@neondatabase/env` package, built on top of the config.

## Type-safe Neon environment variables

`@neondatabase/env` ships a `parseEnv` utility that takes your `neon.ts` config object and returns a parsed, typed env object. It reads `process.env` and validates it against the Neon services your config declares. Any missing variables are flagged with clear error messages (for you and your agents).

```bash
npm i @neondatabase/env
```

```typescript
import { parseEnv } from "@neondatabase/env/v1";
import config from "./neon";

const env = parseEnv(config);

console.log(env.postgres.databaseUrl);
console.log(env.auth.baseUrl);
```

Because the services live in your `neon.ts`, the shape of `env` follows them: enable `auth` and you get `env.auth`, enable `dataApi` and you get `env.dataApi`. Just like that you get full type safety and env validation for your Neon environment variables.

Not every app needs every variable, though. If one of your apps only needs a subset of env variables, pass an array of the variables that app actually needs, and `parseEnv` validates and returns just those without throwing over the ones you left out:

```typescript
import { parseEnv } from "@neondatabase/env/v1";
import config from "./neon";

// Only require and return the pooled connection string.
const { postgres } = parseEnv(config, ["DATABASE_URL"]);

console.log(postgres.databaseUrl);
```

The keys autocomplete from your `neon.ts`, so you can only select variables the services in your config actually enable. The returned object also narrows to exactly what you asked for. And of course all of this is type-safe!

![Editor autocomplete inside parseEnv(config, [""]) suggesting the Neon env variable keys DATABASE_URL, DATABASE_URL_UNPOOLED, NEON_AUTH_BASE_URL, NEON_AUTH_JWKS_URL and NEON_DATA_API_URL.](https://cdn.neonapi.io/public/images/pages/blog/introducing-neon-ts/parse-env-key-autocomplete.png)

## Branch configurations

Last but not least, you can program what configuration new branches should get with the `branch` property. It's a function that receives the branch being evaluated and returns its settings:

```typescript
// neon.ts
import { defineConfig } from "@neondatabase/config/v1";

export default defineConfig({
  auth: true,
  dataApi: true,
  branch: (branch) => {
    if (branch.exists) {
      // leave existing branches untouched
      return {};
    }
    if (branch.name.startsWith("dev")) {
      return {
        ttl: "7d", // clean up the branch after 7 days
        postgres: {
          computeSettings: {
            autoscalingLimitMinCu: 0.25,
            autoscalingLimitMaxCu: 1, // keep it cheap
            suspendTimeout: "5m", // scale to zero
          },
        },
      };
    }
    return {};
  },
});
```

Here's what this does. The `branch` function runs whenever Neon evaluates a branch against your policy. It gets a `branch` object describing the target (its `name`, whether it `exists` yet, whether it's the default and more) and you return the tuning you want.

In this example, existing branches are left alone (`branch.exists` is `true`, so we return an empty object). New branches whose name starts with `dev` get a 7-day TTL so they clean themselves up, plus a cheap compute profile: autoscaling from 0.25 CU (scale to zero) up to 1 CU, suspending after 5 minutes of inactivity. Every other branch falls through to the defaults.

Right now, branch policies apply when you create a branch with `neonctl checkout`:

```bash
neonctl checkout dev-add-auth
```

This creates a new branch named `dev-add-auth` and, if you have a `neon.ts`, runs your branch policy as part of the checkout, so the branch comes up with these settings and services already in place, no extra step. Checking out an *existing* branch never reconciles it; for those you apply config changes explicitly with `neonctl config apply` (or `neonctl config plan` for a dry run first).

## A bit of TypeScript magic

Declaring your infrastructure in TypeScript also means we can communicate the available configuration options to you and your agents through type errors.

Take this example:

```typescript
// neon.ts
import { defineConfig } from "@neondatabase/config/v1";

export default defineConfig({
  dataApi: true,
});
```

By default, the Data API uses Neon Auth as its authorization service. But here you haven't declared that you want Neon Auth! So you get a type error right on `dataApi`:

```
Type 'true' is not assignable to type '`dataApi` with Neon Auth (the default
`authProvider: 'neon'`) requires Neon Auth, so add `auth: true`. To enable the
Data API WITHOUT Neon Auth, verify a third-party IdP instead:
`dataApi: { authProvider: 'external', jwksUrl: 'https://your-idp/.well-known/jwks.json' }`'.
```

In plain words: Neon's Data API verifies incoming requests with Neon Auth by default, so it can't run without it. And the error spells out both ways to fix it: enable Neon Auth with `auth: true` or point the Data API at your own identity provider with `authProvider: 'external'` and a `jwksUrl`.

This immediately makes it clear that the Data API requires Neon Auth unless you specify a different `authProvider`.

Here's the part I'm proud of. The default way TypeScript communicates "these two fields depend on each other" is `Type 'true' is not assignable to type 'never'`. That's bad DX! We went all the way and encoded the actual rule (and its fixes) as the expected type, so you and your coding agents immediately know which infrastructure-as-code configurations work together!

## Wrapping up

`neon.ts` is the config layer for Neon as a platform. Declare your services and provision them with `config apply`, get type-safe environment variables with `parseEnv` and program your branch settings in plain TypeScript. It composes with the [branch-first dev loop](https://neon.com/blog/branch-first-dev-loop), so the same `link` and `checkout` commands that set up a branch (pulling its env for you) also keep it in sync with your config.

This is just the start. More primitives (functions, buckets, the AI gateway) are landing under `preview` soon. To try `neon.ts` today, install `neonctl` and `@neondatabase/config`, run `neonctl link` and drop a `defineConfig({})` into a `neon.ts` file. If there's something you wish it did, drop into the [Neon Discord](https://discord.gg/tXC49r2M4q) and tell us.

Happy coding!
