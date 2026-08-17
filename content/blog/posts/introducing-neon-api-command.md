---
title: 'Introducing the New Neon API Command'
description: >-
  The Neon CLI now ships an `api` passthrough command that gives your agent
  every Neon API endpoint the moment it exists.
excerpt: >-
  CLIs have become the default tool for AI agents because they package complex
  environments into predictable commands. But human-friendly CLIs lag behind
  the underlying API, and letting agents call the raw API risks leaking
  secrets. `neon api` closes both gaps.
date: '2026-07-09T10:00:00'
updatedOn: '2026-07-09T10:00:00'
category: product
categories:
  - product
authors:
  - anthony-giuliano
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/introducing-neon-api-command/cover.jpg'
  alt: 'Introducing the New Neon API Command'
isFeatured: false
seo:
  title: 'Introducing the New Neon API Command - Neon'
  description: >-
    The Neon CLI now ships an `api` passthrough command that gives your agent every Neon API endpoint the moment it exists.
  keywords: []
  noindex: false
  ogTitle: 'Introducing the New Neon API Command - Neon'
  ogDescription: >-
    CLIs have become the default tool for AI agents because they package
    complex environments into predictable commands. But human-friendly CLIs
    lag behind the underlying API, and letting agents call the raw API risks
    leaking secrets. `neon api` closes both gaps.
  image: 'https://cdn.neonapi.io/public/images/pages/blog/introducing-neon-api-command/cover.jpg'
---

![Introducing the New Neon API Command](https://cdn.neonapi.io/public/images/pages/blog/introducing-neon-api-command/cover.jpg)

CLIs in many ways have become the default tool of choice for AI agents. And this is for good reason. They package complex environments into predictable, bite-sized commands that agents can parse and execute reliably.

But CLIs also have a problem. They're optimized for human developer experience. To make life easier for a human engineer, a CLI often combines multiple API endpoints into a single command, hiding the underlying complexity. This abstraction is great for humans, but it creates a significant problem for an autonomous agent: **feature lag**.

Because human-centric CLIs require intentional design and manual updates, they naturally lag behind the core API surface area. If an agent is leveraging a standard CLI, it's restricted to a subset of features. In exchange for a streamlined human DX, you sacrifice the speed and granularity that an agent needs.

## Why not just call the API directly?

Of course, this begs the question: "Why not just skip the CLI entirely and let the agent call the API directly?"

While hitting raw endpoints solves the feature-lag issue, agents are notoriously error-prone when working with an API directly. Namely, they often struggle with authentication and secret management.

Making direct, authenticated API calls requires an agent to locate, insert, and handle access tokens manually. This introduces frequent points of failure and risks inadvertently leaking high-privilege tokens into shell history files, application logs, or the agent's own conversational memory.

## The new Neon API command

To bridge this gap, we've added the `api` command to the [Neon CLI](https://neon.com/docs/cli). This command serves as an escape hatch that gives your agent the raw power of the [Neon API](https://neon.com/docs/reference/api) paired with the local guardrails of the CLI.

The moment a new endpoint is added to the Neon API, your agent can access it natively through the terminal. For example, to list your projects, an agent can simply run:

```bash
neon api /projects -Q org_id={org_id}
```

Or, if it needs to spin up a new branch with specific configurations:

```bash
neon api /projects/{id}/branches -X POST -F branch.name=dev
```

The CLI seamlessly maps flags to core HTTP primitives exactly as you would expect:

- `-X` explicitly sets the HTTP method.
- `-F key=value` builds a typed JSON body with dot-notation nesting (e.g. `-F branch.name=dev` → `{ "branch": { "name": "dev" } }`).
- `-Q` appends query parameters.
- `-H` injects custom headers.
- `-d @file` / `-d -` reads a request body directly from a file or stdin.

## The best of both worlds

By routing raw API calls through the CLI, you get true credential isolation. Authentication is handled seamlessly in the background by the local CLI environment, which means your agent never has to touch or manage raw secrets, eliminating the risk of token leaks.

Additionally, agents don't have to guess what operations are available to them or scrape outdated documentation to find new endpoints. They can simply run:

```bash
neon api --list
```

This returns a complete, up-to-date manifest of available endpoints right in their terminal session.

With the updated Neon CLI, agents no longer have to compromise between the safety of a CLI and the full velocity of the Neon API.

## Our inspiration

It's important to call out that we didn't invent this pattern from scratch. We borrowed a phenomenal one from our partners at Vercel. Their open-source CLI ships an authenticated [`api` command](https://vercel.com/docs/cli/api) built on this exact philosophy, which we adapted to handle Neon's nested JSON payloads.

## Try it out

Curated commands make a CLI pleasant. A passthrough command makes it complete. For agents, complete is what unblocks them, and doing it through the CLI's own auth is what keeps it safe.

If you're building tools for agents, this is a cheap, high-leverage pattern: wrap your API with an authenticated, spec-aware passthrough so nothing is ever out of reach, and so tomorrow's endpoints work today.

Try it now:

```bash
npm i -g neon
```

Package: [`neon` on npm](https://www.npmjs.com/package/neon).
