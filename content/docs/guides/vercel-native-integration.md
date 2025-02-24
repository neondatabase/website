---
title: Install the Neon Postgres Native Integration on Vercel
subtitle: Add Neon Postgres storage to your Vercel project as a first-party native
  integration
enableTableOfContents: true
isDraft: false
updatedOn: '2025-02-20T02:00:36.060Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>What is the Neon Postgres Native Integration</p>
<p>How to install Neon Postgres from the Vercel Marketplace</p>
<p>How to manage your integration</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/guides/vercel-previews-integration">Neon Postgres Previews Integration</a>
<a href="/docs/introduction/plans">Neon plans</a>
</DocsList>
</InfoBlock>

## About the integration

**What is the Neon Postgres Native Integration?**

The [Vercel Marketplace](https://vercel.com/marketplace) allows you to add Neon Postgres to your Vercel project as a [native integration](https://vercel.com/docs/integrations/install-an-integration/product-integration).

- Installing the integration creates a Neon account for you if you do not have one already.
- Billing for Neon Postgres is managed in Vercel, not Neon.
- You get access to the same features and [Neon pricing plans](/docs/introduction/plans) as users who register with Neon directly, including access to your database from the Neon Console.

<Admonition type="note">
The **Neon Postgres Native Integration** is intended for Vercel users who want to add Neon Postgres to their Vercel project as a first-party native integration.
- You cannot install this integration if you currently have Vercel Postgres installed. Please see [Transitioning from Vercel Postgres](/docs/guides/vercel-overview#transitioning-from-vercel-postgres) for details about when Vercel will transition Vercel Postgres users to Neon.
- If you are an existing Neon user, installing the integration will add a new Neon organization named **Vercel: `<vercel_team_name>`** to your existing Neon account, assuming your Neon and Vercel accounts use the same email address.
- If you are an existing Neon user and want create a database branch for each preview deployment in Vercel, use the [Neon Postgres Previews Integration](/docs/guides/vercel-previews-integration) instead. The native integration does not yet support automatic database branches for Vercel preview deployments.
</Admonition>

## How to install

To install the **Neon Postgres Native Integration** from the Vercel Marketplace:

1. Navigate to the [Vercel Marketplace](https://vercel.com/marketplace).
2. Locate the **Neon** integration.
3. Click **Install**.
4. On the **Install Neon** modal, you are presented with two options. Select **Create New Neon Account**, and click **Continue**.
   ![Select the native integration option](/docs/guides/vercel_select_native.png)

5. On the **Create New Neon Account** modal, accept the terms and conditions, and click **Create New Neon Account**.
6. On the **Create Database** modal, select a region, choose a Neon plan, and click **Continue**.

   <Admonition type="note">
   For an overview of what comes with each Neon Plan, please refer to the Neon [Pricing](https://neon.tech/pricing) page.
   </Admonition>

7. Specify a **Database Name**, and click **Create**.

   <Admonition type="note" title="A Database in Vercel is a Project in Neon">
   Your **Database Name** in Vercel will be the name of your **Project** in Neon.
   </Admonition>

8. A **Database** is created in Vercel, and you are directed to the **Storage** tab on the Vercel Dashboard where you can view details about your new Database, including:

   - Status
   - Plan
   - Current Period (billing)
   - Period Total (billing)
   - Your database connection string

   From the sidebar, you can view your **Projects** (Vercel projects connected to the database), **Settings**, **Getting Started**, and **Usage**. There are also links to various resources including, including **Neon Support**.

## Open your Database / Neon Project in the Neon Console

To open your Database / Neon Project in the Neon Console:

1. From the **Storage** tab in the Vercel Dashboard, select your Database.
2. On your Database page, select **Open in Neon**.
3. In the Neon Console, you are directed the your project Dashboard. Your project exists within an "Organization" in Neon, which will be named **Vercel: `<organization_name>`**. If you're a new Neon user, you will have a single Neon Project, and your Organization name in Neon will be the name of your Vercel account. For example, if your Vercel account name is **Alex's projects**, your Neon Organization name will be **Vercel: Alex's projects**.

<Admonition type="note">
All Neon Plans, including the Free Plan, support multiple Neon Projects (a.k.a "Databases" in Vercel). Creating additional "Databases/Projects" is performed from the Vercel Dashboard. See [Adding more Databases](#adding-more-databases) for instructions.
</Admonition>

### Actions supported only from the Vercel Dashboard

As a user of the Neon Postgres Native Integration, you have access to all Neon features. However, some actions normally performed in the Neon Console are either not supported or only available through the Vercel Dashboard:

- **Project/Database Management**:

  - **Databases** (a.k.a "Projects" in Neon) can only be created or deleted through the Vercel Dashboard. See [Adding more databases](#adding-more-databases) and [Deleting your database](#deleting-your-database).
  - **Organization Deletion**: Organizations cannot be deleted in the Neon Console; they are deleted if the Neon Postgres Native Integration is uninstalled from Vercel.

- **User & Collaborator Management**:

  - [Organization](/docs/manage/organizations) members are managed in Vercel, not manually added through the Neon Dashboard.
  - [Organization deletion](/docs/manage/orgs-manage#delete-an-organization) is not supported for Neon organizations created by the native integration. You can only delete this organization by deleting the associated Database in Vercel.
  - [Project transfer](/docs/manage/orgs-project-transfer) is not supported to or from a Neon organization created by the native integration.
  - [Project collaborators](/docs/guides/project-collaboration-guide) are also managed as Members in Vercel.

- **Compute Settings**:

  - Compute settings like size, autoscaling, and scale to zero are managed in Vercel. See [Changing your Database configuration](#changing-your-database-configuration).

- **Project Naming**:

  - Changing your Neon project name (**Database Name** in Vercel) is done in Vercel. See [Changing your Database configuration](#changing-your-database-configuration).

- **Billing & Payments**:
  - Invoices, payments, and plan changes (upgrades/downgrades) are managed in Vercel.

## Connect a Vercel project to a Neon database

You can connect your a Vercel project to a Neon database and optionally create a database branch for each Vercel preview deployment.

To connect your Vercel project to your Neon database:

1. From the **Storage** tab in the Vercel Dashboard, select your Database.
2. On your Database page, select **Connect Project**.
3. Select the Vercel project you want to connect and the environments you want to add database environment variables to (**Development**, **Preview**, **Production**).
4. Optionally, under **Advanced Options**, you can:

   - Specify an **Environment Variables Prefix** for the database environment variables that will be added to your Vercel project. A prefix is not required but may help you track and identify variables later.
   - Under **Deployments Configuration**, you can toggle the **Required** option and select **Preview** to create a Neon branch with every preview deployment (the **Development** and **Production** options here do not do anything — you can ignore them). Enabling the **Required** option means that a database branch must be created for each preview deployment.

   <Admonition type="note" title="A database branch for every preview deployment">
   A Neon branch with every Vercel preview deployment creates an isolated copy of your database that you can modify without affecting your production database. This means you can preview both application and database changes together.
   </Admonition>

5. Click **Connect** to finish the setup.

   If you enabled database branching for preview deployments, each commit to a new branch in GitHub creates a database branch in Neon.

   For more about this database branching setup, refer to our detailed guide: [Vercel Native Integration Previews](/docs/guides/vercel-native-integration-previews).

## Changing your Database configuration

Configuration changes you can make include:

- Changing the **Database Name** (Project name in Neon)
- Changing the **Compute size**
- Changing the scale to zero setting
- Changing your **Installation Level Plan** (your Neon plan)

To change your configuration:

1. On the Vercel Dashboard, navigate to **Storage** tab.
2. Select **Settings**.
3. In the **Update configuration** section, select **Change Configuration**.
4. Select the desired configurations, and click **Save**.

## Adding more Databases

All Neon Plans, including the Free Plan, support multiple Databases / Neon Projects (remember that **A "Database" in Vercel is a "Project" in Neon**).

To create another Database / Neon Project:

1. On the Vercel Dashboard, navigate to your **Integrations** tab.
2. Locate the **Neon Postgres** integration, and click **Manage**.
3. Find the **More Products** card, and click **Install**.
4. Make your selections for the region, scale to zero suspend time, and plan on the **Create Database** modal, and click **Continue**. For more about scale to zero, see [Scale to zero](/docs/introduction/scale-to-zero). Only the **Default** suspend setting is supported on the Free Plan.

   <Admonition type="note">
   Remember, if you're adding another "Database", you're' already on a Neon Plan, which will be identified on the modal by a **Current** tag. Select a different plan will change your Neon Plan for all of your "Databases". So, don't select a different plan unless you actually want to change your plan for all of your "Databases".
   </Admonition>

5. Specify a **Database Name** (this will be the **Project name** in Neon), and click **Create**.
6. A new **Database** is created in Vercel, and you are directed to the **Storage** tab on the Vercel Dashboard where you can view details about your new Database, including:

   - Status
   - Plan
   - Current Period (billing)
   - Period Total (billing)
   - Your database connection string

   From the sidebar, you can view your **Neon Projects**, **Settings**, **Getting Started**, and **Usage**. There's also a link to **Neon Support**.

## Monitoring usage

You can monitor usage in Vercel or in the Neon Console. For information about monitoring usage in the Neon Console, see [Monitor billing and usage](/docs/introduction/monitor-usage).

To monitor usage in Vercel:

1. On the Vercel Dashboard, navigate to **Storage** tab.
2. Select **Usage** to view the **Usage Report** for available metrics.

## Changing your plan

When you install the Neon Postgres Native Integration from the Vercel Marketplace, you have access to all the same Neon plans that are available to anyone signing up for Neon directly. Changing your plan (upgrading or downgrading) is performed in Vercel.

1. On the Vercel Dashboard, navigate to **Storage** tab.
2. Select **Settings**.
3. In the **Update configuration** section, select **Change Configuration**.
4. Select the desired **Installation plan**, and click **Save**.

For an overview of Neon's plans, please visit our [Pricing](https://neon.tech/pricing) page.

## Deleting your Database

Deleting a database in Vercel deletes your project in Neon and all of its data.

To delete your database:

1. On the Vercel Dashboard, navigate to **Storage** tab.
2. Select **Settings**.
3. Navigate to the Delete Database section and follow the instructions.

This action is not reversible, so please proceed with caution.

## Environment variables set by the integration

The environment variables listed below are set by the integration. Please note the following:

- The `DATABASE_URL` variable is a pooled Neon connection string. Connection pooling in Neon uses PgBouncer. For more, see [Connection pooling](/docs/connect/connection-pooling).
- `DATABASE_URL_UNPOOLED` is an direct connection string for your database, often required by schema migration tools. For more, see [Connection pooling with schema migration tools](/docs/connect/connection-pooling#connection-pooling-with-schema-migration-tools).
- There are several variables provided for constructing your own connection settings.
- The integration sets variables that were previously used by Vercel Postgres. These variables support [Vercel Postgres Templates](https://vercel.com/templates/vercel-postgres), which you can now use with Neon Postgres.

```bash
# Recommended for most uses
DATABASE_URL

# For uses requiring a connection without pgbouncer
DATABASE_URL_UNPOOLED

# Parameters for constructing your own connection string
PGHOST
PGHOST_UNPOOLED
PGUSER
PGDATABASE
PGPASSWORD

# Parameters for Vercel Postgres Templates
POSTGRES_URL
POSTGRES_URL_NON_POOLING
POSTGRES_USER
POSTGRES_HOST
POSTGRES_PASSWORD
POSTGRES_DATABASE
POSTGRES_URL_NO_SSL
POSTGRES_PRISMA_URL
```

## Limitations

- When using the Neon Postgres Native Integration, installing the [Neon Postgres Previews Integration](/docs/guides/vercel-previews-integration) on the same Vercel Project is not supported. However, the Neon Postgres Native Integration also supports database branches for preview deployments. See [Vercel Native Integration Previews](/docs/guides/vercel-native-integration-previews).

- To use the Neon CLI with the Neon Postgres Native Integration, you must authenticate connections from the CLI client using a Neon API key. Please see [Neon CLI — API keys](/docs/reference/cli-install#api-key). The `neon auth` command requires an account registered through Neon rather than Vercel.

<NeedHelp/>
