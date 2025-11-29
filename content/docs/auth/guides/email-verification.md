---
title: Email Verification
subtitle: Verify user email addresses during sign-up or account creation
enableTableOfContents: true
updatedOn: '2025-11-19T00:00:00.000Z'
---

Email verification ensures users own the email addresses they register with. This guide shows you how to add email verification to your React app using either verification links (users click a link) or verification codes (users enter a code sent via email).

You'll need a React app with the Neon SDK and React Router installed - use our [React Router Quickstart](/docs/auth/quick-start/react-router) to set one up.

<Steps>

## Enable email verification

In your project's **Settings** → **Auth** page, enable **Sign-up with Email** and **Verify at Sign-up**. Choose your verification method:

- **Verification link** - Users click a link in their email
- **Verification code** - Users enter a numeric code from their email

![Email verification settings in Neon Console](/docs/auth/email-verification-settings.png)

<Admonition>
You can switch between verification methods at any time in the Console.
</Admonition>

## Set up verification in your app

Choose the implementation that matches your verification method from the Console.

<Tabs labels={["Links", "Codes"]}>

<TabItem>

**How verification links work**

When a user clicks the verification link in their email, the Neon Auth server handles verification and redirects them back to your application root. Your Auth component checks for the new session and redirects to the dashboard.

**The flow:**

1. User signs up → receives email with verification link
2. User clicks link → Neon Auth server verifies email → redirects to your app root
3. Auth component mounts → checks for session
4. If session exists → redirect to dashboard

**Step 1: Add session check**

Import `useEffect` and add a session check when the component mounts. This detects when a user returns from clicking the verification link:

```jsx
import { useState, useEffect } from 'react';

// Inside your Auth component:
useEffect(() => {
  neon.auth.getSession().then(({ data }) => {
    if (data.session) {
      navigate('/dashboard');
    }
  });
}, [navigate]);
```

**Step 2: Update sign-up handler**

After calling `signUp()`, check if verification is required and show a message:

```jsx
if (isSignUp) {
  const { data, error } = await neon.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  // Check if email verification is required
  if (data?.user && !data.user.emailVerified) {
    setMessage('Check your email for a verification link!');
  } else {
    setMessage('Account created! Please sign in.');
    setIsSignUp(false);
  }
}
```

### Complete implementation

<CodeWithLabel label="src/pages/Auth.jsx">

```jsx
import { useState, useEffect } from 'react';
import { neon } from '../neon';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Check for existing session on mount (after email verification redirect)
  useEffect(() => {
    neon.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate('/dashboard');
      }
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isSignUp) {
        const { data, error } = await neon.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        // Check if email verification is required
        if (data?.user && !data.user.emailVerified) {
          setMessage('Check your email for a verification link!');
        } else {
          setMessage('Account created! Please sign in.');
          setIsSignUp(false);
        }
      } else {
        const { error } = await neon.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
      <form onSubmit={handleSubmit}>
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
      <button
        onClick={() => {
          setIsSignUp(!isSignUp);
          setMessage('');
        }}
      >
        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
```

</CodeWithLabel>

</TabItem>

<TabItem>

**How verification codes work**

Users receive a numeric code via email and enter it in your application. Your Auth component switches between two forms: the main auth form and a verification form.

**The flow:**

1. User signs up → receives email with numeric code
2. App shows "Check your email" message and switches to verification form
3. User enters code → calls `verifyOtp()`
4. On success → automatically signed in and redirected to dashboard (default behavior)

**Step 1: Add step state and code handler**

Add state to track which form to show (`'auth'` or `'verify'`), and create a handler for code verification:

