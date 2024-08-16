[#id](#CONTRIB-SPI)

## F.41. spi — Server Programming Interface features/examples [#](#CONTRIB-SPI)

- [F.41.1. refint — Functions for Implementing Referential Integrity](contrib-spi#CONTRIB-SPI-REFINT)
- [F.41.2. autoinc — Functions for Autoincrementing Fields](contrib-spi#CONTRIB-SPI-AUTOINC)
- [F.41.3. insert_username — Functions for Tracking Who Changed a Table](contrib-spi#CONTRIB-SPI-INSERT-USERNAME)
- [F.41.4. moddatetime — Functions for Tracking Last Modification Time](contrib-spi#CONTRIB-SPI-MODDATETIME)

The spi module provides several workable examples of using the [Server Programming Interface](spi) (SPI) and triggers. While these functions are of some value in their own right, they are even more useful as examples to modify for your own purposes. The functions are general enough to be used with any table, but you have to specify table and field names (as described below) while creating a trigger.

Each of the groups of functions described below is provided as a separately-installable extension.

[#id](#CONTRIB-SPI-REFINT)

### F.41.1. refint — Functions for Implementing Referential Integrity [#](#CONTRIB-SPI-REFINT)

`check_primary_key()` and `check_foreign_key()` are used to check foreign key constraints. (This functionality is long since superseded by the built-in foreign key mechanism, of course, but the module is still useful as an example.)

`check_primary_key()` checks the referencing table. To use, create a `BEFORE INSERT OR UPDATE` trigger using this function on a table referencing another table. Specify as the trigger arguments: the referencing table's column name(s) which form the foreign key, the referenced table name, and the column names in the referenced table which form the primary/unique key. To handle multiple foreign keys, create a trigger for each reference.

`check_foreign_key()` checks the referenced table. To use, create a `BEFORE DELETE OR UPDATE` trigger using this function on a table referenced by other table(s). Specify as the trigger arguments: the number of referencing tables for which the function has to perform checking, the action if a referencing key is found (`cascade` — to delete the referencing row, `restrict` — to abort transaction if referencing keys exist, `setnull` — to set referencing key fields to null), the triggered table's column names which form the primary/unique key, then the referencing table name and column names (repeated for as many referencing tables as were specified by first argument). Note that the primary/unique key columns should be marked NOT NULL and should have a unique index.

There are examples in `refint.example`.

[#id](#CONTRIB-SPI-AUTOINC)

### F.41.2. autoinc — Functions for Autoincrementing Fields [#](#CONTRIB-SPI-AUTOINC)

`autoinc()` is a trigger that stores the next value of a sequence into an integer field. This has some overlap with the built-in “serial column” feature, but it is not the same: `autoinc()` will override attempts to substitute a different field value during inserts, and optionally it can be used to increment the field during updates, too.

To use, create a `BEFORE INSERT` (or optionally `BEFORE INSERT OR UPDATE`) trigger using this function. Specify two trigger arguments: the name of the integer column to be modified, and the name of the sequence object that will supply values. (Actually, you can specify any number of pairs of such names, if you'd like to update more than one autoincrementing column.)

There is an example in `autoinc.example`.

[#id](#CONTRIB-SPI-INSERT-USERNAME)

### F.41.3. insert_username — Functions for Tracking Who Changed a Table [#](#CONTRIB-SPI-INSERT-USERNAME)

`insert_username()` is a trigger that stores the current user's name into a text field. This can be useful for tracking who last modified a particular row within a table.

To use, create a `BEFORE INSERT` and/or `UPDATE` trigger using this function. Specify a single trigger argument: the name of the text column to be modified.

There is an example in `insert_username.example`.

[#id](#CONTRIB-SPI-MODDATETIME)

### F.41.4. moddatetime — Functions for Tracking Last Modification Time [#](#CONTRIB-SPI-MODDATETIME)

`moddatetime()` is a trigger that stores the current time into a `timestamp` field. This can be useful for tracking the last modification time of a particular row within a table.

To use, create a `BEFORE UPDATE` trigger using this function. Specify a single trigger argument: the name of the column to be modified. The column must be of type `timestamp` or `timestamp with time zone`.

There is an example in `moddatetime.example`.
