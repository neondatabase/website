---
title: Building a guest book with Civet
subtitle: Building a guest book with Civet and exploring the pros and cons of the language
author: astrid-gealer
enableTableOfContents: true
createdAt: '2024-10-24T00:00:00.000Z'
updatedOn: '2024-10-24T00:00:00.000Z'
---

There has been a fair amount of discussion online about the Civet programming language. In this blog post, I will try and build a simple Next codebase whilst using Civet to render the pages.

## What is Civet?

Civet is a language that describes itself as "A Programming Language for the New Millenium". As a subset of TypeScript, it offers some CoffeeScript-like syntax whilst still being type checked and being able to compile back out to TypeScript meaning that you still get to use types and all of your other libraries, a problem that CoffeeScript struggled with later in its life.

As someone who quite likes the Ruby and TypeScript programming languages, I was very excited to check this out!

## Adding Civet to a Next codebase

A language alone isn't too helpful if it cannot integrate into your existing codebase, though. Luckily, Civet supports Astro, esbuild, NextJS, Rollup, Vite, and Webpack out of the box quite easily, with other templates available for Solid users. We will use Next for this today.

To get started, I simply ran `npx create-next-app` with all of the default options. From here, I ran `npm i -D @danielx/civet` to install the civet compiler and then added it to the webpack options in `next.config.ts` (whilst changing their template to be compatible). From here, I noticed that it isn't typed so you cannot use the new Next TS configuration with it:

![VS Code showing invalid types](/docs/guides/civet/bad_types.png)

This is a unfortunate sign for something that claims to be "99% JS/TS compatible". However, after rolling back to [their JS config that uses the legacy Next way with RequireJS](https://github.com/DanielXMoore/Civet/blob/a365833803e193f46b8552692e0955cc09bfd76c/integration/unplugin-examples/nextjs/next.config.js), I did see no errors and was able to start the development server!

Lets make a simple guest book using server components and Drizzle for the database. The first thing I did was remove `page.tsx` and `layout.tsx` and create a `page.civet` file with a simple hello world page just to make sure everything was working as expected. The first thing you will notice is that VS Code does not have native support, so you need to download the Civet language server from the extensions marketplace. This enables the icon for Civet and syntax highlighting, which you can see when you hover is using the TypeScript server under the hood. The first thing I initially noticed was that copilot was autocompleting JavaScript in these files:

![copilot autocompletes JS](/docs/guides/civet/copilot.png)

This is a flaw that all new languages are going to face that are not syntactically similar to others in the AI world unfortunately, and it is going to require new training data to be able to fix this. Unfortunately, this does hurt some of the productivity claims if you are a heavy user of AI solutions to get your work done. As I was just getting started, I wrote this code by accident which is invalid syntax:

![invalid civet syntax](/docs/guides/civet/civet_error.png)

This resulted in the following in the console:

![civet console error](/docs/guides/civet/civet_console.png)

With no output to the browser. This is important to remember when developing that the tooling is nowhere near as mature as for TS/JS yet, and errors within Civet seem to crash the entire next runtime. After realising my error that the problem was related to the fact that functions still had to be marked as such outside of classes, the code looked like this:

![civet correct syntax](/docs/guides/civet/civet_ok.png)

Which is quite clean in my opinion! The lack of a closing tag is intentional since Civet does not require one if it is single line or there is indentation. Additionally, the return keyword is not needed because Civet has Rust-like behaviour of implicit returns. Whether you like this or not will come down to personal preference.

Sure enough, I went to my browser and saw hello world waiting for me. The first thing I noticed was that Tailwind was not activated, but this was due to my deletion of the layout earlier. A new layout was created automatically, so lets try converting that to Civet too!

The first thing I noticed whilst doing this was that importing the global CSS file caused the server to crash, when I rebooted, I was faced with a weird build error:

![Next no such directory error](/docs/guides/civet/no_such_directory.png)

This persisted across development server reboots, only resolving itself when I removed the `.next` directory and restarted the development server. The layout would've been equally impressive, but unfortunately I was getting issues importing the CSS with this:

![layout](/docs/guides/civet/layout.png)

After I did this, I played around with some of the TSX shortcuts within Civet. The first thing I tried was the class name shortener within Civet's implementation of TSX. I did notice that by default, it tried to apply this to the `class` attribute which is disallowed in React, but luckily Civet has some other configuration options that we can use:

![adding text-lg on Civet](/docs/guides/civet/civet_class.png)

After adding this, we successfully got the styles applied to the component! This in my opinion is really nice syntax and will make simple class adjustments a lot less clumbersome than they are in regular TSX, especially to new engineers. It is important to note, though, that Tailwind support is not yet implemented yet so although the compiler works, code suggestions do not.

## Adding Drizzle into the project

To setup Drizzle, we need to install the `drizzle-orm` package and `drizzle-kit` development dependency, and we will also need the `@neondatabase/serverless` dependency to connect to the database. Now we need to make the schema. The schema still has to be in TypeScript since Drizzle does not have support for non-TS/JS schemas. Lets make a simple schema for a guest book where a user signs with a name and note:

```ts
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const guestBookSigners = pgTable("guestBookSigners", {
    createdAt: timestamp().defaultNow().notNull(),
    name: text().notNull(),
    note: text().notNull(),
}, (t) => ({
    createdAtIndex: index("guest_book_created_idx").on(t.createdAt),
}));
```

Now lets configure `drizzle.config.ts` to work with this:

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./schema.ts",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
```

Next, we can add the scripts required for database migrations to our `package.json`:

```json
"db:generate-migrations": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate"
```

And we can run `npm run db:generate-migrations` and `npm run db:migrate` (with `DATABASE_URL` set) to migrate our Neon database.

With the database migrated, lets integrate this into our project. We will create the file `singletons/database.civet` to do our database connection. One thing I noticed doing this was the performance of the TS server felt quite slow:

![TS server being slow](/docs/guides/civet/slowness.png)

With all that said, when it was done, the file was very clean:

![contents of singletons/database.civet](/docs/guides/civet/clean_db_file.png)

Ok, great! Lets now integrate this into our application. The first thing I did was add `m-20` to the layout file, and then I started adding the functionality to the page using server components. Off the bat, the first thing I did notice was that the highlighting was a bit buggy. It mostly worked great, but there were problems, especially with TSX:

![syntax highlighting bug](/docs/guides/civet/syntax_highlighting.png)

Another thing I noticed was that import aliases seemed to break with Civet:

![import path alias error](/docs/guides/civet/path_alias_error.png)

I in fact had such a big problem getting this to work that I had to migrate the singleton to TypesScript:

```ts
import { Pool } from "@neondatabase/serverless"
import * as schema from "@/schema"
import { drizzle } from "drizzle-orm/neon-serverless"

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

export default drizzle(pool, { schema });
```

After I wrote all the code (whilst battling lots of crashes), the code was very clean and made very good use of indentation in my opinion:

![guest book code](/docs/guides/civet/guest_book_code.png)

With this, we have a fully working guest book! There are a few things I noticed though:

- The problems with the TSX syntax highlighting are very apparent in this.
- The form handler constantly complained of a invalid type. I think this is because the Next types are not being loaded in properly.
- I constantly had to reboot the development server due to compilation issues. In my opinion, these should be handled more like TypeScript.

In my opinion, Civet has a lot of potential in the future, and allows for a lot cleaner code when it is working well. However, it is hard to suggest it for a new codebase right now since there are a lot of bugs with how the compiler integrates with Next.
