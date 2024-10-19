---
title: Building a High-Performance Sensor Data API with FastAPI and Postgres' TimescaleDB Extension
subtitle: Create an  API for streaming, storing, and querying sensor data using Postgres TimescaleDB and FastAPI
author: sam-harri
enableTableOfContents: true
createdAt: '2024-10-12T00:00:00.000Z'
updatedOn: '2024-10-12T00:00:00.000Z'
---

In this guide, you'll build a high-performance API for streaming, storing, and querying sensor data using FastAPI and TimescaleDB for efficient time-series data storage. 
By combining FastAPI with TimescaleDB's advanced time-series features, you'll be able to maintain low latency queries even at the petabyte scale, making it perfect for things like IoT systems that generate large volumes of sensor data.

## Prerequisites

Before starting, ensure you have the following tools and services ready:

- `pip`: Required for installing and managing Python packages, including [uv](https://docs.astral.sh/uv/) for creating virtual environments. You can check if `pip` is installed by running the following command:
  ```bash
  pip --version
  ```
- Neon serverless Postgres : you will need a Neon account for provisioning and scaling your `PostgreSQL` database. If you don't have an account yet, [sign up here](https://console.neon.tech/signup).

## Setting up the Project

Follow these steps to set up your project and virtual environment:

1.  Create a `uv` project

    If you don't already have uv installed, you can install it with:

    ```bash
    pip install uv
    ```

    Once `uv` is installed, create a new project:

    ```bash
    uv init timescale_fastapi
    ```

    This will create a new project directory called `timescale_fastapi`. Open this directory in your code editor of your choice.

2.  Set up the virtual environment.

    You will now create and activate a virtual environment in which your project's dependencies will beinstalled.
    
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

    You should see `(timescale_fastapi)` in your terminal now, this means that your virtual environment is activated.

3.  Install dependencies.

    Next, add all the necessary dependencies for your project:

    ```bash
    uv add python-dotenv asyncpg loguru fastapi uvicorn requests
    ```

    where each package does the following:
    - `FastAPI`: A Web / API framework
    - `AsyncPG`: An asynchronous PostgreSQL client
    - `Uvicorn`: An ASGI server for our app
    - `Loguru`: A logging library
    - `Python-dotenv`: To load environment variables from a .env file

4.  Create the project structure.

    Create the following directory structure to organize your project files:

    ```md
    timescale_fastapi
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

In this section, you will set up the `TimescaleDB` extension using Neon's console, add the database's schema, and create the database connection pool and lifecycle management logic in FastAPI. Optionally, you can also add some mock data to test your API endpoints.

Given TimescaleDB is an extension on top of vanilla Postgres, you must first add the extension by running the following SQL in the `SQL Editor` tab of the Neon console.

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;
```

Next, you will add the necessary tables to your database with:

```sql
CREATE TABLE IF NOT EXISTS sensors (
    sensor_id SERIAL PRIMARY KEY,
    sensor_type VARCHAR(50) NOT NULL,   
    description VARCHAR(255),           
    location VARCHAR(255)               
);


CREATE TABLE IF NOT EXISTS sensor_data (
    sensor_id INT REFERENCES sensors(sensor_id),
    value FLOAT NOT NULL,               
    time TIMESTAMPTZ NOT NULL DEFAULT NOW(),  
    PRIMARY KEY(sensor_id, time)        
);
```

One of TimescaleDB's core features is `Hypertables`, which is an optimized abstraction for handling large time-series data. It partitions your data into chunks based on time, allowing efficient storage, querying, and performance at scale. By converting the sensor_data table into a hypertable, TimescaleDB will manage the underlying chunking and indexing automatically.

To convert the `sensor_data` table into a hypertable, use the following command:

```sql
SELECT create_hypertable('sensor_data', 'time');
```

Now that the schema is ready, you can optionally populate the database with some sample sensor data. First, insert the metadata for two sensors:

```sql
INSERT INTO sensors (sensor_type, description, location)
VALUES
    ('temperature', 'Outdoor temperature sensor', 'Backyard'),
    ('humidity', 'Indoor humidity sensor', 'Living Room');
```

Next, generate time-series data for the past 14 days with one-minute intervals for both sensors. Here's how you can insert random data for each sensor using Timescales `generate_series()` feature.

```sql
INSERT INTO sensor_data (sensor_id, value, time)
SELECT 1 as sensor_id,
       15 + random() * 15 AS value,
       generate_series(
           now() - INTERVAL '14 days',
           now(),
           INTERVAL '1 minute'
       ) AS time;

INSERT INTO sensor_data (sensor_id, value, time)
SELECT 2 as sensor_id, 
       40 + random() * 20 AS value, 
       generate_series(
           now() - INTERVAL '14 days',
           now(),
           INTERVAL '1 minute'
       ) AS time;
```

With your schema and sample data in place, you're now ready to connect to your database in the FastAPI application. To do this you must create a `.env` file in the root of the project to hold environment-specific variables, such as the connection string to your Neon PostgreSQL database.

```bash
DATABASE_URL=postgres://user:password@your-neon-hostname.neon.tech/neondb?sslmode=require
```

Make sure to replace the placeholders (user, password, your-neon-hostname, etc.) with your actual Neon database credentials, which are available in the console.

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

Now, you will create `Pydantic` models to define the structure of the data your API expects and returns, automatically validating incoming requests and responses versus the defined format.

```python
from pydantic import BaseModel
from typing import List
from datetime import datetime, date


class SensorData(BaseModel):
    value: float
    timestamp: datetime


class SensorDataBatch(BaseModel):
    data: List[SensorData]


class SensorCreate(BaseModel):
    sensor_type: str
    description: str
    location: str


class SensorDailyStatsResponse(BaseModel):
    day: date
    sensor_id: int
    avg_value: float
    min_value: float
    max_value: float
    reading_count: int
    median_value: float
    iqr_value: float
```

Each of the models represent the following:
- `SensorData`: A single sensor reading, including the value recorded and the timestamp when the reading occurred
- `SensorDataBatch`: A batch of data points, to support batch streaming in your API
- `SensorCreate`: The fields for creating a new sensor
- `SensorDailyStatsResponse`: The daily sensor statistics

## Creating the API Endpoints

In this section, you will define the FastAPI endpoints that allow you to manage sensor data. These endpoints handle tasks like creating new sensors, streaming sensor data (both single points and batches), and querying daily statistics for a specific sensor. With these endpoints, you can efficiently manage and analyze sensor data using TimescaleDB’s time-series capabilities.

```python
from fastapi import HTTPException, Path, Body, APIRouter, Depends
from database.postgres import get_postgres
from typing import Union, List
from asyncpg import Pool
from loguru import logger
from models.sensor_models import (
    SensorData,
    SensorDataBatch,
    SensorCreate,
    SensorDailyStatsResponse,
)

sensor_router = APIRouter()


@sensor_router.post("/sensors")
async def create_sensor(
    sensor: SensorCreate = Body(...), db: Pool = Depends(get_postgres)
):
    """
    Create a new sensor.

    Parameters
    ----------
    sensor : SensorCreate
        The sensor details (type, description, and location) to create.
    db : asyncpg.Pool
        Database connection pool injected by dependency.

    Returns
    -------
    dict
        A dictionary containing the newly created sensor ID and a success message.
    """
    insert_query = """
    INSERT INTO sensors (sensor_type, description, location)
    VALUES ($1, $2, $3)
    RETURNING sensor_id;
    """

    logger.info(
        f"Creating new sensor with type: {sensor.sensor_type}, location: {sensor.location}"
    )

    async with db.acquire() as conn:
        sensor_id = await conn.fetchval(
            insert_query, sensor.sensor_type, sensor.description, sensor.location
        )

    if sensor_id is None:
        logger.error("Failed to create sensor.")
        raise HTTPException(status_code=500, detail="Failed to create sensor")

    logger.info(f"Sensor created successfully with ID: {sensor_id}")
    return {"sensor_id": sensor_id, "message": "Sensor created successfully."}


@sensor_router.post("/sensor_data/{sensor_id}")
async def stream_sensor_data(
    sensor_id: int = Path(...),
    sensor_data: Union[SensorData, SensorDataBatch] = Body(...),
    db: Pool = Depends(get_postgres),
):
    """
    Stream sensor data (single or batch) for a specific sensor.

    Parameters
    ----------
    sensor_id : int
        The ID of the sensor to associate the data with.
    sensor_data : Union[SensorData, SensorDataBatch]
        The sensor data to stream, which can be either a single data point or a batch.
    db : asyncpg.Pool
        Database connection pool injected by dependency.

    Returns
    -------
    dict
        A success message once the data is streamed.
    """
    insert_query = """
    INSERT INTO sensor_data (sensor_id, value, time)
    VALUES ($1, $2, $3);
    """

    logger.info(f"Streaming data for sensor_id: {sensor_id}")

    async with db.acquire() as conn:
        async with conn.transaction():
            if isinstance(sensor_data, SensorDataBatch):
                for data in sensor_data.data:
                    logger.debug(f"Batch data: {data.value} at {data.timestamp}")
                    await conn.execute(
                        insert_query, sensor_id, data.value, data.timestamp
                    )
            elif isinstance(sensor_data, SensorData):
                logger.debug(
                    f"Single data: {sensor_data.value} at {sensor_data.timestamp}"
                )
                await conn.execute(
                    insert_query, sensor_id, sensor_data.value, sensor_data.timestamp
                )

    logger.info(f"Sensor data streamed successfully for sensor_id: {sensor_id}")
    return {"message": "Sensor data streamed successfully."}


@sensor_router.get(
    "/daily_avg/{sensor_id}", response_model=List[SensorDailyStatsResponse]
)
async def get_sensor_daily_avg(
    sensor_id: int = Path(..., description="The ID of the sensor"),
    db: Pool = Depends(get_postgres),
):
    """
    Query daily statistics (min, max, median, IQR) for a specific sensor over the last 7 days.

    Parameters
    ----------
    sensor_id : int
        The ID of the sensor.
    db : asyncpg.Pool
        Database connection pool injected by dependency.

    Returns
    -------
    List[SensorDailyStatsResponse]
        A list of daily sensor statistics (average, min, max, median, IQR).
    """
    
    query = """
    WITH sensor_stats AS (
        SELECT 
            time_bucket('1 day', time) AS day,
            sensor_id,
            avg(value) AS avg_value,
            min(value) AS min_value,
            max(value) AS max_value,
            count(*) AS reading_count,
            percentile_cont(0.5) WITHIN GROUP (ORDER BY value) AS median_value,
            percentile_cont(0.75) WITHIN GROUP (ORDER BY value) -
            percentile_cont(0.25) WITHIN GROUP (ORDER BY value) AS iqr_value
        FROM sensor_data
        WHERE sensor_id = $1
        GROUP BY day, sensor_id
    )
    SELECT * FROM sensor_stats
    ORDER BY day DESC
    LIMIT 7;
    """

    async with db.acquire() as conn:
        rows = await conn.fetch(query, sensor_id)

    if not rows:
        raise HTTPException(status_code=404, detail="No data found for this sensor.")

    return [
        SensorDailyStatsResponse(
            day=row["day"],
            sensor_id=row["sensor_id"],
            avg_value=row["avg_value"],
            min_value=row["min_value"],
            max_value=row["max_value"],
            reading_count=row["reading_count"],
            median_value=row["median_value"],
            iqr_value=row["iqr_value"],
        )
        for row in rows
    ]

```

The code defines endpoints for:

- `POST /sensors`: This endpoint creates a new sensor by providing the sensor type, description, and location.

- `POST /sensor_data/{sensor_id}`: Streams sensor data for a specific sensor. The data can be a single point or a batch.

- `GET /daily_avg/{sensor_id}`: Retrieves daily statistics (average, min, max, median, IQR) for the given sensor over the last 7 days.

In the query for the sensor statistics, the data is able to be partitioned quickly with Timescale's `time_bucket()` function by using the indexes generated when you created the hypertable. Likewise, you can easily calculate things like the interquartile range (IQR) using Timescale-specific functions.

## Running the Application

After setting up the database, models, and API routes, the next step is to run the `FastAPI` application and test it out.

The `main.py` file defines the `FastAPI` application, manages the database lifecycle, and includes the routes you created above.

```python
from fastapi import FastAPI
from contextlib import asynccontextmanager
from database.postgres import init_postgres, close_postgres
from routes.sensor_routes import sensor_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_postgres()
    yield
    await close_postgres()


app: FastAPI = FastAPI(lifespan=lifespan, title="FastAPI TimescaleDB Sensor Data API")
app.include_router(sensor_router)
```

To run the application, use uvicorn CLI with the following command:

```bash
uvicorn main:app --host 0.0.0.0 --port 8080
```

Once the server is running, you can access the API documentation and test the endpoints directly in your browser:

- Interactive API Docs (Swagger UI):  
  Visit `http://127.0.0.1:8080/docs` to access the automatically generated API documentation where you can test the endpoints.
- Alternative Docs (ReDoc):  
  Visit `http://127.0.0.1:8080/redoc` for another style of API documentation.

## Testing the API

You can test your application using `HTTPie`, a command-line tool for making HTTP requests. The following steps will guide you through creating sensors, streaming data, and querying sensor statistics.

1. Retrieve sensor statistics for pre-generated data (optional).

   If you followed the optional data generation steps, you can retrieve daily statistics for the pre-generated sensors:

   ```bash
   http GET http://127.0.0.1:8080/daily_avg/1
   ```

   ```bash
   http GET http://127.0.0.1:8080/daily_avg/2
   ```

   These commands will return the daily statistics (average, min, max, median, and IQR) for the pre-generated temperature and humidity sensors over the last 7 days.

2. Create a new sensor.

   Start by creating a new sensor (e.g., a temperature sensor for the living room):

   ```bash shouldWrap
   http POST http://127.0.0.1:8080/sensors sensor_type="temperature" description="Living room temperature sensor" location="Living Room"
   ```

   You should see a response confirming the creation of the sensor with a unique ID:

   ```json
   {
       "sensor_id": 3,
       "message": "Sensor created successfully."
   }
   ```

3. Stream a single sensor data point.

   Stream a single data point for the newly created sensor (`sensor_id = 3`):

   ```bash shouldWrap
   http POST http://127.0.0.1:8080/sensor_data/3 value:=23.5 timestamp="2024-10-12T14:29:00"
   ```

   You should get a response indicating success:

   ```json
   {
       "message": "Sensor data streamed successfully."
   }
   ```

4. Stream a batch of sensor data.

   You can also stream multiple sensor data points in a batch for the same sensor:

   ```bash shouldWrap
   http POST http://127.0.0.1:8080/sensor_data/3 data:='[{"value": 22.5, "timestamp": "2024-10-12T14:30:00"}, {"value": 22.7, "timestamp": "2024-10-12T14:31:00"}]'
   ```

   This will send two data points to the sensor. The response will confirm successful streaming of the batch data:

   ```json
   {
       "message": "Sensor data streamed successfully."
   }
   ```

5. Retrieve daily statistics for the new sensor.

   After streaming the sensor data, you can retrieve the daily statistics for the new sensor (`sensor_id = 3`):

   ```
   http GET http://127.0.0.1:8080/daily_avg/3
   ```

   This will return daily statistics (average, min, max, median, and IQR) for the new sensor over the last 7 days:

   ```json
   [
       {
           "day": "2024-10-12",
           "sensor_id": 3,
           "avg_value": 22.6,
           "min_value": 22.5,
           "max_value": 22.7,
           "reading_count": 2,
           "median_value": 22.6,
           "iqr_value": 0.2
       }
   ]
   ```

By following these steps, you can easily create sensors, stream sensor data, and query statistics from your API. For sensors with pre-generated data, you can retrieve the statistics immediately. For new sensors, you can stream data and retrieve their daily stats dynamically.

## Conclusion

Now, you have created and tested an API for managing, streaming, and querying sensor data into `TimescaleDB` using `FastAPI`. By leveraging TimescaleDB for time-series data storage, you now have a high-performance solution for handling sensor data at scale.

As a next step, you can look into streaming data into the database using a distributed event platform like `Kafka` or `Red Panda`, or using `Timescale` to monitor the sensor data with `Apache Superset` or `Grafana`.