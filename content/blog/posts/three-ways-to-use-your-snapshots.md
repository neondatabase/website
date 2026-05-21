---
title: Three Ways to Use Your Snapshots
description: 'Treat them like instant, restorable recovery points'
excerpt: >-
  Neon’s snapshots feature is now available to all users (in Beta), and you can
  finally schedule them automatically. You can make snapshots daily, weekly, or
  monthly from the Backup & Restore page in the Neon Console. Snapshots are
  built on Neon’s copy-on-write architecture: they c...
date: '2025-11-11T00:54:40'
updatedOn: '2025-11-11T00:54:55'
category: product
categories:
  - product
  - workflows
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/three-ways-to-use-your-snapshots/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Three Ways to Use Your Snapshots - Neon
  description: >-
    Learn how to use Neon Snapshots to protect data, save progress before
    migrations, and debug safely with instant, restorable recovery points.
  keywords: []
  noindex: false
  ogTitle: Three Ways to Use Your Snapshots - Neon
  ogDescription: >-
    Learn how to use Neon Snapshots to protect data, save progress before
    migrations, and debug safely with instant, restorable recovery points.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/three-ways-to-use-your-snapshots/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/three-ways-to-use-your-snapshots/neon-3-ways-1-1024x576-d63651a9.jpg)

Neon’s snapshots feature is now available to all users (in Beta), and you can finally [schedule them automatically](https://neon.com/docs/guides/backup-restore#create-snapshot-schedules). You can make snapshots daily, weekly, or monthly from the [Backup & Restore page](https://neon.com/docs/guides/backup-restore) in the Neon Console.

<video autoPlay muted loop width="2604" height="1608">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/three-ways-to-use-your-snapshots/create-snapshots-e901f9d8.mov" />
</video>

Snapshots are built on Neon’s copy-on-write architecture: they capture the exact state of your database at a point in time and let you restore instantly, no matter how large the dataset, either to your current branch or to a new one for inspection. This makes Neon snapshots far more practical than traditional backup methods like pg_dump or WAL-based snapshots, which are slower and more cumbersome to restore.

In this post, we’ll share a few ways you can put them to use.<br />

## A Refresher of How Snapshots Work in Neon

Snapshots build directly on [Neon’s storage engine](https://neon.com/blog/get-page-at-lsn), the same architecture that powers branching and point-in-time restore. Instead of taking a full physical copy of your data, Neon saves a reference to data page versions at the moment a snapshot is created, making the creation of a snapshot near-instant and efficient, and indifferent to the overall database size.

A snapshot freezes the exact state of a branch at a specific moment in time. Unlike creating another branch, which “forks” the database for new writes, snapshots are read-only and meant for preserving data. You can restore from a snapshot into a new branch at any time without affecting the original branch.

Think about it this way:

- In Neon, you can already restore a branch instantly to any point in time within its retention window. That’s amazing for fast recovery within the same branch.
- But sometimes, you’d want to start fresh, i.e. creating a new, independent root branch that copies the state of a previous branch and continues from there. That’s where snapshots come in handy.
- For example, say you’re about to run a tricky production migration: you can manually create a snapshot to preserve the current state “outside” of production
- If anything goes wrong, you can restore that snapshot into a new production branch, move your data over, and retire the old one when you’re done

Snapshots are a clean way to save “critical database moments” that might be interesting to restore to, while keeping your workflow simple – a bit like saving your progress in a video game.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/three-ways-to-use-your-snapshots/image-9-1024x650-3605615c.png" alt="Image" />
<figcaption>Snapshots act like database restore points, instantly accessible even outside your branch’s history window. They’re not only a safety net but also useful for tasks like historical analysis or debugging.</figcaption>
</figure>

Snapshots are also valuable when you need to preserve data beyond your branch’s retention period. Point-in-time restore can only rewind within that window, but snapshots extend your history. E.g. you can schedule a weekly snapshot for archival purposes, ensuring that you can recover a branch at any point in the future no matter your retention settings.

## Top Three Use Cases

### Protect your production data automatically

Now you can choose to do snapshots at your preferred frequency (e.g. one per week or per month), and if something unexpected happens even outside Neon’s PITR window, you’ll still be able to roll back instantly.

Restores are nearly instant, even for multi-terabyte databases. There’s no dump, no replaying WAL logs, no waiting for a physical backup to stream back in. It’s just one operation: create a new branch from snapshot → add compute → you’re back online. They’re your zero-maintenance safety net.

### Save your progress: safeguard your database state before critical moments

You can also think of snapshots as save points for your database. E.g. before running a risky migration, deploying a major release, or updating critical data, you can capture the current state of your branch as a snapshot, just in case. If something goes wrong, you always have the option to restore that snapshot into a new branch within seconds.

### Inspect historical snapshots to debug

Since they’re so lightweight to restore, Neon snapshots are way more usable vs an RDS snapshot or a backup – restoring those into a new instance would take you considerable time and money, but it’s very simple to do in Neon. You can take advantage of this in many ways: every time there’s some issue to investigate, restore an old snapshot into a new branch and explore it in read-only mode. You can even query or diff against your current schema using Neon’s SQL editor. Once you’re done, delete the branch.

## Get Started

This implementation of snapshots is only made possible by Neon’s architecture, with copy-on-write and separated storage and compute. They’re instant to create, effortless to restore, and now, with scheduling, they can be automated.

If you’re in a [Neon paid plan](https://neon.com/pricing), this is already available to you. [Explore our docs](https://neon.com/docs/guides/backup-restore) for all the details on how to set up your snapshots.
