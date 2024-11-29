---
title: Automated Database Branching with GitHub Actions
subtitle: Learn how to implement automated database branching for your applications using Neon and GitHub Actions
enableTableOfContents: true
author: dhanush-reddy
createdAt: '2024-11-29T00:00:00.000Z'
---

Database changes can be one of the trickiest parts of application development. When multiple developers work on features that require database modifications, they often face challenges like conflicting schema changes, difficulty in testing migrations, and the risk of breaking the production database.

Database branching solves these problems by allowing developers to create isolated database environments for each feature branch, just like they do with code.
This guide demonstrates how to implement automated database branching using Neon and GitHub Actions, where each pull request gets its own database branch, complete with the necessary schema changes. You'll build a Next.js Todo application that showcases this workflow, which automates several critical database operations:

- Creates a new database branch when a pull request is opened
- Automatically applies schema migrations to the new branch
- Shows schema diffs directly in your pull request
- Syncs changes to production when the PR is merged

By the end of this guide, you'll have a system where database changes are as seamless as code changes, with each feature safely isolated in its own environment until it's ready for production. This approach not only makes database changes safer but also gives developers the confidence to experiment with schema changes without fear of breaking the production environment.

## Prerequisites

- A [Neon account](https://console.neon.tech)
- A GitHub account
- Node.js installed on your machine
- Basic familiarity with Next.js and TypeScript

## Setting Up Your Neon Database

1. Create a new Neon project from the [Neon Console](https://console.neon.tech)
2. Note your connection string from the connection details page

   Your connection string will look similar to this:

   ```shell
   postgres://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require
   ```

## Set up the project

1. Create a new Next.js project with TypeScript:

   ```bash
   npx create-next-app@14 todo-app --typescript --tailwind --use-npm --eslint --app --no-src-dir --import-alias "@/*"
   cd todo-app
   ```

2. Install the required dependencies:

   ```bash
   npm install drizzle-orm @neondatabase/serverless dotenv
   npm install -D drizzle-kit
   ```

## Configure the database schema

1. Create `app/db/schema.ts`:

   ```typescript
   import { integer, text, boolean, pgTable } from 'drizzle-orm/pg-core';

   export const todo = pgTable('todo', {
     id: integer('id').primaryKey(),
     text: text('text').notNull(),
     done: boolean('done').default(false).notNull(),
   });
   ```

2. Create `drizzle.config.ts` in your project root:

   ```typescript
   import { config } from 'dotenv';
   import { defineConfig } from 'drizzle-kit';

   config({ path: '.env' });

   export default defineConfig({
     schema: './app/db/schema.ts',
     out: './migrations',
     dialect: 'postgresql',
     dbCredentials: {
       url: process.env.DATABASE_URL!,
     },
   });
   ```

3. Add database scripts to your `package.json`:

   ```json
   {
    ...
     "scripts": {
        ...
       "db:generate": "drizzle-kit generate",
       "db:migrate": "drizzle-kit migrate"
     }
   }
   ```

4. Create a `.env` file in your project root:

   ```bash
   DATABASE_URL=postgres://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require
   ```

## Set up the Neon GitHub integration

1. In the Neon Console, navigate to the **Integrations** page in your Neon project.
2. Locate the **GitHub** card and click **Add**.
   ![GitHub App card](/docs/guides/github_card.png)
3. On the **GitHub** drawer, click **Install GitHub App**.
4. If you have more than one GitHub account, select the account where you want to install the GitHub app.
5. Select the GitHub repository to connect to the current Neon project, and click **Connect**.

   Ignore the final page of the setup on the console, where a sample GitHub Actions workflow is provided, as we'll be creating a custom workflow in the next steps.

## Create the GitHub Actions workflow

Create `.github/workflows/neon_workflow.yaml`:

```yaml
name: Create/Delete Branch for Pull Request

on:
  pull_request:
    types:
      - opened
      - reopened
      - synchronize
      - closed

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}

jobs:
  setup:
    name: Setup
    outputs:
      branch: ${{ steps.branch_name.outputs.current_branch }}
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - name: Get branch name
        id: branch_name
        uses: tj-actions/branch-names@v8

  create_neon_branch:
    name: Create Neon Branch
    outputs:
      db_url: ${{ steps.create_neon_branch_encode.outputs.db_url }}
      db_url_with_pooler: ${{ steps.create_neon_branch_encode.outputs.db_url_with_pooler }}
    needs: setup
    if: |
      github.event_name == 'pull_request' && (
      github.event.action == 'synchronize'
      || github.event.action == 'opened'
      || github.event.action == 'reopened')
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Create Neon Branch
        id: create_neon_branch
        uses: neondatabase/create-branch-action@v5
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          branch_name: preview/pr-${{ github.event.number }}-${{ needs.setup.outputs.branch }}
          api_key: ${{ secrets.NEON_API_KEY }}

      - name: Run Migrations
        run: npm install && npm run db:generate && npm run db:migrate
        env:
          DATABASE_URL: '${{ steps.create_neon_branch.outputs.db_url }}'

      - name: Post Schema Diff Comment to PR
        uses: neondatabase/schema-diff-action@v1
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          compare_branch: preview/pr-${{ github.event.number }}-${{ needs.setup.outputs.branch }}
          api_key: ${{ secrets.NEON_API_KEY }}

  delete_neon_branch:
    name: Delete Neon Branch
    needs: setup
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    steps:
      - name: Delete Neon Branch
        uses: neondatabase/delete-branch-action@v3
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          branch: preview/pr-${{ github.event.number }}-${{ needs.setup.outputs.branch }}
          api_key: ${{ secrets.NEON_API_KEY }}

      - name: Checkout
        uses: actions/checkout@v4

      - name: Apply migrations
        run: npm install && npm run db:generate && npm run db:migrate
        env:
          DATABASE_URL: '${{ secrets.DATABASE_URL }}'
```

<Admonition type="note" title="Note">
To set up GitHub Actions correctly:

- **Enable Workflow Permissions**:
  Go to your repository's GitHub Actions settings and set Workflow permissions to Read & write.

- **Add Database Connection String**:
  Add a `DATABASE_URL` secret to your repository under Settings > Secrets and variables > Actions, using the connection string for your production database.

</Admonition>

## Understanding the workflow

The GitHub Actions workflow automates database branching and schema management for pull requests. Here's a breakdown of the workflow:

### Create Branch Job

This job runs when a pull request is opened, reopened, or synchronized:

1. **Branch Creation**:

   - Uses Neon's `create-branch-action` to create a new database branch
   - Names the branch using the pattern `preview/pr-{number}-{branch_name}`
   - Inherits the schema and data from the parent branch

2. **Migration Handling**:

   - Installs project dependencies
   - Generates migration files using Drizzle
   - Applies migrations to the newly created branch
   - Uses the branch-specific `DATABASE_URL` for migration operations

3. **Schema Diff Generation**:
   - Uses Neon's `schema-diff-action`
   - Compares the schema of the new branch with the parent branch
   - Automatically posts the differences as a comment on the pull request
   - Helps reviewers understand database changes at a glance

### Delete Branch Job

This job executes when a pull request is closed (either merged or rejected):

1. **Production Migration**:

   - If the PR is merged, applies migrations to the production database
   - Uses the main `DATABASE_URL` stored in repository secrets
   - Ensures production database stays in sync with merged changes

2. **Cleanup**:
   - Removes the preview branch using Neon's `delete-branch-action`

## Flow Summary

Here's how the entire process works from start to finish:

1. Developer creates a new feature branch and makes schema changes
2. When they open a pull request:
   - A new database branch is automatically created
   - Schema migrations are generated and applied
   - A schema diff comment is posted on the PR
3. During PR review:
   - Reviewers can see exactly what database changes are being made
   - The isolated database branch prevents conflicts with other features
   - Additional commits trigger automatic migration updates
4. When the PR is approved and merged:
   - Migrations are automatically applied to the production database
   - The preview branch is deleted
   - The schema changes are now live in production
5. If the PR is closed without merging:
   - The preview branch is automatically deleted
   - No changes are made to the production database

This automated workflow ensures that:

1. Every feature gets its own isolated database environment
2. Schema changes are automatically tracked and documented
3. Migrations are consistently applied across environments
4. Production database stays in sync with merged code
5. Database resources are efficiently managed
6. The risk of manual migration errors is minimized

## Test the workflow

1. Create a new feature branch:

   ```bash
   git checkout -b feature/add-todo-created-at
   ```

2. Modify the schema in `db/schema/todos.ts`:

   ```typescript
   export const todo = pgTable('todo', {
     id: integer('id').primaryKey(),
     text: text('text').notNull(),
     done: boolean('done').default(false).notNull(),
     created_at: timestamp('created_at').notNull().defaultNow(),
   });
   ```

3. Commit and push your changes:

   ```bash
   git add .
   git commit -m "feat: add created_at field to todo"
   git push origin feature/add-todo-created-at
   ```

4. Open a pull request on GitHub

The workflow will:

- Create a new database branch for your PR
- Apply the schema migration
- Post a schema diff comment on the PR
  ![Schema Diff Comment](/docs/guides/github_schema_diff_example_comment.png)
- After merging, apply the changes to production

## Source code

You can find the complete source code for this example on GitHub.

<DetailIconCards>
<a href="https://github.com/dhanushreddy291/neon-github-actions-integration" description="Get started with automated database branching using Neon and GitHub Actions" icon="github">Get started with automated database branching</a>
</DetailIconCards>

## Resources

- [Neon GitHub Integration Documentation](/docs/guides/neon-github-integration)
- [Database Branching Workflows](https://neon.tech/flow)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

<NeedHelp/>
