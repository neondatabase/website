---
createdAt: 2017-03-16T02:03:24.000Z
title: 'PostgreSQL Copy Database Made Easy'
redirectFrom: 
            - /postgresql/postgresql-administration/postgresql-copy-database
ogImage: /postgresqltutorial_data/wp-content-uploads-2017-03-postgresql-copy-database.jpg
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to copy a PostgreSQL database on the same server or from one server to another.

![](/postgresqltutorial_data/wp-content-uploads-2017-03-postgresql-copy-database.jpg)

## PostgreSQL copy database within the same server

Sometimes, you want to copy a PostgreSQL database within a database server for testing purposes.

PostgreSQL makes it easy to do so via the [`CREATE DATABASE`](https://www.postgrepgsqltutorial.com/postgrepgsql-create-database/) statement, as follows:

```sql
CREATE DATABASE targetdb
WITH TEMPLATE sourcedb;
```

This statement copies the `sourcedb` to the `targetdb`. For example, to copy the `dvdrental` [sample database](https://www.postgrepgsqltutorial.com/postgrepgsql-sample-database/) to the `dvdrental_test` database, you use the following statement:

```sql
CREATE DATABASE dvdrental_test
WITH TEMPLATE dvdrental;
```

Depending on the [size of the source database](https://www.postgrepgsqltutorial.com/postgrepgsql-database-indexes-table-size/), copying may take some time to complete.

If the `dvdrental` database has active connections, you will encounter the following error:

```sql
ERROR:  source database "dvdrental" is being accessed by other users
DETAIL:  There is 1 other session using the database.
```

The following query returns the active connections:

```sql
SELECT pid, usename, client_addr
FROM pg_stat_activity
WHERE datname ='dvdrental';
```

To terminate the active connections to the `dvdrental` database, you use the following query:

```sql
SELECT pg_terminate_backend (pid)
FROM pg_stat_activity
WHERE datname = 'dvdrental';
```

After that, you can execute the `CREATE TABLE WITH TEMPLATE` statement again to copy the `dvdrental` database to `dvdrental_test` database.

## PostgreSQL copy database from one server to another

There are several ways to copy a database between PostgreSQL database servers.

If the size of the source database is big and the connection between the database servers is slow, you can dump the source database to a file, copy the file to the remote server, and restore it:

First, dump the source database into a file.

```
pg_dump -U postgres -d sourcedb -f sourcedb.sql
```

Second, copy the dump file to the remote server.

Third, create a new database in the remote server:

```sql
CREATE DATABASE targetdb;
```

Finally, restore the dump file on the remote server:

```
psql -U postgres -d targetdb -f sourcedb.sql
```

### Copying the dvdrental database example

The following steps illustrate how to copy the `dvdrental` database from the local server to the `remote` server.

First, dump the `dvdrental` database into a dump file such as `dvdrental.sql`:

```
pg_dump -U postgres -O dvdrental -f dvdrental.sql
```

Second, copy the dump file to the `remote` server.

Third, create the `dvdrental` database on the `remote` server:

```sql
CREATE DATABASE dvdrental;
```

Fourth, restore the `dvdrental.sql` dump file in the `remote` server:

```
psql -U postgres -d dvdrental -f dvdrental.sql
```

If the connection between the servers is fast and the size of the database is not big, you can use the following command:

```
pg_dump -C -h local -U localuser sourcedb | psql -h remote -U remoteuser targetdb
```

For example, to copy the `dvdrental` database from the `localhost` server to the `remote` server, you can execute the following command:

```
pg_dump -C -h localhost -U postgres dvdrental | psql -h remote -U postgres dvdrental
```

In this tutorial, you have learned how to copy a PostgreSQL database within a database server, or from one database server to another.
