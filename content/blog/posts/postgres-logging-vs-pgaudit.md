---
title: The Difference Between Postgres Logging and PGAudit
description: Operational logs aren’t enough for compliance
excerpt: >-
  Postgres has some excellent internal logging capabilities. With a simple
  logging_collector = on and a couple of other config flags, you can get an
  incredibly detailed picture of your Postgres operations, from individual SQL
  statements to connection attempts, error messages, and l...
date: '2025-05-28T20:26:29'
updatedOn: '2025-07-01T18:33:53'
category: postgres
categories:
  - postgres
authors:
  - monica-steinke
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-logging-vs-pgaudit/cover.jpg
  alt: null
isFeatured: false
seo:
  title: The Difference Between Postgres Logging and PGAudit - Neon
  description: >-
    At Neon, we’ve recently completed our HIPAA compliance audit and are using
    PGAudit under the hood for the detailed audit trails.
  keywords: []
  noindex: false
  ogTitle: The Difference Between Postgres Logging and PGAudit - Neon
  ogDescription: >-
    At Neon, we’ve recently completed our HIPAA compliance audit and are using
    PGAudit under the hood for the detailed audit trails.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-logging-vs-pgaudit/social.jpg
---

Postgres has some excellent internal logging capabilities. With a simple logging_collector = on and a couple of other config flags, you can get an incredibly detailed picture of your Postgres operations, from individual SQL statements to connection attempts, error messages, and lock wait times.<br />

