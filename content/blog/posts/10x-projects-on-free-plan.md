---
title: '10x-ing our Free Plan: Everyone Gets Ten Projects'
description: 'You asked for a second project, so we gave you ten.'
excerpt: "Lots of you told us it would be nice to have more projects. Starting today (10/10 \U0001F609), everyone on the Free Plan can now create up to ten projects. You can create up to 10 branches on each Free Plan Project. Account-level limits on compute hours, storage, and bandwidth remain unc..."
date: '2024-10-10T15:10:51'
updatedOn: '2024-10-10T15:10:54'
category: company
categories:
  - company
authors:
  - nikita-shamgunov
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/10x-projects-on-free-plan/cover.jpg
  alt: null
isFeatured: false
seo:
  title: '10x-ing our Free Plan: Everyone Gets Ten Projects - Neon'
  description: 'You asked for a second project, so we gave you ten.'
  keywords: []
  noindex: false
  ogTitle: '10x-ing our Free Plan: Everyone Gets Ten Projects - Neon'
  ogDescription: "Lots of you told us it would be nice to have more projects. Starting today (10/10 \U0001F609), everyone on the Free Plan can now create up to ten projects. You can create up to 10 branches on each Free Plan Project. Account-level limits on compute hours, storage, and bandwidth remain unchanged. We’re confident that only […]"
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/10x-projects-on-free-plan/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/10x-projects-on-free-plan/neon-10-projects-1-1024x576-db211228.jpg)

Lots of you told us it would be nice to have more projects. Starting today (10/10 😉), **everyone on the Free Plan can now create up to ten projects.**

<Admonition type="note">
See [Neon Free Plan Documentation](https://neon.tech/docs/introduction/plans#free-plan) for all details.
</Admonition>

You can create up to 10 branches on each Free Plan Project. Account-level limits on compute hours, storage, and bandwidth remain unchanged. We’re confident that only increasing the Project limit will lead to a nice quality-of-life boost amongst Free Plan users because when we look at resource usage, it is stratified:

- At any point in time, the majority of Free Projects are using less than 100MB of storage and not actively using compute (thanks to [scale-to-zero](https://neon.tech/blog/why-you-want-a-database-that-scales-to-zero).)
- Free Projects that are maxing out resources are the ones powering an app or business that is taking off – the owner is happy to upgrade to a paid plan for access to larger computes, increased data retention, and support.<br />

So if we can increase the Project limit and make it easier for you to learn a new stack, [try Azure](https://neon.tech/blog/first-azure-region-available-in-neon), launch an AI-powered IDE, ship an MVP, we see it as a win.

## Engineering Unlock, not Financial Risk

A couple high-profile shutdowns this year led many developers to question the financial viability of database free tiers. But Neon is built differently in a way that changes the equation.

Free tier economics can be boiled down to two variables: **Cost** (_of infrastructure_) in, **benefit** (_of paying customers who chose you in part because of the accessibility of the free tier_) out.

Everyone assumes cost is constant and focuses on increasing the benefit side. When they can’t move it enough they give up and say “Database Free Plans don’t work!” It doesn’t take a genius to figure out: If you can’t change the benefit variable, **change cost.**

So that’s what we did! Because of separation of storage and compute, and because of scale to zero, the minimum cost to run a single database on Neon is a fraction of what it is on other architectures.

## Neon: 0.01x-ing Database costs from day one

This isn’t a new idea, it was written into the [founding manifesto of Neon](https://neon.tech/blog/hello-world):

<blockquote>
<p>We realized that a modern Postgres service can be designed differently in order to be cheaper and more efficient in cloud environments, but it will require some real systems engineering. We call this approach separation of storage and compute. It allows us to architect the service around performance, reliability, manageability, and cost. Cost is particularly important when you design a system for the cloud. Any cloud service has an infrastructure bill that it has to pass on to the end user. If you don’t account for cost at the architecture level running a service can get very expensive. That’s why when you build for the cloud you have to make the cost of running the service an important design consideration on par with manageability, reliability, and performance. One of the immediate implications of designing for cost was to never use EBS volumes and use a combination of local storage and S3 instead. Local storage for hot and S3 for cold data.</p>
</blockquote>

The impact of a step-function reduction in the entry cost of databases goes well beyond free tiers:<br />

- Companies like [Retool use Neon to operate fleets](https://neon.tech/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases) of hundreds of thousands of separate databases for each of their customers.
- AI Platforms like [Replit Agent use Neon](https://x.com/nikitabase/status/1837138637516931252) to put database provisioning in the hands of AI Agents.

None of this would be possible in the bygone era of databases running on statically provisioned CPU, RAM and Storage.

So go ahead–build that app you’ve been thinking about. If it doesn’t take off you can always build another.\*

\*Up to ten times.
