---
title: How 222 uses Neon to handle their frequent spikes in demand
description: Neon scales their database automatically when traffic increases
excerpt: >-
  “Our database traffic peaks at nights and on weekends when thousands of our
  members are attending experiences. Building on a database that preemptively
  autoscales allows us to regularly handle these traffic spikes.” Lex Nasser,
  Founding Engineer at 222 Life in a tech-enabled worl...
date: '2024-06-25T17:23:21'
updatedOn: '2024-06-25T17:23:24'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-222-uses-neon-to-handle-their-frequent-spikes-in-demand/cover.jpg
  alt: null
isFeatured: false
seo:
  title: How 222 uses Neon to handle their frequent spikes in demand - Neon
  description: >-
    Thanks to autoscaling, their compute scales up and down dynamically in
    response to load. No manual work, no overpaying.
  keywords: []
  noindex: false
  ogTitle: How 222 uses Neon to handle their frequent spikes in demand - Neon
  ogDescription: >-
    Thanks to autoscaling, their compute scales up and down dynamically in
    response to load. No manual work, no overpaying.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-222-uses-neon-to-handle-their-frequent-spikes-in-demand/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-222-uses-neon-to-handle-their-frequent-spikes-in-demand/neon-222place-2-1024x576-617649d9.jpg)

<blockquote>
<p>“<strong>Our database traffic peaks at nights and on weekends when thousands of our members are attending experiences. Building on a database that preemptively autoscales allows us to regularly handle these traffic spikes</strong>.” </p>
<cite>Lex Nasser, Founding Engineer at 222</cite>
</blockquote>

Life in a tech-enabled world has become perfectly convenient, but we have to admit that it can also get isolating. Getting through an entire workday of meetings from your couch, with two meals hand-delivered by a Postmates driver, is just a step away from WALL-E. Sometimes, you feel like getting out of the house and actually meeting people, but occasions that enable casual encounters are becoming exceedingly rare.

The team at [222](https://222.place/) (YC W23) is building a fun platform to fix this. They organize social events in a completely original way: occasionally, members receive curated invites to experiences in their city. Imagine getting an invite for puppy yoga in the park on a Saturday afternoon, or a dinner and ceramics class after work on a Tuesday. 222 takes care of inviting other members who are compatible with your interests, so you can share the experience with them.

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-222-uses-neon-to-handle-their-frequent-spikes-in-demand/screenshot-2024-06-21-at-65239percente2percent80percentafpm-b9f11ddd.png)

To make this happen, 222 has had to build out systems to enable members to RSVP (either alone, with a +1, or in groups), guide them through their experience in real-time, and gather high-fidelity follow-up data to refine their members’ curation preferences. These are already quite a few product requirements to maintain, and they’re a small team: the last thing they want is to put any more time than necessary into their database… Which led them to Neon.

## Scaling their backend: From Airtable to Postgres

222 started as a project run entirely by SMS. Experience invitations were sent via text messages, and responses were managed the same way. This backend was powered by Airtable, which was a low-lift and convenient option for the project at that stage.

Once 222 started growing, it became clear that the team had to find a proper relational database, especially as they prepared for the launch of their iOS app. They began exploring various options:

- Considering their small team size, self-hosting was ruled out—any time spent on database maintenance was time taken away from product iteration.
- Once the team decided to use a managed database, they first considered Planetscale, but preferred Postgres over MySQL, specifically due to its support for user-defined data types and materialized views.
- The choice then narrowed down to Neon and Supabase. The team spun up experimental databases on both platforms to compare their functionality.
- In the end, Neon stood out for its unique serverless features, which proved especially handy—particularly its robust autoscaling and copy-on-write branching.

Let’s dig a bit deeper into why these Neon features were so beneficial:

## The benefits of Neon for applications with variable access pattern

<blockquote>
<p><strong>“Neon autoscaling kicks in when we have bursts of traffic. When we launched our iOS app in February, we charted on the App Store; Neon’s managed database experience made it effortless to handle this traffic.”</strong></p>
<cite>Lex Nasser, Founding Engineer at 222</cite>
</blockquote>

222 experiences mostly occur on weekends or evenings, meaning that their database encounters particularly high traffic regularly in concentrated timeframes. What really saves them time and gives their team confidence is a database that can scale down during off-peak times, and scale up to manage their influxes of usage during these experiences.

When traffic spikes, which also happens when experience invites are sent out, Neon scales database resources automatically; when traffic slows down, Neon’s resources scale back down. All without a second glance from the engineering team.

## Using database branching for schema migrations

<blockquote>
<p><strong>“Branching is an invaluable feature for us. Knowing that we’re not going to ruin the database when iterating on our abstractions gives us peace of mind and lets us move so much faster.”</strong></p>
<cite>Lex Nasser, Founding Engineer at 222</cite>
</blockquote>

Another favorite feature of the 222 team is Neon’s branching. In Neon, you can instantly create database branches that include data and schema; [this is immensely useful for setting up development and test environments.](https://neon.tech/flow)

222’s engineering team has built out tooling to routinely spin up database branches for various testing purposes, such as schema migrations. This tooling, built on Neon’s REST API and the open-source [Goose](https://github.com/pressly/goose) library, allows the team to run schema migrations on an exact copy of their production database without touching their production data. They can validate their migrations in both the up-and down-directions, seeing the exact schema changes in a sandboxed environment.

This process significantly reduces the anxiety of potentially running a bad query that could disrupt the database, especially when making comprehensive changes to their data models. And, although they haven’t needed to use it yet:), if something goes wrong, Neon’s [point-in-time restore](https://neon.tech/blog/point-in-time-recovery-in-postgres) can be used to instantaneously revert bad actions.

## Simplify your Postgres experience: give Neon a go

<blockquote>
<p><strong>“Neon takes care of the small things that one can miss when you have a small team looking to ship fast. Even trivialities, like requiring database connections to use SSL, are all built-in by default. This allows us to focus on what we want to focus on, which is improving our product, and let the database stuff handle itself.”</strong></p>
<cite>Lex Nasser, Founding Engineer at 222</cite>
</blockquote>

**Running Postgres in production doesn’t have to be that hard**. Test it yourself: it takes 2 seconds to get started in Neon – [create a Free account and start exploring the platform](https://console.neon.tech/signup).

At the moment, 222 curates experiences for members in Los Angeles and New York City. Apply to become a member at [222.place](https://222.place/?utm_source=neon) _✨_
