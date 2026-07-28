---
title: 'Building the Future of On-Call: Why Velocity Moved from RDS to Neon'
description: 'Unlocking multi-cloud support, autoscaling, and branching'
excerpt: >-
  “We used RDS before, but the cost and manual effort of scaling it up and down
  was a pain. I also wanted one database solution across clouds—and Neon gave us
  that” (Tal Kain, Founder and CEO at Velocity) When production goes sideways at
  2 a.m., the last thing an engineer wants is...
date: '2025-04-01T00:36:28'
updatedOn: '2025-04-10T14:59:20'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/velocity-future-on-call/social.png
  alt: null
isFeatured: true
seo:
  title: 'Building the Future of On-Call: Why Velocity Moved from RDS to Neon - Neon'
  description: >-
    Velocity is building an AI-powered Production Engineer to help software
    teams investigate and resolve incidents faster. Powered by Neon.
  keywords: []
  noindex: false
  ogTitle: 'Building the Future of On-Call: Why Velocity Moved from RDS to Neon - Neon'
  ogDescription: >-
    Velocity is building an AI-powered Production Engineer to help software
    teams investigate and resolve incidents faster. Powered by Neon.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/velocity-future-on-call/social.png
---

<blockquote>
<p><strong>“We used RDS before, but the cost and manual effort of scaling it up and down was a pain. I also wanted one database solution across clouds—and Neon gave us that”</strong> (<a href="https://x.com/talkain">Tal Kain</a>, Founder and CEO at <a href="https://velocity.tech/">Velocity</a>)</p>
</blockquote>

