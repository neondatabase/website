

|    67.2. Behavior of B-Tree Operator Classes   |                                               |                            |                                                       |                                                                    |
| :--------------------------------------------: | :-------------------------------------------- | :------------------------: | ----------------------------------------------------: | -----------------------------------------------------------------: |
| [Prev](btree-intro.html "67.1. Introduction")  | [Up](btree.html "Chapter 67. B-Tree Indexes") | Chapter 67. B-Tree Indexes | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](btree-support-funcs.html "67.3. B-Tree Support Functions") |

***

## 67.2. Behavior of B-Tree Operator Classes [#](#BTREE-BEHAVIOR)

As shown in [Table 38.3](xindex.html#XINDEX-BTREE-STRAT-TABLE "Table 38.3. B-Tree Strategies"), a btree operator class must provide five comparison operators, `<`, `<=`, `=`, `>=` and `>`. One might expect that `<>` should also be part of the operator class, but it is not, because it would almost never be useful to use a `<>` WHERE clause in an index search. (For some purposes, the planner treats `<>` as associated with a btree operator class; but it finds that operator via the `=` operator's negator link, rather than from `pg_amop`.)

When several data types share near-identical sorting semantics, their operator classes can be grouped into an operator family. Doing so is advantageous because it allows the planner to make deductions about cross-type comparisons. Each operator class within the family should contain the single-type operators (and associated support functions) for its input data type, while cross-type comparison operators and support functions are “loose” in the family. It is recommendable that a complete set of cross-type operators be included in the family, thus ensuring that the planner can represent any comparison conditions that it deduces from transitivity.

There are some basic assumptions that a btree operator family must satisfy:

* An `=` operator must be an equivalence relation; that is, for all non-null values *`A`*, *`B`*, *`C`* of the data type:

  * *`A`* `=` *`A`* is true (*reflexive law*)
  * if *`A`* `=` *`B`*, then *`B`* `=` *`A`* (*symmetric law*)
  * if *`A`* `=` *`B`* and *`B`* `=` *`C`*, then *`A`* `=` *`C`* (*transitive law*)

* A `<` operator must be a strong ordering relation; that is, for all non-null values *`A`*, *`B`*, *`C`*:

  * *`A`* `<` *`A`* is false (*irreflexive law*)
  * if *`A`* `<` *`B`* and *`B`* `<` *`C`*, then *`A`* `<` *`C`* (*transitive law*)

* Furthermore, the ordering is total; that is, for all non-null values *`A`*, *`B`*:

  * exactly one of *`A`* `<` *`B`*, *`A`* `=` *`B`*, and *`B`* `<` *`A`* is true (*trichotomy law*)

    (The trichotomy law justifies the definition of the comparison support function, of course.)

The other three operators are defined in terms of `=` and `<` in the obvious way, and must act consistently with them.

For an operator family supporting multiple data types, the above laws must hold when *`A`*, *`B`*, *`C`* are taken from any data types in the family. The transitive laws are the trickiest to ensure, as in cross-type situations they represent statements that the behaviors of two or three different operators are consistent. As an example, it would not work to put `float8` and `numeric` into the same operator family, at least not with the current semantics that `numeric` values are converted to `float8` for comparison to a `float8`. Because of the limited accuracy of `float8`, this means there are distinct `numeric` values that will compare equal to the same `float8` value, and thus the transitive law would fail.

Another requirement for a multiple-data-type family is that any implicit or binary-coercion casts that are defined between data types included in the operator family must not change the associated sort ordering.

It should be fairly clear why a btree index requires these laws to hold within a single data type: without them there is no ordering to arrange the keys with. Also, index searches using a comparison key of a different data type require comparisons to behave sanely across two data types. The extensions to three or more data types within a family are not strictly required by the btree index mechanism itself, but the planner relies on them for optimization purposes.

***

|                                                |                                                       |                                                                    |
| :--------------------------------------------- | :---------------------------------------------------: | -----------------------------------------------------------------: |
| [Prev](btree-intro.html "67.1. Introduction")  |     [Up](btree.html "Chapter 67. B-Tree Indexes")     |  [Next](btree-support-funcs.html "67.3. B-Tree Support Functions") |
| 67.1. Introduction                             | [Home](index.html "PostgreSQL 17devel Documentation") |                                     67.3. B-Tree Support Functions |
