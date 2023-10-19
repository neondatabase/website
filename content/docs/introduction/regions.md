---
title: Regions
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/conceptual-guides/regions
updatedOn: '2023-10-19T22:53:11.744Z'
---
Neon supports project deployment in several regions. We recommended that you select the region closest to your application server to reduce latency between your Neon project and your application.

## Available regions

Neon currently supports the following AWS regions:

- US East (N. Virginia) &mdash; `aws-us-east-1`
- US East (Ohio) &mdash; `aws-us-east-2`
- US West (Oregon) &mdash; `aws-us-west-2`
- Europe (Frankfurt) &mdash; `aws-eu-central-1`
- Asia Pacific (Singapore) &mdash; `aws-ap-southeast-1`
- Israel (Tel Aviv) &mdash; `aws-il-central-1`

## Select a region for your Neon project

You can select the region for your Neon project during project creation. See [Setting up a project](/docs/get-started-with-neon/setting-up-a-project).

All branches and databases created in a Neon project are created in the region selected for the project.

![Select region image](/docs/introduction/project_creation_regions.png)

<Admonition type="note">
After you select a region for a Neon project, it cannot be changed for that project.
</Admonition>

## Move project data to a new region

If you need to move your data to a different region, the following steps are recommended:

1. Create a new project in the desired region. For project creation instructions, see [Setting up a project](/docs/get-started-with-neon/setting-up-a-project).
1. Move your data from the old project to the new project. For instructions, see [Import data from Postgres](/docs/import/import-from-postgres).

<Admonition type="note">
Neon Free Tier users are limited to a single project. In this case, you can export your data using `pg_dump`, remove your existing project, create a new project in the desired region, and import your data into the new project.
</Admonition>

Moving data to a new Neon project may require downtime if you are moving a production database, as the import procedure may take some time depending on the size of your data. To prevent the loss of data during the import operation, consider disabling writes from your applications before initiating the import operation. You can re-enable writes when the import is completed. Neon does not currently support disabling database writes. Writes must be disabled at the application level.

To request support for additional regions, please visit the [Hosting in other AWS regions](https://community.neon.tech/t/hosting-in-other-aws-regions/81/5) topic in the Neon Community Forum.

## Need help?

Join the [Neon community forum](https://community.neon.tech/) to ask questions or see what others are doing with Neon. [Neon Pro Plan](/docs/introduction/pro-plan) users can open a support ticket from the console. For more detail, see [Getting Support](/docs/introduction/support).
