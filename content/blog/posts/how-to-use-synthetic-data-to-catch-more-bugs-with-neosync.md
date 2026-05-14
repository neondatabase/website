---
title: How to use Synthetic Data to catch more bugs with Neosync
description: >-
  A guide to developing robust, scalable and secure applications with Synthetic
  Data
excerpt: >-
  In today’s world, developers are under more pressure than ever to develop
  robust, scalable and secure applications that have no bugs and are performant.
  Users want their applications and software to work flawlessly and any sign of
  a bug or disruption in workflow can lead to a fru...
date: '2024-03-13T08:49:07'
updatedOn: '2024-03-27T11:50:05'
category: community
categories:
  - community
authors:
  - evis-drenova
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-use-synthetic-data-to-catch-more-bugs-with-neosync/cover.png
  alt: null
isFeatured: false
seo:
  title: How to use Synthetic Data to catch more bugs with Neosync - Neon
  description: >-
    A guide to developing robust, scalable and secure applications with
    Synthetic Data
  keywords: []
  noindex: false
  ogTitle: How to use Synthetic Data to catch more bugs with Neosync - Neon
  ogDescription: >-
    In today’s world, developers are under more pressure than ever to develop
    robust, scalable and secure applications that have no bugs and are
    performant. Users want their applications and software to work flawlessly
    and any sign of a bug or disruption in workflow can lead to a frustrated or
    even lost user. The challenge is […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-use-synthetic-data-to-catch-more-bugs-with-neosync/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-use-synthetic-data-to-catch-more-bugs-with-neosync/image-3-1024x576-6412513c.png)

In today’s world, developers are under more pressure than ever to develop robust, scalable and secure applications that have no bugs and are performant. Users want their applications and software to work flawlessly and any sign of a bug or disruption in workflow can lead to a frustrated or even lost user.

The challenge is that it’s really hard and time consuming to manually write test cases and test data in order to try to catch every edge case. Even then, it’s not perfect! A lot of teams will use their production data to test locally but this has a lot of privacy and security risks and by definition, you’re only using data that you’ve been able to successfully process. Which means that you’re not catching additional edge cases.

So then, as a developer, how can you be sure that you’re writing resilient code and developing a resilient application if you only have “happy path” data? The answer is that you really can’t. You need a better way to test and validate your systems.

This is where synthetic data can help you catch more bugs before you ship to production.

## What is Synthetic Data?

Synthetic data is artificially generated data that is statistically and structurally just like real-world data, without containing any actual sensitive or personal information. Synthetic data is typically created using a combination of machine learning models and simulation algorithms.

This data can be nearly statistically identical to the source data set. For example, if the source data set has an age column with a range of 70 and a mean of 25.8, we can use machine learning models to create an identical column of brand new data that also has a range of 70 and mean of 25.8. Machine learning models such as [CTGAN](https://proceedings.neurips.cc/paper/8953-modeling-tabular-data-using-conditional-gan.pdf) are great at learning the statistical properties of a set of data and replicating them with brand new data.

<br />Further, with synthetic data, we can replicate the structure of the source data set. This means preserving the [referential integrity](https://www.neosync.dev/blog/referential-integrity) or primary key and foreign key relationships, circular dependencies and other constraints.

Using a combination of machine learning and other algorithms we can replicate this structure in a data set such that you could easily import it into your current database without any problems. This is the power of synthetic data. The ability to create a data set that is statistically and structurally just like your production data without any of the privacy and security concerns.

## Using Synthetic data to catch more bugs

Synthetic data can be a powerful tool to catch more bugs before they get reported in production. Let’s take a look at three of the most common use cases.

### Generating diverse data to catch edge cases

Test driven development is more popular than ever which is a great thing for application resiliency. But the truth is that manually writing test cases can be tedious and really hard to anticipate every edge case. Most developers will test the happy path and then some edge cases before moving on.

This is where synthetic data can help. By generating a large and diverse set of data that would have taken days to manually write, you can check to make sure that your application can handle many different data types, formats and values.

The best part is that generating data can be really fast. For example, using Neosync, you can generate 10,000 rows of data for your Neon database in less than 30 seconds. It’s as simple as creating a connection to your Neon database and creating a job in Neosync. For more information, check out this [blog post.](https://www.neosync.dev/blog/neosync-neon-data-gen-job)

Ultimately, the end goal is that you can catch more bugs in your development and staging environments. Which means that you can ship a more resilient application.

### Using Synthetic data for automated testing

Synthetic data can take automated testing to the next level. Developers can set up automated test suites in their CI pipelines and point to a database that is hydrated with synthetic data to test their applications. Instead of using the same stale data set, developers can have brand new data generated every time, increasing the chances that they catch a bug before they ship to production.

If they do catch a bug, then they can replicate that bug locally by hydrating a development or local database with the same data set and start to debug the error. This workflow of testing locally with synthetic data and then testing in CI with synthetic data, is a great way to catch bugs and gain confidence in your application’s resiliency.

### Using Synthetic data to for performance testing

The last thing any developer wants is for their application to crash during a period of high-traffic. Imagine if Shopify crashed during Black Friday? For a company like Shopify, the problem is that they have a lot of sensitive data and can’t move their production data around easily without taking on a lot of privacy and security risk. So how do they get enough data for performance testing without worrying about privacy or security?

This is a perfect use case for synthetic data. Because synthetic data is artificially generated, you can create as much of it as you’d like. This makes performance testing a breeze and eliminates the privacy and security risks of handling production data. Just define how much data you need and then let the system create that data for you. You can then automatically ingest that into your application and monitor any performance issues without having to wait to see if it fails in production.

## Conclusion

Synthetic data is a great tool that developers can use to catch more bugs and ship more resilient applications. It’s a powerful way to test your applications functionality and performance without any of the privacy and security concerns of production data. The great thing is that synthetic data tools and platforms are only getting better, higher fidelity and faster which makes it even more compelling for developers to start considering it as part of their core workflow.
