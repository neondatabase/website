[#id](#FUNCTIONS-LOGICAL)

## 9.1. Logical Operators [#](#FUNCTIONS-LOGICAL)

The usual logical operators are available:

```

boolean AND boolean → boolean
boolean OR boolean → boolean
NOT boolean → boolean
```

SQL uses a three-valued logic system with true, false, and `null`, which represents “unknown”. Observe the following truth tables:

| _`a`_ | _`b`_ | _`a`_ AND _`b`_ | _`a`_ OR _`b`_ |
| ----- | ----- | --------------- | -------------- |
| TRUE  | TRUE  | TRUE            | TRUE           |
| TRUE  | FALSE | FALSE           | TRUE           |
| TRUE  | NULL  | NULL            | TRUE           |
| FALSE | FALSE | FALSE           | FALSE          |
| FALSE | NULL  | FALSE           | NULL           |
| NULL  | NULL  | NULL            | NULL           |

| _`a`_ | NOT _`a`_ |
| ----- | --------- |
| TRUE  | FALSE     |
| FALSE | TRUE      |
| NULL  | NULL      |

The operators `AND` and `OR` are commutative, that is, you can switch the left and right operands without affecting the result. (However, it is not guaranteed that the left operand is evaluated before the right operand. See [Section 4.2.14](sql-expressions#SYNTAX-EXPRESS-EVAL) for more information about the order of evaluation of subexpressions.)
