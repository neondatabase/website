---
title: Run a Postgres App
---

Since Neon compute is regular Postgres any Postgres app will run out of the box.
You can also use all the standard client utilities like ‘psql’ and ‘pg_dump’, and client libraries and drivers to connect.

All connection to Postgres are done via an endpoint hosted at `pg.neon.tech`. You can try it right away by running `psql -h pg.neon.tech` in your terminal.

At the moment it doesn't provide automatic connection pooling and you need to
use [pg_bouncer](https://www.pgbouncer.org/) or a similar tool. Neon will enable connection pooling in the future releases.
