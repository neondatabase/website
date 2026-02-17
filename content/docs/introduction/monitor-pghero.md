---
title: Monitor Neon with PgHero
subtitle: Monitor your Neon Postgres database with PgHero
summary: >-
  How to install and connect PgHero to monitor your Neon Postgres database,
  enabling the identification of long-running queries, vacuuming needs, and
  indexing issues through a user-friendly dashboard interface.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:33.093Z'
---

[PgHero](https://github.com/pghero/pghero) is an open-source performance tool for Postgres that can help you find and fix data issues, using a dashboard interface.

A quick look at the interface gives you an idea of what you'll find in PgHero.

![PgHero Dashboard](/docs/introduction/pg_hero.png)

Among other things, you can use PgHero to:

- Identify long-running queries
- Identify tables that require vacuuming
- Identify duplicate or missing indexes
- View connections by database and user
- Explain, analyze, and visualize queries

<Admonition type="note">
Neon does not currently support monitoring tools or platforms that require installing an agent on the Postgres host system, but please keep an eye on our [roadmap](/docs/introduction/roadmap) for future integrations that enable these monitoring options. 
</Admonition>

## How to install PgHero

PgHero supports installation with [Docker](https://github.com/ankane/pghero/blob/master/guides/Docker.md), [Linux](https://github.com/ankane/pghero/blob/master/guides/Linux.md), and [Rails](https://github.com/ankane/pghero/blob/master/guides/Rails.md). Here, we'll show how to install PgHero with Docker and connect it to a Neon database.

Before you begin:

- Ensure that you have the [pg_stat_statements](/docs/extensions/pg_stat_statements) extension installed. PgHero uses it for query stats.
- Ensure that you have Docker installed. See [Install Docker Engine](https://docs.docker.com/engine/install/) for instructions.

PgHero is available on [DockerHub](https://hub.docker.com/r/ankane/pghero/). To install it, run:

```
docker pull ankane/pghero
```

## How to connect to your database from PgHero

Find the connection string for your database by clicking the **Connect** button on your **Project Dashboard**.

![Connection details modal](/docs/connect/connection_details.png)

Finally, run this command, replacing `$NEON_DB` with your Neon database connection string.

```
docker run -ti -e DATABASE_URL='$NEON_DB' -p 8080:8080 ankane/pghero
```

Then visit http://localhost:8080 in your browser to open the PgHero Dashboard.

<NeedHelp/>
