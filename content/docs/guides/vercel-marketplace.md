---
title: Install the Native Neon Postgres Integration on Vercel
enableTableOfContents: true
isDraft: false
updatedOn: '2024-06-14T07:55:54.409Z'
---

The [Vercel Marketplace](https://vercel.com/marketplace) allows you to add native services, like Neon Postgres, to your Vercel project directly from the Vercel platform. With this integration, billing for Neon Postgres and some Neon project management options are managed in Vercel.

<Admonition type="note">
This integration option is intended for Vercel customers who want to add Neon Postgres to their Vercel project. It is assumed that you do not yet have a Neon Postgres account, as this integration creates one for you. If you are an existing Neon customer and want to use Vercel for preview deployments, please see our [Neon Postgres Previews](/docs/guides/vercel) integration. 
</Admonition>

## How to install

To install the Install the **Native Neon Postgres Integration** from the Vercel Marketplace:

1. Navigate to the [Vercel Marketplace](https://vercel.com/marketplace) or to the [Integrations Console](https://vercel.com/neondatabase/~/integrations/console) on your Vercel Dashboard.
2. Locate the **Neon Postgres** integration.
3. Click **Install**.
4. On the **Install Neon Postgres** modal, you are presented with tow options. Select **Install the Neon Postgres Native Integration**, and click **Continue**.
5. On the **Create New Neon Postgres Account** modal, accept the terms and conditions, and click **Create New Neon Postgres Account**.
6. On the **Create Database** modal, select a region and a Neon Plan, and click **Continue**.

   <Admonition type="note">
   A few details about Neon plans are provided on the modal, but for a full overview of plan features and allowances, please refer to the Neon [Pricing](https://neon.tech/pricing) page.
   </Admonition>

7. Specify a **Database Name**, and click **Create**.

   <Admonition type="note" title="A Database in Vercel is a Project in Neon">
   Your **Database Name** in Vercel will be the name of your **Project** in Neon. Just remember that **A "Database" in Vercel = "Project" in Neon**. A Neon project can have multiple Postgres databases. The initial Postgres database created in your Neon project will be named `neondb`. You will see that database name in the database connection after you complete the installation.
   </Admonition>

8. A **Database** is created in Vercel, and you are directed to the **Storage** tab on the Vercel Dashboard where you can view details about your new Database, including:

   - Status
   - Plan
   - Current Period (billing)
   - Period Total (billing)
   - Your database connection string

   From the sidebar, you can view your **Neon Projects**, **Settings**, **Getting Started**, and **Usage**. There's also a link to **Neon Support**.

## Open your Database / Neon Project in the Neon Console

To open your Database / Neon Project in the Neon Console:

1. From the **Storage** tab in the Vercel Dashboard, select your Database.
2. On your Database page, select **Open in Neon Postgres**.
3. In the Neon Console, you are directed the projects page for your Organization. It will be named **Vercel: `<org_name>`**. If you've just installed, you will have a single Neon Project.

<Admonition type="note">
All Neon Plans, including the Free Plan, support multiple Neon Projects. Creating additional projects is performed from the Vercel Dashboard. See [Creating more Databases](#tbd) for instructions.
</Admonition>

### Actions supported only from the Vercel Dashboard

As a user of the Native Neon Postgres Integration, you have access to all Neon features, but there are a few actions that can only be performed from the Vercel Dashboard:

- Neon Projects can only be created or deleted through the Vercel dashboard.
- Organizations cannot be deleted in the Neon Console; they are deleted only if the Native Neon Postgres Integration is uninstalled from Vercel.
- Organization members cannot be added manually through the Neon Dashboard. Members are managed from Vercel.
- Project collaborators cannot be added manually through the Neon Dashboard. Collaborators are managed as Members in Vercel.
- Compute settings, including compute size, autoscaling, and autosuspend settings are managed in Vercel.
- Changing the name of your Neon project (**Database Name** in Vercel) is performed in Vercel.
- Invoices and payments are managed in Vercel, not Neon.
- Plan upgrades and downgrades are managed in Vercel.

## Changing your Database configuration

Configuration changes you can make include:

- Changing the **Database Name** (Project name in Neon)
- Changing the **Compute size**
- Changing **Suspend after period of inactivity** setting (Autosuspend)
- Changing your **Installation Level Plan** (your Neon plan)

To change your configuration:

1. On the Vercel Dashboard, navigate to **Storage** tab.
2. Select **Settings**.
3. In the **Update configuration** section, select **Change Configuration**.
4. Select the desired configurations, and click **Save**.

## Adding more Databases

All Neon Plans, including the Free Plan, support multiple Databases / Neon Projects (remember that **A "Database" in Vercel = "Project" in Neon**).

To create another Database / Neon Project:

1. On the Vercel Dashboard, navigate to your **Integrations** tab.
2. Locate the **Neon Postgres** integration, and click **Manage**.
3. Find the More Products card, and click **Install**.
4. Make your selections for region, compute size settings, and plan on the **Create Database** modal, and click **Continue**.

   <Admonition type="note">
   Remember, if you're adding another "Database", you're' already on a Neon Plan, which will be identified on the modal by a **Current** tag. Select a different plan will change your Neon Plan for all of your "Databases". So, don't select a different plan unless you actually want to change your plan for all of your "Databases".
   </Admonition>

5. Specify a Database Name (this will be your Project name in Neon), and click **Create**.
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
2. Select **Usage** to view the **Usage Report**.

**Usage metrics:**

- **Total cost**: This chart shows total cost over time. Please keep in mind that there is a base monthly that include an allowance of compute and storage. If you've not exceeded your allowances, you see a flat line for total cost reflecting just your monthly charge. If you go over your allowances, the line will show those increases from your baseline monthly fee.
- **Compute time**: This chart shows compute hour usage over time.
- **Synthetic Storage size**: Synthetic storage is your logical data storage size plus your data change history, which supports Neon features like point-in-time restore.

## Changing your plan

When you install the Native Neon Postgres Integration from the Vercel Marketplace, you have access to all the same Neon plans that are available if you signed up for Neon directly. Changing your plan (upgrading or downgrading) is performed in Vercel.

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

## Limitations

When using Native Neon Postgres Integration from the Vercel Marketplace, the following limitations apply:

- If you've installed the Native Neon Postgres Integration, installing the **Neon Postgres Previews Integration** for the same Vercel Account is not supported.

<NeedHelp/>
