---
title: Marble Is Shipping Faster with Neon Branching
description: >-
  An open-source headless CMS to add blogs, changelogs, and SEO-friendly content
  to your site
excerpt: >-
  “We recently shipped a big update and we probably couldn’t have done it
  without Neon branching. It lets us test big migrations safely with production
  data, and if something breaks, we just delete the branch and start fresh. That
  makes us a lot faster and more confident when shipp...
date: '2025-09-15T15:48:20'
updatedOn: '2025-09-15T15:48:22'
category: case-study
categories:
  - case-study
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/marble-is-shipping-faster-with-neon-branching/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Marble Is Shipping Faster with Neon Branching - Neon
  description: >-
    Thanks to Neon branching, the Marble CMS team can test safely with real data
    and ship updates confidently at startup speed.
  keywords: []
  noindex: false
  ogTitle: Marble Is Shipping Faster with Neon Branching - Neon
  ogDescription: >-
    Thanks to Neon branching, the Marble CMS team can test safely with real data
    and ship updates confidently at startup speed.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/marble-is-shipping-faster-with-neon-branching/social.jpg
source:
  wpId: 10896
  wpSlug: marble-is-shipping-faster-with-neon-branching
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/marble-is-shipping-faster-with-neon-branching/neon-marble-1024x576-eac517a0.jpg)

> **“We recently shipped a big update and we probably couldn’t have done it without Neon branching. It lets us test big migrations safely with production data, and if something breaks, we just delete the branch and start fresh. That makes us a lot faster and more confident when shipping, even as a small team”** _(Dominik Koch, CEO and Co-Founder of Marble)_

[Marble](https://marblecms.com/) is a new open-source headless CMS that allows you to publish blogs, articles, changelogs, and product updates to your site while keeping things simple and developer-friendly. It gives you everything you need without the fuss: a smooth editor, easy media management, team collaboration, webhook events and powerful API integrations with frameworks like Next.js and Astro.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/marble-is-shipping-faster-with-neon-branching/image-1024x379-49c8e010.png" alt="Image" />
<figcaption>https://marblecms.com/</figcaption>
</figure>

## Deploying Postgres on Neon: Simplicity and Speed

When it came time to choose a database for Marble, the team wanted something that wouldn’t slow them down. They had experience with local Docker setups and briefly considered similar alternatives for Postgres hosting, but those options came with friction. In contrast, Neon stood out for its simplicity.

Spinning up a new project in Neon took seconds, sharing a connection string made collaboration effortless, performance was strong right out of the box, and the generous Free Plan gave them room to start building without worrying about limits for a while. So Marble quickly adopted Neon as their main database, and as they dug in, they discovered a secret weapon: **Neon branching.**

## Shipping Fast with Branching: The Workflow

Like many early-stage startups, Marble is focused on one thing at the moment: building fast. Shipping features quickly is critical, but of course, it can also be risky – a single migration or schema change in the wrong environment can break production and slow everything down. Marble learned this the hard way when an early migration PR impacted their live database. That was the turning point where they started implementing [branching workflows](https://neon.com/docs/introduction/branching).

### Branching workflows on Neon

In Neon, instead of maintaining just one database instance, you can create an instant branch from production – similar to what you do with code in Git. The Neon magic is that this branch includes not only a copy of your schema, but also a full copy of your data at a point in time. This is possible thanks to Neon’s underlying [copy-on-write storage,](https://neon.com/blog/instantly-copy-tb-size-datasets-the-magic-of-copy-on-write) which can create these data snapshots without actually duplicating anything. Branches are efficient, lightweight, and fast to create. You can spin one up instantly, test anything, and delete it afterward.

[This workflow](https://neon.com/branching) is transformative not only because it’s fast and simple, but because it allows developers to test code changes against data that perfectly mirrors production. You don’t need synthetic seed scripts, which slow development velocity and rarely reproduce the true state of the app.

### How Marble uses it in practice

Marble takes full advantage of this to keep their shipping velocity high without breaking things. For a small team shipping almost daily, this setup is a huge multiplier. Their branching workflow looks like this:

- **Production branch vs. development branches.** They keep production isolated on the production branch while creating development branches for new features. Each branch inherits the schema and data from production at the moment it’s created, has its own connection string for easy sharing, and scales to zero when not in use to automatically save costs.
- **They iterate fast**. If a test damages the schema, they don’t spend hours cleaning up. They simply delete the branch and spin up a new one.
- **They test migrations with real data**. Instead of generating mock data, Marble runs migrations and new queries against real production data in a branch. This is especially important for features like analytics dashboards, where only live data can reveal edge cases.
- **They validate major updates safely**. This workflow gives them confidence when shipping. For example, when Marble migrated all users into a new offers model (a change touching every row in the users table), they first ran the migration on a dev branch. That allowed them to confirm the process completed successfully before deploying it to production.

<Admonition type="tip" title="Marble is a member of the Neon Open Source Program">
We sponsor promising open source projects that start on our Free Plan, increasing their resource limits and helping them grow. If you’re building in public, scaling, and could use a little headroom, apply [here](https://forms.gle/nP9FQ3jKe7t1NPgu9).
</Admonition>

## Marble’s Tech Stack

Marble is built on a lean, composable stack heavy on serverless:

- Their main website runs on Astro with Tailwind CSS, optimized for speed.
- Their admin dashboard is powered by Next.js, adding the flexibility for interactive views and user management.
- They have a serverless API layer built with Hono and deployed on Cloudflare Workers.
- Neon is the primary database, connected through Prisma for smooth schema migrations and queries.
- Media assets are stored on Cloudflare R2.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/marble-is-shipping-faster-with-neon-branching/image-1-1024x640-2b3577eb.png" alt="Image" />
<figcaption>A sneak peek into Marble’s dashboard</figcaption>
</figure>

## Try Marble and Neon

Marble is just getting started, but the team is moving quickly. If you’re on the hunt for an open source, developer-friendly CMS, [check them out](https://app.marblecms.com/login) (they have a Hobby plan).

If you’re building your own project, Marble’s story shows how Neon can help you ship faster and safer. [Start for free on our Free Plan](https://console.neon.tech/signup). And if you’re building in public and growing quickly, [consider applying to our Open Source Program](https://forms.gle/nP9FQ3jKe7t1NPgu9) for extra support.

---

_[Join our Discord](https://discord.gg/92vNTzKDGp) to ask us any questions and interact with the Neon community_.
