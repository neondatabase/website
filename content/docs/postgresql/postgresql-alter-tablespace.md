---
title: 'PostgreSQL ALTER TABLESPACE'
redirectFrom: 
            - /docs/postgresql/postgresql-administration/postgresql-alter-tablespace/
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the **PostgreSQL ALTER TABLESPACE** statement to rename, change the owner, or set parameters for a tablespace.



## Introduction to ALTER TABLESPACE statement



After [creating a tablespace](https://www.postgresqltutorial.com/postgresql-administration/postgresql-create-tablespace/ "PostgreSQL creating tablespace"), you can change its definition by using the `ALTER TABLESPACE` statement as follows:



```
ALTER TABLESPACE tablespace_name
action;
```



The action can be:



- Rename the tablespace
- Change the owner
- Set the parameters for the tablespace.


To rename the tablespace, you use the `ALTER TABLESPACE RENAME TO` statement:



```
ALTER TABLESPACE tablespace_name
RENAME TO new_name;
```



To change the owner of the tablespace, you use the `ALTER TABLESPACE OWNER TO` statement:



```
ALTER TABLESPACE tablespace_name
OWNER TO new_owner;
```



The following statement changes the parameters for a tablespace:



```
ALTER TABLESPACE tablespace_name
SET parameter_name = value;
```



Only superusers or tablespace owners can execute the `ALTER TABLESPACE` statement.



## PostgreSQL ALTER TABLESPACE examples



The following statement changes `dvdrental` tablespace to `dvdrental_raid`:



```
ALTER TABLESPACE dvdrental
RENAME TO dvdrental_raid;
```



The following statement changes the owner of the `dvdrental_raid` from `postgres`to `hr`:



```
ALTER TABLESPACE dvdrental_raid
OWNER to hr;
```



## Summary



- Use `ALTER TABLESPACE RENAME TO` statement to rename a tablespace.
- Use `ALTER TABLESPACE OWNER TO` to change the owner of a tablespace.
- Use `ALTER TABLESPACE SET` to set the parameters for a tablespace.
