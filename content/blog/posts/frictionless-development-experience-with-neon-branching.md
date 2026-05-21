---
title: How Proposales integrated Neon in their Postgres development workflow
description: "Smoothly migrating dev infra from RDS to Neon, reducing costs in the process."
excerpt: >-
  Switching databases is like a heart transplant, and migrating all your
  database’s production, staging, and development environments across providers
  is a risky process that requires significant effort and expertise, all of
  which can be quite intimidating. But you don’t have to ch...
date: "2022-12-08T19:35:25"
updatedOn: "2024-02-02T16:03:00"
category: case-study
categories:
  - case-study
authors:
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/frictionless-development-experience-with-neon-branching/social.jpg
  alt: null
isFeatured: false
seo:
  title: How Proposales integrated Neon in their Postgres development workflow - Neon
  description: >-
    Smoothly migrating dev infra from RDS to Neon, reducing costs in the
    process.
  keywords: []
  noindex: false
  ogTitle: How Proposales integrated Neon in their Postgres development workflow - Neon
  ogDescription: >-
    Switching databases is like a heart transplant, and migrating all your
    database’s production, staging, and development environments across
    providers is a risky process that requires significant effort and expertise,
    all of which can be quite intimidating. But you don’t have to choose between
    developer experience and stability for your code base. In this article, we
    […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/frictionless-development-experience-with-neon-branching/social.jpg
---

Switching databases is like a heart transplant, and migrating all your database’s production, staging, and development environments across providers is a risky process that requires significant effort and expertise, all of which can be quite intimidating.

But you don’t have to choose between developer experience and stability for your code base. In this article, we will look at how one of our database-branching early adopters, [Proposales](https://proposales.com/), integrated Neon into their development environment.

Proposales offers hoteliers tools to build data-driven proposals effortlessly. They have a team of versatile full-stack engineers and use AWS RDS for PostgreSQL.

Proposales used RDS for their development environment, but it was an expensive choice. Another issue was that sharing a database in their development environment had a couple of drawbacks:

1. Schema conflicts arose when multiple developers changed the database, leading to errors and data loss.
2. It was difficult for developers to properly test new features and changes without impacting teammates’ work.

Overall, using a shared database for development hindered collaboration, testing, and security.

An alternative that Proposales explored was using Postgres with Docker for local development. Docker allows Proposales to create and manage isolated environments for their applications, making it simple to set up and configure a local development environment.

However, the problem with using Docker is that it increases resource requirements, making it more difficult to run a development environment on a low-powered or resource-constrained machine.

## Adding Neon to their development workflow

Proposales found out about Neon and gradually integrated it into their workflows. They decided to keep RDS on production but use Neon and its database branching capabilities for development, replacing Postgres with Docker and RDS.

Neon fit well with Proposales’ workflow because they got the best of managed and local Postgres setup worlds. This shared cloud-based database can be branched into isolated environments for local development.

In addition, with database branching, they create a copy of their production-like database for testing features with production data without affecting their production environment.

In our recent conversation with Camelia Smeria, Lead Engineer at Proposales, she shared that her team uses Neon database branching for their latest feature, _Insight,_ which helps users better understand their proposal workflows. Insight requires production data for testing. Here is what Camelia had to say about their local setup:

_“We used to have a snapshot of the production data that we used for development… it turned out to be too much development effort and not worth it … everybody ended up using the localhost database._

_With the Neon branching feature, our developers can change their database to test their features without affecting other team members. Branching allows us to confidently do our database migrations to production.”_

You can watch the full conversation with Camelia Smeria:

<YoutubeIframe embedId="T4tMM8cfAWs" isDocPost={false} />

Other areas Proposales are exploring include database branching to their end-to-end testing with the Neon API to create a new branch and test their Vercel previews.

## Even deeper integration with your development workflow

We’ve seen above how developers are using Neon in development workflows. We believe that database branching opens up many other possibilities for Neon to be a fully integrated development tool.

One workflow we are experimenting with introduces Git Hooks to manage Neon branches corresponding to local git branches.

In the video below, we create a git branch `feat-1` using the command `git checkout -b feat-1`. This triggers the creation of a database branch on Neon, which returns a `DATABASE_URL` variable that is added to the `.env` file.

<figure>
  <video controls width="800" height="450">
    <source src="https://cdn.neonapi.io/public/videos/pages/blog/frictionless-development-experience-with-neon-branching/githooks-and-neon-api-opt-39ec6bc5.webm" type="video/webm" />
    <source src="https://cdn.neonapi.io/public/videos/pages/blog/frictionless-development-experience-with-neon-branching/githooks-and-neon-api-opt-8ed4d2cc.mp4" type="video/mp4" />
  </video>
</figure>

To summarize, you don’t have to migrate your entire database environment to start with Neon and database branching. You can start by moving your current shared or local Postgres database to Neon and use branching to collaborate with teammates and test your features with production data.

We also showed an example of branch creation with Git Hooks and the Neon API as another way to integrate Neon into your development workflows.<br />We believe there are many other workflows out there that could benefit from the database branching. Let us know about the challenges you are facing in your workflows in the [Neon community forum](https://community.neon.tech/) and how Neon’s database branching feature could help.
