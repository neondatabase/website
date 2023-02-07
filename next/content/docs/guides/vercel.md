---
title: Connect Vercel and Neon
enableTableOfContents: true
isDraft: false
---

This guide describes how to connect your Vercel project with Neon using the [Neon integration from the Vercel marketplace](https://vercel.com/integrations).

<Admonition type="note">
This is a Beta version of Neon’s Vercel integration. For assistance or to suggest improvements, contact [vercel-feedback@neon.tech](mailto:vercel-feedback@neon.tech).
</Admonition>

## What the Neon integration does

The Neon-Vercel integration connects your Vercel project to a Neon project. If you do not have a Neon project, you can create one when adding the integration. While deploying the integration, you will select a database from the `main` branch of your Neon project. This will be your production database.

Once the integration is deployed, it will create a branch in Neon for each git branch created by a Vercel [preview deployment](https://vercel.com/docs/concepts/deployments/preview-deployments), allowing you to take advantage of Neon's branching capabilities.

Optionally, based on your selection, the integration also creates a development branch, which you can use with your Vercel development environment instead of a local database. The development branch is a copy of your production branch that you can modify without affecting your production data.

The integration sets these environment variables in Vercel:

- `PGHOST`
- `PGUSER`
- `PGDATABASE`
- `PGPASSWORD`
- `DATABASE_URL`

The variables are set in your production, development, and preview environments, as required.

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
    1. Select a Neon project, a database, and role that Vercel will use to connect. The Neon Free Tier supports a single project per user. If you do not have a Neon project, you can create one. If desired, you can also create a new database and role for the integration.

        The database that you select becomes your production database. This database must reside on the root branch of your Neon project. The root branch is preselected for you.

        You are given the option to create a branch for your Vercel development environment. When this option is selected (the default), the integration creates a branch named **dev** and sets environment variables for it.

        When you have finished making your selections, click **Continue**.
    1. Confirm the integration settings. By clicking **Confirm**, you are permitting the integration to perform the following actions:
        - Set the environment variables outlined above for your Vercel production, development, and preview environments, as required.
        - Reset the database user's password, which enables the integration to configure the `PGPASSWORD` and `DATABASE_URL` environment variables, which require a password.
        - Create database branches and endpoints for preview deployments.
        - Create a development branch for your Vercel development environment (if you selected that option)

        Click **Continue** to accept the settings.

    Once the integration is added, you are presented with a **Success!** screen where you can copy the new password for your database user. It is recommended that you save the password, as you will not be able to access it again. If you misplace the password, a reset will be required.
1. To view the results of the integration in Neon:
    1. Navigate to the [Neon Console](https://console.stage.neon.tech/).
    1. Select the project you connected to.
    1. Select **Branches**.
    You will see the `main` branch of your project, and if you created a development branch, you will also see a `dev` branch.
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

1. From the Vercel dashboard, select **Settings**.
1. Locate the environment variables required by the Neon integration (one or more of the variables mentioned in the error message) and remove it.

    <Admonition type="note">
    Alternatively, instead of removing environment variables individually, you can remove the conflicting integration, assuming it no longer required. This may be a previous Neon integration or another integration. Removing the integration removes the variables set by the integration.
    </Admonition>

1. Once you have removed the variables, try adding the Neon integration again. See [Add the Neon integration](#add-the-neon-integration).

For more information about project settings in Vercel, see [Project settings](https://vercel.com/docs/concepts/projects/overview#project-settings). For information about Vercel environment variables, see [Environment variables](https://vercel.com/docs/concepts/projects/environment-variables).

If you attempt to add the integration with the **dev** branch option selected and the Neon project already has a branch named **dev**, you will receive the following error:

```text
A branch with the provided name already exists
```

In this case, remove the existing **dev** branch and retry the integration. Alternatively, use a different Neon project. In either case, ensure that the environment variables set by the previous Neon integration or previous integration attempt are removed first.

## Manage your Neon integration

To view integration permissions, manage integration access, or remove the Neon integration:

1. On the Vercel dashboard, select **Settings** > **Integrations**.
1. For the **Neon** integration, select **Manage**.

## Using the Neon integration with Vercel Preview Deployments

Vercel Preview Deployments enable teams to preview changes to an application in a live, production-like environment without merging those changes to the Git project's production branch, enabling anyone with access to the preview to provide feedback before the changes are merged.

However, when databases are involved, teams are often forced to share a single database containing dummy data across all preview deployments. This setup is not ideal for several reasons:

- Preview deployments with dummy data do not accurately represent production.
- If the shared database encounters an issue, so will all preview deployments.
- Changes to the shared database schema affect all preview deployments, which can make the database a productivity bottleneck.

To address these issues, some teams will provision a database containing dummy data for each Preview Deployment. While this is a better experience, Preview Deployments still do not accurately represent production, which leads some teams to provision preview databases with a full copy of production data as part of their CI/CD pipeline.

The main downside of this approach is the time it takes for a preview deployment to be ready,  which depends on the amount of data to be imported. The larger the application’s database, the longer it takes to crate a preview deployment, negatively impacting developer productivity.

Neon’s branching feature addresses all these challenges. A branch in Neon is a copy-on-write clone of your data, which allows the branch to be created instantly for every pull request. This makes Neon branching a scalable and cost-effective solution for Preview Deployments. After setting up the integration, each Preview Deployment will automatically have its own isolated, production-like database.

To use the integration with Preview Deployments:

1. Add the Neon integration to your Vercel project, as described above.
2. Ensure that the database connection settings in your application correspond to the environment variable settings configured by the Neon integration. For example, if your applications's database connection is defined by a `DATABASE_URL` variable, make sure that setting in your application corresponds to the `DATABASE_URL` setting configured by the Neon integration. You can find the environment variable settings in Vercel by navigating to the Vercel dashboard, selecting your project, and selecting **Settings** > **Environment Variables**. In addition to `DATABASE_URL` variable, the integration sets the following environment variables, which may be used by some application frameworks instead of the `DATABASE_URL` variable:

    - `PGHOST`
    - `PGUSER`
    - `PGDATABASE`
    - `PGPASSWORD`

    <Admonition type="note">
    After adding the integration and setting the environment variables in your application, you may have to redeploy your application in Vercel for the environment variables set by the integration to take effect.
    </Admonition>

3. After the integration is added and the environment variables in your application are configured to match those in your Vercel project, each pull request creates a branch in Neon and automatically configures the database environment variables mentioned above for your Vercel preview environment, allowing the preview to connect to the database the branch.

### Managing branches

Database branches created for preview deployments are not removed from Neon automatically, so branches may start to accumulate in your Neon project after a period of time. You can manage the removal of old branches in the Neon Console or you can add this task to your CI/CD pipeline using the [Neon API](https://neon.tech/api-reference/v2). See [Manage branches](/docs/manage/branches) for information about how to remove branches using the console or API.

When working with branches, it is important to remove old and unused branches. Branches hold a lock on the data they contain, preventing disk space from being reallocated, which can lead to excessive disk space consumption. The Neon Free Tier limits the point-in-time restore window for a project to 7 days. To minimize disk space usage and stay within the Free Tier limits, avoid allowing branches to age beyond the 7-day window.
