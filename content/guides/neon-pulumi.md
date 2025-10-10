---
title: Manage Neon with Pulumi
subtitle: Use Pulumi to provision and manage your Neon projects, branches, endpoints, roles, databases, and other resources as code.
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-10-08T00:00:00.000Z'
updatedOn: '2025-10-08T00:00:00.000Z'
---

[Pulumi](https://www.pulumi.com) is an open-source infrastructure-as-code (IaC) tool that lets you define and provision cloud resources using familiar programming languages such as TypeScript, Python, Go, and C#. By expressing infrastructure as code, Pulumi enables you to use loops, functions, classes, and package management to create configurations that are more dynamic, reusable, and maintainable.

This guide will show you how to use **Pulumi to manage your Neon projects**, including your branches, databases, and compute endpoints. By using Pulumi with Neon, you get better control, can track changes, and automate your database setup.

Neon can be managed using the following Pulumi provider, which is bridged from the community-developed Terraform provider:

**Pulumi provider for Neon**

- **Terraform Provider Maintainer:** Dmitry Kisler ([GitHub repository](https://github.com/kislerdm/terraform-provider-neon))
- **Pulumi Provider Documentation:** [Pulumi Registry: Neon](https://www.pulumi.com/registry/packages/neon/)

<Admonition type="note">
This provider is based on a community-maintained Terraform provider and is not officially supported by Neon. Use at your own discretion. If you have questions or find issues, please refer to the maintainer's GitHub repository.
</Admonition>

## Prerequisites

Before you begin, ensure you have the following:

1.  **Pulumi CLI installed:** If you don't have Pulumi installed, download and install it from the [official Pulumi website](https://www.pulumi.com/docs/install/).
2.  **Node.js:** This guide uses TypeScript examples. You'll need Node.js installed to run them.
3.  **Neon Account:** You'll need a Neon account. If you don't have one, sign up [here](https://console.neon.tech/signup).
4.  **Neon API key:** Generate an API key from the Neon Console. Navigate to your Account Settings > API Keys. This key is required for the provider to authenticate with the Neon API. Learn more about creating API keys in [Manage API keys](/docs/manage/api-keys).

## Set up the Pulumi Neon provider

1.  **Create a project directory:**
    Create a new directory for your Pulumi project and navigate into it.

    ```shell
    mkdir neon-pulumi-project
    cd neon-pulumi-project
    ```

2.  **Create a new Pulumi project:**
    Run the `pulumi new` command to create a new TypeScript project.

    ```shell
    pulumi new typescript
    ```

    Follow the prompts to set a project name, description, and stack name (e.g., `dev`).

    ```shell
    $ pulumi new typescript
    This command will walk you through creating a new Pulumi project.

    Enter a value or leave blank to accept the (default), and press <ENTER>.
    Press ^C at any time to quit.

    Project name (neon-pulumi-project):
    Project description (A minimal TypeScript Pulumi program):
    Created project 'neon-pulumi-project'

    Please enter your desired stack name.
    To create a stack in an organization, use the format <org-name>/<stack-name> (e.g. `acmecorp/dev`).
    Stack name (dev):

    The package manager to use for installing dependencies npm
    Installing dependencies...

    added 291 packages, and audited 292 packages in 19s

    43 packages are looking for funding
    run `npm fund` for details

    found 0 vulnerabilities
    Finished installing dependencies

    Your new project is ready to go!

    To perform an initial deployment, run `pulumi up`
    ```

3.  **Install the Neon provider package:**
    Once the project is created, install the Neon provider package from the Terraform registry.
    ```shell
    pulumi package add terraform-provider kislerdm/neon
    ```

## Import the Neon provider

When you install and import the Neon provider, you gain access to all the components needed to manage your Neon infrastructure.

```typescript
import * as neon from '@pulumi/neon';
```

This `neon` object contains two main types of components:

- **Resources**: These are classes that map directly to objects you can create, update, and delete in your Neon account. The main resources you will use are `neon.Project`, `neon.Branch`, `neon.Endpoint`, `neon.Database`, and `neon.Role`.
- **Functions**: These are used to read or query data about existing resources without managing them. For example, you can use the `getBranchEndpoints` function to fetch a list of endpoints for a specific branch.

This guide focuses on creating and managing **Resources**. To explore data-sourcing **Functions**, please refer to the [Pulumi Neon Provider API Docs](https://www.pulumi.com/registry/packages/neon/api-docs/).

## Configure authentication

The Neon provider needs your Neon API key to manage resources. The recommended way is using an environment variable.

**Using environment variable (recommended):**
The provider will automatically use the `NEON_API_KEY` environment variable if it is set.

```shell
export NEON_API_KEY="<YOUR_NEON_API_KEY>"
```

If the environment variable is set, you don't need any special provider configuration in your code.

**Programmatically in your code (less secure):**
For quick testing, you can configure the provider directly in your code. However, this is not recommended for production.

```typescript
import * as pulumi from '@pulumi/pulumi';
import * as neon from '@pulumi/neon';

// This is not recommended for production.
// Prefer using environment variables.
const neonProvider = new neon.Provider('neon-provider', {
  apiKey: '<YOUR_NEON_API_KEY>',
});

// Pass the provider instance to resources via opts
const project = new neon.Project(
  'my-project',
  {
    // ... project config
  },
  { provider: neonProvider }
);
```

<Admonition type="note">
The following sections primarily detail the creation of Neon resources. To manage existing resources, use the `pulumi import` command. More information can be found in the [Import existing Neon resources](#import-existing-neon-resources) section.
</Admonition>

## Manage Neon resources

Now you can start defining Neon resources in your `index.ts` file. The following example demonstrates creating a complete stack: a project, a development branch, an endpoint, a role, and a database.

Open `index.ts` and replace its contents with the following:

<Admonition type="warning">
Always set the `orgId` property when creating a `neon.Project`. You can find your Organization ID in the Neon Console under Account Settings → Organization settings.

![finding your organization ID from the settings page](/docs/manage/orgs_id.png)

Omitting `orgId` can cause resources to be created in the wrong organization or produce duplicate projects, and subsequent `pulumi up` runs may attempt destructive changes (including deletions). To avoid this, explicitly provide `orgId` when defining your project as shown in the example below.
</Admonition>

```typescript
import * as pulumi from '@pulumi/pulumi';
import * as neon from '@pulumi/neon';

// 1. Manage a Project
// A Neon project is the top-level container for your resources.
const myAppProject = new neon.Project('myAppProject', {
  name: 'my-application-project',
  pgVersion: 17,
  regionId: 'aws-us-east-1',
  orgId: 'YOUR_ORG_ID', // Replace with your actual Org ID
  // Configure default branch settings (optional)
  branch: {
    name: 'production',
    databaseName: 'app_db',
    roleName: 'app_admin',
  },
  // Configure default endpoint settings (optional)
  defaultEndpointSettings: {
    autoscalingLimitMinCu: 0.25,
    autoscalingLimitMaxCu: 1.0,
  },
  // Configure history retention for Instant Restore (optional: default is 86400 seconds / 24 hours)
  // Free accounts have maximum retention window of 6 hours (21600 seconds)
  historyRetentionSeconds: 3600,
});

// 2. Manage a Branch
// Create a new branch for development from the project's primary branch.
const devBranch = new neon.Branch('devBranch', {
  projectId: myAppProject.id,
  name: 'feature-x-development',
  // parentId is optional; defaults to the project's primary branch.
  // parentId: myAppProject.defaultBranchId,
});

// 3. Manage an Endpoint
// Create a read-write endpoint to connect to the development branch.
const devEndpoint = new neon.Endpoint('devEndpoint', {
  projectId: myAppProject.id,
  branchId: devBranch.id,
  type: 'read_write', // "read_write" or "read_only"
  autoscalingLimitMinCu: 0.25,
  autoscalingLimitMaxCu: 0.5,
});

// 4. Manage a Role (user)
// Create a new role on the development branch.
const appUser = new neon.Role('appUser', {
  projectId: myAppProject.id,
  branchId: devEndpoint.branchId,
  name: 'application_user',
});

// 5. Manage a Database
// Create a new database on the development branch, owned by the new role.
const serviceDb = new neon.Database('serviceDb', {
  projectId: myAppProject.id,
  branchId: devEndpoint.branchId,
  name: 'service_specific_database',
  ownerName: appUser.name,
});

// 6. Manage an API Key
const ciCdKey = new neon.ApiKey('ciCdKey', {
  name: 'ci-cd-access-key',
});

// --- Exporting outputs ---
export const projectId = myAppProject.id;
export const projectConnectionUri = pulumi.secret(myAppProject.connectionUri);
export const devBranchId = devBranch.id;
export const devEndpointHost = devEndpoint.host;
export const appUserPassword = pulumi.secret(appUser.password);
export const ciCdApiKeyValue = pulumi.secret(ciCdKey.key);
```

## Resource details

- **`neon.Project`**: Creates a new Neon project. Key properties include `name`, `pgVersion`, `orgId`, and `regionId`. You can also define the default `branch` and `defaultEndpointSettings`. `historyRetentionSeconds` sets how long to retain change history for [Instant Restore](/docs/introduction/branch-restore).
- **`neon.Branch`**: Creates a new branch. It requires a `projectId`. The `parentId` is optional and defaults to the project's primary branch.
- **`neon.Endpoint`**: Creates a compute endpoint. It requires a `projectId` and `branchId`. The `type` can be `read_write` or `read_only`. A branch can have only one `read_write` endpoint.
- **`neon.Role`**: Creates a new role (user) on a specific branch. It requires `projectId`, `branchId`, and a `name`. The `password` is a computed, sensitive output.
- **`neon.Database`**: Creates a new database on a specific branch. It requires `projectId`, `branchId`, a `name`, and an `ownerName`.
- **`neon.ApiKey`**: Manages a Neon API key. The `key` itself is a computed, sensitive output.

## Advanced resource management

### Project permissions

Share project access with other users.

```typescript
const shareWithColleague = new neon.ProjectPermission('shareWithColleague', {
  projectId: myAppProject.id,
  grantee: 'colleague@example.com',
});
```

### VPC endpoint management (for Neon private networking)

These resources are used for organizations requiring private networking.

```typescript
// Assign a VPC endpoint to an organization
const orgVpcEndpoint = new neon.VpcEndpointAssignment('orgVpcEndpoint', {
  orgId: 'your-neon-organization-id', // Replace with your actual Org ID
  regionId: 'aws-us-east-1',
  vpcEndpointId: 'vpce-xxxxxxxxxxxxxxxxx', // Your AWS VPC Endpoint ID
  label: 'main-aws-vpc-endpoint',
});

// Restrict a project to only accept connections from that VPC endpoint
const projectToVpc = new neon.VpcEndpointRestriction('projectToVpc', {
  projectId: myAppProject.id,
  vpcEndpointId: orgVpcEndpoint.vpcEndpointId,
  label: 'restrict-my-app-project-to-vpc',
});
```

## Apply the configuration

Once you have defined your resources in `index.ts`:

1.  **Preview the changes:**
    Run `pulumi preview` to see what actions Pulumi will take. This command shows you the resources that will be created, modified, or destroyed without making any changes.

    ```shell
    pulumi preview
    ```

    You should see an output indicating that several resources will be created.

    ```bash
    $ pulumi preview
    Previewing update (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/xx/neon-pulumi-project/dev/previews/7b892e4a-d8f9-4cc1-a9a1-0e79ca3f75a7

        Type                             Name                     Plan
    +   pulumi:pulumi:Stack              neon-pulumi-project-dev  create
    +   ├─ neon:index:ApiKey             ciCdKey                  create
    +   ├─ neon:index:Project            myAppProject             create
    +   ├─ neon:index:ProjectPermission  shareWithColleague       create
    +   ├─ neon:index:Branch             devBranch                create
    +   ├─ neon:index:Endpoint           devEndpoint              create
    +   ├─ neon:index:Role               appUser                  create
    +   └─ neon:index:Database           serviceDb                create

    Outputs:
        appUserPassword     : [unknown]
        ciCdApiKeyValue     : [unknown]
        devBranchId         : [unknown]
        devEndpointHost     : [unknown]
        projectConnectionUri: [unknown]
        projectId           : [unknown]

    Resources:
        + 8 to create
    ```

2.  **Deploy the resources:**
    Run `pulumi up` to create the resources in Neon.

    ```shell
    pulumi up
    ```

    Pulumi will show you a preview and ask for confirmation before proceeding. Select `yes` to deploy the changes.

    ```bash
    $ pulumi up
    Previewing update (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/xx/neon-pulumi-project/dev/previews/a5245bc0-c7bb-4392-bd86-aadef1114aa4

        Type                             Name                     Plan
    +   pulumi:pulumi:Stack              neon-pulumi-project-dev  create
    +   ├─ neon:index:Project            myAppProject             create
    +   ├─ neon:index:ApiKey             ciCdKey                  create
    +   ├─ neon:index:Branch             devBranch                create
    +   ├─ neon:index:ProjectPermission  shareWithColleague       create
    +   ├─ neon:index:Endpoint           devEndpoint              create
    +   ├─ neon:index:Role               appUser                  create
    +   └─ neon:index:Database           serviceDb                create

    Outputs:
        appUserPassword     : [unknown]
        ciCdApiKeyValue     : [unknown]
        devBranchId         : [unknown]
        devEndpointHost     : [unknown]
        projectConnectionUri: [unknown]
        projectId           : [unknown]

    Resources:
        + 8 to create

    Do you want to perform this update? yes
    Updating (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/xx/neon-pulumi-project/dev/updates/1

        Type                             Name                     Status
    +   pulumi:pulumi:Stack              neon-pulumi-project-dev  created (20s)
    +   ├─ neon:index:Project            myAppProject             created (5s)
    +   ├─ neon:index:ApiKey             ciCdKey                  created (1s)
    +   ├─ neon:index:Branch             devBranch                created (1s)
    +   ├─ neon:index:ProjectPermission  shareWithColleague       created (3s)
    +   ├─ neon:index:Endpoint           devEndpoint              created (1s)
    +   ├─ neon:index:Role               appUser                  created (1s)
    +   └─ neon:index:Database           serviceDb                created (3s)

    Outputs:
        appUserPassword     : [secret]
        ciCdApiKeyValue     : [secret]
        devBranchId         : "br-bitter-king-adoi0u14"
        devEndpointHost     : "ep-withered-frost-adhnaxgq.c-2.us-east-1.aws.neon.tech"
        projectConnectionUri: [secret]
        projectId           : "empty-sound-18131946"

    Resources:
        + 8 created

    Duration: 23s
    ```

You have now successfully created and managed Neon resources using Pulumi! You can continue to modify your `index.ts` file to add, change, or remove resources. After making changes, always run `pulumi preview` to review the plan before deploying with `pulumi up`.

## Accessing secret outputs

When you run `pulumi up`, you'll notice that the values for `projectConnectionUri`, `appUserPassword`, and `ciCdApiKeyValue` are displayed as `[secret]` in the output.

```
Outputs:
  + appUserPassword       : [secret]
  + ciCdApiKeyValue       : [secret]
    devBranchId           : "br-..."
    devEndpointHost       : "ep-..."
    projectId             : "project-..."
  + projectConnectionUri  : [secret]
```

This is a critical security feature that prevents credentials from being accidentally exposed in logs, CI/CD output, or version control. In your code, wrapping an output in `pulumi.secret()` marks it as a secret, ensuring it's handled with encryption.

```typescript
// Marking outputs as secrets
export const projectConnectionUri = pulumi.secret(myAppProject.connectionUri);
export const appUserPassword = pulumi.secret(appUser.password);
```

For local development or debugging, you can view the decrypted value of any secret output using the Pulumi CLI.

1.  **View all stack outputs (secrets remain masked):**

    ```shell
    pulumi stack output
    ```

2.  **View a specific secret (decrypted):**
    To view the actual, unencrypted value of a specific secret, use the `--show-secrets` flag.

    **To get the connection string:**

    ```shell
    pulumi stack output projectConnectionUri --show-secrets
    ```

    **Example output:**

    ```
    postgres://app_admin:AbCdEfGhIjKlMnOp@ep-....aws-us-east-1.neon.tech/app_db?sslmode=require
    ```

    **To get the role's password:**

    ```shell
    pulumi stack output appUserPassword --show-secrets
    ```

See the [Pulumi Secrets documentation](https://www.pulumi.com/docs/intro/concepts/secrets/) for details on how Pulumi treats sensitive values and recommendations for securely injecting secrets into CI/CD pipelines.

## Import existing Neon resources

If you have existing Neon resources created outside of Pulumi, you can bring them under Pulumi's management using the `pulumi import` command. This command will import the resource into the Pulumi state and generate the corresponding code in your chosen language.

### The import process

1.  **Identify the resource type, a name for Pulumi, and the resource ID.**
2.  **Run the `pulumi import` command.**
3.  **Copy the generated code into your `index.ts` file.**
4.  **Run `pulumi up` to reconcile the state and configuration.**

The command format is: `pulumi import <type> <name> <id>`

- `<type>`: The Pulumi resource type token.
- `<name>`: The name you want to give the resource in your Pulumi program.
- `<id>`: The unique ID of the resource in Neon.

### Neon resource types and ID formats

| Resource | Pulumi Type Token              | ID Format                                    |
| -------- | ------------------------------ | -------------------------------------------- |
| Project  | `neon:index/project:Project`   | Project ID (e.g., `damp-recipe-88779456`)    |
| Branch   | `neon:index/branch:Branch`     | Branch ID (e.g., `br-orange-bonus-a4v00wjl`) |
| Endpoint | `neon:index/endpoint:Endpoint` | Endpoint ID (e.g., `ep-blue-cell-a4xzunwf`)  |
| Role     | `neon:index/role:Role`         | `<project_id>/<branch_id>/<role_name>`       |
| Database | `neon:index/database:Database` | `<project_id>/<branch_id>/<database_name>`   |
| `ApiKey` | -                              | Does not support import.                     |

### Example: Importing a project and a branch

Let's assume you have an existing project and a branch you want to manage with Pulumi.

1.  **Import the project:**
    Find your Project ID in the Neon Console.

    ```shell
    pulumi import neon:index/project:Project my_imported_project <project_id>
    ```

    > Replace `<project_id>` with your actual project ID

    Pulumi will output the TypeScript code in the logs.

    ```bash
    $ pulumi import neon:index/project:Project my_imported_project patient-field-68662453
    Previewing import (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/xx/my_imported_project/dev/previews/b87cc3eb-96ea-48e2-8016-8084673a5dde

        Type                   Name             Plan
    +   pulumi:pulumi:Stack    my_imported_project-dev  create
    =   └─ neon:index:Project  my_imported_project      import

    Resources:
        + 1 to create
        = 1 to import
        2 changes

    Do you want to perform this import? yes
    Importing (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/xx/my_imported_project/dev/updates/1

        Type                   Name             Status
    +   pulumi:pulumi:Stack    my_imported_project-dev  created
    =   └─ neon:index:Project  my_imported_project      imported (6s)

    Resources:
        + 1 created
        = 1 imported
        2 changes

    Duration: 9s

    Please copy the following code into your Pulumi application. Not doing so
    will cause Pulumi to report that an update will happen on the next update command.

    Please note that the imported resources are marked as protected. To destroy them
    you will need to remove the `protect` option and run `pulumi update` *before*
    the destroy will take effect.

    import * as pulumi from "@pulumi/pulumi";
    import * as neon from "@pulumi/neon";

    const my_imported_project = new neon.Project("my_imported_project", {
        branch: {
            databaseName: "neondb",
            name: "main",
            roleName: "neondb_owner",
        },
        computeProvisioner: "k8s-neonvm",
        defaultEndpointSettings: {
            autoscalingLimitMaxCu: 2,
            autoscalingLimitMinCu: 0.25,
        },
        historyRetentionSeconds: 21600,
        name: "my_imported_project",
        orgId: "org-nameless-scene-42356449",
        pgVersion: 17,
        regionId: "aws-ap-southeast-1",
        storePassword: "yes",
      }, {
        protect: true
      }
    );
    ```

    > Copy the generated code into your `index.ts` file.

2.  **Import the branch:**
    Find your Branch ID from the Neon Console.

    ```shell
    pulumi import neon:index/branch:Branch my_imported_branch <branch_id>
    ```

    > Replace `<branch_id>` with your actual branch ID

    In a similar manner, Pulumi will output the TypeScript code for the branch.

    ```shell
    $ pulumi import neon:index/branch:Branch my_imported_branch br-aged-feather-a1vdi2o2
    Previewing import (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/xx/my_imported_project/dev/previews/da707d6c-c8a9-4089-87d2-654420091999

        Type                  Name                Plan
        pulumi:pulumi:Stack   my_imported_project-dev
    =   └─ neon:index:Branch  my_imported_branch  import

    Resources:
        = 1 to import
        2 unchanged

    Do you want to perform this import? yes
    Importing (dev)

    View in Browser (Ctrl+O): https://app.pulumi.com/xx/my_imported_project/dev/updates/2

        Type                  Name                Status
        pulumi:pulumi:Stack   my_imported_project-dev
    =   └─ neon:index:Branch  my_imported_branch  imported (3s)

    Resources:
        = 1 imported
        2 unchanged

    Duration: 5s

    Please copy the following code into your Pulumi application. Not doing so
    will cause Pulumi to report that an update will happen on the next update command.

    Please note that the imported resources are marked as protected. To destroy them
    you will need to remove the `protect` option and run `pulumi update` *before*
    the destroy will take effect.

    import * as pulumi from "@pulumi/pulumi";
    import * as neon from "@pulumi/neon";

    const my_imported_branch = new neon.Branch("my_imported_branch", {
        name: "main",
        projectId: "patient-field-68662453",
    }, {
        protect: true,
    });
    ```

    > Copy the generated code into your `index.ts` file so Pulumi can track Project and Branch together.

    Similarly, you can import other resources like `Endpoint`, `Role`, and `Database` using their respective IDs.

3.  **Reconcile and finalize:**
    After adding the code to your `index.ts`, run `pulumi preview` and `pulumi up`. Pulumi will compare the imported state with your new code and ensure they match. After this, your resources are fully managed by Pulumi.

## Destroying resources

To remove all resources managed by your Pulumi stack, run:

```shell
pulumi destroy
```

Pulumi will show a preview of the resources to be deleted and ask for confirmation. Select `yes` to proceed with the destruction.

To also remove the stack itself from Pulumi, run:

```shell
pulumi stack rm <stack-name>
```

> Replace `<stack-name>` with your actual stack name (e.g., `dev`).

## Using other languages and next steps

Though this guide uses TypeScript, Pulumi supports multiple programming languages. You can use the following languages with the Neon provider:

- Python
- Go
- C#
- Java
- YAML

For all language-specific example code and API references, visit [Pulumi: Neon Provider](https://www.pulumi.com/registry/packages/neon/api-docs/)

## Resources

- [Pulumi Documentation](https://www.pulumi.com/docs/)
- [Pulumi Neon Provider](https://www.pulumi.com/registry/packages/neon/)
- [Terraform Registry](https://registry.terraform.io/providers/kislerdm/neon)
- [Manage Neon with Terraform](/docs/reference/terraform)

<NeedHelp/>
