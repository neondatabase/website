---
title: Serve objects through a CDN (Cloudflare)
subtitle: Cache public bucket objects at the edge with a Cloudflare Worker
summary: >-
  Put Cloudflare in front of a public_read Neon Object Storage bucket with a small
  Worker that proxies GET and HEAD requests and caches responses at the edge.
enableTableOfContents: true
---

Neon Object Storage serves objects from your branch's storage endpoint. To serve them from Cloudflare's edge instead, deploy a small Cloudflare Worker that fetches objects from your bucket and caches them. Repeat requests are answered from the edge without reaching Neon.

A plain DNS `CNAME` from your own domain to the storage endpoint doesn't work. The endpoint's TLS certificate is issued for the storage hostname, so the request has to reach it with that hostname intact, which is what the Worker's `fetch()` does.

<Admonition type="important">
This guide covers `public_read` buckets only. Presigned URLs for private buckets carry a unique signature in every URL, so each URL is a separate cache entry and caching them gains you little. Leave private buckets on presigned URLs, or serve them from your own application.
</Admonition>

## Prerequisites

- A Neon project with [Object Storage](/docs/storage/overview) available on your branch and your branch's storage endpoint, for example `https://<branch-id>.storage.c-<N>.us-east-2.aws.neon.tech`. See [Get started](/docs/storage/get-started) for how to find it.
- A [Cloudflare account](https://dash.cloudflare.com/sign-up). The free plan is enough for `workers.dev`. A custom domain requires a domain on Cloudflare.
- Node.js and [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/), the Cloudflare Workers CLI.

## Set up the CDN

<Steps>

## Make the bucket public

Objects are fetched without credentials, so the bucket must have the `public_read` [access level](/docs/storage/buckets#access-levels):

```bash
neon buckets create my-public-bucket --access-level public_read
```

You can also change the access level of an existing bucket from the **Object storage** tab in the Console.

## Create the Worker

Create a directory with `wrangler.toml` and `src/index.js`.

```toml
name = "neon-storage-cdn"
main = "src/index.js"
compatibility_date = "2026-10-01"

[vars]
NEON_STORAGE_ORIGIN = "https://<branch-id>.storage.c-<N>.us-east-2.aws.neon.tech"
```

```js
export default {
  async fetch(request, env) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }

    // Append the path to the fixed origin as a string. Resolving it with new URL(path, origin)
    // would let a path like //example.com replace the host. The query string is dropped so it
    // can't be used to bypass the cache.
    const upstream = new URL(env.NEON_STORAGE_ORIGIN).origin + new URL(request.url).pathname;

    // Forward only what is needed for partial and conditional requests.
    // Authorization and cookies are never sent to the origin.
    const headers = new Headers();
    for (const name of ['Range', 'If-None-Match']) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }

    return fetch(upstream, {
      method: request.method,
      headers,
      cf: { cacheEverything: true },
    });
  },
};
```

`cacheEverything` makes Cloudflare cache the response regardless of file extension, and it respects the `Cache-Control` header that the origin returns. See [Set Cache-Control when you upload](#set-cache-control-when-you-upload).

## Deploy to workers.dev

```bash
npx wrangler deploy
```

Wrangler prints the Worker URL, `https://neon-storage-cdn.<your-subdomain>.workers.dev`. An object is now available at:

```
https://neon-storage-cdn.<your-subdomain>.workers.dev/my-public-bucket/<object-key>
```

Request it twice and check the `cf-cache-status` response header. The first response is `MISS` and later ones are `HIT`:

```bash
curl -sI https://neon-storage-cdn.<your-subdomain>.workers.dev/my-public-bucket/logo.png | grep -i cf-cache-status
```

## Add a custom domain (optional)

`workers.dev` is intended for testing and personal projects. For production, attach a domain from your Cloudflare account to the Worker by adding a route to `wrangler.toml`, then run `npx wrangler deploy` again:

```toml
[[routes]]
pattern = "cdn.example.com"
custom_domain = true
```

Use your own domain in the URLs that you publish. The Worker's `NEON_STORAGE_ORIGIN` can then change without breaking any link.

## Set Cache-Control when you upload

Cloudflare follows the `Cache-Control` header that Object Storage returns. Object Storage stores the `Cache-Control` value you send with `PutObject` and returns it on `GET` and `HEAD`. It doesn't add one itself.

<CodeTabs labels={["TypeScript", "Python", "AWS CLI"]}>

```typescript shouldWrap
import { PutObjectCommand } from '@aws-sdk/client-s3';

await client.send(
  new PutObjectCommand({
    Bucket: 'my-public-bucket',
    Key: 'logo.png',
    Body: fileBytes,
    ContentType: 'image/png',
    CacheControl: 'public, max-age=31536000, immutable',
  })
);
```

```python shouldWrap
client.put_object(
    Bucket='my-public-bucket',
    Key='logo.png',
    Body=file_bytes,
    ContentType='image/png',
    CacheControl='public, max-age=31536000, immutable',
)
```

```bash shouldWrap
aws s3api put-object \
  --bucket my-public-bucket \
  --key logo.png \
  --body logo.png \
  --content-type image/png \
  --cache-control "public, max-age=31536000, immutable" \
  --endpoint-url "$AWS_ENDPOINT_URL_S3"
```

</CodeTabs>

Without a `Cache-Control` header, Cloudflare applies its own default edge TTL, which is 120 minutes for a `200` response. Responses with `private`, `no-store`, `no-cache`, or `max-age=0` aren't cached.

</Steps>

## Cache invalidation

A cached copy is served until its TTL expires, even if you overwrite or delete the object in your bucket. Choose one of these approaches:

- **Version your keys.** Upload changed content under a new key, such as `logo.v2.png`, and combine it with a long `max-age`. This is the most reliable option and needs no purge.
- **Use a short `max-age`** for objects that change in place.
- **Purge the cache.** Cloudflare caches the URL that the Worker fetches, so purge the storage URL (`https://<branch-id>.storage.../my-public-bucket/logo.png`) from the zone that the Worker runs on, not the URL that visitors request. See [How the Cache works](https://developers.cloudflare.com/workers/reference/how-the-cache-works/#single-file-purge-assets-cached-by-a-worker) in the Cloudflare docs. Purging requires a zone you own, so it isn't available on `workers.dev`.

## Range requests

Object Storage returns `206 Partial Content` for a single-range `Range` header, such as `bytes=0-99` or `bytes=-100`, and advertises `Accept-Ranges: bytes`. The Worker forwards `Range`, and Cloudflare can answer range requests from a cached copy of the full object. Object Storage ignores a multi-range request, such as `bytes=0-9,20-29`, and returns the whole object with `200`.

## Caveats

- **Update `NEON_STORAGE_ORIGIN` if the branch changes.** The branch ID is part of the storage hostname. If you reset or recreate the branch, update the variable and run `npx wrangler deploy` again. Publish URLs on your own domain so that public links don't change.
- **Missing objects.** Cloudflare caches a `404` response for a few minutes by default. Upload an object before you publish its URL.
- **The Worker serves every bucket on the branch.** Anonymous requests to private buckets are rejected by the origin, but you can restrict the Worker to one bucket by checking the first path segment.
- **CORS.** The Worker doesn't forward `Origin`, so responses carry no CORS headers. If browsers load these objects from another origin, add `Access-Control-Allow-Origin` to the Worker's response.

## Next steps

- [Buckets](/docs/storage/buckets): access levels and bucket branching
- [Objects](/docs/storage/objects): upload, download, and presigned URLs
- [S3 compatibility](/docs/storage/s3-compatibility): supported S3 operations

<NeedHelp/>
