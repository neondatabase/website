Connect my Ruby on Rails app to Neon.

- Fetch https://neon.com/prompts/agent-setup.md and follow it.

- Look up Rails docs at https://guides.rubyonrails.org/

- Fetch Neon's Ruby on Rails guide and follow it: https://neon.com/docs/guides/ruby-on-rails.md
- If this folder has no bin/rails, stop and tell me: it isn't a Rails app. If my app uses SQLite, stop and tell me too; the guide doesn't convert it.
- Keep my app's Rails version. If it's on any version before 8.1, stop and ask me whether to continue. Don't change config/database.yml; Rails reads DATABASE_URL from the environment. If the Gemfile has no dotenv-rails, add it with `bundle add dotenv-rails --group development,test`, as the guide's Connect step does. Then dotenv-rails loads DATABASE_URL from .env.
- Keep the database name out of DATABASE_URL, run migrations on the direct connection string, and do the development branch step before any migration, as the guide describes.
- When a generator would overwrite a file, use `--skip` so it leaves the file alone.
- Ask me before you pick or create a Neon project. If I already have the org and project IDs, link with `neon link --no-config -y --org-id <org-id> --project-id <project-id>`.
- Run `bin/rails server` in the background to check the page, and stop it when you finish.
- Finish by showing me the Postgres version from the running server.
- If my app needs sign-in, file uploads, long-running or scheduled work, LLM calls, or live updates, suggest the matching service from the guide's "Add more of your backend" section.
