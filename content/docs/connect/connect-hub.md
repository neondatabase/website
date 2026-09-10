---
title: Connect your app
subtitle: Connect your app to Lakebase Postgres and other backend services
summary: >-
  You connect your app to a branch. A branch can provide Lakebase Postgres,
  Object Storage, Managed Better Auth, and AI Gateway. Connecting to any of them
  follows the same steps: pick a branch, get its credentials, and use them in
  your app. This guide walks through the complete connection workflow, from
  picking your branch to storing credentials securely and using each service in
  your app.
enableTableOfContents: true
---

For all backend services, you connect your app to a particular branch. Each branch can serve whichever services you have enabled: Lakebase Postgres, Object Storage, Managed Better Auth, and AI Gateway.

<Admonition type="tip" title="Just need a Postgres connection string?">
If you only need a Postgres connection string, click **Connect** on your project dashboard and copy it. See [Use each service](#use-each-service) for details.
</Admonition>

<Steps>

## Choose your branch

Credentials are branch-scoped. Each branch has its own isolated credentials and data, whether it is your default branch (for example, `main`) or a child branch you use for development, testing, or preview deployments.

A child branch is a copy-on-write clone of its parent, so it starts with isolated credentials and its own copy of the data. You can test your app with real authentication workflows and real storage without touching your default branch. You can automate previews using [GitHub Actions](/docs/guides/branching-github-actions) or the [Vercel integration](/docs/guides/neon-managed-vercel-integration), where a child branch is created for each preview automatically. See [Develop with preview branches](#develop-with-preview-branches) below.

## Get your connection details

You can get connection details from the Console, CLI, or API.

<Tabs labels={["Console", "CLI", "API"]}>
<TabItem>

In the Neon Console, select your project and click **Connect** on the Project Dashboard to open the **Connect to your branch** modal.

![Connect to your branch modal](/docs/connect/connect_to_branch_modal.png)

</TabItem>
<TabItem>

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

</TabItem>
<TabItem>

For Postgres, fetch the connection string with [`GET /api/v2/projects/{project_id}/connection_uri`](/docs/manage/branches#connect-to-a-branch):

```bash shouldWrap
curl "https://console.neon.tech/api/v2/projects/{project_id}/connection_uri?branch_id={branch_id}&database_name={database_name}&role_name={role_name}" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

For Object Storage credentials, use [`POST /api/v2/projects/{project_id}/branches/{branch_id}/credentials`](/docs/storage/authentication#creating-a-credential) with `storage:read` and `storage:write` scopes. For Data API and Auth, see [Managing the Data API](/docs/data-api/manage) and [Manage Auth via the API](/docs/auth/guides/manage-auth-api).

</TabItem>
</Tabs>

## Store your credentials

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

Use the credentials for your selected branch with each enabled service.

<Tabs labels={["Postgres", "Object Storage", "AI Gateway", "Auth"]}>
<TabItem>

Lakebase Postgres is serverless Postgres that you can access with any Postgres driver or the Neon serverless driver.

You can also reach the same Postgres data over HTTP through the [Neon Data API](/docs/data-api/overview). It provides a PostgREST-compatible interface for clients that cannot use a Postgres driver.

```typescript shouldWrap
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const rows = await sql`SELECT * FROM users`;
```

**Learn more:** [Connect from any app](/docs/connect/connect-from-any-app)

<Admonition type="note" title="Credentials access and the object model">
This guide focuses on connecting your app. For deeper background on how credentials work in Neon and how they map to the object hierarchy (projects, branches, databases, roles), see [Credentials and access](/docs/concepts/credentials-access) and [The object model](/docs/concepts/the-object-model).
</Admonition>

</TabItem>
<TabItem>

Neon Object Storage is S3-compatible storage. Configure an AWS S3 SDK with the branch-specific `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, and `AWS_REGION` environment variables.

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

**Learn more:** [Neon Object Storage overview](/docs/storage/overview)

</TabItem>
<TabItem>

AI Gateway uses a branch-scoped credential. Set `NEON_AI_GATEWAY_BASE_URL` to the branch host, append a dialect path such as `/v1`, and authenticate with `NEON_AI_GATEWAY_TOKEN`.

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

**Learn more:** [AI Gateway overview](/docs/ai-gateway/overview)

</TabItem>
<TabItem>

Managed Better Auth stores authentication data in the `neon_auth` schema and remains branch-aware as your database branches.

```typescript shouldWrap
import { createAuthClient } from '@neondatabase/neon-js/auth';

export const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL);
```

**Learn more:** [Managed Better Auth overview](/docs/auth/overview)

</TabItem>
</Tabs>

## Develop with preview branches

When you create a child branch from your default branch, the child branch gets its own credentials that are valid only for that branch and its descendants. This means you can test authentication workflows, storage uploads, and data changes in a development, test, or preview environment without affecting your default branch.

Credentials are branch-scoped: a credential created on a branch is valid for that branch and any branches descended from it. It's not valid for branches outside that lineage. See [How branch binding works](/docs/storage/authentication#how-branch-binding-works) for details.

</Steps>

## Rotate or revoke

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
