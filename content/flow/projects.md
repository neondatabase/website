---
title: 'Projects'
updatedOn: '2025-07-08T12:47:21.296Z'
---

In Neon, a project is the top-level unit for managing your database. If you're used to traditional Postgres deployments, think of it as everything you’d normally configure around an instance, packaged up and ready to branch.

A project includes:

- A default branch (typically `main`)
- Any number of additional branches
- One or more compute endpoints (used to run queries)
- Role-based access controls
- Storage, usage, and billing settings

All branches in a project share the same storage backend, which is what makes Neon’s branching fast, efficient, and scalable.
