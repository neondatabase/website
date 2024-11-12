---
title: Use WunderGraph with Neon
subtitle: Leverage the power of Neon and WunderGraph to build fully serverless apps in
  minutes
enableTableOfContents: true
isDraft: false
updatedOn: '2024-10-22T15:41:04.377Z'
---

_This guide was contributed by the team at WunderGraph_

WunderGraph is an open-source Backend for Frontend (BFF) framework designed to optimize developer workflows through API composition. Developers can use this framework to compose multiple APIs into a single unified interface and generate typesafe API clients that include authentication and file uploads. This guide shows how you can pair WunderGraph with your Neon database to accelerate application development.

With WunderGraph, you can easily introspect your data sources and combine them within your virtual graph. WunderGraph treats APIs as dependencies. You can easily turn your Neon database into a GraphQL API or expose it via JSON-RPC or REST. With an easy-to-deploy Postgres database like Neon, you can now have a 100% serverless stack and build your own stateful serverless apps on the edge.

This guide demonstrates setting up a full-stack app with Neon and WunderGraph, securely exposing Neon to your Next.js frontend in under 15 minutes. While WunderGraph and Neon are compatible with a variety of frontend clients, this demo focuses on using Next.js.

<Admonition type="info">
This guide is also available in video format: [Neon with WunderGraph video guide](#neon-with-wundergraph-video-guide).
</Admonition>

## Prerequisites

- A [WunderGraph Cloud](https://cloud.wundergraph.com/) account
- A Neon project. See [Create a Neon project](/docs/manage/projects#create-a-project).

## Installation

Sign into [WunderGraph Cloud](https://cloud.wundergraph.com/) and follow these steps:

1. Click **New Project**.
2. Choose the `NEXT.js` template and give your repository a name.
3. Select the region closest to you.
4. Click **Deploy**.

The deployment will take a few moments.

### Add sample data to Neon

While the project is deploying, add some sample data to your Neon database.

1. Navigate to the [Neon Console](https://console.neon.tech/) and select **SQL Editor** from the sidebar.
2. Run the following SQL statements to add the sample data.

```sql
create table if not exists Users (
 id serial primary key not null,
 email text not null,
 name text not null,
 unique (email)
);

create table if not exists Messages (
id serial primary key not null,
user_id int not null references Users(id),
message text not null
);

insert into Users (email, name) VALUES ('Jens@wundergraph.com','Jens@WunderGraph');
insert into Messages (user_id, message) VALUES ((select id from Users where email = 'Jens@wundergraph.com'),'Hey, welcome to the WunderGraph!');
insert into Messages (user_id, message) VALUES ((select id from Users where email = 'Jens@wundergraph.com'),'This is WunderGraph!');
insert into Messages (user_id, message) VALUES ((select id from Users where email = 'Jens@wundergraph.com'),'WunderGraph!');

alter table Users add column updatedAt timestamptz not null default now();

alter table Users add column lastLogin timestamptz not null default now();
```

### Connect Neon and Wundergraph

1. Now that your database has some data, navigate back to WunderGraph Cloud.
2. Select the project you just created and navigate to the **Settings** page.
3. Select the **Integrations** tab and click **Connect Neon**.
   ![WunderGraph Settings](/docs/guides/wundergraph_settings.png)
4. You are directed to Neon to authorize WunderGraph. Review the permissions and click **Authorize** to continue.
   You are directed back to WunderGraph Cloud. If you are a part of multiple organizations, you are asked to select the organization to connect with Neon.
5. Select the Neon project and WunderGraph project that you want to connect, and click **Connect Projects**.
   ![WunderGraph connect projects](/docs/guides/wundergraph_connect_projects.png)

Your Neon and Wundergraph projects are now connected.

<Admonition type="important">
WunderGraph creates a role named `wundergraph-$project_id` in the Neon project that you selected during the integration process. Please do not delete or change the password for this role.

WunderGraph configures a environment variable called `NEON_DATABASE_URL`. Please use this variable wherever you need to provide a database URL.
</Admonition>

## Set up the WunderGraph project locally

The following steps describe how to set up your Wundergraph project locally and configure access to Neon.

1. In WunderGraph Cloud, select your project and click **View Git repository** to view your WunderGraph project repository.
2. Clone the repository and open it in your IDE. For example:

```bash
git clone https://github.com/<user>/wundergraph.git
cd wundergraph
code .
```

3. After the project is cloned, run the following commands in your project directory:

   ```bash
   npm install && npm run dev
   ```

   These commands install the required dependencies and start your project locally.

4. Inside the `.wundergraph` directory, open the `wundergraph.config.ts` file and add Neon as a datasource, as shown below, or simply replace the existing code with this code:

   ```typescript
   import {
     configureWunderGraphApplication,
     introspect,
     authProviders,
     EnvironmentVariable,
   } from '@wundergraph/sdk';
   import operations from './wundergraph.operations';
   import server from './wundergraph.server';

   const spaceX = introspect.graphql({
     apiNamespace: 'spacex',
     url: 'https://spacex-api.fly.dev/graphql/',
   });

   // Add your neon datasource
   const neon = introspect.postgresql({
     apiNamespace: 'neon',
     //Your database URL can be found in the Neon Console
     databaseURL: new EnvironmentVariable('NEON_DATABASE_URL'),
   });

   configureWunderGraphApplication({
     // Add neon inside your APIs array
     apis: [spaceX, neon],
     server,
     operations,
     codeGenerators: [
       {
         templates: [...templates.typescript.all],
       },
     ],
   });
   ```

5. Write an operation that turns your Neon database into an API that exposes data that you can pass through the frontend. To do so, navigate to the `operations` folder inside your `.wundergraph` directory and create a new file called `Users.graphql`.

   <Admonition type="info">
   With WunderGraph you can write operations in either GraphQL or TypeScript.
   </Admonition>

   Inside your `Users.graphql` file, add the following code:

   ```graphql
   {
     neon_findFirstusers {
       id
       name
       email
     }
   }
   ```

This operation queries your Neon database using GraphQL and exposes the data via JSON-RPC. In the next section, you will add the operation to the frontend.

## Configure the frontend

This section describes how to configure the frontend application.

1. In your local project, navigate to the `pages` directory and open the `index.tsx` file.
2. In the `index.tsx` file, make the following three changes or replace the existing code with the code shown below:

- Retrieve the data from the `Users` endpoint using the `UseQuery` hook.
- On line 62, update the copy to read: "This is the result of your **Users** Query".
- On line 66, pass the `users` variable through to the frontend.

```typescript
import { NextPage } from 'next';
import { useQuery, withWunderGraph } from '../components/generated/nextjs';

const Home: NextPage = () => {
  const dragons = useQuery({
    operationName: 'Dragons',
  });
  // We want to write this hook to get the data from our Users operation
  const users = useQuery({
    operationName: 'Users',
  });

  const refresh = () => {
    dragons.mutate();
  };
  return (
    <div>
      <div className="relative mx-auto max-w-5xl pt-20 lg:pt-32 sm:pt-24">
        <div className="flex justify-center">
          <div className="text-cyan-400 w-40 dark:text-white">
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 1000 1000"
              enableBackground="new 0 0 1000 1000"
              xmlSpace="preserve"
            >
              <path
                fill="currentColor"
                d="M675.4,473.2l-53.6,91l-68.5-116.7L484.9,564l-118.1-204c42.4-56.8,110.1-93.4,186.5-93.4
 c45.8,0,88.5,13.2,124.6,35.9c-0.7,3.8-1.1,7.6-1.1,11.6c0,34.4,27.9,62.2,62.2,62.2s62.2-27.9,62.2-62.2
 c0-34.4-27.9-62.2-62.2-62.2c-9.3,0-18.2,2.1-26.1,5.8c-45.8-30.2-100.6-47.9-159.6-47.9c-86.5,0-164,37.7-217,97.6L296,237.6
 c7-10.1,11.1-22.2,11.1-35.4c0-34.4-27.9-62.2-62.2-62.2s-62.2,27.9-62.2,62.2s27.9,62.2,62.2,62.2c1.8,0,3.5-0.1,5.3-0.3l52.2,90.3
 c-24.9,42.7-39,92.6-39,145.4c0,80.1,32.4,152.6,84.9,205.1c52.5,52.5,125,84.9,205.1,84.9c151,0,275.4-115.7,288.7-263.5
 c0.8-8.8,1.3-17.5,1.3-26.5v-26.5H675.4z M553.4,733.2c-64.5,0-122.8-26.3-165-68.4c-42.2-42.2-68.5-100.6-68.5-165
 c0-30.5,5.8-59.7,16.7-86.5L484.4,669l69-116.7l68.5,116.5l83.8-142.5H785C772,642.8,673.3,733.2,553.4,733.2z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-slate-900 text-center text-4xl font-extrabold tracking-tight dark:text-white lg:text-6xl sm:text-5xl">
          WunderGraph & Next.js
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mx-auto mt-6 max-w-3xl text-center text-lg">
          Use{' '}
          <code className="text-sky-500 dark:text-sky-400 font-mono font-medium">
            <a
              className="text-cyan-400 hover:text-cyan-600"
              target="_blank"
              href="https://wundergraph.com"
            >
              WunderGraph
            </a>
          </code>{' '}
          to make your data-source accessible through JSON-RPC to your Next.js app.
        </p>
      </div>
      <div className="relative flex flex-col items-center overflow-hidden p-8 sm:p-12">
        <div className="bg-blue-50 w-full max-w-xl rounded-2xl px-20 py-14">
          <div className="mx-auto flex max-w-sm flex-col items-center">
            <p className="mb-8 mt-3 text-center text-black/80">
              This is the result of your{' '}
              <code className="text-amber-500 font-mono font-bold font-medium">Users</code>{' '}
              operation.
            </p>
            <code className="p-3" data-testid="result">
              //update dragons to users
              {JSON.stringify(users, null, 2)}
            </code>
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={refresh}
              role="button"
              name="refresh"
              className="bg-slate-900 hover:bg-slate-700 focus:ring-slate-400 focus:ring-offset-slate-50 dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400 flex h-12 w-full items-center justify-center rounded-lg px-6 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                className="-ml-1 mr-2 h-6 w-6"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 11H7.101l.001-.009a4.956 4.956 0 0 1 .752-1.787 5.054 5.054 0 0 1 2.2-1.811c.302-.128.617-.226.938-.291a5.078 5.078 0 0 1 2.018 0 4.978 4.978 0 0 1 2.525 1.361l1.416-1.412a7.036 7.036 0 0 0-2.224-1.501 6.921 6.921 0 0 0-1.315-.408 7.079 7.079 0 0 0-2.819 0 6.94 6.94 0 0 0-1.316.409 7.04 7.04 0 0 0-3.08 2.534 6.978 6.978 0 0 0-1.054 2.505c-.028.135-.043.273-.063.41H2l4 4 4-4zm4 2h2.899l-.001.008a4.976 4.976 0 0 1-2.103 3.138 4.943 4.943 0 0 1-1.787.752 5.073 5.073 0 0 1-2.017 0 4.956 4.956 0 0 1-1.787-.752 5.072 5.072 0 0 1-.74-.61L7.05 16.95a7.032 7.032 0 0 0 2.225 1.5c.424.18.867.317 1.315.408a7.07 7.07 0 0 0 2.818 0 7.031 7.031 0 0 0 4.395-2.945 6.974 6.974 0 0 0 1.053-2.503c.027-.135.043-.273.063-.41H22l-4-4-4 4z"></path>
              </svg>
              Refresh
            </button>
          </div>
        </div>
        <footer className="text-gray-400 flex justify-between">
          <p className="pt-3">
            Visit{' '}
            <a
              className="text-cyan-400 hover:text-cyan-600"
              target="_blank"
              href="https://github.com/wundergraph/wundergraph"
            >
              GitHub
            </a>{' '}
            to learn more about WunderGraph.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default withWunderGraph(Home);
```

## Run the application

1. Run `npm run dev`.
2. Navigate to http://localhost:3000 when the application is finished building. If your application runs successfully, you should see the result of your User's operation.
3. To take the setup one step further, commit the changes to your GitHub repository and merge them into your `main` branch.
4. After you merge the changes, navigate to `WunderGraph Cloud` and view out the **Deployments** tab. You should see that a deployment was triggered. Give the deployment a few seconds to finish.
5. When deployment is ready, navigate to the **Operations** tab. You should see the new endpoint that you created and added to your application. Click it to see your data in real time.

## Key takeaways

This guide provided a brief demonstration showcasing the capabilities of Neon and WunderGraph, which enable you to turn your Neon database into an API exposed via JSON-RPC and rapidly deploy fully serverless apps on the edge in a matter of minutes. The power of Neon with WunderGraph lies in simplifying the development process, allowing you to focus on creating valuable and efficient applications.

In under 15 minutes, you were able to:

1. Create a WunderGraph Cloud account
2. Create a Next.js project hosted in a region near you
3. Set up a Neon database with sample data
4. Connect your WunderGraph application with your Neon database
5. Add Neon to your WunderGraph project using a code first approach
6. Write a GraphQL operation to query your Neon database
7. Update the frontend to display the results of your GraphQL operation securely using JSON-RPC
8. Commit your changes and trigger a deployment without a CI/CD pipeline or Devops team
9. View your new operations in real time with real-time metrics

If you had trouble with any of the steps outlined above, refer to the video guide below.

## Neon with WunderGraph video guide

<YoutubeIframe embedId="JqOADpG5q-s" />

<NeedHelp/>
