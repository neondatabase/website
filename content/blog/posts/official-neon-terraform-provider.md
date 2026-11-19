---
title: 'The Neon Terraform provider is now official'
description: >-
  neondatabase/neon is now the official Terraform provider for Neon, maintained by the Neon team. Let's see how
  we got here and why we're betting big on IaC.
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
  image: 'https://cdn.neonapi.io/public/images/pages/blog/official-neon-terraform-provider/cover-v1.jpg'
  alt: Neon logo and the headline "The Neon Terraform provider is now official" next to a terraform required_providers block that sources neondatabase/neon, with the Neon and Terraform logos.
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
  image: 'https://cdn.neonapi.io/public/images/pages/blog/official-neon-terraform-provider/social-v1.jpg'
---

Infrastructure as code (IaC) has always been the right call for managing infrastructure over time, especially on larger teams. It has also always been painful to operate: someone had to write the config, chase drift and repair broken state by hand. That's why smaller projects mostly stuck with click-ops. Agents change that trade-off. Your agent reads the plan, fixes the config and runs the apply, and the code that describes your infrastructure is the best context it can get, since it reads your whole architecture from the repo instead of calling tools to piece it together. When agents operate your infrastructure, IaC is a no-brainer. That's why we [introduced neon.ts](https://neon.com/blog/introducing-neon-ts), our infrastructure-as-code file for Neon projects.

`neon.ts` works great when your stack is all Neon. Bigger teams, however, usually compose Neon with other cloud services such as AWS, Cloudflare, Resend or Sentry and reach for tools built for exactly that: [Terraform](https://developer.hashicorp.com/terraform), [OpenTofu](https://opentofu.org), [Pulumi](https://www.pulumi.com) or [Alchemy](https://alchemy.run). We want Neon to be a first-class citizen in all of them and part of that is maintaining first-party providers wherever they're needed.

So today, we're releasing an official Terraform provider for Neon: [`neondatabase/neon`](https://registry.terraform.io/providers/neondatabase/neon/latest) on the Terraform Registry, built in [neondatabase/terraform-provider-neon](https://github.com/neondatabase/terraform-provider-neon). It's currently in beta and we aim to release v1 in the next 1-2 weeks!

In this post, I want to share where the provider comes from, what's new and how to move over from the community provider. I also asked [Dmitry Kisler](https://www.linkedin.com/in/dkisler/) and Justin Frye, who co-wrote this post with me, a few questions along the way.

## Where the provider comes from

The official provider started as a community project. In July 2022, Dmitry created [kislerdm/terraform-provider-neon](https://github.com/kislerdm/terraform-provider-neon) and shipped its first release, v0.0.1, on January 5, 2023. He built it on [kislerdm/neon-sdk-go](https://github.com/kislerdm/neon-sdk-go), a Go SDK he generates from the Neon API's OpenAPI spec. Since then, the provider has had 39 releases and almost two million downloads on the Terraform Registry. Most of them are recent: 1.78 million downloads came in the last 12 months alone (likely thanks to agents!).

![Bar chart of Terraform Registry downloads per kislerdm/neon release, placed at each release date from January 2023 to September 2026. Most releases before 2025 have under 60,000 downloads; v0.9.0 has about 190,000, v0.13.0 from January 2026 about 686,000, v0.15.0 about 330,000 and v0.18.0 from September 2026 about 449,000.](https://cdn.neonapi.io/public/images/pages/blog/official-neon-terraform-provider/terraform-downloads.png)

Pulumi generates packages from Terraform providers, which is how the [Neon package in the Pulumi Registry](https://www.pulumi.com/registry/packages/neon/) exists today. So an official Terraform provider also gives us a path to an official Pulumi package.

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
- **November 2026:** the official `neondatabase/neon` provider ships its first beta, v0.19.0-beta.0, and we maintain it together with Dmitry and Justin. The current release is v0.19.0-beta.3.

## What's new since kislerdm/neon 0.18

v0.18.0, released in September 2026, is the last community release of kislerdm/neon. We shipped a lot of new Neon primitives in the meantime, so we used the move to an official provider to catch up. Over the last few weeks, Dmitry and Justin migrated the provider to Terraform's Plugin Framework and added resources for the newer Neon primitives. We reviewed and tested everything against the live API, added the remaining resources and made sure existing state moves over without replacing anything.

The Plugin Framework is what HashiCorp recommends for new providers and it's what makes ephemeral resources possible.

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

Ephemeral resources need Terraform 1.10 or OpenTofu 1.11 or later. The rest of the provider works with Terraform 1.5 and up.

Here are the resources we added since 0.18, grouped by Neon primitive:

- [Neon Functions](https://neon.com/docs/functions): `neon_function`, `neon_trigger`
- [Object Storage](https://neon.com/docs/storage/overview): `neon_bucket`, `neon_bucket_object`, `neon_service_credential`
- [Neon Auth](https://neon.com/docs/auth/overview): `neon_auth`, `neon_auth_trusted_domain`, `neon_auth_oauth_provider`
- [Realtime](https://neon.com/docs/realtime/overview): `neon_branch_realtime` and the ephemeral `neon_branch_realtime_secret`
- [Data API](https://neon.com/docs/data-api/get-started): `neon_data_api`
- Snapshots and custom branch domains: `neon_snapshot`, `neon_custom_branch_domain`
- Access and billing: `neon_project_member_role`, `neon_org_member_role`, `neon_org_spending_limit`

Enabling Realtime on a branch, for example, is one resource:


```terraform
resource "neon_branch_realtime" "this" {
  project_id      = neon_project.app.id
  branch_id       = neon_project.app.default_branch_id
  allowed_origins = ["https://app.example.com"]
}
```

## Meet Justin

To get the provider over the line, we brought in Justin Frye, a platform engineer who had already been contributing to it. He also built [pi-provider-neon-ai-gateway](https://github.com/randoneering/pi-provider-neon-ai-gateway), an extension that lets you use the Neon AI Gateway from the [pi](https://github.com/badlogic/pi-mono) coding agent, so we asked him about that too.

**Why did you build pi-provider-neon-ai-gateway?**

Selfishly, I wanted to use the gateway using my preferred coding agent. Initially, [Dominik](https://x.com/dominikkoch) worked on a more official provider through the official pi repo, but hit some resistance. It was much easier to take the work he started and, instead, build an extension to allow pi users to tap into the Neon AI Gateway as a provider. For me, having access to the gateway gave me access to multiple models from different providers with minimal resistance. There are several other providers out there that can route you to different models, but they add a cost on top of that. Neon does not.

**How is maintaining packages like this changing with AI?**

With the use of agents, maintaining the extension has been relatively easy. With every new update to the gateway, I can have one of my agents grab the specs, implement new models and run tests against the gateway to ensure functionality. Iterating on new versions has been something I enjoy and it makes managing my subscriptions easier since I technically only need one!

## Moving from kislerdm/neon

If you already manage Neon with kislerdm/neon 0.18, you keep your state and your databases. Change the provider source and pin the beta version, since Terraform only installs a beta release when `version` names it exactly:

```terraform
terraform {
  required_providers {
    neon = {
      source  = "neondatabase/neon"
      version = "0.19.0-beta.3"
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

## Why we shipped a beta

We wanted to get the official provider out quickly and hear from you early, so we released it as a beta. Every change runs the full acceptance test suite against a live Neon organization on Terraform 1.5, the oldest version we support, and Terraform 1.17. We also tested the release with OpenTofu 1.13, which installs the provider from the [OpenTofu registry](https://search.opentofu.org/provider/neondatabase/neon/latest) under the same `neondatabase/neon` address. So we think it's ready for real projects, whether you use Terraform or OpenTofu. We're still very much open to feedback: tell us what's missing, what feels off and what breaks. Pin the exact version and check the [changelog](https://github.com/neondatabase/terraform-provider-neon/blob/main/CHANGELOG.md) before you bump it.

If you want to get started, our [Terraform docs](https://neon.com/docs/reference/terraform) walk you through API keys, a first project and common errors, while the [Registry docs](https://registry.terraform.io/providers/neondatabase/neon/latest/docs) cover every resource. Issues and feature requests are always welcome in [neondatabase/terraform-provider-neon](https://github.com/neondatabase/terraform-provider-neon/issues).

A big thank you to Dmitry for building and maintaining the provider for over three years and to Justin for the work that made the official release possible. We're really excited to keep building it together.

Happy coding!