When production goes sideways at 2 a.m., the last thing an engineer wants is to fumble through dashboards and logs just to figure out what went wrong. Traditional incident response is slow, fragmented, and reactive. **That’s why [Velocity](https://velocity.tech/) is building an AI-powered production engineer**—to help software teams investigate and resolve incidents faster, even before anyone is paged.

<figure>
<a href="https://velocity.tech/">
<img src="https://cdn.neonapi.io/public/images/pages/blog/velocity-future-on-call/screenshot-2025-04-01-at-72742percente2percent80percentafam-722x1024-03e816e4.png" alt="Post image" />
</a>
<figcaption>Visit <a href="https://velocity.tech/">velocity.tech</a> for more</figcaption>
</figure>

Velocity’s mission is to reduce MTTR (Mean Time to Resolution) by replacing manual, reactive workflows with intelligent automation. Their product uses an agentic AI workflow to surface relevant evidence, correlate alerts, and guide developers toward the root cause of production issues.

<Admonition type="comingSoon" title="get a demo">
Velocity is actively working with design partners as they prepare for public launch. If you’re interested in seeing a demo and providing feedback, you can reach out to their team [here](https://velocity.tech/#demo).
</Admonition>

## Why Velocity Switched from AWS RDS to Neon

### Easier scalability across clouds

For a fast-moving startup like Velocity, flexibility, scalability, and simplicity are non-negotiable. As they built out their platform, they needed a multi-cloud database solution that could support customers on both AWS and Azure, without the overhead of managing separate database instances for each cloud.

They started on RDS, and it worked fine. But scaling meant manual provisioning, over-allocating resources to handle peak loads, and setting up separate configurations when onboarding customers. Switching to Neon’s serverless, multi-cloud architecture solved all of these issues, allowing Velocity to scale effortlessly without having to provision or manage dedicated infrastructure per cloud.

As they progressed on their Neon journey, Velocity discovered more unexpected benefits:

### Faster development workflows

Keeping development environments in sync with production is a challenge that most teams experience. The traditional way to handle this is to set up local instances, manage migrations manually, and constantly keep an eye on things to ensure staging and dev environments reflect the latest schema. Neon’s [branching model](https://neon.tech/flow) flips this on its head.

Instead of copying production data or spinning up entirely separate databases, [Neon lets developers instantly create branches](https://neon.tech/blog/instantly-copy-tb-size-datasets-the-magic-of-copy-on-write)—lightweight, copy-on-write database clones. These branches can be used to test schema changes, debug issues, or validate migrations without risking production data.

<blockquote>
<p><strong>“We use Neon branching in our development process to find issues, test migrations, and experiment safely. We create dev branches, test changes, and delete them when we’re done. It makes development faster and cleaner” </strong>(<a href="https://x.com/talkain">Tal Kain</a>, Founder and CEO at <a href="https://velocity.tech/">Velocity</a>)</p>
</blockquote>

Velocity has woven branching into several core workflows:

- **Local environments:** Developers spin up a branch off the main dev database to test features locally. No need to run a Postgres instance on their machine.
- **Testing migrations safely**: Before running migrations in production, the team creates branches from prod to test the impact and ensure nothing breaks.
- **Ephemeral environments**: Dev branches are regularly deleted and re-created, giving developers a clean slate for testing and ensuring environments stay up to date without drift.

### Reliable support when it matters most

For a platform that operates 24/7, fast and reliable support is critical. When an incident hits, Velocity needs to be confident that their database provider can respond as quickly as they do.

<blockquote>
<p><strong>“Neon’s support team feels like an extension of our own. When we had a scaling issue in production, they solved it in minutes. That kind of support makes a huge difference.” </strong>(<a href="https://x.com/talkain">Tal Kain</a>, Founder and CEO at <a href="https://velocity.tech/">Velocity</a>)</p>
</blockquote>

At Neon, we’re deeply invested in the success of our customers. Unlike AWS, [which can charge thousands of dollars a month for direct, production-grade support,](https://aws.amazon.com/premiumsupport/plans/?refid=16a2aedd-176e-4181-8eb7-130b80669e78) we give you immediate access to real support engineers. When something goes wrong, we’re hands-on, jumping in to troubleshoot.

### Experimenting with pgvector for embeddings

Velocity isn’t just handling traditional relational workloads on Neon: they’re also experimenting with vector search as part of their AI-powered incident response platform. By using [pgvector](https://neon.tech/docs/extensions/pgvector) on Neon, they can store and query embeddings directly alongside structured data, simplifying their architecture. Rather than relying on a patchwork of specialized databases, Velocity aims to consolidate its data stack—why use many databases when there’s a solution (Postgres) capable of handling everything?

<blockquote>
<p><strong>“We’ve started using pgvector on Neon for embeddings, and so far, performance has been great. We tried other solutions that couldn’t scale with us, but Neon handled it smoothly”</strong> (<a href="https://x.com/talkain">Tal Kain</a>, Founder and CEO at <a href="https://velocity.tech/">Velocity</a>)</p>
</blockquote>

### Observability without the headaches

<blockquote>
<p><strong>“With Neon, we can see exactly how connections behave and diagnose issues quickly. It’s been great to test and optimize performance as we grow”</strong> (<a href="https://x.com/talkain">Tal Kain</a>, Founder and CEO at <a href="https://velocity.tech/">Velocity</a>) </p>
</blockquote>

Lastly, Velocity needed a clear, real-time view of database performance to diagnose issues and optimize query performance. Neon provides built-in observability straight in the console, allowing Velocity to track query performance and optimize workloads efficiently across clouds.

## Powering the Next Generation of AI-Driven Platforms

Velocity’s mission is to build an AI Production Engineer – they need a database that matches their speed, flexibility, and cloud-agnostic approach. With Neon, they get

- Multi-cloud support – A single database solution across AWS and Azure
- Transparent scalability – Effortless scaling with real-time database insights
- Branching – For faster and safer development workflows
- Vector search with pgvector – To build embeddings in the same database
- And reliable support – A team that helps them move fast and stay online

If you haven’t tried Neon yet, [get started with our Free plan](https://console.neon.tech/signup), and scale progressively from there.

---

[See a demo of Velocity](https://velocity.tech/#demo) to learn how they’re building the future of on-call.

And [follow them on LinkedIn](https://www.linkedin.com/company/velocity-tech/) to stay in the loop!
