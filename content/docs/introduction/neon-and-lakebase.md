---
title: Neon and Lakebase
subtitle: How to choose where to run Lakebase Postgres
summary: >-
  Lakebase Postgres is an OLTP database where storage and compute are separated
  and durable object storage is the source of truth. It runs in two places: on
  Neon, a complete backend for apps and agents built for developers, startups,
  and agent platforms, and on Databricks, the Data and AI platform for
  businesses. Same infrastructure, same technology, same core feature set. Use
  this page to understand the lakebase architecture and decide where to run it.
redirectFrom:
  - /docs/storage-engine/architecture-overview
  - /docs/conceptual-guides/architecture-overview
  - /docs/guides/neon-features
updatedOn: '2026-07-15T00:08:00.682Z'
---

In 2025, Neon joined Databricks. The serverless Postgres architecture that Neon pioneered is now the foundation of Lakebase Postgres, a database you can run in two places: on Neon and on Databricks. Wherever you run it, it's the same infrastructure, the same technology, and the same core feature set. What differs is what's built around the database. This page explains the [lakebase category](https://www.databricks.com/blog/what-is-a-lakebase), what's the same in both places, and how to choose between them.

## What is a lakebase?

![Standard database compared to lakebase. On the left, compute and storage live together on one machine and each replica keeps a full copy of the data. On the right, stateless Postgres compute runs in a layer separate from shared, durable object storage](/docs/introduction/database-vs-lakebase.svg 'no-border')

At the broadest level, a lakebase is a type of OLTP database where storage and compute are separated and the source of truth for storage is cheap, durable object storage. That architectural choice has consequences that traditional Postgres deployments can't match:

- **Compute is stateless and elastic.** Because no compute node owns the data, compute can scale up under load, scale down when idle, and [scale to zero](/docs/introduction/scale-to-zero) entirely. Read replicas spin up without copying data.
- **History is cheap.** Object storage is inexpensive enough to retain a full history of changes, which makes [instant point-in-time restore](/docs/introduction/branch-restore) practical instead of a slow backup-and-restore exercise.
- **Copies are virtual.** [Branches](/docs/introduction/branching) are copy-on-write views over shared storage, so a full copy of your database for development, testing, or an agent workflow is created in seconds and costs nothing until it diverges.
- **Operational data is lake-native.** Data lives in the same storage layer as the lakehouse, so analytics and AI can reach it without ETL pipelines or fragile sync jobs.

## Where Lakebase Postgres runs

Lakebase Postgres is the Databricks implementation of a lakebase: Postgres, built on the architecture described above. It's available in two places:

- **On Neon**, as the database at the core of a complete backend for apps and agents: Postgres alongside [Auth](/docs/auth/overview), [Data API](/docs/data-api/overview), [Object Storage](/docs/storage/overview), [Functions](/docs/compute/functions/overview), and [AI Gateway](/docs/ai-gateway/overview).
- **On Databricks**, as [Lakebase](https://www.databricks.com/product/lakebase), an enterprise-grade Postgres database tightly integrated into the rest of the Databricks Data Intelligence Platform: Unity Catalog governance, lakehouse analytics, notebooks, and AI workflows.

The database itself doesn't change between them. What surrounds it differs, because Neon and Databricks serve different customers: Neon is built for developers, startups, and agent platforms; Databricks is the Data and AI platform for businesses.

|                         | Neon                                                   | Databricks                                                        |
| ----------------------- | ------------------------------------------------------ | ----------------------------------------------------------------- |
| **The database**        | Lakebase Postgres                                      | Lakebase Postgres                                                 |
| **Integrated products** | [Auth](/docs/auth/overview), [Functions](/docs/compute/functions/overview), [Object Storage](/docs/storage/overview), [AI Gateway](/docs/ai-gateway/overview) | Lakehouse, Lakeflow, Unity Catalog, Unity AI Gateway, [all Databricks products](https://www.databricks.com/product/platform) |
| **What it is**          | A complete backend for apps and agents                 | The Data and AI platform for businesses                           |
| **Built for**           | Developers, startups, agent and codegen platforms      | Enterprises, data and AI teams, companies building on Databricks  |
| **How teams use it**    | Build, iterate, preview, and deploy apps quickly       | Operate production-grade OLTP databases with tight integration to the data lake |
| **Governance**          | Project-level access controls                          | Lakehouse-wide governance via Unity Catalog                       |

## Core database features

Because Neon and Databricks run the same infrastructure, the core feature set is the same. The links below go to the Neon and Databricks documentation for the same underlying capability. Databricks availability is based on the [Lakebase documentation](https://docs.databricks.com/aws/en/oltp/projects/).

| Feature                             | On Neon                                                      | On Databricks                                                                                         |
| ----------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Branching**                       | [Branching](/docs/introduction/branching)                    | [Branches](https://docs.databricks.com/aws/en/oltp/projects/branches)                                 |
| **Autoscaling**                     | [Autoscaling](/docs/introduction/autoscaling)                | [Autoscaling](https://docs.databricks.com/aws/en/oltp/projects/autoscaling)                           |
| **Scale to zero**                   | [Scale to zero](/docs/introduction/scale-to-zero)            | [Scale to zero](https://docs.databricks.com/aws/en/oltp/projects/scale-to-zero)                       |
| **Read replicas**                   | [Read replicas](/docs/introduction/read-replicas)            | [Read replicas](https://docs.databricks.com/aws/en/oltp/projects/read-replicas)                       |
| **Instant restore (point-in-time)** | [Instant restore](/docs/introduction/branch-restore)         | [Point-in-time restore](https://docs.databricks.com/aws/en/oltp/projects/point-in-time-restore)       |
| **Connection pooling**              | [Connection pooling](/docs/connect/connection-pooling)       | Built-in PgBouncer ([Connect](https://docs.databricks.com/aws/en/oltp/projects/connect))              |
| **Data API (REST)**                 | [Data API](/docs/data-api/overview)                          | [Lakebase Data API](https://docs.databricks.com/aws/en/oltp/projects/data-api)                        |
| **Management API**                  | [Neon API](/docs/reference/api)                              | [Lakebase API guide](https://docs.databricks.com/aws/en/oltp/projects/api-usage)                      |
| **CLI**                             | [Neon CLI](/docs/cli/install)                                | [Databricks CLI for Lakebase](https://docs.databricks.com/aws/en/oltp/projects/cli)                   |
| **Terraform**                       | [Terraform provider](/docs/reference/terraform)              | [Terraform for Lakebase](https://docs.databricks.com/aws/en/oltp/projects/automate-with-terraform)    |
| **MCP server**                      | [Neon MCP Server](/docs/ai/neon-mcp-server)                  | [MCP on Databricks](https://docs.databricks.com/aws/en/generative-ai/mcp/managed-mcp)                 |

## Features around the database

The features around the database are where Neon and Databricks diverge, because each is designed for a different customer. Neon leans into developer workflow and the backend services apps and agents need; Databricks leans into enterprise operations, governance, and integration with the rest of the Data Intelligence Platform.

| Feature                                              | On Neon                                                                            | On Databricks                                                                                                                              |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **High availability**                                | Coming soon ([Roadmap](/docs/introduction/roadmap))                                | Yes ([High availability](https://docs.databricks.com/aws/en/oltp/projects/manage-high-availability))                                       |
| **Cross-cloud disaster recovery (DR)**               | Not available                                                                      | Private preview                                                                                                                            |
| **Managed user authentication**                      | Yes ([Managed Better Auth](/docs/auth/overview))                                   | Not yet; database access uses Databricks identity and Postgres roles ([Connect](https://docs.databricks.com/aws/en/oltp/projects/connect)) |
| **GitHub integration**                               | Yes ([GitHub integration](/docs/guides/neon-github-integration))                   | Via GitHub Actions ([GitHub Actions](https://docs.databricks.com/aws/en/dev-tools/ci-cd/github))                                           |
| **Private networking (Private Link)**                | Yes ([Private Networking](/docs/guides/neon-private-networking))                   | Yes ([Data protection](https://docs.databricks.com/aws/en/oltp/projects/private-link))                                                     |
| **Metrics and logs export (Datadog, OpenTelemetry)** | Yes ([Datadog](/docs/guides/datadog), [OpenTelemetry](/docs/guides/opentelemetry)) | Via the Databricks platform                                                                                                                |
| **HIPAA compliance**                                 | Yes ([HIPAA](/docs/security/hipaa))                                                | Yes, via Databricks ([HIPAA](https://docs.databricks.com/aws/en/security/privacy/hipaa))                                                   |
| **SOC 2**                                            | Yes ([Compliance](/docs/security/compliance))                                      | Yes, via Databricks ([SOC](https://www.databricks.com/trust/compliance/soc))                                                               |
| **Vercel Marketplace**                               | Yes ([Vercel integration](/docs/guides/vercel-overview))                           | Not yet                                                                                                                                    |
| **Vercel Integration**                               | Yes ([Vercel-Managed integration](/docs/guides/vercel-managed-integration))        | Not yet                                                                                                                                    |

## How to choose

You get the same database either way, so the decision comes down to what you need around it and how your team works.

**Choose Neon if:**

- You're a developer looking for a hands-off Postgres to power side projects, experiments, or personal apps without setup friction or infrastructure management
- You're a startup focused on shipping quickly and want a complete backend, database included, that keeps up without slowing your team down
- You're a small team iterating fast, using branching and previews to accelerate the software lifecycle and deploy safely
- You're building an agent or codegen platform (like Replit, Lovable, or Bolt) and need to spin up and manage fleets of databases efficiently, with costs that stay under control through usage-based pricing and scale to zero

**Choose Databricks if:**

- You're building on the Databricks Data Intelligence Platform
- You're running data-intensive or AI-driven applications where unified governance, lineage, and access control across OLTP and analytical data are essential
- You're a data or AI team that needs operational data to be immediately available for analytics, notebooks, and ML workflows
- You're an enterprise team that highly values security, compliance, high availability, and platform-level integrations

## Provider and region availability

Neon runs on AWS. Lakebase Postgres on Databricks inherits the cloud reach of the Databricks platform, with availability that varies by provider. For the full, current region lists, follow the links below.

| Cloud provider | Neon                                                                                             | Databricks                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **AWS**        | Yes ([Neon regions](/docs/introduction/regions))                                                 | Yes, generally available ([AWS regions](https://docs.databricks.com/aws/en/oltp/projects/manage-projects#availability)) |
| **Azure**      | No, Azure support is being deprecated ([Neon regions](/docs/introduction/regions#azure-regions)) | Yes, in beta ([Azure regions](https://learn.microsoft.com/en-us/azure/databricks/oltp/projects/manage-projects))        |
| **GCP**        | Not available                                                                                    | Yes, in beta ([GCP regions](https://docs.databricks.com/gcp/en/oltp/projects/manage-projects#availability))             |

<Admonition type="tip" title="Keep exploring Lakebase">
    See the [Lakebase docs](https://docs.databricks.com/aws/en/oltp), review the [latest updates to the Lakebase platform](https://www.databricks.com/blog/lakebase-holiday-update), explore [customer stories](https://www.databricks.com/product/lakebase#customer-stories), and [watch a demo](https://www.databricks.com/resources/demos/tours/appdev/databricks-lakebase?itm_data=demo_center).
</Admonition>
