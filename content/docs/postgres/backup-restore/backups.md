---
title: Backups
subtitle: An overview of backup strategies for Lakebase Postgres
summary: >-
  Neon supports built-in point-in-time restore (PITR), manual backups using
  `pg_dump` and `pg_restore`, and automated nightly `pg_dump` exports to AWS
  S3 via GitHub Actions. Choose PITR for instant recovery without additional
  tooling; choose `pg_dump` workflows for business continuity, disaster
  recovery, or compliance. Each strategy links to a dedicated setup guide.
enableTableOfContents: true
redirectFrom:
  - /docs/manage/backups
updatedOn: '2026-09-03T10:41:39.496Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>About backup strategies</p>
<p>About built-in backups with instant restore</p>
<p>Creating and automating backups using pg_dump</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
  <a href="/docs/postgres/backup-restore/branch-restore">Instant restore</a>
</DocsList>

</InfoBlock>

Neon supports different backup strategies, which you can use separately or in combination, depending on your requirements.

<Steps>

## Instant restore

With Neon's instant restore capability, also known as point-in-time restore or PITR, you can automatically retain a "history" of changes, ranging from 1 day up to 30 days, depending on your Neon plan. This feature lets you restore your Postgres database and Managed Better Auth data to any specific moment without the need for traditional database backups or separate backup automation. It's ideal if your primary concern is fast recovery after an unexpected event.

With this strategy, the only required action is setting your desired [history window](/docs/postgres/backup-restore/history-window). Please keep in mind that increasing your history window also increases storage, as changes to your data are retained for a longer period.

![History window](/docs/manage/history_retention.png)

To get started, see [Instant restore](/docs/postgres/backup-restore/branch-restore).

## Backups with `pg_dump`

For business continuity, disaster recovery, or compliance, you can use standard Postgres tools to back up and restore your database. Neon supports traditional backup workflows using `pg_dump` and `pg_restore`.

To learn how, see [Backups with pg_dump](/docs/manage/backup-pg-dump).

## Automated backups with `pg_dump`

If you need to automate `pg_dump` backups to remote storage, we provide a two-part guide that walks you through setting up an S3 bucket and a GitHub Action to automate `pg_dump` backups on a recurring schedule. You'll also learn how to configure retention settings to manage how long `pg_dump` backups are stored before being deleted.

1. [Create an S3 bucket to store Postgres backups](/docs/manage/backups-aws-s3-backup-part-1)
2. [Set up a GitHub Action to perform nightly Postgres backups](/docs/manage/backups-aws-s3-backup-part-2)

</Steps>

## Frequently asked questions

<Faq>

<FaqItem question="Does Neon automatically back up my database?">
Yes. Every Neon project continuously retains a history of your database changes for [instant restore](/docs/postgres/backup-restore/branch-restore) (point-in-time restore), so you can roll a branch back to any moment inside your [history window](/docs/postgres/backup-restore/history-window) without configuring backup jobs. This is on by default on every plan.

