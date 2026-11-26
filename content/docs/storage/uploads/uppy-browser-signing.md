---
title: Sign Uppy uploads in the browser with short-lived credentials
subtitle: Use @uppy/aws-s3 getCredentials with an expiring Neon credential
summary: >-
  Have your backend mint a short-lived Neon Object Storage credential and pass it to
  @uppy/aws-s3 with getCredentials. Uppy then signs every S3 request in the browser,
  with no signing round trips. Covers setup, expiry, revocation, and the security
  tradeoffs compared with a signing endpoint.
enableTableOfContents: true
updatedOn: '2026-11-26T11:46:18.830Z'
---

With `getCredentials`, `@uppy/aws-s3` signs S3 requests in the browser itself. Your backend makes one call to issue a credential. After that, the browser sends every part upload, `ListParts` call, and completion request directly to Neon, with no signing round trips.

On AWS this is usually done with STS temporary credentials. Neon doesn't have STS, but you can create a Neon credential with an expiry time, which gives you a similar short-lived key.

<Admonition type="warning" title="Security considerations">
A Neon credential can't be limited to one bucket or key prefix. A credential with `storage:write` can read, overwrite, and delete every object in every bucket on the branch and its child branches. Anyone who opens the browser's developer tools can copy it and use it until it expires. Use this method only for users you trust with the whole branch's storage, such as staff in an internal tool. For user-facing apps, use a [signing endpoint](/docs/storage/uploads/uppy-s3-multipart), where your backend checks every key.
</Admonition>

## Prerequisites

- A [bucket](/docs/storage/buckets) and a [CORS rule](/docs/storage/uploads/resumable-uploads#cors-configuration-for-browser-uploads) that allows your app's origin and exposes `ETag`
- A Neon [API key](/docs/manage/api-keys) on your server, your project ID and branch ID

<Steps>

## Issue a credential per session

Create a credential with the [credentials API](/docs/storage/authentication#creating-a-credential), set to expire soon. Return it in the shape Uppy expects. Neon credentials have no session token, so `sessionToken` is an empty string.

```typescript filename="server.ts" collapse={1-4} shouldWrap
import express from 'express';

const { NEON_API_KEY, NEON_PROJECT_ID, NEON_BRANCH_ID, AWS_REGION } = process.env;
const app = express();

app.post('/api/uploads/credentials', async (req, res) => {
  // Authenticate the user first. Only trusted users should get a credential.

  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours
  const r = await fetch(
    `https://console.neon.tech/api/v2/projects/${NEON_PROJECT_ID}/branches/${NEON_BRANCH_ID}/credentials`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${NEON_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scopes: ['storage:write'],
        principal_type: 'user',
        name: 'uppy-upload-session',
        expires_at: expiresAt,
      }),
    },
  );
  if (!r.ok) return res.status(502).json({ error: 'Could not create credential' });
  const cred = await r.json();

  res.json({
    credentials: {
      accessKeyId: cred.token_id,
      secretAccessKey: cred.s3_secret_access_key,
      sessionToken: '',
      expiration: expiresAt,
    },
    region: AWS_REGION,
  });
});
```

## Configure Uppy

Set `s3Endpoint` to your branch's storage endpoint followed by the bucket name. Neon uses path-style addressing, so the bucket goes in the path, not the hostname.

```typescript filename="uploader.ts" collapse={1-4} shouldWrap
import Uppy from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';

const MiB = 1024 * 1024;

export const uppy = new Uppy().use(AwsS3, {
  // For example https://br-cool-darkness-123456.storage.c-9.us-east-2.aws.neon.tech/my-bucket
  s3Endpoint: `${import.meta.env.VITE_NEON_STORAGE_ENDPOINT}/my-bucket`,
  shouldUseMultipart: (file) => (file.size ?? 0) > 20 * MiB,
  getChunkSize: () => 5 * MiB,
  getCredentials: async ({ signal } = {}) => {
    const res = await fetch('/api/uploads/credentials', { method: 'POST', signal });
    if (!res.ok) throw new Error(`Credentials failed: ${res.status}`);
    return res.json();
  },
});
```

## Upload a file

```typescript shouldWrap
uppy.addFile({ name: file.name, type: file.type, data: file });
await uppy.upload();
```

</Steps>

Pause, resume, retry, and cancel work the same as with a [signing endpoint](/docs/storage/uploads/uppy-s3-multipart#pause-resume-retry-and-cancellation).

## Credential expiry

Uppy fetches credentials on the first upload and keeps using them for as long as the plugin is installed. It doesn't fetch new ones when `expiration` passes. If the credential expires partway through an upload, Neon rejects the next request with `403 InvalidAccessKeyId` and the upload fails.

- Set `expires_at` longer than the longest upload session you expect, including time spent paused. The minimum is 1 minute and the maximum is 365 days.
- For a new session, create a new Uppy instance so it fetches a fresh credential.

## Credential revocation

Every call to your route creates a credential on the branch. To keep the list short and cut off access early, revoke a credential once its uploads finish, for example from an `upload-success` or `complete` handler that calls your backend:

```bash shouldWrap
curl -X DELETE "https://console.neon.tech/api/v2/projects/$NEON_PROJECT_ID/branches/$NEON_BRANCH_ID/credentials/$TOKEN_ID" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

See [Revoking credentials](/docs/storage/authentication#revoking-credentials) for the CLI equivalent.

## Next steps

- [Recover uploads after a reload](/docs/storage/uploads/uppy-golden-retriever)
- [Read vs write scopes](/docs/storage/authentication#read-vs-write-scopes)

<NeedHelp/>
