---
title: What is a Serverless Database?
description: >-
  A consistent question we get asked is "What do you mean by Serverless?" Buckle
  in and we'll take a drive from racks in datacenters to the serverless database
  platform we've built at Neon.
excerpt: >-
  We recently sponsored All Things Open 2023, and a consistent question that
  people asked at the stand was, “What is Serverless?”. Proof that knowledge
  distributes unevenly across the Internet. Given that AWS Lambda launched in
  2014, some might be surprised that this question is st...
date: '2023-11-22T13:25:00'
updatedOn: '2024-03-01T14:25:35'
category: community
categories:
  - community
authors:
  - joe-drumgoole
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/what-is-a-serverless-database/cover.jpg
  alt: null
isFeatured: false
seo:
  title: What is a Serverless Database? - Neon
  description: >-
    A consistent question we get asked is "What do you mean by Serverless?"
    Buckle in and we'll take a drive from racks in datacenters to the serverless
    database platform we've built at Neon.
  keywords: []
  noindex: false
  ogTitle: What is a Serverless Database? - Neon
  ogDescription: >-
    We recently sponsored All Things Open 2023, and a consistent question that
    people asked at the stand was, “What is Serverless?”. Proof that knowledge
    distributes unevenly across the Internet. Given that AWS Lambda launched in
    2014, some might be surprised that this question is still being asked. I
    guess it is hard to make a […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/what-is-a-serverless-database/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/what-is-a-serverless-database/image-3778bdbf.png)

We recently sponsored [All Things Open 2023](https://2023.allthingsopen.org/), and a consistent question that people asked at the stand was, “What is Serverless?”. Proof that knowledge distributes unevenly across the Internet. Given that AWS Lambda launched in 2014, some might be surprised that this question is still being asked. I guess it is hard to make a collective leap from serverless functions to serverless databases.

So before we dive into a definition of serverless, let’s define serverfull, which is the default for most services on the internet. In a Serverfull architecture, the default is that when you spin up a service in the cloud, you are responsible for specifying all the parameters of its operation. This typically includes the type of CPU, the total memory, the IOPs required, and the network bandwidth expected.

This is one automation step away from buying a server and putting it in a rack in your favorite data center. The reason the cloud approach was such a giant leap was made clear to me several years ago when I was talking to a very large customer in my previous company. We were wondering how to increase the performance of our tool, and I casually suggested running it on a bigger box as a short-term solution. He looked me in the eye and explained that deploying a new physical server in their data center was a six-month process — so much for the short term.

This was the big early win for cloud computing, near-instantaneous access to scale. However, as we gorged ourselves in the [AWS sweet shop](https://aws.amazon.com/console/), we committed the first great sin of cloud computing: over-provisioning. It is challenging for a human to accurately predict the load on a server or database over time. As a result, we end up provisioning for the maximum load we expect. This doesn’t seem like such a bad idea until you realize that this over-provisioning is a microcosm of the old skool problems created by buying the biggest box you might need for the next few years of load. IBM, HP, Hitachi, and Amdahl all become multi-billion dollar businesses trading on that ignorance.

When I first adopted AWS EC2 in 2007 and ran Postgres on it, we provisioned an M50 server in production. Why? Well, why not? We had no clue what the offered load would be in our startup. We soon discovered that this server was barely running at 10% load, even at our busiest times. We eventually scaled down to an M20 server, reducing our overall bill by 50%. We also realized that turning off the developer EC2 instances when they weren’t working could result in similar reductions in cost. Bingo, crontab jobs also reduced our development costs by around 50% as well.

![Image](https://cdn.neonapi.io/public/images/pages/blog/what-is-a-serverless-database/uji80em-bjnaxemyhrize1lcceplfr720niy5lfde5jvjdpwx2m1vbdlxkeplhjnxayd-krulsafgq-1poijcbmcbmygyhgv02pwqkr43su-lgoozxx1szjjqytpnvya6cgxiurdbmmss2cg4hiue-aae3c4f0.png)

These were crude approximations, and we were a startup that scrutinized our costs closely. Now, imagine you are a large development organization like a bank, with global development happening in New York, London, and Tokyo. How do they both offer flexibility to their teams to control their own budgets and yet continue to maintain local autonomy? It’s hard; those teams are focused on delivering value, not saving money.

Serverless is all about this: take away the pain of guesstimate scaling and let the platform do the heavy lifting. A computer can detect and respond almost instantaneously to both increasing and decreasing load and respond accordingly. This is the essence of serverless; there are servers, but the developer only needs to focus on the service, not the endless whack-a-mole of scaling up and down. It’s not just somebody else’s servers; it’s somebody else’s problem.

Scaling up and down is where it starts. Still, the real value of serverless starts to be felt when developers realize with an [API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) and a [command line tool](https://neon.tech/docs/reference/neon-cli) at their fingertip, they can spin up new databases and [database branches](https://neon.tech/docs/introduction/branching) instantaneously. No more raising tickets, talking to DBAs, speculating about disk space and load. The introduction of a complete serverless Platform abstracts away all the historical operational and administrative burdens of developing on Postgres.

When you [take something stateful like a database and make it serverless](https://twitter.com/nikitabase/status/1725394843285766463), the motivation is the same as any other serverless transition (remove operational drudgery), but the result is different. Functions As A Service platforms like Lambda took server-side application logic serverless. This meant nobody had to think about managing pools of workers, job queues, etc. But as a side-effect, much of the high-concurrency strengths of Node.js were rendered moot, and most people don’t see Lambda as remarkably more resource-efficient than the old server full way. For databases, the appeal of serverless is not babysitting a server, not creating a replica and sweating failover scenarios, and not thinking about maintenance windows. The resource efficiency of serverless databases is the cherry on top: You don’t waste time on operational work, and we don’t waste budget on over-provisioned resources.

At Neon, we believe that the database should just be a URL. We built it to be serverless from day one, not an afterthought that is chasing the latest fashion. Serverless functions may not be for [everyone](https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90), but Serverless databases are here to stay. While serverless works well for the individual development shop, when it comes to fleet management of Postgres for a partner, it’s a game changer. It’s much easier to manage a free tier for a large pool of early-stage tire kickers when the database goes away when they do. The savings can be dramatic.

The modern mantra is “Just use Postgres”. We suggest you just use [Neon Serverless Postgres](https://neon.tech/).

_Tip o’ the hat to Andy_ _Hattemer for some excellent additions to this piece._
