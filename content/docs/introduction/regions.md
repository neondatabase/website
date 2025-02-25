---
title: Regions
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/conceptual-guides/regions
updatedOn: '2025-02-13T21:16:16.153Z'
---

Neon offers project deployment in multiple AWS and Azure regions. To minimize latency between your Neon database and application, we recommend choosing the region closest to your application server.

## AWS regions

- 🇺🇸 AWS US East (N. Virginia) &mdash; `aws-us-east-1`
- 🇺🇸 AWS US East (Ohio) &mdash; `aws-us-east-2`
- 🇺🇸 AWS US West (Oregon) &mdash; `aws-us-west-2`
- 🇩🇪 AWS Europe (Frankfurt) &mdash; `aws-eu-central-1`
- 🇬🇧 AWS Europe (London) &mdash; `aws-eu-west-2`
- 🇸🇬 AWS Asia Pacific (Singapore) &mdash; `aws-ap-southeast-1`
- 🇦🇺 AWS Asia Pacific (Sydney) &mdash; `aws-ap-southeast-2`

## Azure regions

- 🇺🇸 Azure East US 2 region (Virginia) &mdash; `azure-eastus2`
- 🇺🇸 Azure West US 3 region (Arizona) &mdash; `azure-westus3`
- 🇩🇪 Azure Germany West Central region (Frankfurt) &mdash; `azure-gwc`

<Admonition type="note" title="Deployment options on azure">
For information about Neon deployment options on Azure, see [Neon on Azure](/docs/manage/azure).
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

If you are unsure of your project's region, you can find this information in the **Settings** widget on the **Project Dashboard**.

### AWS NAT Gateway IP Addresses

| Region                                            | NAT Gateway IP Addresses                                                               |
| :------------------------------------------------ | :------------------------------------------------------------------------------------- |
| AWS US East (N. Virginia) — aws-us-east-1         | 23.23.0.232, 3.222.32.110, 35.168.244.148, 54.160.39.37, 54.205.208.153, 54.88.155.118 |
| AWS US East (Ohio) — aws-us-east-2                | 18.217.181.229, 3.129.145.179, 3.139.195.115                                           |
| AWS US West (Oregon) — aws-us-west-2              | 44.235.241.217, 52.32.22.241, 52.37.48.254, 54.213.57.47                               |
| AWS Europe (Frankfurt) — aws-eu-central-1         | 18.158.63.175, 3.125.234.79, 3.125.57.42                                               |
| AWS Europe (London) — aws-eu-west-2               | 3.10.42.8, 18.133.205.39, 52.56.191.86                                                 |
| AWS Asia Pacific (Singapore) — aws-ap-southeast-1 | 54.254.50.26, 54.254.92.70, 54.255.161.23                                              |
| AWS Asia Pacific (Sydney) — aws-ap-southeast-2    | 13.237.134.148, 13.55.152.144, 54.153.185.87                                           |

### Azure NAT Gateway IP Addresses

| Region                                     | NAT Gateway IP Addresses                       |
| :----------------------------------------- | :--------------------------------------------- |
| Azure East US 2 (Virginia) — azure-eastus2 | 48.211.218.176, 48.211.218.194, 48.211.218.200 |
| Azure Germany West Central — azure-gwc     | 20.52.100.129, 20.52.100.208, 20.52.187.150    |
| Azure West US 3 (Arizona) — azure-westus3  | 20.38.38.171, 20.168.0.32, 20.168.0.77         |

## Move project data to a new region

Moving a project to a different region requires moving your data using one of the following options:

### Option 1: Dump and restore

Using the dump and restore method involves the following steps:

1. Creating a new project in the desired region. For project creation instructions, see [Create a project](/docs/manage/projects#create-a-project).
1. Moving your data from the old project to the new project. For instructions, see [Import data from Postgres](/docs/import/migrate-from-postgres).

Moving data to a new Neon project using this method may take some time depending on the size of your data. To prevent the loss of data during the import operation, consider disabling writes from your applications before initiating the import operation. You can re-enable writes when the import is completed. Neon does not currently support disabling database writes. Writes must be disabled at the application level.

### Option 2: Logical replication

As an alternative to the dump and restore method described above, you can use **logical replication** to replicate data from one Neon project to another for a near-zero downtime data migration. For more information, see [Replicate data from one Neon project to another](/docs/guides/logical-replication-neon-to-neon).

<NeedHelp/>
