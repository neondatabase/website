---
title: Stop Mocking Auth (It’s Breaking Your Tests)
description: Most authentication bugs only show up after you ship
excerpt: >-
  If your application has user accounts, authentication touches everything: who
  can access what, what data belongs to whom, and how your system behaves when
  sessions expire or credentials are invalid. Auth is also one of the most
  commonly mocked components in test suites. The reaso...
date: '2025-12-29T18:23:12'
updatedOn: '2026-01-02T17:37:39'
category: app-platform
categories:
  - app-platform
authors:
  - shridhar-deshmukh
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/stop-mocking-auth-its-breaking-your-tests/cover.jpg
  alt: null
isFeatured: true
seo:
  title: Stop Mocking Auth (It’s Breaking Your Tests) - Neon
  description: >-
    Mocking auth makes tests pass, and production fail. Learn a better way to
    test real user flows with isolated database branches.
  keywords: []
  noindex: false
  ogTitle: Stop Mocking Auth (It’s Breaking Your Tests) - Neon
  ogDescription: >-
    Mocking auth makes tests pass, and production fail. Learn a better way to
    test real user flows with isolated database branches.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/stop-mocking-auth-its-breaking-your-tests/cover.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/stop-mocking-auth-its-breaking-your-tests/neon-stop-mocking-auth-1-1024x576-6999f6ec.jpg)

If your application has user accounts, authentication touches everything: who can access what, what data belongs to whom, and how your system behaves when sessions expire or credentials are invalid. Auth is also one of the most commonly mocked components in test suites.

The reasoning makes sense. Real auth means real databases, real network calls, and real shared state. Mocking keeps tests fast and isolated. But this trade-off comes at a cost: your tests no longer verify the components most likely to break.

## Testing with mocked auth = fake confidence

Most test suites lie about authentication. They mock the auth layer to keep tests fast and isolated, but in doing so, they skip the very things that break in production: password verification, session management, database constraints, and the integration between auth and application data.

Here’s a test that passes with flying colors:

```typescript
mockAuthClient.signIn.mockResolvedValue({
  user: { id: 'user-123', email: 'test@example.com' },
  session: { token: 'session-token' },
});

const result = await mockAuthClient.signIn({
  email: 'test@example.com',
  password: 'any-password-works-in-mocks',
});

expect(result.session.token).toBeDefined(); // ✓ Passes!
```

The test passes with _any_ password. The mock returns whatever you told it to return, regardless of whether the credentials are valid. Ship this to production, and you’ll discover the bug when your users can’t log in.

This isn’t a contrived example. It’s the natural result of mocking a complex system, and auth is the most complex part of any app, precisely because it touches everything. Unlike APIs or queues, auth defines your system’s trust boundaries. When tests lie about auth, they lie about who is allowed to do what, which invalidates every downstream assertion.

When you mock auth, you’re not testing auth at all. You’re testing your assumptions about how auth behaves. This type of mocking hides:

- **Password hashing and verification**. Is bcrypt actually being called? Is the hash comparison correct? The mock doesn’t know.
- **Database constraints**. What happens when two users sign up with the same email simultaneously? Mocks let all of them succeed. A real database enforces the UNIQUE constraint.
- **Session management**. Are sessions being created and stored? Do they expire correctly? Mocks just return fake tokens.
- **Data relationships**. If your app joins user profiles with auth data, mocks can’t verify the SQL actually works.

## 3 bug examples you would miss with mocks

### Password verification

With mocked auth, password handling is usually reduced to “return a user if signIn is called.” The mock doesn’t hash passwords. It doesn’t compare hashes. It doesn’t care what password you pass in. That means tests like this happily pass:

```typescript
mockAuthClient.signIn.mockResolvedValue({
  user: { id: 'user-123', email: 'test@example.com' },
  session: { token: 'session-token' },
});

await mockAuthClient.signIn({
  email: 'test@example.com',
  password: 'literally-anything',
});
```

But the test doesn’t prove that

- passwords are hashed correctly on signup
- the comparison logic works
- invalid passwords are rejected

