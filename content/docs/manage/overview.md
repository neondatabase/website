---
title: Overview 
enableTableOfContents: true
isDraft: false
---
Managing your Neon project requires an understanding of the Neon object hierarchy. The following diagram shows how objects in Neon are related:

```text
Neon user account
    |
    |- API keys
    | 
    |- Neon project A
    |       |
    |       |------root branch (main) ---- endpoint (compute) 
    |                  |
    |                  |------ database users
    |                  |------ databases           
    |                  |                         
    |                  |----------------
    |                  |               |
    |                  |          child branch 1 ---- endpoint (compute) 
    |                  |               |
    |                  |               |------ database users
    |                  |               |------ databases          
    |                  |               |
    |                  |               ------ 
    |                  |                    | 
    |                  |                child branch 1.a ---- endpoint (compute) 
    |                  |                     |
    |                  |                     |------ database users
    |                  |                     |------ databases
    |                  |
    |                  |----------------
    |                                  |
    |                             child branch 2 ---- endpoint (compute) 
    |                                  |
    |                                  |------ database users
    |                                  |------ databases          
    |
    |
    |- Neon project B
    |       |
    |       |------root branch (main) ---- endpoint (compute) 
    |                  |
    |                  |------ database users
    |                  |------ databases          
    |                  |
    |                  |----------------
    |                                  |    
    |                             child branch ---- endpoint (compute) 
    |                                  |   
    |                                  |------ database users
    |                                  |------ databases
    .
    .
    .
```

## Neon user account

This is the account used to register with Neon. Neon currently supports registering with GitHub, Google, or partner accounts.

## API keys

API keys are global and belong to the Neon user account. API keys can be used with the [Neon API](../../reference/api-refernce) to create or mange a Neon project or any object within a project. For information about creating and managing API keys, see [API keys](../../get-started-with-neon/using-api-keys).

## Projects

A Neon project is the top-level object in the in the Neon hierarchy. A Neon project defines the region where project resources reside. Branches and endpoints belong to a project. Each project has a root branch called `main`. You can create multiple branches and endpoints within a project. A Neon user account can have multiple projects, but tier limits define the number of projects a Neon user account can create. For information about creating and managing projects, see [Projects](tbd).

## Branches

In Neon, data resides in a branch. Each Neon project has a root branch called `main`. You can create child branches from `main` or from previously created branches, as shown in the diagram above. A branch can contain one or more databases. There is no limit on the number of databases you can create, but tier limits define how much data a branch can hold. For information about creating and managing branches, see [Branches](tbd).

## Endpoints

An endpoint is a Neon compute node, and a compute node is associated with a branch. A branch can have zero or one endpoint. To connect to a database that resides on a branch, you must connect via an endpoint that is associated with the branch. Endpoints are read-write by default. Tier limits define the number of endpoints per project and the number of vCPUs and amount of RAM per endpoint. For information about creating and managing endpoints, see [Endpoints](tbd).

## Database users

A database user is required to create and access a database. A database user belongs to a branch. There is no limit on the number of database users you can create. The root branch of a Neon project is created with a database user named for the Neon user account that you registered with. For example, if you registered with a Google account for Casey Smith, Neon creates a database user named Casey in the root branch of your project. This database user is the owner of the default `neondb` database. For information about creating and managing users, see [Users](tbd).

## Databases

A database is a container for objects such as schemas, tables, views, functions, and indexes. A database belongs to a branch. The root branch of a Neon project is created with a default database named `neondb`. There is no limit on the number of databases you can create. For information about creating and managing databases, see [Databases](tbd).