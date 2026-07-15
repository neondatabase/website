---
title: Object storage authentication
subtitle: How Neon credentials map to S3 access keys
summary: >-
  Neon Object Storage uses Neon credentials with storage:read and storage:write scopes.
  Each credential maps to an S3 Access Key ID and Secret Access Key. Credentials
  are scoped to a branch and valid for that branch and all its descendants.
enableTableOfContents: true
updatedOn: '2026-07-15T17:54:41.160Z'
---

<FeatureBetaProps feature_name="Neon Object Storage" />

Neon Object Storage uses the same credential system as AI Gateway and Functions. You create a scoped credential via the Neon API, and it maps directly to the S3 Access Key ID and Secret Access Key your SDK expects. No AWS account or IAM configuration required.

## Creating a credential

An object storage credential requires at minimum one of:

- [`storage:read`](#read-vs-write-scopes): allows GetObject, HeadObject, ListObjects, and ListBuckets
- [`storage:write`](#read-vs-write-scopes): allows all read operations plus PutObject and DeleteObject

<Tabs labels={["Console", "API"]}>
<TabItem>

In the Neon Console, select your branch and click **Credentials** under **APP BACKEND** in the sidebar. Click **Create credential**, give it a name, and check the storage scopes you need.

After creation, the credentials are shown once. Copy the snippet or click **Download .env** before closing:

```text
AWS_ENDPOINT_URL_S3=https://br-cool-darkness-a1b2c3d4.storage.c-1.us-east-2.aws.neon.build
AWS_ACCESS_KEY_ID=nak_live_...
AWS_SECRET_ACCESS_KEY=nsk_live_...
AWS_REGION=us-east-2
```

To view or revoke credentials later, return to the **Credentials** page and use the action menu (⋮) next to the credential.

</TabItem>
<TabItem>

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
  "token_id": "nak_live_...",
  "token_id_short": "9043e374b584...",
  "name": "my-app-credential",
  "api_token": "nt_live_...",
  "s3_secret_access_key": "nsk_live_...",
  "scopes": ["storage:read", "storage:write"],
  "branch_id": "br-winter-pond-aptw82ef",
  "created_at": "2026-06-08T00:00:00Z",
  "expires_at": null
}
```

</TabItem>
</Tabs>

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
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,   // token_id
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!, // s3_secret_access_key
  },
  forcePathStyle: true,
});
```

```python shouldWrap
import boto3, os

client = boto3.client(
    's3',
    region_name=os.environ['AWS_REGION'],
    endpoint_url=os.environ['AWS_ENDPOINT_URL_S3'],
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],         # token_id
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'], # s3_secret_access_key
)
```

```bash
# These env vars are already in AWS-standard form; no remapping needed.
export AWS_ACCESS_KEY_ID=nak_live_...
export AWS_SECRET_ACCESS_KEY=nsk_live_...
export AWS_REGION=us-east-2
```

</CodeTabs>

<Admonition type="note">
`forcePathStyle: true` is required for the AWS SDK for JavaScript when using a custom S3 endpoint.
</Admonition>

## Pull credentials with neon

For local development, `neon env pull` writes storage credentials to your `.env` file automatically. No manual copy-paste from the API response:

```bash
neon env pull --file .env.local
```

This populates `AWS_ENDPOINT_URL_S3`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION` for the current branch alongside your database connection string. To check the current credential status:

```bash
neon config status
```

For production deployments, use the [API-based workflow](#creating-a-credential) to create named, scoped credentials with optional expiry.

## Read vs write scopes

Issue separate credentials for read and write access when you want to limit exposure:

- **Server-side code** that uploads files: `storage:write` (includes read)
- **Client-side or CDN code** that only fetches: `storage:read`
- **Presigned URLs**: generate these server-side from a `storage:write` credential. The URL itself requires no credential in the browser.

The S3 data plane enforces scope on every request. A credential without a storage scope returns `403 AccessDenied` on all S3 operations. Server-side COPY requires both `storage:read` and `storage:write`.

## Credentials in Neon Functions

When your code runs inside Neon Functions, Neon injects storage credentials automatically. You don't need to create a credential:

| Variable                | Value                                    |
| ----------------------- | ---------------------------------------- |
| `AWS_ACCESS_KEY_ID`     | S3 Access Key ID                         |
| `AWS_SECRET_ACCESS_KEY` | S3 Secret Access Key                     |
| `AWS_ENDPOINT_URL_S3`   | Branch S3 endpoint URL                   |
| `AWS_REGION`            | Object storage region (e.g. `us-east-2`) |

See [Environment variables](/docs/compute/functions/environment-variables) for the full list of variables Neon injects into a function.

Credentials are branch-scoped and tied to the function's serving branch. User-supplied environment variables with the same name can't override the injected values (the injected secret access key always wins). Because the credentials use AWS-standard names, the AWS SDK picks them up automatically. Only `forcePathStyle` needs explicit configuration:

```typescript
import { S3Client } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});
```

## How branch binding works

Each credential is tied to the branch it was created on. It is valid for:

- That branch (the anchor branch)
- Any branch descended from it: preview branches, feature branches, CI branches

It's **not** valid for branches outside that lineage.

```
main  ──── credential valid here
  └── preview/feature-x  ──── and here
        └── preview/sub-branch  ──── and here
staging  ──── credential NOT valid here (different lineage)
```

## Listing credentials

The **Credentials** page in the Console shows all credentials for the current branch: name, key ID, creation date, and last used time. To list via the API:

```bash shouldWrap
curl "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/credentials" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

This returns credential metadata. Secrets are never returned after creation.

## Revoking credentials

To revoke from the Console, open the **Credentials** page and use the action menu (⋮) next to the credential. To revoke via the API:

```bash shouldWrap
curl -X DELETE "https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/credentials/{token_id}" \
  -H "Authorization: Bearer $NEON_API_KEY"
```

To rotate a credential, create a new one, update your environment variables, then revoke the old one.

## Common errors

| Error                       | Cause                               | Fix                                                                                                                           |
| --------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `403 InvalidAccessKeyId`    | `token_id` is wrong or revoked      | Check `AWS_ACCESS_KEY_ID` is set correctly. If you rotated the credential, update the value.                                  |
| `403 SignatureDoesNotMatch` | Wrong secret access key             | Check `AWS_SECRET_ACCESS_KEY` is the value from credential creation. Secrets can't be retrieved. Revoke and recreate if lost. |
| `403 AccessDenied`          | Credential lacks the required scope | Recreate with `storage:write` for uploads/deletes                                                                             |
| `403 AccessDenied`          | Branch not in credential lineage    | Use a credential created on this branch or an ancestor                                                                        |

<NeedHelp/>
