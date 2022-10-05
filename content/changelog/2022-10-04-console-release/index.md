---
label: 'Console'
---

### What's new

- UI: Added social authentication for Hasura, enabling users to sign in using social networking services supported by Hasura.
- Improved Neon project creation performance.

### Bug fixes

- UI: The Database drop-down menu that appears in the Connection Details widget on the Dashboard and in the Neon SQL Editor now permits selecting any created database.
- Control Plane: The availability checker now waits for the project operations queue to be cleared before starting.
- Control Plane: Operations for redo are now selected based on the correct status. 
- The V2 branch creation endpoint is now accessible using an OAuth token.
