---
title: How to send Postgres logs and metrics from Neon to SigNoz
subtitle: Using the OpenTelemetry (OTEL) integration in Neon
author: nagesh-bansal
enableTableOfContents: true
createdAt: '2026-06-12T00:00:00.000Z'
updatedOn: '2026-06-22T12:42:26.466Z'
---

[SigNoz](https://signoz.io/) is an open source observability platform built on OpenTelemetry that brings logs, metrics, and traces together in one application. [Neon's OpenTelemetry integration](/docs/guides/opentelemetry) sends your project's metrics and Postgres logs to SigNoz, so you can monitor your database alongside the rest of your stack.

This guide walks you through setting up the integration. You'll learn how to:

- Find the ingestion key and OTLP endpoint for your SigNoz Cloud account.
- Set up the OpenTelemetry integration in your Neon project.
- Verify that your Neon metrics and logs are flowing into SigNoz.
- Build a dashboard in SigNoz to visualize your Neon metrics.

By the end, you'll have Neon metrics and logs flowing into a SigNoz dashboard.

## Prerequisites

Before you begin, ensure you have the following:

- **Neon account and project:** If you don't have one, sign up at [Neon](https://console.neon.tech/signup). Your Neon project must be on the **Scale** or **Business** plan to use the OpenTelemetry integration.
- **SigNoz account:** A [SigNoz Cloud](https://signoz.io/teams/) account. A free trial is sufficient to start. This guide uses SigNoz Cloud; if you run a [self-hosted](https://signoz.io/docs/install/) SigNoz instance, the steps are the same except that you point Neon at your own collector endpoint.

<Steps>

## Get your SigNoz ingestion key and endpoint

You need credentials that authorize Neon to send OpenTelemetry data to your SigNoz Cloud instance.

1.  Log in to your [SigNoz Cloud](https://signoz.io/teams/) account.
2.  Navigate to **Settings** > **Ingestion Settings**.
3.  Copy your **Ingestion Key**. Neon sends this value with every request to authenticate your data.
4.  Note your **region**. SigNoz Cloud is available in multiple regions, and your OTLP endpoint depends on it:

    | Region | Endpoint                         |
    | ------ | -------------------------------- |
    | US     | `https://ingest.us.signoz.cloud` |
    | EU     | `https://ingest.eu.signoz.cloud` |
    | India  | `https://ingest.in.signoz.cloud` |

    Your region and endpoint are shown on the **Ingestion Settings** page. For more details, see the [SigNoz ingestion overview](https://signoz.io/docs/ingestion/signoz-cloud/overview/).

    > Keep the **Ingestion Key** and the **OTLP endpoint URL** for your region handy. You will need them in the next step to configure Neon.

## Configure the Neon OpenTelemetry integration

Use the credentials from SigNoz to configure the integration in your Neon project.

1.  Navigate to the [Neon Console](https://console.neon.tech) and select your project.
2.  From the sidebar, go to the **Integrations** page.
3.  Find the **OpenTelemetry** card and click **Add**.

    ![Neon Integrations page with OpenTelemetry card](/docs/guides/neon-add-otel.png)

4.  A sidebar form opens. Choose the telemetry you want to export. Check both **Metrics** and **Postgres logs** to send all available data.

    ![Selecting metrics and Postgres logs to export from Neon](/docs/guides/signoz-neon-export-type.webp)

5.  Next, fill in the destination details using the credentials you gathered from SigNoz:
    - **Connection:** Select **HTTP**.
    - **Endpoint:** Paste the OTLP endpoint URL for your SigNoz region, for example `https://ingest.us.signoz.cloud`.
      <Admonition type="important">
      Enter only the base endpoint URL. Neon automatically appends the signal-specific paths (`/v1/metrics` and `/v1/logs`), so do not add them yourself or you will get `404` errors.
      </Admonition>
    - **Authentication:** Select **API Key**.
    - **Header name:** Enter `signoz-ingestion-key`.
    - **API Key:** Paste the **Ingestion Key** you copied from SigNoz.
    - **Resource attributes:** Add a `service.name` attribute to identify your data source in SigNoz. For example, set the key to `service.name` and the value to `neon`.
    - Click **Save**.

    <Admonition type="note" title="Data scope">
    The Neon OpenTelemetry integration sends data for all computes in your Neon project. For example, if you have multiple branches, each with an attached compute, metrics and logs will be collected and sent for each one.
    </Admonition>

    ![Configuring the Neon OpenTelemetry integration with SigNoz credentials](/docs/guides/signoz-neon-otel-config.webp)

6.  Once saved, the OpenTelemetry integration appears as active on your project's **Integrations** page.

    ![Neon Integrations page showing the active OpenTelemetry integration](/docs/guides/signoz-neon-integration-added.webp)

    > The integration is now active and will begin sending data from your Neon project's computes to SigNoz.

## Verify the data flow in SigNoz

To confirm that your integration is working, check that both logs and metrics are arriving in SigNoz.

1.  Go to your SigNoz instance and open the **Logs** > **Logs Explorer**.
2.  Filter by the resource attribute you set earlier, for example `service.name = neon`.

    You should see Postgres logs from your Neon compute streaming into SigNoz. This confirms that the integration is working correctly.

    ![Neon Postgres logs in the SigNoz Logs Explorer](/docs/guides/signoz-neon-logs.webp)

    <Admonition type="note">
    It may take a few minutes for the first logs and metrics to appear after you enable the integration.
    </Admonition>

3.  To confirm metrics are arriving, open **Metrics** > **Metrics Explorer** and search for metrics prefixed with `neon_`, such as `neon_connection_counts`.

    ![Neon metrics in the SigNoz Metrics Explorer](/docs/guides/signoz-neon-metrics.webp)

    <Admonition type="info" title="Compute activity">
    Neon computes only send logs and metrics when they are active. If you have the [Scale to Zero](/docs/manage/endpoints#scale-to-zero) feature enabled and a compute is suspended due to inactivity, no telemetry data will be sent. If you notice gaps in your data, check your compute's status on the **Branches** page in the Neon console.
    </Admonition>

## Visualize Neon metrics with dashboards

The Metrics Explorer works for ad-hoc queries. To track trends over time and see an overview of your database's health, build a SigNoz **dashboard**.

### Create a custom Neon dashboard

1.  From the left navigation menu in SigNoz, select **Dashboards**.
2.  Click **New Dashboard** > **Create dashboard**.
3.  Give your dashboard a descriptive name, such as `Neon Project Metrics`.

### Create your first panel

1.  On your new dashboard, click **New Panel** and choose the **Time Series** panel type.
2.  In the **Query Builder**, set the metric to `neon_connection_counts` to visualize the number of active and idle connections to your database over time.
3.  Adjust the aggregation and grouping as needed, then save the panel to your dashboard.

### Explore available Neon metrics

Neon exports a range of metrics for your dashboards, including Neon-specific metrics and compute host metrics. For example:

- `neon_connection_counts`: Monitor the number of active and idle database connections.
- `neon_db_total_size`: Track the total size of all databases in your project, in bytes.
- `host_cpu_seconds_total`: Track the CPU seconds accumulated in different operating modes (user, system, idle, etc.).
- `host_memory_active_bytes`: Monitor active memory usage on the compute.

For a comprehensive list of all metrics you can use in your dashboards, see the [Neon Metrics and Logs Reference](/docs/reference/metrics-logs).

</Steps>

With Neon's database metrics and logs flowing into SigNoz alongside your application telemetry, you can correlate database behavior with the rest of your stack. For instance, you can line up a spike in `neon_connection_counts` against error logs from a specific service to quickly identify which application is putting pressure on your database.

## Summary

You've configured Neon to send metrics and Postgres logs to SigNoz using the OpenTelemetry integration. Your database's metrics and logs now arrive in SigNoz alongside the rest of your application telemetry.

From here, you can build dashboards, set up alerts, and correlate database behavior with the rest of your stack.

## Resources

- [Neon OpenTelemetry Integration](/docs/guides/opentelemetry)
- [Neon Metrics and logs reference](/docs/reference/metrics-logs)
- [SigNoz Neon Postgres integration guide](https://signoz.io/docs/integrations/opentelemetry-neondb/)
- [SigNoz Cloud ingestion overview](https://signoz.io/docs/ingestion/signoz-cloud/overview/)
- [OpenTelemetry Protocol (OTLP) Specification](https://opentelemetry.io/docs/specs/otlp/)

<NeedHelp/>
