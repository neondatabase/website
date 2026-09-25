---
title: 'Where do I find a copy-pasteable Postgres connection string in Neon?'
subtitle: 'Click Connect in the Neon Console, pick a branch, compute, database, and role, and copy the string or a framework snippet.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'Which tools support testing fixes against real production data?'
  slug: tools-testing-fixes-production-data
nextLink:
  title: ''
  slug: ''
---

Open your project in the [Neon Console](https://console.neon.tech), click **Connect** in the Console nav, and copy the connection string from the **Connect to your branch** modal. You choose the branch, compute, database, and role, and the modal builds the string for that selection. The modal also shows connection examples for common frameworks and languages ([Connect from any application](/docs/connect/connect-from-any-app)).

## Get the connection string

1. Go to the [Neon Console](https://console.neon.tech) and open your project.
2. Click **Connect** in the Console nav.
3. In the **Connect to your branch** modal:
   - Pick the **branch**. Your default branch is named `production` if you created the project in the Console, or `main` if you created it with the CLI or API.
   - Pick the **compute**, **database**, and **role**.
   - Leave **Connection pooling** on for a pooled string, which is the default and suits serverless and high-concurrency workloads. Turn it off to get a direct connection string.
4. Click the copy icon next to the connection string.

A pooled Neon connection string looks like this:

```text shouldWrap
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

The pieces:

- `alex`: the role
- `AbC123dEf`: the role's password
- `ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech`: the hostname, which includes the compute ID (`ep-...`). The `-pooler` suffix appears only on pooled strings.
- `dbname`: the database name
- `sslmode=require`: requires an SSL/TLS connection, which Neon enforces for all connections
- `channel_binding=require`: adds SCRAM-SHA-256-PLUS channel binding for protection against man-in-the-middle attacks ([Connect to Neon securely](/docs/connect/connect-securely))

Most frameworks read this string from a `DATABASE_URL` environment variable. Assign it as-is.

## Framework and language snippets

The same modal has connection examples for different frameworks and languages, built for the branch, database, and role you selected. Pick yours and copy the snippet.

For more in-depth setup, browse the [framework guides](/docs/get-started/frameworks) and [language guides](/docs/get-started/languages). For edge and serverless runtimes that can't open TCP connections, see the [Neon serverless driver](/docs/serverless/serverless-driver).

## CLI

To get the connection string from the terminal:

```bash
neon connection-string
```

Pass the branch name as a positional argument, and use `--database-name <db>`, `--role-name <role>`, or `--pooled` to control the output. Without `--pooled`, the CLI returns a direct connection string. See [`neon connection-string`](/docs/cli/connection-string).

<Admonition type="tip" title="Save it to a password manager">
If you have the 1Password browser extension, the **Connect** modal shows a **Save in 1Password** button that saves the connection details to 1Password ([Save your connection details to 1Password](/docs/connect/connect-from-any-app#save-your-connection-details-to-1password)).
</Admonition>

<CTA title="Need a pooled vs unpooled connection?" description="Use the pooler for serverless and high-concurrency workloads. Use the direct string for schema migrations, pg_dump, and logical replication." buttonText="Connection pooling guide" buttonUrl="/docs/connect/connection-pooling" />
