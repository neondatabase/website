---
title: Neon Launchpad
subtitle: Launch an instant Neon Postgres database with zero configuration
enableTableOfContents: true
updatedOn: '2025-05-13T11:53:56.079Z'
---

Neon Launchpad enables instant provisioning of a Postgres database without configuration or account creation.

Built on Neon's serverless Postgres platform, it provides immediate database access for development and testing.

Access it now at [neon.new](https://neon.new/).

## Core features

The service provides the following capabilities:

- Instant database provisioning with immediate connection string availability
- Resource limits matching Neon's [free plan](https://neon.tech/docs/introduction/plans#free-plan) specifications
- 72-hour database lifespan if not claimed
- Option to claim databases with a unique claim ID and Neon account

## Access methods

### Browser access

1. Navigate to [https://neon.new](https://neon.new/)
2. Select `Try in your browser`, which redirects to `launchpad.neon.tech/db`
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

### Integration with development tools

Integrate into Vite-based projects using the [@neondatabase/vite-plugin-postgres](https://www.npmjs.com/package/@neondatabase/vite-plugin-postgres) plugin:

```javascript
import postgresPlugin from '@neondatabase/vite-plugin-postgres';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [postgresPlugin(), react()],
});
```

## Default configuration

The service uses the following default settings:

| Parameter        | Value        |
| ---------------- | ------------ |
| Provider         | AWS          |
| Region           | eu-central-1 |
| Postgres version | 17           |

Custom configurations are available through the CLI, for example:

```bash
npx neondb --provider azure --region azure-eastus2
```

## Use cases

Neon Launchpad is designed for scenarios requiring rapid database provisioning:

- Development and testing environments
- Evaluation of Neon's capabilities before committing to an account
- AI agent integration without authentication overhead
- Quick prototyping sessions

Note that provisioned databases expire after 72 hours unless claimed through the generated claim URL.

## Claiming a database

To persist a database beyond the 72-hour expiration period:

1. Access the claim URL provided during database creation
2. Sign in to an existing Neon account or create a new one
3. Follow the on-screen instructions to complete the claim process

The claim URL is available:

- On the Neon Launchpad interface where the connection string was displayed
- As a comment in environment files (e.g., `.env`) when using the CLI
