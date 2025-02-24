---
title: Set up a GitHub Action to perform nightly Postgres backups
enableTableOfContents: true
tag: new
updatedOn: '2025-02-22T14:55:35.232Z'
---

In this guide, you'll learn how to configure nightly Postgres backups using a scheduled GitHub Action and `pg_dump`.

<Admonition type="note">
This is part two of a two-part guide.
Go back to part one [here](/docs/manage/backups-aws-s3-backup-part-1).
</Admonition>

## Prerequisites

Setting up a scheduled backup involves three key components:

### 1. AWS Requirements

- You’ll need your **AWS Account ID** and permissions to:
  - Create **IAM Roles** and **Identity Providers**
  - Create and manage **S3 buckets**
  - Update **S3 bucket policies**

### 2. Postgres Database

- Ensure you have:
  - The **connection string** for your database
  - The **AWS region** where your database is deployed
  - The **Postgres version** your database is running

### 3. GitHub Action

- You’ll need **repository access** with permission to manage:
  - **Actions** and **Settings** > **Secrets and variables**

## Neon project setup

Before looking at the code, first take a look at your Neon console dashboard. In our example there is only one project, with a single database named `acme-co-prod`. This database is running Postgres 17 and deployed in the `us-east-1` region.

The goal is to backup this database to it's own folder inside an S3 bucket using the same name.

![Neon Console](/docs/manage/2-s3-backups-github-actions-01-neon-projects.jpg)

## Scheduled GitHub Action

Using the same database naming convention as above, create a new file for the GitHub Action using the following folder structure.

```shell
.github
  |-- workflows
      |-- acme-co-prod-backup.yml
```

![Neon Console](/docs/manage/2-s3-backups-github-actions-02-github-workflows.jpg)

This GitHub Action will run on a recurring schedule and save the backup file to a S3 bucket as defined by the environment variables. Below the code snippet we've explained what each part of the Action does.

```yml
name: acme-co-prod-backup

on:
  schedule:
    - cron: '0 5 * * *' # Runs at midnight EST (us-east-1)
  workflow_dispatch:

jobs:
  db-backup:
    runs-on: ubuntu-latest

    permissions:
      id-token: write

    env:
      RETENTION: 7
      DATABASE_URL: ${{ secrets.ACME_CO_PROD }}
      IAM_ROLE: ${{ secrets.IAM_ROLE }}
      AWS_ACCOUNT_ID: ${{ secrets.AWS_ACCOUNT_ID }}
      S3_BUCKET_NAME: ${{ secrets.S3_BUCKET_NAME }}
      AWS_REGION: 'us-east-1'
      PG_VERSION: '17'

    steps:
      - name: Install PostgreSQL
        run: |
          sudo apt update
          yes '' | sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
          sudo apt install -y postgresql-${{ env.PG_VERSION }}

      - name: Set PostgreSQL binary path
        run: echo "POSTGRES=/usr/lib/postgresql/${{ env.PG_VERSION }}/bin" >> $GITHUB_ENV

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::${{ env.AWS_ACCOUNT_ID }}:role/${{ env.IAM_ROLE }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Set file, folder and path variables
        run: |
          GZIP_NAME="$(date +'%B-%d-%Y@%H:%M:%S').gz"
          FOLDER_NAME="${{ github.workflow }}"
          UPLOAD_PATH="s3://${{ env.S3_BUCKET_NAME }}/${FOLDER_NAME}/${GZIP_NAME}"

          echo "GZIP_NAME=${GZIP_NAME}" >> $GITHUB_ENV
          echo "FOLDER_NAME=${FOLDER_NAME}" >> $GITHUB_ENV
          echo "UPLOAD_PATH=${UPLOAD_PATH}" >> $GITHUB_ENV

      - name: Create folder if it doesn't exist
        run: |
          if ! aws s3api head-object --bucket ${{ env.S3_BUCKET_NAME }} --key "${{ env.FOLDER_NAME }}/" 2>/dev/null; then
            aws s3api put-object --bucket ${{ env.S3_BUCKET_NAME }} --key "${{ env.FOLDER_NAME }}/"
          fi

      - name: Run pg_dump
        run: |
          $POSTGRES/pg_dump ${{ env.DATABASE_URL }} | gzip > "${{ env.GZIP_NAME }}"

      - name: Empty bucket of old files
        run: |
          THRESHOLD_DATE=$(date -d "-${{ env.RETENTION }} days" +%Y-%m-%dT%H:%M:%SZ)
          aws s3api list-objects --bucket ${{ env.S3_BUCKET_NAME }} --prefix "${{ env.FOLDER_NAME }}/" --query "Contents[?LastModified<'${THRESHOLD_DATE}'] | [?ends_with(Key, '.gz')].{Key: Key}" --output text | while read -r file; do
            aws s3 rm "s3://${{ env.S3_BUCKET_NAME }}/${file}"
          done

      - name: Upload to bucket
        run: |
          aws s3 cp "${{ env.GZIP_NAME }}" "${{ env.UPLOAD_PATH }}" --region ${{ env.AWS_REGION }}
```

## Action configuration

The first part of the GitHub Action specifies the name of the Action and sets the schedule for when it should run.

```yml
name: acme-co-prod-backup

on:
  schedule:
    - cron: '0 5 * * *' # Runs at midnight EST (us-east-1)
  workflow_dispatch:
```

