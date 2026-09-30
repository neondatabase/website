---
title: How we systematically improved our reliability
description: >-
  Here's what we changed and why
excerpt: >-
  Earlier this year, we had two incidents in one week. After those incidents,
  we doubled down on reliability. This post summarizes the reliability work
  we've been rolling out since then to keep uptime high as our fleet, product,
  and customer base grow.
date: '2026-09-30T12:00:00'
updatedOn: '2026-09-30T12:34:00.000Z'
category: engineering
categories:
  - engineering
authors:
  - dmitrii-mokhnatkin
  - andrey-stolbovsky
cover:
  image: null
  alt: null
isFeatured: false
seo:
  title: How we systematically improved our reliability - Neon
  description: >-
    From rigorous postmortems to risk-scored changes, here's what we changed and
    why
  keywords: []
  noindex: false
  ogTitle: How we systematically improved our reliability - Neon
  ogDescription: >-
    From rigorous postmortems to risk-scored changes, here's what we changed and
    why
  image: null
---

<Admonition type="note" title="Neon is a complete set of cloud backend primitives">
We just announced that Object Storage, Managed Better Auth, Functions, and AI Gateway are now generally available. But even as our toolset grows, Lakebase Postgres remains the core of the backend, and the rest of the primitives depend on it. We'll continue to double down on database work, not only on new features but in reliability improvements as well.
</Admonition>

Let's start with a simple problem: one database, one process, one host. That is a reliability problem we understand. We know how to connect, inspect, restart, and read logs.

Now, copy and paste that millions of times. Processes crash. Machines go down. Networks flap. At the million-database scale, these failures are routine. And Lakebase deals with these failures every day.

Lakebase Postgres runs a very large fleet across two surfaces (Neon and Databricks) and three clouds: AWS, Azure, and GCP. We are in more than 30 regions. We also use cells - isolated deployments that let us scale horizontally and reduce blast radius inside a region. A region can have up to 15 cells. That drives the number of environments above 70.

What started as a database problem is now a global operations problem.

In Lakebase Postgres, a set of services manages the fleet. We call them the control plane. They provision and configure databases, monitor health, recover databases when needed, and manage high availability, branch creation, scale to zero, and other features. Control-plane failures can prevent database creation, waking, and recovery. When those paths fail, affected customers may be unable to connect. The control plane itself has to stay resilient to failure at fleet scale.

**[ADD IMAGE 1]**

Earlier this year, we had two incidents in one week. Both started with an external dependency failing; that failure triggered a self-reinforcing loop that took down the control plane and kept it from recovering on its own.

After those incidents, we doubled down on reliability. This post summarizes the reliability work we've been rolling out since then to keep uptime high as our fleet, product, and customer base grow.

This work never really ends, and new improvements will keep shipping. But we're pleased with the results so far: our stability is already better because of these practices.

## The first step: writing effective postmortems

A good postmortem reconstructs what happened, finds the root causes, and turns them into fixes and lessons. Databricks has a great standard practice for postmortems that Neon adopted as one of the transitions of moving from startup-scale practices to enterprise-grade reliability.

Our postmortems are now structured around these two general principles:

- An effective postmortem exists to reduce future customer harm. It should work as a risk-reduction tool vs just a record of events.
- A reviewer who was not involved in the response should be able to understand what customers experienced, trace that outcome through the system, check the evidence, and decide whether the proposed actions are proportionate and complete.

**[ADD IMAGE 2]**

### We start with the impact

The first thing we write is the impact of the incident. This section is the foundation of the whole postmortem, and it analyzes

- **The who -** affected customers, accounts, workspaces, or projects, with the denominator and percentage
- **The what -** affected endpoints, APIs, regions, cells, and control-plane and data-plane operations, and what was not affected
- **How bad -** error rate, latency against a baseline, failed operations
- **How long -** start, end, duration, and whether impact was continuous or intermittent
- **How sure -** measurement source, method, known blind spots, and whether each figure is exact or estimated

Getting the numbers right matters for three reasons:

