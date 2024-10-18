---
title: Get started with your integration
subtitle: Learn the essentials and key steps for integrating with Neon
enableTableOfContents: true
isDraft: false
updatedOn: '2024-10-05T09:31:59.749Z'
---

This guide outlines the steps to integrate Neon into your platform, enabling you to offer managed Postgres databases to your users. Whether you’re developing a SaaS product, AI agent, enterprise platform, or something else entirely, this guide walks you through what's involved in setting up, configuring, and managing your Neon integration.

## 1. Setting up your integration

Neon provides flexible options for integrating Postgres into your platform. We support the following integration options:

- **OAuth**: Allows your application to interact with user accounts and perform authorized actions on their behalf. With OAuth, there’s no need for direct access to user login credentials, and users can grant permissions securely. For details, see the [Neon OAuth Integration Guide](/docs/guides/oauth-integration), and check out the [OAuth sample app](https://github.com/neondatabase/neon-branches-visualizer) to see how its done.

- **Neon API**: Use our API to directly interact with the platform. It enables `POST`, `GET`, `PATCH`, and `DELETE` operations on Neon objects such as projects, branches, databases, roles, and more. To explore available endpoints and try them out in your browser, visit our [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

- **@neondatabase/toolkit for AI Agents**: If you're building an AI agent, the [@neondatabase/toolkit](https://github.com/neondatabase/toolkit) ([@neon/toolkit](https://jsr.io/@neon/toolkit) on JSR) lets you spin up a Postgres database in seconds and run SQL queries. It includes both the [Neon API Client](https://www.npmjs.com/package/@neondatabase/api-client) and the [Neon serverless driver](https://github.com/neondatabase/serverless), making it an excellent choice for AI agents that need to set up an SQL database quickly. [Learn more](https://neon.tech/blog/why-neondatabase-toolkit).

## 2. Configuring limits

To ensure you have control over usage and costs, Neon's APIs let you configure limits and monitor usage, enabling billing features, such as:

- **Usage limits**: Define limits on consumption metrics like **storage**, **compute time**, and **data transfer**.
- **Pricing Plans**: Create different pricing plans for your platform or service. For example, you can set limits on consumption metrics to define your own Free, Pro, and Enterprise plans:
    - **storage**: Define maximum allowed storage for each plan.
    - **compute time**: Cap the CPU usage based on the plan your customers choose.
    - **data transfer**: Set limits for data transfer (egress) for different usage plans.

    <Admonition type="tip" title="partner example">
    For an example of how one of our partners defined usage limits based on _database instance types_, see [Koyeb Database Instance Types](https://www.koyeb.com/docs/databases#database-instance-types). You will see limits defined on compute size, compute time, stored data, written data, and egress.
    </Admonition> 

As your users upgrade or change their plans, you can dynamically modify their limits using the Neon API. This allows for real-time updates without affecting database uptime or user experience.

To learn more about setting limits, see [Configure consumption limits](#/docs/guides/partner-billing).

## 3. Monitoring usage

Using Neon's consumption APIs, you can query a range of account and project-level metrics to monitor usage. For example, you can:

- Query the total usage across all projects, providing a comprehensive view of usage for the billing period or a specific time range that can span across multiple billing periods.
- Get daily, hourly, or monthly metrics across a selected time period, broken out for each individual project.
- Get usage metrics for individual projects

To learn how, see [Querying consumption metrics with the API](/docs/guides/metrics-api).

## Key considerations for a successful integration

- **Use a project-per-user model**: When setting up your integration, we recommend a **project-per-user** model rather than branch-per-user or database-per-user.

    **What do we mean by project-per-user?** In Neon, resources such as branches, databases, roles, and computes are organized within a Neon project. You can learn more about Neon's project-based structure here: [Neon object hierarchy](https://neon.tech/docs/manage/overview).

    **Why do we recommend the project-per-user model?**

        - Neon uses a project-based structure for resource management; it's easier to follow this established, underlying model
        - A project-per-user structure isolates resources and data, making it easier to manage consumption
        - Isolation of resources and data by project helps protect against accidental data exposures among your users through unintended configuration or privilege management errors, making it easier to comply with privacy standards like GDPR.
        - Isolation of resources and data by project prevents one user's usage patterns or actions from affecting other users on your platform or service. For example, each user will have their own compute, storage, and data transfer limits, which are set for their project.
        - In Neon, databases reside on a branch, and certain operations in Neon are performed at the branch level, such as point-in-time restore. In a user-per-database implementation, a restore operation would affect every database on a branch. In a project based structure, branch level actions such as point-in-time restore can be isolated to a single user. In a database-per-user model, where users are given separate databases in the same Neon project, point-in-time restore operations would not be possible.

- **Carefully consider limits**: When setting limits for your users, aim to find the right balance between cost management and user-flexibility. Look at how Neon defines its [pricing plans](/docs/introduction/plans) or how Neon partners like Koyeb define [usage limits](https://www.koyeb.com/docs/databases#database-instance-types). Be aware that when users reach defined limits, their computes may be suspended preventing further interaction with the database. Take time to consider what you want to occur when a user reaches the limits you define. Do you want to build in advanced notifications? Do you want to provide an upgrade path? 
- **Autoscaling and Autosuspend**: Consider [autoscaling](/docs/introduction/autoscaling) limits and [autosuspend](/docs/introduction/auto-suspend) settings for the compute instances you create for customers. Do you want to allow compute resources to scale on demand? How soon should computes scale to zero when they are inactive? See [Other consumption-related settings](/docs/guides/partner-billing#other-consumption-related-settings).
- **Connection limits**: Be aware of the connection limits associated with each Neon compute size and that connection pooling supports more concurrent connections. To learn more, see [Connection limits](/docs/connect/connection-pooling#connection-limits-without-connection-pooling).
- **Custom names for roles and databases**: When creating projects using the [Create project API](https://api-docs.neon.tech/reference/createproject), you can customize the default role and database name.
- **Protected names for roles and databases**: Neon protects certain names for Postgres roles and databases. Your users will not be able to use these protected names when creating roles and databases. See [Protected role names](/docs/manage/roles#protected-role-names), and [Protected database names](/docs/manage/databases#protected-database-names).
- **Postgres extension support**: We often receive questions from our Partners about the Postgres extensions supported by Neon. See [Supported Postgres extensions](/docs/extensions/pg-extensions) the extensions that Neon supports.
- **Staying up to date with the Neon roadmap and changes to the Neon platform**: We do our best to proactively inform Partners of updates and changes that may impact their business. Sources of information Partners can monitor include:
    - The [Neon Roadmap](/docs/introduction/roadmap) for what's been delivered recently and what's coming next
    - The [Neon Changelog](/docs/changelog) for the latest product updates from Neon
    - The [Neon newsletter](https://neon.tech/blog#subscribe-form), sent weekly
    - The [Neon Blog](https://neon.tech/blog)
    - The [Neon status page](https://neonstatus.com/) for our platform status in each region
    - [RSS feeds](/docs/reference/feeds) for all of the above, which you can add to your Slack channels

## Integration support

We’re here to support you through every step of your integration. If you have any questions, feel free to reach out to our [Support team](https://neon.tech/docs/introduction/support). If you've set up a partnership arrangement with Neon, you can also reach our to your Neon Partnership contact.
