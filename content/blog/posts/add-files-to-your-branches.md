---
title: Add files to your branches
description: >-
  Move your buckets to Neon Object Storage so your files branch with your
  database. Then, trigger a Neon Function every time a file lands
excerpt: >-
  If you use Neon branches, you are probably used to creating one for every PR,
  preview, test, agent run. But if your files still live in Amazon S3, every
  branch still points at the same bucket.
date: '2026-11-23T12:00:00'
updatedOn: '2026-11-23T13:34:00.000Z'
category: product
categories:
  - product
authors:
  - carlota-soto
cover:
  image: null
  alt: null
isFeatured: false
seo:
  title: Add files to your branches - Neon
  description: >-
    Move your buckets to Neon Object Storage so your files branch with your
    database. Then, trigger a Neon Function every time a file lands
  keywords: []
  noindex: false
  ogTitle: Add files to your branches - Neon
  ogDescription: >-
    Move your buckets to Neon Object Storage so your files branch with your
    database. Then, trigger a Neon Function every time a file lands
  image: null
---

**[ADD CLIP]**

If you use Neon branches, you are probably used to creating one for every PR, preview, test, agent run… But if your files still live in Amazon S3, every branch still points at the same bucket. Imagine you're testing a new feature you vibe coded for your app - if you delete a file in the preview, is that file being deleted for real in your bucket? Also, if you want to test an upload - does it land next to the real customer files you're storing?

