---
title: 'How to build and authenticate an AI API using Modal, Neon, and Unkey'
description: A guide to building an OpenAI Whisper API
excerpt: >-
  As a developer building a product, you might want to open up access to your
  API. But this requires you to solve a few problems: All of this takes work and
  take time away from actually building your product. That’s where Unkey comes
  in. Unkey provides API keys a service so that yo...
date: '2024-02-14T11:55:37'
updatedOn: '2024-03-27T11:32:26'
category: community
categories:
  - community
authors:
  - dom-eccleston
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-build-and-authenticate-an-ai-api-using-modal-neon-and-unkey/cover.png
  alt: null
isFeatured: false
seo:
  title: 'How to build and authenticate an AI API using Modal, Neon, and Unkey - Neon'
  description: A guide to building an OpenAI Whisper API
  keywords: []
  noindex: false
  ogTitle: 'How to build and authenticate an AI API using Modal, Neon, and Unkey - Neon'
  ogDescription: >-
    As a developer building a product, you might want to open up access to your
    API. But this requires you to solve a few problems: All of this takes work
    and take time away from actually building your product. That’s where Unkey
    comes in. Unkey provides API keys a service so that you can safely […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-build-and-authenticate-an-ai-api-using-modal-neon-and-unkey/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-build-and-authenticate-an-ai-api-using-modal-neon-and-unkey/image-16-1024x576-2d9f474b.png)

As a developer building a product, you might want to open up access to your API. But this requires you to solve a few problems:

- Security: you need to open up your API safely and securely. This means sharing a secret – an API key – with the people you’re giving access to.
- Rate limiting: you don’t want to give up unlimited access to your API. You need to control the rate at which developers make requests to your server.
- Analytics: you want observability into how your API is being used.
- Access control: you want to control which APIs you’re giving access to and whether you’re allowed read access, write access, or both.
- Speed: you want to do all of this without adding latency to requests.

All of this takes work and take time away from actually building your product.

