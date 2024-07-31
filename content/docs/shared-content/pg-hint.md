---
updatedOn: '2024-07-31T07:55:54.426Z'
---

<Admonition type="tip">
TypeORM leverages [node-postgres](https://node-postgres.com) Pool instance underneath to connect to your Postgres. Configuring the `NODE_PG_FORCE_NATIVE` environment variable to `true` [switches the pg driver to pg-native one](https://github.com/brianc/node-postgres/blob/master/packages/pg/lib/index.js#L31-L34), which in some cases, seem to bring noticeable faster response times.
</Admonition>
