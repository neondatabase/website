---
title: Storage authentication
subtitle: How Neon credentials map to S3 access keys
summary: >-
  Neon Storage uses Neon credentials with storage:read and storage:write scopes.
  Each credential maps to an S3 Access Key ID and Secret Access Key. Credentials
  are scoped to a branch and valid for that branch and all its descendants.
enableTableOfContents: true
updatedOn: '2026-06-11T14:24:23.574Z'
---

Neon Storage uses the same credential system as AI Gateway and Functions. You create a scoped credential via the Neon API, and it maps directly to the S3 Access Key ID and Secret Access Key your SDK expects. No AWS account or IAM configuration required.

## Creating a credential

A Storage credential requires at minimum one of:

- [`storage:read`](#read-vs-write-scopes): allows GetObject, HeadObject, ListObjects, and ListBuckets
- [`storage:write`](#read-vs-write-scopes): allows all read operations plus PutObject and DeleteObject

```bash shouldWrap
curl -X POST "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/credentials" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"scopes": ["storage:read", "storage:write"], "principal_type": "user", "name": "my-app-credential"}'
```

The `name` and `expires_at` fields are optional. Set `expires_at` to an ISO 8601 timestamp to create a short-lived credential.

The response includes these fields. Both secrets are returned once only, so store them immediately:

```json
{
  "token_id": "550e8400-e29b-41d4-a716-446655440000",
  "token_id_short": "550e8400e29b",
  "name": "my-app-credential",
  "api_token": "nt_live_550e8400e29b_...",
  "s3_secret_access_key": "a665a459...",
  "scopes": ["storage:read", "storage:write"],
  "branch_id": "br-winter-pond-aptw82ef",
  "created_at": "2026-06-08T00:00:00Z",
  "expires_at": null
}
```

## Mapping to your S3 SDK

| Neon credential field  | S3 SDK parameter  |
| ---------------------- | ----------------- |
| `token_id`             | Access Key ID     |
| `s3_secret_access_key` | Secret Access Key |
| `us-east-2`            | Region            |

<Admonition type="warning">
Both `api_token` and `s3_secret_access_key` are returned exactly once at creation. They cannot be retrieved again. Store them in a secrets manager or environment variables before the response is lost.
</Admonition>

Configure your S3 client using these values:

<CodeTabs labels={["TypeScript", "Python", "AWS CLI"]}>

```typescript shouldWrap
import { S3Client } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: 'us-east-2',
  endpoint: process.env.NEON_STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.NEON_STORAGE_ACCESS_KEY_ID,   // token_id
    secretAccessKey: process.env.NEON_STORAGE_SECRET_ACCESS_KEY, // s3_secret_access_key
  },
  forcePathStyle: true,
});
```

```python shouldWrap
import boto3, os

client = boto3.client(
    's3',
    region_name='us-east-2',
    endpoint_url=os.environ['NEON_STORAGE_ENDPOINT'],
    aws_access_key_id=os.environ['NEON_STORAGE_ACCESS_KEY_ID'],      # token_id
    aws_secret_access_key=os.environ['NEON_STORAGE_SECRET_ACCESS_KEY'],  # s3_secret_access_key
)
```

```bash
export AWS_ACCESS_KEY_ID=$NEON_STORAGE_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$NEON_STORAGE_SECRET_ACCESS_KEY
export AWS_DEFAULT_REGION=us-east-2
```

</CodeTabs>

<Admonition type="note">
`forcePathStyle: true` is required for the AWS SDK for JavaScript when using a custom S3 endpoint.
</Admonition>

## Read vs write scopes

Issue separate credentials for read and write access when you want to limit exposure:

- **Server-side code** that uploads files: `storage:write` (includes read)
- **Client-side or CDN code** that only fetches: `storage:read`
- **Presigned URLs**: generated server-side from a `storage:write` credential; the URL itself requires no credential in the browser

Scope enforcement is applied by the S3 data plane. A credential without a storage scope returns `403 AccessDenied` on all S3 operations. Server-side COPY requires both `storage:read` and `storage:write`.

## Credentials in Neon Functions

When your code runs inside Neon Functions, storage credentials are injected automatically. No credential creation step is required:

| Variable                         | Value                             |
| -------------------------------- | --------------------------------- |
| `NEON_STORAGE_ENDPOINT`          | Branch S3 endpoint URL            |
| `NEON_STORAGE_REGION`            | Storage region (e.g. `us-east-2`) |
| `NEON_STORAGE_ACCESS_KEY_ID`     | S3 Access Key ID                  |
| `NEON_STORAGE_SECRET_ACCESS_KEY` | S3 Secret Access Key              |
| `NEON_STORAGE_FORCE_PATH_STYLE`  | Always `"true"`                   |

Credentials are branch-scoped and tied to the function's serving branch. They cannot be overridden by user-supplied environment variables of the same name (the injected secret access key always wins). Use them directly with your S3 client:

```typescript
import { S3Client } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: process.env.NEON_STORAGE_REGION,
  endpoint: process.env.NEON_STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.NEON_STORAGE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEON_STORAGE_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});
```

## How branch binding works

A credential is bound to the branch it was created on. It is valid for:

- That branch (the anchor branch)
- Any branch descended from it: preview branches, feature branches, CI branches

It is **not** valid for branches outside that lineage.

```
main  ──── credential valid here
  └── preview/feature-x  ──── and here
        └── preview/sub-branch  ──── and here
staging  ──── credential NOT valid here (different lineage)
```

## Listing credentials

```bash shouldWrap
curl "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/credentials" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

This returns credential metadata. Secrets are never returned after creation.

## Revoking credentials

```bash shouldWrap
curl -X DELETE "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/credentials/{token_id}" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

To rotate a credential, create a new one, update your environment variables, then revoke the old one.

## Common errors

| Error                       | Cause                               | Fix                                                                                      |
| --------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------- |
| `403 InvalidAccessKeyId`    | `token_id` is wrong or revoked      | Check `NEON_STORAGE_ACCESS_KEY_ID` is set to the full UUID                               |
| `403 SignatureDoesNotMatch` | Wrong secret access key             | Check `NEON_STORAGE_SECRET_ACCESS_KEY` is the 64-char hex value from credential creation |
| `403 AccessDenied`          | Credential lacks the required scope | Recreate with `storage:write` for uploads/deletes                                        |
| `403 AccessDenied`          | Branch not in credential lineage    | Use a credential created on this branch or an ancestor                                   |

<NeedHelp/>
