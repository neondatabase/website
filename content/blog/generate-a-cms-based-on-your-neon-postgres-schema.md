---
title: Generate a CMS based on your Neon Postgres schema
description: >-
  Use Flashboard to turn your Postgres database into a powerful, Notion-style
  admin panel
excerpt: >-
  You created your app with Neon Postgres and love having all your data in it.
  Now you need to manage HTML content, images, and file uploads for your app’s
  data, such as products, events, profiles, etc. Your marketing team has to
  manage blog posts, landing pages, documentation, FAQ...
date: '2025-05-30T17:39:32'
updatedOn: '2025-05-30T18:39:04'
category: community
categories:
  - community
authors:
  - felipe-freitag
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/generate-a-cms-based-on-your-neon-postgres-schema/cover.png
  alt: Flashbaord and Neon
isFeatured: false
seo:
  title: Generate a CMS based on your Neon Postgres schema - Neon
  description: >-
    Flashboard is an instant CMS for your Postgres database. Connect your Neon
    database and get a full admin panel with a Notion-style editor, file
    uploads, and more - no setup required.
  keywords: []
  noindex: false
  ogTitle: Generate a CMS based on your Neon Postgres schema - Neon
  ogDescription: >-
    Flashboard is an instant CMS for your Postgres database. Connect your Neon
    database and get a full admin panel with a Notion-style editor, file
    uploads, and more - no setup required.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/generate-a-cms-based-on-your-neon-postgres-schema/social.png
source:
  wpId: 9819
  wpSlug: generate-a-cms-based-on-your-neon-postgres-schema
  exportedAt: '2026-03-20T13:31:00.745Z'
---

You created your app with Neon Postgres and love having all your data in it.

Now you need to manage HTML content, images, and file uploads for your app’s data, such as products, events, profiles, etc. Your marketing team has to manage blog posts, landing pages, documentation, FAQs, and case studies.

The built-in [Neon Console](https://neon.tech/docs/guides/tables) works nicely for simpler edits. But it falls short when you need to edit HTML or store references to uploads from your storage service.

A popular alternative is to integrate with a headless CMS. To do so, you must design the CMS schema separately from your app’s database, learn the vendor’s DSL, and integrate with an SDK. It could take you from a few days to a few weeks to get started. From this moment on, whenever you add features to your app, you’ll need to merge data from two sources, keep them in sync, and consider the vendor’s architecture.

And let’s be honest: the last thing you want is to add another data source and kill the joy of using Postgres for everything ☺️

Is there an alternative? What would it cost to create the CMS capabilities yourself? Besides authentication and authorization, you’ll need to:

- Upload files
- Edit content

## Edit content

There are multiple ways to edit content. Maybe you could get away with a markdown editor. But people usually prefer to write in a rich text editor.

Should you add one to your app?

Adding an open-source rich text editor to your app could take weeks to months. If a basic implementation works for your use case, it might not take long, but creating a polished UI takes time.

Before getting in the weeds implementing a rich text editor, it’s worth taking the time to find out exactly which parts you need for your app. Building a full Notion-like editor is much more expensive than a simpler one that only supports headings.

## Upload files

If your app already has a storage service, you can use that for your content.

When you integrate with a storage service, such as an S3-compatible one, your server will communicate with your bucket, store a reference to the files somewhere in your database, and generate temporary signed URLs to download them when needed. That is great for your app’s files.

But what about rich text? You can’t add abstract storage references in the middle of HTML.

You need to create another upload strategy. When you add file uploads to your rich text editor, you need to upload those to a public bucket and store a public permanent URL in your HTML.

You’ll end up with two upload methods. One for your app’s files, uploaded to a protected bucket, and another for rich content, uploaded to a public bucket.

Implementing an editor and file uploads may be a lot of work, but integrating with a headless CMS is too. Consider what your business needs. The big advantage of the former is that you keep all your data in one place, and you’ll have an easier time growing and maintaining your app.

We built Flashboard for you to **keep everything in your Neon database** and **get a great CMS UX in minutes.**

## An instant CMS for Neon Postgres

[Flashboard](https://www.getflashboard.com/) is an instant CMS for your database. It connects to it and immediately creates a complete admin panel, with a Notion-like HTML editor, uploads, and more.

<YoutubeIframe embedId="nq6rOClFpcE" isDocPost={false} />

## Conclusion

Before integrating a headless CMS, consider the long-term costs of spreading your data among multiple sources. Neon’s Postgres solution is powerful, and the benefits of adding CMS capabilities to your app can outweigh the costs. If you’d rather ship faster and have a CMS for your database without coding one yourself, give Flashboard a try!
