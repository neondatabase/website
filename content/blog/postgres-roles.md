---
title: 'Postgres Roles: What to Know Before You Begin'
description: Practical tips for developers (and gotchas to avoid)
excerpt: >-
  You’re building your app on top of Postgres. Stellar idea. You’ve created a
  Postgres database, the initial tables, and even seeded the initial data.
  Nothing is going to stop you n… Roles. Roles will stop you now. Roles in
  Postgres are one of those things that look oh-so-simple fr...
date: '2024-07-12T15:56:07'
updatedOn: '2024-07-15T12:40:35'
category: postgres
categories:
  - postgres
authors:
  - daniel-price
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/postgres-roles/cover.jpg'
  alt: null
isFeatured: false
seo:
  title: 'Postgres Roles: What to Know Before You Begin - Neon'
  description: >-
    A practical guide for application developers who might be unfamiliar with
    the inner workings of Postgres roles and privileges.
  keywords: []
  noindex: false
  ogTitle: 'Postgres Roles: What to Know Before You Begin - Neon'
  ogDescription: >-
    A practical guide for application developers who might be unfamiliar with
    the inner workings of Postgres roles and privileges.
  image: 'https://cdn.neonapi.io/public/images/pages/blog/postgres-roles/social.jpg'
source:
  wpId: 6406
  wpSlug: postgres-roles
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-roles/neon-roles-1-1024x576-63177e35.jpg)

