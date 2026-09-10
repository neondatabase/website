The Consumption API returns usage metrics (compute, storage, data transfer) for monitoring, reporting, and custom billing dashboards.

## Scope

Metrics are available at three levels:

- **Account**: usage across all projects you own.
- **Organization**: usage across an organization's projects. See [Organization consumption](https://neon.com/docs/manage/orgs-api-consumption).
- **Project**: per-project metrics on usage-based plans.

> [!NOTE]
> A separate set of legacy consumption endpoints exists for historical integrations. New code should use the current endpoints. See [Query consumption metrics](https://neon.com/docs/guides/consumption-metrics) for which to use and when.

## Related guides

- [Cost optimization](https://neon.com/docs/introduction/cost-optimization). Strategies for keeping compute, storage, and data transfer costs down.
- [Reduce network transfer costs](https://neon.com/docs/introduction/network-transfer). How data transfer is metered and how to lower it.
