---
title: Connect Vercel and Neon
enableTableOfContents: true
isDraft: false
---

This guide describes how to connect your Vercel project with Neon using the [Neon integration from the Vercel marketplace](https://vercel.com/integrations/neon).

<Admonition type="note">
This is a Beta version of Neon’s Vercel integration. For assistance or to suggest improvements, contact [vercel-feedback@neon.tech](mailto:vercel-feedback@neon.tech).
</Admonition>

## What the Neon integration does

The Neon-Vercel integration connects your Vercel project to a Neon project and creates a database branch for each Vercel [preview deployment](https://vercel.com/docs/concepts/deployments/preview-deployments).

Optionally, based on your selection, the integration also creates a development branch, which you can use with your Vercel development environment.

The integration sets these environment variables in Vercel:

- `PGHOST`
- `PGUSER`
- `PGDATABASE`
- `PGPASSWORD`
- `DATABASE_URL`

The variables are set in your Vercel production, development, and preview environments, as required.

## How the integration works with preview deployments

When you push a branch to the GitHub repository associated with your Vercel project, triggering a preview deployment, the integration automatically creates a database branch in Neon and connects it to your preview deployment by setting the required Vercel preview environment variables. An isolated copy of your database for each preview deployment provides reviewers with a true production-like environment with real data.

For the integration to work, the database connection settings in your application must correspond to the Vercel production environment variable settings configured by your Neon integration. For example, if your applications's database connection is defined by a `DATABASE_URL` variable, make sure that setting in your application corresponds to the `DATABASE_URL` setting configured by the integration. You can find the environment variable settings in Vercel by navigating to the Vercel dashboard, selecting your project, and selecting **Settings** > **Environment Variables**.

## Add the Neon integration

Before you begin, ensure that you have met the following prerequisites:

- A [Vercel account](https://vercel.com).
- A Vercel project. If you do not have one, see [Creating a project](https://vercel.com/docs/concepts/projects/overview#creating-a-project), in the _Vercel documentation_.

To add the integration:

1. Navigate to the [Neon Vercel integrations page](https://vercel.com/integrations/neon), and click **Add integration**.
1. Select a Vercel account to add the integration to.
1. Select the project to add the integration to.
1. Review the permissions required by the integration, and click **Add Integration**.
1. In the **Integrate Neon** dialog:
    1. Select the Vercel project to add the integration to.
    1. Select the Neon project, database, and role that Vercel will use to connect. The Neon Free Tier supports a single project per user. If desired, you can also create a new database and role for the integration.

        The database that you select becomes your production database. This database must reside on the root branch of your Neon project. The root branch is preselected.

        You are given the option to create a branch for your Vercel development environment. When this option is selected (the default), the integration creates a branch named **vercel-dev** and sets Vercel environment variables for it.

        When you finish making selections, click **Continue**.
    1. Confirm the integration settings to allow the integration to perform the following actions:
        - Set the environment variables listed above for your Vercel production, development, and preview environments, as required.
        - Reset the database user's password, enabling the integration to configure the `PGPASSWORD` and `DATABASE_URL` environment variables.
        - Create database branches and compute endpoints for preview deployments.
        - Create a development branch for your Vercel development environment (if you selected that option).

        Click **Connect** to accept the settings and proceed with the integration.

    Once the integration is added, you are presented with a **Success!** dialog where you can copy the new password for your database user.
1. To view the results of the integration in Neon:
    1. Navigate to the [Neon Console](https://console.neon.tech/).
    1. Select the project you connected to.
    1. Select **Branches**.
    You will see the root branch of your project, and if you created a development branch, you will also see a `vercel-dev` branch.
1. To view the results of the integration in Vercel:
    1. Navigate to [Vercel](https://vercel.com/).
    1. Select the Vercel project you added the integration to.
    1. Select **Settings** > **Environment Variables**.
    You will see the `PG*` and `DATABASE_URL` environment variables set by the integration.

## Troubleshoot connection issues

If the environment variables configured by the Neon integration already exist, you may encounter the following error due to an existing integration that sets one or more of the same environment variables.

```text
Failed to set environment variables in Vercel. Please make sure that the following environment variables are not set: PGHOST, PGUSER, PGDATABASE, PGPASSWORD, DATABASE_URL
```

In this case, you can remove the existing environment variables from your Vercel project settings and retry the Neon integration. To remove existing environment variables:

1. From the Vercel project page, select **Settings**.
1. Locate the environment variables required by the Neon integration and remove them.

    <Admonition type="note">
    Alternatively, you can remove the conflicting integration, assuming it no longer required. This may be a previous Neon integration or another integration. Removing the integration removes the variables set by the integration.
    </Admonition>

1. Once you have removed the variables, try adding the Neon integration again. See [Add the Neon integration](#add-the-neon-integration).

## Manage your Neon integration

To view integration permissions, manage integration access, or remove the Neon integration:

1. On the Vercel dashboard, select **Settings** > **Integrations**.
1. Find the **Neon** integration and select **Manage**.
