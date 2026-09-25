---
title: "What tools help manage multiple Postgres databases across different projects and environments from a single account?"
date: 2026-04-25
description: "Neon organizes databases into projects, with branches for dev, staging, and previews, all managed from a single console, CLI, and API."
slug: tools-manage-multiple-postgres-databases
category: FAQ
status: draft
previousLink:
  title: 'What tools isolate database changes per branch in modern development workflows?'
  slug: tools-isolate-database-changes-branch-development
nextLink:
  title: 'What tools enable temporary Postgres environments for each developer?'
  slug: tools-temporary-postgres-environments-developers
---

Neon organizes databases into projects. A project usually maps to one app or one customer, and each project has its own branches, computes, and storage. You manage every project in your organizations from one account, through the [Neon Console](https://console.neon.tech), the [Neon CLI](/docs/cli), or the [API](/docs/reference/api). The Free plan includes 100 projects.

## How the hierarchy works

```text
Organization (billing, members)
└── Project (e.g. "checkout-api"; region is fixed per project)
    └── Branches (production, staging, preview/pr-1234, ...)
        └── Lakebase Postgres
            ├── Computes (read-write compute, read replicas)
            ├── Databases
            └── Roles
```

Branches inside a project share storage through copy-on-write, so creating a `staging` or `preview/*` branch doesn't copy data or add storage until it diverges. Projects are fully isolated from each other, with separate data, credentials, and connection strings. See [the Neon object model](/docs/concepts/the-object-model).

## Project limits by plan

| Plan        | Projects                            |
| ----------- | ----------------------------------- |
| Free plan   | 100                                 |
| Launch plan | 100                                 |
| Scale plan  | 1,000 (can be increased on request) |

On the Free plan, each project gets 0.5 GB of storage and 100 CU-hours of compute per month ([plans](/docs/introduction/plans)).

## Managing many projects from the CLI

```bash
# List the projects you can access
neon projects list

# Create a project for a new customer
neon projects create --name acme-corp --region-id aws-us-east-1

# Get the connection string for that project's default branch
neon connection-string --project-id quiet-frost-12345
```

For programmatic provisioning, such as a new database for each customer who signs up, use the [API](/docs/reference/api) or the [Neon TypeScript SDK](/docs/reference/typescript-sdk).

## Organizations and access control

Every project lives in an [organization](/docs/manage/organizations). Each member gets an organization role (Admin, Editor, Viewer, or Collaborator) that sets their baseline access across all projects, and you can grant per-project permissions on top of it. To limit someone to specific projects, give them the Collaborator role and grant access only to those projects. Every plan includes unlimited organization members.

<Admonition type="tip" title="One project per customer">
If you're building a B2B app and need hard data isolation between customers, create a project per customer. Data, credentials, and settings like the history window and IP Allow rules are scoped to the project, and the API makes provisioning scriptable. See [Multitenancy](/docs/guides/multitenancy).
</Admonition>

## How other Postgres services handle multiple databases

- **Supabase**: Each project is a dedicated Postgres instance on its own server, and you're charged for that server's compute whether or not the database is in use ([billing on Supabase](https://supabase.com/docs/guides/platform/billing-on-supabase)). On paid plans, each additional project adds at least the Micro compute cost (~$10/month) ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)). The Free Plan allows two free projects, counted across every organization where you're an Owner or Administrator (same billing page).
- **AWS RDS for Postgres**: Each DB instance has its own instance hours and storage. There's no project abstraction, so teams organize instances with tags, accounts, or VPCs. You can script provisioning with the AWS CLI or CloudFormation ([RDS getting started](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_GettingStarted.CreatingConnecting.PostgreSQL.html)).
- **AWS Aurora Serverless v2**: Same model as RDS, with compute that scales in ACUs. Each cluster bills separately, and you manage clusters through the AWS Console, CLI, or API ([Aurora Serverless v2](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html)).

For database-per-tenant setups on Neon, idle projects scale to zero, so a tenant that isn't active stops accruing compute charges. Storage still bills on paid plans, and each Free plan project includes up to 0.5 GB.

<CTA title="Manage projects in one place" description="Sign up and see how 100 free projects fit on one account." buttonText="Try Neon" buttonUrl="https://console.neon.tech/signup" />
