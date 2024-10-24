---
title: Vercel Marketplace
enableTableOfContents: true
isDraft: false
updatedOn: '2024-06-14T07:55:54.409Z'
---

The [Vercel Marketplace](https://vercel.com/marketplace) allows you to add services, like Neon Postgres, to your Vercel project directly from the Vercel platform.

When you create Neon organizations and projects through the Vercel Marketplace, they function in the same way as projects created directly from Neon. However, billing is processed through your Vercel account, and you can manage your resources from the Vercel dashboard or CLI. Additionally, environment variables are automatically synced, making them readily available for your connected projects.

## Install Neon from the Vercel Marketplace

To install Neon from the Vercel Marketplace:

1. Navigate to the [Vercel Marketplace](https://vercel.com/marketplace) or to the [Integrations Console](https://vercel.com/neondatabase/~/integrations/console) on your Vercel Dashboard.
2. Locate the Neon Postgres integration.
3. Click **Install**. This will create a Neon organization for you.
4. On the **Create Database** dialog, select a region. Generally, you should choose the region closest to your application.
5. Select a Neon plan and click **Continue**. For details about Neon plans and what included, refer to our [Pricing](https://neon.tech/pricing) page.
6. Specify a **Database Name** or accept the generated name, and click **Create**.
7. A database created, and you are directed to the **Storage** tab on the Vercel Dashboard where you can view you database details, including:
    - Status
    - Plan
    - Current Period
    - Period Total
    - Quickstart (shows your database connection string)

    From the sidebar, you can view your Neon **Project Setting**, the **Getting Started**, and **Usage**. There's also a link to **Support**.

## Open your Neon project in the Neon Console

To open Neon Project in the Neon Console:

1. From the **Storage** tab in the Vercel Dashboard, select your Neon database.
2. On your Neon database page, select **Open in Neon Database**.
3. In the Neon Console, select your **Vercel: neondatabase** organization from the from the breadcrumb dropdown. You will be directed to your Organization's project page, where you can view Account Usage and projects belonging to your organization. If you've just installed, you will have a single project containing database you created earlier.



### Connecting to Neon Projects

Neon projects created through the Vercel Marketplace are automatically synchronized with connected Vercel projects. This sync includes setting up key environment variables, such as:

- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`
- `NEON_API_KEY`
- `NEON_PROJECT_ID`
- `NEXT_PUBLIC_NEON_API_URL`

These variables ensure your applications can securely connect to the database and interact with Neon's APIs.

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

*Note*: You can invite non-Vercel users to your Neon organization, but their permissions won’t synchronize with Vercel.

### Pricing

The pricing for databases created via the Vercel Marketplace is identical to those created directly in Neon. Detailed pricing information can be found on the Neon pricing page.

The usage of your Neon databases will be tracked on the Vercel usage page, and billing will appear on your Vercel invoice.

### Limitations

When using Vercel Marketplace, the following limitations apply:

- Projects can only be created or deleted through the Vercel dashboard.
- Organizations cannot be manually removed; they are deleted only if the Vercel Marketplace integration is uninstalled.
- Owners cannot be added manually through the Neon dashboard.
- Invoices and payments must be managed via the Vercel dashboard, not within Neon.
