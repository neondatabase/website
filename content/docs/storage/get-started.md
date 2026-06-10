---
title: Get started with Neon Storage
subtitle: Upload your first file in minutes
summary: >-
  This quickstart walks you through creating a storage credential, configuring
  your S3 client, creating a bucket, and uploading and downloading your first
  file. Any AWS S3-compatible SDK works. Just point it at your branch endpoint.
enableTableOfContents: true
updatedOn: '2026-06-10T16:54:18.281Z'
---

<Admonition type="note" title="Private Preview">
Neon Storage is currently in Private Preview, available for new projects in the AWS us-east-2 region only. To request access, sign up at [We're building backends](https://neon.com/blog/were-building-backends).
</Admonition>

<Steps>

## Create a credential

Use the Neon API to create a credential with storage access:

```bash shouldWrap
curl -X POST "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/credentials" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"scopes": ["storage:read", "storage:write"], "principal_type": "user"}'
```

The response includes your S3 credentials. Store them immediately. They are returned only once:

```json
{
  "token_id": "550e8400-e29b-41d4-a716-446655440000",
  "s3_secret_access_key": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
  ...
}
```

Set these as environment variables:

```bash
export NEON_STORAGE_ACCESS_KEY_ID=550e8400-e29b-41d4-a716-446655440000   # token_id
export NEON_STORAGE_SECRET_ACCESS_KEY=a665a45920422f9d...                 # s3_secret_access_key
```

Your project ID and branch ID are available in the Neon Console URL or via `neonctl projects list` and `neonctl branches list`.

## Find your branch endpoint

Fetch your branch's storage state from the Neon API. The response includes the full S3 endpoint URL, the region, and whether path-style addressing is required:

```bash shouldWrap
curl "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/storage" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

```json
{
  "enabled": true,
  "s3_endpoint": "https://br-winter-pond-aptw82ef.storage.c-2.us-east-2.aws.neon.tech",
  "region": "us-east-2",
  "force_path_style": true
}
```

Set these as environment variables:

```bash
export NEON_STORAGE_ENDPOINT=https://br-winter-pond-aptw82ef.storage.c-2.us-east-2.aws.neon.tech
export NEON_STORAGE_REGION=us-east-2
```

A `404` response means Storage is not yet enabled for that branch. Make sure you're using a project in the AWS us-east-2 region.

## Install dependencies

<CodeTabs labels={["npm", "yarn", "pnpm", "pip"]}>

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner dotenv
```

```bash
yarn add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner dotenv
```

```bash
pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner dotenv
```

```bash
pip install boto3 python-dotenv
```

</CodeTabs>

## Configure your S3 client

<CodeTabs labels={["TypeScript", "Python", "AWS CLI"]}>

```typescript shouldWrap
import { S3Client } from '@aws-sdk/client-s3';
import 'dotenv/config';

export const client = new S3Client({
  region: 'us-east-2',
  endpoint: process.env.NEON_STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.NEON_STORAGE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEON_STORAGE_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});
```

```python shouldWrap
import boto3
import os
from dotenv import load_dotenv

load_dotenv()

client = boto3.client(
    's3',
    region_name='us-east-2',
    endpoint_url=os.environ['NEON_STORAGE_ENDPOINT'],
    aws_access_key_id=os.environ['NEON_STORAGE_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['NEON_STORAGE_SECRET_ACCESS_KEY'],
)
```

```bash
# Add to ~/.aws/credentials or export as env vars
export AWS_ACCESS_KEY_ID=$NEON_STORAGE_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$NEON_STORAGE_SECRET_ACCESS_KEY
export AWS_DEFAULT_REGION=us-east-2
```

</CodeTabs>

## Create a bucket and upload a file

<CodeTabs labels={["TypeScript", "Python", "AWS CLI"]}>

```typescript shouldWrap
import { CreateBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { client } from './client';

// Create a bucket
await client.send(new CreateBucketCommand({ Bucket: 'my-bucket' }));

// Upload a file
await client.send(new PutObjectCommand({
  Bucket: 'my-bucket',
  Key: 'hello.txt',
  Body: 'Hello from Neon Storage!',
  ContentType: 'text/plain',
}));

console.log('Uploaded!');
```

```python shouldWrap
# Create a bucket
client.create_bucket(Bucket='my-bucket')

# Upload a file
client.put_object(
    Bucket='my-bucket',
    Key='hello.txt',
    Body='Hello from Neon Storage!',
    ContentType='text/plain',
)

print('Uploaded!')
```

```bash shouldWrap
# Create a bucket
aws s3api create-bucket \
  --bucket my-bucket \
  --endpoint-url "$NEON_STORAGE_ENDPOINT"

# Upload a file
aws s3 cp hello.txt s3://my-bucket/hello.txt \
  --endpoint-url "$NEON_STORAGE_ENDPOINT"
```

</CodeTabs>

## Download a file

<CodeTabs labels={["TypeScript", "Python", "AWS CLI"]}>

```typescript shouldWrap
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { client } from './client';

const response = await client.send(new GetObjectCommand({
  Bucket: 'my-bucket',
  Key: 'hello.txt',
}));

const text = await response.Body?.transformToString();
console.log(text); // Hello from Neon Storage!
```

```python
response = client.get_object(Bucket='my-bucket', Key='hello.txt')
print(response['Body'].read().decode('utf-8'))  # Hello from Neon Storage!
```

```bash shouldWrap
aws s3 cp s3://my-bucket/hello.txt ./downloaded.txt \
  --endpoint-url "$NEON_STORAGE_ENDPOINT"
```

</CodeTabs>

</Steps>

## Next steps

- [Buckets](/docs/storage/buckets) — access levels, bucket branching, and the Console UI
- [Objects](/docs/storage/objects) — list, delete, multipart uploads, and presigned URLs
- [Authentication](/docs/storage/authentication) — credential scopes, branch binding, and rotation

<NeedHelp/>
