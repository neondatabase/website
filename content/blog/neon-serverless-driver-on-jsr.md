---
title: Neon Serverless Driver on JSR
description: The fastest Edge-compatible Postgres driver arrives on Deno
excerpt: >-
  We’re excited to announce the release of Neon’s Serverless Driver 0.9.0 on
  Deno’s JavaScript Registry JSR. Deno is an open-source JavaScript, TypeScript,
  and WebAssembly runtime built on V8, Rust, and Tokio. Although compatible with
  npm, Deno built JSR to address several changes...
date: '2024-04-17T09:26:33'
updatedOn: '2024-04-17T09:26:34'
category: community
categories:
  - community
authors:
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-serverless-driver-on-jsr/cover.png
  alt: null
isFeatured: false
seo:
  title: Neon Serverless Driver on JSR - Neon
  description: The fastest Edge-compatible Postgres driver arrives on Deno
  keywords: []
  noindex: false
  ogTitle: Neon Serverless Driver on JSR - Neon
  ogDescription: >-
    We’re excited to announce the release of Neon’s Serverless Driver 0.9.0 on
    Deno’s JavaScript Registry JSR. Deno is an open-source JavaScript,
    TypeScript, and WebAssembly runtime built on V8, Rust, and Tokio. Although
    compatible with npm, Deno built JSR to address several changes and
    evolutions in the JavaScript ecosystem, including the adoption of ECMAScript
    Modules, the […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-serverless-driver-on-jsr/social.png
source:
  wpId: 5766
  wpSlug: neon-serverless-driver-on-jsr
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-serverless-driver-on-jsr/image-32-1024x576-42d6d561.png)

We’re excited to announce the release of Neon’s Serverless Driver 0.9.0 on Deno’s JavaScript Registry JSR. Deno is an open-source JavaScript, TypeScript, and WebAssembly runtime built on V8, Rust, and Tokio.

Although compatible with npm, Deno built JSR to address several changes and evolutions in the JavaScript ecosystem, including the adoption of ECMAScript Modules, the rise in popularity of TypeScript, and the emergence of new JavaScript runtimes such as Cloudflare Workers and Bun.

Think of JSR as npm optimized for TypeScript and ES modules, which works with Deno and all your Node, Bun, and Cloudflare Workers projects.

## Why use Neon’s serverless driver in your Deno projects

The short answer: faster query latencies.

Neon is compatible with any Postgres driver, such as Postgres.js, node-postgres, etc. However, we built the serverless driver to allow V8-isolate runtimes such as Deno and Cloudflare Workers to connect to the database via protocols other than TCP.

Our driver connects to the proxy over a WebSocket, telling the proxy which database host and port it wants to reach. We then worked to optimize for sub-10ms first query latencies, [cutting by half the number of WebSocket roundtrips](https://neon.tech/blog/quicker-serverless-postgres) and then adding support for HTTP and connection caching.

Read more about [HTTP vs. WebSockets: Which protocol for your Postgres queries at the Edge](https://neon.tech/blog/http-vs-websockets-for-postgres-queries-at-the-edge).

You can get started with the serverless driver using the `deno add` command:

```bash
deno add @neon/serverless
```

The above command will generate a `deno.json` file, listing all your project dependencies.

```typescript
// deno.json

{
  "imports": {
    "@neon/serverless": "jsr:@neon/serverless@^0.9.0"
  }
}
```

You can then import the serverless driver to your `hello.ts` file:

```typescript
// hello.ts

import { neon } from "@neon/serverless";

// Get the connection string from the environment variable "DATABASE_URL"
const databaseUrl = Deno.env.get("DATABASE_URL")!;
const sql = neon(databaseUrl);
const result = await sql`SELECT 'Hello World' as message`;

// [ { message: "Hello World" } ]
```

Run the following command to execute:

```bash
​​deno run -A hello.ts
```

Once you have finished writing your application, you can deploy it on Deno Deployvia a Github integration or deployctl:

```bash
deployctl deploy --project=<project-name> <application-file-name>
```

## Conclusion

With the addition of Neon’s serverless driver to JSR, you can quickly add the driver to your project dependencies and run sub-10ms queries on multiple JavaScript runtimes, including Deno, Cloudflare, Bun, and Node.

[Try Neon for free now](https://console.neon.tech). Join us on [Discord](https://neon.tech/discord), follow us on [X](https://x.com/neondatabase), and let us know how we can make your experience using Neon and Postgres better. Happy coding!
