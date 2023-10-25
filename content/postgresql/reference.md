<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                            Part VI. Reference                           |                                                     |                                  |                                                       |                                           |
| :---------------------------------------------------------------------: | :-------------------------------------------------- | :------------------------------: | ----------------------------------------------------: | ----------------------------------------: |
| [Prev](archive-module-callbacks.html "51.2. Archive Module Callbacks")  | [Up](index.html "PostgreSQL 17devel Documentation") | PostgreSQL 17devel Documentation | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](sql-commands.html "SQL Commands") |

***

# Part VI. Reference

The entries in this Reference are meant to provide in reasonable length an authoritative, complete, and formal summary about their respective subjects. More information about the use of PostgreSQL, in narrative, tutorial, or example form, can be found in other parts of this book. See the cross-references listed on each reference page.

The reference entries are also available as traditional “man” pages.

**Table of Contents**

* [I. SQL Commands](sql-commands.html)

  * *   [ABORT](sql-abort.html) — abort the current transaction
    * [ALTER AGGREGATE](sql-alteraggregate.html) — change the definition of an aggregate function
    * [ALTER COLLATION](sql-altercollation.html) — change the definition of a collation
    * [ALTER CONVERSION](sql-alterconversion.html) — change the definition of a conversion
    * [ALTER DATABASE](sql-alterdatabase.html) — change a database
    * [ALTER DEFAULT PRIVILEGES](sql-alterdefaultprivileges.html) — define default access privileges
    * [ALTER DOMAIN](sql-alterdomain.html) — change the definition of a domain
    * [ALTER EVENT TRIGGER](sql-altereventtrigger.html) — change the definition of an event trigger
    * [ALTER EXTENSION](sql-alterextension.html) — change the definition of an extension
    * [ALTER FOREIGN DATA WRAPPER](sql-alterforeigndatawrapper.html) — change the definition of a foreign-data wrapper
    * [ALTER FOREIGN TABLE](sql-alterforeigntable.html) — change the definition of a foreign table
    * [ALTER FUNCTION](sql-alterfunction.html) — change the definition of a function
    * [ALTER GROUP](sql-altergroup.html) — change role name or membership
    * [ALTER INDEX](sql-alterindex.html) — change the definition of an index
    * [ALTER LANGUAGE](sql-alterlanguage.html) — change the definition of a procedural language
    * [ALTER LARGE OBJECT](sql-alterlargeobject.html) — change the definition of a large object
    * [ALTER MATERIALIZED VIEW](sql-altermaterializedview.html) — change the definition of a materialized view
    * [ALTER OPERATOR](sql-alteroperator.html) — change the definition of an operator
    * [ALTER OPERATOR CLASS](sql-alteropclass.html) — change the definition of an operator class
    * [ALTER OPERATOR FAMILY](sql-alteropfamily.html) — change the definition of an operator family
    * [ALTER POLICY](sql-alterpolicy.html) — change the definition of a row-level security policy
    * [ALTER PROCEDURE](sql-alterprocedure.html) — change the definition of a procedure
    * [ALTER PUBLICATION](sql-alterpublication.html) — change the definition of a publication
    * [ALTER ROLE](sql-alterrole.html) — change a database role
    * [ALTER ROUTINE](sql-alterroutine.html) — change the definition of a routine
    * [ALTER RULE](sql-alterrule.html) — change the definition of a rule
    * [ALTER SCHEMA](sql-alterschema.html) — change the definition of a schema
    * [ALTER SEQUENCE](sql-altersequence.html) — change the definition of a sequence generator
    * [ALTER SERVER](sql-alterserver.html) — change the definition of a foreign server
    * [ALTER STATISTICS](sql-alterstatistics.html) — change the definition of an extended statistics object
    * [ALTER SUBSCRIPTION](sql-altersubscription.html) — change the definition of a subscription
    * [ALTER SYSTEM](sql-altersystem.html) — change a server configuration parameter
    * [ALTER TABLE](sql-altertable.html) — change the definition of a table
    * [ALTER TABLESPACE](sql-altertablespace.html) — change the definition of a tablespace
    * [ALTER TEXT SEARCH CONFIGURATION](sql-altertsconfig.html) — change the definition of a text search configuration
    * [ALTER TEXT SEARCH DICTIONARY](sql-altertsdictionary.html) — change the definition of a text search dictionary
    * [ALTER TEXT SEARCH PARSER](sql-altertsparser.html) — change the definition of a text search parser
    * [ALTER TEXT SEARCH TEMPLATE](sql-altertstemplate.html) — change the definition of a text search template
    * [ALTER TRIGGER](sql-altertrigger.html) — change the definition of a trigger
    * [ALTER TYPE](sql-altertype.html) — change the definition of a type
    * [ALTER USER](sql-alteruser.html) — change a database role
    * [ALTER USER MAPPING](sql-alterusermapping.html) — change the definition of a user mapping
    * [ALTER VIEW](sql-alterview.html) — change the definition of a view
    * [ANALYZE](sql-analyze.html) — collect statistics about a database
    * [BEGIN](sql-begin.html) — start a transaction block
    * [CALL](sql-call.html) — invoke a procedure
    * [CHECKPOINT](sql-checkpoint.html) — force a write-ahead log checkpoint
    * [CLOSE](sql-close.html) — close a cursor
    * [CLUSTER](sql-cluster.html) — cluster a table according to an index
    * [COMMENT](sql-comment.html) — define or change the comment of an object
    * [COMMIT](sql-commit.html) — commit the current transaction
    * [COMMIT PREPARED](sql-commit-prepared.html) — commit a transaction that was earlier prepared for two-phase commit
    * [COPY](sql-copy.html) — copy data between a file and a table
    * [CREATE ACCESS METHOD](sql-create-access-method.html) — define a new access method
    * [CREATE AGGREGATE](sql-createaggregate.html) — define a new aggregate function
    * [CREATE CAST](sql-createcast.html) — define a new cast
    * [CREATE COLLATION](sql-createcollation.html) — define a new collation
    * [CREATE CONVERSION](sql-createconversion.html) — define a new encoding conversion
    * [CREATE DATABASE](sql-createdatabase.html) — create a new database
    * [CREATE DOMAIN](sql-createdomain.html) — define a new domain
    * [CREATE EVENT TRIGGER](sql-createeventtrigger.html) — define a new event trigger
    * [CREATE EXTENSION](sql-createextension.html) — install an extension
    * [CREATE FOREIGN DATA WRAPPER](sql-createforeigndatawrapper.html) — define a new foreign-data wrapper
    * [CREATE FOREIGN TABLE](sql-createforeigntable.html) — define a new foreign table
    * [CREATE FUNCTION](sql-createfunction.html) — define a new function
    * [CREATE GROUP](sql-creategroup.html) — define a new database role
    * [CREATE INDEX](sql-createindex.html) — define a new index
    * [CREATE LANGUAGE](sql-createlanguage.html) — define a new procedural language
    * [CREATE MATERIALIZED VIEW](sql-creatematerializedview.html) — define a new materialized view
    * [CREATE OPERATOR](sql-createoperator.html) — define a new operator
    * [CREATE OPERATOR CLASS](sql-createopclass.html) — define a new operator class
    * [CREATE OPERATOR FAMILY](sql-createopfamily.html) — define a new operator family
    * [CREATE POLICY](sql-createpolicy.html) — define a new row-level security policy for a table
    * [CREATE PROCEDURE](sql-createprocedure.html) — define a new procedure
    * [CREATE PUBLICATION](sql-createpublication.html) — define a new publication
    * [CREATE ROLE](sql-createrole.html) — define a new database role
    * [CREATE RULE](sql-createrule.html) — define a new rewrite rule
    * [CREATE SCHEMA](sql-createschema.html) — define a new schema
    * [CREATE SEQUENCE](sql-createsequence.html) — define a new sequence generator
    * [CREATE SERVER](sql-createserver.html) — define a new foreign server
    * [CREATE STATISTICS](sql-createstatistics.html) — define extended statistics
    * [CREATE SUBSCRIPTION](sql-createsubscription.html) — define a new subscription
    * [CREATE TABLE](sql-createtable.html) — define a new table
    * [CREATE TABLE AS](sql-createtableas.html) — define a new table from the results of a query
    * [CREATE TABLESPACE](sql-createtablespace.html) — define a new tablespace
    * [CREATE TEXT SEARCH CONFIGURATION](sql-createtsconfig.html) — define a new text search configuration
    * [CREATE TEXT SEARCH DICTIONARY](sql-createtsdictionary.html) — define a new text search dictionary
    * [CREATE TEXT SEARCH PARSER](sql-createtsparser.html) — define a new text search parser
    * [CREATE TEXT SEARCH TEMPLATE](sql-createtstemplate.html) — define a new text search template
    * [CREATE TRANSFORM](sql-createtransform.html) — define a new transform
    * [CREATE TRIGGER](sql-createtrigger.html) — define a new trigger
    * [CREATE TYPE](sql-createtype.html) — define a new data type
    * [CREATE USER](sql-createuser.html) — define a new database role
    * [CREATE USER MAPPING](sql-createusermapping.html) — define a new mapping of a user to a foreign server
    * [CREATE VIEW](sql-createview.html) — define a new view
    * [DEALLOCATE](sql-deallocate.html) — deallocate a prepared statement
    * [DECLARE](sql-declare.html) — define a cursor
    * [DELETE](sql-delete.html) — delete rows of a table
    * [DISCARD](sql-discard.html) — discard session state
    * [DO](sql-do.html) — execute an anonymous code block
    * [DROP ACCESS METHOD](sql-drop-access-method.html) — remove an access method
    * [DROP AGGREGATE](sql-dropaggregate.html) — remove an aggregate function
    * [DROP CAST](sql-dropcast.html) — remove a cast
    * [DROP COLLATION](sql-dropcollation.html) — remove a collation
    * [DROP CONVERSION](sql-dropconversion.html) — remove a conversion
    * [DROP DATABASE](sql-dropdatabase.html) — remove a database
    * [DROP DOMAIN](sql-dropdomain.html) — remove a domain
    * [DROP EVENT TRIGGER](sql-dropeventtrigger.html) — remove an event trigger
    * [DROP EXTENSION](sql-dropextension.html) — remove an extension
    * [DROP FOREIGN DATA WRAPPER](sql-dropforeigndatawrapper.html) — remove a foreign-data wrapper
    * [DROP FOREIGN TABLE](sql-dropforeigntable.html) — remove a foreign table
    * [DROP FUNCTION](sql-dropfunction.html) — remove a function
    * [DROP GROUP](sql-dropgroup.html) — remove a database role
    * [DROP INDEX](sql-dropindex.html) — remove an index
    * [DROP LANGUAGE](sql-droplanguage.html) — remove a procedural language
    * [DROP MATERIALIZED VIEW](sql-dropmaterializedview.html) — remove a materialized view
    * [DROP OPERATOR](sql-dropoperator.html) — remove an operator
    * [DROP OPERATOR CLASS](sql-dropopclass.html) — remove an operator class
    * [DROP OPERATOR FAMILY](sql-dropopfamily.html) — remove an operator family
    * [DROP OWNED](sql-drop-owned.html) — remove database objects owned by a database role
    * [DROP POLICY](sql-droppolicy.html) — remove a row-level security policy from a table
    * [DROP PROCEDURE](sql-dropprocedure.html) — remove a procedure
    * [DROP PUBLICATION](sql-droppublication.html) — remove a publication
    * [DROP ROLE](sql-droprole.html) — remove a database role
    * [DROP ROUTINE](sql-droproutine.html) — remove a routine
    * [DROP RULE](sql-droprule.html) — remove a rewrite rule
    * [DROP SCHEMA](sql-dropschema.html) — remove a schema
    * [DROP SEQUENCE](sql-dropsequence.html) — remove a sequence
    * [DROP SERVER](sql-dropserver.html) — remove a foreign server descriptor
    * [DROP STATISTICS](sql-dropstatistics.html) — remove extended statistics
    * [DROP SUBSCRIPTION](sql-dropsubscription.html) — remove a subscription
    * [DROP TABLE](sql-droptable.html) — remove a table
    * [DROP TABLESPACE](sql-droptablespace.html) — remove a tablespace
    * [DROP TEXT SEARCH CONFIGURATION](sql-droptsconfig.html) — remove a text search configuration
    * [DROP TEXT SEARCH DICTIONARY](sql-droptsdictionary.html) — remove a text search dictionary
    * [DROP TEXT SEARCH PARSER](sql-droptsparser.html) — remove a text search parser
    * [DROP TEXT SEARCH TEMPLATE](sql-droptstemplate.html) — remove a text search template
    * [DROP TRANSFORM](sql-droptransform.html) — remove a transform
    * [DROP TRIGGER](sql-droptrigger.html) — remove a trigger
    * [DROP TYPE](sql-droptype.html) — remove a data type
    * [DROP USER](sql-dropuser.html) — remove a database role
    * [DROP USER MAPPING](sql-dropusermapping.html) — remove a user mapping for a foreign server
    * [DROP VIEW](sql-dropview.html) — remove a view
    * [END](sql-end.html) — commit the current transaction
    * [EXECUTE](sql-execute.html) — execute a prepared statement
    * [EXPLAIN](sql-explain.html) — show the execution plan of a statement
    * [FETCH](sql-fetch.html) — retrieve rows from a query using a cursor
    * [GRANT](sql-grant.html) — define access privileges
    * [IMPORT FOREIGN SCHEMA](sql-importforeignschema.html) — import table definitions from a foreign server
    * [INSERT](sql-insert.html) — create new rows in a table
    * [LISTEN](sql-listen.html) — listen for a notification
    * [LOAD](sql-load.html) — load a shared library file
    * [LOCK](sql-lock.html) — lock a table
    * [MERGE](sql-merge.html) — conditionally insert, update, or delete rows of a table
    * [MOVE](sql-move.html) — position a cursor
    * [NOTIFY](sql-notify.html) — generate a notification
    * [PREPARE](sql-prepare.html) — prepare a statement for execution
    * [PREPARE TRANSACTION](sql-prepare-transaction.html) — prepare the current transaction for two-phase commit
    * [REASSIGN OWNED](sql-reassign-owned.html) — change the ownership of database objects owned by a database role
    * [REFRESH MATERIALIZED VIEW](sql-refreshmaterializedview.html) — replace the contents of a materialized view
    * [REINDEX](sql-reindex.html) — rebuild indexes
    * [RELEASE SAVEPOINT](sql-release-savepoint.html) — release a previously defined savepoint
    * [RESET](sql-reset.html) — restore the value of a run-time parameter to the default value
    * [REVOKE](sql-revoke.html) — remove access privileges
    * [ROLLBACK](sql-rollback.html) — abort the current transaction
    * [ROLLBACK PREPARED](sql-rollback-prepared.html) — cancel a transaction that was earlier prepared for two-phase commit
    * [ROLLBACK TO SAVEPOINT](sql-rollback-to.html) — roll back to a savepoint
    * [SAVEPOINT](sql-savepoint.html) — define a new savepoint within the current transaction
    * [SECURITY LABEL](sql-security-label.html) — define or change a security label applied to an object
    * [SELECT](sql-select.html) — retrieve rows from a table or view
    * [SELECT INTO](sql-selectinto.html) — define a new table from the results of a query
    * [SET](sql-set.html) — change a run-time parameter
    * [SET CONSTRAINTS](sql-set-constraints.html) — set constraint check timing for the current transaction
    * [SET ROLE](sql-set-role.html) — set the current user identifier of the current session
    * [SET SESSION AUTHORIZATION](sql-set-session-authorization.html) — set the session user identifier and the current user identifier of the current session
    * [SET TRANSACTION](sql-set-transaction.html) — set the characteristics of the current transaction
    * [SHOW](sql-show.html) — show the value of a run-time parameter
    * [START TRANSACTION](sql-start-transaction.html) — start a transaction block
    * [TRUNCATE](sql-truncate.html) — empty a table or set of tables
    * [UNLISTEN](sql-unlisten.html) — stop listening for a notification
    * [UPDATE](sql-update.html) — update rows of a table
    * [VACUUM](sql-vacuum.html) — garbage-collect and optionally analyze a database
    * [VALUES](sql-values.html) — compute a set of rows

