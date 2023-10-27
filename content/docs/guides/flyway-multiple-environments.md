---
title: Get started with Flyway and Neon
subtitle: Learn how to manage schema changes in Neon with the Flyway command-line tool
enableTableOfContents: true
---

Flyway is a database migration tool that facilitates version control for databases. It allows developers to manage and track changes to the database schema, ensuring that the database evolves consistently across different environments.

When automating releases, there are often multiple environments or a chain of environments that changes must be delivered to, in order. Such environments might include _development_, _staging_, and _production_.

Neon's branching feature allows you to instantly create a branch of your database for different environments. In this guide, we'll show you how to use Neon's branching feature to spin up a branch for each environment and how to configure Flyway to manage schema changes across those environments.

## Prerequisites

- A flyway installation. See [Get started with Flyway and Neon](/doscs/guides/flyway) for installation instructions.
- A Neon account. See [Sign up](/docs/get-started-with-neon/signing-up).
- A Neon project. See [Create your first project](/docs/get-started-with-neon/setting-up-a-project).
- A database. This guide uses the ready-to-use `neondb` database on the `main` branch of your Neon project. You can create your own database if you like. See [Create a database](/docs/manage/databases#create-a-database) for instructions.

## Add a table to your database

Let's start by adding a table to your `neondb` database on the `main` branch of your Neon project so that you have something to work with. We'll consider this your _production_ environment database.

Open the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor), and run the following statement:

```bash
create table person (
    ID int not null,
    NAME varchar(100) not null
);
```

## Create databases for development and staging

Using Neon's branching feature, create your _development_ and _staging_ databases. When you create a branch in Neon, you are creating a copy-on-write clone of the parent branch that incudes all databases and roles that exist on the parent branch, and each branch is an isolated Postgres instance with it's own compute resources.

Perform these steps twice, once for your _development_ branch and once for your _staging_ branch.

1. In the Neon Console, select a project.
2. Select **Branches**.
3. Click **New Branch** to open the branch creation dialog.
![Create branch dialog](/docs/manage/create_branch.png)
4. Enter a name for the branch. For example, name the branch for the environment (_development_ or _staging_).
5. Select a parent branch. Select the branch where you created the `person` table.
6. Select the **Head** option to create a branch with data up to the current point in time (the default).
7. Select whether or not to create a compute endpoint, which is required to connect to the branch. In this case, you want to connect to the branch, so leave the default setting that creates a compute endpoint.
8. Click **Create Branch** to create your branch.

## Retrieve your Neon database connection strings

From the Neon **Dashboard**, retrieve the connection string for each branch (`main`, `development`, and `staging`) from the **Connection Details** widget.

Your connection strings should look something like the ones shown below. Note that the hostname differs for each (the part starting with `ep-` and ending with `aws.neon.tech`). That's because each branch is hosted on its own compute instance.

- `main`:

    <CodeBlock shouldWrap>

    ```bash
    jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?user=alex&password=AbC123dEf
    ```

    </CodeBlock>

- `Development`:

    <CodeBlock shouldWrap>

    ```bash
    jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?user=alex&password=AbC123dEf
    ```

    </CodeBlock>

- `Staging`

    <CodeBlock shouldWrap>

    ```bash
    jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?user=alex&password=AbC123dEf
    ```

    </CodeBlock>

## Configure flyway to connect each environment

To enable Flyway to connect to multiple environment environment, we'll create configuration files for each with the environment-specific connection details. When running Flyway from the command-line, you'll' specify the configuration file to be used.

<Admonition type="note">
By default, Flyway loads its configuration from the default `conf/flyway.conf` file. This is true even if you specify another configuration file when running Flyway from the command line. You can take advantage of this behavior by defining  your non-environment specific configuration settings in the `conf/flyway.conf` file, and your environment-specific settings in separate configuration files, as we'll do here.
</Admonition>

