---
title: A Simple 3-Step Process to Migrate from Supabase Auth to Neon Auth
description: Get your authentication sorted while migrating
excerpt: >-
  Neon Auth allows you to integrate authentication with your Postgres database,
  eliminating the traditional complexity of keeping user data in sync. With Neon
  Auth, your user profiles are exposed in a standard Neon Postgres table, giving
  you the simplicity of a managed auth solutio...
date: '2025-03-25T17:16:05'
updatedOn: '2025-04-15T19:21:04'
category: workflows
categories:
  - workflows
authors:
  - shridhar-deshmukh
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/supabase-auth-neon-auth/cover.jpg
  alt: null
isFeatured: true
seo:
  title: A Simple 3-Step Process to Migrate from Supabase Auth to Neon Auth - Neon
  description: >-
    If you’re in the process of moving from Supabase to Neon, here’s how you can
    also migrate your Auth in three simple steps.
  keywords: []
  noindex: false
  ogTitle: A Simple 3-Step Process to Migrate from Supabase Auth to Neon Auth - Neon
  ogDescription: >-
    If you’re in the process of moving from Supabase to Neon, here’s how you can
    also migrate your Auth in three simple steps.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/supabase-auth-neon-auth/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/supabase-auth-neon-auth/neon-supabase-migration-1-1024x576-28d69a58.jpg)

