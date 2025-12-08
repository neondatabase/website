---
title: Password Reset
subtitle: Allow users to reset forgotten passwords
enableTableOfContents: true
updatedOn: '2025-01-XXT00:00:00.000Z'
---

> This is a WIP stub page.

## Methods covered

This guide will cover the following SDK methods:

- `authClient.requestPasswordReset({ email, redirectTo? })` - Send password reset email ✅
- `authClient.resetPassword({ newPassword, token? })` - Complete password reset with token ⚠️ Not yet exposed

## Flow overview

The password reset flow will cover:

1. User requests password reset
2. User receives email with reset link/token
3. User clicks link and is redirected to reset form
4. User enters new password
5. Password is reset and user is signed in
