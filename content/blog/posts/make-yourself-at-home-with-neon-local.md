---
title: Make Yourself at Home with Neon Local
description: A simpler way to create ephemeral environments with Neon and Docker.
excerpt: >-
  The term ephemeral gets thrown around a lot in the database world, but what
  does it actually mean? In the context of database branches, it refers to
  something temporary, short-lived, and not meant to persist. That might sound
  odd because databases are usually the most permanent p...
date: "2025-04-30T13:02:49"
updatedOn: "2025-08-14T09:26:09"
category: product
categories:
  - product
  - engineering
  - workflows
authors:
  - jeff-christoffersen
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/make-yourself-at-home-with-neon-local/cover.jpg
  alt: Make Yourself at Home with Neon Local
isFeatured: false
seo:
  title: Make Yourself at Home with Neon Local - Neon
  description: A simpler way to create ephemeral environments with Neon and Docker.
  keywords: []
  noindex: false
  ogTitle: Make Yourself at Home with Neon Local - Neon
  ogDescription: A simpler way to create ephemeral environments with Neon and Docker.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/make-yourself-at-home-with-neon-local/social.jpg
---

<span aria-owns="rmiz-modal-c27d1268da88" data-rmiz="">
<span data-rmiz-content="found" style={{ visibility: 'visible' }}>
<img src="https://cdn.neonapi.io/public/images/pages/blog/make-yourself-at-home-with-neon-local/neon-local-cover-1024x576-9f69bf7a.jpg" alt="Make Yourself at Home with Neon Local" />
</span>
</span>

The term ephemeral gets thrown around a lot in the database world, but what does it actually mean?

