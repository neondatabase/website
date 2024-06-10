[#id](#XINDEX)

## 38.16. Interfacing Extensions to Indexes [#](#XINDEX)

- [38.16.1. Index Methods and Operator Classes](xindex#XINDEX-OPCLASS)
- [38.16.2. Index Method Strategies](xindex#XINDEX-STRATEGIES)
- [38.16.3. Index Method Support Routines](xindex#XINDEX-SUPPORT)
- [38.16.4. An Example](xindex#XINDEX-EXAMPLE)
- [38.16.5. Operator Classes and Operator Families](xindex#XINDEX-OPFAMILY)
- [38.16.6. System Dependencies on Operator Classes](xindex#XINDEX-OPCLASS-DEPENDENCIES)
- [38.16.7. Ordering Operators](xindex#XINDEX-ORDERING-OPS)
- [38.16.8. Special Features of Operator Classes](xindex#XINDEX-OPCLASS-FEATURES)

The procedures described thus far let you define new types, new functions, and new operators. However, we cannot yet define an index on a column of a new data type. To do this, we must define an _operator class_ for the new data type. Later in this section, we will illustrate this concept in an example: a new operator class for the B-tree index method that stores and sorts complex numbers in ascending absolute value order.

Operator classes can be grouped into _operator families_ to show the relationships between semantically compatible classes. When only a single data type is involved, an operator class is sufficient, so we'll focus on that case first and then return to operator families.

[#id](#XINDEX-OPCLASS)

### 38.16.1. Index Methods and Operator Classes [#](#XINDEX-OPCLASS)

The `pg_am` table contains one row for every index method (internally known as access method). Support for regular access to tables is built into PostgreSQL, but all index methods are described in `pg_am`. It is possible to add a new index access method by writing the necessary code and then creating an entry in `pg_am` — but that is beyond the scope of this chapter (see [Chapter 64](indexam)).

The routines for an index method do not directly know anything about the data types that the index method will operate on. Instead, an _operator class_ identifies the set of operations that the index method needs to use to work with a particular data type. Operator classes are so called because one thing they specify is the set of `WHERE`-clause operators that can be used with an index (i.e., can be converted into an index-scan qualification). An operator class can also specify some _support function_ that are needed by the internal operations of the index method, but do not directly correspond to any `WHERE`-clause operator that can be used with the index.

It is possible to define multiple operator classes for the same data type and index method. By doing this, multiple sets of indexing semantics can be defined for a single data type. For example, a B-tree index requires a sort ordering to be defined for each data type it works on. It might be useful for a complex-number data type to have one B-tree operator class that sorts the data by complex absolute value, another that sorts by real part, and so on. Typically, one of the operator classes will be deemed most commonly useful and will be marked as the default operator class for that data type and index method.

The same operator class name can be used for several different index methods (for example, both B-tree and hash index methods have operator classes named `int4_ops`), but each such class is an independent entity and must be defined separately.

[#id](#XINDEX-STRATEGIES)

### 38.16.2. Index Method Strategies [#](#XINDEX-STRATEGIES)

The operators associated with an operator class are identified by “strategy numbers”, which serve to identify the semantics of each operator within the context of its operator class. For example, B-trees impose a strict ordering on keys, lesser to greater, and so operators like “less than” and “greater than or equal to” are interesting with respect to a B-tree. Because PostgreSQL allows the user to define operators, PostgreSQL cannot look at the name of an operator (e.g., `<` or `>=`) and tell what kind of comparison it is. Instead, the index method defines a set of “strategies”, which can be thought of as generalized operators. Each operator class specifies which actual operator corresponds to each strategy for a particular data type and interpretation of the index semantics.

The B-tree index method defines five strategies, shown in [Table 38.3](xindex#XINDEX-BTREE-STRAT-TABLE).

[#id](#XINDEX-BTREE-STRAT-TABLE)

**Table 38.3. B-Tree Strategies**

| Operation             | Strategy Number |
| --------------------- | --------------- |
| less than             | 1               |
| less than or equal    | 2               |
| equal                 | 3               |
| greater than or equal | 4               |
| greater than          | 5               |

Hash indexes support only equality comparisons, and so they use only one strategy, shown in [Table 38.4](xindex#XINDEX-HASH-STRAT-TABLE).

[#id](#XINDEX-HASH-STRAT-TABLE)

**Table 38.4. Hash Strategies**

| Operation | Strategy Number |
| --------- | --------------- |
| equal     | 1               |

GiST indexes are more flexible: they do not have a fixed set of strategies at all. Instead, the “consistency” support routine of each particular GiST operator class interprets the strategy numbers however it likes. As an example, several of the built-in GiST index operator classes index two-dimensional geometric objects, providing the “R-tree” strategies shown in [Table 38.5](xindex#XINDEX-RTREE-STRAT-TABLE). Four of these are true two-dimensional tests (overlaps, same, contains, contained by); four of them consider only the X direction; and the other four provide the same tests in the Y direction.

[#id](#XINDEX-RTREE-STRAT-TABLE)

**Table 38.5. GiST Two-Dimensional “R-tree” Strategies**

| Operation                   | Strategy Number |
| --------------------------- | --------------- |
| strictly left of            | 1               |
| does not extend to right of | 2               |
| overlaps                    | 3               |
| does not extend to left of  | 4               |
| strictly right of           | 5               |
| same                        | 6               |
| contains                    | 7               |
| contained by                | 8               |
| does not extend above       | 9               |
| strictly below              | 10              |
| strictly above              | 11              |
| does not extend below       | 12              |

SP-GiST indexes are similar to GiST indexes in flexibility: they don't have a fixed set of strategies. Instead the support routines of each operator class interpret the strategy numbers according to the operator class's definition. As an example, the strategy numbers used by the built-in operator classes for points are shown in [Table 38.6](xindex#XINDEX-SPGIST-POINT-STRAT-TABLE).

[#id](#XINDEX-SPGIST-POINT-STRAT-TABLE)

**Table 38.6. SP-GiST Point Strategies**

| Operation         | Strategy Number |
| ----------------- | --------------- |
| strictly left of  | 1               |
| strictly right of | 5               |
| same              | 6               |
| contained by      | 8               |
| strictly below    | 10              |
| strictly above    | 11              |

GIN indexes are similar to GiST and SP-GiST indexes, in that they don't have a fixed set of strategies either. Instead the support routines of each operator class interpret the strategy numbers according to the operator class's definition. As an example, the strategy numbers used by the built-in operator class for arrays are shown in [Table 38.7](xindex#XINDEX-GIN-ARRAY-STRAT-TABLE).

[#id](#XINDEX-GIN-ARRAY-STRAT-TABLE)

**Table 38.7. GIN Array Strategies**

| Operation       | Strategy Number |
| --------------- | --------------- |
| overlap         | 1               |
| contains        | 2               |
| is contained by | 3               |
| equal           | 4               |

BRIN indexes are similar to GiST, SP-GiST and GIN indexes in that they don't have a fixed set of strategies either. Instead the support routines of each operator class interpret the strategy numbers according to the operator class's definition. As an example, the strategy numbers used by the built-in `Minmax` operator classes are shown in [Table 38.8](xindex#XINDEX-BRIN-MINMAX-STRAT-TABLE).

[#id](#XINDEX-BRIN-MINMAX-STRAT-TABLE)

**Table 38.8. BRIN Minmax Strategies**

| Operation             | Strategy Number |
| --------------------- | --------------- |
| less than             | 1               |
| less than or equal    | 2               |
| equal                 | 3               |
| greater than or equal | 4               |
| greater than          | 5               |

Notice that all the operators listed above return Boolean values. In practice, all operators defined as index method search operators must return type `boolean`, since they must appear at the top level of a `WHERE` clause to be used with an index. (Some index access methods also support _ordering operators_, which typically don't return Boolean values; that feature is discussed in [Section 38.16.7](xindex#XINDEX-ORDERING-OPS).)

[#id](#XINDEX-SUPPORT)

### 38.16.3. Index Method Support Routines [#](#XINDEX-SUPPORT)

Strategies aren't usually enough information for the system to figure out how to use an index. In practice, the index methods require additional support routines in order to work. For example, the B-tree index method must be able to compare two keys and determine whether one is greater than, equal to, or less than the other. Similarly, the hash index method must be able to compute hash codes for key values. These operations do not correspond to operators used in qualifications in SQL commands; they are administrative routines used by the index methods, internally.

Just as with strategies, the operator class identifies which specific functions should play each of these roles for a given data type and semantic interpretation. The index method defines the set of functions it needs, and the operator class identifies the correct functions to use by assigning them to the “support function numbers” specified by the index method.

Additionally, some opclasses allow users to specify parameters which control their behavior. Each builtin index access method has an optional `options` support function, which defines a set of opclass-specific parameters.

B-trees require a comparison support function, and allow four additional support functions to be supplied at the operator class author's option, as shown in [Table 38.9](xindex#XINDEX-BTREE-SUPPORT-TABLE). The requirements for these support functions are explained further in [Section 67.3](btree-support-funcs).

[#id](#XINDEX-BTREE-SUPPORT-TABLE)

**Table 38.9. B-Tree Support Functions**

| Function                                                                                                                                                               | Support Number |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| Compare two keys and return an integer less than zero, zero, or greater than zero, indicating whether the first key is less than, equal to, or greater than the second | 1              |
| Return the addresses of C-callable sort support function(s) (optional)                                                                                                 | 2              |
| Compare a test value to a base value plus/minus an offset, and return true or false according to the comparison result (optional)                                      | 3              |
| Determine if it is safe for indexes that use the operator class to apply the btree deduplication optimization (optional)                                               | 4              |
| Define options that are specific to this operator class (optional)                                                                                                     | 5              |

Hash indexes require one support function, and allow two additional ones to be supplied at the operator class author's option, as shown in [Table 38.10](xindex#XINDEX-HASH-SUPPORT-TABLE).

[#id](#XINDEX-HASH-SUPPORT-TABLE)

**Table 38.10. Hash Support Functions**

| Function                                                                                                                                                                                 | Support Number |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| Compute the 32-bit hash value for a key                                                                                                                                                  | 1              |
| Compute the 64-bit hash value for a key given a 64-bit salt; if the salt is 0, the low 32 bits of the result must match the value that would have been computed by function 1 (optional) | 2              |
| Define options that are specific to this operator class (optional)                                                                                                                       | 3              |

GiST indexes have eleven support functions, six of which are optional, as shown in [Table 38.11](xindex#XINDEX-GIST-SUPPORT-TABLE). (For more information see [Chapter 68](gist).)

[#id](#XINDEX-GIST-SUPPORT-TABLE)

**Table 38.11. GiST Support Functions**

| Function      | Description                                                                                                      | Support Number |
| ------------- | ---------------------------------------------------------------------------------------------------------------- | -------------- |
| `consistent`  | determine whether key satisfies the query qualifier                                                              | 1              |
| `union`       | compute union of a set of keys                                                                                   | 2              |
| `compress`    | compute a compressed representation of a key or value to be indexed (optional)                                   | 3              |
| `decompress`  | compute a decompressed representation of a compressed key (optional)                                             | 4              |
| `penalty`     | compute penalty for inserting new key into subtree with given subtree's key                                      | 5              |
| `picksplit`   | determine which entries of a page are to be moved to the new page and compute the union keys for resulting pages | 6              |
| `same`        | compare two keys and return true if they are equal                                                               | 7              |
| `distance`    | determine distance from key to query value (optional)                                                            | 8              |
| `fetch`       | compute original representation of a compressed key for index-only scans (optional)                              | 9              |
| `options`     | define options that are specific to this operator class (optional)                                               | 10             |
| `sortsupport` | provide a sort comparator to be used in fast index builds (optional)                                             | 11             |

SP-GiST indexes have six support functions, one of which is optional, as shown in [Table 38.12](xindex#XINDEX-SPGIST-SUPPORT-TABLE). (For more information see [Chapter 69](spgist).)

[#id](#XINDEX-SPGIST-SUPPORT-TABLE)

**Table 38.12. SP-GiST Support Functions**

| Function           | Description                                                        | Support Number |
| ------------------ | ------------------------------------------------------------------ | -------------- |
| `config`           | provide basic information about the operator class                 | 1              |
| `choose`           | determine how to insert a new value into an inner tuple            | 2              |
| `picksplit`        | determine how to partition a set of values                         | 3              |
| `inner_consistent` | determine which sub-partitions need to be searched for a query     | 4              |
| `leaf_consistent`  | determine whether key satisfies the query qualifier                | 5              |
| `options`          | define options that are specific to this operator class (optional) | 6              |

GIN indexes have seven support functions, four of which are optional, as shown in [Table 38.13](xindex#XINDEX-GIN-SUPPORT-TABLE). (For more information see [Chapter 70](gin).)

[#id](#XINDEX-GIN-SUPPORT-TABLE)

**Table 38.13. GIN Support Functions**

| Function         | Description                                                                                                                                                                                                                               | Support Number |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `compare`        | compare two keys and return an integer less than zero, zero, or greater than zero, indicating whether the first key is less than, equal to, or greater than the second                                                                    | 1              |
| `extractValue`   | extract keys from a value to be indexed                                                                                                                                                                                                   | 2              |
| `extractQuery`   | extract keys from a query condition                                                                                                                                                                                                       | 3              |
| `consistent`     | determine whether value matches query condition (Boolean variant) (optional if support function 6 is present)                                                                                                                             | 4              |
| `comparePartial` | compare partial key from query and key from index, and return an integer less than zero, zero, or greater than zero, indicating whether GIN should ignore this index entry, treat the entry as a match, or stop the index scan (optional) | 5              |
| `triConsistent`  | determine whether value matches query condition (ternary variant) (optional if support function 4 is present)                                                                                                                             | 6              |
| `options`        | define options that are specific to this operator class (optional)                                                                                                                                                                        | 7              |

BRIN indexes have five basic support functions, one of which is optional, as shown in [Table 38.14](xindex#XINDEX-BRIN-SUPPORT-TABLE). Some versions of the basic functions require additional support functions to be provided. (For more information see [Section 71.3](brin-extensibility).)

[#id](#XINDEX-BRIN-SUPPORT-TABLE)

**Table 38.14. BRIN Support Functions**

| Function     | Description                                                              | Support Number |
| ------------ | ------------------------------------------------------------------------ | -------------- |
| `opcInfo`    | return internal information describing the indexed columns' summary data | 1              |
| `add_value`  | add a new value to an existing summary index tuple                       | 2              |
| `consistent` | determine whether value matches query condition                          | 3              |
| `union`      | compute union of two summary tuples                                      | 4              |
| `options`    | define options that are specific to this operator class (optional)       | 5              |

Unlike search operators, support functions return whichever data type the particular index method expects; for example in the case of the comparison function for B-trees, a signed integer. The number and types of the arguments to each support function are likewise dependent on the index method. For B-tree and hash the comparison and hashing support functions take the same input data types as do the operators included in the operator class, but this is not the case for most GiST, SP-GiST, GIN, and BRIN support functions.

[#id](#XINDEX-EXAMPLE)

### 38.16.4. An Example [#](#XINDEX-EXAMPLE)

Now that we have seen the ideas, here is the promised example of creating a new operator class. (You can find a working copy of this example in `src/tutorial/complex.c` and `src/tutorial/complex.sql` in the source distribution.) The operator class encapsulates operators that sort complex numbers in absolute value order, so we choose the name `complex_abs_ops`. First, we need a set of operators. The procedure for defining operators was discussed in [Section 38.14](xoper). For an operator class on B-trees, the operators we require are:

- absolute-value less-than (strategy 1)
- absolute-value less-than-or-equal (strategy 2)
- absolute-value equal (strategy 3)
- absolute-value greater-than-or-equal (strategy 4)
- absolute-value greater-than (strategy 5)

The least error-prone way to define a related set of comparison operators is to write the B-tree comparison support function first, and then write the other functions as one-line wrappers around the support function. This reduces the odds of getting inconsistent results for corner cases. Following this approach, we first write:

```
#define Mag(c)  ((c)->x*(c)->x + (c)->y*(c)->y)

static int
complex_abs_cmp_internal(Complex *a, Complex *b)
{
    double      amag = Mag(a),
                bmag = Mag(b);

    if (amag < bmag)
        return -1;
    if (amag > bmag)
        return 1;
    return 0;
}
```

Now the less-than function looks like:

```
PG_FUNCTION_INFO_V1(complex_abs_lt);

Datum
complex_abs_lt(PG_FUNCTION_ARGS)
{
    Complex    *a = (Complex *) PG_GETARG_POINTER(0);
    Complex    *b = (Complex *) PG_GETARG_POINTER(1);

    PG_RETURN_BOOL(complex_abs_cmp_internal(a, b) < 0);
}
```

The other four functions differ only in how they compare the internal function's result to zero.

Next we declare the functions and the operators based on the functions to SQL:

```
CREATE FUNCTION complex_abs_lt(complex, complex) RETURNS bool
    AS 'filename', 'complex_abs_lt'
    LANGUAGE C IMMUTABLE STRICT;

CREATE OPERATOR < (
   leftarg = complex, rightarg = complex, procedure = complex_abs_lt,
   commutator = > , negator = >= ,
   restrict = scalarltsel, join = scalarltjoinsel
);
```

It is important to specify the correct commutator and negator operators, as well as suitable restriction and join selectivity functions, otherwise the optimizer will be unable to make effective use of the index.

Other things worth noting are happening here:

- There can only be one operator named, say, `=` and taking type `complex` for both operands. In this case we don't have any other operator `=` for `complex`, but if we were building a practical data type we'd probably want `=` to be the ordinary equality operation for complex numbers (and not the equality of the absolute values). In that case, we'd need to use some other operator name for `complex_abs_eq`.

- Although PostgreSQL can cope with functions having the same SQL name as long as they have different argument data types, C can only cope with one global function having a given name. So we shouldn't name the C function something simple like `abs_eq`. Usually it's a good practice to include the data type name in the C function name, so as not to conflict with functions for other data types.

- We could have made the SQL name of the function `abs_eq`, relying on PostgreSQL to distinguish it by argument data types from any other SQL function of the same name. To keep the example simple, we make the function have the same names at the C level and SQL level.

The next step is the registration of the support routine required by B-trees. The example C code that implements this is in the same file that contains the operator functions. This is how we declare the function:

```
CREATE FUNCTION complex_abs_cmp(complex, complex)
    RETURNS integer
    AS 'filename'
    LANGUAGE C IMMUTABLE STRICT;
```

Now that we have the required operators and support routine, we can finally create the operator class:

```
CREATE OPERATOR CLASS complex_abs_ops
    DEFAULT FOR TYPE complex USING btree AS
        OPERATOR        1       < ,
        OPERATOR        2       <= ,
        OPERATOR        3       = ,
        OPERATOR        4       >= ,
        OPERATOR        5       > ,
        FUNCTION        1       complex_abs_cmp(complex, complex);
```

And we're done! It should now be possible to create and use B-tree indexes on `complex` columns.

We could have written the operator entries more verbosely, as in:

```
        OPERATOR        1       < (complex, complex) ,
```

but there is no need to do so when the operators take the same data type we are defining the operator class for.

The above example assumes that you want to make this new operator class the default B-tree operator class for the `complex` data type. If you don't, just leave out the word `DEFAULT`.

[#id](#XINDEX-OPFAMILY)

### 38.16.5. Operator Classes and Operator Families [#](#XINDEX-OPFAMILY)

So far we have implicitly assumed that an operator class deals with only one data type. While there certainly can be only one data type in a particular index column, it is often useful to index operations that compare an indexed column to a value of a different data type. Also, if there is use for a cross-data-type operator in connection with an operator class, it is often the case that the other data type has a related operator class of its own. It is helpful to make the connections between related classes explicit, because this can aid the planner in optimizing SQL queries (particularly for B-tree operator classes, since the planner contains a great deal of knowledge about how to work with them).

To handle these needs, PostgreSQL uses the concept of an _operator family_. An operator family contains one or more operator classes, and can also contain indexable operators and corresponding support functions that belong to the family as a whole but not to any single class within the family. We say that such operators and functions are “loose” within the family, as opposed to being bound into a specific class. Typically each operator class contains single-data-type operators while cross-data-type operators are loose in the family.

All the operators and functions in an operator family must have compatible semantics, where the compatibility requirements are set by the index method. You might therefore wonder why bother to single out particular subsets of the family as operator classes; and indeed for many purposes the class divisions are irrelevant and the family is the only interesting grouping. The reason for defining operator classes is that they specify how much of the family is needed to support any particular index. If there is an index using an operator class, then that operator class cannot be dropped without dropping the index — but other parts of the operator family, namely other operator classes and loose operators, could be dropped. Thus, an operator class should be specified to contain the minimum set of operators and functions that are reasonably needed to work with an index on a specific data type, and then related but non-essential operators can be added as loose members of the operator family.

As an example, PostgreSQL has a built-in B-tree operator family `integer_ops`, which includes operator classes `int8_ops`, `int4_ops`, and `int2_ops` for indexes on `bigint` (`int8`), `integer` (`int4`), and `smallint` (`int2`) columns respectively. The family also contains cross-data-type comparison operators allowing any two of these types to be compared, so that an index on one of these types can be searched using a comparison value of another type. The family could be duplicated by these definitions:

```
CREATE OPERATOR FAMILY integer_ops USING btree;

CREATE OPERATOR CLASS int8_ops
DEFAULT FOR TYPE int8 USING btree FAMILY integer_ops AS
  -- standard int8 comparisons
  OPERATOR 1 < ,
  OPERATOR 2 <= ,
  OPERATOR 3 = ,
  OPERATOR 4 >= ,
  OPERATOR 5 > ,
  FUNCTION 1 btint8cmp(int8, int8) ,
  FUNCTION 2 btint8sortsupport(internal) ,
  FUNCTION 3 in_range(int8, int8, int8, boolean, boolean) ,
  FUNCTION 4 btequalimage(oid) ;

CREATE OPERATOR CLASS int4_ops
DEFAULT FOR TYPE int4 USING btree FAMILY integer_ops AS
  -- standard int4 comparisons
  OPERATOR 1 < ,
  OPERATOR 2 <= ,
  OPERATOR 3 = ,
  OPERATOR 4 >= ,
  OPERATOR 5 > ,
  FUNCTION 1 btint4cmp(int4, int4) ,
  FUNCTION 2 btint4sortsupport(internal) ,
  FUNCTION 3 in_range(int4, int4, int4, boolean, boolean) ,
  FUNCTION 4 btequalimage(oid) ;

CREATE OPERATOR CLASS int2_ops
DEFAULT FOR TYPE int2 USING btree FAMILY integer_ops AS
  -- standard int2 comparisons
  OPERATOR 1 < ,
  OPERATOR 2 <= ,
  OPERATOR 3 = ,
  OPERATOR 4 >= ,
  OPERATOR 5 > ,
  FUNCTION 1 btint2cmp(int2, int2) ,
  FUNCTION 2 btint2sortsupport(internal) ,
  FUNCTION 3 in_range(int2, int2, int2, boolean, boolean) ,
  FUNCTION 4 btequalimage(oid) ;

ALTER OPERATOR FAMILY integer_ops USING btree ADD
  -- cross-type comparisons int8 vs int2
  OPERATOR 1 < (int8, int2) ,
  OPERATOR 2 <= (int8, int2) ,
  OPERATOR 3 = (int8, int2) ,
  OPERATOR 4 >= (int8, int2) ,
  OPERATOR 5 > (int8, int2) ,
  FUNCTION 1 btint82cmp(int8, int2) ,

  -- cross-type comparisons int8 vs int4
  OPERATOR 1 < (int8, int4) ,
  OPERATOR 2 <= (int8, int4) ,
  OPERATOR 3 = (int8, int4) ,
  OPERATOR 4 >= (int8, int4) ,
  OPERATOR 5 > (int8, int4) ,
  FUNCTION 1 btint84cmp(int8, int4) ,

  -- cross-type comparisons int4 vs int2
  OPERATOR 1 < (int4, int2) ,
  OPERATOR 2 <= (int4, int2) ,
  OPERATOR 3 = (int4, int2) ,
  OPERATOR 4 >= (int4, int2) ,
  OPERATOR 5 > (int4, int2) ,
  FUNCTION 1 btint42cmp(int4, int2) ,

  -- cross-type comparisons int4 vs int8
  OPERATOR 1 < (int4, int8) ,
  OPERATOR 2 <= (int4, int8) ,
  OPERATOR 3 = (int4, int8) ,
  OPERATOR 4 >= (int4, int8) ,
  OPERATOR 5 > (int4, int8) ,
  FUNCTION 1 btint48cmp(int4, int8) ,

  -- cross-type comparisons int2 vs int8
  OPERATOR 1 < (int2, int8) ,
  OPERATOR 2 <= (int2, int8) ,
  OPERATOR 3 = (int2, int8) ,
  OPERATOR 4 >= (int2, int8) ,
  OPERATOR 5 > (int2, int8) ,
  FUNCTION 1 btint28cmp(int2, int8) ,

  -- cross-type comparisons int2 vs int4
  OPERATOR 1 < (int2, int4) ,
  OPERATOR 2 <= (int2, int4) ,
  OPERATOR 3 = (int2, int4) ,
  OPERATOR 4 >= (int2, int4) ,
  OPERATOR 5 > (int2, int4) ,
  FUNCTION 1 btint24cmp(int2, int4) ,

  -- cross-type in_range functions
  FUNCTION 3 in_range(int4, int4, int8, boolean, boolean) ,
  FUNCTION 3 in_range(int4, int4, int2, boolean, boolean) ,
  FUNCTION 3 in_range(int2, int2, int8, boolean, boolean) ,
  FUNCTION 3 in_range(int2, int2, int4, boolean, boolean) ;
```

Notice that this definition “overloads” the operator strategy and support function numbers: each number occurs multiple times within the family. This is allowed so long as each instance of a particular number has distinct input data types. The instances that have both input types equal to an operator class's input type are the primary operators and support functions for that operator class, and in most cases should be declared as part of the operator class rather than as loose members of the family.

In a B-tree operator family, all the operators in the family must sort compatibly, as is specified in detail in [Section 67.2](btree-behavior). For each operator in the family there must be a support function having the same two input data types as the operator. It is recommended that a family be complete, i.e., for each combination of data types, all operators are included. Each operator class should include just the non-cross-type operators and support function for its data type.

To build a multiple-data-type hash operator family, compatible hash support functions must be created for each data type supported by the family. Here compatibility means that the functions are guaranteed to return the same hash code for any two values that are considered equal by the family's equality operators, even when the values are of different types. This is usually difficult to accomplish when the types have different physical representations, but it can be done in some cases. Furthermore, casting a value from one data type represented in the operator family to another data type also represented in the operator family via an implicit or binary coercion cast must not change the computed hash value. Notice that there is only one support function per data type, not one per equality operator. It is recommended that a family be complete, i.e., provide an equality operator for each combination of data types. Each operator class should include just the non-cross-type equality operator and the support function for its data type.

GiST, SP-GiST, and GIN indexes do not have any explicit notion of cross-data-type operations. The set of operators supported is just whatever the primary support functions for a given operator class can handle.

In BRIN, the requirements depends on the framework that provides the operator classes. For operator classes based on `minmax`, the behavior required is the same as for B-tree operator families: all the operators in the family must sort compatibly, and casts must not change the associated sort ordering.

### Note

Prior to PostgreSQL 8.3, there was no concept of operator families, and so any cross-data-type operators intended to be used with an index had to be bound directly into the index's operator class. While this approach still works, it is deprecated because it makes an index's dependencies too broad, and because the planner can handle cross-data-type comparisons more effectively when both data types have operators in the same operator family.

[#id](#XINDEX-OPCLASS-DEPENDENCIES)

### 38.16.6. System Dependencies on Operator Classes [#](#XINDEX-OPCLASS-DEPENDENCIES)

PostgreSQL uses operator classes to infer the properties of operators in more ways than just whether they can be used with indexes. Therefore, you might want to create operator classes even if you have no intention of indexing any columns of your data type.

In particular, there are SQL features such as `ORDER BY` and `DISTINCT` that require comparison and sorting of values. To implement these features on a user-defined data type, PostgreSQL looks for the default B-tree operator class for the data type. The “equals” member of this operator class defines the system's notion of equality of values for `GROUP BY` and `DISTINCT`, and the sort ordering imposed by the operator class defines the default `ORDER BY` ordering.

If there is no default B-tree operator class for a data type, the system will look for a default hash operator class. But since that kind of operator class only provides equality, it is only able to support grouping not sorting.

When there is no default operator class for a data type, you will get errors like “could not identify an ordering operator” if you try to use these SQL features with the data type.

### Note

In PostgreSQL versions before 7.4, sorting and grouping operations would implicitly use operators named `=`, `<`, and `>`. The new behavior of relying on default operator classes avoids having to make any assumption about the behavior of operators with particular names.

Sorting by a non-default B-tree operator class is possible by specifying the class's less-than operator in a `USING` option, for example

```
SELECT * FROM mytable ORDER BY somecol USING ~<~;
```

Alternatively, specifying the class's greater-than operator in `USING` selects a descending-order sort.

Comparison of arrays of a user-defined type also relies on the semantics defined by the type's default B-tree operator class. If there is no default B-tree operator class, but there is a default hash operator class, then array equality is supported, but not ordering comparisons.

Another SQL feature that requires even more data-type-specific knowledge is the `RANGE` _`offset`_ `PRECEDING`/`FOLLOWING` framing option for window functions (see [Section 4.2.8](sql-expressions#SYNTAX-WINDOW-FUNCTIONS)). For a query such as

```
SELECT sum(x) OVER (ORDER BY x RANGE BETWEEN 5 PRECEDING AND 10 FOLLOWING)
  FROM mytable;
```

it is not sufficient to know how to order by `x`; the database must also understand how to “subtract 5” or “add 10” to the current row's value of `x` to identify the bounds of the current window frame. Comparing the resulting bounds to other rows' values of `x` is possible using the comparison operators provided by the B-tree operator class that defines the `ORDER BY` ordering — but addition and subtraction operators are not part of the operator class, so which ones should be used? Hard-wiring that choice would be undesirable, because different sort orders (different B-tree operator classes) might need different behavior. Therefore, a B-tree operator class can specify an _in_range_ support function that encapsulates the addition and subtraction behaviors that make sense for its sort order. It can even provide more than one _in_range_ support function, in case there is more than one data type that makes sense to use as the offset in `RANGE` clauses. If the B-tree operator class associated with the window's `ORDER BY` clause does not have a matching _in_range_ support function, the `RANGE` _`offset`_ `PRECEDING`/`FOLLOWING` option is not supported.

Another important point is that an equality operator that appears in a hash operator family is a candidate for hash joins, hash aggregation, and related optimizations. The hash operator family is essential here since it identifies the hash function(s) to use.

[#id](#XINDEX-ORDERING-OPS)

### 38.16.7. Ordering Operators [#](#XINDEX-ORDERING-OPS)

Some index access methods (currently, only GiST and SP-GiST) support the concept of _ordering operators_. What we have been discussing so far are _search operators_. A search operator is one for which the index can be searched to find all rows satisfying `WHERE` _`indexed_column`_ _`operator`_ _`constant`_. Note that nothing is promised about the order in which the matching rows will be returned. In contrast, an ordering operator does not restrict the set of rows that can be returned, but instead determines their order. An ordering operator is one for which the index can be scanned to return rows in the order represented by `ORDER BY` _`indexed_column`_ _`operator`_ _`constant`_. The reason for defining ordering operators that way is that it supports nearest-neighbor searches, if the operator is one that measures distance. For example, a query like

```
SELECT * FROM places ORDER BY location <-> point '(101,456)' LIMIT 10;
```

finds the ten places closest to a given target point. A GiST index on the location column can do this efficiently because `<->` is an ordering operator.

While search operators have to return Boolean results, ordering operators usually return some other type, such as float or numeric for distances. This type is normally not the same as the data type being indexed. To avoid hard-wiring assumptions about the behavior of different data types, the definition of an ordering operator is required to name a B-tree operator family that specifies the sort ordering of the result data type. As was stated in the previous section, B-tree operator families define PostgreSQL's notion of ordering, so this is a natural representation. Since the point `<->` operator returns `float8`, it could be specified in an operator class creation command like this:

```
OPERATOR 15    <-> (point, point) FOR ORDER BY float_ops
```

where `float_ops` is the built-in operator family that includes operations on `float8`. This declaration states that the index is able to return rows in order of increasing values of the `<->` operator.

[#id](#XINDEX-OPCLASS-FEATURES)

### 38.16.8. Special Features of Operator Classes [#](#XINDEX-OPCLASS-FEATURES)

There are two special features of operator classes that we have not discussed yet, mainly because they are not useful with the most commonly used index methods.

Normally, declaring an operator as a member of an operator class (or family) means that the index method can retrieve exactly the set of rows that satisfy a `WHERE` condition using the operator. For example:

```
SELECT * FROM table WHERE integer_column < 4;
```

can be satisfied exactly by a B-tree index on the integer column. But there are cases where an index is useful as an inexact guide to the matching rows. For example, if a GiST index stores only bounding boxes for geometric objects, then it cannot exactly satisfy a `WHERE` condition that tests overlap between nonrectangular objects such as polygons. Yet we could use the index to find objects whose bounding box overlaps the bounding box of the target object, and then do the exact overlap test only on the objects found by the index. If this scenario applies, the index is said to be “lossy” for the operator. Lossy index searches are implemented by having the index method return a _recheck_ flag when a row might or might not really satisfy the query condition. The core system will then test the original query condition on the retrieved row to see whether it should be returned as a valid match. This approach works if the index is guaranteed to return all the required rows, plus perhaps some additional rows, which can be eliminated by performing the original operator invocation. The index methods that support lossy searches (currently, GiST, SP-GiST and GIN) allow the support functions of individual operator classes to set the recheck flag, and so this is essentially an operator-class feature.

Consider again the situation where we are storing in the index only the bounding box of a complex object such as a polygon. In this case there's not much value in storing the whole polygon in the index entry — we might as well store just a simpler object of type `box`. This situation is expressed by the `STORAGE` option in `CREATE OPERATOR CLASS`: we'd write something like:

```
CREATE OPERATOR CLASS polygon_ops
    DEFAULT FOR TYPE polygon USING gist AS
        ...
        STORAGE box;
```

At present, only the GiST, SP-GiST, GIN and BRIN index methods support a `STORAGE` type that's different from the column data type. The GiST `compress` and `decompress` support routines must deal with data-type conversion when `STORAGE` is used. SP-GiST likewise requires a `compress` support function to convert to the storage type, when that is different; if an SP-GiST opclass also supports retrieving data, the reverse conversion must be handled by the `consistent` function. In GIN, the `STORAGE` type identifies the type of the “key” values, which normally is different from the type of the indexed column — for example, an operator class for integer-array columns might have keys that are just integers. The GIN `extractValue` and `extractQuery` support routines are responsible for extracting keys from indexed values. BRIN is similar to GIN: the `STORAGE` type identifies the type of the stored summary values, and operator classes' support procedures are responsible for interpreting the summary values correctly.
