---
title: HIPAA Compliance
enableTableOfContents: true
updatedOn: '2025-05-30T16:54:40.493Z'
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
   - We provide transparency by listing our subcontractors at [https://neon.com/hipaa-contractors](/hipaa-contractors) and notifying customers of any changes if you sign up to notifications [here](https://share-eu1.hsforms.com/1XjUD9QeKQw-RSAgQ...).

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
