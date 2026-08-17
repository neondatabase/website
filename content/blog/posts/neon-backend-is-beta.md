---
title: 'Test out the Neon backend: Object Storage, Functions, and AI Gateway are beta'
description: >-
  Our platform is expanding
excerpt: >-
  Storage, Functions, and AI Gateway are now in beta and available to all users:
  object storage that branches with your data, long-running compute that lives
  next to your database, and one API with one bill for seven model providers
  backed by Databricks. Let your agent deploy a full Neon backend by declaring
  it in a single neon.ts file and running neon deploy.
date: '2026-07-15T12:00:00'
updatedOn: '2026-07-15T12:00:00'
category: product
categories:
  - product
authors:
  - bryan-clark
cover:
  image: https://cdn.neonapi.io/public/images/pages/blog/neon-backend-is-beta/neon-backend-beta.jpg
  alt: null
isFeatured: true
seo:
  title: 'Test out the Neon backend: Object Storage, Functions, and AI Gateway are beta - Neon'
  description: >-
    Our platform is expanding
  keywords: []
  noindex: false
  ogTitle: 'Test out the Neon backend: Object Storage, Functions, and AI Gateway are beta - Neon'
  ogDescription: >-
    Storage, Functions, and AI Gateway are now in beta and available to all
    users. Deploy a full Neon backend by declaring it in neon.ts and running
    neon deploy.
  image: https://cdn.neonapi.io/public/images/pages/blog/neon-backend-is-beta/neon-backend-beta.jpg
---

