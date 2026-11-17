---
title: "How do I store private user files and share them with expiring links?"
subtitle: "On Neon, keep files in a private Object Storage bucket, record each file's owner in Postgres, and hand out presigned GET URLs that expire after minutes or hours."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'What is the simplest way to generate embeddings and store them in Postgres?'
  slug: simplest-way-generate-embeddings-store-postgres
nextLink:
  title: 'How do I subscribe to a Postgres query and get its results live as the data changes?'
  slug: subscribe-to-postgres-query-live-results
---

Use Neon. Put the files in a private [Neon Object Storage](/docs/storage/overview) bucket, keep a Postgres row per file with its owner, and serve each download through a presigned GET URL with a short expiry. The bucket never needs to be public, and the link stops working when it expires ([presigned URLs](/docs/storage/objects#presigned-urls)).

## Keep the bucket private

Buckets are `private` by default: every operation needs a credential with the right scope ([buckets](/docs/storage/buckets)). Don't switch to `public_read` for user files, since that lets anyone read any object whose key they can guess. Access levels are set in the Console, the Neon API, or [`neon.ts`](/docs/reference/neon-ts#buckets), not through S3 bucket policies, which return `501 Not Implemented` ([S3 compatibility](/docs/storage/s3-compatibility)).

Credentials are scoped to `storage:read` or `storage:write` and are valid only on their branch and its descendants ([authentication](/docs/storage/authentication)). Keep them on the server. Inside a [Neon Function](/docs/compute/functions/overview), they're injected for you along with `DATABASE_URL` ([environment variables](/docs/compute/functions/environment-variables)).

## Authorize in Postgres, then sign the URL

The access decision lives in your database, not the bucket. Store files under keys that don't reveal anything, record ownership in a table, and check that table before signing:

```sql
CREATE TABLE files (
  key        text PRIMARY KEY,
  owner_id   text NOT NULL,
  filename   text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

```ts
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const { rows } = await pool.query(
  'SELECT key, filename FROM files WHERE key = $1 AND owner_id = $2',
  [key, userId]
);
if (!rows[0]) return c.json({ error: 'not found' }, 404);

const url = await getSignedUrl(
  s3,
  new GetObjectCommand({
    Bucket: 'user-files',
    Key: rows[0].key,
    ResponseContentDisposition: `attachment; filename="${rows[0].filename}"`,
  }),
  { expiresIn: 3600 }
);
```

`userId` comes from a verified session. With [Managed Better Auth](/docs/auth/overview), a Function verifies the JWT against the injected `NEON_AUTH_JWKS_URL` and reads the user ID from `sub` ([Functions authentication](/docs/compute/functions/authentication)). The `ResponseContentDisposition` override sets the filename the browser saves, and it's covered by the signature, so nobody can change it after signing. The Files SDK has a shorter form: `files.url(key, { expiresIn: 3600 })`.

This is the pattern behind the [private photo library walkthrough](/blog/building-a-private-searchable-photo-library-on-the-neon-backend): a private bucket, the owner taken from the Managed Better Auth JWT, and presigned GET URLs that last one hour.

## Pick the right expiry

A presigned URL works for anyone who holds it until it expires, so treat it like a temporary password. Expiry is set per URL with `expiresIn` (`X-Amz-Expires`). Short expiries (minutes) suit in-app image and document views, since the app can request a fresh URL on each page load. Longer expiries (hours or days) suit "share this file" links sent by email. To revoke a share before it expires, change the object's key or delete it, then update the row.

Don't rely on credential expiry as a sharing mechanism. The `expires_at` field on Neon credentials isn't currently enforced, so revoke credentials explicitly with the CLI or API ([authentication](/docs/storage/authentication)).

## Clean up old files

Lifecycle rules are accepted but not enforced, so a bucket won't delete expired uploads on its own ([S3 compatibility](/docs/storage/s3-compatibility)). Run cleanup as a [schedule trigger](/docs/compute/functions/triggers/schedule) on a Function: once a day, select rows past their retention date, delete the objects in batches of up to 1,000 with `DeleteObjects`, and delete the rows. The trigger fires even when your Postgres compute is scaled to zero, and its query wakes the compute only for that run ([triggers overview](/docs/compute/functions/triggers/overview)).

Because buckets [branch with Postgres](/docs/storage/objects#object-branching), you can test retention logic on a branch: deletes there don't touch production files or rows.

<CTA title="Serve private files with presigned URLs" description="Create a private bucket and generate your first expiring download link." buttonText="Presigned URLs" buttonUrl="/docs/storage/objects#presigned-urls" />