* [II. PostgreSQL Client Applications](reference-client.html)

  * *   [clusterdb](app-clusterdb.html) — cluster a PostgreSQL database
    * [createdb](app-createdb.html) — create a new PostgreSQL database
    * [createuser](app-createuser.html) — define a new PostgreSQL user account
    * [dropdb](app-dropdb.html) — remove a PostgreSQL database
    * [dropuser](app-dropuser.html) — remove a PostgreSQL user account
    * [ecpg](app-ecpg.html) — embedded SQL C preprocessor
    * [pg\_amcheck](app-pgamcheck.html) — checks for corruption in one or more PostgreSQL databases
    * [pg\_basebackup](app-pgbasebackup.html) — take a base backup of a PostgreSQL cluster
    * [pgbench](pgbench.html) — run a benchmark test on PostgreSQL
    * [pg\_config](app-pgconfig.html) — retrieve information about the installed version of PostgreSQL
    * [pg\_dump](app-pgdump.html) — extract a PostgreSQL database into a script file or other archive file
    * [pg\_dumpall](app-pg-dumpall.html) — extract a PostgreSQL database cluster into a script file
    * [pg\_isready](app-pg-isready.html) — check the connection status of a PostgreSQL server
    * [pg\_receivewal](app-pgreceivewal.html) — stream write-ahead logs from a PostgreSQL server
    * [pg\_recvlogical](app-pgrecvlogical.html) — control PostgreSQL logical decoding streams
    * [pg\_restore](app-pgrestore.html) — restore a PostgreSQL database from an archive file created by pg\_dump
    * [pg\_verifybackup](app-pgverifybackup.html) — verify the integrity of a base backup of a PostgreSQL cluster
    * [psql](app-psql.html) — PostgreSQL interactive terminal
    * [reindexdb](app-reindexdb.html) — reindex a PostgreSQL database
    * [vacuumdb](app-vacuumdb.html) — garbage-collect and analyze a PostgreSQL database

