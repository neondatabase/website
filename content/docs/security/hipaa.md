---
title: HIPAA Compliance
enableTableOfContents: true
updatedOn: '2025-05-27T19:52:15.363Z'
---

Neon offers HIPAA compliance as part of our Business and Enterprise plans, available upon request.

We take the security and privacy of health information seriously. This guide explains how Neon supports HIPAA compliance and what it means for you as a customer. HIPAA features are only available to customers who have signed a Business Associate Agreement (BAA) with Neon. The BAA outlines our responsibilities for protecting Protected Health Information (PHI) and ensuring HIPAA compliance.

To request HIPAA support and receive a draft BAA, contact [Neon Sales](https://neon.tech/contact-sales) or email `hipaa@neon.tech`. After the BAA is signed, HIPAA will be enabled for your account, and you can proceed with [enabling HIPAA for your Neon projects](#enabling-hipaa-for-a-neon-project).

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

1. Use and Disclosure of PHI

   - We only use PHI to provide our agreed-upon services and to meet legal obligations.
   - PHI is disclosed only as required by law or with proper authorization.

2. Safeguards in Place

   - Administrative: Policies and training to ensure compliance.
   - Physical: Secure access controls to data storage areas.
   - Technical: Encryption and access controls for electronic PHI.

3. Incident Reporting

   - We promptly report any unauthorized use or disclosure of PHI.
   - Breach notifications are provided within 30 days as per HIPAA requirements.

4. Subcontractors and Agents

   - Any third parties we work with are required to adhere to the same data protection standards.
   - We provide transparency by listing our subcontractors at [https://neon.tech/hipaa-contractors](https://neon.tech/hipaa-contractors) and notifying customers of any changes if you sign up to notifications [here](https://share-eu1.hsforms.com/1XjUD9QeKQw-RSAgQ...).

5. Customer Responsibilities

   - Customers must ensure that PHI is only stored in data rows as intended for sensitive data and should never be included in metadata, column names, table names, schema descriptions, or system-generated logs such as audit trails, query logs, or error logs.
   - Customers have the responsibility to configure a session timeout.
   - Customers need to avoid including PHI in support tickets or metadata fields.

6. PHI Access and Amendments
   - Customers can request access to audit logs by contacting `hipaa@neon.tech`.
   - Any updates or corrections to PHI need to be carried out by the customer.

## Your rights and what to expect

- Transparency: You can request details about how your PHI is being used.
- Security: Our technical safeguards are designed to prevent unauthorized access.
- Data Control: You retain ownership of your data; we are custodians ensuring its protection.

## Availability of audit events

Audit events may not be logged if database endpoints experience exceptionally heavy load, as we prioritize database availability over capturing log events.

## Logged events

Neon maintains a comprehensive audit trail to support HIPAA compliance. This includes two categories of logged events:

1. **SQL activity**, logged using the [pgAudit](https://www.pgaudit.org/) extension (`pgaudit`) for PostgreSQL.
2. **User and administrative actions** performed via the Neon Console, logged at the API request level.

To persist database logs securely, Neon also uses the pgAudit companion extension, `pgauditlogtofile`. This extension writes audit logs directly to disk, ensuring logs are safely captured. Logs are then forwarded to a secure collector off-node for long-term retention and compliance analysis.

For more on pgAudit, see the [pgAudit documentation](https://github.com/pgaudit/pgaudit/blob/main/README.md).

### pgAudit settings in Neon (HIPAA mode)

When HIPAA audit logging is enabled for a compute, Neon configures pgAudit with the following settings:

| Setting                    | Value        | Description |
|----------------------------|--------------|-------------|
| pgaudit.log                | all, -misc   | Logs all classes of SQL statements except low-risk miscellaneous commands. |
| pgaudit.log_parameter      | off          | Parameters passed to SQL statements are not logged to avoid capturing sensitive values. |
| pgaudit.log_catalog        | off          | Queries on system catalog tables (e.g., `pg_catalog`) are excluded from logs to reduce noise. |
| pgaudit.log_statement      | on           | The full SQL statement text is included in the log. |
| pgaudit.log_relation       | off          | Only a single log entry is generated per statement, not per table or view. |
| pgaudit.log_statement_once | off          | SQL statements are logged with every entry, not just once per session. |

#### What does `pgaudit.log = 'all, -misc'` include?

This configuration enables logging for all major classes of SQL activity while excluding less relevant statements in the `misc` category. Specifically, it includes:

- **READ**: `SELECT` statements and `COPY` commands that read from tables or views.
- **WRITE**: `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, and `COPY` commands that write to tables.
- **FUNCTION**: Function calls and `DO` blocks.
- **ROLE**: Role and permission changes, including `GRANT`, `REVOKE`, `CREATE ROLE`, `ALTER ROLE`, and `DROP ROLE`.
- **DDL**: Schema and object changes like `CREATE TABLE`, `ALTER INDEX`, `DROP VIEW` — all DDL operations not included in the ``ROLE` class.
- **MISC_SET**: Miscellaneous `SET` commands, e.g. `SET ROLE`.

Excluded:

- **MISC**: Low-impact commands such as `DISCARD`, `FETCH`, `CHECKPOINT`, `VACUUM`, and `SET`.

For more details, see the [pgAudit documentation](https://github.com/pgaudit/pgaudit).

### Audit log storage and forwarding

- Logs are written using the standard [PostgreSQL logging facility](https://www.postgresql.org/docs/current/runtime-config-logging.html).
- Logs are sent to a dedicated Neon audit collector endpoint.
- Each log entry includes metadata such as the Neon compute ID (`endpoint_id`) and project ID (`project_id`).

### Log rotation and retention

- Logs are **rotated every 5 minutes**, meaning a new log file is created at 5-minute intervals. This keeps individual log files smaller and easier to manage.
- Logs are **retained for 15 minutes** before being automatically deleted by a background process. This ensures that logs are forwarded quickly to Neon's secure collector and do not accumulate on disk.
- The total **audit log directory size is monitored**, allowing the system to alert or take action if disk usage grows unexpectedly.

This short retention period reflects Neon's real-time forwarding model—logs are not stored long term on the compute but are moved off-node for secure storage.

### Extension configuration

- The `pgaudit` and `pgauditlogtofile` extensions are preloaded on HIPAA-enabled Neon projects.
- Supported PostgreSQL versions and corresponding `pgaudit` versions:
  - Postgres 14: pgAudit 1.6.2
  - Postgres 15: pgAudit 1.7.0
  - Postgres 16: pgAudit 16.0
  - Postgres 17: pgAudit 17.0
- For `pgauditlogtofile`, Neon uses version 1.6.4 across all Postgres versions (14-17).

### Console operation logging

Neon logs operations performed via the Neon Console interface. These actions are initiated through the UI and correspond to API requests made to the Neon backend. Examples of logged operations include:

- **Project management**: creating, deleting, renaming projects; changing project settings such as region or Postgres version.
- **Branch management**: creating, deleting, renaming branches; restoring from backups; promoting or archiving branches.
- **Compute management**: starting, stopping, scaling compute instances; viewing compute usage.
- **Database and role management**: creating or deleting databases; resetting Postgres role passwords.
- **Connection setup**: viewing or copying connection strings.
- **Organization and access**: inviting users, assigning roles, or removing users from an organization.
- **Billing**: updating payment methods, changing plans, viewing invoices or usage history.

To protect sensitive information, Neon filters data in audit logs using the following approach:

- **Sensitive fields** (such as `connection_uri` and `password`) are excluded from logs. These are identified using `x-sensitive` tags in the OpenAPI specification.
- **GET requests**: Only query parameters are logged; response payloads are not recorded.
- **Mutation requests** (`PATCH`, `PUT`, `POST`, `DELETE`): Request and response bodies are logged with sensitive fields redacted.
- Logged data is stored in an `audit_logs` table with columns for request and response bodies.
- Audit logs are queryable by `org_id`, which may be present in resource IDs, account fields, request payloads, or responses.

This logging approach ensures that all meaningful Neon Console activity is auditable while safeguarding user credentials and other sensitive data.

### Compliance assurance

This logging configuration supports HIPAA compliance by:

- Capturing a comprehensive audit trail of database and console activity.
- Avoiding inclusion of sensitive data in logs unless explicitly configured.
- Implementing structured log forwarding and secure log handling practices.
- Limiting retention to the minimum required for alerting and forensics.

If you need to request access to audit logs associated with your organization, contact [Neon support](https://neon.tech/contact-support).

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

_This guide provides a high-level overview of Neon's HIPAA compliance efforts. For more details, please refer to your Business Associate Agreement (BAA) or contact us directly via our [support channels](https://neon.tech/docs/introduction/support)._