- `name` : The workflow name and will also be used when creating the folder in the S3 bucket
- `cron`: This determines how often the Action will run, take a look a the GitHub docs where the [POSIX cron syntax](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#schedule) is explained
- `workflow_dispatch`: This allows you to trigger the workflow manually from the GitHub UI

## Environment variables

The next part deals with environment variables. Some variables are set inline in the Action but others are defined using [GitHub Secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository).

```yml
env:
  RETENTION: 7
  DATABASE_URL: ${{ secrets.ACME_CO_PROD }}
  IAM_ROLE: ${{ secrets.IAM_ROLE }}
  AWS_ACCOUNT_ID: ${{ secrets.AWS_ACCOUNT_ID }}
  S3_BUCKET_NAME: ${{ secrets.S3_BUCKET_NAME }}
  AWS_REGION: 'us-east-1'
  PG_VERSION: '17'
```

- `RETENTION`: Determines how long a backup file should be retained before it’s deleted
- `DATABASE_URL`: The Neon Postgres connection string for the database you’re backing up
- `IAM_ROLE`: The name of the AWS IAM Role
- `AWS_ACCOUNT_ID`: Your AWS Account Id
- `S3_BUCKET_NAME`: The name of the S3 bucket where all backups are being stored
- `AWS_REGION`: The region where the S3 bucket is deployed
- `PG_VERSION`: The version of Postgres to install in the GitHub Action environment

## GitHub Secrets

As mentioned earlier, several of the environment variables in the Action are defined using GitHub secrets. These secrets can be added to your repository by navigating to **Settings** > **Secrets and variables** > **Actions**.

![GitHub Secrets](/docs/manage/2-s3-backups-github-actions-03-github-secrets.jpg)

## Install PostgreSQL

This step installs Postgres into the GitHub Action’s virtual environment. The version to install is defined by the `PG_VERSION` environment variable.

```yml
- name: Install PostgreSQL
  run: |
    sudo apt update
    yes '' | sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
    sudo apt install -y postgresql-${{ env.PG_VERSION }}
```

## Set PostgreSQL binary path

This step sets the `$POSTGRES` variable, allowing easy access to the Postgres binaries in the GitHub Action's environment.

```yml
- name: Set PostgreSQL binary path
  run: echo "POSTGRES=/usr/lib/postgresql/${{ env.PG_VERSION }}/bin" >> $GITHUB_ENV
```

## Configure AWS credentials

This step configures the AWS credentials, enabling secure interaction between the GitHub Action and AWS services.

```yml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::${{ env.AWS_ACCOUNT_ID }}:role/${{ env.IAM_ROLE }}
    aws-region: ${{ env.AWS_REGION }}
```

## Set file, folder and path variables

This step involves setting three variables that are all output to `GITHUB_ENV`. This allows other steps in the Action to access them.

```yml
- name: Set file, folder and path variables
  run: |
    GZIP_NAME="$(date +'%B-%d-%Y@%H:%M:%S').gz"
    FOLDER_NAME="${{ github.workflow }}"
    UPLOAD_PATH="s3://${{ env.S3_BUCKET_NAME }}/${FOLDER_NAME}/${GZIP_NAME}"

    echo "GZIP_NAME=${GZIP_NAME}" >> $GITHUB_ENV
    echo "FOLDER_NAME=${FOLDER_NAME}" >> $GITHUB_ENV
    echo "UPLOAD_PATH=${UPLOAD_PATH}" >> $GITHUB_ENV
```

The three variables are as follows:

1. `GZIP_NAME`: The name of the `.gz` file derived from the date e.g, `February-20-2025@07:53:02.gz`
2. `FOLDER_NAME`: The folder where the `.gz` files are to be uploaded
3. `UPLOAD_PATH`: This is the full path that includes the S3 bucket name, folder name and `.gz` file

## Create folder if it doesn’t exist

This step creates a new folder (if one doesn’t already exist) inside the S3 bucket using the `FOLDER_NAME` as defined in the previous step.

```yml
- name: Create folder if it doesn't exist
  run: |
    if ! aws s3api head-object --bucket ${{ env.S3_BUCKET_NAME }} --key "${{ env.FOLDER_NAME }}/" 2>/dev/null; then
      aws s3api put-object --bucket ${{ env.S3_BUCKET_NAME }} --key "${{ env.FOLDER_NAME }}/"
    fi
```

## Run pg_dump

This step runs `pg_dump` and saves the output in the Action's virtual memory using the `GZIP_NAME` as defined in the previous step.

```yml
- name: Run pg_dump
  run: |
    $POSTGRES/$pg_dump ${{ env.DATABASE_URL }} | gzip > "${{ env.GZIP_NAME }}"
```

## Empty bucket of old files

This optional step automatically removes `.gz` files older than the retention period specified by the `RETENTION` variable. It checks the `FOLDER_NAME` directory and deletes outdated backups to save storage space.

```yml
- name: Empty bucket of old files
  run: |
    THRESHOLD_DATE=$(date -d "-${{ env.RETENTION }} days" +%Y-%m-%dT%H:%M:%SZ)
    aws s3api list-objects --bucket ${{ env.S3_BUCKET_NAME }} --prefix "${{ env.FOLDER_NAME }}/" --query "Contents[?LastModified<'${THRESHOLD_DATE}'] | [?ends_with(Key, '.gz')].{Key: Key}" --output text | while read -r file; do
      aws s3 rm "s3://${{ env.S3_BUCKET_NAME }}/${file}"
    done
```

## Upload to bucket

This step uploads the `.gz` file created by the `pg_dump` step and uploads it to the correct folder within the S3 bucket.

```yml
- name: Upload to bucket
  run: |
    aws s3 cp "${{ env.GZIP_NAME }}" "${{ env.UPLOAD_PATH }}" --region ${{ env.AWS_REGION }}
```

## Finished

After committing and pushing the workflow to your GitHub repository, the Action will automatically run on the specified schedule, ensuring your Postgres backups are performed regularly.
