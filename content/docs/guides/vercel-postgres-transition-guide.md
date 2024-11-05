---
title: Vercel Postgres Transition Guide
subtitle: Everything you need to know about transitioning from Vercel Postgres to Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2024-06-14T07:55:54.409Z'
---

Starting in November, 2024, Vercel is transitioning its Vercel Postgres stores to Neon.

In case you missed the announcements, you can read them here:

- [Vercel announcement](https://vercel.com/blog/introducing-the-vercel-marketplace)
- [Neon announcement](https://neon.tech/blog/leveling-up-our-partnership-with-vercel)

**No action is needed on your part**. The transition will be performed automatically without disruption to your applications. We know moving to a new platform may bring up questions, so we’ve prepared this guide to answer as many as possible so that you have a full understanding of the process and where to begin after the transition is complete.

## About the transition

### Why is this transition happening?

Last year, Vercel introduced Vercel Postgres (powered by Neon) as part of their platform. To provide a wider variety of solutions and integrations for its customers, Vercel is shifting to a different model. Instead of providing Vercel-managed storage solutions, Vercel is launching the [Vercel Marketplace](https://vercel.com/marketplace), where you can easily integrate first-party services, such as Neon Postgres, into your Vercel projects.

While Vercel Postgres is powered by Neon, it was not able to support all of Neon's upgrades and features. By transitioning to Neon Postgres, developers will gain  full access to Neon's feature set and usage plans, providing better database experience. Vercel's new Marketplace model makes this possible.

### When exactly will the transition happen?

The transition will begin in November. It will be a phased migration, with Vercel Postgres stores automatically migrated over to Neon without any downtime.

Until then, you can continue using Vercel Postgres as usual.

### Do you need to do anything before the transition?

No, the transition to Neon will be fully managed by Vercel. Once the transition is complete, you will be able to manage your databases through the Neon Console, with billing and certain account-level operations managed from Vercel.

### What changes will I see after the transition?

After the migration, you will be able to access and manage your existing databases from the Neon Console without requiring new login credentials, and you will be able to create new databases sing the Neon integration in the Vercel Marketplace, which will be available starting in November.

Stay tuned for communication about the transition and when you can start accessing your database via the Neon Console and using Neon's new Vercel Marketplace integration. The integration will be available in November.

### Can I still create new databases during the transition?

Yes, you can continue creating new databases using Vercel Postgres until the transition starts in November. After that, new databases will be created using the Neon Postgres integration in the Vercel Marketplace.

### What happens to databases created before the transition?

Any Postgres databases created using Vercel Postgres before November will be automatically migrated to Neon Postgres as part of the transition.

## Billing questions

### How will billing be affected?

Billing will be handled through the Vercel Marketplace. You won’t need to manage separate billing for Neon Postgres—everything will stay unified under your Vercel account.

Pricing and limits will match what you would get if you were using Neon directly instead of through the Vercel Marketplace. You will have access to all of Neon's pricing options and plans.

###  Will you be automatically transitioned to a particular Neon plan?

Vercel Hobby Plan database will be migrated to the Neon Free Plan. Vercel Pro database will be migrated to the Neon Launch plan. However, Vercel pricing for the Pro Plan ($20 per month), will still apply. This ensures no surprises in pricing during the transition.

### How do Vercel Postgres plans compare to Neon plans?

Vercel Postgres was available with Vercel's Hobby and Pro plans. Let's take a look at these plans and compare to Neon:

#### Vercel Hobby Plan vs Neon Free Plan

The Vercel Hobby plan is free and aimed at developers with personal projects, and small-scale applications. In Neon, the equivalent plan is our [Free Plan](https://neon.tech/docs/introduction/plans#free-plan). Here are the differences that you'll need to be aware of:

| Resource        | Vercel Hobby Included | Neon Free Plan Included                                  |
|:----------------|:----------------------|:---------------------------------------------------------|
| Compute Time    | 60 Hours              | 191.9 Hours                                              |
| Data Transfer   | N/A                   | Up to 5 GBs per month                                    |
| Database        | First Database        | 10 Projects, 500 databases per branch                    |
| Storage         | First 256 MB Included | Up to 512 MB                                             |
| Written Data    | N/A                   | Included in Storage.                                     |

Additional use (called "Extra usage" in Neon) for a fee is not available on either the Vercel Hobby or Neon Free plans.

#### Vercel Pro Plan vs Neon Launch Plan

The Vercel Pro plan is is tailored for professional developers, freelancers, and small businesses. In Neon, the equivalent plan is our [Launch Plan](https://neon.tech/docs/introduction/plans#launch-plan) at $19 per month. The following table provides a comparison of what's included:

| Resource        | Vercel Pro Included   | Neon Launch Plan Included                                  |
|:----------------|:----------------------|:---------------------------------------------------------|
| Compute Time    | 100 Hours             | 300 Hours                                                |
| Data Transfer   | 256 MB                | Reasonable usage (no hard limit)                         |
| Database        | First Database        | 1000 Projects, 500 databases per branch                  |
| Storage         | First 256 MB          | Up to 10 GiB                                             |
| Written Data    | 256 MB                | Included in Storage.                                     |

Both the Vercel Pro and Neon Launch plans offer additional use (called "Extra usage" in Neon) for a fee, as outlined below. In Neon, additional units of compute and storage cost more, but the amount of compute and storage included with your plan is munch higher, and Neon does not charge for data transfer additional databases, or written data.     

| Resource        | Vercel Pro Additional      | Neon Launch Plan Additional ("Extra") |
|:----------------|:---------------------------|:--------------------------------------|
| Compute Time    | $0.10 - 1 Compute Hour     | $0.16 - 1 Compute Hour                |
| Data Transfer   | $0.10 - 1 GB               | No additional cost                   |
| Database        | $1.00 - Per 1 Database     | No additional cost                   |
| Storage         | $0.12 - 1 GB               | $3.50 - 2 GiB (but you start with 10 GiB included at no additional cost)|
| Written Data    | $0.096 - 1 GB              | No additional cost                   |

Neon also offers [Scale](/docs/introduction/plans#scale-plan) and [Business](/docs/introduction/plans#business-plan) plans, which include more storage, compute hours, projects, and features. Be sure to check them out if the Launch plan does not meet your requirements.

### What about Enterprise customers?

Neon is working with the Vercel team to provide joint frontend cloud services for Enterprise customers. This will simplify the adoption and procurement process through the Vercel Marketplace. Stay tuned for more information on this. If you want to speak to us about an Enterprise-level plan, you can [get in touch with our sales team](/contact-sales).

## Platform questions

### What Neon features will I have access to after the migration?

Once the transition to Neon Postgres is complete, you will gain access to a variety of advanced Neon features that were not available in Vercel Postgres, including:

- [The Neon Console](https://console.neon.tech/app/projects) &#8212; Manage all your projects and databases from a dedicated console 
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
- [The Neon Vercel Integration](/docs/guides/vercel) &#8212; automatically create a database branch for each preview deployment
- [The Neon GitHub Integration](https://neon.tech/docs/guides/neon-github-integration) &#8212; connect your project to your repo and build GitHub Actions workflows

### What Postgres versions are supported?

Vercel Postgres supported Postgres 15. With Neon, you'll be able to create databases with Postgres 14, 15, 16, or 17. You can find Neon's Postgres version support policy [here](https://neon.tech/docs/postgresql/postgres-version-policy). 

### Will the Vercel Postgres SDK continue to work?

Yes, the [Vercel Postgres SDK](https://vercel.com/docs/storage/vercel-postgres/sdk) (built on the [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver)) will continue to be supported. No changes are required to your applications. The SDK will work seamlessly with Neon Postgres.

### Is Neon compatible with the same ORMs as Vercel Postgres?

Yes, Neon supports all ORMs that are compatible with Vercel Postgres, including these:
- Drizzle
- Keysley
- Prisma

### What Vercel Postgres limitations are lifted by the transitions to Neon?

- **CLI support**. The Vercel CLI and the [Vercel Terraform Provider](https://vercel.com/guides/integrating-terraform-with-vercel) did not support Vercel Postgres. With Neon Postgres, you have access to a fully featured [Neon CLI](https://neon.tech/docs/reference/neon-cli) and [community-maintained Terraform providers](https://neon.tech/docs/reference/terraform).
- **Larger computes**. On Vercel, databases on Hobby plans are limited to 0.25 logical CPUs. The Neon Free plan supports computes up to 2 vCPUs and Autoscaling. A compute hour limit of 191.9 hours per month applies.
- **Postgres roles**. On Vercel, you were limited to a single Postgres database access role. There is no such limit on Neon.

### Are the supported regions the same for both services?

Yes, all regions supported by Vercel Postgres are also supported by Neon Postgres.

### What will happen to Vercel Postgres templates?

[Vercel Postgres templates](https://vercel.com/templates/vercel-postgres) will be transitioned to Neon Postgres templates. You will still be able to use all of them after the transition.

## More questions?

There's likely to be questions we haven't thought of. To get you those answers as quickly as possible, we've set up slack channel ##vercel-postgres-transition, which we will be monitoring leading up to and through the November transition period. 
