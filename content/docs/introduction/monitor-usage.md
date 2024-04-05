---
title: Neon usage metrics
subtitle: Monitor usage metrics for your account and projects from the console or API
enableTableOfContents: true
---

Neon exposes usage metrics in the Neon Console and through the Neon API.

## View usage metrics in the Neon Console

### Billing page

### Neon Dashboard 

The Usage widget on the Neon Dashboard shows a snapshot of your current consumption metrics since your last billing date (the last day of the previous month).

### Branch-specific usage metrics

The **Branches** page provides key usage metrics for all your branches, like active hours, compute hours, storage space used, and whether the branch includes a read-write compute, all organized into a table view that lets you scan your list of branches. You can also use search if your list of branches is quite long.

## Request usage metrics with the Neon API

Using the Neon API, you can collect a variety of usage-based consumption metrics like  `data_storage_bytes_hour` and `compute_time_seconds`.

Use this `GET` request to get details from an individual project.

```curl
curl --request GET \
     --url https://console.neon.tech/api/v2/projects/[project_ID] \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" | jq
```

For more details, see [Retrieving details about a project](/docs/guides/partner-billing#retrieving-details-about-a-project).

See [Querying metrics and quotas](https://neon.tech/docs/guides/partner-billing#querying-metrics-and-quotas)