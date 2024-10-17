---
title: Get started with your integration
subtitle: Learn the essentials and key steps for integrating with Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2024-10-05T09:31:59.749Z'
---

This guide provides an overview of the steps to integrate Neon into your platform so that you can you offer managed Postgres databases to your users. Whether you're building an SaaS product, AI agent, enterprise platform, or something else entirely, this guide provides a path to setting up, configuring, and managing your Neon integration.

## Setting up your integration

Neon offers flexibility in how you integrate Postgres into your platform. You can integrate via:
- **OAuth**: Using this method, you can enable your application to interact with user accounts, carrying out permitted actions on their behalf. The integration does not require direct access to user login credentials and is conducted with users' approval, ensuring data privacy and security. To get started, refer to the [Neon OAuth integration](/docs/guides/oauth-integration) guide.
- **Neon API**: This method lets you interact directly with the Neon platform programmatically to perform `POST`, `GET`, `PATCH`, and `DELETE` operations on various Neon objects including projects, branches, databases, roles, and more. To explore the various Neon platform endpoints available to you, visit our [Neon API documentation](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

Whether you choose to use one integration method or both depends on your requirements and what you are trying to achieve with your integration.

<Admonition type="tip">
When setting up your integration, Neon generally recommends a **project-per-user** architecture. Why do we mean by this? In Neon, resources such as branches, databases, roles, and computes are organized within a Neon project. You can learn more about that structure here: [Neon Object hierarchy](https://neon.tech/docs/manage/overview).

What are the benefits over a database-per-user structure, for example?
- Neon itself uses a project-based structure; it's easier to follow the same pattern 
- A project-per-user structure isolates data and resources, making it easier to manage resources usage per user.
- Isolation of data by project helps protect against accidental data exposures makes it easier to comply with regulatory standards such as GDPR
- In Neon, databases reside on a branch, and certain operation in Neon are performed at the branch level, such as point-in-time restore. In a user-per-database implementation, a restore would affect every database on a branch. In a project based structure, branch level actions such as point-in-time restore can be isolated to a particular user.
</Admonition>

### 2. Configuring billing with Neon's APIs

To ensure you have control over costs and usage, Neon provides APIs for tracking usage and configuring limits for your customers. These APIs let you set up billing features, such as:

- Quotas (i.e., limits) on key usage metrics like storage and compute time.
- Limits for different pricing plans that you might define (e.g., Free, Pro, Enterprise).

Learn how to set up and manage quotas using the [Manage billing with consumption limits](#/docs/guides/partner-billing).

### 3. Set up your pricing plan limits

Offer your customers customized pricing plans by setting limits on:
- **Storage**: Define maximum allowed storage for different tiers.
- **Compute time**: Cap the CPU usage based on the plan your customers choose.
- **Data transfer**: Set limits for data transfers, ensuring different usage tiers for different customers.

See our [Pricing Plans Guide](#) to learn more about defining plan limits.

### 4. Updating plan limits

As your users upgrade or change their plans, you can dynamically modify their quota settings using the Neon API. This allows for real-time updates without affecting database uptime or user experience. Learn how to update quotas for your users, see [Update an existing project](/docs/guides/partner-billing#update-an-existing-project).

---

## Key Considerations for a Smooth Integration

1. **OAuth Integration**: Make sure to request the right OAuth scopes for managing Neon resources. Review the [Supported OAuth Scopes](#) to determine what levels of access your application needs.
2. **Billing API**: Use the consumption metrics and quotas to control costs and offer flexible, scalable solutions to your customers.
3. **Autoscaling and Suspension**: Be aware of autoscaling limits and autosuspend settings to ensure optimal performance for your users.
4. **Partner Benefits**: Neon handles all the database management, allowing you to focus on building your platform. Scale-to-zero ensures cost-efficiency for empty databases.

## Resources
- [OAuth Integration](#)
- [API Documentation](#)
- [Consumption API](#)
- [Billing Guide](#)

We’re here to support you through every step of your integration. If you have any questions, feel free to reach out to our support team at [support@neon.tech](mailto:support@neon.tech).
