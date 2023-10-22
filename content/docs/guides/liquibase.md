---
title: Get started with Liquibase and Neon
subtitle: Learn how to manage schema changes in Neon with Liquibase
enableTableOfContents: true
---

Liquibase is an open-source library for tracking, managing, and applying database schema changes. To learn more about Liquibase, refer to the [Liquibase documentation](https://docs.liquibase.com/home.html).

This guide steps you through installing the Liquibase CLI, configuring Liquibase to connect to a Neon database, deploying a database schema change, and rolling back the schema change. It generally follows the steps described in the [Liquibase Quickstart](https://www.liquibase.org/get-started/quickstart).

## Prerequisites

- A Neon account. See [Sign up](/docs/get-started-with-neon/signing-up).
- A Neon project. See [Create your first project](/docs/get-started-with-neon/setting-up-a-project).
- Liquibase requires Java. To check if you have Java installed, run `java --version`. If not, refer to the installation instructions for your operating system.

## Download and extract Liquibase

1. Download the Liquibase CLI from [https://www.liquibase.com/download](https://www.liquibase.com/download).

2. Extract the Liquibase files. For example:

    ```bash
    cd ~/Downloads
    mkdir ~/liquibase
    tar -xzvf liquibase-4.24.0.tar.gz -C ~/liquibase/
    ```

3. Open a command prompt to view your new directory:

    ```bash
    cd ~/liquibase
    ls
    ABOUT.txt      GETTING_STARTED.txt  licenses     liquibase.bat
    changelog.txt  internal             LICENSE.txt  README.txt
    examples       lib                  liquibase    UNINSTALL.txt
    ```

## Set your path variable

Add the Liquibase directory to your `PATH`. For example:

```bash
echo 'export PATH=$PATH:/path/to/liquibase' >> ~/.bashrc
source ~/.bashrc
```

or

```bash
echo 'export PATH=$PATH:/path/to/liquibase' >> ~/.profile
source ~/.profile
```

## Verify your installation

Verify that the Liquibase installation was successful by running the following command:

```bash
liquibase --version
...
Liquibase Version: 4.24.0
Liquibase Open Source 4.24.0 by Liquibase
```

## Prepare a Neon database

For demonstration purposes, create a `blog` database in Neon with two tables, `posts` and `authors`.

1. From the Neon console, create a database named `blog`. For instructions, see [Create a database](/docs/manage/databases#create-a-database).
2. Using the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor), add the following tables:

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

## Retrieve your Neon database connection string

Retrieve a Neon database Java connection string from the **Connection Details** widget on the Neon Dashboard. Use the selection drop-down menu. It will look something like this:

<CodeBlock shouldWrap>

```bash
jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech/blog?user=alex&password=AbC123dEf
```

</CodeBlock>

## Connect from Liquibase to your Neon database

1. Create a directory for your Liquibase project. For example:

    ```bash
    mkdir blogdb
    ```

2. Create a `liquibase.properties` file in your project directory, and add an entry with the name for your [liquibase changelog file](https://docs.liquibase.com/concepts/changelogs/home.html) and your database `url`, as shown. The current state of your database will be written to this changelog file. For the `url`, specify the Neon connection string you retrieved previously:

    <CodeBlock shouldWrap>

    ```env
    changeLogFile:mydbchangelog.xml  
    url: jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech/blog?user=alex&password=AbC123dEf
    ```

    </CodeBlock>

## Take a snapshot of your database

After defining your database connection, run the [generateChangelog](https://docs.liquibase.com/commands/inspection/generate-changelog.html) command to create a changelog file with the current state of your database.

```bash
liquibase --changeLogFile=mydatabase_changelog.xml generateChangeLog
```

You’ll get a changelog file for your database that looks something like this:

```xml
<?xml version="1.1" encoding="UTF-8" standalone="no"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog" xmlns:ext="http://www.liquibase.org/xml/ns/dbchangelog-ext" xmlns:pro="http://www.liquibase.org/xml/ns/pro" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog-ext http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-ext.xsd http://www.liquibase.org/xml/ns/pro http://www.liquibase.org/xml/ns/pro/liquibase-pro-latest.xsd http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd">
    <changeSet author="dtprice (generated)" id="1697394458474-1">
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
    <changeSet author="dtprice (generated)" id="1697394458474-2">
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
    <changeSet author="dtprice (generated)" id="1697394458474-3">
        <addUniqueConstraint columnNames="email" constraintName="authors_email_key" tableName="authors"/>
    </changeSet>
    <changeSet author="dtprice (generated)" id="1697394458474-4">
        <addForeignKeyConstraint baseColumnNames="author_id" baseTableName="posts" constraintName="posts_author_id_fkey" deferrable="false" initiallyDeferred="false" onDelete="NO ACTION" onUpdate="NO ACTION" referencedColumnNames="author_id" referencedTableName="authors" validate="true"/>
    </changeSet>
</databaseChangeLog>
```

## Create a schema change

Now, you can start making database schema changes by creating [changesets](https://docs.liquibase.com/concepts/changelogs/changeset.htm). A changeset is the basic unit of change in Liquibase. You can append a changeset to your master changelog file or define it in a separate file, as we do here.

1. Create a changelog file for your changeset:

```bash
cd ~/blogdb
touch dbchangelog.xml
```

2. Add the following changeset, which adds a `comments` table to your database:

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

## Deploy your change

Deploy your changeset by running the [update](https://docs.liquibase.com/commands/update/update.html) command:

```bash
liquibase update
```

<details>
<summary>Command output</summary>

If the command was successful, you’ll see output similar to the following:

```bash
Starting Liquibase at 11:04:03 (version 4.24.0 #14062 built at 2023-09-28 12:18+0000)
Liquibase Version: 4.24.0
Liquibase Open Source 4.24.0 by Liquibase
Running Changeset: dbchange1.xml::myIDNumber1234::AlexL

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

## Rollback a change

Try rolling back your last change by running the Liquibase [rollbackCount](https://docs.liquibase.com/commands/rollback/rollback-count.html) command:

```bash
liquibase$ liquibase rollbackCount 1
```

<details>
<summary>Command output</summary>

If the command was successful, you’ll see output similar to the following:

```bash
Starting Liquibase at 11:06:43 (version 4.24.0 #14062 built at 2023-09-28 12:18+0000)
Liquibase Version: 4.24.0
Liquibase Open Source 4.24.0 by Liquibase
Rolling Back Changeset: dbchangelog.xml::myIDNumber1234::AlexL
Liquibase command 'rollbackCount' was executed successfully.
```

</details>

## Next steps

Learn how to use Liquibase with Neon's database branching feature to set up a developer workflow. See [Set up a developer workflow with Liquibase and Neon](/docs/guides/liquibase-workflow).

## References

- [Get started with Liquibase](https://www.liquibase.org/get-started/quickstart)
- [Setting up your Liquibase Workspace](https://www.liquibase.org/get-started/setting-up-your-workspace)
- [Liquibase Developer Workflow](https://www.liquibase.org/get-started/developer-workflow)
