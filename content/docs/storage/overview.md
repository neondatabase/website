---
title: Neon Storage
subtitle: S3-compatible object storage that branches with your database
summary: >-
  Neon Storage is S3-compatible object storage built into the Neon backend.
  Every branch gets its own isolated storage namespace. Use any AWS S3 SDK
  or tool. Point it at your branch endpoint and authenticate with your Neon
  credential.
enableTableOfContents: true
updatedOn: '2026-07-13T15:03:24.073Z'
---

Neon Storage is S3-compatible object storage built into the Neon backend for apps and agents. Every branch gets its own isolated storage namespace. Use any AWS S3-compatible SDK or tool. Point it at your branch endpoint and authenticate with your Neon credential. No separate storage account or cloud credentials required.

> During the private preview, Storage is available for **new projects** in the **AWS us-east-2** region only.

- **Branches with your database.** Each branch has its own view of storage. Test file uploads and deletions in preview branches without touching production data.
- **Standard S3 SDKs.** The AWS SDK for JavaScript, boto3, the AWS CLI, the [Files SDK](https://files-sdk.dev), and any other S3-compatible tool works out of the box.
- **Two access modes.** `private` buckets require authentication for all operations. `public_read` buckets allow anonymous reads with authenticated writes.
- **One credential system.** The same Neon credential system used by AI Gateway and Functions.

## Quickstart

<DetailIconCards>

<a href="/docs/storage/get-started" description="Create a credential, configure a client, and upload your first file." icon="todo">Quickstart</a>

<a href="/docs/storage/buckets" description="Create and manage buckets, set access levels, and understand how buckets branch." icon="database">Buckets</a>

<a href="/docs/storage/objects" description="Upload, download, list, delete, and generate presigned URLs for objects." icon="data">Objects</a>

<a href="/docs/storage/authentication" description="Understand how Neon credentials map to S3 access keys." icon="lock-landscape">Authentication</a>

</DetailIconCards>

## Starter templates

Browse working examples at [build-on-neon.vercel.app](https://build-on-neon.vercel.app/). The `ai-sdk` template uses Neon Storage: an image-generation agent that stores uploaded photos and AI-generated images in branch-scoped buckets, served via presigned URLs from a Neon Function:

```bash
neon bootstrap --template ai-sdk
```

The [with-files-sdk](https://github.com/neondatabase/examples/tree/main/with-files-sdk) example shows a minimal script that uploads local files to a branch-scoped bucket using the Files SDK and its `neon` adapter.

<NeedHelp/>
