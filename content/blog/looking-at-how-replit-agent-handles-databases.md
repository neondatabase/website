---
title: Looking at How Replit Agent Handles Databases
description: Getting Replit Agents to handle database migrations
excerpt: >-
  Replit Agent is a powerful tool within the Replit development environment that
  allows you to offload coding tasks using natural language and AI. By
  interacting with the Replit Agent, you can generate code, create applications,
  and modify existing features simply by asking for wha...
date: '2024-11-08T17:59:23'
updatedOn: '2024-11-08T20:37:33'
category: ai
categories:
  - ai
authors:
  - sam-harrison
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/looking-at-how-replit-agent-handles-databases/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Looking at How Replit Agent Handles Databases - Neon
  description: >-
    Replit Agents provision Neon databases. For handling database migrations,
    Replit uses Alembic, a migration tool that works with SQLAlchemy.
  keywords: []
  noindex: false
  ogTitle: Looking at How Replit Agent Handles Databases - Neon
  ogDescription: >-
    Replit Agents provision Neon databases. For handling database migrations,
    Replit uses Alembic, a migration tool that works with SQLAlchemy.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/looking-at-how-replit-agent-handles-databases/social.jpg
source:
  wpId: 7560
  wpSlug: looking-at-how-replit-agent-handles-databases
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/looking-at-how-replit-agent-handles-databases/neon-replit-1024x576-55ed0cb8.jpg)

