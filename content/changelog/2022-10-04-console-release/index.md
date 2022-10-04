---
label: 'Console'
---

### What's new

- UI: Social authentication with Hasura provider.
- Control Plane: Improved performance of project creation.

### Bug fixes

- UI: Database selector allows to select any of created databases.
- Control Plane: Availability checker waits for existing operations queue for a project to be empty before starting.
- Control Plane: Operations for redo are now selected based on the correct status. 
- The V2 branch creation endpoint is now accessible using an OAuth token.
