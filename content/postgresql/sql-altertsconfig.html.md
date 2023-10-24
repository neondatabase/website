<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|            ALTER TEXT SEARCH CONFIGURATION           |                                        |              |                                                       |                                                                    |
| :--------------------------------------------------: | :------------------------------------- | :----------: | ----------------------------------------------------: | -----------------------------------------------------------------: |
| [Prev](sql-altertablespace.html "ALTER TABLESPACE")  | [Up](sql-commands.html "SQL Commands") | SQL Commands | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-altertsdictionary.html "ALTER TEXT SEARCH DICTIONARY") |

***

[]()

## ALTER TEXT SEARCH CONFIGURATION

ALTER TEXT SEARCH CONFIGURATION — change the definition of a text search configuration

## Synopsis

    ALTER TEXT SEARCH CONFIGURATION name
        ADD MAPPING FOR token_type [, ... ] WITH dictionary_name [, ... ]
    ALTER TEXT SEARCH CONFIGURATION name
        ALTER MAPPING FOR token_type [, ... ] WITH dictionary_name [, ... ]
    ALTER TEXT SEARCH CONFIGURATION name
        ALTER MAPPING REPLACE old_dictionary WITH new_dictionary
    ALTER TEXT SEARCH CONFIGURATION name
        ALTER MAPPING FOR token_type [, ... ] REPLACE old_dictionary WITH new_dictionary
    ALTER TEXT SEARCH CONFIGURATION name
        DROP MAPPING [ IF EXISTS ] FOR token_type [, ... ]
    ALTER TEXT SEARCH CONFIGURATION name RENAME TO new_name
    ALTER TEXT SEARCH CONFIGURATION name OWNER TO { new_owner | CURRENT_ROLE | CURRENT_USER | SESSION_USER }
    ALTER TEXT SEARCH CONFIGURATION name SET SCHEMA new_schema

## Description

`ALTER TEXT SEARCH CONFIGURATION` changes the definition of a text search configuration. You can modify its mappings from token types to dictionaries, or change the configuration's name or owner.

You must be the owner of the configuration to use `ALTER TEXT SEARCH CONFIGURATION`.

## Parameters

*   *`name`*

    The name (optionally schema-qualified) of an existing text search configuration.

*   *`token_type`*

    The name of a token type that is emitted by the configuration's parser.

*   *`dictionary_name`*

    The name of a text search dictionary to be consulted for the specified token type(s). If multiple dictionaries are listed, they are consulted in the specified order.

*   *`old_dictionary`*

    The name of a text search dictionary to be replaced in the mapping.

*   *`new_dictionary`*

    The name of a text search dictionary to be substituted for *`old_dictionary`*.

*   *`new_name`*

    The new name of the text search configuration.

*   *`new_owner`*

    The new owner of the text search configuration.

*   *`new_schema`*

    The new schema for the text search configuration.

The `ADD MAPPING FOR` form installs a list of dictionaries to be consulted for the specified token type(s); it is an error if there is already a mapping for any of the token types. The `ALTER MAPPING FOR` form does the same, but first removing any existing mapping for those token types. The `ALTER MAPPING REPLACE` forms substitute *`new_dictionary`* for *`old_dictionary`* anywhere the latter appears. This is done for only the specified token types when `FOR` appears, or for all mappings of the configuration when it doesn't. The `DROP MAPPING` form removes all dictionaries for the specified token type(s), causing tokens of those types to be ignored by the text search configuration. It is an error if there is no mapping for the token types, unless `IF EXISTS` appears.

## Examples

The following example replaces the `english` dictionary with the `swedish` dictionary anywhere that `english` is used within `my_config`.

    ALTER TEXT SEARCH CONFIGURATION my_config
      ALTER MAPPING REPLACE english WITH swedish;

## Compatibility

There is no `ALTER TEXT SEARCH CONFIGURATION` statement in the SQL standard.

## See Also

[CREATE TEXT SEARCH CONFIGURATION](sql-createtsconfig.html "CREATE TEXT SEARCH CONFIGURATION"), [DROP TEXT SEARCH CONFIGURATION](sql-droptsconfig.html "DROP TEXT SEARCH CONFIGURATION")

***

|                                                      |                                                       |                                                                    |
| :--------------------------------------------------- | :---------------------------------------------------: | -----------------------------------------------------------------: |
| [Prev](sql-altertablespace.html "ALTER TABLESPACE")  |         [Up](sql-commands.html "SQL Commands")        |  [Next](sql-altertsdictionary.html "ALTER TEXT SEARCH DICTIONARY") |
| ALTER TABLESPACE                                     | [Home](index.html "PostgreSQL 17devel Documentation") |                                       ALTER TEXT SEARCH DICTIONARY |
