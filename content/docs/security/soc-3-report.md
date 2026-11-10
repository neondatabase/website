---
title: SOC 3 report
subtitle: Controls relevant to security, availability, and confidentiality
summary: >-
  Neon's SOC 3 report covers the period December 1, 2023 to November 30, 2024.
  The independent service auditor's opinion, management's assertion, and the
  system disclosures describe how the Neon Platform meets the AICPA trust
  services criteria for security, availability, and confidentiality.
enableTableOfContents: true
---

The SOC 3 report is a public-facing summary of Neon's SOC 2 examination. It provides assurance to external parties that the Neon Platform meets the American Institute of Certified Public Accountants (AICPA) trust services criteria for security, availability, and confidentiality, without disclosing the sensitive control details found in a full SOC 2 report.

This page reproduces Neon's SOC 3 report for the period **December 1, 2023 to November 30, 2024**, prepared in accordance with attestation standards established by the AICPA. For the SOC 2 report and other audit documents, visit the [Trust Center](https://trust.neon.com/). For an overview of all Neon compliances, see [Compliance](/docs/security/compliance).

## Independent service auditor's report

To the Management of Neon Inc.
Wilmington, Delaware

### Scope

We have examined Neon Inc.'s (the Company) accompanying assertion titled "Assertion of Neon Inc.'s Management" (assertion) that the controls within the Neon Platform (the Platform) were effective throughout the period December 1, 2023 to November 30, 2024, to provide reasonable assurance that the Company's service commitments and system requirements were achieved based on the trust services criteria relevant to security, availability, and confidentiality (applicable trust services criteria) set forth in TSP 100, _2017 Trust Services Criteria for Security, Availability, Processing Integrity, Confidentiality, and Privacy_ (AICPA, _Trust Services Criteria_).

### Service organization's responsibilities

The Company is responsible for its service commitments and system requirements and designing, implementing, and operating effective controls within the Platform to provide reasonable assurance that the Company's service commitments and system requirements were achieved. The Company has provided the accompanying assertion titled "Assertion of Neon Inc. Management" about the effectiveness of controls within the Platform. When preparing its assertion, the Company is responsible for selecting and identifying in its assertion the applicable trust service criteria and for having a reasonable basis for its assertion by performing an assessment of the effectiveness of the controls within the Platform.

### Service auditor's responsibilities

Our responsibility is to express an opinion, based on our examination, on management's assertion that the controls within the Platform were effective throughout the period to provide reasonable assurance that the Company's service commitments and system requirements were achieved based on the applicable trust services criteria. Our examination was conducted following attestation standards established by the AICPA. Those standards require that we plan and perform our examination to obtain reasonable assurance about whether management's assertion is fairly stated in all material respects.

We believe the evidence we obtained is sufficient and appropriate to provide a reasonable basis for our opinion. We are required to be independent of the Company and to meet our other responsibilities in accordance with relevant ethical requirements relating to the engagement.

Our examination included:

- Obtaining an understanding of the system and the service organization's service commitments and system requirements.
- Assessing the risks that the description is not presented in accordance with the description criteria and that controls were not suitably designed or did not operate effectively.
- Performing procedures to obtain evidence about whether the description is presented in accordance with the description criteria.
- Performing procedures to obtain evidence about whether controls stated in the description were suitably designed to provide reasonable assurance that the service organization achieved its service commitments and system requirements based on the applicable trust services criteria.
- Testing the operating effectiveness of controls stated in the description to provide reasonable assurance that the service organization achieved its service commitments and system requirements based on the applicable trust services criteria.
- Evaluating the overall presentation of the description.

Our examination also included performing such other procedures as we considered necessary in the circumstances.

### Inherent limitations

There are inherent limitations in any system of internal control, including the possibility of human error and the circumvention of controls. Because of their nature, controls may not always operate effectively to provide reasonable assurance that the service organization's service commitments and system requirements were achieved based on the applicable trust services criteria. Also, the projection to the future of any conclusions about the suitability of the design or operating effectiveness of controls is subject to the risk that controls may become inadequate because of changes in conditions or that the degree of compliance with the policies or procedures may deteriorate.

### Opinion

