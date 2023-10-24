<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                      67.3. B-Tree Support Functions                      |                                               |                            |                                                       |                                                           |
| :----------------------------------------------------------------------: | :-------------------------------------------- | :------------------------: | ----------------------------------------------------: | --------------------------------------------------------: |
| [Prev](btree-behavior.html "67.2. Behavior of B-Tree Operator Classes")  | [Up](btree.html "Chapter 67. B-Tree Indexes") | Chapter 67. B-Tree Indexes | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](btree-implementation.html "67.4. Implementation") |

***

## 67.3. B-Tree Support Functions [#](#BTREE-SUPPORT-FUNCS)

As shown in [Table 38.9](xindex.html#XINDEX-BTREE-SUPPORT-TABLE "Table 38.9. B-Tree Support Functions"), btree defines one required and four optional support functions. The five user-defined methods are:

*   `order`

    For each combination of data types that a btree operator family provides comparison operators for, it must provide a comparison support function, registered in `pg_amproc` with support function number 1 and `amproclefttype`/`amprocrighttype` equal to the left and right data types for the comparison (i.e., the same data types that the matching operators are registered with in `pg_amop`). The comparison function must take two non-null values *`A`* and *`B`* and return an `int32` value that is `<` `0`, `0`, or `>` `0` when *`A`* `<` *`B`*, *`A`* `=` *`B`*, or *`A`* `>` *`B`*, respectively. A null result is disallowed: all values of the data type must be comparable. See `src/backend/access/nbtree/nbtcompare.c` for examples.

    If the compared values are of a collatable data type, the appropriate collation OID will be passed to the comparison support function, using the standard `PG_GET_COLLATION()` mechanism.

*   `sortsupport`

    Optionally, a btree operator family may provide *sort support* function(s), registered under support function number 2. These functions allow implementing comparisons for sorting purposes in a more efficient way than naively calling the comparison support function. The APIs involved in this are defined in `src/include/utils/sortsupport.h`.

*   `in_range`

    []()[]()

    Optionally, a btree operator family may provide *in\_range* support function(s), registered under support function number 3. These are not used during btree index operations; rather, they extend the semantics of the operator family so that it can support window clauses containing the `RANGE` *`offset`* `PRECEDING` and `RANGE` *`offset`* `FOLLOWING` frame bound types (see [Section 4.2.8](sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS "4.2.8. Window Function Calls")). Fundamentally, the extra information provided is how to add or subtract an *`offset`* value in a way that is compatible with the family's data ordering.

    An `in_range` function must have the signature

        in_range(val type1, base type1, offset type2, sub bool, less bool)
        returns bool

    *`val`* and *`base`* must be of the same type, which is one of the types supported by the operator family (i.e., a type for which it provides an ordering). However, *`offset`* could be of a different type, which might be one otherwise unsupported by the family. An example is that the built-in `time_ops` family provides an `in_range` function that has *`offset`* of type `interval`. A family can provide `in_range` functions for any of its supported types and one or more *`offset`* types. Each `in_range` function should be entered in `pg_amproc` with `amproclefttype` equal to `type1` and `amprocrighttype` equal to `type2`.

    The essential semantics of an `in_range` function depend on the two Boolean flag parameters. It should add or subtract *`base`* and *`offset`*, then compare *`val`* to the result, as follows:

    *   if `!`*`sub`* and `!`*`less`*, return *`val`* `>=` (*`base`* `+` *`offset`*)
    *   if `!`*`sub`* and *`less`*, return *`val`* `<=` (*`base`* `+` *`offset`*)
    *   if *`sub`* and `!`*`less`*, return *`val`* `>=` (*`base`* `-` *`offset`*)
    *   if *`sub`* and *`less`*, return *`val`* `<=` (*`base`* `-` *`offset`*)

    Before doing so, the function should check the sign of *`offset`*: if it is less than zero, raise error `ERRCODE_INVALID_PRECEDING_OR_FOLLOWING_SIZE` (22013) with error text like “invalid preceding or following size in window function”. (This is required by the SQL standard, although nonstandard operator families might perhaps choose to ignore this restriction, since there seems to be little semantic necessity for it.) This requirement is delegated to the `in_range` function so that the core code needn't understand what “less than zero” means for a particular data type.

    An additional expectation is that `in_range` functions should, if practical, avoid throwing an error if *`base`* `+` *`offset`* or *`base`* `-` *`offset`* would overflow. The correct comparison result can be determined even if that value would be out of the data type's range. Note that if the data type includes concepts such as “infinity” or “NaN”, extra care may be needed to ensure that `in_range`'s results agree with the normal sort order of the operator family.

    The results of the `in_range` function must be consistent with the sort ordering imposed by the operator family. To be precise, given any fixed values of *`offset`* and *`sub`*, then:

    *   If `in_range` with *`less`* = true is true for some *`val1`* and *`base`*, it must be true for every *`val2`* `<=` *`val1`* with the same *`base`*.
    *   If `in_range` with *`less`* = true is false for some *`val1`* and *`base`*, it must be false for every *`val2`* `>=` *`val1`* with the same *`base`*.
    *   If `in_range` with *`less`* = true is true for some *`val`* and *`base1`*, it must be true for every *`base2`* `>=` *`base1`* with the same *`val`*.
    *   If `in_range` with *`less`* = true is false for some *`val`* and *`base1`*, it must be false for every *`base2`* `<=` *`base1`* with the same *`val`*.

    Analogous statements with inverted conditions hold when *`less`* = false.

    If the type being ordered (`type1`) is collatable, the appropriate collation OID will be passed to the `in_range` function, using the standard PG\_GET\_COLLATION() mechanism.

    `in_range` functions need not handle NULL inputs, and typically will be marked strict.

*   `equalimage`

    Optionally, a btree operator family may provide `equalimage` (“equality implies image equality”) support functions, registered under support function number 4. These functions allow the core code to determine when it is safe to apply the btree deduplication optimization. Currently, `equalimage` functions are only called when building or rebuilding an index.

    An `equalimage` function must have the signature

        equalimage(opcintype oid) returns bool

    The return value is static information about an operator class and collation. Returning `true` indicates that the `order` function for the operator class is guaranteed to only return `0` (“arguments are equal”) when its *`A`* and *`B`* arguments are also interchangeable without any loss of semantic information. Not registering an `equalimage` function or returning `false` indicates that this condition cannot be assumed to hold.

    The *`opcintype`* argument is the `pg_type.oid` of the data type that the operator class indexes. This is a convenience that allows reuse of the same underlying `equalimage` function across operator classes. If *`opcintype`* is a collatable data type, the appropriate collation OID will be passed to the `equalimage` function, using the standard `PG_GET_COLLATION()` mechanism.

    As far as the operator class is concerned, returning `true` indicates that deduplication is safe (or safe for the collation whose OID was passed to its `equalimage` function). However, the core code will only deem deduplication safe for an index when *every* indexed column uses an operator class that registers an `equalimage` function, and each function actually returns `true` when called.

    Image equality is *almost* the same condition as simple bitwise equality. There is one subtle difference: When indexing a varlena data type, the on-disk representation of two image equal datums may not be bitwise equal due to inconsistent application of TOAST compression on input. Formally, when an operator class's `equalimage` function returns `true`, it is safe to assume that the `datum_image_eq()` C function will always agree with the operator class's `order` function (provided that the same collation OID is passed to both the `equalimage` and `order` functions).

    The core code is fundamentally unable to deduce anything about the “equality implies image equality” status of an operator class within a multiple-data-type family based on details from other operator classes in the same family. Also, it is not sensible for an operator family to register a cross-type `equalimage` function, and attempting to do so will result in an error. This is because “equality implies image equality” status does not just depend on sorting/equality semantics, which are more or less defined at the operator family level. In general, the semantics that one particular data type implements must be considered separately.

    The convention followed by the operator classes included with the core PostgreSQL distribution is to register a stock, generic `equalimage` function. Most operator classes register `btequalimage()`, which indicates that deduplication is safe unconditionally. Operator classes for collatable data types such as `text` register `btvarstrequalimage()`, which indicates that deduplication is safe with deterministic collations. Best practice for third-party extensions is to register their own custom function to retain control.

*   `options`

    Optionally, a B-tree operator family may provide `options` (“operator class specific options”) support functions, registered under support function number 5. These functions define a set of user-visible parameters that control operator class behavior.

    An `options` support function must have the signature

        options(relopts local_relopts *) returns void

    The function is passed a pointer to a `local_relopts` struct, which needs to be filled with a set of operator class specific options. The options can be accessed from other support functions using the `PG_HAS_OPCLASS_OPTIONS()` and `PG_GET_OPCLASS_OPTIONS()` macros.

    Currently, no B-Tree operator class has an `options` support function. B-tree doesn't allow flexible representation of keys like GiST, SP-GiST, GIN and BRIN do. So, `options` probably doesn't have much application in the current B-tree index access method. Nevertheless, this support function was added to B-tree for uniformity, and will probably find uses during further evolution of B-tree in PostgreSQL.

***

|                                                                          |                                                       |                                                           |
| :----------------------------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------------------: |
| [Prev](btree-behavior.html "67.2. Behavior of B-Tree Operator Classes")  |     [Up](btree.html "Chapter 67. B-Tree Indexes")     |  [Next](btree-implementation.html "67.4. Implementation") |
| 67.2. Behavior of B-Tree Operator Classes                                | [Home](index.html "PostgreSQL 17devel Documentation") |                                      67.4. Implementation |
