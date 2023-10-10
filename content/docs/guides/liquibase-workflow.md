---
title: Liquibase developer workflow with Neon
subtitle: Implement a developer workflow for schema changes using Liquibase and Neon branching
enableTableOfContents: true
---

Liquibase is an open-source database-independent library for tracking, managing and applying database schema changes. To learn more about Luquibase, please refer to the [Liquibase documentation](https://docs.liquibase.com/home.html).

This guide shows you how to set up a developer workflow that uses Liquibase with Neon's branching feature. The workflow involves making schema changes on a target development database branch and apply the changes back to the source database on your main branch in Neon.

## Prerequisites

- A Neon account. See [Sign up](/docs/get-started-with-neon/signing-up).
- A Neon project. See [Create your first project](/docs/get-started-with-neon/setting-up-a-project).
- Liquibase requires Java. To check if you have Java installed, run `java --version`. If not, refer to the instructions for your operating system.
- An installation of Liquibase. For instructions, refer to [Manage schema changes with Liquibase](/docs/guides/liquibase) for installation instructions.

## Initialize a new Liquibase project

Run the following command to initialize a Liquibase project:

```bash
liquibase init project
```

Enter `Y` to accept the defaults.

## Prepare a source database in Neon

Create a `blog` database in Neon with two tables, `posts` and `authors`.

1. From the Neon console, create a database named `blog` on the `main` branch of your Neon project. For instructions, see [Create a database](/docs/manage/databases#create-a-database).
2. Open the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) and create the following tables:

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

## Prepare a target development database in Neon

Now, let's prepare a development database in Neon by creating a development branch, where you can safely make changes to your database schema without affecting the database schema on your `main` branch. A branch is a copy-on-write clone of the data in your Neon project, so it will include a copy of the `blog` database with the `authors` and `posts` tables that you just created.

To create a branch:

1. In the Neon Console, select **Branches**. You will see your `main` branch, where you created just created your `blog` database.
3. Click **New Branch** to open the branch creation dialog.
   ![Create branch dialog](/docs/manage/create_branch.png)
4. Enter a name for the branch. Let's call it `dev1`.
5. Leave `main` selected as the parent branch, where the `blog` database was created.
6. Leave the remaining default settings. You want to create a branch from **Head** to include the latest data, and you need a compute endpoint to connect to the copy of the `blog` database on the branch.
8. Click **Create Branch** to create your branch.

## Retrieve your Neon database connection strings

Retrieve connection strings for your target and source databases from the **Connection Details** widget on the Neon Dashboard.

1. Select the `dev1` branch, the `blog` database, and copy the connection string.

```bash
postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/blog
```

2. Select the `main` branch, the `blog` database, and copy the connection string.

```bash
postgres://alex:AbC123dEf@ep-silent-hill-85675036.us-east-2.aws.neon.tech/blog
```

Notice that the hostname (the part starting with `-ep` and ending in `neon.tech`) differs. This is because the `dev1` branch is a completely separate Postgres instance, hosted on its own compute.

## Update your liquibase.properties file

The `liquibase.properties` file defines the location of your Liquibase changelog file and your Target and Source databases.

1. In your Liquibase project directory, open the `liquibase.properties` file, which comes pre-populated with example settings.

2. Change the `changeLogFile` setting as shown:

```env
# Enter the path for your changelog file.
changeLogFile=my-changelog.xml
``````

The [changelog file](https://docs.liquibase.com/parameters/changelog-file.html) is the root file of your Liquibase project that stores a record of all your database changes (changesets).

3. Configure the `url`, `username`, and `password` settings for your Target database. These are the settings for the `blog` database on your `dev1` branch. You can obtain the required details from the connection string you copied previously. Please notice how the connection string format differs from the one you copied from Neon.

```env
#### Enter the Target database 'url' information  ####
liquibase.command.url=jdbc:postgresql://ep-silent-hill-85675036.us-east-2.aws.neon.tech:5432/blog

# Enter the username for your Target database.
liquibase.command.username: alex

# Enter the password for your Target database.
liquibase.command.password: AbC123dEf
```

4. Configure the `url`, `username`, and `password` settings for your Source database. These are the settings for the `blog` database on your `main` branch. You can obtain the required details from the connection string you copied previously. Please notice how the connection string format differs from the one you copied from Neon.

```env
#### Enter the Source Database 'referenceUrl' information ####
## The source database is the baseline or reference against which your target database is compared for diff/diffchangelog commands.

# Enter URL for the source database
liquibase.command.referenceUrl: jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/blog

# Enter the username for your source database
liquibase.command.referenceUsername: alex

# Enter the password for your source database
liquibase.command.referencePassword: AbC123dEf
```

## Take a snapshot of your target database

Capture the current state of your Target database. The following command creates a Liquibase changelog named `mydatabase_changelog.xml`.

```bash
liquibase --changeLogFile=my-changelog.xml generateChangeLog
```

If the command was successful, you’ll see output similar to the following:

```bash
Starting Liquibase at 07:09:59 (version 4.24.0 #14062 built at 2023-09-28 12:18+0000)
Liquibase Version: 4.24.0
Liquibase Open Source 4.24.0 by Liquibase

BEST PRACTICE: The changelog generated by diffChangeLog/generateChangeLog should be inspected for correctness and completeness before being deployed. Some database objects and their dependencies cannot be represented automatically, and they may need to be manually updated before being deployed.

Generated changelog written to my-changelog.xml
Liquibase command 'generateChangelog' was executed successfully.
```

Check for the `my-changelog.xml` file that should have been created in your Liquibase project directory. You’ll get a changelog for your development `blog` database. It will looks something like this.

```xml
<?xml version="1.1" encoding="UTF-8" standalone="no"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog" xmlns:ext="http://www.liquibase.org/xml/ns/dbchangelog-ext" xmlns:pro="http://www.liquibase.org/xml/ns/pro" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog-ext http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-ext.xsd http://www.liquibase.org/xml/ns/pro http://www.liquibase.org/xml/ns/pro/liquibase-pro-latest.xsd http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd">
    <changeSet author="dtprice (generated)" id="1696932602147-1">
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
    <changeSet author="dtprice (generated)" id="1696932602147-2">
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
    <changeSet author="dtprice (generated)" id="1696932602147-3">
        <addUniqueConstraint columnNames="email" constraintName="authors_email_key" tableName="authors"/>
    </changeSet>
    <changeSet author="dtprice (generated)" id="1696932602147-4">
        <addForeignKeyConstraint baseColumnNames="author_id" baseTableName="posts" constraintName="posts_author_id_fkey" deferrable="false" initiallyDeferred="false" onDelete="NO ACTION" onUpdate="NO ACTION" referencedColumnNames="author_id" referencedTableName="authors" validate="true"/>
    </changeSet>
</databaseChangeLog>
```

## Create a database schema change

Now you can start to make database changes by creating your first changeset:

1. Create a `dbchangelog.xml` file:

```bash
cd ~/liquibase
touch dbchangelog.xml
```

2. Add the following changeset, which adds a `comments` table:

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<databaseChangeLog  
  xmlns="http://www.liquibase.org/xml/ns/dbchangelog"  
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
  xmlns:pro="http://www.liquibase.org/xml/ns/pro"  
  xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.4.xsd
      http://www.liquibase.org/xml/ns/pro http://www.liquibase.org/xml/ns/pro/liquibase-pro-4.5.xsd">
    <changeSet author="AlexL" id="myIDNumber1234">
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

### Apply changes to the target developer database

Run `liquibase update` to apply the changes to the target developer database. Iterate until you are happy with the final state.

```bash
liquibase update
```

If the command was successful, you’ll see output similar to the following:

```bash
Starting Liquibase at 11:04:03 (version 4.24.0 #14062 built at 2023-09-28 12:18+0000)
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

### Understand database changes before saving and applying them

It is a best practice to understand the changes before saving and applying them to the changelog, especially if someone else edited or created the changelog.

Running the following command to see if there are changesets that haven't been applied to the production database:

```bash
liquibase --url=jdbc:postgresql://ep-rapid-bush-01185324.us-east-2.aws.neon.tech:5432/blog status --verbose
```

<details>
<summary>Command output</summary>

If the command was successful, you’ll see output similar to the following indicating that there is one changeset that has not been applied to your development database. This is the `comments` table changeset.

```bash
tarting Liquibase at 12:30:51 (version 4.24.0 #14062 built at 2023-09-28 12:18+0000)
Liquibase Version: 4.24.0
Liquibase Open Source 4.24.0 by Liquibase
1 changesets have not been applied to alex@jdbc:postgresql://ep-rapid-bush-01185324.us-east-2.aws.neon.tech:5432/blog
     dbchangelog.xml::myIDNumber1234::AlexL
Liquibase command 'status' was executed successfully.
```

</details>

### Check your SQL

Before applying the update, you can run the following command to check the SQL:

```bash
liquibase --url=jdbc:postgresql://ep-rapid-bush-01185324.us-east-2.aws.neon.tech:5432/blog updateSQL
```

<details>
<summary>Command output</summary>

If the command was successful, you’ll see output similar to the following, which confirms that the changeset will create the `comments` table.

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

-- Changeset dbchangelog.xml::myIDNumber1234::AlexL
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

## Run a diff command to compare the changes

You can also run a `diff` command to compare your source and target databases.

```bash
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

 When you are satisfied with the changes that will be applied, save your changelog to source control.

### Apply the new changeset to your source database

Apply the new changesets to the source database on your primary branch:

```bash
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

To ensure that all changes have been applied to the production database, you can rerun the `status`, `updatedSql`, and `diff` commands you ran above. You can also check your databases in the Tables view in the Neon console to verify that both databases now have a `comments` table.

## References

- [Get started with Liquibase](https://www.liquibase.org/get-started/quickstart)
- [Setting up your Liquibase Workspace](https://www.liquibase.org/get-started/setting-up-your-workspace)
- [Liquibase Developer Workflow](https://www.liquibase.org/get-started/developer-workflow)