In our opinion, management's assertion that the controls within the Platform were effective throughout the period December 1, 2023 to November 30, 2024, to provide reasonable assurance that the Company's service commitments and system requirements were achieved based on the applicable trust services criteria, is fairly stated, in all material respects.

_MJD Advisors_
Waukee, Iowa
December 13, 2024

## Assertion of Neon Inc. management

We, as management of Neon Inc., are responsible for designing, implementing, operating, and maintaining effective controls within the Platform throughout the period December 1, 2023 to November 30, 2024, to provide reasonable assurance that the Company's service commitments and system requirements relevant to security, availability, and confidentiality were achieved. We have described the boundaries of the Platform in the section titled "Management's System Disclosures" (the System Disclosures), which identifies the aspects of the Platform covered by our assertion.

We have performed an evaluation of the effectiveness of the controls within the Platform throughout the period December 1, 2023 to November 30, 2024, to provide reasonable assurance that the Company's service commitments and system requirements were achieved based on the trust services criteria relevant to security, availability, and confidentiality (applicable trust services criteria) set forth in TSP section 100, _2017 Trust Services Criteria for Security, Availability, Processing Integrity, Confidentiality, and Privacy_ (AICPA, _Trust Services Criteria_).

The Company's objectives for the Platform in applying the applicable trust services criteria are embodied in its service commitments and system requirements relevant to the applicable trust services criteria. The principal service commitments and system requirements related to the applicable trust services criteria are presented in the System Disclosures.

There are inherent limitations in any system of internal control, including the possibility of human error and the circumvention of controls. Because of these inherent limitations, a service organization may achieve reasonable, but not absolute, assurance that its service commitments and system requirements are achieved.

We assert that the controls within the Platform were effective throughout the period December 1, 2023 to November 30, 2024, to provide reasonable assurance that the Company's service commitments and system requirements were achieved based on the applicable trust services criteria.

Management of Neon Inc.
December 13, 2024

## Management's system disclosures

### Types of services provided

The Neon Platform (the Platform or Neon) is a fully managed, serverless, Postgres database service that is designed to offer instant branching, transparent and dynamic autoscaling, and virtually unlimited storage. The Platform is purpose-built for cloud deployment and substitutes the PostgreSQL storage layer by redistributing data across a cluster of nodes. Storage is physically separated from PostgreSQL compute instances, which enables Neon's autoscaling feature and offers additional performance advantages.

Neon Inc. is responsible for the development and maintenance of the Platform, which was publicly launched in June 2022. Services are deployed leveraging cloud-hosting infrastructure and made available as open-source software under the Apache 2.0 License. Code repositories are made available publicly through GitHub, and contributions may be made by the community, subject to a public code of conduct and the GitHub terms of service.

### Boundaries of the Platform

A system is designed, implemented, and operated to achieve specific business objectives according to management-specified requirements. The boundaries of the system described in this description include the system components related to the service life cycle, such as initiation, authorization, processing, recording, and reporting for the services provided to user entities. The system boundaries do not include instances in which transaction-processing information is combined with other information for secondary purposes internal to the service organization, such as accounting and billing.

#### Infrastructure

The Company's infrastructure is managed through a cloud hosting model with the primary services supported by Amazon Web Services (AWS) and Microsoft Azure (Azure) (the Cloud Providers). The Company leverages the Cloud Providers to scale quickly and securely as necessary to meet current and future demand. However, the Company is responsible for designing and configuring the Platform architecture within the cloud hosting environment to ensure security and resiliency requirements are met.

The specific services utilized to support the Platform's cloud infrastructure include the following:

**Cloud hosting services**

| Service                                                 | Description                                                                                        |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Amazon ECR, Azure Container Registry (ACR)              | Managed container registry                                                                         |
| Amazon EKS, Azure Kubernetes Service (AKS)              | Managed container service                                                                          |
| Amazon RDS, Azure Database for PostgreSQL               | Managed relational database service                                                                |
| AWS KMS, Azure Key Vault                                | Cryptographic key management                                                                       |
| Amazon GuardDuty, Logzio                                | Threat detection service                                                                           |
| AWS CloudTrail, Azure Monitor                           | Infrastructure audit logging                                                                       |
| AWS Elastic Compute Cloud, Azure Virtual Machines       | Compute service                                                                                    |
| AWS S3, Azure Blob Storage                              | Object storage                                                                                     |
| Amazon CloudFront, Azure Content Delivery Network (CDN) | Content delivery network                                                                           |
| Amazon Eventbridge, Azure Event Grid                    | Serverless event bus                                                                               |
| Amazon Route 53, Azure DNS                              | Domain name system                                                                                 |
| AWS Virtual Private Cloud, Azure Virtual Network        | Provides a logically isolated virtual network that uses network security groups to control traffic |

