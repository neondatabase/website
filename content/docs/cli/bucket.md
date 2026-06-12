---
title: 'Neon CLI command: bucket'
subtitle: 'Manage branch object-storage buckets and their objects'
summary: >-
  The Neon CLI `neonctl bucket` command manages branch object-storage buckets
  and their contents: create, list, and delete buckets, and use the `neonctl
  bucket object` subcommands to list, download, upload, and delete objects.
  Object listing supports prefixes, a --delimiter to collapse keys into
  folders, and cursor-based pagination; `bucket object delete --recursive`
  removes every object under a prefix.
enableTableOfContents: true
---

The `bucket` command manages branch object-storage buckets and their objects. Buckets belong to a branch; the `object` subcommands work with the objects inside a bucket.

<CliSubcommands command="bucket" />

## neonctl bucket create (#create)

Creates a bucket on a branch.

<CliUsage command="bucket create" />

<CliOptions command="bucket create" />

Create a private bucket on a branch:

```bash
neonctl bucket create my-bucket --access-level private
```

## neonctl bucket list (#list)

Lists the buckets on a branch.

<CliUsage command="bucket list" />

<CliOptions command="bucket list" />

List the buckets on a branch with `json` output:

```bash
neonctl bucket list --output json
```

## neonctl bucket delete (#delete)

Deletes a bucket from a branch.

<CliUsage command="bucket delete" />

<CliOptions command="bucket delete" />

```bash
neonctl bucket delete my-bucket
```

## Bucket objects (#object)

Lists, downloads, uploads, or deletes objects in a bucket.

<CliSubcommands command="bucket object" anchorParts="object" />

### neonctl bucket object list (#object-list)

Lists objects in a bucket.

<CliUsage command="bucket object list" />

<CliOptions command="bucket object list" />

List the objects under a prefix, collapsing keys into folders:

```bash
neonctl bucket object list my-bucket/images --delimiter /
```

### neonctl bucket object get (#object-get)

Downloads an object from a bucket to a local file.

<CliUsage command="bucket object get" />

<CliOptions command="bucket object get" />

```bash
neonctl bucket object get my-bucket/images/logo.png --file ./logo.png
```

### neonctl bucket object put (#object-put)

Uploads a local file to a bucket as an object.

<CliUsage command="bucket object put" />

<CliOptions command="bucket object put" />

Upload a file, optionally setting the Content-Type to store it with:

```bash
neonctl bucket object put my-bucket/images/logo.png --file ./logo.png
neonctl bucket object put my-bucket/notes/readme.txt --file ./readme.txt --content-type text/plain
```

### neonctl bucket object delete (#object-delete)

Deletes an object, or every object under a prefix.

<CliUsage command="bucket object delete" />

<CliOptions command="bucket object delete" />

With `--recursive`, the target is treated as a prefix, which must end with `/`.

Delete a single object, or every object under a prefix:

```bash
neonctl bucket object delete my-bucket/images/logo.png
neonctl bucket object delete my-bucket/images/ --recursive
```
