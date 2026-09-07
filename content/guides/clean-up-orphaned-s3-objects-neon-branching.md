---
title: 'Clean up orphaned S3 objects with Neon Object Storage branching'
subtitle: 'Practice a real orphan-cleanup job on a Neon branch before running it in production.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-08-26T00:00:00.000Z'
updatedOn: '2026-09-02T15:10:53.712Z'
---

If you're building an application that handles user files (avatars, invoices, PDF exports, or chat attachments), you run into the same two-part architecture every time: the files live in object storage, and the metadata lives in Postgres. A row in an `attachments` table stores an `object_key`, and that key points to a file in an S3 bucket.

This pairing works well until something gets deleted. Postgres and S3 don't share a transaction, so every delete is really two deletes: one SQL statement and one API call. When only one of them runs, the two systems drift out of sync.

If you've worked on an app with file uploads for long enough, you've likely shipped at least one of these bugs:

1. **Account deletion timeout:** A user deletes their account. The attachment rows are removed, but the S3 cleanup call times out partway through.
2. **Retention purge:** A nightly job hard-deletes soft-deleted rows and never calls S3.
3. **Crash between steps:** Your API deletes the row first, then crashes before `DeleteObject` runs.
4. **Failed insert:** An upload writes the file to S3, then the database insert fails or is canceled.
5. **Bulk admin script:** An operator deletes rows in `psql` and stops before removing the matching objects.

In every case, the row is deleted but the file remains. That leftover file is an **orphaned object**: nothing in your database references it, but you still pay to store it. A few orphans are harmless. Months of account deletions, purges, and failed uploads later, orphaned bytes turn into a real line item on your storage bill.

The bill is only part of it. If your app handles personal data, a deletion feature isn't finished until the bytes are actually deleted. Under GDPR and similar privacy laws, an erasure request isn't satisfied while the user's files still sit in your bucket, no matter what your database says. Leftover files from deleted accounts are exactly the kind of finding a data audit surfaces, and they're invisible unless you go looking. Drift cuts the other way too: when the S3 delete succeeds but the row survives, your users hit broken downloads instead.

The standard fix is a vacuum job: list every object in the bucket, load every `object_key` still referenced by a row, and delete the difference. You can write that job in a few lines of code, but you can't safely run it against production. A `--dry-run` flag lets you review the candidate keys, but it cannot validate real delete calls or protect you from a mistake in how those candidates are interpreted. Running the real thing against production means trusting an untested script with live user files. That leaves you with two unappealing options: run an untested cleanup against production, or leave the drift in place and keep paying for it.

