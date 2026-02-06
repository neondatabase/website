---
title: Roadmap
summary: >-
  Covers the development roadmap for Neon, detailing current projects like Neon
  Auth and performance optimizations, as well as upcoming features in backups,
  security, and cloud region expansions.
enableTableOfContents: true
redirectFrom:
  - /docs/cloud/roadmap
  - /docs/conceptual-guides/roadmap
  - /docs/reference/roadmap
updatedOn: '2026-02-06T22:07:33.106Z'
---

Our development teams are focused on helping you ship faster with Postgres. This roadmap describes committed features we're working on right now, what we delivered recently, and a peek at what's on the horizon.

## What we're working on now 🛠️

Here's a snapshot of what we're working on now:

- **Neon Auth general availability**: Neon Auth is moving toward general availability with additional plugins and features on the way. Check the [Neon Auth roadmap](/docs/auth/roadmap) for details.
- **Connection pooling metrics**: We're expanding our observability capabilities with additional metrics for PgBouncer, available in the Neon Console and through our OpenTelemetry integration.
- **Enhanced consumption metrics**: More metrics are coming to help you track and monitor usage across Neon's usage-based pricing plans with more granular insights.
- **Performance optimizations for large computes**: We're working on improving startup performance for larger compute instances after restarts.
- **Expanded spatial capabilities**: Support for additional geospatial extensions is in development.
- **Postgres 18 general availability**: Postgres 18 is currently in preview and moving toward general availability.
- **Large object storage**: We're working on adding support for large object storage.

