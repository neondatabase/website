

|               ALTER ROUTINE              |                                        |              |                                                       |                                          |
| :--------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | ---------------------------------------: |
| [Prev](sql-alterrole.html "ALTER ROLE")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-alterrule.html "ALTER RULE") |

***

## ALTER ROUTINE

ALTER ROUTINE — change the definition of a routine

## Synopsis

```

ALTER ROUTINE name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    action [ ... ] [ RESTRICT ]
ALTER ROUTINE name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    RENAME TO new_name
ALTER ROUTINE name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
ALTER ROUTINE name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    SET SCHEMA new_schema
ALTER ROUTINE name [ ( [ [ argmode ] [ argname ] argtype [, ...] ] ) ]
    [ NO ] DEPENDS ON EXTENSION extension_name

where action is one of:

    IMMUTABLE | STABLE | VOLATILE
    [ NOT ] LEAKPROOF
    [ EXTERNAL ] SECURITY INVOKER | [ EXTERNAL ] SECURITY DEFINER
    PARALLEL { UNSAFE | RESTRICTED | SAFE }
    COST execution_cost
    ROWS result_rows
    SET configuration_parameter { TO | = } { value | DEFAULT }
    SET configuration_parameter FROM CURRENT
    RESET configuration_parameter
    RESET ALL
```

## Description

`ALTER ROUTINE` changes the definition of a routine, which can be an aggregate function, a normal function, or a procedure. See under [ALTER AGGREGATE](sql-alteraggregate.html "ALTER AGGREGATE"), [ALTER FUNCTION](sql-alterfunction.html "ALTER FUNCTION"), and [ALTER PROCEDURE](sql-alterprocedure.html "ALTER PROCEDURE") for the description of the parameters, more examples, and further details.

## Examples

To rename the routine `foo` for type `integer` to `foobar`:

```

ALTER ROUTINE foo(integer) RENAME TO foobar;
```

This command will work independent of whether `foo` is an aggregate, function, or procedure.

## Compatibility

This statement is partially compatible with the `ALTER ROUTINE` statement in the SQL standard. See under [ALTER FUNCTION](sql-alterfunction.html "ALTER FUNCTION") and [ALTER PROCEDURE](sql-alterprocedure.html "ALTER PROCEDURE") for more details. Allowing routine names to refer to aggregate functions is a PostgreSQL extension.

## See Also

[ALTER AGGREGATE](sql-alteraggregate.html "ALTER AGGREGATE"), [ALTER FUNCTION](sql-alterfunction.html "ALTER FUNCTION"), [ALTER PROCEDURE](sql-alterprocedure.html "ALTER PROCEDURE"), [DROP ROUTINE](sql-droproutine.html "DROP ROUTINE")

Note that there is no `CREATE ROUTINE` command.

***

|                                          |                                                       |                                          |
| :--------------------------------------- | :---------------------------------------------------: | ---------------------------------------: |
| [Prev](sql-alterrole.html "ALTER ROLE")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-alterrule.html "ALTER RULE") |
| ALTER ROLE                               | [Home](index.html "PostgreSQL 17devel Documentation") |                               ALTER RULE |
