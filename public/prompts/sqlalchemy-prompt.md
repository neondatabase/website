Connect my SQLAlchemy project to Neon.

- Fetch https://neon.com/prompts/agent-setup.md and follow it.

- Look up the SQLAlchemy 2.1 docs at https://docs.sqlalchemy.org/en/21/ and the Alembic docs at https://alembic.sqlalchemy.org/en/latest/

- Fetch Neon's SQLAlchemy guide and follow it: https://neon.com/docs/guides/sqlalchemy.md
- Keep my Python version and package manager. If my project uses pip, follow the guide's note for it.
- If my app uses SQLAlchemy 2.0 or older, ask me before upgrading it to 2.1.
- Ask me before you pick or create a Neon project.
- Ask me which branch to use before you run a migration.
- If a migration command asks to reset or drop data, stop and ask me.
- If db.py, models.py, main.py, or alembic/env.py has code I wrote, ask me before you replace it.
- Finish by showing me the Postgres version that the script prints.
- If my app needs sign-in, file uploads, long-running or scheduled work, or LLM calls, suggest the matching service from the guide's "Next steps" section.
