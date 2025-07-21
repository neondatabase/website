---
title: The Neon Grafana Cloud integration
subtitle: Send metrics and logs from Neon Postgres to Grafana Cloud
enableTableOfContents: true
updatedOn: '2025-07-21T00:00:00.000Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>How to set up the Grafana Cloud integration</p>
<p>How to configure log forwarding</p>
<p>The full list of externally-available metrics</p>
</DocsList>

<DocsList title="External docs" theme="docs">
<a href="https://grafana.com/docs/grafana-cloud/send-data/otlp/">Grafana Cloud OTLP Documentation</a>
<a href="https://grafana.com/docs/grafana-cloud/account-management/authentication-and-permissions/">Grafana Cloud Authentication and Permissions</a>
</DocsList>
</InfoBlock>

Available for Scale and Business Plan users, the Neon Grafana Cloud integration lets you monitor Neon database performance, resource utilization, and system health directly from Grafana Cloud.

## How it works

The integration uses Grafana Cloud's native OTLP endpoint to securely transmit Neon metrics and Postgres logs. By configuring the integration with your Grafana Cloud OTLP endpoint and authentication token, Neon automatically sends data from your project to your Grafana Cloud stack, where it's automatically routed to the appropriate storage backends (Mimir for metrics, Loki for logs, and Tempo for traces).

<Admonition type="note">
Data is sent for all computes in your Neon project. For example, if you have multiple branches, each with an attached compute, both metrics and logs will be collected and sent for each compute.
</Admonition>

### Neon metrics

