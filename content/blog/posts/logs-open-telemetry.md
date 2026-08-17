---
title: How We Export Postgres Logs to Third-Party Services
description: We use rsyslogd and OpenTelemetry to push logs to any OTLP-compatible platform
excerpt: >-
  We’ve been supporting metrics export to Datadog for a few months, and we just
  extended this capability to any OLTP-compatible third party – but it has taken
  us much longer to ship any sort of Postgres log export. You might wonder: why
  did it take so long? The question is valid, a...
date: '2025-06-24T16:27:45'
updatedOn: '2025-08-14T09:23:53'
category: product
categories:
  - product
  - postgres
  - company
authors:
  - roman-zaynetdinov
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/logs-open-telemetry/cover.jpg
  alt: null
isFeatured: false
seo:
  title: How We Export Postgres Logs to Third-Party Services - Neon
  description: >-
    You can now export Postgres logs from Neon to any OpenTelemetry-compatible
    observability platform.
  keywords: []
  noindex: false
  ogTitle: How We Export Postgres Logs to Third-Party Services - Neon
  ogDescription: >-
    You can now export Postgres logs from Neon to any OpenTelemetry-compatible
    observability platform.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/logs-open-telemetry/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/logs-open-telemetry/neon-logs-1024x576-af346757.jpg)

