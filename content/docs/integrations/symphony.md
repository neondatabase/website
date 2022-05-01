---
title: Getting Stareted with Symphony
---

Symfony is a framework for building web applications in PHP. Symfony uses Doctrine library to access database. Using Neon from Symfony + Doctrine is straightforward and differs nothing from using a vanilla postgresql.

First, obtain secret token from “Connection details” panel:

1. Select Project you wish to use in the UI. Click on it.
2. Click “Generate token” link.
3. Substitue token placeholder below with this token.

For example, if you configure your Symfony project with `.env` file, then DATABASE_URL entry in `.env` file should look like this:

```shell
# cat .env | grep DATABASE_URL
DATABASE_URL="postgresql://<user>%40neon:<token>@pg.neon.tech:5432/<project_id>?charset=utf8"
```

Make sure that you are using `<user>%40neon` as username. This is url encoded value for `<user>@neon`. You can find `<user>` string in the upper right corner of the UI.
