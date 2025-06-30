---
title: app.build
subtitle: Open-source AI agent for full-stack application generation
enableTableOfContents: true
updatedOn: '2025-06-04T19:40:50.195Z'
---

app.build is our exploration of what AI agents can do with a complete backend stack. We built it after working with partners like Replit and other agent-driven platforms, learning what it takes to automate not just code generation, but the entire development workflow. This open-source project creates and deploys full-stack applications from scratch. It handles everything: database provisioning, authentication, testing, CI/CD, and deployment. The agent breaks down app creation into discrete tasks, validates each piece, and assembles them into working applications. Think of it as a blueprint you can use, fork, or extend to build your own agent infrastructure.

## Why app.build

- **Transparency**: Open-source codebase lets you see exactly how the agent makes decisions and generates code
- **Extensibility**: Add your own templates, models, or deployment targets
- **Learning**: Understand agent architectures by examining a working implementation
- **Best practices built-in**: Every app includes testing, CI/CD, and proper project structure
- **Reference architecture**: Use as a starting point for your own agent infrastructure
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

These patterns emerged from working with production agent platforms where reliability and validation are critical. The modular design means you can trace exactly what the agent is doing at each step, making it straightforward to debug issues or add new capabilities.

## Extending app.build

As a blueprint for agent infrastructure, app.build is designed to be forked and modified:

- **Custom templates**: Replace the default web app template with your own
- **Alternative models**: Swap Anthropic (default) for OpenAI, Llama, or other LLMs
- **Different providers**: Change database, hosting, or auth providers
- **New validations**: Add your own code quality checks
- **Modified workflows**: Adjust the generation pipeline to your needs

## Local development

Everything can run locally with your choice of LLM provider:

- Use any LLM provider or self-hosted models
- Skip deployment for local-only development
- Modify templates without restrictions
- Debug the agent's decision-making process

Setup instructions are in the app.build source repositories, with guides for local CLI, custom models, and agent setup in development.

## Current limitations

As a reference implementation, we've made specific choices to keep the codebase clear and extensible:

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

The project welcomes contributions at all levels, from fixing typos to exploring new generation strategies.

## Latest information

For the most up-to-date information and announcements, visit [app.build](https://app.build/). Our [blog](https://app.build/blog/) features technical deep-dives into the agent architecture, code generation strategies, and community contributions.
