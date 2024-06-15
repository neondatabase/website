[#id](#BRIN-BUILTIN-OPCLASSES)

## 71.2. Built-in Operator Classes [#](#BRIN-BUILTIN-OPCLASSES)

- [71.2.1. Operator Class Parameters](brin-builtin-opclasses#BRIN-BUILTIN-OPCLASSES--PARAMETERS)

The core PostgreSQL distribution includes the BRIN operator classes shown in [Table 71.1](brin-builtin-opclasses#BRIN-BUILTIN-OPCLASSES-TABLE).

The _minmax_ operator classes store the minimum and the maximum values appearing in the indexed column within the range. The _inclusion_ operator classes store a value which includes the values in the indexed column within the range. The _bloom_ operator classes build a Bloom filter for all values in the range. The _minmax-multi_ operator classes store multiple minimum and maximum values, representing values appearing in the indexed column within the range.

[#id](#BRIN-BUILTIN-OPCLASSES-TABLE)

**Table 71.1. Built-in BRIN Operator Classes**

| Name                           | Indexable Operators           |
| ------------------------------ | ----------------------------- |
| `bit_minmax_ops`               | `= (bit,bit)`                 |
| `< (bit,bit)`                  |                               |
| `> (bit,bit)`                  |                               |
| `<= (bit,bit)`                 |                               |
| `>= (bit,bit)`                 |                               |
| `box_inclusion_ops`            | `@> (box,point)`              |
| `<< (box,box)`                 |                               |
| `&< (box,box)`                 |                               |
| `&> (box,box)`                 |                               |
| `>> (box,box)`                 |                               |
| `<@ (box,box)`                 |                               |
| `@> (box,box)`                 |                               |
| `~= (box,box)`                 |                               |
| `&& (box,box)`                 |                               |
| `<<\| (box,box)`               |                               |
| `&<\| (box,box)`               |                               |
| `\|&> (box,box)`               |                               |
| `\|>> (box,box)`               |                               |
| `bpchar_bloom_ops`             | `= (character,character)`     |
| `bpchar_minmax_ops`            | `= (character,character)`     |
| `< (character,character)`      |                               |
| `<= (character,character)`     |                               |
| `> (character,character)`      |                               |
| `>= (character,character)`     |                               |
| `bytea_bloom_ops`              | `= (bytea,bytea)`             |
| `bytea_minmax_ops`             | `= (bytea,bytea)`             |
| `< (bytea,bytea)`              |                               |
| `<= (bytea,bytea)`             |                               |
| `> (bytea,bytea)`              |                               |
| `>= (bytea,bytea)`             |                               |
| `char_bloom_ops`               | `= ("char","char")`           |
| `char_minmax_ops`              | `= ("char","char")`           |
| `< ("char","char")`            |                               |
| `<= ("char","char")`           |                               |
| `> ("char","char")`            |                               |
| `>= ("char","char")`           |                               |
| `date_bloom_ops`               | `= (date,date)`               |
| `date_minmax_ops`              | `= (date,date)`               |
| `< (date,date)`                |                               |
| `<= (date,date)`               |                               |
| `> (date,date)`                |                               |
| `>= (date,date)`               |                               |
| `date_minmax_multi_ops`        | `= (date,date)`               |
| `< (date,date)`                |                               |
| `<= (date,date)`               |                               |
| `> (date,date)`                |                               |
| `>= (date,date)`               |                               |
| `float4_bloom_ops`             | `= (float4,float4)`           |
| `float4_minmax_ops`            | `= (float4,float4)`           |
| `< (float4,float4)`            |                               |
| `> (float4,float4)`            |                               |
| `<= (float4,float4)`           |                               |
| `>= (float4,float4)`           |                               |
| `float4_minmax_multi_ops`      | `= (float4,float4)`           |
| `< (float4,float4)`            |                               |
| `> (float4,float4)`            |                               |
| `<= (float4,float4)`           |                               |
| `>= (float4,float4)`           |                               |
| `float8_bloom_ops`             | `= (float8,float8)`           |
| `float8_minmax_ops`            | `= (float8,float8)`           |
| `< (float8,float8)`            |                               |
| `<= (float8,float8)`           |                               |
| `> (float8,float8)`            |                               |
| `>= (float8,float8)`           |                               |
| `float8_minmax_multi_ops`      | `= (float8,float8)`           |
| `< (float8,float8)`            |                               |
| `<= (float8,float8)`           |                               |
| `> (float8,float8)`            |                               |
| `>= (float8,float8)`           |                               |
| `inet_inclusion_ops`           | `<< (inet,inet)`              |
| `<<= (inet,inet)`              |                               |
| `>> (inet,inet)`               |                               |
| `>>= (inet,inet)`              |                               |
| `= (inet,inet)`                |                               |
| `&& (inet,inet)`               |                               |
| `inet_bloom_ops`               | `= (inet,inet)`               |
| `inet_minmax_ops`              | `= (inet,inet)`               |
| `< (inet,inet)`                |                               |
| `<= (inet,inet)`               |                               |
| `> (inet,inet)`                |                               |
| `>= (inet,inet)`               |                               |
| `inet_minmax_multi_ops`        | `= (inet,inet)`               |
| `< (inet,inet)`                |                               |
| `<= (inet,inet)`               |                               |
| `> (inet,inet)`                |                               |
| `>= (inet,inet)`               |                               |
| `int2_bloom_ops`               | `= (int2,int2)`               |
| `int2_minmax_ops`              | `= (int2,int2)`               |
| `< (int2,int2)`                |                               |
| `> (int2,int2)`                |                               |
| `<= (int2,int2)`               |                               |
| `>= (int2,int2)`               |                               |
| `int2_minmax_multi_ops`        | `= (int2,int2)`               |
| `< (int2,int2)`                |                               |
| `> (int2,int2)`                |                               |
| `<= (int2,int2)`               |                               |
| `>= (int2,int2)`               |                               |
| `int4_bloom_ops`               | `= (int4,int4)`               |
| `int4_minmax_ops`              | `= (int4,int4)`               |
| `< (int4,int4)`                |                               |
| `> (int4,int4)`                |                               |
| `<= (int4,int4)`               |                               |
| `>= (int4,int4)`               |                               |
| `int4_minmax_multi_ops`        | `= (int4,int4)`               |
| `< (int4,int4)`                |                               |
| `> (int4,int4)`                |                               |
| `<= (int4,int4)`               |                               |
| `>= (int4,int4)`               |                               |
| `int8_bloom_ops`               | `= (bigint,bigint)`           |
| `int8_minmax_ops`              | `= (bigint,bigint)`           |
| `< (bigint,bigint)`            |                               |
| `> (bigint,bigint)`            |                               |
| `<= (bigint,bigint)`           |                               |
| `>= (bigint,bigint)`           |                               |
| `int8_minmax_multi_ops`        | `= (bigint,bigint)`           |
| `< (bigint,bigint)`            |                               |
| `> (bigint,bigint)`            |                               |
| `<= (bigint,bigint)`           |                               |
| `>= (bigint,bigint)`           |                               |
| `interval_bloom_ops`           | `= (interval,interval)`       |
| `interval_minmax_ops`          | `= (interval,interval)`       |
| `< (interval,interval)`        |                               |
| `<= (interval,interval)`       |                               |
| `> (interval,interval)`        |                               |
| `>= (interval,interval)`       |                               |
| `interval_minmax_multi_ops`    | `= (interval,interval)`       |
| `< (interval,interval)`        |                               |
| `<= (interval,interval)`       |                               |
| `> (interval,interval)`        |                               |
| `>= (interval,interval)`       |                               |
| `macaddr_bloom_ops`            | `= (macaddr,macaddr)`         |
| `macaddr_minmax_ops`           | `= (macaddr,macaddr)`         |
| `< (macaddr,macaddr)`          |                               |
| `<= (macaddr,macaddr)`         |                               |
| `> (macaddr,macaddr)`          |                               |
| `>= (macaddr,macaddr)`         |                               |
| `macaddr_minmax_multi_ops`     | `= (macaddr,macaddr)`         |
| `< (macaddr,macaddr)`          |                               |
| `<= (macaddr,macaddr)`         |                               |
| `> (macaddr,macaddr)`          |                               |
| `>= (macaddr,macaddr)`         |                               |
| `macaddr8_bloom_ops`           | `= (macaddr8,macaddr8)`       |
| `macaddr8_minmax_ops`          | `= (macaddr8,macaddr8)`       |
| `< (macaddr8,macaddr8)`        |                               |
| `<= (macaddr8,macaddr8)`       |                               |
| `> (macaddr8,macaddr8)`        |                               |
| `>= (macaddr8,macaddr8)`       |                               |
| `macaddr8_minmax_multi_ops`    | `= (macaddr8,macaddr8)`       |
| `< (macaddr8,macaddr8)`        |                               |
| `<= (macaddr8,macaddr8)`       |                               |
| `> (macaddr8,macaddr8)`        |                               |
| `>= (macaddr8,macaddr8)`       |                               |
| `name_bloom_ops`               | `= (name,name)`               |
| `name_minmax_ops`              | `= (name,name)`               |
| `< (name,name)`                |                               |
| `<= (name,name)`               |                               |
| `> (name,name)`                |                               |
| `>= (name,name)`               |                               |
| `numeric_bloom_ops`            | `= (numeric,numeric)`         |
| `numeric_minmax_ops`           | `= (numeric,numeric)`         |
| `< (numeric,numeric)`          |                               |
| `<= (numeric,numeric)`         |                               |
| `> (numeric,numeric)`          |                               |
| `>= (numeric,numeric)`         |                               |
| `numeric_minmax_multi_ops`     | `= (numeric,numeric)`         |
| `< (numeric,numeric)`          |                               |
| `<= (numeric,numeric)`         |                               |
| `> (numeric,numeric)`          |                               |
| `>= (numeric,numeric)`         |                               |
| `oid_bloom_ops`                | `= (oid,oid)`                 |
| `oid_minmax_ops`               | `= (oid,oid)`                 |
| `< (oid,oid)`                  |                               |
| `> (oid,oid)`                  |                               |
| `<= (oid,oid)`                 |                               |
| `>= (oid,oid)`                 |                               |
| `oid_minmax_multi_ops`         | `= (oid,oid)`                 |
| `< (oid,oid)`                  |                               |
| `> (oid,oid)`                  |                               |
| `<= (oid,oid)`                 |                               |
| `>= (oid,oid)`                 |                               |
| `pg_lsn_bloom_ops`             | `= (pg_lsn,pg_lsn)`           |
| `pg_lsn_minmax_ops`            | `= (pg_lsn,pg_lsn)`           |
| `< (pg_lsn,pg_lsn)`            |                               |
| `> (pg_lsn,pg_lsn)`            |                               |
| `<= (pg_lsn,pg_lsn)`           |                               |
| `>= (pg_lsn,pg_lsn)`           |                               |
| `pg_lsn_minmax_multi_ops`      | `= (pg_lsn,pg_lsn)`           |
| `< (pg_lsn,pg_lsn)`            |                               |
| `> (pg_lsn,pg_lsn)`            |                               |
| `<= (pg_lsn,pg_lsn)`           |                               |
| `>= (pg_lsn,pg_lsn)`           |                               |
| `range_inclusion_ops`          | `= (anyrange,anyrange)`       |
| `< (anyrange,anyrange)`        |                               |
| `<= (anyrange,anyrange)`       |                               |
| `>= (anyrange,anyrange)`       |                               |
| `> (anyrange,anyrange)`        |                               |
| `&& (anyrange,anyrange)`       |                               |
| `@> (anyrange,anyelement)`     |                               |
| `@> (anyrange,anyrange)`       |                               |
| `<@ (anyrange,anyrange)`       |                               |
| `<< (anyrange,anyrange)`       |                               |
| `>> (anyrange,anyrange)`       |                               |
| `&< (anyrange,anyrange)`       |                               |
| `&> (anyrange,anyrange)`       |                               |
| `-\|- (anyrange,anyrange)`     |                               |
| `text_bloom_ops`               | `= (text,text)`               |
| `text_minmax_ops`              | `= (text,text)`               |
| `< (text,text)`                |                               |
| `<= (text,text)`               |                               |
| `> (text,text)`                |                               |
| `>= (text,text)`               |                               |
| `tid_bloom_ops`                | `= (tid,tid)`                 |
| `tid_minmax_ops`               | `= (tid,tid)`                 |
| `< (tid,tid)`                  |                               |
| `> (tid,tid)`                  |                               |
| `<= (tid,tid)`                 |                               |
| `>= (tid,tid)`                 |                               |
| `tid_minmax_multi_ops`         | `= (tid,tid)`                 |
| `< (tid,tid)`                  |                               |
| `> (tid,tid)`                  |                               |
| `<= (tid,tid)`                 |                               |
| `>= (tid,tid)`                 |                               |
| `timestamp_bloom_ops`          | `= (timestamp,timestamp)`     |
| `timestamp_minmax_ops`         | `= (timestamp,timestamp)`     |
| `< (timestamp,timestamp)`      |                               |
| `<= (timestamp,timestamp)`     |                               |
| `> (timestamp,timestamp)`      |                               |
| `>= (timestamp,timestamp)`     |                               |
| `timestamp_minmax_multi_ops`   | `= (timestamp,timestamp)`     |
| `< (timestamp,timestamp)`      |                               |
| `<= (timestamp,timestamp)`     |                               |
| `> (timestamp,timestamp)`      |                               |
| `>= (timestamp,timestamp)`     |                               |
| `timestamptz_bloom_ops`        | `= (timestamptz,timestamptz)` |
| `timestamptz_minmax_ops`       | `= (timestamptz,timestamptz)` |
| `< (timestamptz,timestamptz)`  |                               |
| `<= (timestamptz,timestamptz)` |                               |
| `> (timestamptz,timestamptz)`  |                               |
| `>= (timestamptz,timestamptz)` |                               |
| `timestamptz_minmax_multi_ops` | `= (timestamptz,timestamptz)` |
| `< (timestamptz,timestamptz)`  |                               |
| `<= (timestamptz,timestamptz)` |                               |
| `> (timestamptz,timestamptz)`  |                               |
| `>= (timestamptz,timestamptz)` |                               |
| `time_bloom_ops`               | `= (time,time)`               |
| `time_minmax_ops`              | `= (time,time)`               |
| `< (time,time)`                |                               |
| `<= (time,time)`               |                               |
| `> (time,time)`                |                               |
| `>= (time,time)`               |                               |
| `time_minmax_multi_ops`        | `= (time,time)`               |
| `< (time,time)`                |                               |
| `<= (time,time)`               |                               |
| `> (time,time)`                |                               |
| `>= (time,time)`               |                               |
| `timetz_bloom_ops`             | `= (timetz,timetz)`           |
| `timetz_minmax_ops`            | `= (timetz,timetz)`           |
| `< (timetz,timetz)`            |                               |
| `<= (timetz,timetz)`           |                               |
| `> (timetz,timetz)`            |                               |
| `>= (timetz,timetz)`           |                               |
| `timetz_minmax_multi_ops`      | `= (timetz,timetz)`           |
| `< (timetz,timetz)`            |                               |
| `<= (timetz,timetz)`           |                               |
| `> (timetz,timetz)`            |                               |
| `>= (timetz,timetz)`           |                               |
| `uuid_bloom_ops`               | `= (uuid,uuid)`               |
| `uuid_minmax_ops`              | `= (uuid,uuid)`               |
| `< (uuid,uuid)`                |                               |
| `> (uuid,uuid)`                |                               |
| `<= (uuid,uuid)`               |                               |
| `>= (uuid,uuid)`               |                               |
| `uuid_minmax_multi_ops`        | `= (uuid,uuid)`               |
| `< (uuid,uuid)`                |                               |
| `> (uuid,uuid)`                |                               |
| `<= (uuid,uuid)`               |                               |
| `>= (uuid,uuid)`               |                               |
| `varbit_minmax_ops`            | `= (varbit,varbit)`           |
| `< (varbit,varbit)`            |                               |
| `> (varbit,varbit)`            |                               |
| `<= (varbit,varbit)`           |                               |
| `>= (varbit,varbit)`           |                               |

[#id](#BRIN-BUILTIN-OPCLASSES--PARAMETERS)

### 71.2.1. Operator Class Parameters [#](#BRIN-BUILTIN-OPCLASSES--PARAMETERS)

Some of the built-in operator classes allow specifying parameters affecting behavior of the operator class. Each operator class has its own set of allowed parameters. Only the `bloom` and `minmax-multi` operator classes allow specifying parameters:

bloom operator classes accept these parameters:

- `n_distinct_per_range`

  Defines the estimated number of distinct non-null values in the block range, used by BRIN bloom indexes for sizing of the Bloom filter. It behaves similarly to `n_distinct` option for [ALTER TABLE](sql-altertable). When set to a positive value, each block range is assumed to contain this number of distinct non-null values. When set to a negative value, which must be greater than or equal to -1, the number of distinct non-null values is assumed to grow linearly with the maximum possible number of tuples in the block range (about 290 rows per block). The default value is `-0.1`, and the minimum number of distinct non-null values is `16`.

- `false_positive_rate`

  Defines the desired false positive rate used by BRIN bloom indexes for sizing of the Bloom filter. The values must be between 0.0001 and 0.25. The default value is 0.01, which is 1% false positive rate.

minmax-multi operator classes accept these parameters:

- `values_per_range`

  Defines the maximum number of values stored by BRIN minmax indexes to summarize a block range. Each value may represent either a point, or a boundary of an interval. Values must be between 8 and 256, and the default value is 32.
