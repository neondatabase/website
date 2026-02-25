---
title: 'Git worktrees and Neon Branching: Running Multiple AI Coding Agents in Parallel'
subtitle: Learn how to run multiple AI coding agents in parallel with isolated Git worktrees and Neon database branches.
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-02-25T00:00:00.000Z'
updatedOn: '2026-02-25T00:00:00.000Z'
---

You’ve probably seen people on X (Twitter) experimenting with [swarms of AI coding agents](https://x.com/notnotstorm/status/1993411360387162235?s=20), sometimes mentioning concepts like [Git worktrees](https://x.com/bcherny/status/2025007393290272904?s=20). If you’ve already been running Claude or another agent in your terminal, you might be wondering: _what exactly are worktrees, and why do they matter?_

Think about what usually happens when you run an AI agent to write code. You start it, then wait watching the terminal scroll, maybe checking your phone, or doing something unrelated. In other words, you’re idle while the agent works. What if instead of waiting, you could assign multiple tasks to multiple agents and have them all working in parallel?

The idea is appealing: _If one agent can build a feature, why not run several agents to build multiple features at once?_

At first, it seems straightforward. Open a few terminals, start your agents, and assign tasks in parallel. But in practice, things break down quickly:

1. **File collisions:** Agents overwrite each other’s changes.
2. **Git conflicts:** Shared `.git` state leads to locked indexes or tangled commits.
3. **Database conflicts:** Tests or migrations run in parallel against the same database, causing failures.

The underlying issue is isolation. Without separate environments, agents interfere with each other’s work, making parallel development unreliable. There are brute-force fixes: cloning your repository multiple times or running separate Docker containers for each database. But those approaches are slow, resource-heavy, and add unnecessary friction.

A more efficient solution is to give each agent its own lightweight workspace and database branch. That’s where Git worktrees and Neon come in. Worktrees let you create multiple working directories from a single repository without duplication, while Neon provides instant database branches that keep migrations and tests separate. Together, they make it practical to run agents in parallel without collisions.

In this guide, we’ll walk through how to set up a workflow that allows multiple agents to run side by side, each with its own isolated environment. We’ll cover:

- **Git worktrees** for clean file system separation
- **Neon** for instant, independent database branches

Finally, we’ll tie it all together with a custom Git hook so that spinning up a new agent with its own database takes only a single command.

## The Solution Part 1: Git Worktrees

Traditional Git workflows assume a **“one branch at a time”** model. Switching contexts usually means stashing your current changes or checking out a different branch, which rewrites the entire working directory. That’s fine for humans, since we can only focus on one task at once. But it breaks down when multiple agents run in parallel.

Imagine Agent A working on `feature-a`. At the same time, Agent B checks out `feature-b`. Suddenly, Agent A’s files are replaced, Agent B’s changes overwrite the workspace, and both agents are now tangled in conflicting states. What feels natural for a single developer quickly turns into chaos when multiple processes share the same environment.

**Git worktrees** eliminate this limitation. They allow you to check out multiple branches from the same repository into separate, isolated directories simultaneously.

Think of it as having one `.git` folder acting as the brain, but multiple directories performing different tasks at once.

- **No cloning required:** You don't need to duplicate the entire repository history.
- **True file isolation:** Agent A works in `/workspace/feature-a`, while Agent B works in `/workspace/feature-b`.
- **Zero interference:** Changes, installs, and builds in one tree touch absolutely nothing in the others.

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

## The Solution Part 2: Neon Database Branching

File system isolation is only half the battle. If Agent A and Agent B are isolated in their folders but both connect to `postgres://localhost/dev_db`, they will still step on each other’s data. Migrations, seed scripts, and test runs will conflict, leading to broken builds and wasted time.

This is where **Neon** is essential. Neon separates compute and storage, allowing you to branch your database as easily as you branch your code.

Because Neon uses [copy-on-write](/docs/introduction/architecture-overview#what-this-architecture-enables) technology, creating a database branch takes less than a second and initially consumes zero extra storage. By assigning every Git worktree its own dedicated Neon database branch, your agents can run destructive migrations, seed test data, and execute complex logic in complete isolation.

Visually, you can map your database similarly to your Git branches:

| Git Branch | Git Parent Branch | Neon Branch | Neon Parent Branch |
| ---------- | ----------------- | ----------- | ------------------ |
| main       | -                 | main        | -                  |
| feature-a  | main              | feature-a   | main               |
| feature-b  | main              | feature-b   | main               |

## Putting It All Together: A Git Hook for Seamless Provisioning

We have the components: a Git worktree for code and a Neon branch for data but configuring them manually for every task is tedious.

To make this seamless, we can use a Git `post-checkout` hook. This script triggers automatically whenever a new worktree is created. Its job is simple:

1.  **Detect** that a new worktree is being created.
2.  **Bootstrap** the environment by copying your main `.env` file.
3.  **Provison** a new Neon database branch matching the Git branch name.
4.  **Configure** the new worktree's `DATABASE_URL` to point to this isolated database.

### Prerequisites

- A [Neon account](https://console.neon.tech)
- The [Neon CLI](/docs/reference/neon-cli) installed (`npm i -g neonctl` or `brew install neonctl`)
- Your project configured with a `.env` file containing:

  ```env
  NEON_API_KEY=your_api_key_here
  NEON_PROJECT_ID=your_project_id_here
  DATABASE_URL=postgres://...
  ```

  Follow [Manage Neon API Keys](/docs/manage/api-keys#creating-api-keys) to create an API key if you don't have one.

  Retrieve your `NEON_PROJECT_ID` from the Neon Console under your project settings.

### Setting up the Git Hook

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
  echo "❌ Neon CLI not found. Install it with: brew install neonctl  OR  npm i -g neonctl"
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
When you checkout a new branch in a worktree, this script copies your main `.env` into the new directory. It then uses the `neon` CLI to instantly branch your database, retrieves the new connection string, and updates `DATABASE_URL` in the new worktree.
</Admonition>

## In Action: Running AI Agents in Parallel

<Admonition type="note" title="Works with any AI agent">
This workflow is not specific to Claude Code. Since the Git hook operates at the file system level, it will work with any AI coding agent that can use a Git worktree as its workspace.
</Admonition>

Modern AI tools like [Claude Code](https://code.claude.com/docs/en/common-workflows#run-parallel-claude-code-sessions-with-git-worktrees) already have built-in support for Git worktrees, making this workflow incredibly seamless.

Suppose you are working in your main directory, but you want to delegate a new authentication feature to an AI agent running in the background. You simply run:

```bash
claude --worktree feature-auth
```

This command does the following:

1.  Claude Code provisions a new Git worktree folder named `feature-auth` inside `.claude/worktrees/`.
2.  The `post-checkout` hook intercepts the event.
3.  The hook duplicates your `.env` into the new `feature-auth` directory.
4.  Neon instantly creates an isolated database branch named `worktree-feature-auth`.
5.  The hook updates `DATABASE_URL` in your new worktree.
6.  Claude Code spins up in the new directory, fully isolated.

Because the `DATABASE_URL` is pre-configured, the agent can immediately begin writing code, running migrations, and executing tests against its own private database.

Meanwhile, back in your main terminal, you are free to launch another agent:

```bash
claude --worktree feature-billing
```

You now have multiple AI agents working in parallel isolated file systems, isolated databases building features simultaneously without a single collision.

<Admonition type="note" title="Claude code specific hooks">
Claude Code provides custom hooks for Git worktree creation and removal. If you need precise control for example, deciding exactly when Neon branch provisioning should occur you can use these instead of a standard Git post-checkout hook. And if you’re working with another version control system like Mercurial or SVN, you should use the Claude Code hooks to achieve similar functionality. Learn more about Claude Code’s hooks in their [documentation](https://code.claude.com/docs/en/hooks#worktreecreate).
</Admonition>

You can now run as many agents as your coding plan allows, all in parallel without interfering with one another. Each agent operates in its own workspace with its own database branch, so you’re free to run destructive tests and migrations without worrying about breaking other agents’ work.

## Merging Changes and Resolving Conflicts

Once an agent finishes its task, you’ll have a feature branch (e.g., `feature-auth`) with new commits and a corresponding Neon database branch. The next step is to merge that work back into `main`.

### Merging Manualy

You can merge the worktree's branch just like any standard Git branch. From your main terminal:

```bash
git merge feature-auth
```

If the agent’s work is perfect, the merge will be fast-forward or a clean merge. You can then delete the worktree and the database branch:

```bash
git worktree remove feature-auth
neon branches delete feature-auth
```

> You can also automate this cleanup with a similar Git hook that triggers on branch deletion or after a successful merge. Just ask your AI agent to write a similar Git hook that listens for branch deletions and automatically removes the corresponding Neon branch.

### Handling conflicts

If multiple agents modified the same files, you might encounter merge conflicts. Because worktrees share the same `.git` history, standard conflict resolution tools apply. Isolate the conflict, fix it in your main branch (or the feature branch), and complete the merge.

If you want to stay entirely in the flow ("vibe coding"), you don't even need to switch contexts to merge. You can ask Claude to handle the housekeeping for you.

For example, you can tell your main agent:

> "The agent in `feature-auth` is done. Please merge its branch into main, resolve any simple conflicts, and clean up the worktree and database branch."

Claude will then execute the necessary Git commands and resolve conflicts based on your instructions, allowing you to stay focused on the high-level development process without getting bogged down in manual Git operations.

## Conclusion

By combining Git worktrees with Neon's instant database branching, you eliminate the biggest bottlenecks to scaling AI-assisted development. You no longer need to wait for one agent to finish before starting another, nor do you need to manage heavy local Docker containers for isolation.

With a simple Git hook, infrastructure provisioning becomes an invisible part of your workflow. Just assign the branch, and let the agents build.

## Resources

- [Neon Database Branching](/branching)
- [Automating Neon branch creation with Githooks](/blog/automating-neon-branch-creation-with-githooks)
- [Git Worktrees Documentation](https://git-scm.com/docs/git-worktree)
- [Claude Code Documentation](https://code.claude.com/docs)
