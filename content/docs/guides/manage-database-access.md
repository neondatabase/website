---
title: Manage database access with SQL
subtitle: Learn how to create roles and manage database access in Neon with SQL
enableTableOfContents: false
---

This guide shows how to manage database access in Neon using SQL. This guide will lead you through connecting to Neon, creating a database, creating a role for privilege management, and granting privileges to the role. It will then show how to create database users with SQL and grant those users role membership, allowing them to use the new database.

To begin, assume you're creating a new database that will be used by several developers, all requiring read-write access.

1. Start by using `psql` (or some other client that supports SQL) to connect to the default `neondb` database created with every Neon project. For example:

  <CodeBlock shouldWrap>

  ```bash
  psql postgres://daniel:<password>@ep-restless-waterfall-733645.us-west-2.aws.neon.tech/neondb
  ```

  </CodeBlock>

2. Create a new database. Call it `app_db`.

  ```sql
  CREATE DATABASE app_db;
  ```

<Admonition type="note">
The role that creates a database is the owner of the database.
</Admonition>

3. Create a 'group' role for database users. Neon requires a password when creating any role with SQL. This role will be used to manage database user privileges.

  ```sql
  CREATE ROLE dev_users PASSWORD `password`;
  ```

  <Admonition type="note">  
  Neon requires the password to have 60 bits of entropy. To achieve the necessary entropy, you can follow these password composition guidelines:
    - **Length**: The password should consist of at least 12 characters.
    - **Character diversity**: To enhance complexity, passwords should include a variety of character types, specifically:
      - Lowercase letters (a-z)
      - Uppercase letters (A-Z)
      - Numbers (0-9)
      - Special symbols (e.g., !@#$%^&*)
    - **Avoid predictability**: To maintain a high level of unpredictability, do not use:
      - Sequential patterns (such as '1234', 'abcd', 'qwerty')
      - Common words or phrases
      - Any words found in a dictionary
    - **Avoid character repetition**: To maximize randomness, do not use the same character more than twice consecutively.
    Example Password: `T3sting!23Ab` (DO NOT USE THIS EXAMPLE PASSWORD)
  </Admonition>

4. Assign all users with the `dev_users` role all privileges on the database:

  ```sql
  GRANT ALL PRIVILEGES ON DATABASE app_db TO dev_users;
  ```

5. Create some database users:

  ```sql
  CREATE ROLE dev_user1 WITH LOGIN PASSWORD 'password';
  CREATE ROLE dev_user2 WITH LOGIN PASSWORD 'password';
  ```

6. Grant the users the privileges associated with the `dev_users` role:

  ```sql
  GRANT dev_users TO dev_user1;
  GRANT dev_users TO dev_user2;
  ```

  The `dev_user1` and `dev_user2` can now connect to the `app_db` database and start using it with full privileges.

  ```bash
  psql postgres://dev_user1:abc123@ep-restless-waterfall-733645.us-west-2.aws.neon.tech/app_db
  psql (15.2 (Ubuntu 15.2-1.pgdg22.04+1), server 15.3)
  SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
  Type "help" for help.

  app_db=> 
  ```

In your database access configuration, you may want to employ more granular access permissions, which you can do using a similar approach of creating privilege roles and granting membership to those roles. For further details about granting privileges in PostgreSQL, please see the [GRANT](https://www.postgresql.org/docs/current/sql-grant.html) command in the _PostgreSQL documentation_.
