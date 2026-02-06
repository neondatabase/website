---
title: Embedded Postgres
subtitle: 'Offer instant, managed Postgres databases to your users with Neon'
summary: >-
  Covers the setup of embedding Neon's managed Postgres databases into
  platforms, enabling instant provisioning, autoscaling, and user-specific
  isolation without requiring user sign-up or setup.
enableTableOfContents: true
isDraft: false
updatedOn: '2026-02-06T22:07:32.959Z'
---

Neon makes it easy to embed Postgres into your platform with one-second provisioning, autoscaling, and scale-to-zero, so each user gets an isolated database without the overhead. Databases are provisioned via API and fully integrated into your product, with no Neon signup or setup required by your users.

<CTA title="Learn how platforms embed Neon" description="Learn how <a href='https://neon.com/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases'>Retool manages 300k+ Postgres databases</a> and <a href='https://www.koyeb.com/blog/serverless-postgres-public-preview'>Koyeb offers serverless Postgres</a> using Neon." isIntro></CTA>

## Why embed Neon?

Neon is uniquely built to scale Postgres fleets efficiently:

- **Instant provisioning** — Create a new Postgres database in under 1 second via API
- **Scale to zero** — Inactive databases scale to zero to save on compute cost
- **True isolation** — Each user gets their own dedicated Neon project with complete data separation
- **Autoscaling** — Databases scale compute resources automatically based on demand
- **Set quotas** — Set consumption limits per project to manage usage and costs
- **Track usage** — Track compute time, storage, and other metrics per project

## The project-per-user model

When integrating Neon into your platform, we strongly recommend a **project-per-user model** rather than branch-per-user or database-per-user models.

### What is a project?

In Neon, resources such as branches, databases, roles, and computes are organized within a Neon [project](/docs/manage/overview). When a user signs up with Neon directly, they start by creating a project, which includes a default branch, database, role, and compute instance. We recommend the same approach for your integration.

### Why project-per-user?

- **Data isolation** — Each user's data is completely separate, ensuring the highest level of security and privacy. This also helps with compliance standards like GDPR.

- **Resource isolation** — One user's usage patterns or actions don't impact others. Each user has dedicated compute resources.

- **Easier limits and billing** — Neon's APIs for setting consumption limits and tracking usage work at the project level, making it straightforward to implement usage-based billing.

- **Regional compliance** — Each project can be deployed in a specific region, making it easy to host customer data closer to their location or meet data residency requirements.

- **Independent recovery** — Operations like instant [point-in-time restore](/docs/guides/branch-restore) work at the branch level. In a project-per-user model, you can restore individual customer databases without impacting others.

- **Simpler to manage** — Following Neon's established project-based structure is easier than working against it. The Neon API is designed around this model.

