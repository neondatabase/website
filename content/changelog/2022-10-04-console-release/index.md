---
label: 'Console'
---

### What's new

- UI: Added social authentication for Hasura, enabling users to sign in using using social networking services supported by Hasura.
- Improved Neon project creation performance.

### Bug fixes

- UI: Database selector allows to select any of created databases.
- Control Plane: Availability checker waits for existing operations queue for a project to be empty before starting.
- Control Plane: Operations for redo are now selected based on the correct status. 
- The V2 branch creation endpoint is now accessible using an OAuth token.
