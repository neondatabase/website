---
title: Azure regions deprecation
subtitle: What's changing, what to do, and answers to common questions
summary: >-
  Neon Azure regions (azure-eastus2, azure-westus3, azure-gwc) were deprecated
  on April 7, 2026: new project creation is blocked, but existing projects keep
  running with no end-of-support date currently set. Readers who need to act can
  delete the project, migrate to a Neon AWS region, or move to Databricks
  Lakebase to retain Azure data residency. The page also covers how to confirm
  which region a project is in via the Console, CLI, or API, and what changes
  when migrating, including new hostnames and project IDs.
enableTableOfContents: true
---

Neon Azure regions are deprecated. You can no longer create new projects in Azure regions, but existing Azure projects continue to be supported until further notice. This guide explains what the deprecation means and what actions are available if you have active projects in Azure regions.

You should receive personalized email communication about your specific projects and next steps. This guide answers common questions and provides general guidance during the deprecation.

## What changed

As of **April 7, 2026**, Azure regions are deprecated and new project creation in Azure regions is restricted. Existing projects keep running normally and remain supported until further notice. There is no end-of-support date today. If that changes, we'll give you advance notice and time to migrate.

We'll contact organizations with active Azure projects directly to discuss migration options and timelines.

## What to do

Your existing Azure projects keep running, so there's no immediate action to take. If you'd like to move off Azure, you have three options:

1. **Delete the project** if you no longer need it. This also stops storage costs from accruing. See [Delete a project](/docs/manage/projects#delete-a-project).
2. **Migrate to a Neon AWS region.** Best if you don't need Azure residency. See [Migrate to another Neon region](/docs/import/migrate-neon-to-another-region) for the available migration methods.
3. **Migrate to Databricks Lakebase.** Best if you need to keep your Postgres data in Azure. Lakebase is powered by the same serverless Postgres technology as Neon, under the Databricks product line. See [Migrate Neon to Lakebase](/docs/guides/migrate-neon-to-lakebase).

If none of these fit your requirements, [export your data in Postgres-compatible form](/docs/guides/export-neon-postgres-compatible) so you can move it elsewhere.

## Frequently asked questions

### Does this affect my Neon projects?

Only if your project is in an Azure region (`azure-eastus2`, `azure-westus3`, or `azure-gwc`). Projects in AWS regions are not affected.

### How do I find out which region a project is in?

You can check from the Console, the CLI, or the API:

- **Console.** Open your project, then check the **Project settings** widget on the project dashboard. The region is shown in the **Region** row.
- **CLI.** Run `neon projects list`. The `Region Id` column shows each project's region.
- **API.** Call `GET /projects` and check the `region_id` field on each project.

![Project settings widget showing the project region](/docs/import/azure-regions-deprecation/project-settings-region.png)

### Will my Azure project keep running?

Yes. Your Azure project keeps running as it does today. Compute, storage, branching, and connections are unaffected. Existing Azure projects remain supported until further notice.

### Will my Azure project be removed?

No. Existing Azure projects remain supported until further notice. If we set a date to end Azure support in the future, we'll notify you in advance and give you time to migrate or export your data.

### What if I do nothing?

Your project continues running as it does today. There's no deadline to migrate. If we decide to end Azure support in the future, we'll contact you ahead of time so you can plan a migration or export.

### I picked Azure for data residency. What are my options?

Migrate to [Databricks Lakebase](/docs/guides/migrate-neon-to-lakebase). Lakebase is powered by the same serverless Postgres technology as Neon, under the Databricks product line. It supports Azure regions, so you can keep your data in Azure. For specific Lakebase region availability, see the [Lakebase Postgres documentation](https://docs.databricks.com/aws/en/oltp).

### What changes about my project when I migrate to a new region?

A region migration creates a **new** Neon project in the target region. The new project gets a new hostname, so plan to update connection strings in your application. The new project also has a different project ID.

Project-level settings (branches, integrations, autoscaling configuration, IP Allow rules, monitoring, and so on) are configured per project. Review the [migration guide](/docs/import/migrate-neon-to-another-region) for the steps and decisions specific to your migration method.

### Should I take a backup before migrating?

If your migration method uses `pg_dump` and `pg_restore`, the dump itself is a backup. If you're using logical replication or the [Import Data Assistant](/docs/import/import-data-assistant), it's still good practice to take a `pg_dump` snapshot of your source database before you start. See [Backups](/docs/manage/backups) for details.

### What if I need to stay on Azure for now?

That's fine. Existing Azure projects remain supported until further notice, so you can keep running on Azure. If you have specific constraints, such as regulatory requirements, application architecture changes, or customer migration dependencies, and want to talk through a plan, reply to any migration outreach you receive or contact [Neon Support](https://console.neon.tech/app/projects?modal=support).

### How do I contact Neon about my Azure projects?

Keep an eye on your inbox for communication from us about the deprecation. If you have questions before then, contact [Neon Support](https://console.neon.tech/app/projects?modal=support).

<NeedHelp/>
