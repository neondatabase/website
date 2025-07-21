---
title: Database Migrations with Entity Framework Core and Azure Pipelines for Neon
subtitle: Automating schema changes with EF Core and Azure Pipelines in Neon Postgres
author: bobbyiliev
enableTableOfContents: true
createdAt: '2025-01-18T00:00:00.000Z'
updatedOn: '2025-01-18T00:00:00.000Z'
---

[Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/) provides a great migration system for managing database schema changes in .NET applications. When combined with [Azure Pipelines](https://azure.microsoft.com/en-us/products/devops/pipelines#overview), you can automate database migrations as part of a CI/CD pipeline, ensuring that schema changes are safely applied to your Neon Postgres database.

In this guide, you'll learn how to use EF Core to create and apply database migrations in Neon and automate the process using Azure Pipelines.

## Prerequisites

To follow along, you'll need the following:

- A [Neon account](https://neon.tech) with an active project.
- [.NET 8.0](https://dotnet.microsoft.com/en-us/download/dotnet) installed.
- A [GitHub](https://github.com/) or [Azure DevOps](https://dev.azure.com/) repository for version control.
- An active [Azure DevOps](https://azure.microsoft.com/en-us/products/devops/) account with access to Azure Pipelines.

## Setting Up the Entity Framework Core Project

If you don't already have a .NET project, you can follow these steps to create a new one and set up EF Core for database migrations.

### Create a New .NET Project

Start by creating a new .NET project:

```bash
dotnet new webapi -n NeonMigrations
cd NeonMigrations
```

### Install Required Packages

Add the necessary EF Core and PostgreSQL packages:

```bash
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package dotenv.net
```

The packages that we are installing are:

- `Microsoft.EntityFrameworkCore`: The core EF package.
- `Microsoft.EntityFrameworkCore.Design`: Required for EF Core CLI tools.
- `Npgsql.EntityFrameworkCore.PostgreSQL`: The PostgreSQL provider for EF Core.
- `dotenv.net`: A library for loading environment variables from a `.env` file.

Install the EF Core CLI tools:

```bash
dotnet tool install --global dotnet-ef
```

### Configure the Database Connection

Retrieve your Neon database connection string from the [Neon Console](https://console.neon.tech) and store it in the `.env` file:

```bash
DATABASE_URL=Host=<your-host>;Database=<your-database>;Username=<your-username>;Password=<your-password>;SSLMode=Require
```

Then, configure your database context in `ApplicationDbContext.cs`:

```csharp
using Microsoft.EntityFrameworkCore;
using dotenv.net;

public class ApplicationDbContext : DbContext
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        DotEnv.Load();
        optionsBuilder.UseNpgsql(Environment.GetEnvironmentVariable("DATABASE_URL"));
    }

    public DbSet<Product> Products { get; set; }
}
```

## Creating and Applying Migrations

Migration files are used to define schema changes in your database. In this section, let's create a simple `Product` entity and apply a migration to your Neon database.

### Define the Data Model

Create a simple `Product` entity:

```csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
}
```

That represents a product table with an `Id`, `Name`, and `Price`.

### Generate a Migration

Run the following command to create a migration:

```bash
dotnet ef migrations add InitialCreate
```

### Apply the Migration

Run the following command to apply the migration to your Neon database:

```bash
dotnet ef database update
```

To learn more about migrations in Entity Framework Core, refer to the [Neon documentation](/docs/guides/entity-migrations) guide which provides a detailed explanation of the migration process.

At this point, your database schema is set up. Next, we'll automate this process using Azure Pipelines.

## Creating an Azure DevOps Project

If you don't already have a project set up, follow these steps:

1. Navigate to [Azure DevOps](https://dev.azure.com/) and sign in.
2. Click **New Project**, give it a name, select visibility (private or public), and choose Git as the version control option.
3. Once the project is created, go to **Repos** and initialize a new repository (or push an existing one).

For more details, refer to the official [Azure DevOps documentation](https://learn.microsoft.com/en-us/azure/devops/organizations/projects/create-project?view=azure-devops&tabs=browser) and the [Azure Repos guide](https://learn.microsoft.com/en-us/azure/devops/repos/get-started/?view=azure-devops).

## Automating Migrations with Azure Pipelines

With your migrations set up and the project in Azure DevOps, you can now automate the process using [Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/?view=azure-devops). This way, any new migrations will be applied automatically when you push changes to your repository.

### Create an Azure Pipeline

Similar to GitHub Actions, Azure Pipelines use a YAML configuration file to define the build process.

In your repository, create a `azure-pipelines.yml` file with the following content:

```yaml
trigger:
  - main

variables:
  DATABASE_URL: $(DATABASE_URL)

steps:
  - task: UseDotNet@2
    inputs:
      packageType: 'sdk'
      version: '8.x'
      installationPath: $(Agent.ToolsDirectory)/dotnet

  - script: |
      dotnet restore
      dotnet build --configuration Release
    displayName: 'Build Application'

  - script: |
      dotnet tool install --global dotnet-ef
      dotnet ef database update
    displayName: 'Apply Database Migrations'
    env:
      DATABASE_URL: $(DATABASE_URL)
```

This pipeline configuration:

- Triggers on new commits to the `main` branch. You can adjust the trigger as needed. For a complete list of triggers, refer to the [Azure Pipelines documentation](https://learn.microsoft.com/en-us/azure/devops/pipelines/build/triggers?view=azure-devops).
- Sets the `DATABASE_URL` variable from the Azure DevOps pipeline.
- Installs the EF Core CLI tools and applies the migrations.

### Configure Pipeline Variables

To securely store your database connection string, create a variable group in Azure DevOps:

1. Go to **Pipelines** → **Library** → **+ Variable Group**.
1. Set the name to `NeonMigrations`.
1. Create a variable named `DATABASE_URL` and set it to your Neon database connection string.
1. Mark it as a **secret** to protect sensitive information.
1. Save the variable group.

### Run the Pipeline

Commit the `azure-pipelines.yml` file to your repository. The pipeline will trigger on new commits to `main`, applying any pending migrations automatically.

If you were to go to the Azure DevOps Pipelines section, you would see the pipeline running and applying the migrations. If the pipeline is not triggered automatically, you can manually run it from the Azure DevOps UI.

Note that if you've just created the pipeline, Azure DevOps might limit the number of parallel pipelines you can run. You can request additional pipelines parallelism via the form [here](https://aka.ms/azpipelines-parallelism-request) or upgrade your Azure DevOps plan.

## Handling Migration Conflicts

When working in a team, conflicts may arise due to multiple migration files being generated. You can check out the Entity [Framework Core documentation for some best practices](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/teams) but here are some general tips:

1. Before adding a new migration, apply any existing ones using:
   ```bash
   dotnet ef database update
   ```
1. If conflicting migration files exist, delete and regenerate them:
   ```bash
   dotnet ef migrations remove
   dotnet ef migrations add NewMigration
   ```

In addition, consider the following:

- When applying migrations, use a direct Neon connection instead of a [pooled one](/docs/connect/connection-pooling).
- Before applying changes to production, test them in a staging environment or using a [Neon branch](/docs/introduction/branching).

## Conclusion

By integrating Entity Framework Core with Azure Pipelines, you can simplify database migrations and ensure schema changes are consistently applied to your Neon Postgres database. Automating migrations reduces the risk of human error and helps maintain database integrity across environments.

As a next step, make sure to explore [Neon branches](/docs/introduction/branching), so you can test your migrations in a staging environment before deploying to production.

## Additional Resources

- [Entity Framework Core Migrations](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/?tabs=dotnet-core-cli)
- [Azure Pipelines Overview](https://azure.microsoft.com/en-us/products/devops/pipelines#overview)
- [Neon Documentation](/docs)

<NeedHelp />