- **Proportionality.** If you record "customers experienced latency", this may mean very different things. A 10% latency increase on one non-critical method and a 1,000x increase across all control-plane and data-plane operations can both be described as "latency", but both incidents need very different remediation.
- **Unknown impact is still information.** Do not manufacture precision. If the system can't produce a count, say so, explain why, bound it where the evidence allows, and treat the gap as an observability action item.
- **Internal customers count too.** On-call engineers, support specialists, and product managers are affected by incidents. Measure that in time wasted and surprise interruptions, especially nightly pages.

<Admonition type="note" title="Using AI effectively">
AI agents are useful for digging through logs to work out how many customers were affected. But an agent can get numbers wrong, so we never paste its figures straight into a postmortem. Instead, we ask it to build a notebook that shows each number next to the exact query that produced it. That way, an engineer can rerun every query and check the result.

Even better is not needing AI for this at all. If a service has dashboards that track its reliability targets (SLOs) and the metrics behind them (SLIs), anyone can open them and see exactly who was affected, and the answer is the same every time.
</Admonition>

### We measure how long it took us to detect and mitigate

Next, we look at how we responded. We record three timelines:

- **Time to detection:** the time from when customers were first affected to when a person first reacted
- **Time to mitigation**: the time from detection to the moment customer harm actually stopped. We break this into smaller steps (reaching the right engineer, figuring out the problem, deciding what to do, doing it, and waiting for it to take effect) so we can see where the time went.
- **Time of recovery:** we confirm recovery from the customer's side

**[ADD IMAGE 3]**

**For each of these time spans, we ask ourselves: what would it take to cut this time in half?** The answer should be specific - e.g. we may need a new signal, alert, runbook, permission, or piece of automation.

### We find the root cause

