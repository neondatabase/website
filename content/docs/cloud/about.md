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

| Application                                                                        | SNI support | Comment                                                                                                                          |
| ---------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [TablePlus](https://tableplus.com)                                                 | ✅          | SNI support on macOS since build 436, on Windows since build 202, TBD for Linux. For older versions, Workaround B is applicable. |
| [Postico](https://eggerapps.at/postico/)                                           | ✅          | SNI support since v1.5.21. For older versions, Workaround B is applicable.                                                       |
| [PopSQL](https://popsql.com/)                                                      | ❌          | No SNI support. Workaround D helps.                                                                                              |
| [Grafana pg source](https://grafana.com/docs/grafana/latest/datasources/postgres/) | ✅ / ❌     | Workaround C. SNI works if sslmode=verify-full as with other golang libraries                                                    |
| [PgAdmin 4](https://www.pgadmin.org/)                                              | ✅          |                                                                                                                                  |
| [DataGrip](https://www.jetbrains.com/datagrip/)                                    | ✅          |                                                                                                                                  |

<CodeTabs labels={["React", "CSS", "JSON", "Rest", "Python", "PHP", "Java", "Rust", "Go"]}>

```jsx
import flagsmith from 'flagsmith';
// import flagsmith from 'react-native-flagsmith'; - Use this instead for React Native

import { useFlags, FlagsmithProvider } from 'flagsmith/react';

const randomRegex = /[.*+?^${}()|[\]\\]/g;

console.log(true === false); // prints false
console.log(true === !false);

function isEven(number) {
 return Number(number) % 2 === 0;
}
const isOdd = (number) => !isEven(number);

const char = ['A', 'z', '0', '-', '\t', '\u{2728}'];

for (const foo of bar) {
 if (foo === 'foobar') break;
 await foo;
}

const App = () => (
    <FlagsmithProvider options={{ environmentID: "QjgYur4LQTwe5HpvbvhpzK"}} flagsmith={flagsmith}>
        <HomePage/>
        <p id="greeting">Hello World!</p>
        <video width="1280" height="720" allowfullscreen controls>
          <source src="hello_world.mp4" type="video/mp4" />
        </video>
    </FlagsmithProvider>
)

const HomePage = () => {
 const flags = useFlags(['chat_widget']);
  return (
      <>{flags.chat_widget.enabled && <ChatWidget>}</>
  );
}
```

```css
body {
  background: url(foo.png);
  color: red;
  line-height: normal !important;
}
@font-family {
  font-family: Questrial;
  src: url(questrial.otf);
}
@media screen and (min-width: 768px) {
  /* ... */
}

section h1,
#features li strong,
header h2,
footer p {
  /* ... */
}

.class,
.random-class {
  /* ... */
}
```

```json
{
  "data": { "labels": ["foo", "bar"] },
  "error": null,
  "status": "Ok"
}
```

```bash
$ curl 'https://api.flagsmith.com/api/v1/flags/'
-H 'X-Environment-Key: TijpMX6ajA7REC4bf5suYg' | jq

[
  {
    "id": 131,
    "feature": {
      "id": 56,
      "name": "kyc_button",
      "created_date": "2018-06-28T13:30:09.983174Z",
      "description": null,
      "initial_value": null,
      "default_enabled": true,
      "type": "FLAG"
    },
    "feature_state_value": null,
    "enabled": true,
    "environment": 12,
    "identity": null,
    "feature_segment": null
  }
]
```

```python
$ pip install flagsmith

from flagsmith import Flagsmith;

fs = Flagsmith(environment_id="QjgYur4LQTwe5HpvbvhpzK")

if fs.has_feature("header"):
  if fs.feature_enabled("header"):
    # Show my awesome cool new feature to the world

value = fs.get_value("header", '<My User Id>')

value = fs.get_value("header")

fs.set_trait("accept-cookies", "true", "ben@flagsmith.com))
fs.get_trait("accept-cookies", "ben@flagsmith.com"))

def median(pool):
  copy = sorted(pool)
  size = len(copy)
  if size % 2 == 1:
    return copy[(size - 1) / 2]
  else:
    return (copy[size/2 - 1] + copy[size/2]) / 2
```

```php
composer require flagsmith/flagsmith-php-client

$fs = new Flagsmith('QjgYur4LQTwe5HpvbvhpzK');

$flags = $fs->getFlags();
foreach ($flags as &$value) {
    print_r($value);
}
```

```java
implementation 'com.flagsmith:flagsmith-java-client:2.3'

FlagsmithClient flagsmithClient =
         FlagsmithClient.newBuilder()
         .setApiKey("QjgYur4LQTwe5HpvbvhpzK")
         .build();

if (flagsmithClient.hasFeatureFlag("chat_widget");) {
  userInterface.chatWidgetEnable()
} else {
 return false;
}

class Foo extends foo.bar.Foo {
  java.util.List<foo.bar.Foo.Bar> bar(foo.bar.Baz bat) {
   throw new java.lang.UnsupportedOperationException();
  }
}
```

```rust
# Cargo.toml
flagsmith = "0.2.0"

let fs = flagsmith::Client::new("QjgYur4LQTwe5HpvbvhpzK");

if fs.feature_enabled("chat_widget")? {
    println!("Feature enabled");
}

if let Some(Value::String(s)) = fs.get_value("cart_abundant_notification_ab_test")? {
    println!("{}", s);
}
```

```go
$ go get github.com/flagsmith/flagsmith-go-client

import (
  "github.com/flagsmith/flagsmith-go-client"
)

bt := bullettrain.DefaultBulletTrainClient("QjgYur4LQTwe5HpvbvhpzK")

enabled, err := bt.FeatureEnabled("chat_widget")
if err != nil {
    log.Fatal(err)
} else {
    if (enabled) {
        fmt.Printf("Feature enabled")
    }
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
