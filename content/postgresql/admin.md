[#id](#ADMIN)

# Part III. Server Administration

[#id](#id-1.6.2)

This part covers topics that are of interest to a PostgreSQL database administrator. This includes installation of the software, set up and configuration of the server, management of users and databases, and maintenance tasks. Anyone who runs a PostgreSQL server, even for personal use, but especially in production, should be familiar with the topics covered in this part.

The information in this part is arranged approximately in the order in which a new user should read it. But the chapters are self-contained and can be read individually as desired. The information in this part is presented in a narrative fashion in topical units. Readers looking for a complete description of a particular command should see [Part VI](reference).

The first few chapters are written so they can be understood without prerequisite knowledge, so new users who need to set up their own server can begin their exploration with this part. The rest of this part is about tuning and management; that material assumes that the reader is familiar with the general use of the PostgreSQL database system. Readers are encouraged to look at [Part I](tutorial) and [Part II](sql) for additional information.

**Table of Contents**

- [16. Installation from Binaries](install-binaries)
- [17. Installation from Source Code](installation)

  - [17.1. Requirements](install-requirements)
  - [17.2. Getting the Source](install-getsource)
  - [17.3. Building and Installation with Autoconf and Make](install-make)
  - [17.4. Building and Installation with Meson](install-meson)
  - [17.5. Post-Installation Setup](install-post)
  - [17.6. Supported Platforms](supported-platforms)
  - [17.7. Platform-Specific Notes](installation-platform-notes)

- [18. Installation from Source Code on Windows](install-windows)

  - [18.1. Building with Visual C++ or the Microsoft Windows SDK](install-windows-full)

- [19. Server Setup and Operation](runtime)

  - [19.1. The PostgreSQL User Account](postgres-user)
  - [19.2. Creating a Database Cluster](creating-cluster)
  - [19.3. Starting the Database Server](server-start)
  - [19.4. Managing Kernel Resources](kernel-resources)
  - [19.5. Shutting Down the Server](server-shutdown)
  - [19.6. Upgrading a PostgreSQL Cluster](upgrading)
  - [19.7. Preventing Server Spoofing](preventing-server-spoofing)
  - [19.8. Encryption Options](encryption-options)
  - [19.9. Secure TCP/IP Connections with SSL](ssl-tcp)
  - [19.10. Secure TCP/IP Connections with GSSAPI Encryption](gssapi-enc)
  - [19.11. Secure TCP/IP Connections with SSH Tunnels](ssh-tunnels)
  - [19.12. Registering Event Log on Windows](event-log-registration)

- [20. Server Configuration](runtime-config)

  - [20.1. Setting Parameters](config-setting)
  - [20.2. File Locations](runtime-config-file-locations)
  - [20.3. Connections and Authentication](runtime-config-connection)
  - [20.4. Resource Consumption](runtime-config-resource)
  - [20.5. Write Ahead Log](runtime-config-wal)
  - [20.6. Replication](runtime-config-replication)
  - [20.7. Query Planning](runtime-config-query)
  - [20.8. Error Reporting and Logging](runtime-config-logging)
  - [20.9. Run-time Statistics](runtime-config-statistics)
  - [20.10. Automatic Vacuuming](runtime-config-autovacuum)
  - [20.11. Client Connection Defaults](runtime-config-client)
  - [20.12. Lock Management](runtime-config-locks)
  - [20.13. Version and Platform Compatibility](runtime-config-compatible)
  - [20.14. Error Handling](runtime-config-error-handling)
  - [20.15. Preset Options](runtime-config-preset)
  - [20.16. Customized Options](runtime-config-custom)
  - [20.17. Developer Options](runtime-config-developer)
  - [20.18. Short Options](runtime-config-short)

- [21. Client Authentication](client-authentication)

  - [21.1. The `pg_hba.conf` File](auth-pg-hba-conf)
  - [21.2. User Name Maps](auth-username-maps)
  - [21.3. Authentication Methods](auth-methods)
  - [21.4. Trust Authentication](auth-trust)
  - [21.5. Password Authentication](auth-password)
  - [21.6. GSSAPI Authentication](gssapi-auth)
  - [21.7. SSPI Authentication](sspi-auth)
  - [21.8. Ident Authentication](auth-ident)
  - [21.9. Peer Authentication](auth-peer)
  - [21.10. LDAP Authentication](auth-ldap)
  - [21.11. RADIUS Authentication](auth-radius)
  - [21.12. Certificate Authentication](auth-cert)
  - [21.13. PAM Authentication](auth-pam)
  - [21.14. BSD Authentication](auth-bsd)
  - [21.15. Authentication Problems](client-authentication-problems)

- [22. Database Roles](user-manag)

  - [22.1. Database Roles](database-roles)
  - [22.2. Role Attributes](role-attributes)
  - [22.3. Role Membership](role-membership)
  - [22.4. Dropping Roles](role-removal)
  - [22.5. Predefined Roles](predefined-roles)
  - [22.6. Function Security](perm-functions)

- [23. Managing Databases](managing-databases)

  - [23.1. Overview](manage-ag-overview)
  - [23.2. Creating a Database](manage-ag-createdb)
  - [23.3. Template Databases](manage-ag-templatedbs)
  - [23.4. Database Configuration](manage-ag-config)
  - [23.5. Destroying a Database](manage-ag-dropdb)
  - [23.6. Tablespaces](manage-ag-tablespaces)

- [24. Localization](charset)

  - [24.1. Locale Support](locale)
  - [24.2. Collation Support](collation)
  - [24.3. Character Set Support](multibyte)

- [25. Routine Database Maintenance Tasks](maintenance)

  - [25.1. Routine Vacuuming](routine-vacuuming)
  - [25.2. Routine Reindexing](routine-reindex)
  - [25.3. Log File Maintenance](logfile-maintenance)

- [26. Backup and Restore](backup)

  - [26.1. SQL Dump](backup-dump)
  - [26.2. File System Level Backup](backup-file)
  - [26.3. Continuous Archiving and Point-in-Time Recovery (PITR)](continuous-archiving)

- [27. High Availability, Load Balancing, and Replication](high-availability)

  - [27.1. Comparison of Different Solutions](different-replication-solutions)
  - [27.2. Log-Shipping Standby Servers](warm-standby)
  - [27.3. Failover](warm-standby-failover)
  - [27.4. Hot Standby](hot-standby)

- [28. Monitoring Database Activity](monitoring)

  - [28.1. Standard Unix Tools](monitoring-ps)
  - [28.2. The Cumulative Statistics System](monitoring-stats)
  - [28.3. Viewing Locks](monitoring-locks)
  - [28.4. Progress Reporting](progress-reporting)
  - [28.5. Dynamic Tracing](dynamic-trace)

- [29. Monitoring Disk Usage](diskusage)

  - [29.1. Determining Disk Usage](disk-usage)
  - [29.2. Disk Full Failure](disk-full)

- [30. Reliability and the Write-Ahead Log](wal)

  - [30.1. Reliability](wal-reliability)
  - [30.2. Data Checksums](checksums)
  - [30.3. Write-Ahead Logging (WAL)](wal-intro)
  - [30.4. Asynchronous Commit](wal-async-commit)
  - [30.5. WAL Configuration](wal-configuration)
  - [30.6. WAL Internals](wal-internals)

- [31. Logical Replication](logical-replication)

  - [31.1. Publication](logical-replication-publication)
  - [31.2. Subscription](logical-replication-subscription)
  - [31.3. Row Filters](logical-replication-row-filter)
  - [31.4. Column Lists](logical-replication-col-lists)
  - [31.5. Conflicts](logical-replication-conflicts)
  - [31.6. Restrictions](logical-replication-restrictions)
  - [31.7. Architecture](logical-replication-architecture)
  - [31.8. Monitoring](logical-replication-monitoring)
  - [31.9. Security](logical-replication-security)
  - [31.10. Configuration Settings](logical-replication-config)
  - [31.11. Quick Setup](logical-replication-quick-setup)

- [32. Just-in-Time Compilation (JIT)](jit)

  - [32.1. What Is JIT compilation?](jit-reason)
  - [32.2. When to JIT?](jit-decision)
  - [32.3. Configuration](jit-configuration)
  - [32.4. Extensibility](jit-extensibility)

- [33. Regression Tests](regress)

  - [33.1. Running the Tests](regress-run)
  - [33.2. Test Evaluation](regress-evaluation)
  - [33.3. Variant Comparison Files](regress-variant)
  - [33.4. TAP Tests](regress-tap)
  - [33.5. Test Coverage Examination](regress-coverage)
