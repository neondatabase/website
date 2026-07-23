# Blog images

Blog images are served from a Cloudflare R2 bucket through the public CDN at `https://cdn.neonapi.io`, the same host used by published blog post image URLs.

The bucket name, account endpoint, and access keys are environment-specific and aren't stored in this repository. There is no in-repo upload script. Get credentials from the user's locally saved configuration or ask the user, and reference the bucket through `BLOG_R2_BUCKET` rather than hardcoding it.

Images are not committed to either the website or blog content repositories. Upload out of band before referencing a CDN URL in the post.

## Object keys and public URLs

Use this object-key pattern:

```text
public/images/pages/blog/<post-slug>/<filename>
```

The matching public URL is:

```text
https://cdn.neonapi.io/public/images/pages/blog/<post-slug>/<filename>
```

This mapping depends on the CDN root configuration. Always verify the public URL after uploading.

Use lowercase kebab-case slugs and filenames. Group every image for a post under the post slug. Use a descriptive filename such as `branching-architecture.png`, not `image-1.png`.

Don't overwrite an existing CDN object in place when replacing an image. Cached content may continue to appear. Use a new descriptive filename and update every reference.

## Prepare the image

- Use the final post slug before uploading.
- Crop and compress the image before upload.
- Use JPEG or WebP for photographic artwork and PNG when transparency or lossless UI detail matters.
- Use GIF only when animation is necessary. Prefer a hosted video for large or high-resolution animation.
- Remove private data, credentials, internal URLs, and unrelated UI from screenshots.
- Write alt text that explains the useful information, not the visual decoration.

## Use locally saved credentials

Never print, copy into chat, commit, or add credentials to the repository.

The upload uses the AWS CLI against R2's S3-compatible endpoint. Use either:

1. An AWS CLI profile that already contains the R2 access key and secret, or
2. A user-owned local environment file outside the repository.

### AWS CLI profile

List profile names without displaying credentials:

```bash
aws configure list-profiles
```

Set the profile, endpoint, and bucket in the current shell:

```bash
export BLOG_R2_AWS_PROFILE="<local-profile-name>"
export BLOG_R2_ENDPOINT_URL="https://<cloudflare-account-id>.r2.cloudflarestorage.com"
export BLOG_R2_BUCKET="<r2-bucket-name>"
```

Don't assume `default` is the R2 profile. If the profile uses AWS SSO and reports an expired session, select the R2 profile or run the profile's required login command. Don't replace or rewrite the user's credentials.

### Local environment file

Ask the user for the path if it isn't already provided in `BLOG_R2_CREDENTIALS_FILE`. Don't search arbitrary home-directory files.

The local file may define standard AWS names:

```bash
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
BLOG_R2_ENDPOINT_URL=...
BLOG_R2_BUCKET=...
```

It may instead use plain S3-style names, optionally with a Cloudflare account ID:

```bash
ACCESS_KEY_ID=...
SECRET_ACCESS_KEY=...
ACCOUNT_ID=...
ENDPOINT_URL=...
BUCKET_NAME=...
```

Load it without printing the values:

```bash
set -a
source "$BLOG_R2_CREDENTIALS_FILE"
set +a

export AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID:-$ACCESS_KEY_ID}"
export AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY:-$SECRET_ACCESS_KEY}"
export BLOG_R2_ENDPOINT_URL="${BLOG_R2_ENDPOINT_URL:-${ENDPOINT_URL:-https://${ACCOUNT_ID}.r2.cloudflarestorage.com}}"
export BLOG_R2_BUCKET="${BLOG_R2_BUCKET:-$BUCKET_NAME}"
```

Validate the configuration before making a request:

```bash
if [[ -z "${AWS_ACCESS_KEY_ID:-}" || -z "${AWS_SECRET_ACCESS_KEY:-}" ]]; then
  echo "R2 access key or secret is missing" >&2
  return 1 2>/dev/null || exit 1
fi

if [[ -z "${BLOG_R2_ENDPOINT_URL:-}" || "$BLOG_R2_ENDPOINT_URL" == *'https://.r2.'* ]]; then
  echo "BLOG_R2_ENDPOINT_URL or ACCOUNT_ID is missing" >&2
  return 1 2>/dev/null || exit 1
fi

if [[ -z "${BLOG_R2_BUCKET:-}" ]]; then
  echo "BLOG_R2_BUCKET is missing" >&2
  return 1 2>/dev/null || exit 1
fi
```

When using an AWS CLI profile, only `BLOG_R2_AWS_PROFILE`, `BLOG_R2_ENDPOINT_URL`, and `BLOG_R2_BUCKET` are required in the shell. If required configuration is absent, stop and name the missing variable. Don't ask the user to paste a secret into chat.

## Verify access

Before an upload, make a read-only access check:

```bash
profile_args=()
if [[ -n "${BLOG_R2_AWS_PROFILE:-}" ]]; then
  profile_args=(--profile "$BLOG_R2_AWS_PROFILE")
fi

aws s3api head-bucket \
  --bucket "$BLOG_R2_BUCKET" \
  --endpoint-url "$BLOG_R2_ENDPOINT_URL" \
  "${profile_args[@]}"
```

An authentication error is a blocker. Don't try unrelated profiles or expose credential configuration while debugging.

## Upload

From the directory containing the image:

```bash
slug="<post-slug>"
image_path="<local-image-path>"
filename="$(basename "$image_path")"
content_type="$(file --brief --mime-type "$image_path")"
object_key="public/images/pages/blog/${slug}/${filename}"
profile_args=()
if [[ -n "${BLOG_R2_AWS_PROFILE:-}" ]]; then
  profile_args=(--profile "$BLOG_R2_AWS_PROFILE")
fi

aws s3 cp "$image_path" "s3://$BLOG_R2_BUCKET/$object_key" \
  --endpoint-url "$BLOG_R2_ENDPOINT_URL" \
  --content-type "$content_type" \
  --cache-control "public, max-age=31536000, immutable" \
  "${profile_args[@]}"
```

This is an external write. Confirm the slug, filename, object key, and local file before running it.

## Verify the public asset

Construct the CDN URL and verify it:

```bash
image_url="https://cdn.neonapi.io/$object_key"
curl --fail --head "$image_url"
```

Then add image URLs to the post:

1. Set `cover.image` and `seo.image` to the approved cover or social asset.
2. Add the lead image as the first body element after frontmatter. It may use the cover URL or a distinct image URL.

```md
![Descriptive alt text](https://cdn.neonapi.io/public/images/pages/blog/<post-slug>/<filename>)
```

Review the local post and branch preview. Confirm the full image loads, the crop works at desktop and mobile widths, and the alt text matches the image.
