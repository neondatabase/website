<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->

|                           Chapter 22. Database Roles                          |                                                    |                                 |                                                       |                                                     |
| :---------------------------------------------------------------------------: | :------------------------------------------------- | :-----------------------------: | ----------------------------------------------------: | --------------------------------------------------: |
| [Prev](client-authentication-problems.html "21.15. Authentication Problems")  | [Up](admin.html "Part III. Server Administration") | Part III. Server Administration | [Home](index.html "PostgreSQL 17devel Documentation") |  [Next](database-roles.html "22.1. Database Roles") |

***

## Chapter 22. Database Roles

**Table of Contents**

  * *   [22.1. Database Roles](database-roles.html)
  * [22.2. Role Attributes](role-attributes.html)
  * [22.3. Role Membership](role-membership.html)
  * [22.4. Dropping Roles](role-removal.html)
  * [22.5. Predefined Roles](predefined-roles.html)
  * [22.6. Function Security](perm-functions.html)

PostgreSQL manages database access permissions using the concept of *roles*. A role can be thought of as either a database user, or a group of database users, depending on how the role is set up. Roles can own database objects (for example, tables and functions) and can assign privileges on those objects to other roles to control who has access to which objects. Furthermore, it is possible to grant *membership* in a role to another role, thus allowing the member role to use privileges assigned to another role.

The concept of roles subsumes the concepts of “users” and “groups”. In PostgreSQL versions before 8.1, users and groups were distinct kinds of entities, but now there are only roles. Any role can act as a user, a group, or both.

This chapter describes how to create and manage roles. More information about the effects of role privileges on various database objects can be found in [Section 5.7](ddl-priv.html "5.7. Privileges").

***

|                                                                               |                                                       |                                                     |
| :---------------------------------------------------------------------------- | :---------------------------------------------------: | --------------------------------------------------: |
| [Prev](client-authentication-problems.html "21.15. Authentication Problems")  |   [Up](admin.html "Part III. Server Administration")  |  [Next](database-roles.html "22.1. Database Roles") |
| 21.15. Authentication Problems                                                | [Home](index.html "PostgreSQL 17devel Documentation") |                                22.1. Database Roles |
