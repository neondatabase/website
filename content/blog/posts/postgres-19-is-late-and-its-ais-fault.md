---
title: Postgres 19 is late, and it's AI's fault
description: LLMs are finding bugs faster than committers can fix them
excerpt: >-
  Over the past decade, the timing of Postgres major releases had become very
  predictable. This year is going to be different. Postgres 19 most likely
  won't be released until November.
date: '2026-10-21T12:00:00'
updatedOn: '2026-10-21T01:00:00.000Z'
category: postgres
categories:
  - postgres
authors:
  - robert-haas
cover:
  image: null
  alt: null
isFeatured: false
seo:
  title: Postgres 19 is late, and it's AI's fault - Neon
  description: LLMs are finding bugs faster than committers can fix them
  keywords: []
  noindex: false
  ogTitle: Postgres 19 is late, and it's AI's fault - Neon
  ogDescription: LLMs are finding bugs faster than committers can fix them
  image: null
---

Over the past decade, the timing of Postgres major releases had become very predictable: no earlier than the middle of September, and no later than the middle of October.

This year is going to be different. Postgres 19 most likely won't be released until November, and it's not impossible that the project could decide to postpone the release further.

Moreover, this year, several rather large features were reverted quite late in the beta period: [UPDATE/DELETE FOR PORTION OF, SQL Property Graph Queries (SQL/PGQ), and ALTER TABLE … MERGE PARTITION/SPLIT PARTITION](https://www.postgresql.org/about/news/postgresql-19-beta-1-released-3313/) were [all reverted](https://www.postgresql.org/about/news/postgresql-19-beta-4-released-3386/) between August 27 and September 15.

While major feature reverts are not especially uncommon immediately after feature freeze, which each year occurs on April 8, it is unusual to see multiple major features get pulled from the release at such a late date. 

So, what happened? Short answer: LLMs.

## LLMs made decades of Postgres bugs easy to find

All software contains bugs, and Postgres' code base is large, complex, and old. Our git history (converted from CVS!) now reaches back more than 30 years, and the first code was written a decade before that.

So, there's a huge amount of code, and that code contains a huge number of bugs. That's always been true, and it hasn't stopped Postgres from being popular or successful.

What's different now is that it's become vastly easier to find those bugs. Fixing them has also gotten easier, but not to the same degree - an LLM can draft a fix, but a committer still has to check that it's correct and meets the project's standards before it goes in.

<blockquote>
<p><strong>“LLMs are turning up forty years' worth of bugs in a matter of months, and every one of those fixes still has to be reviewed and committed by a human.”</strong></p>
</blockquote>

## Back-patched fixes are up more than 60% vs 2025

Between April 8th, 2025 and September 25, 2025, there were 1037 commits to PostgreSQL's [master branch](https://git.postgresql.org/gitweb/?p=postgresql.git;a=shortlog;h=refs/heads/master) and 724 commits to [REL_18_STABLE](https://git.postgresql.org/gitweb/?p=postgresql.git;a=shortlog;h=refs/heads/REL_18_STABLE). In 2026, during the same date range, there were 1443 commits to the master branch and 1169 commits to [REL_19_STABLE](https://git.postgresql.org/gitweb/?p=postgresql.git;a=shortlog;h=refs/heads/REL_19_STABLE).

In other words, if you look at the number of commits that went into the master branch only between feature freeze and September 25th, it actually declined slightly from last year to this year, but the number of [back-patched](https://www.postgresql.org/support/versioning/) commits jumped by more than 60%.

It's possible that some of this jump is the result of committers making more mistakes this year than they did last year, but I don't think anyone who works on the project really believes that's the main cause. Rather, it seems likely that [Postgres committers](https://wiki.postgresql.org/wiki/Committers) were about as conservative in 2026 as they were in preceding years, but a lot more of the mistakes they made were quickly found by LLMs.

And it isn't just mistakes in the latest release. In the same time period, during 2025, there were 248 commits to [REL_17_STABLE](https://git.postgresql.org/gitweb/?p=postgresql.git;a=shortlog;h=refs/heads/REL_17_STABLE), and during 2026, there were 433 commits to REL_18_STABLE. In other words, the number of commits being back-patched not just to the release in progress but also to at least one prior release jumped by more than 74% in a single year.

The reason for this is simply that a huge number of people on the Internet are now [reporting bugs](https://www.postgresql.org/docs/current/bug-reporting.html) in Postgres that they found using LLMs, and the Postgres committers have been very, very busy fixing them.

## So, why did the release slip?

In summary, two factors were at play here:

1. **Because so many more bugs are being found now, it takes more time to fix them.** LLMs can draft fixes, but those fixes aren't always correct or compliant with Postgres standards, and they still need to be reviewed and committed by humans, who have not gotten any smarter between 2025 and 2026.
2. **Time that would have been spent reviewing what went into the release got diverted** into addressing security issues and other bugs in the back-branches, and so it took longer to figure out what needed to be reverted before shipping v19.

## What this means for the future of Postgres

In the end, I don't think that the delay in shipping Postgres 19 is particularly concerning. It is not a long delay in the grand scheme of things, and it emerges directly from the project's concern for quality.

<blockquote>
<p><strong>“I became a Postgres developer partly because the Postgres code base is some of the cleanest and highest-quality code upon which I have ever had the privilege to work. The recent success of AI in finding bugs in that code base does not change my high estimation of it.”</strong></p>
</blockquote>

The long-term picture is less clear and in some ways more troubling: given that we have forty years of bugs that humans were unable to find but LLMs are quite capable of discovering, how are we ever going to catch up, and how will Postgres continue to innovate?

Right now, I'm not sure. What I do know is that I, and many others, are working really hard to figure it out.

I became a Postgres developer partly because the Postgres code base is some of the cleanest and highest-quality code upon which I have ever had the privilege to work. The recent success of AI in finding bugs in that code base does not change my high estimation of it. It is not perfect – no software product is – but if it had more defects visible even to human eyes, the number of things found by LLMs would likely be even greater.

<blockquote>
<p><strong>“Every feature that we write from now until the end of our careers will be scrutinized by AI, and things that would have escaped forever unnoticed in an earlier era will now be found, perhaps in a matter of hours.”</strong></p>
</blockquote>

But there's no escaping the fact that LLMs are going to require every Postgres developer – and to some extent, every software developer on earth – to raise their game. Every feature that we write from now until the end of our careers will be scrutinized by AI, and things that would have escaped forever unnoticed in an earlier era will now be found, perhaps in a matter of hours. That's both a challenge and an opportunity.
