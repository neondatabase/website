---
title: Branch-per-PR Is Not the Same as a Staging Database
subtitle: Compare Neon database branches for every pull request with a classic shared staging database across data freshness, migrations, auth, and cost.
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2026-07-10T00:00:00.000Z'
updatedOn: '2026-07-10T00:00:00.000Z'
---

Before a database change reaches production, you want to test it in a hosted environment that is neither your local machine nor production itself. You have two ways to set that up: a shared staging database that all team members would use for testing, or a preview database created for each pull request. They may sound like interchangeable flows, but they differ in how long it takes to sync your production database with a preview environment, and how fast each developer can iterate against data (including authentication data) that looks like production.

In this guide, you will learn what each approach is good for, how the two differ on data freshness, migrations, auth, and cost, how to set up branch-per-PR so it does not re-create the same staging problems, and when a shared staging database is still the right choice.

## The two approaches, compared

![Two ways to test before production. On the left, three pull requests all point at one shared staging database, while on the right each pull request forks its own isolated copy from the production parent](/docs/guides/branch-vs-staging-models.svg 'no-border')

Let's quickly see how the two compare across a few key factors before we go deeper:

| Factor              | Branch-per-PR (Neon)                          | Shared staging DB                          |
| ---------------------- | --------------------------------------------- | ------------------------------------------ |
| Isolation              | One database per PR                            | Everyone shares one                        |
| Starting data          | Snapshot of the parent at branch-create time  | Whatever the last refresh loaded           |
| Data freshness         | As fresh as the parent, per PR                 | Fresh right after a refresh |
| Provisioning           | Copy-on-write, ready in ~1s regardless of size | Restore or re-import, minutes to hours     |
| Auth (realism)           | Strong if the parent is production-shaped      | Depends on seed or restore quality         |
| Migration experiments  | Safe and isolated per PR                        | Conflicts serialize in human time          |
| Lifecycle              | Auto-create on open, auto-delete on close      | Long-lived, manually reset                 |
| Cost model             | Scale-to-zero, pay per active branch           | One always-on instance sized near prod     |

Now let's look at each approach more closely, starting with the shared staging database.

## The role of a shared staging database

The classic staging setup is one long-lived database that everyone targets between dev and prod. Usually, you would refresh it on a schedule with a script like:

```bash
# the weekly staging refresh, roughly you would do the following:
pg_dump "$PROD_URL" --no-owner --format=custom -f prod.dump
psql "$STAGING_URL" -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'
pg_restore "$STAGING_URL" --no-owner --clean prod.dump
psql "$STAGING_URL" -f sanitize.sql   # scrub PII, reset secrets, mask emails
```

But keeping a shared staging database useful for the team to iterate on is ongoing work, and it comes with the following responsibilities:

- A weekly restore from production (sanitized or not)
- Seed scripts that only approximate real data and need to be maintained as production schema changes
- Manual coordination over who is allowed to run migrations and when

A shared staging database is helpful when a single, long-lived environment that mirrors production gives the team one fixed endpoint that integration tests and external services can rely on. But the trouble is that its weaknesses are also built in:

- **It is never quite current**: The restore runs on a schedule rather than on demand, and it can take hours depending on the production database size to sync.
- **Everyone shares one database**: A single migration, seed, or destructive test lands on the same database the whole team is depending on.
- **Migrations have to be coordinated**: There is one schema for everyone, so two people cannot reshape the same tables at the same time without taking turns.
- **It runs around the clock**: A single instance sized close to production stays on whether or not anyone is testing, so it might nearly cost the same as a production workload.
- **Risky changes have nowhere safe to run**: To try a breaking change, you have to copy the whole database into a separate snapshot, and duplicating a production-sized dataset is slow and time-consuming.

Now, let's learn a different approach to managing staging databases.

## How branch-per-PR works

A [Neon branch](/docs/introduction/branching) is a copy-on-write fork of a parent database. It begins with the same schema, data, roles, and extensions as its parent, but it is a separate, writable database of its own. Because a branch copies data only when you change it, it is ready in about a second whether the parent is 1 GB or 1 TB, and it only stores the rows that actually differ from the parent.

Branch-per-PR applies that idea to your preview process. Every pull request gets its own branch, forked from a chosen parent (usually production). The PR can run migrations, seed data, and run destructive tests against its own branch without touching anyone else's work, and the branch is thrown away when the PR closes.

Here's how you can create and connect to a branch using the [Neon CLI](/docs/reference/cli-branches) commands:

