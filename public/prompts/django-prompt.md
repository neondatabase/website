# 💡 AI Prompt: Connect Django to Neon Postgres

**Role:** You are an expert software agent responsible for configuring the current Django project to connect to a Neon Postgres database.

**Purpose:** To connect the current Django project to Neon Postgres by installing the required packages, configuring `settings.py` for the database, and creating a working example to validate the setup.

**Scope:**
- Must be run inside an existing Django project directory.
- Assumes the user has a Neon project and access to their connection parameters.
- All package installations must occur within an active Python virtual environment.

✅ Read and understand the entire instruction set before executing.

---

## 🛠️ Instructions (for AI-enabled editors)

When this prompt is triggered, automatically configure the open Django project as follows:

### 1. Ensure a Virtual Environment is Active

This is a mandatory first step.
- Check for a virtual environment directory (e.g., `venv`, `.venv`) in the project root.
- If one does not exist, create it immediately by running:
  ```bash
  python3 -m venv venv
  ```
- **Execute all subsequent `pip` and `python` commands using the virtual environment's executables** (e.g., `venv/bin/python`, `venv/bin/pip`).

---

### 2. Install Dependencies

Install the required Python packages into the virtual environment:

```bash
venv/bin/pip install "psycopg[binary]" python-dotenv
```

- **`psycopg[binary]`**: The modern, high-performance PostgreSQL driver for Python.
- **`python-dotenv`**: To load database credentials from a `.env` file.

---

### 3. Configure Environment Variables

1.  Check for the presence of a `.env` file at the root of the project. If it doesn't exist, create one.
2.  Add the following connection parameters to the `.env` file and **prompt the user to replace the placeholder values** with their credentials from Neon.

    ```dotenv title=".env"
    PGHOST='aws-xxx-pooler.neon.tech'
    PGDATABASE='neondb'
    PGUSER='your_neon_user'
    PGPASSWORD='your_neon_password'
    PGPORT=5432
    ```

3.  Direct the user to find these values in the **Neon Console → Project → Connect**.

---

### 4. Update Django Settings

Modify the project's main `settings.py` file to use these environment variables for the database connection.

1.  **Locate the `settings.py` file** (usually inside a directory named after your project).
2.  **Add imports** at the top of the file:
    ```python
    import os
    from dotenv import load_dotenv

    # Load environment variables
    load_dotenv()
    ```
3.  **Replace the entire `DATABASES` dictionary** with the following configuration. This setup reads credentials from the `.env` file and includes best practices for connecting to Neon.

    ```python
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'HOST': os.getenv('PGHOST'),
            'NAME': os.getenv('PGDATABASE'),
            'USER': os.getenv('PGUSER'),
            'PASSWORD': os.getenv('PGPASSWORD'),
            'PORT': os.getenv('PGPORT', 5432),
            'OPTIONS': {
                'sslmode': 'require',
            },
            'DISABLE_SERVER_SIDE_CURSORS': True,
            # Enable health checks to prevent errors from idle connections
            'CONN_HEALTH_CHECKS': True,
        }
    }
    ```

---

### 5. Create an Example to Test the Connection

To provide a clear way to verify the setup, create a simple view, template, and URL route that displays the PostgreSQL version from the connected Neon database.

1.  **Create a view:** In your project's main `urls.py` file's directory, create a new file named `views.py` (if it doesn't already exist) with the following content:

    ```python title="<project_name>/views.py"
    from django.shortcuts import render
    from django.db import connection

    def index(request):
        with connection.cursor() as cursor:
            cursor.execute("SELECT version();")
            db_version = cursor.fetchone()[0]
        
        context = {
            'db_version': db_version
        }
        return render(request, 'index.html', context)
    ```

2.  **Create a template:**
    - Create a directory named `templates` in your project's root directory (at the same level as `manage.py`).
    - Inside `templates`, create a file named `index.html`:

    ```html title="templates/index.html"
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Django + Neon</title>
        <style>
            body { font-family: sans-serif; display: grid; place-content: center; height: 100vh; margin: 0; }
            div { text-align: center; border: 1px solid #ddd; padding: 2rem 3rem; border-radius: 8px; }
            p { background-color: #f0f0f0; padding: 0.5rem; border-radius: 4px; }
        </style>
    </head>
    <body>
        <div>
            <h1>Neon Connection Successful!</h1>
            <p><strong>PostgreSQL Version:</strong> {{ db_version }}</p>
        </div>
    </body>
    </html>
    ```

3.  **Configure Templates and URLs:**
    - In `settings.py`, find the `TEMPLATES` setting and add the new `templates` directory:
      ```python
      TEMPLATES = [
          {
              'BACKEND': 'django.template.backends.django.DjangoTemplates',
              'DIRS': [os.path.join(BASE_DIR, 'templates')], # Add this line
              'APP_DIRS': True,
              'OPTIONS': {
                  # ...
              },
          },
      ]
      ```
    - In your project's main `urls.py`, add a route to the new view:
      ```python title="<project_name>/urls.py"
      from django.contrib import admin
      from django.urls import path
      from . import views # Import the new views

      urlpatterns = [
          path('admin/', admin.site.urls),
          path('', views.index, name='index'), # Add this route for the homepage
      ]
      ```

---

## 🚀 Next Steps

Once the file modifications are complete:

1.  Prompt the user to confirm that their Neon connection details are correctly set in the `.env` file.
2.  Run the initial database migrations:
    ```bash
    venv/bin/python manage.py migrate
    ```
3.  Start the Django development server:
    ```bash
    venv/bin/python manage.py runserver
    ```
4.  Finally, inform the user that the setup is complete and the server is running. To test the connection, they can visit `http://localhost:8000` in their browser, where they should see the PostgreSQL version from their Neon database.

---

## ✅ Validation Rules for AI

Before suggesting code or making edits, ensure:
- A Python virtual environment exists and is intended for use.
- The `psycopg[binary]` and `python-dotenv` packages are installed.
- A `.env` file is present or has been created.
- The `settings.py` file correctly imports `os` and `dotenv` and loads environment variables.
- The `DATABASES` dictionary in `settings.py` uses `os.getenv()` for all credentials and includes `'sslmode': 'require'` and `'CONN_HEALTH_CHECKS': True`.
- A testable example (view, template, URL) has been created to prove the connection.

---

## ❌ Do Not

- **Do not install packages globally** or outside of an active Python virtual environment.
- **Do not hardcode credentials** or sensitive information in `settings.py` or any other source code file.
- Do not output the contents of the `.env` file or the user's connection string in any response.
- Do not modify existing user views or URL routes unless necessary to add the root path.