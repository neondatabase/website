---
title: About Neon
---

Neon is a fully managed serverless PostgreSQL in the cloud with a generous free tier. 
Neon separates storage and compute and offers modern developer features such as serverless, branching, bottomless storage, and many more.
Neon is open source and written in Rust.

## Serverless

Neon automatically and transparently scales up compute on demand in response to the app workload as well as scales down to zero on inactivity. 
Neon only charges for what you use and can deliver up to 10x reduction in cost.


## Built for developer productivity

Neon allows you to create a branch of your PostgreSQL database for you developer workflows. It's easy to create a brunch for a dev, test, or staging environments
as branching is instant and has close to zero overhead.

You can create a branch for every code deployment in the CI/CD pipeline.
Branches don’t incur any additional cost and implemented using "copy-on-write" technique at the Neon Storage. See [branching](#branches-coming-soon) for more info.

## Fully managed

Neon cloud service provides high availability without any administrative, maintenance, or scaling burden. Check [our documentation](../getting_started) for Neon users.

## Elastic Storage

Neon developed a pupose build multi-tenant storage system for the cloud. Neon Storage allows virtually unlimited storage while providing high availability and durability guarantees. 
Neon storage reduces operational headaches of checkpoints, data backup and restore.

Neon Storage Engine integrates storage, backups, and archiving into one system. This allows quick and cheap [_branching_](../concepts#branches-coming-soon), and [Point-in-Time Reset](../concepts#point-in-time-reset).

Neon Storage is designed with cloud costs in mind and uses a multi-tier architecture to deliver on latency, throughput, and cost. 
It integrates a cloud object store such as S3 to push cold data to the cheapest storage medium and locally attached SSDs for low latency high performance data.

Our storage is written in the Rust for maximum performance and usability.

## Open Source

Check [neondatabase](https://github.com/neondatabase/neon) on GitHub and [our architecture documentation](../../storage-engine/architecture-overview). We develop in public under the Apache 2.0 license.

## Compatibility

Neon compute is the latest version of PostgreSQL. Currently we are using PostgreSQL 14. It is 100% compatible with your app written against regular PostgreSQL.
