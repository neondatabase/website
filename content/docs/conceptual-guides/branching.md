---
title: Branching
redirectFrom:
  - /docs/conceptual-guides/branches
---

<a id="branches-coming-soon/"></a>

_Neon branching capabilities are not yet publicly available. If you would like to try this feature, contact Neon at [iwantbranching@neon.tech](mailto:iwantbranching@neon.tech) describing your use case and requesting that Neon enable branching for your account._

A branch is a copy of your Neon Project data created from the current state or from a past state that is still available.

When you create a branch, all of the data in the parent Project is available in the branched Project, but changes to the branch afterward are independent of the parent Project and vice versa.

Branch creation does not increase load on the parent Project. You can create a branch at any time without affecting the performance of your production system, and no downtime is required.

Branching has many possible uses, some of which are outlined below:

- Create a branch for each Developer
-	Quickly and easily create backup branches
- Run potentially destructive queries without impacting your main branch
- Run time travel queries against historical state
- Tag and name the current moment for PITR convenience or ML model training repeatability
- Run tests on a branch created from production or staging data
-	Test schema changes
-	Run tests in parallel on separate branches, each with its own dedicated compute
- Run "what if" scenarios on a branch of your production data