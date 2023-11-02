## 9.1. Logical Operators [#](#FUNCTIONS-LOGICAL)

The usual logical operators are available:

```

boolean AND boolean → boolean
boolean OR boolean → boolean
NOT boolean → boolean
```

SQL uses a three-valued logic system with true, false, and `null`, which represents “unknown”. Observe the following truth tables:

| *`a`* | *`b`* | *`a`* AND *`b`* | *`a`* OR *`b`* |
| ----- | ----- | --------------- | -------------- |
| TRUE  | TRUE  | TRUE            | TRUE           |
| TRUE  | FALSE | FALSE           | TRUE           |
| TRUE  | NULL  | NULL            | TRUE           |
| FALSE | FALSE | FALSE           | FALSE          |
| FALSE | NULL  | FALSE           | NULL           |
| NULL  | NULL  | NULL            | NULL           |

| *`a`* | NOT *`a`* |
| ----- | --------- |
| TRUE  | FALSE     |
| FALSE | TRUE      |
| NULL  | NULL      |

The operators `AND` and `OR` are commutative, that is, you can switch the left and right operands without affecting the result. (However, it is not guaranteed that the left operand is evaluated before the right operand. See [Section 4.2.14](sql-expressions#SYNTAX-EXPRESS-EVAL "4.2.14. Expression Evaluation Rules") for more information about the order of evaluation of subexpressions.)