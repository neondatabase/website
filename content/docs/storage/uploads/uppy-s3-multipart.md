---
title: Resumable uploads with Uppy and a signing endpoint
subtitle: Upload from the browser directly to Neon, with your backend presigning each request
summary: >-
  Use @uppy/aws-s3 with a signRequest callback to upload files from the browser to
  Neon Object Storage with S3 multipart upload. Your backend presigns each request,
  so credentials never reach the browser. Covers pause, resume, retry, cancel,
  parallel uploads, small-file PUTs, and POST policies.
enableTableOfContents: true
updatedOn: '2026-11-25T17:45:27.914Z'
---

This is the recommended way to add resumable uploads to a web app. The browser uploads file parts directly to your Neon bucket. Your backend has one route that presigns each S3 request Uppy needs, so your Neon credential stays on the server and you decide which keys a user may write.

Uploads resume after a pause or network drop without re-sending stored parts. To also resume after a page reload, add [Golden Retriever](/docs/storage/uploads/uppy-golden-retriever).

<Admonition type="note">
This guide uses the `signRequest` option from `@uppy/aws-s3` 6. Earlier versions of the plugin use separate callbacks such as `createMultipartUpload` and `signPart`. See the [Uppy 6 migration guide](https://uppy.io/docs/guides/migration-guides/#migrate-from-uppy-5x-to-6x) if you're upgrading.
</Admonition>

## Prerequisites

- A [bucket](/docs/storage/buckets) and a [credential](/docs/storage/authentication) with the `storage:write` scope
- A [CORS rule](/docs/storage/uploads/resumable-uploads#cors-configuration-for-browser-uploads) on the bucket that allows your app's origin and exposes `ETag`

<Steps>

## Package installation

```bash
npm install @uppy/core @uppy/aws-s3 @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## S3 client configuration

On your server, point the AWS SDK at your branch's storage endpoint. `neon env pull` writes these variables for you. See [Get started](/docs/storage/get-started) for details.

```typescript filename="s3.ts" shouldWrap
import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: true, // Neon uses path-style addressing only
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  // Keep empty-body checksums out of presigned URLs
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});
```

## Signing route

Uppy calls `signRequest` with one request at a time, such as "create a multipart upload for this key" or "upload part 3". The route maps each request to the matching S3 command and returns a presigned URL. This example uses Express, but any framework works.

```typescript filename="server.ts" collapse={1-15} shouldWrap
import express from 'express';
import {
  PutObjectCommand,
  DeleteObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  ListPartsCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from './s3';

const Bucket = process.env.BUCKET!;
const app = express();

app.post('/api/uploads/sign', express.json(), async (req, res) => {
  const { method, key: Key, uploadId: UploadId, partNumber: PartNumber, contentType } = req.body;

  // Authorize here: check that the signed-in user may write this key.

  let command;
  let headers: Record<string, string> | undefined;
  if (method === 'POST' && !UploadId) {
    command = new CreateMultipartUploadCommand({ Bucket, Key });
  } else if (method === 'PUT' && UploadId) {
    command = new UploadPartCommand({ Bucket, Key, UploadId, PartNumber });
  } else if (method === 'GET' && UploadId) {
    command = new ListPartsCommand({ Bucket, Key, UploadId }); // used to resume
  } else if (method === 'POST' && UploadId) {
    command = new CompleteMultipartUploadCommand({ Bucket, Key, UploadId });
  } else if (method === 'DELETE' && UploadId) {
    command = new AbortMultipartUploadCommand({ Bucket, Key, UploadId }); // used on cancel
  } else if (method === 'PUT') {
    command = new PutObjectCommand({ Bucket, Key, ContentType: contentType }); // small files
    if (contentType) headers = { 'Content-Type': contentType };
  } else if (method === 'DELETE') {
    command = new DeleteObjectCommand({ Bucket, Key });
  } else {
    return res.status(400).json({ error: 'Unsupported request' });
  }

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  res.json(headers ? { url, headers } : { url });
});
```

If you sign `PutObject` with a `Content-Type`, return the same header in `headers`, because the browser must send exactly the headers the URL was signed with. For multipart uploads, Uppy sends the file's type as a `Content-Type` header when it creates the upload, and Neon stores it on the object.

<Admonition type="warning">
The route signs whatever key the browser sends. Before you sign, check that the current user is allowed to write that key, for example by requiring keys to start with the user's ID. Without a check, any visitor can overwrite any object in the bucket.
</Admonition>

## Uppy configuration

In the browser, point the plugin at your signing route.

```typescript filename="uploader.ts" collapse={1-4} shouldWrap
import Uppy from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';

const MiB = 1024 * 1024;

export const uppy = new Uppy().use(AwsS3, {
  // Multipart for files over 100 MiB by default. Pass true to always use it.
  shouldUseMultipart: (file) => (file.size ?? 0) > 20 * MiB,
  getChunkSize: () => 5 * MiB, // every part except the last must be at least 5 MiB
  limit: 6, // files uploading at once
  signRequest: async (request) => {
    const res = await fetch('/api/uploads/sign', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error(`Signing failed: ${res.status}`);
    return res.json();
  },
});

uppy.on('upload-success', (file, response) => {
  console.log('Stored as', response.body?.key);
});
```

By default, Uppy names objects `{randomId}-{filename}`. Pass `generateObjectKey: (file) => ...` to choose your own keys.

## User interface and file upload

Add a file to Uppy and start the upload. To get a drag-and-drop UI with pause, resume, and retry buttons, add [`@uppy/dashboard`](https://uppy.io/docs/dashboard/) instead.

```typescript shouldWrap
uppy.addFile({ name: file.name, type: file.type, data: file });
await uppy.upload();
```

</Steps>

## Pause, resume, retry, and cancellation

All of these work without extra server code:

```typescript shouldWrap
uppy.pauseResume(fileId); // toggle one file
uppy.pauseAll();
uppy.resumeAll();
uppy.retryAll(); // after a failure, such as a network drop
uppy.cancelAll(); // also aborts the multipart upload in Neon
```

Here's what happens in Neon for each one:

- **Resume:** calls `ListParts`, then uploads only the parts Neon doesn't have yet.
- **Network drop:** The part in flight when the connection drops fails. After `retryAll()`, Uppy reuses the same multipart upload and re-sends only that part.
- **Cancel:** signs an `AbortMultipartUpload`, so Neon discards the stored parts and no object is created.

Uppy keeps the upload state (`uploadId` and `key`) on the file, at `uppy.getFile(fileId).s3Multipart`. It's lost on page reload unless you add [Golden Retriever](/docs/storage/uploads/uppy-golden-retriever).

## Concurrent file uploads

`limit` sets how many files upload at the same time. Each file sends its parts one after another.

## Size and type enforcement with POST policies

For small files sent in one request, your route can return an [S3 POST policy](https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html) instead of a presigned PUT. Return `fields` and Uppy sends a `multipart/form-data` POST. Neon checks the policy's conditions when the browser uploads: a file over the `content-length-range` limit returns `400`, a file with a different `Content-Type` returns `403`, and neither is stored.

```bash
npm install @aws-sdk/s3-presigned-post
```

```typescript filename="server.ts" shouldWrap
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

app.post('/api/uploads/sign-post', express.json(), async (req, res) => {
  const { method, key: Key, contentType, uploadId } = req.body;
  // POST policies only apply to single-request uploads
  if (method !== 'PUT' || uploadId) return res.status(400).json({ error: 'Unsupported request' });

  const { url, fields } = await createPresignedPost(s3, {
    Bucket,
    Key,
    Fields: contentType ? { 'Content-Type': contentType } : {},
    Conditions: [
      ['content-length-range', 0, 50 * 1024 * 1024], // up to 50 MiB
      ...(contentType ? [{ 'Content-Type': contentType }] : []),
    ],
    Expires: 600,
  });
  res.json({ url, fields });
});
```

On the client, set `shouldUseMultipart: false` and point `signRequest` at this route. POST policies aren't resumable, so use them for files small enough to re-send.

## Next steps

- [Recover uploads after a reload](/docs/storage/uploads/uppy-golden-retriever)
- [Abandoned upload cleanup](/docs/storage/uploads/resumable-uploads#abandoned-upload-cleanup)
- [Run a function when an upload completes](/docs/compute/functions/triggers/object-storage)

<NeedHelp/>
