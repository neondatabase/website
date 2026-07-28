---
title: Test Your Database Without Mocks
description: 'Don''t mock, branch'
excerpt: >-
  Mocks for databases are extremely brittle and complicated. – javcasas Mocks in
  general are rarely worth it, the DB ones: 10x so. – pdimitar Was dealing with
  mocking voodoo garbage this morning as a result of fixing a bug. What a
  horrible mess just to claim a few lines of “test co...
date: '2025-01-15T10:38:35'
updatedOn: '2025-02-12T12:00:53'
category: postgres
categories:
  - postgres
  - product
authors:
  - andrew-tate
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/test-your-database-without-mocks/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Test Your Database Without Mocks - Neon
  description: >-
    Mocks are sometimes used for testing Postgres databases, but they're not a
    good idea. An alternative is using branches for testing via Neon.
  keywords: []
  noindex: false
  ogTitle: Test Your Database Without Mocks - Neon
  ogDescription: >-
    Mocks are sometimes used for testing Postgres databases, but they're not a
    good idea. An alternative is using branches for testing via Neon.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/test-your-database-without-mocks/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/test-your-database-without-mocks/neon-mock-database-1-1024x576-71b232f0.jpg)

<blockquote>
<p><em>Mocks for databases are extremely brittle and complicated. –</em> <a href="https://news.ycombinator.com/item?id=42553345">javcasas</a></p>
</blockquote>

<blockquote>
<p><em>Mocks in general are rarely worth it, the DB ones: 10x so.</em> – <a href="https://news.ycombinator.com/item?id=42553379">pdimitar</a></p>
</blockquote>

<blockquote>
<p><em>Was dealing with mocking voodoo garbage this morning as a result of fixing a bug. What a horrible mess just to claim a few lines of “test coverage.”</em> – <a href="https://news.ycombinator.com/item?id=42553511">kerblang</a></p>
</blockquote>

<blockquote>
<p><em>Genuinely don’t think anyone who has written >0 tests with stubbed DB and maintained them for >0 months could continue to think it’s a good idea. Tests ~nothing. Painful upkeep.</em> – <a href="https://x.com/brandur/status/1866195695377752549">Brandur</a></p>
</blockquote>

<blockquote>
<p><em>Never use mocks</em>. – <a href="https://x.com/ChShersh/status/1878404798535344310">Dmitrii Kovanikov</a></p>
</blockquote>

It looks like mocks aren’t very popular.<br />

## The Mocks Don’t Work

🎵They just make you worse.

The idea of mocks (or stubs) is simple–you are testing your application’s logic, not your database. Tests should be idempotent, so you replace actual database calls with fake ones that return predictable results. After all, if you’re following clean architecture principles, your business logic shouldn’t care whether it’s talking to Postgres or an in-memory stub.

That’s the theory. The practice? Well, that is where the fun starts.

The first significant issue is javcasas’ brittleness. Mocks for databases are often incredibly fragile. They require you to mimic the exact behavior of a complex database system, including SQL parsing, transaction management, and lock acquisition. So you end up with three problems:

- Creating realistic mock implementations is a lot of work. You must carefully define how the mock responds to queries and input data. You are probably putting more effort into the mock than you did the code.
- Your test logic becomes tightly coupled to the specific mock implementation. If the database changes or you need a slightly different response in your test, you must rewrite the mock from the ground up.
- As your application evolves and the database schema changes, keeping the mocks in sync with the actual database becomes a maintenance nightmare.

You either end up with something trivial, like this:

```javascript
interface Database {
  query(sql: string): Promise<any []>;
  transaction<T>(fn: () => Promise<T>): Promise<T>;
}

// What starts as a simple mock...
class MockDatabase implements Database {
  private data = new Map<string, any>();

  async query(sql: string): Promise<any []> {
    return [{ id: 1, name: 'test' }]; // Overly simplistic
  }

  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    return fn(); // Missing isolation levels, rollbacks, etc.
  }
}
```

Or, you essentially end up building your own mini-database, taking shortcuts that decrease the significance and trustworthiness of your tests with each compromise. But real database interactions are far more nuanced. You need proper verification of foreign keys, referential integrity, and atomic transactions. Using a mock glosses over these critical aspects, giving you a false sense of security while missing potential runtime issues.

The effort required to maintain these mocks nearly always outweighs the value they provide. The tests become an exercise in mocking rather than a good indicator of whether the actual code functions correctly. Creating and managing mocks, especially for complex systems like databases, can feel like kerblang’s black magic. When mocks fail, debugging them can be extremely difficult, leading to a frustrating and time-consuming experience.

