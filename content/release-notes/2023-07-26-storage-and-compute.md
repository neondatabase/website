---
label: 'Storage'
---

### What's new

- Compute: Neon's _Autoscaling_ feature, which automatically scales compute resources in response to workload, is now available in the US East (N. Virginia) — `aws-us-east-1` and US West (Oregon) — `aws-us-west-2` regions. With this change, _Autoscaling_ is now supported in all [regions](/docs/introduction/regions) supported by Neon. _Autoscaling_ is a [Neon Pro plan](/docs/introduction/pro-plan) feature. To learn more, see [Autoscaling](/docs/introduction/autoscaling). For information about enabling _Autoscaling_ for your compute endpoints, refer to our [Enabling Autoscaling in Neon](/docs/manage/endpoints#compute-size-and-autoscaling-configuration) guide.
- Compute: Added support for a `neon_utils` extension that provides a `num_cpus()` function you can use to monitor how Neon's _Autoscaling_ feature allocates compute resources in response to workload. For more information, see [The neon_utils extension](/docs/extensions/neon-utils).