We use the [5 Whys](https://asq.org/quality-resources/five-whys) framework, starting from the impact: "Why were [number] customers unable to use [feature] for [duration]?" Each answer becomes the next question, until we reach something specific in the system that we can fix. Every answer has to point to evidence and name the safeguard that was missing or didn't work. Labels like "human error" or "bad deployment" aren't answers, because they don't explain why the system let the problem reach customers.

Incidents rarely have one cause. In complex systems, several things usually go wrong at once. So the Whys often branch into a tree:

- **why it failed**
- **why it affected so many customers**
- **why it lasted so long**
- **and why it took so long to detect and stop**

When the evidence can't settle which explanation is right, we label the options as hypotheses.

"We don't know" is only acceptable in two cases:

1. The evidence doesn't exist - for example because the logs weren't kept. We say what's missing and add an action item so we have the data next time.
2. A full answer would take far too much work. We only stop if we can show our fixes cover the worst realistic outcome.

**[ADD IMAGE 4]**

<Admonition type="note" title="Dependency failures are also our problem">
When something we depend on fails, "the vendor had an outage" is not a cause we can act on. To our customers, that dependency is part of our product. So we look for the missing safeguard on our side, such as a timeout, a fallback, a cache, or isolation from the failing service.
</Admonition>

### We write action items that can actually be closed

Every problem we find ends in an action item, a clear reason no action is needed, or an accepted risk with an owner. Good action items are:

- **Specific and testable:** not "improve monitoring," but which alert to add, when it fires, who it pages, and how we'll prove it works
- **Small enough to finish:** days for urgent fixes, weeks for most items, a few months at most
- **Worth doing:** we prioritize by customer impact and by how likely the problem is to happen again, and skip items that cost a lot for little benefit
- **Linked from the text:** each problem points to its action item where it's mentioned, like "[AI10: check that all alerts link to a runbook]." If we can't link one, we've found a gap

### Last, we write the executive summary

The executive summary appears first in the document, but we write it last, once the rest of the analysis backs up its numbers. It should make sense on its own: what happened, how many customers were affected and for how long, why it happened, how we stopped it, and what risk remains.

Once the draft is ready, it gets two reviews. The first is a team review, ideally including someone who wasn't involved in the incident. The second is an independent review by a senior reviewer, who checks the whole document.

## After the postmortems, come the fixes

**The postmortems for the two incidents at the start of this post led to more than 30 follow-up fixes over three months.** They fell into three areas: how the control plane uses its own database, bugs and defaults in control-plane code, and weaknesses in the system design that only showed up under incident load.

### Database behavior in the control plane

The control plane keeps its own state in a Postgres database. When that database has problems, provisioning, health checks, and recovery slow down or fail across the customer fleet.

We fixed several query-plan regressions and added safeguards so they don't come back. We also started blocking long-running transactions, so a stuck query can't hold up the control plane. Finally, we tuned a few Postgres parameters, including turning off parallel query execution, which had caused some of the plan and runtime problems.

### Control-plane bugs and defaults

Next, we went through control-plane code and runtime settings. We found problems in:

- An open-source dependency we use
- Queue processing
- TCP timeout settings
- Connection-pool defaults

Most of these weren't in code we wrote. They were defaults and behavior we inherited. A widely used library can still ship defaults that don't suit a control plane managing millions of databases, so we review and set those values for our workload.

### System design

The last group of fixes was architectural, and these problems showed up most clearly during the incidents themselves:

- Our backpressure mechanisms, which slow down incoming work when the system is overloaded, didn't work as they should
- Under load, we had starvation and fairness issues: some work kept making progress while other work waited

## We also built a process to find failures earlier

Those 30+ fixes addressed what went wrong in the two incidents. But fixes that come out of a postmortem arrive late - by the time we write them, customers have already been affected.

**So we stepped back and asked where reliability failures come from in the first place, so we could catch them before the next incident.**

We discover that they come from three places:

- **The environment:** infrastructure, networks, dependencies, hardware. Anything we depend on will eventually fail. Both of our incidents started here, with an external dependency failing.
- **Changes we make:** code, configuration, migrations, operations.
- **Client workload:** traffic, usage patterns, invalid input, retries. Even predictable patterns, such as hourly cron spikes, can become dangerous at scale.

Knowing where failures come from, we built a system around two ideas:

1. Every change gets a risk score
2. The higher the score, the more reliability checks the change has to pass as it moves through design, build, release, and operation

**[ADD IMAGE 5]**

### Risk decides how much rigor a change gets

We score every change like this:

Risk = probability × impact

Probability reflects how big and how new the change is, and how many dependencies it touches. Impact reflects which customer workflows it could break, how many customers it could reach, and how long recovery would take.

- Low risk: a change to an internal dashboard
- High risk: a control-plane migration that affects database creation

The score decides how many reliability checks a change has to pass. High-risk changes get more scrutiny, and low-risk changes stay fast.

### Reliability checks at every stage

Every change already goes through the same four stages: design, build, release, and operate. We added reliability checks to each one, scaled to the change's risk score, so that all three sources of failure get looked at before a change reaches customers.

### Design

Before we write much code, we ask how the change could fail:

- An AI skill we built reviews the design from a reliability point of view
- We give the change its risk score
- For high-risk changes, we run a premortem: we imagine the feature has already caused an incident, then work out how that could have happened and how to prevent it

### Build

While we write the code, we make sure the likely failures are tested and that we can undo the change:

- We review the code for reliability
- We run load and failure tests
- We check that rollback works

### Release

As we roll out, we watch the fleet and stop if the change misbehaves:

- We ramp up in stages
- The feature owner watches an SLO during the rollout
- High-risk changes go through an operational readiness review

### Operate

Once the change is live, the team that gets paged has to be able to run it:

- The feature owner hands over what the on-call team needs to know
- We run on-call drills
- The team reviews every dip in reliability, even the smallest

## What's next

The process we've described is already preventing incidents, and we're extending it with more analysis and more automation, including

- **Failure mode and effects analysis (FMEA):** we pick a component, imagine it failing, trace the impact on customers, and fix the weak spots before it happens.
- **Fault tree analysis (FTA):** we start from a failure customers would see and work backward to every component that could cause it.
- **Automated stress and failure testing:** we make load, limit, and recovery tests run on their own, so they don't depend on someone remembering to run them.

You trust us with your data and your uptime. We take that seriously. Reliability work doesn't have a finish line: we'll keep improving and sharing what we learn as we go.
