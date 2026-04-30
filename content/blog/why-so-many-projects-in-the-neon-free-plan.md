---
title: Why So Many Projects in the Neon Free Plan?
description: We’re giving developers more room to build
excerpt: >-
  Over the past few weeks, you might’ve noticed something in our changelog:
  we’ve been steadily increasing the number of projects included in Neon’s Free
  Plan. Why are we doing this? Why now? We’ve reached two significant milestones
  that have allowed us to do this: We could have ch...
date: '2025-11-26T18:08:15'
updatedOn: '2026-03-13T16:03:09'
category: company
categories:
  - company
authors:
  - brad-van-vugt
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/why-so-many-projects-in-the-neon-free-plan/cover.jpg
  alt: Neon Free Plan
isFeatured: true
seo:
  title: Why So Many Projects in the Neon Free Plan? - Neon
  description: >-
    We’ve been steadily increasing the number of projects included in our Free
    Plan to give developers more room to build.
  keywords: []
  noindex: false
  ogTitle: Why So Many Projects in the Neon Free Plan? - Neon
  ogDescription: >-
    We’ve been steadily increasing the number of projects included in our Free
    Plan to give developers more room to build.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/why-so-many-projects-in-the-neon-free-plan/cover.jpg
source:
  wpId: 11664
  wpSlug: why-so-many-projects-in-the-neon-free-plan
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/why-so-many-projects-in-the-neon-free-plan/neon-free-plan-1024x538-5a61aafc.jpg)

Over the past few weeks, you might’ve noticed something in our [changelog](https://neon.com/docs/changelog): we’ve been steadily increasing the number of projects included in Neon’s Free Plan.

## Why are we doing this? Why now?

We’ve reached two significant milestones that have allowed us to do this:

- First, our infrastructure efficiency continues to scale. This is because our [architecture separates storage and compute](https://neon.com/blog/architecture-decisions-in-neon), and the platform optimizations we’re able to achieve as a result.
- Second, [we’re now a Databricks company.](https://neon.com/blog/neon-and-databricks) As part of the integration, we’ve started running Neon on Databricks’ global infrastructure, which directly translates into lower operating costs.

We could have chosen to turn these efficiency gains into larger margins and profit, but that’s not in our DNA. Instead, we’re on a mission to deliver even more value to customers and developers, with two strategic goals in mind:

1. **Make Neon’s pricing the most competitive in the industry.** We’ve already moved to [fully usage-based plans](https://neon.com/blog/new-usage-based-pricing), removed fixed fees, [eliminated add-ons](https://neon.com/blog/why-we-no-longer-lock-premium-features), and [significantly reduced compute and storage prices](https://neon.com/blog/major-compute-price-reduction-on-nehttps://neon.com/blog/major-compute-price-reduction-on-neon). And there’s still more work to do here.<br />
2. **Make our Free plan genuinely useful, not just a trial offering in a freemium model.** It doesn’t matter if you’re building side projects, prototypes, small apps, or just exploring ideas, we want Neon’s Free plan to actually support you.

## The vision behind our Free Plan

At a high level, our long-term goal is simple: **we want Neon to be the default Postgres provider for developers.** The same way you create a GitHub repo every time you start a project, we want you to reach for Neon every time you need Postgres.

To make that possible, the Free plan has to feel spacious, capable, and it needs to support the reality of how developers actually work (lots of small projects, lots of exploration, enough resources to test, build, and see what works). **If Neon is going to be the place where your ideas start, then we need to give developers room for** **_lots_** **of ideas.**

The end result is a win-win, for developers and for us:

- Developers get an incredible Postgres environment that is both powerful and spacious, for every project they have;<br />
- In turn, Neon becomes a home base for all things Postgres. If all projects start on Neon, it’s natural (we hope) to continue using Neon when one of those projects takes off.

## How can we afford this long-term?

**This is made possible by Neon’s architecture**. This is not about “being generous” or simply absorbing the cost – we can offer an expanded Free plan because of how Neon is _built_.

If every free project required us to run a dedicated Postgres instance, we couldn’t do this. Or if we had to offer incredibly small slices of compute (e.g. 1/16 CPUs), then our Free plan would be spacious, but unusable.

We can avoid both of those traps because our architecture is fundamentally different:

1. [Compute and storage are fully separated](https://neon.com/blog/architecture-decisions-in-neon).
2. When a database isn’t being used, [compute costs drop to zero](https://neon.com/docs/introduction/scale-to-zero) – not only for the end-user but for us as well.
3. This ephemerality combines well with [autoscaling](https://neon.com/docs/introduction/autoscaling): we don’t have to cap CPU capacity so much. Most free projects sit idle most of the time (just like most GitHub repos are not active 24/7) and when you’re not running anything, Neon isn’t running anything either. Scaling up temporarily (even to 1-2 CPUs) doesn’t change that math.
4. Object storage is the source of truth. Data lives in a [modular storage system](https://neon.com/docs/introduction/architecture-overview) in Neon in which small volumes are incredibly cheap to maintain.

Put simply, the Neon platform is very good at running millions of projects with incredible efficiency.

## The end result, and next steps

We believe you should never run out of projects on the Free plan. If you want to spin up five ideas in a week, great. If you want to prototype something at midnight on a Saturday, go for it. If you want to use Neon as your dev environment, fantastic. We want to make Neon the place you go to every time you need Postgres, no matter what for.

If you’re patiently hoping for expansions in other limits or in the paid plans, yes, those are coming too. In the meantime, we’d love to hear your suggestions – tell us on [Discord](https://discord.gg/92vNTzKDGp) or X.
