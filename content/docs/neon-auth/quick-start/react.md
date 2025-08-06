---
title: Neon Auth for React
subtitle: Add authentication to your React project. Access user data directly in your Postgres database.
enableTableOfContents: true
tag: beta
updatedOn: '2025-05-23T13:20:56.227Z'
---

<InfoBlock>
  <DocsList title="Other frameworks" theme="docs">
    <a href="/docs/neon-auth/quick-start/nextjs">Neon Auth for Next.js</a>
    <a href="/docs/neon-auth/quick-start/javascript">Neon Auth for JavaScript</a>
  </DocsList>
  <DocsList title="Sample project" theme="repo">
    <a href="https://github.com/neondatabase-labs/neon-auth-react-template">React Template</a>
  </DocsList>
</InfoBlock>

<GetStarted
framework="React"
envVars={`

# Neon Auth environment variables for React (Vite)

VITE_STACK_PROJECT_ID=YOUR_NEON_AUTH_PROJECT_ID
VITE_STACK_PUBLISHABLE_CLIENT_KEY=YOUR_NEON_AUTH_PUBLISHABLE_KEY
STACK_SECRET_SERVER_KEY=YOUR_NEON_AUTH_SECRET_KEY

# Your Neon connection string

DATABASE_URL=YOUR_NEON_CONNECTION_STRING
`}
  templateRepo="neon-auth-react-template"
  setupSteps={`

### Install the React SDK

Make sure you have a [React project](https://react.dev/learn/creating-a-react-app) set up. We show an example here of a Vite React project with React Router.

\`\`\`bash
npm install @stackframe/react
\`\`\`

### Use your environment variables

Paste the Neon Auth environment variables from the [Get your Neon Auth keys](#get-your-neon-auth-keys) section into your \`.env.local\` file.

## Configure Neon Auth client

A basic example of how to set up the Neon Auth client in \`stack.ts\` in your \`src\` directory:

\`\`\`tsx
import { StackClientApp } from '@stackframe/react';
import { useNavigate } from 'react-router-dom';

export const stackClientApp = new StackClientApp({
projectId: import.meta.env.VITE_STACK_PROJECT_ID,
publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY,
tokenStore: 'cookie',
redirectMethod: { useNavigate },
});
\`\`\`

## Update your app to use the provider and handler

In your \`src/App.tsx\`:

\`\`\`tsx
import { StackHandler, StackProvider, StackTheme } from '@stackframe/react';
import { Suspense } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { stackClientApp } from './stack';

function HandlerRoutes() {
const location = useLocation();

return (
<StackHandler app={stackClientApp} location={location.pathname} fullPage /\>
);
}

export default function App() {
return (
<Suspense fallback={null}>
<BrowserRouter>
<StackProvider app={stackClientApp}>
<StackTheme>
<Routes>
<Route path="/handler/\*" element={<HandlerRoutes />} />
<Route path="/" element={<div>hello world</div>} />
</Routes>
</StackTheme>
</StackProvider>
</BrowserRouter>
</Suspense>
);
}
\`\`\`

## Start and test your app

\`\`\`bash
npm start
\`\`\`

Go to [http://localhost:3000/handler/sign-up](http://localhost:3000/handler/sign-up) in your browser. Create a user or two, and you can see them [show up immediately in the database](#see-your-users-in-the-database).
`}
/>