* [III. PostgreSQL Server Applications](reference-server.html)

  * *   [initdb](app-initdb.html) — create a new PostgreSQL database cluster
    * [pg\_archivecleanup](pgarchivecleanup.html) — clean up PostgreSQL WAL archive files
    * [pg\_checksums](app-pgchecksums.html) — enable, disable or check data checksums in a PostgreSQL database cluster
    * [pg\_controldata](app-pgcontroldata.html) — display control information of a PostgreSQL database cluster
    * [pg\_ctl](app-pg-ctl.html) — initialize, start, stop, or control a PostgreSQL server
    * [pg\_resetwal](app-pgresetwal.html) — reset the write-ahead log and other control information of a PostgreSQL database cluster
    * [pg\_rewind](app-pgrewind.html) — synchronize a PostgreSQL data directory with another data directory that was forked from it
    * [pg\_test\_fsync](pgtestfsync.html) — determine fastest `wal_sync_method` for PostgreSQL
    * [pg\_test\_timing](pgtesttiming.html) — measure timing overhead
    * [pg\_upgrade](pgupgrade.html) — upgrade a PostgreSQL server instance
    * [pg\_waldump](pgwaldump.html) — display a human-readable rendering of the write-ahead log of a PostgreSQL database cluster
    * [postgres](app-postgres.html) — PostgreSQL database server

***

|                                                                         |                                                       |                                           |
| :---------------------------------------------------------------------- | :---------------------------------------------------: | ----------------------------------------: |
| [Prev](archive-module-callbacks.html "51.2. Archive Module Callbacks")  |  [Up](index.html "PostgreSQL 17devel Documentation")  |  [Next](sql-commands.html "SQL Commands") |
| 51.2. Archive Module Callbacks                                          | [Home](index.html "PostgreSQL 17devel Documentation") |                              SQL Commands |
