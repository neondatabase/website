---
title: 'PostgreSQL DROP SCHEMA Statement'
redirectFrom: 
            - /docs/postgresql/postgresql-administration/postgresql-drop-schema/
ogImage: /postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-DROP-Schema.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `DROP SCHEMA` statement to delete a schema and its objects.



## Introduction to PostgreSQL DROP SCHEMA statement



The `DROP SCHEMA` removes a [schema](https://www.postgresqltutorial.com/postgresql-administration/postgresql-schema/) and all of its objects from a database. The following illustrates the syntax of the `DROP SCHEMA` statement:



```
DROP SCHEMA [IF EXISTS] schema_name
[ CASCADE | RESTRICT ];
```



In this syntax:



- First, specify the name of the schema from which you want to remove after the `DROP SCHEMA` keywords.
- Second, use the `IF EXISTS` option to conditionally delete schema only if it exists.
- Third, use `CASCADE` to delete schema and all of its objects, and in turn, all objects that depend on those objects. If you want to delete schema only when it is empty, you can use the `RESTRICT` option. By default, the `DROP SCHEMA` uses the `RESTRICT` option.


To execute the `DROP SCHEMA` statement, you must be the owner of the schema that you want to drop or a superuser.



PostgreSQL allows you to drop multiple schemas at the same time by using a single `DROP SCHEMA` statement:



```
DROP SCHEMA [IF EXISTS] schema_name1 [,schema_name2,...]
[CASCADE | RESTRICT];
```



## PostgreSQL DROP SCHEMA statement examples



Note that the following examples use schemas created in the `CREATE SCHEMA` tutorial with some modifications in the [`ALTER SCHEMA`](https://www.postgresqltutorial.com/postgresql-administration/postgresql-alter-schema/) tutorial.



![PostgreSQL DROP Schema](/postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-DROP-Schema.png)



### 1) Using the DROP SCHEMA statement to remove an empty schema example



This example uses the `DROP SCHEMA` statement to remove the accounting schema:



```
DROP SCHEMA IF EXISTS accounting;
```



To refresh the schemas in the list, right-click the Schemas node and select the Refresh menu item:



![PostgreSQL DROP Schema - drop empty schema example](/postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-DROP-Schema-drop-empty-schema-example.png)



![PostgreSQL DROP Schema - drop empty schema example result](/postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-DROP-Schema-drop-empty-schema-example-result.png)



### 2) Using the DROP SCHEMA statement to drop multiple schemas example



The following example uses the `DROP SCHEMA` statement to drop multiple schemas `finance` and `marketing` using a single statement:



```
DROP SCHEMA IF EXISTS finance, marketing;
```



![PostgreSQL DROP Schema - drop multiple schemas](/postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-DROP-Schema-drop-multiple-schemas.png)



### 3) Using `DROP SCHEMA` statement to remove non-empty schema examples



This statement drops the `scm` schema:



```
DROP SCHEMA scm;
```



Here are the messages:



```
ERROR:  cannot drop schema scm because other objects depend on it
DETAIL:  table scm.deliveries depends on schema scm
view scm.delivery_due_list depends on schema scm
HINT:  Use DROP ... CASCADE to drop the dependent objects too.
SQL state: 2BP01
```



So, if the schema is not empty and you want to remove the schema and its objects, you must use the `CASCADE` option:



```
DROP SCHEMA scm CASCADE;
```



![PostgreSQL DROP Schema - drop a non-empty schema](/postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-DROP-Schema-drop-a-non-empty-schema.png)



Similarly, you can drop the `sales` schema and its objects using the following statement:



```
DROP SCHEMA sales CASCADE;
```



![PostgreSQL DROP Schema - drop a non-empty schema example](/postgresqltutorial_data/wp-content-uploads-2019-05-PostgreSQL-DROP-Schema-drop-a-non-empty-schema-example.png)



## Summary



- Use the PostgreSQL `DROP SCHEMA` statement to drop one or more schemas in a database.
