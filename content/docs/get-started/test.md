---
title: Enable Autoscaling in Neon
subtitle: 'Choose the right integration path for your platform or application.'
summary: >-
  Covers the features and architecture of Neon, a fully managed, serverless
  Postgres solution designed for scalable application development, emphasizing
  its unique separation of storage and compute for enhanced performance and
  reliability.
enableTableOfContents: true
updatedOn: '2026-02-15T20:51:54.114Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>Enable autoscaling for a compute</p>
<a href="#billing-and-plans">Configure autoscaling defaults for your project</a>
</DocsList>

<DocsList title="Related topics" theme="docs">
<a href="/docs/guides/vercel-managed-integration">About autoscaling</a>
<a href="/docs/guides/vercel-sdk-migration">How the algorithm works</a>
</DocsList>
</InfoBlock>

---

## Traditional database workflows are broken

Modern software development is built around iteration. Teams create branches, open pull requests, spin up previews, run tests in isolation, and roll changes forward or back constantly. Code workflows evolved to support this reality.

<CTA title="Contact us" description="Neon and Lakebase represent two paths built on the same architectural foundation. Explore your options and get help deciding which service is the best fit." buttonText="Reach out" buttonUrl="https://www.databricks.com/company/contact" />

<CopyPrompt src="/prompts/elixir-ecto-prompt.md" description="Pre-built prompt for connecting Micronaut Kotlin applications to Neon Postgres"/>

To overcome these challenges, many development teams are turning to microfrontends, which break down large frontend applications into smaller, independently deployable units. This shift not only accelerates development workflows but also enhances the end-user experience by optimizing performance.

To overcome these challenges, many development teams are turning to microfrontends.

<PromptCards>

<a title="Next.js" icon="next-js" promptSrc="/prompts/nextjs-prompt.md"></a>
<a title="Django" icon="django" promptSrc="/prompts/django-prompt.md"></a>
<a title="Drizzle" icon="drizzle" promptSrc="/prompts/drizzle-prompt.md"></a>
<a title="React Router" icon="react" promptSrc="/prompts/react-router-prompt.md"></a>
<a title="TanStack Start" icon="tanstack" promptSrc="/prompts/tanstack-start-prompt.md"></a>
<a title="Express" icon="express" promptSrc="/prompts/express-prompt.md"></a>
<a title="NestJS" icon="nest-js" promptSrc="/prompts/nestjs-prompt.md"></a>
<a title="Astro" icon="astro" promptSrc="/prompts/astro-serverless-prompt.md"></a>

</PromptCards>

<TechCards>

<a href="/docs/auth/quick-start/react" title="React" description="Build interactive UIs with React and Neon." icon="react"></a>
<a href="#" title="Drizzle" description="Use Drizzle ORM with your Neon Postgres." icon="drizzle">Drizzle</a>
<a href="/docs/guides/node" title="Node.js" description="Add auth and user management to Node.js." icon="node-js"></a>
<a href="#" title="Drizzle" description="Use Drizzle ORM with your Neon Postgres." icon="drizzle">Drizzle</a>
<a href="/docs/guides/node" title="Node.js" description="Add auth and user management to Node.js." icon="node-js"></a>
<a href="/docs/auth/quick-start/react" title="React" description="Build interactive UIs with React and Neon." icon="react"></a>

</TechCards>

