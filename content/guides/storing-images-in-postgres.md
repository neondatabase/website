---
title: 'Storing images in Postgres'
subtitle: 'When to store images in Postgres with bytea, when to use object storage, and how Neon and Supabase compare on S3 support, branching, egress, and cost.'
author: rishi-raj-jain
excludeFromBlog: true
enableTableOfContents: true
createdAt: '2026-10-12T00:00:00.000Z'
---

Postgres can store images in a `bytea` column, which works well for a few small files like icons. As uploads grow, images make storage, queries, and backups bigger, so most apps keep them in object storage and save only a key in Postgres.

In this guide, you'll learn:

- How Postgres stores an image under the hood (`bytea`, TOAST, and large objects)
- When storing images in Postgres makes sense, and when it does not
- The recommended setup of object storage with keys in Postgres, using [Neon Object Storage](/docs/storage/overview)
- How Neon and Supabase compare on S3 support, branching, egress, and cost

## Comparison overview

Here's how storing images in Postgres compares to storing them in object storage:

| Factor                  | Images in Postgres (`bytea`)                                     | Images in object storage + key in Postgres                          |
| :---------------------- | :--------------------------------------------------------------- | :------------------------------------------------------------------ |
| **Max size per image**  | 1 GB per `bytea` value                                           | 5 GiB per object on Neon Object Storage                             |
| **Atomic with the row** | Yes, the image commits or rolls back with the row                | No, an upload and an `INSERT` are two separate steps                |
| **Serving an image**    | Your app queries Postgres, then streams the bytes to the browser | The browser downloads directly from a presigned URL                 |
| **Query results**       | Listing complete rows also returns their images                           | Rows stay small, only keys travel                                   |
| **Backups and dumps**   | Grow with every image                                            | Stay small, files are stored separately                             |
| **Best for**            | A few very small images that must commit with their row          | Everything else: user uploads, galleries, media, AI-generated files |

To see where these differences come from, let's start with how Postgres stores an image.

## How Postgres stores binary data

You have two ways to put binary data in Postgres: the `bytea` data type and large objects.

### The bytea type and TOAST

`bytea` is a regular column type for binary strings, so you read and write it with normal SQL:

```sql
CREATE TABLE avatars (
  user_id   bigint PRIMARY KEY,
  mime_type text   NOT NULL,
  bytes     bytea  NOT NULL
);
```

Postgres stores rows in 8 KB pages, so most images can't be stored inline with the rest of the row. Once a row grows past about 2 KB (the [TOAST](https://www.postgresql.org/docs/current/storage-toast.html) threshold), Postgres first tries to compress the large values, then moves them out of line into a separate TOAST table, split into chunks of about 2 KB each. Your `avatars` row keeps a pointer, and the image bytes are stored in the TOAST table.

This is the default `EXTENDED` strategy. JPEG, PNG, and WebP files are already compressed, so this rarely makes them smaller. Postgres's default compressor gives up after the first 1 KB if it finds nothing to compress. You can skip the attempt entirely by switching the column to `EXTERNAL`, which also makes reading part of a large value faster:

```sql
ALTER TABLE avatars ALTER COLUMN bytes SET STORAGE EXTERNAL;
```

<Admonition type="note" title="Avoid base64 in a text column">
Storing an image as a base64 string in a `text` column makes it about a third larger on disk than the raw bytes, because base64 turns every 3 bytes into 4 characters. If you store images in Postgres, use a `bytea` column instead.
</Admonition>

### Large objects

Large objects are the other option. They're stored in the `pg_largeobject` system table, can be up to 4 TB each, and are read and written through a file-like API (`lo_open`, `lo_read`, `lo_write`) that lets you stream and seek.

They come with tradeoffs:

- Your table stores an `oid` that points at the large object, and deleting the row does **not** delete the object. You need `lo_unlink`, a trigger, or `vacuumlo` to clean up orphans.
- You read and write the data through large object functions, such as `lo_get` and `lo_put`, instead of selecting or updating a column.

