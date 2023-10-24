<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                      Chapter 67. B-Tree Indexes                      |                                            |                     |                                                       |                                                |
| :------------------------------------------------------------------: | :----------------------------------------- | :-----------------: | ----------------------------------------------------: | ---------------------------------------------: |
| [Prev](custom-rmgr.html "Chapter 66. Custom WAL Resource Managers")  | [Up](internals.html "Part VII. Internals") | Part VII. Internals | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](btree-intro.html "67.1. Introduction") |

***

## Chapter 67. B-Tree Indexes

**Table of Contents**

  * *   [67.1. Introduction](btree-intro.html)
* [67.2. Behavior of B-Tree Operator Classes](btree-behavior.html)
* [67.3. B-Tree Support Functions](btree-support-funcs.html)
* [67.4. Implementation](btree-implementation.html)

    <!---->

  * *   [67.4.1. B-Tree Structure](btree-implementation.html#BTREE-STRUCTURE)
  * [67.4.2. Bottom-up Index Deletion](btree-implementation.html#BTREE-DELETION)
  * [67.4.3. Deduplication](btree-implementation.html#BTREE-DEDUPLICATION)

***

|                                                                      |                                                       |                                                |
| :------------------------------------------------------------------- | :---------------------------------------------------: | ---------------------------------------------: |
| [Prev](custom-rmgr.html "Chapter 66. Custom WAL Resource Managers")  |       [Up](internals.html "Part VII. Internals")      |  [Next](btree-intro.html "67.1. Introduction") |
| Chapter 66. Custom WAL Resource Managers                             | [Home](index.html "PostgreSQL 17devel Documentation") |                             67.1. Introduction |
