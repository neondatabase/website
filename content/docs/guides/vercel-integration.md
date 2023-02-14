---
title: The Neon integration with Vercel
enableTableOfContents: true
---

[Neon integration with Vercel](https://vercel.com/integrations/neon) connects your Vercel project to a Neon database and enables creating a database branch for each Vercel [preview deployment](https://vercel.com/docs/concepts/deployments/preview-deployments).

Vercel preview deployments enable teams to collaborate effectively by automatically creating an isolated, production-like environment for every commit. This way, all changes can be previewed before they are merged into production.

However, when databases are involved, teams often share a single database containing dummy data across all preview deployments. This setup is not ideal for these reasons:

- If the shared database encounters an issue, so will all preview deployments.
- Changes to the shared database schema might break all previously created preview deployments, making it a productivity bottleneck.

![Shared database](/docs/guides/vercel_shared_database.webp)

Neon’s branching feature addresses all of these challenges. A branch is a copy-on-write clone of your data, so creating it only takes a few seconds. This makes it a scalable and cost-effective solution for preview deployments, enabling you to create a branch for each pull request.

![Branch database](/docs/guides/vercel_branch_database.webp)

When you push a branch to the GitHub repository associated with your Vercel project, triggering a preview deployment, the Neon integration automatically creates a database branch and connects it to your preview deployment by setting the required Vercel  environment variables.

To add the integration to a Vercel project, refer to the instructions in [Add the Neon integration](/docs/guides/vercel-integration).

For a demo app that you can use to try the Neon-Vercel integration, refer to [Deploy a Next.js app with Prisma and Vercel](/docs/guides/vercel-app), which demonstrates the integration with the [naturesnap](https://github.com/neondatabase/naturesnap) application.
