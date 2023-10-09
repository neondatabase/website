---
title: Manage schema changes with Liquibase
subtitle: Learn how to manage schema changes in Neon using Liquibase
enableTableOfContents: true
---

Liquibase is an open-source database-independent library for tracking, managing and applying database schema changes. To learn more about Luquibase, please refer to the [Liquibase documentation](https://docs.liquibase.com/home.html).

This guide steps you through downloading and installing the Liquibase CLI, configuring Liquibase to connect to your Neon database, creating and deploying a database schema change, and rolling back a schema change. We'll also take a look a developer workflow that uses Liquibase with Neon's branching feature. The workflow involves making schema changes on a database development branch and apply the changes back to the database on your main branch.

## Prerequisites

- A Neon account. See [Sign up](/docs/get-started-with-neon/signing-up).
- A Neon project. See [Create your first project](/docs/get-started-with-neon/setting-up-a-project).
- Liquibase requires Java. To check if you have Java installed, run `java --version`. If not, refer to the instructions for your operating system.

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

Sdd the Liquibase directory to your `PATH`. For example:

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

## Initialize a new Liquibase project

Run the following command to initialize a Liquibase project:

```bash
liquibase init project
```

Enter `Y` to accept the defaults.

## Prepare a Neon database

Create a `blog` database in Neon with two tables, `posts` and `authors`.

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

Retrieve your Neon database connection string from the **Connection Details** widget on the Neon Dashboard. It will look something like this:

```bash
postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/blog
```

## Connect from Liquibase to your Neon database

Update `liquibase.properties` text file to specify your `driver classpath`, `URL`, and user authentication information for your Neon database.

```bash
cd ~/liquibase
touch liquibase.properties
```

Open the `liquibase.properties` file in an editor and add the following details, replacing the values with those from your own Neon database connection string:

```env
changeLogFile:dbchangelog.xml  
url:  jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/blog
username:  alex 
password:  AbC123dEf
classpath:  internal/lib/postgresql.jar
```

```env
# Enter the path for your changelog file.
changeLogFile=dbchangelog.xml

#### Enter the Target database 'url' information  ####
liquibase.command.url=jdbc:postgresql://ep-cool-darkness-123456.us-east-2.aws.neon.tech:5432/blog

# Enter the username for your Target database.
liquibase.command.username: alex

# Enter the password for your Target database.
liquibase.command.password: AbC123dEf
```

<Admonition type="note">
To use Liquibase with PostgreSQL, you need the JDBC driver JAR file. The latest version of Liquibase includes this driver in the `liquibase/internal/lib` directory. The driver version is displayed when you run the `liquibase --version` command:

```bash
liquibase --version
...
- internal/lib/postgresql.jar: PostgreSQL JDBC Driver 42.6.0 By PostgreSQL Global Development Group
...
```

Optionally, you can download a different version of the driver JAR file from [https://jdbc.postgresql.org/download/](https://jdbc.postgresql.org/download/) or from [Maven](https://mvnrepository.com/artifact/org.postgresql/postgresql). See [Adding and Updating Liquibase Drivers](https://docs.liquibase.com/workflows/liquibase-community/adding-and-updating-liquibase-drivers.html) for information about using a different driver.
</Admonition>

## Take a snapshot of your existing database

Capture the current state of your database by creating a deployable Liquibase changelog.

```bash
liquibase --changeLogFile=mydatabase_changelog.xml generateChangeLog
```

You’ll get a changelog for your database that looks something like this:

```xml
<?xml version="1.1" encoding="UTF-8" standalone="no"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog" xmlns:ext="http://www.liquibase.org/xml/ns/dbchangelog-ext" xmlns:pro="http://www.liquibase.org/xml/ns/pro" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog-ext http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-ext.xsd http://www.liquibase.org/xml/ns/pro http://www.liquibase.org/xml/ns/pro/liquibase-pro-latest.xsd http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd">
    <changeSet author="alex (generated)" id="1696773347773-1">
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
    <changeSet author="alex (generated)" id="1696773347773-2">
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
    <changeSet author="alex (generated)" id="1696773347773-3">
        <addUniqueConstraint columnNames="email" constraintName="authors_email_key" tableName="authors"/>
    </changeSet>
    <changeSet author="alex (generated)" id="1696773347773-4">
        <addForeignKeyConstraint baseColumnNames="author_id" baseTableName="posts" constraintName="posts_author_id_fkey" deferrable="false" initiallyDeferred="false" onDelete="NO ACTION" onUpdate="NO ACTION" referencedColumnNames="author_id" referencedTableName="authors" validate="true"/>
    </changeSet>
</databaseChangeLog>
```

## Create a database schema change

Now you can start to make database changes by creating your first changeset in your `dbchangelog.xml` changelog:

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

## Deploy your database change

Deploy your database change by running the `update` command like this:

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

## Rollback a change

Try rolling back your last change by running the Liquibase `rollback` command:

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

Learn about how to use Liquibase with Neon's database branching feature to set up a developer workflow. See [Set up a developer workflow with Liquibase and Neon](/docs/guides/liquibase-workflow).

## References

- [Get started with Liquibase](https://www.liquibase.org/get-started/quickstart)
- [Setting up your Liquibase Workspace](https://www.liquibase.org/get-started/setting-up-your-workspace)
- [Liquibase Developer Workflow](https://www.liquibase.org/get-started/developer-workflow)
