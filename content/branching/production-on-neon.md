---
title: 'Production lives on Neon'
subtitle: 'Run production and non-production environments on Neon with secure, isolated branching workflows for every use case'
updatedOn: '2025-07-08T12:47:21.296Z'
---

You use Neon to run both production and non-production environments. This is the most common setup for teams that want a fully serverless Postgres workflow leveraging branching to isolate dev, test, and staging environments without duplicating infrastructure.

## Single project

Your application has one primary database that serves all users. You manage all your environments (e.g. production, dev, staging, previews) within a single Neon project using branches to isolate workflows.

### No PII in production

Not all production databases include personally identifiable information. If this is your case, you can safely use production-like data in non-production environments. Follow this pattern:

![Branching diagram 1](/images/pages/branching/diagram-1.png)

1. **Use `main` as your production branch**. This holds your live application data and schema.
2. **Create a long-lived dev branch**, calling it something like `main-dev`. You’ll use this as the base for all development and testing environments.
3. **Derive non-prod environments from `main-dev`**. Examples (see [Common branching workflows](/branching#workflows)):
   - `dev-alice`, `dev-bob` (per developer)
   - `preview-pr-42` (per PR)
   - `qa-metrics-test` (for testing feature flags, upgrades, etc.)
4. **Reset environments regularly**. Use branch resets to keep them aligned with `main-dev`, or delete and recreate branches as needed.

### PII in production

If your production database includes sensitive data such as user names and emails, payment or health information, or internal records, then non-prod environments must avoid exposing this data. Here’s a recommended branching architecture for this scenario.

![Branching diagram 2](/images/pages/branching/diagram-2.png)

1. **Use `main` as your production branch**. This is your live environment, containing real user data.
2. **Create a schema-only branch from `main`**. This duplicates only the database structure (tables, views, functions) without copying any sensitive data.
3. **Load anonymized data into the schema-only branch**. Use Neon’s integration with PostgreSQL Anonymizer, or your own masking scripts, to populate the branch with safe test data that mirrors production shape and scale.
4. **Promote this branch as your template for non-prod environments**. Name it something like `main-anon` or `dev-anon`. This becomes the base for all development, preview, and QA branches.
5. **Derive all non-prod environments from `main-anon`**. Examples (see [Common branching workflows](/branching#workflows)):
   - `dev-alice`, `dev-bob` (per developer)
   - `preview-pr-42` (per PR)
   - `qa-metrics-test` (for load or feature testing)
6. **Reset environments regularly**. Use branch resets to keep them aligned with `main-anon`, or delete and recreate branches as needed.

> Once this workflow is set up, you only need to maintain `main-anon`. All other branches, whether created by a developer or a CI job, can be reset, recycled, or deleted without risk. This makes it easy to support many environments without multiplying infrastructure or accidentally leaking sensitive data.

## Project per customer

If your architecture provisions a dedicated Neon project for each customer, you’ll need to manage development and testing environments on a per-project basis.

This setup is common for multi-tenant SaaS platforms that offer database-level isolation per customer - for example, platforms handling sensitive or regulated data, or those offering enterprise-grade SLAs with strict data separation.

Here’s how to structure branching in this model:

![Branching diagram 3](/images/pages/branching/diagram-3.png)

1. **Create a dedicated Neon project for development and testing**. This non-prod project serves as the shared workspace for all ephemeral environments.
2. **Load testing data into the `main` branch**. This branch holds a sanitized dataset that reflects the structure and scale of production. It acts as the base for all dev/test environments.
3. **Derive child branches from `main` as needed**. Examples (see [Common branching workflows](/branching#workflows)):
   - `dev-alice`, `dev-bob` (per developer)
   - `preview-pr-42` (per PR)
   - `qa-metrics-test` (for load or feature testing)
4. **Reset environments regularly**. Use branch resets to keep them aligned with `main-anon`, or delete and recreate branches as needed.
