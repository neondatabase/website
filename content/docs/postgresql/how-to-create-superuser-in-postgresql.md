---
title: 'How to Create Superuser in PostgreSQL'
redirectFrom: 
            - /docs/postgresql/postgresql-administration/create-superuser-postgresql/
tableOfContents: true
---


**Summary**: in this tutorial, you will learn about PostgreSQL superusers and how to create them using the `CREATE` `ROLE` statement.





## Introduction to PostgreSQL superuser





In PostgreSQL, a superuser is a special role with the highest privileges. A superuser has full access to all databases and tables. Additionally, it can perform administrative tasks such as [creating databases](https://www.postgresqltutorial.com/postgresql-administration/postgresql-create-database/), [dropping databases](https://www.postgresqltutorial.com/postgresql-administration/postgresql-drop-database/), [managing user roles](https://www.postgresqltutorial.com/postgresql-administration/postgresql-roles/), modifying database configuration, and so on.





In other words, a superuser can bypass all security checks except the right to log in.





By default, PostgreSQL has a superuser role called `postgres`. Typically, you use the `postgres` user role for performing administrative tasks and don't need to create additional users with the superuser privilege.





However, if you need additional superuser roles, you can create them using the `CREATE ROLE` statement or change a regular user to a superuser using the `ALTER ROLE` statement.





### Creating new superusers





First, connect to the PostgreSQL database using a client such as `psql`:





```
psql -U postgres
```





Second, execute the following `CREATE ROLE` command to create a superuser:





```
CREATE ROLE username SUPERUSER;
```





You need to replace `username` with your desired username for the superuser. For example:





```
CREATE ROLE spiderman SUPERUSER
LOGIN
PASSWORD 'moreSecurePass';
```





Third, verify the user creation:





```
\du spiderman
```





Output:





```
     List of roles
 Role name | Attributes
-----------+------------
 spiderman | Superuser
```





The output indicates that `spiderman` role is a superuser.





### Changing a user to a superuser





It's possible to change a user to a superuser using the `ALTER` `ROLE` statement.





First, create a regular role with a login privilege and a password:





```
CREATE ROLE batman LOGIN PASSWORD 'moreSecurePass';
```





Second, make the `batman` role become a superuser using the `ALTER` `ROLE` statement:





```
ALTER ROLE batman SUPERUSER;
```





Third, verify the user modification:





```
\du batman
```





Output:





```
     List of roles
 Role name | Attributes
-----------+------------
 batman    | Superuser
```





### Revoking superuser from a user





To revoke a superuser status of a user, you can use the following `ALTER` `ROLE` statement:





```
ALTER USER username NOSUPERUSER;
```





For example, the following statement revokes the `SUPERUSER` status from the `spiderman` role:





```
ALTER USER spiderman NOSUPERUSER;
```





You can verify the `spiderman` role as follows:





```
\du spiderman
```





Output:





```
     List of roles
 Role name | Attributes
-----------+------------
 spiderman |
```





## Summary





- 
- In PostgreSQL, a superuser bypass all permission checks except the permission to log in.
- 
-
- 
- Use the `CREATE ROLE...SUPERUSER` statement to create a superuser.
- 
-
- 
- Use the `ALTER ROLE...SUPERUSER` statement to make a role a superuser.
- 
-
- 
- Use the `ALTER ROLE...NOSUPERUSER` statement to revoke the superuser from a user.
- 

