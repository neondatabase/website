---
title: How to create an AWS S3 bucket for Postgres backups
description: >-
  Schedule a Github Action to move data from your Neon projects to S3 every
  night - Part 1
excerpt: >-
  In this post, I’ll walk you through setting up an AWS S3 bucket to store
  Postgres backups. This is part 1 of a 2-part series on automating nightly
  backups for multiple Neon projects—a helpful approach if you’re managing
  hundreds or even thousands of Neon projects (e.g. in multi-t...
date: '2024-10-28T18:26:13'
updatedOn: '2024-10-29T16:51:32'
category: workflows
categories:
  - workflows
authors:
  - paul-scanlon
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-create-an-aws-s3-bucket-for-postgres-backups/cover.jpg
  alt: null
isFeatured: false
seo:
  title: How to create an AWS S3 bucket for Postgres backups - Neon
  description: >-
    Learn how to run nightly backups for your Neon projects using GitHub
    Actions, pg_dump/restore and an AWS S3 bucket. Part 1/2.
  keywords: []
  noindex: false
  ogTitle: How to create an AWS S3 bucket for Postgres backups - Neon
  ogDescription: >-
    Learn how to run nightly backups for your Neon projects using GitHub
    Actions, pg_dump/restore and an AWS S3 bucket. Part 1/2.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-create-an-aws-s3-bucket-for-postgres-backups/social.jpg
source:
  wpId: 7388
  wpSlug: how-to-create-an-aws-s3-bucket-for-postgres-backups
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-create-an-aws-s3-bucket-for-postgres-backups/how-to-create-an-aws-s3-1024x576-424d7f4f.jpg)

**In this post, I’ll walk you through setting up an AWS S3 bucket to store Postgres backups. This is part 1 of a 2-part series on automating nightly backups for multiple Neon projects—a helpful approach if you’re managing hundreds or even thousands of Neon projects (e.g. [in multi-tenant architectures with one project per customer](https://neon.tech/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases)).**

Neon already provides [S3-level durability](https://neon.tech/blog/our-approach-to-high-availability) and [rollback options for changes](https://neon.tech/docs/guides/branch-restore) made to databases, however some customers still want to back up data to their own S3. This is somewhat simple if you only have one project, but Neon users often adopt a [database-per-tenant architecture](https://neon.tech/use-cases/database-per-tenant)—making manually backing up each project to S3 can feel overwhelming.

Setting up a scheduled GitHub Action for each database simplifies this process, making the workflow much easier to manage. This first post will focus on the AWS side of things; [in the following post, I explain how the GitHub Actions work.](https://neon.tech/blog/nightly-backups-for-multiple-neon-projects)

## Setup AWS Providers and Roles

There are three parts to the AWS setup, they are:

1. Creating an OIDC Identity Provider
2. Creating a Role
3. Creating an S3 bucket and updating the S3 bucket policy

### Add an Identity provider

An OIDC (OpenID Connect) Identity Provider (IdP) in AWS is a third-party service that handles authentication. GitHub must be added as an identity provider to allow the Action to use your AWS credentials.

To create a new Identity Provider, navigate to **IAM** > **Access Management** > **Identity Providers**, and click **Add provider**.

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-create-an-aws-s3-bucket-for-postgres-backups/ad4nxdmoa1txsvviu8wlngjjsid5evt3in3uqbu7lvblits8oqzpmebgzbbiibwqx-q2tftg7gvcczxwrvcrb5kjj8rp22q3vp0xippegwroi2yru4hlk95wxm2tcrvorxyn9bki7kijxa0itmqoqwk8hnbnj-5cb1d1c9.png)

On the next screen select **OpenID Connect** and add the following to the Provider URL and Audience fields.

1. Provider URL: [https://token.actions.githubusercontent.com](https://token.actions.githubusercontent.com/)
2. Audience: **sts.amazonaws.com**

When you’re done, click **Add Provider**.

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-create-an-aws-s3-bucket-for-postgres-backups/ad4nxctcwhettkzoxln-o0cvo-gvbl5792bmxgczshymznmru128mjd4v2u7sxwxutixi03ngk7hqjtmrrzl1p-4efto2728wjojvwwgus8y0ueh696rzt9n1owoiaocxz6fsnnbpwokv8kgwtvccz1czc35vk-ea22bcea.png)

You should now see this provider is visible in the list under **IAM** > **Access Management** > **Identity Providers**.

### Create Role

A Role is an identity that you can assume to obtain temporary security credentials for specific tasks or actions within AWS. Roles are used to delegate permissions and grant access to AWS services without the need for credentials like passwords or access keys.<br />To create a new Role, navigate to **IAM** > **Access Management** > **Roles**, and click **Create role**.

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-create-an-aws-s3-bucket-for-postgres-backups/ad4nxcgj57yvq7gfcqeqxifih3vsmldzhfzpb-orxlzllbso0zyixq6mf8ggripxy5f1irzfrfqoazhyqsvsjhahgy2ut56dmqbyaqqxj1cpier7qyslnwlgvxi1n7foozzogsftkmnyldzoknzlalk-61jnqk-74ce9666.png)

On the next screen you can create a Trusted Identity for the Role.

#### Select Trusted Identity

On this screen select **Web Identity**, then select **token.actions.githubusercontent.com** from the **Identity Provider** dropdown menu.

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-create-an-aws-s3-bucket-for-postgres-backups/ad4nxdstb3gt5bxqc1hvyhqhzsxiurhhzlvcukcz93zhns9qxoiuynbofgwgjfao5tmosurab1rb8w-q-lkcue2xk74hvlb5a6ljjmz29qxegzpkjuevdcllqrb-ziovgva-yphnkz0rn-8p9fwtivx6fjam-199b23a5.png)

Once you select the Identity Provider, you’ll be shown a number of fields to fill out. Select **sts.amazonaws.com** from the **Audience** dropdown menu, then fill out the GitHub repository details as per your requirements. When you’re ready, click **Next**.

For reference, the options shown in the image below are for the following repository:

- [https://github.com/neondatabase-labs/neon-multiple-db-s3-backups](https://github.com/neondatabase-labs/neon-multiple-db-s3-backups)

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-create-an-aws-s3-bucket-for-postgres-backups/ad4nxcduc6xq37nf65fssu6zpmkl-x9me8maovz-hkqhymvnq9sjucsxpnntrf2hw1lxvdaolz1rpalkp35cdiiwhqukz-kuvklmw8fmphpo5b9lm3pocrmn9l4nxu2uchwd3wum2zjvgd3ruobizcszavhj-5f55b92f.png)

#### Add Permissions — Skip

You can skip selecting anything from this screen and click **Next** to continue.

#### Name, review and create

On this screen give the Role a name and description. You’ll use the Role name in the code for the GitHub Action. Consider naming this role using specifics as to avoid confusion later down the line.<br />When you’re ready click **Create role**.

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-create-an-aws-s3-bucket-for-postgres-backups/ad4nxcp8pluwjepohgpzprwn3-fa7va1zdahxryj8l0ulcj0fizu7p-enelll2cmkqzoxjlk4ajci6vbibwxdkcxcekdvzfcpe6klnikviytwfm50mdbgdpr49vkwt3n-fodww8fdvoshy-w8dkvwerqsu-kn-b765c03b.png)

