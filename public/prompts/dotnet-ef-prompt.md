Connect my .NET Entity Framework Core project to Neon.

- Fetch https://neon.com/prompts/agent-setup.md and follow it.

- Look up the EF Core docs at https://learn.microsoft.com/en-us/ef/core/
- Look up the Npgsql provider docs at https://www.npgsql.org/efcore/index.html

- Fetch Neon's Entity Framework guide and follow it: https://neon.com/docs/guides/dotnet-entity-framework.md
- EF Core 10 requires .NET 10. If my project targets .NET 9 or older, ask me before you upgrade it to .NET 10.
- If Program.cs or my DbContext has code I wrote, ask me before you replace it.
- Ask me before you pick or create a Neon project.
- Ask me which branch to use before you run a migration.
- If a migration command asks to reset or drop data, stop and ask me.
- Finish by showing me the Postgres version that the program prints.
- If my app needs file uploads, LLM calls, or long-running work, suggest the matching service from the guide's "Add more of your backend" section.