The [PostgreSQL wiki](https://wiki.postgresql.org/wiki/BinaryFilesInDB) recommends `bytea` for simplicity, so for images, use `bytea`.

With the type settled, the next question is when to store images in Postgres at all.

## When to store images in Postgres

Keep images in Postgres only when they're very small, like icons and signatures of a few kilobytes. Within those limits, storing images in Postgres is a good choice when all of these are true:

- **The images stay a small share of the database:** Your rows and indexes, not the images, make up most of its size.
- **The image must commit with its row:** An inspection photo that must exist if and only if the inspection record exists, a signed consent form, or a generated invoice that must never point at a missing file. With `bytea`, a rolled-back transaction rolls back the image too.
- **You want one unit to back up and restore:** One `pg_dump` or one point-in-time restore covers rows and images together.

With the [Neon serverless driver](/docs/serverless/serverless-driver), you write and read an image as a `Buffer`:

```typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Write
await sql`
  INSERT INTO avatars (user_id, mime_type, bytes)
  VALUES (${userId}, ${file.type}, ${Buffer.from(await file.arrayBuffer())})
  ON CONFLICT (user_id) DO UPDATE SET mime_type = EXCLUDED.mime_type, bytes = EXCLUDED.bytes
`;

// Read
const [avatar] = await sql`SELECT mime_type, bytes FROM avatars WHERE user_id = ${userId}`;
```

To serve the image, return the bytes from a route handler with a long cache lifetime, so browsers and your CDN don't hit Postgres on every page view:

```typescript filename="app/avatars/[userId]/route.ts"
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(_request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const [avatar] = await sql`SELECT mime_type, bytes FROM avatars WHERE user_id = ${userId}`;
  if (!avatar) return new Response('Not found', { status: 404 });

  return new Response(avatar.bytes, {
    headers: {
      'Content-Type': avatar.mime_type,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
```

If you use `immutable` caching, include a version in the URL (like `/avatars/42?v=3`) so a new upload shows up right away.

This setup works for a handful of small images. Once images grow in number or size, object storage is the better fit.

## When to use object storage instead

Most images belong in object storage, with only a key and some metadata in Postgres. Use object storage when any of these are true:

- **There are many images, or the number keeps growing:** User uploads, galleries, listing photos, and AI-generated images add up quickly.
- **The images are more than a few kilobytes each:** Photos, scans, and screenshots cost more to store in the database than in a bucket.
- **You want small backups:** Images stored in the database are copied into every dump, restore, and logical replication.
- **Browsers should upload and download directly:** Presigned URLs let them do this without routing image bytes through your app server.

To see how large these differences get, let's store the same set of photos both ways.

## Comparing bytea and object storage

The example app has 500 JPEG photos of about 168 KB each, 82 MB in total:

- `photos_bytea`, with the image bytes in a `bytea` column
- `photos`, with the image in a Neon Object Storage bucket and only its `object_key` in Postgres

### 1. Storage cost

The `photos_bytea` table, which stores the images, takes **86 MB**. The `photos` table, which only stores a title, a MIME type, a key, and a size for each image, takes **128 KB**. So the images make up more than 99% of the `photos_bytea` table.

Database storage costs more per GB than object storage. A database is built for small reads and writes, with indexes and transactions. An image is written once and read as one file, and object storage is built for exactly that.

The gap grows as you store more images:

| Images stored | In Postgres (`bytea`) | In Object Storage | Extra cost of `bytea` per year |
| :------------ | :-------------------- | :---------------- | :----------------------------- |
| 10 GB         | $3.50/month           | $0.23/month       | **$39.24**                     |
| 50 GB         | $17.50/month          | $1.15/month       | **$196.20**                    |
| 500 GB        | $175.00/month         | $11.50/month      | **$1,962.00**                  |

For 50 GB of images on Neon and Supabase, here's the how the cost compares:

| Where the images are stored | Neon (Launch)           | Supabase (Pro)                         |
| :-------------------------- | :---------------------- | :------------------------------------- |
| Postgres (`bytea`)          | 50 × $0.35 = **$17.50** | $25 + (50 − 8) × $0.125 = **$30.25**   |
| Object storage              | 50 × $0.023 = **$1.15** | $25, with 100 GB included = **$25.00** |

So keeping 50 GB of images in Neon Object Storage, uploaded with presigned URLs and with only their keys in Postgres, costs $1.15 a month, against $25 on Supabase.

### 2. Query result size

Many pages show a list with an image on each row, like the members of a team with their avatars, or your customers with their logos. When those images are stored in `bytea`, the query that lists the rows also returns every image. Listing 50 photos from `photos_bytea` returns about 8 MB of images along with the rows. The same list from `photos` returns only titles and keys, a few kilobytes, and the browser downloads each image from its own URL when needed.

### 3. Backup and replication size

Anything that copies your database also copies the images stored in its `bytea` columns:

- **Dumps and restores:** A `pg_dump` of a database with images is mostly images, so the dump file, and the time to create and restore it, grow with every upload.
- **Logical replication:** Setting up a subscription first copies every row of the published tables, images included. Usually, data sent through logical replication counts toward your public network transfer.
- **Table rewrites:** `VACUUM FULL` and `ALTER TABLE` commands that rewrite the table copy every image again.

At a larger scale, a 1 GB app database with 50 GB of photos is a 51 GB database to dump, restore, and replicate. With the images in object storage, these jobs copy only the 1 GB of rows, and the bucket keeps the images separately.

### 4. Image delivery

Postgres doesn't serve files to browsers. To show an image stored in `bytea`, your app runs a query, holds the bytes in memory, and sends them in its response. Every upload passes through your server on the way in, too.

Object storage serves files over HTTP on its own:

- **Presigned URLs:** The browser uploads and downloads directly from the bucket. Your server only signs URLs and writes rows.
- **Public buckets:** Images in a `public_read` bucket load from a plain URL, with no signing.
- **Caching:** You can set a `Cache-Control` header on each object when you upload it, so browsers cache the image instead of downloading it again.

## Recommended: object storage with keys in Postgres

For most apps, this is the recommended pattern:

1. The browser asks your API for an upload URL.
2. Your API returns a presigned `PUT` URL for a new object key.
3. The browser uploads the image directly to the bucket.
4. Your API records the key and metadata in Postgres.
5. To display the image, your API signs a short-lived `GET` URL for the key.

Let's build it on Neon, where the database and the bucket are in the same project.

### Declare the bucket

Declare an `images` bucket in [`neon.ts`](/docs/reference/neon-ts):

```typescript filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  buckets: { images: {} },
});
```

Running `neon deploy` creates the private bucket and writes `DATABASE_URL` and the `AWS_*` credentials into `.env.local`.

### Create the table

Store the key, and enough metadata to validate and display the file without opening it:

```sql
CREATE TABLE photos (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  owner_id    bigint NOT NULL,
  object_key  text   NOT NULL UNIQUE,
  mime_type   text   NOT NULL,
  size_bytes  bigint NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON photos (owner_id, created_at DESC);
```

### Create an S3 client

Point the AWS SDK at your branch's storage endpoint:

```typescript filename="lib/s3.ts"
import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: true,
  // Keeps presigned PUT URLs from embedding a checksum of an empty body
  requestChecksumCalculation: 'WHEN_REQUIRED',
});
```

### Allow browser uploads with CORS

The browser uploads straight to the bucket, so the bucket needs a CORS rule that allows your app's origin. Set it once:

```typescript
import { PutBucketCorsCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/lib/s3';

await s3.send(
  new PutBucketCorsCommand({
    Bucket: 'images',
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedOrigins: ['https://app.example.com'],
          AllowedMethods: ['GET', 'PUT'],
          AllowedHeaders: ['*'],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  })
);
```

### Generate upload URLs and record metadata

Two routes are enough: one signs an upload URL, and one records the file after the browser uploads it.

```typescript filename="app/api/photos/upload-url/route.ts"
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '@/lib/s3';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function POST(request: Request) {
  const { contentType } = await request.json();
  if (!ALLOWED.has(contentType)) return new Response('Unsupported type', { status: 400 });

  const ownerId = await getCurrentUserId(); // your auth
  const key = `users/${ownerId}/photos/${crypto.randomUUID()}`;
  const url = await getSignedUrl(s3, new PutObjectCommand({ Bucket: 'images', Key: key, ContentType: contentType }), { expiresIn: 300 });

  return Response.json({ key, url });
}
```

```typescript filename="app/api/photos/route.ts"
import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { neon } from '@neondatabase/serverless';
import { s3 } from '@/lib/s3';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  const { key } = await request.json();
  const ownerId = await getCurrentUserId(); // your auth
  if (!key.startsWith(`users/${ownerId}/`)) return new Response('Forbidden', { status: 403 });

  // Trust the bucket, not the client, for size and type
  const head = await s3.send(new HeadObjectCommand({ Bucket: 'images', Key: key }));

  const [photo] = await sql`
    INSERT INTO photos (owner_id, object_key, mime_type, size_bytes)
    VALUES (${ownerId}, ${key}, ${head.ContentType}, ${head.ContentLength})
    RETURNING id
  `;

  return Response.json(photo);
}
```

In the browser, the upload is a single `fetch`:

```typescript
const { key, url } = await fetch('/api/photos/upload-url', {
  method: 'POST',
  body: JSON.stringify({ contentType: file.type }),
}).then((r) => r.json());

await fetch(url, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
await fetch('/api/photos', { method: 'POST', body: JSON.stringify({ key }) });
```

### Generate download URLs

Select only the columns you need, and sign a short-lived URL for each image:

```typescript
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const rows = await sql`
  SELECT id, object_key FROM photos
  WHERE owner_id = ${ownerId}
  ORDER BY created_at DESC
  LIMIT 50
`;

const photos = await Promise.all(
  rows.map(async (row) => ({
    id: row.id,
    url: await getSignedUrl(s3, new GetObjectCommand({ Bucket: 'images', Key: row.object_key }), { expiresIn: 300 }),
  }))
);
```

### Keeping files and rows in sync

With two systems, the row and the file can get out of sync. On Neon, [buckets and objects branch with the database](#branching-with-images), so a branch's rows and files start from the same point in time. To clean up files whose rows were deleted, see the [orphaned objects guide](/guides/clean-up-orphaned-s3-objects-neon-branching).

## Choosing between Neon and Supabase for image storage

So far, this guide has used Neon for the database and object storage. Here's how it compares to Supabase Storage.

### S3 API compatibility

Both platforms support the S3 API, so the upload and download code in this guide works on either one with a different endpoint and credentials.

Both handle the basics, such as presigned uploads and downloads, `CopyObject`, and conditional `GET`. These are the operations where they differ:

| Operation                               | What it's for with images                                                    | Neon                                                 | Supabase                                                                 |
| :-------------------------------------- | :--------------------------------------------------------------------------- | :--------------------------------------------------- | :----------------------------------------------------------------------- |
| `PutBucketCors` / `GetBucketCors`       | Choose which sites can upload and download from the browser                  | Supported, preflight returns only the allowed origin | Not supported, every origin gets `Access-Control-Allow-Origin: *`        |
| `PutObjectTagging` / `GetObjectTagging` | Mark an image, for example `status=pending-review`, without a database write | Supported, tags are stored and returned              | `PutObjectTagging` returns `200`, but `GetObjectTagging` returns no tags |
| `GetObjectAttributes`                   | Read an image's ETag and size in one call                                    | Supported, returns ETag and size                     | Not supported, the response has no size                                  |

On Neon, you can limit browser uploads to your own site, tag images, and read their size through the same S3 API, while on Supabase, these calls are missing or return incomplete results.

### Branching with images

To test a change against real images, a branch needs both the rows and the files. Here's what each platform gives a new branch:

|                           | Neon                                                                     | Supabase                                                                                                                                                        |
| :------------------------ | :----------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| How the branch is created | Copy-on-write: the branch shares the parent's data, so nothing is copied | A new Supabase instance, created as a clone of the production project. With **Include data**, production data is copied into it, and image files are not copied |
| Image files               | Every bucket and object from the parent, copy-on-write                   | Empty. Files have to be uploaded again                                                                                                                          |
| Database rows             | All rows from the parent, copy-on-write                                  | Empty by default. **Include data** needs the PITR add-on ($100 a month)                                                                                         |

On Neon, the whole setup is one command:

```bash
neon branches create --name preview/new-thumbnails
```

On Supabase, a branch's Storage starts empty, so you need a seed script that copies files from production into the branch. Every file it downloads counts as egress on the production organization.

### Egress

Every image a browser downloads counts as egress on both platforms. On Neon, each project gets its own allowance. On Supabase, every project in the organization shares one.

|             | Neon                                                   | Supabase                                                                              |
| :---------- | :----------------------------------------------------- | :------------------------------------------------------------------------------------ |
| Free plan   | 5 GB per project                                       | 5 GB uncached and 5 GB cached per organization                                        |
| Paid plan   | 500 GB per project, then $0.10/GB                      | 250 GB cached, then $0.03/GB, and 250 GB uncached, then $0.09/GB, per organization    |
| Shared with | Postgres, Object Storage, and Functions in the project | Database, Auth, Storage, Edge Functions, Realtime, and Log Drains in the organization |

The gap grows with every project you add. Take a team that runs several apps, or gives each large customer its own project, where each project serves 400 GB of images a month:

| Projects | Images served | Neon (Launch) | Supabase (Pro), all uncached        | Supabase (Pro), all cached         |
| :------- | :------------ | :------------ | :---------------------------------- | :--------------------------------- |
| 1        | 400 GB        | **$0**        | (400 − 250) × $0.09 = **$13.50**    | (400 − 250) × $0.03 = **$4.50**    |
| 5        | 2,000 GB      | **$0**        | (2,000 − 250) × $0.09 = **$157.50** | (2,000 − 250) × $0.03 = **$52.50** |

With five projects, images cost $0 to serve on Neon and up to $157.50 a month on Supabase.

## Cost comparison by use case

Per-GB rates only tell part of the story, so here are three common use cases with the cheapest plan on each platform that covers them. The totals cover storing, serving, and copying images, and leave out the compute for your production database.

### A side project with photo uploads

Take a side project that stores 3 GB of user photos and serves 4 GB of them a month:

| Platform | Plan | Plan fee | Storage | Egress | Monthly total |
| :------- | :--- | :------- | :------ | :----- | :------------ |
| Neon     | Free | $0       | $0      | $0     | **$0**        |
| Supabase | Pro  | $25.00   | $0      | $0     | **$25.00**    |

<details>
<summary>Curious how each total is calculated?</summary>

- **Neon:** the Free plan includes 5 GB of Object Storage and 5 GB of egress per project, so 3 GB stored and 4 GB served cost $0.
- **Supabase:** the Free plan includes 1 GB of Storage for the whole organization, so 3 GB needs the Pro plan at $25 a month. The 3 GB and 4 GB then fit inside Pro's 100 GB of Storage and 250 GB of egress.

</details>

A side project with photo uploads costs nothing on Neon, while Supabase needs the $25 Pro plan as soon as the photos pass 1 GB.

### A marketplace serving listing photos

Take a marketplace in one project with 200 GB of listing photos, serving 400 GB of them a month. The photos are public, so on Supabase, assume every view is a CDN cache hit, which is its cheapest egress rate:

| Platform | Plan   | Plan fee | Storage | Egress | Monthly total |
| :------- | :----- | :------- | :------ | :----- | :------------ |
| Neon     | Launch | $0       | $4.60   | $0     | **$4.60**     |
| Supabase | Pro    | $25.00   | $2.13   | $4.50  | **$31.63**    |

<details>
<summary>Curious how each total is calculated?</summary>

- **Neon:** storage is 200 GB × $0.023 = $4.60. The 400 GB served fits inside the 500 GB included per project, so egress is $0.
- **Supabase:** the Pro plan is $25. Storage is (200 GB − 100 GB included) × $0.0213 = $2.13. Cached egress is (400 GB − 250 GB included) × $0.03 = $4.50.

</details>

The marketplace costs $4.60 a month on Neon against $31.63 on Supabase.

### An agent that tests changes to the image pipeline

Take an AI agent that tests changes to an image pipeline, such as regenerating thumbnails: 5 runs a workday for 22 workdays, one hour each. Each run needs its own copy of the `photos` table and its 20 GB of images, and each copy is deleted when the run ends:

| Platform | Plan              | How each run gets its rows and images                                        | What you pay for                                                                                   | Monthly total |
| :------- | :---------------- | :--------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------- | :------------ |
| Neon     | Launch            | Branch the project, copy-on-write                                            | 0.25 CU of compute for 110 run-hours at $0.106/CU-hour. Branching the rows and images is free.     | **$2.92**     |
| Supabase | Pro + PITR add-on | Branch with **Include data**, then re-upload 20 GB of images from production | $100 PITR add-on, branch compute for 110 run-hours ($2.27), and 2,200 GB of cached egress ($58.50) | **$160.77**   |

<details>
<summary>Curious how each total is calculated?</summary>

- **Neon:** 0.25 CU × 110 run-hours × $0.106/CU-hour = $2.92. Branching the rows and objects is copy-on-write, so there's no copy charge and nothing leaves the project as egress. Production plus one run branch fits in the Launch plan's 10 included branches.
- **Supabase:** the runs are added to an existing Pro project, so the $25 plan fee isn't counted here. Copying rows into a branch with **Include data** needs the PITR add-on at $100 a month. A branch created with **Include data** matches the project's compute size, so branch compute is 110 run-hours × $0.0206 = $2.27. Branches start with empty Storage, so each run downloads the 20 GB from production and uploads it again: 110 × 20 GB = 2,200 GB of cached egress, and (2,200 GB − 250 GB) × $0.03 = $58.50. Total: $100 + $2.27 + $58.50 = $160.77.

</details>

So the agent's runs cost $2.92 a month on Neon against $160.77 on Supabase, because a Neon branch gets the rows and images through copy-on-write, while a Supabase branch needs the PITR add-on and a fresh copy of every image.

## Frequently asked questions

<Faq>

<FaqItem question="Can you store images in Postgres?">

Yes. A `bytea` column holds up to 1 GB per value, and you write an image with a normal `INSERT`. It works well for a few small images, like icons or signatures. For user uploads and anything that keeps growing, store the image in object storage and save its key in Postgres.

</FaqItem>

<FaqItem question="Should I use bytea or large objects for images?">

Use `bytea`. Large objects are only useful when you need to stream or seek through very large files, and deleting a row doesn't delete its large object.

</FaqItem>

<FaqItem question="Can I store images as base64 in Postgres?">

You can, but a base64 string in a `text` column is about a third larger than the raw bytes. If you store images in Postgres, use `bytea`.

</FaqItem>

<FaqItem question="Do Neon branches include the images in Object Storage?">

Yes. A new branch gets every row and every object from its parent at the same point in time, copy-on-write, so nothing is copied and testing against real images costs no egress.

</FaqItem>

</Faq>
