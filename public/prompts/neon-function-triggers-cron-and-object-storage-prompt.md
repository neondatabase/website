I want to build an automated background-work pipeline using Neon Function Triggers, with both a cron schedule trigger and an Object Storage trigger invoking the same Neon Function.

Use the guide and following docs as a reference:
- https://neon.com/guides/neon-function-triggers-cron-and-object-storage
- https://neon.com/docs/compute/functions/triggers/overview
- https://neon.com/docs/compute/functions/triggers/schedule
- https://neon.com/docs/compute/functions/triggers/object-storage

Before writing any code:

1. Inspect my existing project and understand its current structure.

2. Check if the Neon CLI is authenticated by running `neon me`. If it isn't, run `neon login` and wait for me to complete sign-in before continuing.

3. Ask me what I want the triggers to do, and whether I want to:
   - follow the CSV ingestion example in the guide closely,
   - adapt the example to my own file format and data model, or
   - build a different workload that uses the same two trigger types (schedule and storage_object_created).

4. Ask only the questions you need to understand my requirements. For example:
   - What should run on a schedule, and at what cadence (in UTC)?
   - What bucket and key prefix should the object trigger watch?
   - What should the handlers do on failure: retry, log and continue, or alert?
   - Do I want both triggers on one function with separate routes, or separate functions?

5. Wait for my confirmation before making significant changes.

6. Implement it step by step following the guide's patterns. Install the agent skills the guide lists: `neon skills -s neon -s neon-functions -s neon-object-storage -y`.

7. Ask for a credential only when an implementation step actually needs it, and stop until I provide or configure it. Don't guess values or use placeholders without telling me what I need to do. Whenever I need to create or obtain a credential:
   - Tell me exactly what it is used for.
   - Show me where to get it.
   - Give me step-by-step instructions for creating it, including any required settings.
   - Tell me where the credential should be stored in my project.

8. Keep the implementation as simple as possible. Don't introduce additional frameworks, services, or abstractions unless they are necessary.

9. After implementation, show me how to:
    - upload a test object with and confirm the ingest run in the logs.
    - verify the database rows with `neon psql`,
    - test the schedule trigger.
    - and list and manage the triggers.

10. If something fails, explain the likely cause and help me troubleshoot it before making unrelated changes. Remember that a newly created trigger takes a few seconds to become active, and that a run already queued for the upcoming minute still fires after you change a schedule.

When you need to inspect or query my database, use `neon psql` and pass the correct branch name; run `neon branches list` or ask me if you're not sure which branch to target. Never run destructive commands against my database or storage (`DELETE`, `UPDATE`, `DROP`, `TRUNCATE`, deleting objects, and similar) without showing me the exact command first and getting my explicit approval.

Never print connection strings or other secrets back to me. If the guide and my repo state ever disagree, trust the guide and tell me what you changed.
