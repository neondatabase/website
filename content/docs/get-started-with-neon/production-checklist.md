---
title: Getting ready for production
subtitle: A checklist of recommended settings to optimize performance, security, and reliability
enableTableOfContents: true
updatedOn: '2025-02-03T20:41:57.304Z'
---

<div className="checklist doc-cta prose-doc rounded-[10px] my-5 flex flex-col gap-x-16 px-7 py-6 border border-gray-new-90 bg-[linear-gradient(to_right,#FAFAFA_0%,rgba(250,250,250,0)100%)] dark:border-gray-new-20 dark:bg-[linear-gradient(to_right,#18191B_28.86%,#131415_74.18%)]">
## Production checklist
<div className="checklist">
  <div>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <input type="checkbox" style={{ marginRight: '10px' }} />
      <h3 style={{ margin: 0 , fontSize: '115%' }}><a href="#set-minimum-compute-to-at-least-1-cu">Set minimum compute to at least 1 vCPU</a></h3>
    </div>
    <p style={{ marginLeft: '23px' }}>Make sure your default branch can handle production traffic. A higher minimum compute helps you avoid performance bottlenecks.</p>
    
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <input type="checkbox" style={{ marginRight: '10px' }} />
      <h3 style={{ margin: 0 , fontSize: '115%' }}><a href="#set-max-compute-to-the-highest-cu-available-for-your-plan">Set max compute to the highest CU available for your plan</a></h3>
    </div>
    <p style={{ marginLeft: '23px' }}>Set your compute to automatically scale up, allowing your app to handle traffic surges and stay performant without manual scaling.</p>
    
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <input type="checkbox" style={{ marginRight: '10px' }} />
      <h3 style={{ margin: 0 , fontSize: '115%' }}><a href="#disable-scale-to-zero">Disable scale to zero</a></h3>
    </div>
    <p style={{ marginLeft: '23px' }}>Prevent cold-start delays by keeping your default branch running at all times.</p>
    
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <input type="checkbox" style={{ marginRight: '10px' }} />
      <h3 style={{ margin: 0 , fontSize: '115%' }}><a href="#use-a-pooled-connection">Use a pooled connection</a></h3>
    </div>
    <p style={{ marginLeft: '22px' }}>Increase your database's ability to handle concurrent connections by using connection pooling.</p>
    
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <input type="checkbox" style={{ marginRight: '10px' }} />
      <h3 style={{ margin: 0 , fontSize: '115%' }}><a href="#increase-your-projects-restore-window-to-7-days">Increase your project's restore window to 7 days</a></h3>
    </div>
    <p style={{ marginLeft: '23px' }}>Protect your data with a longer restore window for quick recovery, ensuring data integrity and availability.</p>
    
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <input type="checkbox" style={{ marginRight: '10px' }} />
      <h3 style={{ margin: 0 , fontSize: '115%' }}><a href="#restrict-database-access-to-trusted-ips">Restrict database access to trusted IPs</a></h3>
    </div>
    <p style={{ marginLeft: '23px' }}>Secure your database by limiting connections to trusted IP addresses, enhancing security and control.</p>
    
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <input type="checkbox" style={{ marginRight: '10px' }} />
      <h3 style={{ margin: 0 , fontSize: '115%' }}><a href="#install-the-neon-app-for-slack">Install the Neon app for Slack</a></h3>
    </div>
    <p style={{ marginLeft: '23px' }}>Receive instant alerts about your production database directly in Slack, ensuring timely responses to issues.</p>
    
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <input type="checkbox" style={{ marginRight: '10px' }} />
      <h3 style={{ margin: 0 , fontSize: '115%' }}><a href="#install-pgstatstatements">Install pg_stat_statements</a></h3>
    </div>
    <p style={{ marginLeft: '23px' }}>Enable query performance monitoring to track execution times and frequency.</p>
    
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <input type="checkbox" style={{ marginRight: '10px' }} />
      <h3 style={{ margin: 0 , fontSize: '115%' }}><a href="#upgrade-to-a-neon-business-plan-for-priority-support">Upgrade to get priority support</a></h3>
    </div>
    <p style={{ marginLeft: '23px' }}>Get faster support and priority handling for your production database with a Business plan.</p>
  </div>
</div>
</div>

<Steps>

## Set minimum compute to at least 1 CU

Before your application goes to prodution, make sure your database has enough vCPU and memory to handle expected production load. See [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute).

**Recommendation**

We recommend that you **fit your data in memory** and use Neon **autoscaling**:

