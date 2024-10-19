---
title: 'How to List All Triggers in PostgreSQL'
redirectFrom: 
            - /docs/postgresql/postgresql-triggers/how-to-list-all-triggers-in-postgresql/
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to list all triggers in the current database or triggers associated with a specific table in PostgreSQL.

## Listing all triggers using SQL statement

To list all [triggers](/docs/postgresql/postgresql-triggers) along with their associated tables in the current database, you can use the `information_schema.triggers` system view.

For example, the following statement retrieves the triggers with their associated tables in the current database from the `information_schema.triggers` view:

```
SELECT
  event_object_table AS table_name,
  trigger_name
FROM
  information_schema.triggers
GROUP BY
  table_name,
  trigger_name
ORDER BY
  table_name,
  trigger_name;
```

Sample output:

```
table_name |         trigger_name
------------+-------------------------------
 employees  | after_delete_employee_trigger
 members    | after_insert_member_trigger
 products   | before_delete_product_trigger
 salaries   | after_update_salary_trigger
(4 rows)
```

If you want to list all triggers associated with a specific table, you can filter the `event_object_table` column by specifying the table name in the `WHERE` clause.

For example, the following query lists all triggers associated with the `employees` table in the current database:

```
SELECT
  event_object_table AS table_name,
  trigger_name
FROM
  information_schema.triggers
WHERE
  event_object_table = 'employees'
GROUP BY
  table_name,
  trigger_name
ORDER BY
  table_name,
  trigger_name;
```

Output:

```
 table_name |         trigger_name
------------+-------------------------------
 employees  | after_delete_employee_trigger
(1 row)
```

To make it more convenient, you can [create a user-defined function](/docs/postgresql/postgresql-plpgsql/postgresql-create-function) that wraps the above query.

For example, the following creates a function named `get_triggers()` that returns all triggers with their associated tables in the current database:

```
create or replace function get_triggers()
returns table (
 table_name text,
 trigger_name text
)
language plpgsql
as
$$
begin
 return query select
   trg.event_object_table::text AS table_name,
   trg.trigger_name::text
 from
   information_schema.triggers trg
 group by
   table_name,
   trg.trigger_name
 order by
   table_name,
   trg.trigger_name;
end;
$$;
```

The following statement shows how to call the `get_triggers()` function:

```
SELECT * FROM get_triggers();
```

The following creates a function `get_triggers()` that accepts a table name and returns all the triggers of the table:

```

create or replace function get_triggers(
 p_table_name text
)
returns table (
 table_name text,
 trigger_name text
)
language plpgsql
as
$$
begin
 return query select
   event_object_table::text AS table_name,
   trg.trigger_name::text
 from
   information_schema.triggers trg
 where
    event_object_table = p_table_name
 group by
   table_name,
   trg.trigger_name
 order by
   table_name,
   trg.trigger_name;
end;
$$;
```

The following statement uses the `get_triggers(text)` function to retrieve all triggers of the `employees` table:

```
SELECT * FROM get_triggers('employees');
```

## Listing all triggers using the pg_trigger view

`pg_trigger` is a system view that provides information about triggers defined in the database. Here are some important columns:

| Column         | Description                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `tgname`       | The name of the trigger.                                                                                     |
| `tgrelid`      | The object ID of the table or view to which the trigger belongs.                                             |
| `tgfoid`       | The object ID of the function is called when the trigger fires.                                              |
| `tgtype`       | The type of the trigger, such as `BEFORE`, `AFTER`, or `INSTEAD OF`.                                         |
| `tgenabled`    | The status of the trigger, either enabled or disabled.                                                       |
| `tgisinternal` | The boolean indicator indicates whether the trigger is a system-generated trigger or a user-defined trigger. |

For example, the following statement retrieves all user-defined triggers of the `employees` table from the `pg_trigger` view:

```
SELECT
  tgname AS trigger_name
FROM
  pg_trigger
WHERE
  tgrelid = 'employees' :: regclass
  AND tgisinternal = false
ORDER BY
  trigger_name;
```

Output:

```
         trigger_name
-------------------------------
 after_delete_employee_trigger
(1 row)
```

## Listing all triggers using psql

First, open the Command Prompt on Windows or Terminal on Unix-like systems and connect to the PostgreSQL server using psql:

```
psql -U postgres
```

Second, use the `\dS` command with a table name to list all the triggers associated with the table:

```
\dS table_name;
```

For example, the following command displays the `employees` table with its triggers:

```
\dS employees
```

Output:

```
                                    Table "public.employees"
 Column |          Type          | Collation | Nullable |                Default
--------+------------------------+-----------+----------+---------------------------------------
 id     | integer                |           | not null | nextval('employees_id_seq'::regclass)
 name   | character varying(100) |           | not null |
 salary | numeric(10,2)          |           | not null |
Indexes:
    "employees_pkey" PRIMARY KEY, btree (id)
Triggers:
    after_delete_employee_trigger AFTER DELETE ON employees FOR EACH ROW EXECUTE FUNCTION archive_deleted_employee()
```

The last part of the output shows the triggers of the `employees` table.

Note that psql does not provide a command to list all triggers in the current database.

## Summary

- List all triggers in a database or a specific table using the `information_schema.triggers` or `pg_trigger` views.
- Use psql command `\dS table_name` to display a table along with its associated triggers.
