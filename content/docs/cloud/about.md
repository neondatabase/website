---
title: What is Neon?
enableTableOfContents: true
---

Neon is a fully managed serverless PostgreSQL with a generous free tier.
Neon separates storage and compute and offers modern developer features such as serverless, branching, bottomless storage, and more. Neon is open source and written in Rust.

## Serverless

Neon automatically and transparently scales up compute on demand, in response to application workload. Neon also scales down to zero on inactivity. Since Neon is serverless, it only charges for what you use and can deliver up to a 10x reduction in cost.

TODO: remove testing data before merging

```bash
pg_dump <connection-string> | psql <connection-string>
```

An `export` command that you can use to export your project password to a `PGPASSWORD` environment variable.

- Navigate to [https://console.neon.tech](https://console.neon.tech).
- If you do not have an invite code to access the Neon Technical Preview, click Request early access.

1. Navigate to [https://console.neon.tech](https://console.neon.tech).
2. If you do not have an invite code to access the Neon Technical Preview, click Request early access.
3. In your browser, navigate to the provided link where you are asked to select an existing project or create a new project.
   1. Selecting an existing project authenticates your connection to the selected project.
   2. Selecting Create new project directs you to a Project creation page where you create a new project to connect to.

<Admonition type="note">
The branch creation process does not increase load on the originating project. You can create a branch at any time without worrying about downtime or performance degradation.
</Admonition>
<Admonition type="info">
The branch creation process does not increase load on the originating project. You can create a branch at any time without worrying about downtime or performance degradation.
</Admonition>
<Admonition type="warning">
The branch creation process does not increase load on the originating project. You can create a branch at any time without worrying about downtime or performance degradation.
</Admonition>
<Admonition type="important">
The branch creation process does not increase load on the originating project. You can create a branch at any time without worrying about downtime or performance degradation.
</Admonition>
<Admonition type="tip">
The branch creation process does not increase load on the originating project. You can create a branch at any time without worrying about downtime or performance degradation.
</Admonition>

<CodeTabs labels={["React", "Python", "PHP", "Java"]}>

```jsx
import Auth from 'components/auth';
import { Provider as SessionProvider } from 'next-auth/client';
import { FlagsmithProvider } from 'flagsmith-react';

import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <FlagsmithProvider environmentId={process.env.NEXT_PUBLIC_FLAGSMITH_API_KEY}>
      <SessionProvider session={pageProps.session}>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </FlagsmithProvider>
  );
}
```

```python
import Auth from 'components/auth';
import { Provider as SessionProvider } from 'next-auth/client';
import { FlagsmithProvider } from 'flagsmith-react';

import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <FlagsmithProvider environmentId={process.env.NEXT_PUBLIC_FLAGSMITH_API_KEY}>
      <SessionProvider session={pageProps.session}>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </FlagsmithProvider>
  );
}
```

```php
import Auth from 'components/auth';
import { Provider as SessionProvider } from 'next-auth/client';
import { FlagsmithProvider } from 'flagsmith-react';

import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <FlagsmithProvider environmentId={process.env.NEXT_PUBLIC_FLAGSMITH_API_KEY}>
      <SessionProvider session={pageProps.session}>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </FlagsmithProvider>
  );
}
```

```java
import Auth from 'components/auth';
import { Provider as SessionProvider } from 'next-auth/client';
import { FlagsmithProvider } from 'flagsmith-react';

import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <FlagsmithProvider environmentId={process.env.NEXT_PUBLIC_FLAGSMITH_API_KEY}>
      <SessionProvider session={pageProps.session}>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </FlagsmithProvider>
  );
}
```

</CodeTabs>

TODO: remove testing data before merging

## Built for developer productivity

Neon allows you to create a branch of your PostgreSQL database. It's easy to create branches for development, test, and staging environments.

Branching is instant and has close to zero overhead, as it is implemented using the "copy-on-write" technique in Neon storage.
In fact, branches are so cheap that you can create a branch for every code deployment in your CI/CD pipeline. To learn more about our branching feature, see [Branching](/docs/conceptual-guides/branches).

## Fully managed

Neon provides high availability without any administrative, maintenance, or scaling burden.

## Bottomless storage

Our engineering team has developed a purpose-built, multi-tenant storage system for the cloud.
Neon storage allows virtually unlimited storage while providing high availability and durability guarantees.

Neon storage integrates storage, backups, and archiving into one system. This reduces operational headaches associated with checkpoints, data backups, and restore.

Neon storage is designed with cloud costs in mind and uses a multi-tier architecture to deliver on latency, throughput, and cost. It integrates a cloud object store, such as S3, to push cold data to the cheapest storage medium, and uses locally attached SSDs for low latency, high-performance data. Neon storage is written in Rust for maximum performance and usability.

## Open source

You can find [neondatabase](https://github.com/neondatabase/neon) on GitHub. We develop in public under the Apache 2.0 license. For an overview of Neon's architecture, refer to Neon's [architecture documentation](/docs/conceptual-guides/architecture-overview).

## Compatibility

Neon compute is the latest version of PostgreSQL. It is 100% compatible with any application that uses the official release of PostgreSQL. Currently, we support [PostgreSQL 14](https://www.postgresql.org/docs/14/release-14.html) and [PostgreSQL 15](https://www.postgresql.org/docs/15/release-15.html). For details refer to [compatibility](/docs/conceptual-guides/compatibility) page.
