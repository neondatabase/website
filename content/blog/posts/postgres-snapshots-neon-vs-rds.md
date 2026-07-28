---
title: 'Rethinking Snapshots at Scale: Neon vs AWS RDS'
description: >-
  Start treating snapshots as a tool, not just a backup. Especially if you're
  running TB-size Postgres
excerpt: >-
  Snapshots are a critical safety net for any team running Postgres in
  production. If you’re using AWS RDS, you’re probably relying on them mostly as
  protection against accidental changes. But if your database grows to many
  terabytes, the experience of actually using those snapshot...
date: '2025-05-05T00:03:56'
updatedOn: '2025-06-19T18:30:46'
category: postgres
categories:
  - postgres
  - product
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-snapshots-neon-vs-rds/cover.jpg
  alt: null
isFeatured: false
seo:
  title: 'Rethinking Snapshots at Scale: Neon vs AWS RDS - Neon'
  description: >-
    Neon offers a better approach to snapshots for large Postgres databases, one
    that’s not only faster but also unlocks new workflows.
  keywords: []
  noindex: false
  ogTitle: 'Rethinking Snapshots at Scale: Neon vs AWS RDS - Neon'
  ogDescription: >-
    Neon offers a better approach to snapshots for large Postgres databases, one
    that’s not only faster but also unlocks new workflows.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-snapshots-neon-vs-rds/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-snapshots-neon-vs-rds/neon-rethinking-1-1024x576-b9e2e019.jpg)

Snapshots are a critical safety net for any team running Postgres in production. If you’re using AWS RDS, you’re probably relying on them mostly as protection against accidental changes. But if your database grows to many terabytes, the experience of _actually_ using those snapshots will be far from ideal.

Speed is not the only issue though. The way snapshots are implemented in RDS limits what you can actually do with them. Want to use your snapshots to inspect a historical state, or test a change before applying it to prod? It is _technically possible_ to do this in RDS, but operationally painful.

At Neon, we’ve implemented what (in our view) is a better way to do snapshots, with an architecture that’s not only faster but unlocks entirely new workflows. But before getting there, let us explain better why we think snapshots in RDS need fixing.

## The Problems with Snapshots on AWS RDS

### Restoring from snapshot is slower than you think

Restoring from a snapshot in RDS means provisioning a brand-new database instance and copying the snapshot data from S3. That’s not instant, especially if your database is large. For instances with many TBs, the snapshot restore step alone can take 30 minutes to a few hours, depending on network conditions and load. And if you’re doing point-in-time recovery, RDS also needs to replay all the WAL logs generated since the snapshot was taken, which adds even more time.

### You can’t inspect a snapshot before restoring it

Want to see what the data looked like before a migration, or run a few queries against a known good state before deciding whether to restore? With RDS, you can’t. Snapshots are opaque, there’s no way to run a quick query or browse data unless you go through a full restore first.

This limits what you can do with your snapshots in practice. If you could query historical database states directly, you could use your snapshots to do things like validate a bug fix against old data, diff schemas across deployments, troubleshoot data regressions in production… As we’ll see later, this is exactly the kind of workflow Neon makes possible (and with a great DevX).

### Restores require duplicate infrastructure

Because you can’t access snapshot data directly, you’re forced to restore the snapshot into a full-blown instance just to use it. That means allocating new compute and storage, duplicating your entire environment, even if you’re just trying to poke around for five minutes.

For large databases, that’s not a small task. Spinning up a multi-TB RDS instance takes time, costs money, and requires cleanup once you’re done. This discourages teams from using snapshots at all unless they absolutely have to. Snapshots become these things that lay there unused unless there’s a big problem.

## What You Could Do with Snapshots (If RDS Made It Easier)

Could snapshots be useful beyond just sitting in your AWS bill, waiting to be restored? The answer is _yes_: in theory, snapshots could enable all kinds of useful workflows beyond just disaster recovery. But RDS makes most of these either painful or completely impractical, especially when your database is large.

For example, imagine that you want to…

### Test a risky migration before running it in production

Maybe you’re altering a critical table or deploying a schema change you’re not 100% sure about. This is a large production database that cannot break. Ideally, you’d like to snapshot the database first, apply the migration in a safe environment, and inspect the result before touching production.

With RDS, that would mean,

1. Restoring the snapshot into a brand-new instance
2. Waiting (potentially hours) for the restore to complete
3. Applying the migration manually
4. Cleaning up the duplicate infra after you’re done

The process is heavyweight, and it gets slower and more expensive as your database grows.

### Inspect historical data after a production incident

Let’s say there’s been some issues, e.g. a customer of yours reports that a key record disappeared last week. You’d like to browse the data as it existed three days ago and confirm whether it was there, when it was modified, or who touched it.

With RDS, your only option is:

1. Restore a snapshot from three days ago
2. Spin up a new instance
3. Connect and dig around manually

There’s no easy way to quickly query old data or diff schema versions in place. This kind of investigation, which should be easy, may get tricky.

### Preserve a known-good state for future testing

You’ve just completed a major data migration or cleaned up your schema. It’d be great to save a snapshot of this clean state so you can test future changes against it, or restore a copy for analytics later.

RDS technically supports this, but again,