```bash
# fork the parent's schema, data, roles, and extensions in about a second
neon branches create --name pr-1234 --parent production

# hand the preview app a restricted, pooled connection string (not the owner)
neon connection-string pr-1234 --role-name app_user --database-name dbname --pooled
```

The most common way to set this up is that when a pull request opens, the CI environment would create the branch, run migrations against that endpoint, and inject the connection string into a preview deployment. Vercel's [Neon integration](/docs/guides/vercel-overview) can do this with minimal YAML, and [GitHub Actions](/guides/preview-deploys-netlify) can be used to do this with Netlify.

A minimal preview workflow with Neon branching looks like this:

```yaml
# .github/workflows/preview.yml
- name: Create a Neon branch for this PR
  id: branch
  uses: neondatabase/create-branch-action@v5
  with:
    project_id: ${{ vars.NEON_PROJECT_ID }}
    branch_name: pr-${{ github.event.number }}
    parent_branch: production
    role: app_user
    api_key: ${{ secrets.NEON_API_KEY }}

- name: Run migrations and tests against the branch
  env:
    DATABASE_URL: ${{ steps.branch.outputs.db_url }}
  run: |
    npm run migrate
    npm test
```

With that workflow, each PR gets:

- Its own Postgres endpoint and schema state (with anonymized production data)
- Data copied at branch-create time (copy-on-write, not a full duplicate on disk)
- Freedom to run destructive tests without blocking other PRs
- Automatic cleanup when the PR closes

Now, let's go over the detailed practical differences in each approach.

## Key differences in practice

### Data freshness

A shared staging database is only up to date right after a refresh (say weekly), and it starts to fall behind as soon as production changes. For example, say someone merges this migration into `main` on a given day:

```sql
-- migration merged mid-sprint
ALTER TABLE users RENAME COLUMN full_name TO display_name;
```

On shared staging, that column is renamed once, for everyone. Any PR still written against `full_name` now breaks against the shared schema, and any PR that has not rebased sees a schema that no longer matches its code.

With branch-per-PR, each branch forks the parent when the PR opens, so the starting schema and data match that parent snapshot, and no changes interfere while you work:

```bash shouldWrap
# PR #1200 opened a given day: branches from production as it was the same day
neon branches create --name pr-1200 --parent production

# PR #1234 opened on another day: branches from production as it was that day
neon branches create --name pr-1234 --parent production
```

If your parent is production, previews have the same data, schema, and extensions. Branch-per-PR limits the impact to a single PR instead of affecting everyone on a shared database, and re-branching to pick up the latest parent takes only about a second (instead of a long restore operation).

### Migration isolation and ordering

On shared staging, two people cannot both change the `orders` table on the same database without coordinating first. Branch-per-PR enables you to run migration experiments per PR, so you can run your own `ALTER TABLE`, drop a column, or backfill data on a private copy without coordinating first.

```bash
# PR A drops a column on its own branch.
neon connection-string pr-A --database-name dbname --pooled  # DROP COLUMN experiment

# PR B renames a table on its own branch.
neon connection-string pr-B --database-name dbname --pooled  # RENAME TABLE experiment
```

### Authentication data and production shape

On a shared staging database, you would seed auth data with a script that inserts a handful of test users, but it rarely captures the edge cases you see in production. Such cases might be left out of the seed script on purpose, for privacy or to keep the seed simple.

[Neon Auth](/docs/auth/branching-authentication) keeps identity data in Postgres, so when you branch from production, the users, sessions, and org tables come along with the rest of your data. A preview deployment can then log in as those copied accounts, and you can test moderation or [RLS policies](/guides/test-rls-on-neon-branches) against rows that are an anonymized version of your real customers.

Doing the same on a shared staging database means your refresh has to copy the auth tables reliably, and you have to manage secrets so preview cookies do not leak into production domains.

### Cost and platform considerations

A shared staging database usually runs 24/7 at close to production size whether or not anyone is testing. Branch-per-PR replaces that with many small, mostly idle branches. The cost usually favors branches, because previews [scale to zero](/docs/introduction/scale-to-zero) when no request is hitting them:

```text
Shared staging:  1 always-on instance ~= prod size
Branch-per-PR:   Many open branches, copy-on-write storage, compute active only
                 while a preview is in use, otherwise scaled to zero
```

Many open PRs mean an equal number of Neon branches, but with copy-on-write, you are not paying for that many full-size disks, and scale-to-zero means you do not pay for compute on branches nobody is actively using.

Now, let's go over one important point about personal data before we learn how to implement branch-per-PR in your preview workflow.

## Anonymize sensitive data when you branch

