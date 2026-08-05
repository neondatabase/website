---
title: "Product Specific Schedule (Neon)"
template: Static
seo:
  title: "Product Specific Schedule (Neon)"
  metaDesc: ""
  metaKeywords: ""
  metaRobotsNoindex: true
  opengraphTitle: "Product Specific Schedule (Neon) - Neon"
  opengraphDescription: ""
  twitterImage: ""
---

**Product Specific Schedule (Neon)**

Last Updated: August 5, 2026

This Product Specific Schedule (Neon) (this "**Schedule**") is entered into as of the Effective Date between Databricks, Inc., the parent company of Neon, LLC ("**Databricks**"), and Customer and governs Customer's use of Databricks' Neon product family of cloud computing platform services, as described in the Documentation (the "**Platform Services**", for purposes of this Schedule). By accessing the Platform Services, Customer agrees to the terms of this Schedule. If you are entering into this Schedule on behalf of a company (such as your employer) or other legal entity, you represent and warrant that you are authorized to bind that entity to this Schedule, in which case "**Customer**" will refer to that entity (otherwise, "Customer" refers to you as an individual).

This Schedule is subject to the terms of the then-current Databricks Master Cloud Services Agreement located at [https://www.databricks.com/legal/mcsa](https://www.databricks.com/legal/mcsa) (the "**Agreement**"), as supplemented and amended by this Schedule, solely with respect to a Customer's use of the Platform Services. Customer acknowledges that Databricks may make changes to the Agreement, this Schedule, and pricing from time to time, and Customer's continued use of the Platform Services will constitute consent to such changes.

For clarity, this Schedule does not affect the terms of the Agreement as they relate to services provided by or on behalf of Databricks other than Platform Services. Capitalized terms not defined here will have the meanings specified in the Agreement. For purposes of this Schedule, all references under the Agreement to the "Platform Services" and the "Databricks Services" will be deemed references to the "Platform Services" as defined in this Schedule. In the event of any conflict or inconsistency between this Schedule and the Agreement, solely with respect to Customer's use of the Platform Services, this Schedule will control.

1.  **Self-Service Plans.** The Platform Services will be provided according to the usage-based pricing plan selected by Customer, as described in the Documentation at [https://neon.com/docs/introduction/plans](https://neon.com/docs/introduction/plans), or successor URL (such plans, together with any legacy plans, a "**Self Service Plan**"). Customer's subscription to any Self Service Plan will automatically renew on a month-to-month basis (each, a "**Subscription Month**"), unless Customer cancels its subscription to such Self Service Plan within fourteen (14) business days prior to the expiration of the then-current Subscription Month.
2.  **Fees.** Fees will be billed by Databricks (or its affiliate, Neon, LLC on Databricks' behalf). Except as otherwise specified in an Order, Fees (a) will be determined based on the Self Service Plan selected by Customer and calculated based on Customer's usage of the Platform Services during each Subscription Month, (b) will be invoiced monthly in arrears with payment invoiced and due on or around the first day of the calendar month following each Subscription Month, and (c) will be automatically charged to Customer's payment card on record.
3.  **Amendments to the Agreement:**
    1.  **Documentation**. All references in the Agreement to the "Documentation" shall be deemed references to the documentation related to the Platform Services located at [https://neon.com/docs](https://neon.com/docs).
    2.  **Subprocessor List.** The Platform Services use Grafana Labs located in the United States for infrastructure services in addition to all other listed subprocessors located at [https://www.databricks.com/legal/databricks-subprocessors](https://www.databricks.com/legal/databricks-subprocessors).
    3.  **Security Addendum.** All references in the Agreement to the "Security Addendum" or "Security Measures" shall be deemed references to the security addendum and security measures attached hereto as Exhibit A.
    4.  **Audit**. Section 7 (Audits and Records) of the DPA is hereby deleted in its entirety and replaced with the following: "Databricks, together with its Affiliates, will make information reasonably necessary to demonstrate compliance with this DPA available to Customer and allow for and contribute to audits, including inspections conducted by Customer or Customer's auditor in order to assess compliance with this DPA, where required by applicable law. Customer acknowledges and agrees that Customer will exercise Customer's audit rights under this DPA by instructing us to comply with the audit measures described in this provision. Upon request, Databricks, together with its Affiliates, will supply (on a confidential basis) the SOC 2 report for the Platform Services and summary copies of the penetration testing report(s) to Customer so that Customer can verify compliance with this DPA."
    5.  **Service Specific Terms.** All references in the Agreement to the Service Specific Terms are hereby deleted.
    6.  **Projects**. All references in the Agreement to "Workspaces" shall be deemed to include any projects created by Customer within the Platform Services.
    7.  **Cardholder Data.** Customer acknowledges and agrees it shall not include in Customer Content any cardholder data as defined under PCI-DSS.
4.  **SLA**. Notwithstanding anything to the contrary, the Service Level Agreement located at [https://neon.com/neon-business-sla](https://neon.com/neon-business-sla) shall be incorporated into this Schedule by reference and apply exclusively to Customers who have subscribed to the Scale Self Service Plan.

**Exhibit A -- Security Measures**

Databricks, shall implement reasonable administrative, physical, and technical safeguards to protect the security of the Platform Services and the Customer Content as set forth in this Exhibit A ("**Security Measures**"). While Databricks may update the Security Measures, it shall not materially diminish the effectiveness of the Security Measures during the term of an Order. All capitalized terms not otherwise defined herein will have the meanings as set forth in the Agreement.

1.  **Access Control.**
    1.  Preventing Unauthorized Product Access
        1.  Outsourced processing. Databricks hosts the Platform Services on an outsourced cloud infrastructure provider, according to a shared responsibility model.
        2.  Physical and environmental security. Databricks hosts our product infrastructure with multi-tenant, outsourced infrastructure providers. Databricks does not own or maintain hardware located at the outsourced infrastructure providers' data centers. Production servers and client-facing applications are logically and physically secured from our internal corporate information systems.
        3.  Authentication. Databricks implements a uniform authentication policy for our customer products. Customers who interact with the products via the user interface must authenticate before accessing Customer Content.
        4.  Authorization. Customer Content is stored in multi-tenant storage systems accessible to Customers via only application user interfaces and application programming interfaces. Customers are not allowed direct access to the underlying application infrastructure. The authorization model in each of our products is designed to ensure that only the appropriately assigned individuals can access relevant features, views, and customization options. Authorization to data sets is performed through validating the user's permissions against the attributes associated with each data set.
        5.  Application Programming Interface (API) access: Public product APIs can be accessed using an API key or through Oauth authorization.
    2.  Preventing Unauthorized Use. Databricks implements industry standard access controls and detection capabilities for the internal networks that support its products.
        1.  Access controls. Network access control mechanisms are designed to prevent network traffic using unauthorized protocols from reaching the product infrastructure. The technical measures implemented differ between infrastructure providers and include Virtual Private Cloud (VPC) implementations, security group assignment, and traditional firewall rules.
        2.  Intrusion detection and prevention. Databricks implements a Web Application Firewall (WAF) solution to protect hosted customer websites and other internet-accessible applications. The WAF is designed to identify and prevent attacks against publicly available network services.
        3.  Static code analysis. Code stored in our source code repositories is checked for best practices and identifiable software flaws using automated tooling.
        4.  Penetration testing. Databricks maintains relationships with industry-recognized penetration testing service providers for penetration testing of the Neon web application, API, and proximity and authentications flows at least annually. The intent of these penetration tests is to identify security vulnerabilities and mitigate the risk and business impact they pose to the in-scope systems.
    3.  Limitations of Privilege & Authorization Requirements.
        1.  Product access. A subset of our employees have access to the products and to customer data via controlled interfaces. The intent of providing access to a subset of employees is to provide effective customer support, product development and research, to troubleshoot potential problems, to detect and respond to security incidents and implement data security. Access is enabled through "just in time" (JITA) requests for access; all such requests are logged. Employees are granted access by role, and reviews of high risk privilege grants are initiated as needed. Administrative or high risk access permissions are reviewed at least annually.
        2.  Reference checks. Where permitted by applicable law, employees of Databricks and our affiliates undergo reference checks. All employees are required to conduct themselves in a manner consistent with company guidelines, non-disclosure requirements, and ethical standards.
2.  Transmission Control
    1.  In-transit. Databricks requires HTTPS encryption (also referred to as SSL or TLS) on all login interfaces. Our HTTPS implementation uses industry standard algorithms and certificates.
    2.  At-rest. Databricks stores user passwords following policies that follow industry standard practices for security. Databricks has implemented technologies to ensure that stored data is encrypted at rest.
3.  Input Control.
    1.  Detection. Databricks designed our infrastructure to log extensive information about the system behavior, traffic received, system authentication, and other application requests. Internal systems aggregate log data and alert appropriate employees of malicious, unintended, or anomalous activities. Our personnel, including security, operations, and support personnel, are responsive to known incidents.
    2.  Response and tracking. Databricks maintains a record of known security incidents that includes description, dates and times of relevant activities, and incident disposition. Suspected and confirmed security incidents are investigated by security, operations, or support personnel; and appropriate resolution steps are identified and documented. For any confirmed incidents, Databricks will take appropriate steps to minimize product and Customer damage or unauthorized disclosure. Notification to Customer will be in accordance with the terms of the Agreement.
4.  Availability Control.
    1.  Online replicas and backups. Where feasible, production databases are designed to replicate data between no less than 1 primary and 1 secondary database. All databases are backed up and maintained using at least industry standard methods.
    2.  Disaster Recovery Plans. Databricks maintains and regularly test disaster recovery plans to help ensure availability of information following interruption to, or failure of, critical business processes.
    3.  Our products are designed to ensure redundancy and seamless failover. The server instances that support the products are also architected with a goal to prevent single points of failure. This design assists our operations in maintaining and updating the product applications and backend while limiting downtime.
