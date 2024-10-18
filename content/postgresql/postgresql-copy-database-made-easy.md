---
title: 'PostgreSQL Copy Database Made Easy'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-administration/postgresql-copy-database/
ogImage: ./img/wp-content-uploads-2017-03-postgresql-copy-database.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to copy a PostgreSQL database on the same server or from one server to another.

<!-- /wp:paragraph -->

<!-- wp:image {"align":"center","id":2713,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2017-03-postgresql-copy-database.jpg)

<!-- /wp:image -->

<!-- wp:heading -->

## PostgreSQL copy database within the same server

<!-- /wp:heading -->

<!-- wp:paragraph -->

Sometimes, you want to copy a PostgreSQL database within a database server for testing purposes.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PostgreSQL makes it easy to do so via the [`CREATE DATABASE`](https://www.postgrepgsqltutorial.com/postgrepgsql-create-database/) statement, as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE DATABASE targetdb
WITH TEMPLATE sourcedb;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

This statement copies the `sourcedb` to the `targetdb`. For example, to copy the `dvdrental` [sample database](https://www.postgrepgsqltutorial.com/postgrepgsql-sample-database/) to the `dvdrental_test` database, you use the following statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE DATABASE dvdrental_test
WITH TEMPLATE dvdrental;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Depending on the [size of the source database](https://www.postgrepgsqltutorial.com/postgrepgsql-database-indexes-table-size/), copying may take some time to complete.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the `dvdrental` database has active connections, you will encounter the following error:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ERROR:  source database "dvdrental" is being accessed by other users
DETAIL:  There is 1 other session using the database.
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following query returns the active connections:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT pid, usename, client_addr
FROM pg_stat_activity
WHERE datname ='dvdrental';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To terminate the active connections to the `dvdrental` database, you use the following query:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT pg_terminate_backend (pid)
FROM pg_stat_activity
WHERE datname = 'dvdrental';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

After that, you can execute the `CREATE TABLE WITH TEMPLATE` statement again to copy the `dvdrental` database to `dvdrental_test` database.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL copy database from one server to another

<!-- /wp:heading -->

<!-- wp:paragraph -->

There are several ways to copy a database between PostgreSQL database servers.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the size of the source database is big and the connection between the database servers is slow, you can dump the source database to a file, copy the file to the remote server, and restore it:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, dump the source database into a file.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
pg_dump -U postgres -d sourcedb -f sourcedb.sql
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, copy the dump file to the remote server.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, create a new database in the remote server:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE DATABASE targetdb;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, restore the dump file on the remote server:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
psql -U postgres -d targetdb -f sourcedb.sql
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Copying the dvdrental database example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following steps illustrate how to copy the `dvdrental` database from the local server to the `remote` server.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, dump the `dvdrental` database into a dump file such as `dvdrental.sql`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
pg_dump -U postgres -O dvdrental -f dvdrental.sql
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, copy the dump file to the `remote` server.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, create the `dvdrental` database on the `remote` server:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE DATABASE dvdrental;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, restore the `dvdrental.sql` dump file in the `remote` server:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
psql -U postgres -d dvdrental -f dvdrental.sql
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If the connection between the servers is fast and the size of the database is not big, you can use the following command:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
pg_dump -C -h local -U localuser sourcedb | psql -h remote -U remoteuser targetdb
```

<!-- /wp:code -->

<!-- wp:paragraph -->

For example, to copy the `dvdrental` database from the `localhost` server to the `remote` server, you can execute the following command:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
pg_dump -C -h localhost -U postgres dvdrental | psql -h remote -U postgres dvdrental
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this tutorial, you have learned how to copy a PostgreSQL database within a database server, or from one database server to another.

<!-- /wp:paragraph -->