In the context of database [branches](https://neon.tech/docs/introduction/branching), it refers to something temporary, short-lived, and not meant to persist. That might sound odd because databases are usually the most permanent part of your stack. So why go ephemeral?

**Because not every environment needs to last.**

## What is Neon Local?

[Neon Local](https://neon.tech/docs/local/neon-local) is a proxy service that provides a local interface to your Neon cloud database. By default, it automatically creates a new database branch when your container starts and deletes it when it stops.

### Key benefits:

- **CI-friendly branching:** Automatically creates and removes a database branch for each test run, no need to configure [GitHub Actions](https://neon.tech/docs/guides/branching-github-actions) manually.
- **Local development support:** Lets you use branching locally without manually managing branches or connection strings.
- **Consistent connectivity:** Your application connects to a local Postgres endpoint while Neon Local routes and authenticates to the correct project and branch.<br />

## Is Neon Local a local Postgres instance?

No, not quite, and for good reason. Local Postgres instances, while great in some scenarios, also come with drawbacks. They can lead to environment drift, where your local setup differs from production in subtle but painful ways. They’re also slow to restore from a dump or recreate accurately, making it harder to spin up a fresh, production-like environment for developing. And when it comes to testing, running parallel or per-branch environments is tricky, often forcing you into a shared database that’s not ideal for reliability or reproducibility.

So, Neon Local adopts a hybrid approach. With Neon’s instant branching, look how fast it is to automatically spin up and tear down a truly ephemeral, safe, cloud-based, isolated environment using Docker!

<figure>
<video height="720" style={{ aspectRatio: '1244 / 720' }} width="1244" controls playsInline src="https://cdn.neonapi.io/public/videos/pages/blog/make-yourself-at-home-with-neon-local/docker-compose-up-watch-4b8ca53e.mp4">
</video>
</figure>

## How to use Neon Local

There are several ways to use Neon Local, including using **Docker compose** and **Docker run** commands, with a variety of Postgres clients, and with configuration options to suit your needs.

To give you just one example, here are some code snippets that show how you might use Neon Local in a JavaScript application using our [serverless driver](https://neon.tech/docs/serverless/serverless-driver) and a `docker-compose.yml` file.

For a more comprehensive explaination, see the following guide:

- [How to set up Neon Local with Docker Compose and JavaScript Postgres clients](https://neon.tech/guides/neon-local-docker-compose-javascript).

### Docker Compose

In this `docker-compose.yml`, the `app` service is set up to depend on a `db` service. The db service uses the [neondatabase/neon_local](https://hub.docker.com/r/neondatabase/neon_local) Docker image and is configured with the necessary environment variables. The `DRIVER` is set to `serverless` to indicate that [Neon’s serverless driver](https://neon.tech/docs/serverless/serverless-driver) should be used for database connections, but it is possible to use Neon Local with any Postgres client by setting the `DRIVER` value to `postgres`.

```yaml
services:
  app:
    build: .
    ports:
      - "${PORT}:${PORT}"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - PORT=${PORT}
      - NODE_ENV=${NODE_ENV}
    depends_on:
      - db

  db:
    image: neondatabase/neon_local:latest
    ports:
      - "5432:5432"
    environment:
      NEON_API_KEY: ${NEON_API_KEY}
      NEON_PROJECT_ID: ${NEON_PROJECT_ID}
      DRIVER: serverless
```

### Neon serverless driver

This snippet configures the Neon [serverless driver](https://neon.tech/docs/serverless/serverless-driver) to behave differently depending on the environment. In development, it connects to Neon Local on `db:5432` and sets the `fetchEndpoint` accordingly. In production, the connection is established using the `DATABASE_URL` environment variable.

```javascript
import { neon, neonConfig } from "@neondatabase/serverless";

if (process.env.NODE_ENV !== "production") {
  neonConfig.fetchEndpoint = "https://db:5432/sql";
}

const connectionString =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL
    : "postgres://neon:npg@db:5432/neondb";

export const sql = neon(connectionString);
```

## Docker run

If you’re not using Docker compose, you can still use Neon Local directly with `docker run`. For example:

```bash
docker run \
  --name db \
  -p 5432:5432 \
  -e NEON_API_KEY=<neon_api_key> \
  -e NEON_PROJECT_ID=<neon_project_id> \
  -e DRIVER=serverless \
  neondatabase/neon_local:latest
```

When using `docker run` instead of compose, the configuration for the serverless driver changes slightly. Since the container isn’t part of a named network, you’ll need to use `localhost` instead of `db` in your connection settings:

```javascript
import { neon, neonConfig } from "@neondatabase/serverless";

if (process.env.NODE_ENV !== "production") {
  neonConfig.fetchEndpoint = "https://db:5432/sql"; // [!code --]
  neonConfig.fetchEndpoint = "https://localhost:5432/sql"; // [!code ++]
}

const connectionString =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL
    : "postgres://neon:npg@db:5432/neondb"; // [!code --]
process.env.NODE_ENV === "production"
  ? process.env.DATABASE_URL
  : "postgres://neon:npg@localhost:5432/neondb"; // [!code ++]

export const sql = neon(connectionString);
```

## Neon Local usage continued

In addition to providing connection options using different drivers, Neon Local can also be configured in the following ways:

### Parent Branch ID

By default, if no `PARENT_BRANCH_ID` is set, Neon Local will create a new branch from your project’s `main` or `production` branch. However, you may prefer to branch from elsewhere, like development, staging, or testing. By specifying a `PARENT_BRANCH_ID`, you can control exactly which branch Neon Local uses as the base.

### Delete Branch

By default, Neon Local creates a new branch when the container starts and deletes it when it stops. That said, there are cases where you might want to keep the branch around. To persist branches between container runs, set `DELETE_BRANCH` to `false`, this will prevent the branch from being deleted when the container shuts down.

For more detailed configuration information, visit the docs: [Neon Local](https://neon.tech/docs/local/neon-local).

<p></p>

## Future Features

By default, branches created by Neon Local are assigned random names. That’s fine for short-lived, throwaway environments, but if you plan to keep a branch around for longer, it’s more practical to give it a meaningful name. We’re working on making that possible through a configuration option in an upcoming release.

We’re also exploring support for an “offline mode”, which would allow you to dump and restore a database locally, much like working with a traditional local Postgres instance. This would give developers more flexibility if working without an active connection to Neon’s cloud infrastructure.

## Wrapping up

Neon has always made working with branches easy, and with Neon Local, it’s now just as simple to do from Docker environments. Whether developing, testing, or previewing features, you can spin up clean, isolated ephemeral environments that feel local but behave like prod.

<br />Ready to give it a try? Make yourself comfortable and head over to our [docs](https://neon.tech/docs/local/neon-local) to get started.
