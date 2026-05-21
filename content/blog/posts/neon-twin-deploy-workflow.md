---
title: 'Neon Twin: How to deploy a change tested in Neon to prod in RDS'
description: >-
  Use this migration workflow to test changes in a dev environment in Neon and
  push the changes to prod in RDS
excerpt: >-
  In previous articles, we discussed the advantages of using Neon as a
  development database while keeping your production workloads on AWS RDS. We
  covered how to set up nightly dump/restore jobs using GitHub Actions to create
  a synchronized Neon Twin of your production database and...
date: '2024-08-15T17:25:24'
updatedOn: '2024-12-24T18:22:09'
category: workflows
categories:
  - workflows
authors:
  - rishi-raj-jain
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-twin-deploy-workflow/cover.jpg
  alt: null
isFeatured: false
seo:
  title: 'Neon Twin: How to deploy a change tested in Neon to prod in RDS - Neon'
  description: >-
    Use this migration workflow to test changes in a dev environment in Neon and
    push the changes to prod in RDS
  keywords: []
  noindex: false
  ogTitle: 'Neon Twin: How to deploy a change tested in Neon to prod in RDS - Neon'
  ogDescription: >-
    Use this migration workflow to test changes in a dev environment in Neon and
    push the changes to prod in RDS
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-twin-deploy-workflow/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-twin-deploy-workflow/neontwin-1024x576-480e4198.jpg)

<Admonition type="tip" title="Neon vs RDS: FAQ">
If you're looking for a comparison of Neon vs RDS, check out [neon.tech/rds](https://neon.tech/rds).
</Admonition>

In previous articles, we discussed the [advantages of using Neon as a development database](https://neon.tech/blog/development-environments-for-aws-rds-using-neon-postgres) while keeping your production workloads on AWS RDS. We covered [how to set up nightly dump/restore jobs](https://neon.tech/blog/optimizing-dev-environments-in-aws-rds-with-neon-postgres-part-ii-using-github-actions-to-mirror-rds-in-neon) using GitHub Actions to create a synchronized Neon Twin of your production database and [how to implement Slack Webhooks](https://neon.tech/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows%5C) for real-time notifications when the synchronization is complete.

In this article, we’ll explore the reverse workflow: **how to migrate changes from your Neon Twin (your development environment) back to your AWS RDS production database.** We will automate this process through a GitHub Action that triggers when a pull request is merged.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-twin-deploy-workflow/ad4nxdgrqfvalrdgsvo23whevwp0ve7ebz9dpn0a4h0yhid-to8so37zmwhrefpdzritxcnvkmjds2hrlbw7erstgdjujmsdq2ogm34rswbnkztb3y7nh56dzjqxhjrmbzpsajoasitqplxenklrmxhmvbpoy-965e4b5f.png)

