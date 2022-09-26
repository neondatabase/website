---
title: Branching
redirectFrom:
  - /docs/conceptual-guides/branches
---

<a id="branches-coming-soon/"></a>

_Neon branching capabilities are not yet publicly available. If you would like to try this feature, contact Neon at [iwantbranching@neon.tech](mailto:iwantbranching@neon.tech) describing your use case and requesting that Neon enable branching for your account._

A Branch is a copy of your Neon Project data created from the current state or from a past state that is still available.

When you create a Branch, all of the data in the parent Project is available in the branched Project, but changes to the Branch afterward are independent of the parent Project and vice versa.

Branch creation does not increase load on the parent Project. You can create a Branch at any time without affecting the performance of your production system, and no downtime is required.

Branching has many possible uses, some of which are outlined below:

- Run potentially destructive queries without impacting your main Branch
- Run time travel queries against historical state
- Run a set of queries with separate resources to avoid impacting your application
- Tag and name the current moment for PITR convenience or ML model training repeatability
- Run tests on a Branch created from production data
