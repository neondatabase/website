---
title: Create a Neon Twin
subtitle: Learn how to Twin your production database with Neon
summary: >-
  A Neon Twin is a full or partial clone of your production or staging database
  hosted on Neon, giving developers isolated, sandboxed environments that stay
  automatically synchronized with production. Use a Neon Twin when you want to
  run development and testing against real schema and data without touching
  production, with instant branches spun up per developer or feature. Choosing
  between a full Twin (pg_dump/pg_restore of the entire database) and a partial
  Twin (schema plus a row subset of selected tables) depends on data volume and how much
  production fidelity your workflow requires.
enableTableOfContents: true
isDraft: false
updatedOn: '2026-06-23T22:05:54.707Z'
---

<CTA title="Explore our dev/test use case" description="Move development and testing to Neon; keep production right where it is.<br/><br/>Read more about our dev/test use case <a href='/use-cases/dev-test'>here</a>."></CTA>

## What is a Neon Twin?

A Neon Twin is a full or partial clone of your production or staging database, providing developers and teams with isolated, sandboxed environments that closely mirror production.

![Dev/Test Twin Workflow](/use-cases/dev-test-twin-workflow.png)

## Benefits

A Neon Twin moves development and testing off your production database. Each developer or feature team works against its own copy of the data, and production stays untouched.

## Automatic sync

The workflows in this section refresh your Neon Twin on a schedule. You can also run them when a pull request merges into `main`.

## Instant branches

With a Neon Twin created, [branches](/docs/introduction/branching) can be quickly spun up or torn down, enabling developers to build new features or debug issues, all within their own isolated environments with a dedicated compute resource.

Branches can be created and managed through the [Neon console](https://console.neon.tech/) or programmatically via the [API](/docs/reference/api).

## Get started

Pick the workflow that fits your needs. A full Twin mirrors your entire production database. A partial Twin copies the schema and a subset of rows from selected tables, which is useful when you don't need every row of production data.

<DetailIconCards>

<a href="/docs/guides/neon-twin-full-pg-dump-restore" description="Clone your entire production database to Neon using pg_dump and pg_restore in a GitHub Actions workflow." icon="database">Create a full Twin</a>

<a href="/docs/guides/neon-twin-partial-pg-dump-restore" description="Clone the schema and a row subset of selected tables from production using pg_dump, pg_restore, and psql." icon="split-branch">Create a partial Twin</a>

</DetailIconCards>
