---
title: Regions
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/conceptual-guides/regions
updatedOn: '2024-10-30T22:44:11.656Z'
---

Neon supports project deployment in several regions. We recommended that you select the region closest to your application server to reduce latency between your Neon database and your application.

## AWS regions

- AWS US East (N. Virginia) &mdash; `aws-us-east-1`
- AWS US East (Ohio) &mdash; `aws-us-east-2`
- AWS US West (Oregon) &mdash; `aws-us-west-2`
- AWS Europe (Frankfurt) &mdash; `aws-eu-central-1`
- AWS Asia Pacific (Singapore) &mdash; `aws-ap-southeast-1`
- AWS Asia Pacific (Sydney) &mdash; `aws-ap-southeast-2`

## Azure regions

- Azure East US 2 region (Virginia) &mdash; `azure-eastus2` (**Beta**)
- Azure Germany West Central region &mdash; `azure-gwc` (**Beta**)
- Azure West US 3 region (Arizona) &mdash; `azure-westus3` (**Beta**)

<Admonition type="note" title="About the Neon on Azure Beta">
The Neon on Azure Beta is limited to the Azure East US 2 region and is not currently recommended for business-critical workloads. As a Beta release, occasional updates may require downtime.

During this Beta period:

- Anyone can create a Neon project in the Azure region.
- The [Free Plan usage allowances](https://neon.tech/docs/introduction/plans#free-plan) are the same as for Free Plan projects created on AWS.
- For Launch, Scale, and Business plan users, compute and storage usage for Azure-hosted projects will become billable as of **Dec 1, 2024**. [Extra project units](/docs/introduction/extra-usage) are currently billable and will remain so.
- [Support](/docs/introduction/support) is available for Neon projects on Azure, but Business plan SLAs are not yet offered.

To stay informed about the latest developments for Neon on Azure, please [sign up for our newsletter](https://neon.tech/blog#subscribe-form). Neon will soon be available through the Azure Marketplace. To be notified as soon as it's live, join our [Neon in the Azure Marketplace Waitlist](https://neon.tech/azure-marketplace).

If you have any feedback about your experience with Neon on Azure, we'd love to hear it. Let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord.
</Admonition>

## Request a region

<RegionRequest />

## Select a region for your Neon project

You can select the region for your Neon project during project creation. See [Create a project](/docs/manage/projects#create-a-project).

All branches and databases created in a Neon project are created in the region selected for the project.

![Select region image](/docs/introduction/project_creation_regions.png)

<Admonition type="note">
After you select a region for a Neon project, it cannot be changed for that project.
</Admonition>

## NAT Gateway IP addresses

A NAT gateway has a public IP address that external systems see when private resources initiate outbound connections. Neon uses 3 to 6 IP addresses per region for this outbound communication, corresponding to each availability zone in the region. To ensure proper connectivity for setups such as replicating data to Neon, you should allow access to all the NAT gateway IP addresses associated with your Neon project's region.

If you are unsure of your project's region, you can find this information in the **Project settings** widget on the **Project Dashboard**.

### AWS NAT Gateway IP Addresses

| Region                                            | NAT Gateway IP Addresses                                                               |
| :------------------------------------------------ | :------------------------------------------------------------------------------------- |
| AWS US East (N. Virginia) — aws-us-east-1         | 23.23.0.232, 3.222.32.110, 35.168.244.148, 54.160.39.37, 54.205.208.153, 54.88.155.118 |
| AWS US East (Ohio) — aws-us-east-2                | 18.217.181.229, 3.129.145.179, 3.139.195.115                                           |
| AWS US West (Oregon) — aws-us-west-2              | 44.235.241.217, 52.32.22.241, 52.37.48.254, 54.213.57.47                               |
| AWS Europe (Frankfurt) — aws-eu-central-1         | 18.158.63.175, 3.125.234.79, 3.125.57.42                                               |
| AWS Asia Pacific (Singapore) — aws-ap-southeast-1 | 54.254.50.26, 54.254.92.70, 54.255.161.23                                              |
| AWS Asia Pacific (Sydney) — aws-ap-southeast-2    | 13.237.134.148, 13.55.152.144, 54.153.185.87                                           |

### Azure NAT Gateway IP Addresses

| Region                                     | NAT Gateway IP Addresses                       |
|:-------------------------------------------|:-----------------------------------------------|
| Azure East US 2 (Virginia) — azure-eastus2 | 48.211.218.176, 48.211.218.194, 48.211.218.200 |
| Azure Germany West Central - azure-gwc     | 20.52.100.129, 20.52.100.208, 20.52.187.150    |
| Azure West US 3 (Arizona) - azure-westus3  | 20.38.38.171, 20.168.0.32, 20.168.0.77         |

## Move project data to a new region

Moving a project to a differ region requires moving your data using one of the following methods:

### Dump and restore

Using the dump and restore method involves the following steps:

1. Create a new project in the desired region. For project creation instructions, see [Create a project](/docs/manage/projects#create-a-project).
1. Move your data from the old project to the new project. For instructions, see [Import data from Postgres](/docs/import/migrate-from-postgres).

Moving data to a new Neon project using this method may take some time depending on the size of your data. To prevent the loss of data during the import operation, consider disabling writes from your applications before initiating the import operation. You can re-enable writes when the import is completed. Neon does not currently support disabling database writes. Writes must be disabled at the application level.

### Logical replication

As an alternative to the dump and restore method described above, you can use **logical replication** to replicate data from one Neon project to another for a near-zero downtime data migration. For more information, see [Replicate data from one Neon project to another](/docs/guides/logical-replication-neon-to-neon).

<NeedHelp/>
