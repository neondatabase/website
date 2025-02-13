---
title: Getting started with AutoGen + Neon
subtitle: A step-by-step guide to building AI agents using AutoGen and Neon
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-02-12T00:00:00.000Z'
updatedOn: '2025-02-12T00:00:00.000Z'
---

This guide demonstrates how to integrate AutoGen with Neon. [AutoGen](https://microsoft.github.io/autogen/stable) is an open-source framework developed by Microsoft for building AI agents that can converse, plan, and interact with tools (APIs). Combining AutoGen with Neon allows AI agents to manage your database, execute SQL queries, and automate data-related tasks seamlessly.

In this guide, we'll walk through building an AI agent with a practical example: creating a system that retrieves recent machine learning papers from arXiv and stores them in a Neon database. Through this example, you will learn how to:

- Create an AutoGen agent with Neon API integration.
- Implement database operations (like project creation and SQL queries) as agent tools.
- Set up a collaborative workflow where multiple agents work together to accomplish research tasks.

## Prerequisites

Before you begin, make sure you have the following prerequisites:

- **Python 3.10 or higher:** This guide requires Python 3.10 or a later version. If you don't have it installed, download it from [python.org](https://www.python.org/downloads/).

- **Neon account and API key:**
    - Sign up for a free Neon account at [neon.tech](https://console.neon.tech/signup).
    - After signing up, get your Neon API Key from the [Neon console](https://console.neon.tech/app/settings/profile). This API key is essential for authenticating your application with Neon.

- **OpenAI account and API key:**
    - This guide uses the `gpt-4o` model from OpenAI to power the AI agent. If you don't have an OpenAI account, sign up at [platform.openai.com](https://platform.openai.com/).
    - Generate a new API key from the [OpenAI Platform API keys section](https://platform.openai.com/api-keys). This key allows AutoGen to interact with OpenAI's models.

With these prerequisites in place, you are ready to build your AI agent.

## AutoGen basics

Before we start building your AI agent, let's understand some fundamental concepts of AutoGen.

### What is AutoGen?

AutoGen is a powerful framework designed to simplify the development of applications using LLMs. It allows you to construct complex AI workflows by creating **conversational agents** that are capable of:

- **Conversation:** Engaging in multi-agent dialogues to solve tasks collaboratively.
- **Planning:** Developing and executing strategic plans to achieve intricate goals.
- **Tool utilization:** Integrating with external tools and APIs to extend their capabilities beyond simple text generation, enabling real-world interactions.

### Key components of AutoGen

- **Agents:** The foundational building blocks in AutoGen. Agents are autonomous entities that can:
    - **Receive and process messages:** Accept and understand messages from users or other agents.
    - **Act autonomously:** Perform tasks, utilize tools, or generate responses based on their programmed logic and received messages.
    - **Agent types:** AutoGen offers various agent types, including:
        - **`AssistantAgent`:** A versatile agent powered by an LLM, capable of using tools and designed to be helpful and instruction-following. Ideal for general tasks and complex reasoning.
        - **`CodeExecutorAgent`:**  A specialized agent designed to execute code snippets. Useful for tasks requiring script execution or interacting with system commands.
        - **`UserProxyAgent`:** An agent that serves as an interface for human users. It can relay communications between the user and other agents and can be configured to request human input at specific workflow stages.

- **Teams (Group chat):** AutoGen facilitates forming agent teams to tackle complex problems collaboratively. Key team configurations include:
    - **`RoundRobinGroupChat`:** A straightforward team setup where agents communicate in turns, following a round-robin approach to ensure balanced contribution from each member.
    - **`SelectorGroupChat`:** A more sophisticated team configuration enabling advanced agent selection mechanisms, including LLM-driven speaker selection for dynamic conversation flow.

- **Tools:** AutoGen agents can leverage tools to interact with external environments or perform specialized functions. Tools can be:
    - **Python functions:** Custom Python functions that agents can call to execute specific actions or computations.
    - **External APIs:** Integrations with external services, allowing agents to access a wide range of functionalities like web searching.

- **Code execution:** AutoGen equips agents with code execution capabilities, enabling them to perform tasks involving computation, data manipulation, or system interactions, enhancing their problem-solving abilities.

- **Termination conditions:** To effectively manage conversations and workflows, AutoGen allows defining termination conditions. These conditions specify criteria for ending a conversation or task, ensuring efficient resource use and task completion. Examples include:
    - **`TextMentionTermination`:** Ends the conversation when a predefined text or phrase is detected in the dialogue (e.g., "TERMINATE").
    - **`MaxMessageTermination`:** Automatically stops the conversation after a set number of messages have been exchanged, preventing infinite loops.

Utilizing these fundamental components, AutoGen provides a robust and adaptable framework for building a diverse array of AI applications, ranging from simple interactive chatbots to intricate, collaborative multi-agent systems.

## Why Neon for AI Agents?

Neon's architecture is particularly well-suited for AI agent development, offering several key advantages:

- **One-Second Provisioning:** Neon databases can be provisioned in about a second. This is *critical* for AI agents that need to dynamically create databases for tasks like testing hypotheses, generating code, or managing session-specific data.  Traditional databases, with provisioning times often measured in minutes, create a significant bottleneck. Neon's speed keeps agents operating efficiently.

- **Scale-to-Zero and Serverless Pricing:** Neon's serverless architecture automatically scales databases down to zero when idle, and you only pay for active compute time.  This is cost-effective for AI agent workflows, which often involve unpredictable workloads and many short-lived database instances.  It enables "database-per-agent" or "database-per-session" patterns without incurring prohibitive costs.

- **Agent-Friendly API:** Neon provides a simple REST API for managing databases, branches, and configurations.  This API is easy for AI agents (and human developers) to interact with programmatically, allowing agents to manage their own database infrastructure without complex tooling.

## Building the AI agent

Let's start building your AI agent. First, create a new directory for your project. For example, you can name it `autogen-neon-example`. Open this new folder in your preferred code editor.

### Setting up a virtual environment

Creating a virtual environment is strongly recommended to manage project dependencies in isolation. Use `venv` to create a virtual environment within your project directory:

```bash
cd autogen-neon-example
python3 -m venv venv
source venv/bin/activate   # For macOS/Linux. On Windows, use `venv\Scripts\activate`
```

### Installing required libraries

Next, install the necessary Python libraries for this project. Create a file named `requirements.txt` in your project directory and add the following dependencies:

```
autogen-agentchat[openai]
autogen-ext[openai]
python-dotenv
neon-api
psycopg2-binary
```

Install these libraries using pip:

```bash
pip install -r requirements.txt
```

### Configuring API keys in `.env`

For secure API key management, create a `.env` file in your project directory and add your API keys as environment variables:

```env
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
NEON_API_KEY=YOUR_NEON_API_KEY
```

**Replace the placeholders** `YOUR_OPENAI_API_KEY` and `YOUR_NEON_API_KEY` with the actual API keys you obtained in the [Prerequisites](#prerequisites) section.

<Admonition type="note">
    It is crucial to add `.env` to your `.gitignore` file if you are using Git for version control. This prevents your API keys from being inadvertently exposed in your code repository.
</Admonition>

### Creating the `main.py` file

Create a Python file named `main.py` in your project's root directory and copy the following code into it:

```python
import asyncio
import os

import psycopg2
from autogen_agentchat.agents import AssistantAgent, CodeExecutorAgent
from autogen_agentchat.conditions import MaxMessageTermination, TextMentionTermination
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.ui import Console
from autogen_ext.code_executors.local import LocalCommandLineCodeExecutor
from autogen_ext.models.openai import OpenAIChatCompletionClient
from dotenv import load_dotenv
from neon_api import NeonAPI
from psycopg2.extras import RealDictCursor

load_dotenv()

neon_client = NeonAPI(
    api_key=os.environ["NEON_API_KEY"],
)


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

        # Try to fetch results (for SELECT queries)
        try:
            records = cur.fetchall()
            return f"Query result: {records}"
        except psycopg2.ProgrammingError:
            # For INSERT/UPDATE/DELETE operations
            return f"Query executed successfully"
    except Exception as e:
        conn.rollback()
        return f"Failed to execute SQL query: {str(e)}"
    finally:
        cur.close()
        conn.close()


async def main() -> None:
    model_client = OpenAIChatCompletionClient(model="gpt-4o", temperature=0.6)

    assistant = AssistantAgent(
        name="assistant",
        system_message="""You are a helpful AI assistant.
Solve tasks using your coding and language skills.
You are working with two other agents:
1. 'code_executor': Use this agent for non-database coding tasks such as general-purpose scripts, file manipulation, and system commands.
2. 'db_admin': Use this agent for all database-related tasks.
Do NOT generate or suggest any SQL or database connection code yourself. Clearly mention what needs to be done and send the request to 'db_admin'.

In the following cases, suggest python code (in a python coding block) or shell script (in a sh coding block) for the user to execute.
1. When you need to collect info, use the code to output the info you need, for example, browse or search the web, download/read a file, print the content of a webpage or a file, get the current date/time, check the operating system. After sufficient info is printed and the task is ready to be solved based on your language skill, you can solve the task by yourself.
2. When you need to perform some task with code, use the code to perform the task and output the result. Finish the task smartly.

Solve the task step by step if you need to. If a plan is not provided, explain your plan first. Be clear which step uses code, and which step uses your language skill.
When using code, you must indicate the script type in the code block. The user cannot provide any other feedback or perform any other action beyond executing the code you suggest. The user can't modify your code. So do not suggest incomplete code which requires users to modify. Don't use a code block if it's not intended to be executed by the user.
If you want the user to save the code in a file before executing it, put # filename: <filename> inside the code block as the first line. Don't include multiple code blocks in one response. Do not ask users to copy and paste the result. Instead, use 'print' function for the output when relevant, try to add print statements while sharing code with the user so it will be used for debugging. Check the execution result returned by the user.
If the result indicates there is an error, fix the error and output the code again. Suggest the full code instead of partial code or code changes. If the error can't be fixed or if the task is not solved even after the code is executed successfully, analyze the problem, revisit your assumption, collect additional info you need, and think of a different approach to try.
When you find an answer, verify the answer carefully. Include verifiable evidence in your response if possible.
Reply 'TERMINATE' in the end when the task is completed by everyone.
""",
        model_client=model_client,
    )

    code_executor = CodeExecutorAgent(
        name="code_executor",
        code_executor=LocalCommandLineCodeExecutor(work_dir="coding"),
        sources=["assistant"],
    )

    db_admin = AssistantAgent(
        name="db_admin",
        system_message="""You are a helpful database admin assistant with access to the following tools:
1.  **Project Creation:** Create a new Neon project by providing a project name and receive the connection URI.
2.  **SQL Execution:** Run SQL queries within a Neon database.
Use these tools to fulfill user requests.  For each step, clearly describe the action taken and its result.  Include the tool output directly in the chat.  When multiple SQL queries are required, combine them into a single grouped query.  Present the output of each individual query within the grouped query's response.
""",
        model_client=model_client,
        tools=[create_database, run_sql_query],
    )

    # The termination condition is a combination of text termination and max message termination, either of which will cause the chat to terminate.
    termination = TextMentionTermination("TERMINATE") | MaxMessageTermination(20)

    # The group chat will alternate between the assistant and the code executor.
    group_chat = RoundRobinGroupChat(
        [assistant, code_executor, db_admin], termination_condition=termination
    )

    # `run_stream` returns an async generator to stream the intermediate messages.
    stream = group_chat.run_stream(
        task="Get the 10 most recent Machine Learning papers from arXiv. Print the titles and links to the papers in the chat. Save them in a database named 'arxiv_papers'",
    )
    await Console(stream)


if __name__ == "__main__":
    asyncio.run(main())
```

Let's take a closer look at the code. While it might seem lengthy at first, we'll break it down into sections to make it easier for you to understand.

### Import necessary libraries

```python
import asyncio
import os

import psycopg2
from autogen_agentchat.agents import AssistantAgent, CodeExecutorAgent
from autogen_agentchat.conditions import MaxMessageTermination, TextMentionTermination
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.ui import Console
from autogen_ext.code_executors.local import LocalCommandLineCodeExecutor
from autogen_ext.models.openai import OpenAIChatCompletionClient
from dotenv import load_dotenv
from neon_api import NeonAPI
from psycopg2.extras import RealDictCursor

load_dotenv()

neon_client = NeonAPI(
    api_key=os.environ["NEON_API_KEY"],
)
```

This section imports all the Python libraries required for the script. These include libraries for AutoGen agents, Neon API interaction, SQL execution, environment variable management, and asynchronous operations. It also initializes the Neon API client using your API key loaded from the `.env` file.

### Define the tools for Agent interaction

To enable agents to interact with the Neon database, we define specific tools. In this example, we create two primary tools: `create_database` and `run_sql_query`.

#### Define `create_database` tool

```python
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

This Python function defines a tool that allows agents to create new Neon projects programmatically using the `neon_api_client`.

- It accepts `project_name: str` as an argument, which specifies the name for the new Neon project.
- It utilizes `neon_client.project_create()` to send a request to the Neon API to create a new project.
- Upon successful project creation, it retrieves the connection URI for the newly created Neon database using `neon_client.connection_uri()`.
- It returns a formatted string that confirms the project and database creation and includes the connection URI, which is essential for connecting to the database.
- In case of any errors during project creation, it catches the exception and returns an error message, aiding in debugging and error handling.

#### Define `run_sql_query` tool

```python
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

        # Try to fetch results (for SELECT queries)
        try:
            records = cur.fetchall()
            return f"Query result: {records}"
        except psycopg2.ProgrammingError:
            # For INSERT/UPDATE/DELETE operations
            return f"Query executed successfully"
    except Exception as e:
        conn.rollback()
        return f"Failed to execute SQL query: {str(e)}"
    finally:
        cur.close()
        conn.close()
```

This Python function is defined as a tool for agents to execute SQL queries directly against a Neon database.

- It takes two arguments: `connection_uri: str`, which is the URI string required to establish a database connection, and `query: str`, the SQL query intended for execution.
- It establishes a connection to the Neon database using `psycopg2.connect(connection_uri)`
- It creates a cursor object using `conn.cursor(cursor_factory=RealDictCursor)`. The `RealDictCursor` is specified to fetch query results as dictionaries, which is often more convenient for data manipulation in Python.
- It executes the provided SQL query using `cur.execute(query)`.
- It includes error handling for SQL query execution. If any exception occurs, it rolls back the transaction using `conn.rollback()` and returns an error message.

### Define `main` asynchronous function

```python
async def main() -> None:
    model_client = OpenAIChatCompletionClient(model="gpt-4o", temperature=0.6)

    assistant = AssistantAgent(
        name="assistant",
        system_message="""... (system message content)""",
        model_client=model_client,
    )

    code_executor = CodeExecutorAgent(
        name="code_executor",
        code_executor=LocalCommandLineCodeExecutor(work_dir="coding"),
        sources=["assistant"],
    )

    db_admin = AssistantAgent(
        name="db_admin",
        system_message="""... (system message content)""",
        model_client=model_client,
        tools=[create_database, run_sql_query],
    )

    termination = TextMentionTermination("TERMINATE") | MaxMessageTermination(20)

    group_chat = RoundRobinGroupChat(
        [assistant, code_executor, db_admin], termination_condition=termination
    )

    stream = group_chat.run_stream(
        task="Get the 10 most recent Machine Learning papers from arXiv. Print the titles and links to the papers in the chat. Save them in a database named 'arxiv_papers'",
    )
    await Console(stream)
```

This `async def main() -> None:` function is the core of your script, where you set up and orchestrate the AutoGen agents to perform the desired task. Let's break down what happens inside:

- **Initialize model client:**
  ```python
  model_client = OpenAIChatCompletionClient(model="gpt-4o", temperature=0.6)
  ```
    This line initializes the OpenAI model client, specifying `gpt-4o` as the LLM to be used. `OpenAIChatCompletionClient` is configured to interact with OpenAI's API, using the API key you've set up.

- **Create `assistant` agent:**
  ```python
  assistant = AssistantAgent(
      name="assistant",
      system_message="""... (system message)""",
      model_client=model_client,
  )
  ```
    Here, we instantiate the primary agent, `assistant`, using `AssistantAgent`. This agent is designed to be the main problem solver. The `system_message` is a crucial part of its configuration, defining its role, capabilities, and instructions on how to interact with other agents and tools.  It emphasizes task planning, delegation, and using the specialized `code_executor` and `db_admin` agents for specific sub-tasks.

- **Create `code_executor` agent:**
  ```python
  code_executor = CodeExecutorAgent(
      name="code_executor",
      code_executor=LocalCommandLineCodeExecutor(work_dir="coding"),
      sources=["assistant"],
  )
  ```
    We then create a `CodeExecutorAgent` named `code_executor`. This agent is specialized in executing code and is equipped with `LocalCommandLineCodeExecutor` to run code locally. The `sources=["assistant"]` configuration indicates that this agent is intended to execute code suggested by the `assistant` agent.

- **Create `db_admin` agent:**
  ```python
  db_admin = AssistantAgent(
      name="db_admin",
      system_message="""... (system message content)""",
      model_client=model_client,
      tools=[create_database, run_sql_query],
  )
  ```
    Next, you create another `AssistantAgent`, `db_admin`, which is specifically designed for database administration tasks.  Critically, we equip this agent with the `tools=[create_database, run_sql_query]` we defined earlier. The `system_message` for `db_admin` instructs it on its role as a database admin assistant and how to use the provided tools.

- **Define termination conditions:**
  ```python
  termination = TextMentionTermination("TERMINATE") | MaxMessageTermination(20)
  ```
    This sets up termination conditions for your group chat. The conversation will end if either the phrase "TERMINATE" is mentioned by any agent (`TextMentionTermination`) or if the conversation reaches 20 messages (`MaxMessageTermination(20)`), whichever comes first. This is important to prevent conversations from running indefinitely.

- **Create `group_chat`:**
  ```python
  group_chat = RoundRobinGroupChat(
      [assistant, code_executor, db_admin], termination_condition=termination
  )
  ```
    We then assemble your agents into a team using `RoundRobinGroupChat`. This configuration ensures that the agents (`assistant`, `code_executor`, `db_admin`) will take turns speaking in a round-robin fashion. The `termination_condition=termination` applies the termination conditions we defined earlier to this chat.

- **Run the chat:**
  ```python
  stream = group_chat.run_stream(
      task="Get the 10 most recent Machine Learning papers from arXiv. Print the titles and links to the papers in the chat. Save them in a database named 'arxiv_papers'",
  )
  await Console(stream)
  ```
    Finally, we initiate and run the group chat using `group_chat.run_stream()`. We provide the initial `task` for the agents: to retrieve the 10 most recent Machine Learning papers from arXiv, display their titles and links, and then store this information in a database named `arxiv_papers`.  `Console(stream)` is used to provide a real-time, streaming output of the conversation to the console, making it easy for you to follow along with the agent's interactions.

    <Admonition type="warning">
        This guide uses `LocalCommandLineCodeExecutor` for simplicity, which allows AI agents to execute commands directly on your local machine. **This setup is highly insecure and is strictly NOT recommended for production environments.**  Agents could potentially perform harmful actions on your system.

        For production deployments, we strongly advise using `DockerCommandLineCodeExecutor`. This executor runs code within isolated Docker containers, significantly enhancing security by limiting the agent's access to your system.

        Setting up `DockerCommandLineCodeExecutor` involves additional configuration steps, including Docker setup and image management, which are beyond the scope of this getting started guide.  Please refer to the [AutoGen documentation](https://microsoft.github.io/autogen/stable/reference/python/autogen_ext.code_executors.docker.html#autogen_ext.code_executors.docker.DockerCommandLineCodeExecutor) for detailed instructions on how to configure and use `DockerCommandLineCodeExecutor` securely.
    </Admonition>

### Running the example

With your project set up and the `main.py` code in place, you are ready to execute the example.

Open your terminal and run the script using:

```bash
python main.py
```

Executing this command will:

- Launch the `main.py` script, initiating the AutoGen agent team.
- Start the collaborative process as the agents begin to interact to achieve the defined task.
- Display a real-time, step-by-step conversation between the agents directly in your console.
- Showcase the `assistant` agent's role in planning and delegating sub-tasks to the `code_executor` (for coding needs) and `db_admin` (for database operations).
- Ultimately, lead to the retrieval of recent ML papers from arXiv and their storage in a Neon database named `arxiv_papers`, demonstrating a complete workflow.

### Expected output

Upon running `python main.py`, you will see a detailed, turn-based conversation unfold in your console.  This output will illustrate the dynamic interaction between your agents.

![Autogen-Neon example output 1](/docs/guides/autogen-neon-output-1.png)
![Autogen-Neon example output 2](/docs/guides/autogen-neon-output-2.png)
![Autogen-Neon example output 3](/docs/guides/autogen-neon-output-3.png)

You can verify the successful completion of the task by checking the [Neon Console](https://console.neon.tech/). The `arxiv_papers` project should have been created, and the recent ML papers from arXiv should be stored in the database.

![Output in Neon console](/docs/guides/autogen-neon-console.png)

**Congratulations!** You have successfully built and run an AutoGen agent team that effectively interacts with Neon for database management! This example serves as a foundation for creating more complex AI agents and workflows, enabling you to automate a wide range of tasks and processes.

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
    <a href="https://github.com/neondatabase-labs/autogen-neon-example" description="AutoGen + Neon AI agent example" icon="github">AI Agent with AutoGen and Neon</a>
</DetailIconCards>

## Resources

- [AutoGen documentation](https://microsoft.github.io/autogen/stable/)
- [Neon documentation](/docs)
- [Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)
- [Neon API keys](/docs/manage/api-keys#creating-api-keys)
- [Postgres for AI Agents](/use-cases/ai-agents)

<NeedHelp/>