---
title: File Storage
subtitle: Store files in external object storage and file management services and track metadata in Neon
enableTableOfContents: true
updatedOn: '2024-05-23T00:00:00.000Z'
---

Modern applications often need to handle file uploads and storage, whether it's user avatars, documents, images, or other media. While Neon excels at providing a scalable, serverless PostgreSQL database experience, Neon itself does not include a built-in file storage service.

Neon's focus is on being the best platform for your relational data. For managing binary file data (blobs), we recommend a pattern that leverages dedicated, specialized storage services:

Let Neon track the metadata, and let storage services handle the files.

This approach involves:

1. Uploading files directly from your application client or backend to a dedicated object storage provider or file management SaaS.
2. Storing references (like the file's URL, unique key, or identifier) and relevant metadata (such as user ID, upload timestamp, file type, size, permissions) within your Neon Postgres database.

## Options for External Storage

You can integrate Neon with a wide variety of storage solutions:

- S3-Compatible Object Storage: Services like [AWS S3](https://aws.amazon.com/pm/serv-s3/), [Cloudflare R2](https://www.cloudflare.com/en-in/developer-platform/products/r2/), [Backblaze B2](https://www.backblaze.com/cloud-storage) offer robust and scalable storage accessible via the widely adopted S3 API.
- File and Media Management SaaS Platforms: Services like [ImageKit](https://imagekit.io/), [Cloudinary](https://cloudinary.com/), [Uploadcare](https://uploadcare.com/) or [Filestack](https://www.filestack.com/) provide higher-level abstractions, often including features like image optimization, transformations, and more streamlined SDKs, while managing the underlying storage infrastructure for you.

You can follow our guides on how to integrate with these services into your database workflows with Neon.

<TechCards>

<a href="/docs/guides/aws-s3" title="AWS S3" description="Upload files to AWS S3 and store metadata in Neon" icon="aws"></a>

<a href="/docs/guides/cloudflare-r2" title="Cloudflare R2" description="Upload files to Cloudflare R2 and store metadata in Neon" icon="cloudflare"></a>

<a href="/docs/guides/imagekit" title="ImageKit" description="Upload files to ImageKit and store metadata in Neon" icon="imagekit"></a>

<a href="/docs/guides/cloudinary" title="Cloudinary" description="Upload files to Cloudinary and store metadata in Neon" icon="cloudinary"></a>

<a href="/docs/guides/uploadcare" title="Uploadcare" description="Upload files to Uploadcare and store metadata in Neon" icon="uploadcare"></a>

</TechCards>

<NeedHelp/>
