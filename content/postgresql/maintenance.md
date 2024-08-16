[#id](#MAINTENANCE)

## Chapter 25. Routine Database Maintenance Tasks

**Table of Contents**

- [25.1. Routine Vacuuming](routine-vacuuming)

  - [25.1.1. Vacuuming Basics](routine-vacuuming#VACUUM-BASICS)
  - [25.1.2. Recovering Disk Space](routine-vacuuming#VACUUM-FOR-SPACE-RECOVERY)
  - [25.1.3. Updating Planner Statistics](routine-vacuuming#VACUUM-FOR-STATISTICS)
  - [25.1.4. Updating the Visibility Map](routine-vacuuming#VACUUM-FOR-VISIBILITY-MAP)
  - [25.1.5. Preventing Transaction ID Wraparound Failures](routine-vacuuming#VACUUM-FOR-WRAPAROUND)
  - [25.1.6. The Autovacuum Daemon](routine-vacuuming#AUTOVACUUM)

  - [25.2. Routine Reindexing](routine-reindex)
  - [25.3. Log File Maintenance](logfile-maintenance)

PostgreSQL, like any database software, requires that certain tasks be performed regularly to achieve optimum performance. The tasks discussed here are _required_, but they are repetitive in nature and can easily be automated using standard tools such as cron scripts or Windows' Task Scheduler. It is the database administrator's responsibility to set up appropriate scripts, and to check that they execute successfully.

One obvious maintenance task is the creation of backup copies of the data on a regular schedule. Without a recent backup, you have no chance of recovery after a catastrophe (disk failure, fire, mistakenly dropping a critical table, etc.). The backup and recovery mechanisms available in PostgreSQL are discussed at length in [Chapter 26](backup).

The other main category of maintenance task is periodic “vacuuming” of the database. This activity is discussed in [Section 25.1](routine-vacuuming). Closely related to this is updating the statistics that will be used by the query planner, as discussed in [Section 25.1.3](routine-vacuuming#VACUUM-FOR-STATISTICS).

Another task that might need periodic attention is log file management. This is discussed in [Section 25.3](logfile-maintenance).

[check_postgres](https://bucardo.org/check_postgres/) is available for monitoring database health and reporting unusual conditions. check_postgres integrates with Nagios and MRTG, but can be run standalone too.

PostgreSQL is low-maintenance compared to some other database management systems. Nonetheless, appropriate attention to these tasks will go far towards ensuring a pleasant and productive experience with the system.