The integration exports [a comprehensive set of metrics](#available-metrics) including:

- **Connection counts** &#8212; Tracks active and idle database connections.
- **Database size** &#8212; Monitors total size of all databases in bytes.
- **Replication delay** &#8212; Measures replication lag in bytes and seconds.
- **Compute metrics** &#8212; Includes CPU and memory usage statistics for your compute.

### Postgres logs

<FeatureBetaProps feature_name="Postgres logs export" />

The Neon Grafana Cloud integration can forward Postgres logs to your Grafana Cloud stack. These logs provide visibility into database activity, errors, and performance. See [Export Postgres logs to Grafana Cloud](#export-postgres-logs-to-grafana-cloud) for details.

## Prerequisites

Before getting started, ensure the following:

- You have a Neon account and project. If not, see [Sign up for a Neon account](/docs/get-started-with-neon/signing-up).
- You have a Grafana Cloud account access to the Grafana Cloud Portal.

## Steps to integrate Grafana Cloud with Neon

1. **Get your Grafana Cloud OTLP configuration**:
  - Sign in to the [Grafana Cloud Portal](https://grafana.com/orgs/)
  - Click on the **OpenTelemetry** card
  - Copy your OTLP endpoint URL and authentication credentials from the configuration details

  <Admonition type="tip">
  The Authentication key should follow the format `<openTelemetry-instance-id>:<grafana-cloud-token>`
  </Admonition>

2. **Configure the Neon integration**:
   - In the Neon Console, navigate to the **Integrations** page in your Neon project
   - Locate the **OpenTelemetry** card and click **Add**
   - Select **HTTP** as the connection protocol (recommended)
   - Enter your Grafana Cloud OTLP endpoint URL
   - Choose **Bearer** authentication and paste your Grafana Cloud authentication token
   - Configure the `service.name` resource attribute (e.g., "neon-postgres-production")
   - Select what you want to export:
     - **Metrics**: System metrics and database statistics (CPU, memory, connections, etc.)
     - **Postgres logs**: Error messages, warnings, connection events, and system notifications
   - Click **Add** to complete the integration

<Admonition type="note">
You can change these settings later by editing your integration configuration from the **Integrations** page.
</Admonition>

Once the integration is set up, Neon will start sending metrics and logs to your Grafana Cloud stack, where they'll be automatically stored in Mimir (metrics) and Loki (logs).

<Admonition type="note">
Neon computes only send logs and metrics when they are active. If the [Scale to Zero](/docs/introduction/scale-to-zero) feature is enabled and a compute is suspended due to inactivity, no logs or metrics will be sent during the suspension. This may result in gaps in your data. If you notice missing data, check if your compute is suspended. You can verify a compute's status as `Idle` or `Active` on the **Branches** page in the Neon console, and review **Suspend compute** events on the **System operations** tab of the **Monitoring** page.

Additionally, if you are setting up the Grafana Cloud integration for a project with an inactive compute, you'll need to activate the compute before it can send data. To activate it, simply run a query from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or any connected client.
</Admonition>

## Example usage in Grafana Cloud

Once integrated, you can explore your Neon metrics and logs in Grafana Cloud using the Explore feature. Navigate to **Explore** in your Grafana Cloud instance and query metrics like `neon_connection_counts`, `neon_db_total_size`, and `host_cpu_seconds_total` using your Prometheus data source. You can also create custom dashboards and set alerts based on threshold values for critical metrics.

## Import the Neon dashboard

Import the provided dashboard JSON configuration to get started with pre-built visualizations:

1. In your Grafana Cloud stack, navigate to **Dashboards** → **New** → **Import**
2. Copy and paste the [dashboard JSON below](#dashboard-json) 
3. Click **Load** and configure the dashboard settings
4. The dashboard will automatically detect your Neon metrics and display key performance indicators

If any of the computes in your project are active, you should start seeing data in the resulting dashboard right away. By default, the dashboard shows metrics for all active endpoints in your project. You can filter results to one or more selected endpoints using the endpoint_id variable dropdown selector.

### Dashboard JSON

<details>
<summary>Copy Neon PostgreSQL Monitoring Dashboard JSON</summary>
```json shouldWrap
{
  "dashboard": {
    "id": null,
    "title": "Neon PostgreSQL Monitoring",
    "description": "Monitor your Neon PostgreSQL database metrics and performance",
    "refresh": "30s",
    "time": {
      "from": "now-1h",
      "to": "now"
    },
    "panels": [
      {
        "id": 1,
        "title": "CPU Usage",
        "type": "timeseries",
        "targets": [
          {
            "expr": "rate(host_cpu_seconds_total{mode!=\"idle\"}[5m])",
            "legendFormat": "{{mode}}",
            "refId": "A"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "percent"
          }
        },
        "gridPos": {
          "h": 8,
          "w": 12,
          "x": 0,
          "y": 0
        }
      },
      {
        "id": 2,
        "title": "Memory Usage",
        "type": "timeseries",
        "targets": [
          {
            "expr": "host_memory_total_bytes - host_memory_available_bytes",
            "legendFormat": "Used Memory",
            "refId": "A"
          },
          {
            "expr": "host_memory_cached_bytes",
            "legendFormat": "Cached Memory",
            "refId": "B"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "bytes"
          }
        },
        "gridPos": {
          "h": 8,
          "w": 12,
          "x": 12,
          "y": 0
        }
      },
      {
        "id": 3,
        "title": "Database Connections",
        "type": "timeseries",
        "targets": [
          {
            "expr": "neon_connection_counts",
            "legendFormat": "{{state}} - {{datname}}",
            "refId": "A"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "short"
          }
        },
        "gridPos": {
          "h": 8,
          "w": 12,
          "x": 0,
          "y": 8
        }
      },
      {
        "id": 4,
        "title": "Database Size",
        "type": "timeseries",
        "targets": [
          {
            "expr": "neon_db_total_size",
            "legendFormat": "Total Size",
            "refId": "A"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "bytes"
          }
        },
        "gridPos": {
          "h": 8,
          "w": 12,
          "x": 12,
          "y": 8
        }
      },
      {
        "id": 5,
        "title": "Local File Cache Hit Rate",
        "type": "timeseries",
        "targets": [
          {
            "expr": "neon_lfc_hits / (neon_lfc_hits + neon_lfc_misses)",
            "legendFormat": "Cache Hit Rate",
            "refId": "A"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "percentunit",
            "min": 0,
            "max": 1
          }
        },
        "gridPos": {
          "h": 8,
          "w": 12,
          "x": 0,
          "y": 16
        }
      },
      {
        "id": 6,
        "title": "Replication Delay",
        "type": "timeseries",
        "targets": [
          {
            "expr": "neon_replication_delay_bytes",
            "legendFormat": "Replication Delay (Bytes)",
            "refId": "A"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "bytes"
          }
        },
        "gridPos": {
          "h": 8,
          "w": 12,
          "x": 12,
          "y": 16
        }
      }
    ],
    "templating": {
      "list": [
        {
          "name": "endpoint_id",
          "type": "query",
          "query": "label_values(neon_connection_counts, endpoint_id)",
          "refresh": 2,
          "multi": false,
          "includeAll": false
        },
        {
          "name": "project_id",
          "type": "query",
          "query": "label_values(neon_connection_counts, project_id)",
          "refresh": 2,
          "multi": false,
          "includeAll": false
        }
      ]
    }
  }
}
```
</details>

## Available metrics

Neon exports a comprehensive set of metrics including connection counts, database size, replication delay, and compute metrics (CPU and memory usage). For a complete list of all available metrics with detailed descriptions, see the [Metrics and logs reference](/docs/reference/metrics-logs).

## Export Postgres logs to Grafana Cloud

You can export your Postgres logs from your Neon compute to your Grafana Cloud stack. These logs provide visibility into database activity, errors, and performance. The logs are automatically sent to Grafana Cloud Loki and can be queried using LogQL.

### Performance impact

Enabling this feature may result in:

- An increase in compute resource usage for log processing
- Additional network egress for log transmission (Neon does not charge for data transfer on paid plans)
- Associated costs based on log volume in Grafana Cloud

### Querying logs in Grafana Cloud

Once logs are flowing, you can query them in Grafana's Explore view using LogQL:

```logql
# View all logs from your Neon service
{service_name="your-service-name"}

# Filter for errors only
{service_name="your-service-name"} |= "ERROR"

# View connection events
{service_name="your-service-name"} |= "connection"
```

## Set up alerts

Create alerts for key metrics to monitor your database health:

1. **High CPU Usage**: Alert when CPU usage exceeds 80%
   ```promql
   rate(host_cpu_seconds_total{mode!="idle"}[5m]) > 0.8
   ```

2. **Low Cache Hit Rate**: Alert when cache hit rate drops below 90%
   ```promql
   neon_lfc_hits / (neon_lfc_hits + neon_lfc_misses) < 0.9
   ```

3. **High Connection Count**: Alert when connections exceed your threshold
   ```promql
   sum(neon_connection_counts) > 100
   ```

## Feedback and future improvements

We're always looking to improve! If you have feature requests or feedback, please let us know via the [Feedback form](https://console.neon.tech/app/projects?modal=feedback) in the Neon Console or on our [Discord channel](https://discord.com/channels/1176467419317940276/1176788564890112042).

<NeedHelp/>