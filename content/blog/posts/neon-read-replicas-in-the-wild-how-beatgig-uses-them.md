---
title: 'Neon Read Replicas in The Wild: How BeatGig Uses Them'
description: Grant read-only access to data without impacting production
excerpt: >-
  “One of the big selling points of Neon was creating read replicas in seconds
  that scale to zero. We frequently spin up dev servers and sandbox
  environments, so providing easy, read-only access to the team while keeping
  maintenance low was a big win for us” (Jeremy Berman, CTO at...
date: '2024-10-24T15:47:36'
updatedOn: '2024-10-24T15:47:37'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-read-replicas-in-the-wild-how-beatgig-uses-them/cover.jpg
  alt: null
isFeatured: false
seo:
  title: 'Neon Read Replicas in The Wild: How BeatGig Uses Them - Neon'
  description: >-
    After testing many Postgres providers, the team at BeatGig chose Neon for
    its superior DX, ease of use, and (drumroll) read replicas.
  keywords: []
  noindex: false
  ogTitle: 'Neon Read Replicas in The Wild: How BeatGig Uses Them - Neon'
  ogDescription: >-
    After testing many Postgres providers, the team at BeatGig chose Neon for
    its superior DX, ease of use, and (drumroll) read replicas.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-read-replicas-in-the-wild-how-beatgig-uses-them/social.jpg
---

<img
  src="https://cdn.neonapi.io/public/images/pages/blog/neon-read-replicas-in-the-wild-how-beatgig-uses-them/neon-replicas-in-the-wild-1-62672594.jpg"
  alt="Post image"
  width="1024"
  height="576"
/>

<blockquote>
<p><strong>“One of the big selling points of Neon was creating read replicas in seconds that scale to zero. We frequently spin up dev servers and sandbox environments, so providing easy, read-only access to the team while keeping maintenance low was a big win for us”</strong> <em>(Jeremy Berman, CTO at BeatGig)</em></p>
</blockquote>

[BeatGig](https://beatgig.com/) is a marketplace that connects artists, managers, and agents with venues and other buyers of talent. BeatGig streamlines the talent booking process by delivering greater access, faster deals, automated payments, and trusted transactions.

<p>
<img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXf08J0zZx26OaKvX0vXIqgIigHzRzxnHUI14ZQopqFzFydtR4UhVso8MYCBSJiBeAR6XmdZQsRz6Dp4bdOfZOB4-GdaMO3wTqerpnJ4QbhCKzK4NKkOIcWpdtrgpKTubX3ZWXM_EK_fCUXUgGeOOz91vIOh?key=4zGBptrY6mpUQ17T-uyaBw" alt="" width="293" height="517" />
</p>

## Why BeatGig uses Neon

BeatGig chose Neon after testing many different SQL providers, and here’s why:

**Developer experience**:<br />Among all the solutions the team tested—including Supabase, Google Cloud SQL, RDS, and Aurora—Neon stood out for its fast provisioning, query speed, and [native connection pooling](https://neon.tech/docs/connect/connection-pooling), which streamlined their workflow.

**Ease of use**:<br />Onboarding engineers who aren’t Postgres or DevOps experts is much easier with Neon. Provisioning is instantaneous and maintenance is minimal: every database BeatGig runs uses [autoscaling](https://neon.tech/docs/introduction/auto-suspend), and non-prod databases and replicas have [autosuspend](https://neon.tech/docs/introduction/auto-suspend) enabled. This reduces the need for manual server maintenance.

**Read replicas**:<br />Neon’s read replicas were the icing on the cake. BeatGig frequently runs business intelligence and analytics, and with read replicas, non-SQL-expert team members could run queries through tools like Metabase without risking the core operations of the app.

More about read replicas in this next section:

## Using read replicas as safe, read-only access points

<blockquote>
<p><strong>“Our team members use Metabase frequently, but many aren’t SQL experts, so they sometimes write inefficient queries that could mess up the database. To avoid any issues, we create read replicas with their own connection string, so they can run queries without affecting anything”</strong> <em>(Jeremy Berman, CTO at BeatGig)</em></p>
</blockquote>

Neon’s [read replicas](https://neon.tech/docs/introduction/read-replicas) are an elegant solution for granting safe, read-only access to your data in a cost-efficient way:

- Replicas can be created and deleted in seconds, providing quick access when needed.
- Your primary compute stays protected from resource-heavy or inefficient queries.
- Neon’s replicas don’t require additional storage and scale to zero when not in use.

Unlike traditional replicas that require duplicating data, Neon’s read replicas share the same storage backend as the primary compute, making them lightweight and quick to deploy. You can create many replicas but only pay for storage once.

You also save on compute: replicas automatically scale to zero when not in use, so you don’t have to worry about them being active for only a few hours. They’re virtually free when not being accessed. This makes them much more usable compared to other read replicas, like those in AWS RDS or Aurora.

<blockquote>
<p><strong>“With Aurora, you can create read replicas, but it takes a while, and the cost is unclear. The scaling process can get odd, with delays. Developers are often waiting minutes for replicas to spin up or trying to delete them—it’s just difficult overall” </strong><em>(Jeremy Berman, CTO at BeatGig)</em></p>
</blockquote>

## Try them out. Now in the Free plan

[We just made read replicas available in the Neon Free Plan](https://neon.tech/blog/create-read-replicas-in-the-free-plan), so you can give them a spin for free. [Create a Neon account](https://console.neon.tech/signup), run some tests, and if you have any questions, [find us on Discord.](https://discord.gg/92vNTzKDGp)
