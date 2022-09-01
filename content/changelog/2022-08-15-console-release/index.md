---
title: 'Bug fixes'
label: 'Console'
---

- UI: fix incorrect encoding when switching between code samples in the connection widget, add description for connection string examples.
- UI: fix various typos and errors.

### What's new

- UI: introduce saved queries and history in the project query interface.
- UI: add token-based authorization into Swagger UI for [Neon's public API](https://neon.tech/api-reference).
- UI: display status of operations that are waiting in the queue as 'Scheduling' instead of 'In progress'.
- UI: disable some controls, when project is in the transitive state already.
- Control Plane: set `max_replication_write_lag` to `15 MB`, which should tune backpressure mechanism and make Postgres more responsive under load.
- Control Plane: collect and save more detailed compute node startup time metrics for an easier investigation of performance issues.
