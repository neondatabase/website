<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                        GET DESCRIPTOR                        |                                                             |                              |                                                       |                                    |
| :----------------------------------------------------------: | :---------------------------------------------------------- | :--------------------------: | ----------------------------------------------------: | ---------------------------------: |
| [Prev](ecpg-sql-execute-immediate.html "EXECUTE IMMEDIATE")  | [Up](ecpg-sql-commands.html "36.14. Embedded SQL Commands") | 36.14. Embedded SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](ecpg-sql-open.html "OPEN") |

***

## GET DESCRIPTOR

GET DESCRIPTOR — get information from an SQL descriptor area

## Synopsis

```

GET DESCRIPTOR descriptor_name :cvariable = descriptor_header_item [, ... ]
GET DESCRIPTOR descriptor_name VALUE column_number :cvariable = descriptor_item [, ... ]
```

## Description

`GET DESCRIPTOR` retrieves information about a query result set from an SQL descriptor area and stores it into host variables. A descriptor area is typically populated using `FETCH` or `SELECT` before using this command to transfer the information into host language variables.

This command has two forms: The first form retrieves descriptor “header” items, which apply to the result set in its entirety. One example is the row count. The second form, which requires the column number as additional parameter, retrieves information about a particular column. Examples are the column name and the actual column value.

## Parameters

* *`descriptor_name`* [#](#ECPG-SQL-GET-DESCRIPTOR-DESCRIPTOR-NAME)

    A descriptor name.

* *`descriptor_header_item`* [#](#ECPG-SQL-GET-DESCRIPTOR-DESCRIPTOR-HEADER-ITEM)

    A token identifying which header information item to retrieve. Only `COUNT`, to get the number of columns in the result set, is currently supported.

* *`column_number`* [#](#ECPG-SQL-GET-DESCRIPTOR-COLUMN-NUMBER)

    The number of the column about which information is to be retrieved. The count starts at 1.

* *`descriptor_item`* [#](#ECPG-SQL-GET-DESCRIPTOR-DESCRIPTOR-ITEM)

    A token identifying which item of information about a column to retrieve. See [Section 36.7.1](ecpg-descriptors.html#ECPG-NAMED-DESCRIPTORS "36.7.1. Named SQL Descriptor Areas") for a list of supported items.

* *`cvariable`* [#](#ECPG-SQL-GET-DESCRIPTOR-CVARIABLE)

    A host variable that will receive the data retrieved from the descriptor area.

## Examples

An example to retrieve the number of columns in a result set:

```

EXEC SQL GET DESCRIPTOR d :d_count = COUNT;
```

An example to retrieve a data length in the first column:

```

EXEC SQL GET DESCRIPTOR d VALUE 1 :d_returned_octet_length = RETURNED_OCTET_LENGTH;
```

An example to retrieve the data body of the second column as a string:

```

EXEC SQL GET DESCRIPTOR d VALUE 2 :d_data = DATA;
```

Here is an example for a whole procedure of executing `SELECT current_database();` and showing the number of columns, the column data length, and the column data:

```

int
main(void)
{
EXEC SQL BEGIN DECLARE SECTION;
    int  d_count;
    char d_data[1024];
    int  d_returned_octet_length;
EXEC SQL END DECLARE SECTION;

    EXEC SQL CONNECT TO testdb AS con1 USER testuser;
    EXEC SQL SELECT pg_catalog.set_config('search_path', '', false); EXEC SQL COMMIT;
    EXEC SQL ALLOCATE DESCRIPTOR d;

    /* Declare, open a cursor, and assign a descriptor to the cursor  */
    EXEC SQL DECLARE cur CURSOR FOR SELECT current_database();
    EXEC SQL OPEN cur;
    EXEC SQL FETCH NEXT FROM cur INTO SQL DESCRIPTOR d;

    /* Get a number of total columns */
    EXEC SQL GET DESCRIPTOR d :d_count = COUNT;
    printf("d_count                 = %d\n", d_count);

    /* Get length of a returned column */
    EXEC SQL GET DESCRIPTOR d VALUE 1 :d_returned_octet_length = RETURNED_OCTET_LENGTH;
    printf("d_returned_octet_length = %d\n", d_returned_octet_length);

    /* Fetch the returned column as a string */
    EXEC SQL GET DESCRIPTOR d VALUE 1 :d_data = DATA;
    printf("d_data                  = %s\n", d_data);

    /* Closing */
    EXEC SQL CLOSE cur;
    EXEC SQL COMMIT;

    EXEC SQL DEALLOCATE DESCRIPTOR d;
    EXEC SQL DISCONNECT ALL;

    return 0;
}
```

When the example is executed, the result will look like this:

```

d_count                 = 1
d_returned_octet_length = 6
d_data                  = testdb
```

## Compatibility

`GET DESCRIPTOR` is specified in the SQL standard.

## See Also

[ALLOCATE DESCRIPTOR](ecpg-sql-allocate-descriptor.html "ALLOCATE DESCRIPTOR"), [SET DESCRIPTOR](ecpg-sql-set-descriptor.html "SET DESCRIPTOR")

***

|                                                              |                                                             |                                    |
| :----------------------------------------------------------- | :---------------------------------------------------------: | ---------------------------------: |
| [Prev](ecpg-sql-execute-immediate.html "EXECUTE IMMEDIATE")  | [Up](ecpg-sql-commands.html "36.14. Embedded SQL Commands") |  [Next](ecpg-sql-open.html "OPEN") |
| EXECUTE IMMEDIATE                                            |    [Home](index.html "PostgreSQL 17devel Documentation")    |                               OPEN |
