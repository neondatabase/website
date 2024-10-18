---
title: 'Reset Forgotten Password For postgres User'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-administration/postgresql-reset-password/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn step-by-step how to reset the password of the `postgres` user in PostgreSQL.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For some reason, after [installing PostgreSQL](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/), you may forget the password of the `postgres` user. In such cases, you need to know how to reset the password to regain access to the PostgreSQL server.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PostgreSQL uses the `pg_hba.conf` configuration file stored in the database data directory (e.g., `C:\Program Files\PostgreSQL\16\data` on Windows) to control the client authentication. The `hba` in `pg_hba.conf` means host-based authentication.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To reset the password for the `postgres` user, you need to follow these steps:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, modify some parameters in the `pg_hba.conf` configuration file.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Log in to the PostgreSQL server using the `postgres` user account without a password.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Reset the password.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The following steps show you how to reset a password for the `postgres` user:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**Step 1**. Backup the `pg_hba.conf` file by copying it to a different location or rename it to `pg_hba.conf.bk`

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**Step 2**. Edit the `pg_dba.conf` file and change all local connections from `scram-sha-256` to `trust`. By doing this, you can log in to the PostgreSQL database server without using a password.

<!-- /wp:paragraph -->

<!-- wp:code -->

```
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# IPv4 local connections:
host    all             all             127.0.0.1/32            trust
# IPv6 local connections:
host    all             all             ::1/128                 trust
# Allow replication connections from localhost, by a user with the
# replication privilege.
host    replication     all             127.0.0.1/32            trust
host    replication     all             ::1/128                 trust
```

<!-- /wp:code -->

<!-- wp:paragraph -->

**Step 3**. Restart the PostgreSQL server. If you are on Windows, you can restart the PostgreSQL from **Services**.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Alternatively, you can run the following command from the Command Prompt (notice that you need to run the Command Prompt as the Administrator):

<!-- /wp:paragraph -->

<!-- wp:code -->

```
pg_ctl -D "C:\Program Files\PostgreSQL\16\data" restart
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `"C:\Program Files\PostgreSQL\16\data"` is the data directory.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**Step 4**. Connect to PostgreSQL database server using any tool such as psql or pgAdmin:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
psql -U postgres
```

<!-- /wp:code -->

<!-- wp:paragraph -->

PostgreSQL will not require a password to log in.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**Step 5**. Execute the following command to set a new password for the `postgres` user.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
postgres=# ALTER USER postgres WITH PASSWORD 'new_password';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

**Step 6**. Restore the `pg_dba.conf` file, restart the PostgreSQL database server, and connect to the PostgreSQL database server with the new password.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In this tutorial, you have learned how to reset the password of the `postgres` user.

<!-- /wp:paragraph -->
