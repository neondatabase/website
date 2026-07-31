---
title: 'Simplify Serverless in AWS: How to Use Neon and Ephemeral Environments'
description: A step-by-step guide
excerpt: >-
  “Ephemeral environments” refers to the ability to create short-lived copies of
  your system so that: It’s a powerful practice and works great with services
  that charge on a pay-per-use basis. There is no extra charge for these
  environments – it’s only the activities that count. Ho...
date: '2025-05-05T16:53:04'
updatedOn: '2025-05-05T16:53:08'
category: product
categories:
  - product
authors:
  - yan-cui
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/ephemeral-environments-aws-serverless/cover.png
  alt: null
isFeatured: true
seo:
  title: >-
    Simplify Serverless in AWS: How to Use Neon and Ephemeral Environments -
    Neon
  description: >-
    A step-by-step guide for using Neon with ephemeral environments in AWS.
    Guest blog post by Yan Cui (AWS Serverless Hero).
  keywords: []
  noindex: false
  ogTitle: >-
    Simplify Serverless in AWS: How to Use Neon and Ephemeral Environments -
    Neon
  ogDescription: >-
    A step-by-step guide for using Neon with ephemeral environments in AWS.
    Guest blog post by Yan Cui (AWS Serverless Hero).
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/ephemeral-environments-aws-serverless/cover.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/ephemeral-environments-aws-serverless/screenshot-2025-05-02-at-55701percente2percent80percentafpm-1024x577-974eb96c.png)

