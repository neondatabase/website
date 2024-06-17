[#id](#VIEW-PG-SHMEM-ALLOCATIONS)

## 54.26. `pg_shmem_allocations` [#](#VIEW-PG-SHMEM-ALLOCATIONS)

The `pg_shmem_allocations` view shows allocations made from the server's main shared memory segment. This includes both memory allocated by PostgreSQL itself and memory allocated by extensions using the mechanisms detailed in [Section 38.10.10](xfunc-c#XFUNC-SHARED-ADDIN).

Note that this view does not include memory allocated using the dynamic shared memory infrastructure.

[#id](#id-1.10.5.30.5)

**Table 54.26. `pg_shmem_allocations` Columns**

| Column TypeDescription                                                                                                                                                                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` `text`The name of the shared memory allocation. NULL for unused memory and `<anonymous>` for anonymous allocations.                                                                                                                                                                                  |
| `off` `int8`The offset at which the allocation starts. NULL for anonymous allocations, since details related to them are not known.                                                                                                                                                                         |
| `size` `int8`Size of the allocation in bytes                                                                                                                                                                                                                                                                |
| `allocated_size` `int8`Size of the allocation in bytes including padding. For anonymous allocations, no information about padding is available, so the `size` and `allocated_size` columns will always be equal. Padding is not meaningful for free memory, so the columns will be equal in that case also. |

Anonymous allocations are allocations that have been made with `ShmemAlloc()` directly, rather than via `ShmemInitStruct()` or `ShmemInitHash()`.

By default, the `pg_shmem_allocations` view can be read only by superusers or roles with privileges of the `pg_read_all_stats` role.
