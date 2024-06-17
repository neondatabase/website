[#id](#ECPG-SQL-VAR)

## VAR

VAR — define a variable

## Synopsis

```

VAR varname IS ctype
```

[#id](#id-1.7.5.20.18.3)

## Description

The `VAR` command assigns a new C data type to a host variable. The host variable must be previously declared in a declare section.

[#id](#id-1.7.5.20.18.4)

## Parameters

- _`varname`_ [#](#ECPG-SQL-VAR-VARNAME)

  A C variable name.

- _`ctype`_ [#](#ECPG-SQL-VAR-CTYPE)

  A C type specification.

[#id](#id-1.7.5.20.18.5)

## Examples

```

Exec sql begin declare section;
short a;
exec sql end declare section;
EXEC SQL VAR a IS int;
```

[#id](#id-1.7.5.20.18.6)

## Compatibility

The `VAR` command is a PostgreSQL extension.
