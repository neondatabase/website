---
title: "What is the simplest Postgres setup for startups?"
description: "Neon gives startups a serverless Postgres database in seconds, with a Free plan that supports 100 projects, scale-to-zero, and branching for dev and previews."
date: 2026-04-25
slug: simplest-postgres-setup-for-startups
category: FAQ
status: draft
---

## Short answer

Sign up at [console.neon.tech](https://console.neon.tech/signup), create a project, and copy the connection string into your `.env` file. That's the whole setup. There's no instance size to pick, no VPC to configure, and no maintenance windows. The Free plan covers prototypes and the platform grows with you when you ship.

## What you get on the Free plan

- 100 projects per account (one project per app or customer is the recommended pattern)
- 0.5 GB of storage per project
- 100 CU-hours/month of compute per project, autoscaling up to 2 CU (≈8 GB RAM)
- 10 branches per project for development and previews
- Scale to zero after 5 minutes of inactivity, so idle prototypes don't burn through the allowance

See the [full plan comparison](/docs/introduction/plans) for the limits on Launch and Scale.

## Connecting your app

Every Neon database speaks standard Postgres. Use the connection string with any driver you already know:

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
DATABASE_URL="postgresql://user:pass@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require"

npx prisma migrate dev
```

</CodeTabs>

For serverless platforms like Vercel or Cloudflare Workers, use the [pooled connection string](/docs/connect/connection-pooling) (add `-pooler` to the hostname) so short-lived requests don't exhaust connections.

## Why this works for early-stage teams

You can start a project, push to production, and add a database branch for each PR review without thinking about infrastructure. When traffic grows, autoscaling adjusts compute between your set min and max. When traffic stops, the compute suspends and CU-hours stop accruing; you continue to pay for storage.

## How it compares for startups

- **Supabase Free Plan**: Two free projects per Free Plan organization, 500 MB database size per project, projects pause after extended inactivity ([Supabase billing](https://supabase.com/docs/guides/platform/billing-on-supabase)). Compute is dedicated per project, so each additional project adds a fixed Compute Hours line item on paid plans ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)).
- **AWS RDS for PostgreSQL**: You pick an instance class and storage up front. There's no free tier comparable to Neon's, and the instance runs (and bills) until you stop or delete it. Backups go to S3 with a configurable retention window ([RDS backups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html)).
- **AWS Aurora Serverless v2**: No fixed instance, but you set a min/max ACU range. If you want a bill that can fall to zero, you have to opt into auto-pause with a 0 ACU minimum ([Aurora auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)).

For startups optimizing for the simplest first day and the lowest idle cost, Neon's Free plan and per-project model tend to be the shortest path to a running Postgres.

<CTA title="Start a project" description="Create your first Neon database in under a minute." buttonText="Sign up free" buttonUrl="https://console.neon.tech/signup" />
