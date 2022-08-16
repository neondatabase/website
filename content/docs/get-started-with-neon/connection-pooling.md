---
title: Connection pooling
---

## Postgres connection limits

Each postgres connection creates a new process in the operating system, which occupies some resources -- memory, open file descriptors, etc. Hence postgres has limits on the number of open connections. In our free tier, we allow 20 simultaneous postgres connections.

Some apps tend to open many connections and keep most of them inactive. Such behavior usually happens because of database driver limitations or due to the many deployed instances of the app. To deal with such situations, we use a connection pooler.

## Pooling in Neon

Connection pooler is deployed near the postgres and allows to accept up to 500 connections. This connection is routed to the smaller amount of real postgres connections. We use `pgbouncer` in `transaction mode` for connection pooling.

To enable pooling go to the project settings and tick `Enable pooling` checkbox under the `General` section.

### Limitations

Some database features like prepared statements and `LISTEN/NOTIFY` functionality won't work with connection pooling. To get a complete list of limitations, see `Transaction pooling` column in the features table at <https://www.pgbouncer.org/features.html>.
