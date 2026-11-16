---
title: Compliance
summary: >-
  Neon holds SOC 2 Type 1 and Type 2, SOC 3, ISO 27001, ISO 27701, GDPR,
  CCPA, and HIPAA certifications. Each is validated by independent audits or
  regulatory adherence. HIPAA compliance is available on the Scale plan. Neon
  isn't PCI DSS compliant.
  Audit reports for all certifications can be requested through the Neon
  Trust Center at trust.neon.com.
enableTableOfContents: true
redirectFrom:
  - /docs/security/soc2-compliance
updatedOn: '2026-11-11T13:15:40.948Z'
---

At Neon, we prioritize data security and privacy, and we have achieved several key compliances that validate our efforts. We have completed audits for SOC 2 Type 1 and Type 2, SOC 3, ISO 27001, and ISO 27701, and we adhere to GDPR and CCPA regulations.

## SOC 2

We have successfully attained SOC 2 Type 1 and Type 2 compliance. These compliances, validated by independent auditors, confirm that our systems adhere to the American Institute of Certified Public Accountants (AICPA) trust service criteria for security, availability, processing integrity, confidentiality, and privacy.

## SOC 3

The SOC 3 report is a public-facing version of the SOC 2 report, providing assurance to external parties about our system's ability to meet the trust service criteria without disclosing sensitive details. You can read the full [SOC 3 report](/docs/security/soc-3-report) or download the document through our [Trust Center](https://trust.neon.com/).

## ISO 27001

ISO 27001 is an internationally recognized standard for information security management systems (ISMS). Our compliance with this standard demonstrates that we follow a systematic and risk-based approach to managing sensitive information, ensuring its security.

## ISO 27701

ISO 27701 extends ISO 27001 to include data privacy requirements, helping organizations establish, implement, and maintain a privacy information management system (PIMS) in accordance with GDPR and other privacy laws.

## GDPR

The General Data Protection Regulation (GDPR) is the European Union's regulation designed to protect individuals' privacy and personal data. Neon adheres to GDPR requirements, ensuring the rights and data privacy of our users across the EU.

## CCPA

The California Consumer Privacy Act (CCPA) grants California residents new rights regarding their personal data. Neon is committed to complying with CCPA, ensuring transparency and control for users over their personal information.

## HIPAA

Neon offers HIPAA compliance as part of our Scale plan, enabling applications that handle Protected Health Information (PHI) to meet compliance requirements. more information and how to get started, refer to our [Neon HIPAA Compliance Guide](/docs/security/hipaa).

A copy of Neon's HIPAA compliance report can be requested through our [Trust Center](https://trust.neon.com/).

## PCI DSS

Neon isn't PCI DSS compliant at this time. Don't store or process payment cardholder data in Neon.

If you need a PCI DSS compliant Postgres database, [Lakebase](https://docs.databricks.com/aws/en/oltp/), Databricks-managed Postgres, supports [PCI DSS](https://docs.databricks.com/aws/en/security/privacy/pci) in supported AWS regions.

## How Neon protects your data

This section describes the controls Neon runs on its own infrastructure. For the controls you configure yourself, see [Security overview](/docs/security/security-overview).

### The Neon Proxy

Neon places a proxy in front of your database, which helps safeguard it from unauthorized login attempts. For example, in Postgres, each login attempt spawns a new process, which can pose a security risk. The [Neon Proxy](/docs/reference/glossary#neon-proxy) mitigates this by monitoring connection attempts and preventing misuse. The Neon Proxy also allows us to authenticate connections before they ever reach your Postgres database.

### Data-at-rest encryption

Data-at-rest encryption is a method of storing inactive data that converts plaintext data into a coded form or cipher text, making it unreadable without an encryption key. Neon stores inactive data in [NVMe SSD volumes](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ssd-instance-store.html#nvme-ssd-volumes). The data on NVMe instance storage is encrypted using an `AES-256` block cipher implemented in a hardware module on the instance.

### Secure data centers

Neon’s infrastructure is hosted and managed within either Amazon's or Azure's secure data centers, depending on the cloud service provider you select when setting up your project.

Amazon’s secure data centers backed by [AWS Cloud Security](https://aws.amazon.com/security/). Amazon continually manages risk and undergoes recurring assessments to ensure compliance with industry standards. For information about AWS data center compliance programs, refer to [AWS Compliance Programs](https://aws.amazon.com/compliance/programs/).

The Microsoft cloud data centers that power Azure focus on high reliability, operational excellence, cost-effectiveness, and a trustworthy online experience for Microsoft customers and partners worldwide. Microsoft regularly tests data center security through both internal and third-party audits. To learn more, refer to [Microsoft's Datacenter security overview](https://learn.microsoft.com/en-us/compliance/assurance/assurance-datacenter-security).

### Compliance-relevant security measures

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

  Our vulnerability management program, integrated with Orca and Oligo, continuously scans all AWS and Azure environments for security issues, including misconfigurations, unpatched software, and exposed credentials. We use tagging to classify certain data types, enabling focused monitoring and scanning based on the sensitivity of the data. Automated alerts allow us to address vulnerabilities before they pose a risk to PII or other sensitive information. The vulnerabilities are remediated according to the defined SLAs to reduce the risk.

- **Annual Audits and Continuous Penetration Testing**

  We undergo annual audits for SOC2 and ISO by two independent firms to verify the integrity and security of our systems. In addition, bi-annual penetration tests with Hackerone are performed, with results feeding into our vulnerability management program. The vulnerabilities are remediated according to the defined SLAs to reduce the risk.

## Questions?

To learn more about how we protect your data and uphold the highest standards of security and privacy, please visit our [Trust Center](https://trust.neon.com/), where you can also request and download audit reports.

For privacy-related questions, reach out to [privacy@databricks.com](mailto:privacy@databricks.com).
