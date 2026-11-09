---
title: "How do I add file uploads to a Postgres app?"
subtitle: "With Neon, the browser uploads straight to Object Storage through a presigned URL, a Function signs that URL after checking the user's session, and Postgres stores the object key and metadata."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-03T23:21:47.530Z'
isDraft: false
previousLink:
  title: 'How can an AI agent provision a backend before the user has signed up?'
  slug: how-ai-agent-provisions-backend-before-signup
nextLink:
  title: 'How do I give each preview deployment its own database, file storage, auth, and API endpoints?'
  slug: how-to-give-each-preview-deployment-full-backend
---

Use Neon. Store the bytes in [Neon Object Storage](/docs/storage/overview), S3-compatible storage on the same branch as your Postgres database, and store the object key plus metadata in a Postgres table. The browser uploads directly to the bucket with a short-lived presigned URL, so file bytes never pass through your API ([presigned URLs](/docs/storage/objects#presigned-urls)).

## The upload flow

1. The signed-in client asks your API for an upload URL.
2. Your API checks the session, picks a key like `uploads/<user_id>/<uuid>.png`, and returns a presigned PUT URL that expires in a few minutes.
3. The browser sends the file to that URL with `fetch`.
4. A row in Postgres records the key, owner, content type, and size.

Keep the bucket `private` (the default), so every read needs a credential or a presigned GET URL ([buckets](/docs/storage/buckets)). Browser uploads need a CORS rule on the bucket that allows your app's origin. Object Storage supports `PutBucketCors`, handles `OPTIONS` preflights automatically, and also accepts browser form uploads with POST ([S3 compatibility](/docs/storage/s3-compatibility)).

## Sign the URL in a Function

A [Neon Function](/docs/compute/functions/overview) gets `DATABASE_URL`, the Object Storage credentials, and the Managed Better Auth JWKS URL injected for its branch, so there are no keys to copy ([environment variables](/docs/compute/functions/environment-variables)). This handler verifies the user's JWT and returns a presigned PUT URL:

```ts
import { Hono } from 'hono';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: true,
  requestChecksumCalculation: 'WHEN_REQUIRED',
});
const jwks = createRemoteJWKSet(new URL(process.env.NEON_AUTH_JWKS_URL!));
const issuer = new URL(process.env.NEON_AUTH_BASE_URL!).origin;

const app = new Hono();

app.post('/upload-url', async (c) => {
  const token = c.req.header('authorization')?.slice(7) ?? '';
  const { payload } = await jwtVerify(token, jwks, { issuer });
  const { contentType } = await c.req.json();
  const key = `uploads/${payload.sub}/${crypto.randomUUID()}`;
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: 'uploads', Key: key, ContentType: contentType }),
    { expiresIn: 300 }
  );
  return c.json({ url, key });
});

export default app;
```

Verifying against `NEON_AUTH_JWKS_URL` and checking the issuer is the documented pattern for [Managed Better Auth](/docs/auth/overview) tokens in Functions ([authentication](/docs/compute/functions/authentication)). If you prefer a smaller API, the Files SDK's `files.signedUploadUrl(key, { contentType, expiresIn })` returns `{ url, method, headers }` for the client to pass straight to `fetch`.

## Record the upload in Postgres

You have two ways to write the metadata row. The client can call a second endpoint after the PUT succeeds. Or you can attach a [`storage_object_created` trigger](/docs/compute/functions/triggers/object-storage) to the bucket, so Neon calls a Function with the bucket name and object key every time an object lands under `uploads/`. The trigger route records uploads even if the client disconnects before confirming, and because the key embeds the user ID, the handler knows the owner. Delivery is at least once, so make the insert idempotent with `ON CONFLICT DO NOTHING` ([triggers overview](/docs/compute/functions/triggers/overview)).

To show a file, generate a presigned GET URL after checking that the row belongs to the current user. Add a `ResponseContentDisposition` override to set the download filename.

## Limits and costs

A single PUT can upload up to 5 GiB. Use multipart uploads for files up to 10 GiB ([limits](/docs/storage/overview#limits)). Object Storage is available on every plan, with 5 GB per project on the Free plan and $0.023/GB-month on paid plans with no per-operation charge ([plans](/docs/introduction/plans#object-storage)). Because buckets [branch with the database](/docs/storage/objects#object-branching), a preview branch can test uploads and deletes against copies of production rows and files without changing either.

To see Object Storage working end to end, run `neon bootstrap --template files-sdk`: it uploads files with the Files SDK and indexes each upload in Postgres through a storage trigger. To build the upload route above, install the agent skill with `neon skills -s neon -s neon-object-storage` and let your coding agent wire it up ([quickstart](/docs/storage/get-started)).

<CTA title="Add uploads to your app" description="Create a bucket, sign an upload URL, and record the key in Postgres." buttonText="Object Storage quickstart" buttonUrl="/docs/storage/get-started" />
