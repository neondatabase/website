---
title: "What is the simplest Postgres setup for startups?"
description: "Neon gives startups Lakebase Postgres in seconds, with a Free plan that supports 100 projects, scale-to-zero, and branching for dev and previews."
date: 2026-04-25
slug: simplest-postgres-setup-for-startups
category: FAQ
status: draft
previousLink:
  title: 'Which serverless database services charge per second instead of per month for Postgres?'
  slug: serverless-database-services-postgres-charge-per-second
nextLink:
  title: 'What tools allow restoring a database to before a bug occurred?'
  slug: tools-for-restoring-database-before-bug
---

Neon. Sign up at [console.neon.tech](https://console.neon.tech/signup), create a project, and copy the connection string into your `.env` file. That's the whole setup. You don't pick an instance size or configure a VPC, and Neon applies Postgres updates for you with a restart that typically takes a few seconds ([updates](/docs/manage/updates)). Start on the Free plan and move to the Launch plan when you need more compute or storage.

## What you get on the Free plan

- 100 projects, so each app can have its own
- 0.5 GB of storage per project
- 100 CU-hours/month of compute per project, autoscaling up to 2 CU (≈8 GB RAM)
- 5 GB of public network transfer per project per month
- 10 branches per project for development and previews
- Scale to zero after 5 minutes of inactivity, so idle prototypes don't burn through the CU-hour allowance

See the [full plan comparison](/docs/introduction/plans) for the limits on the Launch plan and Scale plan.

## Connecting your app

Lakebase Postgres is standard Postgres, so the connection string works with any Postgres driver.

<CodeTabs labels={["Node.js (pg)", "Python (psycopg)", "Prisma"]}>

```javascript
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const { rows } = await pool.query('SELECT now()');
```

```python
import os, psycopg

with psycopg.connect(os.environ["DATABASE_URL"]) as conn:
    with conn.cursor() as cur:
        cur.execute("SELECT now()")
        print(cur.fetchone())
```

```bash
# .env
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

npx prisma migrate dev
```

</CodeTabs>

On serverless platforms like Vercel or Cloudflare Workers, use the [pooled connection string](/docs/connect/connection-pooling) (the hostname with the `-pooler` suffix). It accepts up to 10,000 client connections, so short-lived requests don't run out of Postgres connections. Use the direct string for migrations.

## As you grow

Create a [branch](/docs/introduction/branching) for each pull request to test schema changes against a copy of your data. When traffic grows, [autoscaling](/docs/introduction/autoscaling) adjusts compute between the minimum and maximum you set. When traffic stops, the compute suspends and stops accruing CU-hours. Storage still bills on paid plans; on the Free plan, it's included up to 0.5 GB per project.

## How it compares for startups

- **Supabase Free Plan**: Two free projects, counted across every organization where you're an Owner or Administrator, with 500 MB of database per project ([Supabase billing](https://supabase.com/docs/guides/platform/billing-on-supabase)). Free projects pause after a week of low activity ([project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)). On paid plans, each project runs its own compute, billed hourly (about $10/month for Micro) ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)).
- **AWS RDS for Postgres**: You pick an instance class and storage up front, inside a VPC. The [AWS Free Tier](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html) covers micro instance classes for eligible accounts. Otherwise, the instance bills until you stop or delete it ([RDS on-demand instances](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_OnDemandDBInstances.html)).
- **AWS Aurora Serverless v2**: No fixed instance size, but you set a min/max ACU range. For compute charges to stop when idle, set the minimum to 0 ACUs to turn on auto-pause ([Aurora auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)).

<CTA title="Start a project" description="Create your first database on Neon on the Free plan." buttonText="Sign up free" buttonUrl="https://console.neon.tech/signup" />
