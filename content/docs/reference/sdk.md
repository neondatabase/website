---
title: Neon SDKs
summary: >-
  Neon SDKs split into two categories: Client SDKs (TypeScript) for building
  apps with the Data API and Managed Better Auth, and Management SDKs (TypeScript, Python)
  for programmatically creating and controlling projects, branches, databases,
  endpoints, and roles via the Neon API. Client SDKs target app developers who
  need database queries and user authentication; Management SDKs target platform
  automation and DevOps workflows.
enableTableOfContents: true
redirectFrom:
  - /docs/reference/neondatabase-toolkit
updatedOn: '2026-07-15T00:08:00.682Z'
---

Neon provides two categories of SDKs to support different use cases:

- **Client SDKs**: For application developers building apps with the [Data API](/docs/data-api/overview) and optionally [Managed Better Auth](/docs/auth/overview). These SDKs handle database queries and user authentication from your application.
- **Management SDKs**: For programmatically managing Neon platform resources like projects, branches, databases, endpoints, and roles. These are wrappers around the [Neon API](/docs/reference/api).

## Client SDKs

Use these SDKs to build applications with the Data API and optional authentication via Managed Better Auth or another JWT provider.

<DetailIconCards>

<a href="/docs/reference/javascript-sdk" description="Build apps with the Data API using Managed Better Auth and database queries" icon="neon">Auth and Data API SDK</a>

</DetailIconCards>

## Management SDKs

Use these SDKs to programmatically manage your Neon infrastructure (projects, branches, databases, endpoints, roles, and operations).

<DetailIconCards>

<a href="/docs/reference/typescript-sdk" description="The official TypeScript SDK for the Neon API. Manage projects, branches, Postgres, storage, functions, and auth from one typed client" icon="neon">Neon Management SDK</a>

<a href="/docs/reference/migrate-api-client-to-sdk" description="Migrate from @neondatabase/api-client to @neon/sdk" icon="neon">Migrate to @neon/sdk</a>

<a href="/docs/reference/python-sdk" description="Programmatically manage Neon projects, branches, databases, and other platform resources" icon="neon">Python SDK (Neon API)</a>

</DetailIconCards>
