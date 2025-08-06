---
title: Neon legacy plans
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/introduction/extra-usage
updatedOn: '2025-05-30T16:54:40.485Z'
---

This page documents Neon’s legacy pricing plans. These plans are no longer available to new users. If you're on a legacy plan, you can stay on it — but if you switch to a new plan, you won’t be able to switch back.

<Admonition type="warning">
Legacy plans are being phased out and will be sunsetted at a future date (to be announced). We encourage you to review our [new pricing plans](/docs/introduction/plans) to explore your options.

Users on the legacy **Free plan** will be automatically migrated to the new Free plan. All other legacy plan users (Launch, Scale, Business, or Enterprise) will remain on their current plan for now unless they choose to change.
</Admonition>

---

Neon's legacy plans are structured around **allowances** (bundled resources) and **extra usage** (billed per use if you exceed your included limits).

<Admonition type="tip" title="Allowances and Extra Usage">
Legacy paid plans include bundled resource allowances. If you exceed your allowance, extra usage is billed automatically. Learn more in [Extra usage](/docs/introduction/extra-usage).
</Admonition>

## Free Plan (Legacy)

The legacy Free plan is best suited for hobby projects, prototypes, and learning Neon. Users on this plan will be automatically migrated to the new Free plan.

### Included allowances

| Usage type                 | Plan allowance                                                           |
| :------------------------- | :----------------------------------------------------------------------- |
| **Projects**               | 10 Neon projects                                                         |
| **Branches**               | 10 branches per project                                                  |
| **Databases**              | 500 per branch                                                           |
| **Storage**                | 0.5 GB-month (regular and archive storage combined)                      |
| **Compute**                | 191.9 compute hours/month (enough to run a primary 0.25 CU compute 24/7) |
| **Data transfer (Egress)** | 5 GB per month                                                           |

<Admonition type="tip" title="What is a compute hour?">
- A compute hour is one _active hour_ for a compute with 1 vCPU.  
- For example, a 0.25 vCPU compute uses 1 compute hour every 4 active hours.  
- Formula: `compute hours = compute size × active hours`.  
Idle (suspended) time does not count as active time.
</Admonition>

### Features

- Autoscaling up to 2 vCPU
- Scale to zero
- Monitoring (1-day history)
- All supported regions
- Project collaboration
- Read replicas (up to 3 per project)
- Advanced Postgres features (logical replication, connection pooling, 60+ extensions)
- Neon features like branching, time travel connections, and **Instant Restore (24-hour window)**
- [Community support](/docs/introduction/support)

---

## Launch Plan

Ideal for early-stage projects and startups preparing for growth.

### Included allowances

| Usage type          | Plan allowance                    |
| ------------------- | --------------------------------- |
| **Projects**        | 100 Neon projects                 |
| **Branches**        | 5000 per project                  |
| **Databases**       | 500 per branch                    |
| **Storage**         | 10 GB-month                       |
| **Archive Storage** | 50 GB-month                       |
| **Compute**         | 300 compute hours per month total |

### Extra usage

| Extra usage type          | Cost                   |
| ------------------------- | ---------------------- |
| **Extra Storage**         | $1.75 per GB-month     |
| **Extra Archive Storage** | $0.10 per GB-month     |
| **Extra Compute**         | $0.16 per compute hour |

### Features

- Autoscaling up to 4 vCPUs / 16 GB RAM
- Scale to zero
- Monitoring (7-day history)
- Branch protection (up to 2 branches)
- Same advanced Postgres and Neon features as Free
- Instant Restore (up to 7 days)
- [Standard support](/docs/introduction/support)

---

## Scale Plan

Designed for teams scaling production workloads and needing higher resource limits.

### Included allowances

| Usage type          | Plan allowance                    |
| ------------------- | --------------------------------- |
| **Projects**        | 1000 Neon projects                |
| **Branches**        | 5000 per project                  |
| **Databases**       | 500 per branch                    |
| **Storage**         | 50 GB-month                       |
| **Archive Storage** | 250 GB-month                      |
| **Compute**         | 750 compute hours per month total |

### Extra usage

| Extra usage type          | Cost                   |
| ------------------------- | ---------------------- |
| **Extra Storage**         | $1.50 per GB-month     |
| **Extra Archive Storage** | $0.10 per GB-month     |
| **Extra Compute**         | $0.16 per compute hour |
| **Extra Projects**        | $50 per 1000 projects  |

### Features

- Autoscaling up to 8 vCPUs / 32 GB RAM
- Scale to zero
- Monitoring (14-day history)
- Branch protection (up to 5 branches)
- Customer-provided custom extensions (on AWS only)
- Instant Restore (up to 14 days)
- [Standard support](/docs/introduction/support)

---

## Business Plan

A high-capacity plan for production teams with security and compliance requirements.

### Included allowances

