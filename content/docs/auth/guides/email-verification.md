---
title: Email verification
subtitle: Verify user email addresses during sign-up or account creation
summary: >-
  Covers the setup of email verification in Neon Auth, detailing methods for
  verifying user email addresses during sign-up, including verification codes
  and links, along with configuration steps for each method.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.739Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

Email verification ensures users own the email addresses they register with. Neon Auth supports two verification methods:

- **Verification codes** (users enter a numeric code from their email) - works with shared or custom email providers
- **Verification links** (users click a link in their email) - requires a custom email provider

<Admonition type="note">
Verification links require a [custom email provider](/docs/auth/production-checklist#email-provider). If you're using the shared email provider, use verification codes instead.
</Admonition>

## Enable email verification

In your project's **Settings** → **Auth** page, enable **Sign-up with Email** and **Verify at Sign-up**. Choose your verification method.

![Email verification settings in Neon Console](/docs/auth/email-verification-settings.png)

## Verification links

Verification links require a custom email provider. See [Email provider configuration](/docs/auth/production-checklist#email-provider) to set this up.

When a user clicks the verification link in their email, the Neon Auth server handles verification and redirects them back to your application. Your app checks for the new session and shows the appropriate UI.

### 1. Check session on mount (#check-session-on-mount)

Add a session check when your component mounts to detect when a user returns from clicking the verification link:

```jsx filename="src/App.jsx" {9-14}
import { useEffect, useState } from 'react';
import { authClient } from './auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      if (data?.session) {
        setUser(data.session.user);
      }
      setLoading(false);
    });
  }, []);
}
```

### 2. Handle sign-up with verification (#handle-signup-with-verification)

After calling `signUp.email()`, check if verification is required and show a message:

```jsx {16-18} filename="src/App.jsx"
const handleSignUp = async (e) => {
  e.preventDefault();
  setMessage('');

  try {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name: name || email.split('@')[0] || 'User',
    });

    if (error) throw error;

    // Check if email verification is required
    if (data?.user && !data.user.emailVerified) {
      setMessage('Check your email for a verification link!');
    } else {
      setMessage('Account created! Please sign in.');
    }
  } catch (error) {
    setMessage(error?.message || 'An error occurred');
  }
};
```

### 3. Check verification status (#check-verification-status)

Access the `emailVerified` field from the user object:

```jsx {3} filename="src/App.jsx"
const { data } = await authClient.getSession();

if (data?.session?.user && !data.session.user.emailVerified) {
  // Show verification prompt or restrict features
  console.log('Please verify your email to continue');
}
```

## Verification codes

If you prefer verification codes, users receive a numeric code via email and enter it in your application. Your app switches between the auth form and a verification form.

### 1. Add verification state (#add-verification-state)

Add state to track which form to show:

```jsx filename="src/App.jsx"
const [step, setStep] = useState('auth'); // 'auth' or 'verify'
const [code, setCode] = useState('');
```

### 2. Handle code verification (#handle-code-verification)

Create a handler for code verification:

```jsx {6-9} filename="src/App.jsx"
const handleVerify = async (e) => {
  e.preventDefault();
  setMessage('');

  try {
    const { data, error } = await authClient.emailOtp.verifyEmail({
      email,
      otp: code,
    });

    if (error) throw error;

    // Check if auto-sign-in is enabled (default behavior)
    if (data?.session) {
      setUser(data.session.user);
      setStep('auth');
    } else {
      setMessage('Email verified! You can now sign in.');
      setStep('auth');
      setIsSignUp(false);
      setCode('');
    }
  } catch (error) {
    setMessage(error?.message || 'An error occurred');
  }
};
```

### 3. Show verification form (#show-verification-form)

When `step` is `'verify'`, show the verification form:

```jsx filename="src/App.jsx"
if (step === 'verify') {
  return (
    <div>
      <h1>Verify Your Email</h1>
      <p>Enter the code sent to {email}</p>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
```

### 4. Switch to verification after sign-up (#switch-to-verification)

After calling `signUp.email()`, switch to the verification step:

```jsx {3} filename="src/App.jsx"
if (data?.user && !data.user.emailVerified) {
  setMessage('Check your email for a verification code');
  setStep('verify'); // Switch to verification form
}
```

<details>
<summary>Complete example: App.jsx with verification codes</summary>

Here's a complete, minimal `App.jsx` file that includes sign-up, sign-in, and verification code functionality:

```jsx filename="src/App.jsx"
import { useState, useEffect } from 'react';
import { authClient } from './auth';
import './App.css';

export default function App() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  // [!code ++]
  const [step, setStep] = useState('auth'); // 'auth' or 'verify' // [!code ++]
  const [code, setCode] = useState(''); // [!code ++]
  const [isSignUp, setIsSignUp] = useState(true); // [!code ++]

  useEffect(() => {
    authClient.getSession().then((result) => {
      if (result.data?.session && result.data?.user) {
        setSession(result.data.session);
        setUser(result.data.user);
      }
      setLoading(false);
    });
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('');
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name: email.split('@')[0] || 'User',
    });
    if (error) {
      setMessage(error.message);
      return;
    }
    // [!code ++]
    if (data?.user && !data.user.emailVerified) {
      // [!code ++]
      setMessage('Check your email for a verification code'); // [!code ++]
      setStep('verify'); // Switch to verification form // [!code ++]
    } else {
      // [!code ++]
      const sessionResult = await authClient.getSession(); // [!code ++]
      if (sessionResult.data?.session && sessionResult.data?.user) {
        // [!code ++]
        setSession(sessionResult.data.session); // [!code ++]
        setUser(sessionResult.data.user); // [!code ++]
      } // [!code ++]
    } // [!code ++]
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setMessage('');
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }
    if (data?.session && data?.user) {
      setSession(data.session);
      setUser(data.user);
    }
  };

  // [!code ++]
  const handleVerify = async (e) => {
    // [!code ++]
    e.preventDefault(); // [!code ++]
    setMessage(''); // [!code ++]
    // [!code ++]
    try {
      // [!code ++]
      const { data, error } = await authClient.emailOtp.verifyEmail({
        // [!code ++]
        email, // [!code ++]
        otp: code, // [!code ++]
      }); // [!code ++]
      // [!code ++]
      if (error) throw error; // [!code ++]
      // [!code ++]
      if (data?.session) {
        // [!code ++]
        setSession(data.session); // [!code ++]
        setUser(data.session.user); // [!code ++]
        setStep('auth'); // [!code ++]
      } else {
        // [!code ++]
        setMessage('Email verified! You can now sign in.'); // [!code ++]
        setStep('auth'); // [!code ++]
        setIsSignUp(false); // [!code ++]
        setCode(''); // [!code ++]
      } // [!code ++]
    } catch (error) {
      // [!code ++]
      setMessage(error?.message || 'An error occurred'); // [!code ++]
    } // [!code ++]
  }; // [!code ++]

  const handleSignOut = async () => {
    await authClient.signOut();
    setSession(null);
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  if (session && user) {
    return (
      <div>
        <h1>Logged in as {user.email}</h1>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    );
  }

  // [!code ++]
  if (step === 'verify') {
    // [!code ++]
    return (
      // [!code ++]
      <div>
        {' '}
        // [!code ++]
        <h1>Verify Your Email</h1> // [!code ++]
        <p>Enter the code sent to {email}</p> // [!code ++]
        <form onSubmit={handleVerify}>
          {' '}
          // [!code ++]
          <input // [!code ++]
            type="text" // [!code ++]
            placeholder="Verification code" // [!code ++]
            value={code} // [!code ++]
            onChange={(e) => setCode(e.target.value)} // [!code ++]
            required // [!code ++]
          />{' '}
          // [!code ++]
          <button type="submit">Verify</button> // [!code ++]
        </form>{' '}
        // [!code ++]
        {message && <p>{message}</p>} // [!code ++]
      </div> // [!code ++]
    ); // [!code ++]
  } // [!code ++]

  return (
    <div>
      <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
      {message && <p>{message}</p>}
      <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
      </form>
      <p>
        <button onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </p>
    </div>
  );
}
```

</details>

## Resending verification emails

Both verification links and verification codes expire after **15 minutes**. Allow users to request a new one:

```jsx {3-6} filename="src/App.jsx"
const handleResend = async () => {
  try {
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: window.location.origin + '/',
    });

    if (error) throw error;
    setMessage('Verification email sent! Check your inbox.');
  } catch (error) {
    setMessage(error?.message || 'An error occurred');
  }
};
```

The server sends whichever type (verification link or verification code) you configured in the Console.

## Required vs optional verification

When email verification is **required** in your Console settings, users cannot sign in until they verify. When verification is **optional**, users can sign in immediately but their `emailVerified` field remains `false` until verified.
