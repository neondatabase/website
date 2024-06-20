---
title: Manage database access
subtitle: Learn how to manage user access to databases in your Neon project
enableTableOfContents: true
redirectFrom:
  - /docs/guides/manage-database-access
isDraft: true
updatedOn: '2023-10-23T17:55:15.632Z'
---

Each Neon project is created with a Postgres role that is named for your database with `_owner` as a suffix. For example, if your database is named `neondb`, the project is created with a default role named `neondb_owner`.
