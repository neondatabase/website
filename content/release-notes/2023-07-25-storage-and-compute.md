---
label: 'Storage'
---

### What's new

**Faster cold starts in all regions**

Neon's _Auto-suspend_ feature is designed to minimize costs by automatically scaling a compute instance to zero after a period of inactivity. By default, Neon scales a compute to zero after 5 minutes of inactivity. A characteristic of this feature is the concept of a "cold start". During a cold start, an idle compute transitions to an active state to process requests. Recently, cold-start times have been significantly reduced through a variety of enhancements, outlined below:

- **Compute pools**: Instead of starting computes from zero, requests for computes are now served from a pools of pre-started compute instances.
- **Compute configuration optimization**: Configuration changes at compute startup were eliminated where possible.
- **Caching of internal IP addresses**: Internal IP addresses are now cached to avoid waits for internal DNS routing.
- **Concurrency improvements**: Concurrency optimizations were applied to the compute startup process.
- **Code path optimization**: Code paths frequently accessed during compute startup were optimized.

With these improvements, cold starts are faster in all [supported regions](/docs/introduction/regions) but most noticeably in the `US East (Ohio) — aws-us-east-2` region, which hosts the Neon Control Plane. Startup times in this region are currently measured at 500ms or less. The Neon Control plane will be deployed regionally in future releases, bringing the same millesecond startup times to all regions.

Please be aware that [Neon Pro plan](/docs/introduction/pro-plan) users can adjust or disable the [Auto-suspend](/docs/guides/auto-suspend-guide) setting in Neon, controlling when a compute scales to zero. Additionally, to help reduce compute costs, Neon's [Autoscaling](/docs/guides/autoscaling-guide) feature is able to scale compute resources down to a fractional compute size during periods of low activity.
