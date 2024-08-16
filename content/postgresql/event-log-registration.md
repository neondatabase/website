[#id](#EVENT-LOG-REGISTRATION)

## 19.12. Registering Event Log on Windows [#](#EVENT-LOG-REGISTRATION)

To register a Windows event log library with the operating system, issue this command:

```

regsvr32 pgsql_library_directory/pgevent.dll
```

This creates registry entries used by the event viewer, under the default event source named `PostgreSQL`.

To specify a different event source name (see [event_source](runtime-config-logging#GUC-EVENT-SOURCE)), use the `/n` and `/i` options:

```

regsvr32 /n /i:event_source_name pgsql_library_directory/pgevent.dll
```

To unregister the event log library from the operating system, issue this command:

```

regsvr32 /u [/i:event_source_name] pgsql_library_directory/pgevent.dll
```

### Note

To enable event logging in the database server, modify [log_destination](runtime-config-logging#GUC-LOG-DESTINATION) to include `eventlog` in `postgresql.conf`.
