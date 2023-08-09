### What's new

- Compute: Added support for sequential scan prefetch, which reduces round trips between Computes and Pageservers. Sequential scan prefetch allows fetching numerous pages at once instead of one by one, improving I/O performance for operations such as table scans.
- Compute: Added support for the `pg_prewarm` Postgres extension, which utilizes the above-mentioned sequential scan prefetch feature. The `pg_prewarm` extension provides a convenient way to load data into the Postgres buffer cache after a cold start. For information about Postgres extensions supported by Neon, see [Postgres extensions](/docs/extensions/pg-extensions).
- Compute: Updated supported Postgres versions to 14.6 and 15.1, respectively.
- Pageserver: Updated the `storage_sync` operation to make it more robust and reliable while syncing files between Pageservers and S3.
- Safekeeper: Replaced [etcd](https://etcd.io/) subscriptions with a custom Neon [storage broker](https://github.com/neondatabase/neon/blob/main/docs/storage_broker.md). The storage broker allows Safekeepers and Pageservers to learn which storage node holds a timeline and the status of a timeline while avoiding too many connections between nodes.
