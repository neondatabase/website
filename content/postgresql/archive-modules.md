[#id](#ARCHIVE-MODULES)

## Chapter 51. Archive Modules

**Table of Contents**

- [51.1. Initialization Functions](archive-module-init)
- [51.2. Archive Module Callbacks](archive-module-callbacks)

  - [51.2.1. Startup Callback](archive-module-callbacks#ARCHIVE-MODULE-STARTUP)
  - [51.2.2. Check Callback](archive-module-callbacks#ARCHIVE-MODULE-CHECK)
  - [51.2.3. Archive Callback](archive-module-callbacks#ARCHIVE-MODULE-ARCHIVE)
  - [51.2.4. Shutdown Callback](archive-module-callbacks#ARCHIVE-MODULE-SHUTDOWN)

PostgreSQL provides infrastructure to create custom modules for continuous archiving (see [Section 26.3](continuous-archiving)). While archiving via a shell command (i.e., [archive_command](runtime-config-wal#GUC-ARCHIVE-COMMAND)) is much simpler, a custom archive module will often be considerably more robust and performant.

When a custom [archive_library](runtime-config-wal#GUC-ARCHIVE-LIBRARY) is configured, PostgreSQL will submit completed WAL files to the module, and the server will avoid recycling or removing these WAL files until the module indicates that the files were successfully archived. It is ultimately up to the module to decide what to do with each WAL file, but many recommendations are listed at [Section 26.3.1](continuous-archiving#BACKUP-ARCHIVING-WAL).

Archiving modules must at least consist of an initialization function (see [Section 51.1](archive-module-init)) and the required callbacks (see [Section 51.2](archive-module-callbacks)). However, archive modules are also permitted to do much more (e.g., declare GUCs and register background workers).

The `contrib/basic_archive` module contains a working example, which demonstrates some useful techniques.
