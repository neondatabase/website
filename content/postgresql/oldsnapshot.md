[#id](#OLDSNAPSHOT)

## F.24. old_snapshot — inspect `old_snapshot_threshold` state [#](#OLDSNAPSHOT)

- [F.24.1. Functions](oldsnapshot#OLDSNAPSHOT-FUNCTIONS)

The `old_snapshot` module allows inspection of the server state that is used to implement [old_snapshot_threshold](runtime-config-resource#GUC-OLD-SNAPSHOT-THRESHOLD).

[#id](#OLDSNAPSHOT-FUNCTIONS)

### F.24.1. Functions [#](#OLDSNAPSHOT-FUNCTIONS)

- `pg_old_snapshot_time_mapping(array_offset OUT int4, end_timestamp OUT timestamptz, newest_xmin OUT xid) returns setof record`

  Returns all of the entries in the server's timestamp to XID mapping. Each entry represents the newest xmin of any snapshot taken in the corresponding minute.
