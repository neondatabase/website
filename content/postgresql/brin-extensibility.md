[#id](#BRIN-EXTENSIBILITY)

## 71.3. Extensibility [#](#BRIN-EXTENSIBILITY)

The BRIN interface has a high level of abstraction, requiring the access method implementer only to implement the semantics of the data type being accessed. The BRIN layer itself takes care of concurrency, logging and searching the index structure.

All it takes to get a BRIN access method working is to implement a few user-defined methods, which define the behavior of summary values stored in the index and the way they interact with scan keys. In short, BRIN combines extensibility with generality, code reuse, and a clean interface.

There are four methods that an operator class for BRIN must provide:

- `BrinOpcInfo *opcInfo(Oid type_oid)`

  Returns internal information about the indexed columns' summary data. The return value must point to a palloc'd `BrinOpcInfo`, which has this definition:

  ```

  typedef struct BrinOpcInfo
  {
      /* Number of columns stored in an index column of this opclass */
      uint16      oi_nstored;

      /* Opaque pointer for the opclass' private use */
      void       *oi_opaque;

      /* Type cache entries of the stored columns */
      TypeCacheEntry *oi_typcache[FLEXIBLE_ARRAY_MEMBER];
  } BrinOpcInfo;
  ```

  `BrinOpcInfo`.`oi_opaque` can be used by the operator class routines to pass information between support functions during an index scan.

- `bool consistent(BrinDesc *bdesc, BrinValues *column, ScanKey *keys, int nkeys)`

  Returns whether all the ScanKey entries are consistent with the given indexed values for a range. The attribute number to use is passed as part of the scan key. Multiple scan keys for the same attribute may be passed at once; the number of entries is determined by the `nkeys` parameter.

- `bool consistent(BrinDesc *bdesc, BrinValues *column, ScanKey key)`

  Returns whether the ScanKey is consistent with the given indexed values for a range. The attribute number to use is passed as part of the scan key. This is an older backward-compatible variant of the consistent function.

- `bool addValue(BrinDesc *bdesc, BrinValues *column, Datum newval, bool isnull)`

  Given an index tuple and an indexed value, modifies the indicated attribute of the tuple so that it additionally represents the new value. If any modification was done to the tuple, `true` is returned.

- `bool unionTuples(BrinDesc *bdesc, BrinValues *a, BrinValues *b)`

  Consolidates two index tuples. Given two index tuples, modifies the indicated attribute of the first of them so that it represents both tuples. The second tuple is not modified.

An operator class for BRIN can optionally specify the following method:

- `void options(local_relopts *relopts)`

  Defines a set of user-visible parameters that control operator class behavior.

  The `options` function is passed a pointer to a `local_relopts` struct, which needs to be filled with a set of operator class specific options. The options can be accessed from other support functions using the `PG_HAS_OPCLASS_OPTIONS()` and `PG_GET_OPCLASS_OPTIONS()` macros.

  Since both key extraction of indexed values and representation of the key in BRIN are flexible, they may depend on user-specified parameters.

The core distribution includes support for four types of operator classes: minmax, minmax-multi, inclusion and bloom. Operator class definitions using them are shipped for in-core data types as appropriate. Additional operator classes can be defined by the user for other data types using equivalent definitions, without having to write any source code; appropriate catalog entries being declared is enough. Note that assumptions about the semantics of operator strategies are embedded in the support functions' source code.

Operator classes that implement completely different semantics are also possible, provided implementations of the four main support functions described above are written. Note that backwards compatibility across major releases is not guaranteed: for example, additional support functions might be required in later releases.

To write an operator class for a data type that implements a totally ordered set, it is possible to use the minmax support functions alongside the corresponding operators, as shown in [Table 71.2](brin-extensibility#BRIN-EXTENSIBILITY-MINMAX-TABLE). All operator class members (functions and operators) are mandatory.

[#id](#BRIN-EXTENSIBILITY-MINMAX-TABLE)

**Table 71.2. Function and Support Numbers for Minmax Operator Classes**

| Operator class member | Object                                       |
| --------------------- | -------------------------------------------- |
| Support Function 1    | internal function `brin_minmax_opcinfo()`    |
| Support Function 2    | internal function `brin_minmax_add_value()`  |
| Support Function 3    | internal function `brin_minmax_consistent()` |
| Support Function 4    | internal function `brin_minmax_union()`      |
| Operator Strategy 1   | operator less-than                           |
| Operator Strategy 2   | operator less-than-or-equal-to               |
| Operator Strategy 3   | operator equal-to                            |
| Operator Strategy 4   | operator greater-than-or-equal-to            |
| Operator Strategy 5   | operator greater-than                        |

To write an operator class for a complex data type which has values included within another type, it's possible to use the inclusion support functions alongside the corresponding operators, as shown in [Table 71.3](brin-extensibility#BRIN-EXTENSIBILITY-INCLUSION-TABLE). It requires only a single additional function, which can be written in any language. More functions can be defined for additional functionality. All operators are optional. Some operators require other operators, as shown as dependencies on the table.

[#id](#BRIN-EXTENSIBILITY-INCLUSION-TABLE)

**Table 71.3. Function and Support Numbers for Inclusion Operator Classes**

| Operator class member           | Object                                                               | Dependency           |
| ------------------------------- | -------------------------------------------------------------------- | -------------------- |
| Support Function 1              | internal function `brin_inclusion_opcinfo()`                         |                      |
| Support Function 2              | internal function `brin_inclusion_add_value()`                       |                      |
| Support Function 3              | internal function `brin_inclusion_consistent()`                      |                      |
| Support Function 4              | internal function `brin_inclusion_union()`                           |                      |
| Support Function 11             | function to merge two elements                                       |                      |
| Support Function 12             | optional function to check whether two elements are mergeable        |                      |
| Support Function 13             | optional function to check if an element is contained within another |                      |
| Support Function 14             | optional function to check whether an element is empty               |                      |
| Operator Strategy 1             | operator left-of                                                     | Operator Strategy 4  |
| Operator Strategy 2             | operator does-not-extend-to-the-right-of                             | Operator Strategy 5  |
| Operator Strategy 3             | operator overlaps                                                    |                      |
| Operator Strategy 4             | operator does-not-extend-to-the-left-of                              | Operator Strategy 1  |
| Operator Strategy 5             | operator right-of                                                    | Operator Strategy 2  |
| Operator Strategy 6, 18         | operator same-as-or-equal-to                                         | Operator Strategy 7  |
| Operator Strategy 7, 16, 24, 25 | operator contains-or-equal-to                                        |                      |
| Operator Strategy 8, 26, 27     | operator is-contained-by-or-equal-to                                 | Operator Strategy 3  |
| Operator Strategy 9             | operator does-not-extend-above                                       | Operator Strategy 11 |
| Operator Strategy 10            | operator is-below                                                    | Operator Strategy 12 |
| Operator Strategy 11            | operator is-above                                                    | Operator Strategy 9  |
| Operator Strategy 12            | operator does-not-extend-below                                       | Operator Strategy 10 |
| Operator Strategy 20            | operator less-than                                                   | Operator Strategy 5  |
| Operator Strategy 21            | operator less-than-or-equal-to                                       | Operator Strategy 5  |
| Operator Strategy 22            | operator greater-than                                                | Operator Strategy 1  |
| Operator Strategy 23            | operator greater-than-or-equal-to                                    | Operator Strategy 1  |

Support function numbers 1 through 10 are reserved for the BRIN internal functions, so the SQL level functions start with number 11. Support function number 11 is the main function required to build the index. It should accept two arguments with the same data type as the operator class, and return the union of them. The inclusion operator class can store union values with different data types if it is defined with the `STORAGE` parameter. The return value of the union function should match the `STORAGE` data type.

Support function numbers 12 and 14 are provided to support irregularities of built-in data types. Function number 12 is used to support network addresses from different families which are not mergeable. Function number 14 is used to support empty ranges. Function number 13 is an optional but recommended one, which allows the new value to be checked before it is passed to the union function. As the BRIN framework can shortcut some operations when the union is not changed, using this function can improve index performance.

To write an operator class for a data type that implements only an equality operator and supports hashing, it is possible to use the bloom support procedures alongside the corresponding operators, as shown in [Table 71.4](brin-extensibility#BRIN-EXTENSIBILITY-BLOOM-TABLE). All operator class members (procedures and operators) are mandatory.

[#id](#BRIN-EXTENSIBILITY-BLOOM-TABLE)

**Table 71.4. Procedure and Support Numbers for Bloom Operator Classes**

| Operator class member | Object                                      |
| --------------------- | ------------------------------------------- |
| Support Procedure 1   | internal function `brin_bloom_opcinfo()`    |
| Support Procedure 2   | internal function `brin_bloom_add_value()`  |
| Support Procedure 3   | internal function `brin_bloom_consistent()` |
| Support Procedure 4   | internal function `brin_bloom_union()`      |
| Support Procedure 5   | internal function `brin_bloom_options()`    |
| Support Procedure 11  | function to compute hash of an element      |
| Operator Strategy 1   | operator equal-to                           |

Support procedure numbers 1-10 are reserved for the BRIN internal functions, so the SQL level functions start with number 11. Support function number 11 is the main function required to build the index. It should accept one argument with the same data type as the operator class, and return a hash of the value.

The minmax-multi operator class is also intended for data types implementing a totally ordered set, and may be seen as a simple extension of the minmax operator class. While minmax operator class summarizes values from each block range into a single contiguous interval, minmax-multi allows summarization into multiple smaller intervals to improve handling of outlier values. It is possible to use the minmax-multi support procedures alongside the corresponding operators, as shown in [Table 71.5](brin-extensibility#BRIN-EXTENSIBILITY-MINMAX-MULTI-TABLE). All operator class members (procedures and operators) are mandatory.

[#id](#BRIN-EXTENSIBILITY-MINMAX-MULTI-TABLE)

**Table 71.5. Procedure and Support Numbers for minmax-multi Operator Classes**

| Operator class member | Object                                                              |
| --------------------- | ------------------------------------------------------------------- |
| Support Procedure 1   | internal function `brin_minmax_multi_opcinfo()`                     |
| Support Procedure 2   | internal function `brin_minmax_multi_add_value()`                   |
| Support Procedure 3   | internal function `brin_minmax_multi_consistent()`                  |
| Support Procedure 4   | internal function `brin_minmax_multi_union()`                       |
| Support Procedure 5   | internal function `brin_minmax_multi_options()`                     |
| Support Procedure 11  | function to compute distance between two values (length of a range) |
| Operator Strategy 1   | operator less-than                                                  |
| Operator Strategy 2   | operator less-than-or-equal-to                                      |
| Operator Strategy 3   | operator equal-to                                                   |
| Operator Strategy 4   | operator greater-than-or-equal-to                                   |
| Operator Strategy 5   | operator greater-than                                               |

Both minmax and inclusion operator classes support cross-data-type operators, though with these the dependencies become more complicated. The minmax operator class requires a full set of operators to be defined with both arguments having the same data type. It allows additional data types to be supported by defining extra sets of operators. Inclusion operator class operator strategies are dependent on another operator strategy as shown in [Table 71.3](brin-extensibility#BRIN-EXTENSIBILITY-INCLUSION-TABLE), or the same operator strategy as themselves. They require the dependency operator to be defined with the `STORAGE` data type as the left-hand-side argument and the other supported data type to be the right-hand-side argument of the supported operator. See `float4_minmax_ops` as an example of minmax, and `box_inclusion_ops` as an example of inclusion.
