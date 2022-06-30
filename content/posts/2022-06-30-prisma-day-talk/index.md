---
title: 'Showcase of Neon Branching to Run Prisma Migrations on Postgres'
description: 'presention at Prisma Day 2022'
author: 'Nikita Shamgunov'
---

In this presentation we demonstrate our focus on developer experience (DevX) at Neon. You will learn about Neon architecture of separation of storage and compute, how it allows for serverless Postgres, and the unique ability of Neon to create database branches.

We put it all together in a demo with Neon, Vercel, Prisma, and GitHub actions to run migrations. As part of a migration, we create a database branch in Neon and a migration inside the branch without impacting the production database. Only if this succeeds we proceed to run the migration in the production branch.

We are working with the Prisma team to productize the demo and make it a standard way of using Prisma and Neon.


<iframe width="560" height="315" src="https://www.youtube.com/embed/h0VuXnCuQN4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
