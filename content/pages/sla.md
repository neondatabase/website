---
title: "Neon Service Level Agreement"
template: Static
seo:
  title: "Neon Service Level Agreement - Neon"
  metaDesc: ""
  metaKeywords: ""
  metaRobotsNoindex: true
  opengraphTitle: "Neon Service Level Agreement - Neon"
  opengraphDescription: "Last Modified: February 20, 2026  The Service Level Agreement (“SLA”) outlined below applies exclusively to customers who have subscribed to the Neon Business or Scale plan. This SLA is incorporated into and forms an integral part of the applicable Agreement between Neon, LLC. and the customer. Unless otherwise provided herein, capitalized terms will have the […]"
  twitterImage: ""
---

**Last Modified:** February 20, 2026 

The Service Level Agreement (“**SLA”**) outlined below applies exclusively to customers who have subscribed to the Neon Business or Scale plan. This SLA is incorporated into and forms an integral part of the applicable Agreement between Neon, LLC. and the customer. Unless otherwise provided herein, capitalized terms will have the meaning specified in the Agreement. We reserve the right to change the terms of this SLA.

Neon will use commercially reasonable efforts to maximize the availability of Compute Endpoints and agrees to provide the performance standards as detailed below. This SLA applies only to the availability of Compute Endpoints, and does not apply to any other part of the Platform, APIs, product, or Services offered by Neon.

1.  **SERVICE AVAILABILITY** 

If Neon does not achieve and maintain the Monthly Uptime Percentages set forth in the table below, then the Customer may be eligible for a Service Credit as described in this SLA.

| Monthly Uptime Percentage                           | Service Credit |
| --------------------------------------------------- | -------------- |
| Less than 99.95% but greater than or equal to 99.0% | 10%            |
| Less than 99.0% but greater than or equal to 98.0%  | 15%            |
| Less than 98.0% but greater than or equal to 96.0%  | 20%            |
| Less that 96.0%                                     | 80%            |

2\. **SERVICE CREDITS AND PROCESS** 

2.1 If the Monthly Uptime Percentage is not met, then you may be eligible for a Service Credit. 

2.2 You must log a support ticket with the Neon support team within 21 days of first becoming aware of an event that impacts service availability and abide by the Customer Obligations set out below. 

2.3 Neon will conduct an assessment of the Service Credit claim.

2.4 A Service Credit is calculated as a percentage of the Fees paid by the Customer for the Services in the month in which the applicable SLA was not met.

2.5 Neon will process claims within 45 days of receipt of full information provided to the Neon support team. 

2.6 If Neon determines that the Customer has satisfied the Customer Obligations and that there are no applicable Exclusions, a Service Credit will be granted to the Customer.

2.7 Neon will apply any awarded Service Credit only against future payments otherwise due from the Customer. At Neon’s discretion, we may issue the Service Credit to the credit card the Customer used to pay for the billing cycle in which the Downtime occurred. 

2.8 A Service Credit will not entitle the Customer to any refund or other payment from Neon.

2.9 A Service Credit may not be transferred or applied to any other account. Unless otherwise provided in the Agreement, the Customer’s sole and exclusive remedy for any Downtime or non-performance or other failure by Neon to provide the Platform is the receipt of a Service Credit (if eligible) in accordance with the terms of this SLA.

3\. **CUSTOMER OBLIGATIONS**

3.1 To be eligible for a Service Credit, you must conduct the following obligations (collectively “**Customer Obligations**”):

3.1.1 You must log a support ticket with Neon within 24 hours of first becoming aware of an event that impacts service availability.

3.1.2 You must submit your claim and all required information by the end of the month immediately following the month in which the Downtime occurred.

3.1.3 You must include all information necessary for Neon to validate your claim, including: (i) a detailed description of the events resulting in Downtime, including your request logs that document the errors and corroborate your claimed outage (with any confidential or sensitive information in the logs removed or replaced with asterisks); (ii) information regarding the time and duration of the Downtime; (iii) the number and location(s) of affected users (if applicable); and (iv) descriptions of your attempts to resolve the Downtime at the time of occurrence. 

