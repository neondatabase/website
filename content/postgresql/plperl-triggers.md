[#id](#PLPERL-TRIGGERS)

## 45.6. PL/Perl Triggers [#](#PLPERL-TRIGGERS)

PL/Perl can be used to write trigger functions. In a trigger function, the hash reference `$_TD` contains information about the current trigger event. `$_TD` is a global variable, which gets a separate local value for each invocation of the trigger. The fields of the `$_TD` hash reference are:

- `$_TD->{new}{foo}`

  `NEW` value of column `foo`

- `$_TD->{old}{foo}`

  `OLD` value of column `foo`

- `$_TD->{name}`

  Name of the trigger being called

- `$_TD->{event}`

  Trigger event: `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, or `UNKNOWN`

- `$_TD->{when}`

  When the trigger was called: `BEFORE`, `AFTER`, `INSTEAD OF`, or `UNKNOWN`

- `$_TD->{level}`

  The trigger level: `ROW`, `STATEMENT`, or `UNKNOWN`

- `$_TD->{relid}`

  OID of the table on which the trigger fired

- `$_TD->{table_name}`

  Name of the table on which the trigger fired

- `$_TD->{relname}`

  Name of the table on which the trigger fired. This has been deprecated, and could be removed in a future release. Please use `$_TD->{table_name}` instead.

- `$_TD->{table_schema}`

  Name of the schema in which the table on which the trigger fired, is

- `$_TD->{argc}`

  Number of arguments of the trigger function

- `@{$_TD->{args}}`

  Arguments of the trigger function. Does not exist if `$_TD->{argc}` is 0.

Row-level triggers can return one of the following:

- `return;`

  Execute the operation

- `"SKIP"`

  Don't execute the operation

- `"MODIFY"`

  Indicates that the `NEW` row was modified by the trigger function

Here is an example of a trigger function, illustrating some of the above:

```
CREATE TABLE test (
    i int,
    v varchar
);

CREATE OR REPLACE FUNCTION valid_id() RETURNS trigger AS $$
    if (($_TD->{new}{i} >= 100) || ($_TD->{new}{i} <= 0)) {
        return "SKIP";    # skip INSERT/UPDATE command
    } elsif ($_TD->{new}{v} ne "immortal") {
        $_TD->{new}{v} .= "(modified by trigger)";
        return "MODIFY";  # modify row and execute INSERT/UPDATE command
    } else {
        return;           # execute INSERT/UPDATE command
    }
$$ LANGUAGE plperl;

CREATE TRIGGER test_valid_id_trig
    BEFORE INSERT OR UPDATE ON test
    FOR EACH ROW EXECUTE FUNCTION valid_id();
```
