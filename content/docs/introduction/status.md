---
title: Neon status
subtitle: Stay informed about the performance and availability of Neon
enableTableOfContents: true
updatedOn: '2025-03-05T21:09:38.754Z'
---

To stay informed about Neon's status, we provide a dedicated status page for each region that Neon supports. To view the Neon Status page, navigate to [https://neonstatus.com/](https://neonstatus.com/).

Remember to bookmark the Neon Status page for easy access.

![Neon status page](/docs/introduction/neon_status_page.png)

For status information applicable to your Neon project, monitor the status page for the region where your Neon project resides. If you don't know the region, you can find it on the **Project Dashboard** in the Neon Console.

Status pages provide status for:

- Database Connectivity
- Database Operations
- Console and API Requests

<Admonition type="note" title="platform maintenance notices">
You can monitor or subscribe to your region's [status page](/docs/manage/platform-maintenance) to stay informed about upcoming platform maintenance. See [Subscribing to Neon status pages](#subscribing-to-neon-status-pages) below.

Neon also applies regular updates to your project's computes, but these updates are not posted to regional status pages since they are specific to your Neon project. To stay informed about these updates, watch for update notices in your project's settings in the Neon Console. See [Updates](/docs/manage/updates) for details.
</Admonition>

## Subscribing to Neon status pages

Follow the instructions from the **Subscribe to updates** link on a regional status page to subscribe to updates via email, RSS, or Slack.

![Neon status page](/docs/introduction/neon_status_subscribe.png)

## Access Neon status via API

The [Neon status page](https://neonstatus.com), powered by [incident.io](https://incident.io), is also accessible via API. You can use these endpoints to check real-time system health, incidents, and scheduled maintenance across all regions.

### Global summary endpoint

To retrieve a summary of all regions and their current status:

- **Endpoint**: https://neonstatus.com/api/v1/summary

The response includes a list of regions, each with:

- `page_title`
- `page_url`
- `ongoing_incidents`
- `in_progress_maintenances`
- `scheduled_maintenances`

### Per-region status endpoints

You can also retrieve status details for a specific region. Each region has its own summary endpoint.

| Region                                   | Endpoint                                                                 |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| Console                                  | https://neonstatus.com/console/api/v1/summary                            |
| AWS - Asia Pacific (Singapore)           | https://neonstatus.com/aws-asia-pacific-singapore/api/v1/summary         |
| AWS - Asia Pacific (Sydney)              | https://neonstatus.com/aws-asia-pacific-sydney/api/v1/summary            |
| AWS - Europe (Frankfurt)                 | https://neonstatus.com/aws-europe-frankfurt/api/v1/summary               |
| AWS - Europe (London)                    | https://neonstatus.com/aws-europe-london/api/v1/summary                  |
| AWS - South America (São Paulo)          | https://neonstatus.com/aws-south-america-sao-paulo/api/v1/summary        |
| AWS - US East (N. Virginia)              | https://neonstatus.com/aws-us-east-n-virginia/api/v1/summary             |
| AWS - US East (Ohio)                     | https://neonstatus.com/aws-us-east-ohio/api/v1/summary                   |
| AWS - US West (Oregon)                   | https://neonstatus.com/aws-us-west-oregon/api/v1/summary                 |
| Azure - Germany West Central (Frankfurt) | https://neonstatus.com/azure-germanywestcentral-frankfurt/api/v1/summary |
| Azure East US 2 (Virginia)               | https://neonstatus.com/azure-eastus-2/api/v1/summary                     |
| Azure West US 3 (Arizona)                | https://neonstatus.com/azure-westus3-arizona/api/v1/summary              |

These endpoints return real-time structured JSON with zero or more incidents or maintenance events.

You can use them to power internal monitoring tools, integrations, or simple health checks.

<NeedHelp/>
