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
    |      |---- root branch (main) ---- endpoint a (compute) 
    |                |    |
    |                |    |---- users
    |                |    |---- databases           
    |                |                         
    |                |---- child branch 1 ---- endpoint b (compute) 
    |                |          |    |
    |                |          |    |---- users
    |                |          |    |---- databases   
    |                |          |
    |                |          |---- child branch 1.a ---- endpoint c (compute) 
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

API keys are global and belong to the Neon user account. API keys are used with the [Neon API](../../reference/api-refernce) to create and manage a Neon projects or any object within a project. A Neon account can create unlimited API keys. For more information, see [API keys](../api-keys).

## Projects

A project is the top-level object in the Neon object hierarchy. It is a container for all other objects, with the exception of API keys, which are global. Branches and endpoints belong to a project. A Neon project defines the region where project resources reside. A Neon user account can have multiple projects, but tier limits define the number of projects per Neon account. For more information, see [Projects](../projects).

## Branches

Data resides in a branch. Each Neon project has a root branch called `main`. You can create child branches from `main` or from previously created branches. A branch can contain multiple databases and users. Tier limits define the number of branches you can create in a project. For more information, see [Branches](../branches).

## Endpoints

An endpoint is the compute instance associated with a branch. A read-write endpoint is created for a project's root branch by default. You can choose whether or not to create an endpoint when creating a branch. To connect to a database that resides in a branch, you must connect via an endpoint that is associated with the branch. Tier limits define the number of endpoints per project and the resources (vCPUs and RAM) available to an endpoint. For more information, see [Endpoints](../endpoints).

## Users

A PostgreSQL user is required to create and access a database. A user belongs to a branch. There is no limit on the number of users you can create. A Neon project root branch is created with a user named for the Neon user account that you registered with. For example, if you registered with a Google account for Casey Smith, Neon creates a database user named Casey in the root branch. This user is the owner of the default `main` database in your project's root branch. For more information, see [Users](../users).

## Databases

A database is a container for SQL objects such as schemas, tables, views, functions, and indexes. A database belongs to a branch. The root branch of a Neon project is created with a default database named `main`. There is no limit on the number of databases you can create. For more information, see [Databases](../databases).