We call this workflow the Reverse Twin, and it all starts with [database branching](https://www.smashingmagazine.com/2023/09/getting-started-with-neon-branching/).

## Quick intro to database branching with Neon

In our previous articles, [we built a Neon Twin synced with your production database in AWS RDS](https://neon.tech/blog/optimizing-dev-environments-in-aws-rds-with-neon-postgres-part-ii-using-github-actions-to-mirror-rds-in-neon), so you could rely on Neon’s [superior development experience](https://neon.tech/blog/from-days-to-minutes-how-neo-tax-accelerated-their-development-lifecycle) for your dev and testing environments. Now, we’ll introduce you to database branching in Neon so you can take advantage of if in your development workflows.

[Database branching](https://www.google.com/search?client=safari&rls=en&q=neon+database+branching&ie=UTF-8&oe=UTF-8) in Neon works similarly to Git branching. It enables you to instantly create isolated copies of a particular dataset via copy-on-write, to build and test new features on a copy of production data without further dumping/restoring into new instances or paying extra for storage.

This is a great feature to [boost development speed](https://neon.tech/blog/adopting-neon-branching-in-ci-cd-pipelines-a-practical-story-by-shepherd). By branching from your Neon Twin, you can safely experiment with changes without affecting the main development branch, where you’re loading prod data from RDS. In this section, we’ll guide you through creating and working with these branches, and we’ll set the stage for migrating your updates back to production.

## Documenting changes in your dev branches in Neon

The first step to migrating (or applying) changes made to your Neon Twin to your production database is to _record_ the changes that were made in your development branches (how they differ from main). Neon allows you to do this in a straightforward way via the [schema diff](https://neon.tech/docs/guides/schema-diff) feature.

Let’s set things up. From within the Neon console, navigate to **Branches** and click the **Create branch** button.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-twin-deploy-workflow/ad4nxcg2oubmm4ewbv9qk7yxbar56stxmwgp4hrmzkr1lgf6put2zgv-cqf4vgoogqcue4akoyoxhbtomsjlsgxcajzcdze2m6jv537vxcxorvf1okgi07rpncn1cmbhkrmb41i3fkdfqoala3l-kzdrr2yez8-bf8b4926.png)

Give the new branch a name, select from which parent branch you’d like to form, and a point in time from when the branch should be created. When you’re ready, click **Create new branch**.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-twin-deploy-workflow/ad4nxffe6wkcvpoouonjwfvprn7kecx9uau1ilkxukwko9dywbuwgp4z-hkesvxgkujobfrowobzskcjtyhennrmz0nzjlhsursf0e4prdtvkumzaf3fg2tirre-bkv1gqox9ezzthqemg4c-t6pye3681dz-697e938f.png)

With a new branch created, you’ll be given a new Postgres connection string, which can be helpful when testing changes made to your branch from within an application.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-twin-deploy-workflow/ad4nxe4h1gajbuwlkncxddjcpjq6pomnlvk4ljwehvphom2ur8nacmyojqulhlpk7w0vo6oejxao4eb2jzbxecycxzlqrcj2iy6bxn0qbvbujven2jwb-bq0e3tcwjckfz2npnirfgnikkdllnani2vw8ctnui-bf70675b.png)

To make schema changes on your branch, head over to the **SQL Editor** to make schema changes to your development branch.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-twin-deploy-workflow/ad4nxd3ssw6s8twsxvs2llppgpy3ngv73db5wpauqczxo5wdeygtatzgcgrbgyzpt1ko68hmckg5wbzqfz6ygbshxiwticy3b4p1ut2d7ooqtfvqtyrz16q2afbm8csjhncrlb20ceobpr0kray4g-do32z3m-5d535c3e.png)

Once you’ve made the relevant changes on your development branch, head back over to **Branches** and select your development branch.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-twin-deploy-workflow/ad4nxfvziotc1xbiiamkyfe4rcqesumcmzvp5ywnsrc9cqwj8sofrzjpi7fuxz-sd4vzwkyt9ier-uconxswymwsa9zdkg0nf24qzbgna36mjyamq9jsrx0aanaxbezg-yoiqrbl8rsmxknazjgqkse6dq-27090230.png)

On the next screen select **Open schema diff** to see the changes that have been made to your development branch and how they differ from the main branch.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-twin-deploy-workflow/ad4nxew83xktkt9w8emivwilyhkcvuemgbzwkuwohp0insm22qwr5udc4rmio2hpyk3u2s8fbhvvstxm0yrwaks8issr6mbeqikhjtmreu99f7khg3jv6zvokbdueup2jqsn5nvudihghjwj-b03a2ogmtq-a925d69d.png)

On the Schema Diff page you’ll see the changes that have been made. In our case you can see that a new column named `flag` has been added with a data type of `varying(255)`.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-twin-deploy-workflow/ad4nxd347b26wprtyq14lfcrniouoga849trsp0xospsxu2hu05gnx4bwkf0za43c53i63pgv9c6ggpmicaawq1zsvzfhp0baudy8n553wxybenve4xinxbbjagubpvo2g7gxbhmbebyunoyiuke3nwkejczk-7ba83b7b.png)

Now you’re documenting the changes that have been made to the development branch. You’re ready to proceed with migrating them back to your production database.

## Tested in Neon to deployed in RDS: Two methodologies

When it comes to migrating changes from your Neon Twin back to your AWS RDS production database, there are a couple of efficient approaches you can adopt. Each method has its own strengths, depending on your specific workflow and preferences.

In the following sections, we’ll explore these two methodologies:

