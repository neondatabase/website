
# Neon Postgres version support policy

This topic outlines Neon Postgres version policy.

# PostgreSQL community policy

Please read the upstream PostgreSQL policy first, to understand the version numbering and upstream support policy. See [PostgreSQL Versioning](https://www.postgresql.org/support/versioning/).

### Version policy summary

A new major PostgreSQL version is released approximately once a year, with each major version receiving five years of support, including regular minor updates every three months. Critical fixes can prompt unscheduled releases. Major upgrades require data migration, while minor upgrades do not. Major versions are indicated by the first number and minor versions by the second.

## PostgreSQL minor version releases

PostgreSQL releases a minor version release every two months, sometimes more often if there's a critical bug or vulnerability. A minor release updates all the supported major versions at the same time. See this announcement for the August 2024 updates for example: https://www.postgresql.org/about/news/postgresql-164-158-1413-1316-1220-and-17-beta-3-released-2910/ 

Minor versions contain only bug fixes, no new features. Minor versions within the same major version, e.g. 16.2 and 16.3, are binary compatible. To upgrade, you need to merely stop the server, replace the binary, and restart. You can skip minor versions, going directly from 16.0 to 16.4 for example. Downgrade is generally possible too.

Sometimes manual actions are required after the upgrade. The community tries to avoid it as much as possible, but it happens maybe once a year. For example, certain kinds of indexes might need reindexing to repair damage caused by a bug that was fixed, or some commands need to be run to modify catalogs. See the `fix-CVE-2024-4317.sql` script that was part of 16.3 release, for example.

Any exceptions, manual steps, or incompatibilities are listed in the PostgreSQL release notes.

# Neon support policy

In general, Neon aims to provide stability. Free Plan customers are always running the latest versions and are automatically upgraded to the latest minor version of Postgres early and often. Paying customers have access to more stable versions and can remain on older POstgreSQL versions longer. 

## Minor versions

Whenever a new PostgreSQL minor version is released, Neon updates your compute image to include it. We strive to make the new image available at the same time as the PostgreSQL release, but these minor version updates often occur a few days later than the official PostgreSQL release date. Neon's rollout of new minor versions is staged, one region at a time, like any new Neon compute release.

Once the image has been made available in a region, all new computes will use the new version. Neon only supports the latest minor version of each major version. For example, when 16.4 is the latest minor release of the 16 series, it is no longer possible to start a compute with version 16.3. However, old computes will continue to use the old version until they are restarted (for any reason).

We automatically restart old computes that have not been restarted for other reasons after about 1 month.

### Manual actions

If there are extra manual steps that need to be taken after a minor version upgrade, how do we handle them? We can:

a) Perform the actions automatically on customer databases,  or

b) not do that, and expect the users to do it themselves.

Being a managed service, Neon makes every effort to manage changes like this automatically and not bother our users with maintenance tasks. However, some security fixes, for example, might require decisions that depend on the application and cannot be fully automated. Fixing some permissions to fix a vulnerability might break applications, for example, but on the other hand, some applications might not care about the vulnerability and would prefer to not apply the changes.

We will try to automate as much as possible, but your action may be required from time to time.

## Neon major version support policy

As of this writing, we support PostgreSQL v14, v15, and v16. In the future, **we will support the five latest major PostgreSQL versions, the same as the PostgreSQL community.** In the Free Plan, we may drop the oldest versions sooner.

### Policy rationale

The policy is affected by several factors:

- Neon does not want to support any versions that are end-of-life by the PostgreSQL community, because that’d require a lot of extra work to backpatch fixes etc.. That is, about 5 years, or 5 major versions. Unless someone is willing to pay us $$$ for "extended support".
- We would like to support as few versions as possible, because each major version adds to the maintenance overhead. There's extra CI, extra work required to handle minor versions, backwards-compatibility hacks in any Neon-specific code, extensions etc.
- Even if we can make the upgrade super easy, run pg_upgrade automatically, etc., people still prefer to stick to an old major version. Because an upgrade generally requires testing your application against the new version. There can be planner changes that affect your query plans, removed obscure features etc.
- Supporting older versions can be a paid feature that drives free to paid conversions.

Putting all that together, in the future we will likely support 5 versions, the same as upstream PostgreSQL.

We had much fewer users when we started with version 14, however, so we might be able to deprecate v14 and force an upgrade from v14 to v15 sooner. That is not likely to be possible with later versions, which have more paying customers.

## Neon major version upgrade

Each Neon project is bound to a particular PostgreSQL major
version. Currently, the only way to upgrade to a newer major version
is to create a new project, and use pg_dump+pg_restore to copy all the
data. Logical replication can be used to do that with less downtime,
but it is more complicated to set up. Better upgrade support is
planned for the future.

See [Project pg_upgrade](https://www.notion.so/Project-pg_upgrade-a479af2b52ef46a1a62d05bdf05700f9?pvs=21) for more details on integrated major upgrades

Customer plans stratify major version availability:

- Free: Latest Major Version
    - For Example:
        - 16 is the latest and only version available to free tier customers right now
        - When 17 is available all free users can only start version 17
        - Free tier customers must upgrade their major version to the latest within a certain timeline (3 months?) or else Neon will perform the update for them during a maintenance window
- **— PAID —**
    - Never forced to upgrade however the fees for not upgrading should make it prohibitively expensive, somewhat similar to what RDS does with extended support contracts.
    - The following very per plan
        - Upgrade Windows
        - Supported Versions
        - Fees charged for not upgrading
    - For example A Launch Customer
        - 16, 15 are available for running and creating new projects
        - With 17 available, projects running 15 will be required to upgrade within the Upgrade Window of their plan starting the day after 17 is released
- Launch: Last 2 Major Versions
    - Upgrade Window: 6 months
    - Supported Versions: 2
- Scale: Last 3 Major Versions
    - Upgrade Window: 9 months
    - Supported Versions: 3
- Business: Last 4 Major Versions
    - Upgrade Window: 12 months
    - Supported Versions: 4

## Extensions

PostgreSQL extensions have their own lifecycle, and can be upgraded independently of PostgreSQL releases. Some extensions are only compatible with some major PostgreSQl versions. Some extension upgrades require backwards-incompatible changes.

How we will handle extension upgrades is an unsolved problem. See [Problems with Extensions in Neon today](https://www.notion.so/Problems-with-Extensions-in-Neon-today-8fbe00a98aef4bc7916d969f7f54b99b?pvs=21) for some discussion on it as well as [Neon Extensions Workflow](https://www.notion.so/Neon-Extensions-Workflow-b8e492f1b07b4c2d9024b73e27cda016?pvs=21) which has some ideas for solutions.