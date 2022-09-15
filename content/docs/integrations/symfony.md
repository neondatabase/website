---
title: Run a Symfony app
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/symfony
---

### Introduction

Symfony is a framework for building web applications in PHP. Symfony uses Doctrine library to access database. Using Neon from Symfony + Doctrine is straightforward and differs nothing from using a vanilla PostgreSQL.

## Set up a Neon project

See [Setting up a project](../get-started-with-neon/setting-up-a-project).

## Select Project in the Console

1. Navigate to the [Neon console](https://console.neon.tech/).
2. On the **Dashboard** tab, select your project from project drop-down list.

## Copy the connection string

The connection string (`DATABASE_URL`) appears on the **Dashboard** tab, under **Connection Details**.

For example, if you configure your Symfony project with `.env` file, the `DATABASE_URL` entry in `.env` file should appear as follows:

```shell
# cat .env | grep DATABASE_URL
DATABASE_URL="postgresql://<user>:<password>@<project_id>.cloud.neon.tech:5432/main?charset=utf8"
```