---
title: Get started with your integration
subtitle: Learn the essentials and key steps for integrating with Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2024-10-05T09:31:59.749Z'
---

This guide outlines the steps to integrate Neon into your platform, enabling you to offer managed Postgres databases to your users. Whether you’re developing a SaaS product, AI agent, enterprise platform, or something else entirely, this guide walks you through what's involved in setting up, configuring, and managing your Neon integration.

## 1. Setting up your integration

Neon provides flexible options for integrating Postgres into your platform. You can choose from the following methods:

- **OAuth**: This approach allows your application to interact with user accounts and perform authorized actions on their behalf. With OAuth, there’s no need for direct access to user login credentials, and users can grant permissions securely. For details, see the [Neon OAuth Integration Guide](/docs/guides/oauth-integration), and be sure to check out our [OAuth sample app](https://github.com/neondatabase/neon-branches-visualizer).

- **Neon API**: Use the Neon API to directly interact with the platform, enabling `POST`, `GET`, `PATCH`, and `DELETE` operations on Neon objects such as projects, branches, databases, roles, and more. To explore available endpoints and try them out in your browser, visit our [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

Whether you choose to use one integration method or both depends on your requirements and what you are trying to achieve with your integration.

## 2. Configuring limits with Neon's APIs

To ensure you have control over usage and costs, Neon provides APIs for configuring limits and monitoring usage. These APIs let you set up billing features, such as:

- Usage limits for metrics like **storage**, **compute time**, and **data transfer**.
- Limits for different pricing plans that you might define for your platform. For example, offer your customers customized pricing plans by setting limits on:
  - **storage**: Define maximum allowed storage for different tiers.
  - **compute time**: Cap the CPU usage based on the plan your customers choose.
  - **data transfer**: Set limits for data transfers, ensuring different usage tiers for different customers.

As your users upgrade or change their plans, you can dynamically modify their limits using the Neon API. This allows for real-time updates without affecting database uptime or user experience.

To learn more about setting limits, see [Configure consumption limits](#/docs/guides/partner-billing).

## 3. Monitoring usage

Using Neon's consumption APIs, you can query a range of account-level and project-level metrics to monitor usage. For example, you can:

- Query the total usage across all projects, providing a comprehensive view of usage for the billing period or a specific time range that can span across multiple billing periods.
- Get daily, hourly, or monthly metrics across a selected time period, but broken out for each individual project.
- Get usage metrics for individual projects

To learn how, see [Querying consumption metrics with the API](/docs/guides/metrics-api).

## Key considerations for a successful integration

1.  When setting up your integration, we recommend a **project-per-user** setup rather than branch-per-user or database-per-user.

    **What do we mean by project-per-user?** In Neon, resources such as branches, databases, roles, and computes are organized within a Neon project. You can learn more about that structure here: [Neon Object hierarchy](https://neon.tech/docs/manage/overview). We recommend that each user gets their own project for these reasons:

        - Neon itself uses a project-based structure for resource management; it's easier to follow this pattern
        - A project-per-user structure isolates data and resources, making it easier to manage each users consumption and usage data
        - Isolation of data by project protect against accidental data exposures through an unintended configuration or privilege error, making it easier to comply with regulatory standards such as GDPR
        - In Neon, databases reside on a branch, and certain operation in Neon are performed at the branch level, such as point-in-time restore. In a user-per-database implementation, a restore would affect every database on a branch. In a project based structure, branch level actions such as point-in-time restore can be isolated to a single user.

1.  **OAuth integration**: Make sure to request the right OAuth scopes for managing Neon resources. Review the [Supported OAuth Scopes](/docs/guides/oauth-integration#supported-oauth-scopes) to determine what levels of access your application needs.
1.  **Set the right project limits to control costs**: Use the Neon API to configure projects limits to control costs.
1.  **Customize object names when creating projects**: When creating projects using the [Create project API](https://api-docs.neon.tech/reference/createproject), you can customize the default project, branch, role, and database names to whatever you want.
1.  **Don't forget Autoscaling and Autosuspend**: Be aware of autoscaling limits and autosuspend settings to ensure optimal performance for your users. See [Other consumption-related settings](/docs/guides/partner-billing#other-consumption-related-settings).

We’re here to support you through every step of your integration. If you have any questions, feel free to reach out to our support team at [support@neon.tech](mailto:support@neon.tech).
