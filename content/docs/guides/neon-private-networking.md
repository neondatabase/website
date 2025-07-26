---
title: Neon Private Networking
subtitle: Learn how to connect to your Neon database via AWS PrivateLink
enableTableOfContents: true
redirectFrom:
  - /docs/guides/neon-private-access
updatedOn: '2025-07-03T12:36:49.563Z'
---

<Admonition type="comingSoon" title="Private Networking availability">
Private Networking is available on Neon's [Business](/docs/introduction/plans#business) and [Enterprise](/docs/introduction/plans#enterprise) plans. If you're on a different plan, you can request a trial from the **Network Security** page in your project's settings.
</Admonition>

The **Neon Private Networking** feature enables secure connections to your Neon databases via [AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html), bypassing the open internet for enhanced security.

## Overview

In a standard setup, the client application connects to a Neon database over the open internet via the Neon proxy.

With **Neon Private Networking**, you can connect to your database via AWS PrivateLink instead of the open internet. In this setup, the client application connects through an [AWS endpoint service](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html) (provided by Neon) to a Neon proxy instance that is not accessible from the public internet. This endpoint service is available only within the same AWS region as your client application. With **Neon Private Networking**, all traffic between the client application and the Neon database stays within AWS's private network, rather than crossing the public internet.

![Neon Private Networking diagram](/docs/guides/neon_private_access.jpg)

## Prerequisites

