---
title: Migrate from kislerdm/neon to the Neon Terraform provider
subtitle: Move an existing configuration from the community provider to neondatabase/neon without recreating resources
summary: >-
  Step-by-step migration from the community Terraform provider `kislerdm/neon`
  v0.18.0 to the official `neondatabase/neon` provider: point the state at the
  new provider with `terraform state replace-provider`, update blocks to
  nested attributes and `"yes"`/`"no"` strings to booleans, replace removed
  password attributes with ephemeral resources, and confirm that the first plan
  shows no changes. Includes the configuration change tables and the errors the
  old syntax produces.
enableTableOfContents: true
tag: beta
updatedOn: '2026-11-12T06:13:30.409Z'
---

`neondatabase/neon` is the official Neon Terraform provider and continues the community provider `kislerdm/neon`. Your projects, branches, computes, roles, and databases stay in place during the migration: the provider upgrades the state written by `kislerdm/neon` v0.18.0 on the first plan, so nothing is imported again or recreated.

The configuration changes, though. The provider moved to the [Terraform Plugin Framework](https://developer.hashicorp.com/terraform/plugin/framework), so blocks become nested attributes, `"yes"` and `"no"` strings become booleans, and the attributes that stored passwords in the state are gone.

## Before you begin

- Terraform 1.5 or later. The `neon_role` and `neon_connection_uri` ephemeral resources, which replace the removed password attributes, need Terraform 1.10 or later.
- State written by `kislerdm/neon` v0.18.0. If you use an older version, upgrade to v0.18.0 and run `terraform apply` first, so that the state has the v0.18.0 shape.
- A copy of your current state, so you can return to it if you stop before applying:

  ```bash
  terraform state pull > pre-migration.tfstate
  ```

  The file contains the passwords and connection strings that `kislerdm/neon` stored in the state. Keep it out of version control, and delete it once you no longer need to roll back.

## Migrate your configuration

<Steps>

## Change the provider source

Point `required_providers` at `neondatabase/neon`. The provider is in beta, and Terraform installs a beta release only when the version is pinned exactly:

```terraform
terraform {
  required_providers {
    neon = {
      source  = "kislerdm/neon" # [!code --]
      source  = "neondatabase/neon" # [!code ++]
      version = "0.19.0-beta.0" # [!code ++]
    }
  }
}
```

## Move the state to the new provider

Replace the provider address in the state, then download the new provider:

```bash shouldWrap
terraform state replace-provider registry.terraform.io/kislerdm/neon registry.terraform.io/neondatabase/neon
terraform init -upgrade
```

`terraform state replace-provider` lists the resources it moves and asks for confirmation.

## Update the configuration

Rewrite the configuration as described in [Configuration changes](#configuration-changes). Until you do, `terraform plan` fails with the errors listed in [Errors from the old syntax](#errors-from-the-old-syntax).

## Review the plan

```bash
terraform plan
```

After the configuration changes, the plan shows no changes, or only in-place updates. If it shows a resource being replaced or destroyed, don't apply it. Compare your configuration with the tables below, or [open an issue](https://github.com/neondatabase/terraform-provider-neon/issues) with the plan output.

## Apply

```bash
terraform apply
```

The apply writes the state in the new provider's format. After this step, `kislerdm/neon` can no longer read the state; return to `pre-migration.tfstate` if you need to go back.

</Steps>

## Configuration changes

### neon_project

`branch`, `primary_compute`, `maintenance_window`, and `quota` are nested attributes. Add `=` after the name, and move the default database and role names to the top level:

```terraform
# kislerdm/neon v0.18.0
resource "neon_project" "this" {
  name = "app"

  branch {
    name          = "main"
    database_name = "app"
    role_name     = "app_owner"
  }
  default_branch_protected   = true
  enable_logical_replication = "yes"
}

# neondatabase/neon
resource "neon_project" "this" {
  name          = "app"
  database_name = "app"
  database_user = "app_owner"

  branch = {
    name      = "main"
    protected = true
  }
  enable_logical_replication = true
}
```

| v0.18.0                                                                                                                                                                      | neondatabase/neon                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `branch { ... }`, `primary_compute { ... }`, `maintenance_window { ... }`, `quota { ... }`                                                                                   | `branch = { ... }` and so on                 |
| `branch.database_name`, `branch.role_name`                                                                                                                                   | `database_name`, `database_user`             |
| `default_branch_protected`                                                                                                                                                   | `branch.protected`                           |
| `allowed_ips_protected_branches_only`, `block_public_connections`, `block_vpc_connections`, `enable_logical_replication`, `hipaa`, `store_password` set to `"yes"` or `"no"` | `true` or `false`                            |
| `connection_uri`, `connection_uri_pooler`, `database_password`                                                                                                               | the `neon_connection_uri` ephemeral resource |

References change with the nested attributes: `neon_project.this.branch[0].id` becomes `neon_project.this.branch.id`. The attributes `default_branch_id`, `default_endpoint_id`, `database_host`, and `database_host_pooler` still work and are deprecated; use `branch.id`, `primary_compute.id`, `primary_compute.host`, and `primary_compute.host_pooler` instead.

If you remove `default_branch_protected = true` and don't set `branch.protected`, the branch stays protected, because the provider keeps the value it reads from Neon.

### neon_branch

`protected` is a boolean: `"yes"` becomes `true`, and `"no"` becomes `false`.

### neon_endpoint

| v0.18.0        | neondatabase/neon                      |
| -------------- | -------------------------------------- |
| `host_pooling` | `host_pooler`                          |
| `proxy_host`   | removed                                |
| `pg_settings`  | removed until the Neon API supports it |

### neon_role

The `password` attribute is removed, so the password no longer ends up in the state. Read it with the `neon_role` ephemeral resource, or read a full connection string with the `neon_connection_uri` ephemeral resource:

```terraform
ephemeral "neon_connection_uri" "app" {
  project_id = neon_project.this.id
  branch_id  = neon_project.this.branch.id
  database   = neon_project.this.database_name
  role       = neon_project.this.database_user
}
```

Pass `ephemeral.neon_connection_uri.app.uri` to a write-only argument of another resource, for example `value_wo` of `aws_ssm_parameter`. To learn more, see [ephemeral resources](https://developer.hashicorp.com/terraform/language/resources/ephemeral) in the Terraform documentation.

### neon_jwks_url

`branch_id` and `jwt_audience` no longer accept an empty string. If your configuration sets `branch_id = ""` or `jwt_audience = ""`, remove the line; the plan then shows no changes.

### Data sources

| v0.18.0                                                                                       | neondatabase/neon                            |
| --------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `data.neon_branch_role_password`                                                              | the `neon_role` ephemeral resource           |
| `data.neon_project` attributes `connection_uri`, `connection_uri_pooler`, `database_password` | the `neon_connection_uri` ephemeral resource |
| `data.neon_branches` attribute `branches[*].primary`                                          | `branches[*].default`                        |

## Errors from the old syntax

Running `terraform plan` with the new provider and the unchanged v0.18.0 configuration fails before Neon is contacted. Each error points at a line to change.

A block that's now a nested attribute:

```text
Error: Unsupported block type

  on main.tf line 18, in resource "neon_project" "p":
  18:   branch {

Blocks of type "branch" are not expected here. Did you mean to define
argument "branch"? If so, use the equals sign to assign it a value.
```

Add `=` after the name: `branch = { ... }`.

A `"yes"` or `"no"` string:

```text
Error: Incorrect attribute value type

  on main.tf line 13, in resource "neon_project" "p":
  13:   enable_logical_replication          = "no"

Inappropriate value for attribute "enable_logical_replication": a bool is
required.
```

Replace the string with `true` or `false`.

A removed attribute:

```text
Error: Unsupported argument

  on main.tf line 16, in resource "neon_project" "p":
  16:   default_branch_protected            = true

An argument named "default_branch_protected" is not expected here.
```

Look up the replacement in [Configuration changes](#configuration-changes).

A removed data source:

```text
Error: Invalid data source
```

Replace `data.neon_branch_role_password` with the `neon_role` ephemeral resource.

## Known issue in 0.19.0-beta.0

Changing `allowed_ips` on a project with `allowed_ips_protected_branches_only = true` fails with `Provider produced inconsistent result after apply`, and Neon turns the protected-branches restriction off. Run `terraform apply` again: the second apply sets `allowed_ips_protected_branches_only` back to `true`. The next provider release fixes this.

---

## Related docs (Tools & Workflows)

- [Manage Neon with Terraform](/docs/reference/terraform)
- [Neon Terraform provider on the Terraform Registry](https://registry.terraform.io/providers/neondatabase/neon/latest/docs)
- [Manage API keys](/docs/manage/api-keys)
- [Protected branches](/docs/guides/protected-branches)

<NeedHelp/>
