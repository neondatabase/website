---
title: Backups
enableTableOfContents: true
isDraft: true
---

Neon does not yet provide support for configuring automated backups in the Neon Console or API. This feature is on our roadmap. You can expect it to be introduced in the coming months.  

In the meantime, we support the following backup options:

## Built-in backups with Neon's point-in-time restore feature

By default, Neon keeps a 7-day history allowing you to restore your data to a particular date and time or Log Sequence Number (LSN). For Neon [Free Tier](/docs/introduction/free-tier) users, the 7-day history period is fixed. [Neon Pro plan](/docs/introduction/pro-plan) users can configure Neon to retain up to a 30 days of history. With this backup option, no action or automation is required. A data history is always available. You can quickly restore your data to a past state by creating a database branch. This feature is referred to point-in-time restore (PITR).

For information about creating a point-in-time restore branch, see [Branching — Point-in-time restore (PITR)](/docs/guides/branching-pitr).

## pg_dump

You can backup a database using `pg_dump`, in the same way backups are created for a standalone Postgres instances.

To dump a database from your Neon project, please refer to the `pg_dump` instructions in our [Import from Postgres](/docs/import/import-from-postgres) guide.

Please be aware the dumping data from Neon is considered "data transfer". For data transfer costs, please refer to our [Billing](/docs/introduction/billing) documentation.

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
