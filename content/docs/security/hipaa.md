---
title: HIPAA Compliance
enableTableOfContents: true
updatedOn: '2025-06-18T13:32:09.618Z'
---

Neon offers HIPAA compliance as part of our Business and Enterprise plans, available upon request.

We take the security and privacy of health information seriously. This guide explains how Neon supports HIPAA compliance and what it means for you as a customer. HIPAA features are only available to customers who have signed a Business Associate Agreement (BAA) with Neon. The BAA outlines our responsibilities for protecting Protected Health Information (PHI) and ensuring HIPAA compliance.

To request HIPAA support and receive a draft BAA, contact [Neon Sales](/contact-sales) or email `hipaa@neon.tech`. After the BAA is signed, HIPAA will be enabled for your account, and you can proceed with [enabling HIPAA for your Neon projects](#enabling-hipaa-for-a-neon-project).

## What is HIPAA?

HIPAA is a federal law that sets national standards for the protection of health information. It requires businesses handling PHI to implement safeguards to ensure privacy and security.

## Key HIPAA terms

- Protected Health Information (PHI): Any identifiable health-related data.
- Covered Entity: Healthcare providers, plans, or clearinghouses that handle PHI.
- Business Associate: A service provider (like Neon) that handles PHI on behalf of a Covered Entity.
- Breach: Unauthorized access, use, or disclosure of PHI.
- Security Rule: Safeguards to protect electronic PHI.
- Privacy Rule: Rules governing how PHI is used and disclosed.

## How Neon protects your data

1. Use and disclosure of PHI

   - We only use PHI to provide our agreed-upon services and to meet legal obligations.
   - PHI is disclosed only as required by law or with proper authorization.

2. Safeguards

   - Administrative: Policies and training to ensure compliance.
   - Physical: Secure access controls to data storage areas.
   - Technical: Encryption and access controls for electronic PHI.

3. Incident reporting

   - We promptly report any unauthorized use or disclosure of PHI.
   - Breach notifications are provided within 30 days as per HIPAA requirements.

4. Subcontractors and agents

   - Any third parties we work with are required to adhere to the same data protection standards.
   - We provide transparency by listing our subcontractors at [https://neon.com/hipaa-contractors](/hipaa-contractors) and notifying customers of any changes if you sign up to notifications [here](https://share-eu1.hsforms.com/1XjUD9QeKQw-RSAgQ...).

5. Customer responsibilities

   - Customers must ensure that PHI is only stored in data rows as intended for sensitive data and should never be included in metadata, column names, table names, schema descriptions, or system-generated logs such as audit trails, query logs, or error logs.
   - Customers have the responsibility to configure a session timeout.
   - Customers need to avoid including PHI in support tickets or metadata fields.

6. PHI access and amendments
   - Customers can request access to audit logs by contacting `hipaa@neon.tech`.
   - Any updates or corrections to PHI need to be carried out by the customer.

## Your rights and what to expect

- Transparency: You can request details about how your PHI is being used.
- Security: Our technical safeguards are designed to prevent unauthorized access.
- Data Control: You retain ownership of your data; we are custodians ensuring its protection.

## Availability of audit events

Audit events may not be logged if database endpoints experience exceptionally heavy load, as we prioritize database availability over capturing log events.

## Logged events

Neon maintains a comprehensive audit trail to support HIPAA compliance. This includes the following categories of logged events:

1. [Neon Console audit logs](#neon-console-audit-logs): Captures user actions in the Neon Console.
2. [API audit logs](#api-audit-logs): Logs API requests.
3. [Postgres audit logs](#postgres-audit-logs-pgaudit): Logged using the [pgAudit](https://www.pgaudit.org/) extension (`pgaudit`) for Postgres.

> Self-serve access to HIPAA audit logs is currently not supported. Access to audit logs can be requested by contacting `hipaa@neon.tech`.

### Neon Console audit logs

Neon logs operations performed via the Neon Console interface. These actions are initiated through the UI and correspond to API requests made to the Neon backend. Examples of logged operations may include:

- **Project management**: creating, deleting, renaming projects
- **Branch management**: creating, deleting, renaming branches
- **Compute management**: starting and stopping of compute instances
- **Database and role management**: creating or deleting databases and roles
- **Connection setup**: copying connection strings
- **Organization and access**: inviting or removing organization members and collaborators

To protect sensitive information, Neon filters data in audit logs using the following approach:

- Sensitive fields (such as `connection_uri` and `password`) are excluded from logs whereever possible. These are identified using `x-sensitive` tags in the OpenAPI specification.
- `GET` requests: Only query parameters are logged; response payloads are not recorded.
- Mutation requests (`PATCH`, `PUT`, `POST`, `DELETE`): Request and response bodies are logged with sensitive fields redacted.

### API audit logs

Neon logs operations performed via the Neon API, covering the same categories of actions available in the Neon Console—such as project, branch, compute, and role management—but triggered programmatically. API audit logs do not currently include request payloads.

To protect sensitive information, audit logs for API activity follow the same data filtering approach used for Neon Console audit logs (described above).

### Postgres audit logs (pgAudit)

When HIPAA audit logging is enabled for a Neon project, Neon configures pgAudit with the following settings by default:

| Setting                      | Value        | Description                                                                                   |
| ---------------------------- | ------------ | --------------------------------------------------------------------------------------------- |
| `pgaudit.log`                | `all, -misc` | Logs all classes of SQL statements except low-risk miscellaneous commands.                    |
| `pgaudit.log_parameter`      | `off`        | Parameters passed to SQL statements are not logged to avoid capturing sensitive values.       |
| `pgaudit.log_catalog`        | `off`        | Queries on system catalog tables (e.g., `pg_catalog`) are excluded from logs to reduce noise. |
| `pgaudit.log_statement`      | `on`         | The full SQL statement text is included in the log.                                           |
| `pgaudit.log_relation`       | `off`        | Only a single log entry is generated per statement, not per table or view.                    |
| `pgaudit.log_statement_once` | `off`        | SQL statements are logged with every entry, not just once per session.                        |

#### What does `pgaudit.log = 'all, -misc'` include?

This configuration enables logging for all major classes of SQL activity while excluding less relevant statements in the `misc` category. Specifically, it includes:

- **READ**: `SELECT` statements and `COPY` commands that read from tables or views.
- **WRITE**: `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, and `COPY` commands that write to tables.
- **FUNCTION**: Function calls and `DO` blocks.
- **ROLE**: Role and permission changes, including `GRANT`, `REVOKE`, `CREATE ROLE`, `ALTER ROLE`, and `DROP ROLE`.
- **DDL**: Schema and object changes like `CREATE TABLE`, `ALTER INDEX`, `DROP VIEW` — all DDL operations not included in the `ROLE` class.
- **MISC_SET**: Miscellaneous `SET` commands, e.g. `SET ROLE`.

Excluded:

- **MISC**: Low-impact commands such as `DISCARD`, `FETCH`, `CHECKPOINT`, `VACUUM`, and `SET`.

<Admonition type="note">
In some cases, audit logs may include SQL statements that contain plain-text passwords—for example, in a `CREATE ROLE ... LOGIN PASSWORD` command. This is due to limitations in the Postgres `pgaudit` extension, which may log full statements without redacting sensitive values.

This behavior is a known issue. We recommend avoiding the inclusion of raw credentials in SQL statements where possible.
</Admonition>

For more details, see the [pgAudit documentation](https://github.com/pgaudit/pgaudit).

### Audit log storage and forwarding

- Logs are written using the standard [PostgreSQL logging facility](https://www.postgresql.org/docs/current/runtime-config-logging.html).
- Logs are sent to a dedicated Neon audit collector endpoint and securely stored.
- Each log entry includes metadata such as the timestamp of the activity, the Neon compute ID (`endpoint_id`), Neon project ID (`project_id`), the Postgres role, the database accessed, and the method of access (e.g.,`neon-internal-sql-editor`), etc. See the following log record example and field descriptions:

### SQL audit log record example

The following example shows how a simple SQL command—`CREATE SCHEMA IF NOT EXISTS healthcare`—is captured in Neon’s audit logs. The table provides a description of the log record's parts.

**Query:**

`CREATE SCHEMA IF NOT EXISTS healthcare;`

**Audit log record:**

```ini shouldWrap
2025-05-05 20:23:01.277	 <134>May 6 00:23:01 vm-compute-shy-waterfall-w2cn1o3t-b6vmn young-recipe-29421150/ep-calm-da 2025-05-06 00:23:01.277 GMT,neondb_owner,neondb,1405,10.6.42.155:13702,68195665.57d,1,CREATE SCHEMA, 2025-05-06 00:23:01 GMT,16/2,767,00000,SESSION,1,1,DDL,CREATE SCHEMA,,,CREATE SCHEMA IF NOT EXISTS healthcare,<not logged>,,,,,,,,,neon-internal-sql-editor
```

**Field descriptions:**

| **Field position** | **Example value**                       | **Description**                                                                   |
| ------------------ | --------------------------------------- | --------------------------------------------------------------------------------- |
| 1                  | 2025-05-05 20:23:01.277                 | Timestamp when the log was received by the logging system.                        |
| 2                  | `<134>`                                 | Syslog priority code (facility + severity).                                       |
| 3                  | May 6 00:23:01                          | Syslog timestamp (when the message was generated on the source host).             |
| 4                  | vm-compute-shy-waterfall-w2cn1o3t-b6vmn | Hostname or compute instance where the event occurred.                            |
| 5                  | young-recipe-29421150/ep-calm-da        | Project and endpoint name in the format `<project>/<endpoint>`.                   |
| 6                  | 2025-05-06 00:23:01.277 GMT             | Timestamp of the database event in UTC.                                           |
| 7                  | neondb_owner                            | Database role (user) that executed the statement.                                 |
| 8                  | neondb                                  | Database name.                                                                    |
| 9                  | 1405                                    | Process ID (PID) of the PostgreSQL backend.                                       |
| 10                 | 10.6.42.155:13702                       | Client IP address and port that issued the query.                                 |
| 11                 | 68195665.57d                            | PostgreSQL virtual transaction ID.                                                |
| 12                 | 1                                       | Backend process number.                                                           |
| 13                 | CREATE SCHEMA                           | Command tag.                                                                      |
| 14                 | 2025-05-06 00:23:01 GMT                 | Statement start timestamp.                                                        |
| 15                 | 16/2                                    | Log sequence number (LSN).                                                        |
| 16                 | 767                                     | Statement duration in milliseconds.                                               |
| 17                 | 00000                                   | SQLSTATE error code (00000 = success).                                            |
| 18                 | SESSION                                 | Log message level.                                                                |
| 19                 | 1                                       | Session ID.                                                                       |
| 20                 | 1                                       | Subsession or transaction ID.                                                     |
| 21                 | DDL                                     | Statement type: Data Definition Language.                                         |
| 22                 | CREATE SCHEMA                           | Statement tag/type.                                                               |
| 23–26              | _(empty)_                               | Reserved/unused fields.                                                           |
| 27                 | CREATE SCHEMA IF NOT EXISTS healthcare  | Full SQL text of the statement.                                                   |
| 28                 | `<not logged>`                          | Parameter values (redacted or disabled by settings like `pgaudit.log_parameter`). |
| 29–35              | _(empty)_                               | Reserved/unused fields.                                                           |
| 36                 | neon-internal-sql-editor                | Application name or source of the query (e.g., SQL Editor in the Neon Console).   |

### Extension configuration

The `pgaudit` extension is preloaded on HIPAA-enabled Neon projects. For extension version information, see [Supported Postgres extensions](/docs/extensions/pg-extensions).

### Compliance assurance

This logging configuration supports HIPAA compliance by:

- Capturing a comprehensive audit trail of database and console activity.
- Avoiding inclusion of sensitive data in logs unless explicitly configured.

If you need to request access to audit logs, contact [Neon support](https://neon.tech/contact-support).

## Non-HIPAA-compliant features

The following features are not currently HIPAA-compliant and should not be used in projects containing HIPAA-protected data:

- **Neon Auth** – Uses an authentication provider that is not covered under Neon’s HIPAA compliance.
- **Data API (currently in private preview)** – Hosted outside Neon’s HIPAA-compliant infrastructure.

For updates on HIPAA support for these features, contact [hipaa@neon.tech](mailto:hipaa@neon.tech).

## Enabling HIPAA for a Neon project

Once a Business Associate Agreement (BAA) has been signed and you have the HIPAA add-on enabled, you can create a HIPAA-compliant project or enable HIPAA for an existing project.

<Tabs labels={["New project", "Existing project", "API"]}>

<TabItem>

For Neon project creation steps, see [Create a project](/docs/manage/projects#create-a-project).

When you create a project, select the **Enable HIPAA compliance for this project** checkbox on the **Create Project** form. This option only appears if HIPAA is enabled for your account.

![Enable HIPAA option during project creation](/docs/security/enable_hipaa.png)

</TabItem>

<TabItem>

To enable HIPAA compliance for an existing Neon project:

1. In the Neon Console, navigate to **Project settings** > **General**.
2. Toggle on the **HIPAA compliance** option.
3. Click **Save** to apply the changes.

![Enable HIPAA for an existing project](/docs/security/enable_hipaa_existing.png)

This option only appears if HIPAA is enabled for your account.

<Admonition type="important">
Enabling HIPAA on a project will force a restart of all project computes to apply the new setting. This will temporarily interrupt database connections.
</Admonition>

</TabItem>

<TabItem>

To create a new HIPAA-compliant Neon project via the Neon API, set `audit_log_level` to `hipaa` in the `project settings` object, as shown below.

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "project": {
    "settings": {
      "hipaa": true
    },
    "pg_version": 17
  }
}
'
```

To enable HIPAA for an existing project, set `hippa` to `true` in the `project settings` object using the [Update project API](https://api-docs.neon.tech/reference/updateproject):

```bash
curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/YOUR_PROJECT_ID \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "project": {
    "settings": {
      "hipaa": true
    }
  }
}
'
```

<Admonition type="important">
Enabling HIPAA on an existing project will force a restart of all computes to apply the new setting. This will temporarily interrupt database connections.
</Admonition>

</TabItem>

</Tabs>

If you have trouble enabling HIPAA, contact `hipaa@neon.tech`.

## Disabling HIPAA

Once HIPAA compliance is enabled for a Neon project, it cannot be disabled.

If you want to disable HIPAA for your Neon account entirely, you need to [submit a support request](https://console.neon.tech/app/projects?modal=support). This can only be done after all HIPAA-enabled projects have been deleted.

To delete a HIPAA-compliant project, submit a [support request](https://console.neon.tech/app/projects?modal=support). Before deleting a HIPAA project, make sure to export any audit logs or data you may need. Neon retains audit logs for the duration specified in your Business Associate Agreement (BAA).

## Security incidents

If a security breach occurs, Neon will:

1. Notify you within five business days of becoming aware of the incident.
2. Provide detailed information about the breach.
3. Take corrective actions to prevent future occurrences.

## Frequently Asked Questions

**Q: Can I request Neon to delete my PHI?**  
A: Yes, upon termination of services, we will securely delete or return your PHI.

**Q: How does Neon ensure compliance with HIPAA?**  
A: We conduct regular internal audits and provide training to our employees to ensure adherence to HIPAA requirements.

**Q: What should I do if I suspect a data breach?**  
A: Contact our security team immediately at security@neon.tech.

## Contact information

For any questions regarding our HIPAA compliance or to report an issue, please reach out to `hipaa@neon.tech`.

_This guide provides a high-level overview of Neon's HIPAA compliance efforts. For more details, please refer to your Business Associate Agreement (BAA) or contact us directly via our [support channels](/docs/introduction/support)._
