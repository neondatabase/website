---
title: 'PostgreSQL Index Types'
redirectFrom: 
            - /docs/postgresql/postgresql-indexes/postgresql-index-types
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about various PostgreSQL index types and how to use them appropriately.

PostgreSQL has several index types: B-tree, Hash, GiST, SP-GiST, GIN, and BRIN. Each index type uses a different storage structure and algorithm to cope with different kinds of queries.

When you use the `CREATE INDEX` statement without specifying the index type, PostgreSQL uses the B-tree index type by default because it is best to fit the most common queries.

## B-tree indexes

B-tree is a self-balancing tree that maintains sorted data and allows searches, insertions, deletions, and sequential access in logarithmic time.

PostgreSQL query planner will consider using a B-tree index whenever index columns are involved in a comparison that uses one of the following operators:

```
<
<=
=
>=
BETWEEN
IN
IS NULL
IS NOT NULL
```

In addition, the query planner can use a B-tree index for queries that involve a pattern-matching operator `LIKE` and `~` if the pattern is a constant and is anchor at the beginning of the pattern, for example:

```
column_name LIKE 'foo%'
column_name LKE 'bar%'
column_name  ~ '^foo'
```

Furthermore, the query planner will consider using B-tree indexes for `ILIKE` and `~*` if the pattern starts with a non-alphabetic character which are the characters that are not affected by upper/lower case conversion.

If you have started using an index to optimize your PostgreSQL database, B-tree is probably the one that you want.

## Hash indexes

Hash indexes can handle only simple equality comparison (=). It means that whenever an indexed column is involved in a comparison using the equal(=) operator, the query planner will consider using a hash index.

To create a hash index, you use the `CREATE INDEX` statement with the `HASH` index type in the `USING` clause as follows:

```
CREATE INDEX index_name
ON table_name USING HASH (indexed_column);
```

## GIN indexes

GIN stands for **g**eneralized **in**verted indexes. It is commonly referred to as GIN.

GIN indexes are most useful when you have multiple values stored in a single column, for example, [hstore](/docs/postgresql/postgresql-hstore), [array](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-array), jsonb, and range types.

## BRIN

BRIN stands for **b**lock **r**ange **in**dexes. BRIN is much smaller and less costly to maintain in comparison with a B-tree index.

BRIN allows the use of an index on a very large table that would previously be impractical using a B-tree without horizontal partitioning.

BRIN is often used on a column that has a linear sort order, for example, the created date column of the sales order table.

## GiST Indexes

GiST stands for Generalized Search Tree. GiST indexes allow the building of general tree structures. GiST indexes are useful in indexing geometric data types and full-text searches.

## SP-GiST Indexes

SP-GiST stands for space-partitioned GiST. SP-GiST supports partitioned search trees that facilitate the development of a wide range of different non-balanced data structures.

SP-GiST indexes are most useful for data that has a natural clustering element to it and is also not an equally balanced tree, for example, GIS, multimedia, phone routing, and IP routing.

In this tutorial, you have learned various PostgreSQL index types including B-tree, Hash, BRIN, GiST, and SP-GiST.
