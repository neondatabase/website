---
title: Automate `pg_dump` backups
enableTableOfContents: true
updatedOn: '2025-02-22T16:36:52.249Z'
---

# Automate `pg_dump` backups

Keeping regular backups of your database is critical for protecting against data loss. While Neon offers an instant restore feature (point-in-time restore) for short-term backups, there are scenarios—such as business continuity, disaster recovery, or regulatory compliance—where maintaining independent backup files is essential. In these cases, using the Postgres `pg_dump` tool to create backups and storing them on a reliable external service (like an AWS S3 bucket) gives you control over long-term retention and recovery of your data.

Manually performing backups can be tedious, so automation is key to ensure they run consistently. By automating `pg_dump` backups on a schedule and uploading the dump files to cloud storage, you can ensure that backups are always up-to-date without the need for manual intervention. An automated backup process also lets you enforce retention policies by automatically cleaning up old backups, saving storage and keeping your backup repository tidy.

This two-part guide will walk you through setting up an automated backup pipeline for your Neon Postgres database using AWS and GitHub Actions. You will configure everything needed to run nightly `pg_dump` backups and store them in S3, ensuring your data is archived and available to restore if needed. The process involves two main parts:

1. **Part 1 – Create an S3 bucket:** Set up an AWS S3 bucket for storing backups, and configure appropriate IAM roles to allow GitHub Actions to securely upload Postgres backup files to that bucket.
2. **Part 2 – Automate with GitHub Actions:** Configure a scheduled GitHub Actions workflow to run `pg_dump` every night, upload the backup file to the S3 bucket, and automatically delete older backups after a specified retention period to prevent unlimited storage growth.

<DetailIconCards>

<a href="/docs/manage/backups-aws-s3-backup-part-1" description="Set up an S3 bucket and IAM roles for backups" icon="database">Create an S3 bucket</a>

<a href="/docs/manage/backups-aws-s3-backup-part-2" description="Schedule nightly backups with GitHub Actions and pg_dump" icon="stopwatch">Automate with GitHub Actions</a>

</DetailIconCards>
