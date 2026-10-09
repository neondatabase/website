---
title: "Which Postgres services make it easy to share a live read-only database snapshot with a contractor or external reviewer without granting production access?"
description: "Create a Neon branch from production, add a read-only role or read replica, and hand a contractor a connection string without granting production access."
date: 2026-04-25
slug: postgres-services-share-read-only-database-snapshot
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres services let a SaaS platform provision a new database per tenant at sign-up without manual steps?'
  slug: postgres-services-saas-tenant-database-provisioning
nextLink:
  title: 'What Postgres services work well with Terraform or Pulumi so database infrastructure can be managed as code?'
  slug: postgres-services-terraform-pulumi-infrastructure-as-code
---

Create a branch from your production database, add a read-only role on that branch, and give the contractor its connection string. They get a live, queryable copy of the data. They can't reach production, and their queries run on the branch's own compute, not production's.

## How the branch works

A Neon branch is a full copy of its parent's data at a point in time. It shares storage with the parent until either side writes, so creating one takes seconds and adds no storage up front.

Create one with the CLI. Without `--parent`, the branch comes from your project's default branch:

```bash
neon branches create --name contractor-review
```

Changes on production after that point don't appear on the branch. To refresh it later, [reset it from its parent](/docs/guides/reset-from-parent).

## Make it read-only

Roles you create with the Neon Console, CLI, or API are members of `neon_superuser`, which includes `pg_write_all_data` and `BYPASSRLS`. Don't hand one of those to a contractor. Instead, connect to the branch as your owner role and [create a limited role with SQL](/docs/manage/database-access#create-a-read-only-role):

```sql
CREATE ROLE contractor WITH LOGIN PASSWORD '<password>';
GRANT CONNECT ON DATABASE dbname TO contractor;
GRANT USAGE ON SCHEMA public TO contractor;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO contractor;
```

Roles created with SQL don't get `neon_superuser` membership, so this role can only read the tables you grant. The password needs at least 60 bits of entropy ([password rules](/docs/manage/roles#manage-roles-with-sql)). Because you set it in SQL, build the connection string yourself from the branch's hostname:

```text
postgresql://contractor:[password]@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

For a second guard, add a [read replica](/docs/introduction/read-replicas) to the branch and give the contractor the replica's hostname. A read replica compute can't write, whatever the role allows, and it supports autoscaling and scale to zero like any other compute. The Free plan allows up to 3 read replica computes per project.

The string works with psql, DBeaver, DataGrip, Metabase, Tableau, and other Postgres clients.

<Admonition type="tip" title="Set an expiry">
Set a [branch expiration](/docs/guides/branch-expiration) so the branch deletes itself when the engagement ends. On paid plans, mark your production branch as [protected](/docs/guides/protected-branches) so it can't be deleted or reset.
</Admonition>

## What this costs

A child branch is billed on the lower of its accumulated changes or its logical data size, at $0.35/GB-month. If the contractor only reads, the branch writes almost nothing, so its storage cost stays near zero. The parent's storage bills as usual.

Compute on the branch or its read replica bills in CU-hours and scales to zero when the contractor isn't connected. On the Launch plan, a 0.25 CU compute running for 8 hours a day costs about $0.21 per day.

<CTA title="Try branching for contractor handoffs" description="Sign up free and create your first read-only review branch in under a minute." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
