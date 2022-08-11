---
title: 'Console release'
---

### What's new

- UI: invite code is now asked only at the first login.
- UI: new password cover everywhere, protecting it from stranger eyes.
- API: `user_id` type changed from `int64` to `uuid`.
- API: unified JSON error response in a format of `{ "message": "error text" }` is now used whenever it's possible.
- API: `platform`, `region` and `instance_type` ids are now optional during new project creation.

### Bug fixes

- Control Plane: fix an issue when system role `web_access` could be modified or deleted, which broke the UI query interface.
- UI: various fixes and improvements.
