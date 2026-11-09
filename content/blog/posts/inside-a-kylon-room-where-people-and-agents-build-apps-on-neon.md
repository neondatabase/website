---
title: Inside a Kylon room, where people and agents build apps on Neon
description: Kylon gives each workspace its own Neon project and each draft its own branch
excerpt: >-
  Kylon is your AI company harness - a workspace where your team, their agents,
  and their tools can work together in shared rooms.
date: '2026-11-04T12:00:00'
updatedOn: '2026-11-04T01:49:00.000Z'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: https://cdn.neonapi.io/public/images/pages/blog/inside-a-kylon-room-where-people-and-agents-build-apps-on-neon/cover.jpg
  alt: Inside a Kylon room, where people and agents build apps on Neon
isFeatured: false
seo:
  title: Inside a Kylon room, where people and agents build apps on Neon - Neon
  description: Kylon gives each workspace its own Neon project and each draft its own branch
  keywords: []
  noindex: false
  ogTitle: Inside a Kylon room, where people and agents build apps on Neon - Neon
  ogDescription: Kylon gives each workspace its own Neon project and each draft its own branch
  image: https://cdn.neonapi.io/public/images/pages/blog/inside-a-kylon-room-where-people-and-agents-build-apps-on-neon/social.jpg
---

![Inside a Kylon room, where people and agents build apps on Neon](https://cdn.neonapi.io/public/images/pages/blog/inside-a-kylon-room-where-people-and-agents-build-apps-on-neon/cover.jpg)

<blockquote>
<p>“At Kylon, agents build the tools a team runs on and keep improving them. That means deploying many small databases that the agents manage themselves”</p>
<cite><a href="https://www.linkedin.com/in/suanmiao/">Quinn Leng</a>, co-founder at Kylon</cite>
</blockquote>

[Kylon](https://kylon.io/) is your AI company harness - a workspace where your team, their agents, and their tools can work together in [shared rooms](https://kylon.io/product/workspace). Instead of having each teammate working with their own agent in isolated chats, a Kylon [room](https://kylon.io/product/workspace) brings them and their agents together into one shared context. Anyone in the room can see what was asked, what an agent did, and what's waiting for approval, and different teammates can pick up where the work left off.

<EmbedTweet url="https://twitter.com/quinn_leng/status/2110036562671190230?ref_src=twsrc%5Etfw" />

Teams usually organize rooms around a function, like #sales or #ops. Agents in those rooms connect to tools like Gmail, Slack, HubSpot, and Salesforce, and the apps they build (a CRM, an invoice tracker, a hiring board) belong to the team that asked for them.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/inside-a-kylon-room-where-people-and-agents-build-apps-on-neon/kylon-blog-image-1.png" alt="A Kylon agent finds 14 logistics leads and puts them in a new Sales CRM App" />
<figcaption>A Kylon agent finds 14 logistics leads and puts them in a new Sales CRM App</figcaption>
</figure>

## The stack behind Kylon

<blockquote>
<p>“In Kylon, nobody ever opens a console”</p>
<cite><a href="https://www.linkedin.com/in/suanmiao/">Quinn Leng</a>, co-founder at Kylon</cite>
</blockquote>

Kylon's stack is built around the main requirement of the product: people and agents need to see the same work at the same time, on the web, on desktop, and on mobile. Because agents build and change apps on their own, the infrastructure behind those apps also has to be fast to create and something agents can manage without a person opening a console.

Kylon is built on

- A [TypeScript](https://www.typescriptlang.org/) monorepo with a [Node.js](https://nodejs.org/) backend
- [React](https://react.dev/) on the web and [Flutter](https://flutter.dev/) on mobile
- [Neon](https://neon.com/) as the backend layer for Kylon apps

## How Kylon uses Neon

<blockquote>
<p>“We tried a couple of other managed databases while we were finding the right shape for agent-built apps. Fast branching and scale-to-zero made Neon the clear fit”</p>
<cite><a href="https://www.linkedin.com/in/suanmiao/">Quinn Leng</a>, co-founder at Kylon</cite>
</blockquote>

Neon holds the data for the apps that customers' teams and agents build inside a workspace. The key features for Kylon:

- [Branching](https://neon.com/docs/introduction/branching): Kylon creates a branch per draft, an in-progress version of an app that an agent or a person opens to make changes, which only goes live when someone publishes it. An agent can try a change on a copy of real data while a person reviews the preview
- [Scale-to-zero](https://neon.com/docs/introduction/scale-to-zero) and [autoscaling](https://neon.com/docs/introduction/autoscaling): most Apps sit quiet for most of the day, then get busy in bursts - for example when an agent runs a bulk import. This way of working (let the agents build lots of small, mostly idle databases) only make sense if idle state is nearly free
- [The Neon API](https://neon.com/docs/reference/api): provisioning is fully programmatic, so agents can create and manage apps end to end
- [Instant point-in-time restore](https://neon.com/docs/introduction/branch-restore): if an agent makes a mistake on a table, the agent itself can also easily undo it
- The [Neon MCP](https://neon.com/docs/ai/neon-mcp-server): customers with their own Neon accounts can connect it to Kylon, and their agents can work with those projects directly

### One project per app, one branch per draft

Kylon maps its product directly onto Neon resources:

- Each Kylon workspace (one company's space in Kylon, with its own members, agents, connections, and data) gets its own [Neon project](https://neon.com/docs/manage/projects)
- Each app inside that workspace gets its own isolated Neon database
- When an agent or a person opens a draft to change an App (a working copy that only goes live when someone publishes it), Kylon creates a [Neon branch](https://neon.com/docs/introduction/branching) of that app's data
- When an app or workspace is removed, its databases and branches are cleaned up

Agents change apps constantly - the riskiest moment for agent-written code is a migration on live data. With a branch per draft, the agent applies its change to a copy of the app's real data. A person reviews the preview, and production only changes when someone publishes the draft.

<blockquote>
<p>“The draft workflow would have been much harder to build elsewhere: branch, let the agent try it, let a person check it, then publish. Without cheap branches, we'd have had to choose between safety and speed”</p>
<cite><a href="https://www.linkedin.com/in/suanmiao/">Quinn Leng</a>, co-founder at Kylon</cite>
</blockquote>

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/inside-a-kylon-room-where-people-and-agents-build-apps-on-neon/kylon-blog-image-2.png" alt="Agents apply fixes to a draft of the app, running on its own Neon branch; a teammate reviews the preview and publishes it when it’s ready" />
<figcaption>Agents apply fixes to a draft of the app, running on its own Neon branch; a teammate reviews the preview and publishes it when it’s ready</figcaption>
</figure>

### Postgres as the shared state between people and agents

<EmbedTweet url="https://twitter.com/quinn_leng/status/2110036807148814819?ref_src=twsrc%5Etfw" />

Each app's Neon database ([Lakebase Postgres](https://neon.com/lakebase)) is the single source of truth for everyone working on it. A person edits a record in the UI - an agent updates the same table through the App's API - both see the same rows.

Agents read and write through the same API the App's UI uses, and the agent that builds an App also owns its schema and migrations. Record changes can also trigger [Automations](https://kylon.io/product/workflows) (recurring jobs that a room's agent sets up and runs on a schedule or a trigger) so a row written by one agent can kick off the next step of work.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/inside-a-kylon-room-where-people-and-agents-build-apps-on-neon/kylon-blog-image-3.png" alt="A teammate comments on a CRM row; the agent reads the same row and acts on the comment" />
<figcaption>A teammate comments on a CRM row; the agent reads the same row and acts on the comment</figcaption>
</figure>

## Try it

<EmbedTweet url="https://twitter.com/quinn_leng/status/2110036327286886731?ref_src=twsrc%5Etfw" />

A big thank you to the Kylon team for building on Neon and for sharing their story. You can try Kylon at [kylon.io](https://kylon.io).

<Admonition type="note" title="Build your agents on Neon">
Neon gives every app your agents build a full backend, from [Postgres](https://neon.com/lakebase) to [auth](https://neon.com/auth), [storage](https://neon.com/object-storage), [functions](https://neon.com/functions) and [AI models](https://neon.com/ai-gateway). If you're building an agent, apply to the [Neon Agent Plan](https://neon.com/use-cases/ai-agents) for credits, higher resource limits, and direct support.
</Admonition>

_If you'd like to share your story and be featured in the Neon blog, tell us on [Discord](https://neon.com/discord)._
