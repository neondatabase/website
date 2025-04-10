---
title: Neon for Enterprise
enableTableOfContents: true
subtitle: Explore Neon’s features for enterprise teams and workloads
updatedOn: '2024-12-01T21:48:07.693Z'
---

**Neon's Enterprise plan is customized to meet your needs**—whether that means custom pricing, expanded limits, dedicated service, or hands-on support. It includes all Neon features, priority support, and a direct access to our team of Postgres and platform engineers. Beyond that, we’ll work with you to define a plan that fits your workload and operational goals.

## Why Neon for Enterprise

Neon combines the power of Postgres with a modern serverless architecture to help you scale fast and ship confidently.

- **Serverless Postgres** – Instant autoscaling of CPU, memory, and connections
- **10,000+ connections** – Built-in connection pooling
- **Database branching & instant provisioning** – Create production-grade environments on the fly
- **Multi-tenancy** – Project-level isolation for tenant data and resources
- **High availability and disaster recovery** – PITR, branching, and multi-AZ durability
- **Security and compliance** – HIPAA, SOC 2, ISO 27001, GDPR, CCPA
- **Expert support** – Priority support and direct access to our team of Postgres engineers

[Contact us](https://neon.tech/contact-sales) to learn more about custom plans, volume pricing, or onboarding support.

## Who is the Enterprise plan for?

### Engineering teams at scale

Accelerate development workflows with branching, preview environments, and database automation. Move faster without managing Postgres infrastructure.

### SaaS platforms embedding Postgres

Offer Postgres to your users with built-in scalability, fast provisioning, and API-level control.

### Teams managing database fleets

Provision and manage thousands of databases with API-driven workflows. Use branching and autoscaling to reduce operational overhead and control costs.

### AI platforms and agentic apps

Spin up Postgres instances instantly for agent workloads, data processing, or long-lived sessions. Ideal for real-time inference and rapid prototyping.

### Multi-tenant applications

Isolate customer data into separate Neon projects to isolate data and resources and to meet compliance requirements. Built-in autoscaling and usage tracking help you stay efficient.

## Enterprise features

### Platform

- Available on AWS and Azure
- API access for database management
- Terraform provider for Infrastructure as Code
- Private networking

### Scalability & connection management

- Serverless scaling of compute and connections
- Support for 10,000+ concurrent connections
- Built-in connection pooling to reduce connection overhead
- Scale to zero for compute cost management
- Dynamic compute with usage-based billing

### Security & compliance

- HIPAA, SOC 2 Type II, SOC 3, ISO 27001, ISO 27701, GDPR, CCPA
- Encryption in transit and at rest
- IP allowlisting and protected branches

### Disaster & availability

- High availability with multi-AZ durability
- Instant point-in-time recovery (PITR)
- Real-time metrics and observability

### Migration & onboarding

- Minimal-downtime migration support
- Logical replication for live cutovers
- Expert-led onboarding
- Proof-of-concept migration plans

### Enterprise support

- Prioritized support tickets
- Slack channel
- SLAs

### Built for modern workloads

Neon powers platforms like [Vercel](/blog/neon-postgres-on-vercel), [Replit](https://www.linkedin.com/posts/nikitashamgunov_heres-the-story-on-how-we-accidentally-created-activity-7242909460304699393-6mr2/), [Retool](/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases), and [Koyeb](https://www.koyeb.com/blog/serverless-postgres-public-preview).

Explore our [case studies](https://neon.tech/case-studies) and use cases to see how Neon supports [SaaS apps](https://neon.tech/use-cases/postgres-for-saas), Serverless apps](https://neon.tech/use-cases/serverless-apps), [AI agent platforms](https://neon.tech/use-cases/ai-agents), and [multi-tenant services](https://neon.tech/use-cases/database-per-tenant).

## Getting started

1. **Contact us** – Start with a discovery call
2. **Plan evaluation** – We’ll tailor a proposal to your needs
3. **Proof of concept** – Validate performance and migration options
4. **Onboarding** – Get help from our team during setup and launch

Learn more about our [Enterprise sales process](/docs/introduction/enterprise-sales-process).

[Get in touch](https://neon.tech/contact-sales) to start a conversation.

## Enterprise checklist

Use this checklist to evaluate Neon for your team:

### Technical capabilities

- [ ] Postgres compatibility — [support for Postgres 14, 15, 16, 17](/docs/postgresql/postgres-version-policy#neon-version-support-policy) and [70+ Postgres extensions](/docs/extensions/pg-extensions)
- [ ] [High availability](/docs/introduction/high-availability) with automated failover
- [ ] [Point-in-time restore (PITR)](/docs/introduction/branch-restore)
- [ ] [Read replicas](/docs/introduction/read-replicas) for horizontal scaling
- [ ] Performance at scale ([connection pooling](/docs/connect/connection-pooling), [low-latency serverles driver](/docs/serverless/serverless-driver), [autoscaling compute](/docs/introduction/autoscaling))
- [ ] Monitoring and observability ([monitoring dashboard](/docs/introduction/monitoring-page), [query monitoring](/docs/introduction/monitor-active-queries), and [metrics export](/docs/guides/datadog))
- [ ] [Data durability](/docs/introduction/architecture-overview#durability)
- [ ] [Terraform support and infrastructure automation](/docs/reference/terraform)
- [ ] [Private networking (AWS PrivateLink)](/docs/guides/neon-private-networking)
- [ ] [Region and data residency control](/docs/introduction/regions)

### Security & compliance

- [ ] [HIPAA, SOC 2 Type II, SOC 3, ISO 27001, ISO 27701, GDPR, CCPA](/docs/security/compliance)
- [ ] [Encryption at rest](/docs/security/security-overview#data-at-rest-encryption) and [secure connections](/docs/security/security-overview#secure-connections)
- [ ] [IP allowlists](/docs/introduction/ip-allow), [protected branches](/docs/guides/protected-branches), [schema-only branches](/docs/guides/branching-schema-only)

### Operational features

- [ ] [Instant point-in-time restore (PITR)](/docs/introduction/branch-restore)
- [ ] [Branching for dev/test environments](/docs/introduction/branching)
- [ ] [Near zero-downtime migrations](https://neon.tech/migration-assistance)
- [ ] [Configurable update windows](/docs/manage/updates) and [managed platform maintenance](/docs/manage/platform-maintenance)
- [ ] [Usage quotas and billing visibility](/docs/guides/partner-intro#billing)
- [ ] [SLAs](/docs/introduction/support#slas)
- [ ] Postgres data import — [inbound logical replication](), [dump & restore](/docs/import/migrate-from-postgres), and the [Import Data Assistant](/docs/import/import-data-assistant))
- [ ] Postgres [data export to external data services & platforms](/docs/guides/logical-replication-guide#replicate-data-from-neon) (outbound logical replication)

### Developer experience
- [ ] Branching for preview environments — [Vercel integration](/docs/guides/vercel-overview), [GitHub integration](/docs/guides/neon-github-integration)
- [ ] [Autoscaling](/docs/introduction/autoscaling) and [scale-to-zero](/docs/introduction/scale-to-zero)
- [ ] [SDKs](/docs/reference/sdk) (JS, Python, Go, etc.)
- [ ] [CLI](/docs/reference/neon-cli) and [API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) access
- [ ] CI/CD integration ([Terraform](/docs/reference/terraform), [GitHub Actions](/docs/guides/neon-github-integration), [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api), [Neon CLI](/docs/reference/neon-cli))
- [ ] [Docs](/docs/introduction) and [quickstarts](/docs/introduction#quickstarts) for major frameworks

### Enterprise Support

- [ ] Prioritized support tickets
- [ ] Slack channel
- [ ] SLAs

  See [Support channels](/docs/introduction/support#support-channels) for details.
