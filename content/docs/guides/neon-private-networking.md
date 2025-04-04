---
title: Neon Private Networking
subtitle: Learn how to connect to your Neon database via AWS PrivateLink
enableTableOfContents: true
redirectFrom:
  - /docs/guides/neon-private-access
updatedOn: '2025-03-13T12:02:31.961Z'
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
- Install the Neon CLI. You will use it to add your VPC endpoint ID to your Neon organization. For installation instructions, see [Neon CLI — Install and connect](/docs/reference/cli-install).

## Configuration steps

To configure Neon Private Networking, perform the following steps:

<Steps>

## Create an AWS VPC endpoint

    <Admonition type="important">
    Do not enable **private DNS names** for the VPC endpoint until [Step 3](/docs/guides/neon-private-networking#enable-private-dns). You must add the VPC endpoint to your Neon organization first, as described in [Step 2](/docs/guides/neon-private-networking#add-your-vpc-endpoint-id-to-your-neon-organization).
    </Admonition>

    1. Go to the AWS **VPC > Endpoints** dashboard and select **Create endpoint**. Make sure you create the endpoint in the same VPC as your client application.

       ![VPC Dashboard](/docs/guides/pl_vpc_dashboard.png)

    1. Optionally, enter a **Name tag** for the endpoint (e.g., `My Neon Private Networking`).
    1. For **Type**, select the **Endpoint services that use NLBs and GWLBs** category.

       ![VPC Create endpoint](/docs/guides/pl_vpc_create_endpoint.png)

    1. Under **Service settings**, specify the **Service name**. It must be one of the following service names, depending on your region:

       - **us-east-1**: `com.amazonaws.vpce.us-east-1.vpce-svc-0de57c578b0e614a9`
       - **us-east-2**: `com.amazonaws.vpce.us-east-2.vpce-svc-010736480bcef5824` 
       - **eu-central-1**: `com.amazonaws.vpce.eu-central-1.vpce-svc-05554c35009a5eccb`
       - **aws-eu-west-2**: `com.amazonaws.vpce.eu-west-2.vpce-svc-0c6fedbe99fced2cd`
       - **us-west-2**: `com.amazonaws.vpce.us-west-2.vpce-svc-060e0d5f582365b8e`
       - **ap-southeast-1**: `com.amazonaws.vpce.ap-southeast-1.vpce-svc-07c68d307f9f05687`
       - **ap-southeast-2**: `com.amazonaws.vpce.ap-southeast-2.vpce-svc-031161490f5647f32`
       - **aws-sa-east-1**: `com.amazonaws.vpce.sa-east-1.vpce-svc-061204a851dbd1a47`

    1. Click **Verify service**. If successful, you should see a `Service name verified` message.

        ![VPC Create endpoint](/docs/guides/pl_vpc_service_name_verified.png)

        If not successful, ensure that your service name matches the region where you're creating the VPC endpoint.

    1. Select the VPC where your application is deployed.
    1. Add the availability zones and associated subnets you want to support.
    1. Click **Create endpoint** to complete the setup of the endpoint service.

        ![VPC Create endpoint](/docs/guides/pl_vpc_network_settings.png)

    1. Note your **VPC Endpoint ID**. You will need it in the next step.

        ![VPC Create endpoint](/docs/guides/pl_vpc_endpoint_id.png)

## Add your VPC Endpoint ID to your Neon organization

    Assign your **VPC Endpoint ID** to your Neon organization. You can do this using the Neon CLI or API.

    <Admonition type="note">
     Please note that you must assign the **VPC Endpoint ID**, not the VPC ID.
    </Admonition>

    <Tabs labels={["CLI", "API"]}>

    <TabItem>

    In the following example, the VCP endpoint ID is assigned to a Neon organization in the specified AWS region using the [neon vpc endpoint](/docs/reference/cli-vpc#the-vpc-endpoint-subcommand) command.

    ```bash shouldWrap
    neon vpc endpoint assign vpce-1234567890abcdef0 --org-id org-bold-bonus-12345678 --region-id aws-us-east-2
    ```

    You can find your Neon organization ID in your Neon organization settings, or you can run this Neon CLI command: `neon orgs list`

    </TabItem>

    <TabItem>

    You can use the [Assign or update a VPC endpoint](https://api-docs.neon.tech/reference/assignorganizationvpcendpoint) API to assign a VCP endpoint ID to a Neon organization. You will need to provide your Neon organization ID, region ID, VPC endpoint ID, Neon project ID, and a [Neon API key](https://neon.tech/docs/manage/api-keys).

    ```bash
    curl --request POST \
     --url https://console.neon.tech/api/v2/organizations/org-bold-bonus-12345678/vpc/region/aws-us-east-2/vpc_endpoints/vpce-1234567890abcdef0 \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json'
    ```
    </TabItem>

    </Tabs>

    Optionally, you can limit access to a Neon project by allowing connections only from a specific VPC endpoint. For instructions, see [Assigning a VPC endpoint restrictions](#assigning-a-vpc-endpoint-restriction).

## Enable Private DNS

    After adding your VPC endpoint ID to your Neon organization, enable private DNS lookup for the VPC endpoint in AWS.

    1. In AWS, select the VPC endpoint you created.
    1. Choose **Modify private DNS name**.
    1. Select **Enable for this endpoint**.
    1. Save your changes.
       ![Enable private DNS](/docs/guides/pl_enable_private_dns.png)

## Check your database connection string

    Your Neon database connection string does not change when using Private Networking.

    To verify that your connection is working correctly, you can perform a DNS lookup on your Neon endpoint hostname from within your AWS VPC. It should resolve to the private IP address of the VPC endpoint.

    For example, if your Neon database connection string is:

    ```bash
    postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
    ```

    You can run the following command from an EC2 instance inside your AWS VPC:

    ```bash
    nslookup ep-cool-darkness-123456.us-east-2.aws.neon.tech
    ```

## Restrict public internet access

    At this point, it's still possible to connect to a database in your Neon project over the public internet using a database connection string.

    You can restrict public internet access to your Neon project via the Neon CLI or API.

    <Tabs labels={["CLI", "API"]}>

    <TabItem>

    To block access via the Neon CLI, use the [neon projects update](/docs/reference/cli-projects#update) command with the `--block-public-connections` option.

    ```bash
    neon projects update orange-credit-12345678 --block-vpc-connections true
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

After adding a restriction, you can check the status of the VPC endpoint to view the restricted project using the [vpc endpoint status` command](/docs/reference/cli-vpc#the-vpc-endpoint-subcommand). You will need to provide your VPC endpoint ID, region ID, and Neon organization ID.

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

The Neon API supports managing project restrictions using the [Assign or update a VPC endpoint restriction](https://api-docs.neon.tech/reference/assignprojectvpcendpoint) endpoint. You will need to provide your VPC endpoint ID, Neon project ID, and a [Neon API key](https://neon.tech/docs/manage/api-keys).

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