It only proves that your mock returns what you told it to return. A broken password flow can ship to production unnoticed, because your tests never exercised the real logic in the first place.

### Race conditions

Mocks also erase concurrency bugs. Consider concurrent signups with the same email address. In a real auth system, the database should enforce a UNIQUE constraint so only one user can be created. With mocks, all of them succeed:

```typescript
const results = await Promise.all([
  mockAuthClient.signUp({ email: 'race@example.com', password: 'pass1' }),
  mockAuthClient.signUp({ email: 'race@example.com', password: 'pass2' }),
  mockAuthClient.signUp({ email: 'race@example.com', password: 'pass3' }),
]);

expect(results).toHaveLength(3); // ✓ Passes
```

The mock has no concept of constraints, transactions, or locking. Every request is treated as independent, so the test passes even though the same scenario would fail (or worse, partially succeed) in production. These are the kinds of bugs that only show up when multiple users hit the same endpoint at the same time.

### SQL bugs

In real apps, auth data is often joined with application data (user profiles, permissions, activity logs…) Mocks can’t validate any of this. If your application code assumes a certain schema, column name, or join condition, a mock will happily return a fake object that matches your assumptions. A typo in a column name or a broken JOIN won’t be caught until the query actually runs against a real database.

## But testing against real auth is hard… Right?

The obvious alternative is to test against a real database, but this is easier said than done.

| Approach                          | Problem                                                                                                                       |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Shared staging database           | Tests collide. One test creates a user, another test deletes it, and suddenly you have flaky failures that only happen in CI. |
| Spin up a fresh database per test | Slow and expensive. Provisioning a database, running migrations, and seeding data adds minutes to every test run.             |
| Test against production           | Dangerous. Test data pollutes real data, and a bug in your test could affect real users.                                      |

Auth makes this worse. A typical auth system has users, sessions, verification tokens, password reset flows, and OAuth connections. All of this state must exist for your tests to run, and it must be isolated so that parallel test runs don’t interfere with each other.

Setting this up manually for each test run is painful. Most teams give up and reach for mocks instead.

## What changes when auth lives in your database (and you can branch)