| Usage type          | Plan allowance                     |
| ------------------- | ---------------------------------- |
| **Projects**        | 5000 Neon projects                 |
| **Branches**        | 5000 per project                   |
| **Databases**       | 500 per branch                     |
| **Storage**         | 500 GB-month                       |
| **Archive Storage** | 2500 GB-month                      |
| **Compute**         | 1000 compute hours per month total |

### Extra usage

| Extra usage type          | Cost                   |
| ------------------------- | ---------------------- |
| **Extra Storage**         | $0.50 per GB-month     |
| **Extra Archive Storage** | $0.10 per GB-month     |
| **Extra Compute**         | $0.16 per compute hour |
| **Extra Projects**        | $50 per 5000 projects  |

### Features

- Autoscaling up to 16 vCPUs / 56 GB RAM
- Fixed compute sizes up to 56 vCPUs / 224 GB RAM
- Scale to zero
- Monitoring (14-day history)
- SOC 2 compliance
- HIPAA compliance (add-on)
- IP allowlists and branch protection
- Instant Restore (up to 30 days)
- [Priority support](/docs/introduction/support)
- [Service SLA – 99.95% uptime](/neon-business-sla)

---

## Enterprise Plan

Custom-tailored for large teams, SaaS vendors, and fleet-level deployments.

### Included allowances

| Usage type          | Plan allowance |
| ------------------- | -------------- |
| **Projects**        | Custom         |
| **Branches**        | Custom         |
| **Databases**       | Custom         |
| **Storage**         | Custom         |
| **Archive Storage** | Custom         |
| **Compute**         | Custom         |

### Enterprise features

- Custom pricing and resource limits
- 0-downtime migrations
- Scale to zero
- HIPAA and SOC 2 compliance (add-ons)
- Dedicated solution engineer
- Custom domain proxy
- Security reviews and compliance questionnaires
- Invoice billing and annual commitments
- [Enterprise support](/docs/introduction/support)

To explore an Enterprise plan, [contact sales](https://neon.tech/contact-sales) or [request a trial](https://neon.tech/enterprise#request-trial).

## Extra usage

Neon legacy plans include monthly **allowances** for storage, compute, and projects. If you're on a paid plan and exceed those allowances, you're automatically billed for extra usage—no manual action required. The types of extra usage available vary by plan.

### Launch plan

The Launch plan supports extra **Storage**, **Archive Storage**, and **Compute**. Extra projects are not available on Launch—upgrade to Scale or Business if you need more than 100 projects.

| Resource              | Unit         | Price |
| :-------------------- | :----------- | :---- |
| Extra Storage         | GB-month     | $1.75 |
| Extra Archive Storage | GB-month     | $0.10 |
| Extra Compute         | Compute hour | $0.16 |

### Scale plan

The Scale plan supports extra **Storage**, **Archive Storage**, **Compute**, and **Projects**.

| Resource              | Unit         | Price  |
| :-------------------- | :----------- | :----- |
| Extra Storage         | GB-month     | $1.50  |
| Extra Archive Storage | GB-month     | $0.10  |
| Extra Compute         | Compute hour | $0.16  |
| Extra Projects        | 1000         | $50.00 |

### Business plan

The Business plan supports extra **Storage**, **Archive Storage**, **Compute**, and **Projects**.

| Resource              | Unit         | Price  |
| :-------------------- | :----------- | :----- |
| Extra Storage         | GB-month     | $0.50  |
| Extra Archive Storage | GB-month     | $0.10  |
| Extra Compute         | Compute hour | $0.16  |
| Extra Projects        | 5000         | $50.00 |

### How extra usage works

If your usage exceeds a plan allowance and that type of extra usage is supported, it's automatically allocated and billed on your monthly invoice.

#### Storage

For example, the Launch plan includes 10 GB of storage. If you use more than that, you're charged $1.75 per additional GB-month. The same logic applies to Scale and Business, with lower rates at higher plan tiers.

<Admonition type="note">
In billing, “allocation” refers to a billable increase in your storage allowance—not physical provisioning of space.
</Admonition>

#### Projects

Extra projects are only available on the Scale and Business plans:

- **Scale**: Extra projects are allocated in units of **1000** at **$50 per unit**
- **Business**: Extra projects are allocated in units of **5000** at **$50 per unit**

If you exceed your project limit, you're billed for the next unit of extra projects, prorated from the date the extra usage began. For example, using 1001 projects on Scale results in one extra unit (1000 projects) billed at a prorated amount.

<Admonition type="note" title="How extra project charges are prorated">
Cost = Units × (Unit Price ÷ Days in Month) × Days Left in Month

Once a unit is allocated, you're billed for it through the end of the month. If your usage drops back below the limit, the extra charge is removed at the start of the next billing cycle.
</Admonition>

#### Compute

Extra compute usage is billed by the **compute hour** at **$0.16/hour** across all paid plans. For example, if you're on the Launch plan and use 100 compute hours beyond your 300-hour allowance, you'll be billed an additional **$16**.

Since compute usage is measured hourly, **prorated billing does not apply**.

<NeedHelp/>