Certain controls of AWS and Azure are necessary in combination with the Company's controls to provide reasonable assurance that the Company's service commitments and system requirements are achieved based on the trust services criteria (Complementary Controls). The Company is responsible for the oversight and monitoring of AWS and Azure, which is performed through the vendor management policies and procedures.

The following are the applicable trust services criteria and controls that are necessary to be in place at AWS and Azure to provide reasonable assurance that the Company's service commitments and system requirements were achieved:

**Complementary controls**

| Criteria                                 | Control                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Logical and Physical Access (CC6 Series) | Procedures are implemented to authenticate authorized users, restrict physical and logical access, and detect unauthorized access attempts and procedures are implemented to decommission and physically destroy production assets securely. Security measures are implemented to provision and deprovision user access to systems and applications based on appropriate authorization, and encryption has been implemented, by default or as configured by the Company, to secure the transmission and storage of information. |
| System Operations (CC7 Series)           | Vulnerability scans and penetration testing are performed periodically to identify system vulnerabilities, and environmental protection, monitoring, and procedures for regular maintenance are implemented at the data center facilities. Incident response procedures are established and implemented to identify, analyze, and remediate events and incidents.                                                                                                                                                               |
| Change Management (CC8 Series)           | Procedures are established and implemented to ensure system changes are authorized, designed, developed, configured, documented, tested, and approved before production deployment.                                                                                                                                                                                                                                                                                                                                             |
| Availability (A Series)                  | Monitoring tools are implemented to monitor and manage the capacity and availability of hosting infrastructure. Environmental protections, data backup processes, and recovery mechanisms have been implemented and appropriately tested to adequately address availability requirements.                                                                                                                                                                                                                                       |

The examination performed by the independent service auditor did not extend to the policies, procedures, and controls of AWS and Azure.

#### Software

Software consists of the programs and software that support the Platform. The list of software and ancillary software used to build, support, secure, maintain, and monitor the Platform includes the following:

**Software summary**

| Application           | Purpose                                                               |
| --------------------- | --------------------------------------------------------------------- |
| Drata                 | Compliance management platform                                        |
| Snowflake             | Data warehouse service                                                |
| GitHub                | Source code repository                                                |
| GitHub Actions        | CI/CD                                                                 |
| GitHub Projects, Jira | Project management and issue tracking                                 |
| Terraform             | Infrastructure as code                                                |
| Google Workspace      | File storage, email, document collaboration, identity provider        |
| Teleport              | Infrastructure access management                                      |
| Cloudflare            | Web Application Firewall                                              |
| 1Password             | Password manager                                                      |
| PagerDuty             | Alerting                                                              |
| Slack                 | Communication hub                                                     |
| Grafana               | Observability platform for metrics, traces, and logs                  |
| VictoriaMetrics       | Metrics service                                                       |
| Segment               | Customer data platform                                                |
| Logz                  | Cloud SIEM                                                            |
| Orca, Oligo           | Cloud Native Application Protection Platform and Static Code Analysis |
| Jumpcloud             | Mobile Device Management                                              |

#### People

The Company's organizational structure provides the framework for the management, operation, and security of the Platform. The table below summarizes the key roles and functional responsibilities of the Company. Due to the Company's size, one individual may serve multiple roles.

**Organizational structure**

| Role                | Function                                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Board of Directors  | Responsible for governance, oversight of management, and major decision making, representing the interests of shareholders and includes members independent of management |
| CEO                 | Responsible for oversight of the development and performance of internal controls and the direction of company-wide activities                                            |
| ISO                 | Responsible for the design, development, maintenance, dissemination, and enforcement of the Information Security Program                                                  |
| Security Committee  | Cross-functional team responsible for oversight, implementation, and continual improvement of the Information Security Program                                            |
| Business Operations | Manages internal business needs such as human resources, customer success, and other administrative functions                                                             |
| Legal               | Responsible for compliance and legal functions of the Company, including external attorneys providing services under management supervision                               |
| Engineering Team    | Responsible for the development, testing, deployment, and maintenance of the Platform and for maintaining security                                                        |

