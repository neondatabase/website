---
title: The neon extension
enableTableOfContents: true
updatedOn: '2024-02-08T15:20:54.277Z'
---

The `neon` extension provides functions and views designed to gather Neon-specific metrics.

## The `neon_stat_file_cache` view

Neon computes have a Local File Cache (LFC), which is a layer of caching that stores frequently accessed data in the local memory of the Neon compute instance. Like Postgres shared buffers, the LFC helps to reduce latency and improve query performance by minimizing the need to fetch data from the storage layer repeatedly. The LFC acts as an add-on or extension of Postgres shared buffers. In Neon computes, `shared_buffers` is always set to 128 MB, regardless of compute size. The LFC extends the cache memory to approximately 50% of your compute's RAM. To view the LFC size for each Neon compute size, see [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute).

When data is requested, Postgres checks shared buffers first. If data is not found in the shared buffers, it checks the LFC. If the data is not found in the LFC, it is read from Neon storage. Shared buffers and the LFC both cache the most frequently or most recently accessed data, but they may not cache the same data exactly due to different cache eviction patterns. The LFC is also much larger than shared buffers, so it stores significantly more data.

The `neon_stat_file_cache` view provides insights into how effectively the LFC is being used through the following metrics:

- `file_cache_misses`: The number of times the requested page block is not found in Postgres shared buffers or the LFC. In this case, the page block is retrieved from Neon storage (the Pageserver).
- `file_cache_hits`: The number of times the requested page block was not found in Postgres shared buffers but was found in the LFC.
- `file_cache_used`: The number of times the LFC was used.
- `file_cache_writes`: The number of writes to the LFC. A write occurs when a requested page block is not found in Postgres shared buffers or the LFC. In this case, the data is retrieved from Neon storage (the Pageserver) and then written to the LFC.
- `file_cache_hit_ratio`:  The percentage of database requests that are served from the LFC rather than Neon storage. It is a measure of cache efficiency, indicating how often requested data is found in the cache. A higher cache hit ratio suggests better performance, as accessing data from memory is faster than accessing data from storage. The ratio is calculated using the following formula:

    ```
    file_cache_hit_ratio = (file_cache_hits / (file_cache_hits + file_cache_misses)) * 100
    ```

    For OLTP workloads, you should aim for a cache hit ratio of 99% or better. However, the ideal cache hit ratio can depend on your specific workload and data access patterns. In some cases, a slightly lower ratio might still be acceptable, especially if the workload involves a lot of sequential scanning of large tables where caching might be less effective.

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

When the `neon` extension is installed, you can slo run `EXPLAIN ANALYZE` with the `FILECACHE` option to view LFC cache hit and miss data:

```sql
EXPLAIN (ANALYZE,BUFFERS,PREFETCH,FILECACHE) select count(*) from pgbench_accounts; // [!code word:FILECACHE]

 Finalize Aggregate  (cost=214486.94..214486.95 rows=1 width=8) (actual time=5195.378..5196.034 rows=1 loops=1)
   Buffers: shared hit=178875 read=143691 dirtied=128597 written=127346
   Prefetch: hits=0 misses=1865 expired=0 duplicates=0
   File cache: hits=141826 misses=1865('Highlighted')
   ->  Gather  (cost=214486.73..214486.94 rows=2 width=8) (actual time=5195.366..5196.025 rows=3 loops=1)
         Workers Planned: 2
         Workers Launched: 2
         Buffers: shared hit=178875 read=143691 dirtied=128597 written=127346
         Prefetch: hits=0 misses=1865 expired=0 duplicates=0
         File cache: hits=141826 misses=1865('Highlighted')
         ->  Partial Aggregate  (cost=213486.73..213486.74 rows=1 width=8) (actual time=5187.670..5187.670 rows=1 loops=3)
               Buffers: shared hit=178875 read=143691 dirtied=128597 written=127346
               Prefetch: hits=0 misses=1865 expired=0 duplicates=0
               File cache: hits=141826 misses=1865('Highlighted')
               ->  Parallel Index Only Scan using pgbench_accounts_pkey on pgbench_accounts  (cost=0.43..203003.02 rows=4193481 width=0) (actual time=0.574..4928.995 rows=3333333 loops=3)
                     Heap Fetches: 3675286
                     Buffers: shared hit=178875 read=143691 dirtied=128597 written=127346
                     Prefetch: hits=0 misses=1865 expired=0 duplicates=0
                     File cache: hits=141826 misses=1865('Highlighted')
```

<Admonition type="note">
LFC statistics are for the lifetime of your compute, from the last time the compute started until the time you ran the query. Statistics are lost when your compute stops and gathered again from scratch when your compute restarts. Also, keep in mind that the statistics are for the entire compute, not specific databases or tables. Your compute runs an instance of Postgres, which may contain multiple databases and tables.
</Admonition>

For related information, see [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute).

## Views for Neon internal use

The `neon` extension is installed by default to a system-owned `postgres` database in each Neon project by default. 

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
