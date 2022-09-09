---
label: 'Console'
---

### What's new

- UI: Added an 'Enable pooling' toggle to the project's General settings page.
- Control plane: Implemented usage of several instances for serving the public API and web UI to enables zero-downtime deployments.
- API: Changed the error reported when a concurrent operation on a project prevents acquiring the project lock. Error `423 Locked` is now reported instead of `409 Conflict`.
