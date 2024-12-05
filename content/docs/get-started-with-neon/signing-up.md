---
title: Playing with Neon
subtitle: Sign up for free and learn the basics of database branching with Neon
enableTableOfContents: true
redirectFrom:
  - /docs/quickstart/console/
  - /docs/cloud/getting-started/
  - /docs/cloud/getting_started/
  - /docs/get-started-with-neon/setting-up-a-project
updatedOn: '2024-12-03T14:32:02.187Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>How to view and modify data in the console</p>
<p>Create an isolated database copy per developer</p>
<p>Reset your branch to main when ready to start new work</p>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/introduction/branching">About branching</a>
<a href="/docs/get-started-with-neon/workflow-primer">Branching workflows</a>
<a href="/docs/get-started-with-neon/connect-neon">Connect Neon to your stack</a>
</DocsList>
</InfoBlock>

This tutorial walks you through your first steps using Neon as your Postgres database. You’ll explore the Neon object hierarchy and learn how database branching can simplify your development workflow.

## About branching

Each [branch](/docs/introduction/branching) is a fully-isolated copy of its parent. We suggest creating a long-term branch for each developer on your team to maintain consistent connection strings. You can reset your development branch to main whenever needed.

After signing up, you'll start with a `main` branch and the empty database `neondb` created during onboarding. You'll add data to the `main` branch's database and then create a new development branch off of `main`.

## Step 1 - Sign up

