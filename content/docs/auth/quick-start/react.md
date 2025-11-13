---
title: Use Neon Auth with React
subtitle: Learn how to use Neon Auth with React.js
enableTableOfContents: true
updatedOn: '2025-11-12T00:00:00.000Z'
---

<InfoBlock>
  <DocsList title="Related docs" theme="docs">
    <a href="/docs/auth/overview">Neon Auth overview</a>
  </DocsList>
</InfoBlock>

<Steps>

## Create a Neon project with Auth enabled

If you don't have a Neon project yet, create one at [console.neon.tech](https://console.neon.tech).

Once your project is ready, navigate to the **Auth** page in your project dashboard and click **Enable Auth**.

After enabling, you'll see your **Auth Base URL** on the Configuration tab. Copy this URL - you'll need it in the next step.

## Create a React app

Create a React app using Vite.

```bash
npm create vite@latest my-app -- --template react
```

## Install the Neon SDK

The Neon SDK provides authentication methods like `signUp()`, `getSession()`, and `signOut()` for your React app.

```bash
cd my-app && npm install @neondatabase/neon-js
```

## Set up environment variables

Create a `.env` file in your project root and add your Auth Base URL:

```bash
VITE_NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-2.aws.neon.build/neondb/auth
```

<Admonition type="note">
Replace the URL with your actual Auth Base URL from the Neon Console.
</Admonition>

## Configure the Neon client

Create a `src/neon.js` file to configure your Neon client:

```javascript
import { createClient } from '@neondatabase/neon-js'

export const neon = createClient({
  auth: {
    baseURL: import.meta.env.VITE_NEON_AUTH_BASE_URL
  }
})
```

## Build your authentication UI

Neon JS uses a programmatic approach for managing auth state. You'll use React hooks like `useEffect` to check the session and handle auth changes.

Replace the contents of `src/App.jsx` with the following code to implement [sign-up](/docs/auth/sdk/auth-methods#signup), [sign-in](/docs/auth/sdk/auth-methods#signin), and [sign-out](/docs/auth/sdk/auth-methods#signout):

```jsx
import { useState, useEffect } from 'react'
import { neon } from './neon'

export default function App() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    neon.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
  }, [])

  const handleSignUp = async (e) => {
    e.preventDefault()
    const { error } = await neon.auth.signUp({ email, password })
    if (error) {
      alert(error.message)
      return
    }
    const { data } = await neon.auth.getSession()
    setSession(data.session)
  }

  const handleSignOut = async () => {
    await neon.auth.signOut()
    setSession(null)
  }

  if (loading) return <div>Loading...</div>

  if (session) {
    return (
      <div>
        <h1>Logged in as {session.user.email}</h1>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    )
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
  )
}
```

## Start your app

Start the development server:

```bash
npm run dev
```

Open your browser to `http://localhost:5173` and create a test user.

## See your users in the database

As users sign up, their profiles are synced to your Neon database in the `neon_auth.user` table.

Query your users table in the SQL Editor to see your new users:

```sql
SELECT * FROM neon_auth.user;
```

</Steps>

## Next steps

- [Learn about Neon Auth concepts](/docs/auth/overview)
- [Explore the Neon Data API](/docs/data-api/get-started) to build a REST API for your data
- [View complete SDK reference](/docs/auth/sdk/auth-methods)
