---
title: 'Build your first AI Agent for Postgres on Azure'
subtitle: 'Learn how to build an AI Agent for Postgres using Azure AI Agent Service and Neon'
author: boburmirzo
enableTableOfContents: true
createdAt: '2025-04-07T00:00:00.000Z'
updatedOn: '2025-04-07T00:00:00.000Z'
---

AI agents are getting a lot of attention lately, but getting started can be confusing. You may have heard about tools like [LangChain/LangGraph](https://python.langchain.com/v0.1/docs/modules/agents/), [Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/overview/), [AutoGen](https://microsoft.github.io/autogen/), or [LlamaIndex](https://docs.llamaindex.ai/en/stable/use_cases/agents/). They are powerful, but sometimes all you need is something simple that works.

[**Azure AI Agent Service**](https://learn.microsoft.com/en-us/azure/ai-services/agents/overview) lets you build AI agents that can use your own tools, such as a function to read data from a Postgres database. It's designed to help developers get started fast, without needing to understand chains, graphs, or complex frameworks.

In this tutorial, you’ll learn how to create an AI agent that can answer questions about data in a **Postgres** database using **Azure AI Agent Service**.

## Sample Use Case

Imagine you run a SaaS product and track tenant-level usage data for billing (like API calls, storage, user sessions, etc.) in a Postgres table. You want an AI assistant to:

- Analyze recent usage for a tenant
- Spot spikes in usage (possible billing anomalies)
- Explain what happened in natural language

For example, when a user asks questions about their invoice, the AI can query Neon for relevant usage logs, summarize usage patterns, and offer explanations before routing to a human. Or when you open your billing dashboard, the agent proactively explains any spikes or changes:

> "Your API usage increased by 250% on April 3rd due to increased traffic from users in the EU region."

We’ll build an AI agent that connects to your Postgres database and uses a simple Python function to fetch and analyze the data.

We’ll use [**Neon Serverless Postgres**](/) as our database. It’s a fully managed, cloud-native Postgres that’s free to start, scales automatically, and works great for [AI agents](/use-cases/ai-agents) that need to query data on demand without managing infrastructure.

### Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services).
- Make sure you have the **Azure AI Developer** [RBAC role](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/rbac-azure-ai-foundry) assigned
- Install [Python 3.11.x](https://www.python.org/downloads/).

## Create a Neon Database on Azure

Open the [new Neon Resource page](https://portal.azure.com/#view/Azure_Marketplace_Neon/NeonCreateResource.ReactView) on the Azure portal, and it brings up the form to create a Neon Serverless Postgres Resource. Fill out the form with the required fields and deploy it.

### Obtain Neon Database Credentials

1. After the resource is created on Azure, go to the Neon Serverless Postgres Organization service and click on the Portal URL. This brings you to the Neon Console
2. Click “New Project”
3. Choose an Azure region
4. Give your project a name (e.g., “Postgres AI Agent”)
5. Click “Create Project”
6. Once the project is created successfully, copy the Neon connection string and note it down. You can find the connection details in the Connection Details widget on the Neon Dashboard.

```bash
    postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require
```

## Create an AI Foundry Project on Azure

Create a new hub and project in the Azure AI Foundry portal by [following the guide](https://learn.microsoft.com/en-us/azure/ai-services/agents/quickstart?pivots=ai-foundry-portal#create-a-hub-and-project-in-azure-ai-foundry-portal) in the Microsoft docs. You also need to [deploy a model](https://learn.microsoft.com/en-us/azure/ai-services/agents/quickstart?pivots=ai-foundry-portal#deploy-a-model) like GPT-4o.

You only need the **Project connection string** and **Model Deployment Name** from the Azure AI Foundry portal. You can also find your connection string in the **overview** for your project in the [**Azure AI Foundry portal**](https://ai.azure.com/), under **Project details** > **Project connection string**.

![Project connection string in Azure AI Foundry Portal](/docs/guides/azure-ai-agent-service/azure-ai-foundry-find-project-connection-string.png)

Once you have all three values on hand: **Neon connection string**, **Project connection string,** and **Model Deployment Name,** you are ready to set up the Python project to create an Agent.

All the code and sample data are available in this [GitHub repository](https://github.com/neondatabase-labs/neon-azure-ai-agent-service-get-started). You can clone or download the project.

## Project Environment Setup

Create a `.env` file with your credentials:

```bash
PROJECT_CONNECTION_STRING="<Your AI Foundry connection string>"
AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o"
NEON_DB_CONNECTION_STRING="<Your Neon connection string>"
```

Create and activate a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate  # on macOS/Linux
.venv\Scripts\activate    # on Windows
```

Install required Python libraries:

```
pip install -r requirements.txt
```

Example `requirements.txt`:

```bash
pandas
python-dotenv
sqlalchemy
psycopg2-binary
azure-ai-projects
azure-identity
```

## Load Sample Billing Usage Data

We will use a mock dataset for tenant usage, including computed percent change in API calls and storage usage in GB:

```
tenant_id   date        api_calls  storage_gb

tenant_456	2025-04-01	1000	     25.0
tenant_456	2025-03-31	950	         24.8
tenant_456	2025-03-30	2200	     26.0
```

Run `python load_usage_data.py` [Python script](https://github.com/neondatabase-labs/neon-azure-ai-agent-service-get-started/blob/main/load_usage_data.py) to create and populate the `usage_data` table in your Neon Serverless Postgres instance:

```python
# load_usage_data.py file

import os
from dotenv import load_dotenv
from sqlalchemy import (
    create_engine,
    MetaData,
    Table,
    Column,
    String,
    Date,
    Integer,
    Numeric,
)

# Load environment variables from .env
load_dotenv()

# Load connection string from environment variable
NEON_DB_URL = os.getenv("NEON_DB_CONNECTION_STRING")
engine = create_engine(NEON_DB_URL)

# Define metadata and table schema
metadata = MetaData()

usage_data = Table(
    "usage_data",
    metadata,
    Column("tenant_id", String, primary_key=True),
    Column("date", Date, primary_key=True),
    Column("api_calls", Integer),
    Column("storage_gb", Numeric),
)

# Create table
with engine.begin() as conn:
    metadata.create_all(conn)

    # Insert mock data
    conn.execute(
        usage_data.insert(),
        [
            {
                "tenant_id": "tenant_456",
                "date": "2025-03-27",
                "api_calls": 870,
                "storage_gb": 23.9,
            },
            {
                "tenant_id": "tenant_456",
                "date": "2025-03-28",
                "api_calls": 880,
                "storage_gb": 24.0,
            },
            {
                "tenant_id": "tenant_456",
                "date": "2025-03-29",
                "api_calls": 900,
                "storage_gb": 24.5,
            },
            {
                "tenant_id": "tenant_456",
                "date": "2025-03-30",
                "api_calls": 2200,
                "storage_gb": 26.0,
            },
            {
                "tenant_id": "tenant_456",
                "date": "2025-03-31",
                "api_calls": 950,
                "storage_gb": 24.8,
            },
            {
                "tenant_id": "tenant_456",
                "date": "2025-04-01",
                "api_calls": 1000,
                "storage_gb": 25.0,
            },
        ],
    )

print("✅ usage_data table created and mock data inserted.")
```

## Create a Postgres Tool for the Agent

Next, we configure an AI agent tool to retrieve data from Postgres. The Python script [`billing_agent_tools.py`](https://github.com/neondatabase-labs/neon-azure-ai-agent-service-get-started/blob/main/billing_agent_tools.py) contains:

- The function `billing_anomaly_summary()` that:
  - Pulls usage data from Neon.
  - Computes `% change` in `api_calls`.
  - Flags anomalies with a threshold of `> 1.5x` change.
- Exports `user_functions` list for the Azure AI Agent to use. You do not need to run it separately.

```python
# billing_agent_tools.py file

import os
import json
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up the database engine
NEON_DB_URL = os.getenv("NEON_DB_CONNECTION_STRING")
db_engine = create_engine(NEON_DB_URL)

# Define the billing anomaly detection function
def billing_anomaly_summary(
    tenant_id: str,
    start_date: str = "2025-03-27",
    end_date: str = "2025-04-01",
    limit: int = 10,
) -> str:
    """
    Fetches recent usage data for a SaaS tenant and detects potential billing anomalies.

    :param tenant_id: The tenant ID to analyze.
    :type tenant_id: str
    :param start_date: Start date for the usage window.
    :type start_date: str
    :param end_date: End date for the usage window.
    :type end_date: str
    :param limit: Maximum number of records to return.
    :type limit: int
    :return: A JSON string with usage records and anomaly flags.
    :rtype: str
    """
    query = """
        SELECT date, api_calls, storage_gb
        FROM usage_data
        WHERE tenant_id = %s AND date BETWEEN %s AND %s
        ORDER BY date DESC
        LIMIT %s;
    """

    df = pd.read_sql(query, db_engine, params=(tenant_id, start_date, end_date, limit))

    if df.empty:
        return json.dumps(
            {"message": "No usage data found for this tenant in the specified range."}
        )

    df.sort_values("date", inplace=True)
    df["pct_change_api"] = df["api_calls"].pct_change()
    df["anomaly"] = df["pct_change_api"].abs() > 1.5

    return df.to_json(orient="records")

# Register this in a list to be used by FunctionTool
user_functions = [billing_anomaly_summary]
```

## Create and Configure the AI Agent

Now we'll set up the AI agent and integrate it with our Neon Postgres tool using the **Azure AI Agent Service SDK.** The [Python script](https://github.com/neondatabase-labs/neon-azure-ai-agent-service-get-started/blob/main/billing_anomaly_agent.py) does the following:

- **Creates the agent**
  Instantiates an AI agent using the selected model (`gpt-4o`, for example), adds tool access, and sets instructions that tell the agent how to behave (e.g., “You are a helpful SaaS assistant…”).
- **Creates a conversation thread**
  A thread is started to hold a conversation between the user and the agent.
- **Posts a user message**
  Sends a question like “Why did my billing spike for tenant_456 this week?” to the agent.
- **Processes the request**
  The agent reads the message, determines that it should use the custom tool to retrieve usage data, and processes the query.
- **Displays the response**
  Prints the response from the agent with a natural language explanation based on the tool’s output.

```python
# billing_anomaly_agent.py

import os
from datetime import datetime
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from azure.ai.projects.models import FunctionTool, ToolSet
from dotenv import load_dotenv
from pprint import pprint
from billing_agent_tools import user_functions  # Custom tool function module

# Load environment variables from .env file
load_dotenv()

# Create an Azure AI Project Client
project_client = AIProjectClient.from_connection_string(
    credential=DefaultAzureCredential(),
    conn_str=os.environ["PROJECT_CONNECTION_STRING"],
)

# Initialize toolset with our user-defined functions
functions = FunctionTool(user_functions)
toolset = ToolSet()
toolset.add(functions)

# Create the agent
agent = project_client.agents.create_agent(
    model=os.environ["AZURE_OPENAI_DEPLOYMENT_NAME"],
    name=f"billing-anomaly-agent-{datetime.now().strftime('%Y%m%d%H%M')}",
    description="Billing Anomaly Detection Agent",
    instructions=f"""
    You are a helpful SaaS financial assistant that retrieves and explains billing anomalies using usage data.
    The current date is {datetime.now().strftime("%Y-%m-%d")}.
    """,
    toolset=toolset,
)
print(f"Created agent, ID: {agent.id}")

# Create a communication thread
thread = project_client.agents.create_thread()
print(f"Created thread, ID: {thread.id}")

# Post a message to the agent thread
message = project_client.agents.create_message(
    thread_id=thread.id,
    role="user",
    content="Why did my billing spike for tenant_456 this week?",
)
print(f"Created message, ID: {message.id}")

# Run the agent and process the query
run = project_client.agents.create_and_process_run(
    thread_id=thread.id, agent_id=agent.id
)
print(f"Run finished with status: {run.status}")

if run.status == "failed":
    print(f"Run failed: {run.last_error}")

# Fetch and display the messages
messages = project_client.agents.list_messages(thread_id=thread.id)
print("Messages:")
pprint(messages["data"][0]["content"][0]["text"]["value"])

# Optional cleanup:
# project_client.agents.delete_agent(agent.id)
# print("Deleted agent")

```

## Run the agent

To run the agent, run the following command

```bash
python billing_anomaly_agent.py
```

Snippet of output from agent:

```bash
Messages:
('Based on the usage data for tenant `tenant_456` between April 1 and April 6, '
 '2025:\n'
 '\n'
 '- **API calls:** 1,000\n'
 '- **Storage usage:** 25 GB\n'
 '\n'
 'There are no notable anomalies detected. The percent change in API activity '
 'compared to previous usage is not reported (likely constant or not '
 "significant), and usage levels seem normal. Let me know if you'd like a "
 'deeper investigation into prior weeks or specific metrics!')
```

## Using the Azure AI Foundry agent playground

After running your agent using the Azure AI Agent SDK, it is saved within your Azure AI Foundry project. You can now experiment with it using the **Agent Playground**.

![Azure AI Foundry agent playground](/docs/guides/azure-ai-agent-service/azure-ai-foundry-portal-agents-view.png)

**To try it out:**

- Go to the **Agents** section in your [Azure AI Foundry](https://ai.azure.com/) workspace.
- Find your **billing anomaly agent** in the list and click to open it.
- Use the playground interface to test different financial or billing-related questions, such as:
  > “Did tenant_456 exceed their API usage quota this month?”
  >
  > “Explain recent storage usage changes for tenant_456.”

This is a great way to validate your agent's behavior without writing more code.

## Summary

You’ve now created a working AI agent that talks to your Postgres database, all using:

- A simple Python function
- Azure AI Agent Service
- A Neon Serverless Postgres backend

This approach is beginner-friendly, lightweight, and practical for real-world use.

Want to go further? You can:

- Add more tools to the agent
- Integrate with [vector search](/docs/extensions/pgvector) (e.g., detect anomaly reasons from logs using embeddings)

## Resources

- [Neon on Azure](/docs/manage/azure)
- [Build AI Agents with Azure AI Agent Service and Neon](/blog/build-ai-agents-with-azure-ai-agent-service-and-neon)
- [Multi-Agent AI Solution with Neon, Langchain, AutoGen and Azure OpenAI](/blogolution-with-neon-langchain-autogen-and-azure-openai)

<NeedHelp />
