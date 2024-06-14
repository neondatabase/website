[#id](#BTREE-GIN)

## F.8. btree_gin — GIN operator classes with B-tree behavior [#](#BTREE-GIN)

- [F.8.1. Example Usage](btree-gin#BTREE-GIN-EXAMPLE-USAGE)
- [F.8.2. Authors](btree-gin#BTREE-GIN-AUTHORS)

`btree_gin` provides GIN operator classes that implement B-tree equivalent behavior for the data types `int2`, `int4`, `int8`, `float4`, `float8`, `timestamp with time zone`, `timestamp without time zone`, `time with time zone`, `time without time zone`, `date`, `interval`, `oid`, `money`, `"char"`, `varchar`, `text`, `bytea`, `bit`, `varbit`, `macaddr`, `macaddr8`, `inet`, `cidr`, `uuid`, `name`, `bool`, `bpchar`, and all `enum` types.

In general, these operator classes will not outperform the equivalent standard B-tree index methods, and they lack one major feature of the standard B-tree code: the ability to enforce uniqueness. However, they are useful for GIN testing and as a base for developing other GIN operator classes. Also, for queries that test both a GIN-indexable column and a B-tree-indexable column, it might be more efficient to create a multicolumn GIN index that uses one of these operator classes than to create two separate indexes that would have to be combined via bitmap ANDing.

This module is considered “trusted”, that is, it can be installed by non-superusers who have `CREATE` privilege on the current database.

[#id](#BTREE-GIN-EXAMPLE-USAGE)

### F.8.1. Example Usage [#](#BTREE-GIN-EXAMPLE-USAGE)

```

CREATE TABLE test (a int4);
-- create index
CREATE INDEX testidx ON test USING GIN (a);
-- query
SELECT * FROM test WHERE a < 10;
```

[#id](#BTREE-GIN-AUTHORS)

### F.8.2. Authors [#](#BTREE-GIN-AUTHORS)

Teodor Sigaev (`<teodor@stack.net>`) and Oleg Bartunov (`<oleg@sai.msu.su>`). See [http://www.sai.msu.su/~megera/oddmuse/index.cgi/Gin](http://www.sai.msu.su/~megera/oddmuse/index.cgi/Gin) for additional information.