On paid plans, you can also schedule automated [snapshots](/docs/guides/backup-restore) to keep longer-lived restore points. For a copy you store outside Neon, see [How do I keep an independent backup?](#how-do-i-keep-an-independent-backup) below.
</FaqItem>

<FaqItem question="How far back can Neon restore?">
It depends on your plan. Instant restore reaches back as far as your history window, and snapshots let you keep additional restore points:

| Plan   | Instant restore (history window) | Manual snapshots | Scheduled snapshots |
| ------ | -------------------------------- | ---------------- | ------------------- |
| Free   | Up to 6 hours (capped at 1 GB)   | 1                | Not available       |
| Launch | Up to 7 days                     | 100              | Available           |
| Scale  | Up to 30 days                    | 100              | Available           |

For production, size the window for your recovery needs, see [Getting ready for production](/docs/get-started/production-checklist#size-the-history-window-for-instant-restore).
</FaqItem>

<FaqItem question="How do I keep an independent backup?">
Instant restore and snapshots keep recovery inside Neon. For an independent, offsite copy, for compliance, disaster recovery, or moving data elsewhere, use standard Postgres tools to export a logical backup with [`pg_dump` and `pg_restore`](/docs/manage/backup-pg-dump) to storage you control.

To keep offsite backups current, automate nightly `pg_dump` exports to an S3 bucket with GitHub Actions:

1. [Create an S3 bucket to store Postgres backups](/docs/manage/backups-aws-s3-backup-part-1)
2. [Set up a GitHub Action to perform nightly Postgres backups](/docs/manage/backups-aws-s3-backup-part-2)
   </FaqItem>

<FaqItem question="Does the Free plan include automatic backups?">
Yes, in part. [Instant restore](/docs/postgres/backup-restore/branch-restore) is on for every plan, including Free, with a 6-hour history window (capped at 1 GB), so you can roll back to any moment in the last 6 hours. Free projects also get one manual [snapshot](/docs/guides/backup-restore).

Scheduled (automated) snapshots and longer history windows (up to 7 days on Launch, 30 days on Scale) require a paid plan. For an offsite copy on any plan, export with `pg_dump`, see [How do I keep an independent backup?](#how-do-i-keep-an-independent-backup).
</FaqItem>

<FaqItem question="When should I use instant restore, snapshots, or pg_dump?">

| Mechanism                | Best for                                                                                      | What you get                                                   |
| ------------------------ | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Instant restore (PITR)   | Fast rollback after accidental writes or a bad migration, to any point in your history window | Neon branch reset in place                                     |
| Snapshots                | Durable restore points before risky changes, or scheduled points on paid plans                | A restore point you can open as a new branch or restore to one |
| `pg_dump` / `pg_restore` | An independent, offsite copy for compliance, disaster recovery, or moving off Neon            | A logical copy in an external storage                          |

</FaqItem>

<FaqItem question="Does restoring my database cause downtime?">
None to few seconds. Instant restore resets the branch timeline instead of copying your whole database, so the operation usually completes in a few seconds. Existing connections to the branch are briefly interrupted, but your connection string does not change, and applications reconnect automatically once the restore finishes. See [How instant restore works](/docs/postgres/backup-restore/branch-restore#how-instant-restore-works).
</FaqItem>

<FaqItem question="How quickly can I recover, and how much data could I lose?">
Instant restore targets any point in your history window down to the millisecond, so you can recover to the moment just before a bad change without losing committed data up to that point. The restore itself usually finishes in a few seconds because Neon resets the branch timeline rather than copying data. How far back you can reach is set by your [history window](/docs/postgres/backup-restore/history-window), which ranges from 6 hours to 30 days depending on your plan.
</FaqItem>

<FaqItem question="Can I restore to a new branch instead of overwriting my current one?">
Instant restore overwrites the target branch's timeline, but Neon automatically preserves the pre-restore state as a [backup branch](/docs/postgres/backup-restore/branch-restore#automatic-backups), so you can always roll back. If you'd rather not touch your current branch at all, restore a [snapshot to a new branch](/docs/guides/backup-restore).
</FaqItem>

<FaqItem question="What do Neon backups and instant restore not cover?">
Instant restore reverts the Postgres data and schema on a branch, including Managed Better Auth data in the `neon_auth` schema. It does not touch objects that sit outside the database timeline: Object Storage contents and Functions are not part of a database restore.
</FaqItem>

<FaqItem question="What happens to my backups if I delete a project?">
If you delete a project, you can recover it, with its data and configuration intact, within the [7-day deletion recovery period](/docs/manage/projects#recover-a-deleted-project). There are no storage or recovery fees during that window.
</FaqItem>

<FaqItem question="Are my backups and change history encrypted?">
Yes. Neon encrypts all data at rest with `AES-256` and enforces TLS 1.2/1.3 for data in transit. Backups are stored in cloud object storage (Amazon S3 and Azure Blob Storage) with server-side encryption, and encryption keys are managed through AWS KMS and Azure Key Vault with key rotation in place. See [Security overview](/docs/security/security-overview#data-at-rest-encryption).
</FaqItem>

</Faq>

<NeedHelp/>