You’re building your app on top of Postgres. Stellar idea. You’ve created a Postgres database, the initial tables, and even [seeded the initial data](https://neon.tech/blog/database-testing-with-fixtures-and-seeding).

Nothing is going to stop you n… **Roles**. Roles will stop you now.

Roles in Postgres are one of those things that look oh-so-simple from the outside (after all, the [docs are barely anything](https://www.postgresql.org/docs/current/database-roles.html)) but are the bane of existence for anyone who has used Postgres for anything significant. As [one HN commenter](https://news.ycombinator.com/item?id=40194575) put it:

> **“There is a ton of power there, it would be amazing to use it. Making it work feels like black magic. Every bit of the interface around it just seems like esoteric incantations that may or may not do what you expect”**

It’s not quite voodoo, but we see their point. Here, we want to provide a practical guide for application developers who might be unfamiliar with the inner workings of Postgres and the way roles and privileges work within the system.

## A quick primer on RBAC and a Postgres quirk

Most application developers will have at least a passing familiarity with role-based access control. The basic concept is that users are assigned roles, and roles are granted permissions to perform actions or access specific resources. This model provides a flexible and scalable way to manage access control in complex systems.

In Postgres, this concept is implemented with a twist. Unlike many other systems where users and roles are separate entities, in Postgres, _“_ [now there are only roles](https://www.postgresql.org/docs/8.1/user-manag.html#:~:text=now%20there%20are%20only%20roles)_.”_

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-roles/screenshot-2024-07-12-at-83932percente2percent80percentafam-1022x1024-e8a1ddcd.png)

This will seem weird because, well, you seem to be able to log in as a user in Postgres. If Postgres doesn’t have users, how are you a user?

Any role in Postgres can be granted the ability to log in. When a role has this capability, it effectively becomes what we traditionally think of as a user. This is typically done with:

```sql
CREATE ROLE username LOGIN
```

Now you can log in with that role, and it looks like a user. To complicate matters, you can also use:

```bash
CREATE USER username
```

But this is just a holdover from previous Postgres versions–`CREATE USER` is a wrapper around the first command.

_**Note**: In case you want to run these commands in Neon, you’ll also have to specify a password when creating a role (`CREATE ROLE <name> PASSWORD 'password';`). We like things extra secure 👮_

So, when you “log in as a user” in Postgres, you’re actually logging in as a role that has been granted the `LOGIN` attribute 🤯. This unified approach to roles and users offers excellent flexibility but can also lead to confusion, especially for those coming from systems with more traditional user/group distinctions. For example:

1. A single entity can act both as a “user” (by having login privileges) and as a “group” (by having other roles as members).
2. Privilege management becomes more complex as you must consider both directly granted privileges and those inherited through role membership.
3. The concept of “ownership” becomes more nuanced, as any role (whether it can log in or not) can own database objects.

That all leads to more questions.

### What’s a group in Postgres?

A group is a role without the `LOGIN` privilege. It’s used to organize and manage permissions for multiple roles at once. Here’s how it works:

- You create a role without the `LOGIN` privilege (often called a “group role”).
- You then grant this role to other roles (users).
- Any privileges granted to the group role are inherited by all roles that are members of it.

For example:

```sql
CREATE ROLE developers;  -- This is a "group"
CREATE ROLE alice LOGIN;
CREATE ROLE bob LOGIN;
GRANT developers TO alice, bob;
```

### What’s a privilege in Postgres?

A privilege in Postgres is a permission to perform a specific action on a database object. These are the `ALL CAPS` words SQL loves so much. Common privileges include:

- `SELECT` to read data from a table
- `INSERT` to add new data to a table
- `UPDATE` to modify existing data in a table
- `DELETE` to remove data from a table
- `EXECUTE` to run a function or procedure
- `CREATE` to create new objects within a schema

Privileges are granted using the [`GRANT`](https://www.postgresql.org/docs/current/sql-grant.html) command, for example:

```sql
GRANT SELECT, INSERT ON mytable TO developers;
```

### What’s inheritance in Postgres?

Inheritance is the automatic acquisition of privileges and attributes from one role by another. When a role is granted to another role, the member role inherits all the privileges of the group role.

If we have:

```sql
CREATE ROLE managers;
GRANT SELECT ON sensitive_data TO managers;
CREATE ROLE carol LOGIN;
GRANT managers TO carol;
```

Carol will inherit the `SELECT privilege on sensitive_data`, even though it wasn’t directly granted to her.

### What’s a database object in Postgres?

A database object in Postgres is any named entity that can be created in a database: tables, views, sequences, functions, procedures, schemas, indexes, triggers. Each of these objects can have owners and privileges associated with them.

## The layering of objects

OK, so far there is a lot to think about–roles, privileges, objects–but these concepts are not wildly complicated. But once you start to think about how these interact, you can begin to come across issues that cause headaches.

Postgres has a hierarchical structure for its objects:

1. **Cluster level**: At the top, we have the Postgres cluster, which can contain multiple databases.
2. **Database level:** Within a cluster, we have databases. Each database is a separate environment with its own set of schemas, roles, and objects.
3. **Schema level:** Inside each database, we have schemas. A schema is a namespace containing database objects like tables, views, and functions.
4. **Object level:** Within schemas, we have the actual database objects like tables, views, functions, etc.
5. **Table level:** Within tables, columns, and rows can have specific privileges.

A role needs privileges at each level of the hierarchy to access an object. For example, to SELECT from a table, a role needs:

- CONNECT privilege on the database
- USAGE privilege on the schema
- SELECT privilege on the table itself

Let’s work through an example and how this can trip you up.

Imagine you’re setting up a new application with a customer management system. You’ve created a database called `customer_db`, a schema called sales, and a table called `customer_info`. You’ve also created roles for your sales and analytics teams.

Here’s the setup:

```sql
CREATE DATABASE customer_db;
\c customer_db

CREATE SCHEMA sales;
CREATE TABLE sales.customer_info (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,
    purchase_amount DECIMAL
);

CREATE ROLE sales_team;
CREATE ROLE analytics_team;

-- Grant connect to both roles
GRANT CONNECT ON DATABASE customer_db TO sales_team, analytics_team;

-- Grant usage on schema to both roles
GRANT USAGE ON SCHEMA sales TO sales_team, analytics_team;

-- Grant select on customer_info to analytics_team
GRANT SELECT ON sales.customer_info TO analytics_team;

-- Create individual users
CREATE ROLE alice LOGIN;
CREATE ROLE bob LOGIN;
GRANT sales_team TO alice;
GRANT analytics_team TO bob;
```

Now, let’s say Bob from the analytics team tries to run a query:

```sql
SELECT * FROM sales.customer_info;
```

This query works fine. Bob can see all the customer information.

A few weeks later, the sales team decides to restrict access to the sales schema for security reasons (what’s Bob been up to?). They revoke the USAGE privilege on the sales schema from the analytics_team:

```sql
REVOKE USAGE ON SCHEMA sales FROM analytics_team;
```

When Bob tries to run his query again, he gets an error: “ERROR: permission denied for schema sales.”

Bob is confused, so he checks his privilege. He can do this using \\dp command:

```sql
\dp sales.customer_info
```

He’ll see something like this:

```sql
sales_team=arwdDxt/owner
analytics_team=r/owner
```

This tells him that the `sales_team` has full access to this table. They can perform any operation on it. The `analytics_team` can only SELECT from this table. His role inherits from the `analytics_team` role, so surely he should be able to SELECT?

The issue is that by revoking USAGE on the schema, we’ve effectively blocked access to all objects within that schema, regardless of their privileges.

This scenario demonstrates several important points:

1. **Privileges at higher levels (like schema) can override privileges at lower levels (like tables).**
2. **You can have the right privileges on an object but still be unable to access it due to a lack of privileges at a higher level.**
3. **Changes to privileges at one level can have cascading effects that might not be immediately obvious.**

It’s crucial to understand the layered nature of Postgres’ privilege system. When troubleshooting access issues, you need to check privileges at all levels, not just on the specific object being accessed. It also highlights the importance of careful planning when setting up your role and privilege structure, as changes can have far-reaching and sometimes unexpected consequences.

## The gotchas of Postgres roles

Here are a few quick gotchas associated with Postgres roles, then the most fundamental problem you might come across:

1. **Public schema trap**. By default, all roles have `CREATE` and `USAGE` privileges on the `public` schema (but only `USAGE` in Postgres 15 and later). This can lead to unintended object creation or access. Always revoke these privileges and create specific schemas for different purposes.
2. **Role membership circularity**. Postgres allows circular role memberships (A is a member of B, B is a member of A). This can create confusing privilege scenarios and should be avoided in role design.
3. **Function execution context**. Functions execute with the privileges of the function owner, not the calling user. If not carefully managed, this can lead to unintended privilege escalation, especially with `SECURITY DEFINER` functions.
4. **Search path fun**. The `search_path` determines which schemas are searched for unqualified object names. A malicious user could create objects in schemas earlier in the `search_path`, potentially hijacking queries.
5. **Implicit privileges of object owners**. Object owners automatically have ALL privileges on their objects and can grant these privileges to others. This can lead to unintended privilege distribution if object ownership isn’t carefully managed.
6. **Role attribute inheritance**. Some role attributes (like `CREATEDB`, `CREATEROLE`) are inherited by member roles, but others (like `LOGIN`) are not. This inconsistency can lead to confusion in role hierarchy design.

Onto the more significant issue: **migrations**. As another HN commenter in that thread put it:

> **“May God have mercy on your soul if you want to migrate a db with complex user permissions”**

Databases change organically over time, and this organic growth can lead to intricate interdependencies between roles, permissions, and database objects. When you have to migrate a database, these dependencies become… problematic. If the tables and roles aren’t recreated in the correct order, you can end up in situations where:

1. You can’t create a table because the role that should own it doesn’t exist yet.
2. You can’t grant permissions on a table because the role that should receive the permissions hasn’t been created.
3. You can’t insert data into a table because the role performing the migration doesn’t have the necessary permissions.
4. Circular dependencies between roles and objects can lead to deadlocks in the migration process.

**The standard Postgres migration tools ([pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html) and [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html)) aren’t always equipped to handle these complex scenarios gracefully.** They might not be able to restore data in the correct order when roles and permissions are intertwined with the data and schema.

Furthermore, if you’re modifying roles during the migration process, you might suddenly find yourself without the necessary permissions to complete the migration. For instance, if you restore a table and then change its owner before loading data, you might end up in a situation where no role has the permissions needed to insert the data.

This is one of the most common problems when working with Postgres databases. The chances of having to migrate a database at some point are high–you might have to upgrade to a newer version of Postgres, move your database to a different provider, scale your database, or implement a major schema change that is too complex for simple `ALTER TABLE` commands.

## A few tips for Postgres roles

Firstly, let’s get back to migrations. You need to plan how to migrate your db to make sure you don’t accidentally brick it:

1. **Carefully plan the migration order, considering all role and permission dependencies.** This might involve creating a dependency graph of your database objects and roles. Pay special attention to circular dependencies, which can cause migration issues.
2. **Potentially write custom migration scripts to handle complex scenarios.** Standard tools like pg_dump and pg_restore might not be sufficient for complex role structures. Custom scripts can give you more control over the migration process, allowing you to handle edge cases and complex dependencies.
3. **Temporarily grant elevated privileges during the migration process.** This can help avoid permission-related errors during migration. However, to maintain security, be sure to revoke these elevated privileges immediately after the migration is complete. Always perform this in a controlled environment.
4. **Carefully audit and potentially simplify your role structure before migration.** Complex role structures can make migrations difficult. Consider simplifying your role hierarchy if possible. This might involve consolidating roles with similar permissions or removing unused roles. Document any changes thoroughly for future reference.
5. **Test your migration process thoroughly in a non-production environment.** Create a copy of your production database and perform a trial migration. This can help identify potential issues before they affect your live data. Be sure to test not just the data migration but also the functionality of your application with the migrated database.
6. **Have a rollback plan ready.** Despite best efforts, things can go wrong. Prepare a detailed plan for rolling back the migration if necessary. This should include steps to revert both the database and any application changes that were made to accommodate the new database structure.

Basically, don’t YOLO it. Otherwise, you might find yourself having to fight a losing battle with broken roles at 11 pm on a Friday to stop production going down when you accidentally hit your free tier limit and need to upgrade to allow more writes (hands up who’s done that? ✋)

What other good ideas are there for Postgres roles?

- **Follow the principle of least privilege.** Grant roles only the minimum permissions necessary to perform their functions. This reduces the risk of accidental or malicious misuse of privileges.
- **Use role hierarchies.** To simplify management, create a hierarchical structure of roles. For example, have base roles for common permissions and then create more specific roles that inherit from these.
- **Leverage group roles.** Use roles without the LOGIN attribute as group roles to efficiently manage permissions for multiple users. This makes it easier to update permissions for a whole group of users at once.
- **Regularly audit role permissions.** Periodically review the permissions granted to each role to ensure they’re still appropriate. Use system catalogs like [pg_roles](https://www.postgresql.org/docs/current/view-pg-roles.html) and [pg_auth_members](https://www.postgresql.org/docs/current/catalog-pg-auth-members.html) to help.
- **Use `ALTER DEFAULT PRIVILEGES`.** This allows you to set the default privileges for objects created in the future. It can save time and reduce errors when new objects are created.
- **Be mindful of object ownership.** Remember that object owners automatically have all privileges on their objects. Consider using dedicated owner roles for different types of objects rather than using user roles as owners.
- **Document your role structure.** Maintain clear documentation of your role hierarchy, each role’s permissions, and the rationale behind the structure. This will be invaluable for future maintenance and onboarding.
- **Consider using extensions.** Audit-related Postgres extensions can provide additional monitoring capabilities for role activities, which can be crucial for security and compliance.

This all boils down to taking roles seriously and seeing them as a powerful but complex part of the Postgres ecosystem.

## Mastering the fun of Postgres roles

Postgres’ role system is a double-edged sword: robust and flexible, yet complex and potentially confusing.

The key to success lies in understanding the layered nature of the Postgres privilege system, carefully planning your role structure, and following best practices. Remember, roles are not just a security feature but a fundamental part of your database architecture. Treat them with the same care and consideration you give to your schema design or query optimization.

The benefits of doing so are well worth the effort. With careful planning and a healthy respect for their complexity, you can turn what might seem like “black magic” into a powerful tool for building with Postgres.
