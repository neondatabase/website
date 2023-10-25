<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                            75.6. BKI Example                            |                                                                               |                                                              |                                                       |                                                                                   |
| :---------------------------------------------------------------------: | :---------------------------------------------------------------------------- | :----------------------------------------------------------: | ----------------------------------------------------: | --------------------------------------------------------------------------------: |
| [Prev](bki-structure.html "75.5. Structure of the Bootstrap BKI File")  | [Up](bki.html "Chapter 75. System Catalog Declarations and Initial Contents") | Chapter 75. System Catalog Declarations and Initial Contents | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](planner-stats-details.html "Chapter 76. How the Planner Uses Statistics") |

***

## 75.6. BKI Example [#](#BKI-EXAMPLE)

The following sequence of commands will create the table `test_table` with OID 420, having three columns `oid`, `cola` and `colb` of type `oid`, `int4` and `text`, respectively, and insert two rows into the table:

```

create test_table 420 (oid = oid, cola = int4, colb = text)
open test_table
insert ( 421 1 'value 1' )
insert ( 422 2 _null_ )
close test_table
```

***

|                                                                         |                                                                               |                                                                                   |
| :---------------------------------------------------------------------- | :---------------------------------------------------------------------------: | --------------------------------------------------------------------------------: |
| [Prev](bki-structure.html "75.5. Structure of the Bootstrap BKI File")  | [Up](bki.html "Chapter 75. System Catalog Declarations and Initial Contents") |  [Next](planner-stats-details.html "Chapter 76. How the Planner Uses Statistics") |
| 75.5. Structure of the Bootstrap BKI File                               |             [Home](index.html "PostgreSQL 17devel Documentation")             |                                       Chapter 76. How the Planner Uses Statistics |
