---
title: Objects
subtitle: Upload, download, list, and delete files
summary: >-
  Work with objects in Neon Storage using any S3-compatible SDK or the AWS CLI.
  Supports single-part and multipart uploads, range requests, batch deletes,
  and presigned URLs for browser-side access.
enableTableOfContents: true
updatedOn: '2026-06-08T19:26:22.039Z'
---

Objects in Neon Storage are files stored inside a bucket. Every object has a key (its path within the bucket), a body, a content type, and optional metadata. Objects branch with your database — each branch has its own view of storage.

## Upload

<CodeTabs labels={["TypeScript", "Python", "AWS CLI"]}>

```typescript shouldWrap
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { client } from './client';

await client.send(new PutObjectCommand({
  Bucket: 'my-bucket',
  Key: 'images/photo.jpg',
  Body: fileBuffer,
  ContentType: 'image/jpeg',
  Metadata: {
    'uploaded-by': 'user-123',
  },
}));
```

```python shouldWrap
client.put_object(
    Bucket='my-bucket',
    Key='images/photo.jpg',
    Body=file_bytes,
    ContentType='image/jpeg',
    Metadata={'uploaded-by': 'user-123'},
)
```

```bash shouldWrap
aws s3 cp ./photo.jpg s3://my-bucket/images/photo.jpg \
  --content-type image/jpeg \
  --endpoint-url "https://$NEON_STORAGE_HOST"
```

</CodeTabs>

## Multipart upload

For large files, the AWS SDK automatically uses multipart upload above a configurable threshold. You can also initiate multipart upload manually for fine-grained control.

<CodeTabs labels={["TypeScript", "Python"]}>

```typescript shouldWrap
import { Upload } from '@aws-sdk/lib-storage';
import { client } from './client';
import { createReadStream } from 'fs';

const upload = new Upload({
  client,
  params: {
    Bucket: 'my-bucket',
    Key: 'large-file.zip',
    Body: createReadStream('./large-file.zip'),
  },
  partSize: 10 * 1024 * 1024, // 10 MiB per part
});

await upload.done();
```

```python shouldWrap
import boto3

# boto3 handles multipart automatically via upload_file/upload_fileobj
client.upload_file(
    './large-file.zip',
    'my-bucket',
    'large-file.zip',
    Config=boto3.s3.transfer.TransferConfig(
        multipart_threshold=10 * 1024 * 1024,
        multipart_chunksize=10 * 1024 * 1024,
    ),
)
```

</CodeTabs>

## Download

<CodeTabs labels={["TypeScript", "Python", "AWS CLI"]}>

```typescript shouldWrap
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { client } from './client';

const response = await client.send(new GetObjectCommand({
  Bucket: 'my-bucket',
  Key: 'images/photo.jpg',
}));

// Stream to a file
const stream = response.Body as NodeJS.ReadableStream;
stream.pipe(fs.createWriteStream('./photo.jpg'));
```

```python
response = client.get_object(Bucket='my-bucket', Key='images/photo.jpg')
with open('./photo.jpg', 'wb') as f:
    f.write(response['Body'].read())
```

```bash shouldWrap
aws s3 cp s3://my-bucket/images/photo.jpg ./photo.jpg \
  --endpoint-url "https://$NEON_STORAGE_HOST"
```

</CodeTabs>

**Range requests** are supported for partial downloads:

```typescript shouldWrap
const response = await client.send(new GetObjectCommand({
  Bucket: 'my-bucket',
  Key: 'video.mp4',
  Range: 'bytes=0-1048575', // first 1 MiB
}));
```

## List objects

Use a prefix and delimiter to simulate a folder structure.

<CodeTabs labels={["TypeScript", "Python", "AWS CLI"]}>

```typescript shouldWrap
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { client } from './client';

const response = await client.send(new ListObjectsV2Command({
  Bucket: 'my-bucket',
  Prefix: 'images/',
  Delimiter: '/',
}));

// Objects in images/
console.log(response.Contents);

// Sub-folders (common prefixes)
console.log(response.CommonPrefixes);
```

```python
response = client.list_objects_v2(
    Bucket='my-bucket',
    Prefix='images/',
    Delimiter='/',
)

# Objects in images/
print(response.get('Contents', []))

# Sub-folders
print(response.get('CommonPrefixes', []))
```

