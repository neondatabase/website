---
title: Storage troubleshooting
subtitle: Common errors and how to fix them
summary: >-
  Solutions for common errors when using Neon Storage, including authentication
  failures, access denied errors, SDK configuration issues, and S3
  compatibility limitations.
enableTableOfContents: true
updatedOn: '2026-06-11T14:24:23.574Z'
---

## Authentication errors

### `403 InvalidAccessKeyId`

The Access Key ID is wrong, missing, or the credential has been revoked.

**Fix:** Check that `NEON_STORAGE_ACCESS_KEY_ID` is set to the full `token_id` UUID from the credential response (e.g. `550e8400-e29b-41d4-a716-446655440000`). This is not the same as the `token_id_short`. See [Authentication](/docs/storage/authentication#mapping-to-your-s3-sdk) for the correct field mapping.

### `403 SignatureDoesNotMatch`

The Secret Access Key is wrong.

**Fix:** Check that `NEON_STORAGE_SECRET_ACCESS_KEY` is set to the `s3_secret_access_key` field from the credential response. This is the 64-character hex string, not the `api_token`. Both are returned only once at creation. If you no longer have the `s3_secret_access_key`, revoke the credential and create a new one.

### `403 AccessDenied`: missing scope

The credential does not have the required scope for the operation.

**Fix:** Check which scopes the credential was created with:

- `storage:read` allows GetObject, HeadObject, ListBuckets, and ListObjectsV2
- `storage:write` allows all reads plus PutObject, DeleteObject, CreateBucket, and DeleteBucket

To add write access, create a new credential with `storage:write`. Scopes cannot be added to an existing credential.

### `403 AccessDenied`: wrong branch

The credential was issued on a branch that is not an ancestor of the branch you are making requests against.

**Fix:** Use a credential issued on the target branch or one of its ancestor branches. See [Authentication](/docs/storage/authentication#how-branch-binding-works) for how branch binding works.

## SDK configuration errors

### Requests go to AWS instead of Neon

If you forget to set the custom endpoint, the SDK will route requests to AWS S3 and fail with a credentials error or bucket-not-found.

**Fix:** Always set the `endpoint` (JavaScript) or `endpoint_url` (Python/CLI) to your branch storage host:

```typescript
const client = new S3Client({
  endpoint: process.env.NEON_STORAGE_ENDPOINT,
  // ...
});
```

### `NoSuchBucket` on every request

The bucket name is being treated as a subdomain instead of a path segment. This happens when `forcePathStyle` is not set.

**Fix:** Add `forcePathStyle: true` to your `S3Client` configuration:

```typescript
const client = new S3Client({
  forcePathStyle: true, // required for Neon Storage
  // ...
});
```

Without this, the AWS SDK for JavaScript uses virtual-hosted-style addressing (`my-bucket.storage.example.com/key`) which Neon Storage does not support.

### SigV2 errors

If you see signature-related errors mentioning `AWS2` or `AWSAccessKeyId`, your client is using the older AWS Signature Version 2.

**Fix:** Use AWS Signature Version 4 (SigV4). The AWS SDK v3 for JavaScript and boto3 use SigV4 by default. If you are using an older SDK or a custom HTTP client, update it or configure it to use SigV4 explicitly.

## Access level errors

### Anonymous GET returns `403 AccessDenied`

The bucket's access level is `private` (the default), which requires authentication for all reads.

**Fix:** If the bucket should allow public reads, set its access level to `public_read` using the Neon Console or API. See [Access levels](/docs/storage/buckets#access-levels). Note: you cannot change access level via the S3 API (`PutBucketAcl` returns `501`).

## S3 operation errors

### `501 Not Implemented`

You are calling an S3 operation that Neon Storage does not support.

**Common causes:**

- `PutBucketAcl` or `PutBucketPolicy`: use the Neon Console or API to set bucket access level instead
- `PutBucketNotificationConfiguration`: event notifications are not supported
- `PutBucketLogging`: server-side access logging is not supported

See [S3 compatibility](/docs/storage/s3-compatibility#not-supported) for the full list of unsupported operations.

### Lifecycle rules not running

`PutBucketLifecycle` succeeds and the configuration is stored, but expiration and transition rules do not execute.

**Status:** Lifecycle enforcement is not available in Private Preview. The API accepts and echoes the configuration so tools that read lifecycle rules will work, but the rules have no effect.

## Connection and performance errors

### `503 Service Unavailable`

The request exceeded the per-IP or per-tenant rate limit.

**Fix:** Reduce request frequency or add retry logic with exponential backoff. The response may include a `Retry-After` header indicating how long to wait.

### Large downloads timing out mid-stream

The connection drops during a large object download.

**Fix:** Use range requests to download large objects in chunks:

```typescript
// Download in 10 MiB chunks
const chunkSize = 10 * 1024 * 1024;
let start = 0;

while (true) {
  const response = await client.send(new GetObjectCommand({
    Bucket: 'my-bucket',
    Key: 'large-file.zip',
    Range: `bytes=${start}-${start + chunkSize - 1}`,
  }));
  // process response.Body
  if (response.ContentRange?.endsWith(response.ContentLength?.toString() ?? '')) break;
  start += chunkSize;
}
```

<NeedHelp/>
