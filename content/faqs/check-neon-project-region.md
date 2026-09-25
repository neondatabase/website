---
title: 'How can I check which region my Neon project is running in?'
subtitle: 'Check Project Settings, the CLI, or your connection string hostname.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'What are the cheapest ways to run a Postgres database for a project that gets very little traffic?'
  slug: cheapest-ways-run-postgres-database-low-traffic
nextLink:
  title: 'How do I check which Postgres version my Neon database is running?'
  slug: check-postgresql-version-neon
---

Check the **Settings** widget on the **Project Dashboard** in the Console, run `neon projects get <project_id>` in the CLI, or read the region from your connection string hostname. The API returns it too.

## Console

1. Open the [Neon Console](https://console.neon.tech) and select the project.
2. On the **Project Dashboard**, find the **Settings** widget.
3. The region is listed there, including the provider (AWS, or Azure for older projects in the [deprecated Azure regions](/docs/import/azure-regions-deprecation)).

See [Project settings](/docs/manage/projects#project-settings).

## CLI

The `projects list` and `projects get` commands both show a **Region Id** column.

```bash
neon projects list
```

```text
┌────────────────────────┬──────────┬───────────────┬──────────────────────┐
│ Id                     │ Name     │ Region Id     │ Created At           │
├────────────────────────┼──────────┼───────────────┼──────────────────────┤
│ crimson-voice-12345678 │ frontend │ aws-us-east-2 │ 2024-04-15T11:17:30Z │
└────────────────────────┴──────────┴───────────────┴──────────────────────┘
```

Or for a specific project:

```bash
neon projects get crimson-voice-12345678
```

See [`neon projects get`](/docs/cli/projects#get).

## Connection string

The hostname in your connection string includes the region. For example:

```text shouldWrap
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

The segment just before `.aws.neon.tech` (or `.azure.neon.tech` on Azure projects) is the region:

- `us-east-2.aws.neon.tech` → AWS US East (Ohio)
- `eu-central-1.aws.neon.tech` → AWS Europe (Frankfurt)
- `ap-southeast-1.aws.neon.tech` → AWS Asia Pacific (Singapore)
- `eastus2.azure.neon.tech` → Azure East US 2 (deprecated; no new projects)

The `ep-cool-darkness-a1b2c3d4` portion is the compute endpoint ID, and `-pooler` marks a pooled connection. Neither tells you the region. The [Regions](/docs/introduction/regions) page lists every region ID.

<Admonition type="tip" title="All branches share the project's region">
You can't run different branches in different regions. To find where a branch's data lives, look up its project's region.
</Admonition>

## API

To get the region programmatically, call the [Neon API](/docs/reference/api/projects/get-project):

```bash shouldWrap
curl "https://console.neon.tech/api/v2/projects/$PROJECT_ID" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Accept: application/json" | jq '.project.region_id'
```

The `region_id` field uses the same IDs as the CLI, such as `aws-us-east-2` (or `azure-eastus2` for an existing Azure project). New projects can only be created in AWS regions.

<CTA title="Need a different region?" description="A project's region is fixed. To switch, create a new project in the target region and migrate." buttonText="Migration guide" buttonUrl="https://neon.com/docs/import/region-migration" />
