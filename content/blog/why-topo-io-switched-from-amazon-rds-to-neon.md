---
title: Why Topo.io Switched From Amazon RDS to Neon
description: >-
  Database branching helps the whole team work in parallel with up-to-date
  production data
excerpt: >-
  The killer feature that convinced us to use Neon was branching: it keeps our
  engineering velocity high. Léonard Henriquez, co-founder and CTO, Topo.io The
  team at Topo.io is building the next generation of AI-powered sales assistant,
  so you can let the virtual SDR find you the ri...
date: '2024-02-01T17:57:54'
updatedOn: '2024-12-24T18:15:22'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/why-topo-io-switched-from-amazon-rds-to-neon/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Why Topo.io Switched From Amazon RDS to Neon - Neon
  description: >-
    Compared to Amazon RDS, Neon improves their developer experience and
    engineering velocity—especially thanks to database branching.
  keywords: []
  noindex: false
  ogTitle: Why Topo.io Switched From Amazon RDS to Neon - Neon
  ogDescription: >-
    Compared to Amazon RDS, Neon improves their developer experience and
    engineering velocity—especially thanks to database branching.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/why-topo-io-switched-from-amazon-rds-to-neon/social.jpg
source:
  wpId: 4436
  wpSlug: why-topo-io-switched-from-amazon-rds-to-neon
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/why-topo-io-switched-from-amazon-rds-to-neon/neon-topoio-case-study-1-1024x576-31212ea6.jpg)

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p><em>The killer feature that convinced us to use Neon was branching: it keeps our engineering velocity high</em>.</p><p></p>
<cite>Léonard Henriquez, co-founder and CTO, Topo.io</cite>
</blockquote>

