---
title: HIPAA Compliance
enableTableOfContents: true
updatedOn: '2025-03-19T13:27:32.000Z'
---

At Neon, we take the security and privacy of your health information seriously. This guide is designed to help you understand how Neon complies with the Health Insurance Portability and Accountability Act (HIPAA) and what that means for you as a customer. Our Business Associate Agreement (BAA) outlines our commitment to safeguarding Protected Health Information (PHI) and complying with HIPAA regulations.

Neon's HIPAA functionality is only available to customers who have signed a Business Associate Agreement (BAA) with Neon. To request a draft BAA, please contact [Neon Sales](https://neon.tech/contact-sales) or email `hipaa@neon.tech`. After you've signed a BAA, see [Enabling HIPAA for a Neon project](#enabling-hipaa-for-a-neon-project).

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
   - Customers can request access to their PHI by [opening a request with Neon Support](https://console.neon.tech/app/projects?modal=support).
   - Any updates or corrections to PHI need to be carried out by the customer.

## Your rights and what to expect

- Transparency: You can request details about how your PHI is being used.
- Security: Our technical safeguards are designed to prevent unauthorized access.
- Data Control: You retain ownership of your data; we are custodians ensuring its protection.

## Availability of audit events

Audit events may not be logged if database endpoints experience exceptionally heavy load, as we prioritize database availability over capturing log events.

## Enabling HIPAA for a Neon project

Once a Business Associate Agreement (BAA) has been signed and you have the HIPAA add-on enabled, you can create a HIPAA-compliant project. HIPAA compliance must be selected at the time of project creation and cannot be added later.

<Tabs labels={["Console", "API"]}>

<TabItem>

To learn how to create a new Neon project using the Neon Console, see [Create a project](/docs/manage/projects#create-a-project)

On the **Create Project** form, select the **Enable HIPAA compliance for this project** checkbox. This option only appears if the HIPAA add-on is enabled for your account.

![Enable HIPAA option during project creation](/docs/security/enable_hipaa.png)

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
      "audit_log_level": "hipaa"
    },
    "pg_version": 17
  }
}
'
```
</TabItem>

</Tabs>

If you have trouble enabling HIPAA, contact [Neon Sales](https://neon.tech/contact-sales) or email `hipaa@neon.tech`.

<Admonition type="note">
Once HIPAA compliance is enabled for a Neon project, it cannot be disabled. If you want to delete HIPAA-compliant Neon project, please submit a [support request](https://console.neon.tech/app/projects?modal=support). Before deleting a HIPAA-compliant project, you are advised to store all necessary audit logs and data. Neon retains audit log data for the duration specified in the Business Associate Agreement (BAA).
</Admonition>

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

For any questions regarding our HIPAA compliance or to report an issue, please reach out to:

- Email: hipaa@neon.tech

_This guide provides a high-level overview of Neon's HIPAA compliance efforts. For more details, please refer to your Business Associate Agreement (BAA) or contact us directly via our [support channels](https://neon.tech/docs/introduction/support)._
