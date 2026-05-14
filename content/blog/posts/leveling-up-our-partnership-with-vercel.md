---
title: Leveling Up our Partnership with Vercel
description: Bringing all Neon features to Vercel developers via the Vercel Marketplace
excerpt: >-
  Since its launch last year, hundreds of thousands of developers have built
  apps and sites using Vercel Postgres, the serverless database powered by Neon.
  This has been a great partnership, helping Neon scale up to millions of
  databases and helping Vercel deliver on their vision o...
date: "2024-08-28T17:29:21"
updatedOn: "2024-08-28T17:37:03"
category: company
categories:
  - company
authors:
  - bryan-clark
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/leveling-up-our-partnership-with-vercel/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Leveling Up our Partnership with Vercel - Neon
  description: >-
    Vercel Postgres is transitioning to Neon via the Vercel Marketplace, giving
    Vercel developers access to the latest Neon features.
  keywords: []
  noindex: false
  ogTitle: Leveling Up our Partnership with Vercel - Neon
  ogDescription: >-
    Vercel Postgres is transitioning to Neon via the Vercel Marketplace, giving
    Vercel developers access to the latest Neon features.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/leveling-up-our-partnership-with-vercel/social.jpg
---

<figure class="wp-block-image size-large">
<img loading="lazy" decoding="async" width="1024" height="576" src="https://cdn.neonapi.io/public/images/pages/blog/leveling-up-our-partnership-with-vercel/neon-vercel-1-1024x576-85e2f8ad.jpg" alt="" />
</figure>

Since its launch last year, hundreds of thousands of developers have built apps and sites using Vercel Postgres, the serverless database powered by Neon. This has been a great partnership, helping Neon scale up to millions of databases and helping Vercel deliver on their vision of the frontend cloud.

<figure>
<video controls width="928" height="720">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/leveling-up-our-partnership-with-vercel/vercel-postgres-5da45e73.mp4" />
</video>
</figure>

On the Neon side, we’ve shipped a lot this past year, including important improvements in our [autoscaling](https://neon.tech/blog/neon-autoscaling-is-generally-available) and [branching](https://neon.tech/flow), more features for the in-console SQL and [table editors](https://neon.tech/blog/edit-records-directly-from-the-neon-console-meet-the-new-tables-page), enhancements in our [API](https://neon.tech/docs/reference/api-reference) and [pooler](https://neon.tech/docs/connect/connection-pooling), [monitoring](https://neon.tech/docs/introduction/monitoring), [more integrations](https://neon.tech/docs/guides/integrations), more flexible pricing plans… But not all of these upgrades were feasible to incorporate into Vercel Postgres.

**To give everyone access to the latest features and improvements in Neon, Vercel Postgres is transitioning to [Neon via the Vercel Marketplace](https://vercel.com/blog/introducing-the-vercel-marketplace).** This change gives Vercel developers a tightly integrated frontend cloud experience and maintains unified billing, while also opening up access to the full power of Neon.

Via the Vercel Marketplace, Vercel developers will now have access to the best Neon features, including:

- [Database branching](https://neon.tech/docs/introduction/branching) with data + schema
- Serverless compute configurations via [autoscaling](https://neon.tech/docs/introduction/autoscaling) and [autosuspend](https://neon.tech/docs/guides/auto-suspend-guide)
- [Instantaneous PITR](https://neon.tech/docs/guides/branch-restore)
- Full [API and management](https://neon.tech/docs/manage/databases) options
- [Protected access to branches via IP allowlist](https://neon.tech/docs/guides/protected-branches)
- [Organization accounts](https://neon.tech/docs/manage/organizations)
- Advanced [security](https://neon.tech/docs/security/security-overview) configurations
- [Monitoring](https://neon.tech/docs/introduction/monitoring) and observability
- Improved compute and [storage](https://neon.tech/blog/how-we-scale-an-open-source-multi-tenant-storage-engine-for-postgres-written-rust) scalability

<blockquote>
<p>More than ever developers need simplified platforms as our universe expands and grows more complex. We believe that Neon, with its integrated database preview environments, represents the best way for developers to have the repeatable, fast, and reliable infrastructure needed to build the next generation of applications.</p>
<cite><em>James Broadhead, VP Engineering, Neon</em></cite>
</blockquote>

## Details

We are working out a detailed transition process and timeline in partnership with the Vercel team. The transition will follow 3 principles:

1. Zero downtime transition with no infrastructure change so there is no impact on your application
2. Single seamless billing via the marketplace
3. Choice and access to the full set of Neon features and plans

We will execute this transition zero downtime transition, in two steps:

- **Auto-migration of Vercel Postgres Databases**
  - **Timeline**: Starting in November, Vercel will begin a gradual (phased) migration of user accounts.
  - **No impact on users**: Customers won’t need to do anything, as the migration will not cause downtime or changes to their infrastructure.
  - **Pricing**: Customers will now be billed via the Vercel Marketplace
  - **Databases**: After the migration, databases will be managed using the Neon console.
  - **New features**: Post-migration, users will have access to all the features provided by the Neon platform.
- **New databases created via Neon in Vercel Marketplace**
  - **Timeline**: Starting in November, Vercel users will create Neon Postgres databases using the Vercel marketplace integration
  - **Until then**: Users can continue creating new Postgres databases through Vercel’s current system
  - **Migration**: Any Postgres databases created before November will be automatically migrated to the Neon marketplace system as described above

We will communicate with users regularly through this process and are keen to hear to your feedback.

## Enterprise

Beyond serving Vercel Hobby and Pro users, we are also receiving inbound demand from Enterprise customers (of both Neon and Vercel). To serve this demand, we are working, in partnership with the Vercel team to jointly provide a frontend cloud service to Enterprise customers. Our aim is to use the Vercel marketplace to simplify the adoption and procurement process. Stay tuned for more information on this.

Are you an interested Neon or Vercel customer? Get in touch with our team at [sales@neon.tech](mailto:sales@neon.tech)
