---
author: paul-scanlon
enableTableOfContents: true
createdAt: '2025-04-30T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
title: How to set up Neon Local with Docker Compose and JavaScript Postgres clients
subtitle: Use Neon Local with JavaScript and Docker Compose in development, and connect directly to Neon in production
---

This guide covers [Neon Local](/blog/make-yourself-at-home-with-neon-local) with Docker Compose and JavaScript Postgres clients.

## What is Neon Local?

Neon Local is a proxy service that creates a local interface to your Neon cloud database. By default, it automatically creates a new database branch when your container starts and deletes it when the container stops. Your app connects to a local Postgres endpoint while Neon Local handles routing and authentication to the correct project and branch. _This means you don’t have to update connection strings across branches._

Our [docs](/docs/local/neon-local) cover how to use Neon Local with both our [serverless driver](/docs/serverless/serverless-driver) and [pg](https://github.com/brianc/node-postgres), but one area that might cause some confusion is how to switch between Neon Local in **development** and your Neon cloud database in **production**.

In this guide, I’ll show you how to set up your project to work in both development and production environments.

## 1. Example application

To demonstrate, I’ve built a simple React + Vite + Express app. It has one route (`/`) that runs `SELECT version()` and returns the result.

You can find the project here:

- [neon-local-example-application](https://github.com/neondatabase-labs/neon-local-example-react-express-application)

## 2. Setup

### Environment variables

You’ll need to configure the following environment variables. They are also listed in the example application's repository [README](https://github.com/neondatabase-labs/neon-local-example-react-express-application).

| Variable          | Description                    | Example / Value               |
| ----------------- | ------------------------------ | ----------------------------- |
| `DATABASE_URL`    | Connection string for database | _(Set appropriately)_         |
| `NODE_ENV`        | Node environment mode          | `production` or `development` |
| `NEON_API_KEY`    | Neon API authentication key    | `napi_6ngd23amjggx7...`       |
| `NEON_PROJECT_ID` | Neon project identifier        | `rosty-king-89...`            |
| `PORT`            | Server port                    | `8080`                        |

If you need help finding any of these variables, see the following resources:

- [Connection examples](/docs/connect/connect-from-any-app)
- [Creating API keys](/docs/manage/api-keys#creating-api-keys)
- [Project settings](/docs/manage/projects#project-settings)

### Docker for Mac

This guide uses Docker for Mac. If you don’t have it installed yet, follow this guide:

- [Install Docker Desktop on Mac](https://docs.docker.com/desktop/setup/install/mac-install/)

![Docker for Mac](/guides/images/neon-local-docker-compose-javascript/neon-local-docker-for-mac.jpg)

## 3. Running the app

If you've cloned the repo, and followed the install instructions, run the app with one of the following commands:

- **development**:  
  `docker compose --profile dev --env-file .env.dev up --watch`
- **production**:  
  `docker compose --profile prod --env-file .env.prod up --build`

Once the app is running, go to [http://localhost:8080/](http://localhost:8080/) in your browser.

## 4. Ephemeral branches

If you started the app in **development** mode, go to the Neon Console, and you’ll see a new branch created from your project's default branch (for example, `main` or `production`).

<video autoPlay playsInline muted loop controls width="800" height="600">
  <source type="video/mp4" src="/videos/guides/neon-local-docker-compose-javascript/docker-compose-up-watch.mp4"/>
</video>

If you started the app in **production** mode, the app will connect to the database defined by the `DATABASE_URL`, and no new branch will be created.

In the next section, we’ll look at the Docker configuration and how the app determines whether to connect to Neon Local or the cloud instance defined by `DATABASE_URL`.

## 5. Configuration

### Docker Compose

Here’s the `docker-compose.yml` setup, which defines two services. The first, `app`, starts the Express server, responsible for data fetching and server-side rendering of the React app. The second, `db`, configures the Neon Local Docker image.

The `app` service defines two profiles, `dev` and `prod`. The `db` service defines only a `dev` profile, so it runs only when the app is started in **development** mode.

#### How Docker profiles work

Docker profiles let you group services within your `docker-compose.yml` file, so you can choose which services to start depending on the environment or use case.

- The `app` service has both `dev` and `prod` profiles. This means the `app` can be run in either development or production mode.
- The `db` service is only included in the `dev` profile, meaning it will only run when the app is started in development mode.

```yaml
services:
  app:
    build: .
    ports:
      - '${PORT}:${PORT}'
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - PORT=${PORT}
      - NODE_ENV=${NODE_ENV}
      - DATABASE_URL=${DATABASE_URL}
      - NEON_API_KEY=${NEON_API_KEY}
      - NEON_PROJECT_ID=${NEON_PROJECT_ID}
    profiles:
      - dev
      - prod

  db:
    image: neondatabase/neon_local:latest
    ports:
      - '5432:5432'
    environment:
      NEON_API_KEY: ${NEON_API_KEY}
      NEON_PROJECT_ID: ${NEON_PROJECT_ID}
      DRIVER: serverless
    profiles:
      - dev
```

You can view the `src` of this file in the repository: [docker-compose.yml](https://github.com/neondatabase-labs/neon-local-example-react-express-application/blob/main/docker-compose.yml)

## 6. Connecting to the database

### Serverless driver

The database connection is established using our [serverless driver](/docs/serverless/serverless-driver). It uses a ternary operation to determine whether to connect to Neon Local or the `DATABASE_URL`, depending on the mode the application is running in.

```javascript
import 'dotenv/config';

import { neon, neonConfig } from '@neondatabase/serverless';

if (process.env.NODE_ENV !== 'prod') {
  neonConfig.fetchEndpoint = 'http://db:5432/sql';
}

const connectionString =
  process.env.NODE_ENV === 'prod' ? process.env.DATABASE_URL : 'postgres://neon:npg@db:5432/neondb';

export const sql = neon(connectionString);
```

You can view the `src` of this file in the repository: [src/db.js](https://github.com/neondatabase-labs/neon-local-example-react-express-application/blob/main/src/db.js).

### node-postgres

Alternatively, if you prefer to use `pg`, here's how the connection is configured. Note that you'll need to add `?sslmode=no-verify` to the end of the Neon Local connection string.

```javascript
import 'dotenv/config';

import pg from 'pg';
const { Pool } = pg;

const connectionString =
  process.env.NODE_ENV === 'prod'
    ? process.env.DATABASE_URL
    : 'postgres://neon:npg@db:5432/neondb?sslmode=no-verify';

export const pool = new Pool({ connectionString });
```

You don't need to change the Docker Compose file to switch drivers. Neon Local now supports the `postgres` and `serverless` drivers through the same connection string, and the `DRIVER` variable in the example's `docker-compose.yml` is deprecated. You can remove it. See [Neon Local](/docs/local/neon-local#multi-driver-support).

## Wrapping up

And that’s it. By default, Neon Local handles creating and deleting a branch whenever you start or stop the container. If you want more control, such as setting a parent branch or disabling branch deletion, check out the [configuration options in the docs](/docs/local/neon-local).

Neon Local creates and cleans up temporary branches for you, which helps when you need isolated databases for testing or short-term work. It’s **not** a fully "local" database, but it fits CI/CD pipelines where short-lived environments run tests and then go away.

To report issues or request features, use the [Neon Local repository](https://github.com/neondatabase-labs/neon_local).
