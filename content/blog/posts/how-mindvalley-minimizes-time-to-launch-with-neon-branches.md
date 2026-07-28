---
title: How Mindvalley Minimizes Time-To-Launch With Neon Branches
description: Their engineering team is not blocked anymore by the database
excerpt: >-
  “Developers already face significant delays when working on a PR—running CI
  tests, ensuring everything is ready for preview, it all adds up. Time to
  launch is crucial for us: when we tried Neon and saw that spinning up a new
  branch takes seconds, we were blown away” (Alex Co, Hea...
date: '2024-10-17T16:24:16'
updatedOn: '2024-10-17T16:35:59'
category: community
categories:
  - community
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-mindvalley-minimizes-time-to-launch-with-neon-branches/cover.jpg
  alt: null
isFeatured: false
seo:
  title: How Mindvalley Minimizes Time-To-Launch With Neon Branches - Neon
  description: >-
    Mindvalley takes advantage of Neon’s faster DX for development and testing
    while keeping their production databases untouched in CloudSQL.
  keywords: []
  noindex: false
  ogTitle: How Mindvalley Minimizes Time-To-Launch With Neon Branches - Neon
  ogDescription: >-
    Mindvalley takes advantage of Neon’s faster DX for development and testing
    while keeping their production databases untouched in CloudSQL.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-mindvalley-minimizes-time-to-launch-with-neon-branches/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-mindvalley-minimizes-time-to-launch-with-neon-branches/neon-mindvalley-1-1024x576-5bcefab5.jpg)

<blockquote>
<p><strong>“Developers already face significant delays when working on a PR—running CI tests, ensuring everything is ready for preview, it all adds up. Time to launch is crucial for us: when we tried Neon and saw that spinning up a new branch takes seconds, we were blown away”</strong> (<em>Alex Co, Head of Platform Engineering at Mindvalley)</em></p>
</blockquote>

