---
title: Building AI agents with AgentStack and Neon
subtitle: Build a web scraper AI agent with AgentStack, Neon, and Firecrawl
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2025-02-04T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

Building and deploying AI agents that can perform tasks and work with your data infrastructure usually means writing a lot of glue code. This guide shows a faster path.

This guide introduces [**AgentStack**](https://docs.agentstack.sh/introduction), a rapid development framework, and Neon, a complete set of cloud backend primitives built around Lakebase Postgres (with Auth, Object Storage, Functions, and AI Gateway), and shows how to use them together to build AI agents that read and write a database. We'll walk through building a **Web Scraper AI Agent** using AgentStack's CLI and tool integrations.

With AgentStack and Neon, you can generate agent workflows, create agents and tasks from the CLI, and connect them to your database.

## What you will build

This example will show you how to:

- Set up an **AgentStack** project.
- Use the **AgentStack CLI** to generate agents and tasks.
- Equip your agents with **tools** like **Neon** for data storage and **Firecrawl** for web scraping.
- Run your agent crew to scrape the [neon.com/guides](/guides) page, extract blog post metadata (titles, authors, dates) from it, and store it in a Lakebase Postgres database.
- Use **AgentOps** for observability of your agent's execution.

## Prerequisites

Before you start building your web scraper agent, make sure you have the following:

- **Python 3.10 or higher:** Download from [python.org](https://www.python.org/downloads/).
- **uv package installer (or Poetry):** Recommended for faster dependency installation. Install `uv` as described here: [astral-sh/uv](https://github.com/astral-sh/uv?tab=readme-ov-file#installation). Alternatively, use `poetry`.
- **AgentStack CLI:** Install the AgentStack Command Line Interface (CLI). Follow the [Getting started with AgentStack](https://docs.agentstack.sh/installation) guide.
- **Accounts and API Keys:** You will need accounts and API keys for these services:
  - **OpenAI API key**: We will use OpenAI's `gpt-4o-mini` model to power AI agents. Get an OpenAI API key at [platform.openai.com](https://platform.openai.com).
  - **Neon account**: Sign up for a Neon account at [console.neon.tech](https://console.neon.tech/signup). The Free plan works for this guide. You will need a Neon API key to connect to your Neon database.
  - **Firecrawl account**: Sign up for a Firecrawl account at [firecrawl.dev](https://firecrawl.dev). You will need a Firecrawl API key to use the web scraping tool.
  - **AgentOps account**: Sign up for an AgentOps account at [agentops.ai](https://agentops.ai) to use agent observability features. You will need an AgentOps API key.

## Building the Web Scraper agent

This section walks through each step, from initializing the project to running the agent crew.

### Project setup with AgentStack CLI

Start by initializing a new AgentStack project with the CLI.

- **Initialize an AgentStack project:**

  Open your terminal and run the following command to initialize a new AgentStack project named `web_scraper`:

  ```bash
  agentstack init web_scraper
  ```

  AgentStack CLI will prompt you to select a template. Choose the **Empty Project** template for this guide.

  ![AgentStack Project Template](/docs/guides/agentstack-default-template.png)

- **Navigate to your project directory and activate the virtual environment:**

  ```bash
  cd web_scraper && source .venv/bin/activate
  ```

### Project structure

After initialization, your project directory `web_scraper` will have the following structure:

```
web_scraper/
├── agentstack.json     # AgentStack project configuration
├── pyproject.toml      # Python dependencies
├── .env                # environment variables file
├── src/
│   ├── crew.py         # Defines your agent crew and workflow
│   ├── main.py         # Main script to run your agent
│   ├── config/         # Configuration files
│       ├── agents.yaml   # Agent configurations
│       └── tasks.yaml    # Task configurations
```

### Generating agents with AgentStack CLI

We will create 3 agents for our Web Scraper crew:

- **`web_scraper`:** Responsible for web scraping and markdown extraction.
- **`data_extractor`:** Specialized in extracting structured data from web content.
- **`content_storer`:** Manages storing extracted data in a Lakebase Postgres database.

Now, let's generate the agents using the AgentStack CLI.

1. **Generate `web_scraper` agent:**

   ```bash
   agentstack generate agent web_scraper
   ```

   When creating the first agent, `agentstack` will ask you to choose a default Large Language Model (LLM). We recommend `openai/gpt-4o-mini` for this guide, as it offers a good balance between performance and cost. You will need to enter this model name manually, as it's not included in the default list.

   ![AgentStack LLM Model](/docs/guides/agentstack-llm-model.png)

2. **Generate `data_extractor` agent:**

   ```bash
   agentstack generate agent data_extractor
   ```

3. **Generate `content_storer` agent:**

   ```bash
   agentstack generate agent content_storer
   ```

   Each command generates the basic structure for an agent or task, so you don't write the boilerplate by hand.

### Configuring agents in `agents.yaml`

Open `src/config/agents.yaml` and configure the agents as follows:

```yaml shouldWrap
web_scraper:
  role: >-
    Web scraper specializing in markdown extraction.
  goal: >-
    Visit a website and accurately return its content in markdown format.
  backstory: >-
    You are a meticulous data entry employee with expertise in web scraping and markdown formatting. Your task is to retrieve website content and present it clearly in markdown.
  llm: openai/gpt-4o-mini
data_extractor:
  role: >-
    Data extraction expert for web content analysis.
  goal: >-
    Analyze web page content and extract structured information
  backstory: >-
    You are an expert data analyst skilled in extracting key information from web pages. You are adept at identifying and listing key details such as blog post titles, author names, and publication dates from website content.
  llm: openai/gpt-4o-mini
content_storer:
  role: >-
    Database engineer
  goal: >-
    Store structured web content in a Postgres database, create relevant tables, insert data, and formulate SQL queries to retrieve stored data.
  backstory: >-
    You are an expert database engineer. You are skilled in database design, data insertion, and writing efficient SQL queries for data retrieval.
  llm: openai/gpt-4o-mini
```

AgentStack uses YAML configuration files to define the roles, goals, and backstories of our agents. You can change or extend the crew by editing these files instead of the code.

### Generating tasks with AgentStack CLI

Now that we have our agents defined, we need to create tasks for them. Tasks define the specific actions each agent will perform within the agent crew's workflow.

For this example the task for the AI agent is simple: get the list of blog post titles, author names, and publication dates from our [guides page](/guides) and store it in a Postgres database.

We will need three tasks for our Web Scraper crew:

1. **Generate `scrape_site` task:**

   ```bash
   agentstack generate task scrape_site
   ```

2. **Generate `extract` task:**

   ```bash
   agentstack generate task extract
   ```

3. **Generate `store` task:**

   ```bash
   agentstack generate task store
   ```

### Configuring tasks in `tasks.yaml`

Open `src/config/tasks.yaml` and configure the tasks as follows:

```yaml shouldWrap
scrape_site:
  description: >-
    Fetch the content of https://neon.com/guides in markdown format. Ensure accurate and complete retrieval of website content.
  expected_output: >-
    The complete content of the website https://neon.com/guides, formatted in markdown.
  agent: >-
    web_scraper
extract:
  description: >-
    Analyze the provided website content and extract a structured list of blog post titles, author names, and publication dates. Limit the extraction to the first 20 blog posts.
  expected_output: >-
    A list of blog post titles, author names, and publication dates extracted from the website content.
  agent: >-
    data_extractor
store:
  description: >-
    Store the extracted blog post data into a Postgres database within Neon. Create a table named 'posts' and corresponding schema for the posts and insert them. After inserting the data, formulate and test an SQL query to retrieve all inserted data. Provide the tested SQL query as the output.
  expected_output: >-
    A valid and tested SQL query that retrieves all data inserted into the 'posts' table in the Neon database.
  agent: >-
    content_storer
```

Similar to agents, tasks are also configured via YAML, defining the description of the task, the expected output, and the agent assigned to perform it. The whole workflow is readable in one file.

### Adding Firecrawl and Neon tools to the Crew

To enable web scraping and data storage capabilities, we will integrate **Firecrawl** and **Neon** tools into our agent crew. We will use Firecrawl to scrape the `neon.com/guides` page and Neon to store the extracted data in a Postgres database.

- Add **Firecrawl** tool using the following command:

  ```bash
  agentstack tools add firecrawl
  ```

- Add **Neon** tool using the following command:

  ```bash
  agentstack tools add neon
  ```

The `agentstack tools add` command updates your project configuration and `crew.py` file to include the necessary tool classes.

#### Neon tool actions

AgentStack's Neon tool gives agents a set of pre-built actions for working with Neon databases. These actions are automatically available to any agent you equip with the Neon tool, like the `content_storer` agent in our example. The Neon tool provides the following actions:

- **`create_database`**: This action allows our agent to create a new Neon project and database on demand. It returns a connection URI, which later actions use to connect. By default, it creates a database named `neondb` with the role `neondb_owner`. This is useful for agents that manage their own isolated databases, or when the workflow itself needs to create the database.

- **`execute_sql_ddl`**: Agents use this action to execute Data Definition Language (DDL) commands. DDL commands are used to define the database schema, such as creating, altering, or dropping tables. For instance, the `content_storer` agent uses this action to create the `posts` table in the Neon database.

- **`run_sql_query`**: This action enables agents to run Data Manipulation Language (DML) queries like `SELECT`, `INSERT`, `UPDATE`, and `DELETE`. In the example, the `content_storer` agent uses this action to insert the scraped blog post metadata into the `posts` table and to formulate and test a `SELECT` query to retrieve the data. The results from these queries are returned to the agent as formatted strings, allowing the agent to process and reason about the data.

With these actions, agents can create a database, define its schema, and read and write data without you writing any database code.

#### Firecrawl tool actions

AgentStack's Firecrawl tool integration provides the agents with a set of actions to perform web scraping tasks. These actions are readily available to any agent equipped with the Firecrawl tool, like the `web_scraper` agent in our example. The Firecrawl tool offers the following actions:

- **`web_scrape`**: This action allows our agent to scrape the content of a single webpage and retrieve it in markdown format. Use it when you need the content of one specific page. The agent provides a URL, and Firecrawl returns the webpage's content as markdown text.

- **`web_crawl`**: For more extensive data gathering, the `web_crawl` action enables our agent to initiate a web crawl starting from a given URL. This action scrapes the initial URL and then explores and scrapes content from linked pages that are children of the starting URL. The crawl is limited to sublinks of the provided URL, preventing it from venturing to entirely separate sections of a website or different domains. This action is asynchronous and returns a `crawl_id`.

- **`retrieve_web_crawl`**: Since `web_crawl` is an asynchronous operation, we use the `retrieve_web_crawl` action to get the results of a crawl that was initiated previously using the `web_crawl` action. This action requires the `crawl_id` that was returned by the initial `web_crawl` action. It checks the status of the crawl and returns the scraped content once the crawl is complete. Agents can call this action in a loop or after a delay to check for and retrieve crawl results, so a crawl can run as one step in a longer process.

We can improve the efficiency of our agents by specifying their tool usage in crew.py. The `web_scraper` agent only needs Firecrawl, the `content_storer` agent only needs Neon, and the `data_extractor` agent needs no tool. Assigning tools per agent keeps each agent's context smaller and its task more focused.

Your `src/crew.py` file should now look like this, with the tools integrated into the respective agents:

```python shouldWrap
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
import agentstack


@CrewBase
class WebscraperCrew:
    """web_scraper crew"""

    @agent
    def web_scraper(self) -> Agent:
        return Agent(
            config=self.agents_config["web_scraper"],
            tools=[*agentstack.tools["firecrawl"]],
            verbose=True,
        )

    @agent
    def data_extractor(self) -> Agent:
        return Agent(
            config=self.agents_config["data_extractor"],
            tools=[],
            verbose=True,
        )

    @agent
    def content_storer(self) -> Agent:
        return Agent(
            config=self.agents_config["content_storer"],
            tools=[*agentstack.tools["neon"]],
            verbose=True,
        )

    @task
    def scrape_site(self) -> Task:
        return Task(
            config=self.tasks_config["scrape_site"],
        )

    @task
    def extract(self) -> Task:
        return Task(
            config=self.tasks_config["extract"],
        )

    @task
    def store(self) -> Task:
        return Task(
            config=self.tasks_config["store"],
        )

    @crew
    def crew(self) -> Crew:
        """Creates the Test crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )

```

### Configure API keys in `.env`

To authenticate with OpenAI, Neon, and Firecrawl, you need to configure API keys. Open the `.env` file and fill in your API keys obtained in the [Prerequisites](#prerequisites) section:

```env
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
NEON_API_KEY=YOUR_NEON_API_KEY
FIRECRAWL_API_KEY=YOUR_FIRECRAWL_API_KEY
AGENTOPS_API_KEY=YOUR_AGENTOPS_API_KEY
```

### Running the Web Scraper agent

Now that we have set up our agents, tasks, and tools, run the agent crew to scrape the `neon.com/guides` page, extract blog post metadata, and store it in a Lakebase Postgres database.

```bash
agentstack run
```

This command will:

- Initialize the AgentStack environment.
- Load agent and task configurations.
- Instantiate the agent crew defined in `src/crew.py`.
- Execute the tasks in sequence.
- Use the `neon` and `firecrawl` tools within the agents' tasks as defined in `src/crew.py`.
- Print the final output to your terminal.

You should see the agent's execution logs and the final output, including the final SQL query generated by the `content_storer` agent.

![Web Scraper Agent Output 1](/docs/guides/agentstack-neon-example-output-1.png)
![Web Scraper Agent Output 2](/docs/guides/agentstack-neon-example-output-2.png)

### Verifying the output

After the agent run completes, check your terminal for the output. It should display the SQL query generated by the `content_storer` agent.

You can verify that the data has been stored in your Neon database by:

- Logging into your Neon account at [console.neon.tech](https://console.neon.tech).
- Navigating to your project and database.
- Clicking on the `Tables` tab to view the `posts` table created by the agent.

![Neon SQL Editor](/docs/guides/agentstack-neon-database-data.png)

<Admonition type="info" title="AgentOps observability">

AgentStack integrates with [**AgentOps**](https://www.agentops.ai) by default to provide observability for your AI agents. Built by the same team behind AgentStack, AgentOps allows you to:

- **Visualize agent execution:** See step-by-step execution graphs of your agents to understand workflows and debug issues.
- **Track LLM costs:** Monitor your spending on LLM providers.
- **Benchmark agent performance:** Evaluate agent performance and output quality.
- **Detect security issues:** Flag potential vulnerabilities like prompt injection.

![AgentOps Visualization](/docs/guides/agentops-visualization.png)

To use AgentOps, make sure you have your `AGENTOPS_API_KEY` configured in your `.env` file (as covered in the [Prerequisites](#prerequisites)). AgentOps automatically starts tracking your agent executions when you run `agentstack run` because of the `agentops.init()` call in `src/main.py`.

In our run, the AgentOps dashboard showed a total cost of $0.01 in OpenAI credits. The agent scrapes the page and writes the SQL without any custom scraping or database code.
</Admonition>

You have built and run a Web Scraper agent using AgentStack, Neon, and Firecrawl. It extracts data from a web page and stores the results in a Postgres database on Neon.

## Next steps

- **Explore more tools:** Browse AgentStack's [community tools](https://docs.agentstack.sh/tools/community), including Perplexity (knowledge retrieval), Composio (platform connections), and Stripe (payments).
- **Expand your crew:** Add more agents and tasks to handle complex workflows.
- **Monitor performance:** Use [AgentOps](https://docs.agentops.ai/) to track and optimize execution and costs.

You can find the source code for the application described in this guide on GitHub.

<DetailIconCards>
    <a href="https://github.com/neondatabase-labs/neon-agenstack-example" description="AgentStack + Neon Example" icon="github">Building AI Agents with AgentStack and Neon</a>
</DetailIconCards>

## Resources

- [AgentStack Documentation](https://docs.agentstack.sh/introduction)
- [AgentOps Documentation](https://docs.agentops.ai/)
- [Firecrawl Documentation](https://docs.firecrawl.dev/introduction)
- [Firecrawl AgentStack Tool](https://docs.agentstack.sh/tools/tool/firecrawl)
- [CrewAI Documentation](https://docs.crewai.com/introduction)
- [Neon AgentStack Tool](https://docs.agentstack.sh/tools/tool/neon)
- [Neon API Reference](/docs/reference/api)
- [Neon API keys](/docs/manage/api-keys#creating-api-keys)

<NeedHelp/>
