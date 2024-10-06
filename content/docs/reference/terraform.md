---
title: Neon Terraform providers
enableTableOfContents: true
tag: community
updatedOn: '2024-10-04T19:39:10.721Z'
---

The following is a list of community-created Terraform providers for managing Neon Postgres platform resources.

<Admonition type="note">
Community Terraform providers are not maintained or officially supported by Neon. Use these providers at your own discretion. If you have questions about the providers, please contact the the project maintainers.
</Admonition>

- **Terraform Provider Neon — Maintainer: Dmitry Kisler** (sponsored by Neon)

  - [GitHub repository](https://github.com/kislerdm/terraform-provider-neon)
  - [Terraform Registry](https://registry.terraform.io/providers/kislerdm/neon/0.6.1)
  - [Terraform Registry Documentation](https://registry.terraform.io/providers/kislerdm/neon/latest/docs)

- **Terraform Neon Provider — Maintainer: Pavan Kumar Sunkara**
  - [GitHub repository](https://github.com/terraform-community-providers/terraform-provider-neon)
  - [Terraform Registry](https://registry.terraform.io/providers/terraform-community-providers/neon/latest)
  - [Terraform Registry Documentation](https://registry.terraform.io/providers/terraform-community-providers/neon/latest/docs)

## Important usage notes

- **Provider upgrades**: When using `terraform init -upgrade` to update a custom Terraform provider, be aware that changes in the provider’s schema or defaults can lead to unintended resource replacements. This may occur when certain attributes are altered or reset. For example, fields previously set to specific values might be reset to `null`, forcing the replacement of the entire resource.

  To avoid unintended resource replacements which can result in data loss:

  - Review the provider’s changelog for any breaking changes that might affect your resources before upgrading to a new version.
  - For CI pipelines and auto-approved pull requests, only use `terraform init`. Running `terraform init -upgrade` should be done manually followed by plan reviews.
  - Run `terraform plan` before applying any changes to detect potential differences and review the behavior of resource updates.
  - Use [lifecycle protections](https://developer.hashicorp.com/terraform/language/meta-arguments/lifecycle#prevent_destroy) on critical resources to ensure they're not recreated unintentionally.
  - Explicitly define all critical resource parameters in your Terraform configurations, even if they had defaults previously.
  - On Neon paid plans, you can enable branch protection to prevent unintended deletion of branches and projects. To learn more, see [Protected branches](/docs/guides/protected-branches).

- **Provider maintenance**: As Neon enhances existing features and introduces new ones, the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) will continue to evolve. These changes may not immediately appear in community-maintained Terraform providers. If you notice that a provider requires an update, please reach out to the maintainer by opening an issue or contributing to the provider's GitHub repository.

## Terraform example

**Neon Postgres for Terraform with Go**

This example shows how to use Go to execute Terraform commands and test Terraform configurations. It covers how to:

- Use Go's os/exec package to run Terraform commands
- Write a Go test function to validate Terraform execution
- Execute Terraform commands such as init, plan, and apply

**YouTube tutorial**: [Neon Postgres for Terraform with Go](https://www.youtube.com/watch?v=Pw38lgfbX0s)

**GitHub repository**: [go-terraform](https://github.com/mattmajestic/go-terraform)

## Resources

- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
- [Initialize Terraform configuration](https://developer.hashicorp.com/terraform/tutorials/cli/init)
- [Terraform plan command](https://developer.hashicorp.com/terraform/cli/commands/plan)
- [Terraform: Manage resource lifecycle](https://developer.hashicorp.com/terraform/tutorials/state/resource-lifecycle)
