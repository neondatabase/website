---
title: 'Electrifying Neon: Building the Realtime Backend'
description: What's next for realtime on Postgres
excerpt: >-
  Now that we've announced GA for Neon's complete backend, one of the things
  we're most excited about coming next is adding realtime to the Neon platform.
  Not least because it's being worked on by the team from Electric, who recently
  joined Neon at Databricks.
date: '2026-09-24T12:00:00'
updatedOn: '2026-09-24T01:15:00.000Z'
category: product
categories:
  - product
authors:
  - andre-landgraf
cover:
  image: null
  alt: null
isFeatured: false
seo:
  title: 'Electrifying Neon: Building the Realtime Backend - Neon'
  description: What's next for realtime on Postgres
  keywords: []
  noindex: false
  ogTitle: 'Electrifying Neon: Building the Realtime Backend - Neon'
  ogDescription: What's next for realtime on Postgres
  image: null
---

**Now that we've [announced GA for Neon's complete backend](https://neon.com/blog/neon-backend-is-ga), one of the things we're most excited about coming next is adding realtime to the Neon platform.** Not least because it's being worked on by the team from [Electric](https://electric.ax/blog/2026/08/11/electric-joining-databricks), who [recently joined Neon at Databricks](https://neon.com/blog/electric-joins-neon).

This team spent years working on realtime data sync on top of Postgres and I'm super excited by what they're planning to build now they're part of Neon. So, I grabbed Electric co-founder [James Arthur](https://linkedin.com/in/thruflo) to find out more: why they really joined Databricks, what they're working on now and what it means for the Neon platform.

<blockquote>
<p><strong>“Sync is a backend primitive. Rather than building a product around it, it should speak the same semantics as the rest of your tooling”</strong></p>
</blockquote>

**Quick question first: what's surprised you most since joining — the size of Databricks, the amount of Slack, or how many people have opinions about Postgres?**

Yeah, I had no real idea what it would be like joining such a big company. I think the main surprise has been just how strong of an engineering culture it is. I've not had a boss for a long time but I can't really argue when my boss just happens to have built AWS Aurora.

**We've all read [the official announcement](https://neon.com/blog/electric-joins-neon). What's the real story of how Electric ended up joining Neon at Databricks?**

The playbook for devtools and infra startups has changed a lot in the last couple of years. When we started, there was more room for specialist infra tools. More moat, more reason to buy rather than build. Now, the market is really squeezed and agents are looking for higher-level abstractions.

What we came to realise at Electric is that sync is a feature of a backend-as-a-service platform. Rather than trying to build a platform business around sync, it's best for sync to supercharge an existing platform that already has a business model.

**What was the hardest part of the decision? And what made you trust Databricks with the team, the tech and the community?**

Our aim at Electric was always to mainstream sync. The challenge was going through the gears of adoption and commercial distribution.

Neon has huge reach and growth with developers. Databricks has a huge distribution base, growth and commercial operation with large enterprises.

The more we thought about it, the more we realised that building inside Neon and Databricks would just massively accelerate our route to mainstreaming the tech.

<blockquote>
<p><strong>“The hard truth about realtime today is that it often fails in production. There is still no general-purpose sync engine on Postgres that works for mainstream apps and agents”</strong></p>
</blockquote>

**So, what are you working on then?**

We're doing what you'd expect: building realtime into Neon. Our goal is for Neon to have the best realtime, sync and end-to-end reactivity on the market.

**OK, go on, what does that mean? What's the problem with realtime that you're solving and what does it mean for Neon to have the best realtime in the market?**

The thing about realtime is it demos well but tends to fall over in production. There's a fundamental tension between the expressiveness of what you can sync and the performance of the system. That's why today, despite sync having been explored for decades, there is still no general purpose sync engine on top of Postgres that actually works for mainstream application and agentic system development.

We are solving this. We are taking all our expertise from academic research and all our experience building and evolving Electric over the last five years and we are packing it into a next-generation realtime built natively into Neon. I can't tell you yet exactly how it works but I can say that it's going to be the best realtime sync service out there and it's going to work natively with Neon and Lakebase including native support for scale-to-zero and branching.

**Neon's recently announced GA for it's backend platform. How does your work on realtime fit into Neon's strategy to build a complete backend around Postgres?**

Modern apps and agents need realtime data and end-to-end reactivity. CTOs, tech leads, coding agents, they all know this. So, when you're choosing a backend stack, you typically want to know at least that you can have realtime as part of it. Even if you're not using it right away.

By adding realtime to Neon, we're rounding out the backend platform and taking away any last reason not to choose it. And the way we're doing it aims to not just add realtime to Neon but to make it the best in the market. So developers and coding agents actively choose Neon as the best backend platform for realtime reactivity.

**We'll have a lot more to share on realtime in Neon soon.** In the meantime, if you're interested in following developments, or getting early access as an alpha or beta tester, join us in the [platform channel in the Neon Discord](https://discord.gg/MXNy77qBf4) and we'd love to connect and chat there.
