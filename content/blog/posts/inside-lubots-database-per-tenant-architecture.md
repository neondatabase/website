---
title: "Inside LuBot's database-per-tenant architecture"
description: One solo founder, the Neon API, six days = a scalable multi-tenant setup
excerpt: >-
  It took six days to go from zero to isolated Postgres per tenant, provisioned
  the moment someone pays. A traditional Postgres setup would have been a full
  quarter of work.
date: '2026-09-14T12:00:00'
updatedOn: '2026-09-14T00:40:00'
category: product
categories:
  - product
  - case-study
authors:
  - carlota-soto
cover:
  image: https://cdn.neonapi.io/public/images/pages/blog/inside-lubots-database-per-tenant-architecture/cover.jpg
  alt: "Inside LuBot's database-per-tenant architecture"
isFeatured: false
seo:
  title: "Inside LuBot's database-per-tenant architecture - Neon"
  description: One solo founder, the Neon API, six days = a scalable multi-tenant setup
  keywords: []
  noindex: false
  ogTitle: "Inside LuBot's database-per-tenant architecture - Neon"
  ogDescription: One solo founder, the Neon API, six days = a scalable multi-tenant setup
  image: https://cdn.neonapi.io/public/images/pages/blog/inside-lubots-database-per-tenant-architecture/social.jpg
---

<blockquote>
<p><strong>“It took six days to go from zero to isolated Postgres per tenant, provisioned the moment someone pays. A traditional Postgres setup would have been a full quarter of work.”</strong><br></br><br></br>Lubo Bali, Founder of <a href="https://lubot.ai/">LuBot</a></p>
</blockquote>

[LuBot](https://lubot.ai) is a chat product for business analytics [built by a solo founder](https://www.linkedin.com/in/lubo-bali/). It allows users to ask questions in plain English about their data while pulling info from their portfolio and stocks, website traffic, and files such as Excel spreadsheets or PDFs.

![LuBot interface showing portfolio exposure analysis and tools for portfolio, file, and website data](https://cdn.neonapi.io/public/images/pages/blog/inside-lubots-database-per-tenant-architecture/image-1.jpg)

Right since it first started, LuBot was built as a multi-tenant SaaS:

- Clerk handled identity
- Stripe handled checkout
- Admin data lived in Supabase, scoped per organization. This was a natural starting point, but a single shared database was never going to give each customer true isolation.

## Why one shared database was not enough

Very early on, Lubo knew they needed stronger isolation than storing every customer's data in shared tables:

- Each tenant in LuBot has 52 tables across four schemas: `files`, `public`, `shared`, and `stock`
- Those schemas map to the three product modes
- Files live in `files`
- Website and shared application data live in `public` and `shared`
- Portfolio and market data live in `stock`

Giving every customer a separate Postgres database would provide a clear isolation boundary, but building the provisioning, routing, and lifecycle infrastructure for traditional Postgres instances in Supabase would be too much work for one person, and the resulting setup would be too expensive to maintain and to scale.

Neon offered a different model thanks to branching:

- A branch is an isolated, copy-on-write clone of its parent
- Branches have their own compute resources, scale independently, and changes in one branch do not affect its parent or other branches
- They can also be deployed through the [Neon API](https://neon.com/docs/guides/branching-neon-api)

## Using Neon to deploy one Postgres database per customer

Lubo split responsibilities cleanly:

- Supabase stays as the control plane, holding the admin and account data shared across the product: organizations, users, and billing state
- Neon holds the tenant data. Each paying customer gets their own isolated Postgres database, created the moment they become a paying user.

<blockquote>
<p><strong>“In LuBot, Supabase holds the admin layer and Neon holds the tenant data. Neon is what allows me to provision a database at checkout with idle tenants scaling to zero, so I am not paying for compute when nobody is querying.”</strong><br></br><br></br>Lubo Bali, Founder of <a href="https://lubot.ai/">LuBot</a></p>
</blockquote>

The flow looks like this:

1. The customer completes checkout through Stripe
2. A Stripe webhook calls the Neon branches API
3. LuBot creates a branch with a deterministic name, so webhook retries do not create a duplicate tenant
4. The application runs its schema migration against the new branch
5. LuBot stores the branch's connection URL against the user row
6. The customer's next request is already routing to their own database

The whole flow sits behind one function, `get_tenant_engine`, in `services/tenant_resolver.py`. Every database operation in LuBot goes through that function, and application code asks for a tenant-specific engine. It does not choose a connection string, create a branch, or decide which schema to hit.

## Scaling active tenants without paying for idle compute

<blockquote>
<p><strong>“Without autoscaling and scale to zero, a single idle tenant would cost about $20 a month. With Neon, idle tenants are practically free, and active computes only burst capacity if they have to. That is what makes this setup possible at scale.”</strong><br></br><br></br>Lubo Bali, Founder of <a href="https://lubot.ai/">LuBot</a></p>
</blockquote>

What makes this architecture doable in Neon is not only the ability to manage branches via the API but also its serverless compute model.

Each tenant compute can autoscale. In LuBot, the most common configuration is a 0.25 CU active floor and a 4 CU burst ceiling. After 300 seconds without activity, the compute suspends. LuBot stops paying for compute while it is suspended, though storage remains billed. That combination is what makes a database-per-tenant design viable on a bootstrap budget.

![Neon Console showing LuBot tenant branches with independent autoscaling computes](https://cdn.neonapi.io/public/images/pages/blog/inside-lubots-database-per-tenant-architecture/image-2.jpg)

## Tips on pooled connections, search_path, and pool leaks

If you run a database per tenant behind a pooler, a few things are worth knowing before you hit them in production.

LuBot connects through Neon's pooled connection string, which uses PgBouncer in transaction mode. That is the right default for a request-driven FastAPI app: it accepts [up to 10,000 client connections](https://neon.com/docs/connect/connection-pooling) and hands each one back to the pool as soon as a transaction ends.

The tradeoff is that transaction mode does not keep session state. Anything you set with `SET` is gone once the connection returns to the pool. For a tenant database split across four schemas, the setting that bites is `search_path`:

```sql
SET search_path TO files, public, shared, stock;
SELECT * FROM some_table;
```

On a pooled connection, that `SET` only lasts for the current transaction. The next query can land on a recycled connection with a different path, and tables in `files` or `stock` suddenly look missing even though the branch is healthy.

A few habits will keep this from happening:

- Use the pooled URL for application traffic, and the direct URL for migrations, `pg_dump`, and anything that needs session state
- Set `search_path` per query or at the role level, not once per session
- Reset connections on check-in, so one tenant's session state cannot leak into the next request through a reused connection
- Use deterministic branch names, so a retried Stripe webhook never creates a duplicate tenant

## Give your end users their own isolated database

Lubo started the tenant resolver on April 23, 2026. By April 29, Stripe checkout could provision a branch, migrate its schema, save the connection URL, and route the next request. Six days from zero to a working per-user Neon branch on payment.

If your application needs a database per customer, agent, or environment, start with [branching through the Neon API](https://neon.com/docs/guides/branching-neon-api), or ask your agent to build this.

---

*Thank you to Lubo Bali for sharing LuBot's architecture. If you would also like to share how you are building with Neon, tell us in the [Neon community on Discord](https://neon.com/discord).*
