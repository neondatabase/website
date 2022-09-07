---
label: 'Console'
---

### What's new

- UI: add 'Enable pooling' toggle to the Project's Settings page.
- Control plane: use several instances to serve public API and web UI, which allow doing a zero-downtime deployments.
- API: return `423 Locked instead` of `409 Conflict`, when there is a concurrent operation on project preventing acquiring the project lock.
