<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                    19.12. Registering Event Log on Windows                    |                                                             |                                        |                                                       |                                                                 |
| :---------------------------------------------------------------------------: | :---------------------------------------------------------- | :------------------------------------: | ----------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](ssh-tunnels.html "19.11. Secure TCP/IP Connections with SSH Tunnels")  | [Up](runtime.html "Chapter 19. Server Setup and Operation") | Chapter 19. Server Setup and Operation | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](runtime-config.html "Chapter 20. Server Configuration") |

***

## 19.12. Registering Event Log on Windows [#](#EVENT-LOG-REGISTRATION)

To register a Windows event log library with the operating system, issue this command:

```

regsvr32 pgsql_library_directory/pgevent.dll
```

This creates registry entries used by the event viewer, under the default event source named `PostgreSQL`.

To specify a different event source name (see [event\_source](runtime-config-logging.html#GUC-EVENT-SOURCE)), use the `/n` and `/i` options:

```

regsvr32 /n /i:event_source_name pgsql_library_directory/pgevent.dll
```

To unregister the event log library from the operating system, issue this command:

```

regsvr32 /u [/i:event_source_name] pgsql_library_directory/pgevent.dll
```

### Note

To enable event logging in the database server, modify [log\_destination](runtime-config-logging.html#GUC-LOG-DESTINATION) to include `eventlog` in `postgresql.conf`.

***

|                                                                               |                                                             |                                                                 |
| :---------------------------------------------------------------------------- | :---------------------------------------------------------: | --------------------------------------------------------------: |
| [Prev](ssh-tunnels.html "19.11. Secure TCP/IP Connections with SSH Tunnels")  | [Up](runtime.html "Chapter 19. Server Setup and Operation") |  [Next](runtime-config.html "Chapter 20. Server Configuration") |
| 19.11. Secure TCP/IP Connections with SSH Tunnels                             |    [Home](index.html "PostgreSQL 17devel Documentation")    |                                Chapter 20. Server Configuration |
