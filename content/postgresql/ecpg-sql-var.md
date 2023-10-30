## VAR

VAR — define a variable

## Synopsis

```

VAR varname IS ctype
```

## Description

The `VAR` command assigns a new C data type to a host variable. The host variable must be previously declared in a declare section.

## Parameters

* *`varname`* [#](#ECPG-SQL-VAR-VARNAME)

    A C variable name.

* *`ctype`* [#](#ECPG-SQL-VAR-CTYPE)

    A C type specification.

## Examples

```

Exec sql begin declare section;
short a;
exec sql end declare section;
EXEC SQL VAR a IS int;
```

## Compatibility

The `VAR` command is a PostgreSQL extension.