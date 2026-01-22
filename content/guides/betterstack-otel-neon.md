---
title: Getting started with Neon and Better Stack
subtitle: Send Neon metrics and Postgres logs to Better Stack using the OpenTelemetry integration
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-08-13T00:00:00.000Z'
updatedOn: '2025-08-13T00:00:00.000Z'
---

[Better Stack](https://betterstack.com/) is an observability platform that unifies logging, monitoring, and alerting into a single dashboard. [Neon's OpenTelemetry (OTEL) integration](/docs/guides/opentelemetry) allows you to send your project's metrics and Postgres logs directly to Better Stack, giving you a centralized view of your database's performance and activity.

This guide will walk you through setting up the integration between Neon and Better Stack. You'll learn how to:

- Create and configure an OpenTelemetry source in Better Stack.
- Set up the OpenTelemetry integration in your Neon project.
- Verify that your Neon metrics and logs are successfully flowing into Better Stack.
- Build an example dashboard in Better Stack to visualize your Neon metrics.

By the end, you'll have a complete observability pipeline from your Neon database to your Better Stack dashboard.

## Prerequisites

Before you begin, ensure you have the following:

- **Neon account and project:** If you don't have one, sign up at [Neon](https://console.neon.tech/signup). Your Neon project must be on the **Scale** or **Business** plan to use the OpenTelemetry integration.
- **Better Stack account:** A free Better Stack account. You can sign up at [Better Stack](https://betterstack.com/users/sign-up).

<Steps>

## Set up a Better Stack source

First, you need to create a data source in Better Stack that will receive logs and metrics from Neon.

1.  Log in to your [Better Stack account](https://telemetry.betterstack.com/).
2.  In the left-hand navigation, go to **Telemetry** > **Sources**. Click the **Connect source** button.

    ![Better Stack sources page](/docs/guides/betterstack-sources-page.png)

3.  On the **Connect source** page:
    - Under **Basic information**, provide a **Name** for your source (e.g., `neon`) and select your preferred **Data region**.
    - Under **Platform**, scroll down to the **Logs + Metrics** section and select **OpenTelemetry**.
    - Click **Create source** at the bottom of the page.

    ![Configuring the OpenTelemetry source in Better Stack](/docs/guides/betterstack-otel-config.png)

4.  After the source is created, you will be redirected to the source's overview page. This page contains the credentials Neon needs to send data.

    ![Better Stack source created page with Source token and Ingesting host](/docs/guides/betterstack-otel-source-created.png)

    > Copy the **Source token** and **Ingesting host** URL. You will need these in the next step to configure Neon.

## Configure the Neon OpenTelemetry integration

Now, you will use the credentials from Better Stack to configure the integration in your Neon project.

1.  Navigate to the [Neon Console](https://console.neon.tech) and select your project.
2.  From the sidebar, go to the **Integrations** page.
3.  Find the **OpenTelemetry** card and click **Add**.

    ![Neon Integrations page with OpenTelemetry card](/docs/guides/neon-add-otel.png)

4.  A sidebar form will open. Fill in the configuration details using the information you copied from Better Stack:
    - **Telemetry to export:** Check both **Metrics** and **Postgres logs** to send all available data.
    - **Connection:** Select **HTTP**.
    - **Endpoint:** Paste the **Ingesting host** URL from Better Stack. It should look like `https://xxxx.betterstackdata.com`.
      <Admonition type="important">
      Better Stack provides the Ingesting host without the `https://` prefix, so make sure to manually add `https://` at the beginning of the URL when configuring the endpoint.
      </Admonition>
    - **Authentication:** Select **Bearer**.
    - **Bearer Token:** Paste the **Source token** you copied from Better Stack.
    - **Resource attributes:** It's good practice to add a `service.name` attribute to identify your data source within Better Stack. For example, set the key to `service.name` and the value to `neon`.
    - Click **Save**.

    <Admonition type="note" title="Data Scope">
    The Neon OpenTelemetry integration sends data for all computes in your Neon project. For example, if you have multiple branches, each with an attached compute, metrics and logs will be collected and sent for each one.
    </Admonition>

    ![Configuring the Neon OpenTelemetry integration with Better Stack credentials](/docs/guides/neon-otel-config.png)

    > The integration is now active and will begin sending data from your Neon project's computes to Better Stack.

## Verify the data flow in Better Stack

To confirm that your integration is working:

1. Go back to your Better Stack dashboard.
2. Select the source you created for Neon (e.g., `neon`).
3. Click **Logs** to open the **Live tail** view and monitor incoming logs in real time.

You should see data from your Neon project appearing here, indicating a successful connection.

<Admonition type="note">
It may take a few minutes for the first logs to appear after you enable the integration.
</Admonition>

You should see Postgres logs from your Neon compute streaming into the Live tail view. This confirms that the integration is working correctly.

![Live tail view in Better Stack showing logs from Neon](/docs/guides/betterstack-live-tail.png)

<Admonition type="info" title="Compute Activity">
Neon computes only send logs and metrics when they are active. If you have the [Scale to Zero](/docs/manage/endpoints#scale-to-zero) feature enabled and a compute is suspended due to inactivity, no telemetry data will be sent. If you notice gaps in your data, check your compute's status on the **Branches** page in the Neon console.
</Admonition>

## Visualizing Neon Metrics with Dashboards

While the **Live tail** view is perfect for real-time log inspection, Better Stack's **Dashboards** are the best way to visualize your Neon metrics, track trends over time, and get a high-level overview of your database's health.

### Clean up default dashboards

When you first navigate to the **Dashboards** page in Better Stack, you may see two pre-created dashboards: `OpenTelemetry collector` and `OpenTelemetry Tracing`.

![Better Stack dashboards page showing default dashboards.](/docs/guides/betterstack-default-dashboards.png)

These default dashboards are designed for a generic OpenTelemetry collector setup and are **not compatible** with the metrics sent by Neon. They will appear empty or show errors because they are looking for metrics that don't exist in Neon's data stream.

### Delete default dashboards

To avoid confusion, it is strongly recommended to delete these two default dashboards. Click on each dashboard, find the three-dot menu (...) in the top-right corner, and select **Remove**.

### Create a custom Neon dashboard

Create a new dashboard from scratch to visualize your Neon metrics.

1.  From the **Dashboards** page, click the **Create dashboard** button.
2.  Select **Blank dashboard** and click **Add dashboard**.
3.  Give your new dashboard a descriptive name, such as `Neon Project Metrics`, and click **Save**.

### Create your first chart

Add a chart to visualize a specific metric.

1.  On your blank dashboard, click the **+ Create chart** button.
2.  The first step is to connect the chart to your data. At the top, click the **source** button and choose your `neon` source.
3.  The chart builder will appear. Use the **Drag & drop** query builder:
    - The **X-axis** is already set to `time`, which is what you'll want for time-series data.
    - Delete the default Y-axis metric.
    - In the **Y-axis**, select the metric you want to visualize. From the list of available metrics, drag a metric like `neon_connection_counts` into the Y-axis box.
      ![Neon connection counts chart creation](/docs/guides/betterstack-neon-connection-counts-creation.png)
    - Click **Run query** to see the chart populated with data.
4.  You can customize the chart's appearance using the panel on the right. Once you're happy, click **Save** in the top-right corner to add the chart to your dashboard.

To view the metric on your dashboard, simply locate the chart you created and observe the visualized data in real time.

![Neon connection counts chart](/docs/guides/betterstack-neon-connection-counts.png)

### Explore available Neon metrics

Neon exports a rich set of metrics that you can use to build your dashboards. These include both Neon-specific metrics and general compute host metrics.

For example, you can build charts to visualize:

- `neon_connection_counts`: To monitor the number of active and idle database connections.
- `neon_db_total_size`: To monitor the total size of all databases in your project, in bytes.
- `host_cpu_seconds_total`: To track the number of CPU seconds accumulated in different operating modes (user, system, idle, etc.)

For a comprehensive list of all metrics you can use in your dashboards, see the [Neon Metrics and Logs Reference](/docs/reference/metrics-logs).

</Steps>

## Summary

Congratulations! You have successfully configured Neon to send metrics and Postgres logs to Better Stack using the OpenTelemetry integration. You now have a powerful, centralized observability setup that provides real-time insights into your database's health and activity.

By leveraging this integration, you can build dashboards, set up alerts, and troubleshoot issues more effectively, all from within the Better Stack platform.

## Resources

- [Neon OpenTelemetry Integration](/docs/guides/opentelemetry)
- [Neon Metrics and logs reference](/docs/reference/metrics-logs)
- [Better Stack Logs Documentation](https://betterstack.com/docs/logs/start/)
- [OpenTelemetry Protocol (OTLP) Specification](https://opentelemetry.io/docs/specs/otlp/)

<NeedHelp/>