Branching from production makes a preview realistic, but it also means real emails, names, and other personal data would be in an environment that your whole team can access. For a lot of teams that is a non-starter, and under the [GDPR](https://www.aepd.es/en/prensa-y-comunicacion/blog/data-breaches-development-and-pre-production-enviroments), pseudonymized data that can still be re-identified is treated as personal data, so a preview branch has to protect it with the same care as production.

Neon handles this with [anonymized branches](/docs/workflows/data-anonymization), which use the [PostgreSQL Anonymizer](/docs/extensions/postgresql-anonymizer) extension to statically mask columns you flag as sensitive. The masking runs during branch creation, so that the branch holds an actual masked copy of the data.

You can define masking rules per column, and apply them right in the branch-creation step of your workflow:

```yaml
# .github/workflows/create-anon-branch.yml
- name: Create an anonymized branch for this PR
  uses: neondatabase/create-branch-action@v6
  id: create-branch
  with:
    project_id: ${{ secrets.NEON_PROJECT_ID }}
    branch_name: anon-pr-${{ github.event.number }}
    api_key: ${{ secrets.NEON_API_KEY }}
    masking_rules: |
      [
        {
          "database_name": "neondb",
          "schema_name": "public",
          "table_name": "users",
          "column_name": "email",
          "masking_function": "anon.dummy_free_email()"
        },
        {
          "database_name": "neondb",
          "schema_name": "public",
          "table_name": "users",
          "column_name": "first_name",
          "masking_function": "anon.fake_first_name()"
        }
      ]
```

A few things to keep in mind when you set this up:

- Masking is static, so re-running it on the same branch masks the already-masked data, not fresh rows. To pick up new data from the parent, create a new anonymized branch.
- Foreign key columns cannot be masked directly. Mask the primary key instead, and Neon keeps referential integrity intact across related tables.

Now, let's learn how you can implement branch-per-PR in your workflow.

## Implement branch-per-PR correctly

To use branching effectively in your development workflow, follow these steps:

<Steps>

## Pick the parent deliberately

Branch from production (mask it if needed) to match production data and auth:

```bash
neon branches create --name pr-${PR_NUMBER} --parent production
```

## Connect as a restricted role

Use the same non-owner role you use in production, so RLS and grants behave the same. Add `--pooled` to test through the pooled endpoint:

```bash
neon connection-string pr-${PR_NUMBER} --role-name app_user --database-name dbname --pooled
```

## Run migrations against the branch

Point CI's `DATABASE_URL` at the branch and run migrations there:

```bash
export DATABASE_URL="$(neon connection-string pr-${PR_NUMBER} --role-name app_user --database-name dbname --pooled)"
npm run migrate && npm test
```

## Delete on close

Delete the branch when the PR closes so inactive endpoints are regularly cleaned up:

```bash
neon branches delete pr-${PR_NUMBER}
```

</Steps>

Now, let's look at when a shared staging database might still be the better choice.

## When shared staging is the better choice

A shared staging database can still be the right call in a few situations:

- Some compliance regimes expect one audited pre-production environment with a fixed changelog. [PCI DSS](https://docs-prv.pcisecuritystandards.org/PCI%20DSS/Standard/PCI-DSS-v4_0_1.pdf), for example, requires that changes to system components follow a documented change-control process (requirement 6.5.1) and that pre-production environments are separated from production (requirement 6.5.3), which is easier to demonstrate to an auditor with a single, long-lived environment than with dozens of short-lived branches.

- If most of your PRs never touch the database, a fresh copy per PR adds lifecycle overhead for a little gain.

- A stable target is also easier when external services need to reach your pre-production environment. Webhooks, payment sandboxes, and other third-party integrations usually expect one fixed callback URL that you register once.

Even when a single shared staging is the right fit, it does not have to be a separate always-on server. You can run it on Neon as a long-lived branch off production, which keeps the one stable endpoint while still being a copy-on-write fork, so that you are not paying for a full duplicate of production storage.

## Conclusion

A shared staging database gives you one stable, audited endpoint that integration tests and external services can use, which is why it still fits regulated release gates and manual regression work. Branch-per-PR gives every pull request its own production-shaped copy that is ready in about a second and cleaned up on merge, so each developer can iterate and run risky migrations without waiting on anyone else.

If your work leans toward a single reproducible environment, keep a shared staging database. If it leans toward fast, isolated iteration on data that looks real, use branches, and you can start with [Neon branching](/docs/introduction/branching) and the [GitHub integration](/docs/guides/neon-github-integration) to wire it into your existing pull request flow.
