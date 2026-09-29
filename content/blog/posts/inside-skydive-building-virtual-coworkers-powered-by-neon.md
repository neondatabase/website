---
title: 'Inside Skydive: building virtual coworkers, powered by Neon'
description: Their specialized agents can instantly deploy backends when the task demands it
excerpt: >-
  Skydive is a platform that lets teams build AI coworkers that do real work.
  When a Skydive agent needs a durable state, it deploys an isolated Neon
  backend mid-task, with no human in the path, and it takes it around a second.
date: '2026-09-29T12:00:00'
updatedOn: '2026-09-28T23:45:00.000Z'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: https://cdn.neonapi.io/public/images/pages/blog/inside-skydive-building-virtual-coworkers-powered-by-neon/cover.jpg
  alt: Skydive virtual coworkers powered by Neon
isFeatured: false
seo:
  title: 'Inside Skydive: building virtual coworkers, powered by Neon - Neon'
  description: Their specialized agents can instantly deploy backends when the task demands it
  keywords: []
  noindex: false
  ogTitle: 'Inside Skydive: building virtual coworkers, powered by Neon - Neon'
  ogDescription: Their specialized agents can instantly deploy backends when the task demands it
  image: https://cdn.neonapi.io/public/images/pages/blog/inside-skydive-building-virtual-coworkers-powered-by-neon/social.jpg
---

![Skydive virtual coworkers powered by Neon](https://cdn.neonapi.io/public/images/pages/blog/inside-skydive-building-virtual-coworkers-powered-by-neon/cover.jpg)

<blockquote>
<p>“Our agents create their own infrastructure. That only works if a database is as cheap and as fast to make as a file”</p>
<cite>Dhruv Amin, co-founder and CEO, Skydive</cite>
</blockquote>

[Skydive](https://skydive.com/) is a platform that lets teams build AI coworkers that do real work. Instead of deploying generalized agents, [you can deploy a team of specialized Skydive agents](https://www.skydive.com/blog/231-agent-use-cases/) directly working for you. Each Skydive agent is an expert on their job - for example, you can deploy

- An [executive assistant](https://www.skydive.com/workflows/ai-executive-assistant) that runs your inbox and calendar and schedules you from Slack
- A [recruiting coworker](https://www.skydive.com/solutions/ai-for-ops) that reads every new job description, sources candidates on LinkedIn, and screens inbound applicants in your applicant tracking system
- A [support agent](https://www.skydive.com/solutions/ai-for-customer-support) that works the tickets, drafts replies, and escalates only what needs a human
- A [coding agent](https://www.skydive.com/engineering) that lives in the terminals, opens draft PRs and pushes them through CI

<YoutubeIframe embedId="t-e9DUjsDKo" isDocPost={false} />

Each agent gets its own Slack account, email inbox, and phone number, so people can message it directly as if it was a human coworker. It also gets its own computer in the cloud, with a browser, terminal, and file system. Skydive agents can fill out websites, run code, build apps, download reports, and move between tools until a job is done.

![Skydive virtual coworkers](https://cdn.neonapi.io/public/images/pages/blog/inside-skydive-building-virtual-coworkers-powered-by-neon/skydive-image-1.jpg)

Anyone on a human team can deploy a Skydive agent in under a minute. Once they’re deployed, agents will run on their own. When a job spans several agents, you can even put them in a group chat and they hand work off to each other.

To successfully deliver this experience, Skydive agents have to be able to move at agent speed - Skydive agents are set up to reach for tools that can keep up. That is especially true for infrastructure, which is often the slow part of the loop.

But not with Neon. When a Skydive agent needs a durable state, it deploys an isolated Neon backend mid-task, with no human in the path, and it takes it around a second.

| 0.7 seconds | 1.13 seconds |
| :---: | :---: |
| Average time it takes a Skydive agent to deploy a Neon backend | Average cold start time to first row |

*Cross-fleet measurements provided by Skydive*

## When agents need durable state

Every Skydive agent gets a sandbox with a terminal and file system. That sandbox is ephemeral: it sleeps when the agent goes idle and gets wiped when it restarts. For anything the agent is supposed to remember, a Neon backend is also deployed.

For Skydive, three patterns come up repeatedly in production that call for backends:

- **Receiving events and holding them:** For example, Skydive’s [Email Outbound assistant](https://www.skydive.com/workflows/ai-email-outbound) runs a webhook endpoint for inbound signups. When leads fill out a form, the agent writes the row, then works the lead over the following days.
- **Standing up an app:** Skydive agents can serve apps at a public URL. They build the internal tool someone requested, such as a dashboard the team opens every morning, a form that collects responses, or a status page for a long-running job.
- **Running on a schedule:** Skydive agents can also fire routines, e.g. a 3 a.m. digest that is only useful if it can see what the previous twenty runs found.

Letting the agents deploy their own isolated Neon backends keeps the infra performant (since every backend has its own isolated resources) and also secure (the agent that created a database cannot access another agent’s database). [Compute also suspends when it is idle](https://neon.com/docs/introduction/scale-to-zero), so this setup is cost-efficient: no need to keep compute running for every inactive coworker. Backends can be deployed without overthinking it.

<blockquote>
<p>“The agent manages its own Neon project. We set the defaults once. After that, the fleet runs without us in the path”</p>
<cite>Dhruv Amin, co-founder and CEO, Skydive</cite>
</blockquote>

## Deploying Postgres in one command

In practice, this looks like this:

```sh
platform db create leads --attach DATABASE_URL
```

That call hits Skydive’s API, which creates a Neon project with a single `main` branch on Postgres 18, writes the pooled connection string to the agent’s secret store, and injects it into the sandbox as `DATABASE_URL`. The agent points its app at `process.env.DATABASE_URL` and keeps going.

Two details make this safe:

- Skydive’s control-plane database never stores the connection string. It keeps only the Neon project ID and branch ID, then derives the connection string from Neon.
- `createProject` returns a direct URI. Before anything downstream sees it, Skydive swaps the host for `connection_parameters.pooler_host`. Every connection string an agent receives ends in `-pooler`.

The Neon API sits on the critical path of a live conversation, so Skydive’s client uses keep-alive, three retries with exponential backoff, and a single normalized error type. The coworker should not have to reason about a transient `502`.

## Sizes and lifecycle

Skydive agents manage the end-to-end lifecycle of the Neon project through the API. That is [the model Neon is designed for](https://neon.com/platforms) - quotas, autoscaling limits, and scale-to-zero are all set on create, then updated later if the job grows.

For example, the agent picks one of three database sizes and upgrades when it outgrows the current one:

- Small: 1 GiB storage quota and 0.25 CU (most databases stay here)
- Medium: 10 GiB storage quota and autoscaling up to 2 CU
- Large: 50 GiB storage quota and up to 4 CU

<Admonition type="note" title="Neon has a mature API for fleet control">
Platforms have been deploying Neon backends programmatically for years; during this time, [we’ve built the endpoints your agent needs to manage operations end-to-end.](https://neon.com/docs/guides/consumption-limits)
</Admonition>

## Start building

Skydive comes from the team behind Anything, [whose agent also uses Neon.](https://neon.com/blog/the-hidden-ops-layer-of-agent-platforms) Thank you so much to the team for trusting Neon and sharing their implementation details.

If you’re building a similar platform than Skydive, [apply to our agent plan](https://neon.com/use-cases/ai-agents). You’ll get dedicated resource limits, technical assistance, and marketing support.
