---
title: Neon Data API
subtitle: A fully managed REST interface for your Neon database
summary: >-
  Neon Data API is a PostgREST-compatible HTTP query interface for Neon
  Postgres. It lets web browsers, Cloudflare Workers, Vercel Edge, and
  serverless functions query a database without persistent TCP connections.
  Standard Postgres drivers don't work in browsers or edge runtimes. The Data
  API solves this by accepting standard HTTP requests, validating JWTs from any
  auth provider, and enforcing PostgreSQL Row-Level Security policies. Each
  request is stateless, so the API scales to thousands of concurrent users
  without connection pool exhaustion.
enableTableOfContents: true
updatedOn: '2026-09-18T16:54:04.950Z'
---

The Neon Data API is the HTTP query service in the Neon backend for apps and agents. It provides a secure, stateless interface to your database, letting you access and manage your data directly from web browsers, serverless functions, and edge runtimes using standard HTTP methods. Key benefits include:

- **Browser and edge compatibility.** Standard Postgres drivers don't work in web browsers and struggle in edge runtimes, so query from Cloudflare Workers, Vercel Edge, or a browser frontend over standard HTTP.
- **Connectionless scalability.** Short-lived HTTP requests replace persistent TCP connections, so you avoid connection pool exhaustion and scale to thousands of concurrent users.
- **Secure by default.** The API validates JWTs from any authentication provider and respects PostgreSQL [Row-Level Security (RLS)](/docs/guides/row-level-security) policies, so users only access data they're permitted to see. Use [Managed Better Auth](/docs/auth/overview), or bring your own provider like [Auth0, Clerk, or Firebase](/docs/data-api/custom-authentication-providers).
- **CI/CD integration.** Test integrations in isolated branch environments with the [Neon Create Branch GitHub Action](https://github.com/marketplace/actions/neon-create-branch-github-action), which retrieves branch-specific Data API URLs for your workflows.

## PostgREST compatibility

The Neon Data API is fully compatible with [PostgREST](https://postgrest.org/en/stable/). This compatibility allows you to query your database using any standard HTTP client (such as Postman or `cURL`) or integrate easily using client libraries, including [`@neondatabase/neon-js`](https://www.npmjs.com/package/@neondatabase/neon-js) and [`@neondatabase/postgrest-js`](https://www.npmjs.com/package/@neondatabase/postgrest-js).

## Quickstart

<DetailIconCards>

<a href="/docs/data-api/get-started" description="Learn how to enable and use the Neon Data API with step-by-step instructions." icon="todo">Get Started</a>

<a href="/docs/data-api/demo" description="Explore our demo note-taking app to learn Data API queries with RLS." icon="audio-jack">Tutorial</a>

<a href="/docs/reference/javascript-sdk" description="Complete reference for authentication and database query methods." icon="code">Neon TypeScript SDK</a>

<a href="/docs/data-api/sql-to-rest" description="Convert SQL queries into RESTful HTTP requests." icon="sql">SQL to REST Converter</a>

<a href="/docs/data-api/generate-types" description="Generate TypeScript types from your database schema for type-safe queries." icon="code">Generate Types</a>

</DetailIconCards>

<NeedHelp/>
