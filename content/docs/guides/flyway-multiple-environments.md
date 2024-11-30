---
title: Manage multiple database environments
subtitle: Learn how to manage schemas for multiple database environments with Flyway
enableTableOfContents: true
updatedOn: '2024-07-25T12:53:42.426Z'
---

With Flyway, you can manage and track changes to your database schema, ensuring that the database evolves consistently across different environments.

When automating releases, there are often multiple environments or a chain of environments that you must deliver changes to in a particular order. Such environments might include _development_, _staging_, and _production_.

In this guide, we'll show you how to use Neon's branching feature to spin up a branch for each environment and how to configure Flyway to manage schema changes across those environments.

## Prerequisites

- A flyway installation. See [Get started with Flyway and Neon](/docs/guides/flyway) for installation instructions.
- A Neon account and project. See [Sign up](/docs/get-started-with-neon/signing-up).
- A database. This guide uses the ready-to-use `neondb` database on the `main` branch of your Neon project. You can create your own database if you like. See [Create a database](/docs/manage/databases#create-a-database) for instructions.

## Add a table to your database

Set up a database to work with by adding a table to your `neondb` database on the `main` branch of your Neon project. If you completed [Get started with Flyway and Neon](/docs/guides/flyway), you might already have this `person` table created. We'll consider this your _production_ environment database.

If you still need to create the `person` table, open the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor), and run the following statement:

```bash
create table person (
    ID int not null,
    NAME varchar(100) not null
);
```

## Create databases for development and staging

Using Neon's branching feature, create your _development_ and _staging_ databases. When you create a branch in Neon, you are creating a copy-on-write clone of the parent branch that incudes all databases and roles that exist on the parent, and each branch is an isolated Postgres instance with its own compute resources.

Perform these steps twice, once for your _development_ branch and once for your _staging_ branch.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>
1. In the Neon Console, select your project.
2. Select **Branches**.
3. Click **New Branch** to open the branch creation dialog.
4. Enter a name for the branch. For example, name the branch for the environment (_development_ or _staging_).
5. Select a parent branch. This should be the branch where you created the `person` table.
6. Leave the other default settings and click **Create Branch**.
</TabItem>

<TabItem>

```bash showLineNumbers
neon branches create --name development
```

</TabItem>

<TabItem>

```bash showLineNumbers
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/{project_id}/branches \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API" \
     --header 'Content-Type: application/json' \
     --data '
{
  "branch": {
    "name": "development"
  },
  "endpoints": [
    {
      "type": "read_only"
    }
  ]
}
' | jq
```

</TabItem>

</Tabs>

When you are finished, you should have a _development_ branch and a _staging_ branch.

## Retrieve your Neon database connection strings

From the Neon **Dashboard**, retrieve the connection string for each branch (`main`, `development`, and `staging`) from the **Connection Details** widget. Use the **Branch** drop-down menu to select each branch before copying the connection string.

Your connection strings should look something like the ones shown below. Note that the hostname differs for each (the part starting with `ep-` and ending with `aws.neon.tech`). That's because each branch is hosted on its own compute.

- **main**

  ```bash shouldWrap
  jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?user=alex&password=AbC123dEf
  ```

- **development**

  ```bash shouldWrap
  jdbc:postgresql://ep-mute-night-47642501.us-east-2.aws.neon.tech/neondb?user=alex&password=AbC123dEf
  ```

- **staging**

  ```bash shouldWrap
  jdbc:postgresql://ep-shrill-shape-27763949.us-east-2.aws.neon.tech/neondb?user=alex&password=AbC123dEf
  ```

## Configure flyway to connect each environment

To enable Flyway to connect to multiple environments, we'll create a configuration file for each environment and add the environment-specific connection details. When running Flyway, you'll specify the configuration file to be used.

<Admonition type="note">
By default, Flyway loads its configuration from the default `conf/flyway.conf` file. This is true even if you specify another configuration file when running Flyway. You can take advantage of this behavior by defining non-environment specific configuration settings in the default `conf/flyway.conf` file, and placing your environment-specific settings in separate configuration files, as we'll do here.
</Admonition>