The solution comes from rethinking where auth data lives. With [Neon Auth](https://neon.com/docs/auth/overview), authentication state is stored directly in your database in a managed neon_auth schema. Users, sessions, accounts, and verification tokens all live in Postgres tables alongside your application data.

![Image](https://cdn.neonapi.io/public/images/pages/blog/stop-mocking-auth-its-breaking-your-tests/screenshot-2025-12-29-at-95819-am-1024x419-a4fbcc4d.png)

This collapses the traditional boundary between ‘auth data’ and ‘application data’. From the database’s perspective, users are just rows, which turns auth from an external dependency into a testable state.

### Auth becomes another joinable table

This means you can JOIN auth data with application data in a single SQL query. A view that shows user details alongside their activity is just a standard Postgres view:

```sql
CREATE VIEW user_details AS
SELECT
    u.id, u.email,
    p.display_name, p.bio,
    (SELECT COUNT(*) FROM todos t WHERE t.user_id = u.id) as todo_count
FROM neon_auth.user u
LEFT JOIN user_profiles p ON p.user_id = u.id;
```

This is useful on its own, but [Neon](https://neon.com/) unlocks something more powerful for testing – when you [branch](https://neon.com/docs/introduction/branching) the database, auth branches with it.

### When your database branches, auth branches too

Neon supports instant [authentication branching](https://neon.com/docs/auth/branching-authentication) using copy-on-write. Creating a branch doesn’t copy any data. It creates metadata pointers to the existing pages, which takes about a second regardless of database size. Writes to the branch only affect the branch; the parent remains untouched.

Here’s what this means for testing:

```bash
Production (main branch)
      │
      │ branch (~1 second, copy-on-write)
      │
      └──► test-pr-123
           ├─ Database URL: ep-xxx-123.neon.tech
           ├─ Auth URL: br-xxx-123.neonauth...  ◄── isolated endpoint
           │
           ├─ Run signup test → real user created in branch
           ├─ Run login test → real password verified
           ├─ Run profile test → real SQL JOINs executed
           │
           └─ Delete branch → all test data gone
```

Each branch gets its own Auth URL. The Auth URL is the endpoint that issues sessions and verifies credentials against the branch’s auth tables. Because it’s tied to the branch, tokens issued in one branch are invalid everywhere else. Users created in test-pr-123 don’t exist in production or in test-pr-456. Sessions, verification tokens, and password resets are all isolated. When the branch is deleted, everything disappears.

## How testing against a real database catches the bugs we presented earlier

### Password verification actually runs

When you test against real auth backed by a database, passwords are hashed on signup and verified on login. Passing the wrong password doesn’t “sort of work”, it fails. The test now proves something meaningful:

- password hashing is configured correctly
- verification logic is executed
- invalid credentials are rejected

A broken auth flow fails fast in tests instead of failing in production.

### Database constraints stop race conditions

With a real database, constraints exist whether you remember them or not. Running concurrent signups with the same email now results in what you’d expect: at most one succeeds. The rest fail due to the database enforcing uniqueness. This is not something you need to simulate or manually code, it’s simply how databases work.

### JOINs between auth and app data are actually executed

When auth data lives alongside application data, your tests can execute the same queries your app uses in production. Views, JOINs, aggregates, and foreign keys are all validated by the database engine itself. If a column is missing, a JOIN condition is wrong, or a relationship doesn’t exist, the test fails immediately.

## How this fits into CI

This [branching workflow](https://neon.com/branching) for testing auth (and everything else) integrates cleanly into CI/CD. E.g, imagine this GitHub Actions setup – it returns both a database connection string and the branch-specific Auth URL, so every PR gets

- its own database branch
- its own Neon Auth endpoint tied to that branch
- optional [data anonymization](https://neon.com/docs/workflows/data-anonymization), applied at branch creation time

```yaml
# Create an isolated branch for this PR
- name: Create Neon branch
  id: create-branch
  uses: neondatabase/create-branch-action@v6.3.0
  with:
    project_id: ${{ secrets.NEON_PROJECT_ID }}
    branch_name: test-pr-${{ github.event.pull_request.number }}
    api_key: ${{ secrets.NEON_API_KEY }}
# Return a branch-specific Neon Auth endpoint
    get_auth_url: true
 # Optional: create an anonymized branch for safe testing
    masking_rules: ${{ vars.MASKING_RULES }}

# Run tests against real auth
- name: Run tests
  run: npm run test:branched
  env:
    TEST_DATABASE_URL: ${{ steps.create-branch.outputs.db_url_with_pooler }}
    TEST_AUTH_URL: ${{ steps.create-branch.outputs.auth_url }}

# Clean up when done (runs even if tests fail)
- name: Delete Neon branch
  if: always()
  uses: neondatabase/delete-branch-action@v3
  with:
    project_id: ${{ secrets.NEON_PROJECT_ID }}
    branch: test-pr-${{ github.event.pull_request.number }}
    api_key: ${{ secrets.NEON_API_KEY }}
```

Every pull request gets its own database branch with its own auth endpoint. Tests run against real Neon Auth. When the workflow finishes, the branch is deleted, and all test data disappears.

## You don’t need better mocks: you need branches

Mocking auth is a tradeoff that looks good on paper: fast tests, isolated tests, no infrastructure to manage. But you pay for it in production when the bugs that mocks hide show up in front of real users.

| Approach      | Speed  | Reliability | Isolation     |
| ------------- | ------ | ----------- | ------------- |
| Mocking       | Fast   | Hides bugs  | Isolated      |
| Shared DB     | Slower | Real data   | Tests collide |
| Neon branches | Fast   | Real data   | Isolated      |

[Neon Auth](https://neon.com/docs/auth/overview) **is built on** [Better Auth](https://www.better-auth.com/)**, meaning you get the best APIs, methods, and UI components. If your tests are still mocking auth, it might be time to try branching it instead. Get it for free via the** [Neon Free Plan.](https://console.neon.tech/signup)
