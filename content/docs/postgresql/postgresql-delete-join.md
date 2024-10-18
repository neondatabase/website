---
title: 'PostgreSQL DELETE JOIN'
redirectFrom: 
            - /docs/postgresql/postgresql-delete-join
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `DELETE` statement to emulate delete join operations.



## Introduction to PostgreSQL DELETE statement with USING clause



PostgreSQL does not support the [DELETE JOIN statement like MySQL](https://www.mysqltutorial.org/mysql-basics/mysql-delete-join/). Instead, it offers the `USING` clause in the `DELETE` statement that provides similar functionality to the `DELETE JOIN`.



Here's the syntax of the `DELETE USING` statement:



```
DELETE FROM table1
USING table2
WHERE condition
RETURNING returning_columns;
```



In this syntax:



- First, specify the name of the table (`table1`) from which you want to delete data after the `DELETE FROM` keywords
- -
- Second, provide a table (`table2`) to join with the main table after the `USING` keyword.
- -
- Third, define a condition in the `WHERE` clause for joining two tables.
- -
- Finally, return the deleted rows in the `RETURNING` clause. The `RETURNING` clause is optional.
- 


For example, the following statement uses the `DELETE` statement with the `USING` clause to delete data from `t1` that has the same id as `t2`:



```
DELETE FROM t1
USING t2
WHERE t1.id = t2.id
```



## PostgreSQL DELETE JOIN examples



Let's explore some examples of using the `DELETE USING` statement.



### Setting up sample tables



The following statements create `member` and `denylist` tables and insert some sample data into them:



```
CREATE TABLE member(
   id SERIAL PRIMARY KEY,
   first_name VARCHAR(50) NOT NULL,
   last_name VARCHAR(50) NOT NULL,
   phone VARCHAR(15) NOT NULL
);


CREATE TABLE denylist(
    phone VARCHAR(15) PRIMARY KEY
);


INSERT INTO member(first_name, last_name, phone)
VALUES ('John','Doe','(408)-523-9874'),
       ('Jane','Doe','(408)-511-9876'),
       ('Lily','Bush','(408)-124-9221');


INSERT INTO denylist(phone)
VALUES ('(408)-523-9874'),
       ('(408)-511-9876');

SELECT * FROM member;

SELECT * FROM denylist;
```



The member table:



```
 id | first_name | last_name |     phone
----+------------+-----------+----------------
  1 | John       | Doe       | (408)-523-9874
  2 | Jane       | Doe       | (408)-511-9876
  3 | Lily       | Bush      | (408)-124-9221
(3 rows)
```



The denylist table:



```
     phone
----------------
 (408)-523-9874
 (408)-511-9876
(2 rows)
```



### 1) Basic PostgreSQL delete join example



The following statement deletes rows in the `members` table with the phone number exists in the `denylist` table:



```
DELETE FROM member
USING denylist
WHERE member.phone = denylist.phone;
```



Output:



```
DELETE 2
```



The output indicates that the `DELETE` statement has deleted two rows from the `member` table.



Verify the deletion by retrieving data from the `contacts` table:



```
SELECT * FROM member;
```



Output:



```
 id | first_name | last_name |     phone
----+------------+-----------+----------------
  3 | Lily       | Bush      | (408)-124-9221
(1 row)
```



### 2) Delete join using a subquery example



The `USING` clause is not a part of the SQL standard, meaning that it may not be available in other database systems.



If you intend to ensure compatibility with various database products, you should avoid using the `USING` clause in the `DELETE` statement. Instead, you may consider using a [subquery](/docs/postgresql/postgresql-subquery).



The following statement uses the `DELETE` statement to delete all rows from the member table whose phones are in the `denylist` table:



```
DELETE FROM member
WHERE phone IN (
    SELECT
      phone
    FROM
      denylist
);
```



In this example:



- First, the subquery returns a list of phones from the `denylist` table.
- -
- Second, the `DELETE` statement deletes rows in the member table whose values in the phone column are in the list of phones returned by the subquery.
- 


## Summary



- Use the `DELETE USING` statement or a subquery to emulate the `DELETE JOIN` operation.
- 
