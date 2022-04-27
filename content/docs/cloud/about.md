---
title: About Neon
---

Neon is a fully managed serverless PostgreSQL in the cloud with a generous free tier. 
Neon separates storage and compute and offers modern developer features including serverless, branching, bottomless storage, and many more.
Neon is open source and written in Rust.

## Serverless

With a separation of storage and compute Neon scales up compute on demand in response to the app workload as well as scales down to zero when idle.
This happens automatically and is transparent to the user and app.

Neon compute is PostgreSQL 14. It is 100% app compatible with your PostgreSQL workloads.

## Built for developer productivity

Neon allows you to create a branch of your PostgreSQL database for you developer-friendly workflows. It's easy to create a brunch for a dev or staging environment
as branching have close to zero overhead and created instantly.
You can create a branch for you dev and test environments for every code deployment in the CI/CD pipeline. 
Branches don’t incur any additional cost and implemented using "copy-on-write" technique at the storage tier. See [branching](#branches-coming-soon) for more info.

## Fully managed

Neon cloud service provides high availability without any administrative, maintenance, or scaling burden. Check [our documentation](../getting_started) for Neon users.

## Open Source

Check [neondatabase](https://github.com/neondatabase/neon) on GitHub and [our architecture documentation](../../storage-engine/architecture-overview). We develop in public under the Apache 2.0 license.

## Elastic Storage

Neon developed a pupose build multi-tenant storage system for the cloud. Neon Storage allows virtually unlimited storage while providing high availability and durability guarantees. 
Neon storage reduces operational headaches of checkpoints, data backup and restore.

Neon Storage Engine integrates storage, backups, and archiving into one system. This allows quick and cheap [_branching_](../concepts#branches-coming-soon), and [Point-in-Time Reset](../concepts#point-in-time-reset).

Neon Storage is designed with cloud costs in mind and uses a multi-tier architecture to deliver on latency, throughput, and cost. 
It integrates a cloud object store such as S3 to push cold data to the cheapest storage medium and locally attached SSDs for low latency high performance data.

Our storage is written in the Rust for maximum performance and usability.
