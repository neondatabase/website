---
title: Managing Postgres Directly in VS Code
description: Trying out Microsoft's New Postgres Extension with Copilot Integration
excerpt: >-
  Microsoft recently introduced a Visual Studio Code extension for Postgres
  database management. Similar in functionality to tools like PgAdmin or
  DBeaver, this extension embeds Postgres management directly into VSCode and
  comes fully integrated with GitHub Copilot, allowing it to...
date: '2025-06-09T17:36:49'
updatedOn: '2025-07-22T01:53:15'
category: postgres
categories:
  - postgres
  - workflows
authors:
  - sam-harrison
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/managing-postgres-directly-in-vs-code/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Managing Postgres Directly in VS Code - Neon
  description: >-
    Microsoft recently introduced a Visual Studio Code extension for Postgres
    management. We play with it in this post.
  keywords: []
  noindex: false
  ogTitle: Managing Postgres Directly in VS Code - Neon
  ogDescription: >-
    Microsoft recently introduced a Visual Studio Code extension for Postgres
    management. We play with it in this post.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/managing-postgres-directly-in-vs-code/social.jpg
source:
  wpId: 10010
  wpSlug: managing-postgres-directly-in-vs-code
  exportedAt: '2026-03-20T13:31:00.745Z'
---

Microsoft recently introduced a [Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-ossdata.vscode-pgsql) for Postgres database management. Similar in functionality to tools like PgAdmin or DBeaver, this extension embeds Postgres management directly into VSCode and comes fully integrated with GitHub Copilot, allowing it to interact with your database, while also supporting all the features you’ve come to expect from a database management tool.