```bash shouldWrap
aws s3 ls s3://my-bucket/images/ \
  --endpoint-url "https://$NEON_STORAGE_HOST"
```

</CodeTabs>

For buckets with more than 1,000 objects, paginate using `ContinuationToken`:

```typescript shouldWrap
let token: string | undefined;
do {
  const response = await client.send(new ListObjectsV2Command({
    Bucket: 'my-bucket',
    ContinuationToken: token,
  }));
  for (const obj of response.Contents ?? []) {
    console.log(obj.Key);
  }
  token = response.NextContinuationToken;
} while (token);
```

## Delete objects

**Single object:**

<CodeTabs labels={["TypeScript", "Python", "AWS CLI"]}>

```typescript shouldWrap
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

await client.send(new DeleteObjectCommand({
  Bucket: 'my-bucket',
  Key: 'images/photo.jpg',
}));
```

```python
client.delete_object(Bucket='my-bucket', Key='images/photo.jpg')
```

```bash shouldWrap
aws s3 rm s3://my-bucket/images/photo.jpg \
  --endpoint-url "https://$NEON_STORAGE_HOST"
```

</CodeTabs>

**Batch delete (up to 1,000 objects per request):**

<CodeTabs labels={["TypeScript", "Python"]}>

```typescript shouldWrap
import { DeleteObjectsCommand } from '@aws-sdk/client-s3';

await client.send(new DeleteObjectsCommand({
  Bucket: 'my-bucket',
  Delete: {
    Objects: [
      { Key: 'images/photo1.jpg' },
      { Key: 'images/photo2.jpg' },
    ],
  },
}));
```

```python
client.delete_objects(
    Bucket='my-bucket',
    Delete={
        'Objects': [
            {'Key': 'images/photo1.jpg'},
            {'Key': 'images/photo2.jpg'},
        ]
    },
)
```

</CodeTabs>

**Delete a folder (all objects under a prefix):**

Use the Neon API to delete all objects with a given prefix in one call:

```bash shouldWrap
curl -X DELETE \
  "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/buckets/my-bucket/objects-by-prefix?prefix=images/" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

## Presigned URLs

Generate a time-limited URL that allows a browser or unauthenticated client to upload or download a specific object — without exposing your credentials.

**Presigned GET (download):**

<CodeTabs labels={["TypeScript", "Python"]}>

```typescript shouldWrap
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { client } from './client';

const url = await getSignedUrl(
  client,
  new GetObjectCommand({ Bucket: 'my-bucket', Key: 'report.pdf' }),
  { expiresIn: 3600 }, // 1 hour
);

console.log(url); // share this URL — no credentials needed
```

```python
url = client.generate_presigned_url(
    'get_object',
    Params={'Bucket': 'my-bucket', 'Key': 'report.pdf'},
    ExpiresIn=3600,  # 1 hour
)
print(url)
```

</CodeTabs>

**Presigned PUT (upload from browser):**

<CodeTabs labels={["TypeScript", "Python"]}>

```typescript shouldWrap
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { client } from './client';

const url = await getSignedUrl(
  client,
  new PutObjectCommand({
    Bucket: 'my-bucket',
    Key: 'uploads/user-avatar.png',
    ContentType: 'image/png',
  }),
  { expiresIn: 300 }, // 5 minutes
);

// On the client side:
// await fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': 'image/png' } });
```

```python
url = client.generate_presigned_url(
    'put_object',
    Params={
        'Bucket': 'my-bucket',
        'Key': 'uploads/user-avatar.png',
        'ContentType': 'image/png',
    },
    ExpiresIn=300,
)
print(url)
```

</CodeTabs>

## Object branching

Objects branch with your database. When you fork a branch, the child starts with the same view of storage as the parent at that point in time:

- Uploading a new object to a child branch is only visible on that branch and its descendants.
- Deleting an object on a child branch does not affect the parent.
- The parent's objects remain unchanged regardless of what happens on child branches.

## Next steps

- [Buckets](/docs/storage/buckets) — set access levels, understand bucket branching
- [Authentication](/docs/storage/authentication) — credential scopes and read vs write access

<NeedHelp/>