<Admonition type="important" title="Logs export is live">
You can now export Postgres logs from Neon to any OTLP-compatible observability platform. [Read the docs](https://neon.com/docs/guides/opentelemetry) and get started.
</Admonition>

[We’ve been supporting metrics export to Datadog](https://neon.com/docs/guides/datadog) for a few months, and [we just extended this capability to any OLTP-compatible third party](https://neon.com/blog/metrics-open-telemetry) – but it has taken us much longer to ship any sort of Postgres log export. You might wonder: _why did it take so long?_<br /><br />The question is valid, and the answer deserves a blog post.

## Rethinking the pipeline

Initially, we thought we could reuse the exact same pipeline we use for metrics: the OpenTelemetry (OTel) Collector discovering Kubernetes pods by labels and scraping their logs. But we quickly discovered that this isn’t currently possible: the OTel Collector doesn’t support scraping logs from Kubernetes pods filtered by labels.

We then faced another challenge: NeonVM runs multiple processes, but we only wanted to export Postgres logs to start with. Since we don’t use structured logging, filtering the logs accurately is difficult and prone to errors.

## Our solution

These factors combined led us to rethink our approach. In the end, we chose a proven solution: using `rsyslogd`. Instead of scraping logs, we decided to push them to the collector.

### Architecture overview

Here’s what our current architecture looks like when exporting Postgres logs to third-party observability platforms:

![Image](https://cdn.neonapi.io/public/images/pages/blog/logs-open-telemetry/710-1024x552-43c383d4.png)

When a customer enables log export, we configure Postgres to send logs to `rsyslogd` in addition to writing them to `stderr`. The `stderr` output is still used internally, while `rsyslogd` is responsible for forwarding logs to the appropriate OpenTelemetry Collector. From there, logs are enriched and sent to the user’s observability platform of choice.

### How logs get forwarded

Once `rsyslogd` is in place, it takes care of forwarding logs to the OTel Collector. Postgres logs are sent using the TCP syslog protocol in a structured format compatible with the collector’s receiver.

Here’s a sample `rsyslogd` configuration used to forward Postgres logs:

```
if $programname == 'postgres' then {{
    action(type="omfwd" target="{hostname}" port="10514" protocol="tcp"
           template="RSYSLOG_SyslogProtocol23Format")
    stop
}}
```

This rule filters only for Postgres logs and pushes them to the designated OTel Collector endpoint over TCP, using the RFC 5424 format.

### Inside the OpenTelemetry collector

The OTel Collector then receives, enriches, and exports the logs. Below is a sample configuration that shows how logs are received from `rsyslogd`, matched to the correct Kubernetes pods, and forwarded to Datadog:

```yaml
receivers:
  syslog:
    protocol: rfc5424
    tcp:
      add_attributes: true
      listen_address: 0.0.0.0:10514

exporters:
  datadog:
    api:
      fail_on_invalid_key: true
      key: ${env:DATADOG_API_KEY}
      site: ${env:DATADOG_SITE}
    host_metadata:
      enabled: false

processors:
  transform/match_pod:
    log_statements:
    - context: log
      statements:
      - set(resource.attributes["k8s.pod.ip"], attributes["net.peer.ip"])
      - delete_matching_keys(attributes, "^net\\..+")

  k8sattributes:
    auth_type: serviceAccount
    filter:
      labels:
      - key: neon/project-id
        op: equals
        value: ${env:NEON_PROJECT_ID}
      namespace: default
    pod_association:
    - sources:
      - from: resource_attribute
        name: k8s.pod.ip
    extract:
      labels:
      - from: pod
        key: neon/project-id
        tag_name: project_id
      metadata:
      - k8s.pod.name

service:
  pipelines:
    logs/datadog:
      receivers: [syslog]
      processors: [memory_limiter, transform/match_pod, k8sattributes]
      exporters: [datadog]
```

This config does several key things:

- Accepts TCP syslog messages from `rsyslogd`
- Uses the `net.peer.ip` to match logs to the correct pod
- Extracts Kubernetes labels to enrich the logs with project-specific metadata
- Forwards the enriched logs to Datadog

## Roadblocks we hit along the way

As always, implementation details introduced some surprises. Here are a few of the challenges we had to work through while building log export.

### Dynamic reconfiguration isn’t always possible

When a user enables or disables log export, we want to update the compute instance on the fly. That works fine for Postgres: its configuration can be reloaded without restarting the process.

But `rsyslogd` doesn’t support dynamic config reloads. To apply changes, we have to restart the `rsyslogd` process itself, which adds a bit of operational friction we had to account for.

### Enriching logs with project metadata

Logs received by the OTel Collector need to be enriched with metadata, specifically, project- and endpoint-specific labels, so they can be routed and visualized correctly in the user’s observability platform.

We use the `k8sattributes` processor to do this. It matches pods based on the **source IP** of the incoming TCP connection from `rsyslogd`. But this didn’t work out of the box: we ran into a [known bug](https://github.com/open-telemetry/opentelemetry-collector-contrib/issues/38678) that prevented correct pod matching via `net.peer.ip. `

To work around this, we added a `transform` processor step to copy the `net.peer.ip` attribute into the expected `k8s.pod.ip` format and clean up other network attributes.

### HIPAA logging requirements

One side benefit of introducing `rsyslogd` was improved support for compliance use cases. For HIPAA customers, we need to persist Postgres logs in secure storage. Conveniently, we can reuse the same `rsyslogd` instance. It already reads from `pg_audit` and now also forwards those logs to secure, long-term storage in addition to exporting them externally.

## Conclusion

Previously, if you needed access to Postgres logs, you had to contact our support team and wait for a sample, which was not the best experience. Now, you can export logs alongside metrics directly to your observability platform, whether it’s Datadog or any OpenTelemetry-compatible service like New Relic. This gives you complete visibility into what’s happening inside your Postgres instance, from performance metrics to detailed logs, all in one place.

With logs readily available in your observability stack, you can troubleshoot faster, monitor behavior more effectively, and eliminate the need to go through support to access critical log data.

![Image](https://cdn.neonapi.io/public/images/pages/blog/logs-open-telemetry/ad4nxcbuiujmt5jqh-ev4mgpciaacxwotv5hfkw0q6puldkwppp8wqqovaqccv-lhwxlcjmtlqfcuav5dsy4ahsfjjhzty3dq4zvhuikp5vpp-ms9dnf-ejngbw9koh4z99ana1rvq-abccbe3a.png)
