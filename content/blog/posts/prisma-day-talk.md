---
title: Showcase of Neon Branching to Run Prisma Migrations on Postgres
description: Presentation at Prisma Day 2022
excerpt: >-
  In this presentation we demonstrate our focus on developer experience (DevX)
  at Neon. You will learn about Neon architecture of separation of storage and
  compute, how it allows for serverless Postgres, and the unique ability of Neon
  to create database branches. We put it all toge...
date: '2022-06-30T11:39:00'
updatedOn: '2023-08-21T16:06:22'
category: community
categories:
  - community
authors:
  - nikita-shamgunov
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/prisma-day-talk/cover.jpg'
  alt: null
isFeatured: false
seo:
  title: Showcase of Neon Branching to Run Prisma Migrations on Postgres - Neon
  description: Presentation at Prisma Day 2022
  keywords: []
  noindex: false
  ogTitle: Showcase of Neon Branching to Run Prisma Migrations on Postgres - Neon
  ogDescription: >-
    In this presentation we demonstrate our focus on developer experience (DevX)
    at Neon. You will learn about Neon architecture of separation of storage and
    compute, how it allows for serverless Postgres, and the unique ability of
    Neon to create database branches. We put it all together in a demo with
    Neon, Vercel, Prisma, and GitHub […]
  image: 'https://cdn.neonapi.io/public/images/pages/blog/prisma-day-talk/social.jpg'
---

In this presentation we demonstrate our focus on developer experience (DevX) at Neon. You will learn about Neon architecture of separation of storage and compute, how it allows for serverless Postgres, and the unique ability of Neon to create database branches.

We put it all together in a demo with Neon, Vercel, Prisma, and GitHub actions to run migrations. As part of a migration, we create a database branch in Neon and a migration inside the branch without impacting the production database. Only if this succeeds we proceed to run the migration in the production branch.

We are working with the Prisma team to productize the demo and make it a standard way of using Prisma and Neon.

<YoutubeIframe embedId="h0VuXnCuQN4" isDocPost={false} />
