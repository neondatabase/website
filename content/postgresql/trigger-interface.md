[#id](#TRIGGER-INTERFACE)

## 39.3. Writing Trigger Functions in C [#](#TRIGGER-INTERFACE)

This section describes the low-level details of the interface to a trigger function. This information is only needed when writing trigger functions in C. If you are using a higher-level language then these details are handled for you. In most cases you should consider using a procedural language before writing your triggers in C. The documentation of each procedural language explains how to write a trigger in that language.

Trigger functions must use the “version 1” function manager interface.

When a function is called by the trigger manager, it is not passed any normal arguments, but it is passed a “context” pointer pointing to a `TriggerData` structure. C functions can check whether they were called from the trigger manager or not by executing the macro:

```
CALLED_AS_TRIGGER(fcinfo)
```

which expands to:

```
((fcinfo)->context != NULL && IsA((fcinfo)->context, TriggerData))
```

If this returns true, then it is safe to cast `fcinfo->context` to type `TriggerData *` and make use of the pointed-to `TriggerData` structure. The function must _not_ alter the `TriggerData` structure or any of the data it points to.

`struct TriggerData` is defined in `commands/trigger.h`:

```
typedef struct TriggerData
{
    NodeTag          type;
    TriggerEvent     tg_event;
    Relation         tg_relation;
    HeapTuple        tg_trigtuple;
    HeapTuple        tg_newtuple;
    Trigger         *tg_trigger;
    TupleTableSlot  *tg_trigslot;
    TupleTableSlot  *tg_newslot;
    Tuplestorestate *tg_oldtable;
    Tuplestorestate *tg_newtable;
    const Bitmapset *tg_updatedcols;
} TriggerData;
```

where the members are defined as follows:

- `type`

  Always `T_TriggerData`.

- `tg_event`

  Describes the event for which the function is called. You can use the following macros to examine `tg_event`:

  - `TRIGGER_FIRED_BEFORE(tg_event)`

    Returns true if the trigger fired before the operation.

  - `TRIGGER_FIRED_AFTER(tg_event)`

    Returns true if the trigger fired after the operation.

  - `TRIGGER_FIRED_INSTEAD(tg_event)`

    Returns true if the trigger fired instead of the operation.

  - `TRIGGER_FIRED_FOR_ROW(tg_event)`

    Returns true if the trigger fired for a row-level event.

  - `TRIGGER_FIRED_FOR_STATEMENT(tg_event)`

    Returns true if the trigger fired for a statement-level event.

  - `TRIGGER_FIRED_BY_INSERT(tg_event)`

    Returns true if the trigger was fired by an `INSERT` command.

  - `TRIGGER_FIRED_BY_UPDATE(tg_event)`

    Returns true if the trigger was fired by an `UPDATE` command.

  - `TRIGGER_FIRED_BY_DELETE(tg_event)`

    Returns true if the trigger was fired by a `DELETE` command.

  - `TRIGGER_FIRED_BY_TRUNCATE(tg_event)`

    Returns true if the trigger was fired by a `TRUNCATE` command.

- `tg_relation`

  A pointer to a structure describing the relation that the trigger fired for. Look at `utils/rel.h` for details about this structure. The most interesting things are `tg_relation->rd_att` (descriptor of the relation tuples) and `tg_relation->rd_rel->relname` (relation name; the type is not `char*` but `NameData`; use `SPI_getrelname(tg_relation)` to get a `char*` if you need a copy of the name).

- `tg_trigtuple`

  A pointer to the row for which the trigger was fired. This is the row being inserted, updated, or deleted. If this trigger was fired for an `INSERT` or `DELETE` then this is what you should return from the function if you don't want to replace the row with a different one (in the case of `INSERT`) or skip the operation. For triggers on foreign tables, values of system columns herein are unspecified.

- `tg_newtuple`

  A pointer to the new version of the row, if the trigger was fired for an `UPDATE`, and `NULL` if it is for an `INSERT` or a `DELETE`. This is what you have to return from the function if the event is an `UPDATE` and you don't want to replace this row by a different one or skip the operation. For triggers on foreign tables, values of system columns herein are unspecified.

- `tg_trigger`

  A pointer to a structure of type `Trigger`, defined in `utils/reltrigger.h`:

  ```
  typedef struct Trigger
  {
      Oid         tgoid;
      char       *tgname;
      Oid         tgfoid;
      int16       tgtype;
      char        tgenabled;
      bool        tgisinternal;
      bool        tgisclone;
      Oid         tgconstrrelid;
      Oid         tgconstrindid;
      Oid         tgconstraint;
      bool        tgdeferrable;
      bool        tginitdeferred;
      int16       tgnargs;
      int16       tgnattr;
      int16      *tgattr;
      char      **tgargs;
      char       *tgqual;
      char       *tgoldtable;
      char       *tgnewtable;
  } Trigger;
  ```

  where `tgname` is the trigger's name, `tgnargs` is the number of arguments in `tgargs`, and `tgargs` is an array of pointers to the arguments specified in the `CREATE TRIGGER` statement. The other members are for internal use only.

- `tg_trigslot`

  The slot containing `tg_trigtuple`, or a `NULL` pointer if there is no such tuple.

- `tg_newslot`

  The slot containing `tg_newtuple`, or a `NULL` pointer if there is no such tuple.

- `tg_oldtable`

  A pointer to a structure of type `Tuplestorestate` containing zero or more rows in the format specified by `tg_relation`, or a `NULL` pointer if there is no `OLD TABLE` transition relation.

- `tg_newtable`

  A pointer to a structure of type `Tuplestorestate` containing zero or more rows in the format specified by `tg_relation`, or a `NULL` pointer if there is no `NEW TABLE` transition relation.

- `tg_updatedcols`

  For `UPDATE` triggers, a bitmap set indicating the columns that were updated by the triggering command. Generic trigger functions can use this to optimize actions by not having to deal with columns that were not changed.

  As an example, to determine whether a column with attribute number `attnum` (1-based) is a member of this bitmap set, call `bms_is_member(attnum - FirstLowInvalidHeapAttributeNumber, trigdata->tg_updatedcols))`.

  For triggers other than `UPDATE` triggers, this will be `NULL`.

To allow queries issued through SPI to reference transition tables, see [SPI_register_trigger_data](spi-spi-register-trigger-data).

A trigger function must return either a `HeapTuple` pointer or a `NULL` pointer (_not_ an SQL null value, that is, do not set _`isNull`_ true). Be careful to return either `tg_trigtuple` or `tg_newtuple`, as appropriate, if you don't want to modify the row being operated on.
