---
title: Bringing Postgres to Bunnyshell with Neon
description: >-
  Learn how Bunnyshell, an Environments-as-a-Service platform, added support for
  Neon Postgres.
excerpt: >-
  Bunnyshell is a cloud-first developer platform that enables teams to
  effortlessly create on-demand environments for development, as well as
  ephemeral environments for staging and QA. Their platform enables engineering
  teams to focus on building core product features rather than s...
date: '2023-03-30T13:38:29'
updatedOn: '2025-10-14T06:30:36'
category: case-study
categories:
  - case-study
authors:
  - nikita-shamgunov
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-bunnyshell-integration/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Bringing Postgres to Bunnyshell with Neon - Neon
  description: >-
    Learn how Bunnyshell, an Environments-as-a-Service platform, added support
    for Neon Postgres.
  keywords: []
  noindex: false
  ogTitle: Bringing Postgres to Bunnyshell with Neon - Neon
  ogDescription: >-
    Learn how Bunnyshell, an Environments-as-a-Service platform, added support
    for Neon Postgres.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-bunnyshell-integration/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-bunnyshell-integration/neon-bunnyshell-1024x538-df99fad7.png)

Bunnyshell is a cloud-first developer platform that enables teams to effortlessly create on-demand environments for development, as well as ephemeral environments for staging and QA. Their platform enables engineering teams to focus on building core product features rather than spend time maintaining local environments and infrastructure.

Remote development in cloud environments enables engineers to run production-like services and dependencies for the applications they are working on. This eliminates environment-related inconsistencies and allows for comprehensive dev-testing early in the process. As a result, the feedback loop is shortened, and developer productivity is increased.

The Bunnyshell team recently shipped a [Neon connector](https://documentation.bunnyshell.com/docs/connectors-neon-database) enabling users to provision a Neon Postgres instance for all of their environments.

The fact that the Postgres databases are already populated with the data you need for your environment and the near-instant provisioning time made Neon the top choice for short-lived environments, which get created often.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-bunnyshell-integration/books-with-neon-1024x583-ddf92815.gif)

## Why Bunnyshell chose Neon

For newly-provisioned environments to be production-like, it is important for them to have realistic data. Traditional solutions for database seeding often take a considerable amount of time, negatively impacting developer productivity.

Neon’s branching feature is a scalable solution for instantly providing isolated, production-like databases, making it a perfect fit for ephemeral environments. Another added benefit is that since Neon Postgres instances can automatically scale up or down based on demand, you do not need to worry about overprovisioning resources.

<blockquote>
<p><em>The fact that the Postgres databases are already populated with the data you need for your environment and the near-instant provisioning time made Neon the top choice for short-lived environments, which get created often.</em></p>
<cite><em>Sorin Dumitrescu, VP of Engineering at Bunnyshell</em></cite>
</blockquote>

## Final Thoughts

We are thrilled about Bunnyshell integrating Neon into their Environment-as-a-Service platform, and we can’t wait to see how they will keep evolving in the near future.
