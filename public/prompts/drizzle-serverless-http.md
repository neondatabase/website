Switch this project's Drizzle client to the Neon serverless HTTP driver so it runs well in serverless and edge environments (for example Vercel, Netlify, or Cloudflare Workers):

1. Install the Neon serverless driver if it is not already present:
   ```bash
   npm install @neondatabase/serverless
   ```
2. Change `src/db.ts` to use the `neon-http` adapter:
   ```typescript
   import 'dotenv/config';
   import { drizzle } from 'drizzle-orm/neon-http';
   import { neon } from '@neondatabase/serverless';

   const sql = neon(process.env.DATABASE_URL!);
   export const db = drizzle(sql);
   ```
3. Keep using the pooled `DATABASE_URL` here. Each query over this driver is a separate HTTPS request, which is why it suits short-lived, stateless functions.
4. Tell me the trade-off: the HTTP driver does not hold a session, so if the app needs interactive transactions or `LISTEN`/`NOTIFY`, use the Neon WebSocket driver instead.

Reference: https://neon.com/docs/guides/drizzle.md.
