---
title: Vercel Native Integration Previews
subtitle: Create a database branch for every preview deployment with Neon's native Vercel integration 
enableTableOfContents: true
isDraft: false
updatedOn: '2024-12-11T21:23:33.087Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>How to create a database branch for each preview deployment</p>
<p>The benefits of a branch for every preview deployment</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/guides/vercel-native-integration">Neon Postgres Native Integration</a>
</DocsList>
</InfoBlock>

The [Neon Postgres Native Integration](https://vercel.com/marketplace/neon), available on the Vercel Marketplace, allows you to add a Postgres database to your Vercel project. You can optionally configure the integration to create a database branch for each Vercel preview deployment. This guide explains how to set up that configuration.

<details>
<summary>Why create a database branch with each preview deployment?</summary>

- **Each preview deployment gets its own database**: Every Vercel preview deployment has its own dedicated database branch, keeping environments isolated.

- **No more shared database problems**: Using a single shared database can lead to issues across all preview deployments if something goes wrong. With branches, each preview has its own independent database.

- **Easier debugging and testing**: Database branches let you preview schema changes and migrations in isolation, so issues don’t spill over into other environments.

- **No need to set up preview databases manually**: Neon branches are created instantly as copies of the parent database, saving you the hassle of seeding data or setting up databases from scratch.

- **Works automatically with Vercel**: The integration connects Neon database branches to Vercel preview deployments and sets the environment variables for you.

- **Great for teams**: Isolated branches let team members test their changes independently without stepping on each other’s toes.

- **Automatic schema migrations**: You can add database migration commands to your Vercel deployment setup to apply schema changes to your database branch automatically with each preview deployment.

</details>

## Prerequisites

- You're a Vercel user and you've installed Neon's [Native Vercel Integration](https://vercel.com/marketplace/neon) from the Vercel Marketplace. For instructions, see [Install the Neon Postgres Native Integration on Vercel](/docs/guides/vercel-native-integration).
- You have an existing Neon Database in Vercel, accessible from the **Storage** tab on the Vercel Dashboard. If not, see [Adding Databases](/docs/guides/vercel-native-integration#adding-more-databases).
- Your Vercel project is **not** yet connected to a Neon Database in Vercel. If your database is already connected, you will need to disconnect before performing the setup. See [Disconnecting a database](#disconnecting-a-database).

## Connect your Vercel project to a Neon database 

To connect your Vercel project to your Neon database:

1. On the Vercel Dashboard, open your Vercel project. 
2. Navigate to the **Storage** tab and select your Database (or create a Database if you do not have one).
2. Find the Database you want to connect to, and click **Connect**.

    ![Connect a Vercel Project](/docs/guides/vercel_native_connect_project.png)

3. Select the environments you want to make your database available to (**Development**, **Preview**, **Production**). This will add a set of database [environment variables](/docs/guides/vercel-native-integration#environment-variables-set-by-the-integration) to the selected environments in your Vercel project.

    ![Select a Vercel Project](/docs/guides/vercel_native_select_environments.png)

4. Under **Advanced Options**:
    1. Enable the **Required** option under "Deployments Configuration". This setting ensures that a database branch is created for each preview deployment; otherwise, the preview deployment fails.
    1. Under **Create a database branch for deployment**, select **Preview**. This setting creates a database branch for **preview** deployments only. Leave the **Development** and **Production** options unchecked — they do not do anything, and you don't need to create database branches for those environments.

    ![Vercel deployment configuration](/docs/guides/vercel_native_deployments_configuration.png)

5. Click **Connect** to finish the setup.

    Now, with each commit to a branch in your application's GitHub repository, preview deployments will be created with their own isolated database branch. You can follow the steps in the next section to test the setup.
    
    <Admonition type="tip">
    To learn how you can apply schema changes to database branches automatically, see [Applying schema changes to database branches](#applying-schema-changes-to-database-branches). 
    </Admonition> 

## Testing the database branching setup

After enabling database branches for preview deployments, a database branch is created when you push commits on your local git branch to your source code repository. To see the integration in action, follow these steps:

1. Create a branch in your local source code repository.

   ```bash
   cd myapp
   git checkout -b patch-1
   ```

2. Make changes to your application code on the local branch. This could be any change to your application or database schema, assuming your database schema is managed in code (see [Applying schema changes to database branches](#applying-schema-changes-to-database-branches).
3. Commit the changes. For example:

   ```bash
   git commit -a -m "Update my app"
   ```

4. Push your commit to the remote repository:

   ```bash
   git push
   ```

   Pushing the commit triggers the following actions:

   - The commit triggers a preview deployment in Vercel, as would occur without the Neon integration, which you can view on the **Deployments** tab on the Vercel Dashboard.
   - The integration creates a branch in Neon. This branch is an isolated copy of your default branch, with its own dedicated compute. The branch is created with the same name as your `git` branch but includes a `preview/` prefix. You can view view branches in the Neon Console, on your Neon project's **Branches** page.
   - The integration automatically passes environment variables for your database branch to connect the preview deployment to the database branch.
        <Admonition type="info" title="How are database variables set for preview deployments?">
        Vercel calls a webhook before the preview deployment build stage. During this call, environment variables for the new database branch are created. These variables override the existing preview environment variables in Vercel but apply only to the specific preview deployment they were created for. The preview environment variables visible in Vercel remain unchanged across preview deployments.
        </Admonition>

## Applying schema changes to database branches

If you're managing your database schema in code using a tool like Prisma Migrate or Drizzle ORM, you can add build commands, including a schema migration command, to your Vercel deployment configuration. This way, you can preview application and database changes together, which is one of the key advantages of this configuration.

To add build commands to your Vercel project previews:

1. On the Vercel Dashboard, open your Vercel project.
2. Navigate to the **Settings** tab.
3. On the **General** page, navigate to the **Build & Development Settings** section.
4. Enable the **Override** option and enter your build commands, including your schema migration command. For example, if you're using Prisma, you might enter the following commands to apply database migrations, generate the Prisma Client, and run your build:

    ```text
    npx prisma migrate deploy && npx prosma generate && next build
    ```

    As shown below:

    ![Vercel build commands](/docs/guides/vercel_build_command.png)

    This setup applies any schema changes in your commits to the database branch created for your preview deployment.

## Disconnecting a database

To disconnect a Neon database from a Vercel project:

1. On the Vercel Dashboard, open your Vercel project. 
2. Navigate to the **Storage** tab and select your Database.
3. In the left-hand navigation on your database page, select **Projects**.
4. Under **Projects**, select your project, and select **Remove Project Connection** from the menu.

This will disconnect the database from your Vercel project by removing all of the Neon database environment variables from your Vercel project. After disconnecting a database, branches will no longer be created with each preview deployment. However, any previously created database branches will not not deleted. You have to remove those branches manually if you no longer want them.

## Manage branches created by the integration

The integration creates a database branch for each preview deployment. To avoid using up your storage allowances or hitting branch limits, you should delete database branches that are no longer required. Branches can be deleted via the [Neon Console](/docs/manage/branches#delete-a-branch), [CLI](/docs/reference/cli-branches#delete), or [API](https://neon.tech/docs/manage/branches#delete-a-branch-with-the-api).

<Admonition type="note" title="What happens to branches if you don't remove them?">
Unused branches are eventually archived, consuming space in archive storage. For more information, see [Branch archiving](/docs/guides/branch-archiving).
</Admonition>

<NeedHelp/>
