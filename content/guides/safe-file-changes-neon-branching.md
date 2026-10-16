---
title: 'Safely test file changes with Neon Object Storage branching'
subtitle: 'Test uploads, replacements, and deletions on a Neon branch, verify the result in your frontend, and keep production untouched'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-10-13T00:00:00.000Z'
updatedOn: '2026-10-15T12:19:24.138Z'
---

If you're building an app with file uploads (product photos, avatars, invoices, or PDF exports), you eventually have to change files that are already live. Maybe you're replacing a product image, moving objects to a new key prefix, or cleaning up attachments for accounts that were deleted. Unlike the rest of your deploys, file changes have no undo. You can roll back code, but you can't roll back a file deletion or an overwrite. If you make a mistake, your users see it immediately.

The usual workarounds offer the same trade-off: test somewhere that isn't production, or test production itself. A standalone staging bucket drifts from production, so the files you test against aren't the files your users have. A dry run can print the keys it would touch, but it can't tell you whether the new image renders correctly, whether a replacement looks right, or whether the frontend still resolves a file after a deletion. S3 Versioning can restore an object you overwrite or delete, but only after the change has reached users, and it writes to the live bucket the whole time.

[Neon Object Storage](/docs/storage/overview) removes that trade-off. Buckets [branch with your database](/docs/storage/buckets#bucket-branching) using the same copy-on-write model as Lakebase Postgres branches, so a branch gives you an isolated copy of both the rows and the files at the moment you create it. You can upload, replace, and delete real files on the branch, open the same frontend against it, and confirm the result, all without touching production.

This guide walks through the workflow by building a Next.js gallery app. You'll:

- Create a Neon project in the Console with Object Storage enabled and a `media` bucket
- Point a gallery app at the bucket
- Create a branch in the Neon Console that inherits the bucket's objects
- Run an upload, a replacement, and a deletion against the branch
- Verify the change in the gallery and confirm production is unchanged
- Discard the branch, or promote the verified change to production

<Admonition type="info" title="Region availability">
Neon Object Storage is currently available in AWS US East (Ohio) (`aws-us-east-2`), AWS US East (N. Virginia) (`aws-us-east-1`), AWS Europe (Frankfurt) (`aws-eu-central-1`), and AWS Asia Pacific (Singapore) (`aws-ap-southeast-1`). Support is expanding toward [all regions](/docs/introduction/regions). Create your project in one of these regions to follow along.
</Admonition>

## Prerequisites

Before starting, make sure you have:

1. **Node.js**: Version 22 or later. Download from [nodejs.org](https://nodejs.org/).
2. **Neon account**: Sign up for a free account on Neon at [console.neon.tech](https://console.neon.tech/signup).

<Steps>

## Create a Neon project

Create a new project in the Neon Console with Object Storage enabled. The gallery will read and write files from the `media` bucket on this project.

1. Sign in to the [Neon Console](https://console.neon.tech) and click **New Project**.
2. Enter a **Project name**, for example `file-changes-demo`.
3. Choose a **Region** where Object Storage is available. The [Product availability](/docs/introduction/regions#product-availability) table shows which ones support it.
4. Under **Services**, enable **Object storage**, set the **Bucket name** to `media`, and set **Visibility** to **Public**.
5. Click **Create project**.

![Create project dialog with Object storage enabled, a media bucket, and Public visibility](/docs/guides/safe-file-changes-create-project.png)

Neon provisions the project and its default branch (`production`), along with the `media` bucket on that branch.

<Admonition type="note" title="Public versus private buckets">
**Public** visibility sets the bucket's access level to `public_read`, which allows anonymous reads while still requiring credentials for writes. That lets the gallery render images from plain URLs, which makes the branch-versus-production comparison visually obvious. If your app stores private files, set the visibility to **Private** and generate [presigned URLs](/docs/storage/objects#presigned-urls) instead. The branching behavior is the same either way.
</Admonition>

## Get your storage credentials

With the project created, copy the storage credentials:

1. In the Neon Console, click **Connect** at the top of the sidebar.
2. Open the **Storage** tab.
3. Select **Parameters only** to see the raw `.env` values.
4. Click **Reveal credential** if the secret is hidden, then copy the four values.

![Connect to your branch modal with the Storage tab open, showing the four AWS_* values](/docs/connect/connect_to_branch_storage_tab.png)

The endpoint URL is unique to each branch, while your access keys remain valid across the branch lineage. A credential created on a branch works on that branch and any branch descended from it, so you only need to swap the endpoint when you switch branches.

## Create the gallery app

Create a new Next.js app and install the AWS SDK for JavaScript:

```bash
npx create-next-app@latest media-gallery --yes
cd media-gallery
npm install @aws-sdk/client-s3
npm install -D tsx
```

Create `.env.local` in the project root and paste the values from the [Connect dialog](#get-your-storage-credentials) into it. You'll also need to add the bucket name (`MEDIA_BUCKET`):

```text filename=".env.local"
AWS_ENDPOINT_URL_S3=https://br-cool-darkness-a1b2c3d4.storage.c-2.us-east-2.aws.neon.tech
AWS_ACCESS_KEY_ID=nak_live_...
AWS_SECRET_ACCESS_KEY=nsk_live_...
AWS_REGION=us-east-2
MEDIA_BUCKET=media
```

Create `lib/s3.ts` for the shared S3 client and a helper that builds public URLs:

```typescript filename="lib/s3.ts"
import { S3Client } from '@aws-sdk/client-s3';

export const BUCKET = process.env.MEDIA_BUCKET ?? 'media';

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export function publicUrl(key: string, version?: number) {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3!.replace(/\/+$/, '');
  const url = `${endpoint}/${BUCKET}/${key}`;
  return version ? `${url}?v=${version}` : url;
}
```

`lib/s3.ts` creates an S3 client that points at the branch's endpoint and uses the access keys from your `.env.local`. The `publicUrl` helper builds a URL for a given object key, optionally appending a `?v=` query parameter so the browser fetches the new bytes when an object is overwritten instead of reusing a cached copy.

The `forcePathStyle` option is required for Object Storage, which uses path-style URLs rather than virtual-hosted style.

Now create a seed script that uploads four placeholder images to the bucket. The gallery will render these files, so you can see the branch's state before and after each change.

```typescript filename="scripts/seed.ts"
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { BUCKET, s3 } from '../lib/s3';

const assets = [
    { key: 'products/aurora-desk-lamp.svg', label: 'Aurora desk lamp', color: '#6366f1' },
    { key: 'products/nimbus-chair.svg', label: 'Nimbus chair', color: '#0ea5e9' },
    { key: 'products/oculus-wall-clock.svg', label: 'Oculus wall clock', color: '#f59e0b' },
    { key: 'products/vertex-side-table.svg', label: 'Vertex side table', color: '#10b981' },
];

function placeholder(label: string, color: string) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
  <rect width="640" height="480" fill="${color}"/>
  <text x="320" y="250" font-family="sans-serif" font-size="40" fill="#ffffff" text-anchor="middle">${label}</text>
</svg>`;
}

const main = async () => {
    for (const asset of assets) {
        await s3.send(
            new PutObjectCommand({
                Bucket: BUCKET,
                Key: asset.key,
                Body: placeholder(asset.label, asset.color),
                ContentType: 'image/svg+xml',
            })
        );
        console.log(`Uploaded ${asset.key}`);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
```

Run the seed script from the project root. It uploads four placeholder SVGs to the bucket and prints each key as it finishes:

```bash
npx tsx --env-file=.env.local scripts/seed.ts
```

```text
Uploaded products/aurora-desk-lamp.svg
Uploaded products/nimbus-chair.svg
Uploaded products/oculus-wall-clock.svg
Uploaded products/vertex-side-table.svg
```

Create `scripts/list.ts` to list the bucket's contents. This is useful for confirming the branch's state before and after each change:

```typescript filename="scripts/list.ts"
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { BUCKET, s3 } from '../lib/s3';

const main = async () => {
    const { Contents = [] } = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET }));

    for (const object of Contents.sort((a, b) => a.Key!.localeCompare(b.Key!))) {
        console.log(`${object.Key}  (${object.Size} bytes)`);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
```

## Build the gallery frontend

The gallery lists the bucket and renders each object, then offers three forms: upload, replace, and delete. Create `app/actions.ts` with the server actions that perform the writes:

```typescript filename="app/actions.ts"
'use server';

import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { revalidatePath } from 'next/cache';
import { BUCKET, s3 } from '../lib/s3';

async function putObject(key: string, file: File) {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type || 'application/octet-stream',
    })
  );
}

export async function uploadAsset(formData: FormData) {
  const key = String(formData.get('key') ?? '').trim();
  const file = formData.get('file');

  if (!key || !(file instanceof File) || file.size === 0) {
    throw new Error('Provide a key and a file');
  }

  await putObject(key, file);
  revalidatePath('/');
}

export async function replaceAsset(formData: FormData) {
  const key = String(formData.get('key') ?? '');
  const file = formData.get('file');

  if (!key || !(file instanceof File) || file.size === 0) {
    throw new Error('Choose an existing file and upload a replacement');
  }

  await putObject(key, file);
  revalidatePath('/');
}

export async function deleteAsset(formData: FormData) {
  const key = String(formData.get('key') ?? '');

  if (!key) {
    throw new Error('Choose a file to delete');
  }

  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  revalidatePath('/');
}
```

`app/actions.ts` defines the three write operations the gallery needs. All of them run on the server, so your access keys never reach the browser. `putObject` is the shared helper: it reads the uploaded file into a buffer and sends it with `PutObjectCommand`, using the key you supply. `uploadAsset` and `replaceAsset` both call it, while `deleteAsset` uses `DeleteObjectCommand`. Each action calls `revalidatePath('/')` to refresh the gallery after a change.

Replace `app/page.tsx` with the gallery. It lists the bucket on every request, so the view always reflects the current branch:

```tsx filename="app/page.tsx"
import { Suspense } from 'react';
import { io } from 'next/cache';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { BUCKET, publicUrl, s3 } from '../lib/s3';
import { deleteAsset, replaceAsset, uploadAsset } from './actions';

async function AssetGallery() {
  await io();

  const { Contents = [] } = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET }));

  const assets = Contents.filter((object) => object.Key).sort((a, b) =>
    a.Key!.localeCompare(b.Key!)
  );

  return (
    <>
      <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {assets.length === 0 ? (
          <p className="col-span-full rounded-lg border border-dashed p-8 text-center text-sm text-gray-400">
            No assets yet. Upload one below.
          </p>
        ) : (
          assets.map((object) => {
            const key = object.Key!;
            const version = object.LastModified?.getTime();

            return (
              <figure
                key={key}
                className="group rounded-lg border p-3 transition hover:border-gray-400 hover:shadow-sm dark:hover:border-gray-600"
              >
                <img src={publicUrl(key, version)} alt={key} className="h-32 w-full object-contain" />
                <figcaption
                  className="mt-2 truncate text-xs text-gray-600 dark:text-gray-400"
                  title={key}
                >
                  {key}
                </figcaption>
              </figure>
            );
          })
        )}
      </section>

      <section className="mt-10 space-y-8 border-t pt-8 dark:border-gray-800">
        <form action={uploadAsset} className="space-y-2">
          <h2 className="font-medium">Upload a file</h2>
          <input
            name="key"
            placeholder="products/lumen-desk-lamp.png"
            className="w-full rounded border p-2 dark:border-gray-700 dark:bg-gray-900"
            required
          />
          <input name="file" type="file" required className="block text-sm" />
          <button className="rounded bg-black px-3 py-2 text-sm text-white transition hover:bg-gray-800 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Upload
          </button>
        </form>

        <form action={replaceAsset} className="space-y-2">
          <h2 className="font-medium">Replace a file</h2>
          <select name="key" className="w-full rounded border p-2 dark:border-gray-700 dark:bg-gray-900" required>
            {assets.map((object) => {
              const key = object.Key!;
              return (
                <option key={key} value={key}>
                  {key}
                </option>
              );
            })}
          </select>
          <input name="file" type="file" required className="block text-sm" />
          <button className="rounded bg-black px-3 py-2 text-sm text-white transition hover:bg-gray-800 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Replace
          </button>
        </form>

        <form action={deleteAsset} className="space-y-2">
          <h2 className="font-medium">Delete a file</h2>
          <select name="key" className="w-full rounded border p-2 dark:border-gray-700 dark:bg-gray-900" required>
            {assets.map((object) => {
              const key = object.Key!;
              return (
                <option key={key} value={key}>
                  {key}
                </option>
              );
            })}
          </select>
          <button className="rounded bg-red-600 px-3 py-2 text-sm text-white transition hover:bg-red-700 active:scale-[0.98]">
            Delete
          </button>
        </form>
      </section>
    </>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-8 font-sans">
      <h1 className="text-2xl font-semibold">Media gallery</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Reading from the{' '}
        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">{BUCKET}</code>{' '}
        bucket
      </p>

      <Suspense fallback={<p className="mt-8 text-sm text-gray-400">Loading assets…</p>}>
        <AssetGallery />
      </Suspense>
    </main>
  );
}
```

`app/page.tsx` renders the gallery in two parts. `AssetGallery` is an async server component. The `await io()` call marks a point that suspends during prerendering so the listing is excluded from the static shell and streams in at request time. The listing re-runs on every request because no cache scope wraps it. It lists the bucket with `ListObjectsV2Command`, sorts the keys, and renders each one as a tile with an image and caption. The three forms below it call the server actions you defined in `app/actions.ts`.

<Admonition type="tip" title="Increase the request body limit for large files">
Server actions cap the request body at 1 MB by default, so larger files fail to upload. The browser shows no error; the `Body exceeded 1 MB limit` message appears only in the dev server log. You can increase the limit in `next.config.ts`:

```ts filename="next.config.ts"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ...other config...,
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
```

</Admonition>

Start the dev server and open [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

The gallery displays the four seeded files, and the upload, replace, and delete forms are ready to use. The app is currently connected to the production branch, so any changes will affect the live bucket. To safely test file operations, create a separate test branch and point the app to it before making changes.

![Media gallery running locally with the seeded files](/docs/guides/safe-file-changes-gallery-seeded.png)

## Create a test branch in the Neon Console

Now create a branch in the Neon Console that inherits the `media` bucket and its objects. The branch is isolated, so any changes you make to files on it won't affect production.

1. In the Neon Console, select your project.
2. Select **Branches** in the sidebar.
3. Click **New branch**.
4. Name the branch `test-file-changes`.
5. Leave **Auto-delete** set to 1 day. You can change it later if you want the branch to persist longer.
6. Set the **Parent branch** to your default branch (`production`).
7. Choose **Branch data and schema**. This creates the branch from the parent's latest state, so it inherits the `media` bucket and the objects it holds at branch creation.
8. Click **Create**.

![Create branch dialog in the Neon Console](/docs/guides/safe-file-changes-create-branch.png)

## Point the app at the branch

The gallery reads and writes files in the bucket associated with the configured branch. The bucket endpoint is specified by the `AWS_ENDPOINT_URL_S3` environment variable. To connect the app to a different branch, update `.env.local` with that branch's endpoint.

1. In the Neon Console, select `test-file-changes` from the branch selector above the **Connect** button. Open **Connect**, navigate to the **Storage** tab, and copy the `AWS_ENDPOINT_URL_S3` value for that branch.

2. In `.env.local`, comment out the production endpoint and add a line for the branch's endpoint. The other three values remain the same, since the credential is valid across the branch lineage.

   ```env filename=".env.local"
   # Production
   # AWS_ENDPOINT_URL_S3=https://br-cool-darkness-a1b2c3d4.storage.c-2.us-east-2.aws.neon.tech
   # Test branch
   AWS_ENDPOINT_URL_S3=https://br-steep-sun-e5f6a7b8.storage.c-2.us-east-2.aws.neon.tech
   AWS_ACCESS_KEY_ID=nak_live_...
   AWS_SECRET_ACCESS_KEY=nsk_live_...
   AWS_REGION=us-east-2
   MEDIA_BUCKET=media
   ```

3. Restart the dev server so the new environment variable takes effect.

The gallery still shows the same four files, but now it's reading from the branch's bucket. Any changes you make will be isolated to the branch.

You can confirm the same from the terminal:

```bash
npx tsx --env-file=.env.local scripts/list.ts
```

```text
products/aurora-desk-lamp.svg  (271 bytes)
products/nimbus-chair.svg  (267 bytes)
products/oculus-wall-clock.svg  (272 bytes)
products/vertex-side-table.svg  (272 bytes)
```

## Test uploads, replacements, and deletions

With the app pointed at the branch, test all three file changes: the upload, the replacement, and the deletion. Use the gallery forms for each one.

**Upload a new file.** In the **Upload a file** form, enter `products/<your-file-name>`, select an image file, and submit the form. The newly uploaded file will appear as a tile in the gallery.

**Replace an existing file.** In the **Replace a file** form, select `products/nimbus-chair.svg`, choose a visibly different image, and submit. The gallery image updates to the new file, and the URL remains the same.

**Delete a file.** In the **Delete a file** form, select `products/oculus-wall-clock.svg` and submit. The tile disappears from the gallery.

![Media gallery after the three changes](/docs/guides/safe-file-changes-gallery-changed.png)

The branch's file list now reflects all three changes. You can also confirm the state from the terminal:

```bash
npx tsx --env-file=.env.local scripts/list.ts
```

```text
products/aurora-desk-lamp.svg  (271 bytes)
products/lumen-desk-lamp.png  (27226 bytes)
products/nimbus-chair.svg  (52711 bytes)
products/vertex-side-table.svg  (272 bytes)
```

## Confirm production is unchanged

You've made three real changes to the branch's bucket, but production is still untouched. To verify, point the app back at production by restoring the original endpoint in `.env.local` and restarting the dev server.

```text filename=".env.local"
# Production
AWS_ENDPOINT_URL_S3=https://br-cool-darkness-a1b2c3d4.storage.c-2.us-east-2.aws.neon.tech
# Test branch
# AWS_ENDPOINT_URL_S3=https://br-steep-sun-e5f6a7b8.storage.c-2.us-east-2.aws.neon.tech
```

The gallery is back to its original state, and the production bucket still holds the four seeded files. You can also confirm the same from the terminal:

```bash
npx tsx --env-file=.env.local scripts/list.ts
```

```text
products/aurora-desk-lamp.svg  (271 bytes)
products/nimbus-chair.svg  (267 bytes)
products/oculus-wall-clock.svg  (272 bytes)
products/vertex-side-table.svg  (272 bytes)
```

## Discard or promote the branch

The test run is done. You can either throw the branch away or apply the change to production.

**To discard it,** delete the branch. Because it's isolated, deleting it can't affect production.

1. In the Neon Console, select **Branches**.
2. Open the three-dot menu (⋮) for `test-file-changes` and select **Delete branch**.

<Admonition type="warning">
Files that exist only on the branch, such as new uploads, are deleted when the branch is deleted.
</Admonition>

**To promote it,** repeat the same operations against production. Point `AWS_ENDPOINT_URL_S3` back at production, restart the app, and run the upload, replacement, and deletion again. This applies a change you've already verified end to end, instead of trying it for the first time against live files. If the change also lives in code, such as a new key layout, deploy the version you validated on the branch.

</Steps>

## Conclusion

This workflow is especially useful for testing file changes that would be costly to get wrong:

- **Deleting files that are no longer needed.** Clean up files associated with closed accounts, expired exports, or orphaned uploads. Test the deletion on a branch first to confirm that the right files are removed and the frontend can still resolve the remaining assets. Check out [Clean up orphaned S3 objects with Neon Object Storage branching](/guides/clean-up-orphaned-s3-objects-neon-branching) for a more detailed example.
- **Overwriting an existing object key.** Re-encode images, regenerate thumbnails or watermarks, or correct a bad upload without changing the key that other systems and deployed clients already reference.
- **Migrating to a new object key layout.** When moving thousands of objects to a new naming scheme, verify the migration script, database updates, and frontend changes together before applying them to production.

The same isolation applies to AI agents. An agent that uploads generated assets, rewrites keys, or deletes stale files is doing exactly the kind of irreversible work that makes branching useful, and it can do that work on a branch instead of against live files. If you're wiring this up programmatically, declare buckets in a [`neon.ts`](/docs/reference/neon-ts#buckets) policy so `neon deploy` provisions them and injects the `AWS_*` credentials, or use the [`neon buckets`](/docs/cli/buckets) CLI commands to create a bucket on a branch as part of an automated flow. Both give an agent a throwaway environment it can write to and discard, with production untouched.

Because branching also forks your Postgres data, you can test changes that span both database rows and stored objects in the same environment. For example, you can validate a new `thumbnail_url` column or a migration to a new key prefix alongside the corresponding object changes. This also makes branches useful as per-PR preview environments, where the database records and assets your tests depend on are consistent with production.

Learn more about [Neon branching](/docs/introduction/branching) and the [GitHub integration](/docs/guides/neon-github-integration) for creating branches automatically for pull requests.

## Resources

- [Neon Object Storage overview](/docs/storage/overview)
- [Get started with Object Storage](/docs/storage/get-started)
- [Object branching](/docs/storage/objects#object-branching)
- [neon.ts reference](/docs/reference/neon-ts#buckets)
- [Neon CLI: buckets](/docs/cli/buckets)

<NeedHelp/>
