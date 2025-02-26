---
title: Vercel Postgres Transition Guide
subtitle: Everything you need to know about transitioning from Vercel Postgres to Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2025-02-14T16:07:23.202Z'
---

<Admonition type="info">
Please be advised that the content in this guide is subject to change.
</Admonition>

Vercel has now transitioned almost all Vercel Postgres stores to a [Vercel Native Integration for Neon Postgres](/docs/guides/vercel-native-integration).

We know moving to a new platform may bring up questions, so we’ve prepared this guide to answer as many of those questions as possible.

## About the transition

### Why did the transition happen?

Vercel previously introduced **Vercel Postgres** (powered by Neon) as part of their platform. In order to provide a wider variety of solutions and integrations for its customers, Vercel moved to a different model. Instead of a Vercel-managed solution, Vercel launched the [Vercel Marketplace](https://vercel.com/marketplace), where you can easily integrate first-party storage services, such as Neon Postgres, into your Vercel projects.

By transitioning to the Vercel Native Integration for Neon Postgres, you gain access to Neon's full feature set and usage plans, providing you with a more comprehensive database service. Vercel's new marketplace model makes this possible.

### When did the transition happen?

The transition started in Q4 2024 and completed in Q1 2025. Vercel Postgres stores were automatically migrated over to the [Vercel Native Integration for Neon Postgres](/docs/guides/vercel-native-integration).

### What changes will you see after the transition?

You are now able to access and manage your existing Databases from the **Storage** tab in the Vercel Dashboard and the Neon Console without requiring new login credentials. The **Storage** tab includes an **Open in Neon** button, which opens the corresponding **Project** in Neon.

<Admonition type="note" title="A Database in Vercel is a Project in Neon">
Please note that when coming to Neon from Vercel, there will be a small difference in terminology: **A "Database" in Vercel is a "Project" in Neon**.
</Admonition>

## Billing questions

### How is billing be affected?

Billing for the [Vercel Native Integration for Neon Postgres](/docs/guides/vercel-native-integration) is managed in Vercel. You won’t need to manage separate billing for Neon — everything remains unified under your Vercel account.

### What plan will you be on after the transition?

- **Vercel Hobby Plan**: Databases will be migrated to the Neon Free Plan, which gives you more compute hours, data transfer, Databases (a.k.a. "Projects" in Neon), and storage than you had on the Vercel Hobby Plan. See [Vercel Hobby Plan vs Neon Free Plan](#vercel-hobby-plan-vs-neon-free-plan) for a comparison.

- **Vercel Pro Plan prices and limits will not change**: This ensures no pricing surprises when transitioning to Neon. You can stay on your Vercel Pro Plan or you can switch to a Neon plan. For a Vercel-Neon plan comparison, see [Vercel Pro Plan vs Neon Launch Plan](#vercel-pro-plan-vs-neon-launch-plan).

### How do Vercel Postgres plans compare to Neon plans?

Vercel Postgres was available with Vercel's Hobby and Pro plans. Let's take a look at these plans and compare to Neon:

#### Vercel Hobby Plan vs Neon Free Plan

The Vercel Hobby plan is free and aimed at developers with personal projects, and small-scale applications. In Neon, the equivalent plan is our [Free Plan](/docs/introduction/plans#free-plan). Here are some of the differences to be aware of:

| **Resource**      | **Vercel Hobby (Included)** | **Neon Free Plan (Included)** |
| :---------------- | :-------------------------- | :---------------------------- |
| **Compute hours** | 60                          | 191.9                         |
| **Data transfer** | N/A                         | Up to 5 GBs per month         |
| **Database**      | First Database              | 10                            |
| **Storage**       | First 256 MB Included       | Up to 512 MB                  |

Additional use (called "Extra usage" in Neon) for a fee is not available on the Vercel Hobby Plan or the Neon Free Plan. No change here!

#### Vercel Pro Plan vs Neon Launch Plan

The Vercel Pro plan is is tailored for professional developers, freelancers, and small businesses. In Neon, the equivalent plan is our [Launch Plan](/docs/introduction/plans#launch-plan) at $19 per month. The following table provides a comparison of what's included:

| **Resource**                     | **Vercel Pro (Included)** | **Neon Launch Plan (Included)**  |
| :------------------------------- | :------------------------ | :------------------------------- |
| **Compute hours**                | 100                       | 300                              |
| **Data transfer**                | 256 MB                    | Reasonable usage (no hard limit) |
| **Databases**                    | First database            | 100                              |
| **Branches**                     | -                         | 5000                             |
| **Storage**                      | First 256 MB              | Up to 10 GB                      |
| **Archive storage**              | -                         | Up to 50 GB                      |
| **Point-in-time restore (PITR)** | Not available             | Up to 7 days                     |

Both the Vercel Pro and Neon Launch plans offer additional use (called "Extra usage" in Neon) for a fee, as outlined below. In Neon, additional units of compute and storage cost more, but you get more compute and storage with your plan's monthly fee, and Neon does not charge for data transfer, additional databases, or written data.

| **Resource**      | **Vercel Pro (Additional)** | **Neon Launch Plan (Extra usage)**            |
| :---------------- | :-------------------------- | :-------------------------------------------- |
| **Compute hours** | $0.10 per compute hour      | $0.16 per compute hour                        |
| **Data transfer** | $0.10 - 1 GB                | No additional cost                            |
| **Database**      | $1.00 - Per 1 Database      | No additional cost for the first 100          |
| **Storage**       | $0.12 - 1 GB                | First 10 GB included; afterwards $1.75 per-GB |

Neon also offers [Scale](/docs/introduction/plans#scale-plan) and [Business](/docs/introduction/plans#business-plan) plans, which include more storage, compute hours, projects, and features. Be sure to take a look at these plans if the Launch plan does not meet your requirements.

<Admonition type="note" title="Upgrading to a Neon plan">
To upgrade to a Neon plan to take advantage of additional features and higher plan allowances, see [Changing your plan](/docs/guides/vercel-native-integration#changing-your-plan).
</Admonition>

### What about Enterprise customers?

Neon is working with the Vercel team to transition Enterprise customers. If you want to speak to us about an Enterprise-level Neon plan, you can [get in touch with our sales team](/contact-sales).

## Platform questions

### What Neon features will I have access to after the migration?

Once the transition to Neon Postgres is complete, you will be able to access a variety of advanced Neon features that were not available in Vercel Postgres (subject to your plan limits).

<Admonition type="note">
Please be aware that if you are on a **Vercel Postgres Pro Plan**, you are subject to the limits of that [plan](#vercel-pro-plan-vs-neon-launch-plan). There's no requirement for you to migrate to a Neon plan, but doing so provides access to higher limits and additional features. For example, the Vercel Postgres Pro Plan does not support [history retention](/docs/reference/glossary#history), which enables Neon's point-in-time restore feature. For a full overview of Neon plans, features, and limits, refer to our [Pricing](https://neon.tech/pricing) page. If you switch to a Neon plan, you will still be billed through Vercel.
</Admonition>

Neon features:

- [The Neon Console](https://console.neon.tech/app/projects) &#8212; manage all your projects and databases from a dedicated console
- [Database branching](/docs/guides/branching-intro) &#8212; branch your database like code for development, testing, and database workflows
- [Autoscaling](/docs/introduction/autoscaling) &#8212; scale your database automatically for performance and cost savings
- [Scale to Zero](/docs/introduction/scale-to-zero) &#8212; configure scale-to-zero behavior
- [Branch Restore](/docs/guides/branch-restore) &#8212; instant point-in-time restore
- [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) &#8212; Neon projects, roles, databases and more via API calls
- [Neon CLI](/docs/reference/neon-cli) &#8212; manage your Neon projects, roles, databases and more from the command-line
- [IP Allow](/docs/introduction/ip-allow) &#8212; limit access to the IP addresses you trust
- [Organization accounts](/docs/manage/organizations) &#8212; manage projects and teams with a Neon org account
- [Monitoring](/docs/introduction/monitoring-page) &#8212; monitor your database from the Neon Console
- [Protected branches](/docs/guides/protected-branches) &#8212; protect your production data
- [Schema Diff](/docs/guides/schema-diff) &#8212; compare schema changes between database branches
- [Time Travel](/docs/guides/time-travel-assist) &#8212; query your data in the past
- [Read Replicas](/docs/introduction/read-replicas) &#8212; offload read work for scale or ad hoc queries
- [Logical Replication](/docs/guides/logical-replication-guide) &#8212; replicate data to and from Neon
- [The Neon GitHub Integration](/docs/guides/neon-github-integration) &#8212; connect your Neon project to your repo and build GitHub Actions workflows

### What Vercel Postgres limitations are lifted by the transition to Neon?

The transition to Neon also unblocks several limitations:

- **CLI support**. The [Vercel CLI](https://vercel.com/docs/cli) did not support Vercel Postgres. With Neon Postgres, you have access to a fully featured [Neon CLI](/docs/reference/neon-cli).
- **Terraform support**. The [Vercel Terraform Provider](https://vercel.com/guides/integrating-terraform-with-vercel) did not support Vercel Postgres. With Neon Postgres, you have access to a [Neon Terraform provider](/docs/reference/terraform).
- **Larger computes**. On Vercel, databases on Hobby plans are limited to 0.25 logical CPUs. The Neon Free plan supports computes up to 2 vCPUs and [Autoscaling](/docs/introduction/autoscaling). Neon paid plans support much larger compute sizes.
- **Postgres roles**. On Vercel, you were limited to a single Postgres database access role. There is no such limit on Neon. You can create additional Postgres roles as needed.
- **Point-in-time restore**. In Vercel Postgres, Neon's history retention is set to 0, which means point-in-time restore is not possible. Once you are on a Neon plan (free or paid), the default setting is 1 day, and you can configure longer periods on Neon's paid plans. **Please note that if you are on a Vercel Postgres Pro Plan, you'll need to sign up for a Neon plan for the point-in-time restore feature**.

### What Postgres versions are supported?

Vercel Postgres supported Postgres 15. With Neon, you'll be able to create databases with Postgres 14, 15, 16, or 17. You can find Neon's Postgres version support policy [here](/docs/postgresql/postgres-version-policy).

### Are the supported regions the same for both services?

Yes, all regions supported by Vercel Postgres are also supported by Neon Postgres.

### Will the Vercel Postgres SDK continue to work?

Yes, the [Vercel Postgres SDK (@vercel/postgres)](https://vercel.com/docs/storage/vercel-postgres/sdk) will continue to work. No immediate action is required. However, `@vercel/postgres` will no longer be actively maintained by Vercel, and it is expected to be deprecated after the transition. The good news is that **the Vercel SDK is a wrapper around the Neon serverless driver**, making it highly compatible with Neon. Here's what you can do:

- For a version of `@vercel/postgres` managed by Neon in maintenance mode (maintained but no new features), you can replace `@vercel/postgres` with Neon's fully compatible version: [@neondatabase/vercel-postgres-compat](https://github.com/neondatabase/vercel-postgres-compat). Neon will maintain this version for the foreseeable future to support users transitioning from Vercel Postgres.
- If you're building new apps, we recommend using the **Neon serverless driver** ([@neondatabase/serverless](https://github.com/neondatabase/serverless)). This driver is actively maintained and developed by Neon.
- If you want to migrate an existing app from `@vercel/postgres` to the **Neon serverless driver**, refer to our [Vercel SDK to Neon serverless driver migration guide](https://neon.tech/guides/vercel-sdk-migration) for detailed instructions.

### Is Neon compatible with the same ORMs as Vercel Postgres?

Yes, Neon supports any ORM that is compatible with Vercel Postgres, including:

- Drizzle
- Keysley
- Prisma

### What will happen to Vercel Postgres templates?

The [environment variables](/docs/guides/vercel-native-integration#environment-variables-set-by-the-integration) used by former Vercel Postgres templates will continue to be supported by Neon for the time being. You'll be able to find new [Neon templates](https://vercel.com/templates?database=neon) and [Postgres templates](https://vercel.com/templates?database=neon&database=postgres) on the Vercel templates site.

## More questions?

There are likely many more questions we haven't thought of. To get you those answers as quickly as possible, we've set up discord channel [#vercel-postgres-transition](https://discord.com/channels/1176467419317940276/1306544611157868544), which we will be monitoring leading up to and through the transition period.
