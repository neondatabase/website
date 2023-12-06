---
description: A new timescaledb extension version and a security enhancement
---

### Fixes & improvements

- Compute: The `timescaledb` extension was updated to a new version for Postgres 14 and 15, and added to Postgres 16, where it was previously not available.

    | Postgres extension           | Old version   | New version   |
    |------------------------------|---------------|---------------|
    | `timescaledb`                | 2.10.1        | 2.13.0        |

    If you installed this extension previously and want to upgrade to the latest version, please refer to [Update an extension version](/docs/extensions/pg-extensions#update-an-extension-version) for instructions. For a complete list of Postgres extensions supported by Neon, see [Postgres extensions](/docs/extensions/pg-extensions).
- Proxy: Enabled channel binding in the Neon proxy, which is an additional security measure that ties the authentication process (using SCRAM) to the specific secure communication channel, protecting it from advanced types of cyberattacks where the attacker is able to intercept and mimic secure communication channels.

