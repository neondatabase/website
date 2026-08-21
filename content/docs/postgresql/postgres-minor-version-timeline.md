---
title: Postgres minor version rollout timeline
summary: >-
  A record of how quickly recent PostgreSQL community minor releases became
  available on Neon computes. Postgres 18 was available on the day it went GA,
  and the three most recent on-schedule minor batches reached computes within
  five days of the community announcement.
enableTableOfContents: true
---

The PostgreSQL Global Development Group ships a minor release for every supported major version at least once a quarter, plus out-of-cycle releases when a security fix is too urgent to wait. Neon rebuilds its compute images from each of those releases and rolls them out automatically: you don't request the update, and you don't schedule a maintenance window.

The [Postgres version support policy](/docs/postgresql/postgres-version-policy) describes that commitment. This page is the record of how it has played out. For recent on-schedule community releases, the new minor versions have reached Neon computes within a week of the community announcement, and Postgres 18 was available the day it went GA.

## Rollout timeline

The table covers community releases from the Postgres 18 GA onward, newest first.

| PostgreSQL release date | Versions in the release          | First available on Neon | Time to availability |
| ----------------------- | -------------------------------- | ----------------------- | -------------------- |
| 2026-08-13              | 18.6, 17.11, 16.15, 15.19, 14.24 | 2026-08-18              | 5 days               |
| 2026-05-14              | 18.4, 17.10, 16.14, 15.18, 14.23 | 2026-05-19              | 5 days               |
| 2026-02-12              | 18.2, 17.8, 16.12, 15.16, 14.21  | 2026-02-14              | 2 days               |
| 2025-11-13              | 18.1, 17.7, 16.11, 15.15, 14.20  | 2025-12-04              | 21 days              |
| 2025-09-25              | 18.0 (new major version)         | 2025-09-24              | At release           |

Notes on individual rows:

- **Postgres 18 GA:** Neon builds its compute images from the community release wrap, which is tagged a few days ahead of the announcement. Postgres 18 computes were therefore ready to run as the GA announcement went out on 2025-09-25.
- **November 2025:** Neon moved to this batch about two weeks after the announcement, a longer cycle than the batches above it.
- **August 2025:** Neon did not ship the August 2025 community batch (17.6, 16.10, 15.14, 14.19) as a standalone update. Those fixes reached computes in late November 2025, days before the November 2025 batch superseded them.
- **Earlier 2025 releases:** Neon does not have complete rollout records for community releases before September 2025, so they are not listed here.

Each update is announced in the [Neon Changelog](/docs/changelog).

## How these dates map to your computes

The **First available on Neon** date is the point at which a release became available to run. It marks the start of the rollout, not the moment every compute is running the new version.

Each compute picks up a new minor version the next time it restarts, for any reason, so computes move onto it across the following days. If your compute suspends when idle, it is updated the next time it wakes. If your compute is always active and you want to pick up an update right away, see [Restart a compute](/docs/manage/computes#restart-a-compute).

Minor releases and security patches require no action from you. In the rare case where an update does need a decision that depends on your application, Neon notifies you directly; see [Manual actions after minor release upgrades](/docs/postgresql/postgres-version-policy#manual-actions-after-minor-release-upgrades).

## Current minor versions

As of August 2026, Neon runs the latest community minor release for every supported major version: 18.6, 17.11, 16.15, 15.19, and 14.24. For the current version list, see [Compatibility](/docs/reference/compatibility).

<NeedHelp/>
