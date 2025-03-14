---
title: Building a High-Performance API with FastAPI, Pydantic, and Neon Postgres
subtitle: Learn how to create an API for managing a tech conference system using FastAPI, Pydantic for data validation, and Neon's serverless Postgres for data storage
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-08-17T00:00:00.000Z'
updatedOn: '2024-08-17T00:00:00.000Z'
---

FastAPI is a high-performance Python web framework for building APIs quickly and efficiently.

When combined with Pydantic for data validation and Neon's serverless Postgres for data storage, you can create a powerful and efficient API with minimal effort.

In this guide, we'll walk through the process of building an API for managing a tech conference system, focusing on best practices and performance optimizations.

## Prerequisites

Before we begin, make sure you have the following:

- Python 3.9 or later installed on your system
- [pip](https://pip.pypa.io/en/stable/installation/) for managing Python packages
- A [Neon](https://console.neon.tech/signup) account for serverless Postgres

## Setting up the Project

Let's start by creating a new project directory and setting up a virtual environment:

1. Create a new directory and navigate to it:

   ```bash
   mkdir fastapi-neon-conference-api
   cd fastapi-neon-conference-api
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   ```

   Creating a virtual environment isolates your project dependencies from other Python installations on your system.

3. Activate the virtual environment:

   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```bash
     source venv/bin/activate
     ```

   You should see `(venv)` in your terminal prompt, indicating that the virtual environment is active.

Now, let's install the necessary packages for our project using `pip`:

```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary "pydantic[email]" python-dotenv
```

This command installs:

- FastAPI: Our web framework
- Uvicorn: An ASGI server to run our FastAPI application
- SQLAlchemy: An ORM for database interactions
- psycopg2-binary: PostgreSQL adapter for Python
- Pydantic: For data validation and settings management
- python-dotenv: To load environment variables from a .env file

With the dependencies installed, we can start building our API.

You can also create a `requirements.txt` file to manage your dependencies by running:

```bash
pip freeze > requirements.txt
```

This will create a `requirements.txt` file with all the installed packages in your virtual environment and their versions. This is useful for sharing your project with others or deploying it to a server.

## Connecting to Neon Postgres

First, let's set up our database connection. Create a `.env` file in your project root:

```env
DATABASE_URL=postgres://user:password@your-neon-hostname.neon.tech/neondb?sslmode=require
```

Replace the placeholders with your actual Neon database credentials.

Now, create a `database.py` file to manage the database connection:

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

This script does the following:

1. Loads the environment variables from `.env` using `load_dotenv`
2. Creates a SQLAlchemy engine using the database URL from the environment variables
3. Creates a SessionLocal class for database sessions
4. Defines a Base class for declarative models which will be used to create database tables
5. Provides a `get_db` function to manage database connections

We're now ready to define our database models and API endpoints.

## Defining Models and Schemas

Let's start by creating an API for managing a tech conference system. We'll need database models and Pydantic schemas for talks and speakers.

Create a `models.py` file for SQLAlchemy models and relationships:

```python
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

class Speaker(Base):
    __tablename__ = "speakers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    bio = Column(String)
    company = Column(String)

    talks = relationship("Talk", back_populates="speaker")

class Talk(Base):
    __tablename__ = "talks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    speaker_id = Column(Integer, ForeignKey("speakers.id"))
    start_time = Column(DateTime)
    end_time = Column(DateTime)

    speaker = relationship("Speaker", back_populates="talks")
```

This defines `Speaker` and `Talk` models with their respective fields and relationships. The `speaker_id` field in the `Talk` model establishes a foreign key relationship with the `Speaker` model using SQLAlchemy's `ForeignKey` construct.

Now, create a `schemas.py` file for Pydantic models with data validation:

```python
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class TalkBase(BaseModel):
    title: str
    description: str
    start_time: datetime
    end_time: datetime

class TalkCreate(TalkBase):
    speaker_id: int

class Talk(TalkBase):
    id: int
    speaker_id: int

    class Config:
        orm_mode = True

class SpeakerBase(BaseModel):
    name: str
    bio: str
    company: str

class SpeakerCreate(SpeakerBase):
    pass

class Speaker(SpeakerBase):
    id: int
    talks: List[Talk] = []

    class Config:
        orm_mode = True

class SpeakerWithTalks(Speaker):
    talks: List[Talk]
```

Here we define Pydantic models for creating and returning speaker and talk data.

The `TalkCreate` model includes a `speaker_id` field for associating talks with speakers. The `SpeakerWithTalks` model extends the `Speaker` model to include a list of talks. The `orm_mode = True` configuration enables automatic data conversion between SQLAlchemy models and Pydantic models.

These models will be used to validate incoming data and serialize outgoing data in our API endpoints instead of manually handling data conversion.

## Creating API Endpoints

Now, let's create our FastAPI application with CRUD operations for speakers and talks. Create a `main.py` file:

```python
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.post("/speakers/", response_model=schemas.Speaker)
def create_speaker(speaker: schemas.SpeakerCreate, db: Session = Depends(get_db)):
    db_speaker = models.Speaker(**speaker.dict())
    db.add(db_speaker)
    db.commit()
    db.refresh(db_speaker)
    return db_speaker

@app.get("/speakers/", response_model=List[schemas.Speaker])
def read_speakers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    speakers = db.query(models.Speaker).offset(skip).limit(limit).all()
    return speakers

@app.get("/speakers/{speaker_id}", response_model=schemas.SpeakerWithTalks)
def read_speaker(speaker_id: int, db: Session = Depends(get_db)):
    db_speaker = db.query(models.Speaker).filter(models.Speaker.id == speaker_id).first()
    if db_speaker is None:
        raise HTTPException(status_code=404, detail="Speaker not found")
    return db_speaker

@app.post("/talks/", response_model=schemas.Talk)
def create_talk(talk: schemas.TalkCreate, db: Session = Depends(get_db)):
    db_talk = models.Talk(**talk.dict())
    db.add(db_talk)
    db.commit()
    db.refresh(db_talk)
    return db_talk

@app.get("/talks/", response_model=List[schemas.Talk])
def read_talks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    talks = db.query(models.Talk).offset(skip).limit(limit).all()
    return talks

@app.get("/talks/{talk_id}", response_model=schemas.Talk)
def read_talk(talk_id: int, db: Session = Depends(get_db)):
    db_talk = db.query(models.Talk).filter(models.Talk.id == talk_id).first()
    if db_talk is None:
        raise HTTPException(status_code=404, detail="Talk not found")
    return db_talk
```

This code defines endpoints for:

- Creating and retrieving speakers at `/speakers/`
- Retrieving a specific speaker with their talks at `/speakers/{speaker_id}`
- Creating and retrieving talks at `/talks/`
- Retrieving a specific talk at `/talks/{talk_id}`

Each endpoint uses dependency injection to get a database session, ensuring efficient connection management.

Pagination is supported for the `read_speakers` and `read_talks` endpoints using the `skip` and `limit` parameters to avoid loading large datasets at once.

## Running the API

To run the API, use the following command:

```bash
python -m uvicorn main:app --reload
```

This starts the Uvicorn server with hot-reloading enabled for development.

By default, the API will be available on port 8000. You can access the API documentation at `http://127.0.0.1:8000/docs` or `http://127.0.0.1:8000/redoc`.

Your database tables will be created automatically when you run the API for the first time thanks to the `models.Base.metadata.create_all(bind=engine)` line in `main.py`. You can check your database to see the tables using the Neon console.

## Testing the API

You can test the API using tools like `curl`, `Postman`, or even via the `/docs` endpoint provided by FastAPI directly via your browser.

Let's test this out using `httpie`, a command-line HTTP client:

1. Start by creating a speaker:

   ```bash
   http POST http://127.0.0.1:8000/speakers/ name="John Doe" bio="Software Engineer" company="Tech Inc."
   ```

   You should see a response with the created speaker data.

2. Next, create a talk associated with the speaker:

   ```bash
   http POST http://127.0.0.1:8000/talks/ title="Introduction to FastAPI" description="Learn how to build APIs with FastAPI" start_time="2024-08-18T09:00:00" end_time="2024-08-18T10:00:00" speaker_id=1
   ```

   This will create a talk associated with the speaker created earlier and return the talk data.

3. Retrieve all speakers:

   ```bash
   http http://127.0.0.1:8000/speakers/
   ```

   This endpoint will return a list of all speakers in the database.

4. Retrieve a specific speaker with talks:

   ```bash
   http http://127.0.0.1:8000/speakers/1
   ```

   This will return the speaker data along with any talks associated with them.

5. Retrieve all talks:

   ```bash
   http http://127.0.0.1:8000/talks/
   ```

6. Retrieve a specific talk:
   ```bash
   http http://127.0.0.1:8000/talks/1
   ```

You can modify these requests to test other endpoints and functionalities.

## Dockerizing the Application

In many cases, you may want to containerize your FastAPI application for deployment. Here's how you can create a Dockerfile for your project:

```Dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

This Dockerfile uses a slim Python image, installs dependencies from a `requirements.txt` file, copies the project files, and runs the Uvicorn server.

To build a new Docker image, run the following command in your project directory:

```bash
docker build -t fastapi-neon-conference-api .
```

You can then run the Docker container with:

```bash
docker run -d -p 8000:8000 fastapi-neon-conference-api
```

This will start the FastAPI application in a Docker container, accessible on port 8000 of your host machine.

You need to make sure that your `.env` file is not included in the Docker image. Instead, you can pass the environment variables as arguments when running the container.

## Performance Considerations

1. **Database Indexing**: We've added indexes to frequently queried fields (`id`, `name`, `title`) in our models. This improves query performance. To learn more about indexing, refer to the [Neon documentation](/docs/postgres/indexes).

2. **Pagination**: The `read_speakers` and `read_talks` endpoints include `skip` and `limit` parameters for pagination, preventing the retrieval of unnecessarily large datasets.

3. **Dependency Injection**: By using `Depends(get_db)`, we make sure that database connections are properly managed and closed after each request. This prevents connection leaks and improves performance.

4. **Pydantic Models**: Using Pydantic for request and response models provides automatic data validation and serialization, reducing the need for manual checks.

5. **Relationships**: We've used SQLAlchemy relationships to efficiently load related data (speakers and their talks) in a single query.

## Conclusion

In this guide, we've built a simple API for managing a tech conference system using FastAPI, Pydantic, and Neon Postgres.

This combination provides a very good foundation for building scalable and efficient web services. FastAPI's speed and ease of use, combined with Pydantic's powerful data validation and Neon's serverless Postgres, make for a formidable tech stack.

As a next step, you can extend the API with more features like authentication, authorization, and advanced query capabilities. You can check out the [Implementing Secure User Authentication in FastAPI using JWT Tokens and Neon Postgres](/guides/fastapi-jwt) guide for adding JWT-based authentication to your API.

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pydantic Documentation](https://docs.pydantic.dev/latest/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Neon Documentation](/docs)

<NeedHelp />
