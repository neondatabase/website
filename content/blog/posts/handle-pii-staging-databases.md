---
title: How to Handle PII in Staging Databases Without Losing Realistic Data
description: Protecting user data while preserving realistic conditions
excerpt: >-
  If you’ve got real data, you’ve got a real problem. And that problem has a
  name – PII. Suppose your production database contains names, addresses,
  emails, and phone numbers. In fintech, you might also have credit card numbers
  and transaction histories. In healthtech, medical reco...
date: '2025-11-17T19:18:17'
updatedOn: '2025-11-17T19:18:18'
category: workflows
categories:
  - workflows
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/handle-pii-staging-databases/cover.jpg
  alt: null
isFeatured: false
seo:
  title: How to Handle PII in Staging Databases Without Losing Realistic Data - Neon
  description: >-
    A guide to managing PII in staging via masking scripts, synthetic data,
    replication, and Neon's anonymized branches.
  keywords: []
  noindex: false
  ogTitle: How to Handle PII in Staging Databases Without Losing Realistic Data - Neon
  ogDescription: >-
    A guide to managing PII in staging via masking scripts, synthetic data,
    replication, and Neon's anonymized branches.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/handle-pii-staging-databases/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/handle-pii-staging-databases/neon-pii-1-1024x576-a959cf64.jpg)

If you’ve got real data, you’ve got a real problem. And that problem has a name – PII.

Suppose your production database contains names, addresses, emails, and phone numbers. In fintech, you might also have credit card numbers and transaction histories. In healthtech, medical records. In edtech, student data. To comply with data regulations and audits, you need to handle that information carefully, which often means restricting access to production.

This leads to a practical operational headache for developers (on top of the safety and compliance work): you can’t safely “copy” production data into staging or test environments. Developers need staging databases that behave like production, with the same volumes, edge cases, and messy real-world patterns, but PII makes it impossible to use real data directly, so other solutions must be explored. The question isn’t just how to protect PII but **how to keep staging reliable and easy to manage without dedicating half your engineering time to data plumbing.**

## Approach 1: Manual exports and anonymization scripts

<blockquote>
<p><strong>Our take:</strong> This approach is fine for one-off exports, prototypes, or very small projects with stable schemas – but it won’t take you very far. As your data model evolves or your team grows, manual exports turn into ongoing maintenance work and won’t hold up as a reliable staging strategy.</p>
</blockquote>

The simplest solution you can consider involves exporting production data to CSV files, running Python scripts to mask PII fields, and then loading the anonymized data into staging.

```python
def anonymize_user_data(input_file, output_file):
    """
    Anonymize a CSV file containing user PII
    Expected columns: id, name, email, phone, ssn, created_at
    """
    with open(input_file, 'r') as infile, open(output_file, 'w', newline='') as outfile:
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()

        for row in reader:
            row ['name'] = anonymize_name(row ['name'])
            row ['email'] = hash_email(row ['email'])
            row ['phone'] = anonymize_phone(row ['phone'])
            row ['ssn'] = anonymize_ssn(row ['ssn'])
            writer.writerow(row)
```

This approach masks sensitive fields while preserving the data structure. Email addresses are hashed deterministically, ensuring that foreign key relationships remain intact. Names get replaced with generic placeholders. Phone numbers and SSNs get randomized but maintain valid formats.

```bash
// input

1,Alice Johnson,alice@company.com,415-123-4567,123-45-6789,2023-01-15
2,Bob Smith,bob@company.com,415-987-6543,987-65-4321,2023-02-20
3,Carol White,carol@company.com,415-555-1234,456-78-9012,2023-03-10

// output

1,Chris Lee,user_2353b240@example.com,555-1811,***-**-2404,2023-01-15
2,John Doe,user_217195a2@example.com,555-8657,***-**-6404,2023-02-20
3,Jane Smith,user_f95f10b8@example.com,555-5896,***-**-4110,2023-03-10
```

The appeal of this method lies in its immediacy – you can implement it in an afternoon with basic Python knowledge. It requires no infrastructure changes and gives you complete control over the anonymization logic. For small projects with stable schemas, it works fine.

The problems emerge over time. When someone adds a secondary_email field to the users table, your script doesn’t know about it. That field gets exported with real data unless you remember to update the anonymization script. Schema changes break your exports. Foreign key relationships can get corrupted if you’re not careful about consistent hashing. You’re manually running these scripts every time you need fresh staging data, which becomes a maintenance burden.

