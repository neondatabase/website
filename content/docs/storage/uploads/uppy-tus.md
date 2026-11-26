---
title: Resumable uploads with Uppy and tus
subtitle: Run a tus server that stores uploads in Neon Object Storage
summary: >-
  Use @uppy/tus with a tus server built on @tus/server and @tus/s3-store to upload
  files to Neon Object Storage over the tus resumable upload protocol. Upload state
  is stored in your Neon bucket, so uploads resume across tabs and server restarts.
enableTableOfContents: true
updatedOn: '2026-11-26T11:46:18.830Z'
---

[tus](https://tus.io) is an open protocol for resumable uploads. A tus client sends a file to a tus server in chunks, and on resume it asks the server how many bytes it already has. With [`@tus/s3-store`](https://github.com/tus/tus-node-server/tree/main/packages/s3-store), a Node.js tus server writes each upload to your Neon bucket with S3 multipart upload.

Unlike the other methods in this section, the file passes through your server: browser to tus server to Neon. Choose tus when:

- You want one upload endpoint for web, mobile, and other clients. Any tus client, such as `tus-js-client` or the iOS and Android tus libraries, can use the same server.
- You'd rather not expose your bucket to browsers. Neon only talks to your server, so the bucket needs no CORS rule.
- You want to inspect or limit uploads on your server as they arrive.

## Prerequisites

- Node.js 22 or later
- A [bucket](/docs/storage/buckets) and a [credential](/docs/storage/authentication) with the `storage:write` scope, for the tus server

<Steps>

## Install the packages

```bash
npm install @tus/server @tus/s3-store express
npm install @uppy/core @uppy/tus
```

## Configure the tus server

Configure `S3Store` with your branch's storage endpoint. `s3ClientConfig` is passed to the AWS SDK's `S3Client`, so it takes the same options as in [Get started](/docs/storage/get-started), plus the bucket name.

```typescript filename="server.ts" collapse={1-3,14-17} shouldWrap
import express from 'express';
import { Server } from '@tus/server';
import { S3Store } from '@tus/s3-store';

const tus = new Server({
  path: '/files',
  datastore: new S3Store({
    partSize: 5 * 1024 * 1024, // at least 5 MiB
    s3ClientConfig: {
      bucket: process.env.BUCKET!,
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT_URL_S3,
      forcePathStyle: true, // Neon uses path-style addressing only
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    },
  }),
  // Authorize each request here, for example by checking a session cookie
  onIncomingRequest: async (req) => {},
});

const app = express();
app.all('/files', (req, res) => tus.handle(req, res));
app.all('/files/*splat', (req, res) => tus.handle(req, res));
app.listen(3000);
```

The `/files/*splat` route is Express 5 syntax. With Express 4, use `/files/*`.

## Configure Uppy

```typescript filename="uploader.ts" shouldWrap
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';

export const uppy = new Uppy().use(Tus, {
  endpoint: '/files',
  chunkSize: 5 * 1024 * 1024,
  retryDelays: [0, 1000, 3000, 5000],
  removeFingerprintOnSuccess: true,
});
```

## Upload a file

```typescript shouldWrap
uppy.addFile({ name: file.name, type: file.type, data: file });
await uppy.upload();
```

</Steps>

## Resumption behavior

- **Pause and resume:** `uppy.pauseResume(fileId)` stops the upload. On resume, Uppy sends a `HEAD` request, the server reads the stored offset from Neon, and Uppy continues with a `PATCH` from that byte.
- **Network drop:** `@uppy/tus` retries with the delays in `retryDelays`.
- **Closed tab or browser:** `@uppy/tus` saves each upload's URL in `localStorage`, keyed by a fingerprint of the file. When the user adds the same file again, Uppy finds the saved URL and resumes instead of starting over. To restore the file list itself after a reload, add [Golden Retriever](/docs/storage/uploads/uppy-golden-retriever).
- **Server restart:** The tus server keeps no upload state in memory, so any instance can resume any upload.

## Objects stored by the tus server

For an upload with ID `<id>`, `@tus/s3-store` writes:

- `<id>`: the file itself, created with S3 multipart upload and completed when the last byte arrives.
- `<id>.info`: a small JSON object with the upload's ID, total size, tus metadata such as the filename and type, and creation date.
- `<id>.part`: while the upload is in progress, any leftover bytes smaller than `partSize`. This is how tus resumes from an exact byte offset even though S3 parts are at least 5 MiB.

To find the offset on resume, the store reads `<id>.info`, lists the stored parts with `ListParts`, and adds the size of `<id>.part`.

The upload URL ends in the ID, so with the defaults the object key is the last path segment of `response.uploadURL`.

## Additional considerations

- **Upload traffic passes through your server:** Provision the tus server for your expected upload bandwidth. To send files from the browser directly to Neon instead, use a [signing endpoint](/docs/storage/uploads/uppy-s3-multipart).
- **Reverse proxy configuration:** If the tus server runs behind a proxy, configure the proxy to forward the `Upload-Offset`, `Upload-Length`, `Tus-Resumable`, and `Location` headers and to stream request bodies without buffering them.
- **Incomplete uploads aren't removed automatically:** An upload that's never completed leaves a multipart upload and its `.info` object in the bucket. To remove them, see [Abandoned upload cleanup](/docs/storage/uploads/resumable-uploads#abandoned-upload-cleanup).

## Next steps

- [Recover uploads after a reload](/docs/storage/uploads/uppy-golden-retriever)
- [tus-node-server documentation](https://github.com/tus/tus-node-server)

<NeedHelp/>
