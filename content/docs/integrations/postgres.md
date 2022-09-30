---
title: Run a Postgres App
redirectFrom:
  - /docs/quickstart/postgres
---

Since Neon compute is regular PostgreSQL, any PostgreSQL app will run out of the box.
You can also use all the standard client utilities like `psql` and `pg_dump`, client libraries and drivers to connect.

All connections to PostgreSQL are via an endpoint hosted at `pg.neon.tech`.

Try connecting to `pg.neon.tech` using the following command in your terminal:

```bash
psql -h pg.neon.tech
```


