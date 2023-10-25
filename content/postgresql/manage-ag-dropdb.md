

|                  23.5. Destroying a Database                  |                                                                |                                |                                                       |                                                         |
| :-----------------------------------------------------------: | :------------------------------------------------------------- | :----------------------------: | ----------------------------------------------------: | ------------------------------------------------------: |
| [Prev](manage-ag-config.html "23.4. Database Configuration")  | [Up](managing-databases.html "Chapter 23. Managing Databases") | Chapter 23. Managing Databases | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](manage-ag-tablespaces.html "23.6. Tablespaces") |

***

## 23.5. Destroying a Database [#](#MANAGE-AG-DROPDB)

Databases are destroyed with the command [DROP DATABASE](sql-dropdatabase.html "DROP DATABASE"):

```

DROP DATABASE name;
```

Only the owner of the database, or a superuser, can drop a database. Dropping a database removes all objects that were contained within the database. The destruction of a database cannot be undone.

You cannot execute the `DROP DATABASE` command while connected to the victim database. You can, however, be connected to any other database, including the `template1` database. `template1` would be the only option for dropping the last user database of a given cluster.

For convenience, there is also a shell program to drop databases, [dropdb](app-dropdb.html "dropdb"):

```

dropdb dbname
```

(Unlike `createdb`, it is not the default action to drop the database with the current user name.)

***

|                                                               |                                                                |                                                         |
| :------------------------------------------------------------ | :------------------------------------------------------------: | ------------------------------------------------------: |
| [Prev](manage-ag-config.html "23.4. Database Configuration")  | [Up](managing-databases.html "Chapter 23. Managing Databases") |  [Next](manage-ag-tablespaces.html "23.6. Tablespaces") |
| 23.4. Database Configuration                                  |      [Home](index.html "PostgreSQL 17devel Documentation")     |                                       23.6. Tablespaces |
