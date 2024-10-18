---
title: 'PostgreSQL Schema'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-administration/postgresql-schema/
ogImage: ./img/wp-content-uploads-2019-05-PostgreSQL-Schema-Example.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about PostgreSQL schema and how to use the schema search path to resolve objects in schemas.



## Introduction to PostgreSQL schema



In PostgreSQL, a schema is a named collection of database objects, including tables, [views](https://www.postgresqltutorial.com/postgresql-views/), [indexes](https://www.postgresqltutorial.com/postgresql-indexes/), [data types](/docs/postgresql/postgresql-data-types/), [functions](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-create-function/), [stored procedures](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-create-procedure), and operators.



A schema allows you to organize and namespace database objects within a database.



To access an object in a schema, you need to qualify the object by using the following syntax:



```
schema_name.object_name
```



A database may contain one or more schemas. However, a schema belongs to only one database. Additionally, two schemas can have different objects that share the same name.



For example, you may have `sales` schema that has `staff` table and the `public` schema which also has the `staff` table. When you refer to the `staff` table you must qualify it as follows:



```
public.staff
```



Or



```
sales.staff
```



Schemas can be very useful in the following scenarios:



- - Schemas allow you to organize database objects e.g., tables into logical groups to make them more manageable.
- -
- - Schemas enable multiple users to use one database without interfering with each other.
- 


## The public schema



PostgreSQL automatically creates a schema called `public` for every new database. Whatever object you create without specifying the schema name, PostgreSQL will place it into this `public` schema. Therefore, the following statements are equivalent:



```
CREATE TABLE table_name(
  ...
);
```



and



```
CREATE TABLE public.table_name(
   ...
);
```



## The schema search path



In practice, you will refer to a table without its schema name e.g., `staff` table instead of a fully qualified name such as `sales.staff` table.



When you reference a table using its name only, PostgreSQL searches for the table by using the **schema search path**, which is a list of schemas to look in.



PostgreSQL will access the first matching table in the schema search path. If there is no match, it will return an error, even if the name exists in another schema in the database.



The first schema in the search path is called the current schema. Note that when you create a new object without explicitly specifying a schema name, PostgreSQL will also use the current schema for the new object.



The `current_schema()` function returns the current schema:



```
SELECT current_schema();
```



Here is the output:



```
 current_schema
----------------
public
(1 row)
```



This is why PostgreSQL uses `public` for every new object that you create.



To view the current search path, you use the `SHOW` command in `psql` tool:



```
SHOW search_path;
```



The output is as follows:



```
 search_path
-----------------
"$user", public
(1 row)
```



In this output:



- - The `"$user"` specifies that the first schema that PostgreSQL will use to search for the object, which has the same name as the current user. For example, if you use the `postgres` user to log in and access the `staff` table. PostgreSQL will search for the `staff` table in the `postgres` schema. If it cannot find any object like that, it continues to look for the object in the `public` schema.
- -
- - The second element refers to the `public` schema as we have seen before.
- 


To create a new schema, you use the `CREATE SCHEMA` statement:



```
CREATE SCHEMA sales;
```



To add the new schema to the search path, you use the following command:



```
SET search_path TO sales, public;
```



Now, if you create a new table named `staff` without specifying the schema name, PostgreSQL will put this `staff` table into the `sales` schema:



```
CREATE TABLE staff(
    staff_id SERIAL PRIMARY KEY,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);
```



The following picture shows the new schema `sales` and the `staff` table that belongs to the `sales` schema:



![PostgreSQL Schema Example](./img/wp-content-uploads-2019-05-PostgreSQL-Schema-Example.png)



To access the `staff` table in the `sales` schema you can use one of the following statements:



```
SELECT * FROM staff;
```



and



```
SELECT * FROM sales.staff;
```



The `public` schema is the second element in the search path, so to access the `staff` table in the public schema, you must qualify the table name as follows:



```
SELECT * FROM public.staff;
```



If you use the following command, you will need to explicitly refer to objects in the `public` schema using a fully qualified name:



```
SET search_path TO public;
```



The `public` schema is not a special schema, therefore, you can [drop](https://www.postgresqltutorial.com/postgresql-administration/postgresql-drop-schema/) it too.



## PostgreSQL schemas and privileges



Users can only access objects in the schemas that they own. It means they cannot access any objects in the schemas that do not belong to them.



To allow users to access the objects in the schema that they do not own, you must grant the `USAGE` privilege of the schema to the users:



```
GRANT USAGE ON SCHEMA schema_name
TO role_name;
```



To allow users to create objects in the schema that they do not own, you need to grant them the `CREATE` privilege of the schema to the users:



```
GRANT CREATE ON SCHEMA schema_name
TO user_name;
```



Note that, by default, every user has the `CREATE` and `USAGE` on the `public` schema.



## PostgreSQL schema operations



- - To create a new schema, you use the `CREATE SCHEMA` statement.
- -
- - To rename a schema or change its owner, you use the `ALTER SCHEMA` statement.
- -
- - To drop a schema, you use the `DROP SCHEMA` statement.
- 


## Summary



- - A schema is a named collection of database objects, including tables, views, indexes, sequences, and so on.
- -
- - Use schemas to organize and namespace these objects within a database.
- -
- - Use the search path to resolve object names.
- 
