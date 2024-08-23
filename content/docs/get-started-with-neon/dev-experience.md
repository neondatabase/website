---
title: Developer experience with Neon
subtitle: Enhancing development workflows with Neon
enableTableOfContents: true
updatedOn: '2024-07-26T12:23:00.475Z'
---

Discover how Neon's features can streamline your development process, reduce risks, and enhance productivity, helping you to ship faster with confidence.

## Developer velocity with database branching workflows

**Branch your data like code for local and preview development workflows.**

Neon's branching feature lets you branch your data like you branch code. Neon branches are full database copies, including both schema and data. You can instantly create database branches for integration with your development workflows.

![Branching workflows](/docs/get-started-with-neon/branching_workflow.jpg)

You can build your database branching workflows using the Neon CLI, Neon API, or GitHub Actions. For example, this example shows how to create a development branch from `main` with a simple CLI command:

```bash
neon branches create --name dev/alex
```

Neon's copy-on-write technique makes branching instantaneous and cost-efficient. Whether your database is 1 GiB or 1 TiB, [it only takes seconds to create a branch](https://neon.tech/blog/how-to-copy-large-postgres-databases-in-seconds), and Neon's branches are full database copies, not partial or schema-only.

Also, with Neon, you can easily keep your development branches up-to-date by resetting your schema and data to the latest from `main` with a simple command.

```bash
neon branches reset dev/alex --parent
```

No more time-consuming restore operations when you need a fresh database copy.

You can use branching with deployment platforms such as Vercel to create a database branch for each preview deployment. If you'd rather not build your own branching workflow, you can use the [Neon Vercel integration](https://vercel.com/integrations/neon) to set one up in just a few clicks.

