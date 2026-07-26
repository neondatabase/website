---
title: Comigo.ai is using Neon to transform ADHD support with AI
description: >-
  Thanks to Neon, Comigo can focus less on their database more on building their
  app
excerpt: >-
  “With Neon, we can start small and scale up. We don’t have to think about some
  level of operational stuff. That’s awesome.” Paul Dlug, CTO of Comigo.ai
  Comigo.ai is a digital companion and coach for individuals with ADHD. The app
  leverages LLMs to offer support traditionally give...
date: '2024-08-02T17:02:50'
updatedOn: '2024-08-02T17:02:53'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/comigo-ai-is-using-neon-to-transform-adhd-support-with-ai/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Comigo.ai is using Neon to transform ADHD support with AI - Neon
  description: >-
    Neon allows startups like Comigo.ai to build and scale quickly while
    dedicating minimal time and resources to managing Postgres.
  keywords: []
  noindex: false
  ogTitle: Comigo.ai is using Neon to transform ADHD support with AI - Neon
  ogDescription: >-
    Neon allows startups like Comigo.ai to build and scale quickly while
    dedicating minimal time and resources to managing Postgres.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/comigo-ai-is-using-neon-to-transform-adhd-support-with-ai/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/comigo-ai-is-using-neon-to-transform-adhd-support-with-ai/neon-comigoai-1024x576-ce4d9bb7.jpg)

<blockquote>
<p>“With Neon, we can start small and scale up. We don’t have to think about some level of operational stuff. That’s awesome.”  </p>
<cite>Paul Dlug, CTO of Comigo.ai</cite>
</blockquote>

[Comigo.ai](https://www.comigo.ai/) is a digital companion and coach for individuals with ADHD. The app leverages LLMs to offer support traditionally given by a body double—someone who helps individuals with ADHD stay focused and productive. It addresses the unique needs of people with ADHD, which are personalized productivity and therapeutic support, reducing the cognitive load to help people get into the right mind space to be productive, something absent in other apps aimed at those with ADHD.

![Image](https://cdn.neonapi.io/public/images/pages/blog/comigo-ai-is-using-neon-to-transform-adhd-support-with-ai/ad4nxcnfrhjabspnplh9utxs-cxe5dclf-uled9uzb3lta-pvtu1h6wu1yppy2ogd4hwbu9acc09z37ojrunqponaqozr4gqrydfhi5p0t7cuz2tcwkqm1zvtag9m54roikkgs7npezk5casqibizrpmbgta-eeaa4e81.png)

## The next generation of ADHD support

<blockquote>
<p>“We’ve built Comigo to be an effective companion for people with ADHD, such as myself. Neon helps us focus a bit less on tech and more on directly achieving product market fit.” </p>
<cite>Jason Curry, CEO at Comigo.ai</cite>
</blockquote>

The Comigo app combines multiple proven techniques within a single platform, ensuring 24/7 accessibility for everyone:

- **AI-powered body doubling**. Comigo acts as a virtual [body double](https://add.org/the-body-double/), a practice where an individual with ADHD works alongside another person to stay focused and productive. You now have a virtual companion giving you real-time support and reminders to stay on task.
- **Therapy on-the-go.** The app incorporates empirically supported therapeutic exercises, including Cognitive Behavioral Therapy (CBT), Dialectical Behavioral Therapy (DBT), and Acceptance and Commitment Therapy (ACT). The AI guides users through these exercises, helping them manage their thoughts, feelings, and behaviors effectively—offering a form of digital therapy that mimics the support traditionally provided by a human therapist.
- **Personalized task management**. Comigo also acts as an executive function coach, helping users with day-to-day organization, planning, and self-regulation. The app includes a tool that assists users in organizing and prioritizing their tasks, breaking down large tasks into manageable chunks and providing time estimates based on the user’s activity patterns.

## The overhead of building on Cloud SQL for PostgreSQL

<blockquote>
<p>“In GCP, we had to constantly think about provisioning new instances and migrating data, which added operational overhead.”</p>
<cite>Paul Dlug, CTO at Comigo.ai</cite>
</blockquote>

When they first built Comigo, the team initially managed their database using Cloud SQL for PostgreSQL. But managing this setup involved many manual processes that were time-consuming and prone to errors. The prospect of scaling their infrastructure to meet increasing demands without overloading the team was becoming a major concern.

## Offloading the DB management to Neon

When Comigo tried [Neon](https://neon.tech/), they realized they’d found what they were looking for. Neon is a serverless Postgres platform built to enable developers to ship faster without babysitting their database.

Due to its unique architecture, Neon is much simpler to maintain than other Postgres solutions. Instead of provisioning CPU / memory / storage upfront, [Neon autoscales resources automatically in response to load.](https://neon.tech/docs/introduction/autoscaling) It’s also developer-friendly in nature, with an lo API-first feel and [integrations](https://neon.tech/docs/guides/integrations) with all the popular frameworks, tools, and ORMs. Even [small teams can manage thousands of Postgres databases](https://neon.tech/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases) on Neon.

## The magic of database branching

<blockquote>
<p>“Neon branching is a big win for us. We can create full data copies at zero cost. For example, we can script a fresh branch every night for our staging server or for each deploy to run integration tests, all without additional costs.” </p>
<cite>Paul Dlug, CTO at Comigo.ai</cite>
</blockquote>

But one of the most unique advantages of Neon is its [branching](https://neon.tech/docs/introduction/branching) capability. Neon allows you to “branch” your databases in order to create instant copies of data and schema via copy-and-write which feel similar to how Git branches code.

This enables teams like Comigo to adopt [database branching workflows](https://neon.tech/flow) for their deployment and testing pipelines. Comigo uses branching for:

- **Efficiently managing development environments.** Branching allows the creation of full database copies at zero cost. For example, a script can be written to create a fresh branch every night for the staging server, ensuring the development site always has an up-to-date copy of the data.
- **Improving CI/CD processes.** Each deploy can have a fresh copy of the data, enabling integration tests to run on current data without additional costs. This means CI/CD pipelines can spin up a fresh copy of the production data, run data checks, execute scripts, and perform necessary actions without incurring extra costs, paying only for the data used.
- **Reproducing bugs easily.** Bugs can be isolated and reproduced safely without impacting the production environment. Branches off the production database can be created, allowing developers to write data and troubleshoot issues efficiently. This eliminates the need to refresh the staging database, saving significant time and effort.

## Get started with Neon (it’s free!)

If Comigo’s story has sparked your curiosity, [create a Neon account](https://console.neon.tech/signup). You can use the Free Plan to get a sneak peek into the platform without even adding your credit card. And to learn more about Comigo.ai, check out their website—[you can also try it for free.](https://app.comigo.ai/)
