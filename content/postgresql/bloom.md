[#id](#BLOOM)

## F.7. bloom — bloom filter index access method [#](#BLOOM)

- [F.7.1. Parameters](bloom#BLOOM-PARAMETERS)
- [F.7.2. Examples](bloom#BLOOM-EXAMPLES)
- [F.7.3. Operator Class Interface](bloom#BLOOM-OPERATOR-CLASS-INTERFACE)
- [F.7.4. Limitations](bloom#BLOOM-LIMITATIONS)
- [F.7.5. Authors](bloom#BLOOM-AUTHORS)

`bloom` provides an index access method based on [Bloom filters](https://en.wikipedia.org/wiki/Bloom_filter).

A Bloom filter is a space-efficient data structure that is used to test whether an element is a member of a set. In the case of an index access method, it allows fast exclusion of non-matching tuples via signatures whose size is determined at index creation.

A signature is a lossy representation of the indexed attribute(s), and as such is prone to reporting false positives; that is, it may be reported that an element is in the set, when it is not. So index search results must always be rechecked using the actual attribute values from the heap entry. Larger signatures reduce the odds of a false positive and thus reduce the number of useless heap visits, but of course also make the index larger and hence slower to scan.

This type of index is most useful when a table has many attributes and queries test arbitrary combinations of them. A traditional btree index is faster than a bloom index, but it can require many btree indexes to support all possible queries where one needs only a single bloom index. Note however that bloom indexes only support equality queries, whereas btree indexes can also perform inequality and range searches.

[#id](#BLOOM-PARAMETERS)

### F.7.1. Parameters [#](#BLOOM-PARAMETERS)

A `bloom` index accepts the following parameters in its `WITH` clause:

- `length`

  Length of each signature (index entry) in bits. It is rounded up to the nearest multiple of `16`. The default is `80` bits and the maximum is `4096`.

* `col1 — col32`

  Number of bits generated for each index column. Each parameter's name refers to the number of the index column that it controls. The default is `2` bits and the maximum is `4095`. Parameters for index columns not actually used are ignored.

[#id](#BLOOM-EXAMPLES)

### F.7.2. Examples [#](#BLOOM-EXAMPLES)

This is an example of creating a bloom index:

```

CREATE INDEX bloomidx ON tbloom USING bloom (i1,i2,i3)
       WITH (length=80, col1=2, col2=2, col3=4);
```

The index is created with a signature length of 80 bits, with attributes i1 and i2 mapped to 2 bits, and attribute i3 mapped to 4 bits. We could have omitted the `length`, `col1`, and `col2` specifications since those have the default values.

Here is a more complete example of bloom index definition and usage, as well as a comparison with equivalent btree indexes. The bloom index is considerably smaller than the btree index, and can perform better.

```

=# CREATE TABLE tbloom AS
   SELECT
     (random() * 1000000)::int as i1,
     (random() * 1000000)::int as i2,
     (random() * 1000000)::int as i3,
     (random() * 1000000)::int as i4,
     (random() * 1000000)::int as i5,
     (random() * 1000000)::int as i6
   FROM
  generate_series(1,10000000);
SELECT 10000000
```

A sequential scan over this large table takes a long time:

```

=# EXPLAIN ANALYZE SELECT * FROM tbloom WHERE i2 = 898732 AND i5 = 123451;
                                              QUERY PLAN
-------------------------------------------------------------------​-----------------------------------
 Seq Scan on tbloom  (cost=0.00..2137.14 rows=3 width=24) (actual time=16.971..16.971 rows=0 loops=1)
   Filter: ((i2 = 898732) AND (i5 = 123451))
   Rows Removed by Filter: 100000
 Planning Time: 0.346 ms
 Execution Time: 16.988 ms
(5 rows)
```

Even with the btree index defined the result will still be a sequential scan:

```

=# CREATE INDEX btreeidx ON tbloom (i1, i2, i3, i4, i5, i6);
CREATE INDEX
=# SELECT pg_size_pretty(pg_relation_size('btreeidx'));
 pg_size_pretty
----------------
 3976 kB
(1 row)
=# EXPLAIN ANALYZE SELECT * FROM tbloom WHERE i2 = 898732 AND i5 = 123451;
                                              QUERY PLAN
-------------------------------------------------------------------​-----------------------------------
 Seq Scan on tbloom  (cost=0.00..2137.00 rows=2 width=24) (actual time=12.805..12.805 rows=0 loops=1)
   Filter: ((i2 = 898732) AND (i5 = 123451))
   Rows Removed by Filter: 100000
 Planning Time: 0.138 ms
 Execution Time: 12.817 ms
(5 rows)
```

Having the bloom index defined on the table is better than btree in handling this type of search:

```

=# CREATE INDEX bloomidx ON tbloom USING bloom (i1, i2, i3, i4, i5, i6);
CREATE INDEX
=# SELECT pg_size_pretty(pg_relation_size('bloomidx'));
 pg_size_pretty
----------------
 1584 kB
(1 row)
=# EXPLAIN ANALYZE SELECT * FROM tbloom WHERE i2 = 898732 AND i5 = 123451;
                                                     QUERY PLAN
-------------------------------------------------------------------​--------------------------------------------------
 Bitmap Heap Scan on tbloom  (cost=1792.00..1799.69 rows=2 width=24) (actual time=0.388..0.388 rows=0 loops=1)
   Recheck Cond: ((i2 = 898732) AND (i5 = 123451))
   Rows Removed by Index Recheck: 29
   Heap Blocks: exact=28
   ->  Bitmap Index Scan on bloomidx  (cost=0.00..1792.00 rows=2 width=0) (actual time=0.356..0.356 rows=29 loops=1)
         Index Cond: ((i2 = 898732) AND (i5 = 123451))
 Planning Time: 0.099 ms
 Execution Time: 0.408 ms
(8 rows)
```

Now, the main problem with the btree search is that btree is inefficient when the search conditions do not constrain the leading index column(s). A better strategy for btree is to create a separate index on each column. Then the planner will choose something like this:

```

=# CREATE INDEX btreeidx1 ON tbloom (i1);
CREATE INDEX
=# CREATE INDEX btreeidx2 ON tbloom (i2);
CREATE INDEX
=# CREATE INDEX btreeidx3 ON tbloom (i3);
CREATE INDEX
=# CREATE INDEX btreeidx4 ON tbloom (i4);
CREATE INDEX
=# CREATE INDEX btreeidx5 ON tbloom (i5);
CREATE INDEX
=# CREATE INDEX btreeidx6 ON tbloom (i6);
CREATE INDEX
=# EXPLAIN ANALYZE SELECT * FROM tbloom WHERE i2 = 898732 AND i5 = 123451;
                                                        QUERY PLAN
-------------------------------------------------------------------​--------------------------------------------------------
 Bitmap Heap Scan on tbloom  (cost=24.34..32.03 rows=2 width=24) (actual time=0.028..0.029 rows=0 loops=1)
   Recheck Cond: ((i5 = 123451) AND (i2 = 898732))
   ->  BitmapAnd  (cost=24.34..24.34 rows=2 width=0) (actual time=0.027..0.027 rows=0 loops=1)
         ->  Bitmap Index Scan on btreeidx5  (cost=0.00..12.04 rows=500 width=0) (actual time=0.026..0.026 rows=0 loops=1)
               Index Cond: (i5 = 123451)
         ->  Bitmap Index Scan on btreeidx2  (cost=0.00..12.04 rows=500 width=0) (never executed)
               Index Cond: (i2 = 898732)
 Planning Time: 0.491 ms
 Execution Time: 0.055 ms
(9 rows)
```

Although this query runs much faster than with either of the single indexes, we pay a penalty in index size. Each of the single-column btree indexes occupies 2 MB, so the total space needed is 12 MB, eight times the space used by the bloom index.

[#id](#BLOOM-OPERATOR-CLASS-INTERFACE)

### F.7.3. Operator Class Interface [#](#BLOOM-OPERATOR-CLASS-INTERFACE)

An operator class for bloom indexes requires only a hash function for the indexed data type and an equality operator for searching. This example shows the operator class definition for the `text` data type:

```

CREATE OPERATOR CLASS text_ops
DEFAULT FOR TYPE text USING bloom AS
    OPERATOR    1   =(text, text),
    FUNCTION    1   hashtext(text);
```

[#id](#BLOOM-LIMITATIONS)

### F.7.4. Limitations [#](#BLOOM-LIMITATIONS)

- Only operator classes for `int4` and `text` are included with the module.

- Only the `=` operator is supported for search. But it is possible to add support for arrays with union and intersection operations in the future.

- `bloom` access method doesn't support `UNIQUE` indexes.

- `bloom` access method doesn't support searching for `NULL` values.

[#id](#BLOOM-AUTHORS)

### F.7.5. Authors [#](#BLOOM-AUTHORS)

Teodor Sigaev `<teodor@postgrespro.ru>`, Postgres Professional, Moscow, Russia

Alexander Korotkov `<a.korotkov@postgrespro.ru>`, Postgres Professional, Moscow, Russia

Oleg Bartunov `<obartunov@postgrespro.ru>`, Postgres Professional, Moscow, Russia
