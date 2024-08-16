[#id](#ECPG-ORACLE-COMPAT)

## 36.16. Oracle Compatibility Mode [#](#ECPG-ORACLE-COMPAT)

`ecpg` can be run in a so-called _Oracle compatibility mode_. If this mode is active, it tries to behave as if it were Oracle Pro\*C.

Specifically, this mode changes `ecpg` in three ways:

- Pad character arrays receiving character string types with trailing spaces to the specified length

- Zero byte terminate these character arrays, and set the indicator variable if truncation occurs

- Set the null indicator to `-1` when character arrays receive empty character string types
