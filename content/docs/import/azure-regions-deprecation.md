---
title: Azure regions deprecation
subtitle: What's changing, what to do, and answers to common questions
summary: >-
  Neon Azure regions (azure-eastus2, azure-westus3, azure-gwc) were deprecated on
  April 7, 2026: new project creation is blocked. After October 5, 2026, these
  regions stop receiving Neon feature updates, and projects in Free organizations
  inactive for 90 days or more are subject to deletion; active and paid projects
  keep running. This guide covers the timeline, what to do (migrate to a Neon AWS
  region, migrate to Databricks Lakebase, delete, or export), and how to confirm
  which region a project is in.
enableTableOfContents: true
---

<Admonition type="warning">
Neon Azure regions were deprecated on April 7, 2026.

We recommend [migrating projects in Azure regions to another region](#what-to-do-next) by **October 5, 2026**.
</Admonition>

As of April 7, 2026, Neon's Azure regions are deprecated, and you can no longer create new projects in those regions.

After **October 5, 2026**, these regions will not receive Neon feature updates. Also on October 5, projects on Free plans that have been inactive for 90 days or more are subject to deletion.

Users with projects in Neon Azure regions will receive a personalized email about specific projects and next steps. This guide explains what's changing and what to do.

## Affected regions

Only projects in these Azure regions are affected:

- 🇺🇸 Azure East US 2 (Virginia) - `azure-eastus2`
- 🇺🇸 Azure West US 3 (Phoenix) - `azure-westus3`
- 🇩🇪 Azure Germany West Central (Frankfurt) - `azure-gwc`

Projects in AWS regions are not affected.

## Deprecation timeline

| Date                      | What happens                                                                                                                                          |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **April 7, 2026**         | Azure regions deprecated. New projects cannot be created in Azure regions. Existing projects keep running.                                            |
| **October 5, 2026**       | Azure regions will not receive new Neon features. Projects in Free organizations that have been inactive for 90 days or more are subject to deletion. |
| **After October 5, 2026** | A final end-of-service date will be announced.                                                                                                        |

## What to do next

**Migrate any projects you want to keep to an alternate region before October 5, 2026.** Migrating now keeps your project on actively developed infrastructure and lets you act on your own schedule.

There are three options for moving your Neon projects off of Azure regions:

1. **Migrate to a Neon AWS region.** Best if you don't need Azure data residency, and an AWS region in a similar location will suffice. See [Migrate to another Neon region](/docs/import/migrate-neon-to-another-region).
2. **Migrate to Databricks Lakebase.** Best if you need to keep your Postgres data in Azure. Lakebase is powered by the same serverless Postgres technology as Neon, under the Databricks product line, and supports the deprecated Azure regions. See [Migrate Neon to Lakebase](/docs/guides/migrate-neon-to-lakebase).
3. **Delete the project** if you no longer need it. This stops storage costs from accruing. See [Delete a project](/docs/manage/projects#delete-a-project).

If none of these fit, [export your data in Postgres-compatible form](/docs/guides/export-neon-postgres-compatible) so you can store it elsewhere.

## Frequently asked questions

### Why are these regions being deprecated?

We're focusing our infrastructure investment where our customers want to run Neon. Most Neon projects run in AWS regions, so concentrating there lets us ship features and reliability improvements faster, rather than splitting effort to maintain Azure in parallel. For teams that need Azure, [Databricks Lakebase](/docs/guides/migrate-neon-to-lakebase) runs the same Postgres technology as Neon and supports Azure regions.

### How do I find out which region a project is in?

You can check from the Console, the CLI, or the API:

- **Console.** Open your project, then check the **Project settings** widget on the project dashboard. The region is shown in the **Region** row.
- **CLI.** Run `neon projects list`. The `Region Id` column shows each project's region.
- **API.** Call `GET /projects` and check the `region_id` field on each project.

![Project settings widget showing the project region](/docs/import/azure-regions-deprecation/project-settings-region.png)

### Which AWS region should I migrate to?

To keep latency similar, choose the AWS region closest to your current Azure region. For the deprecated Azure regions, the nearest AWS equivalents are:

| Azure region                                            | Nearest AWS region                             |
| ------------------------------------------------------- | ---------------------------------------------- |
| 🇺🇸 Azure East US 2 (Virginia) - `azure-eastus2`         | 🇺🇸 AWS US East (N. Virginia) - `aws-us-east-1` |
| 🇺🇸 Azure West US 3 (Phoenix) - `azure-westus3`          | 🇺🇸 AWS US West (Oregon) - `aws-us-west-2`      |
| 🇩🇪 Azure Germany West Central (Frankfurt) - `azure-gwc` | 🇩🇪 AWS Europe (Frankfurt) - `aws-eu-central-1` |

If your workload has specific latency or data residency requirements, pick the region closest to your users.

### What changes about my project when I migrate to a new region?

A region migration creates a **new** Neon project in the target region. The new project gets a new hostname, so you'll need to update connection strings in your application. The new project also has a different project ID. Project-level settings (branches, integrations, autoscaling, IP Allow rules, monitoring) are configured per project. See the [migration guide](/docs/import/migrate-neon-to-another-region) for method-specific steps.

### Should I take a backup before migrating?

If your migration method uses `pg_dump` and `pg_restore`, the dump itself is a backup. If you're using Postgres logical replication, it's good practice to take a `pg_dump` snapshot of your source database first. See [Backups](/docs/manage/backups).

### How do I contact Neon about my Azure projects?

Keep an eye on your inbox for communication from us. If you have specific constraints, such as regulatory requirements or migration dependencies, reply to any migration outreach you receive or contact [Neon Support](https://console.neon.tech/app/projects?modal=support).

<NeedHelp/>
