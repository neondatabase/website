---
title: "My agent cloned GitHub (sort of) using the Neon backend"
description: Experimenting with our beta
excerpt: >-
  GitHub has been down a lot lately. During one of those episodes, I had the
  idea of asking my agent to use our new backend suite (still in beta) to build
  a working Git host. This is genuinely outside of my comfort zone as I had no
  prior knowledge of Git server internals, so I didn't have much hopes, but it
  went surprisingly well...
date: "2026-07-23T09:00:00"
category: product
categories:
  - product
authors:
  - roman-zaynetdinov
cover:
  image: https://cdn.neonapi.io/public/images/pages/blog/my-agent-cloned-github-using-the-neon-backend/neon-experiment.jpg
  alt: null
isFeatured: false
draft: false
seo:
  title: "My agent cloned GitHub (sort of) using the Neon backend - Neon"
  description: >-
    An experiment building a working Git host on the Neon backend, with every
    Git object stored as rows in Postgres and large blobs offloaded to object
    storage, all served from a single function.
  keywords: []
  noindex: false
  ogTitle: "My agent cloned GitHub (sort of) using the Neon backend - Neon"
  ogDescription: >-
    An experiment building a working Git host on the Neon backend, with every
    Git object stored as rows in Postgres and large blobs offloaded to object
    storage, all served from a single function.
  image: https://cdn.neonapi.io/public/images/pages/blog/my-agent-cloned-github-using-the-neon-backend/neon-experiment.jpg
---
![cloning github in neon functions](https://cdn.neonapi.io/public/images/pages/blog/my-agent-cloned-github-using-the-neon-backend/neon-experiment.jpg)

GitHub has been down a lot lately (ugh). During one of those episodes, I had the idea of asking my agent to use [our new backend suite (still in beta)](https://neon.com/blog/neon-backend-is-beta) to build a working Git host. This is genuinely outside of my comfort zone as I had no prior knowledge of Git server internals, so I didn't have much hopes, but it went surprisingly well:

## What I built: neon-git

`neon-git` (how we called the experiment) turned out to look like a real Git server. It can clone, push, pull, browse commits and files in a browser, the whole thing. The twist: there's no filesystem. Every object a Git repo needs (blobs, trees, commits) lives as rows in Postgres, with large blobs offloading to [Neon Object Storage](https://neon.com/docs/storage/overview) instead of bloating the database. It's served over HTTP, from a single function.

The project: [https://github.com/zaynetro/neon-git](https://github.com/zaynetro/neon-git)

The main building blocks:

- [Neon Database](https://neon.com/docs/postgres/overview): it stores every Git object as rows in Postgres
- [Neon Functions](https://neon.com/docs/compute/functions/overview): they run the whole app
- [Neon Object Storage](https://neon.com/docs/storage/overview): it catches anything too big for a Postgres row, so Postgres stays fast and cheap
- [Neon Managed Auth](https://neon.com/docs/auth/overview) gates every repo: git sends a token as the HTTP Basic password, the browser carries it in a cookie, and non-owners get a 404 instead of a permissions error

```
git CLI / browser
       │
       ▼
  Neon Functions (Git Smart HTTP)
       │
       ▼
  Neon Auth (JWT bearer token)
       │
       ▼
  Git read/write ops
       │
   ┌───┴────┐
   ▼        ▼
Postgres   Object Storage
(objects)  (large blobs)
```

Toy Git implementations break on real repos constantly, so before calling it done we threw the kind of things that trip up naive implementations at it:

- nested directories,
- a binary blob,
- a file large enough to force it off Postgres and onto object storage,
- a directory and filename with spaces in them,
- a zero-byte file,
- a markdown file with a raw `<script>` tag in it, to check the web UI escapes it instead of executing it

It held up!

## How I built it: agent, deploy neon backend

It's 2026, so of course I didn't hand-write this. I pointed my agent at the Neon Functions and Object Storage docs and gave it a plan: build a Git server, store objects in Postgres, offload big blobs to S3, auth with JWTs. The agent wrote the code, tested it, and deployed it using the neon CLI.

### What "build a Git server" actually meant

Git's Smart HTTP transport turns out to be just four routes - request the refs, then request the packfile, for both fetch and push. That maps cleanly onto a normal web app (a [Hono](https://hono.dev) app, in this case). The hard part is what's behind those routes:

- The pack protocol handled in pure JavaScript by reusing `isomorphic-git`'s internals, so nothing native or subprocess-based has to run inside a function
- SSH was a non-starter. It wants an always-on TCP listener, which doesn't exist in a serverless model, so everything goes over HTTPS instead

### What happens on a request

The function itself is stateless, so every git request rebuilds its context from scratch - rehydrate, operate, persist, respond:

```
request comes in
                       │
                       ▼
        rehydrate a minimal in-memory .git
           (via memfs) straight from Postgres
                       │
                       ▼
              ┌────────┼────────┐
              ▼        ▼        ▼
            push      clone    browse
              │         │         │
   parse pack,│  read objects,│  read objects
   write rows,│  pack in mem, │  straight from
   CAS the ref│  stream back  │  Postgres, render
              │         │         │
              └────────┼────────┘
                       ▼
                  write-back + respond
```

- "Push" parses the incoming packfile, resolves it into individual objects, writes each one as a row, then updates the ref with a transactional compare-and-swap
- "Clone" does the reverse: it reads the stored objects back out, packs them in memory, and streams the packfile to the client
- "Browse" skips the pack machinery entirely and reads objects straight from Postgres to render the file tree and blob views

### How it came together

Built in stages, each one checked against a live deployment before moving to the next — rather than writing the whole thing blind:

- Clone + push working, objects in Postgres
- Browser UI, reading straight from Postgres
- Blob offload to object storage for anything too big
- Auth, gating both git and the browser

### The config

The whole project config is one file:

```typescript
import { defineConfig } from "@neondatabase/config/v1";

const authEnv = {
  NEON_AUTH_BASE_URL: process.env.NEON_AUTH_BASE_URL ?? "",
  NEON_AUTH_ORIGIN: process.env.NEON_AUTH_ORIGIN ?? "",
  NEON_AUTH_JWKS_URL: process.env.NEON_AUTH_JWKS_URL ?? "",
  NEON_GIT_PUBLIC_HOST: process.env.NEON_GIT_PUBLIC_HOST ?? "",
};

export default defineConfig({
  auth: true,
  preview: {
    functions: {
      git: {
        name: "Neon Git server",
        source: "./functions/git.ts",
        env: authEnv,
      },
    },
    buckets: {
      "git-objects": {},
    },
  },
});
```

Deploy is one command:

```bash
neon deploy
```

## Build something fun yourself

GitHub being down is still not fixed :) but this was a good excuse to see what the new Neon tools can do. If an agent can read our docs and put together something as fiddly as a Git server without much input, that's a decent proxy for how fast you can build the thing you actually meant to build.

To one-shot your backend with an agent,

- First, install the beta agent skills: `npx neon@latest init --preview`
- Then build your backend from a single prompt, e.g. `set up a Neon backend for my app with Postgres, auth, object storage, functions, and AI gateway`

Your agent will provision the services, declare them in [neon.ts](https://neon.com/docs/reference/neon-ts), and wire them into your app.

You can also explore these guides:

- [Get started with the Neon backend suite](https://neon.com/docs/get-started/backend-beta) (starter)
- [Build a full backend with Next.js and Neon](https://neon.com/docs/get-started/full-backend-quickstart) (extended)
