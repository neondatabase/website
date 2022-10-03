---
title: Branching
redirectFrom:
  - /docs/conceptual-guides/branches
---

<a id="branches-coming-soon/"></a>

Neon Branching capabilities are not yet publicly available. If you would like to try this feature, reach out to [iwantbranching@neon.tech](iwantbranching@neon.tech) describing your use case and requesting that Neon enable branching capabilities for your account.

A branch is a copy of the project data created from the current state or any past state that is still available. A branch can be independently modified from its originating project data.

You can use a branch to:

- Run potentially destructive queries without impacting your main branch
- Run time travel queries against historical state
- Run a set of queries with separate resources to avoid impacting your application
- Tag and name the current moment for PITR convenience or ML model training repeatability
- Run tests against a branch from production data

_Note: The branch creation process does not increase load on the originating project. You can create a branch at any time without worrying about downtime or performance degradation._
