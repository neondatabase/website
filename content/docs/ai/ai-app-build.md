---
title: app.build
subtitle: Open-source AI agent for full-stack application generation
enableTableOfContents: true
updatedOn: '2025-06-02T16:54:40.445Z'
---

app.build is an open-source agent that generates and deploys full-stack web applications. Unlike LLMs that produce isolated code snippets, this agent creates complete, functional applications by iterating on code, running tests, and making decisions based on technical feedback like compilation errors, linter output, and test results.

## Why app.build

- **Transparency**: Open-source codebase lets you see exactly how the agent makes decisions and generates code
- **Extensibility**: Add your own templates, models, or deployment targets
- **Learning**: Understand agent architectures by examining a working implementation
- **Best practices built-in**: Every app includes testing, CI/CD, and proper project structure
- **Community-driven**: Contribute improvements that benefit everyone using the platform

## Getting started

```bash
npx @app.build/cli
```

This command launches the CLI, which will ask you to sign in with GitHub (required for code storage and deployment). Each generated application gets its own repository in your account and is deployed with a real backend and database. The CLI supports both creating new apps and iterating on existing ones (adding features or making changes).

## What it generates

- Backend: Fastify server with Drizzle ORM
- Frontend: React application built with Vite
- Database: Postgres instance (Neon by default)
- Authentication: An auth integration (Neon Auth by default)
- Tests: Playwright end-to-end tests
- CI/CD: GitHub Actions configuration

## Infrastructure

Generated applications use (by default):

- Neon for Postgres database and authentication
- Koyeb for hosting
- GitHub for code repository and CI/CD

All infrastructure choices can be modified when running locally.

## Architecture

The agent works by:

- Writing and running end-to-end tests as part of the generation pipeline
- Using a well-tested base template with technologies the agent deeply understands
- Breaking work into small, independent tasks that can be solved reliably
- Running quality checks on every piece of generated code

The modular design means you can trace exactly what the agent is doing at each step, making it straightforward to debug issues or add new capabilities.

## Local development

Everything can run locally with your choice of LLM provider:

- Use any LLM provider or self-hosted models
- Skip deployment for local-only development
- Modify templates without restrictions
- Debug the agent's decision-making process

Setup instructions are in the app.build source repositories, with guides for local CLI, custom models, and agent setup in development.

## Extending app.build

The codebase is structured to support:

- **Custom templates**: Replace the default web app template with your own
- **Alternative models**: Swap Anthropic (default) for OpenAI, Llama, or other LLMs
- **Different providers**: Change database, hosting, or auth providers
- **New validations**: Add your own code quality checks
- **Modified workflows**: Adjust the generation pipeline to your needs

## Current limitations

- Single template for web applications with a fixed tech stack
- Limited customization options in managed mode
- CLI is basic - create and iterate functionality only
- Sparse documentation

## Contributing

- Repositories:
  - [github.com/appdotbuild/agent](https://github.com/appdotbuild/agent) (agent logic and generation)
  - [github.com/appdotbuild/platform](https://github.com/appdotbuild/platform) (backend infrastructure)
- Issues: Bug reports, feature requests, and discussions
- PRs: Code contributions, documentation, templates

The project welcomes contributions at all levels, from fixing typos to adding new generation strategies.

## Latest information

For the most up-to-date information and announcements, visit [app.build](https://app.build/). Our [blog](https://app.build/blog/) features technical deep-dives into the agent architecture, code generation strategies, and community contributions.
