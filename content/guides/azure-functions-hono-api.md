---
title: Building a Robust JSON API with TypeScript, Postgres, and Azure Functions
subtitle: Learn how to leverage TypeScript, Neon Postgres Databases, and Azure Functions for Next-Level API Performance
author: jess-chadwick
enableTableOfContents: true
createdAt: '2025-02-01T00:00:00.000Z'
updatedOn: '2025-02-01T00:00:00.000Z'
---

Creating scalable and maintainable APIs is a cornerstone of modern web development. In this post I will show you how to build a simple (but realistic) Recipes API using one of my favorite combinations of technologies: TypeScript for type safety, Postgres for database storage, and Azure Functions for serverless hosting.

Using this combination gives a great balance of development experience and deploying your application without having to worry about managing your own infrastructure.

> **Installing tooling**
>
> Before we get started, you'll need to have the following tools installed:
>
> - [Node.js](https://nodejs.org) _(specifically, the npm package manager)_
> - [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-typescript?pivots=nodejs-model-v4#install-the-azure-functions-core-tools) _(I'm using version 4.x)_

### Setting up the project

Because I're creating an application that will be deployed as an Azure Function, it makes sense to start by using the Azure Functions Core Tools to create a new project
since that configuration can get a little overwhelming to write out yourself.

I'll run the following command to create a new project folder and initialize it with everything I need to start building my API:

```bash
mkdir recipes-api
cd recipes-api
func init --typescript
```

That creates all of the configuration and file structure required to build and deploy an Azure Function.
With that in place the next thing to do is add a function to the project with the command:

```bash
func new --name RecipesApi --template "HTTP trigger" --authlevel "anonymous"
```

With all that completed, I have a new Azure Function project with a single function that will respond to HTTP requests at the `/api/RecipesApi` endpoint.

### Introducing an API Framework

Opening up `src/functions/RecipeApi.ts`, I see that it's been implemented using the Azure Functions API.
This is a great way to get started, but it's a little low-level for my taste, so I'd like to use an API framework to make my life easier.

The first question I have to answer is: which API framework will I use? I'll be honest: for most applications I build, I reach for Express.js.
It's a mature, flexible, easily extended, and it's got a dirt-simple API which makes it a great choice for long-running servers.
However, serverless functions are stateless and short-lived, making it important for your deployed code to be as small as possible so that it boots up quickly.
Not to mention, you generally pay for the amount of memory and the time your function is running so it (quite literally!) pays for your code to be small and execute as fast as possible.
So while, yes, _no_ Express.js is not particularly slow or gigantic... but there are better options.

Luckily, the creators of Express.js have created a lightweight alternative called [**Hono**](https://hono.dev/) - a fast, minimalist JavaScript web framework. It's got an API that's very similar to Express.js and (my favorite part), has first-class support for TypeScript, so that makes it the perfect choice for serverless functions.

I can install Hono into my existing project by running:

```bash
npm install hono
```

However, since I'm running in an Azure Functions project, I need to install the Azure Functions adapter for Hono as well:

```bash
npm install @marplex/hono-azurefunc-adapter
```

And now that I have all my dependencies, I'll update my function to use Hono.

First, I'll create a file to hold my application logic, `src/app.ts`:

```typescript
import { Hono } from 'hono';

const app = new Hono();

app.get('/api', (c) => c.text('Recipes API'));

export default app;
```

> **IMPORTANT:** note that I'm using the route `/api` since this is the
> prefix that Azure Functions by default for its HTTP-triggered functions.

Then, replace the contents of `src/functions/RecipeApi.ts` with the following:

```typescript
import { app } from '@azure/functions';
import { azureHonoHandler } from '@marplex/hono-azurefunc-adapter';
import honoApp from '../app';

app.http('RecipesApi', {
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  authLevel: 'anonymous',
  route: '{*proxy}',
  handler: azureHonoHandler(honoApp.fetch),
});
```

Now, I'm not going to go into detail on this snippet because [the Hono docs](https://hono.dev/docs/getting-started/azure-functions) do a pretty great job of it.
In short, this code replaces the original Azure Function configuration with one that simply hands off all requests to the Hono application.

With everything in place, let's run the app to test it out:

```bash
npm run start
```

If everything is working correctly, when you hit the URL provided (mine is `http://localhost:7071/api`) you should see output that looks like this:

```bash
> curl http://localhost:7071/api
Recipes API
```

Now that I've proven the base application is working, I can start building out the API logic.

### Defining Data Models with TypeScript and Zod

A little bit about me: I **adore** TypeScript. I adore it so much that I simply _refuse_ to write regular JavaScript anymore.

So, before I even write any logic, I'm going to define the data models for my API using TypeScript interfaces.

```typescript
// src/models.d.ts
export interface Ingredient {
  id: number;
  /** the name of the ingredient, e.g. "sugar" */
  name: string;
  /** the amount of the ingredient required */
  quantity_amount: number;
  /** e.g. 'g', 'ml', 'tbsp', 'cup' */
  quantity_type: string;
}

export interface Recipe {
  id: number;
  /** the name of the recipe */
  name: string;
  /** the description or  */
  description: string;
  /** (optional) the URL that this recipe originated from, if applicable */
  url: string;
  /** the list of ingredients required for this recipe */
  ingredients: Ingredient[];
  /** the list of steps required to prepare this recipe */
  preparation_steps: string[];
}

// A simple view of recipe, excluding things like ingredients and preparation steps
// e.g. for a list of recipes
export type RecipeOverview = Pick<Recipe, 'id' | 'name' | 'description'>;
```

Just two models: one for recipes and another to describe the ingredients of those recipes.
I've also defined a `RecipeOverview` type that's a subset of the `Recipe` type, which I can use when I want to display a list of recipes without all the details.
Simple enough, right? Now let's prep our database to store this data.

### Creating a Postgres Database with Neon

Postgres is my go-to database for most projects. And using a managed service like [Neon](https://neon.com/) makes it even easier to get up and running Serverless Progres databases on Azure.
So, I'm going to head over to my [Neon projects](https://console.neon.tech/app/projects) and create a new project with a Postgres database, then use the following schema to create a table to store my recipes:

```sql
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    preparation_steps TEXT[] NOT NULL,
    url VARCHAR(255)
);

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity_amount NUMERIC NOT NULL,
    quantity_type VARCHAR(255) NOT NULL,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE
);
```

Then I'll populate it with some sample data (a delicious chocolate cake recipe!):

```sql
WITH inserted_recipe AS (
    INSERT INTO recipes (name, description, preparation_steps)
    VALUES (
        'The Best Chocolate Cake EVER',
        'A delicious chocolate cake',
        ARRAY[
            'Preheat oven to 350F',
            'In a large mixing bowl, mix flour, sugar, cocoa powder',
            'Add milk, vegetable oil, and eggs',
            'Bake for 30 minutes, or until a toothpick comes out clean'
        ]
    )
    RETURNING id
)

INSERT INTO ingredients (name, quantity_amount, quantity_type, recipe_id)
SELECT name, quantity_amount, quantity_type, (SELECT id FROM inserted_recipe)
FROM (VALUES
    ('flour', 2, 'cups'),
    ('sugar', 1, 'cup'),
    ('cocoa powder', 0.5, 'cup'),
    ('milk', 1, 'cup'),
    ('vegetable oil', 0.5, 'cup'),
    ('eggs', 2, 'large')
) AS ingredient_data(name, quantity_amount, quantity_type);
```

### Database Interaction

Neon databases are serverless, distributed, fully managed, and a whole bunch of other things, but most importantly, they're just Postgres databases.
So, I can use the `pg` package to interact with my database just like I would with any other Postgres database.

```bash
npm install pg
```

Unfortunately, the `pg` package does not include any types (at least not as of this writing),
so I'll also install the types for the `pg` package to give myself a better development experience:

```bash
npm install @types/pg
```

Then, I'll login to the [Neon web console](https://console.neon.tech/) and use the "Connect" button to grab my database connection string.
I'll paste that connection string into a new setting inside of the `local.settings.json` file in my project, like this:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "DATABASE_URL": "postgresql://recipes_owner:secret_password@jchadwick-pooler.eastus2.azure.neon.tech/recipes?sslmode=require&channel_binding=require",
    "AzureWebJobsStorage": "UseDevelopmentStorage=true"
  }
}
```

Finally, it's time to write some code to interact with the database.
I'll create a new file, `src/lib/db.ts`, to hold my database connection logic:

```typescript
// src/lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
```

### Querying the Database from an Azure Function

Now that I have my data models and database connection set up, I can start building out the API logic, which is simple enough.
For that, let's head back to `src/app.ts`.

First, I'll import the `db` connection from `src/lib/db.ts` and the `RecipeOverview` type from `src/models.d.ts`.

```typescript
import { Hono } from 'hono';
import db from './lib/db';
import type { RecipeOverview } from './models';
```

Then, I'll add an endpoint to query all recipes from the database (including their ingredients):

```typescript
app.get('/api/recipes', async (c) => {
  const { rows: recipes } = await db.query<RecipeOverview>(
    'SELECT id, name, description FROM recipes'
  );
  return c.json(recipes);
});
```

We can verify all this works by running the app, hitting the `/api/recipes` endpoint, and seeing the following output:

```bash
> curl http://localhost:7071/api/recipes

# output:
[{"id":1,"name":"The Best Chocolate Cake EVER","description":"A delicious chocolate cake"}]
```

Exciting stuff - I've now queried my database from an Azure Function using TypeScript!

Let's add another endpoint to get a single recipe by its ID, including its ingredients in the response:

```typescript
app.get('/api/recipes/:id', async (c) => {
  const recipeId = +c.req.param('id');

  const [recipeResults, ingredientsResults] = await Promise.all([
    db.query<Recipe>(
      `SELECT id, name, description, preparation_steps, url
       FROM recipes 
       WHERE id = $1
       LIMIT 1
     `,
      [recipeId]
    ),
    db.query<Ingredient>(
      `SELECT id, name, quantity_amount, quantity_type
       FROM ingredients
       WHERE recipe_id = $1
      `,
      [recipeId]
    ),
  ]);

  if (recipeResults.rowCount === 0) {
    // invalid recipe ID - return a 404 result
    return c.json(null, 404);
  }

  const recipe = {
    ...recipeResults.rows[0],
    ingredients: ingredientsResults.rows,
  };

  return c.json(recipe);
});
```

Now, when I hit the `/api/recipes/1` endpoint, I should see the following output:

```bash
> curl http://localhost:7071/api/recipes/1

# output:
{ "id": 1, "name": "The Best Chocolate Cake EVER", // ... }
```

And, finally, let's add an endpoint to _create_ a new recipe:

```typescript
app.post('/api/recipes', async (c) => {
  const { name, description, url, preparation_steps, ingredients } = await c.req.json<Recipe>();

  // create the recipe, retrieving the added recipe
  // so we can use its id to add ingredients below
  const {
    rows: [addedRecipe],
  } = await db.query<Recipe>(
    `INSERT INTO recipes (name, description, url, preparation_steps)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, description, url, preparation_steps
      `,
    [name, description, url, preparation_steps]
  );

  // bulk insert ingredients for the recipe
  const { rows: addedIngredients } = await db.query(
    `
    INSERT INTO ingredients (name, quantity_amount, quantity_type, recipe_id)
    VALUES ${ingredients
      .map(
        // produces a string like ($1, $2, $3, $4) to create placeholders
        // for each one of the ingredients, concatenating them all together
        // with commas to produce a single string like:
        // ($1, $2, $3, $4),($5, $6, $7, $8),($9, $10, $11, $12)
        (_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`
      )
      .join(',')}
    RETURNING id, name, quantity_amount, quantity_type
    `,
    ingredients.flatMap((ingredient) => [
      ingredient.name,
      ingredient.quantity_amount,
      ingredient.quantity_type,
      addedRecipe.id,
    ])
  );

  addedRecipe.ingredients = addedIngredients;

  return c.json(addedRecipe, 201);
});
```

Although there is quite a bit more code (including some gnarly string replacements for the variable placeholders),
this endpoint expects a JSON payload with the recipe data and ingredients, and it will insert the new recipe into the database.

So when I hit the `/api/recipes` endpoint with a POST request, I should see the following output:

```bash
> curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Peanut butter and jelly sandwich",
    "description": "A classic sandwich, perfect for lunch or even just a filling snack",
    "preparation_steps": [
        "Smear peanut butter on one slice of bread",
        "Smear jelly on the other slice of bread",
        "Place the two slices of bread together, smeared sides facing each other"
    ],
    "ingredients": [
        { "name": "bread", "quantity_amount": 2, "quantity_type": "slice" },
        { "name": "peanut butter", "quantity_amount": 1, "quantity_type": "tbsp" },
        { "name": "fruit jelly (any flavor)", "quantity_amount": 1, "quantity_type": "tbsp" }
    ]
  }' \
  http://localhost:7071/api/recipes

# output:
{"id": 2, "name": "Peanut butter and jelly sandwich", "description": ... }
```

### Deploying to Azure

Now that I've got the API working how I want it, it's time to bundle it up and deploy it to Azure.
Of course, the first thing you'll need is an Azure account; if you don't already have one, sign up for a free account [here](https://azure.microsoft.com/en-us/free/).

The next prerequisite to creating an Azure Function App is a resource group for it to live in.
For this you can either choose an existing resource group or create a new one.
I like to use the Azure CLI to do everything, so I'll create a new resource group in my preferred location (`eastus2`) using the command:

```bash
> az group create --name recipes-api-rg --location eastus2
# output:
{
  "id": "/subscriptions/<subscription_id>/resourceGroups/recipes-api-rg",
  "location": "eastus2",
  "managedBy": null,
  "name": "recipes-api-rg",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": "Microsoft.Resources/resourceGroups"
}
```

Next you'll need to create a storage account to hold your function's code.
I'll create a new storage account in the same resource group using the command
(ensuring that my storage account name is globally unique):

```bash
> az storage account create \
    --name recipesapistorage2000 \
    --resource-group recipes-api-rg \
    --location eastus2
```

> **NOTE:**
>
> If this command produces an error (like mine did at first), double-check that
> the Microsoft.Storage Resource Provider is registered for your subscription.
>
> You can do this through the Azure Portal:
>
> - Go to your subscription page
> - Navigate to the "Resource providers" blade
> - Find "Microsoft.Storage" in the list
> - Click "Register" if it's not already registered

Then, I'll create a new Function App in that resource group using the command below
(again, ensuring that my function app name is globally unique):

```bash
> az functionapp create \
    --resource-group recipes-api-rg \
    --consumption-plan-location eastus2 \
    --storage-account recipesapistorage2000 \
    --name recipes-api-2000 \
    --runtime node \
    --runtime-version 20
```

And, finally, I can deploy my function using this command to package and upload it to my newly-created Azure Function App:

```bash
func azure functionapp publish recipes-api-2000
```

My API is now live on Azure, and I can verify it's working by hitting the URL provided by the `func azure functionapp publish` command:

```bash
> curl https://recipes-api-2000.azurewebsites.net/api

# output:
Recipes API
```

### Configuring the Azure Function App

I've verified that my function app is deployed and working, so that's exciting!

However, if I hit any of the endpoints that access the Postgres database, I will get a failure response.

```bash
> curl https://recipes-api-2000.azurewebsites.net/api/recipes

# output:
500 Internal Server Error
```

These endpoints work fine locally because I've set the `DATABASE_URL` environment variable in my `local.settings.json` file,
however my deployed Function doesn't have this setting.

Luckily, Azure Functions makes it easy to set environment variables for your function app.
Just run the following command to set the `DATABASE_URL` environment variable to the connection string for my Neon database:

Define an environment variable in the Azure Function App settings to store the database connection string, using this command:

```bash
> az functionapp config appsettings set \
    --name recipes-api-2000 \
    --resource-group recipes-api-rg \
    --settings DATABASE_URL="postgresql://recipes_owner:9WAzoqh2NvYm@ep-black-bush-a8jqxdjf-pooler.eastus2.azure.neon.tech/recipes?sslmode=require&channel_binding=require"
```

Now when I hit the `/api/recipes` endpoint, I see the repsonse that I expect:

```bash
> curl https://recipes-api-2000.azurewebsites.net/api/recipes

# output:
[{"id":1,"name":"The Best Chocolate Cake EVER","description":"A delicious chocolate cake"}]
```

And that's it! My Recipes API is deployed and working in the cloud.

### Wrapping Up

The setup I've shown here provides a solid foundation for building a robust, type-safe, and scalable JSON API.
While this is where I'm going to end this post, there is still several things I've had to leave out.

Using what I've already shown in this article you should be able take care of some of these yourself, such as:

- adding new endpoints to update and delete recipes
- adding error handling
- introducing input validation to new recipes
- updating the `/recipes` endpoint with pagination and filtering of recipes

Perhaps the biggest thing I've left out is security.  
If you hadn't noticed, this API is completely open and doesn't require any authentication to access, meaning that anyone can come along and add recipes to the database.

Now, I could have introduced some basic HTTP authentication, but one of Neon's best features is its built-in support for JWT authentication and Row Level Security, so I've decided to create an entirely separate post to cover that.
Stay tuned for that post!

In the meantime, I hope you've found this post helpful and that it inspires you to build your own APIs combining the strengths of TypeScript, Postgres (via Neon), and Azure Functions to create efficient and maintainable backend services that are super easy to develop, deploy, and scale.
Good luck, and happy coding!

## Additional Resources

- [GitHub Repository for this article](https://github.com/jchadwick/neon-azure-api)
- [Neon Documentation](/docs)
- [Using Hono with Azure Functions](https://hono.dev/docs/getting-started/azure-functions)
- [Azure Functions Documentation](https://learn.microsoft.com/en-us/azure/azure-functions/)

<NeedHelp />
