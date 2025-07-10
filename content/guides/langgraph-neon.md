---
title: Getting started with LangGraph + Neon
subtitle: A step-by-step guide to building AI agents with LangGraph and Neon
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-02-21T00:00:00.000Z'
updatedOn: '2025-02-21T00:00:00.000Z'
---

This guide demonstrates how to integrate LangGraph with Neon. [LangGraph](https://www.langchain.com/langgraph) is a library in the [LangChain](https://www.langchain.com/langchain) ecosystem that simplifies the development of complex, multi-agent LLM applications by using a directed graph structure for efficient coordination and state management.

This guide walks through building a simple [ReAct (Reason + Act)](https://arxiv.org/abs/2210.03629) agent using LangGraph that interacts with Neon to create a database and perform SQL queries. It builds upon the concepts demonstrated in the [prebuilt ReAct agent from LangGraph](https://langchain-ai.github.io/langgraph/how-tos/create-react-agent).

## Prerequisites

Before you begin, make sure you have the following prerequisites:

- **Python 3.10 or higher:** This guide requires Python 3.10 or a later version. If you don't have it installed, download it from [python.org](https://www.python.org/downloads/).

- **Neon account and API key:**
  - Sign up for a free Neon account at [neon.tech](https://console.neon.tech/signup).
  - After signing up, get your Neon API Key from the [Neon console](https://console.neon.tech/app/settings/profile). This API key is needed to authenticate your application with Neon.

- **Google API key:**
  - This guide utilizes the `gemini-2.0-flash` model from Google. You'll need a Google API key to proceed. If you don't already have one, get an API key from the [Google AI Studio](https://aistudio.google.com/apikey).
  - The free tier is sufficient for the example in this guide.

## LangGraph basics

Before building your AI agent workflows, it's important to understand the core concepts behind LangGraph.

### What is LangGraph?

LangGraph is an open‐source orchestration framework for building stateful, multi-actor applications with large language models (LLMs). It enables you to create complex agentic workflows by modeling your application as a graph of interconnected nodes. With LangGraph, you can:

- **Manage state:** Persist and update the conversation and workflow state across interactions.
- **Customize workflows:** Design flexible control flows—including conditional branching, loops, and hierarchical structures—to suit your specific use case.
- **Stream agent reasoning:** Deliver real-time, token-by-token streaming of agent actions to enhance user experience.

### Key components of LangGraph

- **Nodes:** The fundamental units of work. Each node represents a distinct operation (such as an LLM call or tool execution) that processes inputs and updates the application state.
- **Edges:** These define the transitions between nodes, enabling the workflow to branch conditionally or iterate as needed.
- **State persistence:** A central persistence layer that saves the state of your workflow, allowing you to resume or “time-travel” across interactions.
- **Tools:** Integration points for external functionalities (like web search, code execution, or API calls) that extend the agent’s capabilities beyond simple text generation.
- **Human-in-the-loop workflows:** Built-in mechanisms that allow human oversight, ensuring that agent decisions can be validated, corrected, or enhanced before proceeding.

By leveraging these powerful components, LangGraph empowers you to build reliable, scalable, and highly customizable AI agent applications—from prototyping to production.

## Why Neon for AI Agents?

Neon's architecture is particularly well-suited for AI agent development, offering several key advantages:

- **One-Second Provisioning:** Neon databases can be provisioned in about a second. This is _critical_ for AI agents that need to dynamically create databases. Traditional databases, with provisioning times often measured in minutes, create a significant bottleneck. Neon's speed keeps agents operating efficiently.

- **Scale-to-Zero and Serverless Pricing:** Neon's serverless architecture automatically scales databases down to zero when idle, and you only pay for active compute time. This is cost-effective for AI agent workflows, which often involve unpredictable workloads and many short-lived database instances. It enables "database-per-agent" or "database-per-session" patterns without incurring prohibitive costs.

- **Agent-Friendly API:** Neon provides a simple REST API for managing databases, roles, branches, and various other Neon platform operations. This API is easy for AI agents (and human developers) to interact with programmatically, allowing agents to manage their own database infrastructure without complex tooling.

## Building a LangGraph agent with Neon tools integration

Let's build a LangGraph agent that can provision a Neon database and interact with it using SQL queries. This agent will use the LangGraph framework to manage the agent's state and workflow, while functions derived from Neon's API will handle the database operations.

### Setting up the project

Create a new Python project directory and navigate to it:

```bash
mkdir langgraph-neon-example
cd langgraph-neon-example
```

Creating a virtual environment is strongly recommended to manage project dependencies in isolation. Use `venv` to create a virtual environment within your project directory:

```bash
python3 -m venv venv
source venv/bin/activate   # For macOS/Linux. On Windows, use `venv\Scripts\activate`
```

### Installing required libraries

Next, install the necessary Python libraries for this project. Create a file named `requirements.txt` in your project directory and add the following dependencies:

```
python-dotenv
neon-api
psycopg2-binary
langchain
langgraph
langchain-google-genai
```

<Admonition type="note">
`neon-api` is the [Python wrapper for Neon's API](https://github.com/neondatabase/neon-api-python).
</Admonition>

Install these libraries using pip:

```bash
pip install -r requirements.txt
```

### Configuring API keys in `.env`

For secure API key management, create a `.env` file in your project directory and add your API keys as environment variables:

```env
GOOGLE_API_KEY=YOUR_GOOGLE_API
NEON_API_KEY=YOUR_NEON_API_KEY
```

**Replace the placeholders** `YOUR_GOOGLE_API_KEY` and `YOUR_NEON_API_KEY` with the actual API keys you obtained in the [Prerequisites](#prerequisites) section.

<Admonition type="note">
    It is crucial to add `.env` to your `.gitignore` file if you are using Git for version control. This prevents your API keys from being inadvertently exposed in your code repository.
</Admonition>

### Creating the `main.py` script

Now, let's create the `main.py` script that defines the LangGraph agent and its interactions with Neon.

```python
import os

import psycopg2
from dotenv import load_dotenv
from langchain_core.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage
from langgraph.prebuilt import create_react_agent
from neon_api import NeonAPI
from psycopg2.extras import RealDictCursor

load_dotenv()

neon_client = NeonAPI(
    api_key=os.environ["NEON_API_KEY"],
)


@tool
def create_database(project_name: str) -> str:
    """
    Creates a new Neon project. (this takes less than 500ms)
    Args:
        project_name: Name of the project to create
    Returns:
        the connection URI for the new project
    """
    try:
        project = neon_client.project_create(project={"name": project_name}).project
        connection_uri = neon_client.connection_uri(
            project_id=project.id, database_name="neondb", role_name="neondb_owner"
        ).uri

        return f"Project/database created, connection URI: {connection_uri}"
    except Exception as e:
        return f"Failed to create project: {str(e)}"


@tool
def run_sql_query(connection_uri: str, query: str) -> str:
    """
    Runs an SQL query in the Neon database.
    Args:
        connection_uri: The connection URI for the Neon database
        query: The SQL query to execute
    Returns:
        the result of the SQL query
    """
    conn = psycopg2.connect(connection_uri)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cur.execute(query)
        conn.commit()
        try:
            records = cur.fetchall()
            return f"Query result: {records}"
        except psycopg2.ProgrammingError:
            return f"Query executed successfully"
    except Exception as e:
        conn.rollback()
        return f"Failed to execute SQL query: {str(e)}"
    finally:
        cur.close()
        conn.close()


available_tools = [create_database, run_sql_query]

system_prompt = SystemMessage(
    f"You are a helpful AI assistant. You will be assisting users with all of your available tools. You can help users by using the following tools: {', '.join([f"\n{tool.name}: {tool.description}" for tool in available_tools])}."
)

model = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
agent_graph = create_react_agent(
    model=model,
    tools=available_tools,
    prompt=system_prompt,
)

inputs = {
    "messages": [
        (
            "user",
            "Create a new Neon project called langgraph and create a table named users. Add 10 sample records to the table. Then print the records as a markdown table.",
        )
    ]
}
result = agent_graph.invoke(inputs)

print("Step by Step execution : ")
for message in result["messages"]:
    print(message.pretty_repr())
```

Let's examine the code step by step to understand each component.

#### Import necessary libraries

```python
import os

import psycopg2
from dotenv import load_dotenv
from langchain_core.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage
from langgraph.prebuilt import create_react_agent
from neon_api import NeonAPI
from psycopg2.extras import RealDictCursor

load_dotenv()

neon_client = NeonAPI(
    api_key=os.environ["NEON_API_KEY"],
)
```

This section imports all the required Python libraries such as `os`, `psycopg2`, `dotenv`, and LangChain modules. These libraries are essential for interacting with Neon, managing environment variables, and creating LangGraph agents.

#### Define `create_database` tool

```python
@tool
def create_database(project_name: str) -> str:
    """
    Creates a new Neon project. (this takes less than 500ms)
    Args:
        project_name: Name of the project to create
    Returns:
        the connection URI for the new project
    """
    try:
        project = neon_client.project_create(project={"name": project_name}).project
        connection_uri = neon_client.connection_uri(
            project_id=project.id, database_name="neondb", role_name="neondb_owner"
        ).uri

        return f"Project/database created, connection URI: {connection_uri}"
    except Exception as e:
        return f"Failed to create project: {str(e)}"
```

This Python function, decorated with LangChain's `@tool`, allows LangGraph agents to create a Neon project and retrieve its connection URI. It takes a `project_name` as input and uses `neon_client` to interact with the Neon API. If the project is created successfully, the function returns the connection URI; otherwise, it returns an error message.

#### Define `run_sql_query` tool

```python
@tool
def run_sql_query(connection_uri: str, query: str) -> str:
    """
    Runs an SQL query in the Neon database.
    Args:
        connection_uri: The connection URI for the Neon database
        query: The SQL query to execute
    Returns:
        the result of the SQL query
    """
    conn = psycopg2.connect(connection_uri)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cur.execute(query)
        conn.commit()
        try:
            records = cur.fetchall()
            return f"Query result: {records}"
        except psycopg2.ProgrammingError:
            return f"Query executed successfully"
    except Exception as e:
        conn.rollback()
        return f"Failed to execute SQL query: {str(e)}"
    finally:
        cur.close()
        conn.close()
```

Similarily, `run_sql_query` decorated with LangChain's `@tool`, executes an SQL query on a Neon database. It takes a `connection_uri` and a `query` as input, connects to the database using `psycopg2`, and runs the query. If the query returns results, they are fetched and returned; otherwise, a success message is provided. In case of an error, the function rolls back the transaction and returns an error message.

#### Define agent setup and graph invocation

```python
available_tools = [create_database, run_sql_query]

system_prompt = SystemMessage(
    f"You are a helpful AI assistant. You will be assisting users with all of your available tools. You can help users by using the following tools: {', '.join([f"\n{tool.name}: {tool.description}" for tool in available_tools])}."
)

model = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
agent_graph = create_react_agent(
    model=model,
    tools=available_tools,
    prompt=system_prompt,
)

inputs = {
    "messages": [
        (
            "user",
            "Create a new Neon project called langgraph and create a table named users. Add 10 sample records to the table. Then print the records as a markdown table.",
        )
    ]
}
result = agent_graph.invoke(inputs)

print("Step by Step execution : ")
for message in result["messages"]:
    print(message.pretty_repr())
```

This is the core part of the script where the LangGraph agent is set up and invoked. Let's break down this section:

- `available_tools = [create_database, run_sql_query]`: Creates a list of tools that will be made available to the agent. This list includes the `create_database` and `run_sql_query` functions defined earlier.
- `system_prompt = SystemMessage(...)`: Defines the system message for the AI agent. This message is crucial as it sets the agent's persona and provides instructions on how to use the available tools. It dynamically lists the tools and their descriptions in the prompt, instructing the agent on its capabilities.
- `model = ChatGoogleGenerativeAI(model="gemini-2.0-flash")`: Initializes the language model that will power the agent. Here, `ChatGoogleGenerativeAI` is used to specify Google's Gemini `gemini-2.0-flash` model.
- `agent_graph = create_react_agent(...)`: This line is where the LangGraph agent is created using the `create_react_agent` function.
  - `model=model`: Specifies the language model (`gemini-2.0-flash`) to be used by the agent for reasoning and generating responses.
  - `tools=available_tools`: Passes the list of tools (`create_database`, `run_sql_query`) that the agent can use.
  - `prompt=system_prompt`: Sets the system prompt that defines the agent's behavior and instructions.
- `inputs = {"messages": [...]}`: Defines the input to the agent. In this case, it's a user message asking the agent to perform a series of database tasks: create a Neon project, create a table named `users`, add 10 sample records, and then print these records as a Markdown table.
- `result = agent_graph.invoke(inputs)`: Invokes the LangGraph agent with the specified input. This starts the agent's execution, processing the user's request and orchestrating the use of tools to fulfill the task. The `invoke` method runs the agent and returns the final state, which includes the conversation history and the outcomes of the agent's actions.
- `for message in result["messages"]: print(message.pretty_repr())`: Iterates through the messages in the `result["messages"]` list, which contains the history of the agent's conversation and actions. `message.pretty_repr()` is used to print each message in a human-readable format, showing the step-by-step execution of the agent's thought process and actions.

#### Visualizing the agent's graph (optional)

You can visualize the agent's graph using LangGraph's built-in visualization tools. To do this, add the following code snippet at the end of the `main.py` script:

```python
with open("graph.png", "wb") as f:
    f.write(agent_graph.get_graph().draw_mermaid_png())
```

<img width="200" height="200" src="/docs/guides/langgraph-graph.png" alt="LangGraph Agent Graph" />

The graph visually represents the cyclical workflow of the LangGraph agent. Let's break down the key components of the graph:

- **`__start__` Node:** This is the entry point of the graph. Execution begins here when a task is initiated. It represents the starting point of the agent's workflow.

- **`agent` Node:** This node represents the core reasoning component of the agent, powered by the Gemini model.
  - **Decision Point:** The `agent` node is responsible for processing user input and deciding the next course of action. It determines whether to:
    - **Engage tools:** If the task requires database operations (like creating a project or running SQL queries), the agent decides to use the available tools. This is represented by the dotted line leading to the `tools` node.
    - **Respond directly:** If the agent can directly answer the user or has completed the task without needing further tool use, it can proceed to the `__end__` node. This is represented by the dotted line leading directly to the `__end__` node.

- **`tools` Node:** This node is activated when the `agent` node decides to use a tool.
  - **Tool execution:** Within the `tools` node, the appropriate tool (either `create_database` or `run_sql_query` in this example) is executed based on the agent's decision.
  - **Feedback loop:** After executing the tool and obtaining results, the workflow loops back to the `agent` node (solid line). This allows the agent to process the tool's output, reason further, and decide on the next step based on the new information. This loop is central to the ReAct (Reason and Act) pattern, enabling iterative problem-solving.

- **`__end__` Node:** This is the termination point of the graph. When the workflow reaches this node, it signifies that the agent has completed its task or conversation according to the defined termination conditions.

### Running the agent

You can now run the `main.py` script to execute the LangGraph agent. Run the following command in your terminal:

```bash
python main.py
```

The agent will then create a new Neon project, create a table named `users`, insert 10 sample records, and print the records as a markdown table.

Here's the entire conversation log showing the step-by-step execution of the agent:

```text shouldWrap
Step by Step execution :
================================ Human Message =================================

Create a new Neon project called langgraph and create a table named users. Add 10 sample records to the table. Then print the records as a markdown table.
================================== Ai Message ==================================

I can create a Neon project and a table named users, and add 10 sample records to the table. However, I cannot automatically print the records as a markdown table. I will need to run a query to fetch the records first, and then you can format them as a markdown table.

First, I will create the project:
Tool Calls:
  create_database (b9e5d9f7-5b8c-40f0-af6c-7ec095ba2da9)
 Call ID: b9e5d9f7-5b8c-40f0-af6c-7ec095ba2da9
  Args:
    project_name: langgraph
================================= Tool Message =================================
Name: create_database

Project/database created, connection URI: postgresql://neondb_owner:npg_HCFnoIvx5L9g@ep-broad-water-a53lox4z.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
================================== Ai Message ==================================

OK. I've created the project and the connection URI is postgresql://neondb_owner:npg_HCFnoIvx5L9g@ep-broad-water-a53lox4z.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require. Now, I will create the table and add the records.
Tool Calls:
  run_sql_query (c3346333-b024-4fc5-99ba-d745e0108bb8)
 Call ID: c3346333-b024-4fc5-99ba-d745e0108bb8
  Args:
    connection_uri: postgresql://neondb_owner:npg_HCFnoIvx5L9g@ep-broad-water-a53lox4z.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
    query: CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255));
================================= Tool Message =================================
Name: run_sql_query

Query executed successfully
================================== Ai Message ==================================
Tool Calls:
  run_sql_query (4be2ae12-adfe-45ed-bba3-d321073902ef)
 Call ID: 4be2ae12-adfe-45ed-bba3-d321073902ef
  Args:
    connection_uri: postgresql://neondb_owner:npg_HCFnoIvx5L9g@ep-broad-water-a53lox4z.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
    query: INSERT INTO users (id, name, email) VALUES (1, 'John Doe', 'john.doe@example.com'), (2, 'Jane Smith', 'jane.smith@example.com'), (3, 'Robert Jones', 'robert.jones@example.com'), (4, 'Emily Brown', 'emily.brown@example.com'), (5, 'Michael Davis', 'michael.davis@example.com'), (6, 'Jessica Wilson', 'jessica.wilson@example.com'), (7, 'Christopher Garcia', 'christopher.garcia@example.com'), (8, 'Ashley Rodriguez', 'ashley.rodriguez@example.com'), (9, 'Matthew Williams', 'matthew.williams@example.com'), (10, 'Brittany Miller', 'brittany.miller@example.com');
================================= Tool Message =================================
Name: run_sql_query

Query executed successfully
================================== Ai Message ==================================
Tool Calls:
  run_sql_query (f6484943-0dcc-4059-b794-2dc83ae31b1a)
 Call ID: f6484943-0dcc-4059-b794-2dc83ae31b1a
  Args:
    connection_uri: postgresql://neondb_owner:npg_HCFnoIvx5L9g@ep-broad-water-a53lox4z.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
    query: SELECT * FROM users;
================================= Tool Message =================================
Name: run_sql_query

Query result: [RealDictRow({'id': 1, 'name': 'John Doe', 'email': 'john.doe@example.com'}), RealDictRow({'id': 2, 'name': 'Jane Smith', 'email': 'jane.smith@example.com'}), RealDictRow({'id': 3, 'name': 'Robert Jones', 'email': 'robert.jones@example.com'}), RealDictRow({'id': 4, 'name': 'Emily Brown', 'email': 'emily.brown@example.com'}), RealDictRow({'id': 5, 'name': 'Michael Davis', 'email': 'michael.davis@example.com'}), RealDictRow({'id': 6, 'name': 'Jessica Wilson', 'email': 'jessica.wilson@example.com'}), RealDictRow({'id': 7, 'name': 'Christopher Garcia', 'email': 'christopher.garcia@example.com'}), RealDictRow({'id': 8, 'name': 'Ashley Rodriguez', 'email': 'ashley.rodriguez@example.com'}), RealDictRow({'id': 9, 'name': 'Matthew Williams', 'email': 'matthew.williams@example.com'}), RealDictRow({'id': 10, 'name': 'Brittany Miller', 'email': 'brittany.miller@example.com'})]
================================== Ai Message ==================================

| id | name               | email                        |
| -- | ------------------ | ---------------------------- |
| 1  | John Doe           | john.doe@example.com         |
| 2  | Jane Smith          | jane.smith@example.com        |
| 3  | Robert Jones        | robert.jones@example.com       |
| 4  | Emily Brown         | emily.brown@example.com        |
| 5  | Michael Davis       | michael.davis@example.com      |
| 6  | Jessica Wilson      | jessica.wilson@example.com     |
| 7  | Christopher Garcia  | christopher.garcia@example.com |
| 8  | Ashley Rodriguez    | ashley.rodriguez@example.com   |
| 9  | Matthew Williams    | matthew.williams@example.com   |
| 10 | Brittany Miller     | brittany.miller@example.com    |
```

Notice how with just a single user input, the agent orchestrates multiple tools to create a Neon project, provision a database, create a table, insert records, and query the records. The agent finally formats the query results as a markdown table as requested.

### Verifying the agent's actions

You can verify the successful completion of the task by checking the [Neon Console](https://console.neon.tech/). The `langgraph` project should have been created, and the `users` table should contain 10 sample records.

![Output in Neon console](/docs/guides/langgraph-neon-console.png)

**Congratulations!** You have successfully built and executed a LangGraph agent that interacts with tools (Neon API here) to perform actions based on user input. This example serves as a foundation for creating more complex AI agents and workflows, enabling you to automate a wide range of tasks and processes.

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
    <a href="https://github.com/neondatabase-labs/langgraph-neon-example" description="LangGraph + Neon AI agent example" icon="github">AI Agent with LangGraph and Neon</a>
</DetailIconCards>

## Conclusion

This guide has provided an introductory exploration into building AI agents using LangGraph and Neon. You have now seen how to construct an agent capable of performing database operations within Neon, driven by natural language commands. This example illustrates the fundamental structure of LangGraph, demonstrating its approach to managing workflows through interconnected [Nodes](https://langchain-ai.github.io/langgraph/concepts/low_level/#nodes) and [Edges](https://langchain-ai.github.io/langgraph/concepts/low_level/#edges).

While this guide covers the basics, LangGraph offers a range of features for developing more advanced applications. To expand your understanding and capabilities, it is recommended to further investigate several key aspects of the framework. [Checkpointers](https://langchain-ai.github.io/langgraph/concepts/persistence) provide a mechanism for state persistence, enabling agents to retain context across sessions and resume operations. The use of [Command](https://langchain-ai.github.io/langgraph/how-tos/command) objects allows for control over workflow and state updates within nodes, enhancing agent responsiveness.

For optimizing application performance and user experience, LangGraph supports [Streaming](https://langchain-ai.github.io/langgraph/concepts/streaming), which can provide real-time outputs and token-by-token updates during agent execution. Understanding the [Recursion Limit](https://langchain-ai.github.io/langgraph/concepts/low_level/#recursion-limit) is important for managing the execution depth of complex workflows and ensuring predictable behavior. Furthermore, [Human-in-the-Loop](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop) workflows, facilitated by the `interrupt` function and `Command` objects, offer options for integrating human oversight into agent processes, which may be necessary for applications requiring validation or control. Consider adding it for `DELETE` and `UPDATE` operations to the `run_sql_query` tool to enhance the agent's capabilities.

## Resources

- [LangGraph GitHub](https://github.com/langchain-ai/langgraph)
- [LangGraph Documentation](https://python.langchain.com/docs/langgraph)
- [LangGraph Conceptual Guide](https://langchain-ai.github.io/langgraph/concepts)
- [LangGraph Glossary](https://langchain-ai.github.io/langgraph/concepts/low_level/#langgraph-glossary)
- [Neon Documentation](/docs)
- [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)
- [Neon API keys](/docs/manage/api-keys#creating-api-keys)

<NeedHelp/>
