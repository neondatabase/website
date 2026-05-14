---
title: 'Vercel Native Integration: Create a Neon Branch Per Preview'
description: Now available in the Vercel Marketplace
excerpt: >-
  To Vercel users deploying Neon via the Vercel Marketplace: we have good news.
  You can now use Neon’s Native Vercel Integration to automatically create a
  database branch for each Vercel preview deployment. Check out our docs for a
  step-by-step guide. Why deploy Neon branches in yo...
date: '2025-02-20T02:39:53'
updatedOn: '2025-08-14T09:28:14'
category: product
categories:
  - product
  - community
  - workflows
authors:
  - gustavo-salomao
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-vercel-native-integration/cover.jpg
  alt: null
isFeatured: true
seo:
  title: 'Vercel Native Integration: Create a Neon Branch Per Preview - Neon'
  description: >-
    You can now add Neon to your Vercel project via the Vercel Marketplace, and
    automatically create a Neon branch for every preview.
  keywords: []
  noindex: false
  ogTitle: 'Vercel Native Integration: Create a Neon Branch Per Preview - Neon'
  ogDescription: >-
    You can now add Neon to your Vercel project via the Vercel Marketplace, and
    automatically create a Neon branch for every preview.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-vercel-native-integration/social.jpg
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/neon-vercel-native-integration/neon-neon-verpercentd1percent81el-1-1024x576-6d5a002d.jpg)

[To Vercel users deploying Neon via the Vercel Marketplace:](https://vercel.com/marketplace/neon) we have good news. You can now use Neon’s **Native Vercel Integration** to automatically create a database branch for each Vercel preview deployment. [Check out our docs](https://neon.tech/docs/guides/vercel-native-integration-previews) for a step-by-step guide.

## Why deploy Neon branches in your Vercel project

<Admonition type="tip" title="Context">
Through the Vercel Marketplace, you can add a storage backend to your Vercel projects, with Neon being one of the options. If you’d like to add Neon to your Vercel projects, the first step is installing Neon’s Native Vercel Integration: you can do it [here](https://vercel.com/marketplace/neon).
</Admonition>

### You get isolated databases for every preview

In a typical workflow, every PR points to the same database—this causes conflicts, leftover test data, confusion around schema versions… With Neon’s integration, **tests in one preview deployment won’t affect another**. When the PR is closed or merged, you simply delete the Neon branch in question.

### Databases don’t need to be populated with seed data

Neon branches work via [copy-on-write](https://neon.tech/blog/get-page-at-lsn): **each Neon branch is ready instantly with a perfect “copy” of the data and schema of its parent**. This eliminates the need to manually populate a preview database with seed data.

### You can test application and schema changes together

If your database schema is managed in code, you can integrate schema migrations directly into your Vercel deployment process. By adding migration commands to your build configuration, you ensure that **schema changes in your commits are applied automatically to the database branch** created for the preview deployment.

### Resetting environments takes one click

If something goes wrong during testing or you need a fresh start, **resetting an environment is as simple as recreating the branch**. Since Neon branches are lightweight and quick to spin up, this process is instantaneous. You’re no longer stuck manually cleaning up data or resetting your testing database, which saves valuable development time.

## How to set it up

The first step is to connect your Vercel project to your Neon database in Vercel. If you don’t have a Neon database yet via Vercel, you can [create one](https://neon-next-git-dprice-vercel-previews-native-neondatabase.vercel.app/docs/guides/vercel-native-integration#adding-more-databases) in the **Storage** tab of your Vercel dashboard.

Once you have your Neon database ready, navigate to it, and click “Connect”:

![Post image](https://cdn.neonapi.io/public/images/pages/blog/neon-vercel-native-integration/ad4nxdwi3qvyzjatkiy5u7vyvlqb1agngh4v0lrs74j3iobw97qti9g8nsoanitmxvhueozexbgf4t9s2e1ygncwwyckxwzffmfyxxm8ltqfm6d0a7eabl3sdj8ups4kwrjf-a5-49f5871c.png)

Next,

- Select the environments you want to make your database available to: Development, Preview, or Production. This will add a set of database [environment variables](https://neon-next-git-dprice-vercel-previews-native-neondatabase.vercel.app/docs/guides/vercel-native-integration#environment-variables-set-by-the-integration) to the selected environments in your Vercel project.
- Under “Advanced Options”,
  - Enable the “Required” option under “Deployments Configuration”
  - Under “Create a database branch for deployment”, select “Preview”

![Post image](https://cdn.neonapi.io/public/images/pages/blog/neon-vercel-native-integration/image-20-916x1024-fc5ca85d.png)

1.

Once you’re done, click “Connect”. That’s it: with each commit to a branch in your application’s GitHub repository, Vercel preview deployments will be created with their own Neon branch.

Check out [our documentation](https://neon.tech/docs/guides/vercel-native-integration-previews) for more detailed instructions, and join us [on Discord](https://discord.gg/92vNTzKDGp) to ask questions.