To learn more, read [Database Branching Workflows](https://neon.tech/cases/flow), and the [Database branching workflow guide for developers](https://neon.tech/blog/database-branching-workflows-a-guide-for-developers).

<Admonition type="tip" title="Compare database branches with Schema Diff">
Neon's Schema Diff tool lets you compare the schemas for two selected branches in a side-by-side view. For more, see [Schema Diff](/docs/guides/schema-diff).
</Admonition>

## Instant database recovery

**Instant Point-in-Time Restore with Time Travel Assist**

We've all heard about multi-hour outages and data losses due to errant queries or problematic migrations. Neon's [Point-in-Time Restore](/docs/guides/branch-restore) feature allows you to instantly restore your data to a point in time before the issue occurred. With Neon, you can perform a restore operation in a few clicks, letting you get back online in the time it takes to choose a restore point, which can be a date and time or a Log Sequence Number (LSN).

To help you find the correct restore point, Neon provides a [Time Travel Assist](/docs/guides/time-travel-assist) feature that lets you connect to any selected time or LSN within your database history and run queries. Time Travel Assist is designed to work in tandem with Neon's restore capability to facilitate precise and informed restore operations.

## Low-latency connections

**Connect from Edge and serverless environments.**

The [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver), which currently has over [100K weekly downloads](https://www.npmjs.com/package/@neondatabase/serverless), is a low-latency Postgres driver designed for JavaScript and TypeScript applications. It enables you to query data from edge and serverless environments like **Vercel Edge Functions** or **Cloudflare Workers** over HTTP or WebSockets instead of TCP. This capability is particularly useful for achieving reduced query latencies, with the potential to achieve [sub-10ms Postgres query times](https://neon.tech/blog/sub-10ms-postgres-queries-for-vercel-edge-functions) when querying from Edge or serverless functions. But don't take our word for it. Try it for yourself with Vercel's [Functions + Database Latency app](https://db-latency.vercel.app/). This graph shows latencies for Neon's serverless driver:

![Vercel's Functions Database Latency app](/docs/get-started-with-neon/latency_distribution_graph.png)

## Postgres extension support

**No database is more extensible than Postgres.**

Postgres extensions are add-ons that enhance the functionality of Postgres, letting you tailor your Postgres database to your specific requirements. They offer features ranging from advanced indexing and data types to geospatial capabilities and analytics, allowing you to significantly expand the native capabilities of Postgres. Some of the more popular Postgres extensions include:

- **PostGIS**: Adds support for geographic objects, turning PostgreSQL into a spatial database.
- **pg_stat_statements**: Tracks execution statistics of all SQL queries for performance tuning.
- **pg_partman**: Simplifies partition management, making it easier to maintain time-based or serial-based table partitions.
- **pg_trgm**: Provides fast similarity search using trigrams, ideal for full-text search.
- **hstore**: Implements key-value pairs for semi-structured data storage.
- **plpgsql**: Enables procedural language functions with PL/pgSQL scripting.
- **pgcrypto**: Offers cryptographic functions, including data encryption and decryption.
- **pgvector**: Brings vector similarity search to Postgres for building AI applications.

These are just a few of the extensions supported by Neon. Explore all supported extensions [here](/docs/extensions/extensions-intro).

Extensions can be installed with a simple `CREATE EXTENSION` command from Neon's [SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or any SQL client; for example:

```sql
CREATE EXTENSION pgcrypto;
```

## Build your AI applications with Postgres

**Why pay for a specialized vector database service when you can just use Postgres?**

Neon supports the [pgvector](/docs/extensions/pgvector) Postgres extension for storing and retrieving vector embeddings within your Postgres database. This feature is essential for building next-generation AI applications, enabling operations like fast and accurate similarity search, information retrieval, and recommendation systems directly in Postgres. Why pay for or add the complexity of a specialized vector database service when you have leading-edge capabilities in Postgres? Neon's own **Ask Neon AI** chat, built in collaboration with [InKeep](https://inkeep.com/), uses Neon with [pgvector](/docs/extensions/pgvector). For more, see [Powering next gen AI apps with Postgres](/docs/ai/ai-intro).

## Database DevOps with Neon's CLI, API, and GitHub Actions

**Neon is built for DevOps. Use our CLI, API, or GitHub Actions to build your CI/CD pipelines.**

- **Neon CLI**

  With the [Neon CLI](/docs/reference/neon-cli), you can integrate Neon with development tools and CI/CD pipelines to enhance your development workflows, reducing the friction associated with database-related operations like creating projects, databases, and branches. Once you have your connection string, you can manage your entire Neon database from the command line. This makes it possible to quickly set up deployment pipelines using GitHub Actions, GitLab CI/CD, or Vercel Preview Environments. These operations and pipelines can also be treated as code and live alongside your applications as they evolve and mature.

  ```bash
  neon branches create --name dev/alex
  ```

- **Neon API**

  The [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) is a REST API that enables you to manage your Neon projects programmatically. It provides resource-oriented URLs, accepts request bodies, returns JSON responses, and uses standard HTTP response codes. This API allows for a wide range of operations, enabling automation management of various aspects of Neon, including projects, branches, computes, databases, and roles. Like the Neon CLI, you can use the Neon API for seamless integration of Neon's capabilities into automated workflows, CI/CD pipelines, and developer tools. Give it a try using our [interactive Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

  ```bash
  curl --request POST \
      --url https://console.neon.tech/api/v2/projects/ancient-rice-43775340/branches \
      --header 'accept: application/json' \
      --header 'authorization: Bearer $NEON_API_KEY' \
      --header 'content-type: application/json' \
      --data '
  {
    "branch": {
      "name": "dev/alex"
    },
    "endpoints": [
      {
        "type": "read_write"
      }
    ]
  }
  '
  ```

-- **GitHub Actions**

    Neon provides the GitHub Actions for working with database branches, which you can add to your CI workflows. To learn more, see [Automate branching with GitHub Actions](/docs/guides/branching-github-actions).

    ```yaml
    name: Create Neon Branch with GitHub Actions Demo
    run-name: Create a Neon Branch 🚀
    jobs:
      Create-Neon-Branch:
        uses: neondatabase/create-branch-action@v5
        with:
          project_id: rapid-haze-373089
          # optional (defaults to your project's default branch)
          parent: dev
          # optional (defaults to neondb)
          database: my-database
          branch_name: from_action_reusable
          username: db_user_for_url
          api_key: ${{ secrets.NEON_API_KEY }}
        id: create-branch
      - run: echo db_url ${{ steps.create-branch.outputs.db_url }}
      - run: echo host ${{ steps.create-branch.outputs.host }}
      - run: echo branch_id ${{ steps.create-branch.outputs.branch_id }}
    ```
