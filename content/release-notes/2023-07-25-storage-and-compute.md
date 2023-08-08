---
label: 'Storage'
---

### What's new

**Faster cold-start times**

The "cold-start time" for Neon compute instances, which is the amount of time it takes an idle compute instance to transition to an active state, has been reduced through a variety of enhancements, outlined below:

- **Compute pools**: Instead of starting computes from zero, requests for computes are now served from a pools of pre-started compute instances.
- **Compute configuration optimization**: Configuration changes at compute startup were eliminated where possible.
- **Caching of internal IP addresses**: Internal IP addresses are now cached to avoid waits for internal DNS routing.
- **Concurrency improvements**: Concurrency optimizations were applied to the compute startup process.
- **Code path optimization**: Code paths frequently accessed during compute startup were optimized.

Cold-start times are faster in all [supported regions](/docs/introduction/regions) but most noticeably in the `US East (Ohio) — aws-us-east-2` region, which hosts the Neon Control Plane. Startup times in this region are measured at 500ms or less. The Neon Control plane will be deployed regionally in future releases, bringing the same millesecond startup times to all supported regions.
