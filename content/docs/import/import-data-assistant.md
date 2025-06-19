---
title: Import Data Assistant
subtitle: Move your database to Neon using our automated import tool
enableTableOfContents: true
tag: beta
updatedOn: '2025-06-02T15:04:05.574Z'
redirectFrom:
  - /docs/import/migration-assistant
---

When you're ready to move your data to Neon, our Import Data Assistant can help you automatically copy your existing database to Neon. You only need to provide a connection string to get started.

<FeatureBetaProps feature_name="Import Data Assistant"/>

<Admonition type="tip" title="Migrate between Neon projects">
You can also use the **Import Data Assistant** to migrate data between Neon projects. This is useful if you want to upgrade to a newer Postgres version (for example, from Postgres 16 to 17), or move your database to a different region. Just create a new project with the desired Postgres version or region, then use the database connection string from your existing Neon project to import the data into the new one.
</Admonition>

## Ways to import

The Import Data Assistant always creates a **new branch** for your imported data. There are two ways to launch the import:

1. **From the Projects page:**  
   Start from the project list to create a new project and import your data into a new branch as part of the flow.

   ![Import Data Assistant from Projects page](/docs/import/import_data_assistant_project.png)

2. **From within a project:**  
   Use the Getting Started widget on a project dashboard to import your data into a new branch of the existing project.

   ![Import Data Assistant from Quick Start widget](/docs/import/import_data_assistant_quickstart_widget.png)

Both options use the same automated import process — just provide your database connection string and we'll handle the rest.

## Before you start

You'll need:

- A **Neon account**. Sign up at [Neon](https://neon.tech) if you don't have one.
- A **connection string** to your current database in this format:
  ```
  postgresql://username:password@host:port/database?sslmode=require
  ```
- **Admin privileges** on your source database. We recommend using a superuser or a user with the necessary `CREATE`, `SELECT`, `INSERT`, and `REPLICATION` privileges.
- A database **smaller than 10 GB** in size for automated import
- When migrating from another Postgres provider, we recommend migrating to a Neon project created in the same region as your current database. This helps ensure a faster import. Please note that there is a 1-hour time limit on import operations. Import operations that exceed this limit will fail.

<Admonition type="important">
If your database is larger than 10 GB and you need help, [contact us](/migration-assistance).
</Admonition>

<Steps>

## Check Compatibility

Enter your database connection string and we'll verify:

- Database size is within the current 10 GB limit
- Postgres version compatibility (Postgres 14 to 17)
- Extension compatibility
- Region availability

## Import Your Data

Once checks pass, we'll:

- Create a new branch for your imported data.
- Copy your data automatically using `pg_dump` and `pg_restore`.
- Verify that the import completed successfully.

<Admonition type="note">
During import, your source database remains untouched — we only read from it to create a copy in Neon.
</Admonition>

### Known Limitations

- Currently limited to databases **smaller than 10GB**. We are actively working on supporting bigger workloads. In the meantime, contact support if you are looking to migrate bigger databases.
- There is a 1-hour limit on import operations. For faster imports, we recommend importing to a Neon project created in the same region as your source database.
- The feature is supported in **AWS regions** only.
- Databases that use **event triggers are not supported**.
- Supabase and Heroku databases are not supported, as both use event triggers or unsupported Postgres extensions.
- Databases running on **IPv6 are not supported yet**.
- AWS RDS is generally supported, though some incompatibilities may exist. Support for other providers may vary.

## Next Steps

After a successful import:

1. Find your newly imported database branch on the **Branches** page of your project.

   ![Branches page showing imported branch](/docs/import/import_data_assistant_branch.png)

   _Imported branches are typically named with a timestamp, as shown here._

2. Run some test queries to ensure everything imported correctly.
3. Click on the three dots next to the branch name and select **Set as default** to make it your default branch.
4. Optional cleanup:
   - Delete the old branches (`production` and `development`) if they are no longer needed.
   - Rename the new branch to `production` for clarity and consistency.
5. Switch your connection string to point to your new Neon database.

</Steps>

## Need Help?

- For databases **larger than 10GB**: [Contact our migration team](/migration-assistance)
- For **technical issues**: [Contact support](/docs/introduction/support)
- For **provider-specific questions**: Let us know what database provider you're using when you contact us

If your database import failed for any reason, please [contact our support team](/migration-assistance). We're here to help you get up and running, including assistance with databases larger than 10GB.
