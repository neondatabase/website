[#id](#RUNTIME-CONFIG)

## Chapter 20. Server Configuration

**Table of Contents**

- [20.1. Setting Parameters](config-setting)

  - [20.1.1. Parameter Names and Values](config-setting#CONFIG-SETTING-NAMES-VALUES)
  - [20.1.2. Parameter Interaction via the Configuration File](config-setting#CONFIG-SETTING-CONFIGURATION-FILE)
  - [20.1.3. Parameter Interaction via SQL](config-setting#CONFIG-SETTING-SQL)
  - [20.1.4. Parameter Interaction via the Shell](config-setting#CONFIG-SETTING-SHELL)
  - [20.1.5. Managing Configuration File Contents](config-setting#CONFIG-INCLUDES)

  - [20.2. File Locations](runtime-config-file-locations)
  - [20.3. Connections and Authentication](runtime-config-connection)

    - [20.3.1. Connection Settings](runtime-config-connection#RUNTIME-CONFIG-CONNECTION-SETTINGS)
    - [20.3.2. TCP Settings](runtime-config-connection#RUNTIME-CONFIG-TCP-SETTINGS)
    - [20.3.3. Authentication](runtime-config-connection#RUNTIME-CONFIG-CONNECTION-AUTHENTICATION)
    - [20.3.4. SSL](runtime-config-connection#RUNTIME-CONFIG-CONNECTION-SSL)

- [20.4. Resource Consumption](runtime-config-resource)

  - [20.4.1. Memory](runtime-config-resource#RUNTIME-CONFIG-RESOURCE-MEMORY)
  - [20.4.2. Disk](runtime-config-resource#RUNTIME-CONFIG-RESOURCE-DISK)
  - [20.4.3. Kernel Resource Usage](runtime-config-resource#RUNTIME-CONFIG-RESOURCE-KERNEL)
  - [20.4.4. Cost-based Vacuum Delay](runtime-config-resource#RUNTIME-CONFIG-RESOURCE-VACUUM-COST)
  - [20.4.5. Background Writer](runtime-config-resource#RUNTIME-CONFIG-RESOURCE-BACKGROUND-WRITER)
  - [20.4.6. Asynchronous Behavior](runtime-config-resource#RUNTIME-CONFIG-RESOURCE-ASYNC-BEHAVIOR)

- [20.5. Write Ahead Log](runtime-config-wal)

  - [20.5.1. Settings](runtime-config-wal#RUNTIME-CONFIG-WAL-SETTINGS)
  - [20.5.2. Checkpoints](runtime-config-wal#RUNTIME-CONFIG-WAL-CHECKPOINTS)
  - [20.5.3. Archiving](runtime-config-wal#RUNTIME-CONFIG-WAL-ARCHIVING)
  - [20.5.4. Recovery](runtime-config-wal#RUNTIME-CONFIG-WAL-RECOVERY)
  - [20.5.5. Archive Recovery](runtime-config-wal#RUNTIME-CONFIG-WAL-ARCHIVE-RECOVERY)
  - [20.5.6. Recovery Target](runtime-config-wal#RUNTIME-CONFIG-WAL-RECOVERY-TARGET)

- [20.6. Replication](runtime-config-replication)

  - [20.6.1. Sending Servers](runtime-config-replication#RUNTIME-CONFIG-REPLICATION-SENDER)
  - [20.6.2. Primary Server](runtime-config-replication#RUNTIME-CONFIG-REPLICATION-PRIMARY)
  - [20.6.3. Standby Servers](runtime-config-replication#RUNTIME-CONFIG-REPLICATION-STANDBY)
  - [20.6.4. Subscribers](runtime-config-replication#RUNTIME-CONFIG-REPLICATION-SUBSCRIBER)

- [20.7. Query Planning](runtime-config-query)

  - [20.7.1. Planner Method Configuration](runtime-config-query#RUNTIME-CONFIG-QUERY-ENABLE)
  - [20.7.2. Planner Cost Constants](runtime-config-query#RUNTIME-CONFIG-QUERY-CONSTANTS)
  - [20.7.3. Genetic Query Optimizer](runtime-config-query#RUNTIME-CONFIG-QUERY-GEQO)
  - [20.7.4. Other Planner Options](runtime-config-query#RUNTIME-CONFIG-QUERY-OTHER)

- [20.8. Error Reporting and Logging](runtime-config-logging)

  - [20.8.1. Where to Log](runtime-config-logging#RUNTIME-CONFIG-LOGGING-WHERE)
  - [20.8.2. When to Log](runtime-config-logging#RUNTIME-CONFIG-LOGGING-WHEN)
  - [20.8.3. What to Log](runtime-config-logging#RUNTIME-CONFIG-LOGGING-WHAT)
  - [20.8.4. Using CSV-Format Log Output](runtime-config-logging#RUNTIME-CONFIG-LOGGING-CSVLOG)
  - [20.8.5. Using JSON-Format Log Output](runtime-config-logging#RUNTIME-CONFIG-LOGGING-JSONLOG)
  - [20.8.6. Process Title](runtime-config-logging#RUNTIME-CONFIG-LOGGING-PROC-TITLE)

- [20.9. Run-time Statistics](runtime-config-statistics)

  - [20.9.1. Cumulative Query and Index Statistics](runtime-config-statistics#RUNTIME-CONFIG-CUMULATIVE-STATISTICS)
  - [20.9.2. Statistics Monitoring](runtime-config-statistics#RUNTIME-CONFIG-STATISTICS-MONITOR)

  - [20.10. Automatic Vacuuming](runtime-config-autovacuum)
  - [20.11. Client Connection Defaults](runtime-config-client)

    - [20.11.1. Statement Behavior](runtime-config-client#RUNTIME-CONFIG-CLIENT-STATEMENT)
    - [20.11.2. Locale and Formatting](runtime-config-client#RUNTIME-CONFIG-CLIENT-FORMAT)
    - [20.11.3. Shared Library Preloading](runtime-config-client#RUNTIME-CONFIG-CLIENT-PRELOAD)
    - [20.11.4. Other Defaults](runtime-config-client#RUNTIME-CONFIG-CLIENT-OTHER)

  - [20.12. Lock Management](runtime-config-locks)
  - [20.13. Version and Platform Compatibility](runtime-config-compatible)

    - [20.13.1. Previous PostgreSQL Versions](runtime-config-compatible#RUNTIME-CONFIG-COMPATIBLE-VERSION)
    - [20.13.2. Platform and Client Compatibility](runtime-config-compatible#RUNTIME-CONFIG-COMPATIBLE-CLIENTS)

  - [20.14. Error Handling](runtime-config-error-handling)
  - [20.15. Preset Options](runtime-config-preset)
  - [20.16. Customized Options](runtime-config-custom)
  - [20.17. Developer Options](runtime-config-developer)
  - [20.18. Short Options](runtime-config-short)

There are many configuration parameters that affect the behavior of the database system. In the first section of this chapter we describe how to interact with configuration parameters. The subsequent sections discuss each parameter in detail.
