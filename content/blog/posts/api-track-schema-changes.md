---
title: An API to Track Database Schema Changes
description: >-
  Use the compare_schema endpoint to integrate schema checks into agentic
  systems and deployment pipelines
excerpt: >-
  We keep expanding our Schema Diff feature, this time adding an API endpoint:
  compare_schema. You can use it in all your Neon projects, including the Free
  Plan. Schema Diff allows you to easily compare schemas between Neon databases.
  It was first made available via the Neon Consol...
date: '2025-01-09T17:08:23'
updatedOn: '2025-01-21T15:37:49'
category: postgres
categories:
  - postgres
  - product
authors:
  - luis-tavares
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/api-track-schema-changes/cover.jpg
  alt: null
isFeatured: true
seo:
  title: An API to Track Database Schema Changes - Neon
  description: >-
    The compare_schema API tracks Neon database schemas programmatically,
    supporting migrations in CI/CD pipelines and agentic systems.
  keywords: []
  noindex: false
  ogTitle: An API to Track Database Schema Changes - Neon
  ogDescription: >-
    The compare_schema API tracks Neon database schemas programmatically,
    supporting migrations in CI/CD pipelines and agentic systems.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/api-track-schema-changes/social.jpg
---

![Post image](https://cdn.neonapi.io/public/images/pages/blog/api-track-schema-changes/neon-api-1-1024x576-78a92fa9.jpg)

**We keep expanding our Schema Diff feature, this time adding an** [API endpoint](https://neon.tech/docs/guides/schema-diff#using-the-neon-api)**: `compare_schema`. You can use it in all your Neon projects, including the** [Free Plan](https://console.neon.tech/signup).

[Schema Diff](https://neon.tech/docs/guides/schema-diff) allows you to easily compare schemas between Neon databases. It was first made available via the Neon Console and CLI, and we recently expanded it by launching the [Schema Diff GitHub Action](https://neon.tech/blog/track-schema-changes-automatically-in-your-pull-requests). This action integrates schema diffs directly into pull requests; whenever a pull request is created or updated, the GitHub Action runs a schema comparison, posting a comment in the PR summarizing the differences.

After shipping the GitHub Action, we wanted to extend these automation capabilities to other CI/CD pipelines via an API. Also, we saw another use case demanding an API for checking schema diffs: **Agentic systems**.

## Managing database migrations in agentic systems

[Agentic systems](https://www.anthropic.com/research/building-effective-agents) are autonomous AI entities powered by LLMs that can dynamically determine their own actions to achieve complex objectives, for example deploying software infrastructure to build end-to-end apps. Unlike predefined AI workflows (which follow static sequences), agentic systems can dynamically adapt to the task at hand.

If we want these systems to deploy functional applications, persistent data is a requirement. Agentic systems need databases to enable continuity and memory for their apps: for example, [Replit Agent](https://docs.replit.com/replitai/agent) knows how to [deploy and manage Postgres databases](https://neon.tech/blog/how-to-add-a-postgres-database-to-your-replit-agent-project) as required by each project.

This means agentic systems also have to handle schema evolution. When the structure of stored data needs to change (e.g. due to new features), the agent must assess the current Postgres schema, determine necessary updates, and apply them.

The `compare_schema` API facilitates this workflow by enabling programmatic schema comparisons. For example, Replit Agent can use the API to:

- Dynamically assess schema differences when implementing new features
- Automate the generation and application of migration scripts during deployment
- Validate that database updates align with the intended schema

## Automating workflows: from agents to developers

What’s useful for agents is useful for developers. Agentic systems benefit from tools that enable autonomy, same for developers looking to streamline their pipelines.

Database migrations are one of the trickiest things to automate. They require comparing the current database schema with a target schema, identifying discrepancies, writing migration scripts to align the two, and testing the migrations to ensure they work. The `compare_schema` API facilitates the automation of these steps, especially when combined with [Neon branches](https://neon.tech/docs/introduction/branching). Teams can set up a system in which:

1. Schema changes are applied and tested in a Neon branch. Branches include a copy of production data but don’t interfere with the production database (they have their own compute)
2. The API is used to track schema discrepancies
3. Once everything is tested, a script executes the migration in production

This method reduces the risk of errors (since new schemas are being tested in real data) while supporting a smoother deployment process.

## Taking a look at the API

The [API](https://neon.tech/docs/guides/schema-diff#using-the-neon-api) accepts two Neon branch IDs and returns a schema diff, highlighting additions, modifications, and deletions in database objects. It supports these parameters:

- **`project_id`**: the ID of your Neon project
- **`branch_id`**: the ID of the target branch to compare—the branch with the modified schema
- **`db_name`**: the name of the database
- **`base_branch_id`** (optional): the ID of the base branch for comparison, if empty, infers, by default, the parent branch of branch_id
- **`lsn`** (optional): the [LSN](https://neon.tech/blog/get-page-at-lsn) on the target branch
- **`timestamp`** (optional): the point in time on the target branch
- **`base_lsn`** (optional): the LSN for the base branch
- **`base_timestamp`** (optional): the point in time on the base branch

The point-in-time parameters (LSN and timestamp) are mutually exclusive. You cannot define them simultaneously, as they could represent two different times in the history of the branch.

This example cURL command compares the schema of a target branch (`br-rough-boat-a54bs9yb`) to a base branch (`br-royal-star-a54kykl2`):

```bash
curl --request GET \
     --url 'https://console.neon.tech/api/v2/projects/wispy-butterfly-25042691/branches/br-rough-boat-a54bs9yb/compare_schema?base_branch_id=br-royal-star-a54kykl2&db_name=neondb' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' | jq -r '.diff'
```

The output would have like structure:

```
--- a/neondb
+++ b/neondb
@@ -27,7 +27,8 @@
 CREATE TABLE public.playing_with_neon (
     id integer NOT NULL,
     name text NOT NULL,
-    value real
+    value real,
+    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
 );
```

The (-) lines indicate schema elements removed from the base branch, and the (+) lines indicate schema elements added in the target branch.

## Getting started

Review our [API reference](https://api-docs.neon.tech/reference/getprojectbranchschemacomparison) for detailed instructions. If you don’t have a Neon account yet, you can create one for free [here](https://console.neon.tech/signup). Neon has a [Free Plan](https://neon.tech/pricing) that includes 10 projects, with 10 branches per project.
