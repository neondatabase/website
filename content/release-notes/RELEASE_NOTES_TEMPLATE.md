---
isDraft: true
---

### Title for new feature

Describe new feature

### Fixes & improvements

- UI: The Neon Technical Preview invite code is now requested only at the first login.
- UI: Added a cover to all password fields to protect passwords from view.
- API: Changed the `user_id` type from `int64` to `uuid`.
- API: Implemented a unified JSON error response where possible, in the format of `{ "message": "error text" }`.
- API: Made `platform`, `region`, and `instance_type` ids optional during new project creation.
