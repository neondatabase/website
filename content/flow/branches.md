---
title: 'Branches'
subtitle: 'Understand how Neon branches provide instant, cost-efficient database clones with copy-on-write storage'
updatedOn: '2025-07-08T12:47:21.296Z'
---

A branch in Neon is a lightweight, copy-on-write clone of your database. It inherits both the schema and data from its parent, but shares the same underlying storage. That means branches are fast to create, cost-efficient to run, and safe to discard.

<strong>Key properties of Neon branches</strong>:

- <strong>Instant creation</strong>. Branches spin up in seconds even for terabyte-scale datasets. There’s no exporting, importing, or replication setup.
- <strong>Copy-on-write storage</strong>. A new branch references its parent’s data until changes are made. Then, only the diffs are written.
- <strong>Ephemeral by design</strong>. Idle branches scale to zero automatically. You only pay for active compute and the storage you actually use.
- <strong>Resettable</strong>. Any branch can be instantly reset to match its parent. No teardown scripts. No fragile seed files.
