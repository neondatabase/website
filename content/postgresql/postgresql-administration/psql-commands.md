---
title: '17 Practical psql Commands You Don’t Want to Miss'
page_title: "17 Practical psql Commands That You Don't Want To Miss"
page_description: 'You will learn how to use practical psql commands to interact with the PostgreSQL database server effectively.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-administration/psql-commands/'
ogImage: '/postgresqltutorial/psql-commands.jpg'
updatedOn: '2024-01-16T06:44:49+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL Describe Table'
  slug: 'postgresql-administration/postgresql-describe-table'
nextLink:
  title: 'How to Uninstall PostgreSQL from Ubuntu'
  slug: 'postgresql-administration/uninstall-postgresql-ubuntu'
---

**Summary**: In this tutorial, you will learn how to use practical psql commands to interact with the PostgreSQL database server effectively.

## 1\) Connect to PostgreSQL database

The following command [connects to a database](../postgresql-jdbc/connecting-to-postgresql-database) under a specific user. After pressing `Enter` PostgreSQL will ask for the password of the user.

```phpsql
psql -d database -U  user -W
```

For example, to connect to `dvdrental` database under `postgres` user, you use the following command:

```sql
psql -d dvdrental -U postgres -W
Password for user postgres:
dvdrental=#
```

If you want to connect to a database that resides on another host, you add the \-h option as follows:

```sql
psql -h host -d database -U user -W
```

In case you want to use SSL mode for the connection, just specify it as shown in the following command:

```sql
psql -U user -h host "dbname=db sslmode=require"
```

## 2\) Switch connection to a new database

Once you are connected to a database, you can switch the connection to a new database under a user\-specified by `user`. The previous connection will be closed. If you omit the `user` parameter, the current `user` is assumed.

```sql
\c dbname username
```

The following command connects to `dvdrental` database under `postgres` user:

```
postgres=# \c dvdrental
You are now connected to database "dvdrental" as user "postgres".
dvdrental=#
```

## 3\) List available databases

To [list all databases](postgresql-show-databases) in the current PostgreSQL database server, you use `\l` command:

```
\l
```

## 4\) List available tables

To [list all tables](postgresql-show-tables) in the current database, you use the `\dt` command:

```sql
\dt
```

Note that this command shows the only table in the currently connected database.

## 5\) Describe a table

To [describe a table](postgresql-describe-table) such as a column, type, or modifiers of columns, you use the following command:

```sql
\d table_name
```

## 6\) List available schema

To list all [schemas](postgresql-schema) of the currently connected database, you use the `\dn` command.

```sql
\dn
```

## 7\) List available functions

To list available functions in the current database, you use the `\df` command.

```sql
\df
```

## 8\) List available views

To list available [views](../postgresql-views) in the current database, you use the `\dv` command.

```sql
\dv
```

## 9\) List users and their roles

To list all users and their assigned roles, you use `\du` command:

```sql
\du
```

## 10\) Execute the previous command

To retrieve the current version of PostgreSQL server, you use the `version()` function as follows:

```sql
SELECT version();
```

Now, if you want to save time typing the previous command again, you can use `\g` command to execute the previous command:

```sql
\g
```

psql executes the previous command again, which is the [SELECT statement](../postgresql-tutorial/postgresql-select),.

## 11\) Command history

To display command history, you use the `\s` command.

```sql
\s
```

If you want to save the command history to a file, you need to specify the file name followed the `\s` command as follows:

```sql
\s filename
```

## 12\) Execute psql commands from a file

In case you want to execute psql commands from a file, you use `\i` command as follows:

```sql
\i filename
```

## 13\) Get help on psql commands

To know all available psql commands, you use the `\?` command.

```sql
\?
```

To get help on specific PostgreSQL statement, you use the `\h` command.

For example, if you want to know detailed information on the [ALTER TABLE](../postgresql-tutorial/postgresql-alter-table) statement, you use the following command:

```sql
\h ALTER TABLE
```

## 14\) Turn on query execution time

To turn on query execution time, you use the `\timing` command.

```sql
dvdrental=# \timing
Timing is on.
dvdrental=# select count(*) from film;
 count
-------
  1000
(1 row)

Time: 1.495 ms
dvdrental=#
```

You use the same command `\timing` to turn it off.

```sql
dvdrental=# \timing
Timing is off.
dvdrental=#
```

## 15\) Edit command in your editor

It is very handy if you can type the command in your favorite editor. To do this in psql, you `\e` command. After issuing the command, psql will open the text editor defined by your EDITOR environment variable and place the most recent command that you entered in psql into the editor.

![psql commands](/postgresqltutorial/psql-commands.jpg)After you type the command in the editor, save it, and close the editor, psql will execute the command and return the result.

![psql command example](/postgresqltutorial/psql-command-example.jpg)
It is more useful when you edit a function in the editor.

```sql
\ef [function name]
```

![psql commadn ef edit function](/postgresqltutorial/psql-command-ef-edit-function.jpg)

## 16\) Switch output options

psql supports some types of output format and allows you to customize how the output is formatted on the fly.

- `\a` command switches from aligned to non\-aligned column output.
- `\H` command formats the output to HTML format.

## 17\) Quit psql

To quit psql, you use `\q` command and press `Enter` to exit psql.

```sql
\q
```

In this tutorial, you have learned how to use psql commands to perform various commonly used tasks in PostgreSQL.
