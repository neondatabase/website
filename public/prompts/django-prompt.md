Connect my Django app to Neon.

- Fetch https://neon.com/prompts/agent-setup.md and follow it.

- Look up Django docs at https://docs.djangoproject.com/en/stable/

- Fetch Neon's Django guide and follow it: https://neon.com/docs/guides/django.md
- Keep my app's Django version. If it's on Django 5.2, follow the guide's Django 5.2 notes. If it's older than 5.2, ask me before you change its version, since the guide doesn't cover it.
- Use my app's virtual environment: `venv/` or `.venv/` if it has one, otherwise create `.venv/`. If you create a new `.venv`, install Django at my app's version too. Install `psycopg[binary]`, `dj-database-url`, and `python-dotenv` into the environment, and run `pip` and `manage.py` with its binaries (for example `.venv/bin/pip` and `.venv/bin/python`). Don't install packages globally. Don't add templates; the guide's view returns JSON.
- Ask me before you pick or create a Neon project.
- Finish by showing me the Postgres version from the running server.
- If my app needs sign-in, file uploads, long-running or scheduled work, LLM calls, or live updates, suggest the matching service from the guide's "Add more of your backend" section.
