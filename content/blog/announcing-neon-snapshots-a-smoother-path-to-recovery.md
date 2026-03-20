---
title: 'Announcing Neon Snapshots: A Smoother Path to Recovery'
description: >-
  Bounce back from setbacks with read-only snapshots designed for disaster
  recovery, safe testing, and stress-free rollbacks.
excerpt: >-
  When working with databases, there are moments when you’d love to freeze time
  — before making a big change, running a migration, or simply bookmarking a
  stable state. With snapshots in Neon, that’s now possible. Snapshots provide
  an easy way to capture a backup of your database a...
date: '2025-04-23T15:50:07'
updatedOn: '2025-08-14T09:26:35'
category: product
categories:
  - product
  - engineering
authors:
  - bryan-clark
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/announcing-neon-snapshots-a-smoother-path-to-recovery/cover.jpg
  alt: 'Announcing Neon Snapshots: A Smoother Path to Recovery'
isFeatured: false
seo:
  title: 'Announcing Neon Snapshots: A Smoother Path to Recovery - Neon'
  description: >-
    Bounce back from setbacks with read-only snapshots designed for disaster
    recovery, safe testing, and stress-free rollbacks.
  keywords: []
  noindex: false
  ogTitle: 'Announcing Neon Snapshots: A Smoother Path to Recovery - Neon'
  ogDescription: >-
    When working with databases, there are moments when you’d love to freeze
    time — before making a big change, running a migration, or simply
    bookmarking a stable state. With snapshots in Neon, that’s now possible.
    Snapshots provide an easy way to capture a backup of your database at a
    specific point in time and are […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/announcing-neon-snapshots-a-smoother-path-to-recovery/social.jpg
source:
  wpId: 9255
  wpSlug: announcing-neon-snapshots-a-smoother-path-to-recovery
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Announcing Neon Snapshots: A Smoother Path to Recovery](https://cdn.neonapi.io/public/images/pages/blog/announcing-neon-snapshots-a-smoother-path-to-recovery/neon-snapshot-cover-1-1024x576-80d09390.jpg)

When working with databases, there are moments when you’d love to freeze time — before making a big change, running a migration, or simply bookmarking a stable state. With snapshots in Neon, that’s now possible. Snapshots provide an easy way to capture a backup of your database at a specific point in time and are now available to all users in our [Early Access Program](https://console.neon.tech/app/settings/early-access), and we’re eager to hear your feedback. Give them a try by joining the program today!

## What are snapshots?

Snapshots are point-in-time copies of the database state. They’re designed to preserve the exact data and schema at the moment they were created, providing a lighter alternative to traditional backup solutions. Unlike traditional backups which are typically full copies created using tools like `pg_dump` or physical backup utilities, snapshots are created instantly with minimal performance impact.

Snapshots in Neon can be conveniently restored into a new branch without altering the original branch, making them ideal for testing, debugging, or rolling back to a known good state. They complement traditional backup strategies but offer an easier, more flexible recovery option when you need to act fast!

You can create snapshots directly from the Neon console using the **Create snapshot** button. Support for configuring custom retention periods and creating snapshots on schedule is coming later this year, along with programmatic control via our API and CLI, so stay tuned for the updates.

![Screenshot of Neon console with Create snapshot button highlighted](https://cdn.neonapi.io/public/images/pages/blog/announcing-neon-snapshots-a-smoother-path-to-recovery/snapshots-launch-snapshot-create-1024x640-6f0d58af.jpg)

### Restoring a snapshot

In this initial release, a restored snapshot creates a new branch (e.g., `main_from_snapshot_2025-04-14`). You can then add a [compute](https://neon.tech/docs/reference/glossary#compute-endpoint) to the branch and interact with it like any other branch in Neon, by either connecting with your preferred Postgres client or using Neon’s built-in [SQL editor](https://neon.tech/docs/get-started-with-neon/query-with-neon-sql-editor). Future releases will make it possible to switch all client connections to the newly restored branch, similar to how Point-In-Time Restore (PITR) works today.

![Screenshot of Neon console with Restore button highlighted](https://cdn.neonapi.io/public/images/pages/blog/announcing-neon-snapshots-a-smoother-path-to-recovery/snapshots-launch-snapshot-restore-1024x640-4cd9d8bc.jpg)

A compute can be added to a restored branch at any time, allowing you to explore the schema and data in a safe, isolated environment. This makes it easy to inspect historical states, run ad-hoc queries and validate assumptions.

![Screenshot of Neon console displaying Autoscaling settings](https://cdn.neonapi.io/public/images/pages/blog/announcing-neon-snapshots-a-smoother-path-to-recovery/snapshots-launch-snapshot-compute-1024x640-c1ba947d.jpg)

## Point-In-Time Restore (PITR) or snapshots

Both [Point-In-Time Restore](https://neon.tech/docs/manage/backups#instant-restore) (PITR) and snapshots allow you to instantly recover or preserve the state of your database, but they serve different needs and work in different ways.

### Point-In-Time Restore (PITR)

PITR lets you revert an entire branch to a previous state using a timestamp or Log Sequence Number (LSN). PITR creates a new branch and immediately switches over all client connections to it while preserving the original branch under a new name (e.g., `main_old_2025-04-14`). It is especially useful for maintaining continuity in applications, as the compute is moved to the new branch, keeping the same connection string.

### Snapshots

Snapshots capture read-only copies of a branch’s state for backup or historical reference. They can be restored into a new branch (e.g., `main_from_snapshot_2025-04-14`), without altering the original branch. Unlike PITR, snapshots are perfect for isolating data at a specific point in time for testing or creating a rollback point, and in a future release, they’ll have the added benefit of automatic expiration for cleanup.

### When to use PITR vs snapshots

PITR is ideal for reverting entire branches to a precise past state within the retention period. It offers transaction-level accuracy within a configurable time window, making it well-suited for quickly recovering from issues while preventing disruption.

Snapshots, by contrast, can be retained for longer and more cost-effectively, making them a reliable option for longer-term backups, testing, and archival purposes. Additionally, their ability to capture database states over extended retention periods provides a valuable tool for ensuring compliance with data retention and audit requirements, as well as offering a safety net before performing potentially risky operations.

![Diagram displaying retention period for PITR vs Snapshot](https://cdn.neonapi.io/public/images/pages/blog/announcing-neon-snapshots-a-smoother-path-to-recovery/snapshots-launch-snapshot-diagram-1024x292-7c895404.jpg)

## Start snapping today

Snapshots are a powerful addition to your backup workflow—helping you move faster with confidence by capturing safe, reliable, restorable points in time. Whether you’re testing, experimenting, or just want peace of mind before a big change, Snapshots make it simple. They also play a key role in supporting compliance with data protection regulations, ensuring you can reliably preserve and restore data when needed. We’re excited to see how you’ll use them and would love your feedback as we continue to refine the experience.<br />

Ready to take snapshots for a spin? Join our [Early Access Program](https://console.neon.tech/app/settings/early-access) today and start exploring a smoother path to recovery.
