---
title: The Neon Datadog integration
subtitle: Send metrics and logs from Neon Postgres to Datadog
enableTableOfContents: true
updatedOn: '2025-07-16T14:09:44.900Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>How to set up the integration</p>
<p>How to configure log forwarding</p>
<p>The full list of externally-available metrics</p>
</DocsList>

<DocsList title="External docs" theme="docs">
<a href="https://docs.datadoghq.com/account_management/api-app-keys/">Datadog API and Application Keys</a>
<a href="https://docs.datadoghq.com/getting_started/site/#access-the-datadog-site/">Identify Datadog site</a>
</DocsList>
</InfoBlock>

Available for Scale and Business Plan users, the Neon Datadog integration lets you monitor Neon database performance, resource utilization, and system health directly from Datadog's observability platform.

## How it works

The integration enables secure, reliable export of Neon metrics and Postgres logs to Datadog. By configuring the integration with your Datadog API key, Neon automatically sends data from your project to your selected Datadog site.

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

The Neon Datadog integration can forward Postgres logs to your Datadog account. These logs provide visibility into database activity, errors, and performance. See [Export Postgres logs to Datadog](#export-postgres-logs-to-datadog) for details.

## Prerequisites

Before getting started, ensure the following:

- You have a Neon account and project. If not, see [Sign up for a Neon account](/docs/get-started-with-neon/signing-up).
- You have a Datadog account and API key.
- You know the region you selected for your Datadog account. Here's how to check: [Find your Datadog region](https://docs.datadoghq.com/getting_started/site/#access-the-datadog-site)

## Steps to integrate Datadog with Neon

1. In the Neon Console, navigate to the **Integrations** page in your Neon project.
1. Locate the **Datadog** card and click **Add**.
1. Enter your **Datadog API key**. You can generate or retrieve [Datadog API Keys](https://app.datadoghq.com/organization-settings/api-keys) from your Datadog organization. For instructions, see [Datadog API and Application Keys](https://docs.datadoghq.com/account_management/api-app-keys/).
1. Select the Datadog **site** that you used when setting up your Datadog account.
1. Select what you want to export. You can enable either or both:
   - **Metrics**: System metrics and database statistics (CPU, memory, connections, etc.)
   - **Postgres logs**: Error messages, warnings, connection events, and system notifications
1. Click **Confirm** to complete the integration.

<Admonition type="note">
You can change these settings later by editing your integration configuration.
</Admonition>

Optionally, you can import the Neon-provided JSON configuration file into Datadog, which creates a pre-built dashboard from **Neon metrics**, similar to the charts available on our Monitoring page. See [Import Neon dashboard](#import-neon-dashboard).

> We do not yet provide a pre-built dashboard for **Postgres logs**, but it's coming soon.

Once the integration is set up, Neon will start sending Neon metrics to Datadog, and you can use these metrics to create custom dashboards and alerts in Datadog.

<Admonition type="note">
Neon computes only send logs and metrics when they are active. If the [Scale to Zero](/docs/introduction/scale-to-zero) feature is enabled and a compute is suspended due to inactivity, no logs or metrics will be sent during the suspension. This may result in gaps in your Neon logs and metrics in Datadog. If you notice missing data in Datadog, check if your compute is suspended. You can verify a compute's status as `Idle` or `Active` on the **Branches** page in the Neon console, and review **Suspend compute** events on the **System operations** tab of the **Monitoring** page.

Additionally, if you are setting up Neon's Datadog integration for a project with an inactive compute, you'll need to activate the compute before it can send metrics and logs to Datadog. To activate it, simply run a query from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or any connected client on the branch associated with the compute.
</Admonition>

## Example usage in Datadog

Once integrated, you can create custom dashboards in Datadog by querying the metrics sent from Neon. Use Datadog's **Metrics Explorer** to search for metrics like `neon_connection_counts`, `neon_db_total_size`, and `host_cpu_seconds_total`. You can also set alerts based on threshold values for critical metrics.

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
        "time": {},
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
                "formula": "query3"
              },
              {
                "alias": "Used",
                "number_format": {
                  "unit": {
                    "type": "canonical_unit",
                    "unit_name": "byte"
                  }
                },
                "formula": "query1 - query2"
              }
            ],
            "queries": [
              {
                "name": "query3",
                "data_source": "metrics",
                "query": "max:host_memory_cached_bytes{$endpoint_id}"
              },
              {
                "name": "query1",
                "data_source": "metrics",
                "query": "max:host_memory_total_bytes{$endpoint_id}"
              },
              {
                "name": "query2",
                "data_source": "metrics",
                "query": "max:host_memory_available_bytes{$endpoint_id}"
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
        "width": 6,
        "height": 2
      }
    },
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
        "time": {},
        "type": "timeseries",
        "requests": [
          {
            "formulas": [
              {
                "alias": "Used",
                "formula": "per_minute(query1)"
              }
            ],
            "queries": [
              {
                "name": "query1",
                "data_source": "metrics",
                "query": "max:host_cpu_seconds_total{!mode:idle,$endpoint_id}.as_rate()"
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
        "x": 6,
        "y": 0,
        "width": 6,
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
                "formula": "query1"
              },
              {
                "alias": "Active",
                "formula": "query2"
              },
              {
                "alias": "Idle",
                "formula": "query3"
              }
            ],
            "queries": [
              {
                "name": "query1",
                "data_source": "metrics",
                "query": "sum:neon_connection_counts{!datname:postgres,$endpoint_id}"
              },
              {
                "name": "query2",
                "data_source": "metrics",
                "query": "sum:neon_connection_counts{!datname:postgres,state:active ,$endpoint_id}"
              },
              {
                "name": "query3",
                "data_source": "metrics",
                "query": "sum:neon_connection_counts{!datname:postgres,!state:active,$endpoint_id}"
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
        "height": 3
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
                "formula": "query2"
              },
              {
                "number_format": {
                  "unit": {
                    "type": "canonical_unit",
                    "unit_name": "byte"
                  }
                },
                "alias": "Size of all databases",
                "formula": "query3"
              },
              {
                "alias": "Max size",
                "number_format": {
                  "unit": {
                    "type": "canonical_unit",
                    "unit_name": "byte"
                  }
                },
                "formula": "query1 * 1024 * 1024"
              }
            ],
            "queries": [
              {
                "name": "query2",
                "data_source": "metrics",
                "query": "max:neon_pg_stats_userdb{kind:db_size,$endpoint_id} by {datname}"
              },
              {
                "name": "query3",
                "data_source": "metrics",
                "query": "max:neon_db_total_size{$endpoint_id}"
              },
              {
                "name": "query1",
                "data_source": "metrics",
                "query": "max:neon_max_cluster_size{$endpoint_id}"
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
        "x": 6,
        "y": 2,
        "width": 6,
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
                "formula": "query1"
              }
            ],
            "queries": [
              {
                "name": "query1",
                "data_source": "metrics",
                "query": "max:neon_pg_stats_userdb{kind:deadlocks,$endpoint_id} by {datname}"
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
        "y": 5,
        "width": 6,
        "height": 2
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
                "formula": "diff(query1)"
              },
              {
                "alias": "Rows deleted",
                "formula": "diff(query2)"
              },
              {
                "alias": "Rows updated",
                "formula": "diff(query3)"
              }
            ],
            "queries": [
              {
                "name": "query1",
                "data_source": "metrics",
                "query": "max:neon_pg_stats_userdb{kind:inserted,$endpoint_id}"
              },
              {
                "name": "query2",
                "data_source": "metrics",
                "query": "max:neon_pg_stats_userdb{kind:deleted,$endpoint_id}"
              },
              {
                "name": "query3",
                "data_source": "metrics",
                "query": "max:neon_pg_stats_userdb{kind:updated,$endpoint_id}"
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
        "x": 6,
        "y": 5,
        "width": 6,
        "height": 2
      }
    },
    {
      "id": 630770240665422,
      "definition": {
        "title": "Local file cache hit rate",
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
        "time": {},
        "type": "timeseries",
        "requests": [
          {
            "formulas": [
              {
                "alias": "Cache hit rate",
                "formula": "query1 / (query1 + query2)",
                "number_format": {
                  "unit": {
                    "type": "canonical_unit",
                    "unit_name": "fraction"
                  }
                }
              }
            ],
            "queries": [
              {
                "name": "query1",
                "data_source": "metrics",
                "query": "max:neon_lfc_hits{$endpoint_id}"
              },
              {
                "name": "query2",
                "data_source": "metrics",
                "query": "max:neon_lfc_misses{$endpoint_id}"
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
        "width": 6,
        "height": 3
      }
    },
    {
      "id": 2040733022455075,
      "definition": {
        "title": "Working set size",
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
        "time": {},
        "type": "timeseries",
        "requests": [
          {
            "formulas": [
              {
                "alias": "Local file cache size",
                "number_format": {
                  "unit": {
                    "type": "canonical_unit",
                    "unit_name": "byte"
                  }
                },
                "formula": "query2"
              },
              {
                "number_format": {
                  "unit": {
                    "type": "canonical_unit",
                    "unit_name": "byte"
                  }
                },
                "formula": "8192 * query1"
              }
            ],
            "queries": [
              {
                "name": "query2",
                "data_source": "metrics",
                "query": "max:neon_lfc_cache_size_limit{$endpoint_id}"
              },
              {
                "name": "query1",
                "data_source": "metrics",
                "query": "max:neon_lfc_approximate_working_set_size_windows{$endpoint_id} by {duration}"
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
        "x": 6,
        "y": 7,
        "width": 6,
        "height": 3
      }
    }
  ],
  "template_variables": [
    {
      "name": "endpoint_id",
      "prefix": "endpoint_id",
      "available_values": [],
      "default": "*"
    },
    {
      "name": "project_id",
      "prefix": "project_id",
      "available_values": [],
      "default": "*"
    },
    {
      "name": "state",
      "prefix": "state",
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

Neon exports a comprehensive set of metrics including connection counts, database size, replication delay, and compute metrics (CPU and memory usage). For a complete list of all available metrics with detailed descriptions, see the [Metrics and logs reference](/docs/reference/metrics-logs).

## Export Postgres logs to Datadog

You can export your Postgres logs from your Neon compute to your Datadog account. These logs provide visibility into database activity, errors, and performance. For detailed information about log fields and technical considerations, see the [Metrics and logs reference](/docs/reference/metrics-logs).

### Performance impact

Enabling this feature may result in:

- An increase in compute resource usage for log processing
- Additional network egress for log transmission (Neon does not charge for data transfer on paid plans)
- Associated costs based on log volume in Datadog

## Feedback and future improvements

We’re always looking to improve! If you have feature requests or feedback, please let us know via the [Feedback form](https://console.neon.tech/app/projects?modal=feedback) in the Neon Console or on our [Discord channel](https://discord.com/channels/1176467419317940276/1176788564890112042).

<NeedHelp/>