1. **Using SQL Files and** **psql**. This “traditional” approach gives you full control over the migration process. By manually crafting .sql files, you can define the precise changes needed in your production database. These SQL scripts are then applied using psql.
2. **Using Prisma ORM.** If you’re using [Prisma](https://www.prisma.io), you have an alternative. Prisma’s migration tooling simplifies the management of database schemas, and you can use this to generate migration scripts based on the changes you’ve migrated (or applied) to your production database.

## Method 1: Using psql with GitHub Actions to run migrations

For this example, we’ve prepared an example repository where migrations can be written in SQL and will be applied by a GitHub Action that runs when a branch is merged into main:

**👉 Example repo:** [neon-twin-sql-migrations](https://github.com/neondatabase/neon-twin-sql-migrations)

- PR #1: [https://github.com/neondatabase/neon-twin-sql-migrations/pull/1/files](https://github.com/neondatabase/neon-twin-sql-migrations/pull/1/files)

### Manual SQL Migrations GitHub Action

This Action is triggered when a PR created against the main branch is closed, and the merged status is true.

The connection string for the database to apply the changes has been stored as a GitHub secret and named `PROD_DATABASE_URL`.

```yaml
name: Migrate to prod (sql)<br><br>on:<br>  pull_request:<br>    types: [closed]<br>    branches:<br>      - main<br><br>env:<br>  PROD_DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }} # Production or primary database<br>  PG_VERSION: '16'<br><br>jobs:<br>  pr-merged:<br>    runs-on: ubuntu-latest<br>    if: github.event.pull_request.merged == true # Ensure the PR was merged<br><br>    steps:<br>      - name: Install PostgreSQL<br>        run: |<br>          sudo apt update<br>          yes '' | sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh<br>          sudo apt install -y postgresql-${{ env.PG_VERSION }}<br><br>      - name: Checkout repository<br>        uses: actions/checkout@v4<br>        with:<br>          fetch-depth: 0<br><br>      - name: Get changed files<br>        run: |<br>          git diff --name-only -r HEAD^1 HEAD > migration_files.txt<br>          echo "Changed files:"<br>          cat migration_files.txt<br><br>      - name: Apply migrations<br>        run: |<br>          while IFS= read -r file; do<br>            if [ ! -f "$file" ]; then<br>              echo "$file does not exist"<br>              continue<br>            fi<br><br>            if [[ "$file" != *.sql ]]; then<br>              echo "$file is not a SQL file"<br>              continue<br>            fi<br><br>            echo "Processing $file"<br>            if ! /usr/lib/postgresql/${{ env.PG_VERSION }}/bin/psql "${{ env.PROD_DATABASE_URL }}" < "$file"; then<br>              echo "Error applying $file"<br>              exit 1<br>            fi<br>          done < migration_files.txt
```

There are a few key steps in this Action, so let’s explain what each one does:

- **Install PostgreSQL:** This step installs Postgres in the GitHub Action’s environment. In the final step, psql will be used to apply the migration changes.
- **Checkout repository:** This step allows the Action to read files from the repository.
- **Get changed files:** This step uses standard git commands to determine which files have changed between the PR branch and the main branch. The diff will be a list of filenames that have changed, saved in a temporary .txt file named migration_files.txt in the Action’s workspace.
- **Apply migrations:** This step iterates through each file listed in migration_files.txt. The while loop first verifies if there are any filenames in migration_files.txt and if they have a .sql extension. psql is then used to apply the changes from the migration file(s) and update the production database accordingly.

### SQL Migration repository setup

Within our repository, we have a migrations directory that contains the .sql files. These files are dated and describe the changes that are being applied, for example:

```bash
|-- .github<br>    |-- workflows<br>       |-- migrate-to-prod-sql.yml<br>|-- migrations<br>    |-- 2024<br>        |-- 08<br>            |-- 08-01-2024-add-flag-to-users.sql
```

Here’s an example of a .sql file that contains the changes we wish to make:

```sql
BEGIN;<br><br>ALTER TABLE users<br>ADD COLUMN flag VARCHAR(255);<br><br>COMMIT;
```

Once you’ve created a new migrations file, commit the changes and create a new PR ready to be merged into the main branch of your repo:

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-twin-deploy-workflow/ad4nxcu0txi9ot6nrr2-3ol79jjwku7dl4wjkyszudkyogzyaivstgtbzewfnbhyupg2ymmduojcpgjjwiuamv3bpai4w90iqwrbovmzztf6gt9zqny1xwehfdf8trkop44xdfku7y6-nrtwmk9fs-rtrtg-d9d85af7.png)

When the PR is reviewed, approved, and merged, a new job will be triggered, running the GitHub Action to apply the changes to the production database:

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-twin-deploy-workflow/ad4nxfszjdgbqdusauhy5w-mdxpqnjf3mo7jqchya8hiyjhlhwkrb-4xcldzf-azbjmezcwigdkcdpw84fywfd16r4k7nyqfs5md7sl9xlushirtguakqc7phaefy1gwzzohvmsuac5ncx55cch7bk9qfuxqzuj-c73fac5a.png)

By inspecting the steps of the job, you can see the name(s) of the migration files that have been picked up by the diff.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-twin-deploy-workflow/ad4nxfscmnxwmcuo1ktqnqgimacllr8-m1noidsabc1nyjgjgpycvs-xzzpebkhcdvt5m2qkk8k8suz8zpn8osl3gicigywetim4kblqsiysj7q1kgpt21z-fdncjfvxyvmld4-ugy6pr92fwwdv-i9-x7nw-4ba584f7.png)

