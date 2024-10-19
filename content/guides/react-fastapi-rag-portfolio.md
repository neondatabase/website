---
title: Building a Full-Stack Portfolio Website with a RAG Powered Chatbot
subtitle: Develop a modern React portfolio website featuring a chatbot powered by pgvector, Neon Postgres, FastAPI, and OpenAI.
author: sam-harri
enableTableOfContents: true
createdAt: '2024-10-17T00:00:00.000Z'
updatedOn: '2024-10-17T00:00:00.000Z'
---

In this guide, you will build a full-stack portfolio website using `React` for the frontend and `FastAPI` for the backend, featuring a Retrieval-Augmented Generation (RAG) chatbot that leverages `pgvector` on `Neon`'s serverless Postgres to store and retrieve embeddings created with `OpenAI`'s embedding model.

This project is perfect for showcasing technical skills through a portfolio that not only demonstrates front-end and back-end capabilities but also integrates AI to answer questions about your experience.

## Prerequisites

Before you start, ensure that you have the following tools and services ready:

- `pip`: This is required for installing and managing Python packages, including [uv](https://docs.astral.sh/uv/) for creating virtual environments. You can check if `pip` is installed by running the following command:
  ```bash
  pip --version
  ```
- Neon serverless Postgres : You will need a Neon account for provisioning and scaling your `PostgreSQL` database. If you don't have an account yet, [sign up here](https://console.neon.tech/signup).
- Node.js: Needed for developing the frontend using React, you can download it following the [official installation guide](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs).
- OpenAI API key: You need access to the OpenAI API for generating embeddings, you can [sign up here](https://platform.openai.com/signup).

## Setting up the Backend

Follow these steps to set up your backend for the full-stack portfolio website:

1.  Create the project structure.

    Since this is a full-stack project, your backend and frontend will be in separate directories within a single parent folder. Begin by creating the parent folder and moving into it

    ```bash
    mkdir portfolio_project
    cd portfolio_project
    ```

2.  Create a `uv` Python virtual environment.

    If you don't already have uv installed, you can install it with:

    ```bash
    pip install uv
    ```

    Once `uv` is installed, create a new project:

    ```bash
    uv init portfolio_backend
    ```

    This will create a new project directory called `portfolio_backend`. Open this directory in your code editor of your choice.

3.  Set up the virtual environment.

        You will now create and activate a virtual environment in which your project's dependencies will be installed.

        <CodeTabs labels={["Linux/macOS", "Windows"]}>
        `bash

    uv venv
    source .venv/bin/activate
    `
`bash
    uv venv
    .venv\Scripts\activate
    `
    </CodeTabs>

        You should see `(portfolio_backend)` in your terminal now, this means that your virtual environment is activated.

4.  Install dependencies.

    Next, add all the necessary dependencies for your project:

    ```bash
    uv add fastapi asyncpg uvicorn loguru python-dotenv openai pgvector
    ```

    where each package does the following:

    - `FastAPI` : A Web / API framework
    - `AsyncPG` : An asynchronous PostgreSQL client
    - `Uvicorn` : An ASGI server for our app
    - `Loguru` : A logging library
    - `Python-dotenv` : To load environment variables from a .env file
    - `openai` : The OpenAI API client for generating embeddings and chatbot responses
    - `pgvector` : A Python client for working with pgvector in PostgreSQL

5.  Create the project structure.

    Create the following directory structure to organize your project files:

    ```md
    portfolio_backend
    ├── src/
    │ ├── database/
    │ │ └── postgres.py
    │ ├── models/
    │ │ └── product_models.py
    │ ├── routes/
    │ │ └── product_routes.py
    │ └── main.py
    ├── .env  
    ├── .python-version
    ├── README.md  
    ├── pyproject.toml  
    └── uv.lock
    ```

## Setting up your Database

In this section, you will set up the `pgvector` extension using Neon's console, add the database's schema, and create the database connection pool and lifecycle management logic in FastAPI.

First, add pgvector to Postgres:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Next, add the schema to your database:

```sql
CREATE TABLE portfolio_embeddings (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding VECTOR(1536) NOT NULL
);
```

This table will store the embeddings generated by OpenAI for the chatbot responses. The `content` column will store the text for which the embedding was generated, and the `embedding` column will store the 1536-dimensional vector. An embedding is a representation of text in a high-dimensional space that captures the meaning of the text, allowing you to compare and search for similar text.

With your schema in place, you're now ready to connect to your database in the FastAPI application. To do this you must create a `.env` file in the root of the project to hold environment-specific variables, such as the connection string to your Neon PostgreSQL database, and API keys.

```bash
DATABASE_URL=postgres://user:password@your-neon-hostname.neon.tech/neondb?sslmode=require
OPENAI_API_KEY=your-api-key
OPENAI_ORG_ID=your-org-id
OPENAI_PROJECT_ID=your-project-id
```

Make sure to replace the placeholders (user, password, your-neon-hostname, etc.) with your actual Neon database credentials, which are available in the console, and to fetch the OpenAI key from the OpenAI console.

In your project, the `database.py` file manages the connection to `PostgreSQL` using `asyncpg` and its connection pool, which is a mechanism for managing and reusing database connections efficiently. With this, you can use asynchronous queries, allowing the application to handle multiple requests concurrently.

```python
import os
import asyncpg
from loguru import logger
from typing import Optional
from pgvector.asyncpg import register_vector

conn_pool: Optional[asyncpg.Pool] = None


async def init_postgres() -> None:
    """
    Initialize the PostgreSQL connection pool
    """
    global conn_pool
    try:
        logger.info("Initializing PostgreSQL connection pool...")

        async def initalize_vector(conn):
            await register_vector(conn)

        conn_pool = await asyncpg.create_pool(
            dsn=os.getenv("DATABASE_URL"), init=initalize_vector
        )
        logger.info("PostgreSQL connection pool created successfully.")

    except Exception as e:
        logger.error(f"Error initializing PostgreSQL connection pool: {e}")
        raise


async def get_postgres() -> asyncpg.Pool:
    """
    Get a reference to the PostgreSQL connection pool.

    Returns
    -------
    asyncpg.Pool
        The connection pool object to the PostgreSQL database.
    """
    global conn_pool
    if conn_pool is None:
        logger.error("Connection pool is not initialized.")
        raise ConnectionError("PostgreSQL connection pool is not initialized.")
    try:
        return conn_pool
    except Exception as e:
        logger.error(f"Failed to return PostgreSQL connection pool: {e}")
        raise


async def close_postgres() -> None:
    """
    Close the PostgreSQL connection pool.
    """
    global conn_pool
    if conn_pool is not None:
        try:
            logger.info("Closing PostgreSQL connection pool...")
            await conn_pool.close()
            logger.info("PostgreSQL connection pool closed successfully.")
        except Exception as e:
            logger.error(f"Error closing PostgreSQL connection pool: {e}")
            raise
    else:
        logger.warning("PostgreSQL connection pool was not initialized.")

```

`init_postgres` is responsible for opening the connection pool to the `PostgreSQL` database and `close_postgres` is responsible for gracefully closing all connections in the pool when the `FastAPI` app shuts down to properly manage the lifecycle of the database.

Throughout your API you will also need access to the pool to get connection instances and run queries. `get_postgres` returns the active connection pool. If the pool is not initialized, an error is raised.

## Defining the Pydantic Models

Now, you will create the models that represent the data structures used in your API. These models will be used to validate the request and response data in your API endpoints. The API will use these models to serialize and deserialize data between the client and the server. For your API, you will need to complete a chat request and add embeddings to the database.

```python
from pydantic import BaseModel
from typing import Optional


class PortfolioEntryCreate(BaseModel):
    content: str


class PortfolioEntryResponse(BaseModel):
    id: int
    content: str
    embedding: Optional[list[float]]


class QueryRequest(BaseModel):
    query: str


class QueryResponse(BaseModel):
    content: str
    similarity: float
```

Each of the models represent the following:

- `PortfolioEntryCreate`: Represents the input for creating a new embedding
- `PortfolioEntryResponse`: Represents the output of a created embedding
- `QueryRequest`: Represents a question to ask the chatbot
- `QueryResponse`: Represents the response from the chatbot

## Creating the API Endpoints

In this section, you will create the API routes for adding new portfolio entries and chatting with the chatbot. The `add-portfolio-entry` route will add a new portfolio entry to the database and store its embedding. The `chat` route will use the stored embeddings to generate a response to a user query.

A typical RAG chatbot workflow involves first creating an embedding for the user query, then finding the most similar embeddings in the database, and finally using the context of these embeddings to generate a response. Here, embeddings are generated using OpenAI's text-embedding-3-small model, and the similarity between embeddings is calculated using the `<=>` operator in PostgreSQL, which represents the cosine similarity between two vectors. The chatbot response is then generated using OpenAI's GPT-4o-mini model.

```python
from fastapi import APIRouter, HTTPException, Depends
from models.models import PortfolioEntryCreate, PortfolioEntryResponse, QueryRequest
from database.postgres import get_postgres
import asyncpg
from typing import List
import os
from openai import OpenAI
import numpy as np

router = APIRouter()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    organization=os.getenv("OPENAI_ORG_ID"),
    project=os.getenv("OPENAI_PROJECT_ID"),
)


async def generate_embedding(content: str) -> List[float]:
    """
    Generate an embedding for the given content using OpenAI API.
    """
    try:
        content = content.replace("\n", " ")
        response = client.embeddings.create(
            input=[content],
            model="text-embedding-3-small",
        )
        return response.data[0].embedding
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating embedding: {e}")


@router.post("/add-entry/", response_model=PortfolioEntryResponse)
async def add_portfolio_entry(
    entry: PortfolioEntryCreate, pool: asyncpg.Pool = Depends(get_postgres)
):
    """
    Add a new portfolio entry and store its embedding in PostgreSQL.
    """
    try:
        embedding = await generate_embedding(entry.content)

        embedding_np = np.array(embedding)

        async with pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                INSERT INTO portfolio_embeddings (content, embedding)
                VALUES ($1, $2)
                RETURNING id, content, embedding
                """,
                entry.content,
                embedding_np,
            )
            if row:
                return PortfolioEntryResponse(
                    id=row["id"], content=row["content"], embedding=row["embedding"]
                )
            else:
                raise HTTPException(
                    status_code=500, detail="Failed to insert entry into the database."
                )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add entry: {e}")


@router.post("/chat/")
async def chat(query: QueryRequest, pool: asyncpg.Pool = Depends(get_postgres)):
    """
    Chat with the portfolio chatbot by retrieving relevant information from stored embeddings
    and using it as context to generate a response.
    """
    try:
        query_embedding = await generate_embedding(query.query)

        query_embedding_np = np.array(query_embedding)

        async with pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT content, embedding <=> $1 AS similarity
                FROM portfolio_embeddings
                ORDER BY similarity
                LIMIT 5
                """,
                query_embedding_np,
            )

            context = "\n".join([row["content"] for row in rows])

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are YOUR NAME, and you are answering questions as yourself, using 'I' and 'my' in your responses. "
                        "You should respond to questions about your portfolio, skills, experience, and education. For example, you should answer questions about specific technologies you've worked with, such as Java, React, or other tools. "
                        "If you have relevant experience with a technology, describe it concisely. For example, if asked about Java, describe your experience using it. "
                        "You should also answer questions about your education, including your experience at school, and your work in relevant industries. "
                        "However, if a question is completely unrelated to your professional experience, such as questions about recipes, trivia, or non-technical personal matters, respond with: 'That question isn't relevant to my experience or skills.' "
                        "Focus on answering technical and career-related questions, but only reject questions that are clearly off-topic."
                        "If they ask you about a technology you havent used, you can say: 'I haven't worked with that technology yet, but I'm always eager to learn new things.'"
                        "Answer any personal questions that are related to technology, like 'What are our favorite languages?' or 'What technology/language/anything tech are you most excited about?'"
                    ),
                },
                {
                    "role": "user",
                    "content": f"Context: {context}\n\nQuestion: {query.query}",
                },
            ],
            max_tokens=200,
            stream=False,
        )

        return {"response": response.choices[0].message.content}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to process chat request: {e}"
        )

```

In the `chat` route, the chatbot is sent the text obtained from RAG and the user questions, but is also sent a system message that sets the context for the chatbot. You can customize this message to provide additional context or instructions to the chatbot, and to guide the chatbot's responses to your liking.

## Running the Application

After setting up the database, models, and API routes, the next step is to run the `FastAPI` application.

The `main.py` file defines the `FastAPI` application, manages the database lifecycle, and includes the routes you created above.

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database.postgres import init_postgres, close_postgres
from routes.routes import router
import dotenv
import uvicorn


@asynccontextmanager
async def lifespan(app: FastAPI):
    dotenv.load_dotenv()
    await init_postgres()
    yield
    await close_postgres()


app: FastAPI = FastAPI(lifespan=lifespan, title="FastAPI Portfolio RAG ChatBot API")
app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

```

Since you will be connecting your application from the frontend, you will need to allow CORS (Cross Origin Resource Sharing). The `CORSMiddleware` is added such that the API can accept requests from any origin, including your React app.

To run the application, use uvicorn CLI with the following command:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Adding Embeddings to the Database

You can now add embeddings to the database by sending a POST request to the `/add-entry` endpoint with the content you want to store. To do this, you can use a tool like `curl`,`Postman`, `httpie`, or any other HTTP client. For example, using `httpie`:

```bash shouldWrap
http POST http://localhost:8000/add-entry/ content="YOUR CONTENT"
```

For the best results, you should add a variety of portfolio entries that cover different aspects of your experience and skills. This will help the chatbot generate more accurate responses to user queries.

## Testing the Chatbot

Using `httpie`, you can test the chatbot by sending a POST request to the `/chat` endpoint with a user query. For example:

```bash shouldWrap
http POST http://localhost:8000/chat/ query="What is your favorite programming language?"
```

The chatbot will respond with a relevant answer based on the embeddings stored in the database, something like:

```json shouldWrap
{
  "response": "My favorite programming language right now is Rust, with Python coming in a close second. I love the performance and safety features of Rust, and the simplicity and readability of Python."
}
```

## Setting up the Frontend

Now that the backend is set up and running, it's time to set up the frontend using React. The frontend will be responsible for interacting with the FastAPI backend and displaying your portfolio, as well as allowing users to ask questions to the RAG-powered chatbot.

1. Clone the frontend repository.

   First, go back to the parent directory (portfolio_project) you created at the beginning of this guide and clone the frontend repository:

   ```bash
   cd ..
   git clone https://github.com/sam-harri/portfolio_frontend
   ```

   Then, open up that new directory in your code editor.

2. Install the dependencies.

   Once you have cloned the frontend repository, install the necessary dependencies using `npm`:

   ```bash
   npm install
   ```

   This will install all the packages specified in the `package.json` file, which are required for the React app to run.

3. Update the frontend content.

   Now, you will update the content of your portfolio, such as your bio, projects, and skills, and experience to match your personal details. Each of the section in the portfolio is a separate component that you can modify to include your own information.
   These include:

   - Landing: The landing page of the portfolio, which includes your name, bio, and a profile picture.
   - Experience: A section that lists your work experience, including the company name, logo, your position, and a brief description of your role.
   - Skills: A section that lists your technical skills, such as programming languages, frameworks, and tools you are proficient in. Find the logos of your technologies at [Devicon](https://devicon.dev/)
   - Projects: A section that lists your projects, including the project name, description, and a link to the project's GitHub repository or live demo.

   The chatbot component is responsible for sending user queries to the backend and displaying the chatbot responses, and can be found in the `Chatbot.tsx` file.

## Running the Frontend

Once you've updated the content, you can start the frontend development server to preview your portfolio website.

To start the development server, run the following command:

```bash
npm run dev
```

This will start the React development server at http://localhost:3000. Open your browser and navigate to that address to view your portfolio website.

Now, with the React app running, take a look at how the website appears. Ensure that the design, content, and overall presentation are what you expect. You can interact with the chatbot (which will not yet be functional until the backend is also running) to check the layout and form submission.

To test the chatbot functionality, you will need to have the backend running as well. To do this, open another console window, navigate to the `portfolio_backend` directory, and run the FastAPI application using the `uvicorn` command as shown earlier.
Once the API is running, you can interact with the chatbot on the frontend to test the chatbot functionality, try out some prompts, tweak the responses, and see how the chatbot performs.

## Optional: Running the Full-Stack Project Using Docker and Docker Compose

In this optional section, you will containerize both the frontend and backend of your full-stack portfolio website using Docker. By using Docker, you can ensure that your application runs consistently across different environments without worrying about dependencies and setups. Docker Compose will allow you to orchestrate running both services (frontend and backend) with a single command.

The only prerequisite for this section is having Docker installed on your machine. If you don't have it installed, you can follow the [Docker installation guide](https://docs.docker.com/engine/install/).

1. Dockerize the backend.

   To Dockerize the backend, you will create a `Dockerfile` in the `portfolio_backend` directory. This file will define the steps to build the Docker image for your FastAPI application.

   ```Dockerfile
   FROM python:3.10-slim

   ENV PYTHONDONTWRITEBYTECODE=1
   ENV PYTHONUNBUFFERED=1

   WORKDIR /app

   COPY . /app

   RUN pip install uv

   RUN uv pip install -r pyproject.toml --system

   WORKDIR /app/src

   EXPOSE 8000

   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
   ```

   This Dockerfile:

   - Copies your FastAPI app into the container
   - Installs all necessary Python dependencies
   - Exposes port 8000, which is where FastAPI will run
   - Runs the FastAPI app using uvicorn

2. Dockerize the frontend.

   Dockerizing the frontend is similar to the backend. Create a `Dockerfile` in the root of the `portfolio_frontend` directory:

   ```Dockerfile
   FROM node:18-alpine AS base

   WORKDIR /app

   COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

   RUN \
   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
   elif [ -f package-lock.json ]; then npm ci; \
   elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
   else echo "Lockfile not found." && exit 1; \
   fi

   COPY . .

   RUN npm run build

   RUN npm install -g serve

   EXPOSE 3000

   CMD ["serve", "-s", "dist"]
   ```

   This Dockerfile:

   - Uses Node.js to install frontend dependencies
   - Builds the React application
   - Serves the static build using the serve package
   - Exposes port 3000 where the React app will be available

3. Set up Docker Compose.

   Docker Compose simplifies the process of running multiple containers together. You can define both the frontend and backend in a single configuration and run them together with a single command.

   Below is the `docker-compose.yml` file, placed at the root of the project, which sets up both the services:

   ```yaml
   services:
   api:
     build:
     context: portfolio_backend/
     dockerfile: Dockerfile
     ports:
       - '8000:8000'
     env_file:
       - portfolio_backend/.env
   nextjs-app:
     build:
       context: portfolio_frontend/
       dockerfile: Dockerfile
     ports:
       - '3000:3000'
     environment:
       - NODE_ENV=production
     depends_on:
       - api
   ```

4. Run the application with Docker Compose.

   Once your Dockerfiles and Docker Compose file are ready, you can bring up the entire stack using:

   ```bash
   docker-compose up --build
   ```

   This command will:

   - Build the Docker images for both the backend and frontend
   - Start both the FastAPI backend (on port 8000) and the React frontend (on port 3000)
   - Automatically manage the service dependencies (the frontend will wait until the backend is up before starting)

   Using Docker and Docker Compose to run your full-stack portfolio website simplifies the process of managing dependencies and ensures consistency across different environments. You can now run your entire application, both frontend and backend, in isolated containers with a single command. This setup is also beneficial if you plan to deploy your application to production in a cloud environment or if you want to share the project with others who can run it without manual installation steps.

## Conclusion

You have successfully built and deployed a full-stack portfolio website powered by React, FastAPI, pgvector, Neon Postgres, and OpenAI. By leveraging OpenAI embeddings and the RAG-powered chatbot, you added an AI-driven layer to your portfolio that can dynamically answer questions about your projects, skills, and experience.

The next steps in the project could include deploying the application to a cloud platform like AWS, Azure, or Google Cloud, adding more features to the chatbot, or customizing the frontend design to match your personal style. You can also extend the chatbot's capabilities by fine-tuning it on more data or using a different model for generating responses.