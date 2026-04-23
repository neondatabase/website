---
title: 'Building Durable AI Agents with Pydantic AI, DBOS, and Neon'
subtitle: 'Learn how to build resilient, fault-tolerant AI agents that automatically recover from crashes and API failures using Pydantic AI, DBOS, and Neon Postgres.'
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2026-04-22T00:00:00.000Z'
updatedOn: '2026-04-22T00:00:00.000Z'
---

AI agents are evolving beyond simple chat interfaces. Today’s systems can research topics, orchestrate APIs, and coordinate multi‑step workflows that resemble full applications rather than single prompts. This shift opens the door to agents that handle increasingly complex tasks in production environments.

With that complexity comes fragility. Multi‑step agents depend on a chain of external services: LLM APIs that may time out, tools that return malformed data, or network connections that fail mid‑execution. If an agent crashes halfway through a ten‑step workflow, the default behavior is unforgiving: progress is lost, tokens are wasted, and the process must restart from the beginning.

Running agents in production therefore requires **durable execution**. Instead of treating each run as disposable, agents need a way to persist state, recover from interruptions, and resume work without duplication.

This guide shows how to build a fault‑tolerant agent using [**Pydantic AI**](https://pydantic.dev/pydantic-ai) for agent orchestration, [**DBOS**](https://www.dbos.dev/) for durable execution, and [**Neon**](https://neon.com) as the Postgres backend to store execution state. By the end, you’ll have an AI agent that can survive crashes, rate limits, and network failures resuming exactly where it left off and completing tasks reliably.

## Architecture overview

A durable AI agent requires three core components working together seamlessly: a framework to define and orchestrate the agent’s logic, a durable execution layer to manage state and recovery, and a persistent database to store checkpoints. Here’s how Pydantic AI, DBOS, and Neon fit together:

- **Pydantic AI**  
  Built by the team behind [Pydantic](https://pydantic.dev/), Pydantic AI is a modern agent framework that brings type safety, modularity, and structure to LLM applications. Inputs and outputs are defined as models, ensuring predictable behavior, easier debugging, and seamless orchestration of tool calls and structured responses.

- **DBOS**  
  DBOS is an open-source durable execution SDK that makes workflows fault-tolerant by automatically checkpointing progress to a database. If a crash, retry, or timeout occurs, DBOS resumes execution from the last completed step instead of starting over, helping ensure reliable, “exactly-once” behavior at the workflow level.

  Pydantic AI has [native support for DBOS](https://pydantic.dev/docs/ai/integrations/durable_execution/dbos/), so you can annotate your agent logic with durable workflows directly. This allows you to build agents that automatically recover from failures without needing to write complex retry logic or state management code.

- **Neon Postgres**  
  DBOS relies on Postgres, and Neon delivers a serverless, elastic version ideal for AI workloads. Compute and storage are separated, scaling is automatic, and idle databases scale down to zero. This elasticity ensures efficient checkpointing for long‑running agents without over‑provisioning.

## Prerequisites

Before you begin, ensure you have the following:

- **Python 3.10+** installed locally. Follow the official [Python installation guide](https://www.python.org/downloads/) if you need to set this up.
- **Neon account:** A Neon account to create a Postgres database for DBOS. Sign up at [console.neon.tech](https://console.neon.tech) to get started.
- **OpenRouter API Key:** (Or OpenAI/Anthropic API key) to use as your LLM provider. Sign up at [OpenRouter](https://openrouter.ai/) and create an API key.

<Steps>

## Create a Neon project

You need a Neon Postgres database to store DBOS execution state:

1. Log in to the [Neon Console](https://console.neon.tech) and create a new project.
2. Navigate to your Project dashboard and click on the **Connect** button to view your connection details.
   ![Connection details in Neon Console](/docs/connect/connection_details.png)
3. Copy the Postgres connection string, it should look something like this:

   ```text
   postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/postgres?sslmode=require&channel_binding=require
   ```

   Use this connection string in [Configure environment variables](#configure-environment-variables) step below.

## Create a Python environment and install dependencies

Create a new directory for your project, set up a virtual environment, and install the required packages. Run the following commands in your terminal:

<CodeTabs labels={["pip", "uv"]}>

```bash
mkdir pydantic-ai-dbos-neon && cd pydantic-ai-dbos-neon
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate

pip install pydantic-ai "pydantic-ai[dbos]" python-dotenv
```

```bash
mkdir pydantic-ai-dbos-neon && cd pydantic-ai-dbos-neon
uv init
uv venv

uv add pydantic-ai "pydantic-ai[dbos]" python-dotenv
```

</CodeTabs>

## Configure environment variables

Create a `.env` file in the root of your project and add the following environment variables, replacing the placeholders with your actual OpenRouter API key and Neon database URL:

```env
OPENROUTER_API_KEY="sk-xxxx"
NEON_DATABASE_URL="your_neon_connection_string_here"
```

<Admonition type="note" title="Using OpenAI or Anthropic APIs?">
If you are using different LLM providers, set the appropriate environment variables, e.g., `OPENAI_API_KEY` for OpenAI or `ANTHROPIC_API_KEY` for Anthropic, and adjust the agent configuration accordingly in the code. Learn more about configuring LLM providers in the [Pydantic AI documentation](https://pydantic.dev/docs/ai/models/overview/).
</Admonition>

## Build the Durable Agent

For this example, you will build a simple financial research agent that gathers information about a company using two tools:

1. `fetch_company_overview`: A reliable tool that gets general company info.
2. `fetch_financial_metrics`: A "flaky" tool that simulates a fragile API by randomly throwing errors.

By using two tools, you can clearly see the power of durable execution. If the second tool crashes, DBOS will recover the agent _without_ needing to re-run the first tool or re-ask the LLM for the initial tool calls.

<Admonition type="important" title="Example tools are intentionally simplified">
The tools in this guide are intentionally illustrative. They are designed to make durability behavior obvious, not to represent a complete production integration.

In a real agent, your tools usually call external systems such as search APIs, internal knowledge services, CRMs, ticketing systems, weather APIs, payments, or other business endpoints. Those systems can fail in many ways: timeouts, rate limits, malformed responses, dependency outages, and host interruptions.

This example simulates those real conditions with a "reliable" tool and a "flaky" tool so you can clearly observe DBOS recovery behavior. Adapt the tool layer to your actual business use case, but keep the same durability pattern: checkpoint each side-effecting or expensive step, retry transient failures, and recover cleanly if the process host goes down.
</Admonition>

Create a file named `agent.py` and add the following code:

```python
import os
import asyncio
import random
from dotenv import load_dotenv

from dbos import DBOS, DBOSConfig, SetWorkflowID
from pydantic_ai import Agent, RunContext
from pydantic_ai.durable_exec.dbos import DBOSAgent

# 1. Load environment variables
load_dotenv()

# 2. Configure DBOS to use Neon Postgres
dbos_config: DBOSConfig = {
    "name": "neon-research-agent",
    "system_database_url": os.environ.get("NEON_DATABASE_URL"),
}
DBOS(config=dbos_config)

# 3. Initialize the Pydantic AI Agent
base_agent = Agent(
    model="openrouter:openai/gpt-5.4-mini",
    name="Financial Research Agent",
    system_prompt=(
        "You are an expert financial analyst. To write your report, you MUST "
        "use both the `fetch_company_overview` and `fetch_financial_metrics` tools. "
        "Gather the data from both, then write a concise summary."
    ),
    retries=3,
)

# 4. Wrap the agent with DBOS for Durable Execution
durable_agent = DBOSAgent(base_agent)

# 5. Define Tool 1: Reliable API call
# Wrapped in @DBOS.step so its result is durably checkpointed in Neon.
@base_agent.tool
@DBOS.step()
async def fetch_company_overview(ctx: RunContext, company_name: str) -> str:
    """Fetch general overview data for a company."""
    print(f"🏢 [Tool 1] Fetching overview for {company_name}...")
    await asyncio.sleep(1) # Simulate API latency
    print(f"✅ [Tool 1] Overview fetched successfully.")
    return f"{company_name} is a leading technology company founded in 2010."

# 6. Define Tool 2: Flaky API call with delay
@base_agent.tool
@DBOS.step(retries_allowed=True, max_attempts=10, backoff_rate=2.0)
async def fetch_financial_metrics(ctx: RunContext, company_name: str) -> str:
    """Fetch complex financial metrics. This API is known to be unstable."""
    print(f"📊 [Tool 2] Fetching financial metrics for {company_name}...")

    # Simulate a flaky API or network connection (70% chance to fail)
    if random.random() < 0.7:
        print("❌ [Tool 2] Network error! The financial API crashed.")
        raise ConnectionError("Simulated network failure.")

    print("✅ [Tool 2] Financial metrics fetched successfully.")
    return f"{company_name} reported a Q3 revenue of $4.2 Billion with a 15% profit margin."

# 7. Define the main entry point
async def main():
    # Launch DBOS to ensure database connections are ready
    DBOS.launch()

    print("🚀 Starting durable agent run...")

    # Run the agent using a deterministic Workflow ID for idempotency.
    # If the app crashes and restarts, it will reconnect to this exact run.
    with SetWorkflowID("quantum-research-run-001"):
        result = await durable_agent.run('Research the company "Quantum Compute Corp".')

    print("\n📝 Final Report:")
    print(result.output)

if __name__ == "__main__":
    asyncio.run(main())
```

<Admonition type="tip" title="How to generate a deterministic workflow ID">
In production, avoid hardcoding IDs like `quantum-research-run-001`. Instead, derive a deterministic ID from stable business inputs by hashing them, for example: `tenant_id + user_id + request_type + normalized_prompt + date_bucket`.

Use any standard hash function such as SHA-256. The key requirement is determinism: the same logical request should always produce the same workflow ID, no matter whether it runs on your laptop, an EC2, a container, or AWS Lambda.

This gives you consistent idempotency keys across environments and prevents duplicate workflow execution for retried or replayed requests.
</Admonition>

### Breaking down the code

The above code sets up a durable agent with Pydantic AI and DBOS. Here are the key components and how they work together:

- **The tools are simple on purpose**: `fetch_company_overview` and `fetch_financial_metrics` are demo tools, not production research tools. They keep the example easy to follow so you can clearly see how recovery works. In a real app, replace them with tools that call your own APIs and data sources.
- **`DBOSConfig` defines the Neon connection**: The `system_database_url` points DBOS to your Neon Postgres instance where it will store workflow state and checkpoints.
- **`DBOSAgent(base_agent)` makes the run durable**: Wrapping the Pydantic AI agent with `DBOSAgent` means that any call to `durable_agent.run()` is now a durable workflow. DBOS will automatically checkpoint progress to Neon and recover from crashes.
- **`@DBOS.step()` checkpoints tool execution**: Most external I/O happens inside tools. Marking tools as steps means successful results are persisted, so completed calls are reused after a crash instead of re-executed.
- **Retry settings handle transient failures**: `retries_allowed=True` with `max_attempts` and `backoff_rate` tells DBOS to retry a failing step with backoff. This helps with temporary issues like API timeouts or short outages. Update these settings based on the expected failure modes of your tools.

Extend this pattern to your actual agent logic, adding as many tools and steps as needed. The key is that any step that has side effects or is expensive should be checkpointed with `@DBOS.step()`, and any step that can fail transiently should have retries enabled.

## Test a transient failure

Run the script to see how the agent handles a transient failure in `Tool 2`:

```bash
python agent.py
```

Watch the terminal output closely. Because the `fetch_financial_metrics` tool is designed to fail 70% of the time, you will likely see a failure on the first attempt (if not, just run it again until you do):

```text
🚀 Starting durable agent run...
🏢 [Tool 1] Fetching overview for Quantum Compute Corp...
✅ [Tool 1] Overview fetched successfully.
📊 [Tool 2] Fetching financial metrics for Quantum Compute Corp...
❌ [Tool 2] Network error! The financial API crashed.
06:30:09 [ WARNING] (dbos:_core.py:1547) Step being automatically retried (attempt 1 of 10)

# other DBOS retry logs...
📊 [Tool 2] Fetching financial metrics for Quantum Compute Corp...
✅ [Tool 2] Financial metrics fetched successfully.

📝 Final Report:
Based on my research of Quantum Compute Corp, here's what I found...
```

Notice how the agent recovered. When `Tool 2` failed, the agent didn't crash, nor did it restart from the beginning. DBOS intercepted the error, waited, and re-executed _only_ the failed step.

Since `Tool 1` had already completed successfully, its result was cached durably in Neon. The agent didn't need to call it again, saving time and tokens. The final report was generated after `Tool 2` succeeded, demonstrating that the agent can handle transient issues gracefully.

## Test a hard crash and durable recovery

Automatic retries are great for transient network errors, but what if the actual server or container running your agent runs out of memory, is preempted, or crashes completely?

<Admonition type="important" title="Change the Workflow ID">
Before testing a hard crash, change the workflow ID in the code to simulate a new run. 
For example, update `SetWorkflowID("quantum-research-run-001")` to `SetWorkflowID("quantum-research-run-002")`. Using the same ID would simulate a replay of the same workflow and return the cached result.
</Admonition>

You can simulate this by running the script again, and while `Tool 2` is struggling and retrying, press `Ctrl + C` to kill the process completely:

```bash
python agent.py
```

```text
🚀 Starting durable agent run...
🏢 [Tool 1] Fetching overview for Quantum Compute Corp...
✅ [Tool 1] Overview fetched successfully.
📊 [Tool 2] Fetching financial metrics for Quantum Compute Corp...
❌ [Tool 2] Network error! The financial API crashed.
06:30:09 [ WARNING] (dbos:_core.py:1547) Step being automatically retried (attempt 1 of 10)
^C
06:30:10 [ WARNING] Asyncio task cancelled...
KeyboardInterrupt
```

The agent is dead. In a traditional setup, the work done by `Tool 1` is lost, and you've wasted the LLM tokens used to plan the tool calls.

Now, simply start the script again:

```bash
python agent.py
```

Look at the logs this time:

```text
06:32:44 [    INFO] (dbos:_dbos.py:455) Initializing DBOS (v2.19.0)
...
06:33:01 [    INFO] (dbos:_dbos.py:604) Recovering 1 workflows from application version ebc2e36ebc584c6628494a7a8198404a
...
🚀 Starting durable agent run...
📊 [Tool 2] Fetching financial metrics for Quantum Compute Corp...
✅ [Tool 2] Financial metrics fetched successfully.

📝 Final Report:
Based on my research of Quantum Compute Corp...
```

**Notice what didn't happen.** The agent did _not_ invoke `Tool 1` again!

When DBOS started up, it scanned your Neon database and found the interrupted workflow (`Recovering 1 workflows...`). It read the checkpointed state, saw that `Tool 1` had already completed successfully prior to the crash, and immediately picked up right where it left off at `Tool 2`.

This is incredibly useful. It guarantees that expensive, slow, or side-effect-heavy steps are executed exactly once, regardless of crashes, host failures, or other interruptions. Your agent can now survive real-world production conditions without losing progress or wasting resources.

## Run the same workflow ID again (idempotent replay)

There is another major benefit of deterministic workflow IDs: if you run the same request again with the exact same workflow ID, DBOS treats it as the same workflow execution.

Because the completed result is already checkpointed in Neon, DBOS returns the stored output directly. It does not invoke tools again, does not repeat LLM planning, and responds immediately.

That means if a client retries the same request due to network issues or duplicate delivery, you avoid double invocation, duplicate side effects, and unnecessary token spend.

If your first run completed successfully, a second run with the same ID should look like this in practice:

```text
🚀 Starting durable agent run...

📝 Final Report:
Based on my research of Quantum Compute Corp...
```

Notice that there are no fresh tool logs such as `Fetching overview...` or `Fetching financial metrics...` because DBOS returned the persisted result for that workflow ID.

</Steps>

## Why this architecture matters for production

Wiring AI agents into production software is inherently difficult because agents are dynamic. Standard scripts execute predictably, but agents make decisions on the fly, loop unpredictably, and rely on third-party APIs that frequently rate-limit or fail.

By composing Pydantic AI, DBOS, and Neon, you get several immediate benefits:

1. **Zero wasted tokens and API calls on crashes**: If your agent successfully executes 4 out of 5 expensive tools, and the host machine crashes during the 5th, restarting the agent won't re-run the first 4 tools. DBOS fetches their results instantly from Neon, saving you from re-spending tokens on LLM calls and re-executing third-party APIs.
2. **Serverless economics**: AI agent workloads are notoriously spiky. You might run a swarm of 100 parallel research tasks in one minute, and then zero for the next hour. Neon’s scale-to-zero capabilities mean you aren't paying for idle database compute when your agents aren't running.

## Conclusion

You have successfully built an AI agent that is resilient to both transient API failures and hard process crashes. By combining Pydantic AI's structured agent framework with DBOS's durable execution capabilities and Neon's elastic Postgres, you can ensure that your agents complete their tasks reliably in real-world production environments. This architecture allows you to focus on building powerful agent logic and integrations, while DBOS and Neon handle the complexities of state management, recovery, and scalability.

## Resources

- [Pydantic AI Documentation](https://pydantic.dev/docs/ai/overview/)
- [DBOS Durable Execution Framework](https://docs.dbos.dev/)
- [Neon Documentation](/docs)

<NeedHelp />
