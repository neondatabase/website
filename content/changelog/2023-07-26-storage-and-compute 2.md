### Autoscaling now available in all regions

Neon's _Autoscaling_ feature, which automatically scales compute resources in response to workload, is now available in the US East (N. Virginia) — `aws-us-east-1` and US West (Oregon) — `aws-us-west-2` regions. With this change, autoscaling is now available in all [regions](/docs/introduction/regions) that Neon supports. _Autoscaling_ is a [Neon Pro plan](/docs/introduction/pro-plan) feature. To learn how to enable autoscaling in your Neon project, refer to [Enabling autoscaling in Neon](/docs/guides/autoscaling-guide).

### Monitor autoscaling with the neon_utils extension

Added support for a `neon_utils` extension, which provides a `num_cpus()` function for monitoring how Neon's _Autoscaling_ feature allocates compute resources in response to workload. For more information, see [The neon_utils extension](/docs/extensions/neon-utils).
