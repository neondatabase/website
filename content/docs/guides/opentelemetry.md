---
title: OpenTelemetry integration
subtitle: Send Neon metrics and Postgres logs to any OTEL-compatible observability
  platform
enableTableOfContents: true
updatedOn: '2025-06-20T18:20:54.650Z'
---

<FeatureBetaProps feature_name="OpenTelemetry integration" />

<InfoBlock>
<DocsList title="What you will learn:">
<p>How to configure OpenTelemetry exports from Neon</p>
<p>Example config using New Relic</p>
</DocsList>

<DocsList title="External docs" theme="docs">
<a href="https://opentelemetry.io/docs/specs/otlp/">OpenTelemetry Protocol (OTLP) Specification</a>
<a href="https://docs.newrelic.com/docs/opentelemetry/best-practices/opentelemetry-otlp/">New Relic OpenTelemetry guide</a>
</DocsList>
</InfoBlock>

Available for Scale and Business Plan users, the Neon OpenTelemetry integration lets you export metrics and Postgres logs to any OpenTelemetry Protocol (OTLP) compatible observability platform. This gives you the flexibility to send your Neon data to your preferred monitoring solution, whether that's New Relic, Grafana Cloud, Honeycomb, or any other OTEL-compatible service.

If you don't already have an OTEL-compatible platform set up, we'll walk you through the basic setup in New Relic so you can see how Neon's data export works. The same configuration principles apply to any OTEL-compatible platform.

## How it works

The integration uses the OpenTelemetry Protocol (OTLP) to securely transmit Neon metrics and Postgres logs to your chosen destination. By configuring the integration with your OTEL endpoint and authentication credentials, Neon automatically sends data from all computes in your project.

<Admonition type="note">
Data is sent for all computes in your Neon project. For example, if you have multiple branches, each with an attached compute, both metrics and logs will be collected and sent for each compute.
</Admonition>

### Neon metrics

The integration exports a comprehensive set of metrics including:

- **Connection counts** &#8212; Tracks active and idle database connections.
- **Database size** &#8212; Monitors total size of all databases in bytes.
- **Replication delay** &#8212; Measures replication lag in bytes and seconds.
- **Compute metrics** &#8212; Includes CPU and memory usage statistics for your compute.

### Postgres logs

<FeatureBetaProps feature_name="Postgres logs export" />

The Neon OpenTelemetry integration can forward Postgres logs to your destination platform. These logs provide visibility into database activity, errors, and performance.

## Prerequisites

Before getting started, ensure the following:

- You have a Neon account and project. If not, see [Sign up for a Neon account](/docs/get-started-with-neon/signing-up).
- You have an OpenTelemetry-compatible observability platform account and know your OTLP endpoint URL and authentication credentials (API key, bearer token, or basic auth).

<Steps>

## Set up your observability platform

If you don't already have an OpenTelemetry-compatible observability platform, you'll need to sign up for one. For this example, we'll use New Relic:

