---
title: About Neon
---

Neon is a fully managed serverless Postgres with a generous free tier.
Neon separates storage and compute and offers modern developer features such as serverless, branching, bottomless storage, and many more.
Neon is open source and written in Rust.

## Serverless

Neon automatically and transparently scales up compute on demand in response to the app workload. Neon also scales down to zero on inactivity.
Since Neon is serverless it only charges for what you use and can deliver up to 10x reduction in cost.

## Built for developer productivity

Neon allows you to create a branch of your Postgres database. It's easy to create branches for dev, test, or staging environments.
Branching is instant and has close to zero overhead as it is implemented using the "copy-on-write" technique in Neon Storage.
In fact branches are so cheap that you can create a branch for every code deployment in your CI/CD pipeline.

## Fully managed

Neon cloud service provides high availability without any administrative, maintenance, or scaling burden. Check [our documentation](../getting_started) for Neon users.

## Bottomless Storage

Our engineering team developed a purpose built multi-tenant storage system for the cloud.
Neon Storage allows virtually unlimited storage while providing high availability and durability guarantees.

Neon Storage integrates storage, backups, and archiving into one system. This reduces operational headaches of checkpoints, data backup and restore.
You can learn more about quick and cheap [_branching_](../concepts#branches-coming-soon), and [Point-in-Time Reset](../concepts#point-in-time-reset).

Neon Storage is designed with cloud costs in mind and uses a multi-tier architecture to deliver on latency, throughput, and cost.
It integrates a cloud object store such as S3 to push cold data to the cheapest storage medium and locally attached SSDs for low latency high performance data.

Neon Storage is written in Rust for maximum performance and usability.

## Open Source

Check [neondatabase](https://github.com/neondatabase/neon) on GitHub and [our architecture documentation](../../storage-engine/architecture-overview). We develop in public under the Apache 2.0 license.

## Compatibility

Neon compute is the latest version of Postgres. Currently we are using Postgres 14. It is 100% compatible with your app written against the official release of Postgres.
