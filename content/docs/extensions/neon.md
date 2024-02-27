---
title: The neon extension
enableTableOfContents: true
updatedOn: '2024-02-08T15:20:54.277Z'
---

The `neon` extension includes functions and views designed to gather Neon-specific metrics. Currently, the `neon` extension includes a single user-accessible view showing cache statistics  

## The neon_stat_file_cache view

Neon computes use a local file cache to extend the amount of memory allocated to shared buffers to 50% of your compute's RAM. 

The following example shows how to use the view:

This view can be used by an end user as follows:

```sql
CREATE EXTENSION neon;
```

The output looks like the following:

```sql
SELECT * FROM neon.neon_stat_file_cache;
 file_cache_misses | file_cache_hits | file_cache_used | file_cache_writes | file_cache_hit_ratio  
-------------------+-----------------+-----------------+-------------------+----------------------
           2133643 |       108999742 |             607 |          10767410 |                98.08
(1 row)
```

## The neon_stat_file_cache view

The `neon_stat_file_cache` view 



## Views for Neon internal use

Neon also installs the `neon` extension to a `postgres` database in each Neon project by default. 

There are two views owned by a Neon system role (`cloud_admin`) as shown below, which are used to collect local file cache statistics. The metrics are intended for use by the Neon team for the purpose of enhancing our service. The views are currently not user-accessible.

```bash shouldWrap
postgres=> \dv neon.*
            List of relations
Schema |      Name      | Type |    Owner    
--------+----------------+------+-------------
neon   | local_cache    | view | cloud_admin
neon   | neon_lfc_stats | view | cloud_admin
(2 rows)
```

<NeedHelp/>
