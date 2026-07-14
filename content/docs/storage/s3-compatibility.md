---
title: S3 compatibility
subtitle: Which S3 operations Neon Object Storage supports
summary: >-
  Neon Object Storage implements core S3 operations. It is compatible with the AWS SDK
  for JavaScript, boto3, and the AWS CLI. Not all S3 operations are supported.
  This page lists what works, what returns 501, and known limitations.
enableTableOfContents: true
updatedOn: '2026-07-10T13:57:31.917Z'
---

<PrivatePreviewEnquire/>

Neon Object Storage is compatible with the S3 API for core operations. It works with the AWS SDK for JavaScript (`@aws-sdk/client-s3`), boto3, the AWS CLI, and other S3-compatible tools. Not all S3 API operations are available.

<Admonition type="note">
Configure your S3 client with `forcePathStyle: true` (JavaScript) or `endpoint_url` (Python/CLI). Neon Object Storage uses path-style addressing only. See [Get started](/docs/storage/get-started) for setup details.
</Admonition>

## Supported operations

### Buckets

| Operation                                                                   | Notes                                                            |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `ListBuckets`                                                               | Lists all buckets on the current branch                          |
| `CreateBucket`                                                              | Creates a bucket on the current branch                           |
| `HeadBucket`                                                                | Checks if a bucket exists                                        |
| `DeleteBucket`                                                              | Bucket must be empty first                                       |
| `ListObjectsV2`                                                             | Supports `prefix`, `delimiter`, `max-keys`, `continuation-token` |
| `GetBucketLocation`                                                         | Returns the configured region                                    |
| `GetBucketCors` / `PutBucketCors` / `DeleteBucketCors`                      | CORS configuration                                               |
| `GetBucketAcl`                                                              | Read-only; returns the stored ACL                                |
| `GetBucketPolicy`                                                           | Read-only; returns the stored policy                             |
| `GetBucketTagging` / `PutBucketTagging` / `DeleteBucketTagging`             | Tag management                                                   |
| `GetBucketVersioning`                                                       | Returns stored config; versioning is not enforced                |
| `GetBucketLifecycle` / `PutBucketLifecycle` / `DeleteBucketLifecycle`       | Config is stored but rules are not enforced                      |
| `GetObjectLockConfiguration` / `PutObjectLockConfiguration`                 | Config is stored; enforcement is limited                         |
| `GetPublicAccessBlock` / `PutPublicAccessBlock` / `DeletePublicAccessBlock` | Supported                                                        |

### Objects

| Operation                                                       | Notes                                                                                          |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `GetObject`                                                     | Supports `Range` header for partial reads                                                      |
| `HeadObject`                                                    | Returns object metadata                                                                        |
| `PutObject`                                                     | Supports `Content-Type`, `Content-Disposition`, `Cache-Control`, custom `x-amz-meta-*` headers |
| `DeleteObject`                                                  | Soft-deletes the object on the current branch                                                  |
| `DeleteObjects`                                                 | Batch delete up to 1,000 keys per request                                                      |
| `GetObjectAcl`                                                  | Read-only                                                                                      |
| `GetObjectTagging` / `PutObjectTagging` / `DeleteObjectTagging` | Tag management                                                                                 |
| `GetObjectAttributes`                                           | Returns ETag, size, and checksum                                                               |

### Multipart upload

| Operation                 | Notes                                          |
| ------------------------- | ---------------------------------------------- |
| `CreateMultipartUpload`   | Initiates a multipart upload                   |
| `UploadPart`              | Uploads a single part                          |
| `UploadPartCopy`          | Copies a part from another object              |
| `CompleteMultipartUpload` | Finalises the upload                           |
| `AbortMultipartUpload`    | Cancels and cleans up                          |
| `ListMultipartUploads`    | Lists in-progress uploads                      |
| `ListParts`               | Lists uploaded parts for an in-progress upload |

### Presigned requests

| Operation                   | Notes                                                             |
| --------------------------- | ----------------------------------------------------------------- |
| Presigned GET / PUT         | Supported via `X-Amz-Algorithm=AWS4-HMAC-SHA256` query parameters |
| Browser form uploads (POST) | Supported                                                         |
| Presigned URL expiry        | Configurable via `X-Amz-Expires`                                  |

### CORS

| Operation                                              | Notes                     |
| ------------------------------------------------------ | ------------------------- |
| `OPTIONS` preflight                                    | Handled automatically     |
| `GetBucketCors` / `PutBucketCors` / `DeleteBucketCors` | Full CORS rule management |

## Not supported

The following operations return `501 Not Implemented`:

| Operation                                                                  | Category                      |
| -------------------------------------------------------------------------- | ----------------------------- |
| `PutBucketAcl`, `PutBucketPolicy`, `PutObjectAcl`                          | ACL/policy writes via S3 wire |
| `GetBucketNotificationConfiguration`, `PutBucketNotificationConfiguration` | Event notifications           |
| `GetBucketLogging`, `PutBucketLogging`                                     | Server-side logging           |
| `GetBucketEncryption`, `PutBucketEncryption`                               | Encryption configuration      |
| `GetBucketReplication`, `PutBucketReplication`                             | Cross-region replication      |
| `GetBucketWebsite`, `PutBucketWebsite`                                     | Static website hosting        |
| `GetBucketAccelerateConfiguration`, `PutBucketAccelerateConfiguration`     | Transfer acceleration         |
| `SelectObjectContent`                                                      | S3 Select queries             |
| `RestoreObject`                                                            | Glacier restore               |
| `GetObjectTorrent`                                                         | BitTorrent                    |

<Admonition type="note">
To set a bucket's access level (`private` or `public_read`), use the [Neon Console or API](/docs/storage/buckets#access-levels) instead of `PutBucketAcl` or `PutBucketPolicy`.
</Admonition>

## Known limitations

- **Path-style addressing only.** Virtual-hosted-style requests (`bucket.host/key`) are not supported. Always set `forcePathStyle: true` in the AWS SDK for JavaScript, or use `endpoint_url` in boto3.
- **SigV4 only.** AWS Signature Version 2 (SigV2) is not supported.
- **Lifecycle rules stored but not enforced.** `PutBucketLifecycle` accepts and stores configuration, but expiration and transition rules do not run.
- **Versioning stored but not enforced.** Versioning configuration is stored and echoed. Objects always return `x-amz-version-id: null`.
- **No bucket notifications.** SNS/SQS integration is not available.
- **Branches, not regions.** Buckets are scoped to a branch, not an AWS region. `GetBucketLocation` returns the configured region string but bucket selection is always branch-based.

<NeedHelp/>
