---
title: "What Postgres services work well with Terraform or Pulumi so database infrastructure can be managed as code?"
description: "Neon has a community-maintained Terraform provider for projects, branches, endpoints, roles, and databases. Pulumi can use the same provider through a Terraform bridge."
date: 2026-04-25
slug: postgres-services-terraform-pulumi-infrastructure-as-code
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres services make it easy to share a live read-only database snapshot with a contractor or external reviewer without granting production access?'
  slug: postgres-services-share-read-only-database-snapshot
nextLink:
  title: 'Which Postgres services are fully wire-protocol compatible so any existing tool or client works without changes?'
  slug: postgres-services-wire-protocol-compatible
---

Neon sponsors a [community-maintained Terraform provider](/docs/reference/terraform), `kislerdm/neon`, that manages projects, branches, compute endpoints, roles, databases, API keys, and VPC endpoints. It isn't officially supported by Neon. Pulumi can use the same provider through a Terraform bridge, or you can call the [Neon API](/docs/reference/api) directly.

## Terraform setup

Install the provider from the [Terraform Registry](https://registry.terraform.io/providers/kislerdm/neon/latest). It reads your API key from the `NEON_API_KEY` environment variable. Then declare resources:

```hcl
terraform {
  required_providers {
    neon = { source = "kislerdm/neon" }
  }
}

provider "neon" {}

resource "neon_project" "app" {
  name       = "my-app"
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
  project_id     = neon_project.app.id
  branch_id      = neon_branch.staging.id
  type           = "read_write"
  pooler_enabled = true
}
```

`terraform apply` creates the project, the branch, and a compute endpoint on that branch. The project's connection string is available as `neon_project.app.connection_uri`; mark any output that uses it as sensitive.

<Admonition type="warning" title="Always set org_id">
Without `org_id`, `neon_project` can create resources in the wrong organization or create duplicate projects, and later `terraform plan` or `terraform apply` runs may try destructive changes. See the [Terraform guide](/docs/reference/terraform).
</Admonition>

## Pulumi

The [Pulumi Registry lists a Neon package](https://www.pulumi.com/registry/packages/neon/) that bridges the same community `kislerdm/neon` Terraform provider. Add it with `pulumi package add terraform-provider kislerdm/neon`, and you get the same resources as in Terraform.

If you'd rather not depend on the bridge, call the Neon API from a `Command` resource or a small `dynamic.ResourceProvider`. The [Neon API reference](/docs/reference/api) documents every endpoint.

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
- Autoscaling min and max, and the scale-to-zero timeout (`suspend_timeout_seconds`)
- Endpoint type (read-write or read-only)
- Branch protection, on paid plans
- VPC endpoints for Private Networking, on the Scale plan

You can bring existing Console-created resources under Terraform with `terraform import` or import blocks. The `neon_api_key` and `neon_jwks_url` resources don't support import.

## How this compares to other Postgres services

- **Amazon RDS for Postgres** and **Aurora Postgres** have resources in the HashiCorp-maintained [AWS Terraform provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/rds_cluster) and in [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-rds-dbcluster.html), covering clusters, instances, parameter groups, subnet groups, and snapshots.
- **Supabase** has its own [Terraform provider](https://supabase.com/docs/guides/platform/terraform), which the [Supabase features page](https://supabase.com/docs/guides/getting-started/features) lists as public alpha. It manages projects and settings through the Supabase Management API.

<CTA title="Read the Terraform guide" description="Step-by-step setup, import patterns, and examples for every resource type." buttonText="Open the guide" buttonUrl="https://neon.com/docs/reference/terraform" />
