---
title: 'How do I create a new project in Neon?'
subtitle: 'Create one from the Console or the Neon CLI. Each project gets its own Postgres database, branches, and computes.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'How do I create a new database in my Neon project?'
  slug: create-new-database-neon-project
nextLink:
  title: 'How do I create tables in my Neon database using SQL?'
  slug: create-tables-with-sql-neon
---

A Neon project is the top-level container for your database environment. Each project has its own root branch, default database, default role, and primary compute. To create one, click **New Project** in the [Neon Console](https://console.neon.tech) and pick a name and AWS region, or run `neon projects create` with the Neon CLI. The Free plan and Launch plan allow 100 projects, and the Scale plan allows 1,000 ([Plans](/docs/introduction/plans#projects)).

## Create the project

<Tabs labels={["Console", "CLI"]}>

<TabItem>

1. Sign in to the [Neon Console](https://console.neon.tech).
2. Click **New Project**.
3. Enter a **Project name** (up to 64 characters) and choose a **Region**. Pick the AWS region closest to your application.
4. Under **Services**, **Postgres database** is on by default. Expand it to set the **Postgres version**. Depending on the region, you can also turn on Object Storage, Functions, AI Gateway, and Neon Auth.
5. Click **Create project**.

You'll land on the **Project Dashboard**. Click **Connect** in the Console nav to get a connection string. See [Create a project](/docs/manage/projects#create-a-project).

</TabItem>

<TabItem>

Install the CLI with `npm i -g neon` and run `neon login` to log in. Then:

```bash
neon projects create \
  --name myproject \
  --region-id aws-us-east-2
```

`--region-id` defaults to `aws-us-east-2` if you leave it out. Add `--org-id` to target a specific organization, or `--set-context` to make the new project the default for later CLI commands. The output includes the new project ID and the default connection string. See the [`projects` command reference](/docs/cli/projects).

</TabItem>

</Tabs>

## What gets created

Every new project comes with:

- A root branch, named `production` when you create the project in the Console and `main` when you use the API or CLI
- A primary read-write compute. New projects default to autoscaling from 0.25 CU (≈1 GB RAM) up to 2 CU on the Free plan, or up to 8 CU on paid plans ([Autoscaling defaults](/docs/guides/autoscaling-guide#autoscaling-defaults-for-each-neon-plan))
- A database, named `neondb` unless you pick another name
- A role named after the database (for example, `neondb_owner`)

See [Default resources](/docs/manage/projects#default-resources).

## When project creation fails

The most common cause is hitting your plan's project limit:

| Plan            | Project limit                                                         |
| --------------- | --------------------------------------------------------------------- |
| **Free plan**   | 100                                                                   |
| **Launch plan** | 100                                                                   |
| **Scale plan**  | 1,000 (request an increase via [support](/docs/introduction/support)) |

If you're at the limit:

- Delete unused projects in the Console under **Settings** > **Delete**. You can recover a deleted project within 7 days through the [API or CLI](/docs/manage/projects#recover-a-deleted-project).
- Or upgrade to the Scale plan for the higher limit.

If you're under the limit, check [neonstatus.com](https://neonstatus.com) for an incident in your region, then retry or pick a different region. If the error message still isn't clear, ask in the [Neon Discord](https://neon.com/discord) and include the request ID from the error if there is one. Scale plan users can also [open a support ticket](/docs/introduction/support#support-tickets).

<Admonition type="tip" title="One project per app or per tenant">
Create a separate project for each application or each customer. Each one gets its own storage, computes, and branches, so a mistake in one project can't touch the others. See [Multitenancy](/docs/guides/multitenancy) for patterns.
</Admonition>

<CTA title="Manage projects" description="Full reference for creating, configuring, transferring, and deleting projects." buttonText="Read the docs" buttonUrl="/docs/manage/projects" />
