---
label: 'Storage'
---

### What's new

**Faster cold starts in all regions**

Neon's _Auto-suspend_ feature minimizes cost by automatically scaling a compute instance to zero after a period of inactivity. A characteristic of this feature is a "cold start", which occurs when an idle compute transitions back to an active state to process requests. Recently, cold-start times have been significantly reduced through a variety of enhancements, outlined below:

- **Compute pools**: Instead of starting computes from zero, requests for computes are now served from pools of pre-started compute instances.
- **Compute configuration optimization**: Configuration changes at compute startup were eliminated where possible.
- **Caching of internal IP addresses**: Internal IP addresses are now cached to avoid waits for internal DNS routing.
- **Concurrency improvements**: Concurrency optimizations were applied to the compute startup process.
- **Code path optimization**: Code paths frequently accessed during compute startup were optimized.

With these improvements, cold starts are faster in all [supported regions](/docs/introduction/regions). Cold starts in the `US East (Ohio) — aws-us-east-2` region, where the Neon Control Plane is hosted, are the fastest at approximately 500ms. Work is currently underway to deploy the Neon Control Plane regionally to enable the same millisecond startup times in all regions.

Please be aware that [Neon Pro plan](/docs/introduction/pro-plan) users can adjust or disable the [Auto-suspend](/docs/guides/auto-suspend-guide) setting, controlling when a compute scales to zero. Additionally, Neon's [Autoscaling](/docs/guides/autoscaling-guide) feature allows you to scale compute resources down to a fractional size during periods of low activity.
