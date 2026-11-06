Help me get set up with Neon Object Storage, based on my project:

1. Install the Neon CLI with `npm install -g neon@latest`.
2. Read Neon's skill at https://neon.com/.well-known/agent-skills/neon/SKILL.md and use it to guide this setup.
3. Run `neon init` to link a project in a region that supports Object Storage and install Neon's agent tooling.
4. Add a simple private bucket and upload a small text file to it with the Files SDK, then prove it works: list the bucket, read the file back, and show me its contents. Don't print secrets.
