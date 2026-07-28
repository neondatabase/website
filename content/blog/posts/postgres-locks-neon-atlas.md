---
title: Navigating PostgreSQL Locks with Neon and Atlas
description: Avoiding downtime during schema migrations
excerpt: >-
  As applications evolve, making changes to your database schema is inevitable,
  whether you’re adding indexes to keep performance up with a growing user base
  or adding new features to an existing product. Most of the time, these schema
  migrations will go smoothly, but if you’re not...
date: '2025-03-14T18:26:07'
updatedOn: '2025-03-14T18:26:11'
category: community
categories:
  - community
authors:
  - rotem-tamir
  - noa-rogoszinski
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-locks-neon-atlas/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Navigating PostgreSQL Locks with Neon and Atlas - Neon
  description: >-
    Learn how to prevent Postgres schema migration locks that can cause downtime
    using best practices and automation with Atlas and Neon.
  keywords: []
  noindex: false
  ogTitle: Navigating PostgreSQL Locks with Neon and Atlas - Neon
  ogDescription: >-
    Learn how to prevent Postgres schema migration locks that can cause downtime
    using best practices and automation with Atlas and Neon.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-locks-neon-atlas/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-locks-neon-atlas/neon-postgresql-lock-1-1024x576-6a363329.jpg)

As applications evolve, making changes to your database schema is inevitable, whether you’re adding indexes to keep performance up with a growing user base or adding new features to an existing product. Most of the time, these schema migrations will go smoothly, but if you’re not careful, updating your schema can potentially lead to major outages.

## The migration that locked the database

Let’s illustrate this with an example. Suppose you are a developer, working on a backend application. Your team has been dealing with duplicate email issues in the users table. To enforce uniqueness and prevent future duplicates, you decide to add a unique constraint to the email column.

So, you write the migration:

```sql
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);
```

It worked instantly in staging. Confident, you run it in production.

**And then… the API starts timing out.**

- User signups and logins grind to a halt.
- CPU usage on the database spikes.

Even unrelated queries on the users table start hanging. What happened? You check pg_stat_activity and realize there’s a massive lock queue forming, all waiting on your migration.

## The problem: Unique constraint validation and table locking

Here’s what’s happening:

1. **As part of applying the migration, Postgres must scan the entire `users` table to validate uniqueness.** In this case, it needs to ensure there are no duplicate emails before enforcing the constraint; if the table is large, this can take minutes or hours.
2. **To do this, it acquires an `ACCESS EXCLUSIVE` lock on `users` while validating.** This means no reads or writes can happen on users until validation is complete; login, signup, and user updates all stop working.

## Avoiding locking issues when adding a unique constraint

Precautionary steps do exist to prevent situations like this when introducing a uniqueness constraint. Instead of altering the whole table, we start by creating a unique index on the `email` column using the `CONCURRENTLY` keyword so the index can be created without locking the `users` table and other operations can run.

```sql
CREATE UNIQUE INDEX CONCURRENTLY unique_email ON users(email);
```

Next, we validate the index and confirm that it is in a VALID state by executing a query that returns the column covered by the index.

```sql
SELECT indexdef
FROM pg_indexes
WHERE indexname = 'unique_email';
```

Finally, add the `UNIQUE` constraint to the users table using our new index:

```sql
ALTER TABLE users ADD UNIQUE USING INDEX unique_email;
```

Rather than applying a uniqueness constraint to the `email` column and checking the entire table to ensure it follows the constraint, we create unique references to each value of the email column.

With some patience and a few extra steps, it is possible to avoid our nightmare scenario.

## More Postgres locking gotchas

But wait, there’s more! It turns out that our uniqueness constraint story isn’t that unique at all. Let’s review another scenario in which a seemingly innocuous change can cause trouble for your application.

As we saw above, when performing certain operations on a database, Postgres acquires locks to prevent actions that could lead to concurrency conflicts and potentially compromise the database.

When we added the `UNIQUE` constraint, Postgres took an `ACCESS EXCLUSIVE` lock on the users table, which is the most restrictive lock. This lock ensures that the process holding it is the only one interacting with the table in any way. No other operation, including `SELECT`, may access the table.

**Here is just one other case where Postgres will acquire an `ACCESS EXCLUSIVE` lock on a table:**

