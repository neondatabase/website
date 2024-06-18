[#id](#CATALOG-PG-CONSTRAINT)

## 53.13. `pg_constraint` [#](#CATALOG-PG-CONSTRAINT)

The catalog `pg_constraint` stores check, primary key, unique, foreign key, and exclusion constraints on tables. (Column constraints are not treated specially. Every column constraint is equivalent to some table constraint.) Not-null constraints are represented in the [`pg_attribute`](catalog-pg-attribute) catalog, not here.

User-defined constraint triggers (created with [`CREATE CONSTRAINT TRIGGER`](sql-createtrigger)) also give rise to an entry in this table.

Check constraints on domains are stored here, too.

[#id](#id-1.10.4.15.6)

**Table 53.13. `pg_constraint` Columns**

| Column TypeDescription                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oid` `oid`Row identifier                                                                                                                                                                                                                           |
| `conname` `name`Constraint name (not necessarily unique!)                                                                                                                                                                                           |
| `connamespace` `oid` (references [`pg_namespace`](catalog-pg-namespace).`oid`)The OID of the namespace that contains this constraint                                                                                                                |
| `contype` `char``c` = check constraint, `f` = foreign key constraint, `p` = primary key constraint, `u` = unique constraint, `t` = constraint trigger, `x` = exclusion constraint                                                                   |
| `condeferrable` `bool`Is the constraint deferrable?                                                                                                                                                                                                 |
| `condeferred` `bool`Is the constraint deferred by default?                                                                                                                                                                                          |
| `convalidated` `bool`Has the constraint been validated? Currently, can be false only for foreign keys and CHECK constraints                                                                                                                         |
| `conrelid` `oid` (references [`pg_class`](catalog-pg-class).`oid`)The table this constraint is on; zero if not a table constraint                                                                                                                   |
| `contypid` `oid` (references [`pg_type`](catalog-pg-type).`oid`)The domain this constraint is on; zero if not a domain constraint                                                                                                                   |
| `conindid` `oid` (references [`pg_class`](catalog-pg-class).`oid`)The index supporting this constraint, if it's a unique, primary key, foreign key, or exclusion constraint; else zero                                                              |
| `conparentid` `oid` (references [`pg_constraint`](catalog-pg-constraint).`oid`)The corresponding constraint of the parent partitioned table, if this is a constraint on a partition; else zero                                                      |
| `confrelid` `oid` (references [`pg_class`](catalog-pg-class).`oid`)If a foreign key, the referenced table; else zero                                                                                                                                |
| `confupdtype` `char`Foreign key update action code: `a` = no action, `r` = restrict, `c` = cascade, `n` = set null, `d` = set default                                                                                                               |
| `confdeltype` `char`Foreign key deletion action code: `a` = no action, `r` = restrict, `c` = cascade, `n` = set null, `d` = set default                                                                                                             |
| `confmatchtype` `char`Foreign key match type: `f` = full, `p` = partial, `s` = simple                                                                                                                                                               |
| `conislocal` `bool`This constraint is defined locally for the relation. Note that a constraint can be locally defined and inherited simultaneously.                                                                                                 |
| `coninhcount` `int2`The number of direct inheritance ancestors this constraint has. A constraint with a nonzero number of ancestors cannot be dropped nor renamed.                                                                                  |
| `connoinherit` `bool`This constraint is defined locally for the relation. It is a non-inheritable constraint.                                                                                                                                       |
| `conkey` `int2[]` (references [`pg_attribute`](catalog-pg-attribute).`attnum`)If a table constraint (including foreign keys, but not constraint triggers), list of the constrained columns                                                          |
| `confkey` `int2[]` (references [`pg_attribute`](catalog-pg-attribute).`attnum`)If a foreign key, list of the referenced columns                                                                                                                     |
| `conpfeqop` `oid[]` (references [`pg_operator`](catalog-pg-operator).`oid`)If a foreign key, list of the equality operators for PK = FK comparisons                                                                                                 |
| `conppeqop` `oid[]` (references [`pg_operator`](catalog-pg-operator).`oid`)If a foreign key, list of the equality operators for PK = PK comparisons                                                                                                 |
| `conffeqop` `oid[]` (references [`pg_operator`](catalog-pg-operator).`oid`)If a foreign key, list of the equality operators for FK = FK comparisons                                                                                                 |
| `confdelsetcols` `int2[]` (references [`pg_attribute`](catalog-pg-attribute).`attnum`)If a foreign key with a `SET NULL` or `SET DEFAULT` delete action, the columns that will be updated. If null, all of the referencing columns will be updated. |
| `conexclop` `oid[]` (references [`pg_operator`](catalog-pg-operator).`oid`)If an exclusion constraint, list of the per-column exclusion operators                                                                                                   |
| `conbin` `pg_node_tree`If a check constraint, an internal representation of the expression. (It's recommended to use `pg_get_constraintdef()` to extract the definition of a check constraint.)                                                     |

In the case of an exclusion constraint, `conkey` is only useful for constraint elements that are simple column references. For other cases, a zero appears in `conkey` and the associated index must be consulted to discover the expression that is constrained. (`conkey` thus has the same contents as [`pg_index`](catalog-pg-index).`indkey` for the index.)

### Note

`pg_class.relchecks` needs to agree with the number of check-constraint entries found in this table for each relation.
