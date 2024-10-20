---
title: Building an API with Django, Django REST Framework, and Neon Postgres
subtitle: Learn how to create a robust RESTful API for an AI Model Marketplace using Django, Django REST Framework, and Neon's serverless Postgres
author: bobbyiliev
enableTableOfContents: true
createdAt: '2024-09-15T00:00:00.000Z'
updatedOn: '2024-09-15T00:00:00.000Z'
---

Django is one of the most popular Python web frameworks for building web applications and APIs. Django REST Framework extends Django to provide powerful tools for building RESTful APIs quickly and efficiently based on your Django models with minimal code.

In this guide, we will go over how to build a RESTful API for an fictional AI Model Marketplace using Django and Django REST Framework with Neon's serverless Postgres as the database backend.

## Prerequisites

To follow this guide, you'll need:

- Python 3.8 or higher installed on your machine
- A [Neon account](https://console.neon.tech/signup) with a project created
- Basic familiarity with Django and RESTful API concepts

## Setting up the project

### Create a virtual environment

First, let's set up a new Python virtual environment for our project:

```bash
python -m venv neon-django-ai-marketplace
source neon-django-ai-marketplace/bin/activate  # On Windows, use `neon-django-ai-marketplace\Scripts\activate`
```

This creates a new virtual environment named `neon-django-ai-marketplace` and activates it, ensuring our project dependencies are isolated.

After activating the virtual environment, you should see `(neon-django-ai-marketplace)` in your terminal prompt.

### Install required packages

Now, let's install the necessary packages:

```bash
pip install django djangorestframework psycopg2-binary python-dotenv
```

This command installs Django, Django REST Framework, the PostgreSQL adapter for Python, and a package to manage environment variables. We'll use Django for the web framework, DRF for building the API, and psycopg2-binary to connect to the Neon Postgres database.

### Create a new Django project

With the dependencies installed, create a new Django project named `ai_marketplace`:

```bash
django-admin startproject ai_marketplace
```

Once the project is created, navigate to the project directory:

```bash
cd ai_marketplace
```

### Configure the database connection

To connect to Neon's serverless Postgres database, we need to set up the database connection in the Django project.

Open the `settings.py` file to configure the database connection. By default, Django uses SQLite as the database backend. Replace the `DATABASES` section with the following:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_database_name',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'your_neon_hostname',
        'PORT': '5432',
    }
}
```

Replace the placeholders with your Neon database details. You can find these details in the Neon Console under **Connection Details**.

To verify the connection, run the Django development server:

```bash
python manage.py runserver
```

If the server starts without errors, you've successfully connected to the Neon database.

## Creating the API

Now that we have the Django project set up and connected to the Neon database, let's create the simple API for our AI Model Marketplace.

### Define the models

In Django, models are Python classes that represent database tables. Create a new Django app for our AI Model Marketplace:

```bash
python manage.py startapp models_api
```

Add the new app to `INSTALLED_APPS` in `settings.py`, this essentially registers the app with the Django project:

```python
INSTALLED_APPS = [
    # ... (existing apps)
    'rest_framework',
    'models_api',
]
```

Now, let's define our models in `models_api/models.py`:

```python
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class ModelAuthor(models.Model):
    name = models.CharField(max_length=200)
    bio = models.TextField()
    contact_info = models.EmailField()
    rating = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)])

    def __str__(self):
        return self.name

class AIModel(models.Model):
    MODEL_TYPES = [
        ('NLP', 'Natural Language Processing'),
        ('CV', 'Computer Vision'),
        ('RL', 'Reinforcement Learning'),
        ('OTHER', 'Other'),
    ]
    FRAMEWORKS = [
        ('PT', 'PyTorch'),
        ('TF', 'TensorFlow'),
        ('KRS', 'Keras'),
        ('OTHER', 'Other'),
    ]
    name = models.CharField(max_length=200)
    model_type = models.CharField(max_length=5, choices=MODEL_TYPES)
    description = models.TextField()
    framework = models.CharField(max_length=5, choices=FRAMEWORKS)
    version = models.CharField(max_length=50)
    download_url = models.URLField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    tags = models.JSONField()
    author = models.ForeignKey(ModelAuthor, on_delete=models.CASCADE, related_name='models_uploaded')

    def __str__(self):
        return f"{self.name} - {self.version}"

