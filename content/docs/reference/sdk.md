---
title: Neon SDKs
summary: >-
  Covers the setup of Client and Management SDKs for Neon, enabling application
  developers to implement user authentication and database queries, as well as
  manage platform resources programmatically.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.147Z'
---

Neon provides two categories of SDKs to support different use cases:

- **Client SDKs** — For application developers building apps with [Neon Auth](/docs/auth/overview) and the [Data API](/docs/data-api/overview). These SDKs handle user authentication and database queries from your application.
- **Management SDKs** — For programmatically managing Neon platform resources like projects, branches, databases, endpoints, and roles. These are wrappers around the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

## Client SDKs

Use these SDKs to build applications with Neon Auth and the Data API.

<DetailIconCards>

<a href="/docs/reference/javascript-sdk" description="Build apps with Neon Auth and Data API using authentication methods and database queries" icon="neon">Neon Auth & Data API TypeScript SDKs</a>

</DetailIconCards>

## Management SDKs

Use these SDKs to programmatically manage your Neon infrastructure — projects, branches, databases, endpoints, roles, and operations.

<DetailIconCards>

<a href="/docs/reference/typescript-sdk" description="Programmatically manage Neon projects, branches, databases, and other platform resources" icon="neon">Neon API TypeScript SDK</a>

<a href="/docs/reference/python-sdk" description="Programmatically manage Neon projects, branches, databases, and other platform resources" icon="neon">Python SDK (Neon API)</a>

<a href="/docs/reference/neondatabase-toolkit" description="An SDK for AI Agents (and humans) that includes both the Neon API TypeScript SDK and the Neon Serverless Driver" icon="neon">@neondatabase/toolkit</a>

</DetailIconCards>

## Community SDKs

<Admonition type="note">
Community SDKs are not maintained or officially supported by Neon. Some features may be out of date, so use these SDKs at your own discretion. If you have questions about these SDKs, please contact the project maintainers.
</Admonition>

<DetailIconCards>

<a href="https://github.com/kislerdm/neon-sdk-go" description="A Go SDK for the Neon API" icon="github">Go SDK (Neon API)</a>

<a href="https://github.com/paambaati/neon-js-sdk" description="A Node.js and Deno SDK for the Neon API" icon="github">Node.js / Deno SDK (Neon API)</a>

</DetailIconCards>
