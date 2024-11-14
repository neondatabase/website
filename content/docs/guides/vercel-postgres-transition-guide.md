---
title: Vercel Postgres Transition Guide
subtitle: Everything you need to know about transitioning from Vercel Postgres to Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2024-11-14T14:00:00.588Z'
---

<Admonition type="warning">
The Vercel Postgres to Neon transition has not started yet. Please be advised that until the transition starts, the content in this guide is subject to change.
</Admonition>

In Q4, 2024, Vercel is transitioning its Vercel Postgres stores to Neon.

In case you missed the announcements, you can read them here:

- [Vercel announcement](https://vercel.com/blog/introducing-the-vercel-marketplace)
- [Neon announcement](https://neon.tech/blog/leveling-up-our-partnership-with-vercel)

**No action is needed on your part**. The transition will be performed automatically without disruption to your applications.

We know moving to a new platform may bring up questions, so we’ve prepared this guide to answer as many as possible.

## About the transition

### Why is this transition happening?

Last year, Vercel introduced Vercel Postgres (powered by Neon) as part of their platform. Now, in order to provide a wider variety of solutions and integrations for its customers, Vercel is shifting to a different model. Instead of a Vercel-managed solution, Vercel is launching the [Vercel Marketplace](https://vercel.com/marketplace), where you can easily integrate first-party storage services, such as Neon Postgres, into your Vercel projects.

While Vercel Postgres was powered by Neon, it was not able to support all of Neon's regular updates and features. By transitioning to Neon Postgres, you will gain access to Neon's full feature set and usage plans, providing you with a better database experience. Vercel's new marketplace model makes this possible.

### When exactly will the transition happen?

The transition will begin in Q4, 2024. It will be a phased migration, with Vercel Postgres stores automatically migrated over to Neon without any downtime. Stay tuned for updates from Vercel about exactly when this will happen for your account.

Until then, you can continue using Vercel Postgres as usual.

### Do you need to do anything before the transition?

No, the transition to Neon will be fully managed. There is nothing you need to do in preparation for it.

### What changes will I see after the transition?

After the migration, you will be able to access and manage your existing Databases from the Neon Console without requiring new login credentials, and you will be able to create new Databases from a **Storage** tab in the Vercel Dashboard.

### Can I still create new Databases during the transition?

Yes, you can continue creating new Databases using Vercel Postgres until the transition starts in Q4, 2024. After that, new Databases will be created via the native Neon Postgres integration, from the **Storage** tab on the Vercel Dashboard.

### What happens to Databases created before the transition?

Any Databases created using Vercel Postgres before the transition will be automatically migrated to Neon Postgres as part of the transition.

## Billing questions

### How will billing be affected?

Billing for the new Neon Postgres native integration will be managed in Vercel. You won’t need to manage separate billing for Neon — everything will stay unified under your Vercel account.

### Will you be automatically transitioned to a particular Neon plan?

- **Vercel Hobby Plan** Databases will be migrated to the Neon Free Plan, which gives you more compute hours, data transfer, Databases, and storage than you had on the Vercel Hobby Plan. See [Vercel Hobby Plan vs Neon Free Plan](#vercel-hobby-plan-vs-neon-free-plan) for a comparison.

- **Vercel Pro Plan** prices and limits will not change. This ensures no pricing surprises when transitioning to Neon. You can stay on your Vercel Pro Plan or you can switch to a Neon plan. For a Vercel-Neon plan comparison, see [Vercel Pro Plan vs Neon Launch Plan](#vercel-pro-plan-vs-neon-launch-plan).

### How do Vercel Postgres plans compare to Neon plans?

Vercel Postgres was available with Vercel's Hobby and Pro plans. Let's take a look at these plans and compare to Neon:

#### Vercel Hobby Plan vs Neon Free Plan

The Vercel Hobby plan is free and aimed at developers with personal projects, and small-scale applications. In Neon, the equivalent plan is our [Free Plan](https://neon.tech/docs/introduction/plans#free-plan). Here are the differences to be aware of:

| Resource      | Vercel Hobby (Included) | Neon Free Plan (Included) |
| :------------ | :---------------------- | :------------------------ |
| Compute Time  | 60 Hours                | 191.9 Hours               |
| Data Transfer | N/A                     | Up to 5 GBs per month     |
| Database      | First Database          | 10                        |
| Storage       | First 256 MB Included   | Up to 512 MB              |

Additional use (called "Extra usage" in Neon) for a fee is not available on either the Vercel Hobby or Neon Free plans.

<Admonition type="note" title="A Database in Vercel is a Project in Neon">
A **Database** in Vercel is a **Project** in Neon. A Neon project can have multiple Postgres databases — up to 500 per branch.
</Admonition>

#### Vercel Pro Plan vs Neon Launch Plan

The Vercel Pro plan is is tailored for professional developers, freelancers, and small businesses. In Neon, the equivalent plan is our [Launch Plan](https://neon.tech/docs/introduction/plans#launch-plan) at $19 per month. The following table provides a comparison of what's included:

| Resource      | Vercel Pro (Included) | Neon Launch Plan (Included)      |
| :------------ | :-------------------- | :------------------------------- |
| Compute Time  | 100 Hours             | 300 Hours                        |
| Data Transfer | 256 MB                | Reasonable usage (no hard limit) |
| Database      | First Database        | 1000                             |
| Storage       | First 256 MB          | Up to 10 GiB                     |

Both the Vercel Pro and Neon Launch plans offer additional use (called "Extra usage" in Neon) for a fee, as outlined below. In Neon, additional units of compute and storage cost more, but you get a monthly compute and storage allowance included with your plan's monthly fee, and Neon does not charge for data transfer, additional databases, or written data.

| Resource      | Vercel Pro (Additional) | Neon Launch Plan (Extra usage)                                                                                                   |
| :------------ | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| Compute Time  | $0.10 per compute hour  | $0.16 per compute hour                                                                                                           |
| Data Transfer | $0.10 - 1 GB            | No additional cost                                                                                                               |
| Database      | $1.00 - Per 1 Database  | No additional cost for the first 100                                                                                             |
| Storage       | $0.12 - 1 GB            | First 10 GB included; afterwards $1.75 per-GB / $0.1 per-GB for ([archived data](https://neon.tech/docs/guides/branching-intro)) |

Neon also offers [Scale](/docs/introduction/plans#scale-plan) and [Business](/docs/introduction/plans#business-plan) plans, which include more storage, compute hours, projects, and features. Be sure to check them out if the Launch plan does not meet your requirements.

### What about Enterprise customers?

Neon is working with the Vercel team to provide joint frontend cloud services for Enterprise customers. This will simplify the adoption and procurement process through the Vercel Marketplace. Stay tuned for more information. If you want to speak to us about an Enterprise-level Neon plan, you can [get in touch with our sales team](/contact-sales).

## Platform questions

### What Neon features will I have access to after the migration?

Once the transition to Neon Postgres is complete, you will gain access to a variety of advanced Neon features that were not available in Vercel Postgres, including:

- [The Neon Console](https://console.neon.tech/app/projects) &#8212; manage all your projects and databases from a dedicated console
- [Database branching](https://neon.tech/docs/guides/branching-intro) &#8212; branch your database like code for development, testing, and database workflows
- [Autoscaling](/docs/introduction/autoscaling) &#8212; scale your database automatically for performance and cost savings
- [Autosuspend](/docs/introduction/auto-suspend) &#8212; configure scale-to-zero behavior
- [Branch Restore](https://neon.tech/docs/guides/branch-restore) &#8212; instant point-in-time recovery
- [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) &#8212; Neon projects, roles, databases and more via API calls
- [Neon CLI](https://neon.tech/docs/reference/neon-cli) &#8212; manage your Neon projects, roles, databases and more from the command-line
- [IP Allow](https://neon.tech/docs/introduction/ip-allow) &#8212; limit access to the IP addresses you trust
- [Organization accounts](https://neon.tech/docs/manage/organizations) &#8212; manage projects and teams with a Neon org account
- [Monitoring](https://neon.tech/docs/introduction/monitoring-page) &#8212; monitor your database form the Neon Console
- [Protected branches](https://neon.tech/docs/guides/protected-branches) &#8212; protect your production data
- [Schema Diff](https://neon.tech/docs/guides/schema-diff) &#8212; compare schema changes between database branches
- [Time Travel](https://neon.tech/docs/guides/time-travel-assist) &#8212; query your data in the past
- [Read Replicas](https://neon.tech/docs/introduction/read-replicas) &#8212; offload read work for scale or ad hoc queries
- [Logical Replication](https://neon.tech/docs/guides/logical-replication-guide) &#8212; replicate data to and from Neon
- [The Neon GitHub Integration](https://neon.tech/docs/guides/neon-github-integration) &#8212; connect your project to your repo and build GitHub Actions workflows

<Admonition type="note">
[The Neon Postgres Previews Integration](/docs/guides/vercel-previews-integration), which automatically creates a database branch for each preview deployment, is currently only available to users who signed up with Neon directly. It cannot be used in combination with the native Neon Postgres integration on the same Vercel project.
</Admonition>

### What Vercel Postgres limitations are lifted by the transitions to Neon?

- **CLI support**. The [Vercel CLI](https://vercel.com/docs/cli) and the [Vercel Terraform Provider](https://vercel.com/guides/integrating-terraform-with-vercel) did not support Vercel Postgres. With Neon Postgres, you have access to a fully featured [Neon CLI](https://neon.tech/docs/reference/neon-cli) and [community-maintained Terraform providers](https://neon.tech/docs/reference/terraform).
- **Larger computes**. On Vercel, databases on Hobby plans are limited to 0.25 logical CPUs. The Neon Free plan supports computes up to 2 vCPUs and [Autoscaling](/docs/introduction/autoscaling).
- **Postgres roles**. On Vercel, you were limited to a single Postgres database access role. There is no such database access role limit on Neon.

### What Postgres versions are supported?

Vercel Postgres supported Postgres 15. With Neon, you'll be able to create databases with Postgres 14, 15, 16, or 17. You can find Neon's Postgres version support policy [here](https://neon.tech/docs/postgresql/postgres-version-policy).

### Are the supported regions the same for both services?

Yes, all regions supported by Vercel Postgres are also supported by Neon Postgres.

### Will the Vercel Postgres SDK continue to work?

Yes, the [Vercel Postgres SDK](https://vercel.com/docs/storage/vercel-postgres/sdk) will continue to work. However, you can expect Vercel to deprecated it some point after the transition. The good news is that **the Vercel SDK is a wrapper around the the Neon serverless driver**, so it's very compatible. There's no need to switch to the Neon serverless driver immediately, but if you would like to get a start on that, please refer to our [Vercel SDK to Neon serverless driver migration guide](https://neon.tech/guides/vercel-sdk-migration) for instructions.

### Is Neon compatible with the same ORMs as Vercel Postgres?

Yes, Neon supports any ORM that is compatible with Vercel Postgres, including:

- Drizzle
- Keysley
- Prisma

### What will happen to Vercel Postgres templates?

[Vercel Postgres templates](https://vercel.com/templates/vercel-postgres) will be transitioned to Neon Postgres templates. You will still be able to use all of them after the transition.

## More questions?

There are likely many more questions we haven't thought of. To get you those answers as quickly as possible, we've set up slack channel `# vercel-postgres-transition`, which we will be monitoring leading up to and through the transition period.
