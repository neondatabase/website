[#id](#ECPG-SQL-SET-DESCRIPTOR)

## SET DESCRIPTOR

SET DESCRIPTOR — set information in an SQL descriptor area

## Synopsis

```

SET DESCRIPTOR descriptor_name descriptor_header_item = value [, ... ]
SET DESCRIPTOR descriptor_name VALUE number descriptor_item = value [, ...]
```

[#id](#id-1.7.5.20.16.3)

## Description

`SET DESCRIPTOR` populates an SQL descriptor area with values. The descriptor area is then typically used to bind parameters in a prepared query execution.

This command has two forms: The first form applies to the descriptor “header”, which is independent of a particular datum. The second form assigns values to particular datums, identified by number.

[#id](#id-1.7.5.20.16.4)

## Parameters

- _`descriptor_name`_ [#](#ECPG-SQL-SET-DESCRIPTOR-DESCRIPTOR-NAME)

  A descriptor name.

- _`descriptor_header_item`_ [#](#ECPG-SQL-SET-DESCRIPTOR-DESCRIPTOR-HEADER-ITEM)

  A token identifying which header information item to set. Only `COUNT`, to set the number of descriptor items, is currently supported.

- _`number`_ [#](#ECPG-SQL-SET-DESCRIPTOR-NUMBER)

  The number of the descriptor item to set. The count starts at 1.

- _`descriptor_item`_ [#](#ECPG-SQL-SET-DESCRIPTOR-DESCRIPTOR-ITEM)

  A token identifying which item of information to set in the descriptor. See [Section 36.7.1](ecpg-descriptors#ECPG-NAMED-DESCRIPTORS) for a list of supported items.

- _`value`_ [#](#ECPG-SQL-SET-DESCRIPTOR-VALUE)

  A value to store into the descriptor item. This can be an SQL constant or a host variable.

[#id](#id-1.7.5.20.16.5)

## Examples

```

EXEC SQL SET DESCRIPTOR indesc COUNT = 1;
EXEC SQL SET DESCRIPTOR indesc VALUE 1 DATA = 2;
EXEC SQL SET DESCRIPTOR indesc VALUE 1 DATA = :val1;
EXEC SQL SET DESCRIPTOR indesc VALUE 2 INDICATOR = :val1, DATA = 'some string';
EXEC SQL SET DESCRIPTOR indesc VALUE 2 INDICATOR = :val2null, DATA = :val2;
```

[#id](#id-1.7.5.20.16.6)

## Compatibility

`SET DESCRIPTOR` is specified in the SQL standard.

[#id](#id-1.7.5.20.16.7)

## See Also

[ALLOCATE DESCRIPTOR](ecpg-sql-allocate-descriptor), [GET DESCRIPTOR](ecpg-sql-get-descriptor)
