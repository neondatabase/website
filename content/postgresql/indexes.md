## Chapter 11. Indexes

**Table of Contents**

  * *   [11.1. Introduction](indexes-intro.html)
  * [11.2. Index Types](indexes-types.html)

    

  * *   [11.2.1. B-Tree](indexes-types.html#INDEXES-TYPES-BTREE)
    * [11.2.2. Hash](indexes-types.html#INDEXES-TYPES-HASH)
    * [11.2.3. GiST](indexes-types.html#INDEXES-TYPE-GIST)
    * [11.2.4. SP-GiST](indexes-types.html#INDEXES-TYPE-SPGIST)
    * [11.2.5. GIN](indexes-types.html#INDEXES-TYPES-GIN)
    * [11.2.6. BRIN](indexes-types.html#INDEXES-TYPES-BRIN)

  * *   [11.3. Multicolumn Indexes](indexes-multicolumn.html)
  * [11.4. Indexes and `ORDER BY`](indexes-ordering.html)
  * [11.5. Combining Multiple Indexes](indexes-bitmap-scans.html)
  * [11.6. Unique Indexes](indexes-unique.html)
  * [11.7. Indexes on Expressions](indexes-expressional.html)
  * [11.8. Partial Indexes](indexes-partial.html)
  * [11.9. Index-Only Scans and Covering Indexes](indexes-index-only-scans.html)
  * [11.10. Operator Classes and Operator Families](indexes-opclass.html)
  * [11.11. Indexes and Collations](indexes-collations.html)
  * [11.12. Examining Index Usage](indexes-examine.html)

Indexes are a common way to enhance database performance. An index allows the database server to find and retrieve specific rows much faster than it could do without an index. But indexes also add overhead to the database system as a whole, so they should be used sensibly.