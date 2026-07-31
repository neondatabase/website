---
title: Neon Serverless Postgres is Live
description: No more waitlist. Try Neon now.
excerpt: >-
  We are very excited to announce that Neon has dropped its invite gate and is
  releasing its database branching feature. You no longer need to wait for an
  invite code to try serverless Postgres with Neon — sign up with your Google or
  GitHub account, and you can be up and running wi...
date: '2022-12-06T14:22:06'
updatedOn: '2023-08-30T10:20:20'
category: company
categories:
  - company
authors:
  - daniel-price
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-serverless-postgres-is-live/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Neon Serverless Postgres is Live - Neon
  description: No more waitlist. Try Neon now.
  keywords: []
  noindex: false
  ogTitle: Neon Serverless Postgres is Live - Neon
  ogDescription: >-
    We are very excited to announce that Neon has dropped its invite gate and is
    releasing its database branching feature. You no longer need to wait for an
    invite code to try serverless Postgres with Neon — sign up with your Google
    or GitHub account, and you can be up and running with serverless Postgres
    […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-serverless-postgres-is-live/social.png
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/neon-serverless-postgres-is-live/neon-is-live-1-1024x576-00b17b25.jpg)

We are very excited to announce that Neon has dropped its invite gate and is releasing its database branching feature. You no longer need to wait for an invite code to try serverless Postgres with Neon — sign up with your Google or GitHub account, and you can be up and running with serverless Postgres in seconds!

We have a generous free tier for you with availability in four major regions: US West, US East, Europe, and Asia Pacific. Here is what else you get with Neon:

- 1 Neon project
- 10 database branches for your production, development, and testing environments, with a limit of 3 GB of data per branch
- 3 compute instances, each with 1 vCPU and up to 4GB of RAM
- A point-in-time reset (PITR) window of 7 days of reasonable usage
- An API to manage your projects, branches, and databases

[Sign up now!](https://console.neon.tech/sign_in)

Here are a few steps to get you started:

1. Create a project in seconds and [connect to your application](https://neon.tech/docs/connect/connect-from-any-app/) with the database URL.
2. Query a Neon project database from the [Neon SQL Editor](https://neon.tech/docs/get-started-with-neon/query-with-neon-sql-editor/) or connect using Neon’s [passwordless connect](https://neon.tech/docs/connect/passwordless-connect/) feature from your terminal: `psql -h pg.neon.tech`.
3. Navigate to the **Branches** page to create a branch
4. [Import your Postgres data to](https://neon.tech/docs/import/import-from-postgres) [Neon](https://neon.tech/docs/how-to-guides/import-an-existing-database/)

With Neon database branching, your database environments are just a branch of your production database. Because Neon stores Write-Ahead-Log records, this means you can create a branch with the latest and most up-to-date information or from any point in time in your database’s history to run tests on the previous state of your data. Read the full announcement in the Database Branching with Neon blog post, or learn more about database branching in the [Neon documentation](https://neon.tech/docs/introduction/branching/).

<video autoPlay muted controls width="800" height="390">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/neon-serverless-postgres-is-live/recording-opt-1ad3fda0.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/videos/pages/blog/neon-serverless-postgres-is-live/recording-opt-7054b1f1.mp4" type="video/mp4" />
</video>

You can automate your processes with the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). Create an API Key to manage your projects, branches, and databases with a simple API call from your application or CI/CD. Create a branch, run your tests, then delete it once your jobs are completed.

```bash
curl -X 'GET' \
  'https://console.neon.tech/api/v2/projects' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer API_KEY'
```

Join us tomorrow at the Neon Developer Days to talk about All-Things-Branching, where we will discuss using the Neon API for local development and CI/CD with GitHub Actions. Learn more about the Neon API in our [documentation](https://api-docs.neon.tech/reference/getting-started-with-neon-api).<br />

As always, the Neon team values your feedback, and we’re here to answer your questions. Please get in touch with us in our Community Forum or email us at [feedback@neon.tech](mailto:feedback@neon.tech). You can also [star Neon on GitHub](https://github.com/neondatabase/neon) and find us on Twitter [@neondatabase](https://twitter.com/neondatabase).