1. Sign up for a free account at [newrelic.com](https://newrelic.com) if you haven't already.
2. Once signed in, you'll need your New Relic license key for authentication.

   If you're onboarding for the first time, copy the license key when it's offered to you (this is your **Original account** key).

   <Admonition type="tip">
   If you get stuck in New Relic's onboarding screens and don't see a way to proceed, try opening the Logs or Data Explorer pages in a new browser tab. This can sometimes let you access the main New Relic UI and continue with your setup.
   </Admonition>

   If you missed copying your license key during onboarding, you can create a new one: choose **Ingest - License** as the type.

   <details>
   <summary>Create New Relic license key</summary>
   1. Click on your user menu in the bottom left corner.
   2. Select **API Keys** from the menu.

      ![New Relic profile menu showing API Keys option](/docs/guides/new_relic_api_keys.png)

   3. Click **Create a key** → choose **Ingest - License**. Copy the key immediately (you can't view it again later).

      ![New Relic API Keys page showing license key types](/docs/guides/new_relic_copy_key.png)

   Your license key will look something like `eu01xxaa1234567890abcdef1234567890NRAL` (the format varies by region).

   </details>

## Open the OpenTelemetry integration

1. In the Neon Console, navigate to the **Integrations** page in your Neon project.
2. Locate the **OpenTelemetry** card and click **Add**.

   ![open telemetry integration card](/docs/guides/open_telemetry_card.png)

   The sidebar form opens for you to enter your platform's details.

   ![OpenTelemetry integration configuration form](/docs/guides/opentelemetry_config_form.png)

## Select data to export

Choose what data you want to export (at the top of the form):

- **Metrics**: System metrics and database statistics (CPU, memory, connections, etc.)
- **Postgres logs**: Error messages, warnings, connection events, and system notifications

You can enable either or both options based on your monitoring needs.

## Configure the connection

1. Select your connection protocol. For most platforms including New Relic, choose **HTTP** (recommended), which uses HTTP/2 for efficient data transmission. Some environments may require **gRPC** instead.

2. Enter your **Endpoint** URL.

   For New Relic, enter:
   - US: `https://otlp.nr-data.net`
   - Europe: `https://otlp.eu01.nr-data.net`

   See [this table](https://docs.newrelic.com/docs/opentelemetry/best-practices/opentelemetry-otlp/#configure-endpoint-port-protocol) for other options.

3. Configure authentication:
   - **Bearer**: Enter your bearer token or API key
   - **Basic**: Provide your username and password credentials
   - **API Key**: Enter your API key

   For New Relic, you can use either **Bearer** or **API Key** authentication with your New Relic license key (both work the same way).

## Configure resource attributes

Neon automatically organizes your data into separate service entities: your configured service name will receive Postgres logs, while metrics are split into `compute-host-metrics` (infrastructure metrics) and `sql-metrics` (database metrics).

1. In the **Resource** section, configure the `service.name` attribute to identify your Neon project in your observability platform. For example, you might use "neon-postgres-test" or your actual project name.

2. Optionally, you can add additional resource attributes by providing a value in the second field to further categorize or filter your data in your observability platform.

## Complete the setup

Click **Add** to save your configuration and start the data export.

## Verify your integration is working

Your Neon data should start appearing in your observability platform within a few minutes.

**For New Relic users**, use these queries to check if data is flowing:

```sql
FROM Metric SELECT * SINCE 1 hour ago
FROM Log SELECT * SINCE 1 hour ago
```

**Success looks like this:**

Metrics flowing into New Relic
![Neon metrics appearing in New Relic](/docs/guides/new_relic_metrics_success.png)

Postgres logs
![Neon PostgreSQL logs appearing in New Relic](/docs/guides/new_relic_logs_success.png)

**Find your data under APM & Services**
![Multiple Neon services in New Relic APM & Services](/docs/guides/new_relic_services.png)

- **Logs**: Check your configured service name in APM & Services (e.g., `neon-postgres-test`)
- **Metrics**: Look for the auto-created `compute-host-metrics` and `sql-metrics` services

</Steps>

<Admonition type="note">
You can modify these settings later by editing your integration configuration from the **Integrations** page.
</Admonition>

<Admonition type="note">
Neon computes only send logs and metrics when they are active. If the [Scale to Zero](/docs/introduction/scale-to-zero) feature is enabled and a compute is suspended due to inactivity, no logs or metrics will be sent during the suspension. This may result in gaps in your data. If you notice missing data, check if your compute is suspended. You can verify a compute's status as `Idle` or `Active` on the **Branches** page in the Neon console, and review **Suspend compute** events on the **System operations** tab of the **Monitoring** page.

Additionally, if you are setting up the OpenTelemetry integration for a project with an inactive compute, you'll need to activate the compute before it can send data. To activate it, simply run a query from the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or any connected client.
</Admonition>

## Troubleshooting

If your data isn't appearing in your observability platform:

1. **Verify your endpoint URL** - Ensure the OTLP endpoint URL is correct for your platform.
2. **Check authentication** - Verify that your API key, bearer token, or credentials are valid and have the necessary permissions.
3. **Confirm compute activity** - Make sure your Neon compute is active and running queries.
4. **Review platform-specific requirements** - Some platforms may have specific configuration requirements for OTLP data ingestion.

## Available metrics

For a complete list of metrics exported by Neon, see the [metrics reference in our Datadog integration guide](/docs/guides/datadog#available-metrics).

<NeedHelp />
