[#id](#ECPG-SQL-TYPE)

## TYPE

TYPE — define a new data type

## Synopsis

```

TYPE type_name IS ctype
```

[#id](#id-1.7.5.20.17.3)

## Description

The `TYPE` command defines a new C type. It is equivalent to putting a `typedef` into a declare section.

This command is only recognized when `ecpg` is run with the `-c` option.

[#id](#id-1.7.5.20.17.4)

## Parameters

- _`type_name`_ [#](#ECPG-SQL-TYPE-TYPE-NAME)

  The name for the new type. It must be a valid C type name.

- _`ctype`_ [#](#ECPG-SQL-TYPE-CTYPE)

  A C type specification.

[#id](#id-1.7.5.20.17.5)

## Examples

```

EXEC SQL TYPE customer IS
    struct
    {
        varchar name[50];
        int     phone;
    };

EXEC SQL TYPE cust_ind IS
    struct ind
    {
        short   name_ind;
        short   phone_ind;
    };

EXEC SQL TYPE c IS char reference;
EXEC SQL TYPE ind IS union { int integer; short smallint; };
EXEC SQL TYPE intarray IS int[AMOUNT];
EXEC SQL TYPE str IS varchar[BUFFERSIZ];
EXEC SQL TYPE string IS char[11];
```

Here is an example program that uses `EXEC SQL TYPE`:

```

EXEC SQL WHENEVER SQLERROR SQLPRINT;

EXEC SQL TYPE tt IS
    struct
    {
        varchar v[256];
        int     i;
    };

EXEC SQL TYPE tt_ind IS
    struct ind {
        short   v_ind;
        short   i_ind;
    };

int
main(void)
{
EXEC SQL BEGIN DECLARE SECTION;
    tt t;
    tt_ind t_ind;
EXEC SQL END DECLARE SECTION;

    EXEC SQL CONNECT TO testdb AS con1;
    EXEC SQL SELECT pg_catalog.set_config('search_path', '', false); EXEC SQL COMMIT;

    EXEC SQL SELECT current_database(), 256 INTO :t:t_ind LIMIT 1;

    printf("t.v = %s\n", t.v.arr);
    printf("t.i = %d\n", t.i);

    printf("t_ind.v_ind = %d\n", t_ind.v_ind);
    printf("t_ind.i_ind = %d\n", t_ind.i_ind);

    EXEC SQL DISCONNECT con1;

    return 0;
}
```

The output from this program looks like this:

```

t.v = testdb
t.i = 256
t_ind.v_ind = 0
t_ind.i_ind = 0
```

[#id](#id-1.7.5.20.17.6)

## Compatibility

The `TYPE` command is a PostgreSQL extension.
