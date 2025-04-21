---
title: Automate pg_dump backups
subtitle: Automate backups of your Neon database to S3 with pg_dump and GitHub Actions
enableTableOfContents: true
updatedOn: '2025-02-22T16:36:52.249Z'
---

Keeping regular backups of your database is critical for protecting against data loss. While Neon offers an [instant restore](/docs/introduction/branch-restore) feature (point-in-time restore) for short-term backups, there are scenarios—such as business continuity, disaster recovery, or regulatory compliance—where maintaining independent backup files is essential. In these cases, using the Postgres `pg_dump` tool to create backups and storing them on a reliable external service (like an AWS S3 bucket) gives you control over long-term retention and recovery of your data.

Manually performing backups can be tedious and time-consuming, so automation is key to ensure you're taking backups consistently. An automated backup process also lets you enforce retention policies by automatically cleaning up old backups, saving storage and keeping your backup repository tidy.

This two-part guide will walk you through setting up an automated backup pipeline using `pg_dump` and GitHub Actions. You will configure everything needed to run nightly backups and store them in S3, ensuring your data available to restore if needed. The process involves two main parts:

<DetailIconCards>

<a href="/docs/manage/backups-aws-s3-backup-part-1" description="Set up an AWS S3 bucket for storing backups" icon="database">Part 1: Create an S3 bucket to store backups</a>

<a href="/docs/manage/backups-aws-s3-backup-part-2" description="Schedule nightly backups with GitHub Actions and pg_dump" icon="stopwatch">Part 2: Automate with GitHub Actions</a>

</DetailIconCards>
