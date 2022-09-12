---
title: Run a Node.js app
redirectFrom:
  - /docs/quickstart/node
---

### Introduction

In this section, you will learn how to add a Postgres client to your NodeJS project and connect to your database.

## Step 1 - Create a NodeJS project and add dependencies

Create a NodeJS project and change to the newly created directory.

```shell
mkdir neon-nodejs-example
cd neon-nodejs-example
npm init -y
```

Add project dependecies using the following command:

```shell
npm install postgres dotenv
```

## Step 2 — Store Neon credentials

Store your Neon credentials in the `.env` file. Note that for security purposes, you should not expose your Neon credentials to the browser.

```shell
PGHOST='<project_name>.cloud.neon.tech:<port>'
PGDATABASE='<database>'
PGUSER='<username>'
PGPASSWORD='<password>'
PROJECT_NAME='<project_name>'
```

## Step 3 — Connect to database using Postgres client and Neon credentials

To connect to the database using the Postgres client and your Neon credentials, add the following code to the `src/app.js` file:

```javascript
const postgres = require('postgres');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PROJECT_NAME } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${PROJECT_NAME}`;

const sql = postgres(URL, { ssl: 'require' });

async function getPostgresVersion() {
  const result = await sql`select version()`;
  console.log(result);
}

getPostgresVersion();
```