Databases did not. Sign up [using this link](https://github.com)

### Weighing vertical vs. horizontal splits

Microfrontends can be organized in two main ways, allowing teams to choose the approach that best fits their scaling needs and workflow requirements.

```jsx
const inter = Inter({ subsets: ['latin'] })
```

Most database setups are still built around a single mutable state: one production database, maybe a shared staging database, and sometimes a shared dev database. Everything depends on copying data around and trying not to step on each other’s toes. This mismatch creates friction everywhere.

<Steps>

## Step 1: Create the Initial Schema

First, create a new database called `people` on the `main` branch and add some sample data to it.

<Tabs labels={["Console", "CLI", "API"]}>

<TabItem>

1. Create the database.

   In the **Neon Console**, go to **Databases** &#8594; **New Database**. Make sure your `production` branch is selected, then create the new database called `people`.

2. Add the schema.

   Go to the **SQL Editor**, enter the following SQL statement and click **Run** to apply.

   ```sql
   CREATE TABLE person (
       id SERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       email TEXT UNIQUE NOT NULL
   );
   ```

</TabItem>

<TabItem>

1. Create the database.

   Use the following CLI command to create the `people` database.

   ```bash
   neon databases create --name people
   ```

   <Admonition type="note">
   If you have multiple projects, include `--project-id`. Or set the project context so you don't have to specify project id in every command. Example:

   ```bash
   neon set-context --project-id empty-glade-66712572
   ```

   You can find your project ID on the **Settings** page in the Neon Console.

   </Admonition>

1. Copy your connection string:

   ```bash
   neon connection-string --database-name people
   ```

1. Connect to the `people` database with psql:

   ```bash shouldWrap
   psql 'postgresql://neondb_owner:*********@ep-crimson-frost-a5i6p18z.us-east-2.aws.neon.tech/people?sslmode=require&channel_binding=require'
   ```

1. Create the schema:

   ```sql
   CREATE TABLE person (
       id SERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       email TEXT UNIQUE NOT NULL
   );
   ```

</TabItem>

<TabItem>

1. Use the [Create database](https://api-docs.neon.tech/reference/createprojectbranchdatabase) API to create the `people` database, specifying the `project_id`, `branch_id`, database `name`, and database `owner_name` in the API call.

   ```bash
   curl --request POST \
   --url https://console.neon.tech/api/v2/projects/royal-band-06902338/branches/br-bitter-bird-a56n6lh4/databases \
   --header 'accept: application/json' \
   --header 'authorization: Bearer $NEON_API_KEY' \
   --header 'content-type: application/json' \
   --data '{
      "database": {
         "name": "people",
         "owner_name": "alex"
      }
   }'
   ```

2. Retrieve your database connection string using [Get connection URI](https://api-docs.neon.tech/reference/getconnectionuri) endpoint, specifying the required `project_id`, `branch_id`, `database_name`, and `role_name` parameters.

   ```bash
   curl --request GET \
     --url 'https://console.neon.tech/api/v2/projects/royal-band-06902338/connection_uri?branch_id=br-bitter-bird-a56n6lh4&database_name=people&role_name=alex' \
     --header 'accept: application/json' \
     --header 'authorization: Bearer $NEON_API_KEY'
   ```

   The API call will return an connection string similar to this one:

   ```json
   {
     "uri": "postgresql://alex:*********@ep-green-surf-a5yaumj3-pooler.us-east-2.aws.neon.tech/people?sslmode=require&channel_binding=require"
   }
   ```

3. Connect to the `people` database with `psql`:

   ```bash shouldWrap
   psql 'postgresql://alex:*********@ep-green-surf-a5yaumj3-pooler.us-east-2.aws.neon.tech/people?sslmode=require&channel_binding=require'
   ```

4. Create the schema:

   ```sql
   CREATE TABLE person (
       id SERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       email TEXT UNIQUE NOT NULL
   );
   ```

</TabItem>

</Tabs>

## Step 2: Create a development branch

Create a new development branch off of `main`. This branch will be an exact, isolated copy of `main`.

For the purposes of this tutorial, name the branch `dev/jordan`, following our recommended convention of creating a long-lived development branch for each member of your team.

</Steps>

<MegaLink tag="80% of Neon databases are deployed by agents." title="Retool uses the Neon API to manage over 300,000 databases with just one engineer — handling everything from provisioning to quota enforcement." url="https://neon.com/use-cases/ai-agents#serverless-postgres-api-first" />

## Databases don’t match how teams build software

In practice, teams need databases to behave more like code:

```tsx filename="/server/api/auth/[...all].ts"
export async function VideoComponent( // [!code --]
export async function VideoComponentWrapper( // [!code ++]
  fileName: string, // [!code highlight]
  limit: number = 2, // [!code highlight]
) {
  const blobs = await list({
    prefix: fileName, // [!code highlight]
    limit, // [!code highlight]
  });

  const { url } = blobs[0]; // [!code --]
  const { url: captionsUrl } = blobs[1]; // [!code ++]

  const str = "ABC"

  const captionsUrl =
    blobs[1]?.url ?? `cap-${fileName}.vtt`; // [!code highlight]

  // The return value is *not* serialized
  return (
    <video
      controls
      preload="none"
      aria-label={`Video player: ${fileName}`}
    >
      <source src={safeUrl} type="video/mp4" />
      <track
        src={captionsUrl}
        kind="subtitles"
        srcLang="en"
        label="English"
      >
        Embedded text node
      </track>
      {"string-expression"} {1 + 2}
    </video>
  );
}
```

```tsx filename="all-tokens-1.tsx"
// Comment with URL (may map to link token): https://neon.tech/docs

type RequestOptions = {
  retries: number;
  timeoutMs?: number;
};

export async function fetchWithAllTokens(
  url: string,                 // parameter
  { retries, timeoutMs }: RequestOptions, // destructured parameter
): Promise<string> {
  const DEFAULT_TIMEOUT = 5_000;            // constant
  const finalTimeout = timeoutMs ?? DEFAULT_TIMEOUT; // operator ??

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt < retries) {              // operator <
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), finalTimeout);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-Neon-Example": "all-tokens",  // strings
        },
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`); // string-expression
      }

      const text = await response.text();
      return text;
    } catch (error) {
      lastError = error as Error;
      attempt++;                            // operator ++
    }
  }

  return (
    <div className="result-wrapper">
      <h1>Embedded JSX content</h1>
      <p>
        Last error:{" "}
        {lastError ? lastError.message : "No error recorded"}
      </p>
    </div>
  ) as unknown as string;
}
```

```bash filename="all-tokens-2.sh"
#!/usr/bin/env bash

