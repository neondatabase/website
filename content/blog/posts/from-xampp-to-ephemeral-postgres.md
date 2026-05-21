---
title: 'From XAMPP to Ephemeral Postgres: Where “Works on My Machine” Has Led Us'
description: How lightweight cloud environments are replacing local dev
excerpt: >-
  “It works on my machine” is now a trope—a horror story to tell young
  developers (or AI coding models) about what it was like to build without
  today’s stack. Like all clichés, it was once true. Hodgepodge local installs,
  no containers, and massive environment drift were challenges...
date: '2025-02-27T00:51:30'
updatedOn: '2025-02-27T01:14:29'
category: community
categories:
  - community
authors:
  - andrew-tate
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/from-xampp-to-ephemeral-postgres/cover.jpg
  alt: null
isFeatured: false
seo:
  title: >-
    From XAMPP to Ephemeral Postgres: Where “Works on My Machine” Has Led Us -
    Neon
  description: >-
    “It works on my machine” is now a horror story to tell young developers (or
    AI models) about what it was like to build in earlier days.
  keywords: []
  noindex: false
  ogTitle: >-
    From XAMPP to Ephemeral Postgres: Where “Works on My Machine” Has Led Us -
    Neon
  ogDescription: >-
    “It works on my machine” is now a horror story to tell young developers (or
    AI models) about what it was like to build in earlier days.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/from-xampp-to-ephemeral-postgres/cover.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/from-xampp-to-ephemeral-postgres/neon-work-on-my-machine-1-1-1024x576-d4cb1aff.jpg)

“It works on my machine” is now a trope—a horror story to tell young developers (or AI coding models) about what it was like to build without today’s stack.

