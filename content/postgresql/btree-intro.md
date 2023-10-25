

|                67.1. Introduction                |                                               |                            |                                                       |                                                                          |
| :----------------------------------------------: | :-------------------------------------------- | :------------------------: | ----------------------------------------------------: | -----------------------------------------------------------------------: |
| [Prev](btree.html "Chapter 67. B-Tree Indexes")  | [Up](btree.html "Chapter 67. B-Tree Indexes") | Chapter 67. B-Tree Indexes | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](btree-behavior.html "67.2. Behavior of B-Tree Operator Classes") |

***

## 67.1. Introduction [#](#BTREE-INTRO)

PostgreSQL includes an implementation of the standard btree (multi-way balanced tree) index data structure. Any data type that can be sorted into a well-defined linear order can be indexed by a btree index. The only limitation is that an index entry cannot exceed approximately one-third of a page (after TOAST compression, if applicable).

Because each btree operator class imposes a sort order on its data type, btree operator classes (or, really, operator families) have come to be used as PostgreSQL's general representation and understanding of sorting semantics. Therefore, they've acquired some features that go beyond what would be needed just to support btree indexes, and parts of the system that are quite distant from the btree AM make use of them.

***

|                                                  |                                                       |                                                                          |
| :----------------------------------------------- | :---------------------------------------------------: | -----------------------------------------------------------------------: |
| [Prev](btree.html "Chapter 67. B-Tree Indexes")  |     [Up](btree.html "Chapter 67. B-Tree Indexes")     |  [Next](btree-behavior.html "67.2. Behavior of B-Tree Operator Classes") |
| Chapter 67. B-Tree Indexes                       | [Home](index.html "PostgreSQL 17devel Documentation") |                                67.2. Behavior of B-Tree Operator Classes |
