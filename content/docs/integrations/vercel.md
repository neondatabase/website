---
title: Run a Vercel and Next.js app
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/vercel
---

## Introduction

Vercel is a serverless platform used by developers for web hosting and other web services with the benefit of automatic scaling and smooth deployment; it also allows you to deploy your Next.js applications with full-on support.

## Create a Next.js project

First, [Create a next.js project](https://nextjs.org/learn/basics/create-nextjs-app/setup) if you don't have one.

## Create a Neon project

Next, create a Neon Project for your app. You can configure your database schema from Neon Console or using tools like Prisma.

## Add PostgreSQL client

Add PostgreSQL client to your app. In this example we used [postgres.js](https://www.npmjs.com/package/postgres), but feel free to choose another one.

## Add Neon credentials

Add your Neon credentials to the `.env` file.

```shell
NEON_HOST=...
NEON_DB=...
NEON_USER=...
NEON_PASS=...
NEON_PORT=...
```

You can use either a connection string or connection options separately.

## Connect to the Database with a PostgreSQL client and Neon Credentials

Connect to the database with PostgreSQL client and your Neon credentials from your api handlers or server functions.

```javascript pages/api/hello_worlds.js
import postgres from 'postgres';

const sql = postgres({
  host: process.env.NEON_HOST,
  port: process.env.NEON_PORT,
  database: process.env.NEON_DB,
  username: process.env.NEON_USER,
  password: process.env.NEON_PASS,
});

const result = await sql.uafe(req.body);
```

_Note: Do not ever expose your Neon credentials to the browser._
