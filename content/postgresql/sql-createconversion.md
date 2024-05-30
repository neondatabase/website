[#id](#SQL-CREATECONVERSION)

## CREATE CONVERSION

CREATE CONVERSION — define a new encoding conversion

## Synopsis

```
CREATE [ DEFAULT ] CONVERSION name
    FOR source_encoding TO dest_encoding FROM function_name
```

[#id](#SQL-CREATECONVERSION-DESCRIPTION)

## Description

`CREATE CONVERSION` defines a new conversion between two character set encodings.

Conversions that are marked `DEFAULT` can be used for automatic encoding conversion between client and server. To support that usage, two conversions, from encoding A to B _and_ from encoding B to A, must be defined.

To be able to create a conversion, you must have `EXECUTE` privilege on the function and `CREATE` privilege on the destination schema.

[#id](#id-1.9.3.60.6)

## Parameters

- `DEFAULT`

  The `DEFAULT` clause indicates that this conversion is the default for this particular source to destination encoding. There should be only one default encoding in a schema for the encoding pair.

- _`name`_

  The name of the conversion. The conversion name can be schema-qualified. If it is not, the conversion is defined in the current schema. The conversion name must be unique within a schema.

- _`source_encoding`_

  The source encoding name.

- _`dest_encoding`_

  The destination encoding name.

- _`function_name`_

  The function used to perform the conversion. The function name can be schema-qualified. If it is not, the function will be looked up in the path.

  The function must have the following signature:

  ```
  conv_proc(
      integer,  -- source encoding ID
      integer,  -- destination encoding ID
      cstring,  -- source string (null terminated C string)
      internal, -- destination (fill with a null terminated C string)
      integer,  -- source string length
      boolean   -- if true, don't throw an error if conversion fails
  ) RETURNS integer;
  ```

  The return value is the number of source bytes that were successfully converted. If the last argument is false, the function must throw an error on invalid input, and the return value is always equal to the source string length.

[#id](#SQL-CREATECONVERSION-NOTES)

## Notes

Neither the source nor the destination encoding can be `SQL_ASCII`, as the server's behavior for cases involving the `SQL_ASCII` “encoding” is hard-wired.

Use `DROP CONVERSION` to remove user-defined conversions.

The privileges required to create a conversion might be changed in a future release.

[#id](#SQL-CREATECONVERSION-EXAMPLES)

## Examples

To create a conversion from encoding `UTF8` to `LATIN1` using `myfunc`:

```
CREATE CONVERSION myconv FOR 'UTF8' TO 'LATIN1' FROM myfunc;
```

[#id](#SQL-CREATECONVERSION-COMPAT)

## Compatibility

`CREATE CONVERSION` is a PostgreSQL extension. There is no `CREATE CONVERSION` statement in the SQL standard, but a `CREATE TRANSLATION` statement that is very similar in purpose and syntax.

[#id](#SQL-CREATECONVERSION-SEEALSO)

## See Also

[ALTER CONVERSION](sql-alterconversion), [CREATE FUNCTION](sql-createfunction), [DROP CONVERSION](sql-dropconversion)
