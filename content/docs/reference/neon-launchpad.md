---
title: Neon Launchpad
subtitle: Launch an instant Neon Postgres database with zero configuration
enableTableOfContents: true
updatedOn: '2025-07-01T14:33:45.947Z'
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
- Automatic database seeding with SQL scripts for schema and data initialization (via CLI or Vite plugin)

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

**CLI options:**

| Option           | Alias | Description                           | Default        |
| ---------------- | ----- | ------------------------------------- | -------------- |
| `--yes`          | `-y`  | Skip prompts and use defaults         |                |
| `--env <path>`   | `-e`  | Path to the .env file                 | `./.env`       |
| `--key <string>` | `-k`  | Env var for connection string         | `DATABASE_URL` |
| `--seed <path>`  | `-s`  | Path to SQL file to seed the database | not set        |
| `--help`         | `-h`  | Show help message                     |                |

**Examples:**

```bash
# Basic usage: creates a new Neon database and writes credentials to .env
npx neondb

# Seed the database with a SQL file after creation
npx neondb --seed ./init.sql

# Use a custom .env file and environment variable key
npx neondb --env ./my.env --key MY_DB_URL

# Skip all prompts and use defaults
npx neondb --yes
```

The CLI writes the connection string(s), claim URL, and expiration to the specified `.env` file and outputs them in the terminal. For advanced SDK/API usage, see the [Neondb CLI package on GitHub](https://github.com/neondatabase/neondb-cli/tree/main/packages/neondb).

### Integration with development tools

Add Postgres support to Vite projects using the [@neondatabase/vite-plugin-postgres](https://www.npmjs.com/package/@neondatabase/vite-plugin-postgres) plugin. The plugin provisions a database and injects credentials into your environment file if needed.

> The example below includes React, but you can use the Neon plugin with any Vite-compatible framework.

**Configuration options:**

| Option   | Type   | Description                      | Default        |
| -------- | ------ | -------------------------------- | -------------- |
| `env`    | string | Path to the .env file            | `.env`         |
| `envKey` | string | Name of the environment variable | `DATABASE_URL` |
| `seed`   | object | Seeding config (optional)        | not set        |

**`seed` object:**

| Property | Type   | Description                 |
| -------- | ------ | --------------------------- |
| `type`   | string | Only `sql-script` supported |
| `path`   | string | Path to SQL file to execute |

**Example config:**

```js
import postgresPlugin from '@neondatabase/vite-plugin-postgres';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    postgresPlugin({
      env: '.env.local', // Custom .env file (default: '.env')
      envKey: 'DATABASE_URL', // Env variable for connection string (default: 'DATABASE_URL')
      seed: {
        type: 'sql-script',
        path: './schema.sql', // SQL file to run after DB creation
      },
    }),
    react(),
  ],
});
```

**How the plugin works:**

1. When running `vite dev`, the plugin checks if the `envKey` (default: `DATABASE_URL`) exists in your environment (default: `.env`) file
2. If the environment variable exists, the plugin takes no action
3. If the environment variable is missing, the plugin:
   - Automatically creates a new Neon claimable database
   - Adds two connection strings to your environment file:
     - `DATABASE_URL` - Standard connection string
     - `DATABASE_URL_POOLER` - Connection pooler string
   - Includes the claimable URL as a comment in the environment file

The plugin is inactive during production builds (`vite build`) to prevent changes to environment files and database provisioning in production environments. If `seed` is configured, the specified SQL script is executed after database creation. If an error occurs (such as a missing or invalid SQL file), an error message will be displayed.

For more details, see the [Vite Plugin package on GitHub](https://github.com/neondatabase/neondb-cli/tree/main/packages/vite-plugin-postgres).

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

## Default configuration

The service uses the following default settings:

| Parameter        | Value        |
| ---------------- | ------------ |
| Provider         | AWS          |
| Region           | eu-central-1 |
| Postgres version | 17           |

## Technical implementation

The Neon Launchpad service is built on Neon's [claimable database integration](/docs/workflows/claimable-database-integration), which provides APIs for creating projects and generating transfer requests. This allows the service to provision databases immediately while deferring account creation until users choose to claim their database. You can build similar experiences in your own application using the [claimable database APIs](/docs/workflows/claimable-database-integration).

## Resources

- [Neondb CLI package on GitHub](https://github.com/neondatabase/neondb-cli/tree/main/packages/neondb)
- [Vite Plugin package on GitHub](https://github.com/neondatabase/neondb-cli/tree/main/packages/vite-plugin-postgres)
- Blog post: [Neon Launchpad: A Tool For Instant Postgres, No Login Needed](https://neon.com/blog/neon-launchpad)
