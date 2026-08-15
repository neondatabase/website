---
title: Postgres engine architecture
subtitle: Storage, compute, and WAL layer internals
summary: >-
  The Lakebase Postgres architecture separates compute and storage layers, using Write-Ahead Logs (WAL), safekeepers, a pageserver, and object storage to enable branching, instant restores, and serverless scale.
redirectFrom:
  - /docs/storage-engine/architecture-overview
  - /docs/conceptual-guides/architecture-overview
  - /docs/guides/neon-features
updatedOn: '2026-08-12T00:00:00.000Z'
---

<Admonition type="info">
**SPLIT FROM:** introduction/architecture-overview (engine internals moved here; cross-product framing moved to Branching and Backend data model).
</Admonition>

# Postgres engine architecture

[Stub: WAL, safekeepers, pageserver, storage/compute split — product depth]
