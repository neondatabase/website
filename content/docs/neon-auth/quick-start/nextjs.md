---
title: Neon Auth for Next.js
subtitle: Add authentication to your Next.js (App Router) project. Access user data directly in your Postgres database.
enableTableOfContents: true
tag: beta
redirectFrom:
  - /docs/guides/neon-auth
updatedOn: '2025-05-23T13:20:56.227Z'
---

<InfoBlock>
  <DocsList title="Other frameworks" theme="docs">
    <a href="/docs/neon-auth/quick-start/react">Neon Auth for React</a>
    <a href="/docs/neon-auth/quick-start/javascript">Neon Auth for JavaScript</a>
  </DocsList>
  <DocsList title="Sample project" theme="repo">
    <a href="https://github.com/neondatabase-labs/neon-auth-demo-app">Next.js Demo App</a>
  </DocsList>
</InfoBlock>

<GetStarted
framework="Next.js"
envVars={`

# Neon Auth environment variables for Next.js

NEXT_PUBLIC_STACK_PROJECT_ID=YOUR_NEON_AUTH_PROJECT_ID
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=YOUR_NEON_AUTH_PUBLISHABLE_KEY
STACK_SECRET_SERVER_KEY=YOUR_NEON_AUTH_SECRET_KEY

# Your Neon connection string

DATABASE_URL=YOUR_NEON_CONNECTION_STRING
`}
  templateRepo="neon-auth-nextjs-template"
  setupSteps={`

#### Run the setup wizard

\`\`\`bash
npx @stackframe/init-stack@latest
\`\`\`

This sets up auth routes, layout wrappers, and handlers automatically for Next.js (App Router).

#### Use your environment variables

Paste the Neon Auth environment variables from [Step 2](#get-your-neon-auth-keys) into your \`.env.local\` file.

Then \`npm run dev\` to start your dev server.

#### Test your integration

Go to [http://localhost:3000/handler/sign-up](http://localhost:3000/handler/sign-up) in your browser. Create a user or two, and you can them [show up immediately](#see-your-users-in-the-database) in your database.
`}
/>
