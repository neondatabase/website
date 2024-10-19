---
title: 'Reset Forgotten Password For postgres User'
redirectFrom: 
            - /docs/postgresql/postgresql-administration/postgresql-reset-password
tableOfContents: true
---


**Summary**: in this tutorial, you will learn step-by-step how to reset the password of the `postgres` user in PostgreSQL.

For some reason, after [installing PostgreSQL](/docs/postgresql/postgresql-getting-started/install-postgresql), you may forget the password of the `postgres` user. In such cases, you need to know how to reset the password to regain access to the PostgreSQL server.

PostgreSQL uses the `pg_hba.conf` configuration file stored in the database data directory (e.g., `C:\Program Files\PostgreSQL\16\data` on Windows) to control the client authentication. The `hba` in `pg_hba.conf` means host-based authentication.

To reset the password for the `postgres` user, you need to follow these steps:

- First, modify some parameters in the `pg_hba.conf` configuration file.
-
- Log in to the PostgreSQL server using the `postgres` user account without a password.
-
- Reset the password.

The following steps show you how to reset a password for the `postgres` user:

**Step 1**. Backup the `pg_hba.conf` file by copying it to a different location or rename it to `pg_hba.conf.bk`

**Step 2**. Edit the `pg_dba.conf` file and change all local connections from `scram-sha-256` to `trust`. By doing this, you can log in to the PostgreSQL database server without using a password.

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

**Step 3**. Restart the PostgreSQL server. If you are on Windows, you can restart the PostgreSQL from **Services**.

Alternatively, you can run the following command from the Command Prompt (notice that you need to run the Command Prompt as the Administrator):

```
pg_ctl -D "C:\Program Files\PostgreSQL\16\data" restart
```

The `"C:\Program Files\PostgreSQL\16\data"` is the data directory.

**Step 4**. Connect to PostgreSQL database server using any tool such as psql or pgAdmin:

```
psql -U postgres
```

PostgreSQL will not require a password to log in.

**Step 5**. Execute the following command to set a new password for the `postgres` user.

```
postgres=# ALTER USER postgres WITH PASSWORD 'new_password';
```

**Step 6**. Restore the `pg_dba.conf` file, restart the PostgreSQL database server, and connect to the PostgreSQL database server with the new password.

In this tutorial, you have learned how to reset the password of the `postgres` user.
