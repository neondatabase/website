---
title: Monitoring Neon with external tools
subtitle: Monitor your Neon Postgres database with external tools such as PgAdmin or PgHero
enableTableOfContents: true
---

## PgAdmin

TBD

## PgHero

[PgHero](https://github.com/pghero/pghero) is an open-source performance tool for Postgres that can help you find and fix data issues, using a dashboard interface.

A quick look at the interface gives you an idea of what you’ll find in PgHero.

![PgHero Dashboard](/docs/introduction/pg_hero.png)

Among other things, you can use PgHero to:

- Identify long-running queries
- Identify tables that require vacuuming
- Identify duplicate or missing indexes
- View connections by database and user
- Explain, analyze, and visualize queries

#### How to install PgHero

PgHero supports installation with [Docker](https://github.com/ankane/pghero/blob/master/guides/Docker.md), [Linux](https://github.com/ankane/pghero/blob/master/guides/Linux.md), and [Rails](https://github.com/ankane/pghero/blob/master/guides/Rails.md). Here, we’ll show how to install PgHero with Docker and connect it to a Neon database.

Before you begin:

- Ensure that you have the [pg_stat_statements](/docs/extensions/pg_stat_statements) extension installed. PgHero uses it for query stats. See above.
- Ensure that you have Docker installed. See [Install Docker Engine](https://docs.docker.com/engine/install/) for instructions.

PgHero is available on [DockerHub](https://hub.docker.com/r/ankane/pghero/). To install it, run:

```
docker pull ankane/pghero
```

Next, grab your Neon database connection string from the **Connection Details** widget in the Neon Dashboard.

![Connection details widget](/docs/connect/connection_details.png)

Finally, run this command, replacing `$NEON_DB` with your Neon database connection string.

```
docker run -ti -e DATABASE_URL='$NEON_DB' -p 8080:8080 ankane/pghero
```

Then visit http://localhost:8080 in your browser to open the PgHero Dashboard.