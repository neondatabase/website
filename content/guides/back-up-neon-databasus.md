---
title: Automate Neon database backups with Databasus and Neon Object Storage
subtitle: Schedule Neon backups with Databasus, keep them in Neon Object Storage next to instant restore and snapshots, and restore with Databasus or pg_restore.
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2026-11-23T00:00:00.000Z'
updatedOn: '2026-11-23T08:17:16.852Z'
---

[Databasus](https://databasus.com) is an open-source PostgreSQL backup tool with restore verification, point-in-time recovery, and Slack or Discord alerts, and it takes a few minutes to set up. On top of Neon's [instant restore](/docs/guides/backup-restore#instantly-restore-a-branch) and [snapshots](/docs/guides/backup-restore#create-backup-schedules), it adds `pg_dump` files that you keep for as long as you want, in storage outside the project you back up.

In this guide, you'll:

- Plan how instant restore, snapshots, and Databasus work together
- Create a separate backup project with a bucket and a scoped credential from the [Neon CLI](/docs/cli/install)
- Create a read-only role for backups
- Connect the bucket and the database to Databasus and schedule backups
- Find the backup files in Neon Object Storage
- Restore a backup into a Neon branch, first with Databasus and then with `pg_restore` alone

## Choose a backup strategy

Here's what each backup method stores, how long it keeps it, and when you'd use it:

| Backup method                                                    | What it keeps                                              | How far back                                                                       | Use it to                                                                                   |
| ---------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [Instant restore](/docs/postgres/backup-restore/history-window)  | Every change to the branch, inside your Neon project       | Your restore window: up to 6 hours on Free, 7 days on Launch, and 30 days on Scale | Undo a bad deploy or a deleted row, to the second                                           |
| [Snapshots](/docs/guides/backup-restore#create-backup-schedules) | Copies of a branch at a point in time, inside your project | Scheduled snapshots for up to 35 days; manual snapshots until you delete them      | Keep daily or weekly checkpoints, and take one before a risky migration                     |
| Databasus                                                        | `pg_dump` files in a storage you choose                    | Set by your retention policy, from a day to forever                                | Keep months or years of history, keep a copy outside the project, restore into any Postgres |

<Admonition type="note" title="Databasus makes logical backups of Neon databases">
Databasus can also make physical backups with point-in-time recovery, but those need a physical replication connection, which Neon doesn't accept. For Neon databases, Databasus makes logical backups with `pg_dump`, and point-in-time recovery comes from Neon instant restore.
</Admonition>

## Prerequisites

- A [Neon account](https://console.neon.tech/signup) with a project that you want to back up
- The [Neon CLI](/docs/cli/install), version 9 or later, signed in with `neon login`
- Docker, to run Databasus
- `psql`, `pg_restore`, and `jq`, for the restore without Databasus. Use a `pg_restore` with the same Postgres version as your Neon database, or a newer one.

<Steps>

## Deploy Databasus

Databasus runs as a single Docker container:

```bash
docker run -d \
  --name databasus \
  -p 4005:4005 \
  -v ./databasus-data:/databasus-data \
  --restart unless-stopped \
  databasus/databasus:latest
```

Open `http://localhost:4005` and create the first user, which becomes the admin of this Databasus instance. To run Databasus on a server, see the [Databasus installation guide](https://databasus.com/installation).

## Provision backup storage in Neon Object Storage

Keep the backups in a different Neon project than the database you back up. Buckets belong to a project, so deleting the app project doesn't delete backups stored in the backup project. Object storage is available in AWS US East (Ohio), US East (N. Virginia), Europe (Frankfurt), and Asia Pacific (Singapore). See [Limits](/docs/storage/overview#limits).

Create the backup project and a private bucket on its `main` branch. If you belong to more than one organization, add `--org-id` to `neon projects create`:

```bash
export BACKUP_PROJECT_ID=$(neon projects create --name app-backups \
  --region-id aws-us-east-2 --no-secrets --output json | jq -r .project.id)

neon buckets create neon-backups --project-id $BACKUP_PROJECT_ID --branch main
```

Then issue a credential for Databasus alone. A [scoped credential](/docs/cli/credentials) with only the `storage:read` and `storage:write` scopes can't reach anything else in the project, and you can [rotate](/docs/cli/credentials#rotate) or [revoke](/docs/cli/credentials#revoke) it without affecting other apps:

```bash
neon credentials create --name databasus --scope storage:read --scope storage:write \
  --project-id $BACKUP_PROJECT_ID --branch main --output json > databasus-credential.json
```

The secret is shown only when the credential is issued, so the command saves the JSON output to a file. Next, write the endpoint, region, and keys into one file in the format Databasus reads. The credential's `token_id` is the access key:

```bash
neon env pull --project-id $BACKUP_PROJECT_ID --branch main \
  -e AWS_ENDPOINT_URL_S3,AWS_REGION --file databasus-storage.env

jq -r '"AWS_ACCESS_KEY_ID=\(.token_id)\nAWS_SECRET_ACCESS_KEY=\(.s3_secret_access_key)"' \
  databasus-credential.json >> databasus-storage.env
```

The file looks like this:

```bash filename="databasus-storage.env"
AWS_ENDPOINT_URL_S3=https://br-plain-dream-bdcn5dw5.storage.c-8.us-east-2.aws.neon.tech
AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=nak_live_...
AWS_SECRET_ACCESS_KEY=nsk_live_...
```

## Connect Neon Object Storage to Databasus

In Databasus, open **Storages** and click **Add storage**. Enter a name, choose **Neon Object Storage** as the type, copy the contents of `databasus-storage.env`, and click **Paste from clipboard**. Databasus fills in **Endpoint**, **Region**, **Access key**, and **Secret key**. Type `neon-backups` into **S3 Bucket**.

![Neon Object Storage form in Databasus with the pasted endpoint, region, and keys, and the bucket name](/guides/images/back-up-neon-databasus/databasus-neon-object-storage-form.png)

Click **Test connection**, then **Save**. Delete both local files once the storage is saved, since they hold the secret key.

## Create a read-only backup role

Databasus only needs to read your data, so give it a role that can't change anything. Create one on your production branch with the Neon CLI:

```bash
export APP_PROJECT_ID=<your-app-project-id>

neon roles create --name databasus_backup --access read_only \
  --project-id $APP_PROJECT_ID --branch main
```

A `read_only` role gets `SELECT` on the tables in the `public` schema, now and in the future. `pg_dump` also reads the current value of each sequence, such as the one behind an identity column, and Databasus checks for that before it saves the database. Grant `SELECT` on sequences too, as the database owner:

```sql
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO databasus_backup;

ALTER DEFAULT PRIVILEGES FOR ROLE neondb_owner IN SCHEMA public
  GRANT SELECT ON SEQUENCES TO databasus_backup;
```

The second statement covers sequences that `neondb_owner` creates later. Without these grants, the connection test in Databasus fails with a message that lists the sequences the role can't read.

Then copy the role's connection string:

```bash
neon connection-string --project-id $APP_PROJECT_ID --role-name databasus_backup
```

The CLI returns a direct connection string by default. Databasus also switches a pooled connection string to a direct one, because `pg_dump` is more reliable over a [direct connection](/docs/connect/connection-pooling).

<Admonition type="tip">
If you'd rather not manage the role yourself, connect Databasus with the `neondb_owner` connection string and click **Yes, create read-only user** when Databasus offers it. Databasus creates a role with similar grants and stores only that role's credentials.
</Admonition>

## Configure scheduled backups

In Databasus, click **Add database**, enter a name, choose **Neon**, and click **Continue**.

![Add database window in Databasus with the Neon type selected](/guides/images/back-up-neon-databasus/databasus-choose-neon.png)

Click **Paste from clipboard** to fill in the connection details from the `databasus_backup` connection string, click **Test connection**, and then **Continue**. If Databasus offers to create a read-only user, click **Skip**, because `databasus_backup` already is one.

Then choose the backup settings:

- **Backup interval**: daily, at a time of day with little traffic, such as 03:00.
- **Storage**: the Neon Object Storage storage you added.
- **Encryption**: choose **Encrypt backup files** if anyone else can read the bucket. This guide leaves backups unencrypted, so you can restore one with `pg_restore` alone later.
- **Retention policy**: **GFS (calendar retention)**, with 7 daily, 4 weekly, and 12 monthly backups.
- **Notifications**: at least **Backup failed**.

![Backup schedule, storage, encryption, and retention settings in Databasus](/guides/images/back-up-neon-databasus/databasus-schedule-storage-retention.png)

Click **Continue**, choose notifiers such as Slack if you want them, and click **Complete**. Databasus starts the first backup right away and shows it on the **Backups** tab.

![First successful Neon backup on the Backups tab in Databasus](/guides/images/back-up-neon-databasus/databasus-first-neon-backup.png)

<Admonition type="note" title="Health checks and scale to zero">
Neon [scales a compute to zero](/docs/introduction/scale-to-zero) after 5 minutes without activity and doesn't bill compute time while it's suspended. A Databasus health check connects every minute, which would keep the compute running all day, so Databasus turns health checks off for Neon databases and asks you to confirm if you turn them on. A scheduled backup starts the compute only for as long as the backup runs, and Neon suspends it again when it's inactive.
</Admonition>

## Inspect backup files in Neon Object Storage

Each backup is a set of objects in your bucket. List them with the Neon CLI:

```bash
neon buckets object list neon-backups --project-id $BACKUP_PROJECT_ID --branch main
```

```text filename="Output"
Key                                                                           Size   Last Modified         Etag
app-production-20261123-070833-f6ba17c2-ea21-4617-aded-ec597885fe05           46559  2026-11-23T07:09:04Z  2870b15a308c5e494d77bed2b8aa3616
app-production-20261123-070833-f6ba17c2-ea21-4617-aded-ec597885fe05.metadata  113    2026-11-23T07:09:05Z  50fae7a10d264eb9fa91f3ace2e2670c
```

The key is the database name in Databasus, the time of the backup in UTC, and the backup ID:

- The object without a suffix is the `pg_dump` output in custom format.
- The `.metadata` object records whether the backup is encrypted, and the salt and IV Databasus needs to decrypt it if it is.
- Databasus writes objects of up to 4,800 MiB, below the [5 GiB single-upload limit](/docs/storage/overview#limits). A larger backup is split into `.part000001`, `.part000002`, and so on, with a `.parts` manifest that lists them.

Download the backup and its metadata, replacing the key with one from your list:

```bash
export BACKUP_KEY=app-production-20261123-070833-f6ba17c2-ea21-4617-aded-ec597885fe05

neon buckets object get neon-backups/$BACKUP_KEY --file ./backup.dump \
  --project-id $BACKUP_PROJECT_ID --branch main
neon buckets object get neon-backups/$BACKUP_KEY.metadata --file ./backup.metadata \
  --project-id $BACKUP_PROJECT_ID --branch main
```

```bash
cat backup.metadata
```

```json filename="Output"
{"backupId":"f6ba17c2-ea21-4617-aded-ec597885fe05","encryptionSalt":null,"encryptionIV":null,"encryption":"NONE"}
```

`pg_restore --list` reads the archive header and its table of contents without connecting to a database:

```bash
pg_restore --list backup.dump | head -14
```

```text filename="Output"
;
; Archive created at 2026-11-23 07:08:37 UTC
;     dbname: neondb
;     TOC Entries: 26
;     Compression: zstd
;     Dump Version: 1.16-0
;     Format: CUSTOM
;     Integer: 4 bytes
;     Offset: 8 bytes
;     Dumped from database version: 18.7 (84da7d8)
;     Dumped by pg_dump version: 18.4 (Debian 18.4-1.pgdg12+1)
```

Databasus compresses backups of Postgres 16 and later with zstd, and older versions with gzip.

## Restore a backup to a Neon branch with Databasus

Databasus clears the target database before it restores a backup into it, so restore into a new branch and leave production as it is. Create the branch from production and copy its connection string:

```bash
neon branches create --project-id $APP_PROJECT_ID --name restore-check

neon connection-string restore-check --project-id $APP_PROJECT_ID --database-name neondb
```

In Databasus, open the **Backups** tab and click the restore icon (a cloud with an arrow) next to a backup. Click **Paste from clipboard** to fill in the branch's connection details, then click **Restore to this DB**.

![Restore from backup window in Databasus with the target Neon database](/guides/images/back-up-neon-databasus/databasus-restore-neon-backup.png)

When the status changes to **Successful**, connect to the branch and check the data. For example, compare row counts with production:

```bash
psql "$(neon connection-string restore-check --project-id $APP_PROJECT_ID --database-name neondb)" \
  -c "SELECT count(*) FROM orders;"
```

## Restore a backup with `pg_restore`

An unencrypted backup is a standard `pg_dump` archive, so you can restore it even if your Databasus instance is gone. `pg_restore` needs an empty database, so create one on the `restore-check` branch:

```bash
neon databases create --project-id $APP_PROJECT_ID --branch restore-check \
  --name restored --owner-name neondb_owner
```

Restore the file you downloaded earlier:

```bash
pg_restore --no-owner --no-acl \
  -d "$(neon connection-string restore-check --project-id $APP_PROJECT_ID --database-name restored)" \
  backup.dump
```

`--no-owner` and `--no-acl` skip the `ALTER OWNER` and `GRANT` statements from the source, so `neondb_owner` owns the restored objects. Check the restored tables and sequences:

```bash
psql "$(neon connection-string restore-check --project-id $APP_PROJECT_ID --database-name restored)" \
  -c "SELECT count(*) FROM orders;" \
  -c "SELECT last_value FROM orders_id_seq;"
```

For an encrypted backup, decrypt it first with the steps in [Manual recovery from backup without Databasus](https://databasus.com/how-to-recover-without-databasus).

When you're done, delete the branch:

```bash
neon branches delete restore-check --project-id $APP_PROJECT_ID
```

</Steps>

## Next steps

- Set up [restore verification](https://databasus.com/restore-verification), which restores the latest backup into a temporary database on a schedule and checks it against the source.
- Read the [Databasus guide for Neon](https://databasus.com/faq/neon) for the setup in the Neon Console instead of the CLI.

<NeedHelp />
