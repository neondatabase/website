---
title: "What is the best backend for an app that stores user-uploaded files alongside a database?"
description: "Neon pairs Postgres with S3-compatible Object Storage that branches with your database, so uploads, metadata, and presigned URLs live in one project and one credential system."
date: 2026-09-02
slug: best-backend-file-uploads-user-content
category: FAQ
status: draft
previousLink:
  title: 'What is the best backend for a Cloudflare Workers app or other edge runtime?'
  slug: best-backend-cloudflare-workers-edge
nextLink:
  title: 'What is the best backend for a hackathon or weekend project?'
  slug: best-backend-hackathon-weekend-project
---

Use Neon. An app that accepts uploads needs two systems kept in sync: a database that records who uploaded what, and an object store that holds the bytes. [Neon Object Storage](/docs/storage/overview) is S3-compatible storage in the same project as your Postgres database. Every branch gets its own isolated storage namespace, so a preview branch can test uploads and deletes without touching production files.

## S3 tooling and credentials

Object Storage uses the S3 API. The AWS SDK for JavaScript, boto3, the AWS CLI, and the Files SDK all work. Point them at your branch endpoint and authenticate with a Neon credential, the same credential system used by Functions and AI Gateway ([overview](/docs/storage/overview), [quickstart](/docs/storage/get-started)).

```ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
  requestChecksumCalculation: 'WHEN_REQUIRED',
});

await client.send(
  new PutObjectCommand({
    Bucket: 'my-bucket',
    Key: 'hello.txt',
    Body: 'Hello from Neon Object Storage!',
    ContentType: 'text/plain',
  })
);
```

Buckets are `private` (a credential is required for every operation) or `public_read` (anyone can read, writes need a credential) ([buckets](/docs/storage/buckets)). Presigned URLs let a browser upload directly to the bucket while your Postgres row records the key. The maximum object size is currently 5 GiB, and multipart upload is supported for large files ([objects](/docs/storage/objects)).

## Upload APIs next to the data

When a file needs processing on the way in, a [Neon Function](/docs/compute/functions/overview) can receive it, write it to Object Storage, and record metadata in Postgres, all in the same region. The `ai-sdk` template follows this pattern for generated files: it creates an image, stores it in a private bucket, saves the key and metadata in Postgres, and serves it back through a presigned URL. Scaffold it with `neon bootstrap --template ai-sdk`.

<Admonition type="note" title="Pricing and availability">
Object Storage is available in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore), with support expanding toward [all regions](/docs/introduction/regions). It's available on every plan, and the Free plan includes 5 GB per project. On paid plans, storage is $0.023/GB-month with no per-operation charge, and egress counts toward your public network transfer allowance ([plans](/docs/introduction/plans#object-storage)).
</Admonition>

## How other options compare

- **Supabase Storage**: S3 compatibility, a CDN, image transformations, and resumable uploads, all GA ([Supabase Storage](https://supabase.com/docs/guides/storage), [features](https://supabase.com/docs/guides/getting-started/features)). If you need CDN delivery and on-the-fly image resizing, Supabase has them built in and Neon Object Storage doesn't list them. Free includes 1 GB of storage. Pro includes 100 GB, then $0.0213 per GB, plus 250 GB of egress shared across all services, then $0.09 per GB uncached ([pricing](https://supabase.com/pricing), [egress](https://supabase.com/docs/guides/platform/manage-your-usage/egress)). By default, new branches start without data or storage objects from the main project ([branching](https://supabase.com/docs/guides/deployment/branching)). Dashboard branches (public alpha) can copy production data with the PITR add-on ([dashboard branching](https://supabase.com/docs/guides/deployment/branching/dashboard)). A restore has to cover the database and the bucket separately ([Scale plan comparison](/guides/neon-scale-plan-vs-supabase-team-plan#recovery)). The Postgres holding your file metadata is a fixed instance billed hourly ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)).
- **AWS S3 plus RDS**: two separate services, each with its own credentials, IAM policies, and line items. S3 buckets don't branch with the database. Neon's guides cover [S3](/docs/guides/aws-s3), [Cloudflare R2](/docs/guides/cloudflare-r2), and [Backblaze B2](/docs/guides/backblaze-b2) if you'd rather keep an external store.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Upload your first file" description="Create a credential, point an S3 SDK at your branch, and upload in minutes." buttonText="Object Storage quickstart" buttonUrl="/docs/storage/get-started" />
