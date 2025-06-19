---
title: Neon Auth for JavaScript
subtitle: Add authentication to your JavaScript project. Access user data directly in your Postgres database.
enableTableOfContents: true
tag: beta
updatedOn: '2025-05-23T13:20:56.227Z'
---

<InfoBlock>
  <DocsList title="Other frameworks" theme="docs">
    <a href="/docs/neon-auth/quick-start/nextjs">Neon Auth for Next.js</a>
    <a href="/docs/neon-auth/quick-start/react">Neon Auth for React</a>
  </DocsList>
  <DocsList title="Sample project" theme="repo">
    <a href="https://github.com/neondatabase-labs/neon-auth-ts-template">Vanilla TS Template</a>
  </DocsList>
</InfoBlock>

<GetStarted
framework="JavaScript"
envVars={`

# Neon Auth environment variables for JavaScript/Node

STACK_PROJECT_ID=YOUR_NEON_AUTH_PROJECT_ID
STACK_PUBLISHABLE_CLIENT_KEY=YOUR_NEON_AUTH_PUBLISHABLE_KEY
STACK_SECRET_SERVER_KEY=YOUR_NEON_AUTH_SECRET_KEY

# Your Neon connection string

DATABASE_URL=YOUR_NEON_CONNECTION_STRING
`}
  templateRepo="neon-auth-ts-template"
  setupSteps={`

#### Install the JavaScript SDK

\`\`\`bash
npm install @stackframe/js
\`\`\`

#### Use your environment variables

Paste the Neon Auth environment variables from [Step 2](#get-your-neon-auth-keys) into your \`.env\` or \`.env.local\` file.

## Configure Neon Auth client

\`\`\`js
// stack/server.js
import { StackServerApp } from '@stackframe/js';

export const stackServerApp = new StackServerApp({
projectId: process.env.STACK_PROJECT_ID,
publishableClientKey: process.env.STACK_PUBLISHABLE_CLIENT_KEY,
secretServerKey: process.env.STACK_SECRET_SERVER_KEY,
tokenStore: 'memory',
});
\`\`\`

## Test your integration

1. Create a test user in the Console (see [Step 4](#create-users-in-the-console-optional)) and copy its ID.

2. Create \`src/test.ts\`:

   \`\`\`ts
   import 'dotenv/config';
   import { stackServerApp } from './stack/server.js';

   async function main() {
   const user = await stackServerApp.getUser('YOUR_USER_ID_HERE');
   console.log(user);
   }

   main().catch(console.error);
   \`\`\`

3. Run your test script however you like:

   \`\`\`bash shouldWrap

   # if you have a dev/test script in package.json

   npm run dev

   # or directly:

   npx dotenv -e .env.local -- tsx src/test.ts
   \`\`\`

You should see your test user's record printed in the console.
`}
/>
