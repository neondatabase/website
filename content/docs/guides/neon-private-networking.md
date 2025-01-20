---
title: Neon Private Networking
subtitle: Learn how to connect to your Neon database via AWS PrivateLink
enableTableOfContents: true
redirectFrom:
  - /docs/guides/neon-private-access
tag: beta
updatedOn: '2025-01-20T17:41:39.651Z'
---

The **Neon Private Networking** feature enables secure connections to your Neon databases via [AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html), bypassing the open internet for enhanced security.

<Admonition type="note" title="Public Beta">
This feature is in Public Beta. Any member of a Neon Organization account can apply to participate in this Public Beta by requesting access via the **Organization Settings** page in the Console. Please note that Neon will enable billing for the feature at the end of the Public Beta period.

![Requesting Private Networking Access](/docs/guides/private_networking_request_access.png)
</Admonition>

## Overview

In a standard setup, the client application connects to a Neon database over the open internet via the Neon proxy.

With **Neon Private Networking**, you can connect to your database via AWS PrivateLink instead of the open internet. In this setup, the client application connects through an [AWS endpoint service](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html) (provided by Neon) to a Neon proxy instance that is not accessible from the public internet. This endpoint service is available only within the same AWS region as your client application and is restricted to Neon-authorized customers. With **Neon Private Networking**, all traffic between the client application and the Neon database stays within AWS's private network, rather than crossing the public internet.

![Neon Private Networking diagram](/docs/guides/neon_private_access.jpg)

## Prerequisites

- Ensure that your **client application is deployed on AWS** in the same region as the Neon database you plan to connect to. The Private Networking feature is available in all [Neon-supported AWS regions](/docs/introduction/regions#aws-regions). Both your private access client application and Neon database must be in one of these regions.
- Add a [VPC endpoint](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html#concepts-vpc-endpoints) to the AWS Virtual Private Cloud ([VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)) where your client application is deployed. The steps are outlined below.

## Configuration steps

To configure Neon Private Networking, perform the following steps:

<Steps>

## Create an AWS VPC endpoint

    1. Go to the AWS **VPC > Endpoints** dashboard and select **Create endpoint**. Make sure you create the endpoint in the same VPC as your client application.

       ![VPC Dashboard](/docs/guides/pl_vpc_dashboard.png)

    1. Optionally, enter a **Name tag** for the endpoint (e.g., `My Neon Private Networking test`).
    1. For **Type**, select the **Endpoint services that use NLBs and GWLBs** category.
    1. Under **Service settings**, specify the **Service name**. It must be one of the following names, depending on your region:

       - **us-east-1**: `com.amazonaws.vpce.us-east-1.vpce-svc-0de57c578b0e614a9`
       - **us-east-2**: `com.amazonaws.vpce.us-east-2.vpce-svc-010736480bcef5824`
       - **eu-central-1**: `com.amazonaws.vpce.eu-central-1.vpce-svc-05554c35009a5eccb`
       - **us-west-2**: `com.amazonaws.vpce.us-west-2.vpce-svc-060e0d5f582365b8e`
       - **ap-southeast-1**: `com.amazonaws.vpce.ap-southeast-1.vpce-svc-07c68d307f9f05687`
       - **ap-southeast-2**: `com.amazonaws.vpce.ap-southeast-2.vpce-svc-031161490f5647f32`

    1. Click **Verify service**. If successful, you should see a `Service name verified` message.
    1. Select the VPC where your application is deployed.
    1. Add the availability zones and associated subnets you want to support.
    1. Click **Create endpoint** to complete the setup of the endpoint service.

## Provide the VPC Endpoint ID to Neon

    Note the **VPC Endpoint ID** and provide it to Neon. Neon will authorize this VPC Endpoint to access the Neon Private Networking service and will notify you once authorization is complete.

    <Admonition type="note">
     Please note that you must provide the **VPC Endpoint ID**, not the VPC ID. This step is specific to the Private Preview. In the final version, the allowed VPC Endpoint will be configured through the Neon Console or Neon CLI without any manual involvement by Neon.
    </Admonition>

## Enable Private DNS

    After Neon authorizes your endpoint (wait for confirmation from Neon), enable private DNS lookup for the endpoint.

    1. In AWS, select the VPC endpoint you created.
    1. Choose **Modify private DNS name**.
    1. Select **Enable for this endpoint**.
    1. Save your changes.
       ![Enable private DNS](/docs/guides/pl_enable_private_dns.png)

## Check connection string

    The connection string will remain unchanged.

    You can conduct additional DNS lookup checks on the endpoint to determine if the IP address from your VPC and external sources should differ.

## Restrict public internet access

    At this point, it's still possible to connect to your Neon database over the public internet using the original Neon database connection string.

    To restrict public internet access via this connection string, use Neon's [IP Allow](/docs/introduction/ip-allow) feature in the Neon Console. For IP Allow configuration instructions, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

    You can access your **IP Allow** configuration from your Neon's project's **Settings** page.

    Enter **0.0.0.0** in the allowlist to block all connections over the public internet, and click **Save changes**.

    <Admonition type="note">
     The Private Networking connection is not affected by this IP Allow configuration.
    </Admonition>

    ![Neon IP Allow configuration](/docs/guides/pl_neon_ip_allow.png)

    <Admonition type="note">
     Using the IP allowlist feature for blocking access from the public internet is only for the Private Preview. In the final version of this feature, there will be a dedicated option in the Neon Console for this purpose.
    </Admonition>

</Steps>

## Limits

The Private Networking feature supports a maximum of **10 private networking configurations per AWS region**. Supported AWS regions are listed in the preceding section.

<NeedHelp />
