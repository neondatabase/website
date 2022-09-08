---
label: 'Console'
---

### Bug fixes

- UI: Fixed incorrect encoding when switching between code samples in the connection widget, and added descriptions to connection string examples.
- UI: Fixed various typos and errors.


### What's new

- UI: Introduced saved queries and a query history to the project query interface.
- UI: Added token-based authorization to the Swagger UI for [Neon's public API](https://neon.tech/api-reference).
- UI: Changed the display status of operations waiting in the queue from 'In progress' to 'Scheduling'.
- UI: Disabled some controls that remained enabled while the project was in a transitive state.
- Control Plane: Set `max_replication_write_lag` to `15 MB` to tune the backpressure mechanism and improve PostgresSQL responsiveness under load.
- Control Plane: Improved the ability to investigate performance issues by collecting and saving more detailed compute node startup time metrics.
