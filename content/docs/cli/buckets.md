---
title: 'Neon CLI command: buckets'
subtitle: 'Manage branch object-storage buckets and their objects'
summary: >-
  The Neon CLI `neon buckets` command manages branch object-storage buckets and
  their contents: create, list, and delete buckets, and use the `neon buckets
  object` subcommands to list, download, upload, and delete objects. Object
  listing supports prefixes, a --delimiter to collapse keys into folders, and
  cursor-based pagination; `buckets object delete --recursive` removes every
  object under a prefix.
enableTableOfContents: true
redirectFrom:
  - /docs/cli/bucket
---

<PrivatePreviewEnquire/>

The `buckets` command manages branch object-storage buckets and their objects. Buckets belong to a branch; the `object` subcommands work with the objects inside a bucket.

<CliSubcommands command="buckets" />

## neon buckets create (#create)

Creates a bucket on a branch.

<CliUsage command="buckets create" />

<CliOptions command="buckets create" />

Create a private bucket on a branch:

```bash
neon buckets create my-bucket --access-level private
```

## neon buckets list (#list)

Lists the buckets on a branch.

<CliUsage command="buckets list" />

<CliOptions command="buckets list" />

List the buckets on a branch with `json` output:

```bash
neon buckets list --output json
```

## neon buckets delete (#delete)

Deletes a bucket from a branch.

<CliUsage command="buckets delete" />

<CliOptions command="buckets delete" />

```bash
neon buckets delete my-bucket
```

## Bucket objects (#object)

Lists, downloads, uploads, or deletes objects in a bucket.

<CliSubcommands command="buckets object" anchorParts="object" />

### neon buckets object list (#object-list)

Lists objects in a bucket.

<CliUsage command="buckets object list" />

<CliOptions command="buckets object list" />

List the objects under a prefix, collapsing keys into folders:

```bash
neon buckets object list my-bucket/images --delimiter /
```

### neon buckets object get (#object-get)

Downloads an object from a bucket to a local file.

<CliUsage command="buckets object get" />

<CliOptions command="buckets object get" />

```bash
neon buckets object get my-bucket/images/logo.png --file ./logo.png
```

### neon buckets object put (#object-put)

Uploads a local file to a bucket as an object.

<CliUsage command="buckets object put" />

<CliOptions command="buckets object put" />

Upload a file, optionally setting the Content-Type to store it with:

```bash
neon buckets object put my-bucket/images/logo.png --file ./logo.png
neon buckets object put my-bucket/notes/readme.txt --file ./readme.txt --content-type text/plain
```

### neon buckets object delete (#object-delete)

Deletes an object, or every object under a prefix.

<CliUsage command="buckets object delete" />

<CliOptions command="buckets object delete" />

With `--recursive`, the target is treated as a prefix, which must end with `/`.

Delete a single object, or every object under a prefix:

```bash
neon buckets object delete my-bucket/images/logo.png
neon buckets object delete my-bucket/images/ --recursive
```
