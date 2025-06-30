---
title: Neon Local
enableTableOfContents: true
subtitle: Use Docker environments to connect to Neon and manage branches automatically
updatedOn: '2025-04-29T13:55:59.260Z'
---

[Neon Local](https://github.com/neondatabase-labs/neon_local) is a proxy service that creates a local interface to your Neon cloud database. By default, it automatically creates a new database branch when the container starts and deletes it when the container stops.

Your application connects to a local Postgres endpoint, while Neon Local handles routing and authentication to the correct project and branch. This removes the need to update connection strings when working across database branches.

## Docker compose instructions

You can add the Neon Local by adding the following to your `docker-compose.yml` file.

<CodeTabs labels={["Neon serverless driver", "node-postgres"]}>

```shell
  db:
    image: neondatabase/neon_local:latest
    ports:
      - '5432:5432'
    environment:
      NEON_API_KEY: ${NEON_API_KEY}
      NEON_PROJECT_ID: ${NEON_PROJECT_ID}
      DRIVER: serverless
```

```shell
  db:
    image: neondatabase/neon_local:latest
    ports:
      - '5432:5432'
    environment:
      NEON_API_KEY: ${NEON_API_KEY}
      NEON_PROJECT_ID: ${NEON_PROJECT_ID}
      DRIVER: postgres
```

</CodeTabs>

## Docker run instructions

You can also run the Neon Local container with the following Docker run command.

<CodeTabs labels={["Neon serverless driver", "node-postgres"]}>

```shell
docker run \
  --name db \
  -p 5432:5432 \
  -e NEON_API_KEY= <neon_api_key> \
  -e NEON_PROJECT_ID=<neon_project_id> \
  -e DRIVER=serverless \
  neondatabase/neon_local:latest
```

```shell
docker run \
  --name db \
  -p 5432:5432 \
  -e NEON_API_KEY= <neon_api_key> \
  -e NEON_PROJECT_ID=<neon_project_id> \
  -e DRIVER=postgres \
  neondatabase/neon_local:latest
```

</CodeTabs>

## Connect

Connect using either the Neon [serverless driver](/serverless/serverless-driver) or any other Postgres client.

<CodeTabs labels={["Neon serverless driver", "node-postgres"]}>

```javascript
import { neon, neonConfig } from '@neondatabase/serverless';
neonConfig.fetchEndpoint = 'http://db:5432/sql';

const sql = neon('postgres://neon:npg@db:5432/neondb');
```

```javascript
import pg from 'pg';
const { Pool } = pg;
const connectionString = 'postgres://neon:npg@db:5432/neondb?sslmode=no-verify';

const pool = new Pool({ connectionString });
```

</CodeTabs>

## Configuration options

| Key                | Configuration                                                                                  | Required | Default               |
| ------------------ | ---------------------------------------------------------------------------------------------- | -------- | --------------------- |
| `NEON_API_KEY`     | Generate a Neon API key by following instructions at: [Manage API Keys](/docs/manage/api-keys) | Yes      | n/a                   |
| `NEON_PROJECT_ID`  | Your project ID, found in the Neon console under **Settings** > **General**                    | Yes      | n/a                   |
| `DRIVER`           | The type of database driver. Options: `serverless` or `postgres`                               | No       | `postgres`            |
| `PARENT_BRANCH_ID` | The parent branch to use when creating a local child branch.                                   | No       | `main` / `production` |
| `DELETE_BRANCH`    | Whether to delete the branch when the container stops. Options: `true` or `false`              | No       | `true`                |

## Persistent Neon Branch per Git Branch

If you want Neon Local to create a branch that matches your Git branch, provide two volume mounts:

1. A mount that persists Neon branch metadata within your project
2. A mount that exposes the current Git branch name

<Admonition type="note">
This will automatically create a `.neon_local` folder in your project to store branch metadata. Be sure to add this folder to your `.gitignore` to avoid committing database connection information to version control.
</Admonition>

```yml
db:
  image: neondatabase/neon_local:latest
  ports:
    - '5432:5432'
  environment:
    NEON_API_KEY: ${NEON_API_KEY}
    NEON_PROJECT_ID: ${NEON_PROJECT_ID}
  volumes:
    - ./.neon_local/:/tmp/.neon_local
    - ./.git/HEAD:/tmp/.git/HEAD:ro,consistent
```

## Git integration using Docker on Mac

If using Docker Desktop for Mac, make sure that your Virtual Machine is set to use gRPC FUSE, not VirtioFS. This allows Neon Local to detect git branch changes. There is currently a bug with VirtioFS that can prevent containers from being properly updated when local files change while the container is running.

![Docker Desktop are set to gRPC FUSE](/docs/local/neon-local-docker-settings.jpg)
