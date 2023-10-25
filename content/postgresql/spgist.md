

|          Chapter 69. SP-GiST Indexes         |                                            |                     |                                                       |                                                 |
| :------------------------------------------: | :----------------------------------------- | :-----------------: | ----------------------------------------------------: | ----------------------------------------------: |
| [Prev](gist-examples.html "68.5. Examples")  | [Up](internals.html "Part VII. Internals") | Part VII. Internals | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](spgist-intro.html "69.1. Introduction") |

***

## Chapter 69. SP-GiST Indexes

**Table of Contents**

  * *   [69.1. Introduction](spgist-intro.html)
  * [69.2. Built-in Operator Classes](spgist-builtin-opclasses.html)
  * [69.3. Extensibility](spgist-extensibility.html)
  * [69.4. Implementation](spgist-implementation.html)

    

  * *   [69.4.1. SP-GiST Limits](spgist-implementation.html#SPGIST-LIMITS)
    * [69.4.2. SP-GiST Without Node Labels](spgist-implementation.html#SPGIST-NULL-LABELS)
    * [69.4.3. “All-the-Same” Inner Tuples](spgist-implementation.html#SPGIST-ALL-THE-SAME)

* [69.5. Examples](spgist-examples.html)

***

|                                              |                                                       |                                                 |
| :------------------------------------------- | :---------------------------------------------------: | ----------------------------------------------: |
| [Prev](gist-examples.html "68.5. Examples")  |       [Up](internals.html "Part VII. Internals")      |  [Next](spgist-intro.html "69.1. Introduction") |
| 68.5. Examples                               | [Home](index.html "PostgreSQL 17devel Documentation") |                              69.1. Introduction |
