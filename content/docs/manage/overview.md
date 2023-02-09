---
title: Overview of the Neon object hierarchy
enableTableOfContents: true
isDraft: false
---
Managing your Neon project requires an understanding of the Neon object hierarchy. The following diagram shows how objects in Neon are related. See below for a description of of each object.

```text
Neon account
    |
    |- API keys
    | 
    |- project 
    |      |
    |      |---- root branch (main) ---- compute endpoint a
    |                |    |
    |                |    |---- users
    |                |    |---- databases           
    |                |                         
    |                |---- child branch 1 ---- compute endpoint b 
    |                |          |    |
    |                |          |    |---- users
    |                |          |    |---- databases   
    |                |          |
    |                |          |---- child branch 1.a ---- compute endpoint c 
    |                |                          |
    |                |                          |---- users
    |                |                          |---- databases
    |                |
    |                |---- child branch 2 
    |                                |
    |                                |---- users
    |                                |---- databases
```

## Neon account

This is the account used to register with Neon. Neon currently supports registering with GitHub, Google, or partner accounts.

## API keys

API keys are global and belong to the Neon account. API keys are used with the [Neon API](/docs/reference/api-reference) to create and manage Neon projects or objects within a Neon project. A Neon account can create unlimited API keys. For more information, see [Manage API keys](/docs/manage/api-keys).

## Projects

A project is the top-level object in the Neon object hierarchy. It is a container for all other objects, with the exception of API keys, which are global. Branches and compute endpoints belong to a project. A Neon project defines the region where project resources reside. A Neon account can have multiple projects, but tier limits define the number of projects per Neon account. For more information, see [Manage projects](/docs/manage/projects).

## Branches

Data resides in a branch. Each Neon project has a root branch called `main`. You can create child branches from `main` or from previously created branches. A branch can contain multiple databases and users. Tier limits define the number of branches you can create in a project and the amount of data per branch. For more information, see [Manage branches](/docs/manage/branches).

## Compute endpoint

A compute endpoint is a compute resource associated with a branch. A read-write compute endpoint is created for a project's primary branch by default. You can choose whether or not to create a compute endpoint when creating a branch. To connect to a database that resides in a branch, you must connect via a compute endpoint that is associated with the branch. Tier limits define the the resources (vCPUs and RAM) available to a compute endpoint. For more information, see [Manage compute endpoints](/docs/manage/endpoints).

## Users

In Neon, users are PostgreSQL users. A user is required to create and access a database. A user belongs to a branch. There is no limit on the number of users you can create. The root branch of a Neon project is created with a user named for the Neon account that you registered with. For example, if you registered with a Google account for "Casey Smith", Neon creates a user named "Casey" in the root branch. This user is the owner of the default `neondb` database in your project's root branch. The root branch is also created with a `web_access` user, which is used by the Neon [SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) and for [passwordless connections](/docs/connect/passwordless-connect). For more information, see [Manage users](/docs/manage/users).

## Databases

As with any standalone instance of PostgreSQL, a database is a container for SQL objects such as schemas, tables, views, functions, and indexes. In Neon, a database belongs to a branch. The root branch of a Neon project is created with a default database named `neondb`. There is no limit on the number of databases you can create. For more information, see [Manage databases](/docs/manage/databases).