The team at Topo.io is building the next generation of [AI-powered sales assistant](https://www.topo.io), so you can let the virtual SDR find you the right leads, craft custom messaging specifically for them, and book you meetings. To build the premium user experience they were aiming for, Topo.io needed to back its architecture with the right database—a path that would eventually lead them to Neon.

## Database goals: flexibility backed by a robust architecture

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p><em>From the beginning, we wanted to do something scalable, so we needed to have a really clean and robust architecture while still being able to iterate fast and have a high velocity.</em></p>
<cite>Léonard Henriquez, co-founder and CTO, Topo.io</cite>
</blockquote>

With a decade of experience working with different types of databases, Leo knew that Postgres would offer them a combination of advantages that’s hard to match. Postgres is a flexible database that (with a bit of config magic) becomes suitable for a wide range of use cases, especially considering [all the Postgres extensions available](https://neon.tech/docs/extensions/pg-extensions).

## The problem with Amazon RDS

Initially, the team at Topo.io decided to use Amazon RDS to run Postgres. RDS worked well in terms of operating their production database, but, like many other developers working with RDS, Leo and his team ran into limitations integrating it into their development workflows. [RDS gets hard to manage.](https://neon.tech/blog/frictionless-development-experience-with-neon-branching)

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p><em>When we were using RDS, we had trouble keeping the same environment on my computer, my developer’s environment, and production. It was definitely not good for data consistency.</em></p>
<cite><em>Léonard Henriquez, co-founder and CTO, Topo.io</em></cite>
</blockquote>

RDS workflow challenges came up again when replicating issues that arose in production in a dev environment, making the debugging process unnecessarily time-consuming for the Topo.io devs.

This is a common story. Application developers are used to maximizing productivity by relying on team collaboration and continuous development and testing, but when the application you’re building is backed by RDS, your development workflow gets interrupted:

- **You need multiple instances.** In RDS, you will have to maintain multiple instances to allow for isolated `prod` and `dev` environments. Most likely, you will need more than one `dev` instance to allow for multiple team members to work on features in parallel without causing issues, and you will have to figure out staging as well.
- **You start spending more time managing RDS and less time coding.** This database fleet needs to be maintained—e.g. the `dev` instances need to stay updated with a configuration and data that mirrors the production database. Sooner than later, maintaining your database fleet eats up more engineering time.
- **Your bill is higher than expected**. Every instance you’re creating in RDS comes with its own copy of the production data and its own compute, multiplying your bill.

RDS is a reliable service, but its architecture does not map well to how products are built today. When Leo and his team realized this, they started looking for a Postgres alternative that handled production operation and the development lifecycle equally well—and that’s how they found Neon.

## Enabling CI/CD in Postgres with Neon branching

Neon’s serverless Postgres was a perfect fit for Topo.io’s needs, with [branching](https://neon.tech/branching) being the game-changer.

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p><em>With branching, we can test with actual data and spot and fix errors easily. Since every engineer can work on an individual branch that mirrors production, we can collaboratively develop, test, and debug in a synchronized manner.</em></p>
<cite><em>Léonard Henriquez, co-founder and CTO, Topo.io</em></cite>
</blockquote>

### How branching improves the Postgres experience

In Neon, [you can branch your Postgres database](https://neon.tech/blog/database-branching-for-postgres-with-neon) to enable parallel development and testing without impacting the production environment, just as you already do with your application code. This improves the development experience in many ways:

- **Your production and development environments stay consistent (without extra work).** After switching to Neon, every developer at Topo.io could get an isolated development environment with up-to-date production data in seconds.
- **You can test against actual data.** Working with branches makes it easy to have a real-world testing scenario, which helps identify and solve issues that might not be evident when using synthetic test data.
- **Schema migrations are safe and automated.** Database migrations might work flawlessly in a local environment but fail in production due to differences in data or configuration. Thanks to branching, Topo.io can test migrations in an environment that closely mimics production, ensuring smooth updates to the database schema while automating the process using Prisma. (More about this later in the article.)

### The branching playbook

Implementing database branching might seem like an innovative thing to do (and it is!) but in reality, the flow it’s quite intuitive to implement. Working with database branches in Neon resembles the Git process you’re already familiar with—for example, this is how Topo.io does it:

- **One branch per developer.** Each developer at Topo.io creates a branch from the main database, providing them with an isolated environment to work on features or fixes. This setup allows for parallel development without interfering with the main production database or the work of other team members.
- **Branches as `dev` environments.** By branching off the main database, developers immediately have a development environment available, with production data. The Topo.io engineers use these environments to build new features.
- **Branches as staging environments.** Before applying changes to the production database, Topo.io tests them on a branched database that acts as the staging environment. Shortly, they’ll be also implementing [preview environments](https://neon.tech/blog/branching-with-preview-environments) using branching.
- **Automating with GitHub actions.** Topo.io integrates all of this within its CI/CD pipeline. [They use GitHub Actions to create branches automatically](https://neon.tech/docs/guides/branching-github-actions) fo testing schema migrations, ensuring that these changes are validated in a controlled environment before being deployed.
- **Refreshing branches with Branch Reset.** [Branch Reset](https://neon.tech/blog/announcing-branch-reset) is a favorite of Topo.io, a feature that allows them to quickly reset any branch they’re using for development to the state of the main branch. “I use Branch Reset at least once a day”, Leo told us. This feature streamlines the process of keeping branches up-to-date with the latest changes in the production environment, something that’s non-trivial to do in databases like RDS.

## Easier rollback migrations in Prisma

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p><em>Something that was complicated about using Prisma migration with other databases before we went with Neon is that we couldn’t go back to a previous schema version without resetting the database. For instance, when you’re in an dev environment where there’s data and you run a migration, you can’t go back. One of the reasons why Neon is awesome with Prisma is that you don’t have this problem anymore.</em></p>
<cite><em>Léonard Henriquez, co-founder and CTO, Topo.io</em></cite>
</blockquote>

Topo.io’s tech stack is centered around TypeScript, with Node.js in the backend and Next.js on the frontend. Topo.io maintains both its frontend and backend codebases in a single monorepo, which allows for the seamless integration of shared resources, types, and interfaces across both frontend and backend.

[For interacting with Neon, Topo.io uses Prisma](https://neon.tech/docs/guides/prisma), an open-source database toolkit and ORM that harmonizes beautifully with TypeScript. Prisma simplifies building and executing queries against Neon and it facilitates schema migrations via [Prisma Migrate](https://neon.tech/blog/prisma-day-talk), streamlining the process of evolving the database schema over time.

Handling migrations with Prisma is another scenario where branches are particularly useful. [Doing “down” migrations is not a seamless experience in Prisma,](https://www.prisma.io/docs/orm/prisma-migrate/workflows/generating-down-migrations#how-to-generate-and-run-down-migrations) but this is made easier with branches. When using branching, if migration does not perform as expected, it’s easy to revert to the previous state without affecting the main database.

## Wrap up

Neon’s serverless, branchable Postgres allows Topo.io to iterate fast without compromising reliability. [To experience database branching first-hand, sign up for Neon’s free tier and start building right away (no credit card required).](https://console.neon.tech/realms/prod-realm/protocol/openid-connect/registrations?client_id=neon-console&redirect_uri=https%3A%2F%2Fconsole.neon.tech%2Fauth%2Fkeycloak%2Fcallback&response_type=code&scope=openid+profile+email&state=usCgWlb0j1uCv7_jlcfH6g%3D%3D%2C%2C%2C)

<Admonition type="tip" title="Neon vs RDS: FAQ">
If you're interested in a detailed comparison of Neon vs RDS, check out [neon.tech/rds](https://neon.tech/rds).
</Admonition>
