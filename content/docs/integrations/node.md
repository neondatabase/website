---
title: Run a Node.js app
redirectFrom: docs/quickstart/node
---

### Introduction

In this section, you will learn how to add a Postgres client to your Project and connect to your Neon Project.

## Step 1 — Add Postgres client to your Neon Project

First, add a Postgres client to your Project. In this example, we used [postgres.js](https://www.npmjs.com/package/postgres), but feel free to choose another one.

## Step 2 — Store Neon Credentials

Next, store your Neon credentials somewhere, for example, in the `.env` file.

```shell
NEON_HOST=...
NEON_DB=...
NEON_USER=...
NEON_PASS=...
NEON_PORT=...
```

## Step 3 — Connect to Database using Postgres client and Neon Credentials

Then, to connect to the database using Postgres client and your Neon credentials, add the following code to the `pages/api/hello_worlds.js`:

```javascript
import postgres from 'postgres';

const sql = postgres({
  host: process.env.NEON_HOST,
  port: process.env.NEON_PORT,
  database: process.env.NEON_DB,
  username: process.env.NEON_USER,
  password: process.env.NEON_PASS,
});

const result = await sql.unsafe(req.body);
```
