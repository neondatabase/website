---
title: Use WunderGraph with Neon
subtitle: Develop apps at lightning-fast speed by leveraging the combined power of Neon and WunderGraph
enableTableOfContents: true
isDraft: false
---

WunderGraph is an open-source Backend for Frontend (BFF) Framework designed to optimize Developer Workflows through API Composition. Developers can compose multiple APIs into a single unified interface and generate typesafe API clients that include authentication and file uploads. This guide shows how you can pair WunderGraph with your Neon database and start building applications right away.

With WunderGraph, you can easily introspect your data sources and combine them into your virtual graph. WunderGraph treats APIs as dependencies. You can easily turn your Neon database into a GraphQL API or expose it via JSON-RPC / REST. With an easy-to-deploy database like Neon, you can now have a 100% serverless stack. Build your own stateful serverless apps on the edge now.

The starter guide will show you how to set up a full stack app with Neon and WunderGraph where you are exposing Neon securely to your Next.js frontend in under 15 minutes. WunderGraph and Neon can be used with a wide range of frontend clients, but for this demo we'll be using Next.js

## Prerequisites

- A [WunderGraph Cloud](https://cloud.wundergraph.com/) Account
- A Neon project. See [Create a Neon project](https://neon.tech/docs/manage/projects#create-a-project).

You can also use Neon locally with a WunderGraph project. You just need to use the WunderGraph SDK

```bash
npm i @wundergraph/sdk
```

If using Neon Locally, skip ahead to the **Configuring your WunderGraph project with Neon** section

## Installation

Once you are signed into [WunderGraph Cloud](https://cloud.wundergraph.com/) follow these steps:

1. Click  the `New Project` button in the top right.
2. Choose the `Next.js` template and give your project a name.
3. Choose the region closest to you and hit deploy!

This deployment will take about 1-2 minutes.

### 1 minute video on how to integrate Neon into your WunderGraph project

{% youtube videoId="cu5vwql5q0A" /%}

In the meantime, while this is deploying. Let's fill our Neon database with some fake data. Navigate over to your [Neon Console](https://console.neon.tech/) and select `SQL editor` from the left hand side.

Insert the following fake data into your database.

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

Now that your database has some data, navigate back over to WunderGraph Cloud.

Once your project is deployed, click on the project you just created and then navigate to the settings page of your WunderGraph Cloud project, click on the `Integrations` tab and click on the `Connect Neon` button.

![WunderGraph Settings](/docs/guides/wundergraph_settings.jpg)

Now you will be directed to Neon. You can verify the permissions that are given to WunderGraph and click `authorize`.

You will then be redirected back to WunderGraph Cloud. If you are a part of multiple organizations, you will be asked to select the organization to which you want to connect with Neon. Click `Next`.

Select the Neon project that you want to connect to your WunderGraph project and click `connect` projects.

![WunderGraph connect projects](/docs/guides/wundergraph_connect_projects.jpg)

That's it.

### Important instructions

- WunderGraph creates a role named `wundergraph-$project_id` in the Neon project selected during the integration process, please do not delete or change the password of the role.
- WunderGraph configures a environment variable called `NEON_DATABASE_URL`. Please use this variable wherever you need the database url.

## Configuring your WunderGraph project with Neon

Now that you have synced your WunderGraph Cloud account with Neon. Let's set it up locally.

Inside your project overview, click the **view git repository** button to be directed to your repo where this new project lives. Clone the repo and open it up in your favorite IDE.

Once the project is cloned, CD into it and run the following:

```bash
npm install && npm run dev
```

This just installs the necessary dependencies and starts your project locally.

Inside the `.wundergraph` directory, open the `wundergraph.config.ts` file and add Neon as a datasource.

```typescript
import { configureWunderGraphApplication, introspect, authProviders, EnvironmentVariable } from '@wundergraph/sdk';
import operations from './wundergraph.operations'
import server from './wundergraph.server'

const spaceX = introspect.graphql({
	apiNamespace: 'spacex',
	url: 'https://spacex-api.fly.dev/graphql/',
});

// Add your neon datasource
const neon = introspect.postgresql({
  apiNamespace: 'neon',
  //Your database URL can be found in the Neon console 
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

Now that you have added Neon as a datasource, write an operation that turns our Neon Database into an API that exposes some data that we can pass through to our frontend.

Navigate over to your `operations` folder inside your `.wundergraph` directory and create a new file called `Users.graphql`.

With WunderGraph you can write operations in either GraphQL or TypeScript.

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

You just wrote an operation that queries your Neon database using graphql and exposes the data via JSON-RPC. In the next section, you will add it to the frontend.

## Frontend work

Switch over to your `pages` directory and open the `index` file.

You can ignore most of the code, but we want to change three things:

1. Get the data from the Users endpoint using UseQuery hook.
2. On line 62, Update the copy slightly to read: "This is the result of your **Users** Query".
3. On line 66, pass your users variable through to the frontend.

```typescript
import { NextPage } from 'next';
import { useQuery, withWunderGraph } from '../components/generated/nextjs';

const Home: NextPage = () => {
	const dragons = useQuery({
		operationName: 'Dragons',
	});
    // We want to write this hook to get the data from our Users operation
	const users = useQuery({
		operationName: "Users"
	})

	const refresh = () => {
		dragons.mutate();
	};
	return (
		<div>
			<div className="relative max-w-5xl mx-auto pt-20 sm:pt-24 lg:pt-32">
				<div className="flex justify-center">
					<div className="w-40 text-cyan-400 dark:text-white">
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
				<h1 className="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center dark:text-white">
					WunderGraph & Next.js
				</h1>
				<p className="mt-6 text-lg text-slate-600 text-center max-w-3xl mx-auto dark:text-slate-400">
					Use{' '}
					<code className="font-mono font-medium text-sky-500 dark:text-sky-400">
						<a className="text-cyan-400 hover:text-cyan-600" target="_blank" href="https://wundergraph.com">
							WunderGraph
						</a>
					</code>{' '}
					to make your data-source accessible through JSON-RPC to your Next.js app.
				</p>
			</div>
			<div className="relative flex flex-col items-center overflow-hidden p-8 sm:p-12">
				<div className="w-full max-w-xl rounded-2xl bg-blue-50 px-20 py-14">
					<div className="mx-auto flex max-w-sm flex-col items-center">
						<p className="mt-3 mb-8 text-center text-black/80">
							This is the result of your <code className="font-mono font-medium text-amber-500 font-bold">Users</code>{' '}
							operation.
						</p>
						<code className="p-3" data-testid="result">
                            //update dragons to users
							{JSON.stringify(users, null, 2)}
						</code>
					</div>
					<div className="flex justify-center mt-8">
						<button
							onClick={refresh}
							role="button"
							name="refresh"
							className="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400"
						>
							<svg
								stroke="currentColor"
								fill="currentColor"
								strokeWidth="0"
								viewBox="0 0 24 24"
								className="w-6 h-6 mr-2 -ml-1"
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
				<footer className="flex justify-between text-gray-400">
					<p className="pt-3">
						Visit{' '}
						<a
							className="text-cyan-400 hover:text-cyan-600"
							target="_blank"
							href="https://github.com/wundergraph/wundergraph"
						>
							Github
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

## Final result

If you have your application running locally, this is what you should see:

![WunderGraph operations result](/docs/guides/wundergraph_operation_result.jpg)

But let's take it one step further. Git commit your changes and merge it into your main branch.

Once you merge your changes to your main branch, switch back to `WunderGraph Cloud` and check out the `deployments` tab. You should see a deployment has triggered. Give it a couple seconds.

Once your deployment is done, if you switch over to the `Operations` tab, you should see your new endpoint that you just created and added to your application! Click it to see your data in real time!

This was just a tiny demo, but you can clearly see the power behind Neon and WunderGraph. You can now easily full serverless apps in minutes.

## Key takeaways

Let's recap.

In under 15 minutes, you were able to:

1. Create a WunderGraph Cloud account
2. Create a brand new Next.js project hosted in a region near you
3. Set up a Neon database with fake data
4. Connect your WunderGraph application with your Neon database
5. Add Neon to your WunderGraph project using a code first approach
6. Wrote a GraphQL operation to query your Neon database
7. Updated your frontend to display the results of your GraphQL operation securely in your frontend using JSON-RPC
8. You committed your changes and triggered a new deployment without a CI/CD pipeline or devops team
9. Saw your new operations available in real time with real time metrics.

With WunderGraph, You easily turned your Neon database into an API and exposed it via JSON-RPC. You can now have a 100% serverless stack built on the edge in minutes. If you got lost at any step during the guide, you can also see the video guide below.

## Full video guide

{% youtube videoId="JqOADpG5q-s" /%}

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
