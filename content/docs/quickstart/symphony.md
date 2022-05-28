---
title: Run a Symphony app
---

Symfony is a framework for building web applications in PHP. Symfony uses Doctrine library to access database. Using Neon from Symfony + Doctrine is straightforward and differs nothing from using a vanilla postgresql.

First, obtain secret token from “Connection details” panel:

1. Select Project you wish to use in the UI. Click on it.
2. Click “Generate token” link.
3. Substitue token placeholder below with this token.

For example, if you configure your Symfony project with `.env` file, then DATABASE_URL entry in `.env` file should look like this:

```shell
# cat .env | grep DATABASE_URL
DATABASE_URL="postgresql://<user>:<token>@<project_id>.cloud.neon.tech:5432/main?charset=utf8"
```
