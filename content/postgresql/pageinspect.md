[#id](#PAGEINSPECT)

## F.25. pageinspect — low-level inspection of database pages [#](#PAGEINSPECT)

- [F.25.1. General Functions](pageinspect#PAGEINSPECT-GENERAL-FUNCS)
- [F.25.2. Heap Functions](pageinspect#PAGEINSPECT-HEAP-FUNCS)
- [F.25.3. B-Tree Functions](pageinspect#PAGEINSPECT-B-TREE-FUNCS)
- [F.25.4. BRIN Functions](pageinspect#PAGEINSPECT-BRIN-FUNCS)
- [F.25.5. GIN Functions](pageinspect#PAGEINSPECT-GIN-FUNCS)
- [F.25.6. GiST Functions](pageinspect#PAGEINSPECT-GIST-FUNCS)
- [F.25.7. Hash Functions](pageinspect#PAGEINSPECT-HASH-FUNCS)

The `pageinspect` module provides functions that allow you to inspect the contents of database pages at a low level, which is useful for debugging purposes. All of these functions may be used only by superusers.

[#id](#PAGEINSPECT-GENERAL-FUNCS)

### F.25.1. General Functions [#](#PAGEINSPECT-GENERAL-FUNCS)

- `get_raw_page(relname text, fork text, blkno bigint) returns bytea`

  `get_raw_page` reads the specified block of the named relation and returns a copy as a `bytea` value. This allows a single time-consistent copy of the block to be obtained. _`fork`_ should be `'main'` for the main data fork, `'fsm'` for the [free space map](storage-fsm), `'vm'` for the [visibility map](storage-vm), or `'init'` for the initialization fork.

- `get_raw_page(relname text, blkno bigint) returns bytea`

  A shorthand version of `get_raw_page`, for reading from the main fork. Equivalent to `get_raw_page(relname, 'main', blkno)`

- `page_header(page bytea) returns record`

  `page_header` shows fields that are common to all PostgreSQL heap and index pages.

  A page image obtained with `get_raw_page` should be passed as argument. For example:

  ```
  test=# SELECT * FROM page_header(get_raw_page('pg_class', 0));
      lsn    | checksum | flags  | lower | upper | special | pagesize | version | prune_xid
  -----------+----------+--------+-------+-------+---------+----------+---------+-----------
   0/24A1B50 |        0 |      1 |   232 |   368 |    8192 |     8192 |       4 |         0
  ```

  The returned columns correspond to the fields in the `PageHeaderData` struct. See `src/include/storage/bufpage.h` for details.

  The `checksum` field is the checksum stored in the page, which might be incorrect if the page is somehow corrupted. If data checksums are not enabled for this instance, then the value stored is meaningless.

- `page_checksum(page bytea, blkno bigint) returns smallint`

  `page_checksum` computes the checksum for the page, as if it was located at the given block.

  A page image obtained with `get_raw_page` should be passed as argument. For example:

  ```
  test=# SELECT page_checksum(get_raw_page('pg_class', 0), 0);
   page_checksum
  ---------------
           13443
  ```

  Note that the checksum depends on the block number, so matching block numbers should be passed (except when doing esoteric debugging).

  The checksum computed with this function can be compared with the `checksum` result field of the function `page_header`. If data checksums are enabled for this instance, then the two values should be equal.

- `fsm_page_contents(page bytea) returns text`

  `fsm_page_contents` shows the internal node structure of an FSM page. For example:

  ```
  test=# SELECT fsm_page_contents(get_raw_page('pg_class', 'fsm', 0));
  ```

  The output is a multiline string, with one line per node in the binary tree within the page. Only those nodes that are not zero are printed. The so-called "next" pointer, which points to the next slot to be returned from the page, is also printed.

  See `src/backend/storage/freespace/README` for more information on the structure of an FSM page.

[#id](#PAGEINSPECT-HEAP-FUNCS)

### F.25.2. Heap Functions [#](#PAGEINSPECT-HEAP-FUNCS)

- `heap_page_items(page bytea) returns setof record`

  `heap_page_items` shows all line pointers on a heap page. For those line pointers that are in use, tuple headers as well as tuple raw data are also shown. All tuples are shown, whether or not the tuples were visible to an MVCC snapshot at the time the raw page was copied.

  A heap page image obtained with `get_raw_page` should be passed as argument. For example:

  ```
  test=# SELECT * FROM heap_page_items(get_raw_page('pg_class', 0));
  ```

  See `src/include/storage/itemid.h` and `src/include/access/htup_details.h` for explanations of the fields returned.

  The `heap_tuple_infomask_flags` function can be used to unpack the flag bits of `t_infomask` and `t_infomask2` for heap tuples.

- `tuple_data_split(rel_oid oid, t_data bytea, t_infomask integer, t_infomask2 integer, t_bits text [, do_detoast bool]) returns bytea[]`

  `tuple_data_split` splits tuple data into attributes in the same way as backend internals.

  ```
  test=# SELECT tuple_data_split('pg_class'::regclass, t_data, t_infomask, t_infomask2, t_bits) FROM heap_page_items(get_raw_page('pg_class', 0));
  ```

  This function should be called with the same arguments as the return attributes of `heap_page_items`.

  If _`do_detoast`_ is `true`, attributes will be detoasted as needed. Default value is `false`.

- `heap_page_item_attrs(page bytea, rel_oid regclass [, do_detoast bool]) returns setof record`

  `heap_page_item_attrs` is equivalent to `heap_page_items` except that it returns tuple raw data as an array of attributes that can optionally be detoasted by _`do_detoast`_ which is `false` by default.

  A heap page image obtained with `get_raw_page` should be passed as argument. For example:

  ```
  test=# SELECT * FROM heap_page_item_attrs(get_raw_page('pg_class', 0), 'pg_class'::regclass);
  ```

- `heap_tuple_infomask_flags(t_infomask integer, t_infomask2 integer) returns record`

  `heap_tuple_infomask_flags` decodes the `t_infomask` and `t_infomask2` returned by `heap_page_items` into a human-readable set of arrays made of flag names, with one column for all the flags and one column for combined flags. For example:

  ```
  test=# SELECT t_ctid, raw_flags, combined_flags
           FROM heap_page_items(get_raw_page('pg_class', 0)),
             LATERAL heap_tuple_infomask_flags(t_infomask, t_infomask2)
           WHERE t_infomask IS NOT NULL OR t_infomask2 IS NOT NULL;
  ```

  This function should be called with the same arguments as the return attributes of `heap_page_items`.

  Combined flags are displayed for source-level macros that take into account the value of more than one raw bit, such as `HEAP_XMIN_FROZEN`.

  See `src/include/access/htup_details.h` for explanations of the flag names returned.

[#id](#PAGEINSPECT-B-TREE-FUNCS)

### F.25.3. B-Tree Functions [#](#PAGEINSPECT-B-TREE-FUNCS)

- `bt_metap(relname text) returns record`

  `bt_metap` returns information about a B-tree index's metapage. For example:

  ```
  test=# SELECT * FROM bt_metap('pg_cast_oid_index');
  -[ RECORD 1 ]-------------+-------
  magic                     | 340322
  version                   | 4
  root                      | 1
  level                     | 0
  fastroot                  | 1
  fastlevel                 | 0
  last_cleanup_num_delpages | 0
  last_cleanup_num_tuples   | 230
  allequalimage             | f
  ```

- `bt_page_stats(relname text, blkno bigint) returns record`

  `bt_page_stats` returns summary information about a data page of a B-tree index. For example:

  ```
  test=# SELECT * FROM bt_page_stats('pg_cast_oid_index', 1);
  -[ RECORD 1 ]-+-----
  blkno         | 1
  type          | l
  live_items    | 224
  dead_items    | 0
  avg_item_size | 16
  page_size     | 8192
  free_size     | 3668
  btpo_prev     | 0
  btpo_next     | 0
  btpo_level    | 0
  btpo_flags    | 3
  ```

- `bt_multi_page_stats(relname text, blkno bigint, blk_count bigint) returns setof record`

  `bt_multi_page_stats` returns the same information as `bt_page_stats`, but does so for each page of the range of pages beginning at _`blkno`_ and extending for _`blk_count`_ pages. If _`blk_count`_ is negative, all pages from _`blkno`_ to the end of the index are reported on. For example:

  ```
  test=# SELECT * FROM bt_multi_page_stats('pg_proc_oid_index', 5, 2);
  -[ RECORD 1 ]-+-----
  blkno         | 5
  type          | l
  live_items    | 367
  dead_items    | 0
  avg_item_size | 16
  page_size     | 8192
  free_size     | 808
  btpo_prev     | 4
  btpo_next     | 6
  btpo_level    | 0
  btpo_flags    | 1
  -[ RECORD 2 ]-+-----
  blkno         | 6
  type          | l
  live_items    | 367
  dead_items    | 0
  avg_item_size | 16
  page_size     | 8192
  free_size     | 808
  btpo_prev     | 5
  btpo_next     | 7
  btpo_level    | 0
  btpo_flags    | 1
  ```

- `bt_page_items(relname text, blkno bigint) returns setof record`

  `bt_page_items` returns detailed information about all of the items on a B-tree index page. For example:

  ```
  test=# SELECT itemoffset, ctid, itemlen, nulls, vars, data, dead, htid, tids[0:2] AS some_tids
          FROM bt_page_items('tenk2_hundred', 5);
   itemoffset |   ctid    | itemlen | nulls | vars |          data           | dead |  htid  |      some_tids
  ------------+-----------+---------+-------+------+-------------------------+------+--------+---------------------
            1 | (16,1)    |      16 | f     | f    | 30 00 00 00 00 00 00 00 |      |        |
            2 | (16,8292) |     616 | f     | f    | 24 00 00 00 00 00 00 00 | f    | (1,6)  | {"(1,6)","(10,22)"}
            3 | (16,8292) |     616 | f     | f    | 25 00 00 00 00 00 00 00 | f    | (1,18) | {"(1,18)","(4,22)"}
            4 | (16,8292) |     616 | f     | f    | 26 00 00 00 00 00 00 00 | f    | (4,18) | {"(4,18)","(6,17)"}
            5 | (16,8292) |     616 | f     | f    | 27 00 00 00 00 00 00 00 | f    | (1,2)  | {"(1,2)","(1,19)"}
            6 | (16,8292) |     616 | f     | f    | 28 00 00 00 00 00 00 00 | f    | (2,24) | {"(2,24)","(4,11)"}
            7 | (16,8292) |     616 | f     | f    | 29 00 00 00 00 00 00 00 | f    | (2,17) | {"(2,17)","(11,2)"}
            8 | (16,8292) |     616 | f     | f    | 2a 00 00 00 00 00 00 00 | f    | (0,25) | {"(0,25)","(3,20)"}
            9 | (16,8292) |     616 | f     | f    | 2b 00 00 00 00 00 00 00 | f    | (0,10) | {"(0,10)","(0,14)"}
           10 | (16,8292) |     616 | f     | f    | 2c 00 00 00 00 00 00 00 | f    | (1,3)  | {"(1,3)","(3,9)"}
           11 | (16,8292) |     616 | f     | f    | 2d 00 00 00 00 00 00 00 | f    | (6,28) | {"(6,28)","(11,1)"}
           12 | (16,8292) |     616 | f     | f    | 2e 00 00 00 00 00 00 00 | f    | (0,27) | {"(0,27)","(1,13)"}
           13 | (16,8292) |     616 | f     | f    | 2f 00 00 00 00 00 00 00 | f    | (4,17) | {"(4,17)","(4,21)"}
  (13 rows)
  ```

  This is a B-tree leaf page. All tuples that point to the table happen to be posting list tuples (all of which store a total of 100 6 byte TIDs). There is also a “high key” tuple at `itemoffset` number 1. `ctid` is used to store encoded information about each tuple in this example, though leaf page tuples often store a heap TID directly in the `ctid` field instead. `tids` is the list of TIDs stored as a posting list.

  In an internal page (not shown), the block number part of `ctid` is a “downlink”, which is a block number of another page in the index itself. The offset part (the second number) of `ctid` stores encoded information about the tuple, such as the number of columns present (suffix truncation may have removed unneeded suffix columns). Truncated columns are treated as having the value “minus infinity”.

  `htid` shows a heap TID for the tuple, regardless of the underlying tuple representation. This value may match `ctid`, or may be decoded from the alternative representations used by posting list tuples and tuples from internal pages. Tuples in internal pages usually have the implementation level heap TID column truncated away, which is represented as a NULL `htid` value.

  Note that the first item on any non-rightmost page (any page with a non-zero value in the `btpo_next` field) is the page's “high key”, meaning its `data` serves as an upper bound on all items appearing on the page, while its `ctid` field does not point to another block. Also, on internal pages, the first real data item (the first item that is not a high key) reliably has every column truncated away, leaving no actual value in its `data` field. Such an item does have a valid downlink in its `ctid` field, however.

  For more details about the structure of B-tree indexes, see [Section 67.4.1](btree-implementation#BTREE-STRUCTURE). For more details about deduplication and posting lists, see [Section 67.4.3](btree-implementation#BTREE-DEDUPLICATION).

- `bt_page_items(page bytea) returns setof record`

  It is also possible to pass a page to `bt_page_items` as a `bytea` value. A page image obtained with `get_raw_page` should be passed as argument. So the last example could also be rewritten like this:

  ```
  test=# SELECT itemoffset, ctid, itemlen, nulls, vars, data, dead, htid, tids[0:2] AS some_tids
          FROM bt_page_items(get_raw_page('tenk2_hundred', 5));
   itemoffset |   ctid    | itemlen | nulls | vars |          data           | dead |  htid  |      some_tids
  ------------+-----------+---------+-------+------+-------------------------+------+--------+---------------------
            1 | (16,1)    |      16 | f     | f    | 30 00 00 00 00 00 00 00 |      |        |
            2 | (16,8292) |     616 | f     | f    | 24 00 00 00 00 00 00 00 | f    | (1,6)  | {"(1,6)","(10,22)"}
            3 | (16,8292) |     616 | f     | f    | 25 00 00 00 00 00 00 00 | f    | (1,18) | {"(1,18)","(4,22)"}
            4 | (16,8292) |     616 | f     | f    | 26 00 00 00 00 00 00 00 | f    | (4,18) | {"(4,18)","(6,17)"}
            5 | (16,8292) |     616 | f     | f    | 27 00 00 00 00 00 00 00 | f    | (1,2)  | {"(1,2)","(1,19)"}
            6 | (16,8292) |     616 | f     | f    | 28 00 00 00 00 00 00 00 | f    | (2,24) | {"(2,24)","(4,11)"}
            7 | (16,8292) |     616 | f     | f    | 29 00 00 00 00 00 00 00 | f    | (2,17) | {"(2,17)","(11,2)"}
            8 | (16,8292) |     616 | f     | f    | 2a 00 00 00 00 00 00 00 | f    | (0,25) | {"(0,25)","(3,20)"}
            9 | (16,8292) |     616 | f     | f    | 2b 00 00 00 00 00 00 00 | f    | (0,10) | {"(0,10)","(0,14)"}
           10 | (16,8292) |     616 | f     | f    | 2c 00 00 00 00 00 00 00 | f    | (1,3)  | {"(1,3)","(3,9)"}
           11 | (16,8292) |     616 | f     | f    | 2d 00 00 00 00 00 00 00 | f    | (6,28) | {"(6,28)","(11,1)"}
           12 | (16,8292) |     616 | f     | f    | 2e 00 00 00 00 00 00 00 | f    | (0,27) | {"(0,27)","(1,13)"}
           13 | (16,8292) |     616 | f     | f    | 2f 00 00 00 00 00 00 00 | f    | (4,17) | {"(4,17)","(4,21)"}
  (13 rows)
  ```

  All the other details are the same as explained in the previous item.

[#id](#PAGEINSPECT-BRIN-FUNCS)

### F.25.4. BRIN Functions [#](#PAGEINSPECT-BRIN-FUNCS)

- `brin_page_type(page bytea) returns text`

  `brin_page_type` returns the page type of the given BRIN index page, or throws an error if the page is not a valid BRIN page. For example:

  ```
  test=# SELECT brin_page_type(get_raw_page('brinidx', 0));
   brin_page_type
  ----------------
   meta
  ```

- `brin_metapage_info(page bytea) returns record`

  `brin_metapage_info` returns assorted information about a BRIN index metapage. For example:

  ```
  test=# SELECT * FROM brin_metapage_info(get_raw_page('brinidx', 0));
     magic    | version | pagesperrange | lastrevmappage
  ------------+---------+---------------+----------------
   0xA8109CFA |       1 |             4 |              2
  ```

- `brin_revmap_data(page bytea) returns setof tid`

  `brin_revmap_data` returns the list of tuple identifiers in a BRIN index range map page. For example:

  ```
  test=# SELECT * FROM brin_revmap_data(get_raw_page('brinidx', 2)) LIMIT 5;
    pages
  ---------
   (6,137)
   (6,138)
   (6,139)
   (6,140)
   (6,141)
  ```

- `brin_page_items(page bytea, index oid) returns setof record`

  `brin_page_items` returns the data stored in the BRIN data page. For example:

  ```
  test=# SELECT * FROM brin_page_items(get_raw_page('brinidx', 5),
                                       'brinidx')
         ORDER BY blknum, attnum LIMIT 6;
   itemoffset | blknum | attnum | allnulls | hasnulls | placeholder | empty |    value
  ------------+--------+--------+----------+----------+-------------+-------+--------------
          137 |      0 |      1 | t        | f        | f           | f     |
          137 |      0 |      2 | f        | f        | f           | f     | {1 .. 88}
          138 |      4 |      1 | t        | f        | f           | f     |
          138 |      4 |      2 | f        | f        | f           | f     | {89 .. 176}
          139 |      8 |      1 | t        | f        | f           | f     |
          139 |      8 |      2 | f        | f        | f           | f     | {177 .. 264}
  ```

  The returned columns correspond to the fields in the `BrinMemTuple` and `BrinValues` structs. See `src/include/access/brin_tuple.h` for details.

[#id](#PAGEINSPECT-GIN-FUNCS)

### F.25.5. GIN Functions [#](#PAGEINSPECT-GIN-FUNCS)

- `gin_metapage_info(page bytea) returns record`

  `gin_metapage_info` returns information about a GIN index metapage. For example:

  ```
  test=# SELECT * FROM gin_metapage_info(get_raw_page('gin_index', 0));
  -[ RECORD 1 ]----+-----------
  pending_head     | 4294967295
  pending_tail     | 4294967295
  tail_free_size   | 0
  n_pending_pages  | 0
  n_pending_tuples | 0
  n_total_pages    | 7
  n_entry_pages    | 6
  n_data_pages     | 0
  n_entries        | 693
  version          | 2
  ```

- `gin_page_opaque_info(page bytea) returns record`

  `gin_page_opaque_info` returns information about a GIN index opaque area, like the page type. For example:

  ```
  test=# SELECT * FROM gin_page_opaque_info(get_raw_page('gin_index', 2));
   rightlink | maxoff |         flags
  -----------+--------+------------------------
           5 |      0 | {data,leaf,compressed}
  (1 row)
  ```

- `gin_leafpage_items(page bytea) returns setof record`

  `gin_leafpage_items` returns information about the data stored in a GIN leaf page. For example:

  ```
  test=# SELECT first_tid, nbytes, tids[0:5] AS some_tids
          FROM gin_leafpage_items(get_raw_page('gin_test_idx', 2));
   first_tid | nbytes |                        some_tids
  -----------+--------+----------------------------------------------------------
   (8,41)    |    244 | {"(8,41)","(8,43)","(8,44)","(8,45)","(8,46)"}
   (10,45)   |    248 | {"(10,45)","(10,46)","(10,47)","(10,48)","(10,49)"}
   (12,52)   |    248 | {"(12,52)","(12,53)","(12,54)","(12,55)","(12,56)"}
   (14,59)   |    320 | {"(14,59)","(14,60)","(14,61)","(14,62)","(14,63)"}
   (167,16)  |    376 | {"(167,16)","(167,17)","(167,18)","(167,19)","(167,20)"}
   (170,30)  |    376 | {"(170,30)","(170,31)","(170,32)","(170,33)","(170,34)"}
   (173,44)  |    197 | {"(173,44)","(173,45)","(173,46)","(173,47)","(173,48)"}
  (7 rows)
  ```

[#id](#PAGEINSPECT-GIST-FUNCS)

### F.25.6. GiST Functions [#](#PAGEINSPECT-GIST-FUNCS)

- `gist_page_opaque_info(page bytea) returns record`

  `gist_page_opaque_info` returns information from a GiST index page's opaque area, such as the NSN, rightlink and page type. For example:

  ```
  test=# SELECT * FROM gist_page_opaque_info(get_raw_page('test_gist_idx', 2));
   lsn | nsn | rightlink | flags
  -----+-----+-----------+--------
   0/1 | 0/0 |         1 | {leaf}
  (1 row)
  ```

- `gist_page_items(page bytea, index_oid regclass) returns setof record`

  `gist_page_items` returns information about the data stored in a page of a GiST index. For example:

  ```
  test=# SELECT * FROM gist_page_items(get_raw_page('test_gist_idx', 0), 'test_gist_idx');
   itemoffset |   ctid    | itemlen | dead |             keys
  ------------+-----------+---------+------+-------------------------------
            1 | (1,65535) |      40 | f    | (p)=("(185,185),(1,1)")
            2 | (2,65535) |      40 | f    | (p)=("(370,370),(186,186)")
            3 | (3,65535) |      40 | f    | (p)=("(555,555),(371,371)")
            4 | (4,65535) |      40 | f    | (p)=("(740,740),(556,556)")
            5 | (5,65535) |      40 | f    | (p)=("(870,870),(741,741)")
            6 | (6,65535) |      40 | f    | (p)=("(1000,1000),(871,871)")
  (6 rows)
  ```

- `gist_page_items_bytea(page bytea) returns setof record`

  Same as `gist_page_items`, but returns the key data as a raw `bytea` blob. Since it does not attempt to decode the key, it does not need to know which index is involved. For example:

  ```
  test=# SELECT * FROM gist_page_items_bytea(get_raw_page('test_gist_idx', 0));
   itemoffset |   ctid    | itemlen | dead |                                      key_data
  ------------+-----------+---------+------+-----------------------------------------​-------------------------------------------
            1 | (1,65535) |      40 | f    | \x00000100ffff28000000000000c0644000000000​00c06440000000000000f03f000000000000f03f
            2 | (2,65535) |      40 | f    | \x00000200ffff28000000000000c0744000000000​00c074400000000000e064400000000000e06440
            3 | (3,65535) |      40 | f    | \x00000300ffff28000000000000207f4000000000​00207f400000000000d074400000000000d07440
            4 | (4,65535) |      40 | f    | \x00000400ffff28000000000000c0844000000000​00c084400000000000307f400000000000307f40
            5 | (5,65535) |      40 | f    | \x00000500ffff28000000000000f0894000000000​00f089400000000000c884400000000000c88440
            6 | (6,65535) |      40 | f    | \x00000600ffff28000000000000208f4000000000​00208f400000000000f889400000000000f88940
            7 | (7,65535) |      40 | f    | \x00000700ffff28000000000000408f4000000000​00408f400000000000288f400000000000288f40
  (7 rows)
  ```

[#id](#PAGEINSPECT-HASH-FUNCS)

### F.25.7. Hash Functions [#](#PAGEINSPECT-HASH-FUNCS)

- `hash_page_type(page bytea) returns text`

  `hash_page_type` returns page type of the given HASH index page. For example:

  ```
  test=# SELECT hash_page_type(get_raw_page('con_hash_index', 0));
   hash_page_type
  ----------------
   metapage
  ```

- `hash_page_stats(page bytea) returns setof record`

  `hash_page_stats` returns information about a bucket or overflow page of a HASH index. For example:

  ```
  test=# SELECT * FROM hash_page_stats(get_raw_page('con_hash_index', 1));
  -[ RECORD 1 ]---+-----------
  live_items      | 407
  dead_items      | 0
  page_size       | 8192
  free_size       | 8
  hasho_prevblkno | 4096
  hasho_nextblkno | 8474
  hasho_bucket    | 0
  hasho_flag      | 66
  hasho_page_id   | 65408
  ```

- `hash_page_items(page bytea) returns setof record`

  `hash_page_items` returns information about the data stored in a bucket or overflow page of a HASH index page. For example:

  ```
  test=# SELECT * FROM hash_page_items(get_raw_page('con_hash_index', 1)) LIMIT 5;
   itemoffset |   ctid    |    data
  ------------+-----------+------------
            1 | (899,77)  | 1053474816
            2 | (897,29)  | 1053474816
            3 | (894,207) | 1053474816
            4 | (892,159) | 1053474816
            5 | (890,111) | 1053474816
  ```

- `hash_bitmap_info(index oid, blkno bigint) returns record`

  `hash_bitmap_info` shows the status of a bit in the bitmap page for a particular overflow page of HASH index. For example:

  ```
  test=# SELECT * FROM hash_bitmap_info('con_hash_index', 2052);
   bitmapblkno | bitmapbit | bitstatus
  -------------+-----------+-----------
            65 |         3 | t
  ```

- `hash_metapage_info(page bytea) returns record`

  `hash_metapage_info` returns information stored in the meta page of a HASH index. For example:

  ```
  test=# SELECT magic, version, ntuples, ffactor, bsize, bmsize, bmshift,
  test-#     maxbucket, highmask, lowmask, ovflpoint, firstfree, nmaps, procid,
  test-#     regexp_replace(spares::text, '(,0)*}', '}') as spares,
  test-#     regexp_replace(mapp::text, '(,0)*}', '}') as mapp
  test-# FROM hash_metapage_info(get_raw_page('con_hash_index', 0));
  -[ RECORD 1 ]-------------------------------------------------​------------------------------
  magic     | 105121344
  version   | 4
  ntuples   | 500500
  ffactor   | 40
  bsize     | 8152
  bmsize    | 4096
  bmshift   | 15
  maxbucket | 12512
  highmask  | 16383
  lowmask   | 8191
  ovflpoint | 28
  firstfree | 1204
  nmaps     | 1
  procid    | 450
  spares    | {0,0,0,0,0,0,1,1,1,1,1,1,1,1,3,4,4,4,45,55,58,59,​508,567,628,704,1193,1202,1204}
  mapp      | {65}
  ```
