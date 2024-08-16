[#id](#MANAGE-AG-DROPDB)

## 23.5. Destroying a Database [#](#MANAGE-AG-DROPDB)

Databases are destroyed with the command [DROP DATABASE](sql-dropdatabase):

```
DROP DATABASE name;
```

Only the owner of the database, or a superuser, can drop a database. Dropping a database removes all objects that were contained within the database. The destruction of a database cannot be undone.

You cannot execute the `DROP DATABASE` command while connected to the victim database. You can, however, be connected to any other database, including the `template1` database. `template1` would be the only option for dropping the last user database of a given cluster.

For convenience, there is also a shell program to drop databases, [dropdb](app-dropdb):

```
dropdb dbname
```

(Unlike `createdb`, it is not the default action to drop the database with the current user name.)
