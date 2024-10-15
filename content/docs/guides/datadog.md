---
title: The Neon Datadog integration
subtitle: Send metrics and events from Neon Postgres to Datadog
enableTableOfContents: true
tag: new
updatedOn: '2024-10-15T18:18:48.013Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>How to set up the integration</p>
<p>The full list of externally-available metrics</p>
</DocsList>

<DocsList title="External docs" theme="docs">
<a href="https://docs.datadoghq.com/account_management/api-app-keys/">Datadog API and Application Keys</a>
<a href="https://docs.datadoghq.com/getting_started/site/#access-the-datadog-site/">Identify Datadog site</a>
</DocsList>
</InfoBlock>

Available for Scale and Business Plan users, the Neon Datadog integration lets you monitor Neon database performance, resource utilization, and system health directly from Datadog's observability platform.

<ComingSoon/>

## How it works

The integration leverages a [list of metrics](#available-metrics) that Neon makes available for export to third-party services. By configuring the integration with your Datadog API key, Neon automatically sends metrics from your project to your selected Datadog site. Some of the key metrics include:

- **Connection counts** &#8212; Tracks active and idle database connections.
- **Database size** &#8212; Monitors total size of all databases in bytes.
- **Replication delay** &#8212; Measures replication lag in bytes and seconds.
- **Compute metrics** &#8212; Includes CPU and memory usage statistics for your compute.

<Admonition type="note"> 
Metrics are sent for all computes in your Neon project. For example, if you have multiple branches, each with an attached compute, metrics will be collected and sent for each compute. 
</Admonition>

## Prerequisites

Before getting started, ensure the following:

- You have a Neon account and project. If not, see [Sign up for a Neon account](/docs/get-started-with-neon/signing-up).
- You have a Datadog account and API key.
- You know the region you selected for your Datadog account. Here's how to check: [Find your Datadog region](https://docs.datadoghq.com/getting_started/site/#access-the-datadog-site)

## Steps to integrate Datadog with Neon

1. In the Neon Console, navigate to the **Integrations** page in your Neon project.
2. Locate the **Datadog** card and click **Add**.
3. Enter your **Datadog API key**. You can generate or retrieve [Datadog API Keys](https://app.datadoghq.com/organization-settings/api-keys) from your Datadog organization.
4. Select the Datadog **site** that you used when setting up your Datadog account.
5. Click **Confirm** to complete the integration.

Optionally, you can import the Neon-provided JSON configuration file into Datadog, which creates a pre-built dashboard from Neon metrics, similar to the charts available on our Monitoring page. See [Import Neon dashboard](#import-neon-dashboard)

Once set up, Neon will start sending metrics to Datadog, and you can use these metrics to create custom dashboards and alerts in Datadog.

<Admonition type="note">
Neon computes only send metrics when they are active. If the [Autosuspend](/docs/introduction/auto-suspend) feature is enabled and a compute is suspended due to inactivity, no metrics will be sent during the suspension. This may result in gaps in your Datadog metrics. If you notice missing data in Datadog, check if your compute is suspended. You can verify a compute's status as `Idle` or `Active` on the **Branches** page in the Neon console, and review **Suspend compute** events on the **System operations** tab of the **Monitoring** page.

Additionally, if you are setting up Neon’s Datadog integration for a project with an inactive compute, you'll need to activate the compute before it can send metrics to Datadog. To activate it, simply run a query from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or any connected client on the branch associated with the compute.
</Admonition>

## Example usage in Datadog

Once integrated, you can create custom dashboards in Datadog by querying the metrics sent from Neon. Use Datadog's **Metrics Explorer** to search for metrics like `connection_counts`, `db_total_size`, and `host_cpu_seconds_total`. You can also set alerts based on threshold values for critical metrics.

## Import the Neon dashboard

As part of the integration, Neon provides a JSON configuration file that you can import into Datadog to start with a pre-built dashboard based on a subset of Neon metrics.

![neon dashboard in datadog](/docs/guides/neon-dashboard-datadog.png)

Here's how you can import the dashboard:

1. In the Neon Console, open your Datadog integration from the **Integrations** page.
1. Scroll to the bottom of the panel and copy the JSON from there.

   OR

   You can copy the [JSON below](#dashboard-json) instead.

1. Next, create a new dashboard in Datadog.
1. Open **Configure**, select **Import dashboard JSON**, then paste the Neon-provided configuration JSON.

If any of the computes in your project are active, you should start seeing data in the resulting charts right away. By default, the charts show metrics for all active endpoints in your project. You can filter results to one or more selected endpoints using the **endpoint_id** variable dropdown selector.

![select endpoint variable in dashboard](/docs/guides/datadog_select_endpoint.png)

### Dashboard JSON

<details>
<summary>Copy JSON configuration</summary>
```json shouldWrap
{
"title": "Single Neon Compute metrics (with dropdown)",
"description": "",
"widgets": [
    {
    "id": 7296782684811837,
    "definition": {
        "title": "CPU",
        "title_size": "16",
        "title_align": "left",
        "show_legend": true,
        "legend_layout": "auto",
        "legend_columns": [
        "avg",
        "min",
        "max",
        "value",
        "sum"
        ],
        "type": "timeseries",
        "requests": [
        {
            "formulas": [
            {
                "alias": "Used",
                "formula": "per_minute(host_cpu_seconds_total)"
            }
            ],
            "queries": [
            {
                "name": "host_cpu_seconds_total",
                "data_source": "metrics",
                "query": "sum:host_cpu_seconds_total{!mode:idle,$endpoint_id}.as_count()"
            }
            ],
            "response_format": "timeseries",
            "style": {
            "palette": "dog_classic",
            "order_by": "values",
            "line_type": "solid",
            "line_width": "normal"
            },
            "display_type": "line"
        }
        ]
    },
    "layout": {
        "x": 0,
        "y": 0,
        "width": 5,
        "height": 2
    }
    },
    {
    "id": 3831219857468963,
    "definition": {
        "title": "RAM",
        "title_size": "16",
        "title_align": "left",
        "show_legend": true,
        "legend_layout": "auto",
        "legend_columns": [
        "avg",
        "min",
        "max",
        "value",
        "sum"
        ],
        "type": "timeseries",
        "requests": [
        {
            "formulas": [
            {
                "number_format": {
                "unit": {
                    "type": "canonical_unit",
                    "unit_name": "byte"
                }
                },
                "alias": "Cached",
                "formula": "ram_cached"
            },
            {
                "alias": "Used",
                "number_format": {
                "unit": {
                    "type": "canonical_unit",
                    "unit_name": "byte"
                }
                },
                "formula": "ram_total - ram_available"
            }
            ],
            "queries": [
            {
                "name": "ram_cached",
                "data_source": "metrics",
                "query": "avg:host_memory_cached_bytes{$endpoint_id}"
            },
            {
                "name": "ram_total",
                "data_source": "metrics",
                "query": "avg:host_memory_total_bytes{$endpoint_id}"
            },
            {
                "name": "ram_available",
                "data_source": "metrics",
                "query": "avg:host_memory_available_bytes{$endpoint_id}"
            }
            ],
            "response_format": "timeseries",
            "style": {
            "palette": "dog_classic",
            "order_by": "values",
            "line_type": "solid",
            "line_width": "normal"
            },
            "display_type": "line"
        }
        ]
    },
    "layout": {
        "x": 5,
        "y": 0,
        "width": 4,
        "height": 2
    }
    },
    {
    "id": 7513607855022102,
    "definition": {
        "title": "Connections",
        "title_size": "16",
        "title_align": "left",
        "show_legend": true,
        "legend_layout": "auto",
        "legend_columns": [
        "avg",
        "min",
        "max",
        "value",
        "sum"
        ],
        "type": "timeseries",
        "requests": [
        {
            "formulas": [
            {
                "alias": "Total",
                "formula": "connection_counts"
            },
            {
                "alias": "Active",
                "formula": "active_connection_counts"
            },
            {
                "alias": "Idle",
                "formula": "idle_connection_count"
            }
            ],
            "queries": [
            {
                "name": "connection_counts",
                "data_source": "metrics",
                "query": "avg:connection_counts{!datname:postgres,$endpoint_id}"
            },
            {
                "name": "active_connection_counts",
                "data_source": "metrics",
                "query": "avg:connection_counts{!datname:postgres,state:active}"
            },
            {
                "name": "idle_connection_count",
                "data_source": "metrics",
                "query": "avg:connection_counts{!datname:postgres,!state:active,$endpoint_id}"
            }
            ],
            "response_format": "timeseries",
            "style": {
            "palette": "dog_classic",
            "order_by": "values",
            "line_type": "solid",
            "line_width": "normal"
            },
            "display_type": "line"
        }
        ]
    },
    "layout": {
        "x": 0,
        "y": 2,
        "width": 6,
        "height": 2
    }
    },
    {
    "id": 5523349536895199,
    "definition": {
        "title": "Database size",
        "title_size": "16",
        "title_align": "left",
        "show_legend": true,
        "legend_layout": "auto",
        "legend_columns": [
        "avg",
        "min",
        "max",
        "value",
        "sum"
        ],
        "type": "timeseries",
        "requests": [
        {
            "formulas": [
            {
                "number_format": {
                "unit": {
                    "type": "canonical_unit",
                    "unit_name": "byte"
                }
                },
                "formula": "pg_stats_userdb"
            },
            {
                "number_format": {
                "unit": {
                    "type": "canonical_unit",
                    "unit_name": "byte"
                }
                },
                "alias": "Size of all databases",
                "formula": "pg_stats_userdb"
            },
            {
                "alias": "Max size",
                "number_format": {
                "unit": {
                    "type": "canonical_unit",
                    "unit_name": "byte"
                }
                },
                "formula": "db_total_size * 1024 * 1024"
            }
            ],
            "queries": [
            {
                "name": "pg_stats_userdb",
                "data_source": "metrics",
                "query": "sum:pg_stats_userdb{kind:db_size,$endpoint_id} by {datname}"
            },
            {
                "name": "db_total_size",
                "data_source": "metrics",
                "query": "sum:db_total_size{$endpoint_id}"
            },
            {
                "name": "max_cluster_size",
                "data_source": "metrics",
                "query": "avg:max_cluster_size{$endpoint_id}"
            }
            ],
            "response_format": "timeseries",
            "style": {
            "palette": "dog_classic",
            "order_by": "values",
            "line_type": "solid",
            "line_width": "normal"
            },
            "display_type": "line"
        }
        ],
        "yaxis": {
        "include_zero": false,
        "scale": "log"
        }
    },
    "layout": {
        "x": 0,
        "y": 4,
        "width": 5,
        "height": 3
    }
    },
    {
    "id": 5728659221127513,
    "definition": {
        "title": "Changed rows",
        "title_size": "16",
        "title_align": "left",
        "show_legend": true,
        "legend_layout": "auto",
        "legend_columns": [
        "avg",
        "min",
        "max",
        "value",
        "sum"
        ],
        "type": "timeseries",
        "requests": [
        {
            "formulas": [
            {
                "alias": "Rows inserted",
                "formula": "diff(inserted_rows)"
            },
            {
                "alias": "Rows deleted",
                "formula": "diff(deleted_rows)"
            },
            {
                "alias": "Rows updated",
                "formula": "diff(updated_rows)"
            }
            ],
            "queries": [
            {
                "name": "inserted_rows",
                "data_source": "metrics",
                "query": "avg:pg_stats_userdb{kind:inserted,$endpoint_id}"
            },
            {
                "name": "deleted_rows",
                "data_source": "metrics",
                "query": "avg:pg_stats_userdb{kind:deleted,$endpoint_id}"
            },
            {
                "name": "updated_rows",
                "data_source": "metrics",
                "query": "avg:pg_stats_userdb{kind:updated,$endpoint_id}"
            }
            ],
            "response_format": "timeseries",
            "style": {
            "palette": "dog_classic",
            "order_by": "values",
            "line_type": "solid",
            "line_width": "normal"
            },
            "display_type": "line"
        }
        ]
    },
    "layout": {
        "x": 5,
        "y": 4,
        "width": 5,
        "height": 3
    }
    },
    {
    "id": 1608572645458648,
    "definition": {
        "title": "Deadlocks",
        "title_size": "16",
        "title_align": "left",
        "show_legend": true,
        "legend_layout": "auto",
        "legend_columns": [
        "avg",
        "min",
        "max",
        "value",
        "sum"
        ],
        "type": "timeseries",
        "requests": [
        {
            "formulas": [
            {
                "alias": "Deadlocks",
                "formula": "deadlocks"
            }
            ],
            "queries": [
            {
                "name": "deadlocks",
                "data_source": "metrics",
                "query": "avg:pg_stats_userdb{kind:deadlocks,$endpoint_id}"
            }
            ],
            "response_format": "timeseries",
            "style": {
            "palette": "dog_classic",
            "order_by": "values",
            "line_type": "solid",
            "line_width": "normal"
            },
            "display_type": "line"
        }
        ]
    },
    "layout": {
        "x": 0,
        "y": 7,
        "width": 4,
        "height": 2
    }
    }
],
"template_variables": [
    {
    "name": "endpoint_id",
    "prefix": "endpoint_id",
    "available_values": [],
    "default": "*"
    }
],
"layout_type": "ordered",
"notify_list": [],
"reflow_type": "fixed"
}
```
</details>

## Available metrics

Neon makes the following metrics available for export to third parties; for now, availability is limited to the Datadog integration but will soon be expanded to other providers.

All metrics include the following labels:

- `project_id`
- `endpoint_id`
- `compute_id`
- `job`

Here's an example of the metric `db_total_size` with all labels:

```json shouldWrap
db_total_size{project_id="square-daffodil-12345678", endpoint_id="ep-aged-art-260862", compute_id="compute-shrill-blaze-b4hry7fg", job="sql-metrics"} 10485760
```

<Admonition type="note">
In Datadog, metric labels are referred to as `tags.` See [Getting Started with Tags](https://docs.datadoghq.com/getting_started/tagging/) in the Datadog Docs.
</Admonition>

| Name                                     | Job                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| connection_counts                        | sql-metrics          | Total number of database connections. The `state` label indicates whether the connection is `active` (executing queries), `idle` (awaiting queries), or in a variety of other states derived from the [pg_stat_activity](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW) Postgres view.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| db_total_size                            | sql-metrics          | Total size of all databases in your project, measured in bytes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| lfc_approximate_working_set_size_windows | sql-metrics          | Approximate [working set size](/docs/manage/endpoints#sizing-your-compute-based-on-the-working-set) in pages of 8192 bytes. The metric is tracked over time windows (5m, 15m, 1h) to gauge access patterns. Duration values: `duration="5m"`, `duration="15m"`, `duration="1h"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| lfc_cache_size_limit                     | sql-metrics          | The limit on the size of the Local File Cache (LFC), measured in bytes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| lfc_hits                                 | sql-metrics          | The number of times requested data was found in the LFC (cache hit). Higher cache hit rates indicate efficient memory use.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| lfc_misses                               | sql-metrics          | The number of times requested data was not found in the LFC (cache miss), forcing a read from slower storage. High miss rates may indicate insufficient compute size.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| lfc_used                                 | sql-metrics          | The amount of space currently used in the LFC, measured in 1MB chunks. It reflects how much of the cache limit is being utilized.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| lfc_writes                               | sql-metrics          | The number of write operations to the LFC.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| max_cluster_size                         | sql-metrics          | The `neon.max_cluster_size` setting in MB.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| pg_stats_userdb                          | sql-metrics          | Aggregated metrics from the <a href="https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-DATABASE-VIEW">pg_stat_database</a> Postgres view.<br/><br/>We collect stats from the oldest non-system databases based on their creation time, but not for all databases. Only the first X databases (sorted by creation time) are included.<br/><br/><strong>datname</strong>: The name of the database<br/><strong>kind</strong>: The type of value being reported. One of the following:<br/><ul><li><strong>db_size</strong>: The size of the database on disk, in bytes (pg_database_size(datname))</li><li><strong>deadlocks</strong>: The number of deadlocks detected</li><li><strong>inserted</strong>: The number of rows inserted (tup_inserted)</li><li><strong>updated</strong>: The number of rows updated (tup_updated)</li><li><strong>deleted</strong>: The number of rows deleted (tup_deleted)</li></ul> |
| replication_delay_bytes                  | sql-metrics          | The number of bytes between the last received LSN (`Log Sequence Number`) and the last replayed one. Large values indiciate replication lag.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| replication_delay_seconds                | sql-metrics          | Time since the last `LSN` was replayed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| host_cpu_seconds_total                   | compute-host-metrics | The number of CPU seconds accumulated in different operating modes (user, system, idle, etc.).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| host_load1                               | compute-host-metrics | System load averaged over the last 1 minute. Example: for 0.25 vCPU, `host_load1` of `0.25` means full utilization, >0.25 indicates waiting processes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| host_load5                               | compute-host-metrics | System load averaged over the last 5 minutes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| host_load15                              | compute-host-metrics | System load averaged over the last 15 minutes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| host_memory_active_bytes                 | compute-host-metrics | The number of bytes of active main memory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| host_memory_available_bytes              | compute-host-metrics | The number of bytes of main memory available.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| host_memory_buffers_bytes                | compute-host-metrics | The number of bytes of main memory used by buffers.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| host_memory_cached_bytes                 | compute-host-metrics | The number of bytes of main memory used by cached blocks.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| host_memory_free_bytes                   | compute-host-metrics | The number of bytes of main memory not used.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| host_memory_shared_bytes                 | compute-host-metrics | The number of bytes of main memory shared between processes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| host_memory_swap_free_bytes              | compute-host-metrics | The number of free bytes of swap space.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| host_memory_swap_total_bytes             | compute-host-metrics | The total number of bytes of swap space.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| host_memory_swap_used_bytes              | compute-host-metrics | The number of used bytes of swap space.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| host_memory_swapped_in_bytes_total       | compute-host-metrics | The number of bytes that have been swapped into main memory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| host_memory_swapped_out_bytes_total      | compute-host-metrics | The number of bytes that have been swapped out from main memory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| host_memory_total_bytes                  | compute-host-metrics | The total number of bytes of main memory.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| host_memory_used_bytes                   | compute-host-metrics | The number of bytes of main memory used by programs or caches.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

## Feedback and future improvements

We’re always looking to improve! If you have feature requests or feedback, please let us know via the [Feedback form](https://console.neon.tech/app/projects?modal=feedback) in the Neon Console or on our [Discord channel](https://discord.com/channels/1176467419317940276/1176788564890112042).

<NeedHelp/>
