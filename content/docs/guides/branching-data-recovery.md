---
title: Branching — Point-in-time recovery (PITR)
subtitle: Learn how to recover your database to previous state using Neon's database branching feature
enableTableOfContents: true
isDraft: true
---

A Neon project has a default 7-day data retention window and the ability to create branches at specific points in time or to a specific Log Sequence Number (LSN). The process of recovering your database from an unwanted state due to a faulty query is a form of Point-in-time recovery (PITR).

This guide shows you how to recover your data to a past state using Neon's branching feature.

## Identify the point in time before the faulty query

Suppose that you have a table named `orders` that was erroneously deleted, here's a high-level example of how you could recover your database to point in time before the table was deleted.