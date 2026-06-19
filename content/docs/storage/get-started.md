---
title: Get started with Neon Storage
subtitle: Upload your first file in minutes
summary: >-
  This quickstart walks you through creating a storage credential, configuring
  your S3 client, creating a bucket, and uploading and downloading your first
  file. Any AWS S3-compatible SDK works. Just point it at your branch endpoint.
enableTableOfContents: true
updatedOn: '2026-06-19T13:59:31.895Z'
---

<PrivatePreviewEnquire/>

To follow this guide, you need a new project in the AWS us-east-2 region.

## Recommended: enable storage with neon.ts

The recommended way to enable storage and get credentials is via `neon.ts`, Neon's infrastructure-as-code config file. Declare buckets under `preview.buckets`, then run `neonctl deploy` to provision them on the linked branch and pull credentials into `.env.local` automatically:

```typescript filename="neon.ts"
import { defineConfig } from '@neondatabase/config/v1';

export default defineConfig({
  preview: {
    buckets: {
      'my-bucket': {},                          // private (default)
      'public-assets': { access: 'public_read' },
    },
  },
});
```

```bash
neonctl deploy          # provisions buckets and writes AWS_* vars to .env.local
```

After deploy, your `.env.local` contains `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION`, and `NEON_STORAGE_FORCE_PATH_STYLE`. Skip to [Configure your S3 client](#configure-your-s3-client) below.

---

If you prefer to manage credentials manually (for example, for CI or production deployments), follow the steps below.

<Steps>

## Create a credential

Use the Neon API to create a credential with storage access:

```bash shouldWrap
curl -X POST "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/credentials" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"scopes": ["storage:read", "storage:write"], "principal_type": "user"}'
```

The response includes your S3 credentials. Store them immediately. You'll only get them once. See [Authentication](/docs/storage/authentication#mapping-to-your-s3-sdk) for how each field maps to your S3 client.

```json
{
  "token_id": "nak_live_...",
  "s3_secret_access_key": "nsk_live_...",
  ...
}
```

Set these as environment variables:

```bash
export AWS_ACCESS_KEY_ID=nak_live_...   # token_id
export AWS_SECRET_ACCESS_KEY=nsk_live_...   # s3_secret_access_key
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
export AWS_ENDPOINT_URL_S3=https://br-winter-pond-aptw82ef.storage.c-2.us-east-2.aws.neon.tech
export AWS_REGION=us-east-2
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
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
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
    region_name=os.environ['AWS_REGION'],
    endpoint_url=os.environ['AWS_ENDPOINT_URL_S3'],
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
)
```

```bash shouldWrap
# The AWS CLI reads AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION
# from the environment automatically. Set the endpoint explicitly:
aws configure set endpoint_url "$AWS_ENDPOINT_URL_S3"
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
  --endpoint-url "$AWS_ENDPOINT_URL_S3"

# Upload a file
aws s3 cp hello.txt s3://my-bucket/hello.txt \
  --endpoint-url "$AWS_ENDPOINT_URL_S3"
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
  --endpoint-url "$AWS_ENDPOINT_URL_S3"
```

</CodeTabs>

</Steps>

## Next steps

- [Buckets](/docs/storage/buckets): access levels, bucket branching, and the Console UI
- [Objects](/docs/storage/objects): list, delete, multipart uploads, and presigned URLs
- [Authentication](/docs/storage/authentication): credential scopes, branch binding, and rotation

<NeedHelp/>
