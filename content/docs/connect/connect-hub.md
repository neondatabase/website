---
title: Connect your app
subtitle: Connect your app to Lakebase Postgres, Object Storage, AI Gateway, Data API, and Managed Better Auth
summary: >-
  You connect your app to a Neon branch. Most apps start with Lakebase Postgres;
  many also use Object Storage, AI Gateway, the Data API, and Managed Better
  Auth. The same pattern applies to all services: pick a branch, get credentials,
  and use them. This guide walks through the complete connection workflow, from
  picking your branch to storing credentials securely and using each service in
  your app.
enableTableOfContents: true
---

You connect your app to a branch. Most apps start with Lakebase Postgres; many also use Object Storage, AI Gateway, the Data API, and Managed Better Auth. The same pattern applies to all: pick a branch, get credentials, and use them.

<Admonition type="tip" title="Just need a Postgres connection string?">
Open the Console Connect screen, copy it, done. Jump to [Use Postgres](#use-postgres) for the snippet.
</Admonition>

## Pick your branch

Credentials are branch-scoped. Your production app connects to your production branch (usually `main` or `production`); preview deployments connect to preview branches. Each branch has its own isolated credentials and data.

Preview branches get isolated credentials and data automatically, so you can test your app with real authentication workflows and real storage without touching production. See [Preview branches with isolated credentials](#preview-branches-with-isolated-credentials) below.

## Get your connection details

You can get connection details from the Console, CLI, or API.

### Console

In the Neon Console, select your project and click **Connect** on the Project Dashboard. The **Connect to your branch** modal shows:

- Branch selector (defaults to your default branch)
- Compute, database, and role selectors
- Tabs for **Postgres database**, **Storage**, **AI Gateway**, **Data API**, and **Auth**

![Connect to your branch modal](/docs/connect/connect_to_branch_modal.png)

Switch tabs to get credentials for each service. For Postgres, you can copy the connection string or individual environment variables (`PGHOST`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, `PGPORT`). For Object Storage, AI Gateway, Data API, and Auth, copy the service-specific connection details.

### CLI

For Postgres credentials, use [`neon connection-string`](/docs/cli/connection-string):

```bash
neon connection-string mybranch --database-name mydb --role-name myrole
```

To pull all credentials for a branch (including Object Storage, Data API, Auth, and Functions if declared in `neon.ts`), use [`neon env pull`](/docs/cli/env):

```bash
neon env pull --branch mybranch --file .env.local
```

By default, `neon env pull` writes `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, and `NEON_BRANCH`. With a `neon.ts` file declaring services, it also writes credentials for each service. Use `--service` to pull only specific services:

```bash
neon env pull --service postgres --service object-storage
```

### API

For Postgres, fetch the connection string with [`GET /api/v2/projects/{project_id}/connection_uri`](/docs/manage/branches#connect-to-a-branch):

```bash shouldWrap
curl "https://console.neon.tech/api/v2/projects/{project_id}/connection_uri?branch_id={branch_id}&database_name={database_name}&role_name={role_name}" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

For Object Storage credentials, use [`POST /api/v2/projects/{project_id}/branches/{branch_id}/credentials`](/docs/storage/authentication#creating-a-credential) with `storage:read` and `storage:write` scopes. For Data API and Auth, see [Managing the Data API](/docs/data-api/manage) and [Manage Auth via the API](/docs/auth/guides/manage-auth-api).

## Store credentials

Store credentials in `.env` files for local development, in your CI secrets manager for CI/CD workflows, or let Neon Functions auto-inject them if you are deploying to Neon Functions.

### Local development

Use [`neon env pull`](/docs/cli/env) to write credentials to `.env.local` (or `.env`):

```bash
neon env pull --file .env.local
```

This writes `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEON_BRANCH`, and (if you have a `neon.ts` declaring services) credentials for Object Storage (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION`), Data API, and Auth.

### Production and CI

For production deployments, store credentials in your secrets manager (AWS Secrets Manager, Vercel environment variables, GitHub Secrets, etc.). Fetch credentials from the Console, CLI, or API, then set them in your platform's secrets configuration.

### Neon Functions

Neon Functions auto-injects credentials for declared services. If you declare Object Storage buckets in `neon.ts`, the `AWS_*` credentials are injected automatically. No manual setup required. See [Neon Functions environment variables](/docs/compute/functions/environment-variables).

## Use each service

Each service has its own connection pattern. Below are minimal snippets to get started; follow the links for full product guides.

### Use Postgres

Lakebase Postgres is Neon's serverless Postgres. Connect with any Postgres driver or the Neon serverless driver for edge runtimes.

<CodeTabs labels={["Serverless driver", "Node.js (pg)", "psql"]}>

```typescript shouldWrap
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const rows = await sql`SELECT * FROM users`;
```

```javascript shouldWrap
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const { rows } = await pool.query('SELECT * FROM users');
```

```bash shouldWrap
psql "$DATABASE_URL"
```

</CodeTabs>

**Learn more:**

- [Connect to Neon](/docs/connect/connect-intro) - connection methods, drivers, and tools
- [Connect from any app](/docs/connect/connect-from-any-app) - detailed connection string reference

<Admonition type="note" title="Credentials access and the object model">
This guide focuses on connecting your app. For deeper background on how credentials work in Neon and how they map to the object hierarchy (projects, branches, databases, roles), see [Credentials and access](/docs/concepts/credentials-access) and [The object model](/docs/concepts/the-object-model).
</Admonition>

### Use Object Storage

Neon Object Storage is S3-compatible storage. Use the Files SDK or any AWS S3 SDK.

<CodeTabs labels={["Files SDK", "AWS SDK"]}>

```typescript shouldWrap
import { S3Client } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});
```

```python shouldWrap
import boto3, os

client = boto3.client(
    's3',
    region_name=os.environ['AWS_REGION'],
    endpoint_url=os.environ['AWS_ENDPOINT_URL_S3'],
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
)
```

</CodeTabs>

**Environment variables:**

- `AWS_ACCESS_KEY_ID` - S3 Access Key ID
- `AWS_SECRET_ACCESS_KEY` - S3 Secret Access Key
- `AWS_ENDPOINT_URL_S3` - Branch S3 endpoint URL
- `AWS_REGION` - Storage region (for example, `us-east-2`)

**Learn more:** [Neon Object Storage overview](/docs/storage/overview)

### Use AI Gateway

AI Gateway credentials are branch-scoped and work for the anchor branch and its descendants. They use the same scoped-credential system as Object Storage.

```typescript shouldWrap
import OpenAI from 'openai';
import 'dotenv/config';

const client = new OpenAI({
  apiKey: process.env.NEON_AI_GATEWAY_TOKEN,
  baseURL: `${process.env.NEON_AI_GATEWAY_BASE_URL}/v1`,
});
const response = await client.chat.completions.create({
  model: 'gpt-5-mini',
  messages: [{ role: 'user', content: 'Hello!' }],
});
console.log(response.choices[0].message.content);
```

`NEON_AI_GATEWAY_BASE_URL` is the bare branch host, such as `https://<branch-host>`. Append the dialect path, such as `/v1` for the OpenAI-compatible chat completions endpoint.

**Environment variables:**

- `NEON_AI_GATEWAY_BASE_URL` - Bare AI Gateway branch host
- `NEON_AI_GATEWAY_TOKEN` - AI Gateway bearer token

**Learn more:** [Get started with AI Gateway](/docs/ai-gateway/get-started)

### Use the Data API

The Neon Data API exposes your Postgres database as a REST endpoint secured by JWT authentication and Row-Level Security. Query tables without a connection pool or SQL driver.

Fetch the Data API URL from the Console or CLI (`neon data-api get`). For client-side code, use a framework-specific prefix (`VITE_` for Vite, `NEXT_PUBLIC_` for Next.js):

```bash shouldWrap
curl -X GET 'https://YOUR_BRANCH.apirest.REGION.aws.neon.tech/DATABASE/rest/v1/posts?select=*' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json'
```

**Environment variable (example for Vite-based frameworks):**

- `VITE_NEON_DATA_API_URL` - Data API endpoint URL (client-side)

For server-side usage, the Data API URL is the same; use your authentication provider to get the JWT token.

**Learn more:** [Data API overview](/docs/data-api/overview)

### Use Managed Better Auth

Managed Better Auth is Neon's managed authentication service. It stores users, sessions, and OAuth configuration in your database and branches with your data.

<CodeTabs labels={["React (client)", "Next.js (server)"]}>

```typescript shouldWrap
import { createAuthClient } from '@neondatabase/neon-js/auth';

export const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL);
```

```typescript shouldWrap
import { createNeonAuth } from '@neondatabase/auth/next/server';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
});
```

</CodeTabs>

**Environment variables:**

- `NEON_AUTH_BASE_URL` - Auth API base URL (server-side)
- `NEON_AUTH_COOKIE_SECRET` - Cookie signing secret (server-side)
- `VITE_NEON_AUTH_URL` - Auth API URL (client-side, use framework-specific prefix)

**Learn more:** [Managed Better Auth overview](/docs/auth/overview)

## Preview branches with isolated credentials

Preview branches get isolated credentials and data automatically. When you create a preview branch from your main branch, the preview branch gets its own credentials that are valid only for that branch and its descendants. This means you can test authentication workflows, storage uploads, and data changes in a preview environment without affecting production.

Credentials are branch-scoped: a credential created on a branch is valid for that branch and any branches descended from it. It's not valid for branches outside that lineage. See [How branch binding works](/docs/storage/authentication#how-branch-binding-works) for details.

## Rotate or revoke credentials

To rotate a Postgres password, generate a new one in the Console or CLI and update your environment variables. For Object Storage credentials, create a new credential, update your app, then revoke the old one. See [Revoking credentials](/docs/storage/authentication#revoking-credentials) for API details.

Credential rotation workflows for Data API and Auth are similar: create a new credential or reset the password, update your app, then revoke the old one.

## Where to go next

- [Credentials and access](/docs/concepts/credentials-access) - how credentials work in Neon
- [The object model](/docs/concepts/the-object-model) - projects, branches, databases, and roles
- [Connect to Neon](/docs/connect/connect-intro) - connection methods, drivers, and tools
- [Object Storage overview](/docs/storage/overview) - buckets, objects, and authentication
- [Get started with AI Gateway](/docs/ai-gateway/get-started) - unified access to AI models
- [Data API overview](/docs/data-api/overview) - REST API for Postgres
- [Managed Better Auth overview](/docs/auth/overview) - managed authentication service

<NeedHelp/>
