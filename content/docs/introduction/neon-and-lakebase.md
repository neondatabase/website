---
title: Neon vs Lakebase
subtitle: 'Two products, one architectural foundation — how to choose'
summary: >-
  Neon and Databricks Lakebase share the same serverless Postgres architecture,
  but serve different audiences. Neon targets developers, startups, and agentic
  platforms. Lakebase runs natively in the Databricks Data Intelligence Platform
  for enterprises that need OLTP unified with analytics, AI pipelines, and Unity
  Catalog governance. Use this page to decide which product fits your workload
  based on team type, deployment environment, and data access model.
redirectFrom:
  - /docs/storage-engine/architecture-overview
  - /docs/conceptual-guides/architecture-overview
  - /docs/guides/neon-features
updatedOn: '2026-06-23T20:07:56.119Z'
---

In 2025, Neon joined Databricks. Neon continues as a standalone serverless Postgres platform, but the same architectural foundation now also powers Databricks Lakebase, a managed Postgres product that runs natively in the Databricks Data Intelligence Platform. This section explains the [lakebase category](https://www.databricks.com/blog/what-is-a-lakebase) and how to determine whether Neon or Lakebase is a better fit for your workload.

### Lakebase architecture: Postgres built on object storage

A lakebase is a new category of operational database: OLTP built directly on cloud object storage, the same storage layer already used by your lakehouse. Durability and history live in the object store, not on servers. This decouples storage from compute, making compute stateless and elastic. Operational data becomes lake-native by default, accessible to analytics and AI without ETL.

Databricks is pioneering the category with [Lakebase](https://www.databricks.com/product/lakebase), a managed serverless Postgres service built on the same architectural foundation as Neon and deeply integrated into the Databricks Data Intelligence Platform. This integration unlocks capabilities that only make sense when an operational database lives alongside analytical data:

- **No ETL friction.** Operational data is already in the lakehouse storage layer, so analytics, dashboards, and ML pipelines can access it without replication, CDC jobs, or fragile sync workflows.
- **Unified analytics and AI.** Operational and analytical workloads work on the same data foundation.
- **Lakehouse-native governance.** Access control, lineage, and security policies apply consistently across operational and analytical data through Unity Catalog.
- **Serverless operations.** Like Neon, Lakebase removes manual capacity planning by using stateless compute that scales automatically and is optimized for Databricks environments.

### How to choose between Neon and Lakebase

Neon and Lakebase share the same core architectural principles, but they are optimized for different environments and team structures:

- Neon is Postgres for developers, startups, and agent platforms.
- Lakebase is Postgres for businesses whose operational data benefits from participating directly in the Databricks Lakehouse, alongside analytics, governance, and AI workflows.

**Choose Neon if:**

- You’re a developer looking for a hands-off Postgres to power side projects, experiments, or personal apps without setup friction or infrastructure management
- You’re a young startup focused on shipping quickly and need a database that keeps up without slowing your team down
- You’re a small team iterating fast, looking for ways to accelerate the software lifecycle and deploy safely without blockers
- You’re building an agent-driven or codegen platform (like Replit, Lovable, or Bolt) and need to spin up and manage fleets of databases efficiently, with costs that stay under control through usage-based pricing and scale-to-zero

**Choose Lakebase if:**

- You’re building on the Databricks Data Intelligence Platform
- You’re running data-intensive or AI-driven applications where unified governance, lineage, and access control across OLTP and analytical data are essential
- You’re a data or AI team that needs operational data to be immediately available for analytics, notebooks, and ML workflows
- You’re an enterprise team that highly values security, compliance, and platform-level integrations

| Product                        | Neon                                                   | Lakebase                                                               |
| ------------------------------ | ------------------------------------------------------ | ---------------------------------------------------------------------- |
| **Architecture**               | lakebase                                               | lakebase                                                               |
| **What it is**                 | Serverless Postgres for applications                   | Postgres for the Lakehouse                                             |
| **Who is it for**              | Developers, startups, agentic & codegen platforms      | Enterprises, data & AI teams, companies building on Databricks         |
| **Where it runs**              | Standalone serverless Postgres platform                | Native to the Databricks Data Intelligence Platform                    |
| **How teams use it**           | Build, iterate, preview, and deploy apps quickly       | Operate OLTP data alongside analytics and AI pipelines                 |
| **Development workflows**      | Branching, previews, instant restores, rapid iteration | Branching-based workflows integrated with notebooks and pipelines      |
| **Data access model**          | Application-centric (ORMs, drivers, APIs)              | Lakehouse-centric (SQL, notebooks, AI tooling, pipelines)              |
| **Operational model**          | Developer-first                                        | Enterprise-grade                                                       |
| **Scaling behavior**           | Autoscaling and scale-to-zero                          | Autoscaling and scale-to-zero aligned with Databricks serverless model |
| **Governance & security**      | Project-level access controls                          | Lakehouse-wide governance via Unity Catalog                            |
| **Analytics & AI integration** | Via external tools and pipelines                       | Native integration with Databricks analytics and AI                    |
| **Best fit when**              | You’re building and shipping applications quickly      | You want OLTP data to participate directly in the Lakehouse            |

### Feature availability

Neon and Lakebase share the same Postgres engine and serverless storage architecture, so many capabilities exist in both. The table below maps concrete features to each product, with links to the documentation. Lakebase availability is based on the [Lakebase documentation](https://docs.databricks.com/aws/en/oltp/projects/).

| Feature                                              | Neon                                                                               | Lakebase                                                                                                                                   |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Branching**                                        | Yes ([Branching](/docs/introduction/branching))                                    | Yes ([Branches](https://docs.databricks.com/aws/en/oltp/projects/branches))                                                                |
| **Autoscaling**                                      | Yes ([Autoscaling](/docs/introduction/autoscaling))                                | Yes ([Autoscaling](https://docs.databricks.com/aws/en/oltp/projects/autoscaling))                                                          |
| **Scale to zero**                                    | Yes ([Scale to zero](/docs/introduction/scale-to-zero))                            | Yes ([Scale to zero](https://docs.databricks.com/aws/en/oltp/projects/scale-to-zero))                                                      |
| **Read replicas**                                    | Yes ([Read replicas](/docs/introduction/read-replicas))                            | Yes ([Read replicas](https://docs.databricks.com/aws/en/oltp/projects/read-replicas))                                                      |
| **Instant restore (point-in-time)**                  | Yes ([Instant restore](/docs/introduction/branch-restore))                         | Yes ([Point-in-time restore](https://docs.databricks.com/aws/en/oltp/projects/point-in-time-restore))                                      |
| **High availability**                                | Coming soon ([Roadmap](/docs/introduction/roadmap))                                | Yes ([High availability](https://docs.databricks.com/aws/en/oltp/projects/manage-high-availability))                                       |
| **Cross-cloud disaster recovery (DR)**               | Not available                                                                      | Private preview                                                                                                                            |
| **Connection pooling**                               | Yes ([Connection pooling](/docs/connect/connection-pooling))                       | Yes, built-in PgBouncer ([Connect](https://docs.databricks.com/aws/en/oltp/projects/connect))                                              |
| **Data API (REST)**                                  | Yes ([Data API](/docs/data-api/overview))                                          | Yes ([Lakebase Data API](https://docs.databricks.com/aws/en/oltp/projects/data-api))                                                       |
| **Private networking (Private Link)**                | Yes ([Private Networking](/docs/guides/neon-private-networking))                   | Yes ([Data protection](https://docs.databricks.com/aws/en/oltp/projects/private-link))                                                     |
| **Managed user authentication**                      | Yes ([Neon Auth](/docs/auth/overview))                                             | Not yet; database access uses Databricks identity and Postgres roles ([Connect](https://docs.databricks.com/aws/en/oltp/projects/connect)) |
| **Metrics and logs export (Datadog, OpenTelemetry)** | Yes ([Datadog](/docs/guides/datadog), [OpenTelemetry](/docs/guides/opentelemetry)) | Via the Databricks platform                                                                                                                |
| **HIPAA compliance**                                 | Yes ([HIPAA](/docs/security/hipaa))                                                | Yes, via Databricks ([HIPAA](https://docs.databricks.com/aws/en/security/privacy/hipaa))                                                   |
| **SOC 2**                                            | Yes ([Compliance](/docs/security/compliance))                                      | Yes, via Databricks ([SOC](https://www.databricks.com/trust/compliance/soc))                                                               |
| **Vercel Marketplace**                               | Yes ([Vercel integration](/docs/guides/vercel-overview))                           | Not yet                                                                                                                                    |
| **Vercel Integration**                               | Yes ([Vercel-Managed integration](/docs/guides/vercel-managed-integration))        | Not yet                                                                                                                                    |

### Provider and region availability

Neon runs on AWS. Lakebase inherits the cloud reach of the Databricks platform, with availability that varies by provider. For the full, current region lists, follow the links below.

| Cloud provider | Neon                                                                                             | Lakebase                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **AWS**        | Yes ([Neon regions](/docs/introduction/regions))                                                 | Yes, generally available ([AWS regions](https://docs.databricks.com/aws/en/oltp/projects/manage-projects#availability)) |
| **Azure**      | No, Azure support is being deprecated ([Neon regions](/docs/introduction/regions#azure-regions)) | Yes, in beta ([Azure regions](https://learn.microsoft.com/en-us/azure/databricks/oltp/projects/manage-projects))        |
| **GCP**        | No, on the [roadmap](/docs/introduction/roadmap)                                                 | Yes, in beta ([GCP regions](https://docs.databricks.com/gcp/en/oltp/projects/manage-projects#availability))             |

<Admonition type="tip" title="Keep exploring Lakebase">
    See the [Lakebase docs](https://docs.databricks.com/aws/en/oltp), review the [latest updates to the Lakebase platform](https://www.databricks.com/blog/lakebase-holiday-update), explore [customer stories](https://www.databricks.com/product/lakebase#customer-stories), and [watch a demo](https://www.databricks.com/resources/demos/tours/appdev/databricks-lakebase?itm_data=demo_center).
</Admonition>
