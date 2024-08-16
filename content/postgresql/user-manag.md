[#id](#USER-MANAG)

## Chapter 22. Database Roles

**Table of Contents**

- [22.1. Database Roles](database-roles)
- [22.2. Role Attributes](role-attributes)
- [22.3. Role Membership](role-membership)
- [22.4. Dropping Roles](role-removal)
- [22.5. Predefined Roles](predefined-roles)
- [22.6. Function Security](perm-functions)

PostgreSQL manages database access permissions using the concept of _roles_. A role can be thought of as either a database user, or a group of database users, depending on how the role is set up. Roles can own database objects (for example, tables and functions) and can assign privileges on those objects to other roles to control who has access to which objects. Furthermore, it is possible to grant _membership_ in a role to another role, thus allowing the member role to use privileges assigned to another role.

The concept of roles subsumes the concepts of “users” and “groups”. In PostgreSQL versions before 8.1, users and groups were distinct kinds of entities, but now there are only roles. Any role can act as a user, a group, or both.

This chapter describes how to create and manage roles. More information about the effects of role privileges on various database objects can be found in [Section 5.7](ddl-priv).