- Start with a compute size that can hold all your data in memory. Or try to fit at least your most frequently accessed data (your [working set](/docs/reference/glossary#working-set)).
- Once you determine the [right size](/docs/manage/endpoints#how-to-size-your-compute) for your compute, use that as the **minimum compute size** for [Autoscaling](#set-maximum-compute-to-highest-cu)).

**About compute size**

A Compute Unit (CU) in Neon measures the processing power or "size" of a Neon compute. One CU includes 1 vCPU and 4 GB of RAM. Neon computes can range from **0.25** CUs to **56** CUs, depending on your [Neon plan](/docs/introduction/plans).

## Set max compute to the highest CU available for your plan

Use Neon's [autoscaling](/docs/guides/autoscaling-algorithm) feature to dynamically adjust your compute resources based on your current workload. This means you don't need to scale manually during traffic surges.

**Recommendation**

- **Minimum compute size**: Autoscaling works best if your data can be fully cached in memory.
- **Maximum compute size**: Set this to as a high a limit as your plan allows. You only pay for what you use.

![Autoscaling control](/docs/get-started-with-neon/autoscaling_control.png)

To get started with Autoscaling, read:

- [Enable Autoscaling in Neon](/docs/guides/autoscaling-guide)
- [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute), including the [Autoscaling considerations](/docs/manage/endpoints#autoscaling-considerations) section.

## Disable scale to zero

Scale to zero turns off your compute after a period of inactivity. Ideal for development or other environments with sporadic usage.

**Recommendation**

Disable scale to zero for production workloads. This ensures your compute is always active, preventing delays and session context resets caused by cold starts.

**Session and latency considerations**

By default, your compute scales to zero after 5 minutes. Restarts are nearly instant, but there may still be some latency (around 500 milliseconds depending on the region). Restarts will reset your session context, affecting in-memory statistics and temporary tables. While typical production loads might never go idle long enough to scale to zero, disabling this feature prevents any possible issues from cold starts or session loss.

Disabling scale to zero is available on paid plans only. See [Configuring Scale to Zero for Neon computes](/docs/guides/scale-to-zero-guide) for more detail.

## Use a pooled connection

Connection pooling with [PgBouncer](https://www.pgbouncer.org/) allows your database to handle up to 10,000 concurrent connections, optimizing resource usage.

**Recommendation**

 For production environments, enable connection pooling. This increases the number of simultaneous connections your database can handle and optimizes resource usage.

**Connection details**

 Use a pooled connection string by adding `-pooler` to your endpoint ID, or simply copy the pooled connection string from your Neon Project Dashboard. This string allows your database to efficiently manage multiple connections. For more information, see [Connection pooling](/docs/connect/connection-pooling).

Example connection string:
```bash
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
```

## Increase your project's restore window to 7 days

Neon retains a history of changes for all branches, enabling instant restore and time travel queries. This history acts as a backup strategy, allowing recovery of lost data and viewing past database states.

**Recommendation**

Set your restore window to 7 days to ensure data integrity and quick recovery.

**Restore window details**

By default, Neon's restore window is set to **1 day**. Extending it to 7 days helps protect you against data loss, letting you recover from human or application errors that may go unnoticed for days. It can also help with compliance with industry regulations that need longer retention periods. While upping your restore window does lead to increased storage costs, the added security and recoverability are useful for data integrity in production.

![Restore window setting](/docs/get-started-with-neon/history_retention_setting.png)

For more info, see [Instant restore](/docs/introduction/branch-restore).

## Restrict database access to trusted IPs

Neon's IP Allow feature ensures that only trusted IP addresses can connect to your database, preventing unauthorized access and enhancing security.

**Recommendation**

Combine an IP allow list with protected branches for enhanced security. This setup ensures that only trusted IPs can access critical data, reducing the risk of unauthorized access and safeguarding data integrity.

**Configuration details**

- **IP Allow List**: Restricts access to specific, trusted IP addresses, preventing unauthorized connections.
- **Protected Branch**: Safeguards critical data from accidental deletions or modifications by designating branches as protected.

Available with the Neon [Scale](/docs/introduction/plans#scale) and [Business](/docs/introduction/plans#business) plans, you can configure **IP Allow** and protected branches in your Neon project's settings. For more information, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow) and [Protected branches guide](/docs/guides/protected-branches).

![IP allow setting settings](/docs/get-started-with-neon/ip_allow_settings.png)

## Install the Neon app for Slack

Receive instant alerts about your production database directly in Slack, ensuring timely responses to issues.

**Recommendation**

Install the Neon app for Slack to monitor your Neon projects and receive critical alerts in your team channel. This integration helps you stay informed about your database's performance and resource usage.

**Key features for production**

- **Real-time alerts**: Immediate notifications about performance issues.
- **Team collaboration**: Use `/neon subscribe` to add alerts to your team's channel, keeping everyone informed.

For more information, see the [Neon App for Slack documentation](/docs/manage/slack-app).

## Install pg_stat_statements

Enable query performance monitoring to track execution times and frequency.

**Recommendation**

Install the `pg_stat_statements` extension to monitor query performance and identify potential bottlenecks.

**Usage**

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

The statistics gathered by this extension require little overhead and let you quickly access metrics like:

- [Most frequently executed queries](/docs/postgresql/query-performance#most-frequently-executed-queries)
- [Longest running queries](/docs/postgresql/query-performance#long-running-queries)
- [Queries that return the most rows](/docs/postgresql/query-performance#queries-that-return-the-most-rows)

You can also use the **Monitoring Dashboard** in the Neon Console to view live graphs for system and database metrics like CPU, RAM, and connections.

![Monitoring page connections graph](/docs/introduction/monitor_connections.png)

For more information, see the [Monitoring documentation](/docs/introduction/monitoring).

## Upgrade to a Neon Business plan for priority support

Support tickets opened by Business and Enterprise support plan customers are given top priority by the Neon Support team.

**Recommendation**

Upgrade to a [Business plan](/docs/introduction/plans#business) to get both [Priority support](/docs/introduction/support#prioritized-support-tickets) and acccess to the [Business SLA](https://neon.tech/neon-business-sla).

For more information, see the [Support documentation](/docs/introduction/support).

</Steps>

<NeedHelp/>
