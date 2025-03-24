---
title: 'AI Rules: Neon Auth'
subtitle: 'Context rules for AI tools to help implement authentication with Stack Auth and Neon databases'
enableTableOfContents: true
---

## How to use

If you use Cursor or any AI-based code assistant that supports custom rules:

1. Create a `.cursor/rules` directory in your project
2. Copy the rules below into `.cursor/rules/neon-auth.mdc`
3. (Optional) Re-index your project in Cursor to pick up the new rules

For other AI tools, use their respective "include file" features:
- GitHub Copilot: Add `#<filename>` in your comments
- Zed: Use the `/file` command

## Rules

```
# Neon Auth Rules

This file contains context rules for AI tools to help implement authentication with Stack Auth and Neon databases.

## Overview

These rules provide guidance for AI tools when implementing authentication flows using Stack Auth with Neon databases.

## Implementation Guidelines

1. Use the Stack Auth library for authentication
2. Connect to Neon database using the provided connection string
3. Store user credentials securely
4. Implement proper error handling for authentication failures

## Example Code

```typescript
import { StackAuth } from 'stack-auth';
import { neon } from '@neondatabase/serverless';

// Initialize Stack Auth
const auth = new StackAuth({
  clientId: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET
});

// Connect to Neon database
const sql = neon(process.env.DATABASE_URL);

// Authenticate user
async function authenticateUser(email, password) {
  try {
    const user = await auth.login(email, password);
    
    // Store user session in database
    await sql`INSERT INTO sessions (user_id, token) VALUES (${user.id}, ${user.token})`;
    
    return user;
  } catch (error) {
    console.error('Authentication failed:', error);
    throw new Error('Authentication failed');
  }
}
```

## Security Considerations

- Never store plaintext passwords
- Use environment variables for sensitive credentials
- Implement rate limiting for authentication attempts
- Use HTTPS for all connections
```
