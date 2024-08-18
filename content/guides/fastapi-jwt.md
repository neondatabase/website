---
title: Implementing Secure User Authentication in FastAPI using JWT Tokens and Neon Postgres
subtitle: Learn how to build a secure user authentication system in FastAPI using JSON Web Tokens (JWT) and Neon Postgres
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-08-17T00:00:00.000Z'
updatedOn: '2024-08-17T00:00:00.000Z'
---

In this guide, we'll walk through the process of implementing secure user authentication in a FastAPI application using JSON Web Tokens (JWT) and Neon Postgres.

We'll cover user registration, login, and protecting routes with authentication, using PyJWT for handling JWT operations.

By the end of this guide, you'll have a FastAPI application with an authentication system that uses JWT tokens for secure user management.

## Prerequisites

Before we begin, make sure you have the following:

- Python 3.9 or later installed on your system
- [pip](https://pip.pypa.io/en/stable/installation/) for managing Python packages
- A [Neon](https://console.neon.tech/signup) account for serverless Postgres
- Basic knowledge of [FastAPI, SQLAlchemy, and Pydantic](/guides/fastapi-overview)

## How JWT Works

Before we dive into the building our API, let's understand how JWT works. If you're already familiar with JWT, feel free to skip ahead to the next section.

JSON Web Tokens or JWT for short provide a secure way to authenticate and authorize users in web applications.

A JWT consists of three parts, each separated by a dot (`.`):

```
Header.Payload.Signature
```

Each part is Base64Url encoded, resulting in a structure like this:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Let's break down each part of the JWT:

### JWT Header

The header typically consists of two parts:

- The type of token (JWT)
- The hashing algorithm being used (e.g., HMAC SHA256 or RSA)

Example:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

This JSON is then Base64Url encoded to form the first part of the JWT.

### Payload

The payload contains claims. Claims are statements about the user and additional metadata. There are three types of claims:

- Registered claims: Predefined claims such as `iss` (issuer), `exp` (expiration time), `sub` (subject), `aud` (audience)
- Public claims: Can be defined at will by those using JWTs
- Private claims: Custom claims to share additional information between the client and server

Example:

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true,
  "iat": 1516239022
}
```

This JSON is then Base64Url encoded to form the second part of the JWT.

### Signature

The signature is used to verify that the sender of the JWT is who it says it is and to ensure that the message wasn't changed along the way. To create the signature part, you have to take the encoded header, the encoded payload, a secret, and the algorithm specified in the header, and sign that.

For example, if you want to use the HMAC SHA256 algorithm, the signature will be created in the following way:

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

This signature is then Base64Url encoded to form the third part of the JWT.

### The Process of Using JWTs

The overall process of using JWTs for authentication and authorization typically involves the following steps:

1. **User Authentication**:

   - The process begins when a user logs in with their credentials (e.g., username and password).
   - The server verifies these credentials against the stored user information.

2. **JWT Creation**:

   - Upon successful authentication, the server creates a JWT.
   - It generates the header and payload, encoding the necessary information.
   - Using a secret key (kept secure on the server), it creates the signature.
   - The three parts (header, payload, signature) are combined to form the complete JWT.

3. **Sending the Token**:

   - The server sends this token back to the client in the response.
   - The client stores this token, often in local storage or a secure cookie.

4. **Subsequent Requests**:

   - For any subsequent requests to protected routes or resources, the client includes this token in the Authorization header.
   - The format is: `Authorization: Bearer <token>`

5. **Server-side Token Validation**:

   - When the server receives a request with a JWT, it first splits the token into its three parts.
   - It base64 decodes the header and payload.
   - The server then recreates the signature using the header, payload, and its secret key.
   - If this newly created signature matches the signature in the token, the server knows the token is valid and hasn't been tampered with.

6. **Accessing Protected Resources**:

   - If the token is valid, the server can use the information in the payload without needing to query the database.
   - This allows the server to authenticate the user and know their permissions for each request without needing to store session data.

7. **Token Expiration**:
   - JWTs typically have an expiration time specified in the payload.
   - The server checks this expiration time with each request.
   - If the token has expired, the server will reject the request, requiring the client to authenticate again.

## Setting up the Project

With the theory out of the way, let's start by creating a new project directory and setting up a virtual environment:

1. Create a new directory and navigate to it:

   ```bash
   mkdir fastapi-auth-demo
   cd fastapi-auth-demo
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```bash
     source venv/bin/activate
     ```

Now, let's install the necessary packages for our project:

```bash
pip install "fastapi[all]" sqlalchemy psycopg2-binary pyjwt "passlib[bcrypt]" python-dotenv
```

This command installs:

- FastAPI: Our web framework
- SQLAlchemy: An ORM for database interactions
- psycopg2-binary: PostgreSQL adapter for Python
- PyJWT: For working with JWT tokens instead of handling them manually
- passlib: For password hashing
- python-dotenv: To load environment variables from a .env file

You can also create a `requirements.txt` file to manage your dependencies using the following:

```bash
pip freeze > requirements.txt
```

This file can be used to install the dependencies in another environment using `pip install -r requirements.txt`.

## Connecting to Neon Postgres

Next, let's set up a connection to Neon Postgres for storing user data.

Create a `.env` file in your project root and add the following configuration:

```env
DATABASE_URL=postgres://user:password@your-neon-hostname.neon.tech/dbname?sslmode=require
```

Replace the placeholders with your actual Neon database credentials.

While editing the `.env` file, add the following configuration for JWT token signing:

```env
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Choose a secure secret key for signing the JWT tokens. The `ALGORITHM` specifies the hashing algorithm to use, and `ACCESS_TOKEN_EXPIRE_MINUTES` sets the token expiration time.

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

This script sets up the database connection using SQLAlchemy and provides a `get_db` function to manage database sessions.

The `DATABASE_URL` is read from the `.env` file for security, and the Neon Postgres connection string is used to connect to the database.

The `SessionLocal` object is a factory for creating new database sessions, and the `get_db` function ensures that sessions are properly closed after use.

## User Model and Schema

We will be using SQLAlchemy for database interactions and Pydantic for data validation. SQLAlchemy provides an ORM for working with databases, while Pydantic is used for defining data models. These models will be used to interact with the database and validate user input.

Start by creating a `models.py` file for the SQLAlchemy User model:

```python
from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
```

This defines a `User` model with fields for `id`, `username`, `email`, and `hashed_password`. The `unique=True` constraint ensures that usernames and emails are unique across all users. The `index=True` constraint creates an index on these fields for faster lookups.

The `Base` object is imported from the `database` module and is used to create the database schema.

Next, create a `schemas.py` file for Pydantic models:

```python
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class User(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
```

These Pydantic models define the structure for user creation, user representation, and JWT tokens. The `EmailStr` type ensures that the email is in a valid format.

One of the benefits of using Pydantic models is that they can be used for data validation and serialization. The `orm_mode = True` configuration allows Pydantic to work with SQLAlchemy models directly.

## Authentication Utilities

Now that we have the database models and schemas in place, let's add some utility functions for authentication.

Create a file called `auth.py` where we will define functions for password hashing, verification, and JWT token creation:

```python
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        return username
    except jwt.PyJWTError:
        return None
```

This file includes functions for:

- Verifying and hashing passwords using bcrypt
- Creating JWT access tokens
- Verifying JWT tokens

The `CryptContext` from passlib is used for secure password hashing, while `PyJWT` is used for JWT token creation and verification. PyJWT provides a simpler and more focused API for JWT operations compared to `python-jose`.

## API Endpoints

With all the necessary components in place, we can now create the API endpoints for user registration, login, and protected routes.

To do this, create a `main.py` file with the following content:

```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import engine, get_db
import models, schemas, auth

# Run the database migrations
models.Base.metadata.create_all(bind=engine)

# Initialize the FastAPI app
app = FastAPI()

# Define the OAuth2 scheme for token-based authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    username = auth.verify_token(token)
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user
```

Let's break down the key components of this file:

1. The `/register` endpoint allows new users to create an account. It checks if the username is already taken, hashes the password, and stores the new user in the database.

2. The `/token` endpoint handles user login. It verifies the username and password, and if correct, issues a JWT access token.

3. The `get_current_user` function is a dependency that verifies the JWT token and retrieves the current user. This is used to protect routes that require authentication.

4. The `/users/me` endpoint is an example of a protected route. It returns the current user's information, but only if a valid JWT token is provided.

The tables will be created in your Neon database when the application starts, thanks to the `Base.metadata.create_all(bind=engine)` line in the `main.py` file.

## Running the API

To run the API, use the following command:

```bash
python -m uvicorn main:app --reload
```

This starts the Uvicorn server with hot-reloading enabled for development. This means that the server will automatically restart when you make changes to the code thanks to the `--reload` flag.

## Testing the Authentication System

You can test the authentication system using tools like `curl`, `httpie`, or the FastAPI Swagger UI at `http://127.0.0.1:8000/docs`.

Here are some example requests using the `httpie` command-line HTTP client to go through the registration, login, and protected route access flow as we discussed earlier.

1. Start by registering a new user:

   ```bash
   http POST http://127.0.0.1:8000/register username=testuser email=test@example.com password=securepassword
   ```

   You should receive a response with the new user's details in JSON format if the registration is successful.

2. Login and get an access token using the registered user's credentials:

   ```bash
   http --form POST http://127.0.0.1:8000/token username=testuser password=securepassword
   ```

   This request should return a JSON response with an access token.

   If you were to copy the token and decode it at [jwt.io](https://jwt.io/), you would see the payload containing the username and expiration time.
   As we discussed earlier, in some cases the token might contain additional claims like `iss` (issuer), `aud` (audience), etc. These can be used for additional security checks.

   The token will be valid for the duration specified in the `.env` file.

3. Access the protected `/users/me` route using the access token:

   ```bash
   http GET http://127.0.0.1:8000/users/me "Authorization: Bearer <your_access_token>"
   ```

   This request should return the user's details if the token is valid.

Replace `<your_access_token>` with the token received from the login request.

You would see a `401 Unauthorized` response if the token is invalid or has expired. This is because the `get_current_user` dependency checks the token validity before allowing access to the protected route.

## Dockerizing the Application

In many cases, you may want to containerize your FastAPI application for deployment. You can use Docker to create a container image for your FastAPI application.

Let's create a Dockerfile to package the application into a Docker container:

```Dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

This Dockerfile uses the official Python image as the base image, installs the project dependencies, and copies the project files into the container. The `CMD` instruction specifies the command to run when the container starts.

To build the Docker image, run the following command:

```bash
docker build -t fastapi-auth-demo .
```

This command builds the Docker image with the tag `fastapi-auth-demo` based on the `Dockerfile` in the current directory.

Make sure that you don't include the `.env` file in the Docker image to keep your secrets secure. You can pass environment variables to the container using the `--env-file` flag when running the container.

To run the Docker container, use the following command:

```bash
docker run -d -p 8000:8000 --env-file .env fastapi-auth-demo
```

This command starts the container in detached mode, maps port 8000 on the host to port 8000 in the container, and loads environment variables from the `.env` file.

## Conclusion

In this guide, we've implemented a secure user authentication system in FastAPI using JWT tokens (with PyJWT) and Neon Postgres. This provides a good start for building secure web applications with user accounts and protected routes which can be integrated with other microservices or front-end applications.

## Additional Resources

- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [JSON Web Tokens](https://jwt.io/introduction)
- [PyJWT Documentation](https://pyjwt.readthedocs.io/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Neon Documentation](/docs)
