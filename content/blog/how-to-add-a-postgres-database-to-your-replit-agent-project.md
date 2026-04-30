---
title: How to Add a Postgres Database to Your Replit Agent Project
description: Ensure your applications can save and retrieve data across sessions
excerpt: >-
  If you’ve used Replit Agent, you already know it can configure your
  development environment, build apps, and deploy them to the cloud—all without
  needing to install anything yourself. But what you might not know is that
  Agent can configure databases for you, ensuring your applica...
date: '2024-12-20T01:53:02'
updatedOn: '2025-01-21T15:37:56'
category: community
categories:
  - community
  - ai
authors:
  - matt-palmer
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-add-a-postgres-database-to-your-replit-agent-project/cover.jpg
  alt: null
isFeatured: true
seo:
  title: How to Add a Postgres Database to Your Replit Agent Project - Neon
  description: >-
    You can tell Replit Agent to add configured Postgres databases and schemas
    to your app for data persistence. Learn how.
  keywords: []
  noindex: false
  ogTitle: How to Add a Postgres Database to Your Replit Agent Project - Neon
  ogDescription: >-
    You can tell Replit Agent to add configured Postgres databases and schemas
    to your app for data persistence. Learn how.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-add-a-postgres-database-to-your-replit-agent-project/social.jpg
source:
  wpId: 7955
  wpSlug: how-to-add-a-postgres-database-to-your-replit-agent-project
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-add-a-postgres-database-to-your-replit-agent-project/neon-postgres-to-replit-1-1024x576-ff7bfaa3.jpg)

If you’ve used [Replit Agent](https://docs.replit.com/replitai/agent), you already know it can configure your development environment, build apps, and deploy them to the cloud—all without needing to install anything yourself.

But what you _might_ not know is that Agent can configure databases for you, ensuring your application can store user data and access it later. In other words, it adds data persistence to your apps.

## Persistent data makes functional apps

Data persistence is the backbone of most applications: it ensures that information created or modified by users—like preferences, progress, or scores—remains accessible even after the app is closed or refreshed.

Without persistent storage, apps would lose all their data between sessions, making them far less functional.

For instance, imagine you built a classic game of snake. Without a database to store high scores, the moment you refresh the page, all your progress would go.

Similarly, consider a habit tracker app. If it couldn’t save your habits beyond one browser session, it wouldn’t be a very useful tool for maintaining long-term habits.

## Replit Agent knows how to handle persistence

One of the great features of Replit Agent is that it detects when an app requires data persistence and automatically adds a Neon Postgres database to support it.

Take persistence in a habit tracker—without it, users would lose their progress! Agent is smart and typically incorporates a database by default, for functional apps right from the start.

But what if Replit Agent doesn’t add a database in the first iteration of your project?

## How to add a database if Agent doesn’t automatically

Let’s return to our Snake example.

Imagine you ask Replit Agent to build a nostalgic Snake game, reminiscent of the Nokia classic:

<video autoPlay muted loop width="1022" height="1008">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/how-to-add-a-postgres-database-to-your-replit-agent-project/snake-game-2-1ff291f6.mov" />
</video>

In the initial version, our game works and keeps track of the score. However, when we dig deeper, we see that the high score is being stored locally (in the browser). So our app is not very complete:

- Other players wouldn’t be able to see or compete on a shared leaderboard
- Refreshing the browser or using an incognito tab would wipe the high scores entirely

So, how can we prompt Replit Agent to add a database for data persistence?

It’s simpler than you might think—**just ask**.

Once your app reaches its MVP stage or Agent finishes the initial iteration, it’s often best to start a new chat. This clears the context and ensures Agent focuses on the specific feature you want to add:

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-add-a-postgres-database-to-your-replit-agent-project/screenshot-2024-12-19-at-44548percente2percent80percentafpm-1024x764-4cf1116b.png)

In a new chat, here’s an example prompt you could use:

> _Let’s implement a leaderboard so that we can keep track of all the scores. The high score on the app should reflect the number 1 spot on the leaderboard. Users should be able to enter their names (up to 3 characters)._

By being very descriptive about the user experience you’re envisioning—play the game, get a leaderboard, enter a name—you set Agent up to success to implement the feature properly.

After submitting the prompt, Replit Agent will think for a bit, and then propose a plan:

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-add-a-postgres-database-to-your-replit-agent-project/screenshot-2024-12-19-at-44751percente2percent80percentafpm-1-1024x764-f65a96a3.png)

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-add-a-postgres-database-to-your-replit-agent-project/screenshot-2024-12-19-at-44907percente2percent80percentafpm-1024x764-ecdacb83.png)

The plan includes:

