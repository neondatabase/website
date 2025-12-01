---
title: User Management
subtitle: Manage user profiles and account settings
enableTableOfContents: true
updatedOn: '2025-01-XXT00:00:00.000Z'
---

> This is a WIP stub page.

## Methods covered

This guide will cover the following SDK methods:

- `auth.updateUser({ name?, image?, phoneNumber?, email? })` - Update user profile information
- `auth.changePassword({ newPassword, currentPassword, revokeOtherSessions? })` - Change password while logged in
- `auth.changeEmail({ newEmail, callbackURL? })` - Change user email address
- `auth.deleteUser({ callbackURL?, password?, token? })` - Delete user account

## Topics covered

This guide will include:

1. **Update User Profile** - Update name, image, phone number
2. **Change Email** - Change email address with verification flow
3. **Change Password** - Update password while authenticated
4. **Delete Account** - Remove user account and data
