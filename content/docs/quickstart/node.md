---
title: Run a Node.js app
---

1. Add postgres client to your project. In this example we used [postgres.js](https://www.npmjs.com/package/postgres), but feel free to choose another one
2. Store your Neon credentials somewhere, for example in the `.env` file.

```shell
    NEON_HOST=...
    NEON_DB=...
    NEON_USER=...
    NEON_PASS=...
    NEON_PORT=...` \
```

3. To connect to the database using postgres client and your Neon credentials, add the following code to the `pages/api/hello_worlds.js`

```javascript
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
