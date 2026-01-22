---
title: File storage
subtitle: Store files in external object storage and file management services and track
  metadata in Neon
enableTableOfContents: true
updatedOn: '2025-04-27T11:08:17.425Z'
---

Applications often need to handle file uploads and storage, from user avatars and documents to images and other media. Neon does not yet provide a native file storage solution. Instead, we recommend combining Neon with a specialized storage service.

The typical pattern looks like this:

1. Upload files from your application (client or backend) to an object storage provider or file management service.
2. Store references—such as the file URL, unique key, or identifier—and related metadata like user ID, upload timestamp, file type, size, and permissions in your Neon Postgres database.

This pattern separates file storage from relational data management, with purpose-built services like S3 or R2 handling file storage and Neon managing your data.

## Options for external storage

You can integrate Neon with a variety of storage solutions:

- S3-compatible object storage: Services like [AWS S3](https://aws.amazon.com/pm/serv-s3/), [Cloudflare R2](https://www.cloudflare.com/en-in/developer-platform/products/r2/), and [Backblaze B2](https://www.backblaze.com/cloud-storage) offer file storage via the widely-adopted S3 API.
- File and media management SaaS platforms: Services like [ImageKit](https://imagekit.io/), [Cloudinary](https://cloudinary.com/), [Uploadcare](https://uploadcare.com/) or [Filestack](https://www.filestack.com/) provide higher-level abstractions, often including additional features like image optimization, transformations, and SDKs, while managing the underlying storage infrastructure for you.

<TechCards>

<a href="/docs/guides/aws-s3" title="AWS S3" description="Upload files to AWS S3 and store metadata in Neon" icon="aws-s3-bucket"></a>

<a href="/docs/guides/azure-blob-storage" title="Azure Blob Storage" description="Upload files to Azure Blob Storage and store metadata in Neon" icon="azure"></a>

<a href="/docs/guides/backblaze-b2" title="Backblaze B2" description="Upload files to Backblaze B2 and store metadata in Neon" icon="backblaze"></a>

<a href="/docs/guides/cloudflare-r2" title="Cloudflare R2" description="Upload files to Cloudflare R2 and store metadata in Neon" icon="cloudflare"></a>

<a href="/docs/guides/cloudinary" title="Cloudinary" description="Upload files to Cloudinary and store metadata in Neon" icon="cloudinary"></a>

<a href="/docs/guides/imagekit" title="ImageKit" description="Upload files to ImageKit and store metadata in Neon" icon="imagekit"></a>

<a href="/docs/guides/uploadcare" title="Uploadcare" description="Upload files to Uploadcare and store metadata in Neon" icon="uploadcare"></a>

</TechCards>

<NeedHelp/>
