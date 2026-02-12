---
title: User management
subtitle: 'Update profiles, change passwords, and manage account settings'
summary: >-
  Covers the management of user profiles, including updating personal
  information, securely changing passwords, verifying email address changes, and
  deleting accounts within the Neon platform.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.752Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Manage user profiles and account settings after users sign in. This guide covers:

- Updating profile information (name, image, phone number)
- Changing passwords securely
- Changing email addresses with verification
- Deleting user accounts

## Update user profile

Update user profile fields like name, image, or phone number using `updateUser()`:

```jsx filename="src/App.jsx"
import { authClient } from './auth';

const handleUpdateProfile = async (e) => {
  e.preventDefault();
  setMessage('');

  try {
    const { data, error } = await authClient.updateUser({
      name: 'New Name',
    });

    if (error) throw error;

    // Refresh session to get updated user data
    const sessionResult = await authClient.getSession();
    if (sessionResult.data?.session) {
      setUser(sessionResult.data.session.user);
      setMessage('Profile updated successfully!');
    }
  } catch (error) {
    setMessage(error?.message || 'Update failed');
  }
};
```

### Available profile fields

You can update these fields with `updateUser()`:

- `name` (string) - User's display name

<Admonition type="note">
Email address changes are not currently supported. To reset a forgotten password, see [Password Reset](/docs/auth/guides/password-reset).
</Admonition>

## Change password

Change a user's password while they are logged in using `changePassword()`. This requires the current password for security:

```jsx filename="src/App.jsx"
import { authClient } from './auth';

const handleChangePassword = async (e) => {
  e.preventDefault();
  setMessage('');

  try {
    const { data, error } = await authClient.changePassword({
      newPassword: 'new-secure-password',
      currentPassword: 'current-password',
    });

    if (error) throw error;
    setMessage('Password changed successfully!');
  } catch (error) {
    setMessage(error?.message || 'Password change failed');
  }
};
```

### Revoke other sessions

Optionally sign out from all other devices when changing the password:

```jsx filename="src/App.jsx"
const { data, error } = await authClient.changePassword({
  newPassword: 'new-secure-password',
  currentPassword: 'current-password',
  revokeOtherSessions: true, // Signs out all other devices
});
```

<Admonition type="note">
If a user forgot their password, use the password reset flow (`requestPasswordReset()` and `resetPassword()`) instead. See [Password Reset](/docs/auth/guides/password-reset).
</Admonition>

## Refresh user data

After updating profile information, refresh the session to get the latest user data:

```jsx filename="src/App.jsx"
import { authClient } from './auth';

const refreshUser = async () => {
  const { data } = await authClient.getSession();
  if (data?.session) {
    setUser(data.session.user);
  }
};
```

Call `refreshUser()` after successful `updateUser()` calls to ensure your UI displays the latest information.

<DetailIconCards>

<a href="/docs/auth/guides/password-reset" description="Reset forgotten passwords" icon="lock-landscape">Password Reset</a>

<a href="/docs/auth/guides/email-verification" description="Verify email addresses" icon="check">Email Verification</a>

<a href="/docs/auth/authentication-flow" description="Understand the auth flow" icon="unlock">Authentication Flow</a>

</DetailIconCards>

<NeedHelp/>
