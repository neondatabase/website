---
title: Manage Neon with Terraform
subtitle: Use Terraform to provision and manage your Neon projects, branches, endpoints,
  roles, databases, and other resources as code.
enableTableOfContents: true
tag: community
updatedOn: '2025-07-07T19:22:23.743Z'
---

Terraform is an open-source infrastructure as code (IaC) tool that allows you to define and provision cloud resources in a declarative configuration language. By codifying infrastructure, Terraform enables consistent, repeatable, and automated deployments, significantly reducing manual errors.

This guide will show you how to use **Terraform to manage your Neon projects**, including your branches, databases, and compute endpoints. By using Terraform with Neon, you get better control, can track changes, and automate your database setup.

Neon sponsors the following community-developed Terraform provider for managing Neon Postgres platform resources:

**Terraform Provider Neon - Maintainer: Dmitry Kisler**

- [GitHub repository](https://github.com/kislerdm/terraform-provider-neon)
- [Terraform Registry](https://registry.terraform.io/providers/kislerdm/neon/0.6.1)
- [Terraform Registry Documentation](https://registry.terraform.io/providers/kislerdm/neon/latest/docs)

<Admonition type="note">
This provider is not maintained or officially supported by Neon. Use at your own discretion. If you have questions about the provider, please contact the project maintainer.
</Admonition>

## Provider usage notes

- **Provider upgrades**: When using `terraform init -upgrade` to update a custom Terraform provider, be aware that changes in the provider’s schema or defaults can lead to unintended resource replacements. This may occur when certain attributes are altered or reset. For example, fields previously set to specific values might be reset to `null`, forcing the replacement of the entire resource.

  To avoid unintended resource replacements which can result in data loss:
  - Review the provider’s changelog for any breaking changes that might affect your resources before upgrading to a new version.
  - For CI pipelines and auto-approved pull requests, only use `terraform init`. Running `terraform init -upgrade` should be done manually followed by plan reviews.
  - Run `terraform plan` before applying any changes to detect potential differences and review the behavior of resource updates.
  - Use [lifecycle protections](https://developer.hashicorp.com/terraform/language/meta-arguments/lifecycle#prevent_destroy) on critical resources to ensure they're not recreated unintentionally.
  - Explicitly define all critical resource parameters in your Terraform configurations, even if they had defaults previously.
  - On Neon paid plans, you can enable branch protection to prevent unintended deletion of branches and projects. To learn more, see [Protected branches](/docs/guides/protected-branches).

- **Provider maintenance**: As Neon enhances existing features and introduces new ones, the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) will continue to evolve. These changes may not immediately appear in community-maintained Terraform providers. If you notice that a provider requires an update, please reach out to the maintainer by opening an issue or contributing to the provider's GitHub repository.

## Prerequisites

Before you begin, ensure you have the following:

1.  **Terraform CLI installed:** If you don't have Terraform installed, download and install it from the [official Terraform website](https://developer.hashicorp.com/terraform/install). The Neon provider requires Terraform version `1.14.x` or later.
2.  **Neon Account:** You'll need a Neon account. If you don't have one, sign up at [neon.tech](https://console.neon.tech/signup).
3.  **Neon API key:** Generate an API key from the Neon Console. Navigate to your Account Settings > API Keys. This key is required for the provider to authenticate with the Neon API. Learn more about creating API keys in [Manage API keys](/docs/manage/api-keys).

## Set up the Terraform Neon provider

1.  **Create a project directory:**
    Create a new directory for your Terraform project and navigate into it.

    ```shell
    mkdir neon-terraform-project
    cd neon-terraform-project
    ```

2.  **Create a `main.tf` file:**
    This file will contain your Terraform configuration. Start by declaring the required Neon provider.

    ```terraform
    terraform {
      required_providers {
        neon = {
          source  = "kislerdm/neon"
        }
      }
    }

    provider "neon" {}
    ```

3.  **Initialize terraform:**
    Run the `terraform init` command in your project directory. This command downloads and installs the Neon provider.
    ```shell
    terraform init
    ```

## Configure authentication

The Neon provider needs your Neon API key to manage resources. You can configure it in two ways:

1.  **Directly in the provider block (Less secure):**
    For quick testing, you can **hardcode your API key** directly within `provider "neon"` block. However, this method isn't recommended for production environments or shared configurations. A more secure alternative is to retrieve the API key from a secrets management service like [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) or [HashiCorp Vault](https://developer.hashicorp.com/vault), and then update your provider block to reflect this.

    ```terraform
    provider "neon" {
      api_key = "<YOUR_NEON_API_KEY>"
    }
    ```

2.  **Using environment variables:**
    The provider will automatically use the `NEON_API_KEY` environment variable if set.

    ```shell
    export NEON_API_KEY="<YOUR_NEON_API_KEY>"
    ```

    If the environment variable is set, you can leave the `provider "neon"` block empty:

    ```terraform
    provider "neon" {}
    ```

<Admonition type="note">
The following sections primarily detail the creation of Neon resources. To manage existing resources, use the `terraform import` command. More information can be found in the [Importing Existing Resources](#import-existing-neon-resources) section.
</Admonition>

## Manage Neon resources

Now you can start defining Neon resources in your `main.tf` file.

### Managing projects

A Neon project is the top-level container for your Postgres databases, branches, and endpoints.

```terraform
resource "neon_project" "my_app_project" {
  name       = "my-application-project"
  pg_version = 16
  region_id  = "aws-us-east-1"

  # Configure default branch settings (optional)
  branch {
    name          = "production"
    database_name = "app_db"
    role_name     = "app_admin"
  }

  # Configure default endpoint settings (optional)
  default_endpoint_settings {
    autoscaling_limit_min_cu = 0.25
    autoscaling_limit_max_cu = 1.0
    # suspend_timeout_seconds  = 300
  }
}
```

This configuration creates a new Neon project.

**Key `neon_project` attributes:**

- `name`: (Optional) Name of the project.
- `pg_version`: (Optional) PostgreSQL version (e.g., 14, 15, 16, 17).
- `region_id`: (Optional) The region where the project will be created (e.g., `aws-us-east-1`).
  > For up-to-date information on available regions, see [Neon Regions](/docs/introduction/regions).
- `branch {}`: (Optional) Block to configure the default primary branch.

**Output project details:**
You can output computed values like the project ID or connection URI:

```terraform
output "project_id" {
  value = neon_project.my_app_project.id
}

output "project_connection_uri" {
  description = "Default connection URI for the primary branch (contains credentials)."
  value       = neon_project.my_app_project.connection_uri
  sensitive   = true
}

output "project_default_branch_id" {
  value = neon_project.my_app_project.default_branch_id
}

output "project_database_user" {
  value = neon_project.my_app_project.database_user
}
```

For more attributes and options on managing projects, refer to the [Provider's documentation](https://github.com/kislerdm/terraform-provider-neon/blob/master/docs/resources/project.md).

### Managing branches

You can create branches from the primary branch or any other existing branch.

```terraform
resource "neon_branch" "dev_branch" {
  project_id = neon_project.my_app_project.id
  name       = "feature-x-development"
  parent_id  = neon_project.my_app_project.default_branch_id # Branch from the project's primary branch

  # Optional: Create a protected branch
  # protected = "yes"

  # Optional: Create from a specific LSN or timestamp of the parent
  # parent_lsn = "..."
  # parent_timestamp = 1678886400 # Unix epoch
}
```

**Key `neon_branch` attributes:**

- `project_id`: (Required) ID of the parent project.
- `name`: (Optional) Name for the new branch.
- `parent_id`: (Optional) ID of the parent branch. If not specified, defaults to the project's primary branch.
- `protected`: (Optional, String: "yes" or "no") Set to protect the branch.
- `parent_lsn`: (Optional) LSN of the parent branch to create from.
- `parent_timestamp`: (Optional) Timestamp of the parent branch to create from.

> `protected` attribute is only available for paid plans. It allows you to protect branches from deletion or modification.

For more attributes and options on managing branches, refer to the [Provider's documentation](https://github.com/kislerdm/terraform-provider-neon/blob/master/docs/resources/branch.md).

### Managing endpoints

Endpoints provide connection strings to access your branches. Each branch can have multiple read-only endpoints but only one read-write endpoint.

Before creating an endpoint, you must first create a **branch** for it to connect to. Here's how to create a read-write endpoint for your `dev_branch`:

```terraform
resource "neon_endpoint" "dev_endpoint" {
  project_id = neon_project.my_app_project.id
  branch_id  = neon_branch.dev_branch.id
  type       = "read_write" # "read_write" or "read_only"

  autoscaling_limit_min_cu = 0.25
  autoscaling_limit_max_cu = 0.5
  # suspend_timeout_seconds  = 600

  # Optional: Enable connection pooling
  # pooler_enabled = true
}

output "dev_endpoint_host" {
  value = neon_endpoint.dev_endpoint.host
}
```

**Key `neon_endpoint` attributes:**

- `project_id`: (Required) ID of the parent project.
- `branch_id`: (Required) ID of the branch this endpoint connects to.
- `type`: (Optional) `read_write` (default) or `read_only`. A branch can only have one `read_write` endpoint.
- `autoscaling_limit_min_cu`/`autoscaling_limit_max_cu`: (Optional) Compute units for autoscaling.
- `suspend_timeout_seconds`: (Optional) Inactivity period before suspension. Only available for paid plans.
- `pooler_enabled`: (Optional) Enable connection pooling.

<Admonition type="note">
It is not possible currently to change the endpoint type after creation. The `type` attribute is immutable, meaning you cannot modify it once the endpoint is created. This includes changing from `read_write` to `read_only` or vice versa. This is a limitation of the Neon API and the provider's current implementation. You must destroy the existing endpoint and create a new one with the desired type.
</Admonition>

For more attributes and options on managing endpoints, refer to the [Provider's documentation](https://github.com/kislerdm/terraform-provider-neon/blob/master/docs/resources/endpoint.md)

### Managing roles

Roles (users) are managed per branch. Before creating a role, ensure you have a branch created. Follow the [Managing Branches](#managing-branches) section for details.

```terraform
resource "neon_role" "app_user" {
  project_id = neon_project.my_app_project.id
  branch_id  = neon_branch.dev_branch.id
  name       = "application_user"
}

output "app_user_password" {
  value     = neon_role.app_user.password
  sensitive = true
}
```

**Key `neon_role` attributes:**

- `project_id`: (Required) ID of the parent project.
- `branch_id`: (Required) ID of the branch for this role.
- `name`: (Required) Name of the role.
- `password`: (Computed, Sensitive) The generated password for the role.

For more attributes and options on managing roles, refer to the [Provider's documentation](https://github.com/kislerdm/terraform-provider-neon/blob/master/docs/resources/role.md)

### Managing databases

Databases are also managed per branch. Follow the [Managing Branches](#managing-branches) section for details on creating a branch.

```terraform
resource "neon_database" "service_db" {
  project_id = neon_project.my_app_project.id
  branch_id  = neon_branch.dev_branch.id
  name       = "service_specific_database"
  owner_name = neon_role.app_user.name
}
```

**Key `neon_database` attributes:**

- `project_id`: (Required) ID of the parent project.
- `branch_id`: (Required) ID of the branch for this database.
- `name`: (Required) Name of the database.
- `owner_name`: (Required) Name of the role that will own this database.

For more attributes and options on managing databases, refer to the [Provider's documentation](https://github.com/kislerdm/terraform-provider-neon/blob/master/docs/resources/database.md)

### Managing API keys

You can manage Neon API keys themselves using Terraform.

```terraform
resource "neon_api_key" "ci_cd_key" {
  name = "automation-key-for-ci"
}

output "ci_cd_api_key_value" {
  description = "The actual API key token."
  value       = neon_api_key.ci_cd_key.key
  sensitive   = true
}
```

**Key `neon_api_key` attributes:**

- `name`: (Required) A descriptive name for the API key.
- `key`: (Computed, Sensitive) The generated API key token.

### Advanced: Project permissions

Share project access with other users.

```terraform
resource "neon_project_permission" "share_with_colleague" {
  project_id = neon_project.my_app_project.id
  grantee    = "colleague@example.com"
}
```

### Advanced: JWKS URL for RLS

Configure JWKS URL for Row Level Security authorization.

```terraform
resource "neon_jwks_url" "auth_provider_jwks" {
  project_id    = neon_project.my_app_project.id
  # Use the default role from the project, or specify custom roles
  role_names    = [neon_project.my_app_project.database_user]
  provider_name = "YourAuthProviderName" # e.g., "clerk"
  jwks_url      = "<https://<YOUR_AUTH_PROVIDER_JWKS_URL>" # Replace with your actual JWKS URL
}
```

> For a list of supported providers, see [Neon RLS: Supported Providers](/docs/guides/neon-rls#supported-providers).

For more attributes and options on managing JWKS URLs, refer to the [Provider's documentation](https://github.com/kislerdm/terraform-provider-neon/blob/master/docs/resources/jwks_url.md)

### Advanced: VPC endpoint management (for Neon private networking)

These resources are used for organizations with Scale or Enterprise plans requiring private networking.

#### Assign VPC endpoint to organization

```terraform
resource "neon_vpc_endpoint_assignment" "org_vpc_endpoint" {
  org_id          = "your-neon-organization-id" # Replace with your actual Org ID
  region_id       = "aws-us-east-1"             # Neon region ID
  vpc_endpoint_id = "vpce-xxxxxxxxxxxxxxxxx"    # Your AWS VPC Endpoint ID
  label           = "main-aws-vpc-endpoint"
}
```

For more attributes and options on managing VPC endpoints, refer to the [Provider's documentation](https://github.com/kislerdm/terraform-provider-neon/blob/master/docs/resources/vpc_endpoint_assignment.md)

#### Restrict project to VPC endpoint

```terraform
resource "neon_vpc_endpoint_restriction" "project_to_vpc" {
  project_id      = neon_project.my_app_project.id
  vpc_endpoint_id = neon_vpc_endpoint_assignment.org_vpc_endpoint.vpc_endpoint_id
  label           = "restrict-my-app-project-to-vpc"
}
```

For more attributes and options on managing VPC endpoint restrictions, refer to the [Provider's documentation](https://github.com/kislerdm/terraform-provider-neon/blob/master/docs/resources/vpc_endpoint_restriction.md)

## Apply the configuration

Once you have defined your resources:

1.  **Format and validate:**

    ```shell
    terraform fmt
    terraform validate
    ```

2.  **Plan:**
    Run `terraform plan` to see what actions Terraform will take. This command shows you the resources that will be created, modified, or destroyed without making any changes. Review the output carefully to ensure it matches your expectations.

    ```shell
    terraform plan -out=tfplan
    ```

3.  **Apply:**
    Run `terraform apply` to create the resources in Neon.
    ```shell
    terraform apply tfplan
    ```
    Terraform will ask for confirmation before proceeding with the changes. Type `yes` to confirm.

You have now successfully created and managed Neon resources using Terraform! You can continue to modify your `main.tf` file to add, change, or remove resources as needed. After making changes, always run `terraform plan` to review the changes before applying them.

## Import existing Neon resources

If you have existing Neon resources that were created outside of Terraform (e.g., via the Neon Console or API directly), you can bring them under Terraform's management. This allows you to manage their lifecycle with code moving forward.

Terraform offers two primary ways to do this: using the `terraform import` CLI command or, for Terraform `1.5.0` and later, using declarative `import` blocks directly in your configuration.

Both methods involve telling Terraform about an existing resource and associating it with a resource block in your configuration.

### Set up your Terraform configuration

Before you can import any resources, ensure your Terraform environment is configured for the Neon provider:

1.  **Define the provider:** Make sure you have the `neon` provider declared in your `main.tf` or a dedicated `providers.tf` file.

    ```terraform
    terraform {
      required_providers {
        neon = {
          source  = "kislerdm/neon"
        }
      }
    }

    provider "neon" {}
    ```

2.  **Initialize terraform:** If you haven't already, or if you've just added the provider configuration, run:

    ```shell
    terraform init
    ```

    This downloads the Neon provider plugin.

    <Admonition type="warning" title="Important: Provider Upgrades">
    Avoid using `terraform init -upgrade` in CI pipelines and auto-approved pull requests, as this can lead to unintended resource replacements and data loss if there are breaking changes or major version jumps. Instead, use `terraform init` in your automated workflows. Running `terraform init -upgrade` should always be done manually, followed by plan reviews. For additional guidance, see [Important usage notes](#provider-usage-notes).
    </Admonition>

3.  **Configure authentication:** Follow the authentication steps mentioned in [Configure Authentication](#configure-authentication) to ensure Terraform can communicate with your Neon account.

### Neon resource IDs for import

When importing Neon resources, you need to know the specific ID format for each resource type. Always refer to the "Import" section of the specific resource's documentation page on the [Provider's GitHub: `kislerdm/terraform-provider-neon`](https://github.com/kislerdm/terraform-provider-neon/tree/master/docs/resources) for the exact ID format.

Here are some common formats for different Neon resources:

- **`neon_project`:** Uses the Project ID (e.g., `damp-recipe-88779456`).
- **`neon_branch`:** Uses the Branch ID (e.g., `br-orange-bonus-a4v00wjl`).
- **`neon_endpoint`:** Uses the Endpoint ID (e.g., `ep-blue-cell-a4xzunwf`).
- **`neon_role`:** Uses a composite ID: `<project_id>/<branch_id>/<role_name>` (e.g., `damp-recipe-88779456/br-orange-bonus-a4v00wjl/application_user`).
- **`neon_database`:** Uses a composite ID: `<project_id>/<branch_id>/<database_name>` (e.g., `damp-recipe-88779456/br-orange-bonus-a4v00wjl/service_specific_database`).
- **`neon_api_key` and `neon_jwks_url`:** These resources do not support import. You'll need to recreate them using Terraform if you want to manage them via IaC.

### Order of import for dependent resources

When importing resources that depend on each other, it's best practice to import them in the order of their dependencies. This helps ensure that Terraform can correctly understand relationships and that your HCL resource blocks can reference already-imported parent resources.

A common order for importing Neon resources is:

```plaintext
Project -> Branch -> Endpoint -> Role -> Database
```

Depending on your preference and the version of Terraform you are using, you can choose between two methods to import existing Neon resources into Terraform. Follow [Method 1](#method-1-using-the-terraform-import-cli-command) if you prefer the traditional CLI import command, or [Method 2](#method-2-using-import-blocks-terraform-150) if you want to use the newer declarative `import` blocks introduced in Terraform `1.5.0`.

### Method 1: Using the `terraform import` CLI command

For each Neon resource you want to import, you'll generally follow these two steps:

1.  **Write a resource block:** Add a corresponding `resource` block to your Terraform configuration files (e.g., `main.tf`). This block tells Terraform how you _want_ the resource to be configured. You might not know all the attributes perfectly upfront; Terraform will populate many of them from the actual state of the resource during the import.

2.  **Run `terraform import`:** Execute the import command, which takes the Terraform resource address and the Neon-specific ID of the existing resource.
    ```shell
    terraform import <terraform_resource_address> <neon_resource_id>
    ```

#### Example: Importing the previously defined resources

In this example, we'll import the resources we defined earlier in the [Manage Neon Resources](#manage-neon-resources) section. This needs a project, a branch, an endpoint, a role, and a database already created in your Neon account. These resources will now be imported into a new Terraform configuration.

##### Define the HCL resource blocks

In your `main.tf` file, define the resource blocks for the existing resources. You can start with minimal definitions, as Terraform will populate the actual values during the import process. You primarily need to define the resource type and a name for Terraform to use. Terraform will populate the actual attribute values from the live resource into its state file during the import. You'll then use `terraform plan` to see these and update your HCL to match or to define your desired state.

For required attributes (like `project_id` for a branch), you'll either need to hardcode the known ID or reference a resource that will also be imported.

```terraform
terraform {
  required_providers {
    neon = {
      source  = "kislerdm/neon"
    }
  }
}

provider "neon" {}

# --- Project ---
resource "neon_project" "my_app_project" {}

# --- Development Branch ---
# Requires project_id. We'll reference the project we're about to import.
# The actual value of neon_project.my_app_project.id will be known after its import.
resource "neon_branch" "dev_branch" {
  project_id = neon_project.my_app_project.id
  name       = "feature-x-development"
}

# --- Development Branch Endpoint ---
# Requires project_id and branch_id.
resource "neon_endpoint" "dev_endpoint" {
  project_id = neon_project.my_app_project.id
  branch_id  = neon_branch.dev_branch.id
}

# --- Application User Role on Development Branch ---
# Requires project_id, branch_id, and name.
resource "neon_role" "app_user" {
  project_id = neon_project.my_app_project.id
  branch_id  = neon_branch.dev_branch.id
  name       = "application_user"
}

# --- Service Database on Development Branch ---
# Requires project_id, branch_id, name, and owner_name.
resource "neon_database" "service_db" {
  project_id = neon_project.my_app_project.id
  branch_id  = neon_branch.dev_branch.id
  name       = "service_specific_database"
  owner_name = neon_role.app_user.name
}
```

Here's a breakdown of the minimal HCL and why certain attributes are included:

- **`neon_project.my_app_project`**:
  - This block defines the Terraform resource for your main Neon project.
  - No attributes are strictly required _in the HCL_ for the import command itself, as the project is imported using its unique Neon Project ID. Adding a `name` attribute matching the existing project can aid readability but isn't essential for the import operation.

- **`neon_branch.dev_branch`**:
  - This defines the Terraform resource for your development branch.
  - It requires `project_id` in the HCL to link it to the (to-be-imported) project resource within Terraform.
  - The `name` attribute should also be specified in the HCL, matching the existing branch's name, as it's a key identifier.
  - The branch is imported using its unique Neon Branch ID.

- **`neon_endpoint.dev_endpoint`**:
  - This block defines the Terraform resource for the endpoint on your development branch.
  - It requires both `project_id` and `branch_id` in the HCL to correctly associate it with the imported project and development branch resources within Terraform.
  - Other attributes like `type` (which defaults if unspecified) or autoscaling limits will be read from the live resource during import.
  - The endpoint is imported using its unique Neon Endpoint ID.

- **`neon_role.app_user`**:
  - This defines the Terraform resource for an application user role.
  - The HCL requires `project_id` and `branch_id` to link to the respective imported Terraform resources.
  - The `name` attribute must be specified in the HCL and match the existing role's name.

- **`neon_database.service_db`**:
  - This defines the Terraform resource for a service-specific database.
  - The HCL requires `project_id` and `branch_id` to link to the imported Terraform resources.
  - The `name` attribute must be specified in the HCL and match the existing database's name.
  - The `owner_name` should also be included, linking to the Terraform role resource (e.g., `neon_role.app_user.name`) that owns this database.

All other configurable attributes will be populated into Terraform's state file from the live Neon resource during the `terraform import` process. You will then refine your HCL by reviewing the `terraform plan` output.

#### Run the import commands in order

1.  **Import the project:**

    ```shell
    terraform import neon_project.my_app_project "actual_project_id_from_neon"
    ```

    You can retrieve the project ID via Neon Console/CLI/API. Learn more: [Manage projects](/docs/manage/projects#project-settings)

    Example output:

    ```shell
    terraform import neon_project.my_app_project damp-recipe-88779456
    ```

    ```text
    neon_project.my_app_project: Importing from ID "damp-recipe-88779456"...
    neon_project.my_app_project: Import prepared!
      Prepared neon_project for import
    neon_project.my_app_project: Refreshing state... [id=damp-recipe-88779456]

    Import successful!

    The resources that were imported are shown above. These resources are now in
    your Terraform state and will henceforth be managed by Terraform.
    ```

2.  **Import the development branch:**

    ```shell
    terraform import neon_branch.dev_branch "actual_dev_branch_id_from_neon"
    ```

    You can retrieve the branch ID via Neon Console/CLI/API. Learn more: [Manage branches](/docs/manage/branches)

    The following image shows the branch ID in the Neon Console:
    ![Neon Console Branch ID](/docs/guides/neon-console-branch-id.png)

    Example output:

    ```shell
    terraform import neon_branch.dev_branch br-orange-bonus-a4v00wjl
    ```

    ```text
    neon_branch.dev_branch: Importing from ID "br-orange-bonus-a4v00wjl"...
    neon_branch.dev_branch: Import prepared!
      Prepared neon_branch for import
    neon_branch.dev_branch: Refreshing state... [id=br-orange-bonus-a4v00wjl]

    Import successful!

    The resources that were imported are shown above. These resources are now in
    your Terraform state and will henceforth be managed by Terraform.
    ```

3.  **Import the development compute endpoint:**

    ```shell
    terraform import neon_endpoint.dev_endpoint "actual_dev_endpoint_id_from_neon"
    ```

    You can retrieve the endpoint ID via Neon Console/CLI/API. Learn more: [Manage computes](/docs/manage/computes).
    The following image shows the endpoint ID in the Neon Console:
    ![Neon Console Compute Endpoint ID](/docs/guides/neon-console-compute-endpoint-id.png)

    Example output:

    ```shell
    terraform import neon_endpoint.dev_endpoint ep-blue-cell-a4xzunwf
    ```

    ```text
    neon_endpoint.dev_endpoint: Importing from ID "ep-blue-cell-a4xzunwf"...
    neon_endpoint.dev_endpoint: Import prepared!
      Prepared neon_endpoint for import
    neon_endpoint.dev_endpoint: Refreshing state... [id=ep-blue-cell-a4xzunwf]

    Import successful!

    The resources that were imported are shown above. These resources are now in
    your Terraform state and will henceforth be managed by Terraform.
    ```

4.  **Import the application user role:**

    ```shell
    terraform import neon_role.app_user "actual_project_id_from_neon/actual_dev_branch_id_from_neon/application_user"
    ```

    > Replace `application_user` with the actual name of the role you want to import.

    Example output:

    ```shell
    terraform import neon_role.app_user "damp-recipe-88779456/br-orange-bonus-a4v00wjl/application_user"
    ```

    ```text
    neon_role.app_user: Importing from ID "damp-recipe-88779456/br-orange-bonus-a4v00wjl/application_user"...
    neon_role.app_user: Import prepared!
      Prepared neon_role for import
    neon_role.app_user: Refreshing state... [id=damp-recipe-88779456/br-orange-bonus-a4v00wjl/application_user]

    Import successful!

    The resources that were imported are shown above. These resources are now in
    your Terraform state and will henceforth be managed by Terraform.
    ```

5.  **Import the service database:**

    ```shell
    terraform import neon_database.service_db "actual_project_id_from_neon/actual_dev_branch_id_from_neon/service_specific_database"
    ```

    > Replace `service_specific_database` with the actual name of the database you want to import.

    Example output:

    ```shell
    terraform import neon_database.service_db "damp-recipe-88779456/br-orange-bonus-a4v00wjl/service_specific_database"
    ```

    ```text
    neon_database.service_db: Importing from ID "damp-recipe-88779456/br-orange-bonus-a4v00wjl/service_specific_database"...
    neon_database.service_db: Import prepared!
      Prepared neon_database for import
    neon_database.service_db: Refreshing state... [id=damp-recipe-88779456/br-orange-bonus-a4v00wjl/service_specific_database]

    Import successful!

    The resources that were imported are shown above. These resources are now in
    your Terraform state and will henceforth be managed by Terraform.
    ```

    After importing all resources, your Terraform state file (`terraform.tfstate`) will now contain the imported resources, and you can manage them using Terraform. Follow the [Reconcile your HCL with the imported state](#reconcile-your-hcl-with-the-imported-state) section to update your HCL files with the attributes that were populated during the import.

### Method 2: Using `import` Blocks (Terraform 1.5.0+)

Terraform version 1.5.0 and later introduced a more declarative way to import existing infrastructure using `import` blocks directly within your configuration files. This method keeps the import definition alongside your resource configuration and makes the import process part of your standard `plan` and `apply` workflow.

**The process with `import` Blocks:**

For each existing Neon resource you want to bring under Terraform management, you'll define two blocks in your `.tf` file:

- A standard `resource "resource_type" "resource_name" {}` block. For the initial import, this block can be minimal. It primarily tells Terraform the type and name of the resource in your configuration.
- An `import {}` block:
  - `to = resource_type.resource_name`: This refers to the Terraform address of the `resource` block you defined above.
  - `id = "neon_specific_id"`: This is the actual ID of the resource as it exists in Neon (e.g., project ID, branch ID, or composite ID for roles/databases).

**Example using `import` blocks:**

In this example, we'll import the resources we defined earlier in the [Manage Neon Resources](#manage-neon-resources) section. This needs a project, a branch, an endpoint, a role, and a database already created in your Neon account. These resources will now be imported into a new Terraform configuration. Let's say we have the following existing Neon resources and their IDs:

- Project `my_app_project` ID: `damp-recipe-88779456`
- Branch `dev_branch` ID: `br-orange-bonus-a4v00wjl`
- Endpoint `dev_endpoint` ID: `ep-blue-cell-a4xzunwf`
- Role `application_user`
- Database `service_specific_database`

You would add the following to your `main.tf`:

```terraform
terraform {
  required_providers {
    neon = {
      source  = "kislerdm/neon"
    }
  }
}

provider "neon" {
  # API key configured via environment variable or directly
}

# --- Project Import ---
import {
  to = neon_project.my_app_project
  id = "damp-recipe-88779456" # Replace with your actual Project ID
}

resource "neon_project" "my_app_project" {
  # Minimal definition for import.
  # After import and plan, you'll populate this with actual/desired attributes.
}

# --- Development Branch Import ---
import {
  to = neon_branch.dev_branch
  id = "br-orange-bonus-a4v00wjl" # Replace with your actual Branch ID
}

resource "neon_branch" "dev_branch" {
  project_id = neon_project.my_app_project.id # Links to the TF resource
  name       = "feature-x-development"        # Should match existing branch name
}

# --- Development Branch Endpoint Import ---
import {
  to = neon_endpoint.dev_endpoint
  id = "ep-blue-cell-a4xzunwf" # Replace with your actual Endpoint ID
}

resource "neon_endpoint" "dev_endpoint" {
  project_id = neon_project.my_app_project.id
  branch_id  = neon_branch.dev_branch.id      # Links to the TF resource
}

# --- Application User Role on Development Branch Import ---
import {
  to = neon_role.app_user
  # ID format: project_id/branch_id/role_name
  id = "damp-recipe-88779456/br-orange-bonus-a4v00wjl/application_user"
}

resource "neon_role" "app_user" {
  project_id = neon_project.my_app_project.id
  branch_id  = neon_branch.dev_branch.id
  name       = "application_user"             # Must match existing role name
}

# --- Service Database on Development Branch Import ---
import {
  to = neon_database.service_db
  # ID format: project_id/branch_id/name
  id = "damp-recipe-88779456/br-orange-bonus-a4v00wjl/service_specific_database"
}

resource "neon_database" "service_db" {
  project_id = neon_project.my_app_project.id
  branch_id  = neon_branch.dev_branch.id
  name       = "service_specific_database"    # Must match existing database name
  owner_name = neon_role.app_user.name        # Links to the TF role resource
}
```

<Admonition type="important">
You need to replace the IDs in the `import` blocks with the actual IDs of your existing Neon resources. The `to` field in each `import` block refers to the corresponding `resource` block defined in your configuration. The above configuration is a minimal example to get you started with the import process.
</Admonition>

### Reconcile your HCL with the imported state

After importing your resources using either method, you need to ensure that your HCL configuration accurately reflects the current state of the imported resources. This is an iterative process where you will:

1.  **Run `terraform plan`:**

    ```shell
    terraform plan
    ```

2.  **Understanding the plan output:**
    The plan might show:
    - **Attributes to be added to your HCL:** Terraform will identify attributes present in the imported state (e.g., `pg_version`, `region_id`, `default_endpoint_settings` for a project) that are not yet explicitly in your HCL `resource` blocks.
    - **"Update in-place" actions:** You might see actions like `~ update in-place` for some resources, even if no actual value in Neon is changing. For example, for `neon_endpoint`, you might see `+ branch_id = "your-branch-id"`. This is often because Terraform is now resolving a reference (like `neon_branch.dev_branch.id`) to its concrete value and wants to explicitly set this in its managed configuration. It's a reconciliation step and usually safe to apply.

3.  **Update your HCL (`main.tf`):**
    Carefully review the output of `terraform plan`. Your primary goal is to update your HCL `resource` blocks to accurately match the actual, imported state of your resources, or to define your desired state if you intend to make changes. Copy the relevant attributes and their values from the plan output into your HCL.

4.  **Repeat `terraform plan`:** After updating your HCL, run `terraform plan` again. Continue this iterative process-reviewing the plan and updating your HCL-until `terraform plan` shows "No changes. Your infrastructure matches the configuration." or only shows changes you intentionally want to make.

This iterative approach ensures your Terraform configuration accurately reflects either the current state or your intended desired state for the imported resources.

### Verify and reconcile

Once all attributes are set correctly, you can run `terraform plan` to see if any changes are needed. You should be seeing output similar to:

```text
No changes. Your infrastructure matches the configuration.

Terraform has compared your real infrastructure against your configuration and found no
differences, so no changes are needed.
```

We can now be sure that the resources are managed by Terraform. You can now proceed to make changes to your infrastructure using Terraform.

## Destroying resources

To remove the resources managed by Terraform:

```shell
terraform destroy
```

Terraform will ask for confirmation before deleting the resources.

## Example application

The following example application demonstrates how to set up Terraform, connect to a Neon Postgres database, and perform a Terraform run that inserts data. It covers how to:

- Use Go's `os/exec` package to run Terraform commands
- Write a Go test function to validate Terraform execution
- Execute Terraform commands such as `init`, `plan`, and `apply`

<DetailIconCards>

<a href="https://github.com/mattmajestic/go-terraform" description="Run Terraform commands and test Terraform configurations with Go" icon="github">Neon Postgres with Terraform and Go</a>

</DetailIconCards>

View the **YouTube tutorial**: [Neon Postgres for Terraform with Go](https://www.youtube.com/watch?v=Pw38lgfbX0s).

<NeedHelp/>