[Neon Auth](https://neon.tech/docs/guides/neon-auth) allows you to integrate authentication with your Postgres database, eliminating the traditional complexity of keeping user data in sync. With Neon Auth, your user profiles are exposed in a standard Neon Postgres table, giving you the simplicity of a managed auth solution while maintaining complete data ownership. You can reference user data in your application queries with simple JOINs and build out complex user-based applications with simple logic.

If you’re in the process of moving from Supabase to Neon, here’s how you can migrate your Auth.

## 1. Export Your Users From Supabase

Go to your Supabase project and click on the SQL editor in the left-hand menu. Then, run this query to retrieve all users and their encrypted passwords from Supabase.

```bash
CREATE OR REPLACE FUNCTION ufn_get_user_emails_and_passwords()
RETURNS table (email text, encrypted_password character varying(255)) AS
$$
BEGIN
RETURN QUERY
   SELECT
       i.email,
       u.encrypted_password
   FROM auth.users u
   JOIN auth.identities i ON u.id = i.user_id;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT * FROM ufn_get_user_emails_and_passwords();
```

You should end up with a table of all your users and their encrypted passwords:

![Image](https://cdn.neonapi.io/public/images/pages/blog/supabase-auth-neon-auth/ad4nxckogzvrrsc79zli8egnpx265srtotmrg0zdcdcbxbdjktrjguwreuop17tlxlpg790ymzp9utyaxrw6-wzowcwh6b7rbm9t-gyhbkxa2mys06nvfyyuzhlv1rqjcznglydgtolq-fa31d4ce.png)

The encrypted passwords are in [Modular Crypt Format](https://passlib.readthedocs.io/en/stable/lib/passlib.hash.bcrypt.html#format-algorithm) and will look something like this:

```bash
$2a$10$hH43XZOdWlK4gCktQlhc/.m8zhCdvXx4HGB/URGbhzJEr/26nwUtm
```

Where:

1. `$2a$` – Algorithm identifier for bcrypt
2. `10` – Cost factor (work factor) determining how computationally intensive the hashing is
3. `hH43XZOdWlK4gCktQlhc/. ` – Salt (22 characters)
4. `m8zhCdvXx4HGB/URGbhzJEr/26nwUtm` – Actual password hash (31 characters)

The Modular Crypt Format is crucial for your migration because:

1. **Passwordless migration**: Using MCF allows you to migrate users without requiring them to reset their passwords.
2. **Security preservation**: The original password never needs to be known or exposed during migration.
3. **Authentication continuity**: Users can continue logging in with their original password after migration because the hashing details are preserved.

Export that table as either CSV, markdown, or JSON. Here, we’re using a CSV.

## 2. Set Up Your Neon Auth Tables

Head to your project in Neon, then to Auth in the left-hand menu. Then select “Setup Stack Auth”:

![Image](https://cdn.neonapi.io/public/images/pages/blog/supabase-auth-neon-auth/ad4nxe1korqi2d7ae7tl3tt2jop23qwykzobbphzdhtayudx3zogikvfwrx5phhnejgsmbdyrd0hvpq-rkthvx1r19wrp0rk3iycbconlgkjofefg-jhqvmnmjb7h1axkzkq4poxdq-951fd811.png)

Unsurprisingly, this will set up Stack Auth. Grab your env variables from the next screen:

![Image](https://cdn.neonapi.io/public/images/pages/blog/supabase-auth-neon-auth/ad4nxfoze2er-9fqvob1oknallsrworeugrsd-hfpijhqeauylm9ywpwvu970qkmqa6li26kivr-59fqphribeeba0qheniiu0zdwcokkjkzrkhmemo02hq5f-jpd6i9qrbu6sxd4-6c65da40.png)

Congrats, that is all you need to do to set up Neon Auth!

## 3. Import Your Users to Neon Auth

Now the fun part–importing your users and their encrypted passwords into Neon Auth. For that, we’re going to use the Stack Auth REST API, specifically the [create users](https://docs.stack-auth.com/rest-api/server/users/create-user) endpoint.

Create a JavaScript file called stack-upload.mjs and add this:

```javascript
// User Migration Script

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import fetch from 'node-fetch';

// Configuration
const CONFIG = {
  csvFilePath: './user_data.csv', // Update this to your CSV file path
  apiUrl: 'https://api.stack-auth.com/api/v1/users',
  headers: {
    'Content-Type': 'application/json',
    'X-Stack-Project-Id': 'YOUR_PROJECT_ID',      // Update with your actual keys
    'X-Stack-Secret-Server-Key': 'YOUR_SERVER_KEY', // Update with your actual keys
    'X-Stack-Access-Type': 'server'  // Required header to specify access type
  },
  // Delay between requests in ms (to avoid rate limiting)
  requestDelay: 500
};

// Utility function to pause execution
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Main function
async function migrateUsers() {
  try {
    // Read and parse the CSV file
    console.log(`Reading CSV file from ${CONFIG.csvFilePath}...`);
    let fileContent = fs.readFileSync(CONFIG.csvFilePath, 'utf8');
    
    // Remove UTF-8 BOM if present
    if (fileContent.charCodeAt(0) === 0xFEFF) {
      console.log('Removing UTF-8 BOM from CSV file...');
      fileContent = fileContent.slice(1);
    }
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true  // Also enable BOM handling in the parser
    });
    
    console.log(`Found ${records.length} users to migrate.`);
    
    // Process each user
    let successCount = 0;
    let failureCount = 0;
    
    for (const [index, user] of records.entries()) {
      try {
        // Extract email and password from CSV record
        // Adjust these field names to match your CSV column headers
        const { email, encrypted_password } = user;
        
        if (!email) {
          console.error(`Row ${index + 1}: Missing email`);
          failureCount++;
          continue;
        }
        
        // Prepare the request payload
        const payload = {
          primary_email: email,
          primary_email_verified: true,
          primary_email_auth_enabled: true
        };
        
        // Add password_hash if present, otherwise skip
        if (encrypted_password) {
          payload.password_hash = encrypted_password;
        } else {
          console.warn(`Row ${index + 1}: No password hash for ${email}`);
        }
        
        // Send the request to create the user
        console.log(`[${index + 1}/${records.length}] Creating user: ${email}...`);
        
        const response = await fetch(CONFIG.apiUrl, {
          method: 'POST',
          headers: CONFIG.headers,
          body: JSON.stringify(payload)
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
          console.error(`Failed to create user ${email}: ${JSON.stringify(responseData)}`);
          failureCount++;
        } else {
          console.log(`Successfully created user: ${email}`);
          successCount++;
        }
        
        // Add delay between requests to avoid rate limiting
        await sleep(CONFIG.requestDelay);
        
      } catch (error) {
        console.error(`Error processing row ${index + 1}:`, error.message);
        failureCount++;
      }
    }
    
    // Print summary
    console.log('\n===== Migration Summary =====');
    console.log(`Total users: ${records.length}`);
    console.log(`Successfully migrated: ${successCount}`);
    console.log(`Failed: ${failureCount}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Execute the migration
migrateUsers().then(() => {
  console.log('Migration process completed.');
}).catch(err => {
  console.error('Fatal error:', err);
});
```

What does this do?

We parse the Supabase-exported CSV file through csv-parse’s synchronous parser, which handles UTF-8 BOM markers commonly present in exported data. We then construct the /user API payloads for each user record, preserving the original bcrypt password hashes in their Modular Crypt Format ($2a$10$[salt][hash]) through the password_hash parameter of the Stack Auth API.

We’ll need [csv-parse](https://www.npmjs.com/package/csv-parse) for this:

```bash
npm install csv-parse node-fetch
```

Run with:

```bash
node stack-upload.mjs
```

If all is hunky-dory, you’ll see this printing in your terminal:

```bash
Found 104 users to migrate.
[1/104] Creating user: user_ptoiciag@example.com...
Successfully created user: user_ptoiciag@example.com
[2/104] Creating user: user_myuitrii@example.com...
Successfully created user: user_myuitrii@example.com
[3/104] Creating user: user_gomoggmo@example.com...
Successfully created user: user_gomoggmo@example.com
...
```

When it is complete, all your users will be in Neon Auth and ready to use. You will have a `neon_auth.users_sync` table in your Neon database that you can now query as any other Postgres table.

<Admonition type="note" title="Note">
The `users_sync table` is a view into your user data, but it’s not the source of truth. It’s managed by Neon Auth and should be treated as read-only—avoid making direct modifications to this table.
</Admonition>

![Image](https://cdn.neonapi.io/public/images/pages/blog/supabase-auth-neon-auth/ad4nxdzg36xkif8ogyc5m6k9at3g-tzkl2arm-qewtg2xwjsjugwxwdrr80cors1kurf3jmw9diqcokhkna0d611fueuhkbkge8wetlev4tmmyogjgulf22ywrqzqqul01go2o2o4f4-787cff10.png)

We can quickly check using the [Neon Auth – Next.js Template App](https://github.com/neondatabase-labs/neon-auth-nextjs-template). Add your environment variables from Step 2 to that app, and you can sign in as a user (if you know their password):

![Image](https://cdn.neonapi.io/public/images/pages/blog/supabase-auth-neon-auth/ad4nxfzghikzt168ofqfsqzm7deb3l5xvo3lyhohmamke2wdxx27up0akdrah92yehbhgamszersbizbszyn48hqt-32xk9hsf8lkpkcc7-633fkljcnrbycyegqv-jvpvywgy-gg3g-0de1085a.gif)

That’s all there is to it. Calling it a three-step process is overkill. It’s really only two and a half steps at most.

Here’s more reading on Neon Auth to help you get your bearings:

- [Neon Auth is Here](https://neon.tech/blog/neon-auth-is-here-get-authentication-in-a-couple-of-clicks)
- [About Neon Auth](https://neon.tech/docs/guides/neon-auth)
- [Neon Auth Tutorial](https://neon.tech/docs/guides/neon-auth-tutorial)
- [Manage Neon Auth using the API](https://neon.tech/docs/guides/neon-auth-api)

Also, check out the [Stack Auth documentation](https://docs.stack-auth.com/overview) to learn more about building with Stack Auth + Neon. If you are currently on Supabase and want to try Neon, [sign up for a free Neon account](https://console.neon.tech/signup) to see how easy it is to migrate.
