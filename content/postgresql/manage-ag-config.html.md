<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                  23.4. Database Configuration                  |                                                                |                                |                                                       |                                                              |
| :------------------------------------------------------------: | :------------------------------------------------------------- | :----------------------------: | ----------------------------------------------------: | -----------------------------------------------------------: |
| [Prev](manage-ag-templatedbs.html "23.3. Template Databases")  | [Up](managing-databases.html "Chapter 23. Managing Databases") | Chapter 23. Managing Databases | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](manage-ag-dropdb.html "23.5. Destroying a Database") |

***

## 23.4. Database Configuration [#](#MANAGE-AG-CONFIG)

Recall from [Chapter 20](runtime-config.html "Chapter 20. Server Configuration") that the PostgreSQL server provides a large number of run-time configuration variables. You can set database-specific default values for many of these settings.

For example, if for some reason you want to disable the GEQO optimizer for a given database, you'd ordinarily have to either disable it for all databases or make sure that every connecting client is careful to issue `SET geqo TO off`. To make this setting the default within a particular database, you can execute the command:

    ALTER DATABASE mydb SET geqo TO off;

This will save the setting (but not set it immediately). In subsequent connections to this database it will appear as though `SET geqo TO off;` had been executed just before the session started. Note that users can still alter this setting during their sessions; it will only be the default. To undo any such setting, use `ALTER DATABASE dbname RESET varname`.

***

|                                                                |                                                                |                                                              |
| :------------------------------------------------------------- | :------------------------------------------------------------: | -----------------------------------------------------------: |
| [Prev](manage-ag-templatedbs.html "23.3. Template Databases")  | [Up](managing-databases.html "Chapter 23. Managing Databases") |  [Next](manage-ag-dropdb.html "23.5. Destroying a Database") |
| 23.3. Template Databases                                       |      [Home](index.html "PostgreSQL 17devel Documentation")     |                                  23.5. Destroying a Database |
