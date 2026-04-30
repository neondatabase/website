---
title: How Retool uses Retool (and the Neon API) to manage 300K+ Postgres databases
description: Retool manages a massive database fleet with only one engineer
excerpt: >-
  Neon is a serverless Postgres database with a robust API. Partners like Retool
  choose Neon to easily offer managed databases to their end-users, simplifying
  the management of massive database fleets while optimizing costs. Thanks to
  Neon, Retool is able to manage over 300k Postgr...
date: '2024-03-29T18:03:27'
updatedOn: '2026-03-13T15:57:15'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases/cover.jpg
  alt: How Retool manages 300K+ databases
isFeatured: false
seo:
  title: >-
    How Retool uses Retool (and the Neon API) to manage 300K+ Postgres databases
    - Neon
  description: >-
    RetoolDB is powered by Neon, which streamlines the management of massive
    database fleets while keeping costs in check.
  keywords: []
  noindex: false
  ogTitle: >-
    How Retool uses Retool (and the Neon API) to manage 300K+ Postgres databases
    - Neon
  ogDescription: >-
    RetoolDB is powered by Neon, which streamlines the management of massive
    database fleets while keeping costs in check.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases/cover.jpg
source:
  wpId: 5408
  wpSlug: how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases/how-retool-manages-300k-databases-1024x538-c7fa744a.jpg)

**Neon is a serverless Postgres database with a robust API. [Partners](https://neon.tech/partners) like Retool choose Neon to easily offer managed databases to their end-users, simplifying the management of massive database fleets while optimizing costs. Thanks to Neon, Retool is able to manage over 300k Postgres databases with just one engineer!**

The [Retool](https://retool.com/) platform makes it easy for developers to create internal apps for their teams and businesses. Retool handles much of the boilerplate code and UI design automatically, empowering developers to deliver effective business software up to 10x faster.

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases/web-apps-2-b490d24f.gif)

Retool’s drag-and-drop interface allows users to quickly assemble UIs from a set of pre-built components such as tables, buttons, and forms, supporting custom code for the specific functionalities of each app. The platform makes it easy to connect these UI components to nearly any API, streamlining the development process.

This smooth experience empowers teams to build a wide range of internal tools. A few examples of what you can build with Retool:

- [DevOps dashboards:](https://retool.com/templates/dev-ops-dashboard) to visualize and analyze software development, testing, deployment, and monitoring for faster and more efficient software delivery.
- [Inventory management dashboards:](https://retool.com/use-case/inventory-management-dashboard) to stay organized by tracking inventory, including what’s in stock, adding new SKUs, monitoring the status of orders, and placing new orders.
- [Support ticketing systems:](https://retool.com/templates/support-ticketing-system) to manage and track customer support tickets, streamlining the process of addressing and resolving them.

Explore the [Retool templates](https://retool.com/templates) for more.

## Adding a database to the Retool platform

To further improve the user experience, the Retool team decided to [host a database](https://retool.com/products/database) into their platform. This would allow developers to jump straight into building their internal tools, without worrying about having to spin up and manage database instances separately.

To make this happen, the engineers identified some key requirements for the implementation. The objective was to ensure the database integration was not only seamless to the end user, but also operationally sustainable and cost-efficient for the team:

**This system had to be managed with minimal engineering overhead.**

The fleet had to be easily scalable up to hundreds of thousands of databases without a proportional increase in the management burden. The best way to do this was by offering dedicated Postgres URLs to every end user; this isolated design simplifies the management of the database fleet, as it allows to maintain a clear mapping between customers and their respective databases.

**The Retool team wanted to automatically suspend databases that were not in use.**

By suspending idle instances, Retool would reduce the costs associated with running server resources that are not being actively used. This is particularly important for a platform potentially managing a massive number of customer databases with each database on its own instance.

## Hello, RetoolDB (powered by Neon)

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p>“We’ve been able to automate virtually all database management tasks via the Neon API. This saved us a tremendous amount of time and engineering effort. The scale-to-zero functionality of Neon allows us to offer dedicated databases to our customers without worrying about the cost of idle resources”</p>
<cite>Himanshu Bhandoh, Software Engineer at Retool</cite>
</blockquote>

The Retool team ended up partnering with Neon to power [RetoolDB](https://docs.retool.com/data-sources/quickstarts/retool-database). The Neon API allowed Retool to integrate and automate all database management, streamlining workflows and reducing manual work. Retool creates one [Neon project](https://neon.tech/docs/manage/projects#manage-projects-with-the-neon-api) per every end user, each project with one Postgres database.

Due to their serverless nature, Neon databases [scale to zero](https://neon.tech/docs/introduction/auto-suspend) automatically when inactive. This saves Retool the costs of idle instances, which is crucial for managing resources cost-effectively across a large fleet. This streamlined architecture enables Retool to manage **+300,000 database projects** with minimal engineering overhead—the fleet is currently managed by one engineer.

## The beauty of dogfooding: how Retool uses Retool to manage RetoolDB

Retool oversees virtually all database management tasks directly from an internal tool, which they built (of course) using Retool.

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases/screenshot-2024-03-28-at-73756percente2percent80percentafpm-1024x511-7349eb7a.png)

Let’s peek behind the scenes:

- When a new Retool user signs up, they’re automatically assigned a pre-created, unclaimed database from a pool of Neon projects.
- Whenever a database is allocated from the pool, the system seamlessly triggers the creation of a new Neon project, maintaining a consistent supply.
- The backbone of this system is an internal Postgres database that tracks the status of each Neon database (claimed or unclaimed) along with user assignment details.
- The team monitors the entire fleet through a custom dashboard. This not only offers real-time insights but also allows for direct actions, such as adjusting storage quotas for individual databases.

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases/ezgifcom-animated-gif-maker-1024x510-6c2ac64a.gif)

Sometimes, even complex problems can have elegant solutions (and it feels great when they do!). [Start exploring Retoo](https://login.retool.com/auth/signup?source=navbarcta) l and discover how to build your own internal tools that connect to your databases and APIs.

## Offer managed Postgres to your users: partner with Neon

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p>“The support from the Neon team has been great. Whenever we’ve raised issues, we’ve received fast, effective responses. Their dedication to improving their service reassures us that we have a reliable partner in Neon”</p>
<cite>Himanshu Bhandoh, Software Engineer at Retool</cite>
</blockquote>

By partnering with Neon, Retool has been able to incorporate a Postgres offering into their developer platform, reducing time-to-value for their customers. If you’d also like to offer Postgres to your end users, [consider partnering with us](https://neon.tech/partners). Providing your customers with fully managed Postgres has never been easier.