But all that is precisely what the built-in Postgres logging is for—operational monitoring and troubleshooting. It wasn’t designed with compliance auditing in mind, which is where [PGAudit](https://www.pgaudit.org/) comes into play. PGAudit’s goal in life is simple:

<blockquote>
<p><em>The goal of PostgreSQL Audit to provide the tools needed to produce audit logs required to pass certain government, financial, or ISO certification audits.</em></p>
</blockquote>

SOX, HIPAA, PCI DSS. Each of these requires detailed tracking of who accessed what data, when they accessed it, and what changes they made to sensitive information. At Neon, we’ve recently completed our [HIPAA compliance audit](https://neon.tech/blog/hipaa) and are using PGAudit under the hood for the detailed audit trails HIPAA-compliant organizations need to maintain a complete and granular record of all database operations affecting sensitive data.

Here, we want to show you how PGAudit compares to internal Postgres logging and why it matters for compliance-focused database operations.

## The Need for Specialized Audit Logging

PGAudit provides much more granular control and detail than standard Postgres logging. It offers two primary auditing modes to meet different compliance needs:

1. **Session Auditing**: Logs statements based on their operation type, regardless of which tables they affect. You can configure PGAudit to log specific categories like READ, WRITE, FUNCTION, ROLE, DDL, or simply ALL to capture everything.
2. **Object Auditing**: Provides targeted focus on specific database objects. This approach uses an “audit role” that has privileges on tables of interest, allowing PGAudit to log only statements affecting those tables, handy for focusing exclusively on tables containing sensitive information.<br />

When enabled, PGAudit log entries are clearly marked with an “AUDIT:” prefix in your Postgres logs, like this:

```
2025-05-06 15:00:55.463 EDT [89613] LOG:  AUDIT: SESSION,1,1,DDL,CREATE DATABASE,,,CREATE DATABASE healthcare_db,<not logged>
```

Each entry captures critical details:

- **Timestamp**: Precise date and time of the operation (e.g., 2025-05-06 15:00:55.463 EDT)
- **Process ID**: Postgres server process that handled the operation (e.g., [89613])
- **Audit Marker**: Clear AUDIT: prefix identifying PGAudit-specific entries
- **Session Tracking**: Two numbers showing session ID and statement counter (e.g., SESSION,1,1)
- **Operation Type**: Category of operation (DDL, READ, WRITE, ROLE, etc.)
- **Command Type**: Specific type of command executed (e.g., CREATE DATABASE, SELECT)
- **Object Identifiers**: References to affected database objects when applicable
- **Command Text**: The actual SQL command that was executed
- **Data Protection**: Sensitive data marked as &lt;not logged&gt; or &lt;REDACTED&gt;

This structured format enables organizations to efficiently search, filter, and analyze database activities affecting protected health information, a critical capability for demonstrating compliance during audits and investigations.

In self-managed Postgres environments, setting up PGAudit involves compiling and installing the extension, then enabling it via the shared_preload_libraries setting in postgresql.conf. In Neon, HIPAA-compliant setups require coordination with our team to enable PGAudit and configure audit logging. [Contact our team to get started.](https://neon.tech/contact-sales)

Once enabled, PGAudit offers flexible configuration to balance compliance coverage with performance. You can capture everything with:

```
ALTER SYSTEM SET pgaudit.log TO 'all';
```

Or selectively log only certain statement classes, like ‘read, write, role’. For even more targeted auditing, object-level logging can focus on your most sensitive tables to reduce overhead.

Neon supports both session-level and object-level auditing as part of our HIPAA-compliant offering. Organizations can tailor logging to their specific compliance and performance needs, with guidance from our team.

Simply generating audit logs isn’t sufficient for compliance. These logs need to be properly managed and integrated into your broader security framework. Best practices include:

- Shipping logs to a central repository like a SIEM platform (Splunk, IBM QRadar, ELK stack)
- Setting up automated alerting for suspicious activity
- Establishing regular review processes as part of your compliance program
- Implementing appropriate log retention policies (HIPAA, for example, typically requires 6 years of audit log retention)

When properly implemented, PGAudit provides the visibility needed to demonstrate compliance, detect potential security incidents, and maintain confidence in your data integrity. For organizations handling sensitive information, PGAudit quickly makes Postgres compliance-ready.

## Standard Postgres Logging vs. PGAudit Side-by-Side

We’ll walk through a practical example to understand the differences between standard Postgres logging and PGAudit. We’ve created and populated a database that mimics a healthcare setup—first using regular Postgres logging, then recreating it with PGAudit enabled. This approach clearly demonstrates how these two logging mechanisms differ when handling the same operations in a HIPAA-regulated environment.

Our test environment includes typical healthcare database elements: patient tables with protected health information (PHI), medical records, billing information, and appropriate role-based access controls. We’ve configured users with different permission levels to simulate the various roles in a healthcare organization—doctors, nurses, billing staff, administrators, and auditors.

### Key Differences in Logging Output

#### 1. Schema and Table Creation Events

When creating database schemas for our clinical, billing, and administrative data, standard Postgres logging produced verbose multi-line entries with execution details:

```
2025-05-06 14:25:38.567 EDT [88082] LOG:  00000: statement: CREATE SCHEMA clinical;
2025-05-06 14:25:38.567 EDT [88082] LOCATION:  exec_simple_query, postgres.c:1078
2025-05-06 14:25:38.567 EDT [88082] LOG:  00000: duration: 1.719 ms
2025-05-06 14:25:38.567 EDT [88082] LOCATION:  exec_simple_query, postgres.c:1370
```

With PGAudit enabled, the same operation produces a single, structured entry that’s immediately identifiable as an audit event:

```
2025-05-06 15:16:08.360 EDT [89865] LOG:  AUDIT: SESSION,1,1,DDL,CREATE SCHEMA,,,CREATE SCHEMA clinical,<not logged>
```

Notice how PGAudit’s entry clearly categorizes this as a DDL operation and provides session tracking information, making it easier to trace related operations during compliance audits.

#### 2. User Creation and Password Handling

For HIPAA compliance, proper handling of credentials is essential. When creating users in our system, standard Postgres logging revealed a significant security concern:

```
2025-05-06 14:25:56.401 EDT [88082] LOG:  00000: statement: CREATE USER dr_smith WITH PASSWORD 'secure_password1';
```

The standard logging exposed the password in plaintext—a clear compliance violation. In contrast, PGAudit automatically redacted sensitive information:

```
2025-05-06 15:16:30.510 EDT [89865] LOG:  AUDIT: SESSION,9,1,ROLE,CREATE ROLE,,,CREATE USER dr_smith WITH PASSWORD <REDACTED>,<not logged>
```

This automatic redaction demonstrates PGAudit’s compliance-first approach, preventing unintentional exposure of credentials in log files.

#### 3. Tracking Data Access to PHI

When a doctor (or someone using the doctor role) accessed patient information, standard Postgres simply recorded:

```
2025-05-06 14:28:12.974 EDT [88082] LOG:  00000: statement: SELECT * FROM clinical.patients WHERE patient_id = 1;
```

The PGAudit version explicitly identifies this as a READ operation, making it immediately clear that PHI was accessed:

```
2025-05-06 15:18:02.953 EDT [89865] LOG:  AUDIT: SESSION,42,1,READ,SELECT,,,SELECT * FROM clinical.patients WHERE patient_id = 1,<not logged>
```

This clear categorization makes it significantly easier to satisfy HIPAA’s requirements for tracking who accessed what protected health information and when.

#### 4. Permission Violations and Security Events

When a user attempted to perform an operation they weren’t authorized for, standard Postgres logging showed:

```
2025-05-06 14:27:43.610 EDT [88082] ERROR:  42501: permission denied for sequence medical_records_record_id_seq
2025-05-06 14:27:43.610 EDT [88082] STATEMENT:  INSERT INTO clinical.medical_records...
```

With PGAudit enabled, the same event logs both the attempted action and the resulting error while explicitly categorizing the operation:

```
2025-05-06 15:18:03.938 EDT [89865] LOG:  AUDIT: SESSION,44,1,WRITE,INSERT,,,INSERT INTO clinical.medical_records...,<not logged>  
2025-05-06 15:18:03.938 EDT [89865] ERROR:  permission denied for sequence medical_records_record_id_seq
```

While both logs capture the failure, PGAudit makes it clear that this was a WRITE operation, adding structured, audit-specific context that’s useful for compliance reviews and security forensics. By logging the intent (not just the result), it enables faster identification of suspicious or unauthorized write attempts, especially when filtering logs across large environments.

#### 5. Role Changes and Identity Tracking

Role-switching is common in healthcare environments, where staff might temporarily need elevated privileges. Standard Postgres logging recorded these simply as another statement:

```
2025-05-06 14:27:29.456 EDT [88082] LOG:  00000: statement: SET ROLE doctor;
```

PGAudit logs the same role change, but with structured metadata:

```
2025-05-06 15:17:54.931 EDT [89865] LOG:  AUDIT: SESSION,41,1,MISC,SET,,,SET ROLE doctor,<not logged>
```

While the underlying information is similar, PGAudit categorizes the action explicitly (MISC, SET) and includes session and statement tracking, making identity changes easier to detect, filter, and audit programmatically. This structured format is especially useful in environments with automated log analysis or compliance reporting requirements, where tracking who assumed what role (and when) is essential for preserving accountability.

## Why These Differences Matter for Compliance

The side-by-side comparison reveals why PGAudit plays a critical role in making Postgres environments audit-ready:

- **Structured, searchable audit trail**: PGAudit’s consistent log format, prefixed with AUDIT: and enriched with session and command metadata, makes it easier to filter, index, and analyze events using automated tools or during manual audits.
- **Redaction of sensitive information**: PGAudit allows query parameters to be excluded from logs, reducing the risk of accidentally logging passwords, personal identifiers, or protected health data, an essential safeguard in regulated environments.
- **Explicit operation labeling**: Each audited statement is tagged with a high-level operation type like READ, WRITE, or ROLE, adding structure beyond raw SQL logs. While some pairings are obvious (e.g., SELECT as a READ), this labeling provides consistency across logs and is especially useful when auditing complex stored procedures or composite queries.
- **Session and statement-level tracking**: PGAudit includes a session ID and a statement/substatement counter with each log entry, enabling full reconstruction of query flows and making it easier to correlate related actions over time.
- **Focused visibility into sensitive operations**: While PGAudit itself doesn’t claim regulatory compliance, its logging model aligns closely with common auditing requirements by surfacing the kinds of activities most relevant to review, such as data access, role changes, DDL events, and permission errors.

For healthcare organizations using Postgres, these differences translate directly into simplified compliance processes, reduced audit preparation time, and stronger protection for patient data. If you need to audit who accessed data, a simple grep for READ will work. If you need to track all permission changes in your system, searching for ROLE operations immediately surfaces all relevant events. If regulators ask for evidence of suspicious activity monitoring, PGAudit’s sequential operation numbering makes it trivial to identify gaps that might indicate tampering with the audit trail.

## Standard Logging for Ops; PGAudit for Compliance

Postgres’ internal logging isn’t deficient—it’s purpose-built for what DBAs need: operational monitoring, performance tuning, and troubleshooting. Execution paths, duration metrics, and error codes. It provides insights for optimizing queries or diagnosing application issues.

What PGAudit recognizes is that compliance auditing has fundamentally different requirements than operational logging. Regulators care about who accessed what protected data, when they accessed it, and what changes they made. PGAudit elegantly extends Postgres’s native capabilities to address these specific compliance needs without compromising the operational value of standard logging.

By running both in parallel, organizations get the best of both worlds: the operational intelligence that keeps applications running smoothly and the compliance evidence that keeps auditors satisfied.

If you are a healthcare organization operating under strict regulatory frameworks like HIPAA, then PGAudit transforms Postgres from an excellent operational database into a compliance-ready database that can handle sensitive information while meeting stringent audit requirements.

This is already available in Neon. For guidance on setting up a HIPAA-compliant environment in Neon, [contact our team.](https://neon.tech/contact-sales)
