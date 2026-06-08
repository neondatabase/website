---
title: Buckets
subtitle: Create and manage storage buckets
summary: >-
  Neon Storage buckets hold your objects and branch with your database. Create
  buckets via the Neon Console, the Neon API, or the S3 API. Set the access
  level to private or public_read to control who can read objects.
enableTableOfContents: true
updatedOn: '2026-06-08T19:36:47.586Z'
---

A bucket is a named container for objects in Neon Storage. Buckets are scoped to a branch. Each branch has its own view of storage, and buckets inherit from parent branches when a new branch is created.

## Create a bucket

You can create a bucket from the Neon Console, the Neon API, or directly via the S3 API.

**Neon Console**

In the Neon Console, navigate to your project, select a branch, and open the **Storage** tab. Click **New bucket**, enter a name, choose an access level, and click **Create**.

**Neon API**

```bash shouldWrap
curl -X POST "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/buckets" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "my-bucket", "access_level": "private"}'
```

**S3 API**

<CodeTabs labels={["TypeScript", "Python", "AWS CLI"]}>

```typescript shouldWrap
import { S3Client, CreateBucketCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: 'us-east-2',
  endpoint: `https://${process.env.NEON_STORAGE_HOST}`,
  credentials: {
    accessKeyId: process.env.NEON_STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEON_STORAGE_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

await client.send(new CreateBucketCommand({ Bucket: 'my-bucket' }));
```

```python shouldWrap
import boto3, os

client = boto3.client(
    's3',
    region_name='us-east-2',
    endpoint_url=f"https://{os.environ['NEON_STORAGE_HOST']}",
    aws_access_key_id=os.environ['NEON_STORAGE_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['NEON_STORAGE_SECRET_ACCESS_KEY'],
)

client.create_bucket(Bucket='my-bucket')
```

```bash shouldWrap
aws s3api create-bucket \
  --bucket my-bucket \
  --region us-east-2 \
  --endpoint-url "https://$NEON_STORAGE_HOST"
```

</CodeTabs>

<Admonition type="note">
`NEON_STORAGE_HOST` is your branch's storage endpoint. See [Get started](/docs/storage/get-started) for how to obtain it.
</Admonition>

## List buckets

<CodeTabs labels={["TypeScript", "Python", "AWS CLI"]}>

```typescript shouldWrap
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

const { Buckets } = await client.send(new ListBucketsCommand({}));
console.log(Buckets);
```

```python
response = client.list_buckets()
print(response['Buckets'])
```

```bash
aws s3api list-buckets --endpoint-url "https://$NEON_STORAGE_HOST"
```

</CodeTabs>

## Delete a bucket

Buckets must be empty before deletion. Delete all objects first, then delete the bucket.

<CodeTabs labels={["TypeScript", "Python", "AWS CLI"]}>

```typescript shouldWrap
import { S3Client, DeleteBucketCommand } from '@aws-sdk/client-s3';

await client.send(new DeleteBucketCommand({ Bucket: 'my-bucket' }));
```

```python
client.delete_bucket(Bucket='my-bucket')
```

```bash
aws s3api delete-bucket \
  --bucket my-bucket \
  --endpoint-url "https://$NEON_STORAGE_HOST"
```

</CodeTabs>

## Access levels

Every bucket has an access level that controls who can read objects in it.

| Access level  | Reads                                 | Writes                     |
| ------------- | ------------------------------------- | -------------------------- |
| `private`     | Require a valid credential            | Require a valid credential |
| `public_read` | Open to anyone (no credential needed) | Require a valid credential |

The default is `private`. Set the access level when creating a bucket via the Neon API, or change it from the **Storage** tab in the Console.

<Admonition type="note">
Access level is set through the Neon Console or API, not through the S3 API. S3 ACL and bucket policy mutation requests (PutBucketAcl, PutBucketPolicy) return `501 Not Implemented`. If you need to change access level on an existing bucket, use the Console or Neon API.
</Admonition>

**public_read example**

Creating a `public_read` bucket allows anyone to fetch objects without a credential:

```bash shouldWrap
curl -X POST "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/buckets" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "my-public-bucket", "access_level": "public_read"}'
```

Objects in this bucket are accessible at:

```
https://<branch-id>.storage.c-<N>.us-east-2.aws.neon.tech/my-public-bucket/<object-key>
```

## Bucket branching

When you create a new branch, it inherits all buckets from its parent at the point of forking. From that point on, each branch has its own independent view of storage:

- Creating or deleting a bucket on a child branch does not affect the parent.
- Objects uploaded to a child branch are only visible on that branch and its descendants.
- The parent branch continues to see its own state unchanged.

This makes it safe to test bucket changes in a preview branch without affecting production.

## Next steps

- [Objects](/docs/storage/objects) — upload, download, list, and delete objects
- [Authentication](/docs/storage/authentication) — credential scopes and branch binding

<NeedHelp/>