1. Create the following files in your `/conf/flyway`, one for each environment:

    ```bash
    cd ~/flyway-9.22.3/conf
    cp flyway.conf env_dev.conf
    cp flyway.conf env_staging.conf
    cp flyway.conf env_prod.conf
    ```

2. In each configuration file, uncomment and update the following items with the correct connection details for the database environment. The `url` setting will differ for each environment. In this example, where you are the only user, the `user` and `password` should remain the same.

    <CodeBlock shouldWrap>

    ```bash
    flyway.url=jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/neondb

    flyway.user=alex

    flyway.password=AbC123dEf

    flyway.locations=filesystem:/home/alex/flyway-9.22.3/sql
    ```

    </CodeBlock>

## Create a migration

Create a migration file called `V2__Add_people.sql` and add it to your Flyway `/sql` directory, and then add the following statements:

```bash
insert into person (ID, NAME) values (1, 'Alex');
insert into person (ID, NAME) values (2, 'Mr. Lopez');
insert into person (ID, NAME) values (3, 'Ms. Smith');
```

### Run the migration on your development environment

Run the migration on each environment, in order, by specifying the environment's configuration file in the `flyway migrate` command:

```bash
flyway migrate -configFiles=".\conf\env_dev.conf
```

If the command was successful, you’ll see output similar to the following:

```bash
Database: jdbc:postgresql://ep-red-credit-85617375.us-east-2.aws.neon.tech/neondb (PostgreSQL 15.4)
Successfully validated 2 migrations (execution time 00:00.225s)
Current version of schema "public": 1
Migrating schema "public" to version "2 - Add people"
Successfully applied 1 migration to schema "public", now at version v2 (execution time 00:00.388s)
A Flyway report has been generated here: /home/alex/flyway-9.22.3/sql/report.html
```

### Run the migration on your staging environment

```bash
flyway migrate -configFiles=".\conf\env_staging.conf
```

If the command was successful, you’ll see output similar to the following:

```bash
Database: jdbc:postgresql://ep-red-credit-85617375.us-east-2.aws.neon.tech/neondb (PostgreSQL 15.4)
Successfully validated 2 migrations (execution time 00:00.225s)
Current version of schema "public": 1
Migrating schema "public" to version "2 - Add people"
Successfully applied 1 migration to schema "public", now at version v2 (execution time 00:00.388s)
A Flyway report has been generated here: /home/alex/flyway-9.22.3/sql/report.html
```

### Run the migration on your product environment

```bash
flyway migrate -configFiles=".\conf\env_staging.conf
```

If the command was successful, you’ll see output similar to the following:

```bash
Database: jdbc:postgresql://ep-red-credit-85617375.us-east-2.aws.neon.tech/neondb (PostgreSQL 15.4)
Successfully validated 2 migrations (execution time 00:00.225s)
Current version of schema "public": 1
Migrating schema "public" to version "2 - Add people"
Successfully applied 1 migration to schema "public", now at version v2 (execution time 00:00.388s)
A Flyway report has been generated here: /home/alex/flyway-9.22.3/sql/report.html
```

You can verify that the data was added to each branch by viewing the branch and table on the **Tables** page in the Neon console. Select **Tables** from the sidebar and select your database.

## Conclusion

You've seen how you can instantly create new database environment with Neon's branching feature and how to manage schema changes across environments using Flyway. The steps in this guide were performed manually from the command line but could easily be automated. Neon provides a CLI and API for creating and managing branches, which you can also integrate into your release automation.

## References

- [Flyway documentation](https://documentation.red-gate.com/fd/flyway-documentation-138346877.html)
- [Flyway command-line tool](https://documentation.red-gate.com/fd/command-line-184127404.html)
- [Flyway command-line quickstart](https://documentation.red-gate.com/fd/quickstart-command-line-184127576.html)
- [A simple way to manage multi-environment deployments](https://flywaydb.org/blog/a-simple-way-to-manage-multi-environment-deployments)
