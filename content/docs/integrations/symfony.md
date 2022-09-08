---
title: Run a Symfony app
redirectFrom:
  - /docs/quickstart/symfony
---

### Introduction

Symfony is a framework for building web applications in PHP. Symfony uses Doctrine library to access database. Using Neon from Symfony + Doctrine is straightforward and differs nothing from using a vanilla PostgreSQL.

## Step 1 — Set up a Neon project

## Step 2 — Select Project in the UI

## Step 3 — Copy the connection string (DATABASE_URL)

For example, if you configure your Symfony project with `.env` file, then DATABASE_URL entry in `.env` file should look like this:

```shell
# cat .env | grep DATABASE_URL
DATABASE_URL="postgresql://<user>:<password>@<project_id>.cloud.neon.tech:5432/main?charset=utf8"
```
