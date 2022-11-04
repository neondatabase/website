---
title: Users
enableTableOfContents: true
isDraft: true
---

This topic describes how to create and manage database users in Neon. Database users must be created in the Neon console. Creating database users directly in POstgreSQL is currently not supported.  

Each Neon project is created with two database users by default:

- A user that takes its name from your Neon account (the Google, GitHub, or partner account that you signed up with).
- A `web_access` user, which is used for passwordless authentication and by the Neon SQL Editor. The `web_access` user cannot be modified or deleted.

Additional database users can be added to a project's root branch or child branches.

When you create a branch, a user that was present in the parent branch is also be present in the child branch, assuming the data that was branched includes the user. For example, if you branched from Head, any user that existed in the parent branch will also be present in the child branch. If you branched data up to a past point in time, any user created before that point in time are included in the child branch. 

## Create a user

## Create a 