When the job completes successfully, you should see the changes applied to your production database.

In our case, using `psql`, we can run `\\d users` to see the schema for our `users` table, which shows the new flag column has been added:

```bash
| Column     | Column                 | Collation |<br>| ---------- | ---------------------- | --------- |<br>| id         | integer                | not null  |<br>| first_name | character varying(255) | not null  |<br>| last_name  | character varying(255) | not null  |<br>| email      | character varying(255) | not null  |<br>| country    | character varying(255) | not null  |<br>| flag       | character varying(255) |           | # [!code ++]
```

## Method 2: Using Prisma with GitHub Actions to run migrations

For this example we’ve prepared an example repository where migrations are managed by [Prisma](https://www.prisma.io/) and applied by a GitHub Action that runs when a branch is merged into main.

**👉 Example repo:** [neon-twin-prisma-migrations](https://github.com/neondatabase/neon-twin-prisma-migrations)

- PR #1: [https://github.com/neondatabase/neon-twin-prisma-migrations/pull/1/files](https://github.com/neondatabase/neon-twin-prisma-migrations/pull/1/files)

### Prisma Migrations GitHub Action

This Action runs when a PR created against the main branch, has been closed, **and** the merged status is `true`.

The connection string for the database to apply the changes to has been stored as a GitHub secret and has been named `PROD_DATABASE_URL`.

To use Prisma to handle database migrations we suggest you take a look at the following pages from the Prisma documentation.

- [Add Prisma to an existing project](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/connect-your-database-typescript-postgresql)
- [Baseline your database](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/baseline-your-database-typescript-postgresql)
- [Prisma Mental model](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/mental-model)

```yaml
name: Migrate to prod (prisma)<br><br>on:<br>  pull_request:<br>    types: [closed]<br>    branches:<br>      - main<br><br>env:<br>  PROD_DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }} # Production or primary database<br>  PG_VERSION: '16'<br><br>jobs:<br>  pr-merged:<br>    runs-on: ubuntu-latest<br>    if: github.event.pull_request.merged == true # Ensure the PR was merged<br><br>    steps:<br>      - name: Checkout repository<br>        uses: actions/checkout@v4<br><br>      - name: Run Prisma Migrate<br>        run: |<br>          npx prisma migrate deploy<br>
```

This Action is significantly simpler than the SQL migration Action because Prisma is handling all of the changes that would have been created using, e.g:

```bash
npx prisma migrate dev --create-only --name name-of-migration
```

#### Checkout repository

This step allows the Action to read files from the repository.

#### Run Prisma migrate

If you’ve created a migration using the above code snippet, `prisma migrate deploy` will apply the migrations to your production database.

### Prisma Migration repository setup

Within our repository we have the standard Prisma migrations directory where Prisma creates the migration files for changes that are to be applied to the production database.

```bash
|-- .github<br>    |-- workflows<br>      |-- migrate-to-prod-prisma.yml<br>|-- prisma<br>    |-- migrations<br>        |-- 0_init<br>              |-- migration.sql<br>        |-- 20240802104019_alter_flag_varchar<br>              |-- migration.sql
```

Here’s an example of the changes we made.

```typescript
datasource db {<br>  provider = "postgresql"<br>  url      = env("PROD_DATABASE_URL")<br>}<br><br>model migrations {<br>  migration_id   Int      @id @default(autoincrement())<br>  migration_name String   @db.VarChar(255)<br>  applied_at     DateTime @default(now()) @db.Timestamp(6)<br>  status         String   @db.VarChar(50)<br>  environment    String   @db.VarChar(50)<br>}<br><br>model users {<br>  id         Int     @id @default(autoincrement())<br>  first_name String  @db.VarChar(255)<br>  last_name  String  @db.VarChar(255)<br>  email      String  @unique @db.VarChar(255)<br>  country    String  @db.VarChar(255)<br>  flag       String? @db.VarChar(255) // [!code --]<br>  flag       String? @db.VarChar(55) // [!code ++]<br>}
```

Once you’ve made the necessary changes, commit them and create a new PR ready to be merged into the main branch of your repo.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-twin-deploy-workflow/ad4nxfahyroxdgfsewk1omedyicxc1ckzlcj4zz4ocqwagvvqcdmhojttx0iynpgpknmkf4yuw0a3tzrnn29djhh8uht7txes8qg0gvhmd9zntthh8xlwrbmdu8xmqb6qj14xbwbuswysvi-bzv2mumw7knthq-18eb5fdf.png)

When the PR is reviewed/approved and merged, a new job will be started which runs the GitHub Action and applies the changes to the production database.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-twin-deploy-workflow/ad4nxfyonpgva-qpdpxbrpjeper2agsdtel5bfwjzfdczr8zky5swl3emncp0imsoovxoesltnpuwx5prj01pkag3ks5acv42kkfybqfmcpjd4dkzvkjit94okolnbb4my5bgyvv3mjay-dartqnxeaqkw9l68-12020873.png)

