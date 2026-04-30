---
title: 'Neon Testing: a Vitest Library for Your Integration Tests'
description: Set up disposable Postgres test databases powered by Neon branching
excerpt: >-
  You can mock database calls all day long, but when your code hits production,
  the real database doesn’t lie. Unique constraints fail, transactions don’t
  roll back as they should, and subtle behaviors that mocks can’t reproduce,
  causing bad code to go into production. Running inte...
date: '2025-09-09T18:20:19'
updatedOn: '2025-09-10T01:13:35'
category: community
categories:
  - community
authors:
  - mikael-lirbank
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-testing-a-vitest-library-for-your-integration-tests/cover.jpg
  alt: null
isFeatured: false
seo:
  title: 'Neon Testing: a Vitest Library for Your Integration Tests - Neon'
  description: >-
    Try Neon Testing, an open-source utility for Vitest that turns Neon branches
    into disposable test environments.
  keywords: []
  noindex: false
  ogTitle: 'Neon Testing: a Vitest Library for Your Integration Tests - Neon'
  ogDescription: >-
    Try Neon Testing, an open-source utility for Vitest that turns Neon branches
    into disposable test environments.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/neon-testing-a-vitest-library-for-your-integration-tests/social.jpg
source:
  wpId: 10860
  wpSlug: neon-testing-a-vitest-library-for-your-integration-tests
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/neon-testing-a-vitest-library-for-your-integration-tests/neon-testing-1-1024x576-4a984b29.jpg)

<Admonition type="info" title="Community built">
Neon Testing is an independent project built and maintained by Mikael Lirbank. [Check out the repo](https://github.com/starmode-base/neon-testing) and [Mikael’s website](https://www.lirbank.com/).
</Admonition>

You can mock database calls all day long, but when your code hits production, the real database doesn’t lie. Unique constraints fail, transactions don’t roll back as they should, and subtle behaviors that mocks can’t reproduce, causing bad code to go into production.

Running integration tests against a real database should catch these issues, but in practice, this is painful: managing containers, seeding and resetting test data, applying migrations, cleaning up resources… Neon already gives you instant, isolated database branches, making the process of realistic database copies way more straightforward. To make integration tests with branching even more simple, I built a project for myself called Neon Testing – it worked so well that I decided to open source it.

## What is Neon Testing?

[Neon Testing](https://github.com/starmode-base/neon-testing) is an open-source utility for [Vitest](https://vitest.dev/) that automates the lifecycle of Neon branches for database integration tests. It turns branches into disposable test environments: each test file runs against its own clean Postgres branch with your production schema and constraints intact.

Instead of wiring up your own branch creation, teardown, and connection logic, you can drop Neon Testing into your Vitest setup and let it provision a fresh branch for every test file and clean it up when the file finishes. Each test file is fully isolated (Vitest runs them in parallel), while tests inside a file share the same branch. If you need per-test isolation, you can reset the database in a `beforeEach` hook.

## Getting started

Let’s walk through a simple example. Here’s a basic user creation function that relies on a unique index to prevent multiple users with the same email address.

```typescript
// db/users.ts
import { Pool } from "@neondatabase/serverless";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

export async function createUser(email: string) {
  return pool.query("INSERT INTO users (email) VALUES ($1)", [email]);
}
```

If your `users` table has a unique constraint on `email`, calling this function twice with the same email should fail the second time. That’s exactly the kind of behavior you can’t mock, and a stale test database without the constraint would give you a false positive.

Let’s test this behavior with Neon Testing.

### Step 1: Set up

Install the packages:

```bash
bun add @neondatabase/serverless
bun add -D neon-testing vitest
```

Configure Vitest to ensure tests use isolated databases. The `neonTesting` plugin clears any existing `DATABASE_URL` environment variable, preventing tests from accidentally using your local or production database instead of the isolated test branches:

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import { neonTesting } from "neon-testing/vite";

export default defineConfig({
  plugins: [neonTesting()],
});
```

Create a small setup module that you’ll reuse across all your test files:

```typescript
// test-setup.ts
import { makeNeonTesting } from "neon-testing";

// Configure once (see npm docs for options)
export const withNeonTestBranch = makeNeonTesting({
  apiKey: process.env.NEON_API_KEY!,
  projectId: process.env.NEON_PROJECT_ID!,
  // Recommended for Neon WebSocket drivers to automatically close connections:
  autoCloseWebSockets: true,
});
```

### Step 2: Write tests that verify real database behavior

Now you can test the actual constraint behavior against your real production schema (with or without production data, or even with anonymized production data). Each test file automatically gets its own fresh database clone on each run, so tests are completely isolated.

```typescript
// db/users.test.ts
import { test, expect } from "vitest";
import { withNeonTestBranch } from "../test-setup";
import { createUser } from "./users";

// Enable Neon Testing for this file
withNeonTestBranch();

test("unique email constraint", async () => {
  await createUser("test@example.com");
  await expect(createUser("test@example.com")).rejects.toThrow();
});
```

### Step 3: Run your tests

Start Vitest in watch mode and see your tests run as you edit:

```bash
bunx vitest
```

That’s it, your tests now run against the same database constraints and behaviors as production.

## Wrapping up

Integration testing usually fails teams, not because the tests are hard to write, but because the infrastructure is hard to stand up and maintain. By combining Neon’s branching and the Neon Testing library, that pain is gone.

Give it a try – you can find it on [npm](https://www.npmjs.com/package/neon-testing?utm_source=chatgpt.com) and [GitHub](https://github.com/mikaellirbank/neon-testing?utm_source=chatgpt.com).
