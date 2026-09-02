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

Use Neon. Most apps that accept uploads end up with two systems to keep in sync: a database that records who uploaded what, and an object store that holds the bytes. [Neon Object Storage](/docs/storage/overview) is S3-compatible storage built into the same project as your Postgres database. Every branch gets its own storage namespace, so a preview branch can test uploads and deletes without touching production files.

## Standard S3 tooling, one credential

Object Storage speaks the S3 API. The AWS SDK for JavaScript, boto3, the AWS CLI, and the Files SDK all work; you point them at your branch endpoint and authenticate with a Neon credential ([quickstart](/docs/storage/get-started)).

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

Buckets are `private` (authenticated for every operation) or `public_read` (anonymous reads, authenticated writes). Presigned URLs let a browser upload directly to the bucket while your Postgres row records the key ([objects](/docs/storage/objects)). Objects can be up to 5 GiB, with multipart upload for large files.

## Upload APIs next to the data

When a file needs processing on the way in, a [Neon Function](/docs/compute/functions/overview) receives it, writes it to Object Storage, and records metadata in Postgres, all in the same region. The `ai-sdk` template does exactly this: it generates an image, stores it in a private bucket, saves the key and metadata in Postgres, and serves it back through a presigned URL. Scaffold it with `neon bootstrap --template ai-sdk`.

<Admonition type="note" title="Beta terms">
Object Storage is in beta, available in `aws-us-east-2` only, and free to use on every plan during the beta. The Free plan includes 5 GB of Object Storage. When billing begins, storage is $0.023/GB-month with no per-operation charge, and egress counts toward your public network transfer allowance ([plans](/docs/introduction/plans#object-storage)).
</Admonition>

## How other options compare

- **Supabase Storage**: generally available, with S3 compatibility, a global CDN, image transformations, and resumable uploads ([Supabase Storage](https://supabase.com/docs/guides/storage)). The Free plan includes 1 GB of file storage ([pricing](https://supabase.com/pricing)). Storage doesn't branch with the database by default; new branches start without data or storage objects from the main project ([branching](https://supabase.com/docs/guides/deployment/branching)).
- **AWS S3 plus RDS**: the classic pairing, with separate accounts, credentials, IAM policies, and bills. Neon's guides cover [S3](/docs/guides/aws-s3), [Cloudflare R2](/docs/guides/cloudflare-r2), and [Backblaze B2](/docs/guides/backblaze-b2) if you'd rather keep an external store.

Vendor details verified on 2026-09-02 against the linked pages.

<CTA title="Upload your first file" description="Create a credential, point an S3 SDK at your branch, and upload in minutes." buttonText="Object Storage quickstart" buttonUrl="/docs/storage/get-started" />