<Admonition type="note">
The project-per-user model implements a database-per-tenant architecture. For a deeper dive into this approach and how Neon compares to traditional solutions like RDS, read [Data Isolation at Scale](https://neon.com/use-cases/database-per-tenant).
</Admonition>

## Getting started

<Steps>

## Set up API access

To interact with the Neon platform, you'll need an API key:

1. Generate a Neon API key from your Neon account settings. See [Creating API keys](/docs/manage/api-keys#creating-api-keys).
2. Store the key securely in your environment variables.
3. Use the API key to authenticate requests to the Neon API.

For detailed API documentation, refer to the [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api), which includes links to [Neon API examples](https://api-docs.neon.tech/reference/getting-started-with-neon-api#neon-api-examples).

Alternatively, use our official SDKs for easier integration:

- [TypeScript SDK](/docs/reference/typescript-sdk)
- [Python SDK](/docs/reference/python-sdk)
- [@neondatabase/toolkit](/docs/reference/neondatabase-toolkit) (supports the Neon API for platform operations and the [Neon serverless driver](/docs/serverless/serverless-driver) for connecting and running SQL queries)

## Create projects for your users

Use the [Create project API](https://api-docs.neon.tech/reference/createproject) to provision a new Postgres database for each user:

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
  "project": {
    "name": "user-database-123",
    "pg_version": 16,
    "region_id": "aws-us-east-1"
  }
}' | jq
```

The response includes connection details you can provide to your user. Projects are created in under 1 second.

<Admonition type="tip" title="Custom names">
You can customize the default database and role names when creating a project. See the [Create project API docs](https://api-docs.neon.tech/reference/createproject) for details.
</Admonition>

## Set compute and scaling behavior

Configure how computes scale and when they suspend due to inactivity:

- `autoscaling_limit_min_cu` — Minimum compute size (default: 0.25 CU)
- `autoscaling_limit_max_cu` — Maximum compute size for autoscaling
- `suspend_timeout_seconds` — Inactivity period before compute suspends

Example setting a compute to scale between 1 and 4 CU with a 10-minute suspend timeout:

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
  "project": {
    "default_endpoint_settings": {
      "autoscaling_limit_min_cu": 1,
      "autoscaling_limit_max_cu": 4,
      "suspend_timeout_seconds": 600
    },
    "pg_version": 16
  }
}'
```

For more on autoscaling, see [Autoscaling](/docs/introduction/autoscaling) and [Scale to zero](/docs/introduction/scale-to-zero).

## Configure consumption limits

Set limits on compute time, storage, and data transfer to control costs and implement your pricing tiers. You can configure these limits when creating a project or update them later.

Here's an example setting limits for a "starter" tier user:

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects \
     --header 'Accept: application/json' \
     --header "Authorization: Bearer $NEON_API_KEY" \
     --header 'Content-Type: application/json' \
     --data '{
  "project": {
    "settings": {
      "quota": {
        "active_time_seconds": 36000,
        "compute_time_seconds": 9000,
        "written_data_bytes": 1000000000,
        "data_transfer_bytes": 500000000,
        "logical_size_bytes": 100000000
      }
    },
    "name": "starter-tier-user",
    "pg_version": 16
  }
}'
```

When a quota is reached, the project's computes are automatically suspended until the next billing period or until you adjust the limits.

For detailed information about configuring limits, see [Configure consumption limits](/docs/guides/consumption-limits).

Here's a fictional example of how you might structure your own pricing tiers using Neon's consumption quotas:

| Resource          | Free Tier       | Pro Tier        | Enterprise |
| ----------------- | --------------- | --------------- | ---------- |
| Compute (min/max) | 0.25 / 0.25 CU  | 0.25 / 2 CU     | 1 / 8 CU   |
| Active time       | 100 hours/month | 750 hours/month | Unlimited  |
| Storage           | 512 MB          | 10 GB           | 100 GB+    |
| Data transfer     | 5 GB            | 50 GB           | Custom     |

For real-world examples, see how [Koyeb defines their database instance types and pricing](https://www.koyeb.com/docs/databases#database-instance-types-and-pricing).

## Monitor usage

Query consumption metrics to track usage across your projects and implement billing:

```bash
curl --request GET \
     --url 'https://console.neon.tech/api/v2/consumption_history/projects?limit=100&from=2024-11-01T00:00:00Z&to=2024-11-30T23:59:59Z&granularity=daily' \
     --header 'accept: application/json' \
     --header "authorization: Bearer $NEON_API_KEY"
```

The API provides metrics for:

- `active_time_seconds` — Time computes were active
- `compute_time_seconds` — CPU seconds consumed
- `written_data_bytes` — Data written to storage
- `data_transfer_bytes` — Data transferred out (egress)
- `synthetic_storage_size_bytes` — Total storage used

For details on querying metrics, see [Query consumption metrics](/docs/guides/consumption-metrics).

</Steps>

## Key considerations

Before going to production, consider these important aspects:

### Connection limits

Be aware of the [connection limits](/docs/connect/connection-pooling#connection-limits-without-connection-pooling) associated with each compute size. Connection pooling allows for significantly more concurrent connections. If you expect a high number of connections, we recommend using a pooled connection string. To learn more, see [Connection pooling](/docs/connect/connection-pooling).

### Reserved names

Neon reserves certain names for roles and databases. See [Reserved role names](/docs/manage/roles#reserved-role-names) and [Reserved database names](/docs/manage/databases#reserved-database-names).

### Polling consumption data

- Consumption data updates approximately every 15 minutes
- Minimum recommended polling interval: 15 minutes
- Rate limit: ~30 requests per minute per account
- Polling does NOT wake suspended computes

See the [consumption polling FAQ](/docs/guides/consumption-metrics#consumption-polling-faq) for more details.

### Staying informed

Monitor these resources for updates that could impact your integration:

- [Neon Roadmap](/docs/introduction/roadmap) for recent deliveries and upcoming features
- [Neon Changelog](/docs/changelog) for product updates
- [Neon Status Page](https://neonstatus.com/) for platform status
- [RSS Feeds](/docs/reference/feeds) for all of the above

## Advanced features

### Isolated development environments

Neon's [branching](/docs/introduction/branching) feature lets your users create isolated copies of their database for development and testing. Branches are copy-on-write clones that initially share data with their parent, though storage costs accumulate as changes are made to the branch.

Each user can:

- Create instant database branches for testing
- Reset branches to production state
- Delete branches when done

This is particularly valuable for platforms where users need to test schema changes or experiment with data safely. Branching is fully supported by the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). For examples, see [Branching with the Neon API](/docs/manage/branches#branching-with-the-neon-api).

### Schema migrations

If you're managing the same schema across many user databases, consider using tools like:

- [Drizzle migrations](/docs/guides/drizzle-migrations)
- [Prisma migrations](/docs/guides/prisma-migrations)
- [Flyway](/docs/guides/flyway)
- [Liquibase](/docs/guides/liquibase)

## Integration support

We're here to help you build your integration:

<DetailIconCards>

<a href="/docs/reference/api-reference" description="Explore all available API endpoints" icon="transactions">Neon API Reference</a>

<a href="/contact-sales" description="Discuss your integration with our team" icon="todo">Talk to Sales</a>

</DetailIconCards>

<Admonition type="info">
Integrators of Neon can contact their Neon representative directly for assistance with their integration.
</Admonition>