To show the features of this new extension, I’ll explore the Postgres schema used by [Sentry](https://sentry.io/welcome/), a popular and widely adopted open-source platform for error and performance tracking. With over a decade of active development and almost 1000 database migrations, Sentry’s Postgres schema provides a perfect real-world scenario.

To begin, I provisioned a fresh Postgres instance with Neon, cloned the Sentry repository, and applied the Django migrations to reproduce its database schema.

## Database Connection

After installing the extension, I connected to the database using its server address, username, and password directly within VS Code.

![Image](https://cdn.neonapi.io/public/images/pages/blog/managing-postgres-directly-in-vs-code/ad4nxevxqp6xyoci6nnugxwqtetul8owjkgvyxtfeasinbbu4fbry0hpkhwidqlinqqdnzre4qiu9girlgimrkrfybllhyxj8nienz9qziaxfe1eao1fxbjeikhdxbr2p91wtteabuw-932381e4.gif)

These credentials can be extracted from your database connection string available in the Neon console as follows:

![Image](https://cdn.neonapi.io/public/images/pages/blog/managing-postgres-directly-in-vs-code/ad4nxfvewt9gkxbvggeyeqgubs7gd0zdg2vcodpbrervkugiwlpqvmwnqplrdx7xm7uj0vybmd-cmeko8qj-zdvlkjvr92trfyv6ql1pntvkgkjf8yyqn9gt2mzkpocjizr8prhzw-514d51d2.png)

The extension also integrates with Azure, allowing you to hook up your account and browse existing Azure-hosted Postgres instances. Likewise, you can quickly deploy a new instance with Docker directly from within the editor.

## Schema Explorer

The extension provides schema visualization, presenting tables, columns, data types, and foreign key relationships in a graph format, greatly simplifying database navigation. Looking at Sentry, it quickly becomes apparent what the cores table of the schema are based on the number of references: `auth_user`, `sentry_organization`, and `sentry_project`.

Let’s explore how Sentry connects users to projects and organizations, as it neatly ties together these critical tables. A user first becomes associated with an organization through a sentry_organizationmember table, which links the user ID to the organization ID and assigns a role. The sentry_organization acts as the parent container for all projects, since each project in the sentry_project table is then linked to an organization by an organization_id foreign key.

Sentry also has team-based access control. Within an organization, teams in the sentry_team table can be created to group users logically, and have projects assigned through the sentry_projectteam table. Users become associated with teams through the sentry_organizationmember_teams table, which maps organization members to teams.

This schema design supports scenarios where users are members of multiple organizations, organizations manage multiple projects and teams, and multiple teams can manage multiple projects.

![Image](https://cdn.neonapi.io/public/images/pages/blog/managing-postgres-directly-in-vs-code/ad4nxecmiugpbbx83za9moxkmadxwfg-l6pbpkavccual6dbfdsuqw8d16flb6fih6by2kf98aqvgmapyvu4s1gmrhngvbfc2zncsxb6cqhcbu0pdycnb7nfzucrewcc8eufqw1tnjkw-ba3c1dc2.gif)

## Chat with Database

Another new feature is “Chat with Database”, which allows Copilot to directly interact with your database, and use its contents as context. If you’ve ever used Sentry, you should be familiar with the issues page here, which tracks error reports.

![Image](https://cdn.neonapi.io/public/images/pages/blog/managing-postgres-directly-in-vs-code/ad4nxfwafi57opqdvugqedyu0ymiq1h2w87tq2x-glh32dtfljx-8sseqejccfzjo0kfyseykoedtzp3lw4cnqfxsmmkfzyyh94vaxeww5nam0oty9muaulvd0bob5rqumfbwa3dyt8vw-dd9a25d9.png)

Finding where and how issue data is stored can be challenging given the complexity of the schema and the absence of a directly obvious `issues` table. Instead of manually exploring tables or documentation, I asked Copilot directly “Where is the issue data stored in the Sentry schema?”, after which it found the relevant core table (`sentry_groupmessage`), its related tables, and explained the storage structure.

![Image](https://cdn.neonapi.io/public/images/pages/blog/managing-postgres-directly-in-vs-code/ad4nxcwkhzpbedgwu7tvyjw7aajngtiukrhfuthgef479ets8kaunhna4evrekjsvy1kzlh3qwbxlfn2d06xyjmhosmylzcvp7fg9wtop-oqdyerasbenjx2elwi4lngwvx9-bbfvp-0681a944.jpg)

Initially, I didn’t quite understand what the data column in the group message table did, since its name was very generic and its type was TEXT. So, I asked Copilot what that column did, and this time it pulled context from the actual Django model source code, showing that this field actually stores zlib-compressed JSON.

Further context from the Git history showed that this design choice dates back nearly 12 years, before the introduction of Postgres’ native `JSONB` type. This is a great practical example of the benefits of integrating the database management tool directly into the development environment.

## Up and Down Migration Scripts

The extension simplifies generating up and down SQL scripts for tables, including constraints, indices, and triggers. This is especially useful to quickly view how a table was constructed, and understand its structure. The indices also give a good idea of the most common data access patterns of the database. For example, based on the create script, projects are most likely queried by their organization id, slug, status, and template id.

![Image](https://cdn.neonapi.io/public/images/pages/blog/managing-postgres-directly-in-vs-code/ad4nxe8ofjq0w5tsn26zazp7dmn5g2gyvv5x4r7iprimhioqfpqbblstsv7oqifhzgecspa7gnjtjhxbkhohmitobek9jhrqgr2ysu6q2widsd5r5nk7u405txx3mucddmvdncj9k9-d0cce590.gif)

## Query IntelliSense

When writing SQL queries, you receive context-aware query assistance with IntelliSense autocomplete for SQL keywords, table names, column names, and functions. This also includes syntax highlighting, automatic formatting, and query history for easy reuse. Here, the autocomplete stays snappy even with a large schema, and works with aliased tables.

![Image](https://cdn.neonapi.io/public/images/pages/blog/managing-postgres-directly-in-vs-code/ad4nxccaplhg9rhsczy7g0ibcep1ulaooppus255ww0fwgcflyabqci4yjc1ypk3blxzvydjcb1i19znbettgoexczeckyablzu8jfuwzp6zkzafciszmd9c24vgrbnsv5-wsnjgzzg-fd77b297.gif)

## Wrap Up

The new Microsoft Postgres VSCode extension makes it easier to explore, understand, and interact with mature, multi-domain schemas like Sentry’s. By integrating database management directly into the development environment, it provides a more productive workflow for developers using Postgres.

---

[Neon](https://neon.tech/home) _is a serverless Postgres platform with instant provisioning, branching, and autoscaling._ [Get started on our free plan](https://console.neon.tech/signup) _and spin up a fully configured Postgres instance in seconds._
