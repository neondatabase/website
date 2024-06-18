---
title: Get started with Flyway and Neon
subtitle: Learn how to manage schema changes in Neon with Flyway
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.391Z'
---

Flyway is a database migration tool that facilitates version control for databases. It allows developers to manage and track changes to the database schema, ensuring that the database evolves consistently across different environments.

This guide steps you through installing the Flyway command-line tool, configuring Flyway to connect to a Neon database, and running database migrations. The guide follows the setup described in the [Flyway command-line quickstart](https://documentation.red-gate.com/fd/quickstart-command-line-184127576.html).

## Prerequisites

- A Neon account. See [Sign up](/docs/get-started-with-neon/signing-up).
- A Neon project. See [Create your first project](/docs/get-started-with-neon/setting-up-a-project).
- A database. This guide uses the ready-to-use `neondb` database. You can create your own database if you like. See [Create a database](/docs/manage/databases#create-a-database) for instructions.

## Download and extract Flyway

1. Download the latest version of the [Flyway command-line tool](https://documentation.red-gate.com/fd/command-line-184127404.html).

2. Extract the Flyway files. For example:

   ```bash
   cd ~/Downloads
   tar -xzvf flyway-commandline-x.y.z-linux-x64.tar.gz -C ~/
   ```

3. Open a command prompt to view the contents of your Flyway installation:

   ```bash
   cd ~/flyway-x.y.z
   ls
   assets  drivers  flyway.cmd  jre  licenses    rules
   conf    flyway   jars        lib  README.txt  sql
   ```

## Set your path variable

Add the Flyway directory to your `PATH` so that you can execute Flyway commands from any location.

<CodeTabs labels={["bash", "zsh"]}>

```bash
echo 'export PATH=$PATH:~/flyway-x.y.z' >> ~/.bashrc
source ~/.bashrc
```

```zsh
echo 'export PATH=$PATH:~/flyway-x.y.x' >> ~/.zshrc
source ~/.zshrc
```

</CodeTabs>

## Retrieve your Neon database connection string

From the Neon **Dashboard**, retrieve your password and a Java connection string from the **Connection Details** widget.

Your Java connection string should look something like this:

```bash shouldWrap
jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?user=alex&password=AbC123dEf
```

## Configure flyway

To configure Flyway to connect to your Neon database, create a `flyway.conf` file in the /conf directory. Include the following items, modified to use the connection details you retrieved in the previous step.

```bash shouldWrap
flyway.url=jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/neondb

flyway.user=alex

flyway.password=AbC123dEf

flyway.locations=filesystem:/home/alex/flyway-x.y.z/sql
```

## Create the first migration

Create an `sql` directory to hold your first migration file. We'll name the file `V1__Create_person_table.sql` and include the following command, which creates a person table in your database.

```bash
create table person (
    ID int not null,
    NAME varchar(100) not null
);
```

## Migrate the database

Run the `flyway migrate` command to migrate your database:

```bash
flyway migrate
```

If the command was successful, you’ll see output similar to the following:

```bash
Database: jdbc:sqlite:FlywayQuickStartCLI.db (SQLite 3.41)
Successfully validated 1 migration (execution time 00:00.008s)
Creating Schema History table: "PUBLIC"."flyway_schema_history"
Current version of schema "PUBLIC": << Empty Schema >>
Migrating schema "PUBLIC" to version 1 - Create person table
Successfully applied 1 migration to schema "PUBLIC" (execution time 00:00.033s)
```

To verify that the `person` table was created, you can view it on the **Tables** page in the Neon Console. Select **Tables** from the sidebar and select your database.

## Add a second migration

Run another migration to add data to the table. Add a second migration file to the `/sql` directory called `V2__Add_people.sql` and add the following statements:

```bash
insert into person (ID, NAME) values (1, 'Alex');
insert into person (ID, NAME) values (2, 'Mr. Lopez');
insert into person (ID, NAME) values (3, 'Ms. Smith');
```

Run the migration:

```bash
flyway migrate
```

If the command was successful, you’ll see output similar to the following:

```bash
Database: jdbc:postgresql://ep-red-credit-85617375.us-east-2.aws.neon.tech/neondb (PostgreSQL 15.4)
Successfully validated 2 migrations (execution time 00:00.225s)
Current version of schema "public": 1
Migrating schema "public" to version "2 - Add people"
Successfully applied 1 migration to schema "public", now at version v2 (execution time 00:00.388s)
A Flyway report has been generated here: /home/alex/flyway-x.y.z/sql/report.html
```

You can verify that the data was added by viewing the table on the **Tables** page in the Neon Console. Select **Tables** from the sidebar and select your database.

## View your schema migration history

When you run the `flyway migrate` command, Flyway registers the schema changes in the `flyway_schema_history` table, which Flyway automatically creates in your database. You can view the table by running the [flyway info](https://documentation.red-gate.com/fd/command-line-info-184127413.html) command.

```bash
flyway info
Database: jdbc:postgresql://ep-red-credit-85617375.us-east-2.aws.neon.tech/neondb (PostgreSQL 15.4)
Schema version: 2
+-----------+---------+---------------------+------+---------------------+---------+----------+
| Category  | Version | Description         | Type | Installed On        | State   | Undoable |
+-----------+---------+---------------------+------+---------------------+---------+----------+
| Versioned | 1       | Create person table | SQL  | 2023-10-22 19:00:39 | Success | No       |
| Versioned | 2       | Add people          | SQL  | 2023-10-22 19:04:42 | Success | No       |
+-----------+---------+---------------------+------+---------------------+---------+----------+
A Flyway report has been generated here: /home/alex/flyway-x.y.z/sql/report.html
```

You can also view the table on the **Tables** page in the Neon Console. Select **Tables** from the sidebar and select your database.

## Next steps

Learn how you can use Flyway with multiple database environments. See [Use Flyway with multiple database environments](/docs/guides/flyway-multiple-environments).

## References

- [Flyway documentation](https://documentation.red-gate.com/fd/flyway-documentation-138346877.html)
- [Flyway command-line tool](https://documentation.red-gate.com/fd/command-line-184127404.html)
- [Flyway command-line quickstart](https://documentation.red-gate.com/fd/quickstart-command-line-184127576.html)
