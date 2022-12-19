---
title: Manage users
enableTableOfContents: true
isDraft: false
---

In Neon, users are PostgreSQL users. Each Neon project is created with a default user that takes its name from your Neon account (the Google, GitHub, or partner account that you registered with). This user owns the default database (`neondb`) that is created in a project's root branch. Each project is also has a `web_access` PostgreSQL user, which is a system managed user used by the Neon [SQL Editor](../../get-started-with-neon/query-with-neon-sql-editor) and for [passwordless connections](../../connect/passwordless-connect). You cannot delete or modify this user.

Additional users can be created in a project's root branch or child branches. There is no limit to the number of users you can create.

Users belong to branch. If you create a child branch, users from the parent branch are duplicated in the child branch. For example, if user `sally` exists in the parent branch, user `sally` is copied to the child branch when the child branch is created. The only time this does not occur is when you create a branch that only includes data up to a particular point in time. If the user was created in the parent branch after that point in time, that user is not duplicated the child branch.

<Admonition type="note">
You can only create database users in the Neon Console or using the [Neon API](https://neon.tech/api-reference). Creating database users directly in PostgreSQL is not yet supported. In Neon, the terms "user" and "role" are synonymous. The Neon API uses the term "role".
</Admonition>

## Create a user

To create a user:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select a project.
3. Select **Settings** > **Users**.
4. Select **New User**.
5. In the user creation dialog, select the branch where you want to create the user and specify a user name.
6. Click **Create**.

## Delete a user

You cannot delete a user that owns a database.

To delete a user:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select a project.
3. Select **Settings** > **Users**.
4. Select a branch to view users in the branch.
5. Click the delete icon for the user you want to delete.
6. On the delete user dialog, click **Delete**.

## Reset a password

To reset a user's password:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select a project.
3. Select **Settings** > **Users**.
4. Select a branch to view users in the branch.
5. Select **Reset password**.
6. On the confirmation dialog, click **Sure, reset**.
7. A reset password dialog is displayed. Copy your password or save the `.env` file to a secure location. After you close the reset password dialog, you will no longer be able to access the newly created password.
