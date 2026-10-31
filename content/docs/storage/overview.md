---
title: Neon Object Storage
subtitle: Branch-aware object storage in the Neon backend
summary: >-
  Neon Object Storage is S3-style object storage built into your Neon project.
  Files branch and fork copy-on-write with your database, so every branch gets
  its own view of storage. Point an S3 SDK at your branch endpoint and
  authenticate with your Neon credential.
enableTableOfContents: true
updatedOn: '2026-10-23T14:02:32.319Z'
layout: wide
hideCopyPage: true
---

<div className="not-prose -mb-4 grid grid-cols-[minmax(0,7fr)_minmax(0,4fr)] items-start gap-16 lg:mb-6 lg:grid-cols-1 lg:gap-10">

<div className="[&>div]:my-0!">
<p className="mt-0 mb-6 max-w-2xl text-base leading-[1.6] tracking-tight text-gray-new-20 [text-wrap:pretty] dark:text-gray-new-80">Store images, video, and user uploads in S3-style object storage that lives in your backend, so your files branch with your data.</p>
<AgentPrompt title="Set up with your agent" src="/prompts/object-storage-landing.md" buttonText="Copy prompt" />
</div>

<img
  src="/docs/storage/hero-object-storage.svg"
  alt="Your app uploads and downloads files through an S3-style API to a bucket that lives in your Neon backend."
  className="not-prose aspect-[364/350] w-full max-w-[320px] object-contain object-top lg:max-w-[420px]"
/>

</div>

## Get started

<DetailIconCards>

<a href="/docs/storage/get-started" description="Create a credential, configure a client, and upload your first file." icon="todo">Quickstart</a>

<a href="/docs/storage/buckets" description="Create and manage buckets, set access levels, and understand how buckets branch." icon="database">Buckets</a>

<a href="/docs/storage/objects" description="Upload, download, list, delete, and generate presigned URLs for objects." icon="data">Objects</a>

<a href="/docs/storage/authentication" description="Understand how Neon credentials map to S3 access keys." icon="lock-landscape">Authentication</a>

</DetailIconCards>

## Explore features

<DetailIconCards>

<a href="/docs/compute/functions/triggers/object-storage" description="Run a function when an object is uploaded to a bucket." icon="stopwatch">Triggers</a>

<a href="/docs/storage/s3-compatibility" description="See which S3 operations Neon supports and point any S3 SDK at your bucket." icon="network">S3 API support</a>

<a href="/docs/storage/logs" description="View, search, and download a bucket's logs in the Console." icon="search">Logs</a>

</DetailIconCards>

## About Neon Object Storage

Neon Object Storage is file storage built into your Neon project, reached through an S3-style API. Key capabilities include:

- **Branches with your database.** Each branch has its own view of storage, so you can test uploads and deletes in a preview branch without touching production files.
- **Copy-on-write forking.** Branches inherit the parent's objects at the moment of forking, with no data copied.
- **S3-style access.** Point the AWS SDKs, boto3, the AWS CLI, or the [Files SDK](https://files-sdk.dev) at your branch endpoint. Neon implements a subset of the S3 API.
- **One credential system.** The same Neon credential system used by AI Gateway and Functions.
- **Event-driven.** Run a function when an object is uploaded with [Function Triggers](/docs/compute/functions/triggers/object-storage).

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

| Limit                                                                             | Value                                                               |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Object size, single-request upload (maximum)                                      | 5 GiB                                                               |
| Object size, [multipart upload](/docs/storage/objects#multipart-upload) (maximum) | 10 GiB                                                              |
| Free plan object storage                                                          | 5 GB per project ([rates](/docs/introduction/plans#object-storage)) |

Two limits are behavioral rather than fixed numbers:

- **Region**: object storage is available in AWS US East (Ohio) (`aws-us-east-2`), AWS US East (N. Virginia) (`aws-us-east-1`), AWS Europe (Frankfurt) (`aws-eu-central-1`), and AWS Asia Pacific (Singapore) (`aws-ap-southeast-1`). Support is expanding toward all regions.
- **Rate limiting**: requests may be throttled during heavy use, returning a `503 SlowDown` response. Back off and retry. See [Connection and performance errors](/docs/storage/troubleshooting#connection-and-performance-errors).

To see how much Object Storage your project uses, check the **Object storage** row in the **Project** panel on your branch's **Overview** page. The value covers all branches in the project.

Storage-volume limits apply to the Free plan only. Paid plans have no fixed limit on total storage or number of objects; storage is metered per GB (see [plans and pricing](/docs/introduction/plans#object-storage)). For large objects, use [multipart upload](/docs/storage/objects#multipart-upload), which AWS recommends for anything over 100 MB.

For S3 API and feature limitations (as opposed to usage limits), see [Known limitations](/docs/storage/s3-compatibility#known-limitations).

<NeedHelp/>
