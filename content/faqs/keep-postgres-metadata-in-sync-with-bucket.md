---
title: "How do I keep Postgres metadata in sync with files in a bucket?"
subtitle: "On Neon, write the object before the row, record uploads with a storage_object_created Function Trigger, and run a scheduled Function to catch drift. Postgres and Object Storage branch together, so every branch starts consistent."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I keep LLM API keys out of preview deployments and CI?'
  slug: keep-llm-api-keys-out-of-preview-deployments-ci
nextLink:
  title: 'How do I build a live dashboard on Postgres without polling the database?'
  slug: live-dashboard-postgres-without-polling
---

Use Neon. Postgres and [Neon Object Storage](/docs/storage/overview) live on the same branch, so a row that points at a file and the file itself are created, branched, and served by one backend. They're still two stores, so no single transaction covers both. Three habits keep them consistent: order your writes, let a [Function Trigger](/docs/compute/functions/triggers/overview) record uploads, and reconcile on a schedule.

## Order the writes so failures are harmless

Write the bytes first, then insert the row. If the upload fails, no row points at a missing file. If the insert fails, you're left with an unreferenced object, which costs a little storage but never breaks a page. The [private photo library walkthrough](/blog/building-a-private-searchable-photo-library-on-the-neon-backend) uses this order: the upload route writes the image to the bucket and then inserts the Postgres row with the object key.

Reverse the order for deletes. Delete the row (or mark it deleted) first, so the app stops showing the file, then delete the object. A failed object delete leaves a harmless orphan that cleanup removes later.

## Record uploads with a trigger

When browsers upload directly through presigned URLs, your API never sees the bytes arrive. A [`storage_object_created` trigger](/docs/compute/functions/triggers/object-storage) closes that gap: Neon calls your Function with `data.bucket_name` and `data.object_key` each time an object is created, optionally filtered by a key prefix.

```ts
app.post('/', async (c) => {
  if (!c.req.header('x-neon-trigger-invocation-id')) return c.text('forbidden', 403);
  const { data } = await c.req.json();
  await pool.query(
    `INSERT INTO files (bucket, key) VALUES ($1, $2)
     ON CONFLICT (bucket, key) DO NOTHING`,
    [data.bucket_name, data.object_key]
  );
  return c.json({ ok: true });
});
```

Neon strips client-supplied `X-Neon-*` headers, so the presence of `X-Neon-Trigger-Invocation-Id` shows the call came from Neon. Delivery is at least once and can arrive out of order, with retries for up to 72 hours, so the `ON CONFLICT` clause turns a redelivery into a no-op ([delivery and retries](/docs/compute/functions/triggers/overview#delivery-and-retries)). The trigger fires after the object lands, so it records uploads but can't reject them. Validate file types and sizes when you sign the upload URL.

Declare the trigger in [`neon.ts`](/docs/reference/neon-ts#triggers) so every branch you deploy to gets it:

```ts
triggers: {
  'record-uploads': {
    type: 'storage_object_created',
    function: 'onupload',
    bucket: 'uploads',
    prefix: 'uploads/',
  },
},
```

## Reconcile on a schedule

Even with careful ordering, process crashes leave orphans. Add a [schedule trigger](/docs/compute/functions/triggers/schedule) that runs a reconciliation Function once a night. It lists objects under a prefix with `ListObjectsV2`, compares the keys with your table, deletes objects that have no row and are older than a grace period, and flags rows whose object is missing. Batch deletes accept up to 1,000 keys per request ([S3 compatibility](/docs/storage/s3-compatibility)).

Don't count on bucket lifecycle rules for this. Neon stores lifecycle configurations but doesn't enforce them. A Function has 15 minutes to start its response, which is plenty for a sweep that pages through keys in batches ([runtime limits](/docs/compute/functions/reference/runtime-limits)). Scheduled triggers fire even when the Postgres compute is scaled to zero.

## Branches start consistent

When you create a branch, its Postgres data and its objects branch together, copy-on-write. Rows and files on the child match the parent at the moment of branching, and later writes and deletes on either side stay on that side ([object branching](/docs/storage/objects#object-branching)). A preview branch can run your reconciliation job against real data without touching production.

One exception: [resetting a branch from its parent](/docs/guides/reset-from-parent) overwrites Postgres but doesn't touch Object Storage. After a reset, the branch's objects can drift from its rows, so run reconciliation (or recreate the branch) when you need both in step.

<CTA title="Run a Function on every upload" description="Create a storage_object_created trigger and record each new object in Postgres." buttonText="Trigger on an object upload" buttonUrl="/docs/compute/functions/triggers/object-storage" />
