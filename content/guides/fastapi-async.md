---
title: Building an Async Product Management API with FastAPI, Pydantic, and PostgreSQL
subtitle: Learn how to create an asynchronous API for managing products using FastAPI, Pydantic for data validation, and PostgreSQL with connection pooling
author: sam-harri
enableTableOfContents: true
createdAt: '2024-10-08T00:00:00.000Z'
updatedOn: '2024-10-08T00:00:00.000Z'
---

Following this guide, you’ll build an asynchronous product management API and leverage FastAPI's async capabilities and connection pools to efficiently manage database connections, ensuring your API can scale and handle high traffic with ease. Whether you’re aiming to improve performance or simply learn the best practices for building async APIs, this guide has you covered.

## Prerequisites

Before starting, ensure you have the following tools and services ready:
* pip : Required for installing and managing Python packages, including [uv](https://docs.astral.sh/uv/) for creating virtual environments. You can check if `pip` is installed by running the following command:
    ```bash
    pip --version
    ```
* Neon serverless Postgres : you will need a Neon account for provisioning and scaling your `PostgreSQL` database. If you don't have an account yet, [sign up here](https://console.neon.tech/signup)

## Setting up the Project

Follow these steps to set up your project and virtual environment:

1. Create a `uv` project

    If you don't already have uv installed, you can install it with:
    ```bash
    pip install uv
    ```
    Once `uv` is installed, create a new project:

    ```bash
    uv init async_postgres
    ```
    This will create a new project directory called `async_postgres`. Open this directory in your code editor of your choice.

2. Set Up the Virtual Environment

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

    You should see `(async_postgres)` in your terminal now, this means that your virtual environment is activated.

3. Install Dependencies

    Next, add all the necessary dependencies for your project:

    ```bash
    uv add python-dotenv asyncpg loguru fastapi uvicorn requests
    ```

    Where each package does the following :
    * `FastAPI` : A Web / API framework
    * `AsyncPG` : An asynchronous PostgreSQL client
    * `Uvicorn` : An ASGI server for our app
    * `Loguru` : A logging library
    * `Python-dotenv` : To load environment variables from a .env file


4. Create the project structure

    Now, create the following directory structure to organize your project files:

    ```md
    async_postgres
    ├── src/
    │   ├── database/
    │   │   └── postgres.py
    │   ├── models/
    │   │   └── product_models.py
    │   ├── routes/
    │   │   └── product_routes.py
    │   └── main.py
    ├── .env                                
    ├── .python-version
    ├── README.md                 
    ├── pyproject.toml                    
    └── uv.lock   
    ```

## Setting up your Database

In this section, you will set up the connection pool, ensure your database schema is in place, and manage database connections effectively. To connect to your `PostgreSQL` database, you will use the `asyncpg` library for asynchronous database connections.


First, create a `.env` file in the root of your project to store the database connection URL. This file will hold environment-specific variables, such as the connection string to your Neon PostgreSQL database.

```bash shouldWrap
DATABASE_URL=postgres://user:password@your-neon-hostname.neon.tech/neondb?sslmode=require
```
Make sure to replace the placeholders (user, password, your-neon-hostname, etc.) with your actual Neon database credentials which are available in the console.


In your project, the `database.py` file manages the connection to `PostgreSQL` using `asyncpg` and its connection pool, which is a mechanism for managing and reusing database connections efficiently. With this, you can use asynchronous queries, allowing the application to handle multiple requests concurrently.

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

`init_postgres` is responsible for opening the connection pool to the `PostgreSQL` database and setting up the required database schema. Specifically, it ensures that the necessary database tables (such as the `products` table) are created if they don’t already exist, preparing the application to start accepting requests.

To properly manage the lifecycle of the database, you need a function to close the connection pool when the API spins down `close_postgres` is responsible for gracefully closing all connections in the pool when the `FastAPI` app shuts down.

Throughout your API you will also need access to the pool to get connection instances and run queries. `get_postgres` returns the active connection pool. If the pool is not initialized, an error is raised. The term for passing this in is Dependency Injection.



## Defining the Pydantic Models

`Pydantic` is a data validation library in Python that ensures data entering or leaving your API is valid by enforcing constraints and data types.

In your application, you will define several models using Pydantic to represent the data for products. These models will be used to create, update, and manage products in the database, as well as handle validation when clients interact with our API.

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

## Creating the API Endpoints

In this section, you will create the API endpoints that allow you to manage products in your `PostgreSQL` database. These endpoints will allow you to create, retrieve, update, delete, and manage product stock. You will leverage asynchronous database connections using `asyncpg`.

Each endpoint follows a similar flow for interacting with the database. You will first get a connection from the connection pool, execute the desired query, and release the connection back to the pool. Since the connection pool is used as a context manager, the connection will automatically be returned to the pool after each operation.

The common database flow goes as follows :
1. Getting the Connection Pool:
    - You inject the connection pool using FastAPI's `Depends()` function, which allows you to easily retrieve a connection from the pool.
2. Acquiring a Connection:
    - Using the connection pool, you acquire a connection by calling `async with db_pool.acquire() as conn:`. This ensures you obtain a database connection to run the query.
3. Running the Query:
    - Once the connection is acquired, you run the query using methods such as `fetchrow()` (for single rows) or `fetch()` (for multiple rows) depending on the operation.
4. Returning the Connection to the Pool:
    - Once the query is complete, the connection is automatically returned to the pool because the async with context manager handles the lifecycle of the connection.

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

The code defines endpoints for :
* `POST /products`: Creates a new product. It receives the product data (name, price, quantity, and description) and inserts it into the database. The newly created product is returned.

* `GET /products`: Retrieves all products from the database. The response is a list of products, each containing its ID, name, price, quantity, and description.

* `GET /products/{id}`: Retrieves a product by its unique ID. If the product exists, its details are returned; otherwise, a 404 error is raised.

* `PUT /products/{id}`: Updates an existing product by its ID. The update can be partial, as it uses `COALESCE` to only update the fields provided. The updated product is returned.

* `DELETE /products/{id}`: Deletes a product by its ID. If the product is successfully deleted, a success message is returned.

* `PATCH /products/{id}/stock`: Updates the stock (quantity) of a specific product by its ID. The updated product, with the new quantity, is returned.

* `GET /products/filter/price`: Retrieves products within a specific price range. You pass min_price and max_price as query parameters, and the endpoint returns a list of products that fall within that range.

## Running the Application

After setting up the database, models, and API routes, the next step is to run the `FastAPI` application. The `main.py` file is the entry point for the application, and `Uvicorn` starts and serves it.


The `main.py` file defines the `FastAPI` application, manages lifecycle events like starting and closing the `PostgreSQL` connection pool, and includes the product-related routes. Here, you will use the `@asynccontextmanager` decorator to manage the database connection pool lifecycle.

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

- Interactive API Docs (Swagger UI):  
  Visit `http://127.0.0.1:8080/docs` to access the automatically generated API documentation where you can test the endpoints.
  
- Alternative Docs (ReDoc):  
  Visit `http://127.0.0.1:8080/redoc` for another style of API documentation.


## Testing the API

You can also use tools like `httpie`, `curl`, and `Postman` to test the API.

Below are examples of how to interact with the API using `httpie`, a command-line HTTP client.

1. Create a Product

    Start by creating a new product:

    ```http shouldWrap
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

2. Retrieve All Products

    Next, retrieve all products from the database:

    ```http
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

3. Retrieve a Specific Product by ID

    You can also retrieve a specific product by its ID:

    ```http
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

4. Update a Product

    To update an existing product, use the following command:

    ```http shouldWrap
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

5. Update Product Stock

    You can also update just the stock (quantity) of a product:

    ```http
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

6. Filter Products by Price Range

    To filter products by a specific price range, use this command:

    ```http
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

7. Delete a Product

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

Using this guide, you have built a fully functional API for managing products using `FastAPI`, `Pydantic`, and `PostgreSQL` with `asyncpg`.

This stack provides a solid foundation for building high-performance and scalable web services. `FastAPI`'s asynchronous support, combined with `Pydantic`'s robust data validation and `asyncpg`'s efficient database interactions, allows for fast and reliable API development.

As a next step, you can look at deploying this application in the cloud using scalable technologies like `Docker` and `Kubernetes`, or implementing automated test, build, and deployment workflows using `Github CI`