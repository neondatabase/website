---
title: Implementing Webhooks with FastAPI and Neon Postgres
subtitle: Learn how to build a webhook system to receive and store event data using FastAPI and Neon Postgres
author: bobbyiliev
enableTableOfContents: true
createdAt: '2025-03-23T00:00:00.000Z'
updatedOn: '2025-03-23T00:00:00.000Z'
---

Webhooks are a way for services to communicate with each other by sending HTTP requests when specific events occur. They allow your application to receive real-time data from other services without having to constantly poll for updates.

In this guide, you'll learn how to implement a webhook system using FastAPI to receive event notifications and Neon Postgres to store and process the webhook data. We'll build a simple but practical webhook receiver that can handle events from GitHub, making this applicable to real-world development workflows.

## Prerequisites

To follow this guide, you need:

- [Python 3.9+](https://www.python.org/downloads/) installed
- Basic knowledge of Python and FastAPI
- A [Neon](https://console.neon.tech/signup) account
- [ngrok](https://ngrok.com/) or similar tool for exposing your local server (for testing)
- A [GitHub](https://github.com/) account (for testing the webhook)

## Create a Neon Project

Let's start by creating a new Neon project and setting up a Postgres database:

1. Log in to your [Neon Console](https://console.neon.tech)
2. Click "New Project"
3. Enter a name for your project, like "webhook-receiver"
4. Select your preferred region
5. Click "Create Project"

Once your project is created, you'll see the connection details. Save these details as we'll need them for our FastAPI application.

## Set Up a FastAPI Project

FastAPI is a modern web framework for building APIs with Python. It's based on standard Python type hints and provides automatic OpenAPI documentation.

Now, let's set up a basic FastAPI project structure:

1. Create a new directory for your project and navigate to it:

```bash
mkdir webhook-receiver
cd webhook-receiver
```

2. Create a virtual environment and activate it:

```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

3. Install the required packages:

```bash
pip install fastapi uvicorn sqlalchemy asyncpg python-dotenv pydantic pydantic-settings httpx psycopg2-binary greenlet
```

4. Create a basic directory structure:

```bash
mkdir app
touch app/__init__.py
touch app/main.py
touch app/config.py
touch app/models.py
touch app/database.py
touch .env
```

5. Set up the environment variables by adding the following to the `.env` file:

```
DATABASE_URL=postgres://[user]:[password]@[hostname]/[database]?sslmode=require
WEBHOOK_SECRET=your_webhook_secret  # We'll use this later for verification
```

Replace the placeholders in the `DATABASE_URL` with your Neon connection details.

## Design the Database Schema

Before implementing our webhook receiver, we need to design the database schema. For our GitHub webhook example, we'll create a table to store webhook events with the following fields:

- `id`: A unique identifier for each webhook event
- `event_type`: The type of event (e.g., "push", "pull_request")
- `delivery_id`: The unique ID provided by GitHub for the webhook delivery
- `signature`: The signature sent with the webhook for verification
- `payload`: The JSON payload of the webhook
- `processed`: A boolean indicating if the webhook has been processed
- `created_at`: When the webhook was received

Now, let's set up the database connection and models.

## Create the Database Models

First, let's set up the configuration file (`app/config.py`):

```python
# app/config.py
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    database_url: str
    webhook_secret: str

    class Config:
        env_file = ".env"

settings = Settings()
```

Here, we're using `pydantic-settings` to load environment variables from the `.env` file.

Next, let's set up the database connection (`app/database.py`):

```python
# app/database.py
import ssl
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings
from urllib.parse import urlparse

# Setup SSL context
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# Parse the database URL to remove query parameters
# that can cause issues with asyncpg
parsed_url = urlparse(settings.database_url)
db_user = parsed_url.username
db_password = parsed_url.password
db_host = parsed_url.hostname
db_port = parsed_url.port or 5432
db_name = parsed_url.path.lstrip('/')

# Create an async database URL without the query parameters
ASYNC_DATABASE_URL = f"postgresql+asyncpg://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

# Create an async SQLAlchemy engine with SSL configuration
engine = create_async_engine(
    ASYNC_DATABASE_URL,
    connect_args={"ssl": ssl_context},
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800,
    pool_pre_ping=True,
    echo=False
)

# Create a session factory for creating database sessions
async_session = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Create a base class for declarative models
Base = declarative_base()

# Dependency to get an async database session
async def get_db():
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

With the above code, we've set up the database connection and a dependency to get an async database session in our FastAPI application.

Now let's create our database models (`app/models.py`) which will represent the webhook events:

```python
# app/models.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON
from sqlalchemy.sql import func
from app.database import Base

class WebhookEvent(Base):
    __tablename__ = "webhook_events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, index=True)
    delivery_id = Column(String, unique=True, index=True)
    signature = Column(String)
    payload = Column(JSON)
    processed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<WebhookEvent(id={self.id}, event_type='{self.event_type}')>"
```

This model represents a webhook event with the fields we defined earlier. We'll use this model to store webhook events in our Postgres database.

## Implement Webhook Endpoints

With the database models in place, we can now implement the webhook endpoint to receive and store GitHub webhook events.

Now, let's implement the FastAPI application with our webhook endpoint. Update `app/main.py`:

```python
# app/main.py
import json
import hmac
import hashlib
from fastapi import FastAPI, Request, Depends, Header, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db, engine, Base
from app.models import WebhookEvent
from app.config import settings

app = FastAPI(title="Webhook Receiver")

# Create database tables if they don't exist
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    return {"message": "Webhook Receiver is running"}

@app.get("/webhooks/events")
async def view_webhook_events(limit: int = 10, db: AsyncSession = Depends(get_db)):
    """View recent webhook events - useful for debugging."""
    result = await db.execute(select(WebhookEvent).order_by(WebhookEvent.created_at.desc()).limit(limit))
    events = result.scalars().all()
    return events

@app.post("/webhooks/github")
async def github_webhook(
    request: Request,
    x_github_event: str = Header(None),
    x_github_delivery: str = Header(None),
    x_hub_signature_256: str = Header(None),
    db: AsyncSession = Depends(get_db)
):
    # Read the request body
    body = await request.body()

    # Verify the webhook signature (we'll implement this next)
    is_valid = verify_signature(body, x_hub_signature_256)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid signature"
        )

    # Parse the JSON payload
    try:
        payload = json.loads(body)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON payload"
        )

    # Store the webhook event in the database
    webhook_event = WebhookEvent(
        event_type=x_github_event,
        delivery_id=x_github_delivery,
        signature=x_hub_signature_256,
        payload=payload,
        processed=False
    )

    db.add(webhook_event)
    await db.commit()
    await db.refresh(webhook_event)

    # Process the webhook event (we'll implement this later)
    await process_webhook_event(webhook_event.id, db)

    return {"status": "success", "event_id": webhook_event.id}

# Placeholder functions to be implemented
def verify_signature(body, signature):
    # We'll implement this next
    return True

async def process_webhook_event(event_id, db):
    # We'll implement this later
    pass
```

Here we are setting up a FastAPI application with a `/webhooks/github` endpoint to receive GitHub webhook events. The endpoint reads the request body, verifies the webhook signature, parses the JSON payload, stores the event in the database, and processes the event asynchronously.

## Add Webhook Verification

GitHub sends a signature with each webhook to verify that the webhook is coming from GitHub. Let's implement the signature verification function:

```python
def verify_signature(body, signature):
    if not signature:
        return False

    # The signature from GitHub starts with 'sha256='
    if not signature.startswith("sha256="):
        return False

    # Remove the 'sha256=' prefix
    signature = signature[7:]

    # Calculate the HMAC SHA256 signature using our webhook secret
    secret = settings.webhook_secret.encode()
    expected_signature = hmac.new(secret, body, hashlib.sha256).hexdigest()

    # Compare the calculated signature with the one from GitHub
    return hmac.compare_digest(expected_signature, signature)
```

Replace the placeholder `verify_signature` function with this implementation. This function verifies the webhook signature by calculating the HMAC SHA256 signature using the webhook secret and comparing it with the signature sent by GitHub.

## Process Webhook Events

Now, let's implement the `process_webhook_event` function to handle different types of GitHub webhook events:

```python
async def process_webhook_event(event_id, db):
    # Fetch the webhook event from the database
    result = await db.execute(select(WebhookEvent).where(WebhookEvent.id == event_id))
    event = result.scalars().first()

    if not event:
        return

    try:
        # Process different event types
        if event.event_type == "push":
            await process_push_event(event)
        elif event.event_type == "pull_request":
            await process_pull_request_event(event)
        elif event.event_type == "issues":
            await process_issue_event(event)
        # Add more event types as needed

        # Mark the event as processed
        event.processed = True
        await db.commit()

    except Exception as e:
        print(f"Error processing webhook event {event_id}: {e}")

async def process_push_event(event):
    """Process a GitHub push event."""
    payload = event.payload
    repo_name = payload.get("repository", {}).get("full_name")
    ref = payload.get("ref")
    commits = payload.get("commits", [])

    print(f"Push to {repo_name} on {ref} with {len(commits)} commits")
    # Handle the push event based on the commits

async def process_pull_request_event(event):
    """Process a GitHub pull request event."""
    payload = event.payload
    action = payload.get("action")
    pr_number = payload.get("number")
    repo_name = payload.get("repository", {}).get("full_name")

    print(f"Pull request #{pr_number} {action} in {repo_name}")
    # Handle the pull request based on the action (opened, closed, etc.)

async def process_issue_event(event):
    """Process a GitHub issue event."""
    payload = event.payload
    action = payload.get("action")
    issue_number = payload.get("issue", {}).get("number")
    repo_name = payload.get("repository", {}).get("full_name")

    print(f"Issue #{issue_number} {action} in {repo_name}")
    # Handle the issue based on the action (opened, closed, etc.)
```

In the `process_webhook_event` function, we fetch the webhook event from the database and process it based on the event type. We've provided placeholder functions for processing different types of GitHub webhook events, such as push events, pull request events, and issue events. You can extend these functions to handle other event types as needed.

## Test Your Webhook Receiver

Now that we have implemented our webhook receiver, let's run it and test it with GitHub webhooks.

We will use ngrok to expose our local server to the internet so that GitHub can send webhook events to our FastAPI application. If you haven't installed ngrok yet, you can download it from [ngrok.com](https://ngrok.com/).

Once you have an account and ngrok installed, follow these steps to test your webhook receiver:

1. Start your FastAPI application:

```bash
uvicorn app.main:app --reload
```

2. Use ngrok to expose your local server to the internet:

```bash
ngrok http 8000
```

ngrok will provide you with a public URL (e.g., `https://abc123.ngrok.io`) that forwards to your local server. For testing, you can use this URL as the webhook endpoint. For production, you would want to deploy your FastAPI application to a server with a public IP address and domain along with an SSL certificate.

3. If you don't have a GitHub repository to test with, create a new repository or use an existing one, and set up a webhook:

   - Go to your GitHub repository
   - Click on "Settings" > "Webhooks" > "Add webhook"
   - Set "Payload URL" to your ngrok URL + `/webhooks/github` (e.g., `https://abc123.ngrok.io/webhooks/github`)
   - Set "Content type" to `application/json`
   - Set "Secret" to the same value as your `WEBHOOK_SECRET` in the `.env` file
   - Choose which events you want to receive (e.g., "Just the push event")
   - Click "Add webhook"

4. Trigger an event in your repository:

   - Make a commit and push to the repository
   - Create or update an issue
   - Open a pull request

5. Monitor your FastAPI application logs to see the webhook events being received and processed.

After following these steps, you should see the webhook events being received by your FastAPI application and processed based on the event type and then stored in your Neon Postgres database.

To view the stored webhook events, you can access the `/webhooks/events` endpoint. You should see the recent webhook events stored in the database returned as JSON.

If you were to visit the `/docs` endpoint of your FastAPI application, you would see the automatically generated API documentation with details about your webhook endpoint.

## Security Considerations

When implementing webhooks in a production environment, consider these security practices:

1. We implemented signature validation for GitHub webhooks, but make sure to do this for any webhook provider. Make sure to use a secure secret for signing the webhook payloads and store it securely.

2. Always use HTTPS to encrypt webhook payloads in transit.

3. Protect your webhook endpoint from abuse by implementing rate limiting.

4. Set reasonable timeouts for webhook processing to prevent long-running tasks from blocking your application.

5. Make sure your webhook handling is idempotent, meaning the same webhook can be processed multiple times without causing problems (useful for retries).

6. Store the raw webhook payload initially, then process it asynchronously. This helps with debugging and retrying failed webhooks.

## Conclusion

In this guide, you built a FastAPI application backed by Neon Postgres to securely receive and process webhook events. Along the way, you learned how to define a data model, implement a webhook endpoint, verify signatures, and handle different event types.

Webhooks are an important part of many API integrations, allowing your applications to respond to events in real-time. By combining FastAPI with Neon Postgres, you can build webhook receivers that can handle various types of event notifications from external services.

You can extend this basic webhook system to handle events from other services like Stripe (for payment notifications), Slack (for user interactions), or any other service that supports webhooks.

<NeedHelp />
