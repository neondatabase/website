---
title: Use Neon Auth with React (API methods)
subtitle: Build your own auth UI
enableTableOfContents: true
updatedOn: '2025-11-12T00:00:00.000Z'
layout: wide
---

<TwoColumnLayout>

<TwoColumnStep title="Create a Neon project with Auth enabled">
  <LeftContent>

If you don't have a Neon project yet, create one at [console.neon.tech](https://console.neon.tech).

Go to the **Auth** page in your project dashboard and click **Enable Auth**.

You can then find your Auth **Base URL** on the Configuration tab. Copy this URL - you'll need it in the next step.

  </LeftContent>
  <RightImage label="Console">

![Neon Auth Base URL](/docs/auth/neon-auth-base-url.png)

  </RightImage>
</TwoColumnStep>

<TwoColumnStep title="Create a React app">
  <LeftContent>

Create a React app using Vite.

  </LeftContent>
  <RightCode label="Terminal">

```bash
npm create vite@latest my-app -- --template react
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Install the Neon SDK">
  <LeftContent>

The Neon SDK provides authentication methods like `signUp()`, `getSession()`, and `signOut()` for your React app.

  </LeftContent>
  <RightCode label="Terminal">

```bash
cd my-app &&

```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Set up environment variables">
  <LeftContent>

Create a `.env` file in your project root and add your Auth Base URL:

<Admonition type="note">
Replace the URL with your actual Auth Base URL from the Neon Console.
</Admonition>

  </LeftContent>
  <RightCode label=".env">

```bash
VITE_NEON_AUTH_URL=https://ep-xxx.neonauth.us-east-2.aws.neon.build/neondb/auth
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Configure the Neon client">
  <LeftContent>

Create a `src/neon.js` file to configure your auth client:

  </LeftContent>
  <RightCode label="src/neon.js">

```javascript
import { createAuthClient } from '@neondatabase/neon-js';

export const neon = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL);
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Build your authentication UI">
  <LeftContent>

Neon JS uses a programmatic approach for managing auth state. You'll use React hooks like `useEffect` to check the session and handle auth changes.

Replace the contents of `src/App.jsx` with the following code to implement [sign-up](/docs/reference/javascript-sdk#authsignup), [sign-in](/docs/reference/javascript-sdk#authsigninwithpassword), and [sign-out](/docs/reference/javascript-sdk#authsignout):

  </LeftContent>
  <RightCode label="src/App.jsx">

```jsx
import { useState, useEffect } from 'react';
import { neon } from './neon';
import './App.css';

export default function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    neon.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { error } = await neon.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
      return;
    }
    const { data } = await neon.auth.getSession();
    setSession(data.session);
  };

  const handleSignOut = async () => {
    await neon.auth.signOut();
    setSession(null);
  };

  if (loading) return <div>Loading...</div>;

  if (session) {
    return (
      <div>
        <h1>Logged in as {session.user.email}</h1>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignUp}>
      <h1>Sign Up</h1>
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
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Start your app">
  <LeftContent>

Start the development server:

Open your browser to `http://localhost:5173` and create a test user.

  </LeftContent>
  <RightCode label="Terminal">

```bash
npm run dev
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="See your users in the database">
  <LeftContent>

As users sign up, their profiles are synced to your Neon database in the `neon_auth.user` table.

Query your users table in the SQL Editor to see your new users:

  </LeftContent>
  <RightCode label="SQL Editor">

```sql
SELECT * FROM neon_auth.user;
```

  </RightCode>
</TwoColumnStep>

</TwoColumnLayout>

## Next steps

- [Learn about Neon Auth concepts](/docs/auth/overview)
- [Explore the Neon Data API](/docs/data-api/get-started) to build a REST API for your data
- [View complete SDK reference](/docs/reference/javascript-sdk)
