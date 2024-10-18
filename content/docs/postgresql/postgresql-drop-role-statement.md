---
title: 'PostgreSQL DROP ROLE Statement'
redirectFrom: 
            - /docs/postgresql/postgresql-administration/postgresql-drop-role/
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `DROP ROLE` statement to remove a role.



## Introduction to PostgreSQL DROP ROLE statement



The `DROP ROLE` statement allows you to delete a [role](https://www.postgresqltutorial.com/postgresql-administration/postgresql-roles/):



```
DROP ROLE [IF EXISTS] target_role;
```



In this syntax:



- First, specify the name of the role that you want to remove after the `DROP ROLE` keywords.
- Second, use the `IF EXISTS` option to conditionally remove the role only if it exists.


To remove a superuser role, you need to be a superuser. To drop non-superuser roles, you need to have the `CREATEROLE` privilege.



When you remove a role referenced in any database, PostgreSQL will raise an error. In this case, you need to take two steps:



- First, either remove the database objects owned by the role using the `DROP OWNED` statement or reassign the ownership of the database objects to another role `REASSIGN OWNED`.
- Second, revoke any privileges granted to the role.


The `REASSIGN OWNED` statement reassigns the ownership of all dependent objects of a target role to another role. Because the `REASSIGN OWNED` statement can only access objects in the current database, you need to execute this statement in each database that contains objects owned by the target role.



After transferring the ownership of objects to another role, you need to drop any remaining objects owned by the target role by executing the `DROP OWNED` statement in each database that contains objects owned by the target role.



In other words, you should execute the following statements in sequence to drop a role:



```
-- execute these statements in the database that contains
-- the object owned by the target role
REASSIGN OWNED BY target_role TO another_role;

DROP OWNED BY target_role;

-- drop the role
DROP ROLE target_role;
```



## PostgreSQL DROP ROLE statement example



Let's take an example of how to use the `DROP ROLE` statement:



- First, create a new role called `alice`
- Second, use the `alice` role to create a table called `customers`.
- Third, remove the role `alice`.


We'll use the psql client tool. But, you can use any client tool of your choice.



### Step 1. Setting a new role and database



First, open the Command Prompt on Windows or Terminal on Linux and log in to PostgreSQL using the `postgres` role:



```
psql -U postgres
```



Second, create a new database called sales:



```
CREATE DATABASE sales;
```



Third, create a new role called `alice`:



```
create role alice
with login
password 'Password';
```



Replace the `Password` with the actual one.



Fourth, grant `createdb` privilege to `alice`:



```
alter role alice createdb;
```



Fifth, grant all privileges on the `sales` database to `alice`:



```
grant all privileges on database sales to alice;
```



Sixth, switch the current database to sales:



```
\c sales
```



Sixth, grant all privileges of the `public` schema database to `alice`:



```
grant all on schema public to alice;
```



Finally, exit the current session:



```
\q
```



### Step 2. Using the new role to create database objects



First, log in to the PostgreSQL server using the `alice` role:



```
psql -U alice -W sales
```



Second, [create a new table](/docs/postgresql/postgresql-create-table) in the `sales` database:



```
create table customers(
    customer_id int generated always as identity,
    customer_name varchar(150) not null,
    primary key(customer_id)
);
```



Third, [show the table list](https://www.postgresqltutorial.com/postgresql-administration/postgresql-show-tables/) in the `sales` database:



```
\dt
```



Output:



```
        List of relations
Schema |   Name    | Type  | Owner
--------+-----------+-------+-------
public | customers | table | alice
(1 row)
```



Finally, quit the current session:



```
\q
```



### Step 3. Removing the role alice



First, log in to the PostgreSQL server using the `postgres` role:



```
psql -U postgres
```



Second, attempt to drop the role `alice`:



```
drop role alice;
```



PostgreSQL issued the following error:



```
ERROR:  role "alice" cannot be dropped because some objects depend on it
DETAIL:  privileges for database sales
3 objects in database sales
```



The role `alice` cannot be dropped because it has dependent objects.



Third, switch to the `sales` database:



```
\c sales
```



Fourth, reassign owned objects of `alice` to `postgres`:



```
reassign owned by alice to postgres;
```



Fifth, drop owned objects by `alice`:



```
drop owned by alice;
```



Sixth, drop the role `alice`:



```
drop role alice;
```



Seventh, list the current roles:



```
\du
```



You will see that the role `alice` has been removed.



Finally, quit the current session:



```
\q
```



## Summary



- Use the PostgreSQL `DROP ROLE` statement to remove a role.
- If a role has dependent objects, use the `REASSIGN OWNED` and `DROP OWNED` statements in sequence to remove dependent objects of the role before executing the `DROP ROLE` statement.
