---
title: Create an S3 bucket to store Postgres backups
enableTableOfContents: true
tag: new
updatedOn: '2025-02-22T14:55:35.229Z'
---

This guide will walk you through setting up an AWS S3 bucket to store your Postgres backups.

<Admonition type="note">
This is part one of a two-part guide.
Continue to part two [here](/docs/manage/backups-aws-s3-backup-part-2).
</Admonition>

## Prerequisites

To complete this guide, you’ll need an AWS user with the appropriate permissions to:

- **Manage IAM resources**: Create an OpenID Connect (OIDC) identity provider and IAM roles.
- **Manage S3**: Create an S3 bucket and update its bucket policy.

These actions typically require AdministratorAccess or a custom IAM policy granting the necessary permissions. If you’re not an administrator, ensure your user has IAM management privileges and S3 permissions.

## Setup AWS Providers and Roles

There are three parts to the AWS setup, they are:

1. Creating an OIDC Identity Provider
2. Creating a Role
3. Creating an S3 bucket and updating the S3 bucket policy

## Add an Identity provider

An OIDC (OpenID Connect) Identity Provider (IdP) in AWS is a third-party service that handles authentication. To allow GitHub Actions to authenticate with AWS, you must add GitHub as an identity provider..

To create a new Identity Provider, navigate to: **IAM** > **Access Management** > **Identity Providers**, and click **Add provider**.

![AWS Access Management](/docs/manage/1-s3-backups-github-actions-01-identity-provider-1.jpg)

On the next screen select OpenID Connect and add the following to the Provider URL and Audience fields.

1. Provider URL: `https://token.actions.githubusercontent.com`
2. Audience: `sts.amazonaws.com`

When you’re done, click **Add Provider**.

![AWS Identity Provider](/docs/manage/1-s3-backups-github-actions-02-identity-provider-2.jpg)

You should now see this provider is visible in the list under: **IAM** > **Access Management** > **Identity Providers**.

## Create Role

A Role is an identity that you can assume to obtain temporary security credentials for specific tasks or actions within AWS. Roles are used to delegate permissions and grant access to AWS services without the need for credentials like passwords or access keys.

To create a new Role, navigate to: **IAM** > **Access Management** > **Roles**, and click **Create role**.

![AWS Identity Role](/docs/manage/1-s3-backups-github-actions-03-role-1.jpg)

On the next screen you can create a **Trusted Identity** for the Role.

## Select Trusted Identity

On this screen select **Web Identity**, then select `token.actions.githubusercontent.com` from the **Identity Provider** dropdown menu.

![AWS Trust Identity 1](/docs/manage/1-s3-backups-github-actions-04-trust-identity-1.jpg)

Once you select the **Identity Provider**, you’ll be shown a number of fields to fill out.

Select `sts.amazonaws.com` from the **Audience dropdown** menu, then fill out the GitHub repository details as per your requirements.

When you’re ready, click **Next**.
![AWS Trust Identity 2](/docs/manage/1-s3-backups-github-actions-05-trust-identity-2.jpg)

## Add Permissions — Skip

You can skip selecting anything from this screen and click **Next** to continue.

## Name, review and create

On this screen give the **Role** a name and description. You’ll use the **Role** name in the code for the GitHub Action. Consider naming this role using specifics as to avoid confusion later down the line.

When you’re ready click **Create role**.

![AWS Trust Identity 3](/docs/manage/1-s3-backups-github-actions-06-trust-identity-3.jpg)

## Setup AWS S3 bucket

There are two parts to creating an S3 bucket, they are:

1. Creating an S3 bucket
2. Updating the bucket policy

## Create S3 bucket

AWS S3 (Simple Storage Service) buckets are storage containers used to store objects in Amazon’s cloud storage service. An S3 bucket can store any amount of data, from files and documents to images and videos, or in the case of a database backup, a .gz (​​[GNU zip](https://www.gnu.org/software/gzip/)) file.

To create a new bucket, navigate to: **S3** > **buckets**, and click **Create bucket**.

![AWS S3 Bucket](/docs/manage/1-s3-backups-github-actions-07-bucket-1.jpg)

On the next screen select **General Purpose** for the bucket Type and then give your bucket a name.

The most important thing to notice on this screen is the **region** where you’re creating the bucket.

![AWS S3 Bucket](/docs/manage/1-s3-backups-github-actions-08-bucket-2.jpg)

It's recommended that you deploy your bucket to the same region as your database to minimize latency and reduce backup times. While having an S3 bucket in `us-east-1` and a database in `ap-southeast-1` isn't necessarily a problem, cross-region data transfers can take longer and may introduce additional costs.

## S3 bucket Policy

To ensure the **Role** being used in the GitHub Action can perform actions on the S3 bucket, you’ll need to update the bucket policy.

Select your bucket then select the **Permissions** tab and click **Edit**.

![AWS S3 Bucket Policy](/docs/manage/1-s3-backups-github-actions-09-bucket-3.jpg)

You can now add the following policy which grants the **Role** you created earlier access to perform S3 **List**, **Get**, **Put** and **Delete** actions.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::627917386332:role/neon-s3-backup-github-actions"
      },
      "Action": ["s3:ListBucket", "s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": ["arn:aws:s3:::neon-s3-backup", "arn:aws:s3:::neon-s3-backup/*"]
    }
  ]
}
```

From the snippet above replace the Role name `neon-s3-backup-github-actions` with your **Role** name and replace the S3 bucket name `neon-s3-backup` with your S3 bucket name. When you’re ready click **Save changes**.

## Next steps

There are a couple of things to note before moving on to the second part of this guide. You’ll be creating several GitHub Secrets to hold various values that you likely won’t want to expose or repeat in code. These are:

- `AWS_ACCOUNT_ID`: This can be found by clicking on your user name in the AWS console.
- `S3_BUCKET_NAME`: In this example, this value would be, `neon-s3-backup`
- `IAM_ROLE`: In this example this value would be, `neon-s3-backup-github-action`

Make a note of these values before you proceed to [part two](/docs/manage/backups-aws-s3-backup-part-2).
