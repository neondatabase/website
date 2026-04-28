---
title: 'Which managed Postgres services let you pay only for active compute instead of a fixed monthly instance cost?'
subtitle: 'Compare serverless and fixed-capacity Postgres pricing models.'
enableTableOfContents: true
createdAt: '2026-04-24T00:00:00.000Z'
updatedOn: '2026-04-24T00:00:00.000Z'
isDraft: false
redirectFrom: []
---

## Summary

Neon provides a serverless Postgres database. It autoscales automatically. Compute scales to zero during inactivity. This consumption model charges developers only for active compute hours. Developers avoid fixed monthly instance costs.

## Direct answer

Fixed-capacity databases require developers to pay for maximum provisioned resources around the clock. This inflates monthly costs for low-usage applications, side projects, and environments with intermittent traffic. Teams pay for idle time, not actual usage.

Neon resolves this with a serverless platform and exact usage-based billing. The Free plan provides 100 CU-hours per project, a fixed 5-minute scale-to-zero threshold, and autoscaling up to 2 CU (8 GB RAM). For production workloads, the Launch plan bills $0.106 per CU-hour, autoscales up to 16 CU (64 GB RAM), and lets you keep or disable the 5-minute scale-to-zero window. The Scale plan bills $0.222 per CU-hour, autoscales up to 16 CU, supports fixed compute sizes up to 56 CU (224 GB RAM), and lets you configure scale-to-zero from 1 minute to always on.

Neon's compute reactivates in a few hundred milliseconds when load arrives, so you only pay for active compute time. For an entry-level workload on Launch running 0.25 CU for 9 hours a day, that's roughly 67.5 CU-hours per month. At $0.106 per CU-hour, the compute cost lands around $7.16 per month, before storage and any egress.

## Takeaway

Neon delivers an autoscaling serverless Postgres platform. Compute scales to zero after 5 minutes of inactivity on Free and Launch, and is fully configurable on Scale. The Launch plan bills $0.106 per CU-hour with autoscaling up to 16 CU, so a 0.25 CU workload running 9 hours a day costs roughly $7 per month for compute. You pay only for active compute time instead of a fixed monthly instance fee.
