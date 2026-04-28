---
title: Regions
summary: >-
  Covers the selection and deployment of Neon projects across various AWS and
  Azure regions to optimize latency between databases and application servers.
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/conceptual-guides/regions
updatedOn: '2026-04-01T12:00:00.000Z'
---

Neon offers project deployment in multiple AWS and Azure regions. To minimize latency between your Neon database and application, we recommend choosing the region closest to your application server.

Each Neon **project** exists in exactly one region. Your database runs in that region. **You cannot change the region** for an existing project. If you need your **data** in a different region, you **create a new Neon project** in that region and **migrate your database** there. You are not moving the project; region is fixed when the project is created.

## AWS regions

- 🇺🇸 AWS US East (N. Virginia) &mdash; `aws-us-east-1`
- 🇺🇸 AWS US East (Ohio) &mdash; `aws-us-east-2`
- 🇺🇸 AWS US West (Oregon) &mdash; `aws-us-west-2`
- 🇩🇪 AWS Europe (Frankfurt) &mdash; `aws-eu-central-1`
- 🇬🇧 AWS Europe (London) &mdash; `aws-eu-west-2`
- 🇸🇬 AWS Asia Pacific (Singapore) &mdash; `aws-ap-southeast-1`
- 🇦🇺 AWS Asia Pacific (Sydney) &mdash; `aws-ap-southeast-2`
- 🇧🇷 AWS South America (São Paulo) &mdash; `aws-sa-east-1`

## Azure regions

<AzureRegionsDeprecation/>

## Request a region

<RequestForm type="region" />

## Select a region for your Neon project

You can select the region for your Neon project during project creation. See [Create a project](/docs/manage/projects#create-a-project).

All branches and databases created in a Neon project are created in the region selected for the project.

![Select region image](/docs/introduction/project_creation_regions.png)

<Admonition type="note">
After you select a region for a Neon project, it cannot be changed for that project. To run your database in a different region, create a **new** project there and migrate your data. See [Region migration](/docs/import/region-migration).
</Admonition>

## NAT Gateway IP addresses

A NAT gateway has a public IP address that external systems see when private resources initiate outbound connections. Neon uses multiple IP addresses per region for this outbound communication, with the number varying by region. To ensure proper connectivity for setups such as replicating data to Neon, you should allow access to all the NAT gateway IP addresses associated with your Neon project's region.

If you are unsure of your project's region, you can find this information in the **Settings** widget on the **Project Dashboard**.

### AWS NAT Gateway IP Addresses

| Region               | NAT Gateway IP Addresses                                                                                                                                                                                                                                                                                                  |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `aws-us-east-1`      | 100.26.142.14, 100.51.56.234, 13.219.161.141, 23.23.0.232, 3.213.105.99, 3.222.32.110, 34.202.217.219, 34.224.137.41, 34.233.170.231, 34.235.208.71, 34.239.66.10, 35.168.244.148, 44.212.197.226, 52.70.189.141, 52.73.235.120, 54.160.39.37, 54.173.116.247, 54.205.208.153, 54.88.155.118, 98.88.203.121, 98.88.212.99 |
| `aws-us-east-2`      | 16.58.110.124, 16.58.110.255, 16.58.110.55, 18.116.233.216, 18.117.39.4, 18.217.181.229, 3.128.125.142, 3.128.6.252, 3.129.145.179, 3.139.195.115, 3.139.7.20, 3.16.227.37, 52.15.165.218                                                                                                                                 |
| `aws-us-west-2`      | 34.213.87.149, 35.164.221.218, 35.83.202.11, 44.235.241.217, 44.236.56.140, 52.32.22.241, 52.37.48.254, 52.40.99.9, 54.186.210.201, 54.213.57.47                                                                                                                                                                          |
| `aws-eu-central-1`   | 18.156.24.144, 18.158.63.175, 18.194.181.241, 18.198.137.195, 3.123.76.138, 3.125.234.79, 3.125.57.42, 3.66.63.165, 52.58.17.95                                                                                                                                                                                           |
| `aws-eu-west-2`      | 18.133.205.39, 3.10.42.8, 52.56.191.86                                                                                                                                                                                                                                                                                    |
| `aws-ap-southeast-1` | 3.1.239.32, 47.131.90.115, 52.76.51.78, 54.254.50.26, 54.254.92.70, 54.255.161.23                                                                                                                                                                                                                                         |
| `aws-ap-southeast-2` | 13.237.134.148, 13.55.152.144, 54.153.185.87                                                                                                                                                                                                                                                                              |
| `aws-sa-east-1`      | 18.230.1.215, 52.67.202.176, 54.232.117.41                                                                                                                                                                                                                                                                                |

### Azure NAT Gateway IP Addresses

| Region          | NAT Gateway IP Addresses                       |
| :-------------- | :--------------------------------------------- |
| `azure-eastus2` | 48.211.218.176, 48.211.218.194, 48.211.218.200 |
| `azure-gwc`     | 20.52.100.129, 20.52.100.208, 20.52.187.150    |
| `azure-westus3` | 20.38.38.171, 20.168.0.32, 20.168.0.77         |

<a id="move-project-data-to-a-new-region" aria-hidden="true"></a>

## Move your database to another region

A Neon project's region does not change after creation. To use another region, create a **new** project there and migrate your data. See **[Region migration](/docs/import/region-migration)** for paths, prerequisites, and steps.

<NeedHelp/>
