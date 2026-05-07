---
title: Building HIPAA-compliant applications on Neon
subtitle: Learn how Neon's HIPAA architecture, BAA, audit logging, and shared responsibility model support your healthcare workloads.
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-05-04T00:00:00.000Z'
updatedOn: '2026-05-07T07:30:01.000Z'
---

When building a healthcare application, understanding how your database manages Protected Health Information (PHI) is essential. HIPAA compliance isn’t just a checklist. It demands strict safeguards such as data isolation, encryption, and continuous monitoring. Compliance also follows a shared responsibility model: while infrastructure providers secure the foundational layers, your application code must enforce data minimization and access controls to keep patient data safe.

This guide walks through how Neon supports HIPAA compliance. You’ll see how its architecture is designed, how audit logging ensures accountability, and how to structure your schema to prevent accidental PHI exposure. Together, these practices help you build secure, compliant trustworthy healthcare applications.

## Key compliance questions

When evaluating Neon for healthcare workloads, you likely have a few specific requirements. Here is how Neon addresses them:

- **BAA & Certifications:** Neon signs a BAA, available [here](https://www.databricks.com/sites/default/files/2025-08/baa-neon.pdf). Neon is audited for HIPAA, SOC 2 Type 1 and Type 2, ISO 27001, ISO 27701, GDPR, and CCPA.
- **Availability & Cost:** HIPAA compliance is currently included at no additional cost on the [Scale plan](/docs/introduction/plans). A 15% surcharge will be applied to your monthly invoice in the future when billing begins. You will be notified well in advance of any billing changes. Free and Launch plan projects are not HIPAA compliant and should not be used for PHI.
- **Architecture & Isolation:** HIPAA-enabled projects run on specially configured infrastructure. Neon enforces strict tenant isolation at the project level, network controls, and storage-level encryption (AES-256).
- **Compliant Features:** Core Postgres operations, database branching, read replicas, backups, and Point-in-Time Recovery (PITR) are fully covered under the BAA. [Data anonymization](/docs/workflows/data-anonymization) is also recommended in non-production branches.
- **Feature Exclusions:** Neon Auth and the Data API reside outside the HIPAA boundary and must not be used for PHI.
- **Shared Responsibility:** If you use logical replication or Change Data Capture (CDC) to stream data out of Neon, you are responsible for the destination's compliance.
- **Audit Logging:** Audit logs are securely retained for the duration specified in your Business Associate Agreement (BAA). If you need to export logs for audits or investigations, you can [raise a support request](https://console.neon.tech/app/projects?modal=support).
- **Subprocessors:** Neon uses compliant subprocessors that also sign data processing agreements. See the full list at [neon.com/subprocessors](https://neon.com/subprocessors).

## Architecture and data security

When you enable HIPAA on a Neon project, it runs on infrastructure configured to safeguard PHI.

### Data storage and isolation

You can provision a dedicated project for each of your tenants. This gives each customer their own isolated Postgres instance, reducing the risk of cross-tenant data exposure.

- **Cloud providers:** HIPAA compliance is supported across Neon's infrastructure.
- **Network isolation:** You can restrict access to your database using [IP Allowlisting](/docs/introduction/ip-allow) and [Private Networking](/docs/guides/neon-private-networking) to ensure only your application backend can connect.

### Encryption

Neon protects PHI both in transit and at rest.

- **At rest:** All data is encrypted using AES-256 at the storage layer. Neon manages these storage keys through secure key management services.
- **In transit:** All network communications to the database require TLS 1.2 or higher. When connecting your application, Neon requires SSL.

## Audit logging

Compliance requires tracking who accessed what data and when they accessed it. Neon provides audit logging at two layers.

### Postgres audit logs (pgaudit)

When you enable HIPAA, Neon automatically configures the standard `pgaudit` extension for Postgres. Neon prioritizes security and minimizes the risk of accidentally logging PHI with these settings:

- `pgaudit.log = 'all, -misc'`: Logs all major READ, WRITE, DDL, and ROLE statements.
- `pgaudit.log_parameter = 'off'`: Prevents parameters passed to SQL statements from being logged. This keeps sensitive patient data out of plain text logs.
- `pgaudit.log_catalog = 'off'`: Ignores queries on system catalogs to reduce noise.

<Admonition type="warning" title="Use parameterized queries">
The `pgaudit` extension logs all SQL statements executed against the database. If you hardcode PHI into your SQL strings, that PHI will be logged. You must use parameters in your application code to keep PHI out of the audit logs.

Consult your language or ORM documentation for how to use parameterized queries. For example, in Node.js with the `pg` driver, use parameterized queries like this:

```javascript
const queryText = 'INSERT INTO patients (name, ssn) VALUES ($1, $2)';
const values = ['John Doe', '123-45-6789'];
await client.query(queryText, values);
```

</Admonition>

### Console and API audit logs

Neon logs operations performed through the Neon Console and the Neon API.

- Sensitive fields such as passwords and connection URIs are excluded.
- For mutation requests like `POST` and `PATCH`, the request and response bodies are logged with sensitive fields redacted.

### Accessing your logs

Logs stream to a dedicated Neon audit collector. Self-serve export of HIPAA audit logs is not currently available in the console. To request logs for an audit or incident investigation, you can [raise a Support request](https://console.neon.tech/app/projects?modal=support) from the Neon Console.

## Shared responsibility model

HIPAA compliance is a shared effort. Neon secures the database infrastructure, but you govern how your application models, accesses, and transmits data.

**Neon handles:**

- Infrastructure security, physical safeguards, and OS-level patching.
- Encryption at rest and enforcing TLS for connections.
- Automated `pgaudit` configuration and secure log retention.
- Vendor risk management and BAA execution with sub-processors.

**You handle:**

- **PHI minimization in metadata:** You must never use PHI in database metadata. Avoid putting patient names in table names, column names, schema descriptions, or role names.
- **Row-Level Security (RLS):** For multi-tenant or multi-user applications, you should configure [Postgres Row-Level Security](/postgresql/administration/row-level-security) to ensure users can only query the PHI they are explicitly authorized to view.
- **Application-layer access controls:** You need to implement access control logic in your application.
- **Safe query execution:** You must use parameterized queries or an ORM to pass PHI securely.
- **Data masking and anonymization:** When sharing data with analytics teams or lower environments, use Postgres views or data masking techniques to redact raw PHI. Create separate user roles with scoped user permissions to prevent unauthorized access to sensitive data.
- **Session management:** You should configure inactivity timeouts in your application to prevent unauthorized access from abandoned sessions.
- **Sanitizing support tickets:** You must verify that support tickets do not contain raw PHI, logs with PHI, or sensitive error messages.
- **Secure coding practices:** Avoid logging sensitive data in your application logs. This includes error messages that may contain PHI, such as stack traces with query parameters or user input.

## Build a compliant application

The following steps show how to build a simple HIPAA-compliant application on Neon.

<Steps>

### Enable HIPAA on your Neon project

1. Go to your **Organization settings** in the Neon Console.
2. In the **HIPAA support** section, enable compliance and accept the BAA.
3. During project creation, select the **Enable HIPAA compliance for this project** checkbox.

<Admonition type="important">
You cannot disable HIPAA once it is enabled on a project. Enabling it on an existing project restarts all computes to apply the new `pgaudit` settings.
</Admonition>

### Design a PHI-minimized schema

To design a compliant schema, you must know what constitutes Protected Health Information (PHI). HIPAA defines 18 identifiers that make data PHI when linked to health information. For database design, these identifiers generally fall into the following categories:

- **Direct identifiers:** Names, SSNs, medical record numbers, account numbers, and license or certificate IDs.
- **Contact and digital footprint:** Emails, phone or fax numbers, URLs, and IP addresses.
- **Geographic and temporal data:** Any address subdivision smaller than a state (such as a city or zip code) and exact dates (including birth, admission, or discharge dates) other than just the year.
- **Physical and hardware identifiers:** Biometric data, vehicle or device serial numbers, and identifying photographs.

If your tables contain any of these attributes alongside health information, the dataset is PHI. To fully "de-identify" a dataset for an analytics or testing environment, you must remove or mask all of these identifiers entirely.

A standard architectural practice separates this directly identifying PHI from clinical data using opaque identifiers like UUIDs. This limits exposure and simplifies access control.

The following example schema demonstrates this principle. The `patient_identities` table contains direct identifiers and is accessed only by a secure application backend. The `clinical_records` table contains clinical data linked to patients via an opaque `patient_id`. A view exposes only non-sensitive metadata to analysts, and strict permissions prevent access to the raw clinical records.

Run the following statements in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) to create the schema:

```sql
-- Table 1: Identifying data
-- Contains identifiers. Restrict access to this table.
CREATE TABLE patient_identities (
    patient_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    ssn_encrypted VARCHAR(255),
    dob DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table 2: Clinical data
-- Uses the opaque UUID. Avoid including names or SSNs here.
CREATE TABLE clinical_records (
    record_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patient_identities(patient_id),
    provider_id UUID NOT NULL,
    diagnosis_code VARCHAR(10) NOT NULL,
    notes TEXT,
    visit_date DATE NOT NULL
);

-- Create a restricted view WITHOUT sensitive notes
-- Notes can contain clinical details, provider comments, or other PHI
-- Analysts only see essential clinical metadata
CREATE VIEW clinical_records_analyst AS
SELECT
    record_id,
    patient_id,
    provider_id,
    diagnosis_code,
    visit_date
FROM clinical_records;

-- Create analyst role
-- NOTE: Create roles using Neon Console or API in production
-- The following SQL is for demonstration and should not be used to manage production credentials.
CREATE ROLE analyst_role
WITH LOGIN
PASSWORD 'REPLACE_WITH_STRONG_PASSWORD';

-- Revoke all default access to raw tables
REVOKE ALL ON clinical_records FROM analyst_role;
REVOKE ALL ON clinical_records FROM PUBLIC;

-- Grant access ONLY to the filtered view, not raw tables
GRANT SELECT ON clinical_records_analyst TO analyst_role;
```

### Explanation of the schema design:

- **Data separation:** Identifying information (names, SSNs) is stored in `patient_identities`, while clinical data resides in `clinical_records`. This allows for more granular access control.
- **Views exclude sensitive columns:** The `clinical_records_analyst` view exposes only essential metadata (diagnosis codes, dates, IDs) while hiding the `notes` column. Provider notes often contain sensitive clinical details, medication adjustments, or other PHI that analysts may not need to see.
- **Limited role access:** The analyst role connects with credentials and receives `SELECT` permissions on the view only, not the underlying raw table. This ensures analysts cannot query unpredictable columns or bypass the view.
- **Strict permissions:** The explicit `REVOKE ALL` statements remove any default permissions, ensuring analysts have no accidental access to sensitive tables, even if a future schema change adds new columns to `clinical_records`.
- **Audit trail:** All queries through this role are logged by `pgaudit`, making it easy to verify who accessed what data and when.

Scale this design to your needs by adding more views for different teams (e.g., `clinical_records_finance`, `clinical_records_reporting`) and granting each role access only to the columns they need.

### Connect securely from your application

When connecting to Neon, you must enforce SSL and use parameterized queries. This example uses the `pg` driver in Node.js.

```javascript
require('dotenv').config();
const { Pool } = require('pg');

// Enforce SSL in the connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: true
  }
});

async function insertPatientRecord(firstName, lastName, dob) {
  const client = await pool.connect();
  try {
    // Use parameterized queries to protect PHI
    const queryText = `
      INSERT INTO patient_identities (first_name, last_name, dob)
      VALUES ($1, $2, $3)
      RETURNING patient_id;
    `;

    // The values array is passed separately.
    const values = [firstName, lastName, dob];

    const res = await client.query(queryText, values);
    return res.rows[0].patient_id;

  } catch (err) {
    console.error('Database error occurred during patient insertion', err.message);
    throw err;
  } finally {
    client.release();
  }
}
```

</Steps>

## Summary

Building a healthcare application requires strict attention to security, but your database infrastructure can help carry that load. Neon provides built-in HIPAA compliance features like AES-256 encryption, pre-configured `pgaudit`, and BAA coverage on accessible plans.

To get started, upgrade to the Scale plan and enable HIPAA in your Organization settings.

## Resources

- [Neon HIPAA compliance documentation](/docs/security/hipaa)
- [Neon Trust Center (SOC 2, ISO, HIPAA Reports)](https://trust.neon.com/)
- [PostgreSQL pgAudit documentation](https://www.pgaudit.org/)
- [PostgreSQL Row-Level Security (RLS) documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [HHS Guidance on HIPAA Compliance for Developers](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/index.html)
- [Schema only branches](/docs/guides/branching-schema-only)
- [Branching With or Without PII: The Future of Environments](/blog/branching-environments-anonymized-pii)
- [Handling Protected Health Information Under HIPAA: Best Practices for Developers](/blog/hipaa-best-practices-for-developers)
- [Create a branch with anonymized data](/docs/workflows/data-anonymization#create-a-branch-with-anonymized-data)
