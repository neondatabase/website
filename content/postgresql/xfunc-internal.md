<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                   38.9. Internal Functions                   |                                               |                           |                                                       |                                                     |
| :----------------------------------------------------------: | :-------------------------------------------- | :-----------------------: | ----------------------------------------------------: | --------------------------------------------------: |
| [Prev](xfunc-pl.html "38.8. Procedural Language Functions")  | [Up](extend.html "Chapter 38. Extending SQL") | Chapter 38. Extending SQL | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](xfunc-c.html "38.10. C-Language Functions") |

***

## 38.9. Internal Functions [#](#XFUNC-INTERNAL)



Internal functions are functions written in C that have been statically linked into the PostgreSQL server. The “body” of the function definition specifies the C-language name of the function, which need not be the same as the name being declared for SQL use. (For reasons of backward compatibility, an empty body is accepted as meaning that the C-language function name is the same as the SQL name.)

Normally, all internal functions present in the server are declared during the initialization of the database cluster (see [Section 19.2](creating-cluster.html "19.2. Creating a Database Cluster")), but a user could use `CREATE FUNCTION` to create additional alias names for an internal function. Internal functions are declared in `CREATE FUNCTION` with language name `internal`. For instance, to create an alias for the `sqrt` function:

```

CREATE FUNCTION square_root(double precision) RETURNS double precision
    AS 'dsqrt'
    LANGUAGE internal
    STRICT;
```

(Most internal functions expect to be declared “strict”.)

### Note

Not all “predefined” functions are “internal” in the above sense. Some predefined functions are written in SQL.

***

|                                                              |                                                       |                                                     |
| :----------------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------------: |
| [Prev](xfunc-pl.html "38.8. Procedural Language Functions")  |     [Up](extend.html "Chapter 38. Extending SQL")     |  [Next](xfunc-c.html "38.10. C-Language Functions") |
| 38.8. Procedural Language Functions                          | [Home](index.html "PostgreSQL 17devel Documentation") |                         38.10. C-Language Functions |
