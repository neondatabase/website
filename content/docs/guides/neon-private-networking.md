---
title: Neon Private Networking
subtitle: Learn how to connect to your Neon database via AWS PrivateLink
enableTableOfContents: true
redirectFrom:
  - /docs/guides/neon-private-acess
updatedOn: '2024-11-13T15:01:17.207Z'
---

<PrivatePreview />

The **Neon Private Networking** feature lets you securely connect to your Neon databases using [AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html), avoiding the open internet for improved security.

## Overview

In a standard setup, the client application connects to a Neon database over the open internet via the Neon proxy.

With **Neon Private Networking**, you can connect to your database via AWS PrivateLink instead of over the open internet. In this configuration, the client application connects through an [AWS endpoint service](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html) (provided by Neon) to a Neon Proxy instance that is not accessible from the public internet. This endpoint service is accessible only within the same AWS region as your client application and is restricted to Neon-authorized customers. With **Neon Private Networking**, all traffic between the client application and the Neon database remains within AWS’s private network, rather than traversing the public internet.

![Neon Private Networking diagram](/docs/guides/neon_private_access.jpg)

## Prerequisites

- Ensure that your **client application is deployed on AWS** in the same region as the Neon database you plan to connect to. The Private Networking feature is available in all [Neon-supported AWS regions](/docs/introduction/regions#aws-regions). Your private access client application and Neon database must reside in one of these regions.
- You will need to add a [VPC endpoint](https://docs.aws.amazon.com/vpc/latest/privatelink/concepts.html#concepts-vpc-endpoints) to the AWS Virtual Private Cloud ([VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)) where your client application is deployed. The steps are outlined below.

## Configuration steps

To configure Neon Private Networking, perform the following steps:

1.  **Create an AWS VPC endpoint**

    1. Go to the **AWS VPC Dashboard** and select **Create endpoint**. Make sure you create the endpoint in the same VPC as your client application.

       ![VPC Dashboard](/docs/guides/pl_vpc_dashboard.png)

    1. Optionally, enter a **Name tag** for the endpoint (e.g., `My Neon Private Networking test`).
    1. For **Service category**, select **Other endpoint services**.
    1. Specify the **Service name**. It must be one of the following names, depending on your region:

       - **us-east-1**: `com.amazonaws.vpce.us-east-1.vpce-svc-0ccf08d7888526333`
       - **us-east-2**: `com.amazonaws.vpce.us-east-2.vpce-svc-0fa555394e26593be`
       - **eu-central-1**: `com.amazonaws.vpce.eu-central-1.vpce-svc-0fa74d33d011f0803`
       - **us-west-2**: `com.amazonaws.vpce.us-west-2.vpce-svc-05948d7514bcd0733`
       - **ap-southeast-1**: `com.amazonaws.vpce.ap-southeast-1.vpce-svc-045649a6862891b1e`
       - **ap-southeast-2**: `com.amazonaws.vpce.ap-southeast-2.vpce-svc-08e19a71d9651bde1`

       ![Select the endpoint service](/docs/guides/pl_select_endpoint_service.png)

    1. Click **Verify service**. If successful, you should see a `Service name verified` message.
    1. Select the VPC where your application is deployed.
    1. Add the availability zones and associated subnets you want to support.
    1. Click **Create endpoint** to complete the setup of the endpoint service.

2.  **Provide the endpoint ID to Neon**

    Note the ID of the created endpoint and provide it to Neon. Neon will authorize this endpoint to access the Neon Private Networking service and notify when the authorization is complete.

    <Admonition type="note">
     This step is specific to the Private Preview. In the final version, the allowed endpoint will be configured through the Neon Console without any manual involvement by Neon.
    </Admonition>

3.  **Enable Private DNS**

    After Neon authorizes your endpoint (please wait for confirmation from Neon), you need to enable private DNS lookup for the endpoint.

    1. In AWS, select the VPC endpoint you created.
    1. Select **Modify private DNS name**.
    1. Select **Enable for this endpoint**.
    1. Save your changes.
       ![Enable private DNS](/docs/guides/pl_enable_private_dns.png)

4.  **Update the connection string**

    To connect to your Neon database using AWS PrivateLink, you have to modify your Neon database connection string to use the private endpoint.

    For example, if your original Neon database connection string is:

    ```
    postgresql://user:password@ep-testing-bush-12345.us-east-1.aws.neon.tech
    ```

    Update it to:

    ```
    postgresql://user:password@ep-testing-bush-12345.vpce.us-east-1.aws.neon.tech
    ```

    Notice that the updated connection string includes `vpce` in the hostname. This change will route database connections over AWS PrivateLink.

5.  **Restrict public internet access**

    At this point, it's still possible to connect to your Neon database over the public internet using the original Neon database connection string.

    To restrict public internet access via this connection string, you can use Neon's [IP Allow](/docs/introduction/ip-allow) feature in the Neon Console. For IP Allow configuration instructions, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

    You can access your **IP Allow** configuration from your Neon project's **Settings** page.

    Enter **0.0.0.0** in the allowlist to block all connections over the public internet, and click **Save changes**.

          <Admonition type="note">
           The Private Networking connection is not affected by this IP Allow configuration.
          </Admonition>

    ![Neon IP Allow configuration](/docs/guides/pl_neon_ip_allow.png)

       <Admonition type="note">
        Using the IP allowlist feature for blocking access from the public internet is only for the Private Preview. In the final version there will be a dedicated way in the Neon console for doing that!
       </Admonition>
    <NeedHelp />