<div className="flex gap-5 sm:flex-col">
  <div style={{ flex: '0 0 60%' }}>

    If you're already signed up or coming to Neon from **Azure**, you can skip ahead to [Step 2](/docs/get-started-with-neon/signing-up#step-2-onboarding-in-the-neon-console).

    If you haven't signed up yet, you can sign up for free here:

    [https://console.neon.tech/signup](https://console.neon.tech/signup)

    Sign up with your email, GitHub, Google, or other partner account.

    For information about what's included with the free plan, see
    [Neon Free Plan](/docs/introduction/plans#free-plan). For information about Neon's paid options, see
    [Neon Plans](/docs/introduction/plans).

  </div>
  <div style={{ flex: '1 1 0', marginTop: '-1.25rem' }}>
    ![sign_up](/docs/get-started-with-neon/sign_up_reduced.png "no-border")
  </div>
</div>

## Step 2 - Onboarding in the Neon Console

After you sign up, you are guided through some onboarding steps that ask you to create a **Project**. After that, you are presented with the project **Quickstart**.

<div style={{ display: 'flex' }}>
  <div style={{ flex: '0 0 45%', paddingRight: '20px', marginTop: '.75em'}}>
    ![onboarding](/docs/get-started-with-neon/onboarding.png "no-border")
  </div>
  <div style={{ flex: '0 0 55%', display: 'flex', alignItems: 'center' }}>
    ![quickstart](/docs/get-started-with-neon/quickstart.png "no-border")
  </div>
</div>

The steps should be self-explanatory, but it's important to understand a few key points:

- **In Neon, everything starts with the _Project_**

  It is the top-level container that holds your branches, databases, and roles. Typically, you should create a project for each repository in your application. This allows you to manage your database branches just like you manage your code branches: a branch for production, staging, development, new features, previews, and so forth.

- **We create your default branch `main` for you**

  `main` is the default (primary) branch and hosts your database, role, and a compute that you can connect your application to.

- **Use the project _Quickstart_ or this tutorial**

  Once you complete the onboarding, you are presented with the project **Quickstart**. You can use this interactive quickstart to learn the basics &#8212; or follow along with this tutorial for a deeper explanation. You can open the **Quickstart** anytime from the project sidebar.

At this point, if you want to just get started connecting Neon to your toolchain, go to [Day 2 - Connecting Neon to your tools](/docs/get-started-with-neon/connect-neon). Or if you want a more detailed walkthrough of some of our key console and branching features, let's keep going.

## Step 3 - Add sample data

Let's get familiar with the **SQL Editor**, where you can run queries against your databases directly from the Neon Console, as well as access more advanced features like [Time Travel](/docs/guides/time-travel-assist) and [Explain and Analyze](/docs/get-started-with-neon/query-with-neon-sql-editor#explain-and-analyze).

From the Neon Console, use the sidebar navigation to open the **SQL Editor** page. Notice that your default branch `main` is already selected, along with the database created during onboarding, `neondb`.

![Neon SQL Editor](/docs/get-started-with-neon/sql_editor.png)

The first time you open the SQL Editor for a new project, the editor includes placeholder SQL commands to create and populate a new sample table called `playing_with_neon`.

For this tutorial, go ahead and create this sample table: click **Run**.

Or if you want to add the table from the command line and you already have `psql` installed:

```sql shouldWrap
CREATE TABLE IF NOT EXISTS playing_with_neon(id SERIAL PRIMARY KEY, name TEXT NOT NULL, value REAL);
INSERT INTO playing_with_neon(name, value)
  SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);
```

Your default branch `main` now has a table with some data.

## Step 4 - View and modify data in the console

Now that you have some data to play with, let's take a look at it on the **Tables** page in the Neon Console. The **Tables** page, powered by [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview), provides a visual interface for exploring and modifying data directly from the console. The integration with Drizzle Studio provides the ability to add, update, and delete records, filter data, add or remove columns, drop or truncate tables, and export data in `.json` and `.csv` formats.

![Tables page Drizzle integration](/docs/relnotes/tables_page_drizzle.png)

For a detailed guide on how to interact with your data using the **Tables** page, visit [Managing your data with interactive tables](/docs/guides/tables).

## Step 5 - Create a dedicated development branch

In this step, you'll create a dedicated development branch using the Neon CLI. This branch will be an exact, isolated copy of `main`.

Again, we recommend creating a long-lived development branch for every member of your team. This lets you work on feature development, including schema changes, in isolation from your default branch, while maintaining a stable connection string in your application. Reset your branch to `main` at the start of every new feature.

You can create and manage branches from the Neon Console, but here we'll use the Neon CLI.

1. **Install CLI with Brew or NPM**

   Depending on your system, you can install the Neon CLI using either Homebrew (for macOS) or NPM (for other platforms).

   - For macOS using Homebrew:

     ```bash
     brew install neonctl
     ```

   - Using NPM (applicable for all platforms that support Node.js):

     ```bash
     npm install -g neonctl
     ```

1. **Authenticate with Neon**

   The `neon auth` command launches a browser window where you can authorize the Neon CLI to access your Neon account.

   ```bash
   neon auth
   ```

   ![neon auth](/docs/get-started-with-neon/neonctl_auth.png 'no-border')

1. **Create your development branch**

   We recommend the naming convention `dev/developer_name` for all your development branches.

   Example:

   ```branch
   neon branches create --name dev/alex
   ```

   The command output provides details about your new branch, including the branch ID, compute ID, and the connection URI that you can use to connect to this branch's database.

There are other branch creation options available when using the CLI. See [Create a branch with the CLI](/docs/guides/branching-neon-cli#create-a-branch-with-the-cli) for more.

## Step 6 - Make some sample schema changes

With your development branch created, you can now make schema changes safely in your own environment. Since the `playing_with_neon` table is already available in the `dev/developer_name` branch, we'll modify its schema and add new data so that it deviates from `main`.

You can use the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) for this, but let's demonstrate how to connect and modify your database from the terminal using `psql`. If you don't have `psql` installed already, follow these steps to get set up:

<Tabs labels={["Mac", "Linux", "Windows"]}>

<TabItem>
```bash
brew install libpq
echo 'export PATH="/opt/homebrew/opt/libpq/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

</TabItem>

<TabItem>
```bash
sudo apt update
sudo apt install postgresql-client
```

</TabItem>

<TabItem>
Download and install PostgreSQL from:

https://www.postgresql.org/download/windows/

Ensure psql is included in the installation.
</TabItem>

</Tabs>

With `psql` available, let's work from the terminal to connect to your `dev/developer_name` branch's database and make changes.

1. **Connect to your database**

   Get the connection string to your branch and connect to it directly via `psql`:

   ```bash shouldWrap
   neon connection-string dev/developer_name --database-name neondb --psql
   ```

   This command establishes the psql terminal connection to the `neondb` database on your dev branch.

1. **Modify the schema**

   Add a new column `description` and index it:

   ```sql shouldWrap
   ALTER TABLE playing_with_neon
   ADD COLUMN description TEXT;

   CREATE INDEX idx_playing_with_neon_description ON playing_with_neon (description);
   ```

1. **Insert new data**

   Add new data that will be exclusive to the dev branch.

   ```sql shouldWrap
   INSERT INTO playing_with_neon (name, description)
   VALUES ('Your dev branch', 'Exploring schema changes in the dev branch');
   ```

1. **Verify the schema changes**

   Query the table to verify your schema changes:

   ```sql
   SELECT * FROM playing_with_neon;
   ```

   Your response should include the new description column and a new row where name = `Your dev branch` and description = `Exploring schema changes in the dev branch`:

   ```sql {1,13}
    id |        name        |    value    |                description
   ----+--------------------+-------------+--------------------------------------------
     1 | c4ca4238a0         |   0.5315024 |
     2 | c81e728d9d         |  0.17189825 |
     3 | eccbc87e4b         |  0.21428405 |
     4 | a87ff679a2         |   0.9721639 |
     5 | e4da3b7fbb         |   0.8649301 |
     6 | 1679091c5a         |  0.48413596 |
     7 | 8f14e45fce         |  0.82630277 |
     8 | c9f0f895fb         |  0.99945337 |
     9 | 45c48cce2e         | 0.054623786 |
    10 | d3d9446802         |  0.36634886 |
    11 | Your dev branch    |             | Exploring schema changes in the dev branch
   (11 rows)
   ```

## Step 7 - Check your changes with Schema Diff

After making the schema changes to your development branch, you can use the [Schema Diff](/docs/guides/schema-diff) feature to compare your branch against its parent branch. Schema Diff is a GitHub-style code-comparison tool used to visualize differences between different branch's databases.

For this tutorial, Schema Diff helps with validating isolation: it confirms that schema changes made in your isolated development branch remain separate from the main branch.

From the **Branches** page in the Neon Console:

1. Open the detailed view for your development branch (`dev/alex`) and click **Open schema diff**.
1. Verify the right branches are selected and click **Compare**. You can see the schema changes we added to our dev branch highlighted in green under Branch 2 `dev/alex`.

   ![Schema diff from branches page](/docs/get-started-with-neon/getting_started_schema_diff.png)

### Schema Migrations

A more typical scenario for Schema Diff is when preparing for schema migrations. While Neon does not provide built-in schema migration tools, you can use ORMs like [Drizzle](https://drizzle.team/) or [Prisma](https://www.prisma.io/) to handle schema migrations efficiently. Read more about using Neon in your development workflow in [Connect Neon to your stack](/docs/get-started-with-neon/connect-neon).

## Step 8 - Reset your dev branch to main

After experimenting with changes in your development branch, let's now reset the branch to `main`, its parent branch.

[Branch reset](/docs/guides/reset-from-parent) functions much like a `git reset –hard parent` in traditional Git workflows.

Resetting your development branches to your main/production branch ensures that all changes are discarded, and your branch reflects the latest stable state of `main`. This is key to maintaining a clean slate for new development tasks and is a core advantage of Neon's branching capabilities.

You can reset to parent from the **Branches** page of the Neon Console, but here we'll use the Neon CLI.

Use the following command to reset your `dev/development_name` branch to the state of the `main` branch:

    Example:
    ```bash
    neon branches reset dev/alex --parent
    ```

If you go back to your **Schema Diff** and compare branches again, you'll see they are now identical:

![schema diff after reset](/docs/get-started-with-neon/getting_started_schema_diff_reset.png)

### When to reset your branch

Depending on your development workflow, you can use branch reset:

- **After a feature is completed and merged**

  Once your changes are merged into `main`, reset the development branch to start on the next feature.

- **When you need to abandon changes**

  If a project direction changes or if experimental changes are no longer needed, resetting the branch quickly reverts to a known good state.

- **As part of your CI/CD automation**

  With the Neon CLI, you can include branch reset as an enforced part of your CI/CD automation, automatically resetting a branch when a feature is closed or started.

Make sure that your development team is always working from the latest schema and data by including branch reset in your workflow. To read more about using branching in your workflows, see [Day 3 - Branching workfows](/docs/get-started-with-neon/workflow-primer).

<NeedHelp/>
