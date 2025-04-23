---
title: Backups
subtitle: An overview of backup strategies for Neon Postgres
enableTableOfContents: true
updatedOn: '2025-04-21T13:38:49.810Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>About backup strategies</p>
<p>About built-in backups with instant restore</p>
<p>Creating and automating backups using pg_dump</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
  <a href="/docs/introduction/branch-restore">Instant restore</a>
</DocsList>

</InfoBlock>

Neon supports different backup strategies, which you can use separately or in combination, depending on your requirements.

<Steps>

## Instant restore

With Neon's instant restore capability, also known as point-in-time restore or PITR, you can automatically retain a "history" of changes—ranging from 1 day up to 30 days, depending on your Neon plan. This feature lets you restore your database to any specific moment without the need for traditional database backups or separate backup automation. It's ideal if your primary concern is fast recovery after an unexpected event.

By default, Neon projects retain **1 day** of history. You can increase your restore window on Neon as follows:

| Plan                                          | Restore window limit |
| :-------------------------------------------- | :------------------- |
| [Free](/docs/introduction/plans#free-plan)    | 1 day                |
| [Launch](/docs/introduction/plans#launch)     | 7 days               |
| [Scale](/docs/introduction/plans#scale)       | 14 days              |
| [Business](/docs/introduction/plans#business) | 30 days              |

With this strategy, the only required action is setting your desired restore window. Please keep in mind that increasing your restore window also increases storage, as changes to your data are retained for a longer period.

![Restore window](/docs/manage/history_retention.png)

    To get started, see [Instant restore](/docs/introduction/branch-restore).

## Backups with `pg_dump`

For business continuity, disaster recovery, or compliance, you can use standard Postgres tools to back up and restore your database. Neon supports traditional backup workflows using `pg_dump` and `pg_restore`.

To learn how, see [Backups with pg_dump](/docs/manage/backup-pg-dump).

## Automated backups with `pg_dump`

If you need to automate `pg_dump` backups to remote storage, we provide a two-part guide that walks you through setting up an S3 bucket and a GitHub Action to automate `pg_dump` backups on a recurring schedule. You'll also learn how to configure retention settings to manage how long `pg_dump` backups are stored before being deleted.

1. [Create an S3 bucket to store Postgres backups](/docs/manage/backups-aws-s3-backup-part-1)
2. [Set up a GitHub Action to perform nightly Postgres backups](/docs/manage/backups-aws-s3-backup-part-2)

</Steps>

<Admonition type="note" title="Backup & Restore Questions?">
If you have questions about backups, please reach out to [Neon Support](https://console.neon.tech/app/projects?modal=support).
</Admonition>
