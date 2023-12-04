---
title: Security overview
enableTableOfContents: true
redirectFrom:
  - /docs/security/security
  - /docs/security
updatedOn: '2023-12-04T12:15:51.550Z'
---

At Neon, security is our highest priority. We are committed to implementing best practices and earning the trust of our users. A key aspect of earning this trust is by ensuring that every touchpoint in our system, from connections, to data storage, to our internal processes, adheres to the highest security standards.

## Secure connections

Neon requires that all connections use SSL/TLS encryption to ensure that data sent over the Internet cannot be viewed or manipulated by third parties.

Neon supports the `verify-full` SSL mode for client connections, which is the strictest SSL mode provided by PostgreSQL. When set to `verify-full`, a PostgreSQL client verifies that the server's certificate is issued by a trusted certificate authority (CA), and that the server host name matches the name stored in the certificate. This helps prevent man-in-the-middle attacks. For information about configuring `verify-full` SSL mode for your connections, see [Connect securely](/docs/connect/connect-securely).

In addition, Neon requires a 60-bit entropy password for all PostgreSQL roles. This degree of entropy ensures that passwords have a high level of randomness. Assuming a perfect distribution of choices for every bit of entropy, a password with 60 bits of entropy has 2^60 (or about 1.15 quintillion) possible combinations, which makes it computationally infeasible for attackers to guess the password through brute-force methods. For Neon users created via the Neon Console, API, and CLI, passwords are generated with 60-bit entropy. For SQL users created via SQL, user-defined passwords are validated at user-creation time to ensure 60-bit entropy.

## Data-at-rest encryption

Data-at-rest encryption is a method of storing inactive data that converts plaintext data into a coded form or cipher text, making it unreadable without an encryption key. Neon stores inactive data in [NVMe SSD volumes](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ssd-instance-store.html#nvme-ssd-volumes). The data on NVMe instance storage is encrypted using an `XTS-AES-256` block cipher implemented in a hardware module on the instance.

## Secure data centers

Neon’s infrastructure is hosted and managed within Amazon’s secure data centers backed by [AWS Cloud Security](https://aws.amazon.com/security/). Amazon continually manages risk and undergoes recurring assessments to ensure compliance with industry standards. For information about AWS data center compliance programs, refer to [AWS Compliance Programs](https://aws.amazon.com/compliance/programs/).

## SOC 2 compliance

Neon has successfully completed a SOC 2 Type 1 audit. For more information, see [SOC 2 compliance](soc2-compliance).

## Security reporting

Neon adheres to the [securitytxt.org](https://securitytxt.org/) standard for transparent and efficient security reporting. For details on how to report potential vulnerabilities, please visit our [Security reporting](/docs/security/security-reporting) page or refer to our [security.txt](https://neon.tech/security.txt) file.

## Questions about our security measures?

If you have any questions about our security protocols or would like a deeper dive into any aspect, our team is here to help. You can reach us at [security@neon.tech](mailto:security@neon.tech).
