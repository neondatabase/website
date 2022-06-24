---
title: Run a Postgres App
redirectFrom: 
 - docs/quickstart/postgres
---

Since Neon compute is regular Postgres, any Postgres app will run out of the box.
You can also use all the standard client utilities like `psql` and `pg_dump`, client libraries and drivers to connect.

All connections to Postgres are done via an endpoint hosted at `pg.neon.tech`.

Try connecting to `pg.neon.tech` using the following command in your terminal:

```bash
psql -h pg.neon.tech
```

Currently, Neon compute does not provide automatic connection pooling. You will need to
use [pg_bouncer](https://www.pgbouncer.org/) or a similar tool for connection pooling. Neon will enable connection pooling in the future releases.
