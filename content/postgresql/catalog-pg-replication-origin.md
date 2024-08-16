[#id](#CATALOG-PG-REPLICATION-ORIGIN)

## 53.44. `pg_replication_origin` [#](#CATALOG-PG-REPLICATION-ORIGIN)

The `pg_replication_origin` catalog contains all replication origins created. For more on replication origins see [Chapter 50](replication-origins).

Unlike most system catalogs, `pg_replication_origin` is shared across all databases of a cluster: there is only one copy of `pg_replication_origin` per cluster, not one per database.

[#id](#id-1.10.4.46.5)

**Table 53.44. `pg_replication_origin` Columns**

| Column TypeDescription                                                                                      |
| ----------------------------------------------------------------------------------------------------------- |
| `roident` `oid`A unique, cluster-wide identifier for the replication origin. Should never leave the system. |
| `roname` `text`The external, user defined, name of a replication origin.                                    |