By inspecting the steps of the job you can see the name(s) of the migration files that will be applied to production.

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-twin-deploy-workflow/ad4nxfrspnzm74pqlz4fmqpftzykyfsy5sssltzm1adv53giczbxcs4oltvktzlgjrhahzqrm6qqjeeqdpia8coke57axt9c3qnwunzfz6xykzts5oroacrvthsgvvajwfphkbhmzco8ehfjbhg-awv651r-w-becc5f88.png)

When the job completes successfully you should see the changes that have been applied to your production database.

In our case, using `psql`, we can run `\\d users` to see the schema for our users table which shows the flag varying character length has been updated.

```bash
| Column     | Column                 | Collation |<br>| ---------- | ---------------------- | --------- |<br>| id         | integer                | not null  |<br>| first_name | character varying(255) | not null  |<br>| last_name  | character varying(255) | not null  |<br>| email      | character varying(255) | not null  |<br>| country    | character varying(255) | not null  |<br>| flag       | character varying(255) |           | # [!code --]<br>| flag       | character varying(55)  |           | # [!code ++]
```

## Syncing Production with Neon Twin

The final piece of this puzzle is to re-synchronize your production database with your Neon Twin. In a [previous post](https://neon.tech/blog/optimizing-dev-environments-in-aws-rds-with-neon-postgres-part-ii-using-github-actions-to-mirror-rds-in-neon) we explained how to perform a dump/restore using a scheduled GitHub Action, for this workflow we’ll use a similar approach but rather than the dump/restore running on a schedule, it’ll run after production migrations have been applied.

For either of the above Actions you could add the following which will perform a fresh dump/restore from your production database back to your Neon Twin.

```yaml
name: Migrate to prod (...)<br><br>on:<br>  pull_request:<br>    types: [closed]<br>    branches:<br>      - main<br><br>env:<br>  PROD_DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }} # Production or primary database<br>  DEV_DATABASE_URL: ${{ secrets.DEV_DATABASE_URL }} # Development database # [!code ++]<br>  PG_VERSION: '16'<br><br>jobs:<br>  pr-merged:<br>    runs-on: ubuntu-latest<br>    if: github.event.pull_request.merged == true # Ensure the PR was merged<br><br>    steps:       ...<br><br> dump-and-restore: # [!code ++]<br>  runs-on: ubuntu-latest # [!code ++]<br><br>  steps: # [!code ++]<br>    - name: Install PostgreSQL # [!code ++]<br>      run: | # [!code ++]<br>        sudo apt update # [!code ++]<br>        yes '' | sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh # [!code ++]<br>        sudo apt install -y postgresql-${{ env.PG_VERSION }} # [!code ++]<br><br>    - name: Dump from RDS and Restore to Neon # [!code ++]<br>      run: | # [!code ++]<br>        /usr/lib/postgresql/${{ env.PG_VERSION }}/bin/pg_dump "${{ env.PROD_DATABASE_URL }}" -Fc -f "${{ github.workspace }}/prod-dump-file.dump" # [!code ++]<br>        /usr/lib/postgresql/${{ env.PG_VERSION }}/bin/pg_restore -d "${{ env.DEV_DATABASE_URL }}" --clean --no-owner --no-acl --if-exists "${{ github.workspace }}/prod-dump-file.dump" # [!code ++]
```

## Finished

And that just about wraps things up. This completes our series on how to use Neon for development. If you missed the first three articles, here are the links again.

1. [Optimize your AWS RDS Dev Environments with Neon Postgres](https://neon.tech/blog/development-environments-for-aws-rds-using-neon-postgres)
2. [Neon Twin: Move Dev/Test/Staging to Neon, Keep Production on RDS](https://neon.tech/blog/optimizing-dev-environments-in-aws-rds-with-neon-postgres-part-ii-using-github-actions-to-mirror-rds-in-neon)
3. [Building Slack notifications to monitor pg_dump and restore workflows](https://neon.tech/blog/building-slack-notifications-to-monitor-pg_dump-and-restore-workflows)
