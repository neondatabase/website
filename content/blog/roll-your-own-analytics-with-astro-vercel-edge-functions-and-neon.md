---
title: 'Roll Your Own Analytics With Astro, Vercel Edge Functions and Neon'
description: >-
  In this post, I’ll explain how you can “roll your own” version of Google
  Analytics using Astro, Vercel Edge Functions and Neon.
excerpt: >-
  I’ve prepared a sample repository showing the implementation for a site built
  using Astro and deployed to Vercel. I’ve used this same approach for my own
  site, paulie.dev, and I’ll explain how I’ve used the data to create the
  visualisations on my dashboard. For good measure, I’ve...
date: '2023-10-03T12:35:21'
updatedOn: '2024-03-01T16:02:05'
category: community
categories:
  - community
authors:
  - paul-scanlon
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/roll-your-own-analytics-with-astro-vercel-edge-functions-and-neon/cover.jpg
  alt: 'Roll Your Own Analytics With Astro, Vercel Edge Functions and Neon'
isFeatured: false
seo:
  title: 'Roll Your Own Analytics With Astro, Vercel Edge Functions and Neon - Neon'
  description: >-
    In this post, I’ll explain how you can “roll your own” version of Google
    Analytics using Astro, Vercel Edge Functions and Neon.
  keywords: []
  noindex: false
  ogTitle: 'Roll Your Own Analytics With Astro, Vercel Edge Functions and Neon - Neon'
  ogDescription: >-
    I’ve prepared a sample repository showing the implementation for a site
    built using Astro and deployed to Vercel. I’ve used this same approach for
    my own site, paulie.dev, and I’ll explain how I’ve used the data to create
    the visualisations on my dashboard. For good measure, I’ve also created a
    Next.js sample repository, but I […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/roll-your-own-analytics-with-astro-vercel-edge-functions-and-neon/social.jpg
source:
  wpId: 3420
  wpSlug: roll-your-own-analytics-with-astro-vercel-edge-functions-and-neon
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Roll Your Own Analytics With Astro, Vercel Edge Functions and Neon](https://cdn.neonapi.io/public/images/pages/blog/roll-your-own-analytics-with-astro-vercel-edge-functions-and-neon/neon-roll-your-own-analytics-featured-1024x576-3f8275b3.jpg)

I’ve prepared a sample repository showing the implementation for a site built using [Astro](https://astro.build/) and deployed to Vercel.

- ⚙️ [Astro sample repository](https://github.com/PaulieScanlon/neon-edge-analytics-astro-sample)

I’ve used this same approach for my own site, [paulie.dev](https://paulie.dev), and I’ll explain how I’ve used the data to create the visualisations on my [dashboard](https://www.paulie.dev/dashboard/).

![Screenshot of paulie.dev/dashboard](https://cdn.neonapi.io/public/images/pages/blog/roll-your-own-analytics-with-astro-vercel-edge-functions-and-neon/roll-your-own-analytics-dashboard-1024x640-9d0d9449.png)

<br />For good measure, I’ve also created a [Next.js sample repository](https://github.com/PaulieScanlon/neon-edge-analytics-nextjs-sample), but I won’t be covering that in this post.

## The Google Analytics API

You might be wondering, why not just use the Google Analytics API?

For quite a while, that was my approach, but as you probably know, Google retired Universal Analytics in June 2023. I’d been running GA4 in my site since they announced their plans last year so I had data from both, but there’s a problem.

### Geolocation coordinates

On my [dashboard](https://paulie.dev/dashboard) I have a 3D globe which I use to plot the geographic locations of visitors to my site. In Universal Analytics this was no problem, I could query the API which contained a reporting dimension for the `latitude` and `longitude`. In GA4 however, Google have removed this dimension which meant, unless I came up with a solution, I’d have to lose the 3D globe!

![Animated Gif of 3D globe ](https://cdn.neonapi.io/public/images/pages/blog/roll-your-own-analytics-with-astro-vercel-edge-functions-and-neon/paulie-globe-v340-7371e4a1.gif)

## The Anatomy of Edge Analytics

This was the solution I came up with and there are three main parts to building your own analytics. They are as follows.

1. A Neon serverless Postgres database to store the data.
2. An Edge Function capable of extracting geolocation data from incoming requests.
3. A client-side request to the Edge Function that fires on page load.

_This solution isn’t intended to replace Google Analytics but, it is a nice way to capture site visits and visualise activity on my site_.

## Create a Neon serverless Postgres database

To get started, [sign up](https://neon.tech/) to Neon, then follow our [Create your first project guide](https://neon.tech/docs/get-started-with-neon/setting-up-a-project). You might also like to look at this guide from our docs: [Query with Neon’s SQL Editor](https://neon.tech/docs/get-started-with-neon/query-with-neon-sql-editor).

Once you have a database set up, save the connection string to your `.env` file and name it, `DATABASE_URL`.

E.g

```bash
DATABASE_URL=postgres://paul:123@a-b-c-123.us-east-1.aws.neon.tech/neondb
```

### Create a table for the data

With your database created, head over to the **SQL Editor** in the Neon console and use the following schema to create a new table called `analytics`.

```sql
CREATE TABLE analytics (
  id            SERIAL PRIMARY KEY,
  date          TIMESTAMP WITH TIME ZONE NOT NULL,
  slug          VARCHAR NOT NULL,
  flag          VARCHAR,
  country       VARCHAR,
  city          VARCHAR,
  latitude      DECIMAL,
  longitude     DECIMAL
)
```

![Screenshot of Neon Console SQL Editor](https://cdn.neonapi.io/public/images/pages/blog/roll-your-own-analytics-with-astro-vercel-edge-functions-and-neon/roll-your-own-analytics-create-table-1024x640-a26ea64e.png)

## Install dependencies

There are three dependencies required. The first is the [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver), the second is the [Astro Vercel adapter](https://docs.astro.build/en/guides/integrations-guide/vercel/), and the third is the [@vercel/edge](https://vercel.com/docs/functions/edge-functions/vercel-edge-package) package including a `geolocation` helper function that can extract geographical information from incoming requests.

```bash
npm install @neondatabase/serverless @astrojs/vercel @vercel/edge
```

### Configure the Astro Vercel Adapter

Locate your `astro.config.mjs` and add the following config.

```javascript
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  ...
  adapter: vercel({
    edgeMiddleware: true,
  }),
});
```

## Create an Edge Function

With the Vercel Adapter set up you can now create a new API route under `src/pages/api`. In the sample repository, I’ve named the route [page-view.js](https://github.com/PaulieScanlon/neon-edge-analytics-astro-sample/blob/main/src/pages/api/page-view.js).

```javascript
import { neon } from '@neondatabase/serverless';
import { geolocation } from '@vercel/edge';

const sql = neon(import.meta.env.DATABASE_URL);

export async function POST({ params, request }) {
  const date = new Date();
  const { slug } = await new Response(request.body).json();

  const { flag, country, city, latitude, longitude } = geolocation(request);

  if (!(flag && country && city && latitude && longitude && slug)) {
    return Response.json({ message: 'Missing required parameters' });
  } else {
    await sql(
      'INSERT INTO analytics(date, slug, flag, country, city, latitude, longitude) VALUES($1, $2, $3, $4, $5, $6, $7)',
      [date, slug, flag, country, city.replace(/[^a-zA-Z ]/g, ' '), latitude, longitude]
    );

    return Response.json({ message: 'A Ok!' });
  }
}

export const config = {
  runtime: 'edge',
};
```

## The Edge Function explained

The Edge Function destructures a `slug` from the `request.body`, this is sent from the client (I’ll cover that in a later step). The Edge Function also creates a new `date` when a request is received, this date will be accurate to the user’s timezone since Edge Functions execute in the same timezone as the user.

I then extract the following values from the request using the geolocation helper function.

1. flag
2. country
3. city
4. latitude
5. longitude

If any of the above values are `null`, or a `slug` hasn’t been passed to the Edge Function, I return a message.

If all values are present and correct I proceed to `INSERT INTO` the database.

_It’s worth noting that all geolocation values will be null while running the development server. You’ll have to deploy to Vercel to see any values from incoming requests._

That completes the database and server-side part of this post. It’s now time to move on to the front end.

## Create an EdgeAnalytics component

With the Edge Function in place, it’s now ready to receive client-side requests. Unconventionally, rather than using [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), I’ll be using [sendBeacon](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon). (Thanks to [Ward Peeters for the suggestion](https://twitter.com/wardpeet/status/1706350257020223688?s=20)).<br />

As Ward mentions in our conversation, using fetch won’t necessarily harm performance, but sendBeacon is pretty much specifically for use with requests of this nature, and to quote from the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon) verbatim.

<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p><em>It’s intended to be used for sending analytics data to a web server, and avoids some of the problems with legacy techniques for sending analytics, such as the use of XMLHttpRequest.</em></p>
<cite><a href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon">https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon</a></cite>
</blockquote>

I _t’s worth noting though, some Ad Blockers might block requests made using sendBeacon._

### EdgeAnalytics component

Create a new component in `src/components`. In the sample repository, I’ve named the component [edge-analytics.astro](https://github.com/PaulieScanlon/neon-edge-analytics-astro-sample/blob/main/src/components/edge-analytics.astro).

```javascript
---
const { slug } = Astro.props;
---

<edge-analytics data-slug={slug}></edge-analytics>
<script>
  class EdgeAnalytics extends HTMLElement {
    constructor() {
      super();
      (() => {
        navigator.sendBeacon('/api/page-view', JSON.stringify({ slug: this.dataset.slug }));
      })();
    }
  }
  customElements.define('edge-analytics', EdgeAnalytics);
</script>
```

## The EdgeAnalytics component explained

The EdgeAnalytics component is a [web component with custom elements](https://docs.astro.build/en/guides/client-side-scripts/#web-components-with-custom-elements) and contains a self-invoking function that uses `sendBeacon` to `POST` a `slug` to the Edge Function. The slug will be passed as a prop, which I’ll cover in the implementation steps next.

## Implement the EdgeAnalytics component

Add the `EdgeAnalytics` component to each page where you’d like to track page views. You can see how I’ve implemented the component in the sample repository here: [index.astro](https://github.com/PaulieScanlon/neon-edge-analytics-astro-sample/blob/main/src/pages/index.astro).

```javascript
---
import EdgeAnalytics from '../components/edge-analytics.astro';

const isProduction = import.meta.env.PROD;
---

<html lang='en'>
  <head>
    <meta charset='utf-8' />
    <!-- Edge Analytics -->
    {isProduction ? <EdgeAnalytics slug='/' /> : null}
  </head>
  <body>
    <main>
      <h1>Index</h1>
    </main>
  </body>
</html>
```

## EdgeAnalytics component implementation explained

To prevent page views from being fired off while in development, I’m conditionally rendering the component using a ternary operator and an `isProduction` const. Only when the environment variable, `isProduction`, is `true` will the component be rendered to a page.

<br />Finally, as I mentioned, the component accepts a prop called `slug` which is where I pass in the current page URL.

## Deploy

That completes the front-end part of this post, but to see if everything is working as expected you’ll need to deploy your site and visit a few of the pages.<br />

Once you’ve done that you can head back to the **Neon console** and run the following against the `analytics` table.

```sql
SELECT * FROM analytics;
```

If everything is working correctly you should see some new rows of data in the table. Here’s what mine looks like. (I’m in Montreal, Canada FYI)

![Screenshot of Neon console showing result of SELECT * FROM analytics](https://cdn.neonapi.io/public/images/pages/blog/roll-your-own-analytics-with-astro-vercel-edge-functions-and-neon/roll-your-own-analytics-select-from-1024x640-17f0a932.png)

## Data Visualisation Examples

Here are a few examples of what you could do with the data. I’ve implemented some of these on my [dashboard](https://www.paulie.dev/dashboard/), but I’d be interested to see how you’re using this approach.

<br />Feel free to find me on Twitter/X and let me know: [@PaulieScanlon](https://twitter.com/PaulieScanlon).

### Top Ten Countries

In this example, I’ve created a query that counts the occurrences of the country name and limits the response to 10.

```sql
SELECT flag, country, COUNT(country) AS total
FROM analytics
GROUP BY flag, country
ORDER BY total DESC
LIMIT 10;
```

I’m displaying the results in a simple HTML list.

![Screenshot of Top ten country visits](https://cdn.neonapi.io/public/images/pages/blog/roll-your-own-analytics-with-astro-vercel-edge-functions-and-neon/roll-your-own-analytics-countries-1024x640-13ebb9a9.png)

### Top Ten Cities

In this example, I’ve created a query that counts the occurrences of the city name and limits the response to 10.

```sql
SELECT flag, city, COUNT(city) AS total
FROM analytics
GROUP BY flag, city
ORDER BY total DESC
LIMIT 10;
```

As before, I’m displaying the results in a simple HTML list.

![Screenshot of Top ten city visits](https://cdn.neonapi.io/public/images/pages/blog/roll-your-own-analytics-with-astro-vercel-edge-functions-and-neon/roll-your-own-analytics-cities-1024x640-108b5654.png)

### Geolocation

In this example, I’ve created a query that counts the occurrences of the city name for site visits in the last 30 days.

```sql
SELECT latitude, longitude, COUNT(city) AS total
FROM analytics
WHERE date >= NOW() - INTERVAL '30 days'
GROUP BY latitude, longitude
ORDER BY total DESC;
```

I’m using the results here to plot the latitude and longitude around a 3D globe and use the total as an altitude for each point. (The taller the point, the more visits from that city).

![Screenshot of 3D globe showing all city locations from the last 30 days](https://cdn.neonapi.io/public/images/pages/blog/roll-your-own-analytics-with-astro-vercel-edge-functions-and-neon/roll-your-own-analytics-views-1024x640-db60523b.png)

### All Site Visits

In this example, I’ve created a query that counts the occurrences of the day for site visits in the last 30 days.

```sql
SELECT
   EXTRACT(day FROM date) AS day,
   EXTRACT(month FROM date) AS month,
   EXTRACT(year FROM date) AS year,
   COUNT(*) AS total
FROM analytics
WHERE date >= (CURRENT_DATE - INTERVAL '30 days')
GROUP BY EXTRACT(day FROM date), EXTRACT(month FROM date), EXTRACT(year FROM date)
ORDER BY year ASC, month ASC, day ASC;
```

I’m using the result here to plot an Svg polyline chart to compare total visits over days of the month.

![Screenshot of polyline chart showing all site visits from the last 30 days](https://cdn.neonapi.io/public/images/pages/blog/roll-your-own-analytics-with-astro-vercel-edge-functions-and-neon/roll-your-own-analytics-visits-1024x640-8a07f519.png)

## Finishing up

No doubt there are many other ways to represent this data and I might add more features to [my site](https://www.paulie.dev/) in due course but, for now at least, I’m happy with the way I’m capturing site visits.

Moreover, should Google remove any further reporting dimensions from GA4, I won’t need to change anything!

This data is mine and is securely and reliably stored in a Neon database, ready to be queried however I please, forever more.

If you want to try this out yourself sign up at [neon.tech](https://neon.tech/).

Thanks for reading.<br />[TTFN](https://en.wikipedia.org/wiki/TTFN).
