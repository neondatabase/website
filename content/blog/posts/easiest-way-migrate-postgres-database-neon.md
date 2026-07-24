---
title: The Easiest Way to Migrate Your Postgres Database to Neon
description: >-
  Use the Import Data Assistant to move your data to Neon with a single
  connection string
excerpt: >-
  Moving a Postgres database from one provider to another it’s tedious, even for
  simple migrations. You have to export and import dumps, match versions, check
  extension support… To take that friction out of this equation, we’ve built a
  tool: the Import Data Assistant. Migrate Your...
date: '2025-05-29T17:45:40'
updatedOn: '2025-10-02T00:16:29'
category: product
categories:
  - product
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/easiest-way-migrate-postgres-database-neon/cover.jpg
  alt: null
isFeatured: false
seo:
  title: The Easiest Way to Migrate Your Postgres Database to Neon - Neon
  description: >-
    We’ve built a tool (the Import Data Assistant) that helps you move your
    Postgres data to Neon in one step. No dumps, no manual configs.
  keywords: []
  noindex: false
  ogTitle: The Easiest Way to Migrate Your Postgres Database to Neon - Neon
  ogDescription: >-
    We’ve built a tool (the Import Data Assistant) that helps you move your
    Postgres data to Neon in one step. No dumps, no manual configs.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/easiest-way-migrate-postgres-database-neon/social.png
---

Moving a Postgres database from one provider to another it’s _tedious_, even for simple migrations. You have to export and import dumps, match versions, check extension support… To take that friction out of this equation, we’ve built a tool: the [Import Data Assistant.](https://neon.com/docs/import/import-data-assistant)

## Migrate Your Data with Just a Connection String

The Import Data Assistant is a built-in tool in the [Neon Console](https://console.neon.tech/signup) that lets you migrate an existing Postgres database into Neon with just a connection string.

![Image](https://cdn.neonapi.io/public/images/pages/blog/easiest-way-migrate-postgres-database-neon/import-db-82612b11.gif)

The tool handles the entire process automatically:

1. Verifies compatibility, matching Postgres version, extensions, and region
2. Creates a new branch in your target Neon project for the imported data (you pick which project you’d want the data to live in)
3. Imports the data directly – no need to export, upload, or configure anything manually

The assistant works with any Postgres-compatible source, including:

- AWS RDS and Aurora
- Supabase
- Heroku
- Self-hosted Postgres
- Other Neon projects

## When to Use the Import Data Assistant

We’ve designed this tool for common migration scenarios that would normally involve a mix of manual steps, downtime windows, or setup work. Here are a few ways developers are using it today:

### Moving to Neon from another provider

If you’re running Postgres on another managed service, the Import Data Assistant makes it easy to switch over to Neon. You paste your connection string, run a check, and the data comes in cleanly (schema and all) into a new Neon branch.

### Upgrading Postgres versions

You can also use the assistant to move data between versions. For example: you might have a production database running on Postgres 16 and want to test an upgrade on 17 – you can just import into a new project and start testing.

### Switching regions or clouds

If your data is in the wrong cloud region (e.g. perhaps we start supporting a region closer to you), you can use the Import Data Assistant to migrate it to a Neon project in a new region.

### Creating a testing or staging environment

Lastly, if you need to copy some data to test a new feature, you can use the assistant to bring a dataset into a new Neon project. From there, you can start branching for each of your environments.

## How to Get Started

You’ll find the Import Data Assistant in the Neon Console under the **Import Database** tab:

![Image](https://cdn.neonapi.io/public/images/pages/blog/easiest-way-migrate-postgres-database-neon/ad4nxfe74ocvncxsphvm0kublmbams0xdrlgmsftdxad27slpefcawtuf3nu0l54ijfev0cyg5heyhxjviega27qvl8hamz1rlmnl8rjz2wa07yamcccbmvtfrjtrpl9fym03bmsnt6a-954863f7.png)

To get started, just follow the prompts. The process is very simple:

1. You paste the connection string for your source Postgres database (e.g. in Supabase)
2. Neon runs an automatic compatibility check
3. If everything looks good, it starts the import. The assistant creates a new branch in your project of choice, and brings your data in.

That’s it: no setup, no CLI, no exports. You can find full step-by-step instructions in [our docs](https://neon.tech/docs/import/import-data-assistant).

## Migrating a Large Database? Reach Out to Us

The Import Data Assistant is ideal for moving small databases, but if you’re planning a migration with multi-terabyte datasets, complex production setups, and/or low-to-zero downtime requirements, [reach out to us.](https://neon.tech/contact-sales)

We’ve worked with teams to move TB-size production workloads with near zero downtime, and we’ll be happy to share what’s worked and build a personalized migration plan for your use case.
