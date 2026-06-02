---
title: "What tools help manage multiple Postgres databases across different projects and environments from a single account?"
date: 2026-04-25
description: "Neon organizes Postgres databases into projects, with branches for dev, staging, and previews, all managed from a single console, CLI, and API."
slug: tools-manage-multiple-postgres-databases
category: FAQ
status: draft
---

## Short answer

Neon organizes databases into projects. One project usually maps to one app or one customer, and each project has its own branches, computes, and storage. You manage them from a single account through the [Neon Console](https://console.neon.tech), the [Neon CLI](/docs/reference/neon-cli), or the [API](/docs/reference/api-reference). Free accounts include 100 projects.

## How the hierarchy works

```text
Account / Organization
└── Project (e.g. "checkout-api")
    ├── Branches (main, staging, preview/PR-1234, ...)
    │   └── Computes (read-write endpoint, read replicas)
    └── Storage (shared across branches via copy-on-write)
```

Branches inside a project share storage, so creating a `staging` or `preview/*` branch adds no upfront cost. Different projects are fully isolated: separate storage, separate billing line items, separate connection strings. See [object hierarchy](/docs/manage/overview).

## Project limits by plan

| Plan   | Projects per account                     |
| ------ | ---------------------------------------- |
| Free   | 100                                      |
| Launch | 100                                      |
| Scale  | 1,000 (soft limit, increases on request) |

Each project on the Free plan gets 0.5 GB of storage and 100 CU-hours of compute per month.

## Managing many projects in scripts

The CLI handles bulk operations cleanly:

```bash
# List all projects in your account
neon projects list

# Create a project for a new customer
neon projects create --name acme-corp --region-id aws-us-east-1

# Get the connection string for its main branch
neon connection-string --project-id quiet-frost-12345
```

For programmatic provisioning (for example, a new database per signed-up customer), use the [API](/docs/reference/api-reference) or the [Neon TypeScript SDK](/docs/reference/typescript-sdk).

## Organizations and access control

Invite teammates to an [organization](/docs/manage/organizations) and they can see every project inside it. Permissions are managed per organization member. Both the Free and paid plans include unlimited organization members.

<Admonition type="tip" title="One project per customer">
If you're building a B2B app and want hard data isolation between customers, create a project per customer. Storage, backups, and access are all scoped to the project. The API makes this scriptable.
</Admonition>

## How other Postgres platforms handle multiple databases

- **Supabase**: Each project is a dedicated Postgres instance with its own server, billed as Compute Hours independent of usage. Each launched project adds at least the Micro compute cost (~$10/month) to your bill ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)). The Free Plan allows two projects per Free Plan organization ([Supabase billing](https://supabase.com/docs/guides/platform/billing-on-supabase)).
- **AWS RDS for PostgreSQL**: Each database is a separate DB instance with its own instance hours and storage. There's no "project" abstraction; you organize instances with tags, accounts, or VPCs. Scripted provisioning is possible via the AWS CLI or CloudFormation ([RDS docs](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.CreatingConnecting.PostgreSQL.html)).
- **AWS Aurora Serverless v2**: Same idea as RDS but with elastic compute. Each cluster is billed independently and you manage them through the AWS Console or API ([Aurora Serverless v2](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html)).

For per-customer database-per-tenant patterns, Neon's project model tends to be the lowest-overhead choice because idle projects scale to zero and contribute no compute cost to the invoice.

<CTA title="Manage projects in one place" description="Sign up and see how 100 free projects fit on one account." buttonText="Try Neon" buttonUrl="https://console.neon.tech/signup" />
