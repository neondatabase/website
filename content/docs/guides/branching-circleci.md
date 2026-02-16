---
title: Automate branching with CircleCI
subtitle: Learn how to use the Neon CircleCI Orb to provision ephemeral Postgres branches for every CI pipeline run
enableTableOfContents: true
updatedOn: '2026-02-15T00:00:00.000Z'
---

Managing database state in CI pipelines is a common source of flakiness. When multiple builds share a single database, tests can collide, and failures become difficult to reproduce. Ideally, every pipeline run should get a fresh, isolated database provisioned automatically and cleaned up when it's done.

The Neon CircleCI Orb solves this problem by leveraging Neon’s branching capabilities. By integrating Neon into CircleCI, you can provision a fresh, isolated Postgres database for every build or pull request, run your tests, and automatically clean up resources when finished.

This approach replaces slow, flaky shared testing databases with instant, copy-on-write branches that scale to zero when not in use.

## Prerequisites

To use the Neon CircleCI Orb, you need:

- A [CircleCI account](https://circleci.com/) and a project repository.
- A [Neon account](https://console.neon.tech) and a created project.
- A Neon **API Key**. See [Create an API key](/docs/manage/api-keys#create-an-api-key).
- A Neon **Project ID**. You can find this in the **Settings** page of your Neon project.

## Getting started

To allow CircleCI to communicate with Neon, you must configure your Neon credentials as environment variables in your CircleCI project.

1.  In CircleCI, navigate to **Project Settings** > **Environment Variables**.
2.  Add the following variables:
    - `NEON_API_KEY`: Your Neon API key.
    - `NEON_PROJECT_ID`: The ID of your Neon project.
      ![CircleCI environment variable configuration](/docs/guides/circleci-env-vars.png)

## Available jobs and commands

The Neon orb provides the following pre-configured jobs and commands to manage Neon branches in your CircleCI pipelines:

| Component            | Type    | Description                                                                                           |
| :------------------- | :------ | :---------------------------------------------------------------------------------------------------- |
| `neon/run-tests`     | Job     | Retrieves a branch, runs migrations/tests, and deletes the branch. Best for standard CI/CD pipelines. |
| `neon/create-branch` | Command | Creates a branch and exports connection variables.                                                    |
| `neon/delete-branch` | Command | Deletes a branch.                                                                                     |
| `neon/reset-branch`  | Command | Resets a branch to the parent's latest state. Useful for persistent staging environments.             |

## The `neon/run-tests` job

The `neon/run-tests` job automates the entire lifecycle of a Neon branch for testing purposes. It provisions a new branch, runs your specified commands, and ensures cleanup happens even if tests fail.

A typical CircleCI configuration using the `neon/run-tests` job looks like this:

```yaml
version: 2.1

orbs:
  neon: neon/neon@1.0

workflows:
  test_workflow:
    jobs:
      - neon/run-tests:
          parent_branch: production
          # Command to prepare the DB (e.g., migrations, seeding)
          migrate_command: "npm run db:migrate"
          # Command to run your test suite
          test_command: "npm test"
          # Optional: Define a custom TTL (e.g., 30 minutes)
          ttl_seconds: 1800
```

### Parameters

- `parent_branch`: (Optional) The branch to fork from. Defaults to your project's default branch (e.g., `production`).
- `migrate_command`: The command to prepare the database (e.g., run migrations).
- `test_command`: The command to execute your tests.
- `ttl_seconds`: (Optional) The lifespan of the branch in seconds. Used as a safety net for cleanup. Defaults to `3600` (1 hour). Set to `0` for disabling automatic cleanup of branches.
- `role`: (Optional) The role to use for the connection. Defaults to `neondb_owner`.
- `password`: (Optional) The password for the role. You need to set this if you chose not to store passwords in the Neon console.
- `create_auth`: (Optional) Whether to enable Neon Auth for the branch. Defaults to `false`. If set to `true`, the job exports the `NEON_AUTH_URL` environment variable.
- `create_data_api`: (Optional) Whether to enable the Neon Data API for the branch. Defaults to `false`. If set to `true`, the job exports the `NEON_DATA_API_URL` environment variable.

### How it works

When the `neon/run-tests` job runs, it performs the following steps automatically:

1.  **Provision**: Creates a new Neon branch derived from the `parent_branch`. The branch name is deterministically generated based on the pipeline ID (e.g., `ci-run-1234`) to ensure traceability.
2.  **Connect**: Exports the connection string as `DATABASE_URL` (and individual PG variables like `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGHOST_POOLED`) to the job environment.
3.  **Prepare**: Runs the `migrate_command` you provided.
4.  **Test**: Runs the `test_command` you provided.
5.  **Cleanup**: Deletes the branch after tests complete, regardless of success or failure.

<Admonition type="info" title="Branch lifecycle and cleanup">
The Orb automatically sets a generic **Time-To-Live (TTL)** on the branch upon creation. If your CircleCI job crashes and skips the cleanup step, Neon will automatically delete the branch after the TTL expires, preventing orphaned branches and unnecessary costs.
</Admonition>

### Using the connection string

The `neon/run-tests` job automatically sets the `DATABASE_URL` environment variable, which contains your database connection string.

This means that any tool, migration script, or test runner that relies on `DATABASE_URL` can use it directly without extra configuration. For example, a migration command such as `npm run db:migrate` will automatically pick up the connection string.

**Example migration script:**

```js
// Access the connection string from the environment
const DATABASE_URL = process.env.DATABASE_URL;

import db from '@/db';

async function runMigrations() {
  const client = new db.Client(DATABASE_URL);
  await client.connect();

  // Run your migration logic here
  console.log("Migrations executed successfully");

  await client.end();
}

runMigrations().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
```

### Alternative: Individual Parameters

Most modern ORMs and migration tools (such as Prisma, Drizzle, or Sequelize) automatically detect `DATABASE_URL` if it is present in the environment. In most cases, you won’t need to pass it explicitly.

If your tool does not support `DATABASE_URL` and requires individual connection parameters, the `neon/run-tests` job also exports the following variables:

- `DATABASE_URL_POOLED`: The pooled connection string.
- `PGHOST`
- `PGHOST_POOLED`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`

## Custom workflows with Orb commands

For advanced use cases such as complex build matrices or multi-stage pipelines you can use the Orb's granular commands directly within your own jobs.

## Available commands

The Orb provides the following commands for building custom workflows.

### `neon/create-branch`

Creates a new database branch. This command waits for the branch to be active ("ready") and exports the connection details to the environment.

| Input             | Type    | Default                                            | Description                                                                                              |
| :---------------- | :------ | :------------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| `parent_branch`   | string  | Your project's default branch (e.g., `production`) | The name or ID of the parent branch to fork from.                                                        |
| `branch_name`     | string  | _generated_                                        | Custom name for the branch. Defaults to `ci-build-<ID>`.                                                 |
| `role`            | string  | `neondb_owner`                                     | The role to use for the connection.                                                                      |
| `password`        | string  | _generated_                                        | The password for the role. You need to set this if you chose not to store passwords in the Neon console. |
| `ttl_seconds`     | integer | `3600`                                             | The lifespan of the branch in seconds. Used as a safety net for cleanup.                                 |
| `create_auth`     | boolean | `false`                                            | Whether to enable Neon Auth for the branch.                                                              |
| `create_data_api` | boolean | `false`                                            | Whether to enable the Neon Data API for the branch.                                                      |

**Outputs:**

- `DATABASE_URL`: The full connection string.
- `DATABASE_URL_POOLED`: The pooled connection string.
- `PGHOST`: The host address.
- `PGHOST_POOLED`: The pooled host address.
- `PGUSER`, `PGPASSWORD`, `PGDATABASE`: Individual connection parameters.
- `NEON_BRANCH_ID`: The ID of the created branch.
- `NEON_AUTH_URL`: The Neon Auth URL (if `create_auth` is `true`).
- `NEON_DATA_API_URL`: The Neon Data API URL (if `create_data_api` is `true`).

### `neon/delete-branch`

Deletes a Neon branch. This is typically used in the final step of a job to clean up resources.

| Input       | Type   | Default           | Description                                                                       |
| :---------- | :----- | :---------------- | :-------------------------------------------------------------------------------- |
| `branch_id` | string | `$NEON_BRANCH_ID` | The ID of the branch to delete. Defaults to the ID from the `create-branch` step. |

### `neon/reset-branch`

Resets a branch to the latest state of its parent. This is useful for long-lived branches (like `staging` or `dev`) that need to be refreshed with production data before running tests.

| Input           | Type   | Default                                            | Description                                        |
| :-------------- | :----- | :------------------------------------------------- | :------------------------------------------------- |
| `branch_id`     | string | -                                                  | The ID of the branch to reset.                     |
| `parent_branch` | string | Your project's default branch (e.g., `production`) | The name or ID of the parent branch to reset from. |

### Example: Custom job configuration

Here is how to compose these commands manually:

```yaml
version: 2.1

orbs:
  neon: neon/neon@1.0

jobs:
  custom-test:
    docker:
      - image: cimg/node:lts
    steps:
      - checkout
      - neon/create-branch:
          parent_branch: production
          # Optional: Define a custom TTL (e.g., 30 minutes)
          ttl_seconds: 1800

      - run:
          name: Run Migrations
          command: npm run db:migrate

      - run:
          name: Run Tests
          command: npm test

      - neon/delete-branch

workflows:
  main:
    jobs:
      - custom-test
```

### Example: Resetting a long-lived branch

Instead of creating a new branch every time, you can reset a persistent branch like a staging environment to the latest state of your parent branch.

```yaml shouldWrap
jobs:
  reset-staging:
    docker:
      - image: cimg/node:lts
    steps:
      - checkout
      - neon/reset-branch:
          # The ID of your persistent staging branch, stored as an environment variable
          branch_id: $STAGING_BRANCH_ID
          # The parent branch to reset from
          parent_branch: production

      - run:
          name: Run Integration Tests
          command: npm run test:integration
```

## Best practices

### Branch lifecycle and costs

Neon branches are lightweight and "scale-to-zero" by default, meaning you are not charged for compute when tests are not running. However, branches do consume storage (the delta from the parent branch), so it's important to ensure they are cleaned up after use to avoid unnecessary costs.

To optimize costs don't set the TTL too high for ephemeral branches. For long-lived branches (like staging), consider using the `reset-branch` command instead of creating new branches to minimize storage usage.

### Concurrency

The Neon Orb is designed for concurrency. If you run parallel tests (e.g., CircleCI `parallelism: 4`), the Orb creates a unique branch for every parallel executor. This ensures that tests running at the same time never read or write to the same database, eliminating race conditions and "flaky" tests caused by shared state.

The branch names are generated with a unique suffix (e.g., `ci-build-1234-1`, `ci-build-1234-2`, etc.) where the number corresponds to the parallel executor index (`CIRCLE_NODE_INDEX`). This allows you to easily identify which branch corresponds to which test executor in your CircleCI dashboard.

<NeedHelp/>
