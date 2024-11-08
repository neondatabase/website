---
title: Install the Native Neon Postgres Integration
enableTableOfContents: true
isDraft: false
updatedOn: '2024-06-14T07:55:54.409Z'
---

The [Vercel Marketplace](https://vercel.com/marketplace) allows you to add native services, like Neon Postgres, to your Vercel project directly from the Vercel platform. With this integration, billing for Neon Postgres and some Neon project management options are managed in Vercel. 

<Admonition type="note">
This integration option is intended for Vercel customers who want to add Neon Postgres to their Vercel project. It is assumed that you do not yet have a Neon Postgres account, as this integration creates one for you. If you are an existing Neon customer and want to use Vercel for preview deployments, please see our [Neon Postgres Previews] integration. 
</Admonition>

## Install Neon from the Vercel Marketplace

To install Neon from the Vercel Marketplace:

1. Navigate to the [Vercel Marketplace](https://vercel.com/marketplace) or to the [Integrations Console](https://vercel.com/neondatabase/~/integrations/console) on your Vercel Dashboard.
2. Locate the **Neon Postgres** integration.
3. Click **Install**.
4. On the **Install Neon Postgres** modal, you are presented with tow options. Select **Install the Neon Postgres Native Integration**, and click **Continue**.
5. On the **Create New Neon Postgres Account** modal, accept the terms and conditions and click **Create New Neon Postgres Account**.
5. On the **Create Database** modal, select a region and a Neon Plan, and click **Continue**.

   <Admonition type="note">
   Some details about Neon plans are provided, but for a full comparison, please refer to the Neon [Pricing](https://neon.tech/pricing) page.
   </Admonition> 

6. Specify a **Database Name**, and click **Create**.
7. A database is created, and you are directed to the **Storage** tab on the Vercel Dashboard where you can view details about your Neon database, including:

   - Status
   - Plan
   - Current Period (billing)
   - Period Total (billing)
   - Your database connection string
   
   From the sidebar, you can view your Neon **Projects**, **Setting**, the **Getting Started**, and **Usage**. There's also a link to **Support**.

## Open your Neon project in the Neon Console

To open Neon Project in the Neon Console:

1. From the **Storage** tab in the Vercel Dashboard, select your Neon database.
2. On your Neon database page, select **Open in Neon Postgres**.
3. In the Neon Console, you are directed the projects page for your **Vercel: `<org_name>`** organization. If you've just installed, you will have a single project containing database you created earlier.

### Neon Console Access

Accessing the Neon Console is straightforward via the Vercel dashboard. You can open the Neon Console from either the Integration installation page or the Neon service page. Depending on where you access it, you will either land on the Neon project dashboard or be redirected to the relevant Neon project.

The Neon Console provides tools like:

- **SQL Editor**: Run SQL queries directly on your database.
- **Table Editor**: Create, modify, or delete tables and columns.
- **Log Viewer**: Monitor real-time logs for your database.
- **Postgres Upgrades**: Upgrade to the latest Postgres version.
- **Compute Scaling**: Adjust the compute resources allocated to your database.

### Permissions

There is a one-to-one relationship between a Neon Organization and a Vercel team. Setting up a Neon project through Vercel automatically creates a corresponding Neon Organization if one does not already exist.

When Vercel users interact with Neon, they are automatically assigned Neon accounts. New users will have their primary email linked to their Neon account, while existing users will see their Vercel and Neon accounts synchronized.

The user who sets up the Neon database through Vercel is assigned the owner role in the new Neon organization. Subsequent users are assigned roles based on their Vercel team roles (e.g., developers will be assigned as members). Role management is done through the Vercel dashboard, and any changes will sync with Neon.

_Note_: You can invite non-Vercel users to your Neon organization, but their permissions won’t synchronize with Vercel.

### Pricing

The pricing for databases created via the Vercel Marketplace is identical to those created directly in Neon. Detailed pricing information can be found on the Neon pricing page.

The usage of your Neon databases will be tracked on the Vercel usage page, and billing will appear on your Vercel invoice.

### Limitations

When using Vercel Marketplace, the following limitations apply:

- Projects can only be created or deleted through the Vercel dashboard.
- Organizations cannot be manually removed; they are deleted only if the Vercel Marketplace integration is uninstalled.
- Owners cannot be added manually through the Neon dashboard.
- Invoices and payments must be managed via the Vercel dashboard, not within Neon.
