---
title: Automated E2E Testing with Neon Branching and Playwright
subtitle: Learn how to use GitHub Actions to create isolated database branches for running Playwright tests against your schema changes
enableTableOfContents: true
author: dhanush-reddy
createdAt: '2025-09-03T00:00:00.000Z'
---

End-to-end (E2E) testing is crucial for ensuring application quality, but it becomes complex when database changes are involved. Running tests that depend on a specific schema against a shared staging environment can lead to flaky results and development bottlenecks.

Database branching solves this problem by creating isolated database environments for each feature branch, perfectly mirroring your code branching strategy. This guide demonstrates how to combine the power of Neon's instant database branching with Playwright and GitHub Actions to create a fully automated E2E testing pipeline.

You will build a Next.js Todo application and configure a workflow that, for every pull request:

- Creates a new, isolated database branch.
- Applies schema migrations to that branch.
- Builds and runs the application against the new branch.
- Executes a full suite of Playwright tests.
- Posts a schema diff summary directly in the pull request.
- Applies migrations to the main (production) branch and deletes the temporary database branch.

By the end of this guide, you'll have a CI/CD pipeline where database-dependent E2E tests are run safely and reliably for every change, giving you the confidence to ship features faster. This concept can be extended to any E2E testing framework, not just Playwright.

## Prerequisites

