---
title: Neon plans
subtitle: Learn about the different plans offered by Neon
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/introduction/billing#neon-plans
  - /docs/introduction/billing-calculators
  - /docs/introduction/billing-rates
updatedOn: '2024-01-23T17:45:24.329Z'
---

Neon offers the following plans: 

- **Free Tier** &mdash; Best for hobby projects, prototypes, and learning Neon.
- **Launch** &mdash; All the resources, features and support you need to launch.
- **Scale** &mdash; Full platform and support access, designed for businesses scaling production workloads.
- **Enterprise** &mdash; A custom plan for large teams, database fleets, and resale.

For information about how Neon bills for paid plans, please refer to our [Billing metrics](/docs/introduction/billing) page.

## Neon plans

|                         | Free                                         | Launch                                       | Scale                                        |
|-------------------------|----------------------------------------------|----------------------------------------------|----------------------------------------------|
| **Pricing**             | $0 per month                                 | $19 per month                                | $69 per month                                |
| **Description**         | Best for hobby projects, prototypes, and learning Neon | All the resources, features and support you need to launch. | Full platform and support access, designed for businesses scaling production workloads. |
| **Included Usage**      |                                              |                                              |                                              |
| Storage                 | 0.5 GiB                                      | 10 GiB                                       | 50 GiB                                       |
| Active Compute Time     | Primary: 750 hours/month<br>Branches: 20 hours/month</br> | 1,200 hours/month                    | 3,000 hours/month                            |
| Projects                | 1                                            | 10                                           | 50                                           |
| **Extra Usage**         |                                              |                                              |                                              |
| Storage                 | –                                            | –                                            | $15 per 10 GiB                               |
| Active Compute Time     | –                                            | $0.04 per hour                               | $0.04 per hour                               |
| Projects                | –                                            | –                                            | $50 per 10 projects                          |
| **Support**             | Community                                    | Standard                                     | Priority                                     |
| **Features**            |                                              |                                              |                                              |
| Compute Size            | 0.25 vCPU, 1GB RAM                           | Up to 4 vCPUs, 16GB RAM                      | Up to 7 vCPUs, 28GB RAM                      |
| Autoscaling             | –                                            | &check;                                      | &check;                                      |
| Branching               | up to 10 branches                            | &check;                                      | &check;                                      |
| Point-in-time Recovery  | Up to 24 hours                               | Up to 7 days                                 | Up to 30 days                                |
| IP Allow                | –                                            | –                                            | &check;                                      |
| SOC 2 Report            | –                                            | –                                            | &check;                                      |
| Autosuspend             | Fixed<br>After 5 minutes                     | Configurable<br>5 minutes to never           | Configurable<br>1 minute to never            |
| Available Regions       | All                                          | All                                          | All                                          |
| Project Sharing         | &check;                                      | &check;                                      | &check;                                      |
| Read Replicas           | –                                            | &check;                                      | &check;                                      |
| Logical Replication     | &check;                                      | &check;                                      | &check;                                      |


For more information about a particular plan, refer to the individual plan pages:

- [Free Tier](/docs/introduction/free-tier)
- [Launch](/docs/introduction/pro-plan)
- [Scale](/docs/introduction/scale-plan)
- [Enterprise](/docs/introduction/enterprise-plan)

**Notes:**

- Paid plans have a default limit of 20 simultaneously active computes to protect against unintended usage. To increase this limits, please [open a support ticket](/docs/introduction/support). The simultaneously active compute limit does not affect the primary branch compute, which always remains available.
- Active Compute Time: On the Free Tier, your primary branch compute is allotted 750 hours a month, which means your primary branch is always available. Branch computes have a 1,200 hours/month Active Compute Time limit. If your branch computes exceed this limit, they will be suspended until the limit resets. You can monitor _Active Compute Time_ on the **Usage** widget on the Neon **Dashboard**. The _Active Compute Time_ limit resets at the beginning of each month. For instance, if you enroll in the Neon Free Tier on January 15th, your _Active Compute Time_ limit will reset on February 1st.

## Support

Support channels for the Neon plans are outlined on our [Support](/docs/introduction/support) page.
