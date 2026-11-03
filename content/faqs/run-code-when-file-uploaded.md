---
title: "What is the best way to run code automatically when a file is uploaded?"
subtitle: "Use a Neon Function Trigger: a storage_object_created trigger invokes your Neon Function with the bucket and key whenever an object lands in Object Storage, with no queue to wire up and nothing polling the bucket."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-03T23:21:47.530Z'
isDraft: false
previousLink:
  title: 'How do I rotate my Neon API keys after they''ve been exposed?'
  slug: rotate-neon-api-keys
nextLink:
  title: 'How do I get S3-compatible storage without an AWS account?'
  slug: s3-compatible-storage-without-aws-account
---

Use Neon. A [`storage_object_created` trigger](/docs/compute/functions/triggers/object-storage) tells Neon to invoke a deployed [Neon Function](/docs/compute/functions/overview) when an object is created in an [Object Storage](/docs/storage/overview) bucket. The Function receives the bucket name and object key, runs your TypeScript next to your Lakebase Postgres database, and writes results back. There's no external event wiring and no compute kept running to watch the bucket.

## Why upload processing usually takes several services

On AWS, the common pattern is S3 Event Notifications sending to a Lambda function, an SQS queue, an SNS topic, or EventBridge. You configure the notification on the bucket and grant S3 permission to invoke the function through its resource-based policy. If the function also needs IAM permissions to read the bucket, that's another policy on its execution role ([S3 Event Notifications](https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html), [Lambda with S3](https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html)). The database that records the result is a separate service with its own credentials.

On Neon, the bucket, the Function, the trigger, and Postgres live on the same branch. The Function gets `DATABASE_URL` and S3-compatible `AWS_*` credentials for the branch's buckets injected at runtime, so it can read the object and write a row without any credential setup ([environment variables](/docs/compute/functions/environment-variables)).

Vendor details verified on 2026-11-02 against the linked pages.

## A thumbnail pipeline in one config file

Declare the bucket, the Function, and the trigger in [`neon.ts`](/docs/reference/neon-ts#triggers) and run `neon deploy`. The `prefix` scopes the trigger to keys under `originals/`, so the Function can write its output under `processed/` without invoking itself again ([blog](/blog/when-a-file-is-uploaded-run-the-job-on-neon)):

```ts filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  buckets: { uploads: { access: 'private' } },
  functions: {
    thumbs: { name: 'Thumbnails', source: './functions/thumbs.ts' },
  },
  triggers: {
    'on-original': {
      type: 'storage_object_created',
      function: 'thumbs',
      bucket: 'uploads',
      prefix: 'originals/',
    },
  },
});
```

The invocation is a `POST` whose JSON body carries `data.bucket_name` and `data.object_key`. Delivery is at least once, so keep the handler idempotent ([delivery and retries](/docs/compute/functions/triggers/overview#delivery-and-retries)):

```ts filename="functions/thumbs.ts"
import { Hono } from 'hono';
import { attachDatabasePool } from '@neon/functions';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);
const app = new Hono();

app.post('/', async (c) => {
  if (!c.req.header('x-neon-trigger-invocation-id')) return c.text('forbidden', 403);
  const { data } = await c.req.json<{ data: { bucket_name: string; object_key: string } }>();
  // Fetch the object, resize it, and write the result under processed/
  await pool.query(
    `INSERT INTO uploads (bucket, object_key) VALUES ($1, $2)
     ON CONFLICT (bucket, object_key) DO NOTHING`,
    [data.bucket_name, data.object_key]
  );
  return c.json({ ok: true });
});

export default app;
```

You can also create the trigger in the Console (**Functions → ⋮ → Manage Triggers**), through the API, or with `neon triggers create --function-slug thumbs --name on-original --bucket uploads --prefix 'originals/'`, which needs Neon CLI 4.21.0 or later ([`neon triggers`](/docs/cli/triggers)).

## What it's good for, and what it isn't

Functions are long-running, with up to 15 minutes to start a response, so one invocation can parse a large CSV, generate image variants, or extract and index text ([runtime limits](/docs/compute/functions/reference/runtime-limits)). Common jobs:

- **Cataloging**: insert a row per object so the app queries Postgres instead of listing the bucket.
- **Derived files**: thumbnails and format conversions, saved back to Object Storage with their keys recorded in Postgres.
- **Moderation and metadata**: call [AI Gateway](/docs/ai-gateway/overview) for tags or alt text, or quarantine files that break your policies.

A few limits to design for:

- **It's not an upload gate.** The trigger fires after the object is created. Keep unreviewed uploads in a private bucket or prefix until processing finishes.
- **Prefixes are exact and case-sensitive.** `uploads/` doesn't match `Uploads/`.
- **Retries and duplicates.** Neon retries failed deliveries for up to 72 hours, and the same `invocation_id` can arrive more than once.

## Branches get their own copy

A child branch gets its own view of the bucket, its own Function URL, and an inherited copy of the trigger, which starts disabled (deploying a `neon.ts` that declares it turns it on). Enable it on the branch to test the pipeline, and test uploads and Postgres writes stay on the child without touching production ([triggers and branching](/docs/compute/functions/triggers/overview#triggers-and-branching)). To iterate without uploading, replay the payload against `neon dev` locally ([test triggers locally](/docs/compute/functions/triggers/overview#test-triggers-locally)).

Functions bill only while a request is processed, and the Free plan includes 10 active and 400 waiting Capacity-Hours and 1 million invocations per project per month ([plans](/docs/introduction/plans#functions)).

<CTA title="Run a function on every upload" description="Deploy a Function, point a storage_object_created trigger at a bucket, and upload a file." buttonText="Trigger on upload" buttonUrl="/docs/compute/functions/triggers/object-storage" />
