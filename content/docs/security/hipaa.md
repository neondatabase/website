---
title: HIPAA Compliance
summary: >-
  HIPAA compliance on Neon is a self-serve feature on the Scale plan.
  Customers can accept a Business Associate Agreement (BAA) and enable PHI
  protection at the organization and project level via the Console, API, or
  CLI. Enabling HIPAA on a project is irreversible and triggers a compute
  restart. Breach notifications are issued within five business days.
enableTableOfContents: true
updatedOn: '2026-10-07T20:00:28.755Z'
---

Neon offers HIPAA compliance as a self-serve feature available to customers on the [Scale](/docs/introduction/plans) plan.

<Admonition type="note">
HIPAA support is currently available at no additional cost. When we begin charging for HIPAA support, a 15% surcharge will be added to your monthly invoice. We’ll notify you in advance before this change takes effect.
</Admonition>

We take the security and privacy of health information seriously. This guide explains how Neon supports HIPAA compliance and what it means for you as a customer. HIPAA features are available to customers who have accepted our Business Associate Agreement (BAA) through the self-serve enablement process. The BAA is an agreement between you and Databricks, Neon's parent company. It sets out each party's responsibilities for protecting Protected Health Information (PHI).

Read the [Business Associate Agreement (BAA)](https://www.databricks.com/sites/default/files/legal/neon-business-associate-agreement.pdf). If anything on this page differs from the BAA, the BAA applies.

## What is HIPAA?

HIPAA is a federal law that sets national standards for the protection of health information. It requires businesses handling PHI to implement safeguards to ensure privacy and security.

## Enable HIPAA

HIPAA compliance is available as a self-serve feature on supported plans. To enable HIPAA support, follow these steps:

1. **Enable HIPAA for your Organization**: First, you must enable HIPAA compliance at the organization level and accept the Business Associate Agreement (BAA).
2. **Enable HIPAA for your projects**: After HIPAA is enabled for your organization, you can create HIPAA-compliant projects or enable HIPAA for existing projects.

### Step 1: Enable HIPAA for your Organization

To enable HIPAA compliance for your organization:

1. In the Neon Console, navigate to your **Organization settings**.
2. Locate the **HIPAA support** section.
3. Enable HIPAA compliance for your organization.
4. Read and accept the Business Associate Agreement (BAA).

Once HIPAA is enabled for your organization, you can proceed to enable HIPAA compliance for your projects.

### Step 2: Enable HIPAA for your projects

<Admonition type="important">
Once HIPAA compliance is enabled on a project, it cannot be disabled. Enabling HIPAA will also restart all computes, temporarily interrupting database connections.
</Admonition>

<Tabs labels={["New project", "Existing project", "API", "CLI"]}>

<TabItem>

For Neon project creation steps, see [Create a project](/docs/manage/projects#create-a-project).

When you create a project, select the **Enable HIPAA compliance for this project** checkbox on the **Create Project** form. This option is available after HIPAA has been enabled for your organization.

![Enable HIPAA option during project creation](/docs/security/enable_hipaa.png)

</TabItem>

<TabItem>

To enable HIPAA compliance for an existing Neon project:

1. In the Neon Console, navigate to your project's **Settings** page.
2. Locate the **HIPAA support** section.
3. Click **Enable**.

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
    "pg_version": 18
  }
}
'
```

To enable HIPAA for an existing project, set `hipaa` to `true` in the `project settings` object using the [Update project API](/docs/reference/api/projects/update-project):

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

<TabItem>

To create a new HIPAA-compliant Neon project via the [Neon CLI](/docs/cli), use the `--hipaa` option with the `neon projects create` command, as shown below.

```bash
neon projects create --hipaa
```

To enable HIPAA for an existing project, use the `--hipaa` option with the `neon projects update` command, as shown below:

```bash
neon projects update my-project --hipaa
```

<Admonition type="important">
Enabling HIPAA on an existing project will force a restart of all computes to apply the new setting. This will temporarily interrupt database connections.
</Admonition>

</TabItem>

</Tabs>

If you have trouble enabling HIPAA, [raise a Support request](https://console.neon.tech/app/projects?modal=support).

<Admonition type="note">
For information about disabling HIPAA compliance, see [Disabling HIPAA](#disabling-hipaa).
</Admonition>

## Key HIPAA terms

- Protected Health Information (PHI): Any identifiable health-related data.
- Covered Entity: Healthcare providers, plans, or clearinghouses that handle PHI.
- Business Associate: A service provider (like Neon) that handles PHI on behalf of a Covered Entity.
- Breach: Unauthorized access, use, or disclosure of PHI.
- Security Rule: Safeguards to protect electronic PHI.
- Privacy Rule: Rules governing how PHI is used and disclosed.

## How Neon protects your data

1. Use and disclosure of PHI
   - We use and disclose PHI only as permitted by the BAA, as required by your agreement with us, or as required by law.
   - Unless you request it, we don't de-identify your PHI or create statistical analyses or reports from aggregated data derived from it.

2. Safeguards
   - We use commercially reasonable and appropriate safeguards and comply, where applicable, with the HIPAA Security Rule.
   - Administrative: Policies and training to ensure compliance.
   - Physical: Secure access controls to data storage areas.
   - Technical: Encryption and access controls for electronic PHI.

3. Incident reporting
   - We report any security breach to you promptly, and no later than five business days after we become aware of it. See [Security incidents](#security-incidents).

4. Subcontractors and agents
   - Any subcontractors that handle PHI on our behalf are bound by restrictions and conditions that provide the same material level of protection for PHI as the BAA.
   - We provide transparency by listing our subcontractors at [https://neon.com/hipaa-contractors](/hipaa-contractors).

5. Customer responsibilities
   - Customers are responsible for configuring and using Neon in a way that complies with HIPAA.
   - Customers are responsible for obtaining any consents, authorizations, or permissions required under HIPAA before storing PHI in Neon.
   - Customers must ensure that PHI is only stored in data rows as intended for sensitive data and should never be included in metadata, column names, table names, schema descriptions, or system-generated logs such as audit trails, query logs, or error logs.
   - Customers have the responsibility to configure a session timeout.
   - Customers need to avoid including PHI in support tickets or metadata fields.

6. PHI access and amendments
   - Customers can request access to audit logs by [raising a Support request](https://console.neon.tech/app/projects?modal=support).
   - Customers are responsible for the PHI they store in Neon, including any updates or corrections. We make PHI available to you so you can meet individuals' rights of access and amendment.

## Your rights and what to expect

- Transparency: You can request the information you need to provide an individual with an accounting of disclosures of their PHI.
- Security: Our technical safeguards are designed to prevent unauthorized access.
- Data Control: You retain ownership of your data; we are custodians ensuring its protection.

## Availability of audit events

Audit events may not be logged if database endpoints experience exceptionally heavy load, as we prioritize database availability over capturing log events.

## Logged events

Neon maintains a comprehensive audit trail to support HIPAA compliance. This includes the following categories of logged events:

1. [Neon Console and API audit logs](#neon-console-and-api-audit-logs): Captures user actions in the Neon Console and via the Neon API.
2. [Postgres audit logs](#postgres-audit-logs-pgaudit): Logged using the [pgAudit](https://www.pgaudit.org/) extension (`pgaudit`) for Postgres.

> Self-serve access to HIPAA audit logs is currently not supported. Access to audit logs can be requested by [raising a Support request](https://console.neon.tech/app/projects?modal=support).

### Neon console and API audit logs

Neon logs operations performed via the Neon Console interface and the Neon API. Examples of logged operations may include these, among other operations:

- **Project management**: creating, deleting, listing projects
- **Branch management**: creating, deleting, listing branches
- **Compute management**: starting and stopping of compute instances
- **Database and role management**: creating or deleting databases and roles

To protect sensitive information, Neon filters data in audit logs using the following approach:

- Sensitive fields (such as `connection_uri` and `password`) are excluded from logs wherever possible.
- `GET` requests: Only query parameters are logged; response payloads are not recorded.
- Mutation requests (`PATCH`, `PUT`, `POST`, `DELETE`): Request and response bodies are logged with sensitive fields redacted.

#### Neon console and API audit log example

The following example shows how a `List project branches` operation is captured in Neon’s audit logs. The table provides a description of the log record's parts.

**Audit log record:**

```ini shouldWrap
fb7c2e2f-cb09-4405-b543-dbe1b88614b6 2025-05-25 10:18:45.340 +0000 `{ "changes": [], "sync_id": 57949 }` e640c32c-0387-4fc2-8ca5-f823f7ebc4b6 GET `{}` /projects/misty-breeze-49601234/branches a92b3088-7f92-4871-bf91-0aac64edc4b6 b8c58a4b-0a33-4d54-987e-4155e95a64b6 2025-05-24 15:42:39.088 +0000 misty-breeze-49601234 keycloak 200 `{}` ListProjectBranches 0
```

**Field descriptions:**

| **Field position** | **Example value**                        | **Description**                                          |
| ------------------ | ---------------------------------------- | -------------------------------------------------------- |
| 1                  | fb7c2e2f-cb09-4405-b543-dbe1b88614b6     | Unique ID for the raw log event                          |
| 2                  | 2025-05-25 10:18:45.340 +0000            | Timestamp when Airbyte extracted the record              |
| 3                  | `{ "changes": [], "sync_id": 57949 }`    | Metadata from the ingestion tool                         |
| 4                  | e640c32c-0387-4fc2-8ca5-f823f7ebc4b6     | Unique identifier for the API event                      |
| 5                  | GET                                      | HTTP method used in the request                          |
| 6                  | `{}`                                     | Request body payload (if present)                        |
| 7                  |                                          | Reserved for future metadata fields (empty in this case) |
| 8                  | /projects/misty-breeze-49601234/branches | URL path of the API call                                 |
| 9                  | a92b3088-7f92-4871-bf91-0aac64edc4b6     | Internal ID for the response object                      |
| 10                 | b8c58a4b-0a33-4d54-987e-4155e95a64b6     | Internal ID representing the auth/session context        |
| 11                 | 2025-05-24 15:42:39.088 +0000            | Actual time when the API call was made                   |
| 12                 | misty-breeze-49601234                    | Project identifier targeted by the API call              |
| 13                 | keycloak                                 | Authentication mechanism used                            |
| 14                 | 200                                      | HTTP status code of the response                         |
| 15                 | `{}`                                     | Resource identifiers returned (if any)                   |
| 16                 | ListProjectBranches                      | Operation name associated with the endpoint              |
| 17                 | 0                                        | Internal sync batch identifier                           |

### Postgres audit logs (pgAudit)

When HIPAA audit logging is enabled for a Neon project, Neon configures pgAudit with the following settings by default:

| Setting                      | Value        | Description                                                                                          |
| ---------------------------- | ------------ | ---------------------------------------------------------------------------------------------------- |
| `pgaudit.log`                | `all, -misc` | Logs all classes of SQL statements except low-risk miscellaneous commands.                           |
| `pgaudit.log_parameter`      | `off`        | Parameters passed to SQL statements are not logged to avoid capturing sensitive values.              |
| `pgaudit.log_catalog`        | `off`        | Queries on system catalog tables (for example, `pg_catalog`) are excluded from logs to reduce noise. |
| `pgaudit.log_statement`      | `on`         | The full SQL statement text is included in the log.                                                  |
| `pgaudit.log_relation`       | `off`        | Only a single log entry is generated per statement, not per table or view.                           |
| `pgaudit.log_statement_once` | `off`        | SQL statements are logged with every entry, not just once per session.                               |

#### What does `pgaudit.log = 'all, -misc'` include?

This configuration enables logging for all major classes of SQL activity while excluding less relevant statements in the `misc` category. Specifically, it includes:

- **READ**: `SELECT` statements and `COPY` commands that read from tables or views.
- **WRITE**: `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, and `COPY` commands that write to tables.
- **FUNCTION**: Function calls and `DO` blocks.
- **ROLE**: Role and permission changes, including `GRANT`, `REVOKE`, `CREATE ROLE`, `ALTER ROLE`, and `DROP ROLE`.
- **DDL**: Schema and object changes like `CREATE TABLE`, `ALTER INDEX`, `DROP VIEW` (all DDL operations not included in the `ROLE` class).
- **MISC_SET**: Miscellaneous `SET` commands, for example `SET ROLE`.

