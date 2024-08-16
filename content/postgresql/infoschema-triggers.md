[#id](#INFOSCHEMA-TRIGGERS)

## 37.57. `triggers` [#](#INFOSCHEMA-TRIGGERS)

The view `triggers` contains all triggers defined in the current database on tables and views that the current user owns or has some privilege other than `SELECT` on.

[#id](#id-1.7.6.61.3)

**Table 37.55. `triggers` Columns**

| Column TypeDescription                                                                                                                                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trigger_catalog` `sql_identifier`Name of the database that contains the trigger (always the current database)                                                                                                                                |
| `trigger_schema` `sql_identifier`Name of the schema that contains the trigger                                                                                                                                                                 |
| `trigger_name` `sql_identifier`Name of the trigger                                                                                                                                                                                            |
| `event_manipulation` `character_data`Event that fires the trigger (`INSERT`, `UPDATE`, or `DELETE`)                                                                                                                                           |
| `event_object_catalog` `sql_identifier`Name of the database that contains the table that the trigger is defined on (always the current database)                                                                                              |
| `event_object_schema` `sql_identifier`Name of the schema that contains the table that the trigger is defined on                                                                                                                               |
| `event_object_table` `sql_identifier`Name of the table that the trigger is defined on                                                                                                                                                         |
| `action_order` `cardinal_number`Firing order among triggers on the same table having the same `event_manipulation`, `action_timing`, and `action_orientation`. In PostgreSQL, triggers are fired in name order, so this column reflects that. |
| `action_condition` `character_data``WHEN` condition of the trigger, null if none (also null if the table is not owned by a currently enabled role)                                                                                            |
| `action_statement` `character_data`Statement that is executed by the trigger (currently always `EXECUTE FUNCTION function(...)`)                                                                                                              |
| `action_orientation` `character_data`Identifies whether the trigger fires once for each processed row or once for each statement (`ROW` or `STATEMENT`)                                                                                       |
| `action_timing` `character_data`Time at which the trigger fires (`BEFORE`, `AFTER`, or `INSTEAD OF`)                                                                                                                                          |
| `action_reference_old_table` `sql_identifier`Name of the “old” transition table, or null if none                                                                                                                                              |
| `action_reference_new_table` `sql_identifier`Name of the “new” transition table, or null if none                                                                                                                                              |
| `action_reference_old_row` `sql_identifier`Applies to a feature not available in PostgreSQL                                                                                                                                                   |
| `action_reference_new_row` `sql_identifier`Applies to a feature not available in PostgreSQL                                                                                                                                                   |
| `created` `time_stamp`Applies to a feature not available in PostgreSQL                                                                                                                                                                        |

Triggers in PostgreSQL have two incompatibilities with the SQL standard that affect the representation in the information schema. First, trigger names are local to each table in PostgreSQL, rather than being independent schema objects. Therefore there can be duplicate trigger names defined in one schema, so long as they belong to different tables. (`trigger_catalog` and `trigger_schema` are really the values pertaining to the table that the trigger is defined on.) Second, triggers can be defined to fire on multiple events in PostgreSQL (e.g., `ON INSERT OR UPDATE`), whereas the SQL standard only allows one. If a trigger is defined to fire on multiple events, it is represented as multiple rows in the information schema, one for each type of event. As a consequence of these two issues, the primary key of the view `triggers` is really `(trigger_catalog, trigger_schema, event_object_table, trigger_name, event_manipulation)` instead of `(trigger_catalog, trigger_schema, trigger_name)`, which is what the SQL standard specifies. Nonetheless, if you define your triggers in a manner that conforms with the SQL standard (trigger names unique in the schema and only one event type per trigger), this will not affect you.

### Note

Prior to PostgreSQL 9.1, this view's columns `action_timing`, `action_reference_old_table`, `action_reference_new_table`, `action_reference_old_row`, and `action_reference_new_row` were named `condition_timing`, `condition_reference_old_table`, `condition_reference_new_table`, `condition_reference_old_row`, and `condition_reference_new_row` respectively. That was how they were named in the SQL:1999 standard. The new naming conforms to SQL:2003 and later.
