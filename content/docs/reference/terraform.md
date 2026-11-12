---
title: Manage Neon with Terraform
subtitle: Define Neon projects, branches, computes, and backend resources as code with the official Neon Terraform provider
summary: >-
  The official Neon Terraform provider (`neondatabase/neon`) manages Neon
  projects, branches, computes, roles, databases, Functions, triggers, Object
  Storage, the Data API, snapshots, API keys, and access settings from HCL.
  Choose this page to install the provider, authenticate it, write a first
  configuration, import existing resources, and learn the behaviors to plan
  around. If you use the community provider `kislerdm/neon`, follow the
  migration guide instead.
enableTableOfContents: true
tag: beta
updatedOn: '2026-11-12T06:13:30.350Z'
---

<Admonition type="note" title="Beta">
The Neon Terraform provider is in beta. Terraform installs a beta release only when the version constraint names it exactly, so pin `version = "0.19.0-beta.0"` as shown on this page. Report problems in the [provider's GitHub repository](https://github.com/neondatabase/terraform-provider-neon/issues).
</Admonition>

The [Neon Terraform provider](https://registry.terraform.io/providers/neondatabase/neon/latest/docs) lets you declare Neon resources in HCL and manage them with `terraform plan` and `terraform apply`. It's published to the Terraform Registry as `neondatabase/neon` and maintained by Neon in [neondatabase/terraform-provider-neon](https://github.com/neondatabase/terraform-provider-neon).

The provider continues the community provider `kislerdm/neon`, created and maintained by Dmitry Kisler. If your configuration uses `kislerdm/neon`, see [Migrate from kislerdm/neon](/docs/reference/terraform-migrate). Your existing resources stay in place, and the provider upgrades your state on the first plan.

## What you can manage

The provider covers Lakebase Postgres and the other Neon backend primitives. Each resource has a page in the [registry documentation](https://registry.terraform.io/providers/neondatabase/neon/latest/docs) with its arguments, attributes, and import format.

| Area                  | Resources and data sources                                                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Projects and branches | `neon_project`, `neon_branch`, `neon_endpoint`, `neon_role`, `neon_database`                                                                 |
| Backups               | `neon_snapshot`, `neon_branch_backup_schedule`                                                                                               |
| Functions             | `neon_function`, `neon_trigger`, `neon_custom_branch_domain`                                                                                 |
| Object Storage        | `neon_bucket`, `neon_bucket_object`, `neon_service_credential`                                                                               |
| Data API and auth     | `neon_data_api`, `neon_jwks_url`                                                                                                             |
| Access and billing    | `neon_api_key`, `neon_org_api_key`, `neon_project_permission`, `neon_project_member_role`, `neon_org_member_role`, `neon_org_spending_limit` |
| Private networking    | `neon_vpc_endpoint_assignment`, `neon_vpc_endpoint_restriction`                                                                              |
| Data sources          | `neon_project`, `neon_branches`, `neon_branch_endpoints`, `neon_branch_roles`, `neon_bucket`, `neon_ai_gateway`, `neon_active_regions`       |
| Ephemeral resources   | `neon_connection_uri` and `neon_role`, which read connection strings and passwords without writing them to the Terraform state               |

## Prerequisites

- Terraform 1.5 or later. Ephemeral resources need Terraform 1.10 or later, and write-only arguments such as `value_wo` need Terraform 1.11 or later.
- A Neon API key. Use an [organization API key](/docs/manage/api-keys) for most resources. Neon refuses organization API keys for `neon_api_key`, `neon_org_api_key`, `neon_project_permission`, `neon_project_member_role`, `neon_org_member_role`, and the `neon_active_regions` data source; those need a personal API key.

## Set up the provider

<Steps>

## Declare the provider

Create a `main.tf` file and pin the provider version:

```terraform filename="main.tf"
terraform {
  required_providers {
    neon = {
      source  = "neondatabase/neon"
      version = "0.19.0-beta.0"
    }
  }
}

provider "neon" {}
```

## Provide your API key

The provider reads the key from the `NEON_API_KEY` environment variable:

```bash
export NEON_API_KEY="<your_api_key>"
```

You can also set `api_key` in the `provider` block, for example from a variable populated by your secrets manager. Don't commit API keys to version control.

## Initialize Terraform

```bash
terraform init
```

Terraform downloads the provider and checks its signature:

```text
- Installed neondatabase/neon v0.19.0-beta.0 (self-signed, key ID 922DFC48EB2F15FF)
```

</Steps>

If a configuration also manages resources that need a personal API key, add a second provider configuration with an alias and select it on those resources:

```terraform
variable "neon_personal_api_key" {
  type      = string
  sensitive = true
}

provider "neon" {
  alias   = "personal"
  api_key = var.neon_personal_api_key
}

resource "neon_api_key" "ci" {
  provider = neon.personal
  name     = "ci"
}
```

## Create a project with a branch, compute, role, and database

The following configuration creates a project, a `dev` branch with its own read-write compute, and a role and database on that branch. Replace the organization ID with your own, which you can find on your organization's **Settings** page in the Neon Console.

```terraform filename="main.tf"
resource "neon_project" "app" {
  name      = "my-app"
  org_id    = "org-cool-sea-12345678"
  region_id = "aws-us-east-2"
}

resource "neon_branch" "dev" {
  project_id = neon_project.app.id
  parent_id  = neon_project.app.branch.id
  name       = "dev"
}

resource "neon_endpoint" "dev" {
  project_id               = neon_project.app.id
  branch_id                = neon_branch.dev.id
  autoscaling_limit_min_cu = 0.25
  autoscaling_limit_max_cu = 1
}

resource "neon_role" "app" {
  project_id = neon_project.app.id
  branch_id  = neon_branch.dev.id
  name       = "app"

  # Neon creates roles through the branch's read-write compute.
  depends_on = [neon_endpoint.dev]
}

resource "neon_database" "app" {
  project_id = neon_project.app.id
  branch_id  = neon_branch.dev.id
  name       = "app"
  owner_name = neon_role.app.name
}

output "dev_host" {
  value = neon_endpoint.dev.host
}
```

Run `terraform plan` to review the changes, then `terraform apply` to create the resources. The project's default branch gets its own compute, role, and database, which the `neon_project` attributes `branch`, `primary_compute`, `database_name`, and `database_user` expose.

### Pass connection strings without storing them

The provider doesn't store passwords or connection strings in the Terraform state. To hand a connection string to another system, read it with the `neon_connection_uri` ephemeral resource and pass it to a write-only argument, such as `value_wo` on an AWS SSM parameter:

```terraform
ephemeral "neon_connection_uri" "app" {
  project_id = neon_project.app.id
  branch_id  = neon_branch.dev.id
  database   = neon_database.app.name
  role       = neon_role.app.name
}

resource "aws_ssm_parameter" "database_url" {
  name             = "/my-app/dev/DATABASE_URL"
  type             = "SecureString"
  value_wo         = ephemeral.neon_connection_uri.app.uri
  value_wo_version = 1
}
```

The ephemeral resource also returns `uri_pooler`, the [pooled connection](/docs/connect/connection-pooling) string. Use the `neon_role` ephemeral resource when you only need a role's password.

## Add Functions, Object Storage, and the Data API

Backend resources attach to a branch, the same way computes do. This example adds a public bucket with an object, a Function deployed from a ZIP file, a scheduled trigger that invokes it, and the [Data API](/docs/data-api/overview) on the default branch:

```terraform filename="main.tf"
resource "neon_bucket" "assets" {
  project_id   = neon_project.app.id
  branch_id    = neon_project.app.branch.id
  name         = "assets"
  access_level = "public_read"
}

resource "neon_bucket_object" "hello" {
  project_id   = neon_bucket.assets.project_id
  branch_id    = neon_bucket.assets.branch_id
  bucket       = neon_bucket.assets.name
  key          = "hello.txt"
  content      = "Hello from Terraform"
  content_type = "text/plain"
}

# The ZIP must contain an index.mjs whose default export has a fetch handler.
data "archive_file" "hello" {
  type        = "zip"
  output_path = "${path.module}/hello.zip"
  source {
    filename = "index.mjs"
    content  = "export default { fetch: () => new Response('Hello from Neon Functions') };"
  }
}

resource "neon_function" "hello" {
  project_id       = neon_project.app.id
  branch_id        = neon_project.app.branch.id
  slug             = "hello"
  runtime          = "nodejs24"
  zip_file_path    = data.archive_file.hello.output_path
  source_code_hash = data.archive_file.hello.output_base64sha256
}

resource "neon_trigger" "hourly" {
  project_id    = neon_project.app.id
  branch_id     = neon_project.app.branch.id
  name          = "hourly"
  type          = "schedule"
  function_slug = neon_function.hello.slug
  cron          = "0 * * * *"
}

resource "neon_data_api" "this" {
  project_id    = neon_project.app.id
  branch_id     = neon_project.app.branch.id
  database_name = neon_project.app.database_name
  auth_provider = "neon_auth"
}

output "function_url" {
  value = neon_function.hello.invocation_url
}

output "data_api_url" {
  value = neon_data_api.this.url
}
```

The `archive_file` data source comes from the `hashicorp/archive` provider. Function slugs are 1 to 20 lowercase letters and digits. To learn more about these primitives, see [Neon Functions](/docs/compute/functions/overview), [triggers](/docs/compute/functions/triggers/overview), and [Object Storage](/docs/storage/overview).

## Import existing resources

Resources you created in the Neon Console, CLI, or API can be brought under Terraform with `import` blocks. Write the `resource` block and add an `import` block with the resource's ID:

```terraform
import {
  to = neon_project.app
  id = "cool-sea-12345678"
}

import {
  to = neon_branch.dev
  id = "cool-sea-12345678/br-small-snow-a1b2c3d4"
}
```

Run `terraform plan` to review the imports. When the plan also shows changes, update your configuration until it reports only imports, then run `terraform apply` to save the imported resources in the state. The import ID formats are:

| Resource                      | Import ID                                      |
| ----------------------------- | ---------------------------------------------- |
| `neon_project`                | `<project_id>`                                 |
| `neon_branch`                 | `<project_id>/<branch_id>`                     |
| `neon_endpoint`               | `<project_id>/<endpoint_id>`                   |
| `neon_role`, `neon_database`  | `<project_id>/<branch_id>/<name>`              |
| `neon_branch_backup_schedule` | `<project_id>/<branch_id>`                     |
| `neon_snapshot`               | `<project_id>/<snapshot_id>`                   |
| `neon_bucket`                 | `<project_id>/<branch_id>/<bucket_name>`       |
| `neon_bucket_object`          | `<project_id>/<branch_id>/<bucket_name>/<key>` |
| `neon_function`               | `<project_id>/<branch_id>/<slug>`              |
| `neon_trigger`                | `<project_id>/<branch_id>/<trigger_id>`        |
| `neon_data_api`               | `<project_id>/<branch_id>/<database_name>`     |
| `neon_jwks_url`               | `<project_id>/<jwks_id>`                       |

Some values can't be read back from Neon, so the first apply after an import sets them again: bucket object content, Function environment variable values, and secrets. Importing `neon_data_api` doesn't read `auth_provider`, and setting it after an import replaces the Data API, so import it without `auth_provider` in the configuration.

## Plan around these behaviors

- **Pin the provider version.** Review the [changelog](https://github.com/neondatabase/terraform-provider-neon/blob/main/CHANGELOG.md) and run `terraform plan` before you change the version. In CI, run `terraform init` without `-upgrade`.
- **Protect what you can't recreate.** Add [`prevent_destroy`](https://developer.hashicorp.com/terraform/language/meta-arguments/lifecycle#prevent_destroy) to projects and branches that hold production data, and use [protected branches](/docs/guides/protected-branches) on paid plans.
- **Set `org_id` on every project.** With a personal API key, a project without `org_id` is created in your personal account instead of your organization.
- **Create the compute before roles and databases.** Neon creates roles and databases through the branch's read-write compute, so add `depends_on = [neon_endpoint.<name>]` to roles on a branch whose compute Terraform also creates. Otherwise the apply fails with `Branch has no read-write compute`.
- **Ephemeral resources open during plan.** When a run adds a role to an existing project and an ephemeral resource reads that role, the plan fails with `Neon role not found`, because the role doesn't exist yet. Create the role first with `terraform apply -target=neon_role.app`, then apply the rest.
- **Replacing a bucket deletes its objects.** Changing `name`, `access_level`, `project_id`, or `branch_id` on `neon_bucket` replaces the bucket, and Neon deletes a bucket together with every object in it, including objects your application uploaded. The plan shows the bucket replacement, but not the objects that go with it.
- **Some secrets are stored in the state.** The keys of `neon_api_key` and `neon_org_api_key`, and the tokens of `neon_service_credential`, are marked sensitive but stored in the state, so keep the state in an encrypted [backend](https://developer.hashicorp.com/terraform/language/backend) with restricted access.

---

## Related docs (Tools & Workflows)

- [Migrate from kislerdm/neon](/docs/reference/terraform-migrate)
- [Manage API keys](/docs/manage/api-keys)
- [Protected branches](/docs/guides/protected-branches)
- [Branching](/docs/introduction/branching)
- [Neon Functions](/docs/compute/functions/overview)
- [Object Storage](/docs/storage/overview)
- [Neon Data API](/docs/data-api/overview)
- [Neon API](/docs/reference/api)

<NeedHelp/>
