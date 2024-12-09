---
title: Roadmap
enableTableOfContents: true
tag: updated
redirectFrom:
  - /docs/cloud/roadmap
  - /docs/conceptual-guides/roadmap
  - /docs/reference/roadmap
updatedOn: '2024-12-06T21:20:27.566Z'
---

Our development teams are focused on helping you ship faster with Postgres. This roadmap describes committed features we're working on right now, what we delivered recently, and a peek at what's on the horizon.

## What we're working on now

<Admonition type="tip" title="stay tuned for 2025">
As 2024 comes to a close, you might have noticed that our "working on now" list is winding down. But don't worry — exciting plans for the new year are just around the corner. Stay tuned for updates!
</Admonition>

Here's a snapshot of what we're working on now:

- **Larger computes**: Coming soon to a region near you.
- **Schema-only branches**: A feature that lets you create branches that only include your database schema—useful for workflows involving sensitive data.
- **HIPAA compliance**: We are actively working toward achieving HIPAA readiness, with a target completion by the end of Q2 2025. For more about Neon's compliance milestones, see [Compliance](/docs/security/compliance).

If you have other feature ideas, [let us know](#share-your-thoughts).

## What we've just launched

- **A Model Context Protocol (MCP) server for Neon**: We released an open-source MCP server, enabling AI agents to interact with Neon’s API using natural language for tasks like database creation, SQL queries, and migrations. Read the blog post: [Let Claude Manage Your Neon Databases: Our MCP Server is Here](https://neon.tech/blog/let-claude-manage-your-neon-databases-our-mcp-server-is-here).
- **Neon in the Azure Marketplace**: Neon is now available as an [Azure Native Integration](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/neon1722366567200.neon_serverless_postgres_azure_prod?tab=Overview), enabling developers to deploy Neon Postgres databases directly from the Azure portal. [Read the announcement](https://neon.tech/blog/neon-is-now-available-as-an-azure-native-integration).
- **Archive storage on paid plans**: To minimize storage costs on paid plans, we now support automatic archiving of inactive branches (snapshots of your data) in cost-efficient object storage. For more about this feature, see [Branch archiving](/docs/guides/branch-archiving).
- **Organizations GA**: Organization Accounts are now generally available. Create a new organization, transfer over your projects, invite your team and get started collaborating. Refer to our [Organizations docs](/docs/manage/organizations) to learn more.
- **Private Networking**: Private and secure network access to your compute resources without traversing public networks. Support for AWS PrivateLink is available in [Public Beta](/docs/guides/neon-private-networking).
- **Schema Diff GitHub Action**: This action leverages our [Schema Diff](/docs/guides/schema-diff) feature to compare database schemas across branches and post the differences as a comment on your pull request, streamlining the review process. It's also supported with our [Neon GitHub integration](/docs/guides/neon-github-integration).
- **Migration Assistant**: Helps you migrate data to Neon from other Postgres databases. All you need to get started is a connection string for your existing database. See [Neon Migration Assistant](/docs/import/migration-assistant) for instructions.
- **Python SDK**: Our new [Python SDK](https://pypi.org/project/neon-api/) wraps the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api), allowing you to manage the Neon platform directly from your Python applications.
- **Neon in the Vercel Marketplace**: Neon is now a first-party native integration in the Vercel Marketplace. This integration lets Vercel users add Postgres to their projects and manage billing directly through Vercel. For details, see [Install the Neon Postgres Native Integration on Vercel](/docs/guides/vercel-native-integration).
- **Archive storage on the Free Plan**: Archive storage is now available on the Free Plan for automatically archiving inactive branches. This feature helps minimize storage costs, allowing us to expand the Free Plan even further. Learn more in [Branch Archiving](/docs/guides/branch-archiving).
- **Neon Authorize**: This feature integrates with third-party **authentication providers** like Auth0, Clerk, and Stack Auth to bring authorization to your code base by leveraging Postgres [Row-Level Security (RLS)](https://www.postgresql.org/docs/current/ddl-rowsecurity.html). [Read the announcement](https://neon.tech/blog/introducing-neon-authorize) and [check out the docs](/docs/guides/neon-authorize).
- **Neon on Azure**: You can deploy Neon databases on Azure, starting with the East US 2 region. This marks the first milestone on our Azure roadmap—many more exciting updates are on the way, including deeper integrations with the Azure ecosystem. [Read the announcement](https://neon.tech/blog/first-azure-region-available-in-neon).
- **End-to-end RAG pipelines in Postgres**: Our new and open source [pgrag](/docs/extensions/pgrag) extension lets you create end-to-end Retrieval-Augmented Generation (RAG) pipelines in Postgres. There's no need for additional programming languages or libraries. With the functions provided by `pgrag`, you can build a complete RAG pipeline directly within your SQL client.
- **Support for Analytics with pg_mooncake**: This new extension, brought to the community by [mooncake.dev](https://mooncake.dev/), introduces native columnstore tables with DuckDB execution for _fast_ analytics directly in Postgres. [Read the announcement](https://mooncake.dev/blog/3).
- **Datadog integration**: Scale and Business plan users can now export Neon metrics to Datadog.
- **Deletion of backup branches created by restore operations**: To help minimize storage and keep your Neon project organized, we added support for deleting obsolete backup branches created by [restore](/docs/guides/branch-restore) operations. Previously, these backup branches could not be removed. [Learn more](/docs/guides/branch-restore#deleting-backup-branches).
- **Read Replicas on the Free Plan**: Read Replicas are now available to all Neon users. [Read the announcement](https://neon.tech/blog/create-read-replicas-in-the-free-plan)
- **ISO27110 & ISO27701 compliance**: These new certifications add to our growing list of compliance achievements. For more about Neon's compliance milestones, see [Compliance](/docs/security/compliance).
- **Increased limits for Neon projects**: We increased the number of projects included in all our paid plans: Launch (100 projects), Scale (1000 projects), and Business (5000 projects). More projects supports use cases such as database-per-tenant and AI agents. [Read the announcement](https://neon.tech/blog/thousands-of-neon-projects-now-included-in-your-pricing-plan).
- **A new Postgres toolkit for AI agents and test environments**: We recently announced an experimental release of the [@neondatabase/toolkit](https://github.com/neondatabase/toolkit). This toolkit lets you spin up a Postgres database in seconds and run SQL queries. It includes both the [Neon API Client](https://www.npmjs.com/package/@neondatabase/api-client) and the [Neon Serverless Driver](https://github.com/neondatabase/serverless), making it an excellent choice for AI agents that need to quickly set up an SQL database, or for test environments where manually deploying a new database isn't practical. To learn more, see [Why we built @neondatabase/toolkit](https://neon.tech/blog/why-neondatabase-toolkit).
- **Postgres 17**: You can now run the very latest version of Postgres on Neon. [Read the announcement](https://neon.tech/blog/postgres-17).
- **SQL Editor AI features**: We added AI features to the Neon SQL Editor, including SQL generation, AI-generated query names, and an AI assistant that will fix your queries. [Learn more](/docs/get-started-with-neon/query-with-neon-sql-editor#ai-features).
- **A new Business plan with more compute and storage**: This new plan provides higher storage and compute allowances (500 GB-month storage and 1,000 compute hours) in addition to all of Neon's advanced features. It also offers potential cost savings for customers requiring more storage than our Scale plan provides. To learn more, please refer to our [Pricing](https://neon.tech/pricing) page and [Plans](/docs/introduction/plans) documentation.
- **Data migration support with inbound logical replication**: We've introduced inbound logical replication as the first step toward enabling seamless, low-downtime migrations from your current database provider to Neon. This feature allows you to use Neon as your development environment, taking advantage of developer-friendly tools like branching and our [GitHub integration](/docs/guides/neon-github-integration), even if you keep production with your existing provider. To get started, explore our guides for replicating data from AlloyDB, Aurora, CloudSQL, and RDS. See [Replicate data to Neon](/docs/guides/logical-replication-guide#replicate-data-to-neon). Inbound logical replication also supports migrating data between Neon projects, useful for version, region, or account migrations. See [Replicate data from one Neon project to another](/docs/guides/logical-replication-neon-to-neon).

For more of the latest features and fixes, check our [Changelog](/docs/changelog), published weekly. Or watch for our Changelog email, also sent out weekly. You can also subscribe to updates using our [RSS feed](/docs/changelog/rss.xml).

## What's on the horizon

And here's a quick list of what we'll be taking on in the near future:

- **More regions**: Let's us know where you would like to see Neon next: [Request a region](/docs/introduction/regions#request-a-region).
- **Postgres for AI agents**: [Replit partnered with Neon to back Replit Agents](https://neon.tech/blog/looking-at-how-replit-agent-handles-databases), which are already creating thousands of Postgres databases. If you’re building an AI agent that interacts with infrastructure, [we’d like to connect with you](https://neon.tech/agent-design-partner) — we’re looking for design partners in this space. For more, see [Postgres for AI Agents](https://neon.tech/use-cases/ai-agents).
- **Staging Environments**: A critical part of making it easy for you to use Neon as the staging environment for your team's app development &#8212; simple, robust anonymization of PII data. We're working on it.
- **Snapshots**: Create regularly scheduled snapshots as a way to archive your database &#8212; a cost-effective alternative to long-lived branches.
- **Support for exporting logs and traces**: We'd like to help users further integrate Neon into their monitoring platforms and services with exportable Postgres logs and traces.
- **Foreign Data Wrapper (FDW) support**: Add functionality to enable cross-database querying capability.

## Join the Neon Early Access Program

If you would like to get a little more involved, consider signing up for the **Neon Early Access Program**.

Benefits of joining:

- **Exclusive early access**: Get a first look at upcoming features before they go live.
- **Private community**: Gain access to a dedicated Discord channel to connect with the Neon team and provide feedback to help shape what comes next.
- **Weekly insights**: Receive updates on Neon's latest developments and future plans.

[Sign Up Now](https://neon.tech/early-access-program) and start influencing the future of Neon!

## A note about timing

We are as excited as you are to see new features in Neon, but their development, release, and timing are at our discretion.

## Share your thoughts

As always, we are listening. If you see something you like, something you disagree with, or something you'd love for us to add, let us know in our Discord feedback channel.

<CommunityBanner buttonText="Leave feedback" buttonUrl="https://discord.com/channels/1176467419317940276/1176788564890112042" logo="discord">Share your ideas in&nbsp;Discord</CommunityBanner>

## A brief history of Neon

The Neon **Limited Preview** started in February 2022 and was made available to a small number of select users and friends.

- On June 15th, 2022, the Neon team announced a [Technical Preview](https://neon.tech/blog/hello-world), making Neon available to a wider audience. Thousands of users were able to try Neon's [Free Plan](/docs/introduction/#free-plan).

- On December 6th, 2022, Neon released its branching feature and dropped the invite gate, welcoming everyone to try Neon's Free Plan.

- In the first quarter of 2023, Neon launched [paid plans](https://neon.tech/pricing) with new features like [Project Collaboration](/docs/guides/project-collaboration-guide), [Autoscaling](/docs/introduction/autoscaling), and [Autosuspend](/docs/introduction/auto-suspend). We also added support for AWS US East (N. Virginia)

- In the second quarter of 2023, we released the [Neon CLI](/docs/reference/neon-cli). Enhancements included a configurable [history retention](/docs/introduction/point-in-time-restore) window, support for Postgres 16, and [SOC 2 Type 1](https://neon.tech/blog/soc2-type-1#our-journey-to-soc2) compliance.

- In the third quarter of 2023, we added [IP allowlisting](/docs/introduction/ip-allow), email signup, and [logical replication](/docs/introduction/logical-replication). We also announced [SOC 2 Type 2](https://neon.tech/blog/soc2-type2) compliance.

- In the fourth quarter of 2023, we added support for the AWS Asia Pacific (Sydney) region, [Branch Restore](/docs/guides/branch-restore) with Time Travel Assist, and new [Pricing](https://neon.tech/pricing) plans.

- On April 15th, 2024, Neon announced [General Availability](https://neon.tech/blog/neon-ga).

For everything post-GA, please refer to our [Changelog](/docs/changelog) and the [Neon Blog](https://neon.tech/blog). You can also stay updated with the latest information and announcements by subscribing to our [RSS feeds](/docs/reference/feeds) or [newsletter](https://neon.tech/blog#subscribe-form).
