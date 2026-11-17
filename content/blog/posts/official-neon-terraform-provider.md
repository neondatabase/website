---
title: 'The Neon Terraform provider is now official'
description: >-
  The community Terraform provider for Neon is now the official neondatabase/neon provider. We talked to
  Dmitry Kisler, who started it in 2022, and Justin Frye, who helped us get it here.
excerpt: >-
  Infrastructure as code is a great fit for agents. Bigger teams compose Neon with AWS, Cloudflare and more in
  Terraform, OpenTofu, Pulumi or Alchemy. That's why kislerdm/neon, the community Terraform provider Dmitry Kisler
  started in 2022, is now the official neondatabase/neon provider.
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
    neondatabase/neon is the official Terraform provider for Neon. It started as the community provider
    kislerdm/neon and now supports ephemeral credentials, Functions, Object Storage, Neon Auth and Realtime.
  keywords: []
  noindex: false
  ogTitle: 'The Neon Terraform provider is now official - Neon'
  ogDescription: >-
    neondatabase/neon is the official Terraform provider for Neon. It started as the community provider
    kislerdm/neon and now supports ephemeral credentials, Functions, Object Storage, Neon Auth and Realtime.
  image: 'https://cdn.neonapi.io/public/images/pages/blog/official-neon-terraform-provider/social.png'
---