- **Backend changes.** The Agent will create a leaderboard table in a Postgres database.
- **Defining a database schema**. The Agent will define how the leaderboard data will be stored in the new Postgres database, including fields for player names, scores, and timestamps.
- **Frontend changes**. The Agent will update the UI to display the leaderboard and allow players to input their names.

Once you approve, Agent will start working:

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-add-a-postgres-database-to-your-replit-agent-project/screenshot-2024-12-19-at-45346percente2percent80percentafpm-1-1024x764-3e5cea6a.png)

Once Agent starts, its first step will be configuring the database. First, it’ll generate a `models.p` y file:

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-add-a-postgres-database-to-your-replit-agent-project/screenshot-2024-12-19-at-45809percente2percent80percentafpm-967x1024-2c374baf.png)

In this file, Agent is defining the database schema using SQLAlchemy for the leaderboard feature:

- `LeaderboardEntry` class: Represents the structure of the database table
  - `id`: An auto-incrementing integer acting as the primary key
  - `player_name`: A string column limited to 3 characters for storing player names (classic arcade-style)
  - `score`: An integer column to store player scores
  - `created_at`: A timestamp (using `datetime.utcnow`) to record when the score was submitted
- `to_dict`: Converts database entries into a dictionary format, making it easier to work with in the app

Next, Agent works in the `app.py` file, which serves as the bridge between the database and the backend logic of the app:

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-add-a-postgres-database-to-your-replit-agent-project/screenshot-2024-12-19-at-54335percente2percent80percentafpm-959x1024-33ae2920.png)

This file,

- Sets the `SQLALCHEMY_DATABASE_URI` to the `DATABASE_URL`, connecting the app to the Postgres database.
- Disables modification tracking for SQLAlchemy (for performance optimization)
- The database is initialized with the app context (`db.init_app(ap` p))

Lastly, it’s time to work the frontend updates:

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-add-a-postgres-database-to-your-replit-agent-project/screenshot-2024-12-19-at-54157percente2percent80percentafpm-966x1024-a6b25afd.png)

The Agent is adding the following features to the the `game.js` file:

- `playerName`: A variable to store the player’s input (3-character name)
- `nameInput`: Tracks whether the input overlay is active
- `leaderboard`: An array to store the leaderboard entries fetched from the database
- `fetchLeaderboard()`: A function call to retrieve the leaderboard data from the backend

Once the backend and frontend updates are complete, your Snake game will include a fully functional leaderboard, powered by Postgres:

<video autoPlay muted loop width="1104" height="1084">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/how-to-add-a-postgres-database-to-your-replit-agent-project/snake-improved-298c2d5f.mov" />
</video>

If we open the app in a new browser tab and refresh, all the high scores will now remain intact.

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-add-a-postgres-database-to-your-replit-agent-project/ad4nxfdtgfskwosd7k7dijay-n7jh7jg9zl1eoyakz3mjsinxmax46o8edddkhopisgakbls-ncn1o7a7mipowq-tydnhfbj1ezciwevnbzfjfnu3osdl0doozrgzxnwcljo5oc8cu9w-b436e980.png)

## Inspecting the database and schema

We can verify the stored data by navigating to the Postgres tool:

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-add-a-postgres-database-to-your-replit-agent-project/screenshot-2024-12-19-at-50803percente2percent80percentafpm-1024x844-a0a122a3.png)

We’ll see two tables, with the table named `leaderboard_entry` including fields for player names, scores, and timestamps:

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-add-a-postgres-database-to-your-replit-agent-project/screenshot-2024-12-19-at-51002percente2percent80percentafpm-1024x844-169e9bb5.png)

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-add-a-postgres-database-to-your-replit-agent-project/screenshot-2024-12-19-at-51130percente2percent80percentafpm-1024x554-0c5a6501.png)

And just like that, we have a Postgres database backing our application.

If you’d like to see a demo of the complete workflow, check out this video:

<YoutubeIframe embedId="2ND1kPBcu8c" isDocPost={false} />

## Adding a Postgres database takes only a prompt

The key takeaway here is this:

> Replit Agent is smart enough to recognize when your app needs persistent storage and will often add a Postgres database automatically.

But if Agent doesn’t pick it up in the first iteration—or if you want to add a feature that explicitly requires persistent data—you can guide Agent with a simple, natural language prompt.

Just describe what you want to achieve, and Agent will take care of the rest.

---

_Under the hood, Replit Agent creates Postgres databases via_ [Neon](https://neon.tech/home)_._

_Explore why Neon is a great database backed for AI Agents_ [here](https://neon.tech/use-cases/ai-agents)_, and_ [reach out to the team](https://neon.tech/contact-sales) _if you’d like to learn more._
