---
title: 'The problem: The stack has evolved, databases haven’t'
subtitle: 'Learn how outdated database practices slow down development and create bottlenecks for modern teams'
updatedOn: '2026-01-16T00:00:00.000Z'
---

## Traditional database workflows are broken

Modern software development is built around iteration. Teams create branches, open pull requests, spin up previews, run tests in isolation, and roll changes forward or back constantly. Code workflows evolved to support this reality.

Databases did not.

Most database setups are still built around a single mutable state: one production database, maybe a shared staging database, and sometimes a shared dev database. Everything depends on copying data around and trying not to step on each other’s toes. This mismatch creates friction everywhere.

## Databases don’t match how teams build software

In practice, teams need databases to behave more like code:

- Engineers want isolated environments to test schema changes safely  
- CI systems need fresh databases for every test run  
- Preview environments should reflect real production data  
- Rollbacks should be fast and predictable  
- Multiple versions of an application often exist at the same time

Traditional databases make all of this difficult. Creating a new environment usually means dumping and restoring data, running long migrations, or manually coordinating changes across shared databases. These workflows are slow, error-prone, and don’t scale as teams or systems grow.

As a result, teams compromise:

- They test migrations against incomplete or stale data  
- They share environments and accept conflicts  
- They avoid certain changes because the blast radius feels too large

## Copying databases doesn’t scale

The default solution to isolation has always been,  in one way or another, copying the database. But copying databases is expensive in every dimension:

- Time \- dumps and restores take minutes or hours  
- Cost \- every copy duplicates storage  
- Operational \- long-running restores fail, get interrupted, or drift  
- Staleness \- copied environments fall behind production almost immediately

As databases grow into hundreds of gigabytes or terabytes, copying simply stops being viable. Teams either stop creating isolated environments, or they accept that non-production databases are no longer representative of reality.

| Databases are still treated as static resources, while modern development requires fast and cheap environments that can be created, discarded, and restored at will. |
| :---- |

None of this is a tooling problem at the application layer. It’s a database model problem, and it’s solvable.
