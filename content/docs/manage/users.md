---
title: Users
enableTableOfContents: true
isDraft: false
---

This topic describes how to create and manage database users in Neon.

<Admonition type="note">
You can only create database users in the Neon Console. Creating database users directly in PostgreSQL is not yet supported.  
</Admonition>

Each Neon project is created with two database users by default:

- A user that takes its name from your Neon account (the Google, GitHub, or partner account that you signed up with).
- A `web_access` user, which is used for passwordless authentication and by the Neon SQL Editor. The `web_access` user cannot be modified or deleted.

Additional database users can be created in a project's root branch or child branches.

## Create a user

To create a database user:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select a project.
3. Select **Settings** > **Users**.
4. Select **New User**.
5. In the **USER CREATION** dialog, select the branch where you want to create the user and specify a user name.
6. Click **Create**.

## Delete a user

To delete a database user:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select a project.
3. Select **Settings** > **Users**.
4. Clock the delete icon for the user you want to delete.
5. On the delete user dialog, click **Delete**.

## Reset a user's password

To reset a database user's password:

1. Navigate to the [Neon Console](https://console.neon.tech).
2. Select a project.
3. Select **Settings** > **Users**.
4. Select **Reset password**.
5. On **Are you sure you want to reset password?** dialog, click **Sure, reset**.
6. A reset password dialog with your new password is displayed. Copy your password and save it to a secure location. After you close the reset password dialog, you will no longer be able to access the newly created password.
