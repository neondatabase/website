---
title: Neon Object Storage
subtitle: S3-compatible object storage that branches with your database
summary: >-
  Neon Object Storage is S3-compatible object storage built into your Neon project.
  Every branch gets its own isolated storage namespace. Use any AWS S3 SDK
  or tool. Point it at your branch endpoint and authenticate with your Neon
  credential.
enableTableOfContents: true
updatedOn: '2026-09-24T07:04:24.872Z'
---

Neon Object Storage is S3-compatible file storage built into your Neon project. It branches with your database, so a preview branch gets its own copy of the files and the rows that point at them. Point any S3 SDK at your branch endpoint and use your existing Neon credential.

- **Branches with your database.** Each branch has its own view of storage. Test file uploads and deletions in preview branches without touching production data, and [reset a branch from its parent](/docs/guides/reset-from-parent) to return its storage to the parent's state. Object Storage reset is currently available in select regions, with more coming soon.
- **Standard S3 SDKs.** The AWS SDK for JavaScript, boto3, the AWS CLI, the [Files SDK](https://files-sdk.dev), and any other S3-compatible tool works out of the box.
- **Two access modes.** `private` buckets require authentication for all operations. `public_read` buckets allow anonymous reads with authenticated writes.
- **One credential system.** The same Neon credential system used by AI Gateway and Functions.
- **Event-driven.** Run a function when an object is uploaded with [Function Triggers](/docs/compute/functions/triggers/object-storage).

> Object storage is currently available in AWS US East (Ohio) (`aws-us-east-2`), AWS US East (N. Virginia) (`aws-us-east-1`), AWS Europe (Frankfurt) (`aws-eu-central-1`), and AWS Asia Pacific (Singapore) (`aws-ap-southeast-1`). Support is expanding toward all regions. See [plans and pricing](/docs/introduction/plans#object-storage) for storage and egress rates.

## Get started

<DetailIconCards>

<a href="/docs/storage/get-started" description="Create a credential, configure a client, and upload your first file." icon="todo">Quickstart</a>

<a href="/docs/storage/buckets" description="Create and manage buckets, set access levels, and understand how buckets branch." icon="database">Buckets</a>

<a href="/docs/storage/objects" description="Upload, download, list, delete, and generate presigned URLs for objects." icon="data">Objects</a>

<a href="/docs/compute/functions/triggers/object-storage" description="Run a function when an object is uploaded to a bucket." icon="stopwatch">Triggers</a>

<a href="/docs/storage/authentication" description="Understand how Neon credentials map to S3 access keys." icon="lock-landscape">Authentication</a>

<a href="/docs/storage/logs" description="View, search, and download a bucket's logs in the Console." icon="search">Logs</a>

</DetailIconCards>

## Starter templates

The [examples repository](https://github.com/neondatabase/examples) includes templates that use Neon Object Storage. Each declares its bucket in `neon.ts` and provisions it with `neon deploy`, which also injects the S3 credentials, so there are no secrets to copy. A couple to start with:

[files-sdk](https://github.com/neondatabase/examples/tree/main/with-files-sdk) is a standalone script that uploads local files to a `public_read` bucket with the [Files SDK](https://files-sdk.dev) and its `neon` adapter, then prints presigned URLs. A minimal example of the storage API on its own:

```bash
neon bootstrap --template files-sdk
```

[ai-sdk](https://github.com/neondatabase/examples/tree/main/with-ai-sdk) is a chat agent on a Neon Function that generates images, stores each one in a private bucket with the AWS S3 SDK, records its key and metadata in Postgres, and serves it back through a presigned URL. Shows object storage and the database branching together:

```bash
neon bootstrap --template ai-sdk
```

## Limits

The following limits apply:

| Limit                    | Value                                                                                                          |
| ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Object size (maximum)    | 5 GiB, whether uploaded in a single request or with [multipart upload](/docs/storage/objects#multipart-upload) |
| Free plan object storage | 5 GB per project ([rates](/docs/introduction/plans#object-storage))                                            |

Two limits are behavioral rather than fixed numbers:

- **Region**: object storage is available in AWS US East (Ohio) (`aws-us-east-2`), AWS US East (N. Virginia) (`aws-us-east-1`), AWS Europe (Frankfurt) (`aws-eu-central-1`), and AWS Asia Pacific (Singapore) (`aws-ap-southeast-1`). Support is expanding toward all regions.
- **Rate limiting**: requests may be throttled during heavy use, returning a `503 SlowDown` response. Back off and retry. See [Connection and performance errors](/docs/storage/troubleshooting#connection-and-performance-errors).

Storage-volume limits apply to the Free plan only. Paid plans have no fixed limit on total storage or number of objects; storage is metered per GB (see [plans and pricing](/docs/introduction/plans#object-storage)). For large objects, use [multipart upload](/docs/storage/objects#multipart-upload), which AWS recommends for anything over 100 MB.

For S3 API and feature limitations (as opposed to usage limits), see [Known limitations](/docs/storage/s3-compatibility#known-limitations).

<NeedHelp/>
