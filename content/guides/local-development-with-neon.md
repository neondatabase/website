---
title: Local development with Neon
subtitle: Learn how to develop applications locally with Neon
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2024-11-05T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

This guide covers two ways to set up a development environment for an app that uses Neon: a database branch per developer, or a local Postgres instance you reach through the same driver.

<Admonition type="note">
The setups described in this guide use the **Neon serverless driver** for connecting to a Postgres database hosted locally or on Neon over HTTP or WebSockets. To learn more, see [The Neon serverless driver](/docs/serverless/serverless-driver).
</Admonition>

## Two ways to develop

You can set up a development environment with Neon in two ways:

1. **Database branching**
2. **Local Postgres**

## Database branching

[Database branching](/docs/introduction/branching) creates a complete copy of your database as easily as creating a Git branch. Use it to test new features or updates without touching production data.

### Why use it?

- **Fast setup**: Create new environments in ~1 second
- **No local install**: No local Postgres installation required
- **Isolation**: Test changes without affecting production
- **Cost**: Child branch storage bills only for data that changes, and compute bills only while it runs
- **Team-friendly**: Share database branches as easily as sharing Git branches
- **Scale to zero**: Compute suspends when you're not coding
- **Data reset**: Reset your branch to match its parent in seconds

### Quickstart

1. Install the [**Neon CLI**](/docs/cli) by following the guide [here](/docs/cli/install).

2. **Connect your account**

   ```bash
   neon login
   ```

3. **Create your branch**

   ```bash
   neon branches create --name dev/your-name

   # Get your connection details
   neon connection-string dev/your-name
   ```

   <Admonition type="note">
   You can also create branches in the Neon Console from your project's **Branches** page.
   </Admonition>

4. **Set up your environment**

   ```bash
   # .env.development
   DATABASE_URL='postgresql://[user]:[password]@[endpoint]/[dbname]'
   ```