Let’s say your upper management wants to start implementing birthday promotions for users, so they request that the `birthdate` column not contain `NULL` values. Now that you know about `ACCESS EXCLUSIVE` locks, you’re more careful to check the implications of directly modifying a column from `NULL` to `NOT NULL`.

Similar to the unique constraint, setting a column to `NOT NULL` requires a full table scan to ensure that there are no `NULL` values currently in the column, and therefore, an `ACCESS EXCLUSIVE` lock.

We can avoid this lock requirement by adding a few extra steps. First, check for already existing NULL entries:

```sql
SELECT COUNT(*) FROM users WHERE birthdate IS NULL;
```

If this returns any entries, update or delete them before proceeding to ensure there are no `NULL` values in this column.

Then, add a CHECK constraint using `NOT VALID` to check for new `NULL` entries. This allows Postgres to enforce the rule for new rows and avoids a full table scan.

```sql
ALTER TABLE users ADD CONSTRAINT birthdate_not_null CHECK (birthdate IS NOT NULL) NOT VALID;
```

Next, run a validation check to ensure that all the rows in the table conform to the constraint:

```sql
ALTER TABLE users VALIDATE CONSTRAINT birthdate_not_null;
```

Finally, since the table has been validated, we can convert the CHECK constraint to a NOT NULL constraint by setting the column and then dropping the constraint.

```sql
ALTER TABLE users ALTER COLUMN birthdate SET NOT NULL;
ALTER TABLE users DROP CONSTRAINT birthdate_not_null;
```

After some extra time and SQL statements, we manage to get a lockless process for updating our schema. To best avoid concurrency conflicts, there are tools on the market that can catch them more efficiently and give developers peace of mind.

## Preventing locking trouble with Atlas and Neon

As you can see, schema migrations require caution and expertise, and many developers dread them due to firsthand experience of past outages. As a result, teams often avoid schema changes, slowing development and increasing technical debt. Expecting every engineer to master Postgres intricacies is unrealistic, and even experts make mistakes. Instead of relying on perfection, high-performing teams use automation and tooling to prevent issues before they happen.

