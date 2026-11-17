---
title: "How do I get S3-compatible storage without an AWS account?"
subtitle: "Neon Object Storage speaks the S3 API, so the AWS SDK, boto3, and the AWS CLI work against a Neon endpoint with Neon credentials, no AWS account or IAM setup required."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-13T22:54:32.784Z'
isDraft: false
previousLink:
  title: 'What is the best way to run code automatically when a file is uploaded?'
  slug: run-code-when-file-uploaded
nextLink:
  title: 'Is it safe to connect Claude Code or Cursor to my production database?'
  slug: safe-connect-claude-code-cursor-production-database
---

Use Neon. [Neon Object Storage](/docs/storage/overview) is S3-compatible storage that comes with every Neon project in a supported region. You sign up for Neon, create a bucket, and point your existing S3 code at a Neon endpoint. There's no AWS account, IAM user, or bucket policy to set up. Credentials are Neon credentials, the same system that covers Functions and AI Gateway ([authentication](/docs/storage/authentication)).

## Create a bucket and a credential

From the CLI, create a bucket and pull the connection details into your `.env` file:

```bash
neon buckets create my-bucket
neon env pull
```

`neon env pull` writes `AWS_ENDPOINT_URL_S3`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION` for the current branch ([env](/docs/cli/env)). Because those are the standard AWS variable names, your S3 code reads them like any AWS config. You can also create buckets in the Console or the API, or declare them in [`neon.ts`](/docs/reference/neon-ts#buckets) ([buckets](/docs/storage/buckets)).

Credentials have `storage:read` and `storage:write` scopes. A credential's `token_id` is the access key ID and its `s3_secret_access_key` is the secret. Rotate one with `neon credentials rotate` ([credentials CLI](/docs/cli/credentials)).

## Point your S3 client at Neon

Two settings matter: path-style addressing and SigV4 signing. Neon doesn't support virtual-hosted-style bucket URLs ([S3 compatibility](/docs/storage/s3-compatibility)).

```ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: true,
  requestChecksumCalculation: 'WHEN_REQUIRED',
});

await s3.send(
  new PutObjectCommand({ Bucket: 'my-bucket', Key: 'hello.txt', Body: 'hello' })
);
```

The `requestChecksumCalculation: 'WHEN_REQUIRED'` option comes from the [quickstart](/docs/storage/get-started): recent AWS SDK versions otherwise embed a checksum in presigned PUT URLs that rejects real uploads. For Python, pass the same endpoint to `boto3` as `endpoint_url`. The AWS CLI reads the credentials from the environment, and you pass `--endpoint-url` on each command. Inside a [Neon Function](/docs/compute/functions/overview), these variables are injected for the function's branch, so the same code runs with no `.env` file ([environment variables](/docs/compute/functions/environment-variables)).

## What works and what doesn't

Supported: `PutObject`, `GetObject`, `HeadObject`, `ListObjectsV2`, `CopyObject`, `DeleteObjects` (up to 1,000 keys), multipart uploads, Range requests, presigned GET and PUT URLs, browser form uploads, and CORS rules ([S3 compatibility](/docs/storage/s3-compatibility)).

Not supported, returning `501 Not Implemented`: bucket ACLs and bucket policies over the S3 API, event notifications, static website hosting, encryption configuration, and replication. Set a bucket's access level (`private` or `public_read`) in the Console or the Neon API instead of with `PutBucketAcl`. Lifecycle and versioning configurations are accepted and stored but not enforced, so don't rely on them to expire objects. To react to new uploads, use a [`storage_object_created` trigger](/docs/compute/functions/triggers/object-storage) instead of S3 event notifications.

A single request can upload up to 5 GiB, and multipart uploads up to 10 GiB. Under heavy load, Neon can return `503 SlowDown`, a rate-limit signal that AWS SDKs retry when retry logic is enabled ([limits](/docs/storage/overview#limits)).

## Regions and pricing

Object Storage runs in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore), with support expanding toward [all regions](/docs/introduction/regions). Neon runs on AWS infrastructure, so you get S3-compatible storage in AWS regions without managing an AWS account. It's available on every plan. The Free plan includes 5 GB per project, and paid plans charge $0.023/GB-month with no per-operation charge. Egress counts toward the project's public network transfer allowance ([plans](/docs/introduction/plans#object-storage)).

Your buckets also [branch with your Postgres database](/docs/storage/objects#object-branching), which a standalone S3 account can't do: a preview branch reads production objects, and its own writes and deletes stay on the branch.

## How other options compare

- **Cloudflare R2**: also S3-compatible with no AWS account. Storage is $0.015/GB-month for Standard, egress is free, and Class A and Class B operations are billed per million requests after a monthly free allowance ([R2 pricing](https://developers.cloudflare.com/r2/pricing/)).
- **Supabase Storage**: exposes an S3 endpoint with project access keys meant for server-side use only, since they bypass RLS. It also accepts a session token built from a user's JWT for RLS-scoped access ([S3 authentication](https://supabase.com/docs/guides/storage/s3/authentication)).

Vendor details verified on 2026-11-02 against the linked pages.

<CTA title="Upload your first object" description="Create a bucket, pull credentials, and use the S3 SDK you already know." buttonText="Object Storage quickstart" buttonUrl="/docs/storage/get-started" />
