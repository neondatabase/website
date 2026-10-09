---
title: 'Build replayable AI agents with Neon snapshots'
subtitle: 'Learn how to build AI agents that can checkpoint execution, replay failed runs, and restore previous state using Neon snapshots and the OpenAI Agents SDK.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-05-21T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

Most AI agents today are effectively black boxes.

They call tools, mutate state, update databases, and make decisions. But once something goes wrong, there’s often no reliable way to inspect, replay, or recover execution. Logging prompts alone isn’t enough when your agent is actively changing application state. If an agent drops a table, corrupts data, or cascades into an infinite loop of bad tool calls, you cannot simply retry the prompt. You must fix the data first.

In this guide, you'll build a **replayable AI agent** using the [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) and Neon’s [Snapshots API](/docs/reference/api/snapshots/create-snapshot). You'll implement the core primitives needed for:

- Execution checkpoints
- Suspend and resume flows
- Replayable runs and state restoration
- Time-travel debugging

The idea: **pair your agent's execution state with durable database state**. Every time the agent reaches a point you might want to return to, take a Neon snapshot and serialize the agent's memory. If a failure occurs, you can restore the database and resume the agent from the same logical point.

## Architecture overview

Making an agent replayable requires capturing two pieces of state at the moment of interruption:

1. **Agent state**: The conversation history, tool calls, and execution graph. The OpenAI Agents SDK provides this via the [`RunState`](https://openai.github.io/openai-agents-python/ref/run_state/) object, which can be serialized to JSON and resumed after a [human-in-the-loop](https://openai.github.io/openai-agents-python/human_in_the_loop/) interruption.
2. **Database state**: The schema and data at the moment of the pause. Neon handles this with copy-on-write **snapshots**, which are created instantly without copying the data.

### What are Neon snapshots?

A [snapshot](/docs/reference/glossary#snapshot) in Neon is a read-only, point-in-time copy of a root branch's schema and data. A branch gives you an isolated environment with its own connection string. A snapshot is for versioning and recovery.

When you call Neon's Restore API, you can restore a snapshot directly to your active branch. This in-place restore replaces the corrupted data while preserving the original database connection string. For an AI application, this means you don't need to restart or reconfigure the app after rolling back: the agent can resume execution against the restored database.

By tying the agent's memory and the database snapshot together, you create a **checkpoint**. If the agent makes a destructive mistake, you can revert the database, load the `RunState` JSON, reject the bad decision, and let the agent choose a different path.

## Prerequisites

To follow this guide, you will need:

- **Python 3.10+** installed locally.
- **Neon account:** Sign up at [console.neon.tech](https://console.neon.tech/signup) if you don't already have an account. The Free plan allows 1 manual snapshot, so delete the demo snapshot before you run the checkpoint script a second time. Paid plans allow 100 ([Backup & restore](/docs/guides/backup-restore)).
- **OpenAI API key:** Required for use with the OpenAI Agents SDK. You can generate one in the [OpenAI dashboard](https://platform.openai.com/api-keys). Alternatively, you can use any LLM provider supported by the Agents SDK such as [OpenRouter](https://openrouter.ai/).

<Steps>

## Create a Neon project and get credentials

You need a Lakebase Postgres database for the demo application, plus a Neon API key to programmatically create snapshots and restorations.

1. Log in to the [Neon Console](https://console.neon.tech/app/projects).
2. Switch to your organization and go to **Settings** > **API keys**.
3. Create a new API key, give it a name such as "Replayable agent demo", and copy the generated key. You will use this as `NEON_API_KEY` in your application.
   ![Create Neon API Key](/docs/manage/org_api_keys.png)
4. Go back to the Projects page and create a new project. You can choose any name and region.
5. Click **Connect** in the Console nav and copy the connection string. You will use this as the `DATABASE_URL` in your application.

   ![Connection details in Neon Console](/docs/connect/connect_to_branch_modal.png)

6. Go to **Settings** > **General** to copy the **Project ID**. You will use this as `NEON_PROJECT_ID` in your application.

   ![Neon project Settings page](/docs/manage/settings_page.png)

7. Go to **Branches**, select your default branch, and copy the **Branch ID**. You will use this as `NEON_BRANCH_ID` in your application.

   ![Neon Console Branch ID](/docs/guides/neon-console-branch-id.png)

## Set up the Python environment

Create a new directory for your project and set up a Python virtual environment:

```bash
mkdir replayable-agent-demo && cd replayable-agent-demo
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

pip install openai-agents httpx "psycopg[binary]" python-dotenv
```

Create a `.env` file in the root of your project and add your API keys, Neon project ID, branch ID, and database URL:

```env
OPENAI_API_KEY="sk-proj-..."
NEON_API_KEY="your-neon-api-key"
NEON_PROJECT_ID="your-project-id"
NEON_BRANCH_ID="br-..."  # The ID of your project's default branch
DATABASE_URL="postgres://..."  # Your Neon connection string
```

## Implement the Neon snapshot helpers

You need a way to programmatically interact with Neon's API to take and restore snapshots.

Create a file named `neon_helpers.py`:

```python
import os
import time
import httpx
from dotenv import load_dotenv

load_dotenv()

NEON_API_KEY = os.getenv("NEON_API_KEY")
PROJECT_ID = os.getenv("NEON_PROJECT_ID")
BRANCH_ID = os.getenv("NEON_BRANCH_ID")

HEADERS = {
    "Authorization": f"Bearer {NEON_API_KEY}",
    "Content-Type": "application/json",
    "Accept": "application/json",
}

BASE_URL = f"https://console.neon.tech/api/v2/projects/{PROJECT_ID}"


def create_snapshot(name: str) -> str:
    """Create a Neon snapshot and return its ID."""
    print(f"📸 Taking database snapshot: {name}...")
    url = f"{BASE_URL}/branches/{BRANCH_ID}/snapshot"

    with httpx.Client() as client:
        response = client.post(url, headers=HEADERS, params={"name": name})
        response.raise_for_status()

        snapshot_id = response.json()["snapshot"]["id"]
        print(f"✅ Snapshot created: {snapshot_id}")
        return snapshot_id


def restore_snapshot(snapshot_id: str) -> None:
    """Restore a snapshot to the active branch and wait for completion."""
    print(f"⏪ Restoring database to snapshot {snapshot_id}...")
    url = f"{BASE_URL}/snapshots/{snapshot_id}/restore"

    # finalize_restore keeps the connection string stable after restore.
    payload = {
        "target_branch_id": BRANCH_ID,
        "finalize_restore": True,
    }

    with httpx.Client() as client:
        response = client.post(url, headers=HEADERS, json=payload)
        response.raise_for_status()

        operations = response.json().get("operations", [])
        for op in operations:
            _wait_for_operation(op["id"])

    print("✅ Database restore complete!")
    print(
        "ℹ️  After a finalized restore, fetch and store the new active branch ID "
        "before creating more snapshots."
    )


def _wait_for_operation(operation_id: str):
    """Poll the operations API until the task is complete."""
    url = f"{BASE_URL}/operations/{operation_id}"
    with httpx.Client() as client:
        while True:
            res = client.get(url, headers=HEADERS)
            res.raise_for_status()
            status = res.json()["operation"]["status"]

            if status in ["finished", "skipped", "cancelled"]:
                break
            if status == "failed":
                raise Exception("Neon operation failed.")

            time.sleep(1)
```

<Admonition type="note" title="Branch IDs after restore">
When `finalize_restore` is `True`, Neon preserves your connection string by moving the compute endpoint to the restored branch. The connection string stays stable, but the active branch ID changes. This simple helper is enough for this demo; in production, store the new active branch ID after restore before creating the next snapshot (from the branch ID in the Restore API response). See [Restore snapshot](/docs/reference/api/snapshots/restore-snapshot) in the Neon API reference for details.
</Admonition>

## Define the agent and tools

You’ll create a **Database Admin agent** that serves as the administrator for a Postgres database. Whenever the agent attempts a sensitive operation, such as dropping a table, it pauses. At that point, you’ll trigger a Neon snapshot and preserve the agent’s memory state.

<Admonition type="note" title="Use your own agents">  
The agent and tools in this guide are intentionally kept simple to highlight the basics of replayability. In a real application, your agents and tools will be more complex, and you wouldn’t typically provide one with the ability to drop an entire table. What matters is identifying the points in your agent's workflow where you want checkpoints for replay and recovery.
</Admonition>

Create a file named `agent.py`:

<CodeTabs labels={["OpenAI API", "OpenRouter API"]}>

```python
import os
import psycopg
from agents import Agent, function_tool
from dotenv import load_dotenv

load_dotenv()
DB_URL = os.getenv("DATABASE_URL", "")


def setup_db():
    """Create and seed the demo users table."""
    with psycopg.connect(DB_URL) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT);"
            )
            cur.execute("TRUNCATE users;")
            cur.execute("INSERT INTO users (name) VALUES ('Alice'), ('Bob');")
        conn.commit()


def get_current_users() -> str:
    """Return the current users from the database."""
    try:
        with psycopg.connect(DB_URL) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT name FROM users;")
                users = [row[0] for row in cur.fetchall()]
        return f"Current users: {', '.join(users)}"
    except psycopg.errors.UndefinedTable:
        return "Error: The users table does not exist."


@function_tool
def add_user(name: str) -> str:
    """Add a new user to the database."""
    with psycopg.connect(DB_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("INSERT INTO users (name) VALUES (%s)", (name,))
        conn.commit()
    return f"User {name} added successfully."


@function_tool(needs_approval=True)
def drop_users_table() -> str:
    """Drop the entire users table. REQUIRES APPROVAL."""
    with psycopg.connect(DB_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("DROP TABLE users;")
        conn.commit()
    return "Users table dropped."


@function_tool
def list_users() -> str:
    """List all current users in the database."""
    return get_current_users()


admin_agent = Agent(
    name="DB Admin",
    instructions=(
        "You are a database administrator. You manage the 'users' table. "
        "Use your tools to answer user requests. Verify the database state after making changes."
    ),
    tools=[add_user, drop_users_table, list_users],
    model="gpt-5-mini"
)
```

```python
import os
from openai import AsyncOpenAI
import psycopg
from agents import (
    Agent,
    OpenAIChatCompletionsModel,
    function_tool,
    set_tracing_disabled,
)
from dotenv import load_dotenv

load_dotenv()
DB_URL = os.getenv("DATABASE_URL", "")

set_tracing_disabled(disabled=True)


def setup_db():
    """Create and seed the demo users table."""
    with psycopg.connect(DB_URL) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT);"
            )
            cur.execute("TRUNCATE users;")
            cur.execute("INSERT INTO users (name) VALUES ('Alice'), ('Bob');")
        conn.commit()


def get_current_users() -> str:
    """Return the current users from the database."""
    try:
        with psycopg.connect(DB_URL) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT name FROM users;")
                users = [row[0] for row in cur.fetchall()]
        return f"Current users: {', '.join(users)}"
    except psycopg.errors.UndefinedTable:
        return "Error: The users table does not exist."


@function_tool
def add_user(name: str) -> str:
    """Add a new user to the database."""
    with psycopg.connect(DB_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("INSERT INTO users (name) VALUES (%s)", (name,))
        conn.commit()
    return f"User {name} added successfully."


@function_tool(needs_approval=True)
def drop_users_table() -> str:
    """Drop the entire users table. REQUIRES APPROVAL."""
    with psycopg.connect(DB_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("DROP TABLE users;")
        conn.commit()
    return "Users table dropped."


@function_tool
def list_users() -> str:
    """List all current users in the database."""
    return get_current_users()


client = AsyncOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"), base_url=os.getenv("OPENAI_BASE_URL")
)
model = OpenAIChatCompletionsModel(model="openai/gpt-5-mini", openai_client=client)

admin_agent = Agent(
    name="DB Admin",
    instructions=(
        "You are a database administrator. You manage the 'users' table. "
        "Use your tools to answer user requests. Verify the database state after making changes."
    ),
    tools=[add_user, drop_users_table, list_users],
    model=model,
)
```

</CodeTabs>

## Create checkpoints on interruption

Now wire everything together. If the agent hits an interruption for the `drop_users_table` tool, serialize the `RunState` and take a Neon snapshot before approving the action. Together, those two records become a replay checkpoint: the exact agent state and database state needed to revisit the run later.

Create `run.py`:

```python
import asyncio
import json
from pathlib import Path
from agents import Runner
from agent import admin_agent, setup_db
from neon_helpers import create_snapshot

CHECKPOINT_FILE = Path("checkpoint.json")


async def main():
    # 1. Reset the database to the starting state
    setup_db()
    print("🚀 Database initialized. Starting agent...")

    prompt = "Add Charlie to the database, then drop the users table entirely."
    print(f"\nUser: {prompt}\n")

    # 2. Run the agent
    result = await Runner.run(admin_agent, prompt)

    # 3. Handle interruptions by creating checkpoints
    while result.interruptions:
        print("\n⏸️ Agent paused for approval.")

        # Take a database snapshot before approving the destructive action.
        snap_id = create_snapshot(name="pre_drop_table")

        # Serialize the agent run state.
        agent_state = result.to_state()
        state_json = agent_state.to_json()

        # Save the snapshot ID and agent state JSON to a checkpoint file.
        with open(CHECKPOINT_FILE, "w") as f:
            json.dump({"snapshot_id": snap_id, "agent_state": state_json}, f, indent=2)

        print(f"💾 Checkpoint saved to {CHECKPOINT_FILE}")

        # Approve the tool and continue execution.
        for interruption in result.interruptions:
            print(f"⚠️ Approving tool: {interruption.name}...")
            agent_state.approve(interruption)

        result = await Runner.run(admin_agent, agent_state)

    print("\n🏁 Final Output:")
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```

Run the script:

```bash
python run.py
```

The output will show the agent adding "Charlie", pausing before the destructive tool call, taking a snapshot, saving `checkpoint.json`, dropping the table, and reporting success.

```text
🚀 Database initialized. Starting agent...

User: Add Charlie to the database, then drop the users table entirely.

⏸️ Agent paused for approval.
📸 Taking database snapshot: pre_drop_table...
✅ Snapshot created: snap-fragrant-pine-ap8212hy
💾 Checkpoint saved to checkpoint.json
⚠️ Approving tool: drop_users_table...

🏁 Final Output:
I added Charlie, dropped the users table, and then verified the result. The users table no longer exists (listing users now returns an error saying the table does not exist).
```

The database table is now dropped, but the checkpoint points to the database and agent state from immediately before the destructive action. That is the replay boundary: you can return to this exact moment and choose a different path.

## Replay from the checkpoint

Because you saved both the Neon `snapshot_id` and the OpenAI `RunState`, you can replay the run from the checkpoint. Restore the database, reload the agent's memory, reject the bad tool call, and ask the agent to take a different path.

Create `recover.py`:

```python
import asyncio
import json
from pathlib import Path
from agents import Runner, RunState
from agent import admin_agent, get_current_users
from neon_helpers import restore_snapshot

CHECKPOINT_FILE = Path("checkpoint.json")


async def main():
    if not CHECKPOINT_FILE.exists():
        print("No checkpoint found.")
        return

    # 1. Load the checkpoint
    with open(CHECKPOINT_FILE, "r") as f:
        data = json.load(f)

    snapshot_id = data["snapshot_id"]
    agent_state_json = data["agent_state"]

    print("🔄 Initiating checkpoint recovery...")

    # 2. Restore database state via Neon.
    restore_snapshot(snapshot_id)

    # Verify the database state is back to pre-drop-table.
    print(get_current_users())  # Prints: Current users: Alice, Bob, Charlie

    # 3. Restore agent state via the OpenAI Agents SDK.
    agent_state = await RunState.from_json(admin_agent, agent_state_json)

    # 4. Reject the destructive tool call and give the agent new instructions.
    for interruption in agent_state.get_interruptions():
        print(f"\n❌ Rejecting previously planned tool: {interruption.name}")
        agent_state.reject(
            interruption,
            rejection_message="Action denied by admin. Do not drop the table. List the users instead and reply that it is against TOS to drop the table.",
        )

    # 5. Resume the agent from the checkpoint.
    print("\n▶️ Resuming agent execution...")
    result = await Runner.run(admin_agent, agent_state)

    print("\n🏁 New Final Output:")
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```

Run the recovery script:

```bash
python recover.py
```

```text
🔄 Initiating checkpoint recovery...
⏪ Restoring database to snapshot snap-fragrant-pine-ap8212hy...
✅ Database restore complete!

Current users: Alice, Bob, Charlie

❌ Rejecting previously planned tool: drop_users_table

▶️ Resuming agent execution...

🏁 New Final Output:
Charlie was added successfully.

I could not drop the users table - that action was denied (against TOS/policy), so the table remains intact.

Current users (verified): Alice, Bob, Charlie

If you want to remove data instead of dropping the entire table, I can:
- delete specific user accounts (e.g., remove Alice),
- anonymize or deactivate accounts,
- export the table contents for archival,
or
- escalate a drop-table request to an authorized admin (requires approval). Which would you like?
```

Notice what happens:

1. Neon restores the database in place. The data (`Alice`, `Bob`, and `Charlie`) is back.
2. Because you used `finalize_restore: True`, the connection string remains the same, so the Python application doesn't need to be restarted or reconfigured.
3. The agent resumes from the paused `RunState`, sees the custom rejection message, and chooses a different path. Instead of dropping the table, it lists the users and offers alternative actions.

</Steps>

## Benefits of this pattern

Pairing agent state with Neon snapshots addresses three common problems with agents that change data:

- **Recoverable state:** Standard retry logic fails if an agent has already mutated state. Neon snapshots let you restore the database to the checkpointed state.
- **Stable connections:** By using `target_branch_id` and `finalize_restore: True` in the Neon API, the compute endpoint for your database moves to the restored state. Your application connection string does not have to change.
- **Auditable AI:** By serializing the `RunState` alongside database checkpoints, you maintain an audit log of what an agent saw, planned, and executed.

The recovery flow above shows the immediate case. The same idea also works for older runs that you need to replay without touching production.

## Replay historical runs safely with branches

You demonstrated an immediate rollback by restoring the database in place using `finalize_restore: True`. But what happens if you discover a bad agent decision **10 days later**?

Imagine your agent processed a large financial reconciliation workflow 10 days ago. Today, you realize the agent's prompt had a subtle hallucination, and it categorized a batch of transactions incorrectly. You want to replay that exact execution from 10 days ago and fix it.

You cannot restore your production database in-place to 10 days ago. You would wipe out 10 days of real user activity.

Neon branches make historical replay safe:

1. **Create an isolated branch:** Instead of an in-place restore, use the Neon API to create a **new branch** from the 10-day-old snapshot. This creates an isolated, ephemeral clone of the database exactly as it was. Call the [Restore API](/docs/reference/api/snapshots/restore-snapshot) with `finalize_restore: False` (and optionally a `name` for the new branch). This restores the snapshot to a new branch and leaves production untouched.
2. **Load the historical agent:** You retrieve the agent's 10-day-old `RunState` JSON from your object store or metadata database and load it into memory.
3. **Inject the new connection string:** You pass the new, isolated branch's `DATABASE_URL` into the agent's environment.
4. **Replay and correct:** You reject the historical hallucination, provide the corrected prompt, and let the agent re-run the reconciliation in the isolated branch.
5. **Extract or merge:** Once the agent successfully completes the task in the isolated branch, write a script to extract the corrected transaction data and safely apply it to today's production database.

By combining serialized agent memory with copy-on-write database branches, you can treat your agent's actions like versioned changes: check out an old state, create a branch, fix the bug, and merge the results back deliberately.

## Scaling this workflow to production

The examples in this guide show the minimal components required for replayability: a Postgres database, a sample `users` table, and a local `checkpoint.json` file.

In practice, AI systems run inside an **agent harness** using an asynchronous, event-driven architecture. The core step that pairs an agent state with a Neon snapshot stays the same, but the surrounding infrastructure changes:

- **Cloud state persistence:** Instead of a local `checkpoint.json`, agent memory and execution graphs are stored in an object store like AWS S3 or in a JSONB column in a separate metadata database. Every `step_id` is durably linked to a Neon `snapshot_id`.
- **Asynchronous approvals:** Instead of a local script, an interruption triggers a webhook that sends a Slack message (or email) to a human reviewer. The agent process shuts down while waiting. When the reviewer clicks "Approve", an API endpoint wakes up the orchestrator, reloads the checkpoint, and resumes the agent.
- **Durable orchestration:** The `while result.interruptions:` loop is replaced by a durable execution framework like Temporal, [DBOS](/guides/pydantic-ai-dbos-neon), or AWS Step Functions. If a server crashes, the orchestrator restores the latest agent state and database snapshot on a new node.
- **Observability:** Every snapshot and agent state ID is injected as metadata into your LLM observability platform (e.g., LangSmith, Braintrust, Datadog). When looking at a trace of a failed tool call, you have a direct link to the exact database snapshot needed to debug it.

## Apply the pattern to other agent frameworks

This guide used the OpenAI Agents SDK, but pairing agent state with Neon snapshots works with any framework that can save and reload its execution state or memory. For example, [LangGraph persistence](https://docs.langchain.com/oss/python/langgraph/persistence) and the [LlamaIndex Workflow Checkpointer](https://developers.llamaindex.ai/python/examples/workflow/checkpointing_workflows/) both expose that state, and with raw API calls you manage it yourself. Take a Neon snapshot at the same points where you save that state.

## Resources

- [Neon snapshots API reference](/docs/reference/api/snapshots/create-snapshot)
- [OpenAI Agents SDK documentation](https://openai.github.io/openai-agents-python/)
- [Database versioning with snapshots](/docs/ai/ai-database-versioning)
- [Build Checkpoints For Your Agent Using Neon Snapshots](/blog/checkpoints-for-agents-with-neon-snapshots)
- [Promoting Postgres Changes Safely From Multiple Environments to Production](/blog/promoting-postgres-changes-safely-production)

<NeedHelp />