- You must be a Neon [Business](/docs/introduction/plans#business) and [Enterprise](/docs/introduction/plans#enterprise) account user, and your user account must be [Neon organization](/docs/manage/organizations) Admin account. You'll encounter an access error if you attempt the setup from a personal Neon account or on a Neon plan that does not offer Private Networking.
- **Ensure that your client application is deployed on AWS in the same region as the Neon database you plan to connect to.** The Private Networking feature is available in all [Neon-supported AWS regions](/docs/introduction/regions#aws-regions). Both your private access client application and Neon database must be in one of these regions.
- The Neon Private Networking feature currently supports [IPv4](https://en.wikipedia.org/wiki/Internet_Protocol_version_4) addresses. [IPv6](https://en.wikipedia.org/wiki/IPv6) is not supported at this time.
- Install the Neon CLI. You will use it to add your VPC endpoint ID to your Neon organization. For installation instructions, see [Neon CLI — Install and connect](/docs/reference/cli-install).

## Configuration steps

To configure Neon Private Networking, perform the following steps:

<Steps>

## Create an AWS VPC endpoint

    <Admonition type="important">
    Do not enable **private DNS names** for the VPC endpoint until [Step 3](/docs/guides/neon-private-networking#enable-private-dns). You must add the VPC endpoint to your Neon organization first, as described in [Step 2](/docs/guides/neon-private-networking#add-your-vpc-endpoint-id-to-your-neon-organization).
    </Admonition>

    The service names vary by region:

    - **us-east-1**: Create two entries, one for each of the following:
      - `com.amazonaws.vpce.us-east-1.vpce-svc-0de57c578b0e614a9`
      - `com.amazonaws.vpce.us-east-1.vpce-svc-02a0abd91f32f1ed7`
    - **us-east-2**: Create two entries, one for each of the following:
      - `com.amazonaws.vpce.us-east-2.vpce-svc-010736480bcef5824`
      - `com.amazonaws.vpce.us-east-2.vpce-svc-0465c21ce8ba95fb2`
    - **eu-central-1**:
      - `com.amazonaws.vpce.eu-central-1.vpce-svc-05554c35009a5eccb`
    - **aws-eu-west-2**:
      - `com.amazonaws.vpce.eu-west-2.vpce-svc-0c6fedbe99fced2cd`
    - **us-west-2**: Create two entries, one for each of the following:
      - `com.amazonaws.vpce.us-west-2.vpce-svc-060e0d5f582365b8e`
      - `com.amazonaws.vpce.us-west-2.vpce-svc-07b750990c172f22f`
    - **ap-southeast-1**:
      - `com.amazonaws.vpce.ap-southeast-1.vpce-svc-07c68d307f9f05687`
    - **ap-southeast-2**:
      - `com.amazonaws.vpce.ap-southeast-2.vpce-svc-031161490f5647f32`
    - **aws-sa-east-1**:
      - `com.amazonaws.vpce.sa-east-1.vpce-svc-061204a851dbd1a47`

    <Tabs labels={["AWS Console", "Terraform", "CloudFormation", "AWS CLI"]}>

    <TabItem>

    1. Go to the AWS **VPC > Endpoints** dashboard and select **Create endpoint**. Make sure you create the endpoint in the same VPC as your client application.

       ![VPC Dashboard](/docs/guides/pl_vpc_dashboard.png)

    1. Optionally, enter a **Name tag** for the endpoint (e.g., `My Neon Private Networking`).
    1. For **Type**, select the **Endpoint services that use NLBs and GWLBs** category.

       ![VPC Create endpoint](/docs/guides/pl_vpc_create_endpoint.png)

    1. Under **Service settings**, specify the **Service name** from the list above for your region.

    1. Click **Verify service**. If successful, you should see a `Service name verified` message.

        ![VPC Create endpoint](/docs/guides/pl_vpc_service_name_verified.png)

        If not successful, ensure that your service name matches the region where you're creating the VPC endpoint.

    1. Select the VPC where your application is deployed.
    1. Add the availability zones and associated subnets you want to support.
    1. Click **Create endpoint** to complete the setup of the endpoint service.

        ![VPC Create endpoint](/docs/guides/pl_vpc_network_settings.png)

    1. Note your **VPC Endpoint ID**. You will need it in the next step.

        ![VPC Create endpoint](/docs/guides/pl_vpc_endpoint_id.png)

    </TabItem>

    <TabItem>

    Create a VPC endpoint using Terraform. Replace the placeholders with your actual values:

    ```terraform
    # Security group for Neon VPC endpoint
    resource "aws_security_group" "neon_vpc_endpoint" {
      name_prefix = "neon-vpc-endpoint-"
      vpc_id      = var.vpc_id

      ingress {
        from_port   = 5432
        to_port     = 5432
        protocol    = "tcp"
        cidr_blocks = [var.vpc_cidr]
      }

      egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
      }

      tags = {
        Name = "neon-vpc-endpoint-sg"
      }
    }

    # VPC endpoint for Neon (single service regions)
    resource "aws_vpc_endpoint" "neon" {
      count = contains(["us-east-1", "us-east-2", "us-west-2"], var.aws_region) ? 0 : 1

      vpc_id              = var.vpc_id
      service_name        = local.neon_service_names[var.aws_region][0]
      vpc_endpoint_type   = "Interface"
      subnet_ids          = var.subnet_ids
      security_group_ids  = [aws_security_group.neon_vpc_endpoint.id]
      private_dns_enabled = false  # Enable in Step 3

      tags = {
        Name = "neon-vpc-endpoint"
      }
    }

    # VPC endpoints for multi-service regions
    resource "aws_vpc_endpoint" "neon_primary" {
      count = contains(["us-east-1", "us-east-2", "us-west-2"], var.aws_region) ? 1 : 0

      vpc_id              = var.vpc_id
      service_name        = local.neon_service_names[var.aws_region][0]
      vpc_endpoint_type   = "Interface"
      subnet_ids          = var.subnet_ids
      security_group_ids  = [aws_security_group.neon_vpc_endpoint.id]
      private_dns_enabled = false  # Enable in Step 3

      tags = {
        Name = "neon-vpc-endpoint-primary"
      }
    }

    resource "aws_vpc_endpoint" "neon_secondary" {
      count = contains(["us-east-1", "us-east-2", "us-west-2"], var.aws_region) ? 1 : 0

      vpc_id              = var.vpc_id
      service_name        = local.neon_service_names[var.aws_region][1]
      vpc_endpoint_type   = "Interface"
      subnet_ids          = var.subnet_ids
      security_group_ids  = [aws_security_group.neon_vpc_endpoint.id]
      private_dns_enabled = false  # Enable in Step 3

      tags = {
        Name = "neon-vpc-endpoint-secondary"
      }
    }

    # Service names mapping
    locals {
      neon_service_names = {
        "us-east-1"       = ["com.amazonaws.vpce.us-east-1.vpce-svc-0de57c578b0e614a9", "com.amazonaws.vpce.us-east-1.vpce-svc-02a0abd91f32f1ed7"]
        "us-east-2"       = ["com.amazonaws.vpce.us-east-2.vpce-svc-010736480bcef5824", "com.amazonaws.vpce.us-east-2.vpce-svc-0465c21ce8ba95fb2"]
        "us-west-2"       = ["com.amazonaws.vpce.us-west-2.vpce-svc-060e0d5f582365b8e", "com.amazonaws.vpce.us-west-2.vpce-svc-07b750990c172f22f"]
        "eu-central-1"    = ["com.amazonaws.vpce.eu-central-1.vpce-svc-05554c35009a5eccb"]
        "eu-west-2"       = ["com.amazonaws.vpce.eu-west-2.vpce-svc-0c6fedbe99fced2cd"]
        "ap-southeast-1"  = ["com.amazonaws.vpce.ap-southeast-1.vpce-svc-07c68d307f9f05687"]
        "ap-southeast-2"  = ["com.amazonaws.vpce.ap-southeast-2.vpce-svc-031161490f5647f32"]
        "sa-east-1"       = ["com.amazonaws.vpce.sa-east-1.vpce-svc-061204a851dbd1a47"]
      }
    }

    # Output the VPC endpoint IDs
    output "neon_vpc_endpoint_ids" {
      value = concat(
        aws_vpc_endpoint.neon[*].id,
        aws_vpc_endpoint.neon_primary[*].id,
        aws_vpc_endpoint.neon_secondary[*].id
      )
    }
    ```

    </TabItem>

    <TabItem>

    Create a VPC endpoint using CloudFormation. Replace the placeholders with your actual values:

    ```yaml
    AWSTemplateFormatVersion: '2010-09-09'
    Description: 'Neon VPC Endpoint for Private Networking'

    Parameters:
      VpcId:
        Type: AWS::EC2::VPC::Id
        Description: VPC ID where the endpoint will be created
      SubnetIds:
        Type: List<AWS::EC2::Subnet::Id>
        Description: Subnet IDs for the VPC endpoint
      VpcCidr:
        Type: String
        Description: CIDR block of the VPC
        Default: "10.0.0.0/16"

    Mappings:
      RegionServiceNames:
        us-east-1:
          Primary: "com.amazonaws.vpce.us-east-1.vpce-svc-0de57c578b0e614a9"
          Secondary: "com.amazonaws.vpce.us-east-1.vpce-svc-02a0abd91f32f1ed7"
        us-east-2:
          Primary: "com.amazonaws.vpce.us-east-2.vpce-svc-010736480bcef5824"
          Secondary: "com.amazonaws.vpce.us-east-2.vpce-svc-0465c21ce8ba95fb2"
        us-west-2:
          Primary: "com.amazonaws.vpce.us-west-2.vpce-svc-060e0d5f582365b8e"
          Secondary: "com.amazonaws.vpce.us-west-2.vpce-svc-07b750990c172f22f"
        eu-central-1:
          Primary: "com.amazonaws.vpce.eu-central-1.vpce-svc-05554c35009a5eccb"
        eu-west-2:
          Primary: "com.amazonaws.vpce.eu-west-2.vpce-svc-0c6fedbe99fced2cd"
        ap-southeast-1:
          Primary: "com.amazonaws.vpce.ap-southeast-1.vpce-svc-07c68d307f9f05687"
        ap-southeast-2:
          Primary: "com.amazonaws.vpce.ap-southeast-2.vpce-svc-031161490f5647f32"
        sa-east-1:
          Primary: "com.amazonaws.vpce.sa-east-1.vpce-svc-061204a851dbd1a47"

    Conditions:
      IsMultiServiceRegion: !Or
        - !Equals [!Ref "AWS::Region", "us-east-1"]
        - !Equals [!Ref "AWS::Region", "us-east-2"]
        - !Equals [!Ref "AWS::Region", "us-west-2"]

    Resources:
      NeonVpcEndpointSecurityGroup:
        Type: AWS::EC2::SecurityGroup
        Properties:
          GroupDescription: Security group for Neon VPC endpoint
          VpcId: !Ref VpcId
          SecurityGroupIngress:
            - IpProtocol: tcp
              FromPort: 5432
              ToPort: 5432
              CidrIp: !Ref VpcCidr
          Tags:
            - Key: Name
              Value: neon-vpc-endpoint-sg

      NeonVpcEndpointPrimary:
        Type: AWS::EC2::VPCEndpoint
        Properties:
          VpcId: !Ref VpcId
          ServiceName: !FindInMap [RegionServiceNames, !Ref "AWS::Region", Primary]
          VpcEndpointType: Interface
          SubnetIds: !Ref SubnetIds
          SecurityGroupIds:
            - !Ref NeonVpcEndpointSecurityGroup
          PrivateDnsEnabled: false  # Enable in Step 3

      NeonVpcEndpointSecondary:
        Type: AWS::EC2::VPCEndpoint
        Condition: IsMultiServiceRegion
        Properties:
          VpcId: !Ref VpcId
          ServiceName: !FindInMap [RegionServiceNames, !Ref "AWS::Region", Secondary]
          VpcEndpointType: Interface
          SubnetIds: !Ref SubnetIds
          SecurityGroupIds:
            - !Ref NeonVpcEndpointSecurityGroup
          PrivateDnsEnabled: false  # Enable in Step 3

    Outputs:
      PrimaryVpcEndpointId:
        Description: Primary VPC Endpoint ID
        Value: !Ref NeonVpcEndpointPrimary
      SecondaryVpcEndpointId:
        Condition: IsMultiServiceRegion
        Description: Secondary VPC Endpoint ID
        Value: !Ref NeonVpcEndpointSecondary
    ```

    </TabItem>

    <TabItem>

    Create a VPC endpoint using the AWS CLI. Replace the placeholders with your actual values:

    ```bash shouldWrap
    # Create security group for the VPC endpoint
    SECURITY_GROUP_ID=$(aws ec2 create-security-group \
      --group-name neon-vpc-endpoint-sg \
      --description "Security group for Neon VPC endpoint" \
      --vpc-id vpc-xxxxxxxxx \
      --query 'GroupId' \
      --output text)

    # Add ingress rule for PostgreSQL port
    aws ec2 authorize-security-group-ingress \
      --group-id $SECURITY_GROUP_ID \
      --protocol tcp \
      --port 5432 \
      --cidr 10.0.0.0/16

    # For single service regions (eu-central-1, eu-west-2, ap-southeast-1, ap-southeast-2, sa-east-1)
    aws ec2 create-vpc-endpoint \
      --vpc-id vpc-xxxxxxxxx \
      --service-name com.amazonaws.vpce.REGION.vpce-svc-xxxxxxxxxxxxxxxxx \
      --vpc-endpoint-type Interface \
      --subnet-ids subnet-xxxxxxxxx subnet-yyyyyyyyy \
      --security-group-ids $SECURITY_GROUP_ID \
      --no-private-dns-enabled

    # For us-east-1 - create two endpoints
    aws ec2 create-vpc-endpoint \
      --vpc-id vpc-xxxxxxxxx \
      --service-name com.amazonaws.vpce.us-east-1.vpce-svc-0de57c578b0e614a9 \
      --vpc-endpoint-type Interface \
      --subnet-ids subnet-xxxxxxxxx subnet-yyyyyyyyy \
      --security-group-ids $SECURITY_GROUP_ID \
      --no-private-dns-enabled

    aws ec2 create-vpc-endpoint \
      --vpc-id vpc-xxxxxxxxx \
      --service-name com.amazonaws.vpce.us-east-1.vpce-svc-02a0abd91f32f1ed7 \
      --vpc-endpoint-type Interface \
      --subnet-ids subnet-xxxxxxxxx subnet-yyyyyyyyy \
      --security-group-ids $SECURITY_GROUP_ID \
      --no-private-dns-enabled

    # For us-east-2 - create two endpoints
    aws ec2 create-vpc-endpoint \
      --vpc-id vpc-xxxxxxxxx \
      --service-name com.amazonaws.vpce.us-east-2.vpce-svc-010736480bcef5824 \
      --vpc-endpoint-type Interface \
      --subnet-ids subnet-xxxxxxxxx subnet-yyyyyyyyy \
      --security-group-ids $SECURITY_GROUP_ID \
      --no-private-dns-enabled

    aws ec2 create-vpc-endpoint \
      --vpc-id vpc-xxxxxxxxx \
      --service-name com.amazonaws.vpce.us-east-2.vpce-svc-0465c21ce8ba95fb2 \
      --vpc-endpoint-type Interface \
      --subnet-ids subnet-xxxxxxxxx subnet-yyyyyyyyy \
      --security-group-ids $SECURITY_GROUP_ID \
      --no-private-dns-enabled

    # For us-west-2 - create two endpoints
    aws ec2 create-vpc-endpoint \
      --vpc-id vpc-xxxxxxxxx \
      --service-name com.amazonaws.vpce.us-west-2.vpce-svc-060e0d5f582365b8e \
      --vpc-endpoint-type Interface \
      --subnet-ids subnet-xxxxxxxxx subnet-yyyyyyyyy \
      --security-group-ids $SECURITY_GROUP_ID \
      --no-private-dns-enabled

    aws ec2 create-vpc-endpoint \
      --vpc-id vpc-xxxxxxxxx \
      --service-name com.amazonaws.vpce.us-west-2.vpce-svc-07b750990c172f22f \
      --vpc-endpoint-type Interface \
      --subnet-ids subnet-xxxxxxxxx subnet-yyyyyyyyy \
      --security-group-ids $SECURITY_GROUP_ID \
      --no-private-dns-enabled
    ```

    Note the VPC Endpoint ID(s) from the command output. You'll need these for the next step.

    </TabItem>

    </Tabs>

## Add your VPC Endpoint ID to your Neon organization

    Assign your **VPC Endpoint ID** to your Neon organization. You can do this using the Neon CLI, API, or Terraform.

    <Admonition type="note">
     Please note that you must assign the **VPC Endpoint ID**, not the VPC ID.
    </Admonition>

    <Tabs labels={["Neon CLI", "Neon API", "Terraform"]}>

    <TabItem>

    In the following example, the VCP endpoint ID is assigned to a Neon organization in the specified AWS region using the [neon vpc endpoint](/docs/reference/cli-vpc#the-vpc-endpoint-subcommand) command.

    ```bash shouldWrap
    neon vpc endpoint assign vpce-1234567890abcdef0 --org-id org-bold-bonus-12345678 --region-id aws-us-east-2
    ```

    You can find your Neon organization ID in your Neon organization settings, or you can run this Neon CLI command: `neon orgs list`

    </TabItem>

    <TabItem>

    You can use the [Assign or update a VPC endpoint](https://api-docs.neon.tech/reference/assignorganizationvpcendpoint) API to assign a VCP endpoint ID to a Neon organization. You will need to provide your Neon organization ID, region ID, VPC endpoint ID, Neon project ID, and a [Neon API key](/docs/manage/api-keys).

    ```bash
    curl --request POST \
     --url https://console.neon.tech/api/v2/organizations/org-bold-bonus-12345678/vpc/region/aws-us-east-2/vpc_endpoints/vpce-1234567890abcdef0 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json'
    ```
    </TabItem>

    <TabItem>

    Add VPC endpoint to Neon organization using Terraform. This uses the Neon Terraform provider:

    ```terraform
    # Configure the Neon provider
    terraform {
      required_providers {
        neon = {
          source = "kislerdm/neon"
        }
      }
    }

    provider "neon" {
      api_key = var.neon_api_key
    }

    # Add VPC endpoint to Neon organization (single service regions)
    resource "neon_vpc_endpoint_assignment" "org_vpc_endpoint" {
      count = contains(["us-east-1", "us-east-2", "us-west-2"], var.aws_region) ? 0 : 1

      org_id          = "org-bold-bonus-12345678"
      region_id       = "aws-${var.aws_region}"
      vpc_endpoint_id = aws_vpc_endpoint.neon[0].id
      label           = "primary-vpc-endpoint"
    }

    # For multi-service regions, add both endpoints
    resource "neon_vpc_endpoint_assignment" "org_vpc_endpoint_primary" {
      count = contains(["us-east-1", "us-east-2", "us-west-2"], var.aws_region) ? 1 : 0

      org_id          = "org-bold-bonus-12345678"
      region_id       = "aws-${var.aws_region}"
      vpc_endpoint_id = aws_vpc_endpoint.neon_primary[0].id
      label           = "primary-vpc-endpoint"
    }

    resource "neon_vpc_endpoint_assignment" "org_vpc_endpoint_secondary" {
      count = contains(["us-east-1", "us-east-2", "us-west-2"], var.aws_region) ? 1 : 0

      org_id          = "org-bold-bonus-12345678"
      region_id       = "aws-${var.aws_region}"
      vpc_endpoint_id = aws_vpc_endpoint.neon_secondary[0].id
      label           = "secondary-vpc-endpoint"
    }
    ```

    You can find your Neon organization ID in your Neon organization settings, or you can run this Neon CLI command: `neon orgs list`

    </TabItem>

    </Tabs>

    Optionally, you can limit access to a Neon project by allowing connections only from a specific VPC endpoint. For instructions, see [Assigning a VPC endpoint restrictions](#assigning-a-vpc-endpoint-restriction).

## Enable Private DNS

    After adding your VPC endpoint ID to your Neon organization, enable private DNS lookup for the VPC endpoint in AWS.

    <Tabs labels={["AWS Console", "AWS CLI", "Terraform"]}>

    <TabItem>

    1. In AWS, select the VPC endpoint you created.
    1. Choose **Modify private DNS name**.
    1. Select **Enable for this endpoint**.
    1. Save your changes.
       ![Enable private DNS](/docs/guides/pl_enable_private_dns.png)

    </TabItem>

    <TabItem>

    Enable Private DNS for the VPC endpoint using the AWS CLI:

    ```bash shouldWrap
    # Enable Private DNS for the VPC endpoint
    aws ec2 modify-vpc-endpoint \
      --vpc-endpoint-id vpce-1234567890abcdef0 \
      --private-dns-enabled

    # For regions with multiple endpoints (us-east-1, us-east-2, us-west-2), enable for both
    aws ec2 modify-vpc-endpoint \
      --vpc-endpoint-id vpce-1234567890abcdef0 \
      --private-dns-enabled

    aws ec2 modify-vpc-endpoint \
      --vpc-endpoint-id vpce-0987654321fedcba0 \
      --private-dns-enabled
    ```

    </TabItem>

    <TabItem>

    Update your Terraform configuration to enable Private DNS. Modify the VPC endpoint resources from Step 1:

    ```terraform
    # Update VPC endpoint for single service regions
    resource "aws_vpc_endpoint" "neon" {
      count = contains(["us-east-1", "us-east-2", "us-west-2"], var.aws_region) ? 0 : 1

      vpc_id              = var.vpc_id
      service_name        = local.neon_service_names[var.aws_region][0]
      vpc_endpoint_type   = "Interface"
      subnet_ids          = var.subnet_ids
      security_group_ids  = [aws_security_group.neon_vpc_endpoint.id]
      private_dns_enabled = true  # Enable Private DNS

      tags = {
        Name = "neon-vpc-endpoint"
      }
    }

    # Update VPC endpoints for multi-service regions
    resource "aws_vpc_endpoint" "neon_primary" {
      count = contains(["us-east-1", "us-east-2", "us-west-2"], var.aws_region) ? 1 : 0

      vpc_id              = var.vpc_id
      service_name        = local.neon_service_names[var.aws_region][0]
      vpc_endpoint_type   = "Interface"
      subnet_ids          = var.subnet_ids
      security_group_ids  = [aws_security_group.neon_vpc_endpoint.id]
      private_dns_enabled = true  # Enable Private DNS

      tags = {
        Name = "neon-vpc-endpoint-primary"
      }
    }

    resource "aws_vpc_endpoint" "neon_secondary" {
      count = contains(["us-east-1", "us-east-2", "us-west-2"], var.aws_region) ? 1 : 0

      vpc_id              = var.vpc_id
      service_name        = local.neon_service_names[var.aws_region][1]
      vpc_endpoint_type   = "Interface"
      subnet_ids          = var.subnet_ids
      security_group_ids  = [aws_security_group.neon_vpc_endpoint.id]
      private_dns_enabled = true  # Enable Private DNS

      tags = {
        Name = "neon-vpc-endpoint-secondary"
      }
    }
    ```

    Then run `terraform apply` to update the VPC endpoints with Private DNS enabled.

    </TabItem>

    </Tabs>

## Check your database connection string

    Your Neon database connection string does not change when using Private Networking.

    To verify that your connection is working correctly, you can perform a DNS lookup on your Neon endpoint hostname from within your AWS VPC. It should resolve to the private IP address of the VPC endpoint.

    For example, if your Neon database connection string is:

    ```bash
    postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
    ```

    You can run the following command from an EC2 instance inside your AWS VPC:

    ```bash
    nslookup ep-cool-darkness-123456.us-east-2.aws.neon.tech
    ```

## Restrict public internet access

    At this point, it's still possible to connect to a database in your Neon project over the public internet using a database connection string.

    You can restrict public internet access to your Neon project via the Neon CLI, API, or Terraform.

    <Tabs labels={["Neon CLI", "Neon API", "Terraform"]}>

    <TabItem>

    To block access via the Neon CLI, use the [neon projects update](/docs/reference/cli-projects#update) command with the `--block-public-connections` option.

    ```bash
    neon projects update orange-credit-12345678 --block-public-connections true
    ```

    In the example above, `orange-credit-12345678` is the Neon project ID. You can find _your_ Neon project ID under your project's settings in the Neon Console, or by running this Neon CLI command: `neon projects list`

    </TabItem>

    <TabItem>

    To block access via the Neon API, use the [Update project](https://api-docs.neon.tech/reference/updateproject) endpoint with the `block_public_connections` settings object attribute.

    ```bash
    curl --request PATCH \
     --url https://console.neon.tech/api/v2/projects/orange-credit-12345678 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '
    {
    "project": {
        "settings": {
        "block_public_connections": true
        }
    }
    }
    '
    ```

    </TabItem>

    <TabItem>

    Restrict public internet access using Terraform by updating your Neon project configuration:

    ```terraform
    # Note: The neon_project resource does not support blocking public connections directly.
    # Use the Neon CLI or API to block public connections, then use VPC endpoint restrictions.

    # Use VPC endpoint restriction for granular access control
    resource "neon_vpc_endpoint_restriction" "project_to_vpc" {
      project_id      = "orange-credit-12345678"  # Your Neon project ID
      vpc_endpoint_id = "vpce-1234567890abcdef0"  # Your VPC endpoint ID
      label           = "vpc-restriction"
    }
    ```

    In the example above, `orange-credit-12345678` is the Neon project ID. You can find _your_ Neon project ID under your project's settings in the Neon Console, or by running this Neon CLI command: `neon projects list`

    </TabItem>

    </Tabs>

</Steps>

## Assigning a VPC endpoint restriction

You can limit access to a Neon project by allowing connections only from specified VPC endpoints. Use the Neon CLI or API to set a restriction.

<Tabs labels={["CLI", "API"]}>

<TabItem>

You can specify a CLI command similar to the following to restrict project access:

```bash
neon vpc project restrict vpce-1234567890abcdef0 --project-id orange-credit-12345678
```

You will need to provide the VPC endpoint ID and your Neon project ID. You can find your Neon project ID under your project's settings in the Neon Console, or by running this Neon CLI command: `neon projects list`

After adding a restriction, you can check the status of the VPC endpoint to view the restricted project using the [vpc endpoint status command](/docs/reference/cli-vpc#the-vpc-endpoint-subcommand). You will need to provide your VPC endpoint ID, region ID, and Neon organization ID.

```bash
neonctl vpc endpoint status vpce-1234567890abcdef0 --region-id=aws-eu-central-1 --org-id=org-nameless-block-72040075
┌────────────────────────┬───────┬─────────────────────────┬─────────────────────────────┐
│ Vpc Endpoint Id        │ State │ Num Restricted Projects │ Example Restricted Projects │
├────────────────────────┼───────┼─────────────────────────┼─────────────────────────────┤
│ vpce-1234567890abcdef0 │ new   │ 1                       │ orange-credit-12345678      │
└────────────────────────┴───────┴─────────────────────────┴─────────────────────────────┘
```

</TabItem>

<TabItem>

The Neon API supports managing project restrictions using the [Assign or update a VPC endpoint restriction](https://api-docs.neon.tech/reference/assignprojectvpcendpoint) endpoint. You will need to provide your VPC endpoint ID, Neon project ID, and a [Neon API key](/docs/manage/api-keys).

```bash
curl --request POST \
     --url https://console.neon.tech/api/v2/projects/orange-credit-12345678/vpc_endpoints/vpce-1234567890abcdef0 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '{"label":"my_vpc"}'
```

After adding a restriction, you can check the status of the VPC endpoint to view the restricted project using the [Retrieve VPC endpoint details](https://api-docs.neon.tech/reference/getorganizationvpcendpointdetails) API. You will need to provide your VPC endpoint ID, region ID, Neon organization ID, and a Neon API key.

```bash
curl --request GET \
     --url https://console.neon.tech/api/v2/organizations/org-nameless-block-72040075/vpc/region/aws-eu-central-1/vpc_endpoints/vpce-1234567890abcdef0 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
```

</TabItem>

</Tabs>

## Managing Private Networking using the Neon CLI

You can use the Neon CLI `vpc` command to manage Private Networking configurations in Neon.

The `vpc` command includes `endpoint` and `project` subcommands for managing VPC endpoints and project-level VPC endpoint restrictions:

- **`vpc endpoint`** – List, assign, remove, and retrieve the status of VPC endpoints for a Neon organization.
- **`vpc project`** – List, configure, or remove VPC endpoint restrictions for specific Neon projects.

For more details and examples, see [Neon CLI commands — vpc](/docs/reference/cli-vpc).

## Managing Private Networking using the Neon API

The Neon API provides endpoints for managing VPC endpoints and project-level VPC endpoint restrictions:

### APIs for managing VPC endpoints

- [List VPC endpoints](https://api-docs.neon.tech/reference/listorganizationvpcendpoints)
- [Assign or update a VPC endpoint](https://api-docs.neon.tech/reference/assignorganizationvpcendpoint)
- [Retrieve VPC endpoint configuration details](https://api-docs.neon.tech/reference/getorganizationvpcendpointdetails)
- [Delete a VPC endpoint](https://api-docs.neon.tech/reference/deleteorganizationvpcendpoint)

### APIs for managing VPC endpoint restrictions

- [Get VPC endpoint restrictions](https://api-docs.neon.tech/reference/listprojectvpcendpoints)
- [Assign or update a VPC endpoint restriction](https://api-docs.neon.tech/reference/assignprojectvpcendpoint)
- [Delete a VPC endpoint restriction](https://api-docs.neon.tech/reference/deleteprojectvpcendpoint)

## Private Networking limits

The Private Networking feature supports a maximum of **10 private networking configurations per AWS region**. Supported AWS regions are listed [above](#create-an-aws-vpc-endpoint).

## Limitations

If you remove a VPC endpoint from a Neon organization, that VPC endpoint cannot be added back to the same Neon organization. Attempting to do so will result in an error. In this case, you must set up a new VPC endpoint.

<NeedHelp />
