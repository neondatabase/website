---
title: 'How Neptune Built a Fast, Serverless Backend with Neon and Vercel'
description: Learn about how Neptune reduced operational complexity with Neon.
excerpt: >-
  Neptune is an AI-powered concierge that helps couples navigate high-stakes
  financial decisions, starting with prenups. Neptune guides couples through an
  emotionally intelligent process that replaces the guesswork and complexity of
  prenups (because most of us are not lawyers) and...
date: '2025-08-13T15:51:15'
updatedOn: '2025-08-13T15:58:17'
category: case-study
categories:
  - case-study
authors:
  - taraneh-dohmer
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neptune-built-a-fast-serverless-backend-with-neon-and-vercel/cover.jpg
  alt: meetneptune.com
isFeatured: false
seo:
  title: 'How Neptune Built a Fast, Serverless Backend with Neon and Vercel - Neon'
  description: >-
    Discover how Neptune, an AI-powered prenup concierge, cut operational
    complexity by migrating from Google Cloud SQL to Neon’s serverless Postgres.
    With instant branching, Vercel integration, and zero downtime, they built a
    faster, safer development workflow for their lean team.
  keywords: []
  noindex: false
  ogTitle: 'How Neptune Built a Fast, Serverless Backend with Neon and Vercel - Neon'
  ogDescription: >-
    Discover how Neptune, an AI-powered prenup concierge, cut operational
    complexity by migrating from Google Cloud SQL to Neon’s serverless Postgres.
    With instant branching, Vercel integration, and zero downtime, they built a
    faster, safer development workflow for their lean team.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neptune-built-a-fast-serverless-backend-with-neon-and-vercel/cover.jpg
---

![meetneptune.com](https://cdn.neonapi.io/public/images/pages/blog/neptune-built-a-fast-serverless-backend-with-neon-and-vercel/neon-neptune-1-1024x576-f349ca89.jpg)

Neptune is an AI-powered concierge that helps couples navigate high-stakes financial decisions, starting with prenups.

Neptune guides couples through an emotionally intelligent process that replaces the guesswork and complexity of prenups (because most of us are not lawyers) and helps couples identify their goals and priorities for their prenuptial agreement. Once couples have discovered their goals and outcomes, Neptune connects them with vetted family lawyers to draft and review the legal document, so they can get back to fretting about important matters like what to name the signature couple’s cocktail.

## The Challenge: Reducing Operational Complexity for Lean Team.

Like every lean startup, Neptune needed to find ways to reduce their manual operational burden complexity.

Currently, Neptune uses a Next.js application written in TypeScript, hosted on Vercel, with Neon as the primary database to enable fast development through a branching model for isolated environments.

## From Google Cloud SQL to Neon: A Smooth Transition

Before Neon, Neptune was using Google Cloud SQL which worked, but meant that they would be responsible for dealing with too many operational tasks that come with hosting a back end. They didn’t want the burden of managing the infrastructure, including machine sizing and compute resources, dealing with performance issues as the dataset grows and handling database reliability and uptime themselves.

<blockquote>
<p><em>“The migration from Google Cloud SQL to Neon took maybe an hour total. It was a PSQL dump and restore. It was smooth and fast, with zero downtime.” – Andy Bonventre CTO at Neptune</em></p>
</blockquote>

Neptune now uses a fully serverless backend streamlining end-to-end testing with Vercel’s preview deployments. Neon’s serveless architecture eliminates the operational overhead.

### Why Serverless Architecture and Branching Matter

Neon’s branching model has become an essential pillar to Neptune’s workflow. They use branching to enable isolated, testable, and easily resettable database environments for each feature branch, streamlining development, ensuring data safety, and accelerating their release cycle without the burden of managing separate infrastructure.

<blockquote>
<p><em>“We wanted to move as fast and as safely as possible—and Neon’s branching model for Postgres lets us do that. It’s just like working with Git: each developer gets their own branch, tests it, and we never have to worry about coordinating test data or stepping on each other’s toes.” – Andy Bonventre CTO at Neptune</em><br></br></p>
</blockquote>

### Real-time Testing and Preview with Neon and Vercel Integration

Developers at Neptune spin up a dedicated Neon branch for each Git feature branch. Branches are then connected to Vercel’s preview deployments, meaning that each feature branch of the app has a matching database instance. This setup allows for isolated, real-time testing of changes without impacting production or requiring a shared staging database.<br />

Neon enables them to do this by creating a one-to-one pairing between a code branch and a database branch. They are then able to to automatically run end-to-end (E2E) tests against the preview deployment and its matching database.

### Focus on Your Product, Not Your Infrastructure with Neon Serverless Postgres

By adopting Neon’s serverless Postgres with branching, Neptune has created a fast, scalable development workflow that lets their lean team focus on product over infrastructure. Tight Vercel integration and isolated database branches enable seamless testing and confident shipping allowing them to deliver the best experiences for guiding couples through high-stakes financial decisions.

<br />And if you’ve recently got engaged yourself and don’t know where to begin on the prenup front, you can head over to [meetneptune.com](https://meetneptune.com). They’ll help walk you through the process, so the only thing you’ll worry about are the contents of the best man’s toast, not your prenup.<br /><br /><br />
