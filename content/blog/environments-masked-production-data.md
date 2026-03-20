---
title: Create Environments with Masked Production Data Using Neon Branches
description: >-
  Use branching and PostgreSQL Anonymizer to safely replicate entire
  environments in seconds, even with PII in production
excerpt: >-
  Every engineering team needs realistic, reliable environments to test, debug,
  and ship software with confidence. The ideal setup sounds simple – clone your
  production database, run your tests, and move on. But “clone your production
  database” is easier said than done. Replicating...
date: '2025-05-15T19:18:23'
updatedOn: '2025-07-09T17:48:12'
category: workflows
categories:
  - workflows
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/environments-masked-production-data/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Create Environments with Masked Production Data Using Neon Branches - Neon
  description: >-
    Use Neon branching and static masking via PostgreSQL Anonymizer to safely
    replicate real environments, even with PII in production.
  keywords: []
  noindex: false
  ogTitle: Create Environments with Masked Production Data Using Neon Branches - Neon
  ogDescription: >-
    Use Neon branching and static masking via PostgreSQL Anonymizer to safely
    replicate real environments, even with PII in production.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/environments-masked-production-data/social.jpg
source:
  wpId: 9640
  wpSlug: environments-masked-production-data
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/environments-masked-production-data/neon-masked-data-1024x576-d68db6f5.jpg)

Every engineering team needs realistic, reliable environments to test, debug, and ship software with confidence. The ideal setup sounds simple – clone your production database, run your tests, and move on.

But “clone your production database” is easier said than done. Replicating a live Postgres environment means provisioning new instances and running manual dump/restore processes. Most developers end up working on a database that’s already out of sync with production.

This problem gets even worse when your production database contains personal data (PII) – customer names, emails, payment details, and so on. Now, on top of the already infrastructure-heavy process of provisioning new databases, you also have to figure out how to safely populate them.

## Why Cloning Production Environments Is Still Hard

To summarize:

- **Provisioning environments is slow and manual.** Spinning up a new instance, creating a fresh database, and populating it with data (real or fake) takes time and effort, together with coordination across teams and DBAs.
- **PII makes cloning a non-starter.** Regulatory frameworks like GDPR and HIPAA, internal security controls, and the practical risk of accidentally triggering real email or analytics flow make it impossible to copy production data into dev or test environments.
- **Seed data doesn’t cut it.** But it’s hard to populate non-prod environment with “fake data” in a way that truly mirrors production. The result is often an unrealistic environment that rarely keeps up with schema or business logic changes, and many bugs slip.
- **Environments drift constantly.** As the environments add up, staging lags behind prod, dev diverges from staging, and no one’s quite sure what version the tests are running against.