1. Switch to your Flyway `/conf` directory and create the following configuration files, one for each environment, by copying the default configuration file. For example:

   ```bash
   cd ~/flyway-x.y.z/conf
   cp flyway.conf env_dev.conf
   cp flyway.conf env_staging.conf
   cp flyway.conf env_prod.conf
   ```

2. In each configuration file, update the following items with the correct connection details for that database environment. The `url` setting will differ for each environment (in `env_prod.conf`, the `url` will point to `main`). In this example, where you are the only user, the `user` and `password` settings should be the same for each of your three database environments.

   ```bash shouldWrap
   flyway.url=jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/neondb

   flyway.user=alex

   flyway.password=AbC123dEf

   flyway.locations=filesystem:/home/alex/flyway-x.y.z/sql

   flyway.baselineOnMigrate=true
   ```

   - The `flyway.locations` setting tells Flyway where to look for your migration files. We'll create them in the `/sql` directory in a later step.
   - The `flyway.baselineOnMigrate=true` setting tells Flyway to perform a baseline action when you run the `migrate` command on a non-empty schema with no Flyway schema history table. The schema will then be initialized with the `baselineVersion` before executing migrations. Only migrations above the `baselineVersion` will then be applied. This is useful for initial Flyway deployments on projects with an existing database. You can disable this setting by commenting it out again or setting it to false after applying your first migration on the database.

## Create a migration

Create a migration file called `V2__Add_people.sql`, add it to your Flyway `/sql` directory, and add the following statements to the file:

```bash
insert into person (ID, NAME) values (1, 'Alex');
insert into person (ID, NAME) values (2, 'Mr. Lopez');
insert into person (ID, NAME) values (3, 'Ms. Smith');
```

### Run the migration on each environment

Run the migration on each environment in order by specifying the environment's configuration file in the `flyway migrate` command. You'll start with your `development` environment, then `staging`, and then finally, `production`.

<Tabs labels={["Development", "Staging", "Production"]}>

<TabItem>

```bash showLineNumbers
flyway migrate -configFiles="conf/env_dev.conf"
```

</TabItem>

<TabItem>

```bash showLineNumbers
flyway migrate -configFiles="conf/env_staging.conf"
```

</TabItem>

<TabItem>

```bash showLineNumbers
flyway migrate -configFiles="conf/env_prod.conf"
```

</TabItem>

</Tabs>

A successful migration command returns output similar to the following:

```bash
Database: jdbc:postgresql://ep-nameless-unit-49929920.us-east-2.aws.neon.tech/neondb (PostgreSQL 15.4)
Schema history table "public"."flyway_schema_history" does not exist yet
Successfully validated 1 migration (execution time 00:00.199s)
Creating Schema History table "public"."flyway_schema_history" with baseline ...
Successfully baselined schema with version: 1
Current version of schema "public": 1
Migrating schema "public" to version "2 - Add people"
Successfully applied 1 migration to schema "public", now at version v2 (execution time 00:00.410s)
A Flyway report has been generated here: /home/alex/flyway-x.y.z/report.html
```

After you run the migration commands, your database should be consistent across all three environments. You can verify that the data was added to each database by viewing the branch and table on the **Tables** page in the Neon Console. Select **Tables** from the sidebar and select your database.

## Conclusion

You've seen how you can instantly create new database environment with Neon's branching feature and how to keep schemas consistent across different environments using Flyway. The steps in this guide were performed manually from the command line but could be easily integrated into your release management pipeline. Neon provides a [CLI](/docs/reference/neon-cli) and [API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) for automating various tasks in Neon, such as branch creation, which you can also integrate into your release automation.

## References

- [Flyway documentation](https://documentation.red-gate.com/fd/flyway-documentation-138346877.html)
- [Flyway command-line tool](https://documentation.red-gate.com/fd/command-line-184127404.html)
- [Flyway command-line quickstart](https://documentation.red-gate.com/fd/quickstart-command-line-184127576.html)
- [A simple way to manage multi-environment deployments](https://flywaydb.org/blog/a-simple-way-to-manage-multi-environment-deployments)
