---
title: Full-Stack Preview Deployments with Vercel and Neon
description: >-
  Learn how to use the Neon integration on Vercel to create a database branch
  for every Preview Deployment.
excerpt: >-
  We’re thrilled to announce the release of the Neon integration for Vercel in
  beta! The integration allows you to connect a Neon Postgres database to a
  Vercel project and create a database branch for every Preview Deployment. To
  get started with the integration, check out the docu...
date: "2023-02-08T16:53:27"
updatedOn: "2025-10-14T06:19:31"
category: community
categories:
  - community
authors:
  - mahmoud-abdelwahab
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-vercel-integration/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Full-Stack Preview Deployments with Vercel and Neon - Neon
  description: >-
    Learn how to use the Neon integration on Vercel to create a database branch
    for every Preview Deployment.
  keywords: []
  noindex: false
  ogTitle: Full-Stack Preview Deployments with Vercel and Neon - Neon
  ogDescription: >-
    Learn how to use the Neon integration on Vercel to create a database branch
    for every Preview Deployment.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-vercel-integration/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-vercel-integration/neon-vercel-integrations-1024x538-21553f9f.png)

We’re thrilled to announce the release of the [Neon integration for Vercel](https://vercel.com/integrations/neon) in beta!

The integration allows you to connect a Neon Postgres database to a Vercel project and create a [database branch](https://neon.tech/docs/introduction/branching) for every Preview Deployment.

To get started with the integration, check out [the documentation guide](https://neon.tech/docs/guides/vercel/).

## Database branching with Vercel Preview Deployments

[Vercel Preview Deployments](https://vercel.com/docs/concepts/deployments/preview-deployments) enable teams to collaborate effectively by automatically creating an isolated, production-like environment for every commit. This way, all changes can be previewed before they are merged into production.

However, when databases are involved, some teams share a single database containing dummy data across all preview deployments. This setup is not ideal for several reasons:

- If the shared database encounters an issue, so will all preview deployments.
- Changes to the shared database schema might break all previously created Preview Deployments, making it a productivity bottleneck.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-vercel-integration/page-72-1024x576-312b9682.png)

To address these issues, you want each Preview Deployment to have its own isolated database. Here is how you can do it with Neon.

<br />Neon’s [branching feature](https://neon.tech/docs/introduction/branching) addresses all these challenges. A branch is a copy-on-write clone of your data, so creating it only takes a few seconds. This makes it a scalable and cost-effective solution for Preview Deployments, enabling you to create a branch for every pull request.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-vercel-integration/database-branching-with-vercel-preview-deployments-1024x576-e0914c1d.png)

## Example workflow using Next.js, Prisma, and Vercel

We have created a Next.js + Prisma demo called [Naturesnap](https://github.com/neondatabase/naturesnap). It is a simple Photo gallery app to view nature photos (or “snaps”) and their photographer. We have already deployed this app to production and configured the integration. The app currently only displays photos, we want to modify it to show the photographer.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-vercel-integration/before-1-1024x587-59aae1ae.png)

To make this change, the first step is to clone the repo locally and create a new git branch. Next, we will need to modify the `schema.prisma` file and generate the database migrations using [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate). You can use a Neon branch or a local Postgres instance for this step. Finally, we will write database queries using [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client) and modify the application’s UI.

After making these changes, we’ll commit them to GitHub with an open pull request.

<figure>
<video height="1080" style={{ aspectRatio: '1920 / 1080' }} width="1920" autoPlay loop muted src="https://cdn.neonapi.io/public/videos/pages/blog/neon-vercel-integration/arc-001345-7a41ddcb.mp4" playsInline></video>
</figure>

This automatically creates a Neon branch from the main branch, sends the connection string to Vercel, and adds it to your project. The newly created Neon branch will have the same name as the git branch containing the code changes.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-vercel-integration/env-variables-1-1024x585-8ca5bd2a.png)

Next, before creating a Preview Deployment, the `prisma migrate deploy` command will run, look into the `prisma/migrations` folder, and apply any pending migrations. You can include this command in the project’s `package.json` build script or override it in your Vercel project settings.

That is it! All Preview Deployments will now have an isolated database branch.

<figure>
<video height="1080" style={{ aspectRatio: '1920 / 1080' }} width="1920" autoPlay loop muted src="https://cdn.neonapi.io/public/videos/pages/blog/neon-vercel-integration/preview-deploy-bdab4231.mp4" playsInline></video>
</figure>

## Final thoughts

We are incredibly excited about this integration with Vercel and would love your feedback. If you need help, feel free to post in our [Neon community](https://community.neon.tech/) or email us at [vercel-feedback@neon.tech](mailto:vercel-feedback@neon.tech).