```jsx
const [step, setStep] = useState('auth'); // 'auth' or 'verify'
const [code, setCode] = useState('');

const handleVerify = async (e) => {
  e.preventDefault();
  setMessage('');

  try {
    const { data, error } = await neon.auth.verifyOtp({
      email,
      token: code,
      type: 'signup',
    });

    if (error) throw error;

    // Check if auto-sign-in is enabled (default behavior)
    if (data?.session) {
      navigate('/dashboard');
    } else {
      setMessage('Email verified! You can now sign in.');
      setStep('auth');
      setIsSignUp(false);
      setCode('');
    }
  } catch (error) {
    setMessage(error.message);
  }
};
```

By default, `verifyOtp()` automatically signs the user in after successful verification. If a session is created, redirect directly to the dashboard.

**Step 2: Add verification form**

When `step` is `'verify'`, show the verification form instead of the main auth form:

```jsx
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

**Step 3: Update sign-up handler**

After calling `signUp()`, switch to the verification step:

```jsx
if (data?.user && !data.user.emailVerified) {
  setMessage('Check your email for a verification code');
  setStep('verify'); // Switch to verification form
}
```

### Complete implementation

<CodeWithLabel label="src/pages/Auth.jsx">

```jsx
import { useState } from 'react';
import { neon } from '../neon';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [step, setStep] = useState('auth'); // 'auth' or 'verify'
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isSignUp) {
        const { data, error } = await neon.auth.signUp({ email, password });
        if (error) throw error;

        // Check if email verification is required
        if (data?.user && !data.user.emailVerified) {
          setMessage('Check your email for a verification code');
          setStep('verify');
        } else {
          setMessage('Account created! Please sign in.');
          setIsSignUp(false);
        }
      } else {
        const { error } = await neon.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const { data, error } = await neon.auth.verifyOtp({
        email,
        token: code,
        type: 'signup',
      });

      if (error) throw error;

      // Check if auto-sign-in is enabled (default behavior)
      if (data?.session) {
        navigate('/dashboard');
      } else {
        setMessage('Email verified! You can now sign in.');
        setStep('auth');
        setIsSignUp(false);
        setCode('');
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

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

  return (
    <div>
      <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
      <form onSubmit={handleSubmit}>
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
      <button
        onClick={() => {
          setIsSignUp(!isSignUp);
          setMessage('');
        }}
      >
        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
```

</CodeWithLabel>

</TabItem>

</Tabs>

## Resending verification emails

Both verification links and codes expire after **15 minutes**. Allow users to request a new one if needed:

```jsx
const handleResend = async () => {
  try {
    const { error } = await neon.auth.resend({
      type: 'signup',
      email,
    });

    if (error) throw error;
    setMessage('Verification email sent! Check your inbox.');
  } catch (error) {
    setMessage(error.message);
  }
};
```

Add a "Resend verification email" button to your UI where users see the "Check your email" message. This works for both verification methods - the server sends whichever type (link or code) you configured in the Console.

## Checking verification status

Access the `emailVerified` field from the user object to check verification status in your application:

```jsx
const {
  data: { user },
} = await neon.auth.getUser();

if (user && !user.emailVerified) {
  // Show verification prompt or restrict features
  console.log('Please verify your email to continue');
}
```

<Admonition type="note">
For database-level access restrictions, see the [Row Level Security guide](/docs/guides/row-level-security). Note that RLS policies can check user ownership via `auth.user_id()`, but email verification status is best enforced at the application level.
</Admonition>

</Steps>

## Best practices

### Required vs optional verification

<Admonition type="important">
When email verification is **required** in your Console settings, users cannot sign in until they verify. When verification is **optional**, users can sign in immediately but their `emailVerified` field remains `false` until verified.
</Admonition>

Consider making verification required for production apps to ensure email authenticity.

### Handling expired verification codes

Verification codes and links expire after **15 minutes**. Use the `resend()` method shown above to let users request a new one if needed.

## Next steps

- Learn about [Organizations](/docs/auth/guides/organizations) for multi-tenant applications
- Implement [Row Level Security](/docs/auth/guides/row-level-security) to protect user data
- Explore [Branching with Auth](/docs/auth/concepts/branching-authentication) for preview environments
