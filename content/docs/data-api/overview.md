---
title: Neon Data API
subtitle: A fully managed REST interface for your Neon database
enableTableOfContents: true
updatedOn: '2025-12-10T22:18:02.770Z'
---

<FeatureBetaProps feature_name="Neon Data API" />

The Neon Data API provides a secure, stateless HTTP interface to your database. It allows you to access and manage your data directly from web browsers, serverless functions, and edge runtimes using standard HTTP methods. Key benefits include:

- **Browser & edge compatibility**

  Standard Postgres drivers do not work in web browsers and struggle in edge runtimes. The Data API allows you to query your database from Cloudflare Workers, Vercel Edge, or directly from a browser-based frontend using standard HTTP requests.

- **Connectionless scalability**

  Eliminate connection pool exhaustion. Because the API uses short-lived HTTP requests instead of persistent TCP connections, it effortlessly handles thousands of concurrent users and serverless auto-scaling.

- **Secure by default**

  The API is designed to expose your database safely. It integrates with Neon Auth and respects PostgreSQL [Row-Level Security (RLS)](/docs/guides/row-level-security) policies, ensuring users only access the data they are explicitly permitted to see.

## PostgREST compatibility

The Neon Data API is fully compatible with [PostgREST](https://postgrest.org/en/stable/). This compatibility allows you to query your database using any standard HTTP client (such as Postman or `cURL`) or integrate easily using client libraries, including [`@neondatabase/neon-js`](https://www.npmjs.com/package/@neondatabase/neon-js) and [`@neondatabase/postgrest-js`](https://www.npmjs.com/package/@neondatabase/postgrest-js).

## Quickstart

<DetailIconCards>

<a href="/docs/data-api/get-started" description="Learn how to enable and use the Neon Data API with step-by-step instructions." icon="todo">Get Started</a>

<a href="/docs/data-api/demo" description="Explore our demo note-taking app to learn Data API queries with RLS." icon="audio-jack">Tutorial</a>

<a href="/docs/data-api/sql-to-rest" description="Convert SQL queries into RESTful HTTP requests using the Neon Data API." icon="code">SQL to REST Converter</a>

<a href="/docs/data-api/generate-types" description="Generate TypeScript types from your database schema for type-safe queries." icon="code">Generate Types</a>

</DetailIconCards>

<NeedHelp/>