![Neon backend products now in beta](https://cdn.neonapi.io/public/images/pages/blog/neon-backend-is-beta/neon-backend-beta.jpg)

**Storage, Functions, and AI Gateway are now in beta and available to all users: object storage that branches with your data, long-running compute that lives next to your database, and one API with one bill for seven model providers backed by Databricks. Let your agent deploy a full Neon backend by declaring it in a single `neon.ts` file and running `neon deploy`.**

[In June, we announced we were building a suite of backend tools around the database](https://neon.com/blog/were-building-backends) — tools that agents also need to deploy full backends autonomously. After scaling and refining them in private preview, we're ready to open them up as beta for everyone to try!

## Why we're building backends

[Back in 2022](https://neon.com/blog/architecture-decisions-in-neon), we made an architectural bet on Postgres: separate compute from storage, and rebuild storage to make database environments lightweight and branchable. We were responding to what developers needed at the time — a database that matched the level of speed and automation they were finding in all their other tooling. But it turned out that architecture wasn't just good for fast-moving developers: [it was also exactly what agents needed](https://www.linkedin.com/posts/nikitashamgunov_heres-the-story-on-how-we-accidentally-created-activity-7242909460304699393-6mr2/). Serverless economics for infrastructure that never sleeps, and disposability for workflows that spin up and tear down environments dozens of times a day.

A database is the central piece of the backend, but not the whole picture. When your coding agent builds an app for you, it deploys a database — and then it needs somewhere to store file uploads, it adds a webhook to notify users when that file's processed, calls an LLM to summarize the upload, and so on. We've been working with companies using and building agents since the start, and we've realized this experience improves exponentially if all tools work within the same platform as the database — if the entire backend understands the same semantics and shares branching and scale to zero. Agents deploy better apps this way, the developer behind the agent wins in convenience, and new features are unlocked along the way.

This is the concept of "backend" we're building — not a set of products bundled together but a suite with the database as its center and where everything runs close to each other and tightly integrated.

<figure>
<video autoPlay muted loop playsInline width="704" height="528" aria-label="Neon's branchable backend services">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/neon-backend-is-beta/services-scheme.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/videos/pages/blog/neon-backend-is-beta/services-scheme.mp4" type="video/mp4" />
</video>
</figure>

## New on Neon: Storage, Compute, AI Gateway (beta)

When you [sign up to Neon](https://console.neon.tech/signup) you now get access to a full backend, not just a database:

- [**Managed Better Auth**](https://neon.com/docs/auth/overview): Authentication built on Better Auth, running on your branch.
- [**Storage**](https://neon.com/docs/storage/overview) **\[NEW\]**: S3-compatible object storage that branches with your data.
- [**Functions**](https://neon.com/docs/compute/functions/overview) **\[NEW\]**: Long-running functions deployed next to your database.
- [**AI Gateway**](https://neon.com/docs/ai-gateway/overview) **\[NEW\]**: One credential, one bill, seven model providers built for scale.

<Admonition type="note" title="What beta means">

- You can sign up and use the new products directly, no access request needed (also on the free plan*)
- Available on all projects now, not just new ones
- Currently limited to us-east-2, with more regions rolling out progressively
- Usage is free of charge during beta, with rate and usage guardrails in place to prevent abuse
- Pricing isn't public yet; we'll publish it before GA

\*AI gateway is an exception: only available in paid plans by now, as we expand capacity.

</Admonition>

### Neon Storage: files that branch with your data

[Neon Storage](https://neon.com/docs/storage/overview) is S3-compatible object storage that lives on your Neon branch. Buckets are declared in `neon.ts` and branch with your database via copy-on-write. When you create a branch, you get an isolated snapshot of your files alongside your data, with nothing duplicated. It scales to zero like the rest of Neon — no idle cost for buckets you're not using.

**How is this useful:** when you branch your database to create its own environment for tests, development, versioning, and so on, your files now branch with it — you get the entire state vs pointing to a static file in S3. No more test environments that share the same bucket as production, no more code to keep a separate S3 path in sync with a branch. Delete the branch, and the files also go with it — nothing to clean up by hand.

### Neon Functions: long-running compute living next to your database

[Neon Functions](https://neon.com/docs/compute/functions/overview) are long-running Node.js 24 HTTP handlers deployed onto a branch, with DATABASE_URL and all required credentials to use other Neon services injected automatically.

**Why are they useful:** having your functions live on the same stack as the database removes a whole class of glue code — e.g. when you branch your database to create its own environment for tests, development, versioning, and so on, your backend compute branches with it too. The way we built Functions also avoids timeouts for agents and long-running workloads.

[Check out the Get Started docs for all the info.](https://neon.com/docs/compute/functions/get-started)

<Admonition type="note" title="On observability during beta">
[Monitoring and logging](https://neon.com/docs/reference/metrics-logs) are available for Object Storage and Functions during beta, with a 3-day retention period on log data.
</Admonition>

### Neon AI Gateway: One API, six model providers

[Neon AI Gateway](https://neon.com/docs/ai-gateway/overview) is built on Databricks AI infrastructure, giving you one credential and one endpoint for OpenAI, Gemini, Grok, Meta, and more models scoped to your branch. A single endpoint covers every model, while native routes preserve provider-specific features like reasoning modes and prompt caching.

**Why is this useful:** instead of setting up separate accounts, keys, and billing for every lab, you get one credential and one bill for all of them. You're running on the Databricks infrastructure that's already serving more than 145 trillion tokens a month, and because it's part of the same platform as your database, everything branches the same way — e.g. AI calls from a preview branch stay isolated from production without any extra setup.

[Check out the Get Started docs for all the info.](https://neon.com/docs/ai-gateway/get-started)

## Try the Neon platform

Our Postgres database stays at the core, but we're expanding into a platform — building the suite of services that agents need to build apps autonomously and at scale. You can try the full backend for free: deploy it via `neon.ts` and `neon deploy` ([see the neon.ts guide](https://neon.com/blog/introducing-neon-ts)) and tell us about your experience [on Discord](https://discord.com/invite/MXNy77qBf4).

---

## FAQ

### What is the "Neon backend"?

Neon is expanding from serverless Postgres into a full suite of products: Postgres database, Managed Better Auth, Object Storage, Functions, and AI Gateway. We're building these to support the experience of agents: when an agent builds an app, we want it to deploy a full backend on Neon, not just a database — with every piece sharing the same branching, scale-to-zero, and disposability semantics Neon already gives you for Postgres.

### Why is Neon building a backend?

A database alone isn't enough for how apps get built today. When a coding agent builds an app, it doesn't just need a database — it also needs a bunch of other services that interact with it. If the agent wires those up as separate services, the backend never reaches its full potential: those services don't share Neon's serverless nature, its branchability, its speed, and so on. We're building our own backend, running close to the database, to give the coding agent (and the developer behind it) the full experience we want them to have.

### Is Neon abandoning Postgres or becoming a different kind of company?

No. Postgres stays at the center of everything Neon does and the database is still our core product. Managed Better Auth, Object Storage, Functions, and AI Gateway are tools that run alongside the database and share its architecture. They don't replace or de-prioritize Postgres.

### Does the Neon backend replace tools like Vercel or Netlify?

No. Neon doesn't host frontends, static sites, or full apps. Vercel and Netlify remain the right place for that.

### Does the Neon backend replace tools like S3 or a model provider's API directly?

For the parts that touch your database, yes:

- Object Storage is a drop-in alternative to wiring up an external S3 bucket by hand, with the main advantage being that it branches with your data.
- AI Gateway is a drop-in alternative to calling multiple labs' APIs separately, with the main advantage being that you get one credential and one bill instead of managing several.

### Are Object Storage, Functions, and AI Gateway ready to use in production?

These tools just achieved beta, meaning that they are not yet feature-complete. They're usable and we encourage trying them, but several service-level guardrails (rate limits, usage limits, full monitoring) are still being finalized. If you're evaluating them for a production workload, expect to hit gaps and please tell us about them. We're opening beta specifically to get real usage and feedback before locking things down.

### Which projects and regions have access during beta?

All Neon projects in the us-east-2 region only. More regions will roll out progressively after beta.

### Which plans have access?

Object Storage and Functions are available on all plans, including Free. AI Gateway is available on Launch and Scale plans only (paid plans), with no difference in AI Gateway pricing or model access between the two.

### Does using these products cost anything during beta?

No. Usage is free of charge for all three products during beta, but we've put rate and usage guardrails in place to prevent abuse. Public pricing will be announced before GA.

### Does Neon mark up model provider prices on AI Gateway?

No. Neon will charge the same per-token rate as the underlying model provider. We won't add any margin on top of published provider prices for supported models.