class ModelPurchase(models.Model):
    user = models.CharField(max_length=200)  # Simplified for this example
    ai_model = models.ForeignKey(AIModel, on_delete=models.CASCADE)
    purchase_date = models.DateTimeField(auto_now_add=True)
    price_paid = models.DecimalField(max_digits=10, decimal_places=2)
    license_key = models.CharField(max_length=100)
    download_link = models.URLField()

    def __str__(self):
        return f"{self.user} - {self.ai_model.name}"

class UsageScenario(models.Model):
    ai_model = models.ForeignKey(AIModel, on_delete=models.CASCADE, related_name='usage_scenarios')
    title = models.CharField(max_length=200)
    description = models.TextField()
    code_snippet = models.TextField()
    usage_frequency = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.ai_model.name} - {self.title}"

class ModelBenchmark(models.Model):
    ai_model = models.ForeignKey(AIModel, on_delete=models.CASCADE, related_name='benchmarks')
    metric_name = models.CharField(max_length=100)
    value = models.FloatField()
    benchmark_date = models.DateTimeField(auto_now_add=True)
    hardware_used = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.ai_model.name} - {self.metric_name}: {self.value}"
```

Here we define five models:

- `ModelAuthor`: Represents the creator of AI models. It includes fields for name, bio, contact info, and rating.
- `AIModel`: Represents individual AI models with their details. It includes fields for name, model type, description, framework, version, download URL, price, tags, and author.
- `ModelPurchase`: Tracks purchases and downloads of AI models. It includes fields for the user, AI model, purchase date, price paid, license key, and download link.
- `UsageScenario`: Represents suggested use cases for each AI model. It includes fields for the AI model, title, description, code snippet, and usage frequency.
- `ModelBenchmark`: Stores performance benchmarks for AI models. It includes fields for the AI model, metric name, value, benchmark date, and hardware used.

The models are related to each other using foreign keys and related names to establish relationships between entities.

Django's ORM will automatically create the corresponding database migrations for tables based on these models. You can customize the models further by adding fields, methods, or meta options as needed.

### Create and apply migrations

Unlike other web frameworks like Laravel where you need to manually create database migrations which are separate from your models, Django allows you to define your models and then generate migrations automatically based on those models.

With the models defined in the previous step, all that's left is to create and apply the migrations to create the corresponding tables in the database. To generate the migrations, run:

```bash
python manage.py makemigrations
```

You should see output similar to:

```bash
Migrations for 'models_api':
  models_api/migrations/0001_initial.py
    + Create model ModelAuthor
    + Create model AIModel
    + Create model ModelBenchmark
    + Create model ModelPurchase
    + Create model UsageScenario
```

You can review the generated migration files in the `models_api/migrations` directory to see the actual migration operations that will be applied to the database based on your models.

Apply the migrations to create the corresponding tables in the Neon database:

```bash
python manage.py migrate
```

This command will create the tables for the models defined in the `models_api` app in the Neon database. The output should indicate that the migrations were applied successfully:

```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, models_api, sessions
Running migrations:
  Applying models_api.0001_initial... OK
```

You can verify that the tables were created in the Neon Console or by connecting to the database using a PostgreSQL client like `psql`.

### Implement serializers

With our models defined, we need to create serializers to convert model instances to JSON and vice versa. Serializers are a key component of Django REST Framework and are used to handle the conversion between complex data types (like Django model instances) and Python datatypes that can be easily rendered into JSON, XML, or other content types.

Start by creating a new file `models_api/serializers.py`:

```python
from rest_framework import serializers
from .models import ModelAuthor, AIModel, ModelPurchase, UsageScenario, ModelBenchmark

class ModelAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelAuthor
        fields = ['id', 'name', 'bio', 'contact_info', 'rating']

class AIModelSerializer(serializers.ModelSerializer):
    author = ModelAuthorSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(
        queryset=ModelAuthor.objects.all(), source='author', write_only=True
    )

    class Meta:
        model = AIModel
        fields = ['id', 'name', 'model_type', 'description', 'framework', 'version',
                  'download_url', 'price', 'tags', 'author', 'author_id']

class ModelPurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelPurchase
        fields = ['id', 'user', 'ai_model', 'purchase_date', 'price_paid', 'license_key', 'download_link']

class UsageScenarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsageScenario
        fields = ['id', 'ai_model', 'title', 'description', 'code_snippet', 'usage_frequency']

class ModelBenchmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelBenchmark
        fields = ['id', 'ai_model', 'metric_name', 'value', 'benchmark_date', 'hardware_used']
```

Let's break down each serializer to better understand their purpose:

1. `ModelAuthorSerializer`:

   - This serializer is used for the `ModelAuthor` model, it basically represents the author details.
   - It includes all fields of the model (`id`, `name`, `bio`, `contact_info`, `rating`).
   - By using `ModelSerializer`, we automatically get create and update functionality that matches the model fields.

2. `AIModelSerializer`:

   - This serializer is more complex due to its relationship with `ModelAuthor`.
   - We include a nested `author` field using `ModelAuthorSerializer(read_only=True)`. This means when serializing an `AIModel`, it will include all the author's details, but this field can't be used for writing (creating or updating).
   - We also include an `author_id` field, which is write-only. This allows clients to specify an author when creating or updating an `AIModel` by just providing the author's ID.
   - The `source='author'` in the `author_id` field tells DRF to use this field to set the `author` attribute of the `AIModel`.

3. `ModelPurchaseSerializer`:

   - This serializer includes all fields from the `ModelPurchase` model.
   - It will handle the serialization of purchase records, including details like the user, the AI model purchased, purchase date, and license information.

4. `UsageScenarioSerializer`:

   - This serializer corresponds to the `UsageScenario` model.
   - It includes all fields, allowing for the representation of different use cases or scenarios for AI models.

5. `ModelBenchmarkSerializer`:
   - This serializer is for the `ModelBenchmark` model.
   - It includes all fields, enabling the representation of performance benchmarks for AI models.

These serializers provide a powerful abstraction layer between your Python objects and the JSON representations of your API. They handle both serialization (Python to JSON) and deserialization (JSON to Python), including validation of incoming data.

By using `ModelSerializer`, we get a lot of functionality out of the box, such as automatically generated fields based on the model fields, default implementations of `create()` and `update()` methods, and validation based on model field types.

This approach reduces the amount of code we need to write while still providing flexibility where needed (like in the `AIModelSerializer` where we customize the author-related fields).

### Create API views

Now, let's create views to handle API requests. We'll use ViewSets for a clean, RESTful API structure.

Start by opening the `models_api/views.py` file and defining the views:

```python
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ModelAuthor, AIModel, ModelPurchase, UsageScenario, ModelBenchmark
from .serializers import (ModelAuthorSerializer, AIModelSerializer, ModelPurchaseSerializer,
                          UsageScenarioSerializer, ModelBenchmarkSerializer)

class ModelAuthorViewSet(viewsets.ModelViewSet):
    queryset = ModelAuthor.objects.all()
    serializer_class = ModelAuthorSerializer

    @action(detail=True, methods=['get'])
    def models(self, request, pk=None):
        author = self.get_object()
        models = author.models_uploaded.all()
        serializer = AIModelSerializer(models, many=True)
        return Response(serializer.data)

