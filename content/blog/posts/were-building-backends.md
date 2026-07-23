---
title: We're building the boring backend for apps and agents
description: >-
  Why Neon is expanding beyond Postgres into a branchable stack of backend
  primitives — auth, data API, object storage, compute, and an AI gateway — for
  the agentic era.
excerpt: >-
  Recently, everyone has been talking about throwing it all away and building
  entirely new magic sci-fi cloud infrastructure for agents. Building real
  infrastructure is hard enough as it is. AI has only raised the stakes,
  dialing up the operational requirements and pushing the limits on every
  axis imaginable...
date: "2026-05-28T12:00:00"
updatedOn: "2026-05-28T12:00:00"
category: product
categories:
  - product
authors:
  - bryan-clark
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/were-building-backends/were-building-backends.jpg
  alt: "We're building the boring backend for apps and agents"
isFeatured: false
seo:
  title: We're building the boring backend for apps and agents
  description: >-
    Why Neon is expanding beyond Postgres into a branchable stack of backend
    primitives — auth, data API, object storage, compute, and an AI gateway —
    for the agentic era.
  keywords: []
  noindex: false
  ogTitle: We're building the boring backend for apps and agents
  ogDescription: >-
    Why Neon is expanding beyond Postgres into a branchable stack of backend
    primitives — auth, data API, object storage, compute, and an AI gateway —
    for the agentic era.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/were-building-backends/were-building-backends.jpg
---

![We're building the boring backend for apps and agents](https://cdn.neonapi.io/public/images/pages/blog/were-building-backends/were-building-backends.jpg)

<Admonition type="important" title="Update" >
Object Storage, Functions, and AI Gateway are now in beta and open for everyone to try. [Read the launch post](https://neon.com/blog/neon-backend-is-beta).
</Admonition>

Everyone has been talking about throwing it all away and building entirely new magic sci-fi cloud infrastructure for agents.

Amidst all the hype, this [tweet](https://x.com/rtheoryxyz/status/2056012016611905753) stood out to me as a voice of reason:

<BlogQuote quote="The agent-native cloud needs boring primitives more than magic. Identity, permissions, logs, rollback, and cost controls before the sci-fi layer." author="@rtheoryxyz" />

Building real infrastructure is hard enough as it is. AI has only raised the stakes, dialing up the operational requirements and pushing the limits in new and unexpected ways. When autonomous agents or developers move at breakneck speeds, applications break. "Magic" won’t help you recover when a runaway agent deletes your production database and all its backups. Robust, familiar infrastructure with rollbacks, AI-friendly APIs and higher operational capacity is the way forward.

## The Hard Requirements of the AI Era

When we founded Neon four years ago, the core principles laid out in our [_Hello World_](https://neon.com/blog/hello-world) post were aimed at helping human developers move faster. As luck would have it, the AI era has shifted those exact principles into the "hard requirements" column:

- **Low entry cost:** When code generation is free and instant, even a $5 upfront infrastructure cost is a non-starter.
- **Branching:** Code has always had isolated environments, but the data stack lacked them. This created a massive gap in the ability to experiment safely.
- **Serverless:** Infrastructure should live automatically in the background, scaling instantly to meet shifting usage demands. A backend shouldn't be t-shirt sized; it should precisely match what the application demands of it.

Human developers make mistakes (_cue the Matrix meme: "Only human"_). But AI coding agents make mistakes at a blistering, automated velocity that traditional infrastructure simply wasn't designed to handle. Without strict guardrails, agents will tear down systems just as quickly as they build them.

## An Agentic Stack Built by Systems Engineers

Neon's serverless Postgres branching changed how developers work by ensuring every single database change could be validated in an isolated environment. At this point, we start tens of millions of branches every day.
Now, we’re taking the same copy-on-write, instant branching approach and applying it to the full suite of backend primitives today's agent stack requires.

### The Complete Agent-Native Backend

- **Postgres Database** — ✅ _Available_
- [**Authentication**](https://neon.com/docs/auth/overview) — ✅ _Available_
- [**Data API**](https://neon.com/docs/data-api/overview) — ✅ _Available_
- **Object Storage** — 🔜 _Coming Soon_
- **Compute** — 🔜 _Coming Soon_
- **AI Gateway** — 🔜 _Coming Soon_

## Scaling with Enterprise Muscle

One year after joining Databricks, the benefits are showing on both sides. [Lakebase](https://www.databricks.com/product/lakebase), the same technology as Neon on Databricks, is the fastest-growing new offering in Databricks history. In turn, being part of a larger company has helped us grow our database team with world-class engineers, [improve platform performance](https://neon.com/blog/turning-off-fpw-for-faster-writes), [lower costs](https://neon.com/blog/major-compute-price-reduction-on-neon), and now ship mature, battle-tested products to developers on Neon:

The AI Gateway for example already handles more than 125 trillion tokens a month, hardened by rigorous enterprise requirements for day-0 model coverage, high availability, deep metrics, logging, and granular cost controls.

To be clear: **We are not shifting focus away from our core database product.** Postgres remains the bedrock for everything we do. The Neon team has aggressively expanded within Databricks, and we've hired top-tier, senior engineering talent from other major database services. We are expanding our platform by building entirely new, dedicated teams while simultaneously growing our core Postgres engineering powerhouse.

We're building the boring infrastructure layer. Go build sci-fi.

---

## FAQ

### Does this mean you're focusing less on database?

No. The same storage and compute technology powers both Neon Serverless Postgres and Databricks Lakebase, so every improvement to the core engine benefits both products. Lakebase serves large enterprise customers; Neon serves startups, agent platforms and individual developers. Both are growing, and that growth funds a bigger systems engineering team, not a smaller one.Today, around 120 engineers work across storage, compute, proxy, and Postgres itself, including upstream contributions. The new primitives (auth, object storage, compute, AI gateway) are built by new, dedicated teams. We're adding to the platform, not redirecting from it. To accelerate progress of the core database platform, we’ve brought in senior engineering talent from other major database and cloud services over the past year. The Postgres team is the largest it's ever been.

### Are you building an entire cloud platform?

No. We're focused on the primitives that apps and agents need to function: database, authentication, data API, object storage, compute, and an AI gateway. These are the pieces where branching, instant provisioning, and scale-to-zero matter most. For everything else, you'll still want the tools you already use. Front-end hosting (Vercel, Netlify), email (Resend), error tracking (Sentry), and so on. We're not trying to replace them.

### Why AI Gateway?

The lines are starting to blur between applications and agents, but regardless of what we call them, the lifeblood of what everyone is building today is inference - we're bringing reliable/scalable inference directly to you when you build your backend in Neon.

We're not building this from scratch. Databricks already operates an AI gateway that handles trillions of requests a day for everyone from fortune 500 enterprises to popular coding agents, with day-0 coverage of new models, rate limiting, logging, metrics, and cost controls.

### When will the new primitives be available?

Authentication and the Data API are available today. Object Storage, Compute, and the AI Gateway are coming soon.

### Will existing Neon projects need to change?

No. Your existing databases, branches, and connections keep working exactly as they do now. The new primitives are additive. Adopt the ones you need, ignore the ones you don't.
