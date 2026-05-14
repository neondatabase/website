---
title: How Specific Provisions Thousands of Databases for Coding Agents Using Neon
description: Specific.dev is a cloud platform built for coding agents.
excerpt: >-
  “I’m genuinely surprised by how well it handles that scale. You can create
  tons of databases and they’re available immediately. You can branch out
  immediately. All of those things make it really nice for agent-managed infra.”
  Iman Radjavi, Co-founder, Specific.dev What Specific b...
date: '2026-03-18T19:19:23'
updatedOn: '2026-03-27T14:05:17'
category: case-study
categories:
  - case-study
authors:
  - andy-hattemer
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-specific-provisions-thousands-of-databases-for-coding-agents-using-neon/cover.png
  alt: null
isFeatured: false
seo:
  title: >-
    How Specific Provisions Thousands of Databases for Coding Agents Using Neon
    - Neon
  description: Specific.dev is a cloud platform built for coding agents.
  keywords: []
  noindex: false
  ogTitle: >-
    How Specific Provisions Thousands of Databases for Coding Agents Using Neon
    - Neon
  ogDescription: >-
    “I’m genuinely surprised by how well it handles that scale. You can create
    tons of databases and they’re available immediately. You can branch out
    immediately. All of those things make it really nice for agent-managed
    infra.” Iman Radjavi, Co-founder, Specific.dev What Specific builds Specific
    (YC F25) is a cloud platform designed for coding agents. With […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-specific-provisions-thousands-of-databases-for-coding-agents-using-neon/cover.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-specific-provisions-thousands-of-databases-for-coding-agents-using-neon/image-6-1024x538-16243d5e.png)

<blockquote>
<p>“I’m genuinely surprised by how well it handles that scale. You can create tons of databases and they’re available immediately. You can branch out immediately. All of those things make it really nice for agent-managed infra.”</p>
<cite>Iman Radjavi, Co-founder, <a href="https://specific.dev">Specific.dev</a></cite>
</blockquote>

## What Specific builds

[Specific](https://specific.dev/) (YC F25) is a cloud platform designed for coding agents. With Specific, agents write code and configure the infrastructure to run it, from databases and object storage to caching and backend services, all defined in a single config file and deployed with one CLI command.

---

## The problem they are solving

Before building Specific, Iman Radjavi and his co-founder saw the same pattern repeat across developers: they’d start a project with Vercel for the frontend, reach for Supabase when they needed a database, then add Railway for backend workers. Three platforms, none of which knew about each other.

Coding agents made this worse. An agent asked to deploy a frontend would naturally recommend Vercel. Asked to add a database, it would recommend Supabase. Each recommendation was reasonable in isolation; together, they created a fragmented stack that was hard to run locally, hard to debug, and hard to hand off to the next agent in the loop.

The trigger for Specific came from a platform customer: [Natively](https://natively.dev/), a prompt-to-mobile-app builder. Natively’s AI agent was generating mobile app backends for end users. Their previous database provider required maintaining a large block of custom documentation just to get the agent to interact with it correctly, and it still didn’t work reliably. They needed something that worked with their agent from the start, not something retrofitted to work with agents later.

That’s the design constraint Specific was built around: **infrastructure that coding agents can define, provision, and reason about without human intervention at every step.**

---

## Why Neon

When Specific needed a database layer, two things made Neon the obvious choice.

The first was **scale-to-zero**. Every project on Specific’s platform can have a database. Because of how easy and fast creation is, most apps built by agents get abandoned. Paying for idle compute across thousands of databases wasn’t viable. Neon’s serverless architecture scales to zero automatically, keeping costs down without any manual intervention.

The second was **branching**. Specific’s platform model requires isolating each app’s data from the start. Specific uses branching to create instant preview environments that are isolated from the main database. This allows their users to test and make changes with real data but in isolation.

Iman noted that Neon’s agent plan also factored in. For a product built around agent workflows, having a pricing plan designed for that use case mattered.

---

## How they use Neon

When a Specific project needs a database, a new Neon project is provisioned automatically via the Neon API. The user never configures a database connection manually. The coding agent defines the infrastructure it needs in a config file, and Specific wires the Neon database URL into the service as an environment variable. By design, the agent never has direct access to the connection string. Instead, Specific gives the agent the context and guardrails to safely handle deployments and updates.

The local development flow mirrors production. When a developer runs specific dev, Specific spins up the full stack locally, including the database. When they run specific deploy, the same config goes to Specific’s cloud. No port conflicts to sort out, no environment variables to wire by hand.

Preview environments for every pull request use Neon branching to give the user full-stack application previews where data reflects what is in production but changes are isolated.

Specific is now managing over 10,000 Neon databases. New projects provision within a second.

---

## Results

- **Thousands of Neon databases provisioned every month** by specific.dev users.
- Database creation that is fast enough for the agent provisioning workflow, with no manual steps between “user starts a project” and “database is ready”
- Scale-to-zero keeps costs viable for a high volume and wide range of database workloads

Iman’s framing: “I’m always surprised by how easy it is to just create a ton of databases. They’re created immediately. You can branch out immediately.”

---

## What’s next

Specific is in public beta and focused on the self-serve AI engineer experience. The immediate roadmap includes feeding deployed service logs back into the agent context, so users can tell their coding agent that something is behaving poorly and let it investigate without leaving the terminal. Full-stack branching, including object storage alongside databases, is also on the roadmap.

---

If you’re building an agent platform and need a database layer that provisions on demand, scales to zero, and supports branching across thousands of projects, [start with Neon](https://neon.tech/). If you’d like to share your own story, find us on [Discord](https://neon.tech/discord).

Thank you to Iman Radjavi and the Specific team for sharing how they built this.
