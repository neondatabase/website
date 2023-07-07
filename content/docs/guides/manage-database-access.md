---
title: Manage database access with SQL
subtitle: Set up a Neon project in seconds and connect from a Go application
enableTableOfContents: false
---

This guide shows how to manage database access in Neon using SQL. This guide will step through connecting to Neon, creating a database, creating a role and granting privileges to the role. The guide will then show how to create new database users using SQL, and grant those users role membership, allowing them to connect to and use the new database.

Now, let's get started. Assume you're creating a new database that will be used by several developers, all requiring read-write access to it.

Start by using `psql` (or some other client that supports SQL) to connect to your the default `neondb` database e created with every Neon project. For example:

<CodeBlock shouldWrap>

```bash
psql postgres://daniel:<password>@ep-restless-waterfall-733645.us-west-2.aws.neon.tech/neondb
```

</CodeBlock>

Now, create a new database. We'll call it `app_db`.

```sql
CREATE DATABASE app_db;
```

<Admonition type="note">
The role that creates a database is automatically made the owner of that database and has all of the typical PostgreSQL privileges on that database.
</Admonition>

Next, create a role for the database users. A password is required when creating roles in Neon.

```sql
CREATE ROLE dev_users PASSWORD `password`;
```

<Admonition type="note">
Remember that in Neon, when creating roles, the password you support must have 60 bits of entropy. To achieve the necessary entropy, you can follow these password composition rules:

- Length: The password should consist of at least 12 characters.
- Character Diversity: To enhance complexity, passwords should include a variety of character types, specifically:
  - Lowercase letters (a-z)
  - Uppercase letters (A-Z)
  - Numbers (0-9)
  - Special symbols (e.g., !@#$%^&*)
- Avoid Predictability: To maintain a high level of unpredictability, do not use:
  - Sequential patterns (such as '1234', 'abcd', 'qwerty')
  - Common words or phrases
  - Any words found in a dictionary
- Avoid Character Repetition: To maximize randomness, do not use the same character more than twice consecutively.

  Example Password: `T3sting!23Ab` (DO NOT USE THIS EXAMPLE PASSWORD)
</Admonition>

Now, assign all users with the `dev_users` role all permissions on this database:

```sql
GRANT ALL PRIVILEGES ON DATABASE app_db TO dev_users;
```

Next, create some database users:

```sql
CREATE ROLE dev_user1 WITH LOGIN PASSWORD 'password';
CREATE ROLE dev_user2 WITH LOGIN PASSWORD 'password';
```

Finally, assign the two users the permissions associated with the `dev_users` role:

```sql
GRANT dev_users TO dev_user1;
GRANT dev_users TO dev_user2;
```

At this point, `dev_user1` and `dev_user2` can connect to the `app_db` database and start using it.

```bash
psql postgres://dev_user1:abc123@ep-restless-waterfall-733645.us-west-2.aws.neon.tech/app_db
psql (15.2 (Ubuntu 15.2-1.pgdg22.04+1), server 15.3)
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
Type "help" for help.

app_db=> 
```

For further details about permissions in PostgreSQL databases, please see the [GRANT](https://www.postgresql.org/docs/current/sql-grant.html) command in the _PostgreSQL documentation_.
