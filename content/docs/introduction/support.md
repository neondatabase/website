---
title: Support
enableTableOfContents: true
updatedOn: '2024-08-06T15:23:10.955Z'
---

## General Support Policy

Neon provides Support for eligible plans under the terms of this Support Policy as long as the Customer maintains a current subscription to the Neon Launch, Scale, Business, or Enterprise [plans](/docs/introduction/plans). “Support” means the services described in this Support Policy and does not include one-time services or other services not specified in this Support Policy, such as training, consulting, or custom development. Support for [Free tier](/docs/introduction/free-tier) users is provided through [Discord](https://neon.tech/discord). See Neon [plans](/docs/introduction/plans) and [pricing](https://neon.tech/pricing) for information on available subscriptions.

Unless described otherwise, defined terms mentioned in this policy shall have the same meaning as defined in our [terms of service](https://neon.tech/terms-of-service).

We provide updates regarding any disruption in our Services on our [status page](https://neonstatus.com/). Please check this source first before seeking support.

## Issue resolution

Neon will make commercially reasonable efforts to resolve any Issues submitted by customers on eligible plans. Such efforts may (at our discretion) include helping with diagnosis, suggesting workarounds, or changing the Product in a new release. An “Issue” is a material and verifiable failure of the Product to conform to its Documentation. Support will not be provided for the following: (1) use of the Products in a manner inconsistent with the applicable Documentation, (2) modifications to the Products not provided by or approved in writing by Neon, (3) use of the Products with third-party software not provided or approved by Neon. The Customer shall not submit Issues arising from any products other than the Products or otherwise use Support for unsupported products; this includes issues caused by third-party integrations.

## Billing issues

If you, the Customer, believe that your invoice or billing receipt is incorrect, we strongly encourage you to contact our Support team rather than filing a dispute with your card provider. Should a payment dispute be filed before getting in touch with us, we are limited in terms of the action we can take to resolve the matter. Once a dispute has been made with the card provider, the account associated with it and all deployments under it may be suspended until it has been resolved.

## Support channels

| Support channels                | Community | Standard | Priority | Enterprise |
| :------------------------------ | :-------: | :------: | :------: | :--------: |
| Neon Discord Server             |  &check;  | &check;  | &check;  |  &check;   |
| Support tickets                 |     -     | &check;  | &check;  |  &check;   |
| Prioritized supported tickets   |     -     |    -     | &check;  |  &check;   |
| Video chat                      |     -     |    -     | &check;  |  &check;   |
| Dedicated Customer Success Team |     -     |    -     |          |  &check;   |
| SLAs                            |     -     |    -     |          |  &check;   |

<Admonition type="important">
The [Neon Discord Server](https://discord.gg/92vNTzKDGp) is available to all Neon users but is not an official Neon Support channel. If you are a paid plan user and require assistance from the Neon Support team, please open a support ticket, as described in [Standard support](#standard-support).
</Admonition>

## Support Plans

### Community support

Neon's [Free Plan](/docs/introduction/plans#free-plan) includes **Community** support.

Community support is provided through the [Neon Discord Server](https://discord.gg/92vNTzKDGp), where you can ask questions or see what others are doing with Neon. You will find Neon users and members of the Neon team actively engaged in our Discord Server.

### Standard support

Neon's [Launch plan](/docs/introduction/plans#launch) includes **Standard** support.

Standard support includes access to the Neon Support team via support tickets.

You can open support tickets in the Neon Console. Look for the **Support** link in the sidebar. It opens the **Create Support Ticket** modal, where you can describe your issue. To access the modal directly, [click here](https://console.neon.tech/app/projects?modal=support).

![Support ticket modal](/docs/introduction/neon_support_modal.png)

You can expect an initial response time of 2 business days, from 6am to 6pm Pacific Standard Time (UTC -8), Monday through Friday, excluding public holidays in the United States. For custom support solutions, please contact [Sales](https://neon.tech/contact-sales).

### Priority support

Neon's [Scale](/docs/introduction/plans#scale) and [Business](/docs/introduction/plans#business) plans includes **Priority** support.

With Priority support, your support tickets are given priority by the Neon Support team and you can request a video chat. Requests for video chat should be submitted via a support ticket.

### Enterprise support

Neon's [Enterprise plan](/docs/introduction/plans#launch) includes **Enterprise** support.

With Enterprise support, you have everything offered with the Priority plan plus dedicated Customer Success Team support, and SLAs.

<Admonition type="note">
If you are a Launch, Scale, Business, or Enterprise user and are unable to access the support ticket form in the Neon Console, you can use the following email address as a fallback: `support@neon.tech`
</Admonition>

## Response Times

Neon aims to respond to all **paid subscription** requests in a timely manner and as soon as practically possible. Customers are prioritized based on their plan and Severity of their issue. We only commit to responding to Customers with an Enterprise subscription using the target response time guidelines below.

## Enterprise target response times

The table below outlines Neon’s guidelines for the various support tiers of our Enterprise support plan.  
These times relate to the time it takes Neon to respond to the Customer’s initial request. This guideline only applies when submitting a support ticket through the Neon Console.

|    Severity Level     | Enterprise Standard                       | Enterprise Gold                          |
| :-------------------: | ----------------------------------------- | ---------------------------------------- |
| Severity 1 (Critical) | \< 2 hours (during Normal Business Hours) | \< 1 hour                                |
|   Severity 2 (High)   | \< 2 days (during Normal Business Hours)  | \< 1 day                                 |
|  Severity 3 (Normal)  | \< 3 days (during Normal Business Hours)  | \< 3 days (during Normal Business Hours) |
|   Severity 4 (Low)    | \< 3 days (during Normal Business Hours)  | \< 3 days (during Normal Business Hours) |

## Severity Levels

When the Customer submits an issue (with or without specifying a starting severity), Neon will reasonably assess its severity according to the appropriate severity levels defined below. Neon reserves the right to set, upgrade and downgrade severities of support tickets, on a case-by-case basis, considering any available mitigations, workarounds, and timely cooperation from Customers. Neon will explain the reasoning to the Customer and will resolve any disagreement regarding the severity as soon as is reasonably practicable. **Critical and High-priority levels should not be used for low-impact issues or general questions\!**

A detailed explanation of each severity level, including several examples, is provided below.

### Severity 1 (Critical)

- Catastrophic problems in the Customer’s production system leading to loss of service or impact on the Customer’s business
- Unavailability of the service
- Security breaches that compromise the confidentiality, integrity, or availability of the database or its data.

**Note**: If Critical is selected during the case creation, the customer will be asked to provide in-depth details on the business impact the issue has caused.

Examples:

1. A complete outage of the service provided by Neon
2. Security breaches
3. Error impacting the project as a whole (all endpoints/db affected)
4. Error impacting multiple projects
5. EP/Branch/DB unreachable
6. Data corruption/Data loss

### Severity 2 (High)

Means a high-impact problem in a customer’s production systems. Essential operations are seriously disrupted, but a workaround exists that allows for continued essential operations.

- Non-essential modifications to configuration, like adjusting database parameters or table schema
- Minor performance concerns that have minimal impact on database usability
- Minor issues related to application integrations, such as minor API connectivity problems
- Small-scale challenges with data import/export, data transformation, or data loading processes

Examples:

1. Partial outage of the service provided by Neon: service usable, but key feature unusable, e.g.:
   - Cannot create a new branch
   - Cannot PITR
   - Etc.
2. Any use case that would require a high load of manual work on the customer side to mitigate an issue on our end
3. Any use case which massively and negatively affects the customer's business

### Severity 3 (Normal)

A medium-impact problem on a production or non-production system that involves:

- Partial or limited loss of non-critical functionality
- A usage problem that involves no loss in functionality

Customers can continue essential operations. Normal problems also include issues with non-production systems, such as test and development systems.

Examples:

1. RCA for past outages or incidents (no disruption of the service at the moment)
2. Sporadic connection failure/timeouts/retries
3. Cannot connect with random third-party framework or tool (but can connect generally speaking)
4. Any use case which has a minor impact on the customer's business
5. Poor performing queries/ingestion
6. Billing issues

### Severity 4 (Low)

- A general usage question; here is no impact on the product's quality, performance, or functionality in a production or non-production system
- Any request for information, enhancement, or documentation clarification regarding the platform

Examples:

1. Feature requests/feature enablement
2. General questions (“active time,” “how to backup a DB,” “how to ingest data”) and feedback
3. Any use case that has no impact on the customer's business at all

## Upgrading your support plan

Neon's support plans are mapped to our [pricing plans](/docs/introduction/plans), as outlined in the following table. Upgrading your support plan requires [upgrading your pricing plan](/docs/introduction/manage-billing#change-your-plan).

| Support plan | Pricing plan                                                                                         |
| :----------- | :--------------------------------------------------------------------------------------------------- |
| Community    | [Free Plan](/docs/introduction/plans#free-plan)                                                      |
| Standard     | [Launch](/docs/introduction/plans#launch)                                                            |
| Priority     | [Scale](/docs/introduction/plans#scale) and [Business plan](/docs/introduction/plans#business) plans |
| Enterprise   | [Enterprise plan](/docs/introduction/plans#enterprise)                                               |

## Etiquette

Regardless of the method or location through which Neon provides Support, the Customer must communicate professionally and respectfully. Any communication that is deemed objectionable by Neon staff is not tolerated. This includes but is not limited to, any communication that is abusive or contains profane language. Neon reserves the right to terminate Support Services if the Customer engages in any such objectionable communication.

## Customer Responsibilities

To ensure efficient resolution of issues, customers are expected to (1) provide detailed information about the issue, (2) cooperate with the Support team during troubleshooting, and (3) utilize available self-service resources for basic inquiries.

## Changes to this Policy

We reserve the right to modify, amend, or update this Support Policy, including the types of support offered, support hours, response times, and support plans, at any time and at our sole discretion. Any changes to the Support Policy will be effective immediately upon posting a revised version of this Support Policy. Continued use of our services after such modifications will constitute acknowledgment and acceptance of the changes.
