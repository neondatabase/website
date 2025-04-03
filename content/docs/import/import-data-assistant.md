---
title: Import Data Assistant
subtitle: Move your existing database to Neon using our automated import tool
enableTableOfContents: true
updatedOn: '2025-03-06T19:30:39.633Z'
redirectFrom:
  - /docs/import/migration-assistant
---

When you're ready to move your data to Neon, our Import Data Assistant can help you automatically copy your existing database to Neon. You need only provide a connection string to get started.

<FeatureBetaProps feature_name="Import Data Assistant"/>

## Ways to import

The Import Data Assistant offers two options:

1. From the **Projects** page

   Create a new project and import your data in one step

2. From within a project: 

   Import your data into a new branch of an existing project

Both options use the same automated import process - just provide your database connection string and we'll handle the rest.

## Before you start

You'll need:

- A **Neon account**. Sign up at [Neon](https://neon.tech) if you don't have one.
- A **connection string** to your current database in this format:
  ```
  postgresql://username:password@host:port/database?sslmode=require
  ```
- **Admin privileges** on your source database. We recommend using a superuser or a user with the necessary `CREATE`, `SELECT`, `INSERT`, and 
`REPLICATION` privileges.
- A database **smaller than 10GB** in size for automated import

<Admonition type="important">
If your database is larger than 10 GB and you need help, [contact us](https://neon.tech/migration-assistance).
</Admonition>


<Steps>

## Check Compatibility

Enter your database connection string and we'll verify:

- Database size is within the current 10GB limit
- Postgres version compatibility (Postgres 14 to 17)
- Extension compatibility
- Region availability

## Import Your Data

Once checks pass, we'll:

1. Create a new project or branch (depending on your entry point)
2. Copy your data automatically
3. Verify the import completed successfully

<Admonition type="note">
During import, your source database remains untouched - we only read from it to create a copy in Neon.
</Admonition>

## Next Steps

After successful import:
1. **Verify your data**: Run some test queries to ensure everything imported correctly
2. **Update your application**: Switch your connection string to point to your new Neon database

</Steps>

## Known Limitations

- **Database size**: Currently limited to 10GB for automated import
- **Region availability**: Currently available in AWS us-east-2
- **Provider compatibility**: 
  - AWS RDS: Fully supported
  - Supabase: May encounter issues with proprietary triggers
  - Heroku: May encounter compatibility issues
  - Other providers: Support varies

## Need Help?

- For databases **larger than 10GB**: [Contact our migration team](https://neon.tech/migration-assistance)
- For **technical issues**: [Contact support](https://neon.tech/contact-support)
- For **provider-specific questions**: Let us know what database provider you're using when you contact us

If your database migration failed because of an incompatibility, size limitation, or another issue, please [contact our support team](https://neon.tech/migration-assistance). We're here to help you get up and running, including assistance with databases larger than 10GB.