In the remainder of this post, we will show how [Atlas](https://atlasgo.io), a database schema management tool can be used alongside Neon, to prevent such costly outages.

### Enter: Atlas

[Atlas](https://atlasgo.io/) is a database schema-as-code tool based on modern DevOps principles. Atlas is used by many teams to automate tasks like migration planning, verification, and deployment. To prevent risky migrations from reaching production, Atlas provides the [migrate lint](https://atlasgo.io/versioned/lint) command which analyzes planned migrations and runs them through a long list of [safety checks](https://atlasgo.io/lint/analyzers).

One of the checks provided by Atlas is [PG105](https://atlasgo.io/lint/analyzers#PG105) which detects “UNIQUE constraints causing ACCESS EXCLUSIVE locks”, perfect for detecting cases like we described above. Had we used atlas migrate lint to analyze our uniqueness constraint adding migration, we would have seen something similar to this:

```bash
Analyzing changes from version 20250304145238 to 20250304152600 (1 migration in total):

  -- analyzing version 20250304152600
    -- data dependent changes detected:
      -- L2: Adding a unique index "email" on table "users" might fail
         in case column "email" contains duplicate entries
         https://atlasgo.io/lint/analyzers#MF101
    -- concurrent index violations detected:
      -- L2: Adding a UNIQUE constraint on table "users" acquires an
         ACCESS EXCLUSIVE lock, blocking both reads and writes during the
         operation https://atlasgo.io/lint/analyzers#PG105
  -- ok (111.416µs)

  -------------------------
  -- 90.733458ms
  -- 1 version with warnings
  -- 1 schema change
  -- 2 diagnostics
```

Knowing all of this before deploying could have prevented us from a costly outage. Of course, while using a CLI from the developer station to verify migrations is very useful, Atlas really shines when you use it as part of the CI process during the code review phase. This way, your team can ensure that such risky changes do not creep into production unnoticed. Atlas ships with integrations for all popular CI platforms such as GitLab CI, BitBucket, CircleCI and GitHub Actions.

### Neon branching for simulating schema migrations

[Neon](https://neon.tech/home) is a serverless Postgres database dedicated to boost the development velocity of developers and teams. One of Neon’s most powerful features is [database branching](https://neon.tech/flow), which enables developers to create isolated copies of their database instantly. This allows teams to test schema migrations in a real environment before applying them to production.

Atlas takes a “static analysis” approach to migration verification, meaning it is focused on the _code_ of the migration, without considering a _specific_ target database. By combining Atlas’ static analysis with Neon’s branching, developers can confidently validate changes without the risk of downtime. Let’s take a look with an example.

## Building a CI pipeline to catch locking migrations before deployment

We’ll demonstrate how to create a CI pipeline that can catch long locks during the CI phase. On a high-level, here’s what our workflow will look like:

1. Install Atlas on the CI runner.
2. Run `atlas migrate lint` against any new migrations in the Pull Request. If issues are identified, Atlas will add a detailed comment on the Pull Request.
3. Create a new Neon branch from the production database.
4. Run the migration against the new branch, limiting the migration’s time using Atlas’s `apply hook` feature.
5. Report any failures.

### Implementing our pipeline

<Admonition type="note" title="see the repo">
To see the final result, go to our example repo on [GitHub](https://github.com/rotemtam/atlas-neon-locking-demo).
</Admonition>

Let’s see how to create such a pipeline using GitHub Actions. We’ll begin by creating an Atlas configuration file named `atlas.hc` l:

```sql
env "neon" {
  url = getenv("NEON_URL")
  src = "file://schema.pg.hcl"
  dev = "docker://postgres/17/dev?search_path=public"
  migration {
    repo {
      name = "neon-locks"
    }
  }
}

hook "sql" "timeout" {
  transaction {
    after_begin = [
      "SET statement_timeout TO '10s'",
    ]
  }
}
```

By convention, we store this file in the root of the repository, but we can place it elsewhere if necessary. This file tells Atlas where everything is. The important part for our demonstration is the definition of the `hook` block which instructs Atlas to set a `statement_timeout` of `10s` after beginning the migration transaction. This will come into play later when we run a locking migration on a large table.

Next, let’s create our GitHub Actions workflow in a file named .github/workflows/atlas-ci.yaml. The final result can be found [here](https://github.com/rotemtam/atlas-neon-locking-demo/blob/7c29adc67567d82f60070679a2e4c734c0dfbb17/.github/workflows/atlas.yaml#L1). Let’s go over the workflow piece-by-piece.

```sql
name: Atlas CI

on:
  pull_request:
    paths:
      - 'migrations/*' # Run only if changes occur in the migrations directory

permissions:
  contents: read
  pull-requests: write
```

We start by defining our workflow and configure it to be triggered whenever a pull request that alters the `migrations/` directory is created. Permissions to read and write pull requests are necessary so we can create informative comments in the linting phase.

```sql
jobs:
  atlas-ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      # Step 1: Setup Atlas
      - uses: ariga/setup-atlas@v0
        with:
          cloud-token: ${{ secrets.ATLAS_TOKEN }}

      # Step 2: Lint the migrations
      - uses: ariga/atlas-action/migrate/lint@v1
        with:
          dir-name: 'neon-locks'
          env: "neon"
        env:
          GITHUB_TOKEN: ${{ github.token }}
```

Now, we begin to define our job `atlas-ci`, which consists of multiple steps. In the first step, we install Atlas and provide the Atlas API Token (this is necessary since Postgres lock detection is an [Atlas Pro feature](https://atlasgo.io/features)). Next, we use the `migrate/lint` action which detects any new migration files and runs them through Atlas’s analysis engine.

```bash
     # Step 3: Create a new branch using the Neon official action
      - name: Create Neon Branch
        id: create-branch
        uses: neondatabase/create-branch-action@v5
        with:
          project_id: ${{ secrets.NEON_PROJECT_ID }}
          api_key: ${{ secrets.NEON_API_KEY }}
          branch_name: pr-${{ github.event.number }}
          username: neondb_owner

      # Step 4: Try to apply migrations against the Neon branch URL and capture result
      - name: Apply Migrations
        id: apply-migrations
        continue-on-error: true
        run: |
          atlas migrate apply --env neon --url="${{ steps.create-branch.outputs.db_url }}&search_path=public" --dir "file://migrations"
        
      # Step 5: Always clean up the Neon branch
      - name: Clean up Neon Branch
        if: always()  # This ensures this step always runs
        uses: neondatabase/delete-branch-action@v3
        with:
          project_id: ${{ secrets.NEON_PROJECT_ID }}
          api_key: ${{ secrets.NEON_API_KEY }}
          branch: pr-${{ github.event.number }}
```

<br />Next, we create a new Neon branch from our database and apply our new migrations to it. By using `--url="$\{\{ steps.create-branch.outputs.db_url \}\}&search_path=public"`, we tell Atlas where this branch database is located and how to connect to it.

In step 5, we clean up the Neon branch. We want this to always run, even if our migration failed in step 4 (due to a timeout or any other reason), so we use `continue-on-error: true`.

```sql
      - name: Crash on failure
        if: steps.apply-migrations.outcome == 'failure'
        uses: actions/github-script@v7
        with:
          script:
            core.setFailed('migrate apply failed')
```

Finally, we want the build to be red if our simulation fails. Since setting continue-on-error causes GitHub Actions to ignore our failure, we explicitly crash the build if the apply step fails.

### Tying it all together

Let’s see how everything works together with a simple example. Consider this Pull Request in which we add a unique constraint to the email column of a table named `gigantic_user_table`.

In this example, we modified the desired state of the database to include this constraint, and then ran:

```sql
atlas migrate diff --env neon
```

This command automatically generated the following migration:

```sql
-- Modify "gigantic_user_table" table
ALTER TABLE "gigantic_user_table" ADD CONSTRAINT "email" UNIQUE ("email");
```

I then committed my changes and created the pull request. As expected, GitHub Actions triggers our workflow, installing Atlas and running the `migrate lint` command. Having detected a potential locking issue, Atlas comments on our PR:

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-locks-neon-atlas/ad4nxdp7iclirbmss75xha6hnhz7rxmyeupzzywha0tp8hegbotntahdkgcfrav8a7wqjwvc3etm83vlsggykqj1fdnudnkgj816h0jwj4-nxsg4lfpb1folsusfukymw6pzziu-45034725.png)

Next, `neondatabase/create-branch-action` kicks in to create a database branch from our production database. This branch is an _exact replica_ which means it is also just as _gigantic_! This makes our simulation of how long the migration is going to take very realistic.

After the branch database is ready, we use Atlas to apply our new migration on it. Since the table is huge, adding a unique constraint takes a long time, more than the `10 statements timeout` that we had allowed with the Atlas `hook` block. As expected, the `apply-migrations` step fails:

```bash
Error: sql/migrate: executing statement "ALTER TABLE \"gigantic_user_table\" ADD CONSTRAINT \"email\" UNIQUE (\"email\");" from version "20250309145940": pq: canceling statement due to statement timeout
sql/migrate: write revision: pq: current transaction is aborted, commands ignored until end of transaction block
Error: Process completed with exit code 1.
```

Afterwards, our workflow cleans up the branch we just created and our build fails.

Now when I look at my Pull Request, I can see that it is quite risky and I also know exactly why.

## Wrapping up

In this post, we explored the pitfalls of schema migrations in Postgres, particularly how certain operations—like adding a UNIQUE constraint or enforcing NOT NULL—can unexpectedly lock your database, leading to downtime. We then demonstrated how to mitigate these risks using best practices, such as creating indexes concurrently and validating constraints in stages.

However, best practices alone aren’t enough. To truly safeguard against accidental outages, teams need robust tooling. We introduced Atlas, which helps catch risky migrations before they reach production, and Neon, which enables realistic pre-deployment simulations using database branching.

By integrating Atlas migrate lint into your CI/CD pipeline and using Neon’s branching capabilities to test schema changes under real-world conditions, you can prevent database locks from taking down your application. With this combination, you get the best of both worlds: static analysis to catch issues early and live database testing to measure real-world impact.

Instead of fearing schema migrations, you can embrace them with confidence—knowing that your tools have your back.

Happy migrating! 🚀

---

_Neon has a Free Plan. [Create an account today](https://console.neon.tech/signup) if you’re not a user (it takes seconds and requires no credit card)._