That’s where [Unkey](https://unkey.dev/) comes in. Unkey provides API keys a service so that you can safely open up access to your API in minutes. To show you how it works, let’s run through an example of building an AI API – we’ll use the example of building an API that can transcribe and summarize text.

We’ll use Neon for our Postgres database, and [Modal](https://modal.com/) to host and deploy our API. In the end, we’ll have a usable deployed API, fully secured by Unkey.

## Our application

[Whisper](https://github.com/openai/whisper) is a general-purpose speech recognition model by OpenAI. Using Whisper, you can take an audio file as input and generate a text transcript in various languages.

Whisper is available as an open-source Python library. Although it’s available in hosted form via OpenAI and other providers, let’s explore what it would take to build and host our Whisper API.

## Getting started

Since we want to build an ML API here, we’ll be using Modal, a product that allows you to easily deploy Python libraries in the cloud. For our Python web API, we’ll make use of FastAPI.

First, some housekeeping and project setup:

```bash
python3 -m pip install modal
mkdir whisper-api
cd whisper-api
touch whisper-api/main.py
```

Let’s get started by initializing an image for our API, by providing it with the required Python dependencies, and passing it to a Modal stub. In Modal terminology, a `stub` is a blueprint for how to create a new Modal application.

Modal integrates with FastAPI for developing applications as Python REST APIs. Let’s set up a new FastAPI application and pass our Modal stub to it:

```python
from fastapi import FastAPI
from modal import Image, Stub, asgi_app

web_app = FastAPI()

@stub.function(image=app_image)
@asgi_app()
def fastapi_app():
    return web_app
```

In these few lines of code, we’re doing the following:

- Decorating a function with `@stub.function`, telling Modal that this forms part of our Modal stub application
- Decorating it with `@asgi_app`, telling Modal that this route should be run as a Python API
- Initializing a new FastAPI application with Modal context loaded

With these few lines of code done, we’re now able to run our Modal application. Give it a try:

```bash
# You'll need to run `python3 -m pip install modal` first

python3 -m modal serve main.py
```

With this, we will see our Modal application initialized and running on a deployed URL – straight to the deployed step, with no need for a preview URL.

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-build-and-authenticate-an-ai-api-using-modal-neon-and-unkey/image-17-1024x160-03a35bc5.png)

### Creating a transcription route

```python
from fastapi import FastAPI, UploadFile, Header
from tempfile import NamedTemporaryFile

# ... previous code

@web_app.post("/transcribe")
async def transcribe(file: UploadFile):
  import whisper
  
  # Create temporary file to run Whisper on
  with NamedTemporaryFile(delete=False) as temp_file:
      content = await file.read()
      temp_file.write(content)
      temp_file_path = temp_file.name

      # Transcribe audio
      model = whisper.load_model("base")
      result = model.transcribe(temp_file_path)
```

Here, we’ve set up a new route and told FastAPI that we want this to receive POST requests. We’ve specified via the parameters that it should receive files (since we want to transcribe audio). Within the body of the function, we import Whisper – since this code will be run in the cloud, we need to specify our dependencies within the body of the function.

Since Whisper expects a named file as an argument, we need to write our MP3 file to a temporary file before we initialize the Whisper library and pass it to it. After running Whisper on the file, we simply return it back to the user as a response.

This works already – try running it with `python3 -m modal serve main.py`. We can then make a request with a local .mp3 file:

```bash
curl -X POST {modal_url} -F '--file=@{local_mp3_file.mp3}' -H 'Content-Type: application/json' 
```

### Getting ready for production

To explore how we can get this API route ready for users, let’s look at a couple of other features: first, adding data persistence with Neon, and secondly, adding authorization with Unkey.

Adding persistence with Neon is useful since we can allow users to save their results, rather than transcribing the same file multiple times. Adding this is easy via Python’s `psycopg2` library.

First, we’ll need a database. With Neon, we can spin up a new serverless Postgres database in under a minute. Let’s do it:

```bash
# You'll need to `brew install neonctl` if you haven't already

neonctl auth
neonctl databases create --name='whisper-api'

# save our connection string to a .env file
neonctl connection-string main --database-name='whisper-api' > .env
```

Let’s access our database and create the required table:

```bash
# requires postgres: `brew install postgresql`

# Run this to connect to your Postgres database
psql {connection string}

	# Run this from within psql to create the table
CREATE TABLE transcripts (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255),
    transcript TEXT
);

# Quit
\\q
```

We need to access the database securely from our Modal application, so we’ll also create a new secret with our connection string and pass it to our stub:

```bash
modal secret create whisper-api-secret DATABASE_URL={connection string}
```

```bash
# ...previous code 

@stub.function(image=app_image, secret=Secret.from_name("whisper-api-secret"))
```

With that done, we can easily update our code to connect to our new database and save the result rather than simply returning it to the user:

```python
import os

# ...

	model = whisper.load_model("base")
	result = model.transcribe(temp_file_path)

	connection_string = os.getenv("DATABASE_URL")
    connection = psycopg2.connect(connection_string)
    cursor = connection.cursor()
    cursor.execute("INSERT INTO transcripts (filename, transcript) VALUES (%s, %s) RETURNING id;", (file.filename, result))
    id = cursor.fetchone() [0]
    connection.commit()
    cursor.close()
    connection.close()
```

With data persistence added, we’ve now got the ability to build a web UI to return results to the user in a convenient format: see this Github link for an example of an implementation that renders results in a Next.js web application and sends a permanent link back to the user.

### Adding auth

Currently we’re exposing our Modal API to the world via the public URL of the deployed API. In order to limit access, let’s add authentication to our API.

First, we’ll add the `unkey.py` package to our Modal app image:

```python
app_image = (
    Image.debian_slim()
    .pip_install(
        "openai-whisper",
        "dacite",
        "jiwer",
        "ffmpeg-python",
        "gql [all]~=3.0.0a5",
        "pandas",
        "loguru==0.6.0",
        "torchaudio==0.12.1",
        "yt-dlp",
        "python-dotenv",
        "psycopg2-binary",
        "unkey.py"
    )
    .apt_install("ffmpeg")
    .pip_install("ffmpeg-python")
)
```

Now, let’s use Unkey to read an API key from the `Authorization` header and verify the key:

```python
@web_app.post("/transcribe")
async def transcribe(file: UploadFile, authorization: str = Header(None)):
  import unkey
  import os
  from dotenv import load_dotenv
  import whisper
  import psycopg2

  load_dotenv()

  # Authorize request using Unkey

  if not authorization:
    return { "error": "Must supply API key in Authorization header." }
  else:
    schema, _, token = authorization.partition(" ")

    client = unkey. Client(api_key=os.environ ["UNKEY_ROOT_KEY"])

    result = await verify_key(client, token)
```

Our `verify_key` function calls the Unkey API for the given token, handling errors or invalid tokens if they occur:

```python
async def verify_key(client, token):
  await client.start()

  result = await client.keys.verify_key(token, api_id=os.environ ["UNKEY_API_ID"])

  await client.close()

  if not result.is_ok:
    result = result.unwrap_err()
    raise Exception("Error verifying token.")
  else:
    data = result.unwrap()
    if not data.valid:
      raise Exception("Invalid key.")

  return result
```

As a final touch, let’s add a way to display the resulting transcripts in a Vercel web application. I’ll skip over the frontend part here, but you can view the code in the Github below if interested. With this built, we can return a permanent link to a transcript back from our API:

```python
return { "result": f'Transcribed audio file successfully. Access it at <https://modal-roan.vercel.app/{id}.'> }
```

## Recap

Here we’ve used the example of creating and deploying a machine learning API in Python, but Unkey supports a wide range of frameworks; regardless of what you’re building, Unkey makes it easy to add authentication to your APIs in just a few lines of code.

To view the full code used in this tutorial, check out the [whisper-api GitHub repo](https://github.com/domeccleston/whisper-api).
