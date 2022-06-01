---
title: Run a Symfony app
---

### Introduction

Symfony is a framework for building web applications in PHP. Symfony uses Doctrine library to access database. Using Neon from Symfony + Doctrine is straightforward and differs nothing from using a vanilla PostgreSQL.

## Step 1 — Obtain Secret token from "Connection Details" Panel

## Step 2 — Select Project in the UI

## Step 3 — Click "Generate token" link

## Step 4 — Substitute token placeholder below with this token

For example, if you configure your Symfony project with `.env` file, then DATABASE_URL entry in `.env` file should look like this:

```shell
# cat .env | grep DATABASE_URL
DATABASE_URL="postgresql://<user>:<token>@<project_id>.cloud.neon.tech:5432/main?charset=utf8"
```
