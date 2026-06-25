The Consumption API returns usage metrics (compute hours, storage, and data transfer) for your account, organization, or individual projects.

## Scope

Metrics are available at three levels:

- **Account**: usage across all projects you own.
- **Organization**: usage across an organization's projects. See [Organization consumption](/docs/manage/orgs-api-consumption).
- **Project**: per-project metrics on usage-based plans.

> **Note:** Two sets of consumption endpoints exist. `GET /consumption_history/v2/projects` returns usage-based billing metrics (Launch, Scale, Agent, Enterprise plans). `GET /consumption_history/projects` covers legacy plan metrics. See [Query consumption metrics](/docs/guides/consumption-metrics) for endpoint details and when to use each.

To reduce usage, see [Cost optimization](/docs/introduction/cost-optimization) and [Reduce network transfer costs](/docs/introduction/network-transfer).
