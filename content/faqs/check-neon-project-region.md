---
title: 'How can I check which region my Neon project is running in?'
subtitle: 'Check Project Settings, the CLI, or your connection string hostname.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T19:11:12.829Z'
isDraft: false
redirectFrom: []
---

## Quick answer

There are three quick ways to see your project's region: check the **Settings** widget on the **Project Dashboard** in the Console, run `neon projects get <project_id>` in the CLI, or read the region segment of your connection string hostname.

## Console

1. Open the [Neon Console](https://console.neon.tech) and select the project.
2. On the **Project Dashboard**, find the **Settings** widget.
3. The region is listed there alongside the cloud provider.

See [Project settings](/docs/manage/projects#project-settings).

## CLI

The `projects get` and `projects list` commands include the region ID in their output.

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

See [`neon projects get`](/docs/reference/cli-projects#get).

## Connection string

The region is embedded in the hostname segment of your connection string. Take this example:

```text shouldWrap
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

Read backwards from `.aws.neon.tech` (or `.azure.neon.tech`). The segment immediately before is the region:

- `us-east-2.aws.neon.tech` → AWS US East (Ohio)
- `eu-central-1.aws.neon.tech` → AWS EU Central (Frankfurt)
- `ap-southeast-1.aws.neon.tech` → AWS Asia Pacific (Singapore)
- `eastus2.azure.neon.tech` → Azure East US 2

The `ep-cool-darkness-a1b2c3d4` portion is the compute ID, not the region.

<Admonition type="tip" title="All branches share the project's region">
You can't run different branches in different regions. If you need to confirm where any specific branch's data lives, look up the parent project's region.
</Admonition>

## API

If you need the region programmatically:

```bash shouldWrap
curl "https://console.neon.tech/api/v2/projects/$PROJECT_ID" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Accept: application/json" | jq '.project.region_id'
```

The `region_id` field uses the same identifiers as the CLI (`aws-us-east-2`, `azure-eastus2`, etc.).

<CTA title="Need a different region?" description="A project's region is fixed. To switch, create a new project in the target region and migrate." buttonText="Migration guide" buttonUrl="https://neon.com/docs/import/region-migration" />
