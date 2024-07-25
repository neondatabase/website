---
title: Liquibase developer workflow with Neon
subtitle: Implement a developer workflow with Liquibase and Neon branching
enableTableOfContents: true
updatedOn: '2024-07-25T12:53:42.427Z'
---

Liquibase is an open-source database-independent library for tracking, managing, and applying database schema changes. To learn more about Liquibase, refer to the [Liquibase documentation](https://docs.liquibase.com/home.html).

This guide shows how to set up a developer workflow using Liquibase with Neon's branching feature. The workflow involves making schema changes to a database on a development branch and applying those changes back to the source database on the main branch of your Neon project.

The instructions in this guide are based on the workflow described in the [Liquibase Developer Workflow](https://www.liquibase.org/get-started/developer-workflow) tutorial.

## Prerequisites

- A Neon account. See [Sign up](/docs/get-started-with-neon/signing-up).
- A Neon project. See [Create your first project](/docs/get-started-with-neon/setting-up-a-project).
- Liquibase requires Java. For Liquibase Java requirements, see [Requirements](https://docs.liquibase.com/start/install/liquibase-requirements.html). To check if you have Java installed, run `java --version`, or `java -version` on macOS`.
- An installation of Liquibase. For instructions, refer to [Get started with Liquibase and Neon](/docs/guides/liquibase).

## Initialize a new Liquibase project

Run the [init project](https://docs.liquibase.com/commands/init/project.html) command to initialize a Liquibase project in the specified directory. The project directory is created if it does not exist. Initializing a Liquibase project in this way provides you with a pre-populated Liquibase properties file, which we'll modify in a later step.

```bash
liquibase init project --project-dir ~/blogdb
```

Enter `Y` to accept the defaults.

## Prepare a source database

For demonstration purposes, create a `blog` database in Neon with two tables, `posts` and `authors`.

1. Open the [Neon Console](https://console.neon.tech/app/projects).
1. Select your project.
1. Select **Databases** from the sidebar and create a database named `blog`. For instructions, see [Create a database](/docs/manage/databases#create-a-database).
1. Using the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor), add the following tables:

   ```sql
   -- Creating the `authors` table
   CREATE TABLE authors (
       author_id SERIAL PRIMARY KEY,
       first_name VARCHAR(100),
       last_name VARCHAR(100),
       email VARCHAR(255) UNIQUE NOT NULL,
       bio TEXT
   );

   -- Creating the `posts` table
   CREATE TABLE posts (
       post_id SERIAL PRIMARY KEY,
       author_id INTEGER REFERENCES authors(author_id),
       title VARCHAR(255) NOT NULL,
       content TEXT,
       published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

## Prepare a development database

Now, let's prepare a development database in Neon by creating a development branch, where you can safely make changes to your database schema without affecting the source database on your `main` branch. A branch is a copy-on-write clone of the data in your Neon project, so it will include a copy of the `blog` database with the `authors` and `posts` tables that you just created.

To create a branch:

1. In the Neon Console, select **Branches**. You will see your `main` branch, where you just created your `blog` database and tables.
2. Click **New Branch** to open the branch creation dialog.
3. Enter a name for the branch. Let's call it `dev1`.
4. Leave `main` selected as the parent branch. This is where you created the `blog` database.
5. Leave the remaining default settings. Creating a branch from **Head** creates a branch with the latest data, and a compute is required to connect to the database on the branch.
6. Click **Create Branch** to create your branch.

## Retrieve your Neon database connection strings

From the [Neon Console](https://console.neon.tech/app/projects), select your project and retrieve connection strings for your target and source databases from the **Connection Details** widget on the Neon **Dashboard**.

<Admonition type="note">
The target database is the database on your `dev1` branch where you will will do your development work. Your source database is where you will apply your schema changes later, once you are satisfied with the changes on your development branch.
</Admonition>

1. Select the `dev1` branch, the `blog` database, and copy the connection string.

   ```bash
   postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/blog
   ```

2. Select the `main` branch, the `blog` database, and copy the connection string.

   ```bash
   postgres://alex:AbC123dEf@ep-silent-hill-85675036.us-east-2.aws.neon.tech/blog
   ```

Be careful not to mix up your connection strings. You'll see that the hostname (the part starting with `-ep` and ending in `neon.tech`) differs. This is because the `dev1` branch is a separate instance of Postgres, hosted on its own compute.

## Update your liquibase.properties file

The `liquibase.properties` file defines the location of the Liquibase changelog file and your target and source databases.

1. From your Liquibase project directory, open the `liquibase.properties` file, which comes pre-populated with example settings.

2. Change the `changeLogFile` setting as shown:

   ```bash
   changeLogFile=dbchangelog.xml
   ```

   The [changelog file](https://docs.liquibase.com/parameters/changelog-file.html) is where you define database schema changes (changesets).

3. Change the target database `url`, `username`, and `password` settings to the correct values for the `blog` database on your `dev1` branch. You can obtain the required details from the connection string you copied previously. You will need to swap out the hostname (`ep-silent-hill-85675036.us-east-2.aws.neon.tech`), username, and password for your own.

   ```bash shouldWrap
   liquibase.command.url=jdbc:postgresql://ep-silent-hill-85675036.us-east-2.aws.neon.tech:5432/blog

   liquibase.command.username: alex

   liquibase.command.password: AbC123dEf
   ```

4. Change the source database settings to the correct values for the `blog` database on your `main` branch. The username and password will be the same as your `dev1` branch, but make sure to use the right hostname. Copy the snippet below and replace the hostname (`ep-cool-darkness-123456.us-east-2.aws.neon.tech`), username, and password for your own.

   ```bash shouldWrap
   liquibase.command.referenceUrl: jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/blog

   liquibase.command.referenceUsername: alex

   liquibase.command.referencePassword: AbC123dEf
   ```

## Take a snapshot of your target database

Capture the current state of your target database. The following command creates a Liquibase changelog file named `mydatabase_changelog.xml`.

```bash
liquibase --changeLogFile=mydatabase_changelog.xml generateChangeLog
```

If the command was successful, you’ll see output similar to the following:

```bash
Starting Liquibase at 09:23:33 (version 4.24.0 #14062 built at 2023-09-28 12:18+0000)
Liquibase Version: 4.24.0
Liquibase Open Source 4.24.0 by Liquibase
BEST PRACTICE: The changelog generated by diffChangeLog/generateChangeLog should be inspected for correctness and completeness before being deployed. Some database objects and their dependencies cannot be represented automatically, and they may need to be manually updated before being deployed.
Generated changelog written to mydatabase_changelog.xml
Liquibase command 'generateChangelog' was executed successfully.
```

Check for the `mydatabase_changelog.xml` file in your Liquibase project directory. It should look something like this:

```xml
<?xml version="1.1" encoding="UTF-8" standalone="no"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog" xmlns:ext="http://www.liquibase.org/xml/ns/dbchangelog-ext" xmlns:pro="http://www.liquibase.org/xml/ns/pro" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog-ext http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-ext.xsd http://www.liquibase.org/xml/ns/pro http://www.liquibase.org/xml/ns/pro/liquibase-pro-latest.xsd http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd">
    <changeSet author="alex (generated)" id="1697977416317-1">
        <createTable tableName="authors">
            <column autoIncrement="true" name="author_id" type="INTEGER">
                <constraints nullable="false" primaryKey="true" primaryKeyName="authors_pkey"/>
            </column>
            <column name="first_name" type="VARCHAR(100)"/>
            <column name="last_name" type="VARCHAR(100)"/>
            <column name="email" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="bio" type="TEXT"/>
        </createTable>
    </changeSet>
    <changeSet author="alex (generated)" id="1697977416317-2">
        <createTable tableName="posts">
            <column autoIncrement="true" name="post_id" type="INTEGER">
                <constraints nullable="false" primaryKey="true" primaryKeyName="posts_pkey"/>
            </column>
            <column name="author_id" type="INTEGER"/>
            <column name="title" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="content" type="TEXT"/>
            <column defaultValueComputed="CURRENT_TIMESTAMP" name="published_date" type="TIMESTAMP WITHOUT TIME ZONE"/>
        </createTable>
    </changeSet>
    <changeSet author="alex (generated)" id="1697977416317-3">
        <addUniqueConstraint columnNames="email" constraintName="authors_email_key" tableName="authors"/>
    </changeSet>
    <changeSet author="alex (generated)" id="1697977416317-4">
        <addForeignKeyConstraint baseColumnNames="author_id" baseTableName="posts" constraintName="posts_author_id_fkey" deferrable="false" initiallyDeferred="false" onDelete="NO ACTION" onUpdate="NO ACTION" referencedColumnNames="author_id" referencedTableName="authors" validate="true"/>
    </changeSet>
</databaseChangeLog>
```

## Create a schema change

Now, you can start making database schema changes by creating [changesets](https://docs.liquibase.com/concepts/changelogs/changeset.html) and adding them to the changelog file you defined in your `liquibase.properties` file. A changeset is the basic unit of change in Liquibase.

1. Create the changelog file where you will add your schema changes:

   ```bash
   cd ~/blogdb
   touch dbchangelog.xml
   ```

2. Add the following changeset to the `dbchangelog.xml` file, which adds a `comments` table to your database:

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <databaseChangeLog
   xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xmlns:pro="http://www.liquibase.org/xml/ns/pro"
   xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.4.xsd
       http://www.liquibase.org/xml/ns/pro http://www.liquibase.org/xml/ns/pro/liquibase-pro-4.5.xsd">
       <changeSet author="alex" id="myIDNumber1234">
           <createTable tableName="comments">
               <column autoIncrement="true" name="comment_id" type="INTEGER">
                   <constraints nullable="false" primaryKey="true" primaryKeyName="comments_pkey"/>
               </column>
               <column name="post_id" type="INTEGER">
                   <constraints nullable="false" foreignKeyName="fk_comments_post_id" referencedTableName="posts" referencedColumnNames="post_id"/>
               </column>
               <column name="author_id" type="INTEGER">
                   <constraints nullable="false" foreignKeyName="fk_comments_author_id" referencedTableName="authors" referencedColumnNames="author_id"/>
               </column>
               <column name="comment" type="TEXT"/>
               <column name="commented_date" type="TIMESTAMP" defaultValueComputed="CURRENT_TIMESTAMP"/>
           </createTable>
       </changeSet>
   </databaseChangeLog>
   ```

### Deploy the schema change

Run the [update](https://docs.liquibase.com/commands/update/update.html) command to deploy the schema change to your target database (your development database on the `dev1` branch).

```bash
liquibase update
```

If the command was successful, you’ll see output similar to the following:

```bash
Starting Liquibase at 10:11:35 (version 4.24.0 #14062 built at 2023-09-28 12:18+0000)
Liquibase Version: 4.24.0
Liquibase Open Source 4.24.0 by Liquibase
Running Changeset: dbchangelog.xml::myIDNumber1234::alex

UPDATE SUMMARY
Run:                          1
Previously run:               0
Filtered out:                 0
-------------------------------
Total change sets:            1

Liquibase: Update has been successful. Rows affected: 1
Liquibase command 'update' was executed successfully.
```

<Admonition type="info">
When you run a changeset for the first time, Liquibase automatically creates two tracking tables in your database:

- [databasechangelog](https://docs.liquibase.com/concepts/tracking-tables/databasechangelog-table.html): Tracks which changesets have been run.
- [databasechangeloglock](https://docs.liquibase.com/concepts/tracking-tables/databasechangeloglock-table.html): Ensures only one instance of Liquibase runs at a time.

You can verify these tables were created by viewing the `blog` database on your `dev1` branch on the **Tables** page in the Neon Console. Select **Tables** from the sidebar.
</Admonition>

At this point, you can continue to iterate, applying schema changes to your database, until you are satisfied with the modified schema.

### Review schema changes

It is a best practice to review schema changes before saving and applying them to your source database.

You can run the [status](https://docs.liquibase.com/commands/change-tracking/status.html) command to see if there are any changesets that haven't been applied to the source database. Notice that the command specifies the hostname of the source database:

```bash shouldWrap
liquibase --url=jdbc:postgresql://ep-rapid-bush-01185324.us-east-2.aws.neon.tech:5432/blog status --verbose
```

<details>
<summary>Command output</summary>

If the command was successful, you’ll see output similar to the following indicating that there is one changeset that has not been applied to the source database. This is your `comments` table changeset.

```bash
Starting Liquibase at 12:30:51 (version 4.24.0 #14062 built at 2023-09-28 12:18+0000)
Liquibase Version: 4.24.0
Liquibase Open Source 4.24.0 by Liquibase
1 changesets have not been applied to alex@jdbc:postgresql://ep-rapid-bush-01185324.us-east-2.aws.neon.tech:5432/blog
     dbchangelog.xml::myIDNumber1234::alex
Liquibase command 'status' was executed successfully.
```

</details>

### Check your SQL

Before applying the update, you can run the [updateSQL](https://docs.liquibase.com/commands/update/update-sql.html) command to inspect the SQL Liquibase will apply when running the update command:

```bash shouldWrap
liquibase --url=jdbc:postgresql://ep-rapid-bush-01185324.us-east-2.aws.neon.tech:5432/blog updateSQL
```

<details>
<summary>Command output</summary>

If the command was successful, you’ll see output similar to the following, which confirms that the changeset will create a `comments` table.

```bash
Starting Liquibase at 12:32:55 (version 4.24.0 #14062 built at 2023-09-28 12:18+0000)
Liquibase Version: 4.24.0
Liquibase Open Source 4.24.0 by Liquibase
SET SEARCH_PATH TO public, "$user","public";

-- Lock Database

UPDATE public.databasechangeloglock SET LOCKED = TRUE, LOCKEDBY = 'dot-VBox (10.0.2.15)', LOCKGRANTED = NOW() WHERE ID = 1 AND LOCKED = FALSE;

SET SEARCH_PATH TO public, "$user","public";
SET SEARCH_PATH TO public, "$user","public";

-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: dbchangelog.xml
-- Ran at: 2023-10-08, 12:32 p.m.
-- Against: alex@jdbc:postgresql://ep-rapid-bush-01185324.us-east-2.aws.neon.tech:5432/blog
-- Liquibase version: 4.24.0
-- *********************************************************************

SET SEARCH_PATH TO public, "$user","public";

-- Changeset dbchangelog.xml::myIDNumber1234::alex
SET SEARCH_PATH TO public, "$user","public";

CREATE TABLE public.comments (comment_id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL, post_id INTEGER NOT NULL, author_id INTEGER NOT NULL, comment TEXT, commented_date TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(), CONSTRAINT comments_pkey PRIMARY KEY (comment_id), CONSTRAINT fk_comments_author_id FOREIGN KEY (author_id) REFERENCES public.authors(author_id), CONSTRAINT fk_comments_post_id FOREIGN KEY (post_id) REFERENCES public.posts(post_id));

INSERT INTO public.databasechangelog (ID, AUTHOR, FILENAME, DATEEXECUTED, ORDEREXECUTED, MD5SUM, DESCRIPTION, COMMENTS, EXECTYPE, CONTEXTS, LABELS, LIQUIBASE, DEPLOYMENT_ID) VALUES ('myIDNumber1234', 'AlexL', 'dbchangelog.xml', NOW(), 1, '9:788a502d77d56330d53b6b356ee205ce', 'createTable tableName=comments', '', 'EXECUTED', NULL, NULL, '4.24.0', NULL);

-- Release Database Lock
SET SEARCH_PATH TO public, "$user","public";
UPDATE public.databasechangeloglock SET LOCKED = FALSE, LOCKEDBY = NULL, LOCKGRANTED = NULL WHERE ID = 1;
SET SEARCH_PATH TO public, "$user","public";

Liquibase command 'updateSql' was executed successfully.
```

</details>

### Run a diff command

You can also run a `diff` command to compare your source and target databases.

```bash shouldWrap
liquibase --referenceUrl=jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/blog --referenceUsername alex --referencePassword IwMdnTs1R6kH diff
```

<details>
<summary>Command output</summary>

If the command was successful, you’ll see output similar to the following:

```bash
Starting Liquibase at 12:34:20 (version 4.24.0 #14062 built at 2023-09-28 12:18+0000)
Liquibase Version: 4.24.0
Liquibase Open Source 4.24.0 by Liquibase

Diff Results:

Reference Database: alex @ jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/blog (Default Schema: public)
Comparison Database: alex @ jdbc:postgresql://ep-silent-hill-85675036.us-east-2.aws.neon.tech:5432/blog (Default Schema: public)
Compared Schemas: public
Product Name: EQUAL
Product Version: EQUAL
Missing Catalog(s): NONE
Unexpected Catalog(s): NONE
Changed Catalog(s): NONE
Missing Column(s): NONE
Unexpected Column(s):
     public.comments.author_id
     public.comments.comment
     public.comments.comment_id
     public.comments.commented_date
     public.comments.post_id
Changed Column(s): NONE
Missing Foreign Key(s): NONE
Unexpected Foreign Key(s):
     fk_comments_author_id(comments[author_id] -> authors[author_id])
     fk_comments_post_id(comments[post_id] -> posts[post_id])
Changed Foreign Key(s): NONE
Missing Index(s): NONE
Unexpected Index(s):
     comments_pkey UNIQUE  ON public.comments(comment_id)
Changed Index(s): NONE
Missing Primary Key(s): NONE
Unexpected Primary Key(s):
     comments_pkey on public.comments(comment_id)
Changed Primary Key(s): NONE
Missing Schema(s): NONE
Unexpected Schema(s): NONE
Changed Schema(s): NONE
Missing Sequence(s): NONE
Unexpected Sequence(s): NONE
Changed Sequence(s): NONE
Missing Table(s): NONE
Unexpected Table(s):
     comments
Changed Table(s): NONE
Missing Unique Constraint(s): NONE
Unexpected Unique Constraint(s): NONE
Changed Unique Constraint(s): NONE
Missing View(s): NONE
Unexpected View(s): NONE
Changed View(s): NONE
Liquibase command 'diff' was executed successfully.
```

</details>

### Save your changelog to source control

When you are satisfied with the changes that will be applied, save your changelog to source control, such as a GitHub repository where you or your team stores you changelog.

### Apply the changeset to your source database

Apply the new changesets to the source database on your default branch:

```bash shouldWrap
liquibase --url=jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/blog update
```

<details>
<summary>Command output</summary>

If the command was successful, you’ll see output similar to the following:

```bash
Starting Liquibase at 12:36:56 (version 4.24.0 #14062 built at 2023-09-28 12:18+0000)
Liquibase Version: 4.24.0
Liquibase Open Source 4.24.0 by Liquibase
Running Changeset: dbchangelog.xml::myIDNumber1234::AlexL

UPDATE SUMMARY
Run:                          1
Previously run:               0
Filtered out:                 0
-------------------------------
Total change sets:            1

Liquibase: Update has been successful. Rows affected: 1
Liquibase command 'update' was executed successfully.
```

</details>

To ensure that all changes have been applied to the production database, you can rerun the `status`, `updatedSql`, and `diff` commands you ran above. After applying the change, there should be no differences. You can also check your databases in the **Tables** view in the Neon Console to verify that the source database now has a `comments` table.

<Admonition type="note">
When you run a changeset for the first time on the source database, you will find that Liquibase automatically creates the [databasechangelog](https://docs.liquibase.com/concepts/tracking-tables/databasechangelog-table.html) and [databasechangeloglock](https://docs.liquibase.com/concepts/tracking-tables/databasechangeloglock-table.html) tracking tables that were created in your development database. These tracking tables are created on any database where you apply changesets.
</Admonition>

## References

- [Get started with Liquibase](https://www.liquibase.org/get-started/quickstart)
- [Setting up your Liquibase Workspace](https://www.liquibase.org/get-started/setting-up-your-workspace)
- [Liquibase Developer Workflow](https://www.liquibase.org/get-started/developer-workflow)
