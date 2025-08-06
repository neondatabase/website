# Manage database access

> The document outlines procedures for managing database access in Neon, detailing how to configure user roles, permissions, and authentication methods to control and secure database interactions.

## Source

- [Manage database access HTML](https://neon.com/docs/guides/manage-database-access): The original HTML version of this documentation

Each Neon project is created with a Postgres role that is named for your database. For example, if your database is named `neondb`, the project is created with a default role named `neondb_owner`.
