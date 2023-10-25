

|                 22.6. Function Security                 |                                                    |                            |                                                       |                                                                   |
| :-----------------------------------------------------: | :------------------------------------------------- | :------------------------: | ----------------------------------------------------: | ----------------------------------------------------------------: |
| [Prev](predefined-roles.html "22.5. Predefined Roles")  | [Up](user-manag.html "Chapter 22. Database Roles") | Chapter 22. Database Roles | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](managing-databases.html "Chapter 23. Managing Databases") |

***

## 22.6. Function Security [#](#PERM-FUNCTIONS)

Functions, triggers and row-level security policies allow users to insert code into the backend server that other users might execute unintentionally. Hence, these mechanisms permit users to “Trojan horse” others with relative ease. The strongest protection is tight control over who can define objects. Where that is infeasible, write queries referring only to objects having trusted owners. Remove from `search_path` any schemas that permit untrusted users to create objects.

Functions run inside the backend server process with the operating system permissions of the database server daemon. If the programming language used for the function allows unchecked memory accesses, it is possible to change the server's internal data structures. Hence, among many other things, such functions can circumvent any system access controls. Function languages that allow such access are considered “untrusted”, and PostgreSQL allows only superusers to create functions written in those languages.

***

|                                                         |                                                       |                                                                   |
| :------------------------------------------------------ | :---------------------------------------------------: | ----------------------------------------------------------------: |
| [Prev](predefined-roles.html "22.5. Predefined Roles")  |   [Up](user-manag.html "Chapter 22. Database Roles")  |  [Next](managing-databases.html "Chapter 23. Managing Databases") |
| 22.5. Predefined Roles                                  | [Home](index.html "PostgreSQL 17devel Documentation") |                                    Chapter 23. Managing Databases |
