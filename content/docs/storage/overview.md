---
title: Neon Object Storage
subtitle: Branch-aware object storage in the Neon backend
summary: >-
  Neon Object Storage is S3-style object storage built into your Neon project.
  Files branch and fork copy-on-write with your database, so every branch gets
  its own view of storage. Point an S3 SDK at your branch endpoint and
  authenticate with your Neon credential.
enableTableOfContents: true
layout: wide
hideCopyPage: true
---

<div className="not-prose -mb-4 grid grid-cols-[minmax(0,7fr)_minmax(0,4fr)] items-start gap-16 lg:mb-6 lg:grid-cols-1 lg:gap-10">

<div className="[&>div]:my-0!">
<p className="mt-0 mb-6 max-w-2xl text-base leading-[1.6] tracking-tight text-gray-new-20 [text-wrap:pretty] dark:text-gray-new-80">S3-style object storage that lives in your backend, so your files branch and fork copy-on-write with your data.</p>
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

<NeedHelp/>
