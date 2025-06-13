---
title: Neon Launchpad
subtitle: Launch an instant Neon Postgres database with zero configuration
enableTableOfContents: true
updatedOn: '2025-06-05T09:15:50.314Z'
---

Neon Launchpad enables instant provisioning of a Postgres database without configuration or account creation.

Built on Neon's serverless Postgres platform, it provides immediate database access for development and testing.

Access it now at [neon.new](https://neon.new/).

## Core features

The service provides the following capabilities:

- Instant database provisioning with immediate connection string availability
- Resource limits matching Neon's [free plan](/docs/introduction/plans#free-plan) specifications
- 72-hour database lifespan if not claimed
- Option to claim databases with a unique claim ID and Neon account

## Access methods

### Browser access

1. Navigate to [https://neon.new](https://neon.new/)
2. Select `Try in your browser`, which redirects to [https://neon.new/db](https://neon.new/db)
3. Receive an automatically generated connection string
4. Save the provided `Claim URL` to add this database to a Neon account later, or claim now

### Command-line interface

Execute with your preferred package manager:

<Tabs labels={["npx", "yarn", "pnpm", "bunx", "deno"]}>

<TabItem>
```bash
npx neondb
```
</TabItem>
<TabItem>
```bash
yarn dlx neondb
```
</TabItem>
<TabItem>
```bash
pnpm dlx neondb
```
</TabItem>
<TabItem>
```bash
bunx neondb
```
</TabItem>
<TabItem>
```bash
deno run -A neondb
```
</TabItem>
</Tabs>

> The source code for the CLI is open source. You can find it on GitHub: [neondb-cli](https://github.com/neondatabase/neondb-cli)

### Integration with development tools

Add Postgres support to Vite projects using the [@neondatabase/vite-plugin-postgres](https://www.npmjs.com/package/@neondatabase/vite-plugin-postgres) plugin:

```javascript
import postgresPlugin from '@neondatabase/vite-plugin-postgres';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    postgresPlugin({
      env: '.env', // Path to environment file
      envKey: 'DATABASE_URL', // Environment variable to check
    }),
    react(),
  ],
});
```

**How the plugin works:**

1. When running `vite dev` or `vite build`, the plugin checks if the `envKey` (default: `DATABASE_URL`) exists in your environment (default: `.env`) file
2. If the environment variable exists, the plugin takes no action
3. If the environment variable is missing, the plugin:
   - Automatically creates a new Neon claimable database
   - Adds two connection strings to your environment file:
     - `DATABASE_URL` - Standard connection string
     - `DATABASE_URL_POOLER` - Connection pooler string
   - Includes the claimable URL as a comment in the environment file

## Default configuration

The service uses the following default settings:

| Parameter        | Value        |
| ---------------- | ------------ |
| Provider         | AWS          |
| Region           | eu-central-1 |
| Postgres version | 17           |

## Claiming a database

To persist a database beyond the 72-hour expiration period:

1. Access the claim URL provided during database creation
2. Sign in to an existing Neon account or create a new one
3. Follow the on-screen instructions to complete the claim process

The claim URL is available:

- On the Neon Launchpad interface where the connection string was displayed
- As a comment in environment files (e.g., `.env`) when using the CLI

## Use cases

Neon Launchpad is designed for scenarios requiring rapid database provisioning:

- Development and testing environments
- Evaluation of Neon's capabilities before committing to an account
- AI agent integration without authentication overhead
- Quick prototyping sessions

Note that provisioned databases expire after 72 hours unless claimed as described in the previous section.

## Technical implementation

The Neon Launchpad service is built on Neon's [claimable database integration](/docs/workflows/claimable-database-integration), which provides APIs for creating projects and generating transfer requests. This allows the service to provision databases immediately while deferring account creation until users choose to claim their database. You can build similar experiences to Neon Launchpad in your own application using the APIs documented in the integration guide.
