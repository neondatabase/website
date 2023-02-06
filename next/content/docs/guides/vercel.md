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

        The database that you select becomes your production database. This database must reside on the `main` branch of your Neon project. The `main` branch is preselected for you.

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
