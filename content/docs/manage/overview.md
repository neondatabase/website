---
title: Overview 
enableTableOfContents: true
isDraft: false
---
Managing your Neon project requires an understanding of the Neon object hierarchy. The following diagram shows how objects in Neon are related:

```text
Neon account
    |
    |- API keys
    | 
    |- project 
    |      |
    |      |---- root branch (main) ---- endpoint (compute) 
    |                |    |
    |                |    |-- users
    |                |    |-- databases           
    |                |                         
    |                |---- child branch 1 ---- endpoint (compute) 
    |                |          |    |
    |                |          |    |------ users
    |                |          |    |------ databases   
    |                |          |
    |                |          |---- child branch 1.a ---- endpoint (compute) 
    |                |                          |
    |                |                          |---- users
    |                |                          |---- databases
    |                |
    |                |---- child branch 2 
    |                                 |
    |                                 |---- users
    |                                 |---- databases
```

## Neon account

This is the account used to register with Neon. Neon currently supports registering with GitHub, Google, or partner accounts. 

## API keys

API keys are global and belong to the Neon user account. API keys are used with the [Neon API](../../reference/api-refernce) to create and mange a Neon projects and any object within a project. A Neon account can have unlimited API keys. For information about creating and managing API keys, see [API keys](../../get-started-with-neon/using-api-keys).

## Projects

A Neon project defines the region where project resources reside. Branches and endpoints belong to a project. A Neon user account can have multiple projects, but tier limits define the number of projects per Neon account. For information about creating and managing projects, see [Projects](../projects).

## Branches

Data resides in a branch. Each Neon project has a root branch called `main`. You can create child branches from `main` or from previously created branches. A branch can contain multiple databases and users. Tier limits define the number of branches you can create in a project. For information about creating and managing branches, see [Branches](../../get-started-with-neon/branches).

## Endpoints

An endpoint is the compute instance associated with a branch. A read-write endpoint is created for a project's root branch by default. When you create child branches, you can choose whether or not to create an endpoint for the branch and the type of endpoint (read-write or read-only). To connect to a database that resides in a branch, you must connect via an endpoint that is associated with the branch. Tier limits define the number of endpoints per project and the resources (vCPUs and RAM) available to an endpoint. For information about creating and managing endpoints, see [Endpoints](../endpoints).

## Users

A PostgreSQL user is required to create and access a database. A user belongs to a branch. There is no limit on the number of users you can create. A Neon project root branch is created with a user named for the Neon user account that you registered with. For example, if you registered with a Google account for Casey Smith, Neon creates a database user named Casey in the root branch. This user is the owner of the default `main` database. For information about creating and managing users, see [Users](../users).

## Databases

A database is a container for SQL objects such as schemas, tables, views, functions, and indexes. A database belongs to a branch. The root branch of a Neon project is created with a default database named `main`. There is no limit on the number of databases you can create. For information about creating and managing databases, see [Databases](../databases).