[Replit Agent](https://docs.replit.com/replitai/agent) is a powerful tool within the [Replit](https://replit.com/) development environment that allows you to offload coding tasks using natural language and AI. By interacting with the Replit Agent, you can generate code, create applications, and modify existing features simply by asking for what you need.

This automation becomes particularly valuable when you’re working on full-stack applications that require database changes, where it helps maintain consistency between the code and the database schema. Essentially, you can have the Replit Agent implement end-to-end features within your application, changing the API, Database, and Frontend all at once.

## Introducing the tools

To manage your app’s data, Replit provisions a database, a fully managed serverless Postgres database (powered by Neon) that scales on demand. The Agent builds the rest of the app in `Flask`, a python microframework for web applications which supports API endpoints and HTML templating.

With a little prompting, you can get the Agent to use `Alembic`, a database migration tool that works with `SQLAlchemy`. SQLAlchemy acts as an Object Relational Mapper (ORM), which helps convert your Python objects and code into the schema used by your Postgres database. Alembic tracks changes to your SQLAlchemy models and automatically generates migration scripts for database schema updates.

In this article, we will explore how this process works by creating a simple TODO application where features are added incrementally using only natural language prompts to the Replit Agent. You’ll see how you can get Alembic migrations to be automatically generated and how changes are reflected in your Neon database.

**To follow along, you need access to the Replit Agent, which is available on the Replit Core or Team subscriptions.**

## Creating the project

To begin, head over to your Replit home dashboard and create a new `Repl`. Instead of setting everything up manually, simply describe the project you want in the Replit Agent textbox. To follow this article, ask the agent to:

`create me a TODO application API with CRUD functionalities and a simple frontend to view the tasks`

![Image](https://cdn.neonapi.io/public/images/pages/blog/looking-at-how-replit-agent-handles-databases/ad4nxfdwghqzlxzt2-bykqorl-5f-bi6tfull9tyff7gxhapnjku5zjsvkkk3voaza2cysnbr4lcpty32li777ulaqac-x6xbwzylintz-4qnm5fqsk5lggbosdtodrfps11a12torrxbrwexqjuzjhbery-3ebe2d36.png)

Once you describe the project, Replit Agent will generate a plan that includes the core features and may also suggest additional features or enhancements that could be useful. You can review these suggestions and make adjustments if needed. After you approve the plan, the agent will provision a Neon PostgreSQL database, generate the SQLAlchemy schema for your application, set up the Flask API endpoints, and create the HTML and JavaScript for the frontend.

![Image](https://cdn.neonapi.io/public/images/pages/blog/looking-at-how-replit-agent-handles-databases/ad4nxeiaey7yq5bsbqjbochdjpgnhxht6eqdpwfamm8mwcbzdvie8y2diiy-bzhheuqljjurw4nlxdmunibxebus9jlvwrbppod0dcbuny2miw4jdti5shbwlwo-sa4yaoqhmzjviiztwz3x44unez4ig-27d3e7b4.png)

Within a minute or two, the Replit Agent will finish setting up the fully functional application. At this point, it will prompt you to test everything to make sure it’s working as expected. You should try adding a simple task to the app and confirm that the basic functionality is correct. Once you verify that everything is in order, the Agent will create a commit and a checkpoint for the application.

## Adding a due date feature

With the basic TODO app up and running, you can extend its functionality by allowing users to optionally specify a due date for each task to help with setting deadlines or reminders. To add this feature, simply ask the Replit Agent:

`can you add another text box so that the user can optionally add a due date to the task`

The Replit Agent understands that this feature requires changes to both the frontend (adding a date input) and the backend (modifying the database schema to store the due date). Specifically, a new column needs to be added to the tasks table to store the `due_date`.

Here’s how the Agent handles the database update process:

### Generating the SQLAlchemy model update

The agent modifies the Task model to include a new `due_date` field. The updated model now looks like this:

```python
    class Task(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        title = db.Column(db.String(100), nullable=False)
        description = db.Column(db.Text, nullable=True)
        completed = db.Column(db.Boolean, default=False)
        due_date = db.Column(db.DateTime, nullable=True)
```

### Creating and applying alembic migrations

Since this change alters the database schema, the Replit Agent generates a migration script using Alembic. The migration will add the `due_date` column to the tasks table in the database. Here’s the up migration script that adds the `due_date` column:

```python
    """Add due_date to Task model

    Revision ID: 0f4af0e04d02
    Revises:
    Create Date: 2024-10-15 17:40:22.891574

    """
    from alembic import op
    import sqlalchemy as sa

    # revision identifiers, used by Alembic.
    revision = '0f4af0e04d02'
    down_revision = None
    branch_labels = None
    depends_on = None

    def upgrade():
        # ### commands auto generated by Alembic - please adjust! ###
        with op.batch_alter_table('task', schema=None) as batch_op:
            batch_op.add_column(sa.Column('due_date', sa.DateTime(), nullable=True))

        # ### end Alembic commands ###

    def downgrade():
        # ### commands auto generated by Alembic - please adjust! ###
        with op.batch_alter_table('task', schema=None) as batch_op:
            batch_op.drop_column('due_date')

        # ### end Alembic commands ###
```

Notice that it provides both an upgrade and downgrade migration such that it can also handle rollbacks to previous states.

### Frontend update

The Agent also updates the frontend to include a new text box where users can input a due date when creating or updating a task, as seen here:

![Image](https://cdn.neonapi.io/public/images/pages/blog/looking-at-how-replit-agent-handles-databases/ad4nxclpr2yavrc0t2apfr-v2lqaa6lzbhkafy4aalgzksphjwecgwrfs-x7p1odw70uddkqywk2ui82t-rusmhcowryo832kvydewn8ojtuzkabugyo-0zootubd6dj3iyun-g-b5eeaaz7mmnoabfxcwo-e3780e57.png)

After you confirm the update, the `due_date` field is now part of both the UI and the database, and the agent ensures the changes are committed properly.

## Adding more features: Priority field

You can continue adding features to your TODO app in a similar way. For example, to help users manage the importance of their tasks, you might want to add a priority field to each task. Like before, asking Replit Agent to implement this will trigger another schema change, and it will generate and apply the relevant Alembic migrations automatically:

`add a priority flag to the task creation that can be low, medium, or high and that shows up on the tasks list`

Once the agent has processed the request, it will update both the backend and frontend. The priority field will now appear in the task creation form, and tasks will display their priority (low, medium, or high) in the tasks list:

![Image](https://cdn.neonapi.io/public/images/pages/blog/looking-at-how-replit-agent-handles-databases/ad4nxcg-wocbbrozne5fmdkhatl8ofokiac7id2517eeflay8per7szci39ykqqmedw8nbsfgzdwrjziwz4iqfqg2gdrvmdehz0lggvabomvclbwx3bbltwffrjfsu8bwwiofqdoquixser9pt5ihunphjoxu-a44f8187.png)

At this point, you have introduced two schema changes to the database: one for the `due_date` field and one for the `priority` field. With each change, Alembic generated a separate migration file. These migration files represent individual checkpoints in the evolution of your database schema.

When you look into the `migrations/versions` folder of your project, you’ll now see two distinct migration files:

- `\{commit-id\}_add_due_date_to_task.py` – This migration was created when the `due_date` field was added.
- `\{commit-id\}_add_priority_to_task.py` – This migration was created when the `priority` field was added.

![Image](https://cdn.neonapi.io/public/images/pages/blog/looking-at-how-replit-agent-handles-databases/ad4nxfacy0lju15m6jmzlrzkk1c1aysk44z5vklqbb7sjpzw7u29sb7ja5lbt8h9pcz0zvewao93yxvhpofcglaskersbz4ynwf3vcw0d-5v-9a63vhrvori1doxmkw0uvkdmypaneezku2qqhphpdsl9rg-f48822d4.png)

These migration files are important because they allow you to easily rollback your database schema to any previous state. For example, if you want to undo the addition of the priority field but keep the `due_date`, you can apply a rollback to the previous migration using Alembic’s rollback functionality.

By having separate migrations for each change, you can always track the evolution of your schema and revert specific changes when needed.

## Rolling back

There may come a time when you’re not happy with how a feature turned out, or you simply don’t need it anymore. This is where Replit’s rollback feature, powered by Alembic, becomes especially useful. Not only can you revert the application to a previous state, but you can also undo the database changes, ensuring everything stays consistent.

In this case, let’s say you no longer need the priority field or you want to remove it for some reason. Rolling back the application and database to the state before the priority field was added is straightforward.

Replit Agent will automatically run the downgrade migration script, and the priority field will be removed from the database. Additionally, the app’s frontend will be updated, and the feature will no longer appear in the task creation form or task list.

Here’s the UI after the rollback, which now looks just like it did before the priority field was added:

![Image](https://cdn.neonapi.io/public/images/pages/blog/looking-at-how-replit-agent-handles-databases/ad4nxerz05hqmoiosefoiyzruxju6h4odpp0pvc7d-cobufbcxdccuhupmnvletukf9nylarhl0hl9vjigyo2qokxfulwvxmr2nfpg7txcdopmtfzpf9o7jephdpqhkniidkh-xh9xo14tx4tii1nmbys-8e23c220.png)

<br />To confirm that the database has been successfully rolled back, you can use the Postgres tool in the Replit development environment to inspect the tasks table. As shown below, the priority column is no longer present:

This means the database schema has been fully reverted to its earlier state, and the feature has been removed not just from the code, but also from the database. Because Alembic tracks every migration in the project, you can roll back your schema to any previous migration—whether that’s the most recent change or a much earlier one. The migration files in the migrations folder act like checkpoints in your database’s timeline. Each migration has a unique revision ID, which allows you to target a specific state when rolling back.

## Conclusion

Replit Agents can use Alembic and Neon PostgreSQL to handle database changes efficiently. When you request a new feature that affects the database, you can get the agent to generate a migration files with two functions—one for applying changes and another for rolling them back. This makes it easy to update or revert your database schema as needed.

![Image](https://cdn.neonapi.io/public/images/pages/blog/looking-at-how-replit-agent-handles-databases/ad4nxcark5jbnzdeg1zqon2kwszydkscw6qowftzxtun605vjcang7yepy79apkqzecqphecjaqt67whccjftapgd0jaaz0gc3ylhqykwesmmp5x6pfn1limwffwactnjgadccl9mn2gk6llg7vsr769hcvzy-f8b68533.png)

By creating these files with each change, Replit ensures that your database stays in sync with your application. Whether you’re adding new fields, removing features, or undoing changes, the agent manages the migrations so you don’t have to worry about keeping the database consistent. This allows you to focus on building your application while the underlying structure is handled for you.

---

_Neon is the serverless Postgres database backing Replit Agents._ [Start using it for free.](https://console.neon.tech/signup)