#### Procedures

Procedures are the specific actions undertaken to implement a process, consisting of linked procedures designed to accomplish a particular goal. Policies, which serve as the basis of procedures, are management's statements of what should be done to meet system objectives and may be documented, explicitly stated in communications, or implied through actions and decisions. The Company has adopted the following defined set of information security standards and policies:

- Acceptable Use Policy
- Asset Management Policy
- Backup Policy
- Business Continuity Plan
- Change Management Policy
- Code of Conduct
- Data Classification Policy
- Data Retention Policy
- Data Protection Policy
- Disaster Recovery Plan
- Encryption Policy
- Incident Response Plan
- Information Security Policy
- Password Policy
- Physical Security Policy
- Reference Check Policy
- Responsible Disclosure Policy
- Risk Assessment Policy
- Software Development Lifecycle Policy
- System Access Control Policy
- Vendor Management Policy
- Vulnerability Management Policy

#### Data

Data refers to the transaction streams, files, data stores, tables, and output used or processed by the Company. Customer data is managed, processed, and stored in accordance with relevant data protection and other regulations and with specific requirements formally established with customers and business partners. The following table details the types of data collected by the Company in connection with the Platform's services and the infrastructure, software, and third-party vendors utilized to store and process the data.

**Data type summary**

| Type                  | Description                                                                                                                                                    | Storage and processing                                                               |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| User and account data | Personally Identifiable Information and other data from personnel, customers, users, and other third parties such as suppliers, vendors, and business partners | Amazon Web Services, Azure and other 3rd party technology providers                  |
| Customer data         | Confidential information stored and processed on behalf of customers in connection with services provided by the Platform                                      | AWS, Azure                                                                           |
| Secrets               | Access credentials, tokens, certificates, API keys, and other secrets                                                                                          | AWS KMS, Azure Key Vault                                                             |
| Log information       | Information relevant to and explicitly necessary for services, including metadata                                                                              | AWS CloudTrail, Azure Monitor with Diagnostic Logs, Grafana, VictoriaMetrics, Logzio |
| Analytics data        | Product usage and tracking data are sent to analytics services to analyze usage patterns and inform product decisions                                          | Segment, Snowflake                                                                   |

### Principal service commitments and system requirements

The information presented within the Boundaries of the Platform was prepared to describe the procedures and controls the Company implemented to manage the risks that threaten the achievement of the service organization's service commitments and system requirements. The disclosure of the principal service commitments and system requirements enables report users to understand the critical objectives that drive the system's operation.

#### Service commitments

Service commitments include those made to user entities and others (such as customers of user entities) to the extent those commitments relate to the trust services category or categories addressed by the description. Security objectives and commitments are made available to customers through information shared on the Company's website. The following summarizes the Company's principal service commitments that management believes to be relevant to the report users:

- The Company uses commercially reasonable physical, managerial, and technical safeguards designed to secure data from accidental loss and unauthorized access.
- Customer data is encrypted at rest and in transit.
- Access to critical resources and sensitive information requires multi-factor authentication and is provided based on the principle of least privilege.
- The Company continuously monitors access to its infrastructure.
- Automated backups of all customer and system data are performed daily.
- The Platform's services are hosted in multiple availability zones to protect from a single point of failure.
- Data is maintained and disposed of in accordance with regulatory and customer requirements.

#### System requirements

The Company's system requirements are communicated in system policies and procedures, system design documentation, and customer agreements. Information security policies define an organization-wide approach to protecting systems and data and include descriptions and expectations for the system's design, development, and operation. In addition to these policies, standard operating procedures have been prepared to describe specific manual and automated processes required to operate and develop services provided.

## Questions?

To learn more about how Neon protects your data and upholds the highest standards of security and privacy, visit the [Trust Center](https://trust.neon.com/), where you can also request and download audit reports. For an overview of all of Neon's compliances, see [Compliance](/docs/security/compliance).

- For security inquiries, contact [security@neon.tech](mailto:security@neon.tech).
- For privacy-related questions, reach out to [privacy@databricks.com](mailto:privacy@databricks.com).
