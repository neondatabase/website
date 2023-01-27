---
title: Integrate Neon with Vercel
enableTableOfContents: true
isDraft: true
---

This guide describes how to integrate Neon with Vercel using the Neon integration from the [Vercel integration marketplace](https://vercel.com/integrations).

## What the Neon integration does

The Neon-Vercel integration connects your Vercel project to your Neon project. If you use [preview deployments](https://vercel.com/docs/concepts/deployments/preview-deployments) in Vercel, which are available by default for all Vercel projects, Neon automatically creates a database branch for each preview deployment. This actin occurs when the GitHub branch created by the preview deployment is observed. The integration also sets Vercel preview environment variables to allow your preview deployment to connect to the Neon database branch.

## Prerequisites

- A [Vercel account](https://vercel.com).
- A Vercel project. For Vercel project creation instructions, see [Projects](https://vercel.com/docs/concepts/projects/overview), in the _Vercel documentation_.

## Deploy the integration

1. Navigate to the [Neon Vercel integrations page](https://vercel.com/integrations/neon) and click **Add integration**.
1. Select a Vercel account to add the integration to and click **Continue**.
1. Select the projects to which the integration will be added. You can select **All Projects** or a **Specific Project**. After you have made your selection, click **Continue**.
1. Review the required permissions, and click **Add Integration** to continue.
1. In the **Integrate Neon** dialog:
    1. Select the Vercel project that you want to add the integration to, and click **Continue**. If the Vercel project is already connected to a Neon project, continuing the integration replaces the existing configuration.
    1. Select a Neon project, a database, and role that Vercel will use to connect. The Neon Free Tier supports a single project per user. If you do not have a Neon project, you can create one. You can also create a new database and role for the integration if you do not want to use an existing database or role. When you have finished making your selections, click **Connect**.
    1. The integration sets two `DATABASE_URL` variables in Vercel, one for your production database, and one for database branches that are created for preview deployments. The production database resides on the `main` branch of your Neon project. The database branches created for preview deployments are branched from `main`. Click **Confirm** to accept the environment variable settings.
    1. Click **Done** to complete the integration.

## Troubleshooting connection issues

(Need to verify. This may be complete fiction.)

If you encountered a connection error while adding the integration, you may need to remove existing environment variable settings in your Vercel project settings. The Neon integration sets the following environment variables.  

- DATABASE_URL (Production)
- DATABASE_URL (Development)

Once you have removed the settings fo these variables, try the migration again. For information editing project setting in Vercel, see [Project settings](https://vercel.com/docs/concepts/projects/overview#project-settings). you can configure Environment Variables directly from **Project Settings**.

## Manage your Neon integration

You can manage access or remove of your Neon-Vercel integration from the Vercel dashboard.

1. On the Vercel dashboard, select **Integrations**.
1. For the **Neon** integration, select **Manage**.

## Using the Neon integration for preview deployments

The following steps describe how to setup a Next.js project in Vercel and create a preview deployment that deploys a database branch.
