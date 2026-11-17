---
title: 'The Neon Terraform provider is now official'
description: >-
  The community Terraform provider for Neon is now the official neondatabase/neon provider, in beta, with ephemeral
  credentials, the newer Neon primitives and a one-command move for existing state.
excerpt: >-
  Since 2022, Neon users have managed their projects with kislerdm/neon, the community Terraform provider Dmitry
  Kisler started. Today it continues as the official neondatabase/neon provider, maintained by Neon together with
  Dmitry and Justin Frye.
date: '2026-11-18T17:00:00'
updatedOn: '2026-11-18T17:00:00'
category: product
categories:
  - product
  - community
authors:
  - andre-landgraf
  - dmitry-kisler
  - justin-frye
cover:
  image: 'https://cdn.neonapi.io/public/images/pages/blog/official-neon-terraform-provider/cover.png'
  alt: Neon logo above the headline "The Neon Terraform provider is now official" on a dark dotted background.
isFeatured: false
seo:
  title: 'The Neon Terraform provider is now official - Neon'
  description: >-
    neondatabase/neon is the official Terraform provider for Neon, in beta: ephemeral credentials, Functions, Object
    Storage, Neon Auth and Realtime, plus a one-command move from kislerdm/neon.
  keywords: []
  noindex: false
  ogTitle: 'The Neon Terraform provider is now official - Neon'
  ogDescription: >-
    neondatabase/neon is the official Terraform provider for Neon, in beta: ephemeral credentials, Functions, Object
    Storage, Neon Auth and Realtime, plus a one-command move from kislerdm/neon.
  image: 'https://cdn.neonapi.io/public/images/pages/blog/official-neon-terraform-provider/social.png'
---

In July 2022, Dmitry Kisler started [kislerdm/terraform-provider-neon](https://github.com/kislerdm/terraform-provider-neon), a community Terraform provider for Neon. It has been the way to manage Neon with Terraform ever since, with almost two million downloads on the Terraform Registry and 380 commits from Dmitry alone.

Starting today, that provider continues as the official one: [`neondatabase/neon`](https://registry.terraform.io/providers/neondatabase/neon/latest) on the Terraform Registry, built in [neondatabase/terraform-provider-neon](https://github.com/neondatabase/terraform-provider-neon). Neon maintains it together with Dmitry and Justin Frye, who did a large share of the work to get it here. It's in beta, and the current release is 0.19.0-beta.2.

<!-- TODO(Dmitry): a few sentences in your own words on why you started the provider and what handing it to Neon means to you -->

## What's new since kislerdm/neon 0.18

The biggest change is under the hood. We moved the provider from Terraform's Plugin SDK v2 to the Plugin Framework, which is what Terraform recommends for new providers and what unlocks ephemeral resources. Dmitry wrote most of that migration, and Justin added many of the new resources on top of it, including `neon_function`, `neon_trigger`, `neon_snapshot`, `neon_data_api` and the organization spending limit.

Ephemeral resources keep credentials out of the state file. With kislerdm/neon, a role password or connection URI ended up in `terraform.tfstate`. Now you read it during the run and hand it straight to the place that needs it:

```terraform
resource "neon_project" "app" {
  name = "app"
}

ephemeral "neon_connection_uri" "app" {
  project_id  = neon_project.app.id
  branch_id   = neon_project.app.branch.id
  endpoint_id = neon_project.app.primary_compute.id
  database    = neon_project.app.database_name
  role        = neon_project.app.database_user
}

resource "aws_ssm_parameter" "database_url" {
  name             = "/app/database-url"
  type             = "SecureString"
  value_wo         = ephemeral.neon_connection_uri.app.uri
  value_wo_version = 1
}
```

Ephemeral resources need Terraform 1.10 or later. The rest of the provider works with Terraform 1.5 and up.

The provider also caught up with the Neon platform. Since 0.18 we added resources for [Neon Functions](https://neon.com/docs/functions) (`neon_function`, `neon_trigger`), [Object Storage](https://neon.com/docs/storage/overview) (`neon_bucket`, `neon_bucket_object`, `neon_service_credential`), [Neon Auth](https://neon.com/docs/auth/overview) (`neon_auth`, `neon_auth_trusted_domain`, `neon_auth_oauth_provider`), [Realtime](https://neon.com/docs/realtime/overview) (`neon_branch_realtime` and the ephemeral `neon_branch_realtime_secret`), the [Data API](https://neon.com/docs/data-api/get-started), snapshots, custom branch domains, project and organization member roles and organization spending limits. Enabling Realtime on a branch, for example, is one resource:

```terraform
resource "neon_branch_realtime" "this" {
  project_id      = neon_project.app.id
  branch_id       = neon_project.app.default_branch_id
  allowed_origins = ["https://app.example.com"]
}
```

<!-- TODO(Justin): a few sentences in your own words on the Plugin Framework migration and what you'd like people to try first -->

## Moving from kislerdm/neon

If you already manage Neon with kislerdm/neon 0.18, you keep your state and your databases. Change the provider source and pin the beta version, since Terraform only installs a beta release when `version` names it exactly:

```terraform
terraform {
  required_providers {
    neon = {
      source  = "neondatabase/neon"
      version = "0.19.0-beta.2"
    }
  }
}
```

Then point the existing state at the new provider and review the plan:

```shell
terraform state replace-provider registry.terraform.io/kislerdm/neon registry.terraform.io/neondatabase/neon
terraform init -upgrade
terraform plan
```

A few attributes changed shape on the way to the Plugin Framework. Nested blocks like `branch` and `primary_compute` are nested attributes now, and `"yes"`/`"no"` strings are booleans. The [migration guide](https://neon.com/docs/reference/terraform-migrate) lists every change. After those edits, the plan should show no changes or only in-place updates. If it shows a resource being replaced, don't apply it; [open an issue](https://github.com/neondatabase/terraform-provider-neon/issues) with the plan output instead.

## What beta means here

Beta means the configuration you write today may still need small changes before 1.0, and every one of them will be in the [changelog](https://github.com/neondatabase/terraform-provider-neon/blob/main/CHANGELOG.md). We run the full acceptance test suite against a live Neon organization on Terraform 1.5 and 1.17 for every change, so the provider is ready for real projects. Pin the exact version, read the changelog before you bump it, and tell us what breaks.

The provider is also listed on the [OpenTofu registry](https://search.opentofu.org/provider/neondatabase/neon/latest) under the same `neondatabase/neon` address.

## Get started

The [Terraform docs](https://neon.com/docs/reference/terraform) walk through API keys, a first project and common errors, and the [Registry docs](https://registry.terraform.io/providers/neondatabase/neon/latest/docs) cover every resource. Issues and feature requests go to [neondatabase/terraform-provider-neon](https://github.com/neondatabase/terraform-provider-neon/issues).

A big thank you to Dmitry for building and maintaining the provider for over three years, and to Justin for the work that made the official release possible.

Happy coding!
