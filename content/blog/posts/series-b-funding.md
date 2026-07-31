---
title: We Raised another $46M – What’s Next?
description: Neon raises $46 Million to advance Serverless Postgres in the Cloud
excerpt: >-
  For anyone that has been paying attention, the 30M and now 46M funding rounds
  for Neon seems like an awful lot of money for a two year old company of just
  over 50 people. Funding is great and we are great believers in “raise it when
  you can not when you have to” but as […]
date: '2023-08-02T15:35:55'
updatedOn: '2024-04-19T17:49:52'
category: company
categories:
  - company
authors:
  - nikita-shamgunov
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/series-b-funding/social.png'
  alt: null
isFeatured: false
seo:
  title: We Raised another $46M - What’s Next? - Neon
  description: Neon raises $46 Million to advance serverless Postgres in the Cloud
  keywords: []
  noindex: false
  ogTitle: We Raised another $46M - What’s Next? - Neon
  ogDescription: Neon raises $46 Million to advance serverless Postgres in the Cloud
  image: 'https://cdn.neonapi.io/public/images/pages/blog/series-b-funding/social.png'
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/series-b-funding/neon-funding2x-ae693076.jpg)

For anyone that has been paying attention, the [30M](https://techcrunch.com/2022/07/26/neon-nabs-30m-to-build-a-scalable-cloud-service-for-postgres-databases/) and now [46M](https://venturebeat.com/data-infrastructure/neon-raises-46-million-to-advance-serverless-postgresql-database-for-the-ai-era/) funding rounds for Neon seems like an awful lot of money for a two year old company of just over 50 people. Funding is great and we are great believers in “raise it when you can not when you have to” but as our board member [Joe Morrissey](https://www.linkedin.com/in/morrisseyjoe/) always taught me to ask “Why anyone? Why us? Why now?”

## Why Anyone?

The why anyone question in the context of databases is easiest to answer. If you are building a modern application then you need four pieces of infrastructure to succeed.

1. **A Database**: Store and query data at scale and grow as your user base grows. Work with all the tools. Run in all the clouds.
2. **A Search engine**: Search is the cornerstone of modern self serve applications. No one reads the manual.
3. **APIs**: REST APIs, SQL, RPC, JSON, GraphQL. You name it, you are going to need it as you grow.
4. **Mobile Access**: The mobile device is how we engage daily with technology. If your app isn’t mobile aware and can’t take advantage of the 12 – 20 sensors on a modern mobile device you are dead to rights.

Of course, there will be other technologies you will need to be successful in your particular domain, but absolutely everyone needs these four pieces of core infrastructure. While you can survive for a while without search, data-access and mobile, from day one everyone has to have a database.

In the world of databases there is one that was there at the start, and is still the number one in the Open Source world, [Postgres](https://www.postgresql.org/). Mature, stable, flexible, loved by developers world wide and depended on to run the most important workloads. Its the only database technology that all the hyperscalers agree on. Don’t take my word for it though, look at [Stack Overflow](https://survey.stackoverflow.co/2023/#databases) or [DB-engines](https://db-engines.com/en/ranking_trend/relational+dbms) for concrete proof. Postgres is the winner.

Even though Postgres is great, nobody wants to run their own database in the cloud. This has opened up the market for a company who can deliver Postgres as the backbone for a complete set of infrastructure required to deliver modern applications.

## Why us?

If Postgres is the winner and all the hyperscalers have voted with their feet what’s the issue? Surely everyone can just pick their favorite hyperscaler and thats it? Well no. For all four of the key infrastructure offerings the hyperscaler solution may not be the right answer.

Once you have decided to be in the cloud there is a serious decision to be made about how committed you are to one or other hyperscaler. The Windows crowd tend to land in Azure, the Linux crowd gravitates towards Amazon and those two cohorts are not clearly defined which leaves plenty of room for the third hyperscaler, Google. MongoDB has shown us that it is possible to build a multi-billion dollar business and yet still stand apart from the major cloud vendors. But large as the MongoDB business is, it represents a tiny fraction of the total available workloads currently running on Relational databases. However, the bulk of new relational workloads are not migrating to MongoDB. They are migrating to Postgres.

So Neon’s plan is to become the default for Postgres in the cloud. Here is how we plan to do it, and knowing our plans, it will still be difficult for the major cloud vendors to compete. While they have to be in every market, we only need to be in one, Serverless Postgres in the Cloud. The simplicity of our offering has already been noticed by our Partners. Vercel, Replit, Hasura and others appreciate a provider who has tuned its offering to support their users workload needs.

With our focus on the very thin edge of innovation around Serverless, Edge Functions and Vector Search we play the Innovator dilemmas card perfectly. We are outengineering them in innovation pockets that currently look too small in their eyes to warrant significant investment. As those areas catch on we slowly catch up in the required capabilities to leap across the chasm into their enterprise home turf.

## Why Now?

The jury is in and Postgres is the winner. The refrain from Oracle customers is “get me off this vendor”. MySQL lost its mojo after Oracle acquired it and SQLServer is strictly for Microsoft zealots with very deep infrastructure budgets. For the rest of us there is the most stable, most functional open-source relational database ever written. When it counts Open-Source still rules.

Neon is not here to teach you how to use Postgres, nor are we here to convince you to move to the cloud or stop using your favorite &lt;insert exotic database variety&gt; brand of database. But if you are using Postgres in the cloud today and you want [Serverless](https://neon.tech/blog/sub-10ms-postgres-queries-for-vercel-edge-functions) and [Vector search](https://neon.tech/blog/pg-embedding-extension-for-vector-search) in one tidy bundle or you want to distribute Postgres as part of your platform, Neon is the answer.

Our goal is to become the database of choice for the modern developer cloud. Integrated in every cloud, supported by every tool and platform vendor and the OEM of choice for people who want to embed and/or resell Postgres.

## 📚 Continue reading

- **[Neon is Generally Available:](https://neon.tech/blog/neon-ga)** we’re bringing serverless Postgres to every developer, simplifying developer workflows and database operations for companies across the board.
- **[Expanding the Neon Partner Program:](https://neon.tech/blog/expanding-our-partner-program)** if you’re building a developer platform, you can offer managed Postgres to your users powered by Neon.
- **[How are companies using Neon:](https://neon.tech/case-studies)** explore our Case Studies to learn first-hand why others are choosing Neon. (Hint: it’s because of serverless and autoscaling, easier developer workflows due to copy-on-write branching, and Neon’s suitability for one-database-per-tenant architectures).