- A [Neon account](https://console.neon.tech)
- A [GitHub account](https://github.com/)
- Node.js installed on your machine

## Setting up your Neon database

1.  Create a new Neon project from the [Neon Console](https://console.neon.tech). For instructions, see [Create a project](/docs/manage/projects#create-a-project).
2.  Navigate to your project dashboard page and copy your database connection string by clicking the **Connect** button.

    ![Connection modal](/docs/connect/connection_details.png)

    Your connection string will look something like this:

    ```text
    postgres://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require
    ```

## Set up the project

This guide uses Playwright with Next.js, but the concepts can be easily adapted to other frameworks by following the Playwright-specific steps.

Clone the [Neon Playwright Example](https://github.com/neondatabase-labs/neon-playwright-example) repository. You will use this as a starting point for your tests. The repository contains a simple Todo app built with Next.js and TypeScript using Drizzle ORM. It has Playwright tests set up.

1. Run the following commands to clone the repository and install dependencies:

   ```bash
   git clone https://github.com/neondatabase-labs/neon-playwright-example
   cd neon-playwright-example
   npm install
   cp .env.example .env
   ```

2. Populate the `.env` file with your Neon database connection details.

3. Apply the necessary migrations to your database:

   ```bash
   npm run db:migrate
   ```

4. Check the todo app works by running:

   ```bash
   npm run dev
   ```

   Open [localhost:3000](http://localhost:3000) in your browser to see the app. Verify the basic functionality of the todo app.

5. Check that the Playwright tests work by running:

   ```bash
   npm run test:e2e -- --headed
   ```

   You should see Chromium, Firefox, and WebKit browsers launching and running your tests.

6. Push your code to a new GitHub repository.

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

   Now that you have your code pushed to GitHub, you can set up the Neon GitHub integration.

## Set up the Neon GitHub integration

The [Neon GitHub integration](/docs/guides/neon-github-integration) securely connects your Neon project to your repository. It automatically creates a `NEON_API_KEY` secret and a `NEON_PROJECT_ID` variable in your repository, which are required for your GitHub Actions workflow.

1.  In the Neon Console, navigate to the **Integrations** page for your project.
2.  Locate the **GitHub** card and click **Add**.
    ![GitHub App card](/docs/guides/github_card.png)
3.  On the **GitHub** drawer, click **Install GitHub App**.
4.  If you have more than one GitHub account, select the account where you want to install the GitHub app.
5.  Select the GitHub repository to connect to your Neon project, and click **Connect**.
6.  **Add Production Database Secret**:
    - Navigate to your GitHub repository's **Settings** > **Secrets and variables** > **Actions**.
    - Create a new repository secret called `DATABASE_URL`.
    - Paste the connection string for your `production` branch (copied from the Neon Console).
    - Note that the `NEON_API_KEY` secret and `NEON_PROJECT_ID` variable should already be available from the GitHub integration setup.

    <Admonition type="note">
    It's important to understand the roles of your GitHub secrets. The `NEON_API_KEY` (created by the integration) is used to manage your Neon project, like creating and deleting branches. The `DATABASE_URL` secret you just created points exclusively to your production database branch. The workflow uses this only after a PR is successfully merged to apply migrations, ensuring a safe separation from the ephemeral preview databases used during testing.
    </Admonition>

## Understanding the workflow

Open the `.github/workflows/playwright.yml` file in your repository.
This workflow automates the entire testing lifecycle for each pull request.

```yaml
name: Playwright Tests
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
    name: Create Neon Branch and Run Tests
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

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Generate drizzle migrations
        run: npm run db:generate

      - name: Apply drizzle migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: '${{ steps.create_neon_branch.outputs.db_url_pooled }}'

      - name: Build Next.js app
        run: npm run build
        env:
          NODE_ENV: production
          DATABASE_URL: '${{ steps.create_neon_branch.outputs.db_url_pooled }}'

      - name: Start Next.js app
        run: npm start &
        env:
          NODE_ENV: production
          DATABASE_URL: '${{ steps.create_neon_branch.outputs.db_url_pooled }}'

      - name: Wait for app to be ready
        run: |
          timeout 60 bash -c 'until curl -f http://localhost:3000 > /dev/null 2>&1; do sleep 1; done'

      - name: Run Playwright tests
        run: npm run test:e2e

      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
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
To set up GitHub Actions correctly, go to your repository's GitHub Actions settings, navigate to **Actions** > **General**, and set **Workflow permissions** to **Read and write permissions**.
</Admonition>

<Admonition type="tip">
The step outputs from the `create_neon_branch` action will only be available within the same job (`create_neon_branch_and_run_tests`). Therefore, write all test code, migrations, and related steps in that job itself. The outputs are marked as secrets. If you need separate jobs, refer to [GitHub's documentation on workflow commands](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#workflow) for patterns on how to handle this.
</Admonition>

The workflow consists of three jobs:

- **Setup job**: Retrieves the current branch name for naming the Neon database branch.
- **Create branch & test job**: Creates a Neon database branch and runs Playwright tests whenever a pull request is opened or updated.
- **Cleanup job**: Cleans up resources after the pull request is closed.

### Create branch & test job

This job runs when a pull request is opened, reopened, or synchronized:

1. **Branch creation**:
   - Uses Neon's [`create-branch-action`](https://github.com/marketplace/actions/neon-create-branch-github-action) to create a new database branch
   - Names the branch using the pattern `preview/pr-{number}-{branch_name}`
   - Inherits the schema and data from the parent branch

2. **Migration handling**:
   - Installs project dependencies
   - Generates migration files using Drizzle
   - Applies migrations to the newly created branch
   - Uses the branch-specific `DATABASE_URL` for migration operations

3. **Application build and start**:
   - Builds the Next.js application in production mode
   - Starts the application, connecting it to the new database branch

4. **Playwright test execution**:
   - Installs Playwright browsers
   - Runs the full suite of Playwright tests against the live application
   - Uploads the Playwright report as an artifact for later review

5. **Schema diff generation**:
   - Uses Neon's [`schema-diff-action`](https://github.com/marketplace/actions/neon-schema-diff-github-action)
   - Compares the schema of the new branch with the parent branch
   - Automatically posts the differences as a comment on the pull request
   - Helps reviewers understand database changes at a glance

### Cleanup job

1. **Production migration**:
   - If the PR is merged, applies migrations to the production database
   - Uses the main `DATABASE_URL` stored in repository secrets
   - Ensures production database stays in sync with merged changes

2. **Cleanup**:
   - Removes the preview branch using Neon's [`delete-branch-action`](https://github.com/marketplace/actions/neon-database-delete-branch)

## Test the workflow

You can test the entire pipeline by making a schema change, updating the UI, and adding a new Playwright test to validate it.

1.  Create a new feature branch in your local repository:

    ```bash
    git checkout -b feature/add-created-at
    ```

2.  Modify the database schema in `app/db/schema.ts` to include a `created_at` timestamp:

    ```typescript {1,7}
    import { pgTable, text, bigint, boolean, timestamp } from 'drizzle-orm/pg-core';

    export const todos = pgTable('todos', {
      id: bigint('id', { mode: 'bigint' }).primaryKey().generatedByDefaultAsIdentity(),
      task: text('task').notNull(),
      isComplete: boolean('is_complete').notNull().default(false),
      createdAt: timestamp('created_at').notNull().defaultNow(),
    });
    ```

3.  Update the UI component in `app/todos.tsx` to display the new timestamp:

    ```tsx {6,13}
    // app/todos.tsx
    type Todo = {
      id: bigint;
      task: string;
      isComplete: boolean;
      createdAt: Date;
    };

    // ... inside the TodoList component's map function
    <li key={todo.id.toString()} className="flex items-center justify-between border-b py-2">
      <div>
        <span className={todo.isComplete ? 'text-gray-400 line-through' : ''}>{todo.task}</span>
        <p className="text-gray-500 text-xs">Created: {todo.createdAt.toLocaleDateString()}</p>
      </div>

      <div className="flex gap-2">{/* ... forms for toggle and delete */}</div>
    </li>;
    ```

4.  Add a new Playwright test in `tests/todos.spec.ts` to verify that the timestamp is displayed:

    ```typescript
    // tests/todos.spec.ts
    // ... inside the "Todo App" describe block
    test('should display created at timestamp for a new todo', async ({ page }) => {
      const todoText = 'Check the timestamp';
      await page.locator('input[name="task"]').fill(todoText);
      await page.locator('button:has-text("Add")').click();

      // Check that the todo text is visible
      await expect(page.locator(`text=${todoText}`)).toBeVisible();

      // Check that the "Created:" text is visible
      const expectedDate = new Date().toLocaleDateString();
      await expect(page.locator(`text=Created: ${expectedDate}`)).toBeVisible();
    });
    ```

5.  Commit your changes and push the branch to GitHub:

    ```bash
    git add .
    git commit -m "feat: add and display created_at timestamp for todos"
    git push origin feature/add-created-at
    ```

6.  Open a pull request on GitHub.

Once the PR is opened, the GitHub Actions workflow will trigger. You can watch as it creates a new database branch, runs migrations, starts your app, and successfully runs the Playwright tests including the new one you just added. The workflow will post a schema diff comment on the PR, and once merged, it will apply the changes to your production database and clean up the preview branch.

The pull request should now show a comment summarizing the schema changes:
![Schema Diff Comment](/docs/guides/e2e-tests-schema-diff-comment-github-actions.png)

## Source code

You can find the complete source code for this example on GitHub.

<DetailIconCards>
<a href="https://github.com/neondatabase-labs/neon-playwright-example" description="Get started with automated E2E testing using Neon, Playwright, and GitHub Actions" icon="github">Neon Branching with E2E Playwright tests example</a>
</DetailIconCards>

## Conclusion

You have seen how to create isolated database branches for running Playwright tests, ensuring reliable and consistent E2E testing. This approach can be easily adapted to any other E2E testing framework, such as Cypress or Selenium, by modifying the test execution steps in the GitHub Actions workflow while keeping the Neon branching logic intact.

## Resources

- [Neon Database Branching](/branching)
- [Neon GitHub Integration](/docs/guides/neon-github-integration)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Automated E2E Testing with Neon Branching and Cypress](/guides/e2e-cypress-tests-with-neon-branching)

<NeedHelp/>
