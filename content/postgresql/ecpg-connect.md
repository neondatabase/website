[#id](#ECPG-CONNECT)

## 36.2. Managing Database Connections [#](#ECPG-CONNECT)

- [36.2.1. Connecting to the Database Server](ecpg-connect#ECPG-CONNECTING)
- [36.2.2. Choosing a Connection](ecpg-connect#ECPG-SET-CONNECTION)
- [36.2.3. Closing a Connection](ecpg-connect#ECPG-DISCONNECT)

This section describes how to open, close, and switch database connections.

[#id](#ECPG-CONNECTING)

### 36.2.1. Connecting to the Database Server [#](#ECPG-CONNECTING)

One connects to a database using the following statement:

```

EXEC SQL CONNECT TO target [AS connection-name] [USER user-name];
```

The _`target`_ can be specified in the following ways:

- `dbname[@hostname][:port]`
- `tcp:postgresql://hostname[:port][/dbname][?options]`
- `unix:postgresql://localhost[:port][/dbname][?options]`
- an SQL string literal containing one of the above forms
- a reference to a character variable containing one of the above forms (see examples)
- `DEFAULT`

The connection target `DEFAULT` initiates a connection to the default database under the default user name. No separate user name or connection name can be specified in that case.

If you specify the connection target directly (that is, not as a string literal or variable reference), then the components of the target are passed through normal SQL parsing; this means that, for example, the _`hostname`_ must look like one or more SQL identifiers separated by dots, and those identifiers will be case-folded unless double-quoted. Values of any _`options`_ must be SQL identifiers, integers, or variable references. Of course, you can put nearly anything into an SQL identifier by double-quoting it. In practice, it is probably less error-prone to use a (single-quoted) string literal or a variable reference than to write the connection target directly.

There are also different ways to specify the user name:

- `username`
- `username/password`
- `username IDENTIFIED BY password`
- `username USING password`

As above, the parameters _`username`_ and _`password`_ can be an SQL identifier, an SQL string literal, or a reference to a character variable.

If the connection target includes any _`options`_, those consist of `keyword=value` specifications separated by ampersands (`&`). The allowed key words are the same ones recognized by libpq (see [Section 34.1.2](libpq-connect#LIBPQ-PARAMKEYWORDS)). Spaces are ignored before any _`keyword`_ or _`value`_, though not within or after one. Note that there is no way to write `&` within a _`value`_.

Notice that when specifying a socket connection (with the `unix:` prefix), the host name must be exactly `localhost`. To select a non-default socket directory, write the directory's pathname as the value of a `host` option in the _`options`_ part of the target.

The _`connection-name`_ is used to handle multiple connections in one program. It can be omitted if a program uses only one connection. The most recently opened connection becomes the current connection, which is used by default when an SQL statement is to be executed (see later in this chapter).

Here are some examples of `CONNECT` statements:

```

EXEC SQL CONNECT TO mydb@sql.mydomain.com;

EXEC SQL CONNECT TO tcp:postgresql://sql.mydomain.com/mydb AS myconnection USER john;

EXEC SQL BEGIN DECLARE SECTION;
const char *target = "mydb@sql.mydomain.com";
const char *user = "john";
const char *passwd = "secret";
EXEC SQL END DECLARE SECTION;
 ...
EXEC SQL CONNECT TO :target USER :user USING :passwd;
/* or EXEC SQL CONNECT TO :target USER :user/:passwd; */
```

The last example makes use of the feature referred to above as character variable references. You will see in later sections how C variables can be used in SQL statements when you prefix them with a colon.

Be advised that the format of the connection target is not specified in the SQL standard. So if you want to develop portable applications, you might want to use something based on the last example above to encapsulate the connection target string somewhere.

If untrusted users have access to a database that has not adopted a [secure schema usage pattern](ddl-schemas#DDL-SCHEMAS-PATTERNS), begin each session by removing publicly-writable schemas from `search_path`. For example, add `options=-c search_path=` to `options`, or issue `EXEC SQL SELECT pg_catalog.set_config('search_path', '', false);` after connecting. This consideration is not specific to ECPG; it applies to every interface for executing arbitrary SQL commands.

[#id](#ECPG-SET-CONNECTION)

### 36.2.2. Choosing a Connection [#](#ECPG-SET-CONNECTION)

SQL statements in embedded SQL programs are by default executed on the current connection, that is, the most recently opened one. If an application needs to manage multiple connections, then there are three ways to handle this.

The first option is to explicitly choose a connection for each SQL statement, for example:

```

EXEC SQL AT connection-name SELECT ...;
```

This option is particularly suitable if the application needs to use several connections in mixed order.

If your application uses multiple threads of execution, they cannot share a connection concurrently. You must either explicitly control access to the connection (using mutexes) or use a connection for each thread.

The second option is to execute a statement to switch the current connection. That statement is:

```

EXEC SQL SET CONNECTION connection-name;
```

This option is particularly convenient if many statements are to be executed on the same connection.

Here is an example program managing multiple database connections:

```

#include <stdio.h>

EXEC SQL BEGIN DECLARE SECTION;
    char dbname[1024];
EXEC SQL END DECLARE SECTION;

int
main()
{
    EXEC SQL CONNECT TO testdb1 AS con1 USER testuser;
    EXEC SQL SELECT pg_catalog.set_config('search_path', '', false); EXEC SQL COMMIT;
    EXEC SQL CONNECT TO testdb2 AS con2 USER testuser;
    EXEC SQL SELECT pg_catalog.set_config('search_path', '', false); EXEC SQL COMMIT;
    EXEC SQL CONNECT TO testdb3 AS con3 USER testuser;
    EXEC SQL SELECT pg_catalog.set_config('search_path', '', false); EXEC SQL COMMIT;

    /* This query would be executed in the last opened database "testdb3". */
    EXEC SQL SELECT current_database() INTO :dbname;
    printf("current=%s (should be testdb3)\n", dbname);

    /* Using "AT" to run a query in "testdb2" */
    EXEC SQL AT con2 SELECT current_database() INTO :dbname;
    printf("current=%s (should be testdb2)\n", dbname);

    /* Switch the current connection to "testdb1". */
    EXEC SQL SET CONNECTION con1;

    EXEC SQL SELECT current_database() INTO :dbname;
    printf("current=%s (should be testdb1)\n", dbname);

    EXEC SQL DISCONNECT ALL;
    return 0;
}
```

This example would produce this output:

```

current=testdb3 (should be testdb3)
current=testdb2 (should be testdb2)
current=testdb1 (should be testdb1)
```

The third option is to declare an SQL identifier linked to the connection, for example:

```

EXEC SQL AT connection-name DECLARE statement-name STATEMENT;
EXEC SQL PREPARE statement-name FROM :dyn-string;
```

Once you link an SQL identifier to a connection, you execute dynamic SQL without an AT clause. Note that this option behaves like preprocessor directives, therefore the link is enabled only in the file.

Here is an example program using this option:

```

#include <stdio.h>

EXEC SQL BEGIN DECLARE SECTION;
char dbname[128];
char *dyn_sql = "SELECT current_database()";
EXEC SQL END DECLARE SECTION;

int main(){
  EXEC SQL CONNECT TO postgres AS con1;
  EXEC SQL CONNECT TO testdb AS con2;
  EXEC SQL AT con1 DECLARE stmt STATEMENT;
  EXEC SQL PREPARE stmt FROM :dyn_sql;
  EXEC SQL EXECUTE stmt INTO :dbname;
  printf("%s\n", dbname);

  EXEC SQL DISCONNECT ALL;
  return 0;
}
```

This example would produce this output, even if the default connection is testdb:

```

postgres
```

[#id](#ECPG-DISCONNECT)

### 36.2.3. Closing a Connection [#](#ECPG-DISCONNECT)

To close a connection, use the following statement:

```

EXEC SQL DISCONNECT [connection];
```

The _`connection`_ can be specified in the following ways:

- `connection-name`
- `DEFAULT`
- `CURRENT`
- `ALL`

If no connection name is specified, the current connection is closed.

It is good style that an application always explicitly disconnect from every connection it opened.
