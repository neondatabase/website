---
title: 'PostgreSQL CURRENT_USER'
redirectFrom: 
            - /docs/postgresql/postgresql-administration/postgresql-current_user/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CURRENT_USER` function to return the name of the currently logged-in database user.





## Introduction to the PostgreSQL CURRENT_USER function





The PostgreSQL `CURRENT_USER` is a function that returns the name of the currently logged-in database user.





Here's the syntax of the `CURRENT_USER` function:





```
CURRENT_USER
```





The function returns the name of the current effective user within the session.





In other words, if you use the `SET ROLE` statement to change the role of the current user to the new one, the `CURRENT_USER` will reflect the new role.





In PostgreSQL, a role with the `LOGIN` attribute represents a user. Therefore, we use the terms role and user interchangeably.





To get the original user who connected to the session, you use the `SESSION_USER` function.





## PostgreSQL CURRENT_USER function example





First, open the command prompt on Windows or a terminal on Unix-like systems and connect to the PostgreSQL server using psql:





```
psql -U postgres
```





Second, use the `CURRENT_USER` function to get the currently logged-in user:





```
SELECT CURRENT_USER;
```





Output:





```
 current_user
--------------
 postgres
(1 row)
```





Third, [create a new role](https://www.postgresqltutorial.com/postgresql-administration/postgresql-roles/) called `bob`:





```
CREATE ROLE bob
WITH LOGIN PASSWORD 'SecurePass1';
```





Fourth, change the role of the current user to `bob`:





```
SET ROLE bob;
```





Fifth, execute the `CURRENT_USER` function:





```
SELECT CURRENT_USER;
```





It returns `bob` instead:





```
 current_user
--------------
 bob
(1 row)
```





Six, use the `SESSION_USER` function to retrieve the original user who connected to the session:





```
SELECT SESSION_USER;
```





Output:





```
 session_user
--------------
 postgres
(1 row)
```





The `SESSION_USER` function returns `postgres`, not `bob`.





## Summary





- 
- Use the `CURRENT_USER` function to return the current effective user within the session.
- 
-
- 
- Use the `SESSION_USER` function to return the original user who connected to the session.
- 


