---
title: Import files from URLs and cloud services with Uppy Companion
subtitle: Have Companion fetch remote files and stream them into your Neon bucket
summary: >-
  Use Uppy Companion with @uppy/url or provider plugins such as Google Drive and Dropbox
  to import remote files into Neon Object Storage. Companion downloads each file and
  uploads it to Neon with S3 multipart upload, so the bytes never pass through the browser.
enableTableOfContents: true
updatedOn: '2026-11-25T17:45:27.914Z'
---

Uppy can add files that aren't on the user's device: a link pasted into [`@uppy/url`](https://uppy.io/docs/url/), or a file picked from Google Drive, Dropbox, OneDrive, Box, and other [provider plugins](https://uppy.io/docs/companion/). For these remote files, [Uppy Companion](https://uppy.io/docs/companion/) does the transfer. It downloads the file from the source and uploads it to your Neon bucket with S3 multipart upload. The browser only receives progress updates over a WebSocket.

This works well for large imports, because the file goes from the source to Companion to Neon without a round trip through the user's connection.

## Prerequisites

Set up Companion for Neon as described in [Resumable uploads with Uppy Companion](/docs/storage/uploads/uppy-companion). Remote imports use the same `s3` options, so there's nothing extra to configure for Neon. You also need:

- `companion.socket(server, options)` attached to your HTTP server. Companion streams progress for remote uploads over this socket.
- For URL imports, `enableUrlEndpoint: true` in the Companion options.
- For each cloud provider, OAuth credentials in `providerOptions`. See the [Companion docs](https://uppy.io/docs/companion/).

<Steps>

## URL endpoint configuration

```typescript filename="companion.ts" shouldWrap
const options = {
  // ...the options from the Companion guide, including `s3`
  enableUrlEndpoint: true,
};
```

## URL plugin installation

```bash
npm install @uppy/url
```

```typescript filename="uploader.ts" shouldWrap
import Uppy from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';
import Url from '@uppy/url';

const companionUrl = 'https://uploads.example.com/companion';

export const uppy = new Uppy()
  .use(AwsS3, { companionEndpoint: companionUrl })
  .use(Url, { companionUrl });
```

With [`@uppy/dashboard`](https://uppy.io/docs/dashboard/), the URL plugin adds a **Link** tab to the picker. To add a URL from code:

```typescript shouldWrap
await uppy.getPlugin('Url').addFile('https://example.com/videos/talk.mp4');
await uppy.upload();
```

## Stored object key

When the import finishes, `upload-success` returns the key Companion's `getKey` chose:

```typescript shouldWrap
uppy.on('upload-success', (file, response) => {
  console.log('Stored as', response.body.Key);
});
```

</Steps>

## Cloud provider imports

Provider plugins such as [`@uppy/google-drive`](https://uppy.io/docs/google-drive/) and [`@uppy/dropbox`](https://uppy.io/docs/dropbox/) work the same way once you configure their OAuth credentials in Companion. When `@uppy/aws-s3` sees a remote file, from any provider, it asks Companion to upload it to S3, and Companion uses your Neon `s3` options.

## Security considerations

<Admonition type="warning">
Companion fetches whatever URL a user submits. Keep `allowLocalUrls` set to `false`, its default, in production. If it's `true`, users can make Companion fetch from your internal network.
</Admonition>

- Put Companion behind your app's authentication. Anyone who can reach it can write files to your bucket.
- Companion's `s3.conditions` don't apply to server-side imports. To limit import size, set Companion's `maxFileSize` option.

## Next steps

- [Run a function when an import completes](/docs/compute/functions/triggers/object-storage), for example to create a thumbnail
- [Abandoned upload cleanup](/docs/storage/uploads/resumable-uploads#abandoned-upload-cleanup)

<NeedHelp/>
