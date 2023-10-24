<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|    75.5. Structure of the Bootstrap BKI File    |                                                                               |                                                              |                                                       |                                               |
| :---------------------------------------------: | :---------------------------------------------------------------------------- | :----------------------------------------------------------: | ----------------------------------------------------: | --------------------------------------------: |
| [Prev](bki-commands.html "75.4. BKI Commands")  | [Up](bki.html "Chapter 75. System Catalog Declarations and Initial Contents") | Chapter 75. System Catalog Declarations and Initial Contents | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](bki-example.html "75.6. BKI Example") |

***

## 75.5. Structure of the Bootstrap BKI File [#](#BKI-STRUCTURE)

The `open` command cannot be used until the tables it uses exist and have entries for the table that is to be opened. (These minimum tables are `pg_class`, `pg_attribute`, `pg_proc`, and `pg_type`.) To allow those tables themselves to be filled, `create` with the `bootstrap` option implicitly opens the created table for data insertion.

Also, the `declare index` and `declare toast` commands cannot be used until the system catalogs they need have been created and filled in.

Thus, the structure of the `postgres.bki` file has to be:

1. `create bootstrap` one of the critical tables
2. `insert` data describing at least the critical tables
3. `close`
4. Repeat for the other critical tables.
5. `create` (without `bootstrap`) a noncritical table
6. `open`
7. `insert` desired data
8. `close`
9. Repeat for the other noncritical tables.
10. Define indexes and toast tables.
11. `build indices`

There are doubtless other, undocumented ordering dependencies.

***

|                                                 |                                                                               |                                               |
| :---------------------------------------------- | :---------------------------------------------------------------------------: | --------------------------------------------: |
| [Prev](bki-commands.html "75.4. BKI Commands")  | [Up](bki.html "Chapter 75. System Catalog Declarations and Initial Contents") |  [Next](bki-example.html "75.6. BKI Example") |
| 75.4. BKI Commands                              |             [Home](index.html "PostgreSQL 17devel Documentation")             |                             75.6. BKI Example |
