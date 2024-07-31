---
updatedOn: '2024-07-31T07:55:54.426Z'
---

<Admonition type="tip">
TypeORM leverages a [node-postgres](https://node-postgres.com) Pool instance to connect to your Postgres database. Installing [pg-native](https://npmjs.com/package/pg-native) and setting the `NODE_PG_FORCE_NATIVE` environment variable to `true` [switches the `pg` driver to `pg-native`](https://github.com/brianc/node-postgres/blob/master/packages/pg/lib/index.js#L31-L34), which, according to some users, produces noticeably faster response times.
</Admonition>
