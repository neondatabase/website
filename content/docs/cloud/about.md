---
title: About Neon
---

Neon is an on-demand serverless Postgres as a service that runs Neon Storage Engine. Neon is packed with modern features for developers, such as branching. What's more? it's open-source!

## Serverless

Neon separates database storage and compute to deliver on the serverless promise. Compute is activated on-demand by user queries, and shuts down when idle. This happens automatically and is transparent to the user and applications.

Compute is a genuine PostgreSQL, so it is fully application compatible with your PostgreSQL workloads.

## Built for developer productivity

Neon allows you to instantly create a clone of your PostgreSQL database for developer-friendly workflows and disaster recovery. Copies are created instantly and that’s why we call them branches. You can create a branch for dev and test environments of every code deployment in the CI/CD pipeline. Branches don’t incur any additional cost. See [branching](../concepts#branches-coming-soon) for more info.

## Fully managed

Neon cloud service provides high availability without any administrative, maintenance, or scaling burden. Check [our documentation](../getting_started) for Neon users.

## Open Source

Check [neondatabase](https://github.com/neondatabase/neon) on GitHub and [our architecture documentation](../../storage-engine/architecture-overview). We develop in public under the Apache 2.0 license.

## Elastic Storage

Neon uses a modern approach to storing data in the cloud. Neon Storage Engine allows virtually unlimited storage while providing high availability and durability guarantees. Neon is built to reduce operational headaches of checkpoints, data backup and restore.

Neon Storage Engine integrates storage, backups, and archiving into one system. This allows quick and cheap [_branching_](../concepts#branches-coming-soon), and [Point-in-Time Reset](../concepts#point-in-time-reset).

Our storage is proudly written in the Rust language and backed by S3.
