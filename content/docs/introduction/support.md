---
title: Support
enableTableOfContents: true
updatedOn: '2025-08-18T16:55:29.348Z'
---

This page outlines Neon's support plans, available channels, and policies. To learn how to access support, please refer to the [Support channels](#support-channels) section. Identify the channels available to you based on your plan and follow the links to navigate to the relevant information.

## Support plans

Neon's support plans are mapped to [Neon Pricing Plans](/docs/introduction/plans), as outlined in the following table.

| Neon Pricing Plan | Support Plan      |
| :---------------- | :---------------- |
| Free plan         | Community support |
| Launch plan       | Billing support   |
| Scale plan        | Standard support  |

<Admonition type="note">
Upgrading your support plan requires [upgrading your pricing plan](/docs/introduction/manage-billing#change-your-plan).
</Admonition>

## Support channels

The support channels you can access differ according to your [Support Plan](#support-plans).

| Support channels                                                              | Community support | Billing support | Standard support |
| :---------------------------------------------------------------------------- | :---------------: | :-------------: | :--------------: |
| [Neon Discord Server](#neon-discord-server) (not an official channel)         |      &check;      |     &check;     |     &check;      |
| [Neon AI Chat Assistance](#neon-ai-chat-assistance) (not an official channel) |      &check;      |     &check;     |     &check;      |
| [Support tickets](#support-tickets)                                           |         -         |       \*        |     &check;      |
| [Slack channel](#slack-channel)                                               |         -         |        -        |       \*\*       |
| [Dedicated Support Engineer](#dedicated-support-engineer)                     |         -         |        -        |       \*\*       |
| [SLAs](#slas)                                                                 |         -         |        -        |     &check;      |

<div style={{margin: '-30px 0 30px 0'}}>
<small><sup>\*</sup> [Support tickets](#support-tickets) are only supported for billing-related issues under this support plan, which means Neon Launch plan users can only create support tickets if the issue is related to billing.</small><br/>
<small><sup>\*\*</sup> [Slack channels](#slack-channel) and [Dedicated Support Engineers](#dedicated-support-engineer) are available as a paid addons.</small>
</div>

### Neon Discord Server

All Neon users have access to the [Neon Discord Server](https://discord.gg/92vNTzKDGp), where you can ask questions or see what others are doing with Neon. You will find Neon users and members of the Neon team actively engaged.

<Admonition type="important">
The [Neon Discord Server](https://discord.gg/92vNTzKDGp) is not an official Neon Support channel.
</Admonition>

### Neon AI chat assistance

Neon AI chat assistance is available to all Neon users. You can access it from these locations:

- **Neon Console**: Select the **Get help** option from the help menu (`?`) in the Neon Console.
- **Neon documentation**: Toggle **Ask Neon AI** on the [Neon documentation](/docs/introduction) site
- **Discord**: Join the **#gpt-help** channel on the [Neon Discord server](https://discord.gg/92vNTzKDGp)

Neon AI Chat assistants are updated regularly and built on various sources the Neon documentation, the Neon website, the Neon API, and Neon GitHub repositories.

<Admonition type="important">
Neon AI chat is not an official Neon Support channel.
</Admonition>

### Support tickets

Paying users can raise a support ticket in the Neon Console, via the Neon AI chat assistant, by asking it to create a support ticket.

- **Launch** plan users can open support tickets for **billing-related issues only**
- **Scale** plan users can open a support ticket for any Neon issue

Select **Get help** from the **?** menu at the top of the Neon Console to open the AI chat assistant.

![Get help option in Neon Console](/docs/introduction/support_get_help.png)

Ask your question or describe your issue. If the assistant is unable to resolve the problem, ask it to create a support ticket.

### Slack channel

[Slack connect](https://slack.com/intl/en-ie/connect) channels are available to Standard support plan customers. You can request one from our [sales team](/contact-sales).

### Dedicated Support Engineer

A dedicated engineer can develop in-depth knowledge of your systems, leading to more efficient issue resolution. To learn more, [contact our sales team](/contact-sales).

### SLAs

If you are interested in exploring an uptime Support Level Agreement (SLAs), [get in touch with our sales team](/contact-sales).

## General support policy

Neon provides Support for eligible plans under the terms of this Support Policy as long as the Customer maintains a current subscription to one of the following Neon plans: Launch, Scale. For more information, see [plans](/docs/introduction/plans). “Support” means the services described in this Support Policy and does not include one-time services or other services not specified in this Support Policy, such as training, consulting, or custom development. Support for Free plan users is provided through [Discord](/discord). See Neon [plans](/docs/introduction/plans) and [pricing](/pricing) for more information about our plans.

Unless described otherwise, defined terms mentioned in this policy shall have the same meaning as defined in our [terms of service](/terms-of-service).

We provide updates regarding any disruption in our Services on our [status page](https://neonstatus.com/). Please check this source first before seeking support.

### Issue resolution

Neon will make commercially reasonable efforts to resolve any Issues submitted by customers on eligible plans. Such efforts may (at our discretion) include helping with diagnosis, suggesting workarounds, or changing the Product in a new release. An “Issue” is a material and verifiable failure of the Product to conform to its Documentation. Support will not be provided for the following: (1) use of the Products in a manner inconsistent with the applicable Documentation, (2) modifications to the Products not provided by or approved in writing by Neon, (3) use of the Products with third-party software not provided or approved by Neon. The Customer shall not submit Issues arising from any products other than the Products or otherwise use Support for unsupported products; this includes issues caused by third-party integrations.

### Billing issues

If you, the Customer, believe that your invoice or billing receipt is incorrect, we strongly encourage you to contact our Support team rather than filing a dispute with your card provider. Should a payment dispute be filed before getting in touch with us, we are limited in terms of the action we can take to resolve the matter. Once a dispute has been made with the card provider, the account associated with it and all deployments under it may be suspended until it has been resolved.

### Response times

Neon aims to respond to all **support ticket** requests in a timely manner and as soon as practically possible. Support tickets can be opened by customers on our **Billing** and **Standard** support plans. Requests are prioritized based on the **Support Tier** and the [Severity](#severity-levels) of the issue.

| Support Tier                                                                                                | Business              | Enhanced       | Production            | Mission Critical      |
| :---------------------------------------------------------------------------------------------------------- | :-------------------- | :------------- | :-------------------- | :-------------------- |
| **Mission Critical Severity**                                                                               | —                     | —              | —                     | Within 15 minutes     |
| A mission-critical production system is down or severely impacted such that routine operation is impossible |                       |                |                       |                       |
| **Standard Support Severity 1**                                                                             | Within 1 business day | Within 4 hours | Within 1 hour         | Within 1 hour         |
| Production system is down or severely impacted such that routine operation is impossible                    |                       |                |                       |                       |
| **Standard Support Severity 2**                                                                             | Within 1 business day |                | Within 4 hours        | Within 2 hours        |
| Production issue where the system is functioning but in degraded or restricted capacity                     |                       |                |                       |                       |
| **Standard Support Severity 3**                                                                             | Within 1 business day |                | Within 1 business day | Within 4 hours        |
| Issue where minor functionality is impacted or a development issue occurs                                   |                       |                |                       |                       |
| **Standard Support Severity 4**                                                                             | Within 1 business day |                |                       | Within 1 business day |
| Request for information or feature request with no impact on business operations                            |                       |                |                       |                       |

**Support business hours:**

| Support Tier     | Business Hours                                                                              |
| :--------------- | :------------------------------------------------------------------------------------------ |
| Business         | 9 AM–6 PM, business days                                                                    |
| Enhanced         | 9 AM–6 PM, business days                                                                    |
| Production       | Severity 1 and 2: 24x7x365<br/>Severity 3 and 4: 9 AM–6 PM, business days                   |
| Mission Critical | Mission Critical, Severity 1 and 2: 24x7x365<br/>Severity 3 and 4: 9 AM–6 PM, business days |

Live support is provided during customer's designated support time zone.

#### Legacy Enterprise plan response times

The following response times apply to customers on [legacy Enterprise plans](/docs/introduction/legacy-plans#enterprise-plan-legacy) who were on Enterprise plans before the introduction of current usage-based plans.

<details>
<summary>**View legacy Enterprise response times**</summary>

The table below outlines response time guidelines for legacy Enterprise plan customers.

|    Severity Level     | Standard                                  | Gold                                     | Platinum                                 |
| :-------------------: | ----------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| Severity 1 (Critical) | \< 2 hours (during Normal Business Hours) | \< 1 hour                                | \< 1 hour                                |
|   Severity 2 (High)   | \< 2 days (during Normal Business Hours)  | \< 1 day                                 | \< 4 hours                               |
|  Severity 3 (Normal)  | \< 3 days (during Normal Business Hours)  | \< 3 days (during Normal Business Hours) | \< 3 days (during Normal Business Hours) |
|   Severity 4 (Low)    | \< 3 days (during Normal Business Hours)  | \< 3 days (during Normal Business Hours) | \< 3 days (during Normal Business Hours) |

**Severity Level Descriptions:**

- **Severity 1 (Critical)**: Production system down or severely impacted; routine operation impossible. Examples: complete outages, security breaches, data corruption.

- **Severity 2 (High)**: Production system functioning but degraded. Examples: partial outages with key features unusable, issues requiring significant customer workarounds.

- **Severity 3 (Normal)**: Minor functionality impacted or development issues. Examples: sporadic connection issues, minor performance problems, billing questions.

- **Severity 4 (Low)**: Information requests or feature requests with no business impact. Examples: general questions, feature requests, documentation clarifications.

</details>

### Etiquette

Regardless of the method or location through which Neon provides Support, communication should be professional and respectful. Any communication that is deemed objectionable by Neon staff is not tolerated. This includes but is not limited to any communication that is abusive or contains profane language. Neon reserves the right to terminate Support Services in the event of any such objectionable communication.

### Customer responsibilities

To ensure efficient resolution of issues, customers are expected to (1) provide detailed information about the issue, (2) cooperate with the Support team during troubleshooting, and (3) utilize available self-service resources for basic inquiries.

### Changes to the support policy

We reserve the right to modify, amend, or update this Support Policy, including the types of support offered, support hours, response times, and support plans, at any time and at our sole discretion. Any changes to the Support Policy will be effective immediately upon posting a revised version of this Support Policy. Continued use of our services after such modifications will constitute acknowledgment and acceptance of the changes.