## Setup AWS S3 bucket

There are two parts to creating an S3 bucket, they are:

1. Creating an S3 bucket
2. Updating the bucket policy

### Create S3 bucket

AWS S3 (Amazon Simple Storage Service) buckets are storage containers used to store objects in Amazon’s cloud storage service. An S3 bucket can store any amount of data, from files and documents to images and videos, or in the case of a database backup, a `.gz` ([GNU zip](https://www.gnu.org/software/gzip/)) file.

To create a new bucket, navigate to **S3** > **buckets**, and click **Create bucket.**

**! [Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-create-an-aws-s3-bucket-for-postgres-backups/ad4nxca1a9ty6kg5gk4txtwyfcwbpefuijkyovablv6uuwezbmf9wz3dbcquoy55ssi7yy1ahznkrtmoeaqbncipemkcmgmvrj5knttv5qs9jyoxst7d4esyzccxk-j34k5g9l6qsyz9munqtqr4wxwypxf71wv-e84b5212.png)**

On the next screen select **General Purpose** for the bucket Type and then give your bucket a name.

The most important thing to notice on this screen **i** s the **region** where you’re creating the bucket.

**! [Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-create-an-aws-s3-bucket-for-postgres-backups/ad4nxevfdmdg5d8khlrmnrarkcdhxr0lql41ogkssfty7rc2kznbfev1tgjdqvtmofonzn53wjwu2jkbl2tqfhx-fpwgttevlhfze5lu4t2m2vx2p1qzakvou-1xugs64v5yypsmcm0pm8yuelpsjwtn687uo-c1e98757.png)**

It might be difficult to know ahead of time which region each and every one of your databases has been deployed to, and it’s not necessarily a big problem to have an S3 bucket in us-east-1 and a database in ap-southeast-1, but naturally, the greater the distance the data has to travel, the longer a backup job might take to complete.

### S3 bucket Policy

To ensure the Role being used in the GitHub Action can perform actions on the S3 bucket, you’ll need to update the bucket policy.

Select your bucket then select the **Permissions** tab and click **Edit**.

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-create-an-aws-s3-bucket-for-postgres-backups/ad4nxeqevtb7feqpngmpww2om5bto4ryf4piprjk7o-oog9nk49xos7cig1ogqyxtsfxuihfesgklewl5wmmlod2vvglucufxb2fgqiyrnwdpartjgbvzxhhblbemufobqazuubgrvwql4syitn9lyyfzfht-adaecc09.png)

You can now add the following policy which grants the Role you created earlier access to perform S3 List, Get, Put and Delete actions.

```
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Principal": {
				"AWS": "arn:aws:iam::627917386332:role/neon-multiple-db-s3-backups-github-action"
			},
			"Action": [
				"s3:ListBucket",
				"s3:GetObject",
				"s3:PutObject",
				"s3:DeleteObject"
			],
			"Resource": [
				"arn:aws:s3:::neon-multiple-db-s3-backups",
				"arn:aws:s3:::neon-multiple-db-s3-backups/*"
			]
		}
	]
}
```

From the snippet above replace the Role name (**neon-multiple-db-s3-backups-github-action**) with your Role name and replace the S3 bucket name **(neon-multiple-db-s3-backups**) with your S3 bucket name. When you’re ready click **Save changes**.

And that’s it.

## Finished

There are just a couple of things to note before moving on to the second part of this blog post series. You’ll be creating several GitHub Secrets to hold various values that you likely won’t want to expose or repeat in code. These are:

- `AWS_ACCOUNT_ID`: This can be found by clicking on your user name in the AWS console.
- `S3_BUCKET_NAME`: In my case, this would be, **neon-multiple-db-s3-backups**
- `IAM_ROLE`: In my case this would be, **neon-multiple-db-s3-backups-github-action**

Make a note of these so you have them ready [for the next part!](https://neon.tech/blog/nightly-backups-for-multiple-neon-projects)

---

_Neon is a Postgres provider that takes the world’s most loved database and delivers it as a serverless platform with autoscaling, scale-to-zero, and database branching. [Get started with our Free Plan](https://console.neon.tech/signup) in seconds (no credit card required)._
