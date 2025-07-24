---
title: 'One branch per preview'
subtitle: 'Automatically create isolated database environments for every pull request and preview deployment'
updatedOn: '2025-07-08T12:47:21.296Z'
---

Every time a pull request is opened, Neon can help power a full-stack preview (including a live backend and database) by creating a dedicated branch. Thanks to Neon’s integration with platforms like Vercel and Netlify, this setup is seamless and requires minimal configuration.

When you install [Neon’s Vercel integration](/docs/guides/vercel-overview), each new Vercel preview deployment automatically spins up a matching database branch named like `preview-pr-142`. The branch inherits your schema and data, and Vercel injects the `DATABASE_URL` into the preview environment. Once the PR is closed or merged, the branch can be automatically torn down, keeping your project clean and cost-efficient.Preview deployments use production-like data without manual cloning.
