---
title: Dyad Brings Postgres to Local AI App Building (Powered by Neon)
description: The local AI coding tool and app builder just got a powerful backend
excerpt: >-
  Dyad is a local-first, open-source AI coding assistant that helps you build
  and iterate on web apps from your own machine. You can chat with Dyad to
  scaffold code, review changes, or debug issues all inside your editor. Unlike
  most cloud-based tools, Dyad runs locally, supports a...
date: '2025-08-06T02:26:35'
updatedOn: '2025-09-10T01:03:55'
category: product
categories:
  - product
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/dyad-brings-postgres-to-local-ai-app-building-powered-by-neon/cover.avif
  alt: null
isFeatured: false
seo:
  title: Dyad Brings Postgres to Local AI App Building (Powered by Neon) - Neon
  description: >-
    Dyad is an open-source AI coding tool and app builder that just got a
    powerful Postgres backend - powered by Neon.
  keywords: []
  noindex: false
  ogTitle: Dyad Brings Postgres to Local AI App Building (Powered by Neon) - Neon
  ogDescription: >-
    Dyad is an open-source AI coding tool and app builder that just got a
    powerful Postgres backend - powered by Neon.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/dyad-brings-postgres-to-local-ai-app-building-powered-by-neon/cover.avif
---

<Admonition type="tip" title="Apply to our Agents Program">
If you’re building a full-stack AI Agent, apply to our Agents Program for higher resource limits, special pricing, and exclusive features. Fill out the form [here](https://neon.com/use-cases/ai-agents) and we’ll respond shortly.
</Admonition>

[Dyad](https://www.dyad.sh/) is a local-first, open-source AI coding assistant that helps you build and iterate on web apps from your own machine. You can chat with Dyad to scaffold code, review changes, or debug issues all inside your editor. Unlike most cloud-based tools, Dyad runs locally, supports any LLM (including GPT, Claude, and Gemini), and even lets you plug in open weights via Ollama.

<video autoPlay muted loop width="1706" height="1042">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/dyad-brings-postgres-to-local-ai-app-building-powered-by-neon/screen-recording-2025-08-05-at-71149percente2percent80percentafpm-81aa5515.mov" />
</video>

## Just Launched: Dyad’s Portal Template, Backed by Neon

In its latest release ([v0.16.0-beta.1](https://github.com/dyad-sh/dyad/releases)), Dyad introduced a new [Portal template](https://www.dyad.sh/docs/templates/portal) – a full-stack app scaffold that ships with role-based permissions, a real database schema, and built-in undo support for database changes.

<EmbedTweet url="https://twitter.com/dyad_sh/status/1952800981185610094?ref_src=twsrc%5Etfw" />

**At the core of it is Postgres, powered by Neon.** With [Neon’s serverless Postgres](https://neon.com/) as the backend, AI-generated apps in Dyad now support persistent state without the user needing to set up any infrastructure. The Portal template is already live in Dyad’s UI – you can spin up a working app, with Neon Postgres under the hood, and start coding against it immediately.

## Using Neon Branches for Undo and Checkpoints

One of the most powerful things Dyad gains from Neon is the ability to offer a **database undo** feature, letting users rewind time and restore earlier states of their app, including the database.

Behind the scenes, Dyad uses Neon’s branching and [Instant Restore APIs](https://neon.com/docs/introduction/branch-restore) to implement this workflow. When a user creates or edits an app, Dyad writes those changes to a development branch (a child of the production branch). If something goes wrong, the user can roll back to an earlier point in time.

This architecture allows Dyad to support:

- Previewing older states (like git commits for your app + DB)
- Restoring earlier app versions, including the database schema and content
- Safe experimentation, with branching used as a form of checkpointing

<Admonition type="important" title="Neon and agents">
Neon is a serverless Postgres platform designed for modern development and agentic workflows. It powers backends for agents with an unparalleled developer experience: instant provisioning, seamless no-signup flows, and branching for checkpoints and versioning. Agentic platforms like Replit Agent, Databutton, Create.xyz, and many others use Neon under the hood.
</Admonition>

## Try It Yourself

Dyad’s new Portal template shows what’s possible when local-first tools meet modern cloud infra. If you’re already using Dyad, the Portal template is available in the latest beta. If not, [download Dyad](https://dyad.sh/download) and give it a spin!

<Admonition type="tip" title="Apply to our Agents Program">
If you’re building a full-stack AI Agent, apply to our Agents Program for higher resource limits, special pricing, and exclusive features. Fill out the form [here](https://neon.com/use-cases/ai-agents) and we’ll respond shortly.
</Admonition>
