<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                   ALTER RULE                   |                                        |              |                                                       |                                              |
| :--------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | -------------------------------------------: |
| [Prev](sql-alterroutine.html "ALTER ROUTINE")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-alterschema.html "ALTER SCHEMA") |

***

## ALTER RULE

ALTER RULE — change the definition of a rule

## Synopsis

    ALTER RULE name ON table_name RENAME TO new_name

## Description

`ALTER RULE` changes properties of an existing rule. Currently, the only available action is to change the rule's name.

To use `ALTER RULE`, you must own the table or view that the rule applies to.

## Parameters

* *`name`*

    The name of an existing rule to alter.

* *`table_name`*

    The name (optionally schema-qualified) of the table or view that the rule applies to.

* *`new_name`*

    The new name for the rule.

## Examples

To rename an existing rule:

    ALTER RULE notify_all ON emp RENAME TO notify_me;

## Compatibility

`ALTER RULE` is a PostgreSQL language extension, as is the entire query rewrite system.

## See Also

[CREATE RULE](sql-createrule.html "CREATE RULE"), [DROP RULE](sql-droprule.html "DROP RULE")

***

|                                                |                                                       |                                              |
| :--------------------------------------------- | :---------------------------------------------------: | -------------------------------------------: |
| [Prev](sql-alterroutine.html "ALTER ROUTINE")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-alterschema.html "ALTER SCHEMA") |
| ALTER ROUTINE                                  | [Home](index.html "PostgreSQL 17devel Documentation") |                                 ALTER SCHEMA |
