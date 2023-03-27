---
title: ChatGPT plugins  
subtitle: Learn how to use Neon PostgreSQL as a vector database for your ChatGPT retrieval plugin
enableTableOfContents: true
isDraft: false
---

This guide describes how to set up and run a [ChatGPT Retrieval Plugin](https://github.com/openai/chatgpt-retrieval-plugin) with Neon as the vector database.

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

4. Install [poetry](https://python-poetry.org/docs/). It's required for dependency management and packaging in Python.

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

## Set Environment Variables

Set the required environment variables for PostgreSQL and Neon as the vector database:

```bash
export DATASTORE=<your_datastore>
export BEARER_TOKEN=<your_bearer_token>
export OPENAI_API_KEY=<your_openai_api_key>
```

Set the `DATABASE_URL` environment variable to your Neon PostgreSQL connection string:

```bash
export DATABASE_URL=<connection_string>
```

You can obtain a connection string from the **Connection Details** widget on th Neon **Dashboard**. For instructions, see [Connect from any application](/docs/connect/connect-from-any-app).



### Run the API Locally

Run the API locally.

```bash
poetry run start
```

Access the API documentation at [http://0.0.0.0:8000/docs](http://0.0.0.0:8000/docs) and test the API endpoints (make sure to add your bearer token).

For more detailed information on setting up, developing, and deploying a ChatGPT Retrieval Plugin, refer to the full [Development](https://github.com/openai/chatgpt-retrieval-plugin#development) section in the `openai/chatgpt-retrieval-plugin`  repository.

## Conclusion

By enabling Neon PostgreSQL as a vector database option for ChatGPT plugins, we provide developers with more choice and flexibility in creating powerful chatbot applications. We encourage you to give it a try and experience the benefits of using Neon as your vector database for ChatGPT Retrieval Plugins.