class AIModelViewSet(viewsets.ModelViewSet):
    queryset = AIModel.objects.all()
    serializer_class = AIModelSerializer

    @action(detail=True, methods=['get'])
    def usage_scenarios(self, request, pk=None):
        model = self.get_object()
        scenarios = model.usage_scenarios.all()
        serializer = UsageScenarioSerializer(scenarios, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def benchmarks(self, request, pk=None):
        model = self.get_object()
        benchmarks = model.benchmarks.all()
        serializer = ModelBenchmarkSerializer(benchmarks, many=True)
        return Response(serializer.data)

class ModelPurchaseViewSet(viewsets.ModelViewSet):
    queryset = ModelPurchase.objects.all()
    serializer_class = ModelPurchaseSerializer

class UsageScenarioViewSet(viewsets.ModelViewSet):
    queryset = UsageScenario.objects.all()
    serializer_class = UsageScenarioSerializer

class ModelBenchmarkViewSet(viewsets.ModelViewSet):
    queryset = ModelBenchmark.objects.all()
    serializer_class = ModelBenchmarkSerializer
```

This code defines ViewSets for each model, providing CRUD operations for all entities in our AI Model Marketplace. The `ModelAuthorViewSet` and `AIModelViewSet` include custom actions to retrieve related data (uploaded models for authors, usage scenarios and benchmarks for AI models).

### Configure URL routing

Create a new file `models_api/urls.py` to define the URL patterns for our API:

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (ModelAuthorViewSet, AIModelViewSet, ModelPurchaseViewSet,
                    UsageScenarioViewSet, ModelBenchmarkViewSet)

router = DefaultRouter()
router.register(r'authors', ModelAuthorViewSet)
router.register(r'models', AIModelViewSet)
router.register(r'purchases', ModelPurchaseViewSet)
router.register(r'usage-scenarios', UsageScenarioViewSet)
router.register(r'benchmarks', ModelBenchmarkViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

This sets up the URL routing for our API views using DRF's `DefaultRouter`.

Now, update the project's main `urls.py` file to include the app's URLs:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Include the API URLs:
    path('api/', include('models_api.urls')),
]
```

This configuration makes our API accessible under the `/api/` path.

## Testing the API

With our API views and URL routing configured, we can now test the API by running the Django development server:

```bash
python manage.py runserver
```

If you were to now visit `http://localhost:8000/api/` in your browser, you would see a list of available API endpoints. This is the default behavior of DRF's `DefaultRouter`. If you were to visit `http://localhost:8000/api/authors/`, you would see a list of authors (which is currently empty), and so on for other endpoints. The web interface provided by DRF allows you to interact with the API endpoints directly from the browser like a simple API client, you can view, create, update, and delete records by interacting with the API endpoints directly.

Alternatively, you can use tools like `curl` or Postman to interact with the API programmatically. Here are some example `curl` commands to test the API:

1. Create a new model author:

   ```bash
   curl -X POST http://localhost:8000/api/authors/ -H "Content-Type: application/json" -d '{"name":"AI Innovations Inc.", "bio":"Leading AI research company", "contact_info":"contact@aiinnovations.com", "rating":4.8}'
   ```

   This will create a new model author with the specified details.

2. Create a new AI model:

   ```bash
   curl -X POST http://localhost:8000/api/models/ -H "Content-Type: application/json" -d '{"name":"AdvancedNLP", "model_type":"NLP", "description":"State-of-the-art NLP model", "framework":"PT", "version":"1.0", "download_url":"https://example.com/model", "price":"99.99", "tags":["NLP", "transformer"], "author_id":1}'
   ```

   This will create a new AI model associated with the author created in the previous step.

3. Get all AI models:

   ```bash
   curl http://localhost:8000/api/models/
   ```

4. Get usage scenarios for a specific AI model:

   ```bash
   curl http://localhost:8000/api/models/1/usage_scenarios/
   ```

5. Add a benchmark for an AI model:
   ```bash
   curl -X POST http://localhost:8000/api/benchmarks/ -H "Content-Type: application/json" -d '{"ai_model":1, "metric_name":"Accuracy", "value":0.95, "hardware_used":"NVIDIA A100 GPU"}'
   ```

## Conclusion

In this guide, we've built a RESTful API for a simple AI Model Marketplace using Django, Django REST Framework, and Neon's serverless Postgres. We covered setting up the project, defining models for AI models, authors, purchases, usage scenarios, and benchmarks, creating serializers and views, and configuring URL routing.

This API provides a solid foundation for an AI Model Marketplace platform. You can extend it with features like user authentication, advanced search and filtering, model versioning, and integration with payment systems. The combination of Django's powerful ORM, DRF's flexibility, and Neon's scalable Postgres database makes it easy to build and deploy robust, performant APIs for complex applications like AI model distribution platforms.

## Additional Resources

- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [Django Documentation](https://docs.djangoproject.com/en/stable/)
- [Neon Documentation](/docs/)

<NeedHelp />
