---
title: AWS PrivateLink for Neon Databases
description: Keep your Postgres connections within AWS’s private network
excerpt: >-
  We just shipped Neon Private Networking, a feature that lets you connect to
  your Neon database through AWS PrivateLink with zero exposure to the public
  internet. If your infra is in AWS, this feature makes it much easier to meet
  your security and compliance requirements while enj...
date: '2025-03-05T00:02:46'
updatedOn: '2025-08-14T09:27:43'
category: product
categories:
  - product
  - company
authors:
  - anna-stepanyan
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/aws-privatelink-for-neon-databases/cover.jpg
  alt: null
isFeatured: true
seo:
  title: AWS PrivateLink for Neon Databases - Neon
  description: >-
    Private Networking is now available on Neon. Connect to your Neon database
    through AWS PrivateLink with zero exposure to the public internet.
  keywords: []
  noindex: false
  ogTitle: AWS PrivateLink for Neon Databases - Neon
  ogDescription: >-
    Private Networking is now available on Neon. Connect to your Neon database
    through AWS PrivateLink with zero exposure to the public internet.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/aws-privatelink-for-neon-databases/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/aws-privatelink-for-neon-databases/neon-aws-privatelink-for-neon-databases-1-1024x576-2721599f.jpg)

**We just shipped** [Neon Private Networking](https://neon.tech/docs/guides/neon-private-networking), **a feature that lets you connect to your Neon database through [AWS PrivateLink](https://aws.amazon.com/privatelink/) with zero exposure to the public internet.** If your infra is in AWS, this feature makes it much easier to meet your security and compliance requirements while enjoying Neon’s developer experience. Private Networking is available in our [Business and Enterprise](https://neon.tech/pricing) plans.

## Securing Connectivity Between AWS and Neon

If your infrastructure runs on AWS, you’re probably familiar with keeping services inside a VPC for security. Companies using Amazon RDS or Aurora typically deploy those databases in private subnets, ensuring that database traffic never leaves AWS’s internal network.

However, using a managed cloud database service outside your AWS account (like [Neon](https://neon.tech/home)) would mean your application had to connect over the public internet—and even with encryption, sending database queries over the internet can raise security flags. Compliance regulations might also demand guarantees that their data flows are contained within controlled networks, or internal policies might prohibit direct internet access for critical systems.

## How Neon Private Networking works

Neon Private Networking solves this problem by integrating Neon with AWS PrivateLink to provide a secure, private endpoint for your database. Instead of connecting to Neon over the internet, your application connects to an endpoint within your AWS environment that bridges directly to Neon:

1. Neon provides an AWS PrivateLink endpoint service in the same AWS region as your database.
2. You then create a VPC endpoint in your AWS VPC, and link it to Neon
3. Your application then routes all database queries through this private endpoint, where Neon’s isolated proxy forwards traffic securely to your database.

The entire setup is self-serve and easy to configure, and there’s no code changes required (your database connection string stays the same).

![Image](https://cdn.neonapi.io/public/images/pages/blog/aws-privatelink-for-neon-databases/ad4nxeumgeqhxu5eim2vxsifjzba28njwvf1nvs8vqrfa-yvglkw8zzyezdarztprq01f0derbhlkc4eyq2y3ijdthd9j-drmtph43nlb8zszt6boof28yabjn9f8lpec8wn7jyu4w-5e10441c.png)

## How to set it up

Getting started with Neon Private Networking is straightforward. You’ll need to create a VPC endpoint in your AWS account and link it to Neon’s AWS PrivateLink service. Once set up, your application will automatically route database queries through the private connection—no code changes needed.

For step-by-step instructions, [check out our Private Networking setup guide.](https://neon.tech/docs/guides/neon-private-networking)

## Wrap up

Neon’s Private Networking is available now for all customers on our Business and Enterprise plans. If you have questions, [contact us](https://neon.tech/contact-sales), and we’ll be happy to help.

---

_If you’re new to Neon, [sign up today](https://console.neon.tech/signup) and see how easy it is to run Postgres with built-in security, scalability, and a developer-friendly experience._<br />