But the key problem is the one [Brandur](https://brandur.org/) highlighted above: Because mocks are often so far removed from the actual behavior of the database, tests using them provide little to no confidence in the application’s correctness. They don’t accurately reflect how the application will interact with the actual database. They only test that the mock behaves how _you told it to_, not that the real interaction would work.

## So, Why Mock?

Despite the overwhelming criticism, mocking persists. Why? Because hitting a db during testing still runs into these problems.

### Isolation

The argument for mocking typically starts with isolation. Your tests shouldn’t depend on a shared database’s state, right? A mock gives you a clean slate every time, with no chance of cross-contamination between test runs.

With mocks, you can precisely control the test environment, simulate edge cases, and verify behavior under specific conditions that might be difficult to reproduce with a real database. They also allow you to test failure scenarios and boundary conditions without setting up complex database states or waiting for timeouts.

But this argument falls apart under scrutiny. Yes, you obviously don’t want your tests hitting production. And yes, a shared test database can be problematic–you never quite know what state it’s in, especially with concurrent test runs. The traditional answer has been test containers–spin up a fresh database for each test suite.

However, test containers come with their own set of challenges:

- Resource overhead – each container needs memory and CPU
- Port allocation conflicts when running tests in parallel
- Complex cleanup to ensure containers are properly torn down
- Platform-specific issues (Windows vs Linux vs macOS)
- CI pipeline complications with container orchestration

And when containers fail, debugging becomes a nightmare of log files and network traces, often masking the actual test failures beneath infrastructure issues.

### Speed

The second major argument for mocking is speed. Database interactions are inherently slow due to I/O and network latency. A mock lets your tests run in milliseconds instead of seconds, which adds up when running thousands of tests.

In-memory mocks eliminate network overhead wholly. By removing actual data persistence, they can process operations orders of magnitude faster than real databases. For rapid development cycles and continuous integration pipelines, this performance difference can mean the difference between running tests on every save and only running them before commits.

This argument seems more compelling until you examine it closely. Spooling up multiple test databases is computationally expensive, especially for ephemeral tasks like running a test suite. Test containers again present themselves as a solution, but they introduce their own performance penalties:

- Container startup and teardown time
- Database initialization overhead
- Resource contention when running multiple containers
- Slower CI/CD pipelines due to container management
- Potential race conditions and timing issues

The performance benefits of mocks often mask hidden costs in maintenance time and debugging effort, making the supposed speed advantages more theoretical than practical in real-world development scenarios.

## Don’t Mock, Branch

There is another option–[branching](https://neon.tech/docs/introduction/branching).

Instead of creating mocks or maintaining separate test databases, you create lightweight, isolated copies of your actual database. But here’s the clever part–these aren’t full copies. Through copy-on-write technology, each branch initially references the same data as its parent, only creating new copies when changes are made. This means you get instant test environments with real data and real behavior but without the overhead of full database copies.

![Image](https://cdn.neonapi.io/public/images/pages/blog/test-your-database-without-mocks/671-1024x426-2fa9c82d.png)

With [Neon’s Dev/Test paradigm](https://neon.tech/docs/use-cases/dev-test), let’s look at how branching transforms common testing scenarios.

### Isolated Testing Environments

Consider a typical scenario where multiple developers need to test different features. Traditionally, they’d either step on each other’s toes in a shared database or maintain complex mocks. With branching, each developer or test suite gets its own isolated environment:

```bash
# Create separate branches for different test suites
neonctl branches create --name test/auth-flow
neonctl branches create --name test/payment-processing
```

These branches are completely isolated, so tests can modify data without affecting other environments. When you’re done, you can delete or reset the branch to match the parent – no cleanup scripts are needed.

### Working with Real Data

One of the biggest challenges in testing is obtaining realistic test data. Mock data is often oversimplified and misses edge cases while copying production databases is time-consuming and resource-intensive. Branching elegantly solves this.

You can maintain a “Neon Twin,” a main branch that’s regularly synchronized with your production or staging database. From this main branch, you can instantly create test environments that have real-world data. Even better, you can create branches from any point in your database’s history, making it perfect for debugging production issues:

```bash
# Create a branch from when a bug was reported
neonctl branches create --name bug-investigation --parent "2024-01-10T14:30:00Z"
```

### Continuous Integration and Testing

With branching, instead of maintaining complex test setup scripts or mock data, you can automatically create fresh database environments for each pull request:

```javascript
jobs:
  test-auth:
    runs-on: ubuntu-latest
    steps:
      - uses: neondatabase/create-branch-action@v1
        with:
          branch-name: ci-auth-${{ github.sha }}
```

The branch can be automatically deleted or reset when the tests are complete. This ensures that each test run starts with a clean, consistent state while maintaining the realism of testing against actual database behavior.

Branching offers significant resource benefits. Because branches share storage through copy-on-write, you’re not paying to store multiple copies of the same data. Compute resources automatically scale to zero when not in use, so you only pay for active test runs. This can lead to substantial cost savings compared to maintaining separate test databases, investing time in maintaining mock implementations, or the costs associated with spinning up containers constantly.

![Image](https://cdn.neonapi.io/public/images/pages/blog/test-your-database-without-mocks/672-1024x469-84bb57e7.png)

## The End of Mocking?

<blockquote>
<p><em>“Genuinely don’t think anyone who has written >0 tests with stubbed DB and maintained them for >0 months could continue to think it’s a good idea.” </em></p>
</blockquote>

It’s not a good idea. Test database calls shouldn’t be mocked. You should call your database. With branching, you get the isolation and reproducibility that mocks promise, but with real database behavior and actual data. You’ll know that your code works with _your_ database and _your_ data–more reliability, faster development cycles, and reduced overhead.

A final word from the ever-wise HN commenter:

<blockquote>
<p><em>Nobody cares about your precious units they care that the system works.</em> – <a href="https://news.ycombinator.com/item?id=42555969">bluGill</a></p>
</blockquote>

With branching, you’ll know the system works.

---

_[Neon](https://neon.tech/home) is a serverless Postgres database with instant provisioning, autoscaling, and database branching, used in production by thousands of teams. Sign up to the Free Plan [here](https://console.neon.tech/signup)._
