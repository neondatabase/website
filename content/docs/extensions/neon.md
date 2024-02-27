---
title: The neon extension
enableTableOfContents: true
updatedOn: '2024-02-08T15:20:54.277Z'
---

The `neon` extension includes functions and views designed to gather Neon-specific metrics. 

## 


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
