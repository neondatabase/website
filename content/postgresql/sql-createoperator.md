[#id](#SQL-CREATEOPERATOR)

## CREATE OPERATOR

CREATE OPERATOR — define a new operator

## Synopsis

```
CREATE OPERATOR name (
    {FUNCTION|PROCEDURE} = function_name
    [, LEFTARG = left_type ] [, RIGHTARG = right_type ]
    [, COMMUTATOR = com_op ] [, NEGATOR = neg_op ]
    [, RESTRICT = res_proc ] [, JOIN = join_proc ]
    [, HASHES ] [, MERGES ]
)
```

[#id](#id-1.9.3.72.5)

## Description

`CREATE OPERATOR` defines a new operator, _`name`_. The user who defines an operator becomes its owner. If a schema name is given then the operator is created in the specified schema. Otherwise it is created in the current schema.

The operator name is a sequence of up to `NAMEDATALEN`-1 (63 by default) characters from the following list:

``+ - \* / < > = \~ ! @ # % ^ & | \` ?``

There are a few restrictions on your choice of name:

- `--` and `/*` cannot appear anywhere in an operator name, since they will be taken as the start of a comment.

- A multicharacter operator name cannot end in `+` or `-`, unless the name also contains at least one of these characters:

  ``\~ ! @ # % ^ & | \` ?``

  For example, `@-` is an allowed operator name, but `*-` is not. This restriction allows PostgreSQL to parse SQL-compliant commands without requiring spaces between tokens.

- The use of `=>` as an operator name is deprecated. It may be disallowed altogether in a future release.

The operator `!=` is mapped to `<>` on input, so these two names are always equivalent.

For binary operators, both `LEFTARG` and `RIGHTARG` must be defined. For prefix operators only `RIGHTARG` should be defined. The _`function_name`_ function must have been previously defined using `CREATE FUNCTION` and must be defined to accept the correct number of arguments (either one or two) of the indicated types.

In the syntax of `CREATE OPERATOR`, the keywords `FUNCTION` and `PROCEDURE` are equivalent, but the referenced function must in any case be a function, not a procedure. The use of the keyword `PROCEDURE` here is historical and deprecated.

The other clauses specify optional operator optimization clauses. Their meaning is detailed in [Section 38.15](xoper-optimization).

To be able to create an operator, you must have `USAGE` privilege on the argument types and the return type, as well as `EXECUTE` privilege on the underlying function. If a commutator or negator operator is specified, you must own these operators.

[#id](#id-1.9.3.72.6)

## Parameters

- _`name`_

  The name of the operator to be defined. See above for allowable characters. The name can be schema-qualified, for example `CREATE OPERATOR myschema.+ (...)`. If not, then the operator is created in the current schema. Two operators in the same schema can have the same name if they operate on different data types. This is called _overloading_.

- _`function_name`_

  The function used to implement this operator.

- _`left_type`_

  The data type of the operator's left operand, if any. This option would be omitted for a prefix operator.

- _`right_type`_

  The data type of the operator's right operand.

- _`com_op`_

  The commutator of this operator.

- _`neg_op`_

  The negator of this operator.

- _`res_proc`_

  The restriction selectivity estimator function for this operator.

- _`join_proc`_

  The join selectivity estimator function for this operator.

- `HASHES`

  Indicates this operator can support a hash join.

- `MERGES`

  Indicates this operator can support a merge join.

To give a schema-qualified operator name in _`com_op`_ or the other optional arguments, use the `OPERATOR()` syntax, for example:

```
COMMUTATOR = OPERATOR(myschema.===) ,
```

[#id](#id-1.9.3.72.7)

## Notes

Refer to [Section 38.14](xoper) for further information.

It is not possible to specify an operator's lexical precedence in `CREATE OPERATOR`, because the parser's precedence behavior is hard-wired. See [Section 4.1.6](sql-syntax-lexical#SQL-PRECEDENCE) for precedence details.

The obsolete options `SORT1`, `SORT2`, `LTCMP`, and `GTCMP` were formerly used to specify the names of sort operators associated with a merge-joinable operator. This is no longer necessary, since information about associated operators is found by looking at B-tree operator families instead. If one of these options is given, it is ignored except for implicitly setting `MERGES` true.

Use [`DROP OPERATOR`](sql-dropoperator) to delete user-defined operators from a database. Use [`ALTER OPERATOR`](sql-alteroperator) to modify operators in a database.

[#id](#id-1.9.3.72.8)

## Examples

The following command defines a new operator, area-equality, for the data type `box`:

```
CREATE OPERATOR === (
    LEFTARG = box,
    RIGHTARG = box,
    FUNCTION = area_equal_function,
    COMMUTATOR = ===,
    NEGATOR = !==,
    RESTRICT = area_restriction_function,
    JOIN = area_join_function,
    HASHES, MERGES
);
```

[#id](#id-1.9.3.72.9)

## Compatibility

`CREATE OPERATOR` is a PostgreSQL extension. There are no provisions for user-defined operators in the SQL standard.

[#id](#id-1.9.3.72.10)

## See Also

[ALTER OPERATOR](sql-alteroperator), [CREATE OPERATOR CLASS](sql-createopclass), [DROP OPERATOR](sql-dropoperator)
