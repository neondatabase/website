---
title: The neon extension
enableTableOfContents: true
updatedOn: '2024-02-08T15:20:54.277Z'
---

The `neon` extension provides functions and views designed to gather Neon-specific metrics. Currently, the `neon` extension includes a single user-accessible view that shows local file cache statistics.  

## The neon_stat_file_cache view

Neon computes use a local file cache to extend Postgres shared buffers memory to approximately 50% of your compute's RAM. The `neon_stat_file_cache` view provides information about local file cache usage. The view includes the following columns:

- `file_cache_misses`: The number of times requested data was not found in the local file cache.
- `file_cache_hits`: The number of times requested data was found in the local file cache.
- `file_cache_used`: The number of times the local file cache was used.
- `file_cache_writes`: The number of writes to the local file cache.
- `file_cache_hit_ratio`: The cache hit ratio for the local file cache. The file cache hit ratio is calculated according to the following formula:


\[ \text{File Cache Hit Ratio} = \left( \frac{\text{File Cache Hits}}{\text{File Cache Hits} + \text{File Cache Misses}} \right) \times 100 \]

The cache hit ratio is useful for determining the percentage of requests served from memory rather than disk. For better query performance, frequently accessed data should reside in memory. Generally, you should aim for a cache hit ratio of 99% or better.

To use the `neon_stat_file_cache` view, install the `neon` extension:

```sql
CREATE EXTENSION neon;
```

Issue the following query to view the local file cache usage data:

```sql
SELECT * FROM neon.neon_stat_file_cache;
 file_cache_misses | file_cache_hits | file_cache_used | file_cache_writes | file_cache_hit_ratio  
-------------------+-----------------+-----------------+-------------------+----------------------
           2133643 |       108999742 |             607 |          10767410 |                98.08
(1 row)
```

## Views for Neon internal use

The `neon` extension is installed to a system-owned `postgres` database in each Neon project by default. 

There are two views owned by a Neon system role (`cloud_admin`) as shown below, which are used to collect local file cache statistics. The metrics are used by the Neon team for the purpose of enhancing the Neon service. The views are currently not user-accessible.

```bash
postgres=> \dv neon.*
            List of relations
Schema |      Name      | Type |    Owner    
--------+----------------+------+-------------
neon   | local_cache    | view | cloud_admin
neon   | neon_lfc_stats | view | cloud_admin
(2 rows)
```

<NeedHelp/>
