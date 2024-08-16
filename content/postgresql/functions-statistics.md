[#id](#FUNCTIONS-STATISTICS)

## 9.30. Statistics Information Functions [#](#FUNCTIONS-STATISTICS)

- [9.30.1. Inspecting MCV Lists](functions-statistics#FUNCTIONS-STATISTICS-MCV)

PostgreSQL provides a function to inspect complex statistics defined using the `CREATE STATISTICS` command.

[#id](#FUNCTIONS-STATISTICS-MCV)

### 9.30.1. Inspecting MCV Lists [#](#FUNCTIONS-STATISTICS-MCV)

```

pg_mcv_list_items ( pg_mcv_list ) → setof record
```

`pg_mcv_list_items` returns a set of records describing all items stored in a multi-column MCV list. It returns the following columns:

| Name             | Type               | Description                       |
| ---------------- | ------------------ | --------------------------------- |
| `index`          | `integer`          | index of the item in the MCV list |
| `values`         | `text[]`           | values stored in the MCV item     |
| `nulls`          | `boolean[]`        | flags identifying `NULL` values   |
| `frequency`      | `double precision` | frequency of this MCV item        |
| `base_frequency` | `double precision` | base frequency of this MCV item   |

The `pg_mcv_list_items` function can be used like this:

```

SELECT m.* FROM pg_statistic_ext join pg_statistic_ext_data on (oid = stxoid),
                pg_mcv_list_items(stxdmcv) m WHERE stxname = 'stts';
```

Values of the `pg_mcv_list` type can be obtained only from the `pg_statistic_ext_data`.`stxdmcv` column.
