---
title: Connect with the Neon Vercel Integration
subtitle: Learn how to connect your Vercel project to Neon using the Neon Vercel
  Integration
enableTableOfContents: true
updatedOn: '2023-12-22T16:01:34.803Z'
---

This guide describes how to connect using the [Neon Vercel Integration](https://vercel.com/integrations/neon) from the Vercel marketplace. The integration connects your Vercel project to a Neon database and enables creating a database branch for each preview deployment.

<Admonition type="note">
This is a Beta version of the Neon Vercel Integration. For assistance or to suggest improvements, contact [vercel-feedback@neon.tech](mailto:vercel-feedback@neon.tech) or post in the [Neon community](https://community.neon.tech/).
</Admonition>

## About the Neon Vercel Integration

Vercel [preview deployments](https://vercel.com/docs/concepts/deployments/preview-deployments) enable teams to collaborate effectively by automatically creating an isolated, production-like environment for every commit. This allows changes to be previewed before they are merged into production.

However, when databases are involved, teams often use a single database containing dummy data for all preview deployments. This setup is not ideal for these reasons:

- If the shared database encounters an issue, so will all preview deployments.
- Changes to the shared database schema might break all previously created preview deployments, making it a productivity bottleneck.

![Shared database](/docs/guides/vercel_shared_database.webp)

Neon’s branching feature addresses these challenges. A branch is a copy-on-write clone of your data, so creating it only takes a few seconds. This makes it a scalable and cost-effective solution for preview deployments, enabling you to create a branch for each pull request.

![Branch database](/docs/guides/vercel_branch_database.webp)

When you push changes to the GitHub repository associated with your Vercel project, triggering a preview deployment, the integration automatically creates a database branch in Neon and connects it to your preview deployment by setting Vercel preview environment variables.

## Add the Neon Vercel Integration

This topic describes how to add the Neon Vercel Integration to your Vercel project.

<Admonition type="important">
Please be aware that the Neon Vercel Integration connects one Vercel project to one Neon project. It does not support connecting multiple Vercel projects to one Neon project, nor does it support connecting multiple Neon projects to one Vercel project.

The Neon Vercel Integration is currently only supported with the GitHub source code repository.
</Admonition>

Prerequisites:

- A [Vercel account](https://vercel.com).
- A Vercel project. If you do not have one, see [Creating a project](https://vercel.com/docs/concepts/projects/overview#creating-a-project), in the _Vercel documentation_.
- The integration sets the `PGHOST`, `PGUSER`, `PGDATABASE`, `PGPASSWORD`, and `DATABASE_URL` environment variables for your Vercel production, development, and preview environments. Ensure that these variables do not already exist in your Vercel project settings. For more information, see [Troubleshoot connection issues](#troubleshoot-connection-issues).

To add the integration:

1. Navigate to the [Neon Vercel Integration page](https://vercel.com/integrations/neon), and click **Add integration**.
   ![Add integration](/docs/guides/vercel_add_integration.png)
1. Select a Vercel Account to add the integration to.
1. Select the Vercel projects to which the integration will be added. You can select **All Projects** to make the integration available for use with multiple Vercel projects, or you can select **Specific Projects** to make it available for a selected project, but be aware that you can only connect one Vercel project to one Neon project and vice versa. 
1. Review the permissions required by the integration, and click **Add Integration**.
1. In the **Integrate Neon** dialog:
    1. Select a Vercel project.
      ![Select a Vercel project](/docs/guides/vercel_select_project.png)
    1. Select the Neon project, database, and role that Vercel will use to connect.
      ![Connect to Neon](/docs/guides/vercel_connect_neon.png)

          The root branch of your Neon project is preselected as your **Production branch**.

          The **Create a branch for your development environment** option creates a branch named `vercel-dev` and sets Vercel development environment variables for it. The `vercel-dev` branch is a copy-on-write clone of your production branch that you can modify without affecting your production branch.

          When you finish making selections, click **Continue**.
    1. Confirm the integration settings. This allows the integration to:
      - Set environment variables for your Vercel project's production, development, and preview environments.
      - Create database branches for preview deployments.
      - Create a development branch for your Vercel development environment.
      ![Confirm integration settings](/docs/guides/vercel_confirm_settings.png)
    1. Click **Connect** to confirm and proceed with the integration. If you encounter a connection error, see [Troubleshoot connection issues](#troubleshoot-connection-issues).

        After the settings are configured, you are presented with a **Success!** dialog.
        ![Vercel integration success](/docs/guides/vercel_success.png)
    1. Click **Done** to complete the installation.
1. To view the results of the integration in Neon:
    1. Navigate to the [Neon Console](https://console.neon.tech/).
    1. Select the project you connected to.
    1. Select **Branches**.
       You will see the root branch of your project. If you created a development branch, you will also see a `vercel-dev` branch.
       ![Neon branches](/docs/guides/vercel_neon_branches.png)
1. To view the results of the integration in Vercel:
    1. Navigate to [Vercel](https://vercel.com/).
    1. Select the Vercel project you added the integration to.
    1. Select **Settings** > **Environment Variables**.
       You should see the `PGHOST`, `PGUSER`, `PGDATABASE`, `PGPASSWORD`, and `DATABASE_URL` variable settings added by the integration.
       ![Vercel environment variables](/docs/guides/vercel_env_variables.png)

## Use the Neon Vercel Integration

After you add the Neon Vercel Integration to a Vercel project, Neon creates a database branch for each preview deployment. The branch is created when you push commits made on your local branch to your application's GitHub repository. To see the integration in action, follow these steps:

1. Create a branch in your local GitHub repository.

   ```bash
   cd myapp
   git checkout -b myapp-update
   ```

2. Make changes to your application on the local branch.
3. Commit the changes. For example:

   ```bash
   git commit -a -m "Update my app"
   ```

4. Push your commit to the remote repository:

   ```bash
   git push
   ```

   Pushing the commit triggers the following actions:

   - The commit triggers a preview deployment in Vercel, as would occur without the Neon integration.
     ![Neon preview deployment branch](/docs/guides/vercel_deployments.png)
   - The integration creates a database branch in Neon. This branch is an isolated copy-on-write clone of your production branch, with its own dedicated compute endpoint. The branch is created with the same name as your `git` branch.
     ![Neon preview deployment branch](/docs/guides/vercel_neon_app_update.png)
   - The integration sets Vercel preview environment variables to connect the preview deployment to the new database branch.
     ![Vercel preview settings](/docs/guides/vercel_preview_settings.png)

<Admonition type="note">
The Neon Free Tier allows you to create up to 10 branches. To avoid running out of branches for new preview deployments, remove old branches regularly. See [Manage branches](/docs/manage/branches) for instructions.
</Admonition>

## Make the integration available to other Vercel projects

If you added the Neon Vercel Integration to a single Vercel project but would like to make it available for use with your other Vercel projects, complete the steps outlined below.

<Admonition type="important">
Please be aware that the Neon Vercel Integration connects one Vercel project to one Neon project. It does not support connecting multiple Vercel projects to one Neon project, nor does it support connecting multiple Neon projects to one Vercel project. The steps below outline how to make the integration available to other Vercel projects to use with their own separate and dedicated Neon project.
</Admonition>

1. Ensure that the Neon Vercel Integration that you added previously has access to the Vercel project.
   1. On the Vercel Dashboard, select **Integrations**.
   1. Find the Neon Postgres integration, and select **Manage**.
   1. On the Neon Postgres integration page, select **Manage Access**.
   1. On the **Manage Access for Neon Postgres** modal, make sure that the Neon integration has access to the Vercel project. You can do so by selecting **Specific Projects** and choosing a Vercel project, or by granting access to **All Projects**. If you previously granted access to all projects, no change is necessary.
   1. Click **Save**.
1. Navigate to this URL: [https://vercel.com/integrations/neon/new](https://vercel.com/integrations/neon/new).
1. Follow the prompts. When you reach the **Integrate Neon** dialog, select the Vercel project that you want to add the integration to. Vercel projects that are already integrated with Neon are identified as `CONNECTED`.
   ![Confirm integration settings](/docs/guides/vercel_add_new_project.png)
1. Complete the steps outlined in [Add the Neon integration](#add-the-neon-vercel-integration). When you select a Neon project to connect to, be sure to select one that is not already connected to a Vercel project, as you cannot connect one Vercel project to multiple Neon projects or vice versa. 

## Troubleshoot connection issues

If the environment variables configured by the Neon integration already exist, you may encounter the following error due to an existing integration that sets one or more of the same environment variables.

<CodeBlock shouldWrap>

```text
Failed to set environment variables in Vercel. Please make sure that the following environment variables are not set: PGHOST, PGUSER, PGDATABASE, PGPASSWORD, DATABASE_URL
```

</CodeBlock>

In this case, you can remove or rename the existing environment variables in your Vercel project settings and retry the Neon integration.

1. From the Vercel project page, select **Settings**.
2. Locate the environment variables required by the Neon integration and remove or rename them.

   <Admonition type="note">
   Alternatively, you can remove the conflicting integration, assuming it no longer required. This may be a previous Neon integration or another integration. Removing the integration removes the variables set by the integration.
   </Admonition>

3. Try adding the Neon integration again. See [Add the Neon Vercel Integration](#add-the-neon-vercel-integration).

## Manage the Neon Vercel Integration

To view integration permissions, manage integration access, or remove the Neon integration:

1. On the Vercel dashboard, select **Settings** > **Integrations**.
1. Find the **Neon** integration and select **Manage**.

   <Admonition type="note">
   Removing the Neon Vercel Integration removes the Vercel environment variables set by the integration. It does not remove Neon branches created by the integration. To remove Neon branches, see [Delete a branch](/docs/manage/branches#delete-a-branch).
   </Admonition>

<NeedHelp/>
