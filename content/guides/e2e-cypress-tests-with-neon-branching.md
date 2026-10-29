---
title: Automated E2E testing with Neon branching and Cypress
subtitle: Learn how to use GitHub Actions to create isolated database branches for running Cypress tests against your schema changes
enableTableOfContents: true
author: dhanush-reddy
createdAt: '2025-10-17T00:00:00.000Z'
---

Running end-to-end (E2E) tests gets harder when the database schema changes frequently. Tests that rely on a specific schema can fail or produce inconsistent results when they run against a shared database, and the team ends up waiting on each other.

[Neon's database branching](/branching) gives each feature branch its own isolated database, similar to how Git manages code branches. This guide shows you how to integrate Neon's database branching with Cypress and GitHub Actions to build an automated testing pipeline.

You will use a Next.js Todo application to configure a workflow that triggers on every pull request. This workflow will:

- Create a new, isolated database branch from your main branch.
- Run schema migrations on the new database branch.
- Build the application and connect it to the new branch.
- Execute the Cypress test suite against the running application.
- Post a summary of schema changes to the pull request.
- Record test results, uploading screenshots and videos as artifacts in GitHub for any failures.
- On merge, apply migrations to the main (production) branch and delete the temporary database branch.

Every proposed change gets its database-dependent E2E tests run against a clean, predictable database.

## Prerequisites

- A [Neon account](https://console.neon.tech)
- A [GitHub account](https://github.com/)
- Node.js installed locally on your machine

## Setting up your Neon database

1.  Create a new Neon project from the [Neon Console](https://console.neon.tech). For instructions, see [Create a project](/docs/manage/projects#create-a-project).
2.  Click **Connect** on your project dashboard to open the **Connect to your branch** modal, and copy your database connection string.

    ![Connection modal](/docs/connect/connect_to_branch_modal.png)

    Your connection string will look something like this:

    ```text
    postgres://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require
    ```

## Set up the project

This guide uses a Next.js application with Cypress, but the core principles of database branching can be applied to other technology stacks and testing frameworks.

We'll start with a pre-configured example repository that includes a simple Todo app, a Drizzle ORM schema, and a Cypress test suite.

1.  Clone the repository and install its dependencies:

    ```bash
    git clone https://github.com/dhanushreddy291/neon-cypress-example
    cd neon-cypress-example
    npm install
    cp .env.example .env
    ```

2.  Open the `.env` file and add the Neon database connection string you copied earlier.

3.  Apply the initial schema migrations to your production database branch:

    ```bash
    npm run db:migrate
    ```

4.  Start the development server to verify the application is working:

    ```bash
    npm run dev
    ```

5.  In a new terminal, run the Cypress tests locally to confirm they pass (ensure the Next.js development server is still running):

    ```bash
    npm run cypress:open
    ```

    This command opens the Cypress Test Runner. Select **E2E Testing**, choose a browser, and click the `todos.cy.ts` file to execute the test suite.

    ![Cypress Test Runner](/docs/guides/cypress_test_runner.png)

    > Select **E2E Testing**

    ![Cypress Select Browser](/docs/guides/cypress_select_browser.png)

    > Choose a browser: (e.g., Chrome)

    ![Cypress E2E specs](/docs/guides/cypress_e2e_specs.png)

    > Click the `todos.cy.ts` file to run the tests.

    ![Cypress Test Results](/docs/guides/cypress_test_results.png)

    > All tests should pass successfully.

6.  Initialize a new Git repository and push your code to GitHub:

    > For instructions on creating a new repository on GitHub, see [Creating a new repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository).

    ```bash
    rm -rf .git
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin <YOUR_GITHUB_REPO_URL>
    git push -u origin main
    ```

    With the project code on GitHub, you can now connect it to your Neon project.

## Set up the Neon GitHub integration

The [Neon GitHub integration](/docs/guides/neon-github-integration) connects your Neon project to your repository. It automatically creates a `NEON_API_KEY` secret and a `NEON_PROJECT_ID` variable in your repository, which are required for your GitHub Actions workflow.

1.  In the Neon Console, navigate to the **Integrations** page for your project.
2.  Locate the **GitHub** card and click **Add**.
    ![GitHub App card](/docs/guides/github_card.png)
3.  On the **GitHub** drawer, click **Install GitHub App**.
4.  If you have more than one GitHub account, select the account where you want to install the GitHub app.
5.  Select the GitHub repository to connect to your Neon project, and click **Connect**.
6.  **Add a production database secret**:
    - Navigate to your GitHub repository's **Settings** > **Secrets and variables** > **Actions**.
    - Create a new repository secret called `DATABASE_URL`.
    - Paste the connection string for your `production` branch (copied from the Neon Console).
    - Note that the `NEON_API_KEY` secret and `NEON_PROJECT_ID` variable should already be available from the GitHub integration setup.

    <Admonition type="note">
    The `NEON_API_KEY` secret (created by the integration) manages your Neon project, for example creating and deleting branches. The `DATABASE_URL` secret you just created points only to your production database branch. The workflow uses it only after a PR is merged to apply migrations, which keeps production separate from the ephemeral preview databases used during testing.
    </Admonition>

## Understanding the workflow

The repository includes a GitHub Actions workflow file at `.github/workflows/cypress.yml`. This file automates the entire testing lifecycle for each pull request.

```yaml
name: Cypress Tests

on:
  pull_request:
    branches: [main]
    types:
      - opened
      - reopened
      - synchronize
      - closed

# Ensures only the latest commit runs, preventing race conditions in concurrent PR updates
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}

jobs:
  setup:
    name: Setup
    timeout-minutes: 1
    runs-on: ubuntu-latest
    outputs:
      branch: ${{ steps.branch_name.outputs.current_branch }}
    steps:
      - name: Get branch name
        id: branch_name
        uses: tj-actions/branch-names@v8

  create_neon_branch_and_run_tests:
    name: Create Neon Branch and Run Cypress Tests
    needs: setup
    permissions:
      contents: read
      pull-requests: write
    if: |
      github.event_name == 'pull_request' && (
      github.event.action == 'synchronize' || github.event.action == 'opened' || github.event.action == 'reopened')
    runs-on: ubuntu-latest
    steps:
      - name: Create Neon Branch
        id: create_neon_branch
        uses: neondatabase/create-branch-action@v6
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          branch_name: preview/pr-${{ github.event.number }}-${{ needs.setup.outputs.branch }}
          api_key: ${{ secrets.NEON_API_KEY }}
          role: neondb_owner

      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*

      - name: Install dependencies
        run: npm ci

      - name: Generate drizzle migrations
        run: npm run db:generate

      - name: Apply drizzle migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: '${{ steps.create_neon_branch.outputs.db_url_pooled }}'

      - name: Run Cypress tests
        uses: cypress-io/github-action@v6
        with:
          build: npm run build
          start: npm start
          browser: chrome
        env:
          NODE_ENV: production
          DATABASE_URL: '${{ steps.create_neon_branch.outputs.db_url_pooled }}'

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
          retention-days: 7

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: cypress-videos
          path: cypress/videos
          retention-days: 30

      - name: Post Schema Diff Comment to PR
        uses: neondatabase/schema-diff-action@v1
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          compare_branch: preview/pr-${{ github.event.number }}-${{ needs.setup.outputs.branch }}
          api_key: ${{ secrets.NEON_API_KEY }}

  delete_neon_branch:
    name: Delete Neon Branch and Apply Migrations on Production branch
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
        if: github.event.pull_request.merged == true
        uses: actions/checkout@v4

      - name: Apply migrations to production
        if: github.event.pull_request.merged == true
        run: |
          npm install
          npm run db:generate
          npm run db:migrate
        env:
          DATABASE_URL: '${{ secrets.DATABASE_URL }}'
```

<Admonition type="note" title="Note">
For the workflow to have the necessary access, go to your repository's **Settings** > **Actions** > **General** and set **Workflow permissions** to **Read and write permissions**.
</Admonition>

<Admonition type="tip">
The step outputs from the `create_neon_branch` action will only be available within the same job (`create_neon_branch_and_run_tests`). Therefore, write all test code, migrations, and related steps in that job itself. The outputs are marked as secrets. If you need separate jobs, refer to [GitHub's documentation on workflow commands](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#workflow) for patterns on how to handle this.
</Admonition>

The workflow is divided into three jobs:

- **Setup**: Gets the current Git branch name to use in naming the Neon database branch.
- **Create branch & test**: This job runs when a pull request is opened or updated. It creates a database branch, runs migrations, and executes the Cypress tests.
- **Cleanup**: This job runs when the pull request is closed. It deletes the temporary database branch and applies migrations to production branch if the PR was merged.

### Create branch & test job

1.  **Branch creation**: Uses Neon's `create-branch-action` to create a database branch named `preview/pr-{number}-{branch_name}`, which starts with the schema and data of your project's default branch.
2.  **Migrations**: Installs dependencies and runs schema migrations against the new branch, using the branch's pooled connection string (`db_url_pooled`) from the `create-branch-action` output.
3.  **Cypress test execution**: The official `cypress-io/github-action` builds the Next.js app with `npm run build`, starts it with `npm start` against the new branch, and runs the tests. If the tests start before the server responds, add the action's `wait-on` input (for example, `wait-on: 'http://localhost:3000'`). Videos of the test runs are always uploaded as artifacts, and screenshots are uploaded if any tests fail.
4.  **Schema diff**: Neon's `schema-diff-action` compares the schema of the preview branch against the parent branch and posts a summary comment to the pull request, so reviewers can see the database changes.

### Cleanup job

1.  **Branch deletion**: When the pull request is closed, the `delete-branch-action` removes the temporary database branch to free up resources.
2.  **Apply migrations to production**: If the pull request was merged, the job checks out the code and applies any new migrations to the production database branch using the `DATABASE_URL` secret.

## Test the workflow

To see the pipeline in action, you can introduce a schema change, update the application's UI, and add a new test.

1.  Create a new feature branch in your local repository:

    ```bash
    git checkout -b feature/add-created-at
    ```

2.  Modify the database schema in `app/db/schema.ts` by adding a `created_at` column:

    ```typescript {1,7}
    import { pgTable, text, bigint, boolean, timestamp } from 'drizzle-orm/pg-core';

    export const todos = pgTable('todos', {
      id: bigint('id', { mode: 'bigint' }).primaryKey().generatedByDefaultAsIdentity(),
      task: text('task').notNull(),
      isComplete: boolean('is_complete').notNull().default(false),
      createdAt: timestamp('created_at').notNull().defaultNow(),
    });

    export type Todo = typeof todos.$inferSelect;
    ```

3.  Update the UI component in `app/todos.tsx` to display the new timestamp:

    ```tsx {6,13}
    // app/todos.tsx
    // ... inside the TodoList component's map function
    <li key={todo.id.toString()} className="flex items-center justify-between border-b py-2">
      <div>
        <span className={todo.isComplete ? 'text-gray-400 line-through' : ''}>{todo.task}</span>
        <p className="text-gray-500 text-xs">Created: {todo.createdAt.toLocaleDateString()}</p>
      </div>
      <div className="flex gap-2">{/* ... forms for toggle and delete */}</div>
    </li>
    ```

4.  Add a new Cypress test in `cypress/e2e/todos.cy.ts` to verify the timestamp is displayed correctly:

    ```typescript
    // cypress/e2e/todos.cy.ts
    // ... inside the "Todo App" describe block
    it('should display a creation timestamp for a new todo', () => {
      const todoText = 'Check the timestamp';
      cy.get('input[name="task"]').type(todoText);
      cy.contains('button', 'Add').click();

      // Check that the todo text is visible
      cy.contains(todoText).should('be.visible');

      // Verify the creation date is displayed
      const expectedDate = new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
      cy.contains(`Created: ${expectedDate}`).should('be.visible');
    });
    ```

5.  Commit your changes and push the branch to GitHub:

    ```bash
    git add .
    git commit -m "feat: add and display created_at timestamp for todos"
    git push origin feature/add-created-at
    ```

6.  Open a pull request on GitHub.

When the pull request is opened, the GitHub Action will start automatically. You can monitor its progress in the "Actions" tab. The workflow will create a database branch, run tests, and post a schema diff. Once merged, it will update your production database and clean up the temporary resources.

The pull request should now show a comment summarizing the schema changes:
![Schema Diff Comment](/docs/guides/e2e-tests-schema-diff-comment-github-actions.png)

GitHub Actions also uploads Cypress test artifacts. Videos are recorded for every test run, while screenshots are uploaded only if tests fail. You can download these from the Actions tab to help diagnose issues.

![Cypress Artifacts](/docs/guides/cypress_test_artifacts_github_actions.png)

## Source code

The complete source code for this example is available on GitHub.

<DetailIconCards>
<a href="https://github.com/dhanushreddy291/neon-cypress-example" description="An example project for integrating Neon branching with Cypress and GitHub Actions for E2E testing." icon="github">Neon branching with Cypress example</a>
</DetailIconCards>

## Conclusion

You configured a CI/CD pipeline that uses Neon branching to create an isolated database for each pull request's Cypress tests, so tests for new features run against the correct schema without touching a shared staging environment.

You can extend the same pattern to [Cypress component tests](https://docs.cypress.io/app/component-testing/get-started) for components that fetch their own data, or to other E2E frameworks such as Playwright or Selenium by changing the test execution steps and keeping the Neon branching steps as they are.

## Resources

- [Neon database branching](/branching)
- [Neon GitHub integration](/docs/guides/neon-github-integration)
- [Cypress documentation](https://docs.cypress.io/)
- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [Automated E2E testing with Neon branching and Playwright](/guides/e2e-playwright-tests-with-neon-branching)
- [Cypress GitHub Action](https://github.com/marketplace/actions/cypress-io)

<NeedHelp/>