3.1.4 You must reasonably assist Neon in investigating the cause of the Downtime and processing your claim. 

3.1.5 You must comply with the terms of the Agreement and any advice from our support team.

3.1.6 Your failure to provide the request and other information as required above will disqualify you from receiving a Service Credit.

4\. **EXCLUSIONS** 

4.1 Downtime does not include, and you will not be eligible for a Service Credit for, any performance or availability issue that results from the following (collectively “**SLA Exclusions”**):

4.1.1 factors outside of our reasonable control, such as natural disaster, war, acts of terrorism, riots, government action, or a network or device failure at your website or premises or between your website or premises and Neon;

4.1.2 services, hardware, or software provided by a third party, such as cloud platform services on which Neon runs;

4.1.3 any voluntary actions or inactions from you or any third party not in accordance with the Documentation or guidance e.g., deleting a database, not configuring sufficient compute resources, exceeding available storage, unsharing a Project (if the project owner drops the privilege of a user to access the project), revoking API keys, or incorrectly modifying database connection parameters; overloading a database instance to the point it is inoperable, unsharing of Project, creating excessively large number of tables that significantly increase the recovery time etc.or failing to maintain indexes); 

4.1.4 underlying database engine software that leads to repeated database crashes or an inoperable database instance;

4.1.5 long recovery time due to insufficient IO capacity for your database workload;

4.1.6 that result from your equipment, software or other technology and/or third party equipment, software or other technology (other than third party equipment within our direct control); 

4.1.7 arising from our suspension and termination of your right to use Neon in accordance with the Agreement;

4.1.8 that result from any maintenance as provided for pursuant to the Agreement

4.1.8 Neon’s Services being in Technical Preview.

5\. **DEFINITIONS**

As used herein, “month” refers to a calendar month.

As used herein, “month” refers to a calendar month.

“**Agreement**” means the Master Service Agreement and applicable Order Form entered into between Neon and the Customer. 

“**Business Hours”** means 06:00am to 14:00pm Pacific Standard Time (UTC -8), Monday through Friday, excluding public holidays in the United States.

**“Compute Endpoints”** means compute instances that provide virtualized computing resources (CPU and memory) for running PostgreSQL. Clients and applications connect to a Neon database via a Compute Endpoint hostname.

“**Downtime**” is calculated on a monthly basis and is the total number of minutes during the month that a Compute Endpoint was unavailable. For the purposes of calculating the Monthly Uptime Percentage, Downtime does not include partial minutes of unavailability, inaccessibility or unavailability due to Unscheduled Downtime. A minute is considered unavailable if all of your continuous attempts to establish a connection to a Compute Endpoint within the minute fail. 

“**Fees”** means the total fees paid by you for the Platform during the month in which Downtime occurred.

“**Monthly Uptime Percentage”**  is calculated as:

_\[(`total minutes in month` – `downtime`) / `total minutes in month`\] x 100_

**“Project”** refers to the top-level object in the Neon object hierarchy, serving as a container for all associated objects, except for API keys, which have a Neon account scope. The project framework encompasses objects including branches, compute endpoints, databases, and roles. A project also defines the region where resources are hosted.

“**Service Credit**” means the percentage of the Fees to be credited to you if Neon approves your claim, as set forth in the table above.

“**Unscheduled Downtime**” means the time, in minutes, that the Compute Endpoints  are not generally accessible and available to Customers, excluding inaccessibility or unavailability due to Customer’s or Authorized Users’ acts or omissions, Force Majeure Events, scheduled maintenance disclosed with at least 24 hours’ noticel, hacking or virus attacks or emergency maintenance. 

“**You**“, “**your**” or “**Customer”** means the person or entity using the Platform or Services  identified in the applicable Order Form as the customer.