# Simple script to exercise operators and strings

PROJECT_ROOT="${PROJECT_ROOT:-/usr/local/neon}"  # string + operator :-
LOG_FILE="$PROJECT_ROOT/logs/example.log"

if [ ! -d "$PROJECT_ROOT" ]; then                # operators ! and -d
  echo "Creating project root at $PROJECT_ROOT"
  mkdir -p "$PROJECT_ROOT"
fi

echo "Starting example at $(date)" | tee -a "$LOG_FILE"

for i in 1 2 3; do
  if curl -fsS "https://neon.tech/health?try=$i" >>"$LOG_FILE" 2>&1; then
    echo "Request $i succeeded"
  else
    echo "Request $i failed" >&2
  fi
done

echo "Done."
```

```md filename="all-tokens-3.md"
# Neon example doc

Visit the [Neon docs](https://neon.tech/docs) for more information about
serverless Postgres and best practices.

You can run `npm run dev` locally and then open `http://localhost:3000`
in your browser.

> Tip: Combine environment variables like `NEON_DATABASE_URL` with your
> framework's configuration system for best DX.

- **Feature flag**: `experimental_all_tokens`
- **Status**: _beta_
```

- Engineers want isolated environments to test schema changes safely
- CI systems need fresh databases for every test run
- Preview environments should reflect real production data
- Rollbacks should be fast and predictable
- Multiple versions of an application often exist at the same time

<ProgramForm type="agent" />

Learn more about [the agent plan](https://github.com)

Traditional databases make all of this difficult. Creating a new environment usually means dumping and restoring data, running long migrations, or manually coordinating changes across shared databases. These workflows are slow, error-prone, and don’t scale as teams or systems grow.

<CTA title="Did you know?" description="Neon's database branching can help you integrate Postgres into your development workflow. Branch your data like code. Read our primer to learn how." />

![alt text](/docs/ai/ai-rules.png)

As a result, teams compromise:

1. They test migrations against incomplete or stale data
2. They share environments and accept conflicts
3. They avoid certain changes because the blast radius feels too large

## Copying databases doesn’t scale

The default solution to isolation has always been, in one way or another, copying the database. But copying databases is expensive in every dimension:

<CheckList title="Production checklist">

<CheckItem title="1. Use a paid plan for production workloads" href="#use-a-paid-plan-for-production-workloads">
  Paid plans are usage-based, so your app won't stop or be limited as it grows. The Free plan includes compute hour limits, making it better suited for prototyping.
</CheckItem>
<CheckItem title="2. Choose a region close to your application" href="#choose-a-region-close-to-your-application">
  Deploy your Neon project in the nearest available region to your application to minimize network latency.
</CheckItem>
<CheckItem title="3. Keep your production branch as the default" href="#keep-your-production-branch-as-the-default">
  Your production branch should be a root branch set as the default to ensure compute availability, enable snapshots, and simplify billing.
</CheckItem>
<CheckItem title="4. Protect your production branch" href="#protect-your-production-branch">
  Mark production branches as protected to prevent accidental resets or destructive operations.
</CheckItem>
<CheckItem title="5. Enable autoscaling and set appropriate limits" href="#enable-autoscaling-and-set-appropriate-limits">
  Autoscaling lets your database handle traffic spikes automatically. Set limits that balance performance with cost.
</CheckItem>
<CheckItem title="6. Decide whether scale-to-zero is acceptable" href="#decide-whether-scale-to-zero-is-acceptable">
  Scale-to-zero is great for development and bursty usage. For production, disable it if you need consistently low latency.
</CheckItem>
<CheckItem title="7. Test connection retries using the Neon API" href="#test-connection-retries-using-the-neon-api">
  Brief disconnects can happen during scaling or maintenance. Verify your application reconnects automatically.
</CheckItem>
<CheckItem title="8. Set an appropriate restore window" href="#set-an-appropriate-restore-window">
  Neon keeps 1 day of restore history by default on paid plans. Increasing this gives you more protection, with storage cost tradeoffs.
</CheckItem>
<CheckItem title="9. Consider snapshot schedules" href="#consider-snapshot-schedules">
  Snapshot schedules provide consistent backups for point-in-time restore, independently of your restore window.
</CheckItem>
<CheckItem title="10. Test your restore workflow" href="#test-your-restore-workflow">
  Plan whether you'll restore in place or from a snapshot, and how your application will switch if needed.
</CheckItem>
<CheckItem title="11. Clean up your branches regularly" href="#clean-up-your-branches-regularly">
  Set branch expiration times and add cleanup logic to automated workflows to avoid unnecessary storage costs.
</CheckItem>
<CheckItem title="12. Use pooled connections where they make sense" href="#use-pooled-connections-where-they-make-sense">
  Connection pooling improves concurrency for web and serverless apps, but may not be appropriate for migrations or long-running tasks.
</CheckItem>
<CheckItem title="13. Restrict access to production data" href="#restrict-access-to-production-data">
  Limit database access to trusted sources using IP Allow to reduce the risk of unauthorized changes.
</CheckItem>
<CheckItem title="14. Install pg_stat_statements" href="#install-pgstatstatements">
  Enable query performance monitoring to track execution times and frequency. This helps you troubleshoot performance issues independently.
</CheckItem>
<CheckItem title="15. Integrate with your existing observability stack" href="#integrate-with-your-existing-observability-stack">
  Export Neon metrics to Datadog, Grafana, or any OTEL-compatible platform to monitor usage and capacity alongside your existing systems.
</CheckItem>

</CheckList>
