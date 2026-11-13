---
title: Object Storage for TanStack Start and Router
subtitle: Store user uploads in Neon Object Storage from TanStack Start server functions
summary: >-
  Add file uploads to a TanStack Start or TanStack Router app with Neon Object
  Storage, S3-compatible storage that branches with your database. Covers declaring
  buckets in neon.ts, the injected AWS environment variables, presigned upload and
  download URLs from createServerFn, storing object keys in Postgres, and serving
  public assets behind a CDN.
enableTableOfContents: true
noindex: true
updatedOn: '2026-11-13T06:34:29.829Z'
---

[Neon Object Storage](/docs/storage/overview) is S3-compatible file storage that branches with your database: a preview branch gets its own copy of the files and the rows that point at them. Use it for files your app and its users produce, such as uploads, avatars and documents. App assets like JS bundles and images in `public/` belong on your frontend host.

The pattern for TanStack is the same with or without Start: a server function (or any backend endpoint) signs a short-lived upload URL, the browser uploads the file straight to the bucket, and Postgres stores the object key.

## Before you begin

- Object Storage is available in `aws-us-east-2`, `aws-us-east-1`, `aws-eu-central-1` and `aws-ap-southeast-1`. Check that your Neon project is in one of these regions.
- A TanStack Router single-page app needs a backend to sign URLs, because S3 credentials can't reach the browser. A TanStack Start server function or a [Neon Function](/docs/compute/functions/overview) works.

## Declare a bucket

```ts filename="neon.ts"
import { defineConfig } from '@neon/config/v1';

export default defineConfig({
  buckets: {
    uploads: {}, // private by default
  },
});
```

```bash filename="Terminal"
neon deploy
```

`neon deploy` creates the bucket on the linked branch and writes the branch's S3 credentials to `.env.local`:

| Variable                | Meaning                         |
| ----------------------- | ------------------------------- |
| `AWS_ACCESS_KEY_ID`     | S3 access key ID                |
| `AWS_SECRET_ACCESS_KEY` | S3 secret access key            |
| `AWS_ENDPOINT_URL_S3`   | The branch's S3 endpoint        |
| `AWS_REGION`            | Region, for example `us-east-2` |

The AWS SDK reads these from the environment. Keep them server-only.

## Sign upload and download URLs

```bash filename="Terminal"
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

```ts filename="src/storage.server.ts"
import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  // Neon Object Storage requires path-style addressing.
  forcePathStyle: true,
  // Recent SDK versions embed a checksum of the empty body in presigned PUT
  // URLs, which rejects any upload with real content.
  requestChecksumCalculation: 'WHEN_REQUIRED',
});
export const BUCKET = 'uploads';
```

```ts filename="src/uploads.functions.ts"
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

import { requireUser } from './auth.functions';
import { BUCKET, s3 } from './storage.server';

export const createUploadUrl = createServerFn({ method: 'POST' })
  .middleware([requireUser])
  .validator(z.object({ contentType: z.string() }))
  .handler(async ({ data, context }) => {
    const key = `users/${context.user.id}/${crypto.randomUUID()}`;
    const url = await getSignedUrl(
      s3,
      new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: data.contentType }),
      { expiresIn: 300 }
    );
    return { key, url };
  });

export const getDownloadUrl = createServerFn({ method: 'POST' })
  .middleware([requireUser])
  .validator(z.object({ key: z.string() }))
  .handler(async ({ data, context }) => {
    if (!data.key.startsWith(`users/${context.user.id}/`)) throw new Error('Forbidden');
    return getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: data.key }), {
      expiresIn: 3600,
    });
  });
```

Upload from the browser with the signed URL:

```tsx filename="src/components/upload-button.tsx"
import { createUploadUrl } from '../uploads.functions';

export function UploadButton({ onUploaded }: { onUploaded: (key: string) => void }) {
  return (
    <input
      type="file"
      onChange={async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const { key, url } = await createUploadUrl({ data: { contentType: file.type } });
        const response = await fetch(url, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });
        if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
        onUploaded(key);
      }}
    />
  );
}
```

- Store the object key in a Postgres column, not the bytes or a signed URL. Sign a download URL on read.
- Generate the key on the server and scope it to the user, so a client can't overwrite another user's object.
- The [Files SDK](https://files-sdk.dev) `neon` adapter wraps the same calls (`upload`, `download`, `url`, `signedUploadUrl`) if you prefer it to the AWS SDK.

## Public assets

A `public_read` bucket serves objects anonymously at `${AWS_ENDPOINT_URL_S3}/<bucket>/<key>`. For assets a page loads on every view, such as avatars, put a CDN in front of that origin, set `Cache-Control` when you upload, and write each version to a new key rather than overwriting one.

```ts filename="neon.ts"
buckets: {
  avatars: { access: 'public_read' },
},
```

## Branches

Buckets are branch-scoped. A branch created from production starts with production's objects, copy-on-write, and writes on the branch never touch the parent. A preview deployment that uses its branch's `AWS_*` variables gets the files and rows from the same point in time.

---

## Related docs (TanStack)

- [Postgres with Drizzle for TanStack Start](/docs/tanstack/postgres-drizzle)
- [Neon Auth with TanStack Start and Router](/docs/tanstack/auth)
- [Object Storage overview](/docs/storage/overview)
- [Branching](/docs/introduction/branching)
