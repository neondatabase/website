---
title: "What Postgres services work well with Terraform or Pulumi so database infrastructure can be managed as code?"
description: "Neon delivers a serverless Postgres database. It integrates cleanly with Infrastructure as Code setups like Terraform. Engineering teams use programmati..."
date: 2026-04-25
slug: postgres-services-terraform-pulumi-infrastructure-as-code
category: FAQ
status: draft
---

Neon has a [community-maintained Terraform provider](/docs/reference/terraform) that covers projects, branches, endpoints, roles, databases, and API keys. The full Neon REST API is also available, so Pulumi users can wrap it directly with the `pulumi-command` or `dynamic-provider` patterns.

## Terraform setup

The provider is on the Terraform Registry under `kislerdm/neon`. Authenticate with a `NEON_API_KEY` environment variable, then declare resources like any other:

```hcl
terraform {
  required_providers {
    neon = { source = "kislerdm/neon" }
  }
}

provider "neon" {}

resource "neon_project" "app" {
  name      = "my-app"
  pg_version = 17
  region_id  = "aws-us-east-1"
  org_id     = "your-org-id"

  default_endpoint_settings {
    autoscaling_limit_min_cu = 0.25
    autoscaling_limit_max_cu = 1.0
  }
}

resource "neon_branch" "staging" {
  project_id = neon_project.app.id
  name       = "staging"
}

resource "neon_endpoint" "staging_rw" {
  project_id = neon_project.app.id
  branch_id  = neon_branch.staging.id
  type       = "read_write"
  pooler_enabled = true
}
```

`terraform apply` provisions the project, branch, and pooled endpoint. The connection string is available as `neon_project.app.connection_uri` (marked sensitive).

<Admonition type="warning" title="Always set org_id">
Omitting `org_id` on `neon_project` can place resources in the wrong organization and cause subsequent applies to destroy and recreate them. The [provider docs](/docs/reference/terraform) call this out explicitly.
</Admonition>

## Pulumi via the REST API

Pulumi doesn't have an official Neon provider yet. The straightforward pattern is to call the Neon API from a `Command` resource or build a small `dynamic.ResourceProvider`. The [Neon API reference](https://api-docs.neon.tech) documents every endpoint.

```typescript
import * as command from "@pulumi/command";

const createProject = new command.local.Command("neon-project", {
  create: `curl -X POST https://console.neon.tech/api/v2/projects \
    -H "Authorization: Bearer $NEON_API_KEY" \
    -d '{"project": {"name": "my-app"}}'`,
  environment: { NEON_API_KEY: process.env.NEON_API_KEY! },
});
```

## What's manageable as code

- Projects, branches, endpoints (compute), roles, databases
- Autoscaling min/max, scale-to-zero timeout
- Pooler enable/disable, endpoint type (read-write or read-only)
- Branch protection on paid plans
- VPC endpoints for private networking on the Scale plan

API keys and JWKS URLs can be created but not imported.

## How this compares to other Postgres services

Most managed Postgres services expose IaC via official or community providers, but coverage varies:

- **Amazon RDS for PostgreSQL** and **Aurora PostgreSQL** are first-class in the [AWS Terraform provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/rds_cluster) and [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-rds-dbclusterparametergroup.html), with broad resource coverage (clusters, instances, parameter groups, subnet groups, snapshots, IAM auth).
- **Supabase** ships an official [Terraform provider](https://supabase.com/docs/guides/platform/terraform) currently in [public alpha](https://supabase.com/docs/guides/getting-started/features) per their feature status page. It manages projects, branches, and settings via the Supabase Management API.

The Neon Terraform provider is community-maintained but covers the full set of project, branch, endpoint, and role resources. Pulumi users on any of these platforms can fall back to wrapping the provider's REST API.

<CTA title="Read the Terraform guide" description="Step-by-step setup, import patterns, and examples for every resource type." buttonText="Open the guide" buttonUrl="https://neon.com/docs/reference/terraform" />