<Admonition type="info">
This blog post was originally published in [TheBurningMonk.com](https://theburningmonk.com/2025/04/how-to-use-neon-and-ephemeral-environments-to-simplify-serverless-development/).
</Admonition>

“Ephemeral environments” refers to the ability to create short-lived copies of your system so that:

- Developers can work in their isolated environments and make changes without affecting others.
- Test data does not pollute shared environments such as dev and staging.
- Once a feature is complete, the ephemeral environment can be safely torn down.

It’s a powerful practice and works great with services that charge on a pay-per-use basis. There is no extra charge for these environments – it’s only the activities that count.

However, services that charge by uptime (aka “_serverful_”), such as Amazon RDS, present a logistical problem – your uptime cost increases with the number of environments.

To mitigate the extra uptime cost, you can [share the same RDS cluster across multiple environments](https://theburningmonk.com/2023/02/how-to-handle-serverful-resources-when-using-ephemeral-environments/). But this adds friction to the development workflow and complicates deployment:

- The RDS cluster must be deployed separately, so you can no longer review and update the whole system as a single unit.
- You need scripts to create and delete environment-specific databases or schemas.

Fortunately, [Neon Serverless Postgres](https://neon.tech/?ref=tbm-blog) solves these problems.

In this article, we will explore how Neon works, and I will provide a step-by-step guide for using Neon with ephemeral environments.

## What is Neon?

Neon is a serverless database platform built around PostgreSQL.

It separates storage and compute, and you pay only for the processing power you use. On paper, it’s similar to Aurora Serverless v2 in many ways, but there are some notable differences.

### Scaling & Cold Starts

Both can scale to zero during inactivity. But Neon scales much faster than Aurora Serverless v2, which takes a slower and more conservative approach.

Neon also cold starts from zero in 500ms vs. 15s for Aurora Serverless v2. This is important for development and ephemeral environments, where there are often long gaps between bursts of database activities.

### Connection Pooling & Data API

Neon integrates PgBouncer directly into its architecture, enabling it to handle up to **10,000 concurrent connections** and queue requests during spikes, rather than rejecting them.

Aurora Serverless v2 calculates the max connections based on ACU. Serverless applications often create many short-lived connections as Lambda execution environments are created and destroyed. This can cause connection pool exhaustion, which is why many serverless applications would use RDS Proxy to scale the number of concurrent connections or switch to Aurora Serverless v2’s Data API.

Neon also has a data API that allows you to execute queries over HTTP or WebSockets. You can use the data API via Neon’s [serverless driver](https://neon.tech/docs/serverless/serverless-driver?ref=tbm-blog).

### Data Branching

Because Neon separates storage from compute, you can easily create a copy of an existing database by branching from it. Think Git branching but for your data!

This works great with ephemeral environments.

Want to run some tests without polluting your database? Create a branch for the tests and delete it afterwards.

Want to let multiple developers work on the same codebase simultaneously? Create a branch for each so they don’t step on each other’s toes.

Every ephemeral environment can have its own branch of your development database.

If you need to seed the database first, then seed the data in the development database and every branch will inherit the seed data.

Importantly, branching a Neon database is **instant**! Which is important for automation and developer productivity.

By default, branching a database copies both the data and schema. But Neon also supports schema-only branching as well, in case you don’t want any seed data and want to start from a clean slate.

## Using Neon with Ephemeral Environments

Let’s use a simple TODO API to demonstrate how to use Neon and how to use it with ephemeral environments. You can find all the relevant source code [here](https://github.com/theburningmonk/ephemeral-env-with-neon).

### Create the todos database

First, sign up for an account with Neon at [neon.tech](https://neon.tech/) and create a new project. Let’s call the database “**todos**”.

![Image](https://cdn.neonapi.io/public/images/pages/blog/ephemeral-environments-aws-serverless/image-318e722e.png)

By default, this creates a `production` and `development` branch of the new `todos` database. Notice that the `development` branch has less compute power and is not intended for production use or load testing.

![Image](https://cdn.neonapi.io/public/images/pages/blog/ephemeral-environments-aws-serverless/image-1-2a1ca2f0.png)

### Seeding the todos database

In the demo code, there is a [SQL script](https://github.com/theburningmonk/ephemeral-env-with-neon/blob/main/migrations/001_create_todos_table.sql) for creating a “todos” table.

```sql
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 
```

You can run this script directly in the Neon console.

Go to the “**SQL Editor**”, select the `development` branch, and click `Run` to execute the script.

![Image](https://cdn.neonapi.io/public/images/pages/blog/ephemeral-environments-aws-serverless/screenshot-2025-05-02-at-61318percente2percent80percentafpm-1024x590-eb9b161f.png)

You can also save frequently used scripts.

Now that you have created a new `todos` table, you can also look at the data directly in the Neon console.

Go to “Tables” and select the `development` branch.

![Image](https://cdn.neonapi.io/public/images/pages/blog/ephemeral-environments-aws-serverless/image-3-cbf4c0e1.png)

Currently, there is no data. However, you can use the “**Add record**” button to add a row directly in the console.

![Image](https://cdn.neonapi.io/public/images/pages/blog/ephemeral-environments-aws-serverless/image-4-72378cdc.png)

There is a lot more you can do in the Neon console. For example,

- See the schema differences between this branch and its parent (think `git diff`).
- Reset a branch and update it to the latest schema and data from its parent (think `git reset`).
- Create read replicas.

### Connecting to the todos database

To connect to the database, select the branch you want, and click `Connect`.

![Image](https://cdn.neonapi.io/public/images/pages/blog/ephemeral-environments-aws-serverless/image-5-44290e57.png)

Copy the connection string from the pop-up.

![Image](https://cdn.neonapi.io/public/images/pages/blog/ephemeral-environments-aws-serverless/image-6-b70b4a53.png)

### The TODO API architecture

This is the high-level architecture of the TODO API, where a different Lambda function handles each CRUD operation.

![Image](https://cdn.neonapi.io/public/images/pages/blog/ephemeral-environments-aws-serverless/image-7-67b311ee.png)

Everything is configured with the [Serverless Framework](https://serverless.com/) and deployed as a single unit.

As shown below, each function has its own handler module. Shared code between the functions is kept in the same project folder.

![Image](https://cdn.neonapi.io/public/images/pages/blog/ephemeral-environments-aws-serverless/image-8-663357c7.png)

The API path for each function is configured as follows.

```javascript
createTodo:
  handler: functions/createTodo.handler
  events:
    - http:
        path: /todos
        method: post
        cors: true
```

During deployment, the Serverless Framework will look for an environment variable called `DATABASE_URL` and use it to populate an environment variable of the same name for each Lambda function.

```javascript
environment:
  DATABASE_URL: ${env:DATABASE_URL}
```

This way, our code can use the `DATABASE_URL` environment variable to initialise the [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver?ref=tbm-blog) at runtime, like this.

```javascript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
```

### Understanding the Neon serverless driver

Take a look at the `lib/todos.js` module.

Notice that we’re using the `sql` template tag to execute queries (against Neon’s data API) written as a string literal, like this:

```javascript
import { neon } from '@neondatabase/serverless';
import { v4 as uuidv4 } from 'uuid';

const sql = neon(process.env.DATABASE_URL);

export const createTodo = async (title, description) => {
  const id = uuidv4();
  const result = await sql`INSERT INTO todos (id, title, description, completed, created_at)
      VALUES (${id}, ${title}, ${description}, ${false}, ${new Date().toISOString()})
      RETURNING *`;

  return result[0];
};
```

Your immediate reaction might be “This is vulnerable to SQL injection attacks!”. But rest assured, the `sql` template tag is inherently safe from SQL injection attacks.

It’s written as a JavaScript tag function, which receives the string literal and its values as separate parameters. Internally, the `sql` template tag converts these into a SQL template with separate parameters.

It’s a really nice feature and helps keep your code clean and safe at the same time. If you want to learn more about how this works, then read [this article](https://neon.tech/blog/sql-template-tags?ref=tbm-blog) for more details.

One thing to note, however, is that this only works if you use the `sql` template tag with a string literal directly! The following will not work because the `sql` tag function is called with a string, not a string literal.

```javascript
export const execute = async (query) => {
  return await sql query;
};

export const createTodo = async (title, description) => {
  const id = uuidv4();
  const result = await execute(`INSERT INTO todos (id, title, description, completed, created_at)
      VALUES (${id}, ${title}, ${description}, ${false}, ${new Date().toISOString()})
      RETURNING *`);

  return result[0];
};
```

### Handling dynamic queries

Ok, but what if you need to construct the query dynamically?

For example, in the `updateTodo` function, we only want to update a field if the caller provides a new value. We would need to construct the SQL query dynamically based on the user’s request.

The Neon serverless driver also has a `query` function for these cases.

It takes a query string with embedded `$1`, `$2` (etc.) placeholders, followed by an array of query parameters. So you can build up the SQL query string dynamically, like this:

```javascript
export const updateTodo = async (id, title, description, completed) => {
  const updates = [];
  const values = [];
  let paramCount = 1;

  if (title!== undefined) {
    updates.push(`title = $${paramCount}`);
    values.push(title);
    paramCount++;
  }

  if (description!== undefined) {
    updates.push(`description = $${paramCount}`);
    values.push(description);
    paramCount++;
  }

  if (completed!== undefined) {
    updates.push(`completed = $${paramCount}`);
    values.push(completed);
    paramCount++;
  }

  values.push(id);

  const result = await sql.query(`UPDATE todos 
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *`, values);

  if (result.length === 0) {
    return null;
  }

  return result[0];
};
```

Ok, so that’s the code, what about the ephemeral environments?

### Creating & deleting ephemeral environments

You can create a new branch of your database every time you create an ephemeral environment for your application.

You can use the Neon console to create and delete branches. But we want to automate this process to eliminate manual steps.

Fortunately, you can use the [Neon API SDK](https://neon.tech/docs/reference/typescript-sdk?ref=tbm-blog) to accomplish this. The [demo repo](https://github.com/theburningmonk/ephemeral-env-with-neon) contains examples of this – have a look in the [scripts folder](https://github.com/theburningmonk/ephemeral-env-with-neon/tree/main/scripts).

Your workflow might look like this:

1. Branch your source code to start work on a new feature called `tbm-042`.
2. Run `node scripts/create-branch development tbm-042` to create a new branch called `tbm-042`. The script outputs the connection URL for the new branch. Capture this in an environment variable called `DATABASE_URL`. This is the environment variable that the Serverless Framework will look for in the next step.
3. Run `npx serverless deploy -s tbm-042` to create a new ephemeral environment (also called `tbm-042`) for your application.
4. Iterate on the code and run tests against the database branch. You can find some example tests in the `tests` folder of the demo code.
5. Create a PR with your changes.
6. Run `npx serverless remove -s tbm-042` to delete the ephemeral environment.
7. Run `node scripts/delete-branch.cjs tbm-042` to delete the `tbm-042` branch in Neon.

### Using ephemeral environments in CI/CD pipelines

Another common use case for ephemeral environments is in CI/CD pipelines. This ensures that tests are run against a clean, well-defined initial system state and avoids polluting shared environments with test data.

Neon also offers [several GitHub Actions](https://neon.tech/docs/guides/branching-github-actions) to help you automate the creation and deletion of branches.

In the demo app, you can see an [example workflow](https://github.com/theburningmonk/ephemeral-env-with-neon/blob/main/.github/workflows/dev.yaml) that:

1. Create a branch off the latest in the `development` branch.
2. Runs unit tests against the newly created database branch.
3. Create an ephemeral environment for the TODO API and point it to the new database branch. _The_ [serverless-export-outputs](https://www.npmjs.com/package/serverless-export-outputs) _plugin captures the_ `ServiceEndpoint` _stack output in a_`.env` _file._
4. Runs end-to-end tests against the ephemeral environment. _These tests use the_`.env` _file to find out where the deployed API is._
5. Deletes both the ephemeral environment and the database branch.
6. Deploy the application changes to the dev environment.

Again, creating and deleting database branches is instant (see below). It helps to keep the pipeline feeling fast and snappy despite doing quite a lot of things!

![Image](https://cdn.neonapi.io/public/images/pages/blog/ephemeral-environments-aws-serverless/image-9-01ebd6d0.png)

Here are the relevant steps for reference.

```yaml
- name: create Neon branch
  id: create-branch
  uses: neondatabase/create-branch-action@v6
  with:
    project_id: ${{ secrets.NEON_PROJECT_ID }}
    api_key: ${{ secrets.NEON_API_KEY }}
    # name of the parent branch
    parent_branch: development
    # name of the new branch
    branch_name: gh-${{ github.sha }}
    database: todos
    role: todos_owner
  
- name: npm ci
  run: npm ci

- name: run unit tests
  run: npm run test:unit
  env:
    DATABASE_URL: ${{ steps.create-branch.outputs.db_url }}
  
- name: deploy to ephemeral environment
  id: deploy-sls
  run: npx serverless deploy --stage dev-gh-actions
  env:
    DATABASE_URL: ${{ steps.create-branch.outputs.db_url }}
    SERVERLESS_ACCESS_KEY: ${{ secrets.SERVERLESS_ACCESS_KEY }}
  
- name: run e2e tests
  run: npm run test:e2e
  env:
    DATABASE_URL: ${{ steps.create-branch.outputs.db_url }}
  
- name: delete ephemeral environment
  if: ${{ always() && steps.deploy-sls.outcome == 'success' }}
  run: npx serverless remove --stage dev-gh-actions
  env:
    DATABASE_URL: ${{ steps.create-branch.outputs.db_url }}
    SERVERLESS_ACCESS_KEY: ${{ secrets.SERVERLESS_ACCESS_KEY }}
  
- name: delete Neon branch
  if: ${{ always() && steps.create-branch.outcome == 'success' }}
  uses: neondatabase/delete-branch-action@v3
  with:
    project_id: ${{ secrets.NEON_PROJECT_ID }}
    api_key: ${{ secrets.NEON_API_KEY }}
    # name of the new branch
    branch: gh-${{ github.sha }}

- name: deploy to dev
  run: npx serverless deploy
  env:
    DATABASE_URL: ${{ secrets.DEV_DATABASE_URL }}
    SERVERLESS_ACCESS_KEY: ${{ secrets.SERVERLESS_ACCESS_KEY }}
```

### Summary

In this article, we discussed:

- Why you should use ephemeral environments.
- Why Neon is a good fit for ephemeral environments.
- How Neon works and how to use the Neon console to manage branches and query your data.
- How to use the Neon serverless driver to query your data.
- How to automate the process of creating and deleting branches, and how to incorporate them into a productive development workflow.
- How to use Neon with ephemeral environments in CI/CD pipelines.

With Neon and ephemeral environments, standing up a fresh copy of your database is simple, fast and cost-efficient. Make your changes, run your tests, validate your feature, then tear it down. You’ll end up spending less time on infrastructure and more time on building.

---

_Neon has a Free Plan. [Sign up without a credit card](https://console.neon.tech/signup) and start building._
