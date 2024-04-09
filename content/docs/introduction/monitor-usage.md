---
title: Neon usage metrics
subtitle: Monitor usage metrics for your account and projects from the console or API
enableTableOfContents: true
---

Neon exposes usage metrics in the Neon Console and through the Neon API.

## View usage metrics in the Neon Console

### Billing page

You can monitor usage metrics for your Neon account from the **Billing** page in the Neon Console. Usage metrics include:

- Branches (Free Tier only)
- Storage
- Compute
- Projects

![Monitor billing and usage](/docs/introduction/monitor_billing_usage.png)

For more information, see [Monitoring billing and usage](/docs/introduction/how-billing-works#monitoring-billing-and-usage).

### Neon Dashboard 

The **Usage** widget on the Neon Dashboard shows a snapshot of your current project usage since your last billing date (the last day of the previous month).

![Monitor usage widget](/docs/introduction/monitor_usage_widget.png)

For information about the metrics displayed here, see [Monitor usage for a project](/docs/introduction/how-billing-works#monitor-usage-for-a-project)

### Branch-specific usage metrics

The **Branches** page provides key usage metrics for all your branches, like active time, data size, when the branch was last active, all organized into a table view.

To view the branches in your Neon project:

1. In the Neon Console, select a project.
2. Select **Branches** to view the branches for the project.

You can select a branch from the table to view additional details about the branch.

## Retrieve usage metrics with the Neon API

Using the Neon API, you can retrieve a variety of usage-based consumption metrics like  `data_storage_bytes_hour` and `compute_time_seconds`.

Use this `GET` request to get details from an individual project.

```curl
curl --request GET \
     --url https://console.neon.tech/api/v2/projects/[project_ID] \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" | jq
```

For more information, see [Retrieving details about a project](/docs/guides/partner-billing#retrieving-details-about-a-project).