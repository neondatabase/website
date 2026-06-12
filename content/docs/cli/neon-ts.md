---
title: neon.ts reference
subtitle: Declare your branch's desired state in a TypeScript config file
enableTableOfContents: true
---

`neon.ts` is a TypeScript file you place at the root of your project to describe the desired state of a Neon branch: its parent, TTL, protected status, compute settings, Neon Auth, and Data API config. The [`neonctl config`](/docs/cli/config) command reads it and applies it to a branch.

## File location

Place `neon.ts` at the root of your repository:

```
my-project/
├── neon.ts
├── package.json
└── src/
```

You can point `neonctl config` at a different location using the `--config` flag.

## Basic structure

```ts
import { defineConfig } from '@neondatabase/config/v1';

export default defineConfig((branch) => {
  return {
    // BranchConfig fields
  };
});
```

The function exported from `@neondatabase/config/v1` is `defineConfig`. It takes a callback that receives a [branch context object](#branch-context) and returns a [`BranchConfig`](#branchconfig-fields).

## Branch context

The callback receives a `branch` object describing the branch being evaluated:

| Property           | Type      | Description                                    |
| ------------------ | --------- | ---------------------------------------------- |
| `branch.isDefault` | `boolean` | `true` if this is the project's default branch |
| `branch.name`      | `string`  | The branch name                                |

Use these properties to return different policies for different branches — for example, protecting the default branch while applying a TTL to all others.

## BranchConfig fields

All fields are optional.

| Field       | Type      | Description                                                                                                                                       |
| ----------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `parent`    | `string`  | Name of the parent branch. Defaults to the project's default branch.                                                                              |
| `ttl`       | `string`  | Branch time-to-live. Accepts duration strings like `'7d'`, `'24h'`, `'30m'`. The branch is deleted automatically after this period of inactivity. |
| `protected` | `boolean` | Marks the branch as protected. Protected branches can't be deleted or reset without confirmation.                                                 |
| `auth`      | `object`  | Enables [Neon Auth](/docs/auth/overview) on the branch. Pass `{}` to use defaults.                                                                |
| `dataApi`   | `object`  | Enables the [Data API](/docs/data-api/manage) on the branch. Pass `{}` to use defaults.                                                           |
| `compute`   | `object`  | Compute settings for the branch.                                                                                                                  |

## Examples

### Protect the default branch, expire all others

```ts
import { defineConfig } from '@neondatabase/config/v1';

export default defineConfig((branch) => {
  if (branch.isDefault) {
    return { protected: true };
  }
  return { parent: 'main', ttl: '7d' };
});
```

### Enable Neon Auth on the default branch

```ts
import { defineConfig } from '@neondatabase/config/v1';

export default defineConfig((branch) => {
  if (branch.isDefault) {
    return { protected: true, auth: {} };
  }
  return { parent: 'main', ttl: '7d' };
});
```

### Different TTLs by branch name

```ts
import { defineConfig } from '@neondatabase/config/v1';

export default defineConfig((branch) => {
  if (branch.isDefault) {
    return { protected: true };
  }
  if (branch.name.startsWith('release/')) {
    return { parent: 'main', ttl: '30d' };
  }
  return { parent: 'main', ttl: '7d' };
});
```

## Applying neon.ts

Use `neonctl config` to inspect, preview, and apply the policy:

```bash
neonctl config status   # show the branch's live state
neonctl config plan     # dry-run: show what apply would change
neonctl config apply    # apply the policy to the branch
```

`neonctl deploy` is an alias for `config apply`. After a successful apply, the CLI writes `DATABASE_URL` and any Auth or Data API URLs to your local `.env` file.

`neonctl checkout` also reads `neon.ts` when creating a new branch, so new branches inherit their parent, TTL, and compute settings from the start.

Available in **neonctl v2.24.0**. See [`neonctl config`](/docs/cli/config) for the full command reference.

<NeedHelp />