> **“Our testing process was very manual before. Product would create a test customer in our development environment, then generate PDFs; the QA team would test and manually run through all the math; then an engineer would have to go into the database, look at all the values, and handwrite them into fixtures for our end-to-end tests… That’s multiple days for every single change”** (_[Miguel Hernandez, Backend Tech Lead at Neo.Tax](https://neon.tech/blog/from-days-to-minutes-how-neo-tax-accelerated-their-development-lifecycle)_)

All of this points to one missing primitive – a safe, fast, and repeatable way to create production-like environments without exposing real user data. This is what we’re working on in Neon.

## The Solution: Branches + PostgreSQL Anonymizer in Neon

Solving this problem requires two things:

1. A way to clone production data without the operational overhead of managing new instances
2. A way to anonymize sensitive information before it reaches development or testing environments

Neon gives you both:

### Neon branches – Instant, production-grade copies of your DB

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/environments-masked-production-data/721-1024x448-2e8c5667.jpg" alt="Image" />
<figcaption>Branching workflows without PII</figcaption>
</figure>

In Neon, a [branch](https://neon.tech/docs/introduction/branching) is a lightweight, copy-on-write clone of a Postgres database. It contains the same schema and data as its parent, but diverges safely in isolation, with its own compute endpoint and connection URL.

Branches are created instantly no matter _how large the dataset_ and don’t require provisioning a new instance or duplicating storage, it’s all built into Neon’s architecture. They remain “logically connected’ to the parent, so production drift is a thing of the past – child branches can be synced with their parent in one API call, and they’ll reflect up-to-date and schema again.

Teams use branches where they were using redundant instances or local setups before:

- Spin up isolated environments for testing, development, or CI
- Work with a snapshot of production without affecting production
- Reproduce issues, test migrations, or preview features in realistic conditions

> **“With Neon branches we get a totally isolated copy to test code changes even when they include database migrations. We can test all changes in real data and ensure that by the time we actually merge the PR to main, things really work”** _([Avi Romanoff, Founder at Magic Circle](https://neon.tech/blog/how-magic-circle-scaled-up-to-2m-games-with-cloudfare-and-neon))_

### PostgreSQL Anonymizer – Protect PII with static masking

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/environments-masked-production-data/724-1024x448-4d6f9cf0.jpg" alt="Image" />
<figcaption>Branching workflows with PII</figcaption>
</figure>

Neon branches eliminate the overhead of environment setup – no need to provision a new instance, create a new database, populate it, or worry about environments drifting out of sync. But if your production database contains PII, branching it directly is not an option.

That’s where the [PostgreSQL Anonymizer extension (anon)](https://neon.tech/docs/extensions/postgresql-anonymizer) comes in. This open-source extension lets you define masking rules on sensitive columns in your database, replacing real values with fake but realistic-looking alternatives. Neon currently supports static masking, meaning the data is permanently rewritten on the branch.

You can choose from multiple masking strategies, such as

- `anon.fake`: replaces real values with random ones
- `anon.partial`: masks part of a field, like a credit card or phone number
- `anon.noise: adds` variability to numerical data

Here’s a simple example using the `users` table. Suppose we have this data:

```sql
SELECT * FROM users LIMIT 3;

 id | first_name   | last_name   | email                        | iban
----+--------------+-------------+------------------------------+-------
 1  | Real First Name 1 | Real Last Name 1 | user1@example.com  | REALIBAN1
 2  | Real First Name 2 | Real Last Name 2 | user2@example.com  | REALIBAN2
 3  | Real First Name 3 | Real Last Name 3 | user3@example.com  | REALIBAN3
```

To anonymize this data, we apply masking rules using the faking strategy (`anon.fake`). This strategy replaces real values with randomly generated, fake but realistic data using functions provided by the extension:

```sql
SECURITY LABEL FOR anon ON COLUMN users.first_name IS 'MASKED WITH FUNCTION anon.fake_first_name()';
SECURITY LABEL FOR anon ON COLUMN users.last_name IS 'MASKED WITH FUNCTION anon.fake_last_name()';
SECURITY LABEL FOR anon ON COLUMN users.email IS 'MASKED WITH FUNCTION anon.fake_email()';
SECURITY LABEL FOR anon ON COLUMN users.iban IS 'MASKED WITH FUNCTION anon.fake_iban()';
```

After running the anonymization command,

```sql
SELECT anon.init();
SELECT anon.anonymize_database();
```

You would see something like this when querying the table again:

```sql
SELECT * FROM users LIMIT 3;

 id | first_name | last_name | email                  | iban
----+------------+-----------+------------------------+-----------------------------
 1  | Rhonda     | Alvarado  | bryanalan@example.net  | GB34QDZL89198122631902
 2  | Darius     | Reyes     | brandon57@example.com  | GB96LBQE53732061681569
 3  | Stefanie   | Byrd      | barbara40@example.com  | GB67CAZQ75813049489060
```

The real data is gone, replaced by randomly generated values using PostgreSQL Anonymizer’s built-in faker functions. This approach is far more realistic and scalable than using handcrafted seed data. [Seed files are hard to maintain](https://neon.tech/blog/how-to-maintain-seed-data) and rarely reflect your actual production schema. As your app evolves with new tables, columns, relationships, your seed data drifts behind.

The anon extension takes care of masking sensitive data while preserving the structure, schema, and referential integrity of the database. Foreign keys, data types, and relationships remain intact, making the anonymized database safe but fully usable as a production clone.

## The Workflow: Create Once, Reuse Everywhere

Once anonymized, the anon branch behaves just like any other Neon branch, and it can serve as the template for all your non-prod environments. You can branch off of it instantly to create as many environments as you’d like.

The workflow is simple:

1. **Create a branch from your production database.** This branch is a copy-on-write snapshot of prod, schema, data, and all, but fully isolated and safe to modify.
2. **Anonymize the branch using masking rules.** Apply column-level masking via the PostgreSQL Anonymizer extension. You can do this manually (with SQL commands) or automatically (with a GitHub Action that runs on pull request creation).
3. **Use the anonymized branch as your base.** Now that your sensitive data is masked, you can branch from this anonymized copy as many times as you want for any non-prod use case, for example:
   1. **Per-PR preview environments**. Spin up a database per pull request with realistic test data, without any risk of exposing real users’ information
   2. **CI pipelines**. Test against real schema and realistic data while staying compliant and secure
   3. **Ephemeral environments**. Create and discard environments freely as part of your dev workflow
   4. **Local development environments**. Give every engineer a realistic sandbox
   5. **Contractor or partner access**. Share a branch of your database for testing or demos, without giving access to actual user data
   6. **Safe debugging**. Reproduce bugs or verify migrations using realistic anonymized data, without worrying about leaks

Since these branches are all copy-on-write, the data overhead is minimal, and the experience is fast.

<Admonition type="tip" title="Automate this workflow">
Our docs include an example of [how to use GitHub Actions to create an anonymized Neon branch every time a pull request is opened.](https://neon.tech/docs/workflows/data-anonymization#automate-data-anonymization) The Action installs the extension, applies masking rules, and runs the anonymization, all in one CI job.
</Admonition>

## Start Building with Anonymized Branches in Neon

Cloning production environments has always been a pain, especially when sensitive data is involved. But by combining Neon’s branching architecture and the PostgreSQL Anonymizer extension it’s much easier to create safe, production-like environments. Just branch from production, anonymize once, reuse everywhere.

To get started, [sign up to Neon](https://console.neon.tech/signup) and follow [this guide](https://neon.tech/docs/workflows/data-anonymization). If you have any questions on how to integrate anonymized branching workflows into your environment, [reach out to our team.](https://neon.tech/contact-sales)

<Admonition type="tip" title="Get $100 in credits">
If you sign up [via this link](https://fyi.neon.tech/credits), your first $100 are on us!
</Admonition>
