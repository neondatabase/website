---
title: Automate branching with CircleCI
subtitle: Learn how to use the Neon CircleCI Orb to provision ephemeral Postgres
  branches for every CI pipeline run
enableTableOfContents: true
updatedOn: '2026-02-26T20:53:51.999Z'
tag: community
---

The **Neon CircleCI Orb** provisions a real Neon Postgres branch per pipeline run (or per parallel node), instead of a generic Postgres-in-Docker service container. That means your CI database behaves like production - same managed Postgres, network, and extensions, so you get fewer "works in CI, breaks in prod" issues.

Each run gets an isolated, ephemeral branch; you can branch from a pre-migrated parent to skip running migrations from scratch, and the orb handles cleanup and TTL so tests stay deterministic and parallel jobs never share state. This guide covers the `neon/run_tests` job and the `neon/create_branch`, `neon/delete_branch`, and `neon/reset_branch` commands.

<Admonition type="note">
This orb is not maintained or officially supported by Neon. Use at your own discretion. If you have questions or face any issues, please contact the maintainer by raising an issue in the GitHub repository linked below.
</Admonition>

**Neon CircleCI Orb**

- [GitHub repository](https://github.com/dhanushreddy291/neon-circle-ci-orb)
- [CircleCI Orb Registry](https://circleci.com/developer/orbs/orb/dhanushreddy291/neon)

## Prerequisites

To use the Neon CircleCI Orb, you need:

- A [CircleCI account](https://circleci.com/) and a project repository.
- A [Neon account](https://console.neon.tech) and a created project.
- A Neon **API Key**. See [Create an API key](/docs/manage/api-keys#create-an-api-key).
- A Neon **Project ID**. You can find this in the **Settings** page of your Neon project.

## Getting started

To allow CircleCI to communicate with Neon, configure your Neon credentials as environment variables in your CircleCI project.

1. In CircleCI, navigate to **Project Settings** > **Environment Variables**.
2. Add the following variables:

- `NEON_API_KEY`: Your Neon API key.
- `NEON_PROJECT_ID`: The ID of your Neon project.
  ![CircleCI environment variable configuration](/docs/guides/circleci-env-vars.png)

## Configuring pipeline triggers

To configure when your CircleCI pipeline runs, set the pipeline trigger settings:

1. In CircleCI, navigate to **Project Settings** > **Pipelines**.
2. Under the **Triggers** section, select the trigger condition.
3. Set it to **"PR opened or pushed to, default branch and tag pushes"**.

![CircleCI pipeline trigger configuration](/docs/guides/circleci-pipeline-trigger-settings.png)

This configuration triggers the pipeline for:

- Pull requests (when opened or pushed to)
- Direct pushes to the default branch
- Tag pushes

Each pipeline run creates a fresh Neon branch, ensuring isolated database environments for tests. PR workflows get dedicated branches without affecting the main branch or other PRs.

## Available jobs and commands

The orb provides the following pre-configured jobs and commands to manage Neon branches in your CircleCI pipelines:

| Component            | Type    | Description                                                                                  |
| :------------------- | :------ | :------------------------------------------------------------------------------------------- |
| `neon/run_tests`     | Job     | Creates a branch, runs migrations/tests, and deletes the branch. Best for standard CI flows. |
| `neon/create_branch` | Command | Creates a branch and exports connection variables.                                           |
| `neon/delete_branch` | Command | Deletes a branch.                                                                            |
| `neon/reset_branch`  | Command | Resets a branch to the parent's latest state. Useful for persistent staging environments.    |

## The `neon/run_tests` job

The `neon/run_tests` job automates the entire lifecycle of a Neon branch for testing. It provisions a branch, runs your specified commands, and ensures cleanup happens even if tests fail.

This job is ideal for most CI use cases where you want a fresh database for every pipeline run without having to manage the branch lifecycle manually.

The job accepts the following parameters:

- `api_key`: (Optional) Environment variable name containing the Neon API key. Defaults to `NEON_API_KEY`. Ensure this variable is set in your CircleCI project settings.
- `project_id`: (Optional) Environment variable name containing the Neon project ID. Defaults to `NEON_PROJECT_ID`. Ensure this variable is set in your CircleCI project settings.
- `parent_branch`: (Optional) The branch to fork from. Defaults to your project's default branch (e.g., `production`).
- `migrate_command`: The command to prepare the database (e.g., run migrations). This command runs after the branch is ready but before tests start. You can chain multiple commands here if needed (for example, installing dependencies and running migrations).
- `test_command`: The command to execute your tests. This command runs after the `migrate_command` completes. It should be configured to run your test suite (e.g., unit tests, integration tests, or end-to-end tests with Playwright) against the database using the `DATABASE_URL` environment variable.
- `role`: (Optional) The role to use for the connection. Defaults to `neondb_owner`.
- `database`: (Optional) The database name. Defaults to `neondb`.
- `password`: (Optional) The password for the role. You need to set this if you chose not to store passwords for your provided role in the Neon Console. If your role has a stored password in Neon, the Orb retrieves it automatically via API.
- `schema_only`: (Optional) If `true`, creates a schema-only branch. Defaults to `false`.
- `get_auth_url`: (Optional) If `true`, exports `NEON_AUTH_URL` for branches with Neon Auth enabled. Defaults to `false`.
- `get_data_api_url`: (Optional) If `true`, tries to export `NEON_DATA_API_URL` for branches with Data API enabled. Defaults to `false`.

**Outputs:**

- `DATABASE_URL`: The full connection string for the provisioned branch.
- `DATABASE_URL_POOLED`: The pooled connection string.
- `PGHOST`, `PGHOST_POOLED`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`: Individual connection parameters.
- `NEON_BRANCH_ID`: The ID of the created branch.
- `NEON_AUTH_URL`: The Neon Auth URL (if `get_auth_url` is `true` and Neon Auth is enabled).
- `NEON_DATA_API_URL`: The Neon Data API URL (if `get_data_api_url` is `true` and Data API is enabled).

An example usage of the `neon/run_tests` job is provided in the [Example: CircleCI configuration](#example-circleci-configuration) section below.

### How it works

When the `neon/run_tests` job runs, it performs the following steps automatically:

1. **Provision**: Creates a Neon branch from `parent_branch`. The orb auto‑names it as `circle-ci-${CIRCLE_PIPELINE_NUM}-${CIRCLE_NODE_INDEX}` (pipeline run ID + parallel executor index).
2. **Connect**: Exports the connection string as `DATABASE_URL` (and individual PG variables like `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGHOST_POOLED`) to the job environment.
3. **Prepare**: Runs the `migrate_command` you provided.
4. **Test**: Runs the `test_command` you provided.
5. **Cleanup**: Deletes the branch after tests complete, regardless of success or failure.

### Using the connection string

The `neon/run_tests` job automatically sets the `DATABASE_URL` environment variable, which contains your database connection string.

This means that any tool, migration script, or test runner that relies on `DATABASE_URL` can use it directly without extra configuration. For example, a migration command such as `npx drizzle-kit migrate` or a test command like `npm test` can connect to the Neon branch seamlessly using the provided connection string. Alternatively, you can use the individual connection parameters (`PGHOST`, `PGUSER`, `PGPASSWORD`, etc.) if your tools require them.

### Example: CircleCI configuration

To better understand how to use `neon/run_tests` job, consider the following example CircleCI (`.circleci/config.yml`) configuration:

```yaml shouldWrap
version: 2.1

orbs:
  neon: dhanushreddy291/neon@1.0
  node: circleci/node@7.2.1

workflows:
  test_workflow:
    jobs:
      - neon/run_tests:
          name: e2e_tests
          executor:
            name: node/default
            tag: "24.12"
          # Migrate command can be any setup command that prepares the database. It runs after the branch is ready but before tests start. You can chain multiple commands here if needed.
          migrate_command: npm ci && npm run db:migrate && npx playwright install --with-deps chromium
          # Run any test command that relies on DATABASE_URL for the connection string. (e.g., unit tests, integration tests, or end-to-end tests with Playwright)
          test_command: npm test
```

In this example:

- **`orbs`**: Imports the `neon` orb (to manage database branches) and the `circleci/node` orb (to set up the Node.js environment).
- **`executor`**: Specifies the execution environment. We use the `node/default` executor from the Node orb with tag `24.12`.
- **`migrate_command`**: A chained command that installs dependencies (`npm ci`), runs database migrations (`npm run db:migrate`), and sets up browser binaries for Playwright (`npx playwright install ...`). This runs _after_ the database branch is created but _before_ tests start.
- **`test_command`**: The actual test runner command. You can configure `npm test` in your `package.json` to run any test suite, unit tests, integration tests, or end-to-end tests with tools like Playwright against the isolated Neon branch.

Checkout the full example in the [GitHub repository](https://github.com/dhanushreddy291/hono-crud-api), which shows a basic Hono app with a Playwright test suite. It uses the `neon/run_tests` job in CircleCI to provision a Neon branch, run migrations, and execute tests ensuring each pipeline run gets a fresh, isolated database for reliable per PR testing.

## Custom workflows with Orb commands

For advanced use cases such as complex build matrices or multi-stage pipelines you can use the Orb's granular commands directly within your own jobs.

## Available commands

The Orb provides the following commands for building custom workflows.

### `neon/create_branch`

Creates a new database branch. This command waits for the branch to be active ("ready") and exports the connection details to the environment.

| Input              | Type         | Default             | Description                                                                                                                                    |
| :----------------- | :----------- | :------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| `api_key`          | env_var_name | `NEON_API_KEY`      | Environment variable name containing the Neon API key.                                                                                         |
| `project_id`       | env_var_name | `NEON_PROJECT_ID`   | Environment variable name containing the Neon project ID.                                                                                      |
| `parent_branch`    | string       | _project default_   | The parent branch name or ID to fork from.                                                                                                     |
| `branch_name`      | string       | _generated_         | Custom branch name. If empty, defaults to `circle-ci-${CIRCLE_PIPELINE_NUM}-${CIRCLE_NODE_INDEX}` (pipeline run ID + parallel executor index). |
| `role`             | string       | `neondb_owner`      | The role to use for the connection.                                                                                                            |
| `database`         | string       | `neondb`            | Database name in connection strings.                                                                                                           |
| `password`         | string       | _retrieved via API_ | Password for the role. Required if role passwords are not stored in Neon.                                                                      |
| `ttl_seconds`      | integer      | `3600`              | Branch lifespan in seconds. Set `0` to disable auto-expiry.                                                                                    |
| `schema_only`      | boolean      | `false`             | Creates a schema-only branch when enabled.                                                                                                     |
| `get_auth_url`     | boolean      | `false`             | Exports `NEON_AUTH_URL` when Neon Auth is enabled for the branch.                                                                              |
| `get_data_api_url` | boolean      | `false`             | Exports `NEON_DATA_API_URL` when Data API is enabled for the branch/database.                                                                  |

**Outputs:**

- `DATABASE_URL`: The full connection string.
- `DATABASE_URL_POOLED`: The pooled connection string.
- `PGHOST`: The host address.
- `PGHOST_POOLED`: The pooled host address.
- `PGUSER`, `PGPASSWORD`, `PGDATABASE`: Individual connection parameters.
- `NEON_BRANCH_ID`: The ID of the created branch.
- `NEON_AUTH_URL`: The Neon Auth URL (if `get_auth_url` is `true` and Neon Auth is enabled).
- `NEON_DATA_API_URL`: The Neon Data API URL (if `get_data_api_url` is `true` and Data API is enabled).

### `neon/delete_branch`

Deletes a Neon branch. This is typically used in the final step of a job to clean up resources.

| Input        | Type         | Default           | Description                                                                                  |
| :----------- | :----------- | :---------------- | :------------------------------------------------------------------------------------------- |
| `api_key`    | env_var_name | `NEON_API_KEY`    | Environment variable name containing the Neon API key.                                       |
| `project_id` | env_var_name | `NEON_PROJECT_ID` | Environment variable name containing the Neon project ID.                                    |
| `branch_id`  | string       | `$NEON_BRANCH_ID` | The branch ID to delete. If omitted, the command uses `NEON_BRANCH_ID` from `create_branch`. |

If the branch is already gone (for example, expired via TTL), delete returns a safe no-op instead of failing.

### `neon/reset_branch`

Resets a branch to the latest state of its parent. This is useful for long-lived branches (like `staging` or `dev`) that need to be refreshed with production data before running tests.

| Input           | Type         | Default           | Description                                               |
| :-------------- | :----------- | :---------------- | :-------------------------------------------------------- |
| `api_key`       | env_var_name | `NEON_API_KEY`    | Environment variable name containing the Neon API key.    |
| `project_id`    | env_var_name | `NEON_PROJECT_ID` | Environment variable name containing the Neon project ID. |
| `branch_id`     | string       | -                 | Required. Branch ID or branch name to reset.              |
| `parent_branch` | string       | _original parent_ | Optional parent branch name or ID to reset from.          |

**Outputs:**

Unlike `neon/create_branch`, this command does not export a `DATABASE_URL`. It also does not support options like `role`, `database`, `password`, `schema_only`, `get_auth_url`, or `get_data_api_url`. You must ensure your job has access to the connection details for the target branch (e.g., via CircleCI context or project environment variables).

### Example: Custom job configuration

Here is how to compose these commands manually:

```yaml
version: 2.1

orbs:
  neon: dhanushreddy291/neon@1.0

jobs:
  custom-test:
    docker:
      - image: cimg/node:lts
    steps:
      - checkout
      - neon/create_branch:
          parent_branch: production
          # Optional: Define a custom TTL (e.g., 30 minutes)
          ttl_seconds: 1800

      - run:
          name: Run Migrations
          command: npm run db:migrate

      - run:
          name: Run Tests
          command: npm test

      - neon/delete_branch:
          when: always  # Ensure branch is deleted even if tests fail

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
      - neon/reset_branch:
          # The ID of your persistent staging branch, stored as an environment variable
          branch_id: $STAGING_BRANCH_ID
          # The parent branch to reset from
          parent_branch: production

      - run:
          name: Run Integration Tests
          # Ensure DATABASE_URL is set in your environment (e.g., via CircleCI Project Settings)
          command: npm run test:integration
```

## Best practices

### Branch lifecycle and costs

Neon branches are lightweight and "scale-to-zero" by default, meaning you are not charged for compute when tests are not running. However, branches do consume storage (the delta from the parent branch), so it's important to ensure they are cleaned up after use to avoid unnecessary costs.

To optimize costs don't set the TTL too high for ephemeral branches. For long-lived branches (like staging), consider using the `reset_branch` command instead of creating new branches to minimize storage usage.

### Concurrency

The Neon Orb is designed for concurrency. If you run parallel tests (e.g., CircleCI `parallelism: 4`), the Orb creates a unique branch for every parallel executor. This ensures that tests running at the same time never read or write to the same database, eliminating race conditions and "flaky" tests caused by shared state.

The default branch names are generated from `CIRCLE_PIPELINE_NUM` and include a suffix for parallel executors (for example, `1234-1`, `1234-2`). This allows you to identify which branch corresponds to which test executor in your CircleCI dashboard.