Neon removes that trade-off with [Neon Object Storage](/docs/storage/overview). Buckets [branch with your database](/docs/storage/objects#object-branching), so creating a branch gives you an isolated copy of your data in both systems: the Postgres rows and the S3 objects. You can run the real vacuum, actual `DeleteObject` calls and all, against the branch, verify that rows and objects still agree, and only then run the same script against production with the safeguards described below.

<Admonition type="info" title="Beta">
Neon Object Storage is in beta and currently available in AWS US East (Ohio) (`aws-us-east-2`) and AWS Europe (Frankfurt) (`aws-eu-central-1`). Support is expanding toward all regions. Create your project in one of these regions to follow along.
</Admonition>

In this tutorial, you'll build a small demo app that simulates the drift problem, then write a vacuum job and test it on a Neon branch before promoting it to production. The workflow is identical for your own application: declare the bucket, measure drift with the checker, run the vacuum on a branch, and promote.

<CopyPrompt
  src="/prompts/clean-up-orphaned-s3-objects-neon-branching-prompt.md"
  description="Use this prompt to customize the guide and build it with your AI agent."
  buttonText="Copy prompt"
/>

## Prerequisites

Before starting, make sure you have:

1. **Node.js**: Version 22 or later. Download from [nodejs.org](https://nodejs.org/).
2. **Neon account**: Sign up for an account at [console.neon.tech](https://console.neon.tech/signup).
3. **Neon CLI**: Installed globally (`npm i -g neon@latest`) and authenticated (`neon auth`). See the [Neon CLI Quickstart](/docs/cli/quickstart) for details.

<Steps>

## Set up the project and bucket

Create a directory for the project and initialize a workspace:

```bash
mkdir postgres-s3-drift-demo && cd postgres-s3-drift-demo
npm init -y
npm pkg set type=module
```

Run the Neon CLI initialization command:

```bash
neon init
```

Use the default setup options for all prompts: this enables AI skills, configures the MCP server, and installs the VS Code extension. These ensure AI agents such as Claude Code and Cursor can assist you in building and working with Neon.

During initialization, **Neon Platform** and **Postgres** skills are installed automatically. You'll also need the **Neon Object Storage** skill so AI agents have the context to help you build and manage your S3 bucket. Install it with the following command:

```bash
npx skills add neondatabase/agent-skills --skill neon-object-storage
```

Link your local workspace to a Neon project:

```bash
neon link
```

You'll be prompted to select your organization, then a project. **Create a new project** named `postgres-s3-drift-demo` (or pick an existing one). Next, select a region. Choose **AWS US East (Ohio)** (`aws-us-east-2`) or **AWS Europe (Frankfurt)** (`aws-eu-central-1`); this guide uses US East (Ohio). Neon Object Storage is currently available in these regions during beta. Support is expanding toward all regions. When asked which Neon services you require, select **Object Storage**. Finally, confirm that you want to manage your setup as code, which generates a `neon.ts` file in your project root:

```text
$ neon link
✔ Which organization would you like to link? › MyOrg (org-example-12345678)
✔ Which project would you like to link? › ＋ Create new project…
✔ Name for the new project: … postgres-s3-drift-demo
✔ Which region should the new project run in? › AWS US East 2 (Ohio) (aws-us-east-2)
Created project cool-darkness-12345678 ("postgres-s3-drift-demo") in aws-us-east-2.
Linked ~/postgres-s3-drift-demo/.neon:
  orgId:     org-example-12345678
  projectId: cool-darkness-12345678
  branch:    main

✔ Manage this project's Neon setup as code? Adds a neon.ts you can edit and apply with `neon config apply`. … yes
✔ Which Neon services should neon.ts declare? (space to toggle, enter to confirm) › Object Storage
```

The `neon link` command also creates a `.env.local` file with your project's variables.

Install the dependencies for the scripts in this guide:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner postgres dotenv
npm install -D tsx @types/node
```

This installs the AWS SDK for S3, the Postgres client, and `dotenv` for loading environment variables. The `tsx` package allows you to run TypeScript files directly without a separate compilation step.

TypeScript needs a `tsconfig.json` for the linter to resolve types correctly. Create it in your project root:

```json filename="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "esnext",
    "types": ["node"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

The `neon link` command generated a `neon.ts` file in your project root. Replace its contents with the following configuration, which creates a bucket named `uploads` and sets a 7-day TTL on new branches, so any branches created by `neon checkout` are cleaned up automatically if you forget to delete them:

```typescript filename="neon.ts"
import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  preview: {
    buckets: {
      uploads: {}
    },
  },
  branch: (branch) => {
    if (branch.isDefault) { return {}; }
    if (!branch.exists) { return { ttl: "7d" }; }
    return {};
  },
});

```

Apply the configuration by running:

```bash
neon deploy
```

The `uploads` bucket is branch-scoped, so every Neon branch gets its own copy of the bucket. This is what makes it safe to run a real vacuum later.

Your `.env.local` file should contain the Postgres and S3 credentials:

```text filename=".env.local"
NEON_BRANCH=main
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require"
DATABASE_URL_UNPOOLED="postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require"
AWS_ACCESS_KEY_ID=nak_live_...
AWS_SECRET_ACCESS_KEY=nsk_live_...
AWS_ENDPOINT_URL_S3=https://br-cool-darkness-a1b2c3d4.storage.c-2.us-east-2.aws.neon.tech
AWS_REGION=us-east-2
```

## Create the Postgres and S3 clients

Create `lib/db.ts` for the Postgres client. This will be used by all the scripts to connect to the database:

```typescript filename="lib/db.ts"
import { config as loadEnv } from 'dotenv';
loadEnv({ path: ['.env.local'] });

import postgres from 'postgres';

export const sql = postgres(process.env.DATABASE_URL!);
```

Create `lib/s3.ts` for the S3 client. This will be used by all the scripts to interact with the S3 bucket:

```typescript filename="lib/s3.ts"
import { config as loadEnv } from 'dotenv';
loadEnv({ path: ['.env.local'] });

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const BUCKET = 'uploads';

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
  requestChecksumCalculation: 'WHEN_REQUIRED',
});

export function presignDownload(key: string) {
  return getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: key }), {
    expiresIn: 300,
  });
}
```

The `requestChecksumCalculation: 'WHEN_REQUIRED'` setting works around a checksum behavior change in recent AWS SDK versions that breaks presigned uploads. See [Get started with Object Storage](/docs/storage/get-started#configure-your-client) for more details.

## Seed the demo data and create orphans

You'll simulate the drift problem with a table named `attachments` and a bucket named `uploads`. Each row represents one uploaded file: the `object_key` column links it to its object in the bucket, and `content_type` and `size_bytes` store the file's metadata. The `deleted_at` column supports soft deletes; the purge script later hard-deletes soft-deleted rows without removing their S3 objects, which creates the drift.

<Admonition type="note" title="Bring your own data">
If you are following along with your own application, you can skip the seeding steps. This guide seeds a fresh bucket and table from scratch. In a real-world scenario, your bucket and `attachments` table already exist, and you would branch directly from that drifted state.
</Admonition>

Create a script `scripts/setup.ts` that seeds the `attachments` table with twelve rows and uploads twelve objects to the bucket. The last three are soft-deleted, simulating accounts sitting in the trash waiting for retention cleanup. The script first empties the bucket and drops the table, so re-runs are deterministic. You'll reuse this file later:

```typescript filename="scripts/setup.ts"
import { DeleteObjectsCommand, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';
import { sql } from '../lib/db';
import { BUCKET, s3 } from '../lib/s3';

const users = Array.from(
  { length: 12 },
  (_, i) => `user-${String(i + 1).padStart(2, '0')}@example.com`,
);

const existing = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET }));
if (existing.Contents?.length) {
  await s3.send(
    new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: { Objects: existing.Contents.map((o) => ({ Key: o.Key! })) },
    }),
  );
}

await sql`DROP TABLE IF EXISTS attachments`;
await sql`
  CREATE TABLE attachments (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email   text NOT NULL,
    object_key   text NOT NULL UNIQUE,
    content_type text NOT NULL,
    size_bytes   bigint NOT NULL,
    deleted_at   timestamptz,
    created_at   timestamptz NOT NULL DEFAULT now()
  )
`;

for (const [i, email] of users.entries()) {
  const key = `avatars/${email}.png`;
  const body = Buffer.from(`fake-png-bytes-for-${email}`);

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: 'image/png',
    }),
  );

  await sql`
    INSERT INTO attachments (user_email, object_key, content_type, size_bytes, deleted_at)
    VALUES (${email}, ${key}, 'image/png', ${body.length}, ${i >= 9 ? new Date() : null})
  `;
}

console.log(`Seeded ${users.length} attachments (3 soft-deleted)`);
await sql.end();
```

Run the setup script to seed the demo data:

```bash
npx tsx scripts/setup.ts
```

Now simulate the business bug: a retention purge that only deletes rows. This is the path many apps accidentally ship when object cleanup lives in a separate job, or when the SQL cascade is the only step that actually runs. Create `scripts/purge-soft-deleted-rows-only.ts`:

```typescript filename="scripts/purge-soft-deleted-rows-only.ts"
import { sql } from '../lib/db';

const purged = await sql`
  DELETE FROM attachments
  WHERE deleted_at IS NOT NULL
  RETURNING object_key
`;

console.log(`Purged ${purged.length} attachment rows from Postgres`);
console.log('Object keys that should have been deleted from S3:');
for (const row of purged) {
  console.log(`  ${row.object_key}`);
}

await sql.end();
```

Run the purge script to simulate the drift:

```bash
npx tsx scripts/purge-soft-deleted-rows-only.ts
```

You should see output like this:

```text
Purged 3 attachment rows from Postgres
Object keys that should have been deleted from S3:
  avatars/user-10@example.com.png
  avatars/user-11@example.com.png
  avatars/user-12@example.com.png
```

Three rows were removed, but the objects remain in the bucket. That is the drift you will clean up with the vacuum job.

## Build a consistency checker

Before you delete anything, you need a way to measure drift. The checker lists every object in the bucket, selects every `object_key` from `attachments`, and diffs the two sets:

```typescript filename="scripts/check-consistency.ts"
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { sql } from '../lib/db';
import { BUCKET, s3 } from '../lib/s3';

async function listAllKeys(): Promise<Set<string>> {
  const keys = new Set<string>();
  let token: string | undefined;

  do {
    const res = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET, ContinuationToken: token }),
    );
    for (const obj of res.Contents ?? []) keys.add(obj.Key!);
    token = res.NextContinuationToken;
  } while (token);

  return keys;
}

const objectKeys = await listAllKeys();
const rows = await sql`SELECT object_key FROM attachments`;
const rowKeys = new Set(rows.map((r) => r.object_key));

const dangling = [...rowKeys].filter((k) => !objectKeys.has(k));
const orphans = [...objectKeys].filter((k) => !rowKeys.has(k));

console.log(`rows in attachments:   ${rowKeys.size}`);
console.log(`objects in ${BUCKET}:      ${objectKeys.size}`);
console.log(`dangling rows:         ${dangling.length}`);
console.log(`orphaned objects:      ${orphans.length}`);

if (dangling.length)
  console.log('\nFirst dangling rows:\n  ' + dangling.slice(0, 5).join('\n  '));
if (orphans.length)
  console.log('\nFirst orphaned objects:\n  ' + orphans.slice(0, 5).join('\n  '));

await sql.end();
process.exit(dangling.length || orphans.length ? 1 : 0);
```

A **dangling row** points to an object that no longer exists, which means broken downloads for your users. An **orphaned object** is the opposite: the object exists, but no row references it, so you're paying to store bytes your app can't see.

Run the checker to see the drift you just created:

```bash
npx tsx scripts/check-consistency.ts
```

You should see output like this:

```text
rows in attachments:   9
objects in uploads:    12
dangling rows:         0
orphaned objects:      3

First orphaned objects:
  avatars/user-10@example.com.png
  avatars/user-11@example.com.png
  avatars/user-12@example.com.png
```

You now have a reproducible drift scenario: three orphaned objects and zero dangling rows. The checker exits with a non-zero status code, which makes it a good fit for CI or a cron job to alert the team when drift occurs.

## Write the vacuum job

The vacuum lists bucket keys, loads every `object_key` still referenced by a row, and deletes the difference. It is idempotent: if it crashes partway through, re-running it converges to the same final state instead of compounding the problem.

```typescript filename="scripts/vacuum-orphans.ts"
import { DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { sql } from '../lib/db';
import { BUCKET, s3 } from '../lib/s3';

const dryRun = process.argv.includes('--dry-run');

async function listAllKeys(): Promise<string[]> {
  const keys: string[] = [];
  let token: string | undefined;

  do {
    const res = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET, ContinuationToken: token }),
    );
    for (const obj of res.Contents ?? []) keys.push(obj.Key!);
    token = res.NextContinuationToken;
  } while (token);

  return keys;
}

const objectKeys = await listAllKeys();
const rows = await sql`SELECT object_key FROM attachments`;
const rowKeys = new Set(rows.map((r) => r.object_key as string));
const orphans = objectKeys.filter((k) => !rowKeys.has(k));

console.log(`Found ${orphans.length} orphaned object(s)`);
if (orphans.length === 0) {
  await sql.end();
  process.exit(0);
}

for (const key of orphans) {
  if (dryRun) {
    console.log(`[dry-run] would delete ${key}`);
    continue;
  }

  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  console.log(`deleted ${key}`);
}

console.log(dryRun ? 'Dry-run complete (no objects deleted)' : 'Vacuum complete');
await sql.end();
```

The `--dry-run` option prints the candidate keys without calling `DeleteObject`. It is useful for logs and review, but it does not exercise the actual delete path. The safer test is a real delete against a branch.

## Test the vacuum on a Neon branch

This is the core of the workflow. You'll branch the database **and** the bucket, run the vacuum against the branch, and verify that production is unaffected.

Create a new branch to test the vacuum job. Run the `neon checkout` command with a branch name of your choice. For example:

```bash
neon checkout vacuum-orphans
```

> When prompted, select **Yes** to create the branch. The branch is created from the current state of your production branch, so it inherits the drift you just created. The `neon checkout` command also updates `.env.local` to point at the branch's own bucket and database.

You can now run the vacuum job against the branch. The `DeleteObject` calls will only affect the branch's bucket, not production. Run the consistency checker first to confirm the drift:

```bash
npx tsx scripts/check-consistency.ts
```

```text
rows in attachments:   9
objects in uploads:    12
dangling rows:         0
orphaned objects:      3
```

Optionally print the plan first:

```bash
npx tsx scripts/vacuum-orphans.ts --dry-run
```

```text
Found 3 orphaned object(s)
[dry-run] would delete avatars/user-10@example.com.png
[dry-run] would delete avatars/user-11@example.com.png
[dry-run] would delete avatars/user-12@example.com.png
Dry-run complete (no objects deleted)
```

Now run the real vacuum on the branch:

```bash
npx tsx scripts/vacuum-orphans.ts
```

```text
Found 3 orphaned object(s)
deleted avatars/user-10@example.com.png
deleted avatars/user-11@example.com.png
deleted avatars/user-12@example.com.png
Vacuum complete
```

Re-check consistency on the branch:

```bash
npx tsx scripts/check-consistency.ts
```

```text
rows in attachments:   9
objects in uploads:    9
dangling rows:         0
orphaned objects:      0
```

The output is clean: every remaining row has an object, and no unreferenced bytes remain. That confirms the vacuum job works as intended, and it did so against a real copy of production state without touching production.

## Verify production is unaffected

Switch back to your production branch and run the checker again:

```bash
neon checkout main # or your production branch name
npx tsx scripts/check-consistency.ts
```

```text
rows in attachments:   9
objects in uploads:    12
dangling rows:         0
orphaned objects:      3
```

Your production branch still has the three orphans. Every `DeleteObject` on the branch only affected the branch's own bucket. This is the property you can't get with a single shared AWS bucket: the rehearsal deleted real objects against a copy of production state, without risking a single production byte.

This is also why object branching matters for vacuum jobs specifically. A branch validates the real delete path and the checker against a fixed production-shaped snapshot. It cannot prove that the same snapshot will still exist when you later run against a live, changing production system, so protect that promotion as described next.

## Protect the production run from concurrent writes

Postgres and S3 do not share a transaction. An upload could create a row after the vacuum lists an object but before `DeleteObject` runs. For a production run, use an application-level safeguard that prevents that race:

- Run the vacuum during a maintenance window, or pause the upload and retention workers that write `attachments`.
- Or have uploads and cleanup acquire the same application-level lock for a key or tenant before either creates a row or deletes an object.
- Keep a grace period appropriate for your upload pipeline: delete only objects that have been unreferenced for long enough that an ordinary upload and database insert have completed.

For large buckets, process one `ListObjectsV2` page at a time and use `DeleteObjectsCommand` in batches of up to 1,000 keys rather than retaining every key in memory or issuing one delete request per object. The implementation shown in this guide is a simple example; modify it to suit your production needs.

## Promote the verified vacuum to production

Promotion is running the same script you just verified, against your production branch with the concurrent-write safeguards in place. Run the following commands:

```bash
neon checkout main # or your production branch name
npx tsx scripts/vacuum-orphans.ts
npx tsx scripts/check-consistency.ts
```

You should see output like this:

```text
Found 3 orphaned object(s)
deleted avatars/user-10@example.com.png
deleted avatars/user-11@example.com.png
deleted avatars/user-12@example.com.png
Vacuum complete

rows in attachments:   9
objects in uploads:    9
dangling rows:         0
orphaned objects:      0
```

You now have a clean production bucket, and the checker proves it. The orphaned bytes are deleted, and all the remaining rows point to real objects.

You can now delete the temporary branch by running:

```bash
neon branches delete vacuum-orphans
```

</Steps>

## Keep the two systems in sync

After the vacuum, you can prevent future drift by following these best practices:

### Prefer delete object, then delete row

When product code removes an attachment, delete the object first (or mark the row `pending_delete` and let a sweeper finish). `DeleteObject` is idempotent. If the process crashes after the object is deleted but before the row is removed, you get a temporary dangling row for something the user already deleted, not silent orphaned storage. A later vacuum or the same sweeper can reconcile either side.

```typescript
await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: row.object_key }));
await sql`DELETE FROM attachments WHERE id = ${row.id}`;
```

### Schedule the checker, not just the vacuum

You can also run `check-consistency.ts` on a cron or in CI after retention jobs. Non-zero orphan counts should page the team that owns storage; non-zero dangling counts should page the team that owns user-facing downloads. This way, the vacuum becomes a deliberate response to a measured report, not a blind delete.

### Dry-run every destructive storage job on a branch

Account purges, GDPR erasure pipelines, media re-keys, and bulk admin tools all rewrite both systems. The loop is the same every time:

1. Create a branch from production by running `neon checkout <branch-name>`.
2. Run the job against the branch.
3. Run the consistency checker.
4. Promote only when both counts are zero.
5. Delete the rehearsal branch.

Because [object branching](/docs/storage/objects#object-branching) is copy-on-write, creating a branch is fast and cheap.

## Summary

Orphaned objects are not a one-off bug. They're the inevitable result of splitting deletes across two systems that don't share a transaction. You can't fix that with a more careful delete function alone, because the failure modes are crashes, timeouts, and partial jobs by definition. What you can fix is how you detect and clean up the drift.

The checker measures the drift and exits non-zero, so CI or a cron job can catch it before it grows. The vacuum deletes only what the checker proves is unreferenced. And because Neon buckets branch with your database, the whole loop can be practiced on a branch before it touches production.

Branch, vacuum, verify, promote. The same loop applies to any destructive job that rewrites both systems.

## Resources

- [Neon Object Storage overview](/docs/storage/overview)
- [Bucket branching](/docs/storage/buckets#bucket-branching)
- [`neon.ts` reference](/docs/reference/neon-ts)

<NeedHelp/>
