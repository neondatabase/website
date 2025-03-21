---
title: Security overview
enableTableOfContents: true
redirectFrom:
  - /docs/security/security
  - /docs/security
updatedOn: '2025-03-14T12:04:32.890Z'
---

At Neon, security is our highest priority. We are committed to implementing best practices and earning the trust of our users. A key aspect of earning this trust is by ensuring that every touchpoint in our system, from connections, to data storage, to our internal processes, adheres to the highest security standards.

## Secure connections

Neon supports a variety of protections related to database connections:

- **SSL/TLS encryption** — Neon requires that all connections use SSL/TLS encryption to ensure that data sent over the Internet cannot be viewed or manipulated by third parties.

  Neon supports the `verify-full` SSL mode for client connections, which is the strictest SSL mode provided by PostgreSQL. When set to `verify-full`, a PostgreSQL client verifies that the server's certificate is issued by a trusted certificate authority (CA), and that the server host name matches the name stored in the certificate. This helps prevent man-in-the-middle attacks. For information about configuring `verify-full` SSL mode for your connections, see [Connect securely](/docs/connect/connect-securely).

- **Secure password enforcement** — Neon requires a 60-bit entropy password for all Postgres roles. This degree of entropy ensures that passwords have a high level of randomness. Assuming a perfect distribution of choices for every bit of entropy, a password with 60 bits of entropy has 2^60 (or about 1.15 quintillion) possible combinations, which makes it computationally infeasible for attackers to guess the password through brute-force methods. For Postgres roles created via the Neon Console, API, and CLI, passwords are generated with 60-bit entropy. For Postgres roles created via SQL, user-defined passwords are validated at creation time to ensure 60-bit entropy.

