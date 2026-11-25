---
title: Recover Uppy uploads after a reload or crash
subtitle: Use Golden Retriever to resume uploads to Neon in a new tab
summary: >-
  Add @uppy/golden-retriever so in-progress uploads to Neon Object Storage survive a page
  reload, closed tab, or browser crash. Works with @uppy/aws-s3 multipart uploads and
  @uppy/tus. Covers small files restored automatically and large files the user re-selects.
enableTableOfContents: true
updatedOn: '2026-11-25T17:45:27.914Z'
---

Pause, resume, and retry only work while the page stays open. If the user reloads, closes the tab, or the browser crashes, Uppy forgets the upload. [Golden Retriever](https://uppy.io/docs/golden-retriever/) saves Uppy's state in the browser so the next visit can pick up where the last one stopped.

It works with every method in this section:

- With `@uppy/aws-s3` (a [signing endpoint](/docs/storage/uploads/uppy-s3-multipart), [Companion](/docs/storage/uploads/uppy-companion), or [browser signing](/docs/storage/uploads/uppy-browser-signing)), it saves each file's multipart `uploadId` and `key`. On restore, Uppy calls `ListParts` and uploads only the parts Neon doesn't have.
- With [`@uppy/tus`](/docs/storage/uploads/uppy-tus), it saves each file's tus upload URL. On restore, Uppy asks the tus server for the offset and continues from there.

## Golden Retriever installation

```bash
npm install @uppy/golden-retriever
```

```typescript filename="uploader.ts" collapse={1-2,9-13} shouldWrap
import Uppy from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';
import GoldenRetriever from '@uppy/golden-retriever';

export const uppy = new Uppy({ id: 'avatar-uploader' })
  .use(AwsS3, {
    shouldUseMultipart: true,
    signRequest: (request) =>
      fetch('/api/uploads/sign', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(request),
      }).then((res) => res.json()),
  })
  .use(GoldenRetriever);
```

Give each uploader on your site its own Uppy `id` since it stores the state under that ID.

## Resumption after page load

When Uppy starts, Golden Retriever restores the saved files and emits `restored`. Uploads don't start again until the user confirms:

- With [`@uppy/dashboard`](https://uppy.io/docs/dashboard/), the status bar shows a resume prompt. Clicking it continues the uploads.
- With your own UI, emit `restore-confirmed` when the user agrees:

```typescript shouldWrap
uppy.on('restored', () => {
  if (Object.keys(uppy.getFiles()).length > 0) showResumePrompt();
});

function onResumeClicked() {
  uppy.emit('restore-confirmed');
}
```

## File size and restoration behavior

Golden Retriever keeps the file's bytes in IndexedDB only for files up to 10 MiB, with a 300 MiB total. What happens on restore depends on the file size:

- **Up to 10 MiB:** the file is restored with its bytes, so the upload continues without the user doing anything except confirming.
- **Over 10 MiB:** the file comes back as a "ghost". Uppy knows the file's name, size, and upload ID, but not its bytes. Ask the user to select the same file again. Uppy matches it to the ghost by name, type, size, and last-modified time, replaces the ghost, and resumes the existing upload.

  ```typescript shouldWrap
  const ghosts = Object.values(uppy.getFiles()).filter((file) => file.isGhost);
  if (ghosts.length > 0) {
    showMessage(`Select ${ghosts.map((f) => f.name).join(', ')} again to resume.`);
  }

  // When the user re-selects the file, add it as usual. It replaces the ghost.
  uppy.addFile({ name: file.name, type: file.type, data: file });
  ```

  Wait for the `restored` event before you add the re-selected file. A file added before restore finishes is overwritten by the ghost.

## Recovery window

Golden Retriever discards saved state after 24 hours. Change this with the `expires` option, in milliseconds. After state expires, the browser no longer knows the `uploadId`, but the parts are still in your bucket until the multipart upload is aborted. Run a [cleanup job](/docs/storage/uploads/resumable-uploads#abandoned-upload-cleanup) with a cutoff longer than `expires`.

## Next steps

- [Golden Retriever documentation](https://uppy.io/docs/golden-retriever/)
- [Abandoned upload cleanup](/docs/storage/uploads/resumable-uploads#abandoned-upload-cleanup)

<NeedHelp/>
