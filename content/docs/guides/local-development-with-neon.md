---
title: Local Development with Neon
subtitle: Learn how to efficiently develop applications locally with Neon
enableTableOfContents: true
updatedOn: '2024-11-05T00:00:00.000Z'
---

Setting up your development environment should be simple and fast. With Neon's modern approach to PostgreSQL, you get exactly that. Here's how to create the perfect setup for your applications.

## Two Ways to Develop

When working with Neon, you can choose between:

1. **Database Branching**: Our recommended approach
2. **Local PostgreSQL**: Traditional local setup

Let's explore both options to help you pick the right one.

## Database Branching

Imagine creating a complete copy of your database as easily as creating a Git branch. That's [database branching](https://neon.tech/docs/introduction/branching) with Neon – perfect for testing new features or updates without touching production data.

### Why Use It

- **Lightning-Fast Setup**: Create new environments in ~1 second
- **Zero Configuration**: No local PostgreSQL installation required
- **True Isolation**: Test changes without fear of breaking production
- **Cost-Efficient**: Pay only for unique data and actual compute usage
- **Team-Friendly**: Share database branches as easily as sharing Git branches
- **Auto-Scaling**: Resources scale to zero when you're not coding
- **Data Reset**: Fresh start? Reset your branch to match production in seconds

### Quick Start

1. Install the [**Neon CLI**](/docs/reference/neon-cli) by following the guide [here](/docs/reference/neon-cli#install).

2. **Connect Your Account**

   ```bash
   neonctl auth
   ```

3. **Create Your Branch**

   ```bash
   neonctl branches create --name dev/your-name

   # Get your connection details
   neonctl connection-string dev/your-name
   ```

   <Admonition type="note">
   You can also create branches through the Neon Web UI by navigating to your project and clicking the "Branches" tab. This provides a visual interface for branch management and configuration
   </Admonition>

4. **Set Up Environment**

   ```bash
   # .env.development
   DATABASE_URL='postgresql://[user]:[password]@[endpoint]/[dbname]'
   ```

5. Install Dependencies

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

6. **Connect Your App**

   ```javascript
   import { Pool, neon, neonConfig } from '@neondatabase/serverless';

   // Uncomment the following lines if you are on environments that do not support WebSocket, e.g, Node.js
   // import ws from 'ws';
   // neonConfig.webSocketConstructor = ws;

   export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
   export const sql = neon(process.env.DATABASE_URL);
   ```

### Tips and Tricks

- **Stay Organized**: Use prefixes like `dev/feature-auth` or `dev/alice`
- **Reset Data**: Start fresh when needed:
  ```bash
  neon branches reset dev/your-name
  ```
- **Feature Work**: Create dedicated branches:
  ```bash
  neon branches create --name dev/auth-system --parent main
  ```

## Local PostgreSQL

Sometimes you need to work offline or want full control over your database. Here's how to set up a local instance that works perfectly with Neon.

### Why Use It

- **Full Control**: Your own PostgreSQL instance
- **Offline Work**: Code without internet dependency
- **Fast Queries**: Zero network latency
- **Free Development**: Use your local resources

### Setup Steps

1. Install Dependencies

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

2. **Set Up via Docker Compose**

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

3. **Set Up Environment**

   ```bash
   # .env.development
   DATABASE_URL='postgresql://postgres:postgres@localhost:5432/main'
   ```

3. **Configure Connection**

   ```typescript
   import { neon, neonConfig, Pool } from '@neondatabase/serverless';
   import ws from 'ws';

   // Configuring Neon for local development
   if (process.env.NODE_ENV === 'development') {
     neonConfig.fetchEndpoint = (host) => {
       const [protocol, port] = host === 'db.localtest.me' ? ['http', 4444] : ['https', 443];
       return `${protocol}://${host}:${port}/sql`;
     };
     neonConfig.wsProxy = (host) => `${host}:4444/v1`;
     neonConfig.useSecureWebSocket = false;
     neonConfig.pipelineTLS = false;
     neonConfig.pipelineConnect = false;
     neonConfig.webSocketConstructor = ws;
   }

   const connectionString = process.env.DATABASE_URL;

   export const pool = new Pool({ connectionString });
   export const sql = neon(connectionString);
   ```

## Choosing Your Development Approach

Before diving into the comparison, it's important to understand why we recommend database branching as the optimal choice for most development workflows. Cloud-hosted branches offer several compelling advantages:

### Cost-Efficient Development

- **Minimal Storage Costs**: Branches are extremely cost-effective as you only pay for unique data changes
- **Smart Compute Usage**: Development happens on small, autosuspending computes (0.25 vCPU)
- **Free Plan Benefits**: Even the Free Plan includes 5 compute hours on dev branches
  - This translates to 20 hours of development time on a 0.25 vCPU compute
  - One compute hour at 1 vCPU equals four hours at 0.25 vCPU

### Developer-Friendly Features

- **Instant Deployment**: Branches are created in seconds, just like Git branches
- **Branch Reset**: Easily refresh your development data from the parent branch
- **Zero Maintenance**: No need to manage local PostgreSQL installations

| Feature             | Database Branching                           | Local PostgreSQL                     |
| ------------------- | -------------------------------------------- | ------------------------------------ |
| Setup Time          | ✅ Instant (~1 second)                       | ⏱️ Requires initial configuration    |
| Configuration       | ✅ Zero configuration needed                 | 🔧 Requires local setup              |
| Team Collaboration  | ✅ Easy branch sharing and management        | 🤝 Requires additional setup         |
| Cost Management     | ✅ Pay only for unique data and compute time | 💻 Local resources only              |
| Resource Scaling    | ✅ Scale to zero when not in use             | ❌ Always consuming resources        |
| Offline Development | ❌ Requires internet connection              | ✅ Works offline                     |
| Network Latency     | 🌐 Depends on connection                     | ✅ Zero latency                      |
| Production Parity   | ✅ Identical to production                   | 🔄 Requires additional configuration |

## When to Use Each Approach

### Choose Database Branching When:

- You want instant development environments
- You need efficient resource utilization
- You're working with a team

**Perfect for:**

- Most development workflows
- Team environments
- Rapid prototyping
- Feature development
- Testing database changes

### Consider Local PostgreSQL When:

- Offline development is crucial
- You need zero network latency
- You require complete database control
- You have specific local testing requirements

## Best Practices

### Environment Tips

- Keep development and production database branches separate
- Always Use clear branch naming
- Never commit credentials to a version control system

### Resource Tips

- Use auto-suspend for development branches
- Clean up unused branches
- Reset branches to match production when needed

### Security Tips

- Use separate development credentials
- Rotate credentials regularly
- Keep production credentials isolated

## Start Building

You're now ready to create a powerful development environment with Neon. Choose the approach that fits your team best and start building.

<NeedHelp/>
