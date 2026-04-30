---
title: 'Edit records directly from the Neon console: meet the new Tables page'
description: Powered by Drizzle Studio
excerpt: >-
  A few weeks ago, we shipped a cool new feature in our console. In the past,
  the only way for Neon users to work with their data was via SQL queries; now,
  you can modify your data in an intuitive and visual way directly from the
  Tables page, powered by Drizzle Studio. You can now...
date: '2024-06-14T15:53:39'
updatedOn: '2024-06-14T15:53:42'
category: workflows
categories:
  - workflows
authors:
  - lachezar-petkov
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/edit-records-directly-from-the-neon-console-meet-the-new-tables-page/cover.jpg
  alt: null
isFeatured: false
seo:
  title: 'Edit records directly from the Neon console: meet the new Tables page - Neon'
  description: >-
    The Tables page in the Neon console is now powered by Drizzle studio! You
    can now browse your tables and make data edits visually and easily.
  keywords: []
  noindex: false
  ogTitle: 'Edit records directly from the Neon console: meet the new Tables page - Neon'
  ogDescription: >-
    The Tables page in the Neon console is now powered by Drizzle studio! You
    can now browse your tables and make data edits visually and easily.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/edit-records-directly-from-the-neon-console-meet-the-new-tables-page/social.jpg
source:
  wpId: 6251
  wpSlug: edit-records-directly-from-the-neon-console-meet-the-new-tables-page
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/edit-records-directly-from-the-neon-console-meet-the-new-tables-page/neon-edit-tables-1-1-1024x576-2ea841cd.jpg)

A few weeks ago, we shipped a cool new feature in our console. In the past, the only way for Neon users to work with their data was via SQL queries; now, **you can modify your data in an intuitive and visual way directly from the Tables page, powered by Drizzle Studio.**

You can now use the console to add, update, and delete records, filter data, add or remove columns, drop or truncate tables, and [export data in .json and .csv formats.](https://neon.tech/blog/export-to-csv-json-and-xlsx-from-the-neon-console) I show you how in this quick video:

<video controls width="1280" height="720">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/edit-records-directly-from-the-neon-console-meet-the-new-tables-page/new-tables-view-quick-demo-by-lacho-55214a0e.mp4" />
</video>

## Editing data from the Neon console: no SQL required

With our new feature, you can now browse your tables and make edits visually and easily. This update is designed to streamline your workflow and make data management more accessible, even for those who may not be as comfortable writing SQL queries.

If you want to give it a spin:

1. Log in to your Neon account
2. Optionally, [create a development branch](https://neon.tech/docs/manage/branches#create-a-branch) from your primary branch (named ‘main’ by default). This branch will be an exact copy-on-write clone of all your data and schemas from main, but it’s isolated – it allows you to play around with your data safely.
3. Once you’re in the development branch, navigate to the Tables view and try to make edits directly on the tables (**similarly as you would do on a spreadsheet**)

After making your changes, you can simply save them, and they’re immediately reflected in the console – and in your dataset _for that particular branch_. Changes won’t be reflected on the main branch, unless you modify your data there as well.

![Image](https://cdn.neonapi.io/public/images/pages/blog/edit-records-directly-from-the-neon-console-meet-the-new-tables-page/screenshot-2024-06-14-at-85035percente2percent80percentafam-1024x410-765e2102.png)

![Image](https://cdn.neonapi.io/public/images/pages/blog/edit-records-directly-from-the-neon-console-meet-the-new-tables-page/screenshot-2024-06-14-at-85035percente2percent80percentafam-1-1024x410-7e5f57e0.png)

## Adding filters and browsing data

If you have a large table and are looking for a particular record, you can also use Filters vs writing a SQL query. For example, here I’m looking for somebody whose first name is Grace:

![Image](https://cdn.neonapi.io/public/images/pages/blog/edit-records-directly-from-the-neon-console-meet-the-new-tables-page/screenshot-2024-06-14-at-85124percente2percent80percentafam-1024x355-94016582.png)

After you’ve added a filter, your search will be saved as a view so you can easily come back to it later (see `View 1` up there).

You can add as many filters as needed, download data, and browse records using the pagination widget. Unnecessary columns can also be hidden for a more focused view.

![Image](https://cdn.neonapi.io/public/images/pages/blog/edit-records-directly-from-the-neon-console-meet-the-new-tables-page/screenshot-2024-06-14-at-85200percente2percent80percentafam-1024x355-4aad85bb.png)

![Image](https://cdn.neonapi.io/public/images/pages/blog/edit-records-directly-from-the-neon-console-meet-the-new-tables-page/screenshot-2024-06-14-at-85220percente2percent80percentafam-1024x355-8a14ff75.png)

## Remember: changes only affect your current branch

Like always in Neon, database branches have data isolation. If you modify records from the console in your development branch, they won’t be automatically reflected in the primary branch or its parent.

This ensures that your production environment remains stable and unaffected by any accidental data changes. Once you know the changes are safe, if you wish so, you can apply them to the main branch.

## Give it a go

This renewed Tables view aims to provide you with flexibility in managing your data, all from within the Neon console. We hope this enhances your experience and look forward to your feedback! If you haven’t tried Neon, you can create an account for Free [here](https://console.neon.tech/signup).
