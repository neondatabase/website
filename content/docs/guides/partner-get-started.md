---
title: Get started with your integration
subtitle: Learn the essentials and key steps for integrating with Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2024-11-30T11:53:56.063Z'
---

This guide outlines the steps to integrate Neon into your platform, enabling you to offer managed Postgres databases to your users. Whether you’re developing a SaaS product, AI agent, enterprise platform, or something else entirely, this guide walks you through what's involved in setting up, configuring, and managing your Neon integration.

<Admonition type="tip" title="key considerations for a successful integration">
Before you start building your integration, be sure to read [Key considerations for a successful integration](#key-considerations-for-a-successful-integration).
</Admonition>

## 1. Setting up your integration

Neon provides flexible options for integrating Postgres into your platform. We support the following integration options:

- **OAuth**: Allows your application to interact with user accounts and perform authorized actions on their behalf. With OAuth, there’s no need for direct access to user login credentials, and users can grant permissions on a variety of supported OAuth scopes. For details, see the [Neon OAuth Integration Guide](/docs/guides/oauth-integration), and check out the [OAuth sample app](https://github.com/neondatabase/neon-branches-visualizer) to see how its done.

- **Neon API**: Use our API to interact with the Neon platform directly. It enables `POST`, `GET`, `PATCH`, and `DELETE` operations on Neon objects such as projects, branches, databases, roles, and more. To explore available endpoints and try them from your browser, visit our [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

- **@neondatabase/toolkit for AI Agents**: If you're building an AI agent, the [@neondatabase/toolkit](https://github.com/neondatabase/toolkit) ([@neon/toolkit](https://jsr.io/@neon/toolkit) on JSR) lets you spin up a Postgres database in seconds and run SQL queries. It includes both the [Neon API Client](https://www.npmjs.com/package/@neondatabase/api-client) and the [Neon serverless driver](https://github.com/neondatabase/serverless), making it an excellent choice for AI agents that need to set up an SQL database quickly. [Learn more](https://neon.tech/blog/why-neondatabase-toolkit).

## 2. Configuring limits

To ensure you have control over usage and costs, Neon's APIs let you configure limits and monitor usage, enabling billing features, such as:

- **Usage limits**: Define limits on consumption metrics like **storage**, **compute time**, and **data transfer**.
- **Pricing Plans**: Create different pricing plans for your platform or service. For example, you can set limits on consumption metrics to define your own Free, Pro, and Enterprise plans:

  - **storage**: Define maximum allowed storage for each plan.
  - **compute time**: Cap CPU usage based on the plan your customers choose.
  - **data transfer**: Set limits for data transfer (egress) on each usage plan.

    <Admonition type="tip" title="partner example">
    For an example of how a Neon partner defined usage limits based on _database instance types_, see [Koyeb Database Instance Types](https://www.koyeb.com/docs/databases#database-instance-types). You will see limits defined on compute size, compute time, stored data, written data, and egress.
    </Admonition>

As your users upgrade or change their plans, you can dynamically modify their limits using the Neon API. This allows for real-time updates without affecting database uptime or user experience.

To learn more about setting limits, see [Configure consumption limits](#/docs/guides/partner-consumption-limits).

## 3. Monitoring usage

Using Neon's consumption APIs, you can query a range of account and project-level metrics to monitor usage. For example, you can:

- Query the total usage across all projects, providing a comprehensive view of usage for the billing period or a specific time range spanning multiple billing periods.
- Get daily, hourly, or monthly metrics across a selected time period, broken out for each individual project.
- Get usage metrics for individual projects.

To learn how, see [Querying consumption metrics with the API](/docs/guides/partner-consumption-metrics).

## Key considerations for a successful integration

- **Use a project-per-user model**: When setting up your integration, we recommend a **project-per-user** model rather than branch-per-user or database-per-user models.

  **What do we mean by project-per-user?** In Neon, resources such as branches, databases, roles, and computes are organized within a Neon project. When a user signs up with Neon, they start by creating a project, which includes a default branch, database, role, and compute instance. We recommend the same approach for your integration. You can learn more about Neon's project-based structure here: [Neon object hierarchy](/docs/manage/overview).

  **Why we recommend the project-per-user model**:

        - Neon uses a project-based structure for resource management; it's easier to follow this established, underlying model.
        - A project-per-user structure isolates resources and data, making it easier to manage limits and billing.
        - Isolation of resources and data by project helps protect against accidental data exposure among users caused by misconfigurations or privilege management errors. This approach also simplifies compliance with privacy standards like GDPR.
        - Isolation of resources and data by project ensures that one user's usage patterns or actions do not impact other users on your platform or service. For example, each user has dedicated compute resources, so a heavy load in one user's project will not affect others.
        - In Neon, databases reside on a branch, and certain operations, such as point-in-time restore, are performed at the branch level. In a user-per-database implementation, a restore operation would impact every database on that branch. However, in a project-based structure, branch-level actions like point-in-time restore can be isolated to a single user.

- **Carefully consider limits**: When setting limits for your users, aim to strike the right balance between cost management and user flexibility. For reference, you can review how Neon defines its [pricing plans](/docs/introduction/plans) or how partners like Koyeb set [usage limits](https://www.koyeb.com/docs/databases#database-instance-types). Keep in mind that when users reach their defined limits, their compute resources may be suspended, preventing further interaction with the database. Consider what should happen when a user reaches these limits. Do you want to implement advanced notifications? Should there be an upgrade path?
- **Autoscaling and Scale to Zero**: Consider [autoscaling](/docs/introduction/autoscaling) limits and [sale to zero](/docs/introduction/scale-to-zero) settings for the compute instances you create for customers. Do you want to allow compute resources to scale on demand? How quickly should computes scale to zero when inactive? For more details, see [Other consumption-related settings](/docs/guides/partner-consumption-limits#other-consumption-related-settings).
- **Connection limits**: Be aware of the connection limits associated with each Neon compute size, and remember that connection pooling allows for more concurrent connections. For more information, see [Connection limits](/docs/connect/connection-pooling#connection-limits-without-connection-pooling).
- **Polling consumption data for usage reporting and billing**: Refer to our [Consumption polling FAQ](/docs/guides/partner-consumption-metrics#consumption-polling-faq).
- **Custom names for roles and databases**: When creating projects using the [Create project API](https://api-docs.neon.tech/reference/createproject), you can customize the default role and database names.
- **Protected names for roles and databases**: Neon reserves certain names for Postgres roles and databases. Users will not be able to use these protected names when creating roles and databases. For more information, see [Protected role names](/docs/manage/roles#protected-role-names) and [Protected database names](/docs/manage/databases#protected-database-names).
- **Postgres extension support**: We frequently receive questions from our partners about the Postgres extensions supported by Neon. See the list of [Supported Postgres extensions](/docs/extensions/pg-extensions) that Neon currently supports.
- **Staying up to date with changes to the Neon platform**: We make every effort to proactively and directly inform our partners about updates and changes that could impact their business. In addition, Partners can monitor the following sources for information about the latest updates from Neon:
  - The [Neon Roadmap](/docs/introduction/roadmap) to see recent deliveries and upcoming features.
  - The [Neon Changelog](/docs/changelog) for the latest product updates.
  - The [Neon Newsletter](https://neon.tech/blog#subscribe-form), sent weekly.
  - The [Neon Blog](https://neon.tech/blog).
  - The [Neon Status Page](https://neonstatus.com/) for platform status across regions.
  - [RSS Feeds](/docs/reference/feeds) for all of the above, which can be added to your Slack channels.

## Integration support

We’re here to support you through every step of your integration. If you have any questions, feel free to reach out to our [Support team](/docs/introduction/support). If you’ve set up a partnership arrangement with Neon, you can also contact your Neon Partnership representative.
