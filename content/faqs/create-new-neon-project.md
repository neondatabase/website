---
title: 'How do I create a new project in Neon?'
subtitle: 'Create one from the Console or the Neon CLI. Each project gets its own Postgres database, branches, and computes.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T19:11:12.829Z'
isDraft: false
redirectFrom: []
---

A Neon project is your top-level workspace. Each project has its own root branch, default database, default role, and primary compute. To create one, click **New Project** in the [Neon Console](https://console.neon.tech) and pick a name, Postgres version, and region. Or use the Neon CLI with `neon projects create`. Project limits depend on your plan: Free and Launch get 100 projects, Scale gets 1,000.

## Create the project

<Tabs labels={["Console", "CLI"]}>

<TabItem>

1. Sign in to the [Neon Console](https://console.neon.tech).
2. Click **New Project**.
3. Fill in:
   - **Project name** (up to 64 characters)
   - **Postgres version** (default is the latest supported)
   - **Cloud service provider** (AWS or Azure)
   - **Region** (pick the one closest to your application)
4. Click **Create Project**.

You'll land on the **Project Dashboard** with the connection string ready in the **Connect** widget. See [Create a project](/docs/manage/projects#create-a-project).

</TabItem>

<TabItem>

Install the CLI with `npm i -g neonctl` and run `neon auth` to log in. Then:

```bash
neon projects create \
  --name myproject \
  --region-id aws-us-east-2
```

Add `--org-id` to target a specific organization. The output includes the new project ID and the default connection string. See the [`projects` command reference](/docs/reference/cli-projects).

</TabItem>

</Tabs>

## What gets created

Every new project comes with:

- A root branch (named `production` in the Console, `main` via API and CLI)
- A primary read-write compute, defaulting to 0.25 CU (≈1 GB RAM)
- A database (`neondb` by default)
- A role named after the database (for example, `neondb_owner`)

For more on what's included, see [Default resources](/docs/manage/projects#default-resources).

## Troubleshooting "create project" failures

The most common reason a project creation fails is hitting your plan's project limit:

| Plan       | Project limit                                                         |
| ---------- | --------------------------------------------------------------------- |
| **Free**   | 100                                                                   |
| **Launch** | 100                                                                   |
| **Scale**  | 1,000 (request an increase via [support](/docs/introduction/support)) |

If you're at the limit:

- Delete unused projects from **Settings** > **Delete** in the Console. Deleted projects can be recovered within 7 days via the [API or CLI](/docs/manage/projects#recover-a-deleted-project).
- Or upgrade to Scale for the higher limit.

Other reasons creation can fail:

- The chosen region is temporarily unavailable. Try a different region or retry in a few minutes.
- Network issues between the Console and the Neon control plane. Check [neonstatus.com](https://neonstatus.com).

If neither applies and the error message isn't clear, contact [Neon Support](/docs/introduction/support) with the request ID shown in the error.

<Admonition type="tip" title="One project per app or per tenant">
For most workflows, create a separate project for each application or each customer. That gives each one its own isolated storage, computes, and branches, and keeps blast radius small if something goes wrong. See [Multitenancy](/docs/guides/multitenancy) for patterns.
</Admonition>

<CTA title="Manage projects" description="Full reference for creating, configuring, transferring, and deleting projects." buttonText="Read the docs" buttonUrl="/docs/manage/projects" />