Other features you would like to see? [Let us know](#share-your-thoughts).

## What's on the horizon 🌅

And here's an overview of what we're looking at next:

### Backups & restore

- Externally exported backups
- Integration with external backup systems
- Cross-region branch snapshots and exported backups
- Cross-cloud branch snapshots and exported backups

### Security

- Custom key support for encryption at rest
- Customer-managed key (CMK) support for application-level encryption
- Kerberos and LDAP authentication support
- Mutual TLS connections

### Clouds & regions

- AWS and Azure region expansion — let us know where you want to see Neon next: [Request a region](/docs/introduction/regions)
- Private Networking on Azure
- Google Cloud Platform (GCP) support (targeting late 2025)

### Storage

- Increased ingestion speeds
- Storage limits up to 200 TB per project

### Compute

- Fixed compute sizes up to 128 CUs
- Autoscaling up to 60 CUs

### Account security

- Role-based access control (RBAC) in the Neon Console
- RBAC roles extended into the database
- Audit logging of all database access

### Compliance

- PCI compliance

### High availability

- Cross-availability zone (AZ) highly available compute
- Cross-AZ, cross-region, and cross-cloud disaster recovery

## What we've shipped recently 🚢

- **Project recovery**: Accidentally deleted a project? You can now recover it within 7 days of deletion. This feature restores your entire project infrastructure, including all branches, endpoints, compute configurations, and project settings. [Learn more](/docs/manage/projects#recover-a-deleted-project).
- **100 Free plan projects**: The Neon Free plan now includes 100 projects, giving you plenty of room to experiment, prototype, and build. [Learn more](/docs/introduction/plans).
- **Neon Auth rebuilt with Better Auth**: Neon Auth now uses [Better Auth](https://www.better-auth.com/) as the foundation. All authentication data lives directly in your Neon database, so when you branch, your entire auth state branches with it. Users, sessions, organizations, and configuration are stored in a dedicated `neon_auth` schema. [Read the announcement](/blog/neon-auth-branchable-identity-in-your-database).
- **Purely usage-based billing**: We've removed the $5 monthly minimum from our paid plans. Neon is now purely usage-based: if you use $3 one month, that's the bill you'll receive. [Learn more](/docs/introduction/plans).
- **One-command MCP setup**: Connecting AI editors to the Neon MCP Server is now a single command: `npx neonctl@latest init`. This command authenticates via OAuth, automatically creates a Neon API key, and configures Cursor, VS Code, or Claude Code CLI to connect to Neon. [Learn more](/docs/ai/connect-mcp-clients-to-neon#cursor).
- **Data masking with console support**: Create anonymized branches with data masking directly from the Neon Console. [Learn more](/docs/workflows/data-anonymization).
- **Neon is now a Kiro Power**: Manage your Postgres databases directly from the Kiro IDE. Deploy instantly, branch for safe testing, and time-travel to restore from any past state. [Read the announcement](/blog/just-launched-neon-is-now-a-kiro-power).
- **Custom Neon agents for GitHub Copilot**: We've built two specialized agents that bring Neon's branching workflow directly into your IDE: the Neon Migration Specialist for safe Postgres migrations and the Neon Performance Analyzer for identifying and fixing slow queries. [Learn more](/docs/ai/ai-github-copilot-agents).
- **Data API advanced settings**: Added OpenAPI mode for automatic schema generation and server timing headers for debugging slow queries and measuring performance. [Learn more](/docs/data-api/manage).
- **Platform integration paths**: Whether you're building an agent platform, a developer tool, or a SaaS that offers databases to users, there's a [platform integration path](/docs/guides/platform-integration-overview) designed for your use case, including AI Agents integration, Claimable database flow, Embedded Postgres, and OAuth integration.
- **HIPAA support for Postgres 18**: HIPAA compliance is now supported for Postgres 18 projects in AWS regions. [Learn more](/docs/security/hipaa).
- **Backup scheduling**: Automate snapshots with daily, weekly, or monthly backup schedules with configurable retention periods. Available on paid plans (excluding the Agent plan). [Learn more](/docs/guides/backup-restore).
- **Postgres 18 support (Preview)**: Postgres 18 is now available in preview. Create a new project and select Postgres 18 as your version. [Read the announcement](/blog/postgres-18).
- **AI Agent Plan**: An AI agent pricing plan for platforms that need to provision thousands of databases. [Learn more](https://neon.com/use-cases/ai-agents).
- **Usage-based pricing plans**: Our paid plans are fully usage-based — pay only for what you use. See [Neon plans](/docs/introduction/plans).
- **Branch expiration management**: Set a time-to-live (TTL) for Neon branches to simplify branch cleanup and management, see our [branch expiration guide](/docs/guides/branch-expiration).
- **Neon VS Code Extension** — An extension that lets you connect to Neon and manage your database directly in your IDE. Available for VS Code, Cursor, and other compatible editors. See [Neon VS Code Extension](/docs/local/vscode-extension).
- **TanStack integration & new open-source tools**: Neon is now the official database partner of TanStack, with new open-source tools including a Vite Plugin for Neon to streamline fullstack development with TanStack, Vite, and Postgres.
- **Data API**: Neon's Data API feature, powered by PostgREST, is open to all Neon users. [Learn more](/docs/data-api/get-started).
- **Monitoring platform support**: Neon supports exporting metrics and Postgres logs to any OpenTelemetry-compatible backend, like New Relic. For details, refer to our [OpenTelemetry docs](/docs/guides/opentelemetry).
- **Claimable Databases & Instagres**: A new way for SaaS vendors to partner with Neon to offer instant Postgres databases. Let your users create Postgres databases — no registration required. [Learn more about Instagres](/docs/reference/instagres), and see our [Claimable database integration guide](/docs/workflows/claimable-database-integration).
- **Neon on Azure GA**: We've announced our general availability release on Azure with deeper Azure integration. [Read the announcement](/blog/azure-native-integration-ga).
- **Import Data Assistant**: The [Import Data Assistant](/docs/import/import-data-assistant) makes data import easier and faster.
- **Neon serverless driver GA**: Our JavaScript/TypeScript serverless driver has reached version 1.0.0, bringing stronger SQL injection safeguards and better performance for serverless environments.
- **Neon Snapshots (Beta)**: Create and manage point-in-time snapshots of your database with our new unified Backup & Restore experience.
- **Inbound logical replication GA**: Neon now fully supports Postgres logical replication for inbound data (replicating data to Neon).
- **Postgres logs in Datadog (Beta)**: Stream and analyze your Postgres logs directly in your Datadog dashboard for better observability.
- **Support for [pg_search](/docs/extensions/pg_search)**: We partnered with [ParadeDB](https://www.paradedb.com/) to bring `pg_search` to Neon, delivering up to 1,000x faster full-text search inside Postgres on version 17. [Read the announcement](/blog/pgsearch-on-neon).
- **MACC-eligibility on Azure**: Neon Postgres purchases made through the Azure Marketplace are now counted toward your Microsoft Azure Consumption Commitment (MACC). [Learn more](/docs/introduction/billing-azure-marketplace#microsoft-azure-consumption-commitment-macc).
- **GitHub Secret Scanning**: Neon joined GitHub's Secret Scanning Partner Program to automatically detect and protect against exposed database credentials in public repositories.
- **HIPAA compliance**: You can [enable HIPAA compliance](/docs/security/hipaa) on any Neon project. Learn more about Neon's compliance milestones on our [Compliance page](/docs/security/compliance).
- **Scheduled updates**: You can now check for update notices and choose preferred update windows for Postgres updates, security patches, and Neon feature enhancements.
- **AWS São Paulo region**: Create projects in São Paulo (sa-east-1) for lower latency access from the South America and data residency within Brazil.
- **Vercel preview deployment support**: We added support for preview deployments with our **Vercel-Managed Integration**. See the [Vercel-Managed Integration guide](/docs/guides/vercel-managed-integration).
- **Manage your database from Cursor, Claude Desktop, or Claude Code**: Manage your Neon database directly from [Cursor](/guides/cursor-mcp-neon), [Claude Desktop](/guides/neon-mcp-server), or [Claude Code](/guides/claude-code-mcp-neon) using natural language, made possible by the [Neon Model Context Protocol (MCP) Server](https://github.com/neondatabase/mcp-server-neon).
- **Database Branching for Vercel Preview Environments**: We added support for **database branching for preview environments** to the **Vercel-Managed Integration**, available from the [Vercel Marketplace](https://vercel.com/marketplace).
- **AWS London region**: Create projects in London (eu-west-2) for lower latency access from the UK and data residency within the United Kingdom.
- **Datadog integration GA**: Monitor your Neon database performance, resource utilization, and system health directly from Datadog's observability platform.
- **Save your connection details to [1Password](https://1password.com/)**: See [Save your connection details to 1Password](/docs/connect/connect-from-any-app#save-your-connection-details-to-1password).
- **Query monitoring in the console**: Monitor your [active queries](/docs/introduction/monitor-active-queries) and [query performance](/docs/introduction/monitor-query-performance) in the Neon Console.
- **Schema-only branches**: Create branches that include only your database schema—ideal for workflows involving sensitive data. This feature is now available in Early Access. [Learn more](/docs/guides/branching-schema-only).
- Support for the [postgres_fdw](/docs/extensions/postgres_fdw), [dblink](/docs/extensions/dblink), and [pg_repack](/docs/extensions/pg_repack) Postgres extensions.
- **"Instagres": No signup, instant Postgres**: An app that lets you generate a Postgres database URL almost instantly — no sign up required. Give it a try at [https://www.instagres.com/](https://www.instagres.com/) or by running `npx instagres` in your terminal. See how fast Neon can spin up a Postgres database (AI agents loves this, btw).
- **Neon Chat for Visual Studio Code**: This AI-powered assistant lets you chat with the latest Neon documentation without leaving your IDE. You can find it here: [Neon Postgres VS Code Extension](https://marketplace.visualstudio.com/items?itemName=buildwithlayer.neon-integration-expert-15j6N).
- **A GitHub Copilot extension**: This extension provides chat-based access to the latest Neon documentation directly from your repository. You can find it here: [Neon Postgres Copilot Extension](https://github.com/marketplace/neon-database)
- **Schema Diff API**: Neon now supports schema checks in agentic systems and deployment pipelines with the new schema diff API endpoint. Learn more about [Schema Diff](/docs/guides/schema-diff), which is also available via the console and CLI.
- **Neon Auth**: Sync user profiles from your auth provider to your database automatically. Includes OAuth provider management - enable or disable providers (Google, GitHub, Microsoft) and choose between shared Neon Auth credentials or custom client credentials. See [Neon Auth](/docs/guides/neon-auth) for details.
- **Postgres 17**: Now the default version for all newly created projects.
- **Support for [pg_cron](/docs/extensions/pg_cron)**: Schedule and manage periodic jobs directly in your Postgres database with this extension.
- **Neon on AgentStack**: Integrate Neon with AgentStack to enable AI agents to create ephemeral or long-lived Postgres instances for structured data storage. Explore the [Neon tool](https://github.com/AgentOps-AI/AgentStack/blob/main/agentstack/_tools/neon/__init__.py) in AgentStack's repo.
- **Neon on Composio**: Integrate Neon's API with LLMs and AI agents via Composio. Check out the [Composio integration](https://composio.dev/tools?search=neon).
- **Higher connection limits for autoscaling configurations**: Postgres `max_connections` are now much higher. [Learn more](/docs/connect/connection-pooling#connection-limits-without-connection-pooling).
- **PgBouncer `default_pool_size` scaling**: The `default_pool_size` is now set according to your compute's `max_connections` setting. Previously, it was fixed at `64`. [Learn more](/docs/connect/connection-pooling#neon-pgbouncer-configuration-settings).
- **Neon Auth.js Adapter**: Simplify authentication with the new [Auth.js Neon Adapter](https://authjs.dev/getting-started/adapters/neon).

<details>
<summary>Shipped in 2024</summary>

- **Larger computes**: Autoscaling now supports up to 16 CU, and fixed compute sizes up to 56 CU are available.
- **A Model Context Protocol (MCP) server for Neon**: We released an open-source MCP server, enabling AI agents to interact with Neon's API using natural language for tasks like database creation, SQL queries, and migrations. Read the blog post: [Let Claude Manage Your Neon Databases: Our MCP Server is Here](/blog/let-claude-manage-your-neon-databases-our-mcp-server-is-here).
- **Neon in the Azure Marketplace**: Neon is now available as an [Azure Native Integration](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/neon1722366567200.neon_serverless_postgres_azure_prod?tab=Overview), enabling developers to deploy Neon Postgres databases directly from the Azure portal. [Read the announcement](/blog/neon-is-now-available-as-an-azure-native-integration).
- **Archive storage**: To minimize storage costs, we now support automatic archiving of inactive branches (snapshots of your data) in cost-efficient object storage. For more about this feature, see [Branch archiving](/docs/guides/branch-archiving).
- **Organizations GA**: Organization Accounts are now generally available. Create a new organization, transfer over your projects, invite your team and get started collaborating. Refer to our [Organizations docs](/docs/manage/organizations) to learn more.
- **Private Networking**: Private and secure network access to your compute resources without traversing public networks. Support for AWS PrivateLink is available in [Public Beta](/docs/guides/neon-private-networking).
- **Schema Diff GitHub Action**: This action leverages our [Schema Diff](/docs/guides/schema-diff) feature to compare database schemas across branches and post the differences as a comment on your pull request, streamlining the review process. It's also supported with our [Neon GitHub integration](/docs/guides/neon-github-integration).
- **Import Data Assistant**: Helps you migrate data to Neon from other Postgres databases. All you need to get started is a connection string for your existing database. See [Import Data Assistant](/docs/import/import-data-assistant) for instructions.
- **Python SDK**: Our new [Python SDK](https://pypi.org/project/neon-api/) wraps the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api), allowing you to manage the Neon platform directly from your Python applications.
- **Neon in the Vercel Marketplace**: Neon is now a first-party native integration in the Vercel Marketplace. This integration lets Vercel users add Postgres to their projects and manage billing directly through Vercel. For details, see the [Vercel-Managed Integration guide](/docs/guides/vercel-managed-integration).
- **Archive storage on the Free plan**: Archive storage is now available on the Free plan for automatically archiving inactive branches. This feature helps minimize storage costs, allowing us to expand the Free plan even further. Learn more in [Branch Archiving](/docs/guides/branch-archiving).
- **Neon RLS**: This feature integrates with third-party **authentication providers** like Auth0, Clerk, and Stack Auth to bring authorization to your code base by leveraging Postgres [Row-Level Security (RLS)](https://www.postgresql.org/docs/current/ddl-rowsecurity.html). [Read the announcement](/blog/introducing-neon-authorize) and [check out the docs](/docs/guides/neon-rls).
- **Neon on Azure**: You can deploy Neon databases on Azure, starting with the East US 2 region. This marks the first milestone on our Azure roadmap—many more exciting updates are on the way, including deeper integrations with the Azure ecosystem. [Read the announcement](/blog/first-azure-region-available-in-neon).
- **End-to-end RAG pipelines in Postgres**: Our new and open source [pgrag](/docs/extensions/pgrag) extension lets you create end-to-end Retrieval-Augmented Generation (RAG) pipelines in Postgres. There's no need for additional programming languages or libraries. With the functions provided by `pgrag`, you can build a complete RAG pipeline directly within your SQL client.
- **Support for Analytics with pg_mooncake**: This new extension, brought to the community by [mooncake.dev](https://mooncake.dev/), introduces native columnstore tables with DuckDB execution for _fast_ analytics directly in Postgres. [Read the announcement](https://www.mooncake.dev/blog/pgmooncake-neon).
- **Datadog integration**: Scale users can now export Neon metrics to Datadog.
- **Deletion of backup branches created by restore operations**: To help minimize storage and keep your Neon project organized, we added support for deleting obsolete backup branches created by [restore](/docs/guides/branch-restore) operations. Previously, these backup branches could not be removed. [Learn more](/docs/guides/branch-restore#deleting-backup-branches).
- **Read Replicas on the Free plan**: Read Replicas are now available to all Neon users. [Read the announcement](/blog/create-read-replicas-in-the-free-plan)
- **ISO27110 & ISO27701 compliance**: These new certifications add to our growing list of compliance achievements. For more about Neon's compliance milestones, see [Compliance](/docs/security/compliance).
- **Increased limits for Neon projects**: We increased the number of projects included in all our paid plans: Launch (100 projects), Scale (1000 projects), and Business (5000 projects). More projects supports use cases such as database-per-tenant and AI agents. [Read the announcement](/blog/thousands-of-neon-projects-now-included-in-your-pricing-plan).
- **A new Postgres toolkit for AI agents and test environments**: We recently announced an experimental release of the [@neondatabase/toolkit](https://github.com/neondatabase/toolkit). This toolkit lets you spin up a Postgres database in seconds and run SQL queries. It includes both the [Neon API Client](https://www.npmjs.com/package/@neondatabase/api-client) and the [Neon Serverless Driver](https://github.com/neondatabase/serverless), making it an excellent choice for AI agents that need to quickly set up an SQL database, or for test environments where manually deploying a new database isn't practical. To learn more, see [Why we built @neondatabase/toolkit](/blog/why-neondatabase-toolkit).
- **Postgres 17**: You can now run the very latest version of Postgres on Neon. [Read the announcement](/blog/postgres-17).
- **SQL Editor AI features**: We added AI features to the Neon SQL Editor, including SQL generation, AI-generated query names, and an AI assistant that will fix your queries. [Learn more](/docs/get-started/query-with-neon-sql-editor#ai-features).
- **Data migration support with inbound logical replication**: We've introduced inbound logical replication as the first step toward enabling seamless, low-downtime migrations from your current database provider to Neon. This feature allows you to use Neon as your development environment, taking advantage of developer-friendly tools like branching and our [GitHub integration](/docs/guides/neon-github-integration), even if you keep production with your existing provider. To get started, explore our guides for replicating data from AlloyDB, CloudSQL, and RDS. See [Replicate data to Neon](/docs/guides/logical-replication-guide#replicate-data-to-neon). Inbound logical replication also supports migrating data between Neon projects, useful for version, region, or account migrations. See [Replicate data from one Neon project to another](/docs/guides/logical-replication-neon-to-neon).

</details>

For more of the latest features and fixes, check our [Changelog](/docs/changelog), published weekly. Or watch for our Changelog email, also sent out weekly. You can also subscribe to updates using our [RSS feed](/docs/changelog/rss.xml).

## Join the Neon Early Access Program

Want to try upcoming Neon features before they go live? Join our Early Access Program to preview new features, connect with the Neon team, and help shape the platform's future.

Learn more and sign up on the [Early Access Program page](/docs/introduction/early-access).

## A note about timing

We are as excited as you are to see new features in Neon, but their development, release, and timing are at our discretion.

## Share your thoughts

As always, we are listening. If you see something you like, something you disagree with, or something you'd love for us to add, let us know in our Discord feedback channel.

<CommunityBanner buttonText="Leave feedback" buttonUrl="https://discord.com/channels/1176467419317940276/1176788564890112042" logo="discord">Share your ideas in&nbsp;Discord</CommunityBanner>
