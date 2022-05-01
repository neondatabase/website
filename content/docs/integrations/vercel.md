### Getting Started with Next.js + vercel

1. [Create a next.js project](https://nextjs.org/learn/basics/create-nextjs-app/setup) if you don’t have one.
2. Create a Neon project for your app. You can configure your db schema from Neon Console or using tools like Prisma.
3. Add postgres client to your app. In this example we used [postgres.js](https://www.npmjs.com/package/postgres), but feel free to choose another one.
4. Put your Neon credentials to the `.env` file. \

```shell
NEON_HOST=...
NEON_DB=...
NEON_USER=...
NEON_PASS=...
NEON_PORT=...
```

You can use either a connection string or connection options separately.

5. Connect to the database with postgres client and your Neon credentials from your api handlers or server functions.

```javascript pages/api/hello_worlds.js
import postgres from 'postgres';

const sql = postgres({
  host: process.env.NEON_HOST,
  port: process.env.NEON_PORT,
  database: process.env.NEON_DB,
  username: process.env.NEON_USER,
  password: process.env.NEON_PASS,
});

const result = await sql.uafe(req.body);
```

Do not ever expose your Neon credentials to the browser.

You can also use Prisma to manage your database, check our how-to [here](#using-with-prisma). \

