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

The Neon-Vercel integration connects your Vercel project to a Neon project. If you do not have a Neon project, you can create one while adding the integration. When deploying the integration, you will select a database from the root branch of your Neon project. This will become your production database.

When the integration is deployed, it creates a branch in Neon for each Git branch pushed to the GitHub account associated with your Vercel [preview deployment](https://vercel.com/docs/concepts/deployments/preview-deployments), allowing you to take advantage of Neon's branching capabilities.

Optionally, based on your selection, the integration also creates a development branch, which you can use with your Vercel development environment. The development branch is a copy of your production branch.

The integration sets these environment variables in Vercel:

- `PGHOST`
- `PGUSER`
- `PGDATABASE`
- `PGPASSWORD`
- `DATABASE_URL`

The variables are set in your Vercel production, development, and preview environments, as required.

## Prerequisites

- A [Vercel account](https://vercel.com).
- A Vercel project. If you do not have one, see [Creating a project](https://vercel.com/docs/concepts/projects/overview#creating-a-project), in the _Vercel documentation_.

## Add the Neon integration

1. Navigate to the [Neon Vercel integrations page](https://vercel.com/integrations/neon), and click **Add integration**.
1. Select a Vercel account to add the integration to.
1. Select the project to add the integration to.
1. Review the permissions required by the integration, and click **Add Integration**.
1. In the **Integrate Neon** dialog:
    1. Select the Vercel project to add the integration to.
    1. Select the Neon project, database, and role that Vercel will use to connect. The Neon Free Tier supports a single project per user. If you do not have a Neon project, you can create one. If desired, you can also create a new database and role for the integration.

        The database that you select becomes your production database. This database must reside on the root branch of your Neon project. The root branch is preselected.

        You are given the option to create a branch for your Vercel development environment. When this option is selected (the default), the integration creates a branch named **dev** and sets Vercel environment variables for it.

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
    You will see the root branch of your project, and if you created a development branch, you will also see a `dev` branch.
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

## Using the Neon integration with preview deployments

Vercel [Preview Deployments](https://vercel.com/docs/concepts/deployments/preview-deployments) enable teams to preview changes to an application in a live, production-like environment without merging those changes to the Git project's production branch, enabling anyone with access to the preview to provide feedback before changes are merged.

However, when databases are involved, teams are often forced to use a single database containing dummy data with all preview deployments. This setup is not ideal for several reasons:

- Preview deployments with dummy data do not accurately represent production.
- If the shared database encounters an issue, it affects all preview deployments.
- Changes to the shared database schema affect all preview deployments, which can make the database a productivity bottleneck.

To address these issues, some teams provision a database containing dummy data for each preview deployment. While this is a better experience, the preview deployments still do not accurately represent production, which leads some to deploy preview databases with a full copy of their production data as part of their CI/CD pipeline.

The main downside of this approach is the time it takes for a preview deployment to be ready, which depends on the amount of data you are importing. The larger the application’s database, the longer it takes to create a preview deployment, which impacts developer productivity.

Neon’s branching feature addresses all of these challenges. With Neon, a branch is a copy-on-write clone of your data that can be created instantly, which makes Neon's database branches a scalable and cost-effective solution for preview deployments. After adding the integration, each preview deployment will automatically have its own isolated, production-like database.

To use the integration with preview deployments:

1. Add the Neon integration to your Vercel project, as described above.
2. Ensure that the database connection settings in your application correspond to the environment variable settings configured by the Neon integration. For example, if your applications's database connection is defined by a `DATABASE_URL` variable, make sure that setting in your application corresponds to the `DATABASE_URL` setting configured by the Neon integration. You can find the environment variable settings in Vercel by navigating to the Vercel dashboard, selecting your project, and selecting **Settings** > **Environment Variables**. In addition to `DATABASE_URL` variable, the integration sets the following environment variables, which may be used by some application frameworks:

    - `PGHOST`
    - `PGUSER`
    - `PGDATABASE`
    - `PGPASSWORD`

    <Admonition type="note">
    After adding the integration and setting the environment variables in your application, you may have to redeploy your application in Vercel for the environment variables set by the integration to take effect.
    </Admonition>

3. After the integration is added and the environment variables in your application are configured to match those in your Vercel project, each Git branch pushed to the GitHub account associated with your Vercel project creates a branch in Neon and automatically configures the environment variables in your Vercel preview environment, allowing the preview deployment to connect to the database the branch.

### Managing preview deployment branches

Branches created in Neon for preview deployments are not removed automatically, so they may start accumulating in your Neon project after a period of time. You can manage the removal of old branches in the Neon Console or you build this task into to your CI/CD pipeline using the [Neon API](https://neon.tech/api-reference/v2). See [Manage branches](/docs/manage/branches) for information about how to remove branches using the console or API.

It is important to remove old and unused branches. Branches hold a lock on the data they contain, preventing disk space from being reallocated, which can lead to excessive disk space consumption. The Neon Free Tier limits the point-in-time restore window for a project to 7 days. To minimize disk space usage and stay within the Free Tier limits, avoid allowing branches to age beyond the 7 day limit.
