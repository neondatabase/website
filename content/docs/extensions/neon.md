---
title: The neon extension
enableTableOfContents: true
updatedOn: '2024-02-08T15:20:54.277Z'
---

The `neon` extension provides functions and views designed to gather Neon-specific metrics.

## The `neon_stat_file_cache` view

To speed up data retrieval, Neon computes include a dedicated Local File Cache (LFC) that extends Postgres shared buffers to approximately 50% of your compute's RAM. The `neon_stat_file_cache` view gives you insights into how effectively the cache is being used through the following metrics:

- `file_cache_misses`: The number of times requested data was not found in the Local File Cache. A higher number of cache misses can indicate lower performance, where data is retrieved from the slower storage layer if it's also not found in the shared buffer.```
- `file_cache_hits`: The number of times requested data was successfully found in the Local File Cache. A higher number indicates better performance where data is found in the cache versus the slower storage layer.
- `file_cache_used`: The number of times the local file cache was used.
- `file_cache_writes`: The number of writes to the local file cache. A higher number means more active data caching, which is important for keeping the cache up-to-date with recent changes.
- `file_cache_hit_ratio`: Measures the effectiveness of the Local File Cache by comparing the number of hits to the total access attempts (hits plus misses) as calculated using the following formula:```

    ```
    file_cache_hit_ratio = (file_cache_hits / (file_cache_hits + file_cache_misses)) * 100
    ```

    In general, you want a high cache hit ratio. It means more of your requests are served directly from memory rather than the slower storage layer. For OLTP workloads, you should aim for a cache hit ratio of 99% or better. However, the ideal cache hit ratio can depend on your specific workload and data access patterns. In some cases, a slightly lower ratio might still be acceptable, especially if the workload involves a lot of sequential scanning of large tables where caching might be less effective.

### Using the `neon_stat_file_cache` view

To use the `neon_stat_file_cache` view, install the `neon` extension:

```sql
CREATE EXTENSION neon;
```

Issue the following query to view local file cache usage data for your compute instance:

```sql
SELECT * FROM neon.neon_stat_file_cache;
 file_cache_misses | file_cache_hits | file_cache_used | file_cache_writes | file_cache_hit_ratio  
-------------------+-----------------+-----------------+-------------------+----------------------
           2133643 |       108999742 |             607 |          10767410 |                98.08
(1 row)
```

<Admonition type="note">
Statistics represent the lifetime of your compute, from the last time the compute started until the time you ran the query. Statistics are lost when your compute stops and gathered again from scratch when your compute restarts. Also, keep in mind that the statistics are for the entire compute, not specific databases or tables. Your compute runs an instance of Postgres, which may contain multiple databases and tables.
</Admonition>

For related information, see [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute).

## Views for Neon internal use

The `neon` extension is installed to a system-owned `postgres` database in each Neon project by default. 

There are two views owned by a Neon system role (`cloud_admin`) as shown below, which are used to collect local file cache statistics. The metrics are used by the Neon team for the purpose of enhancing the Neon service. The views are not user-visible or accessible.

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