## Approach 2: Data masking libraries

<blockquote>
<p><strong>Our take: </strong>Masking libraries are a clear upgrade over hand-rolled scripts: more realistic data, fewer one-off functions, and better consistency. But they still leave you maintaining configs, running exports manually, and updating rules every time the schema changes. They reduce friction, but they don’t eliminate the operational burden.</p>
</blockquote>

A more robust version of manual scripts uses libraries like [Faker](https://faker.readthedocs.io/en/master/) to generate realistic fake data with consistent masking rules. Instead of writing custom anonymization functions, you configure field mappings that describe which fields contain PII and how to mask them:

```json
 "field_mappings": {
   "user_email": "email",
   "customer_name": "name",
   "billing_address": "address",
   "shipping_address": "address",
   "contact_phone": "phone",
   "ssn": "ssn",
   "credit_card_number": "credit_card",
   "birth_date": "date_of_birth",
   "ip_addr": "ip_address"
 },
 "tables": {
   "users": [
     "name",
     "email",
     "phone",
     "ssn"
   ],
   "orders": [
     "shipping_address",
     "billing_address"
   ],
   "payments": [
     "credit_card_number"
   ],
   "sessions": [
     "ip_addr"
   ]
```

The masking happens through a configurable class that uses Faker’s generators to create consistent replacements:

```python
class PIIMasker:
    def __init__(self, config_file=None):
        self.fake = Faker()
        self.cache = {}  # Cache for consistent masking

        self.masking_rules = {
            "email": self._mask_email,
            "name": self._mask_name,
            "phone": self._mask_phone,
            "address": self._mask_address
        }

    def _mask_email(self, value):
        if value in self.cache:
            return self.cache [value]

        seed = self._get_seed_from_value(value)
        self.fake.seed_instance(seed)
        masked = self.fake.email()
        self.cache [value] = masked
        return masked
```

This approach improves on manual scripts in several ways. The fake data looks realistic. The same input always produces the same output, which preserves referential integrity across tables. Configuration lives in a JSON file rather than scattered through code. You can reuse the masking logic across different export jobs.

```bash
Original: {'id': 1, 'name': 'Alice Johnson', 'email': 'alice@company.com', 'phone': '415-123-4567', 'ssn': '123-45-6789', 'created_at': '2023-01-15'}
Masked:   {'id': 1, 'name': 'Craig Baker', 'email': 'cartersteven@example.net', 'phone': '370.223.8887', 'ssn': '033-50-2167', 'created_at': '2023-01-15'}
```

But you still face the core problems of manual exports:

- Someone needs to update the configuration file when the schema changes
- New PII fields won’t get masked automatically unless you explicitly add them to the config
- Export and load processes remain manual

## Approach 3: Synthetic data generation

<blockquote>
<p><strong>Our take:</strong>  Synthetic data is great for dev environments, CI, demos, or cases where production data simply can’t be used. It’s safe, predictable, and easy to regenerate. But it takes real work to maintain, and it inevitably drifts from the messy, uneven patterns of real production traffic, and your staging environment will lose realism over time. </p>
</blockquote>

Some teams skip masking production data entirely and generate synthetic datasets from scratch. This approach models business logic and realistic patterns to create fake data that resembles production without containing any real PII:

```python
class SyntheticDataGenerator:
    def __init__(self, seed=42):
        self.fake = Faker()
        Faker.seed(seed)
        
        # Define realistic distributions
        self.user_segments = {
            "power_user": {"order_frequency": 0.3, "avg_order_value": 500},
            "regular": {"order_frequency": 0.15, "avg_order_value": 150},
            "occasional": {"order_frequency": 0.05, "avg_order_value": 80}
        }

    def generate_users(self, count=100):
        users = []
        for i in range(1, count + 1):
            segment = random.choices(
                list(self.user_segments.keys()),
                weights=[20, 50, 30],
                k=1
            ) [0]
            
            first_name = self.fake.first_name()
            last_name = self.fake.last_name()
            
            user = {
                "id": i,
                "first_name": first_name,
                "last_name": last_name,
                "email": f"{first_name.lower()}.{last_name.lower()}@example.com",
                "user_segment": segment,
                "created_at": self.fake.date_time_between(start_date="-2y")
            }
            users.append(user)
        return users
```

Synthetic data offers complete safety. There’s zero risk of PII exposure because no real data exists in the pipeline. The data is reproducible through seeded random generation, which helps with automated testing. You can scale the dataset to any size or deliberately create edge cases for specific tests.

The limitation is realism. Synthetic data won’t match the quirks and patterns of production data:

- Users behave in unexpected ways that synthetic generators can’t predict. For example, real users might abandon shopping carts in specific patterns, access the site at unusual times, or create edge cases, such as having 500 items in a wishlist.
- You might miss bugs that only appear with specific data distributions from real usage. A performance issue that surfaces when 5% of users have over 100 orders won’t show up if your synthetic generator gives everyone 2-10 orders.
- Real data has messiness that’s hard to replicate. Production databases contain inconsistent formatting, unexpected nulls, legacy data from old schema versions, and corrupted records that somehow slipped through validation.
- Performance characteristics differ because synthetic data often has cleaner patterns than messy production data. Real databases have uneven distributions, hot spots, and skewed indexes that affect query performance in ways synthetic data won’t reveal.

## Approach 4: Database replication with masking layers

<blockquote>
<p><strong>Our take:</strong> This is a powerful solution but it’s not easy to implement – it’s very heavy. Extensions like PostgreSQL Anonymizer make it far more manageable than rolling your own masking functions, but you’re stuck managing replication pipelines, extra database instances, and masking logic. The next approach shows how to get the same benefits with far less work.</p>
</blockquote>

Another route is to jump into database replication with masking applied at the database level. In this approach, production data continuously replicates to staging through change data capture or logical replication. Applications connect to masked views rather than raw tables:

```sql
-- Masking function
CREATE FUNCTION mask_email(email TEXT) RETURNS TEXT AS $$
BEGIN
    RETURN 'user_' || SUBSTRING(MD5(email) FROM 1 FOR 8) || '@example.com';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Masked view
CREATE VIEW users AS
SELECT
    id,
    mask_name(name) AS name,
    mask_email(email) AS email,
    mask_phone(phone) AS phone,
    created_at
FROM staging_users;
```

The architecture looks like this. Production contains real PII. A replication process ([AWS DMS](https://aws.amazon.com/dms/), [Debezium](https://debezium.io/), [Postgres logical replication](https://www.postgresql.org/docs/current/logical-replication.html)) continuously syncs data to staging raw tables. Masked views sit on top of those tables, applying SQL functions that transform PII on every query. Applications connect to the views and never see raw PII.

This solves several problems that plague manual approaches. Schema changes replicate automatically. There’s no manual export step. The masking happens at the database level, where it can’t be bypassed. Queries against staging always return masked data with no risk of someone accidentally querying raw tables.

The trade-offs shift from maintenance burden to infrastructure complexity and cost. You need multiple database instances, a replication setup, and expertise to tune the masking functions for performance. Replication lag can cause issues where staging data is minutes behind production.

### Production-grade masking with PostgreSQL Anonymizer

Building custom masking functions and replication pipelines is effective, but there are tools available to help you do precisely this, as it’s so important.

[PostgreSQL Anonymizer](https://postgresql-anonymizer.readthedocs.io/) is a production-ready extension that provides declarative PII masking. Instead of writing custom SQL functions for each field type, you declare masking rules using security labels, and the extension handles the rest:

```sql
-- Install extension
CREATE EXTENSION anon CASCADE;
SELECT anon.init();

-- Declare masking rules (declarative!)
SECURITY LABEL FOR anon ON COLUMN users.email
    IS 'MASKED WITH FUNCTION anon.fake_email()';

SECURITY LABEL FOR anon ON COLUMN users.ssn
    IS 'MASKED WITH FUNCTION anon.partial(ssn, 2, ''XXX-XX-'', 4)';

SECURITY LABEL FOR anon ON COLUMN users.salary
    IS 'MASKED WITH FUNCTION anon.noise(salary, 0.2)';
```

The extension comes with over 60 built-in masking functions for common PII types:

- `anon.fake_email()`
- `anon.fake_phone()`
- `anon.partial()` for showing only the last 4 digits
- `anon.shuffle()` to maintain distributions while breaking linkages
- `anon.noise()` to add randomness to numeric values.

You can check [k-anonymity](https://en.wikipedia.org/wiki/K-anonymity) with `anon.k_anonymity('users', ARRAY['city', 'zip_code'])` to ensure your data meets privacy thresholds.

PostgreSQL Anonymizer supports three masking strategies:

- **Dynamic masking** applies transformations in real-time when queries run, leaving the original data intact. This is ideal for staging environments where you want to keep production data fresh without exposing PII.
- **Anonymous dumps** let you create masked database copies with pg_dump –anon-dump. This is perfect for spinning up new staging environments from scratch.
- **Static masking** permanently replaces data in place. You’d only use this if you really need to destroy the original data.

The declarative approach makes maintenance easier than custom functions. When you add a new column containing PII, you add one security label rather than writing new masking functions and updating views. The extension handles consistency automatically. All masking occurs at the database level, so applications can’t bypass it, even if they attempt to do so.

## Branching with user-defined masking

<blockquote>
<p><strong>Our take: </strong>Being able to create anonymized database branches gives you all the realism of production data and the safety of database-level masking with far less work. Once your masking rules are defined, creating a staging branch becomes a near-zero-effort operation that produces an exact copy of production with all sensitive fields masked, and maintaining staging is just as simple.</p>
</blockquote>

The approaches we’ve covered so far treat staging as a separate database that you must provision, populate, refresh, and clean up on your own. If you’re using [Neon](https://neon.com/), you can take a different approach, built around a concept many application developers already understand from Git – [branches](https://neon.com/docs/introduction/branching) – and applying the PostgreSQL Anonymizer philosophy presented above.

### Branches in Neon

A branch in Neon acts as a lightweight copy of your database at a specific point in time. Think of it like this:

- A branch starts as an exact clone of another branch (e.g. production)
- It shares underlying storage until you modify data ([copy-on-write](https://neon.com/storage))
- It can have its own compute (Postgres instance)
- You can create [branches for staging, testing, previews, feature environments](https://neon.com/branching)…
- They automatically scale to zero

Instead of running multiple full-sized databases, you can spin up environments almost instantly by branching from an existing one. This foundation gives us a cleaner primitive for staging – branch from production whenever you need fresh data (or update your existing staging branch). But we need something more: the ability to mask PII when creating that branch.

### How anonymized branches work

Neon supports [creating an anonymized branch](https://neon.com/blog/branching-environments-anonymized-pii) – a special kind of branch where you define masking rules, and those rules are applied during branch creation to produce a fully masked copy of the production data. Under the hood, this feature is powered by PostgreSQL Anonymizer and uses the same declarative masking philosophy described in Approach 4, but without requiring you to build or maintain anything.

<Admonition type="important" title="A key point up front">
Neon does **not** detect PII automatically, and it does not mask anything without explicit user-defined rules. This is intentional for both compliance and security reasons. (Our roadmap includes improved masking suggestions, but these suggestions will still be user-initiated.)
</Admonition>

The workflow looks like this:

- **Production holds your real operational data.** Your primary branch contains your live database, untouched and unmasked.
- **You explicitly define the masking rules.** Before an anonymized branch can be created, you must define:
  - which columns contain PII
  - how each column should be masked (fake email, partial mask, noise, nulling, etc.)
  - whether masking needs to be deterministic or random
  - whether these rules should apply to all future anonymized branches
- **You create an anonymized branch from production.** When you create an anonymized branch,
  - Neon clones the production branch
  - Applies your masking rules using static masking _(dynamic masking on the roadmap)_
  - Produces a fully anonymized copy
  - Leaves the original production data untouched
- **You branch off the anonymized branch for other non-prod environments.** Once you have a masked staging branch, you can create additional branches from it. All downstream branches inherit the masked data, not the original PII. So you get
  - prod → real data
  - staging → masked branch
  - dev/preview/QA → masked descendants
- **Refreshing staging is just recreating the branch.** To update staging with fresher production dat, recreate the anonymized branch or reset it from production. This avoids all the manual steps of exports, scripts, replication pipelines, etc.

## Balancing realism, complexity, cost, and safety in staging

There’s no perfect, one-size-fits-all solution for handling PII in staging environments. Every approach comes with trade-offs across realism, complexity, cost, and long-term maintenance. The right choice depends on your team size, compliance needs, and how often your data model changes. Many teams combine multiple strategies – for example, synthetic data for everyday development and masked production data for pre-release staging.

If you’re using Neon, [anonymized branches](https://neon.com/blog/branching-environments-anonymized-pii) give you a very simple way to keep staging environments realistic and low-maintenance by masking data during branch creation. It’s a practical alternative to running your own pipelines or scripting your own exports.

**You can experiment with the anonymized branches [workflow](https://neon.com/docs/workflows/data-anonymization#common-workflow) via our** [Free Plan](https://console.neon.tech/signup).
