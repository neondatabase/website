---
title: Users
enableTableOfContents: true
isDraft: false
---

In Neon, users are PostgreSQL users. Each Neon project is created with two users by default:

- A user that takes its name from your Neon account (the Google, GitHub, or partner account that you registered with). This user owns the default database (`main`) that is created in a project's root branch.
- A `web_access` user, which is used for [passwordless authentication](../../reference/glossary#passwordless-auth) and by the Neon SQL Editor. The `web_access` user cannot be modified or deleted.

Additional users can be created in a project's root branch or child branches. There is no limit to the number fo users you can create.

<Admonition type="note">
You can only create database users in the Neon Console or using the [Neon API](https://neon.tech/api-reference). Creating database users directly in PostgreSQL is not yet supported.  
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
4. Click the delete icon for the user you want to delete.
5. On the delete user dialog, click **Delete**.

## Reset a password

To reset a user's password:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select a project.
3. Select **Settings** > **Users**.
4. Select **Reset password**.
5. On the confirmation dialog, click **Sure, reset**.
6. A reset password dialog with your new password is displayed. Copy your password and save it to a secure location. After you close the reset password dialog, you will no longer be able to access the newly created password.