You can make this workflow much cleaner with [Neon Object Storage](https://neon.com/docs/storage/overview). It feels just like you're used to on S3, but your buckets can branch - when you create a branch, your files will automatically come with it, working the same way as you're already used to with the database - your storage won't duplicate, but you will see what looks like a perfect copy of your real files; but this is isolated - you don't have to worry about affecting the production bucket.

## How files branch

A bucket in Neon Object Storage belongs to a branch. [When you create a child branch, it inherits every bucket and every object in its parent at that moment](https://neon.com/docs/storage/buckets#bucket-branching) - it's the same copy-on-write model Neon uses for Postgres, so no objects are copied when the branch is created, however large the bucket is.

From then on, the two branches diverge:

- Uploads, overwrites, and deletes on the child are visible only on the child and its descendants including changes to objects that existed at fork time
- Creating or deleting a bucket on the child doesn't affect the parent
- The parent keeps seeing its own files, unchanged

[Resetting a branch from its parent](https://neon.com/docs/guides/reset-from-parent) resets its buckets and objects along with the database, so a preview can return to a clean copy of production in one step. An [instant restore](https://neon.com/docs/postgres/backup-restore/branch-restore) works differently: it rolls back Postgres and leaves buckets and objects as they are.

Because branches share storage until they diverge, a preview branch with a copy of a 200 GB bucket isn't billed for another 200 GB.

<Admonition type="note" title="Included in the Free Plan">
You can also use Neon Object Storage in the Free Plan - it includes up to 5 GB per project.
</Admonition>

## Moving your buckets from S3

[Object Storage speaks the S3 API.](https://neon.com/docs/storage/s3-compatibility) The AWS SDKs, boto3, and the AWS CLI work once you point them at your branch's storage endpoint. For most apps, the code change is a few lines of client configuration:

```ts
import { S3Client } from '@aws-sdk/client-s3';

export const client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});
```

You also don't need an AWS account or IAM policies for these buckets. Access is set per bucket in Neon (`private` or `public_read`), and credentials come from the same [Neon credential system](https://neon.com/docs/storage/authentication) that Functions and AI Gateway use.

To give your agent the Object Storage reference up front, install the skills first:

```bash
neon skills -s neon -s neon-object-storage
```

```text filename="Prompt your agent" shouldWrap
Move this app's file storage from Amazon S3 to Neon Object Storage, so files branch with the database.
Docs: https://neon.com/docs/storage/get-started.md
S3 support: https://neon.com/docs/storage/s3-compatibility.md

1. Inventory. List every S3 bucket the app uses, every place it creates an S3 client, and every S3 feature it depends on. Flag anything Neon doesn't support: bucket notifications (SNS/SQS), lifecycle or versioning rules the app relies on, ACL or bucket policy writes, virtual-hosted-style URLs, and objects over 10 GiB. Also find Postgres columns that store full S3 URLs instead of object keys. Show me the list before changing anything.
2. Provision. Confirm the Neon project is in a region that supports Object Storage. Link the app to the project's default branch, declare one bucket per S3 bucket in neon.ts (private unless the S3 bucket is public), and run neon deploy. If the AWS_* variables it writes collide with credentials the app still needs for other AWS services, rename the Neon ones and pass them to the client explicitly.
3. Copy. Copy every object from S3 into the matching Neon bucket, keeping keys, Content-Type, and custom metadata. Use multipart upload for large objects. Don't change the endpoint on the default AWS CLI profile; pass --endpoint-url or use a separate named profile. Confirm object counts and total bytes match for each bucket.
4. Switch. Point the S3 client at AWS_ENDPOINT_URL_S3 with forcePathStyle: true (JavaScript) or endpoint_url (Python). If stored URLs need rewriting, show me the SQL before you run it against the default branch.
5. Test on a branch. Create a Neon branch, run the app against it, upload and delete a file, and confirm the default branch's bucket is unchanged.

Don't delete anything in S3. I'll retire the old buckets after the cutover.
```

## Automating what happens after an upload via Triggers

Many apps run code when a file arrives: to make a thumbnail, record the upload in Postgres, or extract the text from a PDF. Once your files are in Neon, a [Function Trigger](https://neon.com/docs/compute/functions/triggers/overview) can run that code for you in a Neon Function.

So far, Neon has two trigger types that are useful for storage work:

- [On upload](https://neon.com/docs/compute/functions/triggers/object-storage) (`storage_object_created`) - to invoke a Neon Function every time an object is created in a bucket. Use them to
  - Insert a row for each new file, so your app queries Postgres instead of listing the bucket.
  - Resize images into thumbnail and full-size variants, convert them to WebP, and write them under a `processed/` prefix.
  - Generate alt text and tags for images through [AI Gateway](https://neon.com/docs/ai-gateway/overview) and store them next to the file's row.
  - Extract text from PDFs, chunk and embed it, and write the vectors to Postgres for search.
  - Transcribe audio uploads and save the transcript.
  - Run moderation on new uploads and move anything that fails to a `quarantine/` prefix.
  - Parse an uploaded CSV and load its rows into a table.
- [On a schedule](https://neon.com/docs/compute/functions/triggers/schedule) (`schedule`) - runs a function on a cron expression. Use them to
  - Delete objects under `tmp/` older than a set age. Lifecycle rules don't run in Object Storage, so this is the replacement.
  - Find objects that no Postgres row references, and rows that point to missing objects.
  - Total storage per user or per tenant and write it to a usage table

Triggers branch too - a child branch inherits its parent's triggers in a disabled state, so creating a preview doesn't reprocess every inherited file. To test a pipeline, enable the trigger on the branch; the uploads and the Postgres writes it causes stay there.

```text filename="Prompt your agent" shouldWrap
Create a Neon Function that <task>, then trigger it on new uploads with a Function Trigger.
Docs: https://neon.com/docs/compute/functions/triggers/object-storage.md

- Add one unauthenticated POST route (trigger invocations arrive without credentials). Reject requests without the X-Neon-Trigger-Invocation-Id header. Read data.bucket_name and data.object_key from the JSON body, and keep the handler idempotent, since a delivery can arrive more than once.
- If the task uses Postgres, connect with the injected DATABASE_URL through a module-scope pg Pool with attachDatabasePool from @neon/functions.
- Declare the function and a storage_object_created trigger in neon.ts with the bucket name, scoped to a key prefix that excludes anything the function writes. Run neon deploy.
- Upload a test object and confirm the run in neon logs query --source function.
```

## Get started

If you already use branches, moving your files into Neon will improve your experience even more. On a preview branch, you'll be able to upload, overwrite, and delete files without worrying about production; you can also test an upload pipeline end to end by enabling its trigger on that branch. When you're done, reset the branch from its parent to get a clean copy of production again, files included.

To start, follow the [Object Storage quickstart](https://neon.com/docs/storage/get-started) or point your agent to it. If you get stuck, ask for help in the [Neon Discord](https://neon.com/discord).
