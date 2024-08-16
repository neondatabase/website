[#id](#LIMITS)

## Appendix K. PostgreSQL Limits

[Table K.1](limits#LIMITS-TABLE) describes various hard limits of PostgreSQL. However, practical limits, such as performance limitations or available disk space may apply before absolute hard limits are reached.

[#id](#LIMITS-TABLE)

**Table K.1. PostgreSQL Limitations**

| Item                    | Upper Limit                                                           | Comment                                                                |
| ----------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| database size           | unlimited                                                             |                                                                        |
| number of databases     | 4,294,950,911                                                         |                                                                        |
| relations per database  | 1,431,650,303                                                         |                                                                        |
| relation size           | 32 TB                                                                 | with the default `BLCKSZ` of 8192 bytes                                |
| rows per table          | limited by the number of tuples that can fit onto 4,294,967,295 pages |                                                                        |
| columns per table       | 1600                                                                  | further limited by tuple size fitting on a single page; see note below |
| columns in a result set | 1664                                                                  |                                                                        |
| field size              | 1 GB                                                                  |                                                                        |
| identifier length       | 63 bytes                                                              | can be increased by recompiling PostgreSQL                             |
| indexes per table       | unlimited                                                             | constrained by maximum relations per database                          |
| columns per index       | 32                                                                    | can be increased by recompiling PostgreSQL                             |
| partition keys          | 32                                                                    | can be increased by recompiling PostgreSQL                             |

The maximum number of columns for a table is further reduced as the tuple being stored must fit in a single 8192-byte heap page. For example, excluding the tuple header, a tuple made up of 1600 `int` columns would consume 6400 bytes and could be stored in a heap page, but a tuple of 1600 `bigint` columns would consume 12800 bytes and would therefore not fit inside a heap page. Variable-length fields of types such as `text`, `varchar`, and `char` can have their values stored out of line in the table's TOAST table when the values are large enough to require it. Only an 18-byte pointer must remain inside the tuple in the table's heap. For shorter length variable-length fields, either a 4-byte or 1-byte field header is used and the value is stored inside the heap tuple.

Columns that have been dropped from the table also contribute to the maximum column limit. Moreover, although the dropped column values for newly created tuples are internally marked as null in the tuple's null bitmap, the null bitmap also occupies space.
