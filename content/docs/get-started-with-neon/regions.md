---
title: Regions
enableTableOfContents: true
isDraft: true
---
You can select a region during Neon project creation.

## Overview

Neon offers project deployment in multiple regions. It is recommended that you select the region that is closest to your application servers to reduce latency between your Neon project and your application.

## Available regions

Neon currently supports the following AWS regions:

- US West (Oregon) Region - us-west-2
- US East (Ohio) Region -  us-east-2
- Europe (Frankfurt) Region - eu-central-1
- Asia Pacific (Singapore) Region - AWS ap-southeast-1

## Select a region for your Neon project

Neon allows you to select the region for a your Neon project during project creation. All database created in the Neon project are created in the region selected for the project.

_**Note**_ Once you select region for a Neon project, it cannot be changed.

## Moving project data to a new region

Once you select a region for a Neon project, it cannot be changed. 

If you do need to move your data to a different region, the following steps are recommended:

1. Create a new project in the new region
1. Dump and restore data from your old project to the new project.

For a detailed dump and restore example, refer to [TBD].

This procedure may require downtime if performed on a production database, as the dump and restore procedures takes time to compete. To avoid losing data, consider temporarily blocking writes from your applications before dumping data, and re-enable writes after the migration is completed.
