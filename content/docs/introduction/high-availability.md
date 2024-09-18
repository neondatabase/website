---
title: High availability
subtitle: Learn how Neon's architecture is built for high availability
enableTableOfContents: true
updatedOn: '2024-08-19T14:50:59.585Z'
---

By default and due to our architecture, Neon databases are resilient to the most common compute and storage failures.

## Compute

Neon computes don’t store data and are restarted in <1s for the most common failures in an invisible manner to the user and the application //

## Storage

in the storage layer, data is internally replicated across pageservers, and we automatically switch from one to another in case it becomes temporarily innaccesible - this takes a few seconds max during which the user might experience downtime

In Neon's architecture, Pageservers are responsible for serving read requests. Neon currently supports automatic failover for Pageservers for Neon accounts with data sizes greater than 64GB, but work is under way to provide automatic failover for accounts of all data sizes, starting with account on Neon's paid plans.

To provide automatic failover for Pageservers, we maintain a primary and secondary copy of your data on two Pageservers. If one Page server goes down, Neon's storage controller immediately fails over from the primary Pageserver to the secondary. This failover mechanism provides high availability for region outages on the cloud service provider, but also support zero-downtime Pageserver updates.

questions:
Are oprimary and secndary Pageserver always in different AZs?
For tennats without automatic Pageserver4 Failover, what's the failover story? Manual migration of data to another pageserver?