Infrastructure as code (IaC) has always been a great idea that was a bit cumbersome in practice. Resources drifted, state broke and someone had to clean it up by hand. With agents, that changes, because your agent reads the plan, fixes the config and runs the apply for you. We made that case when we [introduced neon.ts](https://neon.com/blog/introducing-neon-ts), our infrastructure-as-code file for Neon projects.

`neon.ts` works great when your stack is all Neon. Bigger teams, however, usually compose Neon with other cloud services such as AWS, Cloudflare or Vercel and reach for tools built for exactly that: [Terraform](https://developer.hashicorp.com/terraform), [OpenTofu](https://opentofu.org), [Pulumi](https://www.pulumi.com) or [Alchemy](https://alchemy.run). We want Neon to be a first-class citizen in all of them and part of that is maintaining first-party providers wherever they're needed.

So today, we're releasing an official Terraform provider for Neon: [`neondatabase/neon`](https://registry.terraform.io/providers/neondatabase/neon/latest) on the Terraform Registry, built in [neondatabase/terraform-provider-neon](https://github.com/neondatabase/terraform-provider-neon). It's in beta and the current release is 0.19.0-beta.2.

In this post, we want to share where the provider comes from, what's new and how to move over from the community provider. We also asked Dmitry Kisler and Justin Frye, who co-wrote this post with me, a few questions along the way.

## Where the provider comes from

The official provider started as a community project. In July 2022, Dmitry Kisler created two repositories: [kislerdm/neon-sdk-go](https://github.com/kislerdm/neon-sdk-go), a Go SDK generated from the Neon API's OpenAPI spec, and [kislerdm/terraform-provider-neon](https://github.com/kislerdm/terraform-provider-neon), the Terraform provider built on it. Both shipped their first release in January 2023 and both have kept up with Neon ever since:

| | Terraform provider (kislerdm/neon) | Go SDK (neon-sdk-go) |
| --- | --- | --- |
| First release | v0.0.1, January 5, 2023 | v0.1.0, January 3, 2023 |
| Releases | 39, up to v0.18.0 | 56, up to v0.36.0 |
| Usage | 1,956,631 downloads on the Terraform Registry | Imported by 8 packages on pkg.go.dev |
| GitHub stars | 116 | 26 |

The [Neon package in the Pulumi Registry](https://www.pulumi.com/registry/packages/neon/) is bridged from the same provider. Funny enough, the official provider still builds on Dmitry's SDK, too.

Instead of starting over, we worked with Dmitry on porting his provider to `neondatabase/neon` and making it official. We asked him two questions.

**Why did you start a Terraform provider for Neon?**

I met Nikita [Shamgunov, Neon's co-founder] and a couple of Neon engineers at WeAreDevelopers in Berlin in 2022. Despite my initial skepticism, which I raised as the question "how are you going to compete with Aurora and AWS?", the guys' rationale and strong understanding of Postgres ins and outs made me a fan right there and then. I subscribed as a beta tester and looked forward to trying their product. The idea of separating storage from compute wasn't new, but Neon's delivery was spotless. The branching feature was simply mind blowing!

I obviously wanted to automate infra provisioning. At the time, there was no provider, nor a CLI available. I decided to solve that problem to ease my own life, but also to give back to the community. That's how I decided to develop a Neon Terraform provider. I made its first release back in January 2023 and maintained it with community support, which I'm deeply grateful for.

**What does it mean to you that the provider is now official?**

I find it a privilege when the project you built to solve your own particular problem is useful to others. It motivated me throughout the years when I steered the provider's development. At the same time, that work felt like a big responsibility, because users have certain expectations of the OSS they trust as a dependency. At times, it felt like a huge responsibility that unfortunately I could not keep up with due to my other commitments.

It felt amazing when you approached me and shared that the Databricks/Neon team picked my project as the basis for the official Terraform provider. I was over the moon and über grateful for such an honor! I look forward to our further collaboration, and I will invest as much of my available time as I can for the project to grow and gain more success.

### Timeline

- **2022:** Dmitry meets Nikita and Neon engineers at WeAreDevelopers in Berlin and signs up for the Neon beta.
- **July 2022:** Dmitry creates neon-sdk-go and terraform-provider-neon.
- **January 2023:** neon-sdk-go v0.1.0 (January 3) and the first provider release, v0.0.1 on the Terraform Registry (January 5).
- **September 2026:** kislerdm/neon v0.18.0, the last of 39 community releases.
- **November 2026:** the official `neondatabase/neon` provider ships its first beta, v0.19.0-beta.0, and we maintain it together with Dmitry and Justin. The current release is v0.19.0-beta.2.

## What's new since kislerdm/neon 0.18

Most of the work went into something you won't see in your config. We moved the provider from Terraform's Plugin SDK v2 to the Plugin Framework, which is what HashiCorp recommends for new providers and what makes ephemeral resources possible. Dmitry wrote most of that migration.

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

## Meet Justin

To get the provider over the line, we brought in Justin Frye, a platform engineer who had already been contributing to it. Justin added many of the new resources, including `neon_function`, `neon_trigger`, `neon_snapshot`, `neon_data_api` and the organization spending limit. He also built [pi-provider-neon-ai-gateway](https://github.com/randoneering/pi-provider-neon-ai-gateway), an extension that lets you use the Neon AI Gateway from the [pi](https://github.com/badlogic/pi-mono) coding agent, so we asked him about that too.

**Why did you build pi-provider-neon-ai-gateway?**

Selfishly, I wanted to use the gateway using my preferred coding agent. Initially, Dominik worked on a more official provider through the official pi repo, but hit some resistance. It was much easier to take the work he started and, instead, build an extension to allow pi users to tap into the Neon AI Gateway as a provider. For me, having access to the gateway gave me access to multiple models from different providers with minimal resistance. There are several other providers out there that can route you to different models, but they add a cost on top of that. Neon does not.

**How is maintaining packages like this changing with AI?**

With the use of agents, maintaining the extension has been relatively easy. With every new update to the gateway, I can have one of my agents grab the specs, implement new models and run tests against the gateway to ensure functionality. Iterating on new versions has been something I enjoy and it makes managing my subscriptions easier since I technically only need one!

**What do you typically do for your clients?**

My client work varies because platform engineering covers a lot of ground: some teams need infrastructure built to support their product, while others bring me in to fix a specific problem, like bot traffic on their service. Maintaining open source projects taught me to work async, across industries and alongside a lot of skilled engineers, which makes it easier to jump into a new team's stack.

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

A few attributes changed shape on the way to the Plugin Framework. Nested blocks like `branch` and `primary_compute` are nested attributes now and `"yes"`/`"no"` strings are booleans. The [migration guide](https://neon.com/docs/reference/terraform-migrate) lists every change. After those edits, the plan should show no changes or only in-place updates. If it shows a resource being replaced, don't apply it; [open an issue](https://github.com/neondatabase/terraform-provider-neon/issues) with the plan output instead.

The provider is also on the [OpenTofu registry](https://search.opentofu.org/provider/neondatabase/neon/latest) under the same `neondatabase/neon` address.

## What beta means here

Beta means the configuration you write today may still need small changes before 1.0 and every one of them will be in the [changelog](https://github.com/neondatabase/terraform-provider-neon/blob/main/CHANGELOG.md). We run the full acceptance test suite against a live Neon organization on Terraform 1.5 and 1.17 for every change, so we think it's ready for real projects. Pin the exact version, read the changelog before you bump it and tell us what breaks.

The [Terraform docs](https://neon.com/docs/reference/terraform) walk through API keys, a first project and common errors. The [Registry docs](https://registry.terraform.io/providers/neondatabase/neon/latest/docs) cover every resource. Issues and feature requests go to [neondatabase/terraform-provider-neon](https://github.com/neondatabase/terraform-provider-neon/issues).

A big thank you to Dmitry for building and maintaining the provider for over three years and to Justin for the work that made the official release possible. We're really excited to keep building it together.

Happy coding!
