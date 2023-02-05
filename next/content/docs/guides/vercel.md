---
title: Connect Vercel and Neon
enableTableOfContents: true
isDraft: false
---

This guide describes how to connect your Vercel project to Neon using the [Neon integration from the Vercel marketplace](https://vercel.com/integrations).

## What the Neon integration does

The Neon-Vercel integration connects your Vercel project to a Neon project. If you do not have a Neon project, you can create one when adding the integration. When adding the integration, you will select a database from the `main` branch of your Neon project. This will be your production database. Optionally, based on your selection, the integration creates a development branch that is branched from `main`, which you can use with your Vercel development environment.

If you use [preview deployments](https://vercel.com/docs/concepts/deployments/preview-deployments) in Vercel, which are available by default for all Vercel projects, the integration automatically creates a database branch whenever a preview deployment is detected.

The integration sets the following variables:

- `PGHOST`
- `PGUSER`
- `PGDATABASE`
- `PGPASSWORD`
- `DATABASE_URL`

The variables are set for your Vercel production environment, for your development environment if you chose to create a development branch, and for your preview environment whenever a preview deployment is detected.

## Prerequisites

- A [Vercel account](https://vercel.com).
- A Vercel project. If you do not have one, see [Creating a project](https://vercel.com/docs/concepts/projects/overview#creating-a-project), in the _Vercel documentation_.

## Add the Neon integration

1. Navigate to the [Neon Vercel integrations page](https://vercel.com/integrations/neon), and click **Add integration**.
1. Select a Vercel account to add the integration to.
1. Select the projects to which the integration will be added. You can select **All Projects** or a **Specific Project**.
1. Review the permissions required by the integration, and click **Add Integration**.
1. In the **Integrate Neon** dialog:
    1. Select the Vercel project that you want to add the integration to.
    1. Select a Neon project, a database, and role that Vercel will use to connect. The Neon Free Tier supports a single project per user. If you do not have a Neon project, you can create one. If desired, you can also create a new database and role for the integration. When you have finished making your selections, click **Continue**.
    1. Confirm the integration settings. By clicking **Confirm**, you are permitting the integration to perform the following actions:
        - Set the following environment variables for your Vercel production, development, and preview environments, as required:
            - `PGHOST`
            - `PGUSER`
            - `PGDATABASE`
            - `PGPASSWORD`
            - `DATABASE_URL`
        - Reset the database user's password, which enables the integration to configure the `PGPASSWORD` and `DATABASE_URL` environment variables, which require a password.
        - Create database branches and endpoints for preview deployments.

        Click **Continue** to accept the settings.
    1. Click **Done** to complete the integration.

## Troubleshooting connection issues

If the environment variables configured by the Neon integration already exist, you may encounter the following error due to an existing database integration that sets one or more of the same environment variables.

```text
Failed to set environment variables in Vercel. Please make sure that following environment variables are not set: PGHOST, PGUSER, PGDATABASE, PGPASSWORD, DATABASE_URL
```

In this case, you can remove the existing environment variables from your Vercel project settings and retry the Neon integration. To remove existing environment variables:

1. From the Vercel dashboard, select **Settings**.
1. Locate the environment variables required by the Neon integration (one or more of the variables mentioned in the error message) and remove it.

    <Admonition type="note">
    Alternatively, instead of removing environment variables individually, you can remove the conflicting database integration that sets the same environment variables, assuming it no longer required. Removing the integration removes the variables set by the integration.
    </Admonition>

1. Once you have removed the variables, try adding the Neon integration again. See [Add the Neon integration](#add-the-neon-integration).

For more information about project settings in Vercel, see [Project settings](https://vercel.com/docs/concepts/projects/overview#project-settings). For information about Vercel environment variables, see [Environment variables](https://vercel.com/docs/concepts/projects/environment-variables).

## Manage your Neon integration

To view integration permissions, manage integration access, or to remove the Neon integration:

1. On the Vercel dashboard, select **Settings** > **Integrations**.
1. For the **Neon** integration, select **Manage**.

## Using the Neon integration for preview deployments

The following steps describe how to setup a Next.js project in Vercel and create a preview deployment that deploys a database branch.