Excluded:

- **MISC**: Low-impact commands such as `DISCARD`, `FETCH`, `CHECKPOINT`, `VACUUM`, and `SET`.

<Admonition type="note">
In some cases, audit logs may include SQL statements that contain plain-text passwords (for example, in a `CREATE ROLE ... LOGIN PASSWORD` command). This is due to limitations in the Postgres `pgaudit` extension, which may log full statements without redacting sensitive values.

This behavior is a known issue. We recommend avoiding the inclusion of raw credentials in SQL statements where possible.
</Admonition>

For more details, see the [pgAudit documentation](https://github.com/pgaudit/pgaudit).

#### Audit log storage and forwarding

- Logs are written using the standard [PostgreSQL logging facility](https://www.postgresql.org/docs/current/runtime-config-logging.html).
- Logs are sent to a dedicated Neon audit collector endpoint and securely stored.
- Each log entry includes metadata such as the timestamp of the activity, the Neon compute ID (`endpoint_id`), Neon project ID (`project_id`), the Postgres role, the database accessed, and the method of access (for example, `neon-internal-sql-editor`), etc. See the following log record example and field descriptions:

#### Postgres audit log example

The following example shows how a simple SQL command (`CREATE SCHEMA IF NOT EXISTS healthcare`) is captured in Neon’s audit logs. The table provides a description of the log record's parts.

**Query:**

`CREATE SCHEMA IF NOT EXISTS healthcare;`

**Audit log record:**

```ini shouldWrap
2025-05-05 20:23:01.277	 <134>May 6 00:23:01 vm-compute-shy-waterfall-w2cn1o3t-b6vmn young-recipe-29421150/ep-calm-da 2025-05-06 00:23:01.277 GMT,neondb_owner,neondb,1405,10.6.42.155:13702,68195665.57d,1,CREATE SCHEMA, 2025-05-06 00:23:01 GMT,16/2,767,00000,SESSION,1,1,DDL,CREATE SCHEMA,,,CREATE SCHEMA IF NOT EXISTS healthcare,<not logged>,,,,,,,,,neon-internal-sql-editor
```

**Field descriptions:**

| **Field position** | **Example value**                       | **Description**                                                                        |
| ------------------ | --------------------------------------- | -------------------------------------------------------------------------------------- |
| 1                  | 2025-05-05 20:23:01.277                 | Timestamp when the log was received by the logging system.                             |
| 2                  | `<134>`                                 | Syslog priority code (facility + severity).                                            |
| 3                  | May 6 00:23:01                          | Syslog timestamp (when the message was generated on the source host).                  |
| 4                  | vm-compute-shy-waterfall-w2cn1o3t-b6vmn | Hostname or compute instance where the event occurred.                                 |
| 5                  | young-recipe-29421150/ep-calm-da        | Project and endpoint name in the format `<project>/<endpoint>`.                        |
| 6                  | 2025-05-06 00:23:01.277 GMT             | Timestamp of the database event in UTC.                                                |
| 7                  | neondb_owner                            | Database role (user) that executed the statement.                                      |
| 8                  | neondb                                  | Database name.                                                                         |
| 9                  | 1405                                    | Process ID (PID) of the PostgreSQL backend.                                            |
| 10                 | 10.6.42.155:13702                       | Client IP address and port that issued the query.                                      |
| 11                 | 68195665.57d                            | PostgreSQL virtual transaction ID.                                                     |
| 12                 | 1                                       | Backend process number.                                                                |
| 13                 | CREATE SCHEMA                           | Command tag.                                                                           |
| 14                 | 2025-05-06 00:23:01 GMT                 | Statement start timestamp.                                                             |
| 15                 | 16/2                                    | Log sequence number (LSN).                                                             |
| 16                 | 767                                     | Statement duration in milliseconds.                                                    |
| 17                 | 00000                                   | SQLSTATE error code (00000 = success).                                                 |
| 18                 | SESSION                                 | Log message level.                                                                     |
| 19                 | 1                                       | Session ID.                                                                            |
| 20                 | 1                                       | Subsession or transaction ID.                                                          |
| 21                 | DDL                                     | Statement type: Data Definition Language.                                              |
| 22                 | CREATE SCHEMA                           | Statement tag/type.                                                                    |
| 23–26              | _(empty)_                               | Reserved/unused fields.                                                                |
| 27                 | CREATE SCHEMA IF NOT EXISTS healthcare  | Full SQL text of the statement.                                                        |
| 28                 | `<not logged>`                          | Parameter values (redacted or disabled by settings like `pgaudit.log_parameter`).      |
| 29–35              | _(empty)_                               | Reserved/unused fields.                                                                |
| 36                 | neon-internal-sql-editor                | Application name or source of the query (for example, SQL Editor in the Neon Console). |

#### Extension configuration

The `pgaudit` extension is preloaded on HIPAA-enabled Neon projects. For extension version information, see [Supported Postgres extensions](/docs/extensions/pg-extensions).

## Non-HIPAA-compliant features

The following features are not currently HIPAA-compliant and should not be used in projects containing HIPAA-protected data:

- [Managed Better Auth](/docs/neon-auth/overview) – Uses an authentication provider that is not covered under Neon’s HIPAA compliance.
- [Data API](/docs/data-api/get-started) – Hosted outside Neon’s HIPAA-compliant infrastructure.
- [Neon Functions](/docs/compute/functions/overview) – Not covered under Neon’s HIPAA compliance.
- [Neon Object Storage](/docs/storage/overview) – Not covered under Neon’s HIPAA compliance.
- [Neon AI Gateway](/docs/ai-gateway/overview) – Not covered under Neon’s HIPAA compliance.

## Security incidents

If a security breach occurs, Neon will:

1. Notify you promptly, and no later than five business days after becoming aware of it.
2. Follow up with the information required by HIPAA (45 C.F.R. § 164.410) without unreasonable delay, and no later than 60 calendar days after discovering the breach.
3. Mitigate any harmful effects of the breach caused by Neon, to the extent commercially practicable.

You won't receive separate notifications for unsuccessful attempts at unauthorized access or interference with Neon systems. The BAA serves as notice of these.

## Disabling HIPAA

Once HIPAA compliance is enabled for a Neon project, it cannot be disabled.

### Delete a HIPAA-compliant project

You can delete a HIPAA-compliant project using the same self-serve flow as any other Neon project: in the Console (**Settings** → **Delete**), via the [Neon API](/docs/manage/projects#delete-a-project-with-the-api), or with the [Neon CLI](/docs/cli/projects#delete). Deleting a project is permanent and removes all computes, branches, databases, and roles in that project.

<Admonition type="important">
Before deleting a HIPAA project, export any audit logs or data you may need.
</Admonition>

For step-by-step instructions, see [Delete a project](/docs/manage/projects#delete-a-project).

### Disable HIPAA for your organization

If you want to disable HIPAA for your Neon organization entirely, you need to [submit a support request](https://console.neon.tech/app/projects?modal=support). This can only be done after all HIPAA-enabled projects have been deleted.

## Frequently asked questions

<Faq>

<FaqItem question="Can I request Neon to delete my PHI?">
You can delete PHI yourself at any time, for example by deleting the data or the project. When the BAA ends, Neon returns or destroys your PHI. If that isn't feasible, the BAA's protections continue to apply to any PHI Neon retains.
</FaqItem>

<FaqItem question="How does Neon ensure compliance with HIPAA?">
We conduct regular internal audits and provide training to our employees to ensure adherence to HIPAA requirements.
</FaqItem>

<FaqItem question="What should I do if I suspect a data breach?">
Contact our security team immediately at security@neon.tech.
</FaqItem>

</Faq>

## Contact information

For any questions regarding our HIPAA compliance or to report an issue, please [raise a Support request](https://console.neon.tech/app/projects?modal=support).

_This guide provides a high-level overview of Neon's HIPAA compliance efforts. For more details, please refer to your Business Associate Agreement (BAA) or contact us directly via our [support channels](/docs/introduction/support)._
