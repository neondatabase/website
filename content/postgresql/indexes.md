[#id](#INDEXES)

## Chapter 11. Indexes

**Table of Contents**

- [11.1. Introduction](indexes-intro)
- [11.2. Index Types](indexes-types)

  - [11.2.1. B-Tree](indexes-types#INDEXES-TYPES-BTREE)
  - [11.2.2. Hash](indexes-types#INDEXES-TYPES-HASH)
  - [11.2.3. GiST](indexes-types#INDEXES-TYPE-GIST)
  - [11.2.4. SP-GiST](indexes-types#INDEXES-TYPE-SPGIST)
  - [11.2.5. GIN](indexes-types#INDEXES-TYPES-GIN)
  - [11.2.6. BRIN](indexes-types#INDEXES-TYPES-BRIN)

- [11.3. Multicolumn Indexes](indexes-multicolumn)
- [11.4. Indexes and `ORDER BY`](indexes-ordering)
- [11.5. Combining Multiple Indexes](indexes-bitmap-scans)
- [11.6. Unique Indexes](indexes-unique)
- [11.7. Indexes on Expressions](indexes-expressional)
- [11.8. Partial Indexes](indexes-partial)
- [11.9. Index-Only Scans and Covering Indexes](indexes-index-only-scans)
- [11.10. Operator Classes and Operator Families](indexes-opclass)
- [11.11. Indexes and Collations](indexes-collations)
- [11.12. Examining Index Usage](indexes-examine)

Indexes are a common way to enhance database performance. An index allows the database server to find and retrieve specific rows much faster than it could do without an index. But indexes also add overhead to the database system as a whole, so they should be used sensibly.