[Mindvalley](https://www.mindvalley.com/entry-point?otag=mv.com_qaap_VWO3616_V1_desktop) is a global platform that offers a unique approach to personal growth and transformation. With a reach extending to over 11 million lives, it provides courses and content that cover a wide range of topics, from health and fitness to spiritual growth and mental well-being.

## How Mindvalley uses Neon

Mindvalley primarily uses Google CloudSQL for their production databases, but they recently started using Neon to speed up their non-production workflows. Previously, everything—including development and testing—was handled in CloudSQL, which introduced inefficiencies that slowed the team down (more details later).

Mindvalley now takes advantage of Neon’s faster DX for development and testing while keeping their production databases untouched. The key feature driving this boost in developer velocity is [branching](https://neon.tech/docs/introduction/branching), which allows their developers to spin up new previews in less than a minute. [Automatically creating branches with every PR](https://neon.tech/flow#preview-environment-workflow) has drastically reduced waiting times, speeding up their development cycle.

## Their database branching workflow

Let’s take a closer look at how Mindvalley uses branching:

### Nightly data syncs via Github Actions (Neon Twin)

Mindvalley has built a [Neon Twin](https://neon.tech/blog/optimizing-dev-environments-in-aws-rds-with-neon-postgres-part-ii-using-github-actions-to-mirror-rds-in-neon) to automate the nightly synchronization between their production database in CloudSQL and a main development branch in Neon. Through GitHub Actions, a nightly dump from CloudSQL is restored in the main branch in Neon without developers having to perform any manual work.

### Child branches for independent development environments

From this main branch, hundreds of ephemeral environments can be immediately spun up without requiring any additional data syncs. These child environments feel like perfect “copies” of the main branch, containing all the latest data and schema. Each developer gets their own child branch and can work independently without disrupting others. Developers can [easily propagate updates](https://neon.tech/docs/guides/reset-from-parent) from the master branch to their own environments.

### Integration with CI/CD for end-to-end testing

All of this happens through Mindvalley’s in-house CI/CD automation system, which is fully integrated with the Neon API. Whenever developers launch a PR, the automation system automatically creates a new database branch in Neon. Neon’s [connection pooling](https://neon.tech/docs/connect/connection-pooling) ensures there are no issues with too many connections going into the branches. Once the PR is closed, the database branch is deleted.

## The problem with dev/test on other managed databases: A closer look

As we said earlier in the post, Mindvalley uses CloudSQL as their main database, but using it also for dev and testing as well proved to be not the best in terms of velocity and efficiency overall. Here’s some of the issues they regularly encountered:

### Concurrency and state issues

In a team of 100 developers, using shared database instances for dev/test quickly became a bottleneck, as developers needed to work on different features simultaneously. Testing environments couldn’t often be reused—credentials or test data would change, making it difficult to rerun tests without manually resetting or recreating accounts. Developers had to create new accounts or environments every time they wanted to conduct tests, which meant more work for the operations team.

### End-to-end testing delays

For their end-to-end tests, Mindvalley’s engineers (like most devs) wanted the ability to quickly run tests, discard the test data, and revert the environment to its previous state. Their traditional approach in CloudSQL involved manually exporting the database to create backups and importing those backups into new instances for testing. But this process took hours. And much of the operation was obscured by the complexity of the infrastructure—developers aren’t always DBAs.

### Database seeding maintenance

Maintaining seed files for local development was another pain point. Each time a new field, column, or schema was introduced in production, seed data needed to be manually updated in all the non-prod environments.

This problem with seeding is also why Mindvalley chose Neon over Supabase. Like their previous setup, Supabase also required reliance on a seed file to populate all the non-prod environments, since Supabase branches don’t “replicate” data. This didn’t solve the seed file maintenance issue Mindvalley was already facing. Supabase branches also took longer to be ready compared to Neon, making it less effective for speeding up the development lifecycle.

## Build your own Neon Twin for dev/test

<blockquote>
<p>“We are using the Neon Twin workflow. We just install the GitHub action and it takes care of the rest. Developers may not know how to dump and restore well, but they know how to run a GitHub Action. It’s amazing” (<em>Alex Co, Head of Platform Engineering at Mindvalley</em>)</p>
</blockquote>

To keep their data in sync with their main setup in CloudSQL and Neon, Mindvalley set up a [Neon Twin](https://neon.tech/blog/optimizing-dev-environments-in-aws-rds-with-neon-postgres-part-ii-using-github-actions-to-mirror-rds-in-neon). A Neon Twin is a synchronized copy of your testing dataset hosted on Neon, while your main production environment stays elsewhere.

By scheduling nightly dump/restores via GitHub actions, your developers can access a fresh copy of the dataset every day without manual intervention; this sync is done to the main development branch in Neon, from which many independent child branches can be immediately derived to run tests and building features. You only need to sync your data once, for hundreds of dev environments.

On a glimpse, the Neon Twin workflow looks like this:

1. You set up your [Neon account](https://console.neon.tech/signup) and create a project to host your non-production databases. This project will be the home of your Neon Twin. In this project, you create a main branch that will receive the daily dataset updates, and from which all the child branches (for each independent environment) will be derived.
2. To keep the data in the main branch in sync, you automate the dump/restore via GitHub Actions ([we’ve built this action for you](https://neon.tech/blog/optimizing-dev-environments-in-aws-rds-with-neon-postgres-part-ii-using-github-actions-to-mirror-rds-in-neon#create-the-workflow-file)).
3. Once you’ve tested changes in the Neon environment, you can deploy them back to production in your main database. You can track schema changes in Neon via Prisma or SQLfiles—[we tell you how.](https://neon.tech/blog/neon-twin-deploy-workflow)

If you’d like to try it out, follow the steps [here](https://neon.tech/blog/optimizing-dev-environments-in-aws-rds-with-neon-postgres-part-ii-using-github-actions-to-mirror-rds-in-neon). [Neon was a Free plan](https://neon.tech/pricing), so you can get started without committing to anything.
