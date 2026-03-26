---
title: Neon vs Amazon RDS / Aurora
subtitle: 'Serverless Postgres vs traditional managed Postgres on AWS'
summary: >-
  A feature-by-feature comparison of Neon and Amazon RDS / Aurora for PostgreSQL,
  covering architecture, developer experience, scaling, cost, compliance,
  enterprise features, and migration paths.
enableTableOfContents: true
updatedOn: '2026-03-23T00:00:00.000Z'
---

Neon and Amazon RDS / Aurora are both managed Postgres services, but they take fundamentally different approaches to architecture, scaling, and developer workflows. This page compares the two platforms so you can choose the right fit.

<Admonition type="note">
Information about Amazon RDS and Aurora is based on publicly available AWS documentation as of March 2026. AWS updates these services regularly — check the [RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html) and [Aurora](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html) docs for the latest details.
</Admonition>

## Platform overview

| Dimension | Neon | Amazon RDS for PostgreSQL | Amazon Aurora PostgreSQL |
| --- | --- | --- | --- |
| **Core product** | Serverless Postgres with separated storage and compute | Traditional managed Postgres with provisioned instances | AWS-built Postgres-compatible engine with distributed storage |
| **Architecture** | Postgres on object storage with stateless, ephemeral compute (also powers [Databricks Lakebase](#databricks-lakebase)) | Standard Postgres on EBS-backed EC2 instances | Custom storage layer with 6-way replication across 3 AZs |
| **Postgres compatibility** | Full Postgres — same extensions, ORMs, drivers, wire protocol | Full Postgres | Postgres-compatible (most extensions supported; some limitations) |
| **Setup** | `npx neonctl@latest init` from your terminal — one command for account, project, connection string, and dev tooling | AWS Console, CLI, CloudFormation, CDK, or Terraform — multiple configuration steps | Same as RDS (AWS Console, CLI, IaC) |
| **Branching** | Instant copy-on-write database branches for dev, CI, previews, and rollbacks | Not available | Not available |

## Scaling

| Feature | Neon | Amazon RDS | Amazon Aurora |
| --- | --- | --- | --- |
| **Autoscaling** | Automatic — compute scales with workload in real time | Not available — choose an instance size, resize manually | Aurora Serverless v2 scales between min/max ACUs |
| **Scale-to-zero** | Yes — idle databases scale to zero automatically; no charge for idle compute | No — instances run (and bill) 24/7 | No — Aurora Serverless v2 has a minimum of 0.5 ACU |
| **Scaling granularity** | Sub-second, fractional compute units | Instance class changes (requires restart or failover) | 0.5 ACU increments |
| **Read replicas** | Yes, with independent autoscaling | Up to 15 (same-region or cross-region) | Up to 15 (shared storage, low-latency replication) |

Neon's scaling model is designed for workloads that fluctuate — development databases that sit idle most of the day, preview environments that only run during CI, or production apps with variable traffic. You pay only for compute time actually consumed, and idle databases cost nothing.

RDS and Aurora provision fixed compute. Aurora Serverless v2 adds autoscaling within a configured range, but it doesn't scale to zero — you always pay for at least 0.5 ACU (~1 GB RAM) per instance.

## Developer experience

| Feature | Neon | Amazon RDS / Aurora |
| --- | --- | --- |
| **Getting started** | `npx neonctl@latest init` — one command | Create VPC, subnet group, security group, parameter group, then launch instance |
| **Database branching** | Instant copy-on-write branches from any point in time | Not available — create manual snapshots and restore to new instances |
| **Preview environments** | One branch per PR; auth, schema, and data included | Snapshot-and-restore or scripted database provisioning per PR |
| **Point-in-time restore** | Instant, to any second within retention window (no new instance required) | Restores to a new instance (takes minutes to hours depending on size) |
| **Serverless driver** | `@neondatabase/serverless` — HTTP and WebSocket for edge/serverless runtimes | Not available — requires TCP connections via standard drivers |
| **Connection pooling** | Built-in (PgBouncer), no extra cost | RDS Proxy (separate service, additional cost) |
| **Console** | Web-based SQL editor, branching UI, connection details | AWS Console with RDS-specific panels |
| **CLI** | [Neon CLI](/docs/reference/neon-cli) with `neon init`, branching, and project management | AWS CLI (`aws rds` subcommands) |

Database branching is Neon's largest workflow difference. A branch is an instant, isolated copy of your database (schema + data) that you can create, test against, and discard — like a Git branch for your database. This enables:

- **Preview environments**: spin up a real database branch per pull request, automatically
- **CI/CD testing**: run migrations and integration tests against a production-like copy
- **Safe migrations**: test schema changes on a branch before applying to production
- **Instant rollback**: restore to any point in your branch history

RDS and Aurora don't have an equivalent. The closest alternative — snapshot and restore — creates a new instance, which takes minutes to hours and doesn't integrate into PR-based or CI workflows without significant scripting.

## Cost model

| Dimension | Neon | Amazon RDS | Amazon Aurora |
| --- | --- | --- | --- |
| **Compute billing** | Per-second, only while active | Per-hour, always-on (even when idle) | Per-ACU-hour (Serverless v2) or per-hour (provisioned) |
| **Scale-to-zero savings** | Yes — dev/staging/preview databases cost $0 when idle | No — instances bill continuously | No — minimum 0.5 ACU billed continuously |
| **Storage billing** | Per GiB-month | Per GiB-month (provisioned or gp3) | Per GiB-month + I/O charges |
| **Connection pooling** | Included | RDS Proxy is a separate billable service |  RDS Proxy is a separate billable service |
| **Branching** | Branches share storage via copy-on-write (minimal additional cost) | Snapshots are full copies (full storage cost per copy) | Same — snapshots are full copies |
| **Free tier** | [Free plan](/docs/introduction/plans#free-plan) — always free, includes 0.5 GiB storage and 191 compute hours/month | 12-month free tier (750 hours/month of db.t3.micro, 20 GiB storage) | Not available |

For workloads with variable or bursty traffic, Neon's per-second billing and scale-to-zero can significantly reduce costs compared to always-on RDS or Aurora instances. This is especially pronounced in development, where teams typically run many databases (one per developer, one per PR, staging, QA) that sit idle most of the time.

Neon's free tier is permanently free with no time limit. RDS's free tier expires after 12 months.

## Authentication and APIs

| Feature | Neon | Amazon RDS / Aurora |
| --- | --- | --- |
| **Managed user auth** | [Neon Auth](/docs/auth/overview) — signup, login, sessions, social OAuth, stored in your database | Not available — use Cognito, a third-party provider, or build your own |
| **Data API** | PostgREST-compatible REST API auto-generated from your schema | Not available — connect via standard Postgres drivers only |
| **Auth branching** | Auth state branches with the database for preview environments | Not applicable |

If your application needs user authentication, Neon includes Neon Auth out of the box. With RDS or Aurora, you'll need to integrate a separate service like Amazon Cognito, Auth0, or Clerk, and manage that integration yourself.

## Compliance and enterprise features

| Feature | Neon | Amazon RDS / Aurora |
| --- | --- | --- |
| **SOC 2 Type 2** | Yes | Yes (inherited from AWS) |
| **ISO 27001** | Yes | Yes (inherited from AWS) |
| **HIPAA** | Yes — included on Scale plan with self-serve BAA, no additional cost | Yes — via AWS BAA (covers RDS as a HIPAA-eligible service) |
| **GDPR / CCPA** | Yes | Yes |
| **Private networking** | AWS PrivateLink on Scale plan | VPC-native; private subnets, security groups, PrivateLink |
| **IP allowlisting** | Yes, with protected-branch-only mode | Security group rules |
| **Encryption at rest** | Yes (AES-256) | Yes (AWS KMS) |
| **Encryption in transit** | Yes (TLS required) | Yes (TLS supported, configurable) |
| **IAM authentication** | Not applicable — Neon manages auth | Yes — IAM database authentication |

Both platforms meet enterprise compliance requirements. AWS's advantage is native VPC integration and IAM — if your infrastructure is already built around AWS IAM policies and VPC architecture, RDS/Aurora fit directly into that model.

Neon's advantage is accessibility: HIPAA compliance with a self-serve BAA on the Scale plan, no additional cost or sales call required.

## Databricks Lakebase

Neon's architecture also powers [Databricks Lakebase](https://www.databricks.com/product/lakebase), a managed Postgres service that runs natively in the Databricks Data Intelligence Platform. If your organization uses both AWS and Databricks, Lakebase may be a compelling alternative to RDS/Aurora:

- **No ETL friction** — operational data is in the lakehouse storage layer, accessible to analytics and ML without replication or CDC pipelines
- **Unity Catalog governance** — consistent access control, lineage, and security across operational and analytical data
- **Native Databricks integration** — SQL, notebooks, AI tooling, and pipelines work directly on operational data
- **Same Neon architecture** — serverless scaling, branching, and instant restore

For organizations currently using RDS to feed data into Databricks via ETL/CDC, Lakebase eliminates that integration layer entirely.

For a full comparison, see [Neon vs Lakebase](/docs/introduction/neon-and-lakebase).

## When to choose Neon

- You want **serverless Postgres** that scales automatically and costs nothing when idle
- You need **database branching** for dev, CI, preview environments, or safe migrations
- You want to **get started in seconds** with `npx neonctl@latest init` — no AWS account or infrastructure setup required
- You need **managed authentication** that branches with your database (Neon Auth)
- You need **HIPAA compliance** without a sales call or expensive add-ons
- You're building on **any cloud or framework** and want standard Postgres without AWS lock-in
- You're building an **agent or codegen platform** that needs fleets of databases with usage-based pricing
- Your organization uses **Databricks** and wants operational Postgres integrated with the Lakehouse (via Lakebase)

Ready to get started? Run `npx neonctl@latest init` from your project directory, or see [Connect Neon to your stack](/docs/get-started/connect-neon).

## When to choose Amazon RDS / Aurora

- Your infrastructure is **deeply integrated with AWS** (IAM, VPC, CloudFormation) and you need native VPC placement
- You need **IAM database authentication** tied to your AWS identity model
- You're running **steady-state, always-on workloads** where provisioned capacity is more cost-effective than per-second billing
- You need **Aurora's distributed storage** with 6-way replication and fast failover for high-availability workloads
- You need **cross-region read replicas** with Aurora Global Database for multi-region deployments
- Your team already has **AWS operational expertise** and established runbooks for RDS management

## Migrating from RDS / Aurora to Neon

Neon supports standard Postgres migration tools:

- **pg_dump / pg_restore**: [Migrate from Postgres](/docs/import/migrate-from-postgres) — the standard approach for most databases
- **AWS DMS**: [Migrate with AWS Database Migration Service](/docs/import/migrate-aws-dms) — for larger databases or when you need CDC-based migration
- **Logical replication**: [Set up logical replication](/docs/guides/logical-replication-guide) — for near-zero-downtime migration with continuous replication during transition

<NeedHelp/>
