---
title: Object storage troubleshooting
subtitle: Common errors and how to fix them
summary: >-
  Solutions for common errors when using Neon Object Storage, including authentication
  failures, access denied errors, SDK configuration issues, and S3
  compatibility limitations.
enableTableOfContents: true
updatedOn: '2026-07-15T23:52:09.670Z'
---

<FeatureBetaProps feature_name="Neon Object Storage" />

Every error described below also appears as a log line in the Console. See [Object storage logs](/docs/storage/logs) for how to view, filter, and search them.

## Authentication errors

### `403 InvalidAccessKeyId`

The Access Key ID is wrong, missing, or the credential has been revoked.

**Fix:** Check that `AWS_ACCESS_KEY_ID` is set to the `token_id` from the credential response, not `token_id_short`. See [Authentication](/docs/storage/authentication#mapping-to-your-s3-sdk) for the correct field mapping. If you no longer have it, revoke the credential and create a new one.

### `403 SignatureDoesNotMatch`

The Secret Access Key is wrong.

**Fix:** Check that `AWS_SECRET_ACCESS_KEY` is set to the `s3_secret_access_key` field from the credential response. This is the 64-character hex string, not the `api_token`. Both are returned only once at creation. If you no longer have the `s3_secret_access_key`, revoke the credential and create a new one.

### `403 AccessDenied`: missing scope

The credential does not have the required scope for the operation.

**Fix:** Check which scopes the credential was created with:

- `storage:read` allows GetObject, HeadObject, ListBuckets, and ListObjectsV2
- `storage:write` allows all reads plus PutObject, DeleteObject, CreateBucket, and DeleteBucket

To add write access, create a new credential with `storage:write`. You can't add scopes to an existing credential.

### `403 AccessDenied`: wrong branch

The credential was issued on a branch that is not an ancestor of the branch you are making requests against.

**Fix:** Use a credential issued on the target branch or one of its ancestor branches. See [Authentication](/docs/storage/authentication#how-branch-binding-works) for how branch binding works.

## SDK configuration errors

### Requests go to AWS instead of Neon

If you forget to set the custom endpoint, the SDK will route requests to AWS S3 and fail with a credentials error or bucket-not-found.

**Fix:** Always set the `endpoint` (JavaScript) or `endpoint_url` (Python/CLI) to your branch storage host:

```typescript
const client = new S3Client({
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  // ...
});
```

### `NoSuchBucket` on every request

Without `forcePathStyle: true`, the SDK treats the bucket name as a subdomain instead of a path segment.

**Fix:** Add `forcePathStyle: true` to your `S3Client` configuration:

```typescript
const client = new S3Client({
  forcePathStyle: true, // required for Neon Object Storage
  // ...
});
```

Without this, the AWS SDK for JavaScript uses virtual-hosted-style addressing (`my-bucket.storage.example.com/key`) which Neon Object Storage doesn't support.

### SigV2 errors

If you see signature-related errors mentioning `AWS2` or `AWSAccessKeyId`, your client is using the older AWS Signature Version 2.

**Fix:** Use AWS Signature Version 4 (SigV4). The AWS SDK v3 for JavaScript and boto3 use SigV4 by default. If you're using an older SDK or a custom HTTP client, update it or configure it to use SigV4 explicitly.

## Access level errors

### Anonymous GET returns `403 AccessDenied`

The bucket's access level is `private` (the default), which requires authentication for all reads.

**Fix:** If the bucket should allow public reads, set its access level to `public_read` using the Neon Console or API. See [Access levels](/docs/storage/buckets#access-levels).

<Admonition type="note">
You cannot change access level via the S3 API. `PutBucketAcl` returns `501 Not Implemented`.
</Admonition>

## S3 operation errors

### `501 Not Implemented`

You are calling an S3 operation that Neon Object Storage does not support.

**Common causes:**

- `PutBucketAcl` or `PutBucketPolicy`: use the Neon Console or API to set bucket access level instead
- `PutBucketNotificationConfiguration`: event notifications are not supported
- `PutBucketLogging`: server-side access logging is not supported

See [S3 compatibility](/docs/storage/s3-compatibility#not-supported) for the full list of unsupported operations.

### Lifecycle rules not running

`PutBucketLifecycle` succeeds and the configuration is stored, but expiration and transition rules do not execute.

**Status:** Lifecycle enforcement isn't available in beta. The API accepts and echoes the configuration so tools that read lifecycle rules will work, but the rules have no effect.

## Connection and performance errors

### `503 Service Unavailable` (SlowDown)

The request exceeded a rate limit. The S3 error code is `SlowDown`. This is a rate limit signal, not a server error. The storage service is healthy.

**Fix:** Implement exponential backoff and retry. Don't treat `SlowDown` as a fatal error. The response may include a `Retry-After` header indicating how long to wait. AWS SDKs handle this automatically when retry logic is enabled. If you're hitting this consistently, [let us know](/docs/introduction/support) and we can look into raising your limit.

### Large downloads timing out mid-stream

The connection drops during a large object download.

**Fix:** Use range requests to download large objects in chunks:

```typescript
// Download in 10 MiB chunks
const chunkSize = 10 * 1024 * 1024;
let start = 0;
let totalSize: number | undefined;

// ContentLength is the size of each chunk, not the whole object, so parse
// the object's total size from Content-Range ("bytes start-end/total")
// instead and stop once start reaches it.
while (totalSize === undefined || start < totalSize) {
  const response = await client.send(new GetObjectCommand({
    Bucket: 'my-bucket',
    Key: 'large-file.zip',
    Range: `bytes=${start}-${start + chunkSize - 1}`,
  }));
  // process response.Body
  totalSize = Number(response.ContentRange?.split('/')[1]);
  start += chunkSize;
}
```

<NeedHelp/>
