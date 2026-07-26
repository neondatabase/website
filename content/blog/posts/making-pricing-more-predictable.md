---
title: Making pricing more predictable
description: Announcing Launch and Scale pricing for better predictability
excerpt: >-
  We created Neon with the idea of providing developers with a cloud-native
  Postgres that separates storage and compute to make the database more
  automated, more scalable, and more durable. After enrolling over half a
  million databases and nearly a year of listening to user feedbac...
date: '2024-02-19T19:16:41'
updatedOn: '2024-02-29T11:12:23'
category: company
categories:
  - company
authors:
  - stas-kelvich
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/making-pricing-more-predictable/cover.png
  alt: null
isFeatured: false
seo:
  title: Making pricing more predictable - Neon
  description: Announcing Launch and Scale pricing for better predictability
  keywords: []
  noindex: false
  ogTitle: Making pricing more predictable - Neon
  ogDescription: >-
    We created Neon with the idea of providing developers with a cloud-native
    Postgres that separates storage and compute to make the database more
    automated, more scalable, and more durable. After enrolling over half a
    million databases and nearly a year of listening to user feedback, we have
    learned a considerable amount with regard to what […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/making-pricing-more-predictable/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/making-pricing-more-predictable/image-31-1024x576-e6c35634.png)

We created Neon with the idea of providing developers with a cloud-native Postgres that separates storage and compute to make the database more automated, more scalable, and more durable.

After enrolling over half a million databases and nearly a year of listening to user feedback, we have learned a considerable amount with regard to what does and doesn’t work for developers. The key takeaway is that developers care deeply about predictable pricing that is easy to understand and manage.

## Challenges with predictability

In Neon, Postgres scales to zero upon idle activity. Bringing this advantage to developers by starting billing at $0 was a no-brainer from day one. However, one of the most common pieces of feedback was: “How much will my database cost at the end of the month?”.

We would jump on calls to explain the different metrics, point to our pricing calculator, and refer to our detailed [documentation](https://neon.tech/docs/introduction/about-billing), all to help customers better answer this question.

## We hate egress as much as you do

Another common pain point our customers shared was their confusion with our written data and data transfer billing metrics – both of which are related to egress/ingress within our architecture. The metrics were difficult to forecast and led to infrequent but large spikes in customer bills. We share your pain here, as we don’t like these surprises either.

At the end of the day, we learned that our model was causing unnecessary confusion and stress for our customers which was never our intention. So we decided to make a change. Why go through this great effort of trying to communicate something complex when we could just simplify the model to begin with?

## Launch and Scale pricing for better predictability

With over half a million databases running on our platform we have a much better understanding of the typical database workload which means we can design plans around those workloads to offer the predictability our customers have asked for.

The Launch plan includes all the usage and features required to service the needs of developers who are using Neon as they launch their MVP or even just using Neon as their development environment.

_Here is the compute usage (in daily Compute hours) from a real-world Launch plan customer:_

![Image](https://cdn.neonapi.io/public/images/pages/blog/making-pricing-more-predictable/78-1024x552-e5d89ebd.png)

For customers with larger production workloads that also have dev, staging, and testing environments, like [Branch](https://neon.tech/blog/branch-chose-neon-for-its-true-postgres-and-serverless-nature), the Scale plan provides all of the necessary resources and features to run their base workload while also allowing them to scale compute and storage as they grow without needing to worry about managing infrastructure.

_Here is the compute usage (in daily Compute hours) from a real-world Scale plan customer:_

![Image](https://cdn.neonapi.io/public/images/pages/blog/making-pricing-more-predictable/80-1024x552-7da8b686.png)

The Scale plan also includes security features important to production workloads. [Check out our pricing page](https://neon.tech/pricing) for a more detailed comparison.

## Fewer billing metrics

As part of our efforts to simplify our pricing, we are also happy to announce that we will be dropping our written data and data transfer fees, subject to our [acceptable use policy](https://neon.tech/docs/security/acceptable-use-policy), and will continue to find creative solutions to better manage our costs and pass those savings to our customers.

The new plans directly address our customers’ concerns by making their database spending more predictable.

## Final thoughts

We remain committed to offering a generous free tier to support your project until you’re ready to launch. This means Neon’s free tier will continue to be available in all the regions we support and require [no credit card to sign up](https://neon.tech/signup).

We have also listened to the community’s feedback and are moving more features, such as Project sharing, into the free tier.

Finally, these changes were made based on significant input from our customers. Thank you to everyone who provided feedback, and we welcome your continued insights at [feedback@neon.tech](mailto:feedback@neon.tech).
