---
title: Building an async product management API with FastAPI, Pydantic, and Postgres
subtitle: Learn how to create an asynchronous API for managing products using FastAPI, Pydantic for data validation, and Postgres with connection pooling
author: sam-harri
enableTableOfContents: true
createdAt: '2024-10-08T00:00:00.000Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

In this guide, you'll build an asynchronous product management API with FastAPI and an `asyncpg` connection pool, so your API can handle many concurrent requests.

## Prerequisites

Before starting, make sure you have the following:

- pip : Required for installing and managing Python packages, including [uv](https://docs.astral.sh/uv/) for creating virtual environments. You can check if `pip` is installed by running the following command:
  ```bash
  pip --version
  ```
- A Neon account to host your Postgres database. If you don't have one yet, [sign up here](https://console.neon.tech/signup).

## Setting up the project

Follow these steps to set up your project and virtual environment:

1.  Create a `uv` project

    If you don't already have uv installed, you can install it with:

    ```bash
    pip install uv
    ```

    Once `uv` is installed, create a new project:

    ```bash
    uv init async_postgres
    ```

    This will create a new project directory called `async_postgres`. Open this directory in your code editor.

2.  Set up the virtual environment

        You will now create and activate a virtual environment in which your project's dependencies will be installed.

        <CodeTabs labels={["Linux/macOS", "Windows"]}>

            ```bash
            uv venv
            source .venv/bin/activate
            ```

            ```bash
            uv venv
            .venv\Scripts\activate
            ```

        </CodeTabs>

        You should see `(async_postgres)` in your terminal, which means your virtual environment is active.

3.  Install dependencies

    Next, add all the necessary dependencies for your project:

    ```bash
    uv add python-dotenv asyncpg loguru fastapi uvicorn
    ```

    Each package does the following:
    - `FastAPI`: A web and API framework
    - `AsyncPG`: An asynchronous Postgres client
    - `Uvicorn`: An ASGI server for the app
    - `Loguru`: A logging library
    - `Python-dotenv`: Loads environment variables from a `.env` file

4.  Create the project structure

    Now, create the following directory structure to organize your project files:

    ```md
    async_postgres
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

## Setting up your database

In this section, you'll set up the connection pool, create the database schema, and manage database connections. You'll use the `asyncpg` library for asynchronous connections to Postgres.

First, create a `.env` file in the root of your project to store the database connection URL. This file holds environment-specific variables, such as the connection string for your Neon database.

```bash
DATABASE_URL=postgres://user:password@your-neon-hostname.neon.tech/neondb?sslmode=require&channel_binding=require
```

Replace the placeholders (user, password, your-neon-hostname, and so on) with your Neon database credentials. You can copy the full connection string by clicking **Connect** on your project dashboard in the Neon Console.

In your project, the `src/database/postgres.py` file manages the connection to Postgres using an `asyncpg` connection pool, which reuses database connections instead of opening a new one per request. Queries run asynchronously, so the application can handle multiple requests concurrently.

```python
import os
import asyncpg
import dotenv
from loguru import logger
from typing import Optional

dotenv.load_dotenv()

conn_pool: Optional[asyncpg.Pool] = None

async def init_postgres() -> None:
    """
    Initialize the PostgreSQL connection pool and create the products table if it doesn't exist.

    This function is meant to be called at the startup of the FastAPI app to
    initialize a connection pool to PostgreSQL and ensure that the required
    database schema is in place.
    """
    global conn_pool
    try:
        logger.info("Initializing PostgreSQL connection pool...")

        conn_pool = await asyncpg.create_pool(
            dsn=os.getenv("DATABASE_URL"), min_size=1, max_size=10
        )
        logger.info("PostgreSQL connection pool created successfully.")

    except Exception as e:
        logger.error(f"Error initializing PostgreSQL connection pool: {e}")
        raise
    try:
        async with conn_pool.acquire() as conn:
            create_table_query = """
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
                quantity INT NOT NULL CHECK (quantity >= 0),
                description VARCHAR(255)
            );
            """
            async with conn.transaction():
                await conn.execute(create_table_query)
            logger.info("Products table ensured to exist.")

    except Exception as e:
        logger.error(f"Error creating the products table: {e}")
        raise


async def get_postgres() -> asyncpg.Pool:
    """
    Return the PostgreSQL connection pool.

    This function returns the connection pool object, from which individual
    connections can be acquired as needed for database operations. The caller
    is responsible for acquiring and releasing connections from the pool.

    Returns
    -------
    asyncpg.Pool
        The connection pool object to the PostgreSQL database.

    Raises
    ------
    ConnectionError
        Raised if the connection pool is not initialized.
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

    This function should be called during the shutdown of the FastAPI app
    to properly close all connections in the pool and release resources.
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

`init_postgres` opens the connection pool and sets up the database schema. It creates the `products` table if it doesn't already exist, so the application is ready to accept requests.

You also need a function to close the connection pool when the API shuts down. `close_postgres` closes all connections in the pool when the `FastAPI` app stops.

Throughout your API you will also need access to the pool to get connection instances and run queries. `get_postgres` returns the active connection pool, or raises an error if the pool isn't initialized. FastAPI passes it to each endpoint through dependency injection.

## Defining the Pydantic models

`Pydantic` is a Python data validation library that checks data entering or leaving your API against constraints and data types.

In your application, you will define several models using Pydantic to represent the data for products. These models will be used to create, update, and manage products in the database, and to validate requests from clients.

```python
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class Product(BaseModel):
    """
    Represents the product table in the database.
    """
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    price: float
    quantity: int
    description: Optional[str]


class ProductCreate(BaseModel):
    """
    Represents the required fields to create a new product.
    """
    name: str
    price: float = Field(..., ge=0)
    quantity: int = Field(..., ge=0)
    description: Optional[str] = Field(None, max_length=255)


class ProductUpdate(BaseModel):
    """
    Represents optional fields to update an existing product.
    Allows partial updates.
    """
    name: Optional[str] = None
    price: Optional[float] = Field(None, ge=0)
    quantity: Optional[int] = Field(None, ge=0)
    description: Optional[str] = Field(None, max_length=255)


class ProductStockUpdate(BaseModel):
    """
    Represents the stock update for a product's quantity.
    """
    quantity: int = Field(..., ge=0)
```

## Creating the API endpoints

In this section, you'll create the API endpoints for managing products in your Postgres database. These endpoints create, retrieve, update, and delete products, and update product stock. You will use asynchronous database connections with `asyncpg`.

Each endpoint follows a similar flow for interacting with the database. You will first get a connection from the connection pool, execute the desired query, and release the connection back to the pool. Since the connection pool is used as a context manager, the connection will automatically be returned to the pool after each operation.

The common database flow goes as follows:

1. Getting the connection pool:
   - You inject the connection pool using FastAPI's `Depends()` function.
2. Acquiring a connection:
   - Using the connection pool, you acquire a connection by calling `async with db_pool.acquire() as conn:`. This ensures you obtain a database connection to run the query.
3. Running the query:
   - Once the connection is acquired, you run the query using methods such as `fetchrow()` (for single rows) or `fetch()` (for multiple rows) depending on the operation.
4. Returning the connection to the pool:
   - Once the query is complete, the `async with` context manager returns the connection to the pool.

```python
from fastapi import HTTPException, Query, Path, Body, APIRouter, Depends
from models.product_models import Product, ProductCreate, ProductUpdate, ProductStockUpdate
from database.postgres import get_postgres
from typing import List
import asyncpg
from loguru import logger

product_router = APIRouter()


@product_router.post("/products", response_model=Product)
async def create_product(
    product: ProductCreate = Body(...),
    db_pool: asyncpg.Pool = Depends(get_postgres),
) -> Product:
    """
    Create a new product.

    Parameters
    ----------
    product : ProductCreate
        The product details to create.
    db_pool : asyncpg.Pool
        Database connection pool injected by dependency.

    Returns
    -------
    Product
        The newly created product.
    """
    query = """
    INSERT INTO products (name, price, quantity, description)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, price, quantity, description
    """
    try:
        async with db_pool.acquire() as conn:
            result = await conn.fetchrow(
                query,
                product.name,
                product.price,
                product.quantity,
                product.description,
            )

        if result:
            return Product(**dict(result))
        else:
            logger.error("Failed to create product")
            raise HTTPException(status_code=500, detail="Failed to create product")
    except Exception as e:
        logger.error(f"Error during product creation: {e}")
        raise HTTPException(
            status_code=500, detail="Internal server error during product creation"
        )


@product_router.get("/products", response_model=List[Product])
async def get_all_products(
    db_pool: asyncpg.Pool = Depends(get_postgres),
) -> List[Product]:
    """
    Get a list of all products.

    Parameters
    ----------
    db_pool : asyncpg.Pool, optional
        Database connection pool injected by dependency.

    Returns
    -------
    List[Product]
        A list of all products in the inventory.
    """
    query = "SELECT id, name, price, quantity, description FROM products"

    try:
        async with db_pool.acquire() as conn:
            results = await conn.fetch(query)
            return [Product(**dict(result)) for result in results]
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve products")


@product_router.get("/products/{id}", response_model=Product)
async def get_product_by_id(
    id: int = Path(..., ge=1),
    db_pool: asyncpg.Pool = Depends(get_postgres),
) -> Product:
    """
    Get a product by its ID.

    Parameters
    ----------
    id : int
        The ID of the product.
    db_pool : asyncpg.Pool, optional
        Database connection pool injected by dependency.

    Returns
    -------
    Product
        The product details for the given ID.
    """
    query = "SELECT id, name, price, quantity, description FROM products WHERE id = $1"

    try:
        async with db_pool.acquire() as conn:
            result = await conn.fetchrow(query, id)
            if result:
                return Product(**dict(result))
            else:
                logger.warning(f"Product with ID {id} not found")
                raise HTTPException(status_code=404, detail="Product not found")
    except Exception as e:
        logger.error(f"Error fetching product by ID: {e}")
        raise HTTPException(
            status_code=500, detail="Internal server error during product retrieval"
        )


@product_router.put("/products/{id}", response_model=Product)
async def update_product(
    id: int = Path(..., ge=1),
    product: ProductUpdate = Body(...),
    db_pool: asyncpg.Pool = Depends(get_postgres),
) -> Product:
    """
    Update a product by its ID.

    Parameters
    ----------
    id : int
        The ID of the product to update.
    product : ProductUpdate
        The fields to update (partial updates allowed).
    db_pool : asyncpg.Pool, optional
        Database connection pool injected by dependency.

    Returns
    -------
    Product
        The updated product details.
    """
    query = """
    UPDATE products
    SET name = COALESCE($1, name),
        price = COALESCE($2, price),
        quantity = COALESCE($3, quantity),
        description = COALESCE($4, description)
    WHERE id = $5
    RETURNING id, name, price, quantity, description
    """

    try:
        async with db_pool.acquire() as conn:
            result = await conn.fetchrow(
                query,
                product.name,
                product.price,
                product.quantity,
                product.description,
                id,
            )
            if result:
                return Product(**dict(result))
            else:
                logger.warning(f"Product with ID {id} not found for update")
                raise HTTPException(status_code=404, detail="Product not found")
    except Exception as e:
        logger.error(f"Error updating product: {e}")
        raise HTTPException(
            status_code=500, detail="Internal server error during product update"
        )


@product_router.delete("/products/{id}")
async def delete_product(
    id: int = Path(..., ge=1),
    db_pool: asyncpg.Pool = Depends(get_postgres)
) -> dict:
    """
    Delete a product by its ID.

    Parameters
    ----------
    id : int
        The ID of the product to delete.
    db_pool : asyncpg.Pool, optional
        Database connection pool injected by dependency.

    Returns
    -------
    dict
        A message indicating the product was deleted.
    """
    query = "DELETE FROM products WHERE id = $1 RETURNING id"

    try:
        async with db_pool.acquire() as conn:
            result = await conn.fetchrow(query, id)
            if result:
                return {"message": "Product deleted successfully"}
            else:
                logger.warning(f"Product with ID {id} not found for deletion")
                raise HTTPException(status_code=404, detail="Product not found")
    except Exception as e:
        logger.error(f"Error deleting product: {e}")
        raise HTTPException(
            status_code=500, detail="Internal server error during product deletion"
        )


@product_router.patch("/products/{id}/stock", response_model=Product)
async def update_product_stock(
    id: int = Path(..., ge=1),
    stock: ProductStockUpdate = Body(...),
    db_pool: asyncpg.Pool = Depends(get_postgres),
) -> Product:
    """
    Update the stock (quantity) of a product by its ID.

    Parameters
    ----------
    id : int
        The ID of the product to update.
    stock : ProductStockUpdate
        The new quantity for the product.
    db_pool : asyncpg.Pool, optional
        Database connection pool injected by dependency.

    Returns
    -------
    Product
        The updated product with new stock quantity.
    """
    query = """
    UPDATE products
    SET quantity = $1
    WHERE id = $2
    RETURNING id, name, price, quantity, description
    """
    try:
        async with db_pool.acquire() as conn:
            result = await conn.fetchrow(query, stock.quantity, id)
            if result:
                return Product(**dict(result))
            else:
                raise HTTPException(status_code=404, detail="Product not found")
    except Exception as e:
        logger.error(f"Error updating product stock: {e}")
        raise HTTPException(
            status_code=500, detail="Internal server error during product stock update"
        )


@product_router.get("/products/filter/price", response_model=List[Product])
async def filter_products_by_price(
    min_price: float = Query(...),
    max_price: float = Query(...),
    db_pool: asyncpg.Pool = Depends(get_postgres),
) -> List[Product]:
    """
    Get products within a specific price range.

    Parameters
    ----------
    min_price : float
        The minimum price for filtering.
    max_price : float
        The maximum price for filtering.
    db_pool : asyncpg.Pool, optional
        Database connection pool injected by dependency.

    Returns
    -------
    List[Product]
        A list of products within the specified price range.
    """
    query = """
    SELECT id, name, price, quantity, description
    FROM products
    WHERE price BETWEEN $1 AND $2
    """
    try:
        async with db_pool.acquire() as conn:
            results = await conn.fetch(query, min_price, max_price)
            return [Product(**dict(result)) for result in results]
    except Exception as e:
        logger.error(f"Error filtering products by price: {e}")
        raise HTTPException(
            status_code=500, detail="Internal server error during price filtering"
        )
```

The code defines these endpoints:

- `POST /products`: Creates a new product. It receives the product data (name, price, quantity, and description) and inserts it into the database. The newly created product is returned.

- `GET /products`: Retrieves all products from the database. The response is a list of products, each containing its ID, name, price, quantity, and description.

- `GET /products/{id}`: Retrieves a product by its unique ID. If the product exists, its details are returned; otherwise, a 404 error is raised.

- `PUT /products/{id}`: Updates an existing product by its ID. The update can be partial, as it uses `COALESCE` to only update the fields provided. The updated product is returned.

- `DELETE /products/{id}`: Deletes a product by its ID. If the product is successfully deleted, a success message is returned.

- `PATCH /products/{id}/stock`: Updates the stock (quantity) of a specific product by its ID. The updated product, with the new quantity, is returned.

- `GET /products/filter/price`: Retrieves products within a specific price range. You pass min_price and max_price as query parameters, and the endpoint returns a list of products that fall within that range.

## Running the application

After setting up the database, models, and API routes, the next step is to run the `FastAPI` application. The `main.py` file is the entry point for the application, and `Uvicorn` starts and serves it.

The `main.py` file defines the `FastAPI` application, manages lifecycle events like opening and closing the Postgres connection pool, and includes the product-related routes. Here, you will use the `@asynccontextmanager` decorator to manage the database connection pool lifecycle.

```python
from fastapi import FastAPI
from contextlib import asynccontextmanager
from database.postgres import init_postgres, close_postgres
from routes.product_routes import product_router
import uvicorn


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_postgres()
    yield
    await close_postgres()


app: FastAPI = FastAPI(lifespan=lifespan, title="Async FastAPI PostgreSQL Inventory Manager")
app.include_router(product_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)

```

To run the application, use the following command:

```bash
uv run src/main.py
```

Once the server is running, you can access the API documentation and test the endpoints directly in your browser:

- Interactive API docs (Swagger UI):  
  Visit `http://127.0.0.1:8080/docs` to access the automatically generated API documentation where you can test the endpoints.
- Alternative docs (ReDoc):  
  Visit `http://127.0.0.1:8080/redoc` for another style of API documentation.

## Testing the API

You can also use tools like `httpie`, `curl`, and `Postman` to test the API.

Below are examples of how to interact with the API using `httpie`, a command-line HTTP client.

1. Create a product

   Start by creating a new product:

   ```
   http POST http://127.0.0.1:8080/products name="Test Product" price:=9.99 quantity:=100 description="A test product"
   ```

   You should see a response with the created product data:

   ```
   {
       "id": 1,
       "name": "Test Product",
       "price": 9.99,
       "quantity": 100,
       "description": "A test product"
   }
   ```

2. Retrieve all products

   Next, retrieve all products from the database:

   ```
   http GET http://127.0.0.1:8080/products
   ```

   This will return a list of all products in the database:

   ```
   [
       {
           "id": 1,
           "name": "Test Product",
           "price": 9.99,
           "quantity": 100,
           "description": "A test product"
       }
   ]
   ```

3. Retrieve a specific product by ID

   You can also retrieve a specific product by its ID:

   ```
   http GET http://127.0.0.1:8080/products/1
   ```

   This will return the product details for the product with ID `1`:

   ```
   {
       "id": 1,
       "name": "Test Product",
       "price": 9.99,
       "quantity": 100,
       "description": "A test product"
   }
   ```

4. Update a product

   To update an existing product, use the following command:

   ```
   http PUT http://127.0.0.1:8080/products/1 name="Updated Product" price:=12.99 quantity:=150 description="An updated product description"
   ```

   This will return the updated product data:

   ```
   {
       "id": 1,
       "name": "Updated Product",
       "price": 12.99,
       "quantity": 150,
       "description": "An updated product description"
   }
   ```

5. Update product stock

   You can also update just the stock (quantity) of a product:

   ```
   http PATCH http://127.0.0.1:8080/products/1/stock quantity:=200
   ```

   This will return the updated product with the new quantity:

   ```
   {
       "id": 1,
       "name": "Updated Product",
       "price": 12.99,
       "quantity": 200,
       "description": "An updated product description"
   }
   ```

6. Filter products by price range

   To filter products by a specific price range, use this command:

   ```
   http GET http://127.0.0.1:8080/products/filter/price min_price==5.00 max_price==15.00
   ```

   This will return products that fall within the specified price range:

   ```
   [
       {
           "id": 1,
           "name": "Updated Product",
           "price": 12.99,
           "quantity": 200,
           "description": "An updated product description"
       }
   ]
   ```

7. Delete a product

   To delete a product by its ID, use the following command:

   ```
   http DELETE http://127.0.0.1:8080/products/1
   ```

   If successful, you will receive a confirmation message:

   ```
   {
       "message": "Product deleted successfully"
   }
   ```

## Conclusion

You built an async product management API with `FastAPI`, `Pydantic`, and Postgres, using an `asyncpg` connection pool.

As a next step, containerize the app with `Docker` and deploy it, or add automated test, build, and deployment workflows with GitHub Actions.