![Image](https://cdn.neonapi.io/public/images/pages/blog/from-xampp-to-ephemeral-postgres/screenshot-2025-02-26-at-44810percente2percent80percentafpm-1-1024x735-f5d46236.png)

Like all clichés, it was once true. Hodgepodge local installs, no containers, and massive environment drift were challenges for local developers. But like all challenges, these real constraints led to genuine innovations in each era of local development.

## The 1990s: The Wild West of Local Development

If you were in web development back in the 90s, you were living the absolute dream. Living in Seattle, Drinking this new ‘Starbucks,’ going to Nirvana gigs, and downloading [Apache](https://httpd.apache.org/download.cgi). What a life.

Local development in the 1990s required extensive manual setup and system knowledge. Developers needed to download and compile their web servers, interpreters, and databases from source code. A typical Apache setup involved downloading source files via FTP, running configure scripts, resolving dependencies, and manually editing httpd.conf files.

A typical handcrafted Apache httpd.conf configuration that sets up a local PHP dev environment might look like this:

```bash
# xampp/apache/conf/httpd.conf
LoadModule php5_module modules/php5apache2_2.dll
PHPIniDir "C:/xampp/php"
LoadModule rewrite_module modules/mod_rewrite.so

# Virtual hosts for different framework projects
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/symfony_project/web"
    ServerName symfony.local
    <Directory "C:/xampp/htdocs/symfony_project/web">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

This configuration would:

- Load PHP as an Apache module
- Set up a local development site at mysite.local
- Enable .htaccess file usage (AllowOverride All)
- Configure logging for debugging
- Set directory permissions

Getting this working typically involved several rounds of editing, restarting Apache, and checking error logs. A single syntax error could prevent Apache from starting.

Environment management was particularly challenging. Each developer’s machine had a unique configuration of manually installed components. Package management was minimal–most installations were done through .exe files on Windows or by compiling from .tar.gz archives on Unix systems. Version conflicts between libraries were common and difficult to diagnose.

Database setup posed significant technical hurdles. MySQL and Postgres installations required careful system configuration, including setting correct environment variables and managing initial user permissions. Different versions of the same database often couldn’t coexist on one machine, making it difficult to work on multiple projects.

Because each developer had a unique setup, this was truly the era of “it works on my machine.”

However, this era fostered deep technical understanding and creativity. Without widespread, standardized toolchains, developers found unique solutions that sometimes led to innovations in open-source communities. Freed from mainframes or expensive servers, developers could experiment locally with minimal hardware cost, driving grassroots software growth.

Developers gained extensive knowledge of system architecture, build processes, and configuration management through necessity. While everything done in seconds today required time and thought then, this laid the groundwork for future automation. The limitations of the time drove important innovations in build tools and the early foundations of what would later become package management systems. These limitations directly influenced the development of the next set of tools, like XAMPP and, eventually, Docker.

## The 2000s: Turn Your \*AMP to 11

We’re through the dotcom boom and bust, pets.com is gone, but this Bezos fellow seems to be sticking around. You’ve moved your local setup from Seattle to San Francisco for the vibes.

The 2000s brought the first real attempt at standardizing local development environments through \*AMP stacks. [XAMPP](https://www.apachefriends.org/), [WAMP](https://www.wampserver.com/), [LAMP](<https://en.wikipedia.org/wiki/LAMP_(software_bundle)>), and [MAMP](https://en.wikipedia.org/wiki/MAMP) offered one-click Apache, MySQL, PHP, and Perl installations. A developer could download XAMPP, run the installer, and have a working web server in minutes instead of days.

Framework adoption drove complexity in local environments. Ruby on Rails required specific Ruby versions, PHP frameworks needed particular PHP configurations, and .NET development required specific Windows components. A typical XAMPP configuration looked like this:

```bash
# xampp/apache/conf/httpd.conf
LoadModule php5_module modules/php5apache2_2.dll
PHPIniDir "C:/xampp/php"
LoadModule rewrite_module modules/mod_rewrite.so

# Virtual hosts for different framework projects
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/symfony_project/web"
    ServerName symfony.local
    <Directory "C:/xampp/htdocs/symfony_project/web">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Database management improved but remained problematic. While XAMPP included phpMyAdmin for MySQL administration, teams struggled with database synchronization. Developers often shared database dumps through email or FTP, leading to version mismatches and lost data.

Where’s Postgres in all this? While MySQL came bundled with these stacks, Postgres required separate installation and configuration. A Postgres workflow for developers would be:

- Download the installer from postgresql.org,
- run initdb to create a database cluster,
- Manually edited pg_hba.conf and postgresql.conf files for authentication and performance settings.

This extra complexity meant that Postgres was often chosen by more experienced teams that needed its advanced features and strict SQL compliance. Importantly though, if you were to run a true “local Postgres”, this isn’t too far away from what developers have to deal with today. Yes, you have Homebrew or a GUI to help you, but local Postgres still requires thinking about the local configuration.

New challenges emerged. Environment drift became common as developers delayed updating their XAMPP installations. Sharing project configurations meant zipping entire directories with vendor folders and database dumps. Version control systems like SVN helped, but dependency management remained manual–there was no composer.json or package.json yet.

Despite these issues, the era marked significant progress. New developers could start building web applications without deep system knowledge. Community forums filled with XAMPP-specific solutions created a shared knowledge base. Most importantly, developers could focus more on application logic and less on environment configuration–an early sign of productivity gains to come.

## The 2010s: The Docker Revolution

The hipster coffee shop where you’re coding has better WiFi than your first three jobs combined, and you’ve just discovered that containers aren’t just what your Blue Bottle comes in.

In 2013, Solomon Hykes [stood on stage at PyCon](https://www.youtube.com/watch?v=wW9CAH9nSLs&ab_channel=dotcloudtv), showing a demo that would change everything. ‘Docker,’ he called it. No one knew it yet, but XAMPP’s days were numbered.

[Docker](https://www.docker.com/) transformed local development by introducing containers–lightweight, isolated environments that package everything an application needs to run. No more “but it works on my machine” excuses because your machine wasn’t running the code anymore–a containerized slice of Linux was. Here’s what a typical database-driven application setup looked like:

```javascript
# Dockerfile for API service that connects to Postgres
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Add wait-for-it script to handle Postgres startup timing
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
EXPOSE 3000
CMD ["/wait-for-it.sh", "postgres:5432", "--", "npm", "start"]
```

But single containers weren’t enough. Enter [Docker Compose](https://docs.docker.com/compose/), which lets developers orchestrate multiple services together. A typical stack might look like this:

```javascript
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://user:password@postgres:5432/myapp
      REDIS_URL: redis://cache:6379
    depends_on:
      - postgres
      - cache
  
  postgres:
    image: postgres:13
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
  
  cache:
    image: redis:alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

One command (`docker-compose up`) and suddenly you had a web server, Postgres database, and Redis cache all spinning up in harmony. Well, when it worked. When it didn’t, you were diving into container logs, checking network configurations, and wondering why your Postgres volume mounts were showing stale data from your previous feature branch.

Data management became its own special challenge. Volumes helped persist Postgres data between container restarts, but developers still struggled with synchronizing databases across teams. You might pull the latest code, but your colleague’s migrations from last week were missing, leading to the classic “works in prod” scenarios.

Resource management brought new headaches too. Running multiple containerized services could bring even powerful laptops to their knees. Developers learned to juggle Docker Desktop’s resource settings and became intimate with the task manager, watching their RAM disappear into the container void.

But the benefits were transformative. Teams could version control their entire development environment alongside their code, and new team members could be productive in hours instead of days. The rise of microservices architecture became practical because each service could run in its own container with its own dependencies without conflicting with others.

Most importantly, Docker helped bridge the gap between development and operations. The same container that ran locally could be deployed to any cloud provider. The “it works on my machine” excuse transformed into “it works in my container”–and that container could run anywhere.

Meme begets meme:

![Image](https://cdn.neonapi.io/public/images/pages/blog/from-xampp-to-ephemeral-postgres/screenshot-2025-02-26-at-50158percente2percent80percentafpm-737x1024-1eb8f7b4.png)

The era wasn’t perfect, but it laid the groundwork for modern development practices. Teams learned to think in terms of isolated services, reproducible environments, and infrastructure as code. These lessons would prove invaluable as cloud-native development took hold in the following decade.

## The 2020s: The Rise of Hosted Environments

You’re working remotely now, making artisanal coffee at home, and your Docker Desktop is competing with Zoom for memory. But something’s changing–you don’t need all this running locally anymore.

The 2020s marked a shift away from local development entirely. Instead of wrestling with Postgres installations or Docker volumes, developers connect to hosted services. A typical configuration now looks remarkably simple:

```javascript
// Modern database configuration
const config = {
  database_url: process.env.DATABASE_URL,  // Points to hosted Postgres
  cache_url: process.env.REDIS_URL,        // Points to hosted Redis
}
```

Postgres itself evolved from a local installation to a fully managed service. Cloud services with a Free plan like [Neon](https://neon.tech/home) popularized this workflow, adding features to the table that would have seemed magical a decade ago—especially [branching](https://neon.tech/docs/introduction/branching). Creating a new Postgres environment became as simple as:

```bash
# Create a new database branch for a feature
neon branches create --name feature-user-auth

# Get the connection string
neon connection-string feature-user-auth
```

For many developers, the entire development environment became cloud-based. As with every era, this shift has brought new challenges. Internet connectivity becomes critical–no more coding on planes unless you’ve set up local fallbacks (plane WiFi still sucks). Teams also have to manage cloud costs and think about data governance in new ways.

But the benefits are compelling. Development environments finally achieved true parity with production. Features like Neon branching allows each pull request to have its own isolated data environment. Sensitive data no longer needs to live on developer laptops. Teams can collaborate on features by sharing database branch URLs instead of SQL dumps.

The “it works on my machine” era has ended, replaced by **it works in my branch**–but that branch can be shared, replicated, and torn down at will.

## 2025 and Beyond: Local Environments in the AI Era

[Replit](https://replit.com/) has shown an entire generation of new developers that they never needed a local environment in the first place–just a browser and an internet connection. [GitHub Codespaces](https://github.com/features/codespaces) and similar tools prove this model works for enterprise development, too: click a button, and your entire development environment springs to life in a browser tab. AI-powered development environments like [v0](https://github.com/features/codespaces) can generate entire applications from prompts. Your IDE, your runtime, your databases–all running in the cloud, accessible from anywhere.

The real transformation is in how we collaborate. When an engineer says, “check out this feature,” they’re not sending you a database dump or Docker compose file–they’re sharing a URL that spins up an exact copy of their environment. Real-time debugging sessions happen in shared cloud environments where everyone sees the same state.

We’re moving beyond the “it works on my machine” era entirely. Your machine isn’t running the code anymore–it’s just a terminal into a vast, shared cloud development environment. The tools we use are becoming more ephemeral, more collaborative, and more powerful.

Each era of development brought its own innovations. The 1990s taught us system architecture through necessity. The 2000s gave us integrated stacks that made web development accessible. Docker showed us the power of containerization. Now, cloud-native development is teaching us that maybe we don’t need to run anything locally after all. Local is now about **where you code**, not where your code runs.
