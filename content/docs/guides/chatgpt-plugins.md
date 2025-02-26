---
title: Set up the ChatGPT Retrieval Plugin with Neon  
subtitle: Learn how to set up and run the ChatGPT Retrieval Plugin with Neon as a vector database
enableTableOfContents: true
isDraft: false
---

The [ChatGPT Retrieval Plugin](https://github.com/openai/chatgpt-retrieval-plugin) enables enables semantic search and retrieval of personal or organizational documents using natural language queries. It allows users to obtain the most relevant document snippets from their data sources, such as files, notes, or emails, by asking questions or expressing needs in natural language. Enterprises can make their internal documents available to their employees through ChatGPT using this plugin.

Follow the steps below to get started.

## Install dependencies

Install the following dependencies:

1. Install Python 3.10, if not already installed. For instructions, see [Getting and installing the latest version of Python](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python), in the _Python documentation_.
2. Clone the ChatGPT Retrieval Plugin repository:

    ```bash
    git clone https://github.com/openai/chatgpt-retrieval-plugin.git
    ```

3. Navigate to the cloned repository directory:

    ```bash
    cd /path/to/chatgpt-retrieval-plugin
    ```

4. Install [poetry](https://python-poetry.org/docs/). It's required for dependency management.

    ```bash
    pip install poetry
    ```

5. Create a new virtual environment with Python 3.10:

    ```bash
    poetry env use python3.10
    ```

6. Activate the virtual environment:

    ```bash
    poetry shell
    ```

7. Install application dependencies:

    ```bash
    poetry install
    ```

## Install the pgvector extension on Neon

Install the `pgvector` extension on Neon:

1. Navigate to the Neon Console.
1. Select your Neon project.
1. Select **SQL Editor** from the sidebar.
1. Select the branch and database that you will use.
1. Run the following statement to install the `pgvector` extension:

```sql
CREATE EXTENSION pgvector
```

## Set local environment variables

Set the required local environment variables for the ChatGPT Retrieval Plugin.

```bash
export DATASTORE=<your_datastore>
export BEARER_TOKEN=<your_bearer_token>
export OPENAI_API_KEY=<your_openai_api_key>
export DATABASE_URL=<connection_string>
```

where:

- `DATASTORE`: This specifies the vector database provider you want to use to store and query embeddings. Set this value to `postgres`.
- `BEARER_TOKEN`: This is the secret token that you need to authenticate your requests to the API. You can generate one using any tool or method you prefer, such as [jwt.io](https://jwt.io/).
- `OPEN_API_KEY`: This is your OpenAI API key that you need to generate embeddings using the text-embedding-ada-002 model. You can get an API key by creating an account on [OpenAI](https://openai.com/). See [API keys](https://platform.openai.com/account/api-keys), in the _OpenAI documentation_.
- `DATABASE_URL`: This is the Neon PostgreSQL connection string for the database that you will use to store embeddings. You can obtain a connection string from the **Connection Details** widget on th Neon **Dashboard**. For instructions, see [Connect from any application](/docs/connect/connect-from-any-app). It will look similar to the following:

    ```text
    postgres://daniel:<password>@ep-aged-silence-344434.us-east-2.aws.neon.tech/neondb
    ```

## Run the API locally

Run the API locally.

```bash
poetry run start
```

You can access the API documentation at [http://0.0.0.0:8000/docs](http://0.0.0.0:8000/docs) and test the API endpoints (make sure to add your bearer token).

For more information on setting up, developing, and deploying the ChatGPT Retrieval Plugin, refer to the [Development](https://github.com/openai/chatgpt-retrieval-plugin#development) section in the `openai/chatgpt-retrieval-plugin` repository.

## Conclusion

By enabling Neon as a vector database option for ChatGPT plugins, we provide developers with more choice and flexibility in creating powerful chatbot applications. We encourage you to give it a try and experience the benefits of using Neon as the vector  database for the ChatGPT Retrieval Plugin.