1. You can’t actually use the snapshot unless you restore it
2. There’s no way to query it, validate it, or access it incrementally
3. And unless you remember to delete it later, you’ll be paying for it indefinitely

In the life of a DBA, there are plenty of these _database moments_ you’d like to snapshot. But if snapshots are slow and hard to access, they won’t get used anyway.

## How Neon Implements A New Architecture for Snapshots

At [Neon](https://neon.tech/home), we’ve taken a different approach to snapshots, one that’s built on our underlying [copy-on-write storage architecture](https://neon.tech/blog/instantly-copy-tb-size-datasets-the-magic-of-copy-on-write).

**In Neon, a snapshot isn’t a static backup stored in S3, but a point-in-time reference to the state of a branch, captured instantly and without performance impact.** When you restore a snapshot, you’re not spinning up a new instance or copying terabytes of data: you’re creating a new branch. This new branch points to the same underlying storage and can be queried immediately.

<Admonition type="note" title="new to branches?">
Branches in Neon behave like lightweight clones of your database at a specific point in time [. Learn more about them](https://neon.tech/docs/introduction/branching) and the [workflows they enable.](https://neon.tech/flow)
</Admonition>

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-snapshots-neon-vs-rds/ad4nxdziq9ltligjvoncaazysdwd08j8j7jodjlbngoy2o9mrcy4s3r2mkwn-6lvw2hiij0l5we3isbhnl7wnwrryqfsw1pekyg5gq7cbbwku93s69z7egrrqaa7jvs-smi929orwxg-6b113902.png)

Because Neon [separates storage from compute](https://neon.tech/docs/introduction/serverless), you can attach a new compute to a snapshot at any time. Once you do, your snapshot behaves like a fully independent Postgres instance, with its own connection string, isolated environment, and no impact on your production branch.

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-snapshots-neon-vs-rds/ad4nxdeufe85bylipvtt5zy9nuzsr3ofqp9sarn2xzr0t7y13eijecwcsl1nx8ziifmbwvfrc6qtjc2jollm6kj5lkilxpdpfjxlruzsvcxmikwrscz28rqhgpatsdyhjmdls7qainj-6cd05d21.png)

All compute endpoints in Neon autoscale, scale to zero when idle, and you only pay for compute while you’re actually using it. Provisioning a compute in Neon takes a second and doesn’t involve any of the overhead of spinning up a new AWS instance.

**And here’s what makes Neon Snapshots especially powerful at scale: the experience is exactly the same whether your database is 10 GB or 10 TB. T** here’s no performance penalty, no growing restore time, and no storage duplication. What’s instant at small scale stays instant at large scale, something that traditional snapshot tools like RDS simply can’t offer.

## What Snapshots Allow You to Do in Neon

Because snapshots in Neon are fast, lightweight, and can be attached to a compute quickly, they unlock all those workflows that are slow or impractical in RDS, especially at scale:

- **Restore TBs instantly.** You restore a snapshot to a new branch in seconds, no matter how large the dataset. This same branching model powers Neon’s [Instant Point-in-Time Recovery (PITR) feature](https://neon.tech/docs/introduction/branch-restore), which lets you restore large databases to any moment within your retention window.
- **Test risky migrations safely.** Snapshot your branch → restore to a new branch → apply the migration → validate it. No downtime, no duplicated infrastructure, no impact on your production branch.
- **Preserve a known-good state for future testing**. Take a snapshot after every cleanup, release, or migration. Consider it a stable baseline you can inspect (or restore to quickly).
- **Investigate production issues using historical data.** If you’re doing the above, e.g. preserving interesting _database moments_ before prod changes are pushed, investigating issues becomes much easier. You can directly query your snapshots to find when things broke, and restore to a branch once you find a relevant data state that you’d like to test on.
- **Validate bug fixes against real historical data.** This implementation allows you to recreate the conditions of a production issue without touching prod. Run your fix against the snapshot, and verify the results in isolation.
- **Run ad-hoc queries on past states.** Sometimes, you just need to check a previous schema version or run analytics on older data. Simply restore a snapshot and query it like any other Postgres database.

## Summary: The Benefits of Neon Snapshots for Large Databases vs AWS RDS

Snapshots in Neon are not only tools for fast recovery at scale. Unlike in RDS, you don’t need to wait hours to restore, spin up duplicate infrastructure, or treat snapshots like a last resort. In Neon, snapshots are instant, queryable, and lightweight. You can restore them into new branches, attach compute on demand, and explore or test without touching production.

For large Postgres databases, this means:

- **Faster recovery**. No need to wait for full-volume restores or WAL replay.
- **Lower overhead**. Without duplicated instances or manual cleanup.
- **More confidence**. You can test before you touch prod, debug safely, and validate fixes with real data.
- **Better workflows**. Snapshots become part of your dev and ops toolkit, not just your disaster plan.

[Neon has a Free plan](https://neon.tech/pricing) that allows you to test this experience immediately. [Sign up](https://console.neon.tech/signup) and [follow the instructions in our docs](https://neon.tech/docs/guides/backup-restore) to create and use your first snapshots.

<Admonition type="note" title="request early access">
Snapshots are in Early Access. [Follow these instructions to enable them in your project.](https://neon.tech/docs/introduction/roadmap#join-the-neon-early-access-program)
</Admonition>
