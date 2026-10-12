---
title: 'Git worktrees and Neon branching: Running multiple AI coding agents in parallel'
subtitle: Learn how to run multiple AI coding agents in parallel with isolated Git worktrees and Neon database branches.
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-02-25T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

You’ve probably seen people on X (Twitter) experimenting with [swarms of AI coding agents](https://x.com/notnotstorm/status/1993411360387162235?s=20), sometimes mentioning concepts like [Git worktrees](https://x.com/bcherny/status/2025007393290272904?s=20). If you’ve already been running Claude or another agent in your terminal, you might be wondering: _what exactly are worktrees, and why do they matter?_

When you run an AI agent to write code, you usually start it and then wait, watching the terminal scroll or doing something unrelated. You're idle while the agent works. If one agent can build a feature, you could run several agents to build multiple features at once.

At first, it seems straightforward. Open a few terminals, start your agents, and assign tasks in parallel. But in practice, things break down quickly:

1. **File collisions:** Agents overwrite each other’s changes.
2. **Git conflicts:** Shared `.git` state leads to locked indexes or tangled commits.
3. **Database conflicts:** Tests or migrations run in parallel against the same database, causing failures.

The underlying issue is isolation. Without separate environments, agents interfere with each other's work. You can clone your repository multiple times or run a separate Docker container for each database, but those approaches are slow and resource-heavy.

A lighter approach is to give each agent its own workspace and database branch. Git worktrees let you create multiple working directories from a single repository without duplicating it, and Neon branches give each one its own database for migrations and tests. Together, they let you run agents in parallel without collisions.

In this guide, you'll set up a workflow that runs multiple agents side by side, each with its own isolated environment. It covers:

- **Git worktrees** for clean file system separation
- **Neon branches** for independent databases

Finally, a custom Git hook ties it together, so starting a new agent with its own database takes a single command.

## Part 1: Git worktrees

Traditional Git workflows assume a **“one branch at a time”** model. Switching contexts usually means stashing your current changes or checking out a different branch, which rewrites the entire working directory. That’s fine for humans, since we can only focus on one task at once. But it breaks down when multiple agents run in parallel.

Imagine Agent A working on `feature-a`. At the same time, Agent B checks out `feature-b`. Suddenly, Agent A’s files are replaced, Agent B’s changes overwrite the workspace, and both agents are now tangled in conflicting states. A workflow that works for a single developer breaks when multiple processes share the same environment.

**Git worktrees** remove this limitation. They let you check out multiple branches from the same repository into separate directories at the same time.

Think of it as having one `.git` folder acting as the brain, but multiple directories performing different tasks at once.

- **No cloning required:** You don't need to duplicate the entire repository history.
- **True file isolation:** Agent A works in `/workspace/feature-a`, while Agent B works in `/workspace/feature-b`.
- **No interference:** Changes, installs, and builds in one tree don't touch the others.

For example, if you have a repository with branches `main`, `feature-a`, and `feature-b`, you can create worktrees that exist as parallel directories on your disk:

```
/my-repo       (main branch)
|-- .git
|-- source files...

/feature-a     (feature-a branch)
|-- .git       (pointer to main .git)
|-- source files...

/feature-b     (feature-b branch)
|-- .git       (pointer to main .git)
|-- source files...
```

Visually, this resembles cloning your repository into multiple folders, but without the overhead of duplicating the `.git` directory history. Each folder is a fully functional Git working directory, and they all share the same underlying commit history.

## Part 2: Neon branching

File system isolation is only half of it. If Agent A and Agent B are isolated in their folders but both connect to `postgres://localhost/dev_db`, they will still step on each other’s data. Migrations, seed scripts, and test runs will conflict and break builds.

Neon solves this part. The lakebase architecture separates compute and storage, so you can branch your database the way you branch your code.

Because branches are [copy-on-write](/docs/introduction/architecture-overview#what-this-architecture-enables), creating a database branch takes about a second and a new branch initially consumes no extra storage. By assigning every Git worktree its own dedicated Neon database branch, your agents can run destructive migrations and seed test data in isolation.

Visually, you can map your database similarly to your Git branches:

| Git branch | Git parent branch | Neon branch | Neon parent branch |
| ---------- | ----------------- | ----------- | ------------------ |
| main       | -                 | main        | -                  |
| feature-a  | main              | feature-a   | main               |
| feature-b  | main              | feature-b   | main               |

## A Git hook for automatic provisioning

You now have the components: a Git worktree for code and a Neon branch for data. Configuring them by hand for every task is tedious.

To automate it, use a Git `post-checkout` hook. This script runs whenever a new worktree is created. It does four things:

1.  **Detect** that a new worktree is being created.
2.  **Bootstrap** the environment by copying your main `.env` file.
3.  **Provision** a new Neon database branch matching the Git branch name.
4.  **Configure** the new worktree's `DATABASE_URL` to point to this isolated database.

### Prerequisites

- A [Neon account](https://console.neon.tech)
- The [Neon CLI](/docs/cli) installed (`npm i -g neon` or `brew install neonctl`)
- Your project configured with a `.env` file containing:

  ```env
  NEON_API_KEY=your_api_key_here
  NEON_PROJECT_ID=your_project_id_here
  DATABASE_URL=postgres://...
  ```

  Follow [Manage API keys](/docs/manage/api-keys#creating-api-keys) to create an API key if you don't have one.

  Find your `NEON_PROJECT_ID` in the Neon Console on your project's **Settings** page.

### Setting up the Git hook

In your repository, navigate to `.git/hooks/` and create the `post-checkout` file:

```bash
touch .git/hooks/post-checkout
chmod +x .git/hooks/post-checkout
```

Paste the following script into `.git/hooks/post-checkout`:

```bash
#!/bin/bash
set -euo pipefail

# Git post-checkout hook: syncs Neon database branch with current Git branch
# Args: $1 = previous HEAD, $2 = new HEAD, $3 = checkout type (1=branch, 0=file)
if [ "${3:-0}" != "1" ]; then
  exit 0
fi

GIT_ROOT=$(git rev-parse --show-toplevel)
ENV_FILE="$GIT_ROOT/.env"

IS_WORKTREE_CREATION=0
if [ "${1:-}" = "0000000000000000000000000000000000000000" ]; then
  IS_WORKTREE_CREATION=1
fi

find_seed_env_file() {
  local current_root="$1"
  local line
  local worktree_path

  while IFS= read -r line; do
    case "$line" in
      worktree\ *)
        worktree_path="${line#worktree }"
        if [ "$worktree_path" != "$current_root" ] && [ -f "$worktree_path/.env" ]; then
          printf '%s' "$worktree_path/.env"
          return 0
        fi
        ;;
    esac
  done < <(git worktree list --porcelain)

  if [ -f "$current_root/.env.example" ]; then
    printf '%s' "$current_root/.env.example"
    return 0
  fi

  return 1
}

if [ ! -f "$ENV_FILE" ]; then
  if [ "$IS_WORKTREE_CREATION" = "1" ]; then
    echo "ℹ️  New worktree detected - bootstrapping .env"
  fi

  if SEED_ENV_FILE=$(find_seed_env_file "$GIT_ROOT"); then
    cp "$SEED_ENV_FILE" "$ENV_FILE"
    echo "✅ Created .env from: $SEED_ENV_FILE"
  else
    echo "❌ .env file not found at: $ENV_FILE"
    echo "   Create one (or .env.example) in this worktree, then retry checkout."
    exit 1
  fi
fi

if ! command -v neon &>/dev/null; then
  echo "❌ Neon CLI not found. Install it with: brew install neonctl  OR  npm i -g neon"
  exit 1
fi

# Skip detached HEAD (tag/commit checkout)
BRANCH_NAME=$(git symbolic-ref --short HEAD 2>/dev/null) || {
  echo "ℹ️  Detached HEAD - skipping Neon branch sync"
  exit 0
}

echo "🔄 Syncing Neon branch with Git branch: $BRANCH_NAME"

# Parse .env without `source` to handle values with shell metacharacters
get_env_value() {
  local key="$1"
  local value
  value=$(grep -E "^${key}=" "$ENV_FILE" | head -1 | cut -d'=' -f2-) || true
  value="${value#\"}" ; value="${value%\"}"
  value="${value#\'}" ; value="${value%\'}"
  value="${value%$'\r'}"
  printf '%s' "$value"
}

NEON_API_KEY=$(get_env_value "NEON_API_KEY")
NEON_PROJECT_ID=$(get_env_value "NEON_PROJECT_ID")

if [ -z "$NEON_API_KEY" ]; then
  echo "❌ NEON_API_KEY not found in .env file"
  exit 1
fi

if [ -z "$NEON_PROJECT_ID" ]; then
  echo "❌ NEON_PROJECT_ID not found in .env file"
  exit 1
fi

export NEON_API_KEY

# Create Neon branch if it doesn't exist
if neon branches get "$BRANCH_NAME" --project-id "$NEON_PROJECT_ID" >/dev/null 2>&1; then
  echo "✅ Neon branch already exists: $BRANCH_NAME"
else
  echo "🌱 Creating Neon branch: $BRANCH_NAME"
  if ! neon branches create --name "$BRANCH_NAME" --project-id "$NEON_PROJECT_ID" >/dev/null; then
    echo "❌ Failed to create Neon branch: $BRANCH_NAME"
    exit 1
  fi
fi

CONNECTION_URI=$(neon connection-string "$BRANCH_NAME" --pooled --project-id "$NEON_PROJECT_ID" 2>/dev/null) || true
CONNECTION_URI="${CONNECTION_URI#\"}" ; CONNECTION_URI="${CONNECTION_URI%\"}"

if [ -z "$CONNECTION_URI" ]; then
  echo "❌ Failed to retrieve connection string for branch: $BRANCH_NAME"
  exit 1
fi

# Update DATABASE_URL safely
tmp_file="$ENV_FILE.tmp.$$"
trap 'rm -f "$tmp_file"' EXIT

grep -v "^DATABASE_URL=" "$ENV_FILE" > "$tmp_file" || true

if [ -s "$tmp_file" ] && [ "$(tail -c1 "$tmp_file" | wc -l)" -eq 0 ]; then
  echo >> "$tmp_file"
fi

printf 'DATABASE_URL="%s"\n' "$CONNECTION_URI" >> "$tmp_file"
mv "$tmp_file" "$ENV_FILE"

echo "✅ DATABASE_URL updated for branch: $BRANCH_NAME"
```

<Admonition type="note" title="What this script does">
When you check out a new branch in a worktree, this script copies your main `.env` into the new directory. It then uses the `neon` CLI to branch your database, retrieves the new connection string, and updates `DATABASE_URL` in the new worktree.
</Admonition>

## Running AI agents in parallel

<Admonition type="note" title="Works with any AI agent">
This workflow isn't specific to Claude Code. Since the Git hook operates at the file system level, it works with any AI coding agent that can use a Git worktree as its workspace. See [Manual worktree creation](#manual-worktree-creation) below for how to set up worktrees manually if your agent doesn't have built-in support.
</Admonition>

AI tools like [Claude Code](https://code.claude.com/docs/en/common-workflows#run-parallel-claude-code-sessions-with-git-worktrees) already have built-in support for Git worktrees, so this workflow fits in without extra setup.

Suppose you are working in your main directory, but you want to delegate a new authentication feature to an AI agent running in the background. Run:

```bash
claude --worktree feature-auth
```

This command does the following:

1.  Claude Code provisions a new Git worktree folder named `feature-auth` inside `.claude/worktrees/`.
2.  The `post-checkout` hook intercepts the event.
3.  The hook duplicates your `.env` into the new `feature-auth` directory.
4.  The hook creates an isolated Neon branch named `worktree-feature-auth`.
5.  The hook updates `DATABASE_URL` in your new worktree.
6.  Claude Code starts in the new directory.

Because the `DATABASE_URL` is pre-configured, the agent can start writing code, running migrations, and executing tests against its own private database.

Meanwhile, in your main terminal, you can launch another agent:

```bash
claude --worktree feature-billing
```

You now have multiple AI agents building features in parallel, each with its own file system and database.

<Admonition type="note" title="Claude Code hooks">
Claude Code provides custom hooks for Git worktree creation and removal. If you need precise control, for example deciding exactly when Neon branch provisioning should occur, you can use these instead of a standard Git post-checkout hook. If you use another version control system like Mercurial or SVN, use the Claude Code hooks to get similar behavior. Learn more about Claude Code’s hooks in their [documentation](https://code.claude.com/docs/en/hooks#worktreecreate).
</Admonition>

You can run as many agents as your coding plan allows, up to your Neon plan's branch limit. Each agent has its own workspace and database branch, so destructive tests and migrations don't break other agents' work.

### Manual worktree creation

If you prefer to create worktrees manually or your agent doesn't have built-in support, you can use Git commands directly. For example, if you want to create a new worktree for a branch named `feature-search`, you would run:

```bash
git worktree add -b feature-search ../feature-search
```

This command creates a new directory `../feature-search` (sibling to your current folder) and checks out a new branch named `feature-search`. The `post-checkout` hook will immediately trigger:

1.  It detects the new worktree.
2.  It copies your `.env` file to `../feature-search/.env`.
3.  It creates a Neon branch named `feature-search`, matching the Git branch.
4.  It updates the `DATABASE_URL` in the new `.env` file.

You can now navigate to that directory and start your agent or run your code:

```bash
cd ../feature-search
# claude, codex, gemini, or any agent can now run here with its own database
```

## Merging changes and resolving conflicts

Once an agent finishes its task, you’ll have a feature branch (e.g., `feature-auth`) with new commits and a corresponding Neon database branch. The next step is to merge that work back into `main`.

### Merging manually

You can merge the worktree's branch just like any standard Git branch. From your main terminal:

```bash
git merge feature-auth
```

If there are no conflicts, the merge will be fast-forward or clean. You can then delete the worktree and the database branch:

```bash
git worktree remove feature-auth

source .env  # Load NEON_PROJECT_ID and NEON_API_KEY from .env
neon branches delete feature-auth --project-id $NEON_PROJECT_ID
```

> You can also automate this cleanup with a Git hook that runs on branch deletion or after a merge and removes the corresponding Neon branch. Your AI agent can write it for you.

### Handling conflicts

If multiple agents modified the same files, you might encounter merge conflicts. Because worktrees share the same `.git` history, standard conflict resolution tools apply. Isolate the conflict, fix it in your main branch (or the feature branch), and complete the merge.

If you'd rather not switch contexts to merge, ask Claude to handle it.

For example, you can tell your main agent:

> "The agent in `feature-auth` is done. Please merge its branch into main, resolve any simple conflicts, and clean up the worktree and database branch."

Claude then runs the Git commands and resolves conflicts based on your instructions.

## Conclusion

You set up Git worktrees and a `post-checkout` hook that gives each worktree its own Neon branch, so multiple agents can work in parallel without sharing files or a database. As a next step, add a matching hook that deletes the Neon branch when you remove a worktree.

## Resources

- [Neon branching](/branching)
- [Automating Neon branch creation with Githooks](/blog/automating-neon-branch-creation-with-githooks)
- [Git worktrees documentation](https://git-scm.com/docs/git-worktree)
- [Claude Code documentation](https://code.claude.com/docs)
