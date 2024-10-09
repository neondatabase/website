---
title: Vercel Postgres Transition Guide
subtitle: Everything you need to know about transitioning from Vercel Postgres to Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2024-06-14T07:55:54.409Z'
---

As mentioned in [Neon's announcement](https://neon.tech/blog/leveling-up-our-partnership-with-vercel) about Vercel Postgres transitioning to Neon, the transition will be performed for you and no action is required on your part. However, there's still lots to know when changing database platforms and many questions you may want answers to. In this guide, we'll try try to provide that information and answer as many of those questions as we can. There's likely other questions we haven't thought of. To get you those answers as quickly as possible, we've set up slack channel ##vercel-postgres-migration, which we will be monitoring closely. Additionally, if you're moving over to a paid plan in Neon, you can always reach out to our Support team.

So, let's get into it. What do you need to know?

## Billing and usage limits

The first questions you might have might be about changes to billing usage limits. Let's take a look at Vercel Postgres plans and see how they compare to Neon's plans. Vercel Postgres is available on their Hobby and Pro plans, with the following prices:

### When will the Vercel Postgres transition to Neon happen?
The automatic migration of Vercel Postgres to Neon will begin in November. Until then, you can continue using Vercel Postgres as usual.

### Will there be any downtime during the migration?
No, the transition will happen with **zero downtime**. You will not need to perform any additional work during the migration process.

### What changes will I see after the migration?
After the migration, Vercel Postgres will transition fully to Neon Postgres, providing enhanced scalability, flexibility, and access to the full feature set of Neon. You will manage your databases via the Neon console, and all new projects will be created using the Neon integration in the Vercel Marketplace.

### How will billing and limits be affected?
After the migration, pricing and limits will match what you would get if you were using Neon directly. This ensures that the transition maintains consistent costs and capabilities for users.

## What is happening to Vercel Postgres?

Vercel is transitioning its Postgres offering to Neon Postgres, as part of a new model where Neon will be offered in the Vercel Marketplace. This transition will allow developers to access all of Neon's latest features and improvements.

## Why is this transition happening?

While Neon previously powered Vercel Postgres, not all of Neon’s upgrades and features could be incorporated into Vercel Postgres. By transitioning to Neon via the Vercel Marketplace, developers will now have access to Neon's full suite of features, providing a more powerful and flexible database experience.

## When will the transition start?

The transition will begin in November. It will be a phased migration, with users automatically migrated over to Neon Postgres without any downtime or changes to their infrastructure.

## Will there be downtime during the migration?

No, the migration will be handled with zero downtime. The transition process is designed to be seamless, with no impact on your existing applications or infrastructure.

## Do I need to do anything for the transition?

No, the transition will be automatic. Vercel will handle the migration of your Vercel Postgres databases to Neon Postgres. Once the transition is complete, you’ll manage your databases through the Neon console.

## How will billing work after the transition?

Billing will handled through the Vercel Marketplace. You won’t need to manage separate billing for Neon Postgres—everything will stay unified under your Vercel account.

## What new features will I have access to after the migration?

Once the transition to Neon Postgres is complete, you will gain access to a variety of advanced Neon features, including:
- Database branching with both data and schema
- Serverless compute configurations with autoscaling and autosuspend
- Instantaneous Point-in-Time Recovery (PITR)
- Full API and management options
- IP allowlists for secure access to database branches
- Organization accounts
- Enhanced security and observability tools
- Greater scalability in both compute and storage

## Can I still create new databases during the transition?

Yes, you can continue creating new Postgres databases through Vercel’s current system until the transition starts in November. After that, new databases will be created using the Neon Postgres integration in the Vercel Marketplace.

## What happens to databases created before the transition?

Any Postgres databases created through Vercel before November will be automatically migrated to Neon Postgres as part of the transition.

## What about Enterprise customers?

We are working with the Vercel team to provide joint frontend cloud services for Enterprise customers. This will simplify the adoption and procurement process through the Vercel Marketplace. Stay tuned for more information on this.

## How can I get more information or ask questions?

If you have further questions or want to discuss specific needs, feel free to get in touch with the Neon team at sales@neon.tech.

## What Postgres versions are supported?

Vercel Postgres supported Postgres 15. With Neon Postgres, you'll have access to Postgres versions 14, 15, 16, and 17.

## Will the Vercel Postgres SDK continue to work?

Yes, the Vercel Postgres SDK (a repackaged Neon serverless driver) will continue to be supported. No changes are required, and it will work seamlessly with Neon Postgres.

## What will happen to Vercel Postgres templates?

Vercel Postgres templates will be transitioned to Neon Postgres templates. You will still be able to use all of them with Neon.

## Is Neon compatible with the same ORMs as Vercel Postgres?

Yes, Neon supports all ORMs that were compatible with Vercel Postgres, including:
- Keysley
- Prisma
- Drizzle

## What limitations exist between Vercel Postgres and Neon Postgres?

## Vercel Postgres:
- Provisioning a Vercel Postgres database from the Vercel CLI or the [Vercel Terraform Provider](https://vercel.com/guides/integrating-terraform-with-vercel) is not currently supported.
- Databases on Hobby plans are limited to 0.25 logical CPUs.

Neon supports provisioning databases and other resources (such as branches, roles, and databases) via the Neon CLI and Terraform provider and access to larger compute options, even on the Free Plan.

## What additional features does Neon Postgres offer?

- Access to the **Neon Console** for database management.
- **Database branching** with data and schema.
- **Multiple Postgres access roles**, with the ability to reset credentials.
- **Autoscaling** to handle serverless workloads efficiently.
- Full support for serverless compute scaling.

## Are the supported regions the same for both services?

Yes, all regions supported by Vercel Postgres are also supported by Neon Postgres.


## How do I do it in Neon?

This section describes how to perform actions in Neon that you were able to perform in Vercel for your Postgres database?

