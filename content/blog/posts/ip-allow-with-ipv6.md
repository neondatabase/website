---
title: IP Allow with IPv6
description: Adding support for IPv6 for access control
excerpt: >-
  We’re Neon. We’re building Postgres that helps you confidently ship reliable
  and scalable apps. You can try Neon now for free. We recently added support
  for IPv6 addresses in the IP Allow feature. This post explains what IPv6 is
  and its benefits. IPv4 limitations IPv4 has been ar...
date: '2024-03-13T10:03:44'
updatedOn: '2024-03-25T11:32:59'
category: community
categories:
  - community
authors:
  - raouf-chebri
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/ip-allow-with-ipv6/cover.png'
  alt: null
isFeatured: false
seo:
  title: IP Allow with IPv6 - Neon
  description: Adding support for IPv6 for access control
  keywords: []
  noindex: false
  ogTitle: IP Allow with IPv6 - Neon
  ogDescription: >-
    We’re Neon. We’re building Postgres that helps you confidently ship reliable
    and scalable apps. You can try Neon now for free. We recently added support
    for IPv6 addresses in the IP Allow feature. This post explains what IPv6 is
    and its benefits. IPv4 limitations IPv4 has been around for almost half a
    century. It uses […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/ip-allow-with-ipv6/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/ip-allow-with-ipv6/image-5-18276193.png)

**We’re Neon. We’re building Postgres that helps you confidently ship reliable and scalable apps. You can** [try Neon now for free](https://console.neon.tech)**. We recently added support for IPv6 addresses in the IP Allow feature. This post explains what IPv6 is and its benefits.**

## IPv4 limitations

IPv4 has been around for almost half a century. It uses 32-bit addresses, which allows for about 4.3 billion unique addresses. While this number seemed more than sufficient in the early days of the internet, the explosive growth of the internet and the proliferation of smart devices have led to a situation where the world is running out of available IPv4 addresses. This limitation has prompted the need for a solution to accommodate the vast scale of the modern internet.

## The Solution: IPv6

IPv6 was developed to address the issue of IPv4 address exhaustion. It uses 128-bit addresses, which significantly expands the number of possible addresses to approximately 340 undecillion (3.4 × 10^38), a virtually inexhaustible supply for the foreseeable future. This vast expansion solves the primary problem of IPv4 address exhaustion, ensuring that every device on the internet can have a unique IP address.

Here is an example of an IPv6 address: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`

IPv6 addresses consist of 128 bits, representing 8 groups of 4 hexadecimal digits.

## Why support IPv6 addresses in IP Allow

IP Allow limits database access to only trusted IP addresses, preventing unauthorized access and helping maintain overall data security.

<img loading="lazy" decoding="async" width="624" height="380" src="https://lh7-us.googleusercontent.com/Yvj7G-G9tyb8n3-Va2yLYKAVId93wppHQXg0mi6pmL63ZmBtaddTtPOSmzG0XqAYruizKblkpYkDm4hQA6Bqr9g8cUye-CPpHnPv3ARCKDp6g4mATuIGlmEtY_ZBZxUN1uCKSdRVCIZuldvI-FNoA5U" alt="" />

Nowadays, most cloud providers allow you to design and deploy a global environment that leverages end-to-end IPv6 connectivity. AWS, for example, provides services with IPv6-only capabilities such as EC2 instances, Elastic Load Balancers, Amazon EKS, and others.

<Admonition type="note">
Dual-stack devices that support communicating over both IPv4 and IPv6 will often attempt to connect using IPv6 first. If the connection cannot be established over IPv6 (because the destination doesn't support IPv6, for example) the service will fall back to using IPv4.
</Admonition>

Adding IPv6 support to Neon allows you to overcome IPv4 limitations and build highly scalable architectures while maintaining backward compatibility with your existing IPv4 workloads. This is particularly useful for large-scale and containerized applications, allowing you to focus on migrating and scaling applications without devoting effort towards overcoming IPv4 limits.

Thanks for reading. We would love to get your feedback. Follow us on [X](https://x.com/neondatabase), join us on [Discord](https://neon.tech/discord), and let us know how we can help you build secure, reliable, and scalable applications.