5. **Install dependencies**

   Dependencies include [Neon's serverless driver](/docs/serverless/serverless-driver) and a WebSockets library.

   <Admonition type="note">
   The Neon serverless driver supports connections over HTTP and WebSockets, depending on your requirements. This setup assumes you could be using either. For the differences, see [Neon serverless driver](/docs/serverless/serverless-driver).
   </Admonition>

   <CodeTabs labels={["npm", "yarn", "pnpm"]}>

   ```bash
   npm install @neondatabase/serverless ws
   ```

   ```bash
   yarn add @neondatabase/serverless ws
   ```

   ```bash
   pnpm add @neondatabase/serverless ws
   ```

   </CodeTabs>

6. **Connect your app**

   ```javascript
   import { Pool, neon, neonConfig } from '@neondatabase/serverless';

   // For Node.js environments: import and configure the 'ws' package
   // For browsers/Edge: WebSocket is available natively - no import needed
   // import ws from 'ws';
   // neonConfig.webSocketConstructor = ws;

   export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
   export const sql = neon(process.env.DATABASE_URL);
   ```

    <Admonition type="note">
      If you're using Drizzle or Prisma, replace your database connection string in your environment variables with your development branch's connection string.
    </Admonition>

### Tips and tricks

- **Stay organized**: Use prefixes like `dev/feature-auth` or `dev/alice`
- **Reset data**: Start fresh when needed:
  ```bash
  neon branches reset dev/your-name --parent
  ```
- **Feature work**: Create dedicated branches:
  ```bash
  neon branches create --name dev/auth-system --parent main
  ```

## Local Postgres

Sometimes you need to work offline or want full control over your database. Here's how to set up a local Postgres instance that you connect to with the Neon serverless driver. This method uses:

- The [Neon serverless driver](/docs/serverless/serverless-driver) to connect to your local database (same as the database branching setup described above)
- A Docker Compose file that runs a local instance of Postgres 17 and the Neon Proxy. The Neon Proxy lets you connect to your local Postgres database using the Neon serverless driver.

<Admonition type="note" title="kudos">
The Neon Proxy setup uses the [local-neon-http-proxy](https://github.com/TimoWilhelm/local-neon-http-proxy) Dockerfile, developed by [TimoWilhelm](https://github.com/TimoWilhelm).
</Admonition>

### Why use this method?

- **Full control**: Your own Postgres instance
- **Offline work**: Code without an internet connection
- **Fast queries**: No network latency
- **Free development**: Use your local resources

### Docker Compose setup

Create a `docker-compose.yml` file with the following content:

```yaml
services:
  postgres:
    image: postgres:17
    command: '-d 1'
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=main
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5

  neon-proxy:
    image: ghcr.io/timowilhelm/local-neon-http-proxy:main
    environment:
      - PG_CONNECTION_STRING=postgres://postgres:postgres@postgres:5432/main
    ports:
      - '4444:4444'
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  db_data:
```

Run the following command to start local Postgres and the Neon Proxy:

```bash
docker-compose up -d
```

<Admonition type="tip" title="Working offline?">
The [local-neon-http-proxy](https://github.com/TimoWilhelm/local-neon-http-proxy) Dockerfile setup uses [*.localtest.me](https://readme.localtest.me/) to enable testing with local URLs without adding entries to your host file. The `localtest.me` domain and all wildcard subdomains point to `127.0.0.1`.

However, this setup requires an internet connection. To work offline, you'll need to add an entry to your system's hosts file to map `db.localtest.me` to localhost:

```bash
127.0.0.1 db.localtest.me
```

For instructions on editing your hosts file on different operating systems, see [this guide](https://www.hostinger.in/tutorials/how-to-edit-hosts-file).

[dnsmasq](https://help.ubuntu.com/community/Dnsmasq) is another option [suggested by a Neon user](https://github.com/neondatabase/website/issues/2690) for resolving domain names when there is no internet connection.
</Admonition>

### Connect your app

<Tabs labels={["Using neondatabase/serverless", "Using drizzle", "Using prisma"]}>

<TabItem>

1. **Set your environment**

   The following code expects `NODE_ENV` to be set to `development` during local development. Verify that your environment is configured accordingly. Alternatively, you can modify the code to use an explicit connection string for each environment instead of relying solely on `NODE_ENV`.

2. **Install dependencies**

   <CodeTabs labels={["npm", "yarn", "pnpm"]}>

   ```bash
   npm install @neondatabase/serverless ws
   ```

   ```bash
   yarn add @neondatabase/serverless ws
   ```

   ```bash
   pnpm add @neondatabase/serverless ws
   ```

   </CodeTabs>

3. **Configure the connection**

   ```typescript
   import { neon, neonConfig, Pool } from '@neondatabase/serverless';
   // Node.js environment: the 'ws' package is required for WebSocket support
   import ws from 'ws';

   let connectionString = process.env.DATABASE_URL;

   // Configuring Neon for local development
   if (process.env.NODE_ENV === 'development') {
     connectionString = 'postgres://postgres:postgres@db.localtest.me:5432/main';
     neonConfig.fetchEndpoint = (host) => {
       const [protocol, port] = host === 'db.localtest.me' ? ['http', 4444] : ['https', 443];
       return `${protocol}://${host}:${port}/sql`;
     };
     const connectionStringUrl = new URL(connectionString);
     neonConfig.useSecureWebSocket = connectionStringUrl.hostname !== 'db.localtest.me';
     neonConfig.wsProxy = (host) => (host === 'db.localtest.me' ? `${host}:4444/v2` : `${host}/v2`);
   }
   neonConfig.webSocketConstructor = ws;

   // Neon supports both HTTP and WebSocket clients. Choose the one that fits your needs:

   // HTTP Client (sql)
   // - Best for serverless functions and Lambda environments
   // - Ideal for stateless operations and quick queries
   // - Lower overhead for single queries
   // - Better for applications with sporadic database access
   export const sql = neon(connectionString);

   // WebSocket Client (pool)
   // - Best for long-running applications (like servers)
   // - Maintains a persistent connection
   // - More efficient for multiple sequential queries
   // - Better for high-frequency database operations
   export const pool = new Pool({ connectionString });
   ```

</TabItem>
<TabItem>

1. **Set your environment**

   The following code expects `NODE_ENV` to be set to `development` during local development. Verify that your environment is configured accordingly. Alternatively, you can modify the code to use an explicit connection string for each environment instead of relying solely on `NODE_ENV`.

2. **Install dependencies**

   <CodeTabs labels={["npm", "yarn", "pnpm"]}>

   ```bash
   npm install drizzle-orm @neondatabase/serverless ws
   ```

   ```bash
   yarn add drizzle-orm @neondatabase/serverless ws
   ```

   ```bash
   pnpm add drizzle-orm @neondatabase/serverless ws
   ```

   </CodeTabs>

3. **Configure the connection**

   ```typescript
   import { neon, neonConfig, Pool } from '@neondatabase/serverless';
   import { drizzle as drizzleWs } from 'drizzle-orm/neon-serverless';
   import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http';
   // Node.js environment: the 'ws' package is required for WebSocket support
   import ws from 'ws';

   let connectionString = process.env.DATABASE_URL;

   // Configuring Neon for local development
   if (process.env.NODE_ENV === 'development') {
     connectionString = 'postgres://postgres:postgres@db.localtest.me:5432/main';
     neonConfig.fetchEndpoint = (host) => {
       const [protocol, port] = host === 'db.localtest.me' ? ['http', 4444] : ['https', 443];
       return `${protocol}://${host}:${port}/sql`;
     };
     const connectionStringUrl = new URL(connectionString);
     neonConfig.useSecureWebSocket = connectionStringUrl.hostname !== 'db.localtest.me';
     neonConfig.wsProxy = (host) => (host === 'db.localtest.me' ? `${host}:4444/v2` : `${host}/v2`);
   }
   neonConfig.webSocketConstructor = ws;

   const sql = neon(connectionString);
   const pool = new Pool({ connectionString });

   // Drizzle supports both HTTP and WebSocket clients. Choose the one that fits your needs:

   // HTTP Client:
   // - Best for serverless functions and Lambda environments
   // - Ideal for stateless operations and quick queries
   // - Lower overhead for single queries
   // - Better for applications with sporadic database access
   export const drizzleClientHttp = drizzleHttp({ client: sql });

   // WebSocket Client:
   // - Best for long-running applications (like servers)
   // - Maintains a persistent connection
   // - More efficient for multiple sequential queries
   // - Better for high-frequency database operations
   export const drizzleClientWs = drizzleWs({ client: pool });
   ```

4. **Migration setup**

   To run Drizzle migrations against your local database, install the `postgres` package as a development dependency.

   <CodeTabs labels={["npm", "yarn", "pnpm"]}>

   ```bash
   npm i -D postgres
   ```

   ```bash
   yarn add -D postgres
   ```

   ```bash
   pnpm add -D postgres
   ```

   </CodeTabs>

</TabItem>

<TabItem>

Driver adapters are generally available in current Prisma versions. The `driverAdapters` preview flag in step 3 is only needed on older Prisma versions. See the [Prisma documentation](https://www.prisma.io/docs/orm/overview/databases/neon) for the latest information.

1. **Set your environment**

   The following code expects `NODE_ENV` to be set to `development` during local development. Verify that your environment is configured accordingly. Alternatively, you can modify the code to use an explicit connection string for each environment instead of relying solely on `NODE_ENV`.

2. **Install dependencies**

   <CodeTabs labels={["npm", "yarn", "pnpm"]}>

   ```bash
   npm install @prisma/client @prisma/adapter-neon @neondatabase/serverless ws
   ```

   ```bash
   yarn add @prisma/client @prisma/adapter-neon @neondatabase/serverless ws
   ```

   ```bash
   pnpm add @prisma/client @prisma/adapter-neon @neondatabase/serverless ws
   ```

   </CodeTabs>

3. **Enable the preview flag (older Prisma versions only)**

   On older Prisma versions, enable the preview flag in your `schema.prisma` file to use the Neon serverless driver.

   ```prisma
     generator client {
       provider        = "prisma-client-js"
       previewFeatures = ["driverAdapters"]
     }
   ```

4. **Configure the connection**

   ```typescript
   import { neonConfig } from '@neondatabase/serverless';
   import { PrismaNeon, PrismaNeonHTTP } from '@prisma/adapter-neon';
   import { PrismaClient } from '@prisma/client';
   // Node.js environment: the 'ws' package is required for WebSocket support
   import ws from 'ws';

   let connectionString =
     process.env.DATABASE_URL || 'postgres://postgres:postgres@db.localtest.me:5432/main';

   // Configuring Neon for local development
   if (process.env.NODE_ENV === 'development') {
     neonConfig.fetchEndpoint = (host) => {
       const [protocol, port] = host === 'db.localtest.me' ? ['http', 4444] : ['https', 443];
       return `${protocol}://${host}:${port}/sql`;
     };
     const connectionStringUrl = new URL(connectionString);
     neonConfig.useSecureWebSocket = connectionStringUrl.hostname !== 'db.localtest.me';
     neonConfig.wsProxy = (host) => (host === 'db.localtest.me' ? `${host}:4444/v2` : `${host}/v2`);
   }
   neonConfig.webSocketConstructor = ws;

   // Prisma supports both HTTP and WebSocket clients. Choose the one that fits your needs:

   // HTTP Client:
   // - Ideal for stateless operations and quick queries
   // - Lower overhead for single queries
   const adapterHttp = new PrismaNeonHTTP(connectionString!, {});
   export const prismaClientHttp = new PrismaClient({ adapter: adapterHttp });

   // WebSocket Client:
   // - Best for long-running applications (like servers)
   // - Maintains a persistent connection
   // - More efficient for multiple sequential queries
   // - Better for high-frequency database operations
   const adapterWs = new PrismaNeon({ connectionString });
   export const prismaClientWs = new PrismaClient({ adapter: adapterWs });
   ```

</TabItem>

</Tabs>

## Which development approach should you use?

Cloud-hosted branches have these advantages over local development:

### Cost-efficient development

- **Storage**: Child branch storage is billed only on the data that changes, capped at your actual data size
- **Compute**: Development branches can run on small computes (0.25 CU, ≈1 GB RAM) that scale to zero when idle
- **Free plan**: The Free plan includes 100 CU-hours per project, enough to run a 0.25 CU compute for 400 hours

### Developer-friendly features

- **Fast setup**: Branches are created in seconds
- **Branch reset**: Refresh your development data from the parent branch
- **Less maintenance**: No local Postgres installation to manage

| Feature             | Database branching                       | Local Postgres                       |
| ------------------- | ---------------------------------------- | ------------------------------------ |
| Setup time          | ✅ Instant (~1 second)                   | ⏱️ Requires initial configuration    |
| Configuration       | ✅ Zero configuration needed             | 🔧 Requires local setup              |
| Team collaboration  | ✅ Easy branch sharing and management    | 🤝 Requires additional setup         |
| Cost management     | ✅ Pay for changed data and compute time | 💻 Local resources only              |
| Resource scaling    | ✅ Scale to zero when not in use         | ❌ Always consuming resources        |
| Offline development | ❌ Requires internet connection          | ✅ Works offline                     |
| Network latency     | 🌐 Depends on connection                 | ✅ Zero latency                      |
| Production parity   | ✅ Copy of production schema and data    | 🔄 Requires additional configuration |

## When to use each approach

### Choose database branching when:

- You want instant development environments
- You need efficient resource use
- You're working with a team

**Good for:**

- Most development workflows
- Team environments
- Rapid prototyping
- Feature development
- Testing database changes

### Consider local Postgres when:

- You need offline development
- You need no network latency
- You require complete database control
- You have specific local testing requirements

## Best practices for cloud-hosted development with Neon branching

### Environment tips

- Keep development and production database branches separate
- Use clear branch names
- Never commit credentials to a version control system

### Resource tips

- Use scale to zero for development branches
- Clean up unused branches
- Reset branches to match production when needed

### Security tips

- Use separate development credentials
- Rotate credentials regularly
- Keep production credentials isolated

## Start building

Pick the approach that fits your team. To automate branch creation for pull requests, see [Automate branching with GitHub Actions](/docs/guides/branching-github-actions).

<NeedHelp/>
