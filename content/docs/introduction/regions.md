---
title: Regions
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/conceptual-guides/regions
updatedOn: '2024-08-06T15:23:10.955Z'
---

Neon supports project deployment in several regions. We recommended that you select the region closest to your application server to reduce latency between your Neon database and your application.

## Available regions

Neon currently supports the following AWS regions:

- US East (N. Virginia) &mdash; `aws-us-east-1`
- US East (Ohio) &mdash; `aws-us-east-2`
- US West (Oregon) &mdash; `aws-us-west-2`
- Europe (Frankfurt) &mdash; `aws-eu-central-1`
- Asia Pacific (Singapore) &mdash; `aws-ap-southeast-1`
- Asia Pacific (Sydney) &mdash; `aws-ap-southeast-2`

## Select a region for your Neon project

You can select the region for your Neon project during project creation. See [Create a project](/docs/manage/projects#create-a-project).

All branches and databases created in a Neon project are created in the region selected for the project.

![Select region image](/docs/introduction/project_creation_regions.png)

<Admonition type="note">
After you select a region for a Neon project, it cannot be changed for that project.
</Admonition>

## Move project data to a new region

If you need to move your data to a different region, the following steps are recommended:

1. Create a new project in the desired region. For project creation instructions, see [Create a project](/docs/manage/projects#create-a-project).
1. Move your data from the old project to the new project. For instructions, see [Import data from Postgres](/docs/import/import-from-postgres).

<Admonition type="note">
Neon Free Plan users are limited to a single project. In this case, you can export your data using `pg_dump`, remove your existing project, create a new project in the desired region, and import your data into the new project.
</Admonition>

Moving data to a new Neon project may require downtime if you are moving a production database, as the import procedure may take some time depending on the size of your data. To prevent the loss of data during the import operation, consider disabling writes from your applications before initiating the import operation. You can re-enable writes when the import is completed. Neon does not currently support disabling database writes. Writes must be disabled at the application level.

Neon regularly reviews opportunities for expanding into new regions. We welcome your input regarding where you'd like to see us next. Please share your suggestions or express your interest in specific regions via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or in our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord.

<NeedHelp/>
