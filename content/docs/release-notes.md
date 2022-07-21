---
title: Release Notes
---

## 2022-07-11

### What's new

* Control Plane: implement optional connection pooling for projects.
* API: add `pooler_enabled` flag to [projects update API call](https://console.neon.tech/api-docs#operations-Project-updateProject).
* UI: various improvements.

### Bug fixes

* API: fix several bugs that could cause intermittent 409 responses.

## 2022-06-08

### What's new

* UI: invite code is now asked only at the first login.
* UI: new password cover everywhere, protecting it from stranger eyes.
* API: `user_id` type changed from `int64` to `uuid`.
* API: unified JSON error response in a format of `{ "message": "error text" }` is now used whenever it's possible.
* API: `platform`, `region` and `instance_type` ids are now optional during new project creation.

### Bug fixes

* Control Plane: fix an issue when system role `web_access` could be modified or deleted, which broke the UI query interface.
* UI: various fixes and improvements.