- **The Neon Proxy** — Neon places a proxy in front of your database, which helps safeguard it from unauthorized login attempts. For example, in Postgres, each login attempt spawns a new process, which can pose a security risk. The [Neon Proxy](/docs/reference/glossary#neon-proxy) mitigates this by monitoring connection attempts and preventing misuse. The Neon Proxy also allows us to authenticate connections before they ever reach your Postgres database.

- **IP Allow** — For additional connection security, the Neon Scale and Business plans offer [IP allowlist support](#ip-allowlist-support), which lets you to limit access to trusted IPs.

- **Private Networking** — This feature enables connections to your Neon databases via AWS PrivateLink, bypassing the open internet entirely. See [Private Networking](/docs/guides/neon-private-networking).

## IP allowlist support

Neon's [IP Allow](/docs/introduction/ip-allow) feature, available with the Neon [Scale](/docs/introduction/plans#scale) and [Business](/docs/introduction/plans#business) plan, ensures that only trusted IP addresses can connect to the project where your database resides, preventing unauthorized access and helping maintain overall data security. You can limit access to individual IP addresses, IP ranges, or IP addresses and ranges defined with [CIDR notation](/docs/reference/glossary#cidr-notation). To learn more, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

## Protected branches

You can designate any branch as a "protected branch", which implements a series of protections:

- Protected branches cannot be deleted.
- Protected branches cannot be [reset](/docs/manage/branches#reset-a-branch-from-parent).
- Projects with protected branches cannot be deleted.
- Computes associated with a protected branch cannot be deleted.
- New passwords are automatically generated for Postgres roles on branches created from protected branches.
- With additional configuration steps, you can apply IP Allow restrictions to protected branches only. The [IP Allow](/docs/introduction/ip-allow) feature is available on the Neon [Scale](/docs/introduction/plans#scale) and [Business](/docs/introduction/plans#business) plans. See [below](#how-to-apply-ip-restrictions-to-protected-branches).
- Protected branches are not [archived](/docs/guides/branch-archiving) due to inactivity.

The protected branches feature is available on all Neon paid plans. Typically, the protected branch status is given to a branch or branches that hold production data or sensitive data. For information about how to configure a protected branch, refer to our [Protected branches guide](/docs/guides/protected-branches).

## Private Networking

The [Neon Private Networking](/docs/guides/neon-private-networking) feature enables secure connections to your Neon databases via [AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html), bypassing the open internet for enhanced security. This feature is available to Neon [Organization](/docs/manage/organizations) accounts. It's not accessible to Personal Neon accounts.

## Data-at-rest encryption

Data-at-rest encryption is a method of storing inactive data that converts plaintext data into a coded form or cipher text, making it unreadable without an encryption key. Neon stores inactive data in [NVMe SSD volumes](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ssd-instance-store.html#nvme-ssd-volumes). The data on NVMe instance storage is encrypted using an `AES-256` block cipher implemented in a hardware module on the instance.

## Secure data centers

Neon’s infrastructure is hosted and managed within either Amazon's or Azure's secure data centers, depending on the cloud service provider you select when setting up your project.

Amazon’s secure data centers backed by [AWS Cloud Security](https://aws.amazon.com/security/). Amazon continually manages risk and undergoes recurring assessments to ensure compliance with industry standards. For information about AWS data center compliance programs, refer to [AWS Compliance Programs](https://aws.amazon.com/compliance/programs/).

The Microsoft cloud data centers that power Azure focus on high reliability, operational excellence, cost-effectiveness, and a trustworthy online experience for Microsoft customers and partners worldwide. Microsoft regularly tests data center security through both internal and third-party audits. To learn more, refer to [Microsoft's Datacenter security overview](https://learn.microsoft.com/en-us/compliance/assurance/assurance-datacenter-security).

## Compliance-relevant security measures

At Neon, we implement robust technical controls to secure customer and sensitive data in alignment with SOC2, ISO27001, ISO27701 standards and GDPR and CCPA regulations. To learn more about these standards and regulations, see [Compliance](/docs/security/compliance).

All systems are hosted on AWS and Azure, where we have implemented specific security measures to protect data. Below is a detailed breakdown of these compliance-relevant security measures for access control, encryption, network security, event logging, vulnerability management, backups, data deletion and retention:

- **Customer and Sensitive Data Encryption (AWS KMS and Azure Key Vault)**

  All customer and sensitive data is encrypted using AES-256 encryption at rest. For data in transit, encryption is enforced using TLS 1.2/1.3 protocols across various services. Encryption keys are managed using AWS Key Management Service (KMS) and Azure Key Vault with key rotation policies in place. Only services and users with specific IAM roles can access the decryption keys, and all access is logged via AWS CloudTrail and Azure Monitor for auditing and compliance purposes.

- **Fine-Grained Access Control via IAM**

  Access to PII and customer or sensitive data is controlled through AWS Identity and Access Management (IAM) policies and Microsoft Entra ID permissions. Broad access is limited to the infrastructure and security teams, while other roles operate under least-privilege principles. When additional access needed, access requests to production systems are received via Teleport, where all sessions are recorded. Only managers and on-call personnel are permitted to access production or approve production access requests.

  Additionally, all infrastructure is managed through Terraform, ensuring that any changes to access controls or resources are fully auditable and version-controlled. Regular access reviews and audits are conducted to verify that access rights remain aligned with security best practices.

- **Data Segmentation and Isolation Using VPCs and Security Groups**

  In our AWS and Azure environments, workloads are segmented using Virtual Private Clouds (VPCs) and Azure Virtual Networks (VNets) to separate sensitive data environments from other systems. We control network access between services by using security groups, Network Access Control Lists (NACLs) and Azure Network Security Groups (NSGs), restricting access to only the necessary traffic. This ensures a clear separation of environments, minimizing the risk of unauthorized access or lateral movement between services.

- **Event-Based Data Anomaly Detection via AWS GuardDuty and Logz.io**

  Customer data access attempts and other anomalies are continuously monitored via Logzio integration on both infrastructures. All alerts are ingested into our Logz.io SIEM for centralized logging, analysis, and correlation with other security data. This allows our Security Operations Center (SOC) to quickly detect, investigate, and respond to potential security threats.

- **Data Access Logging and Auditing (AWS CloudTrail & Logz.io)**

  All data access actions, including those involving sensitive operations, are logged using AWS CloudTrail and Azure Monitor, and forwarded to Logz.io for centralized logging and analysis. This provides full traceability of who accessed which resources, when, and from where. Logs are secured and retained for audit purposes, while any anomalies or suspicious activity trigger real-time alerts through our Security Operations Center (SOC) for immediate investigation and response.

- **PII Backup, Retention, and Deletion Policies with S3 Versioning**

  Customer data backups are stored in cloud object storage, such as Amazon S3 and Azure Blob Storage, with versioning enabled, allowing recovery from accidental deletions or modifications. Data is encrypted using server-side encryption (SSE) and is retained for 30 days. Data deletion is followed to ensure compliance with SOC2, ISO, GDPR and CCPA requirements, including data subject requests.

- **Vulnerability Management with Orca and Oligo**

  Our vulnerability management program, integrated with Orca and Oligo, continuously scans all AWS and Azure environments for security issues, including misconfigurations, unpatched software, and exposed credentials. We leverage tagging to classify certain data types, enabling focused monitoring and scanning based on the sensitivity of the data. Automated alerts allow us to address vulnerabilities before they pose a risk to PII or other sensitive information. The vulnerabilities are remediated according to the defined SLAs to reduce the risk.

- **Annual Audits and Continuous Penetration Testing**

  We undergo annual audits for SOC2 and ISO by two independent firms to verify the integrity and security of our systems. In addition, bi-annual penetration tests with Hackerone are performed, with results feeding into our vulnerability management program. The vulnerabilities are remediated according to the defined SLAs to reduce the risk.

To learn more about how we protect your data and uphold the highest standards of security and privacy, please visit our [Trust Center](https://trust.neon.tech/).

## GitHub secret scanning

Neon is a [GitHub Secret Scanning Partner](https://docs.github.com/en/code-security/secret-scanning/secret-scanning-partner-program). If a Neon database credential or API key is detected in a GitHub repository, GitHub alerts Neon through an automated system. This system validates the credential and notifies our security team.

By integrating with GitHub Secret Scanning, Neon helps users quickly identify and mitigate exposed credentials, reducing the risk of unauthorized access.

To avoid leaking secrets, follow these security best practices:

- Use environment variables instead of hardcoding credentials.
- Store sensitive information in secret management tools like AWS Secrets Manager or HashiCorp Vault.
- Regularly rotate database credentials and API keys.

If you have questions about this integration or need help securing your credentials, contact us at `security@neon.tech`.

## Security reporting

Neon adheres to the [securitytxt.org](https://securitytxt.org/) standard for transparent and efficient security reporting. For details on how to report potential vulnerabilities, please visit our [Security reporting](/docs/security/security-reporting) page or refer to our [security.txt](https://neon.tech/security.txt) file.

Neon also has a [private bug bounty program with Hackerone](/docs/security/security-reporting#bug-bounty-program-with-hackerone).

## Questions about our security measures?

If you have any questions about our security protocols or would like a deeper dive into any aspect, our team is here to help. You can reach us at [security@neon.tech](mailto:security@neon.tech).
