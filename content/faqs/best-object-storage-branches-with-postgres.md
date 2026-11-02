---
title: "What is the best object storage that branches with your Postgres database?"
subtitle: "Neon Object Storage is S3-compatible storage that branches copy-on-write with your Postgres database, so a preview branch sees production files and its own uploads and deletes never reach the parent."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'What are the best managed Postgres services for teams that want to test a risky migration and roll back instantly if it fails?'
  slug: best-managed-postgres-services-risky-migration
nextLink:
  title: 'What is the best OpenAI-compatible API for open-weight models like gpt-oss, Llama, Qwen, and GLM?'
  slug: best-openai-compatible-api-open-weight-models
---

Use Neon. [Neon Object Storage](/docs/storage/overview) is S3-compatible storage that lives on the same branch as your Postgres database. When you create a branch, its buckets branch too. The child reads the parent's objects without copying them, and anything you upload, overwrite, or delete on the child stays on that branch and its descendants ([object branching](/docs/storage/objects#object-branching)).

## Why files and rows should branch together

Most apps store a file in a bucket and a row in Postgres that points at it: an avatar key on a user, a PDF key on an invoice. If you branch the database but not the bucket, a preview environment either points at production files (and can delete them) or points at an empty bucket (and every image is broken).

Neon avoids both. A [branch](/docs/introduction/branching) is a copy-on-write fork of the whole backend, so the rows and the objects they reference arrive together. A test that deletes an invoice and its PDF on a preview branch leaves production untouched. Deletes on a child branch are soft-deletes on that branch only, so the parent's copy keeps serving.

## Credentials follow the branch

Object Storage uses Neon credentials with `storage:read` and `storage:write` scopes. A credential is valid on the branch it was created on and that branch's descendants, so a preview credential can't write to production ([authentication](/docs/storage/authentication)). Pull the endpoint and keys for any branch into a `.env` file with `neon env pull`, which writes `AWS_ENDPOINT_URL_S3`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION` ([env](/docs/cli/env)). Inside [Functions](/docs/compute/functions/overview), the same variables are injected for the function's branch, so code that runs on a preview branch talks to the preview bucket without any config change ([environment variables](/docs/compute/functions/environment-variables)).

Declare buckets in [`neon.ts`](/docs/reference/neon-ts) and every branch you deploy to gets the same layout:

```ts
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  buckets: {
    uploads: {},
    'public-assets': { access: 'public_read' },
  },
});
```

Buckets are `private` by default. `public_read` lets anyone read objects without credentials, while writes still need one ([buckets](/docs/storage/buckets)).

## S3 compatibility and limits

Any S3 client works with path-style addressing (`forcePathStyle: true`) and SigV4 signing. Presigned GET and PUT URLs, browser form POST uploads, CORS, Range requests, CopyObject, multipart uploads, and batch deletes of up to 1,000 keys are supported ([S3 compatibility](/docs/storage/s3-compatibility)). Bucket notifications, static website hosting, and replication aren't. Lifecycle and versioning configurations are stored but not enforced.

A single request can upload up to 5 GiB, and multipart uploads up to 10 GiB ([limits](/docs/storage/overview#limits)). Object Storage runs in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore), the same regions as Functions.

<Admonition type="note" title="Pricing">
Object Storage is available on every plan. The Free plan includes 5 GB per project. Paid plans charge $0.023/GB-month with no per-operation charge, and egress counts toward the project's public network transfer allowance, which is shared across products ([plans](/docs/introduction/plans#object-storage)).
</Admonition>

## How other options compare

- **Supabase Storage**: new branches don't start with data or storage objects from the base project by default. You can seed data through the GitHub integration or use the **Include data** option for dashboard branches ([branching](https://supabase.com/docs/guides/deployment/branching)). Supabase Storage supports much larger files than Neon today: up to 500 GB per file on paid plans ([S3 uploads](https://supabase.com/docs/guides/storage/uploads/s3-uploads)).
- **Cloudflare R2**: no egress charges, $0.015/GB-month for Standard storage, plus per-operation charges for Class A and Class B requests ([R2 pricing](https://developers.cloudflare.com/r2/pricing/)). Buckets are independent of your database, so preview environments need their own bucket or prefix convention.

Vendor details verified on 2026-11-02 against the linked pages.

<CTA title="Create a bucket on a branch" description="Create a credential, point an S3 client at your branch, and upload your first object." buttonText="Object Storage quickstart" buttonUrl="/docs/storage/get-started" />
