---
author: paul-scanlon
enableTableOfContents: true
createdAt: '2025-04-30T00:00:00.000Z'
updatedOn: '2025-04-30T00:00:00.000Z'
title: How to set up Neon Local with Docker Compose and JavaScript Postgres clients
subtitle: A practical guide to Neon Local with JavaScript and Docker Compose for local and production setups
---

ICYMI we recently launched [Neon Local](/blog/make-yourself-at-home-with-neon-local).

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

If you need help finding up any of these variables, refer to the following resources:

- [Connection examples](/docs/manage/projects#project-settings)
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

If you started the app in **development** mode, go to the Neon console, and you’ll see a new branch has been created using the `main`, or `production` branch as a base.

<video autoPlay playsInline muted loop controls width="800" height="600">
  <source type="video/mp4" src="/videos/guides/neon-local-docker-compose-javascript/docker-compose-up-watch.mp4"/>
</video>

If you started the app in **production** mode, the app will connect to the database defined by the `DATABASE_URL`, and no new branch will be created.

In the next section, we’ll look at the Docker configuration and how the app determines whether to connect to Neon Local or the cloud instance defined by `DATABASE_URL`.

## 5. Configuration

### Docker Compose

Here’s the `docker-compose.yml` setup, which defines two services. The first, `app`, starts the Express server, responsible for data fetching and server-side rendering of the React app. The second, `db`, configures the Neon Local Docker image.

Additionally, the `app` service defines two profiles, `dev` and `prod`. The `db` service also defines a `dev` profile, ensuring that the `db` service is only used when the app is run in **development** mode.

#### How Docker Profiles Work

Docker profiles allow you to group services within your `docker-compose.yml` file, enabling you to choose which services to start depending on the environment or use case.

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

### Serverless Driver

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

You can view the `src` of this file in the repository: [src/db.js](https://github.com/neondatabase-labs/neon-local-example-react-express-application/blob/main/src/db.js):

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

Additionally, you'll also need to change the `DRIVER` to `postgres` in your `docker-compose.yml` file:

```diff
environment:
  NEON_API_KEY: ${NEON_API_KEY}
  NEON_PROJECT_ID: ${NEON_PROJECT_ID}
  DRIVER: serverless // [!code --]
  DRIVER: postgres // [!code ++]

```

## Wrapping up

And that’s it. By default, Neon Local handles creating and deleting a branch whenever you start or stop the container. If you want more control, such as setting a parent branch or disabling branch deletion, check out the [configuration options in the docs](/docs/local/neon-local).

Neon Local simplifies the management of temporary database environments, making it easier to work with isolated instances for testing or short-term use. While it’s **not** a fully "local" database, it streamlines the workflow, especially for CI/CD pipelines where short-lived environments are needed to run tests but don’t need to stick around.

Neon Local is still in its early stages, with several improvements on the way. But for now, it could be exactly what you need to streamline your workflows. Give it a try today and [share your feedback with us](https://github.com/neondatabase-labs/neon_local).
