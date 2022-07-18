---
title: Release Notes
---

## 2022-07-11

### What's new

* Connection pooling can be enabled for any of your projects using the public HTTP API. To do this, specify `{ "project": { "pooler_enabled": true } }` using [project update API](https://console.neon.tech/api-docs)
* UI design improvements

### Bug fixes

* Fixed several bugs that could cause intermittent 409 responses from the API

## 2022-06-08

### What's new

* UI: invite code is now asked only at the first login
* UI: new password cover everywhere, protecting it from stranger eyes
* API: `user_id` type changed from `int64` to `uuid`
* API: unified JSON error response in a format of `{ "message": "error text" }` is now used whenever it's possible
* API: `platform`, `region` and `instance_type` ids are now optional during new project creation

### Bug fixes

* Fixed an issue when system role `web_access` could be modified or deleted, which broke the UI query interface
* Various UI fixes and improvements
