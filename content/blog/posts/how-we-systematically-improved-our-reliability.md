---
title: How we systematically improved our reliability
description: >-
  We implemented a system to find failures earlier across our huge fleet
excerpt: >-
  Let's start with a simple problem: one database, one process, one host. That
  is a reliability problem we understand. We know how to connect, inspect,
  restart, and read logs.
date: '2026-09-23T12:00:00'
updatedOn: '2026-09-23T13:29:00.000Z'
category: engineering
categories:
  - engineering
authors:
  - dmitrii-mokhnatkin
cover:
  image: null
  alt: null
isFeatured: false
seo:
  title: How we systematically improved our reliability - Neon
  description: >-
    We implemented a system to find failures earlier across our huge fleet
  keywords: []
  noindex: false
  ogTitle: How we systematically improved our reliability - Neon
  ogDescription: >-
    We implemented a system to find failures earlier across our huge fleet
  image: null
---

<Admonition type="note" title="Neon is a complete set of cloud backend primitives">
We just announced that Object Storage, Managed Better Auth, Functions, and AI Gateway are now generally available. But even as our toolset grows, Lakebase Postgres remains the core of the backend, and the rest of the primitives depend on it. We’ll continue to double down on database work, not only on new features but in reliability improvements as well.
</Admonition>

Let’s start with a simple problem: one database, one process, one host. That is a reliability problem we understand. We know how to connect, inspect, restart, and read logs.

Now, copy and paste that millions of times. Processes crash. Machines go down. Networks flap. At that scale, these failures are routine. And Lakebase deals with these failures every day.

Lakebase Postgres runs a very large fleet across two surfaces (Neon and Databricks) and three clouds: AWS, Azure, and GCP. We are in more than 30 regions. We also use cells - isolated deployments that let us scale horizontally and reduce blast radius inside a region. A region can have up to 15 cells. That drives the number of environments above 70.

What started as a database problem is now a global operations problem.

In Lakebase Postgres, a set of services manages the fleet. We call them the control plane. They provision and configure databases, monitor health, recover databases when needed, and manage high availability, branch creation, scale to zero, and other features. Control-plane failures can prevent database creation, waking, and recovery. When those paths fail, affected customers may be unable to connect. The control plane itself has to stay resilient to failure at fleet scale.

This post lists a series of reliability work we have been making to Lakebase Postgres across Neon and Databricks as the fleet, the product, and the customer base grow.

<Admonition type="note" title="Learning from our mistakes">
We accelerated this work after experiencing two severe incidents in one week a few months ago. One control plane cell was unavailable for one hour, and a second cell was unavailable for five hours. In both cases, an external dependency failure triggered a self-reinforcing loop that brought down the control plane and prevented it from recovering on its own. Reliability became the team’s top priority.
</Admonition>

## Postmortems were the obvious first step

The first step was obvious: getting better at postmortems. A good postmortem reconstructs what happened, finds the root causes, and turns them into fixes and lessons. Databricks has a great standard practice for postmortems that Neon adopted as one of the transitions of moving from startup-scale practices to enterprise-grade reliability.

## Then, we pushed 30+ fixes

**The postmortems we created from the incidents mentioned earlier triggered more than 30 follow-up fixes over three months.** The work spanned three places: how the control plane uses its own database (which is also Postgres), bugs and defaults in control-plane code, and the architecture that showed up under incident load.

### Database behavior in the control plane

The control plane stores and queries its own state in Postgres. If there’s failures in that Postgres, this affects provisioning, health checks, and recovery for the customer fleet.

We mitigated several query-plan regressions and added safeguards to prevent them from recurring. We also started preventing long-running transactions so a stuck query could not block the control plane, and we tweaked a few Postgres parameters, including disabling parallel query execution, which had been a source of the plan and runtime problems.

### Control plane bugs

We then went through control-plane code and runtime settings and found multiple bugs, including

- A bug in an open-source dependency we use
- Queue processing
- Suboptimal TCP timeout settings
- Suboptimal connection-pool defaults

Most of these bugs were not in our own code: they were in defaults and behavior we inherited - an open-source dependency, TCP timeouts, connection-pool settings. Even a widely used library can have defaults that don’t suit a control plane managing millions of databases. Those settings still need to be reviewed and set for this workload.

### System design

The last group of fixes was architectural. These showed up most clearly during the incidents themselves:

- There were problems in the backpressure mechanisms we were using
- Starvation and fairness issues under load, so some work made progress while other work waited

Those are the kinds of failures that turn a dependency outage into a cell-level outage: the control plane does not shed load cleanly, and recovery work does not get a fair share of capacity.

## We identified where reliability failures were actually coming from

Fixes written after an incident are useful, but late. The two cell outages had already reached customers by the time the postmortems existed. We stepped back and asked where reliability failures actually come from, so we could look for them earlier than the next incident.

They cluster in three places:

1. **The environment:** infrastructure, networks, dependencies, hardware. Anything we depend on will eventually fail. The two cell outages started here: an external dependency failed and a positive feedback loop took the cell down.
2. **Changes we make:** code, configuration, migrations, operations.
3. **Client workload:** traffic, usage patterns, invalid input, retries. Even predictable patterns, such as hourly cron spikes, can become dangerous at scale.

## We implemented a process

That list above is the diagnosis. With that, we implemented a reliability system:

1. Score how risky a change is
2. Systematically require reliability work as that change moves from design, through build and release, into operation

### Risk determines how much rigor a change gets

Every change gets a risk score:

**Risk = probability × impact**

Probability tracks how big and how new the change is, and how many dependencies it touches. Impact tracks which customer journeys it can break, how wide the blast radius is, and how long recovery would take.

- Low risk: an internal dashboard change
- High risk: a control-plane migration that affects database creation

The score answers one question: how many reliability gates does this change have to pass? High-risk changes get more rigor, low-risk changes stay fast.

### Reliability work across the lifecycle

We attached reliability work to each stage a change already goes through: design, build, release, and operate. The point is to inspect the three failure classes we identified above (failures in the environment, failures from our own changes, failures triggered by client workloads) systematically across the lifecycle, according to their risk score:

**Design**

Before we write much code, we wonder how this change can fail:

- An AI skill we built reads the design from a reliability perspective
- We apply the risk scoring
- If high-risk, we run a premortem: write the design as if the feature has already caused an incident, then work out how that was possible and how to prevent it

**Build**

Once working the code, we make sure that the potential failures are tested and that we can undo any changes:

- We run a reliability review of the code
- We run load and failure testing
- We run rollback validation

**Release**

As we roll out, we watch the fleet and stop if the change misbehaves:

- We stage ramp-up
- An SLO the feature owner monitors during rollout
- We run an operational readiness review for high-risk changes

**Operate**

After it is live, the team that will get paged has to be able to run it:

- There’s knowledge transfer from the feature owner to the team
- On-call drills
- And a team review of every reliability dip, even the smallest

## Reliability as a system

We’re now looking at reliability beyond “the last incident fix list” and much more as a way of making engineering decisions. This is ongoing work - the current system has already helped tremendously with incident prevention, and we are looking to add more analyses and more automation, including:

- **FMEA (failure mode and effects analysis):** take a component, imagine it fails, trace the customer impact, then mitigate
- **FTA (fault tree analysis): more** top-down - start from a customer-visible failure and trace backward to the components that could cause it
- **Automated stress and failure testing:** make load, limit, and recovery tests repeatable instead of depending on someone remembering to run them

We’ll continuously roll out this work on Lakebase Postgres across Neon and Databricks.
