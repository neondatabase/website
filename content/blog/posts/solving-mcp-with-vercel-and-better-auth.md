---
title: Solving the MCP Authentication Headache with Vercel & Better Auth
description: >-
  OAuth authentication for MCP servers using Vercel's MCP adapter and Better
  Auth
excerpt: >-
  The Problem There have been a lot of different evolutions of external function
  calling with this age of LLMs. First it was plugins, then it was tool calling,
  then it now is MCP (which looks like it is here to stay). But throughout all
  of that there has been one consistent issue,...
date: '2025-05-23T19:29:57'
updatedOn: '2025-05-23T19:48:37'
category: community
categories:
  - community
authors:
  - ryan-vogel
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/solving-mcp-with-vercel-and-better-auth/cover.png
  alt: null
isFeatured: true
seo:
  title: Solving the MCP Authentication Headache with Vercel & Better Auth - Neon
  description: >-
    Implementing secure MCPs by using the Vercel MCP adapter package and Better
    Auth integration.
  keywords: []
  noindex: false
  ogTitle: Solving the MCP Authentication Headache with Vercel & Better Auth - Neon
  ogDescription: >-
    Implementing secure MCPs by using the Vercel MCP adapter package and Better
    Auth integration.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/solving-mcp-with-vercel-and-better-auth/social.png
---

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/solving-mcp-with-vercel-and-better-auth/og-no-text-1024x576-aba01d14.png" alt="Post image" />
</figure>

## The Problem

There have been a lot of different evolutions of external function calling with this age of LLMs. First it was plugins, then it was tool calling, then it now is MCP (which looks like it is here to stay). But throughout all of that there has been one consistent issue, _authentication_.

How do you authenticate a request to make sure that a user isn’t just accessing someone else’s data. I had this same thought when I was working on one of my projects [agenda.dev](https://agenda.dev). I wanted users to be able to access their todos in a simple MCP fashion, I originally put out a tweet asking what the best way to implement it:

<EmbedTweet url="https://twitter.com/ryandavogel/status/1920473767332995147?ref_src=twsrc%5Etfw" />

Both of these presented a glaring issue, the auth uuid or bearer token would be available in plaintext via the `mcp.json` of the client provider. This obviously was an issue as pointed out my Mark F:

<EmbedTweet url="https://twitter.com/r_marked/status/1920539669626040357?ref_src=twsrc%5Etfw" />

This got me thinking, wait, why haven’t I heard of a MCP OAuth solution that is simple? Then I started doing some digging and found that there are some implementations for some other auth providers but not for Better Auth, which is what I was using in the agenda codebase.

## Figuring out a Solution to MCPs with OAuth?

So I reached out to Bereket Engida, the founder of Better Auth and Andrew Qu from Vercel, the author of the `@vercel/mcp-adapter` npm package which made it super easy to create an MCP route in a standard Next.js project.

Essentially, this package is a lifesaver for Next.js developers wanting their apps to communicate with AI models using the Model Context Protocol (MCP). It gives you a straightforward way to set up an MCP server right within your Next.js project. This means you can easily define ‘tools’ that your AI can use, like making your app roll dice or fetch specific data. The beauty of the `@vercel/mcp-adapter` is that it handles a lot of the complex, behind-the-scenes plumbing needed for MCP, letting you focus on building cool features instead of wrestling with protocol details.

They were able to whip together a solution based on the Model Context Protocol (MCP) specification for authorization as seen below (pretty complex):

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/solving-mcp-with-vercel-and-better-auth/image-10-8059d765.png" alt="Image" />
<figcaption>https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization</figcaption>
</figure>

## Adding the Better Auth and Vercel MCP handler

The implementation is super minimal with the user only having to modify 3 files with under 10 lines of code.

First off, in your `auth.ts` file that manages your primary Better Auth instance config you need to add the MCP plugin

```typescript
// auth.ts
import { betterAuth } from "better-auth";
import { mcp } from "better-auth/plugins";
 
export const auth = betterAuth({
    plugins: [
        mcp({
            loginPage: "/sign-in" // path to your login page
        })
    ]
});
```

Then you have to add the oauth-server route that is built in to the MCP auth specification

```typescript
// .well-known/oauth-authorization-server/route.ts
import { oAuthDiscoveryMetadata } from better-auth/plugins";
import { auth } from "../../../lib/auth";
 
export const GET = oAuthDiscoveryMetadata(auth);
```

After that you can jump to api/[transport]/route.ts which contains the primary functions for the MCP server which looks like this before wrapping auth:

```typescript
// app/api/[transport]/route.ts
import { createMcpHandler } from '@vercel/mcp-adapter';
const handler = createMcpHandler(
  server => {
    server.tool(
      'roll_dice',
      'Rolls an N-sided die',
      { 
        sides: z.number().int().min(2)
      },
      async ({ sides }) => {
        const value = 1 + Math.floor(Math.random() * sides);
        return {
          content: [{ type: 'text', text: `🎲 You rolled a ${value}! ` }],
        };
      }
    );
  },
  {
  },
  {
    redisUrl: process.env.REDIS_URL,
    basePath: '/api', 
    maxDuration: 60,
    verboseLogs: true,
  }
);
export { handler as GET, handler as POST };
```

And wrap it with the `withMcpAuth` function to require auth for the entire MCP server or even reach into the users session to grab the userid to check access to resources (where in my use case would be making sure the user only accesses their todo’s)

This configuration section allows you to optionally connect to Redis for features like resilient Server-Sent Event (SSE) transport, define the base API path for your MCP endpoint, and set operational parameters like maximum connection duration and logging verbosity.

```typescript
// app/api/[transport]/route.ts
import { auth } from "@/lib/auth";
import { createMcpHandler } from "@vercel/mcp-adapter";
import { withMcpAuth } from "better-auth/plugins";
import { z } from "zod";
 
const handler = async (req: Request) => {
    const session = await auth.api.getMCPSession({
        headers: req.headers
    })
    
    
    if(!session){
        return new Response(null, {
            status: 401
        })
    }
    
    
    return createMcpHandler(
        (server) => {
            server.tool(
                "echo",
                "Echo a message",
                { message: z.string() },
                async ({ message }) => {
                    return {
                        content: [{ type: "text", text: `Tool echo: ${message}` }],
                    };
                },
            );
        },
        {
            capabilities: {
                tools: {
                    echo: {
                        description: "Echo a message",
                    },
                },
            },
        },
        {
            redisUrl: process.env.REDIS_URL,
            basePath: "/api",
            verboseLogs: true,
            maxDuration: 60,
        },
    )(req);
}
 
export { handler as GET, handler as POST, handler as DELETE };
```

This was a super easy implementation that I was able to implement in agenda in less than 30 minutes, then after that you just have to configure your MCP server and the tools, after it was implemented all I had to do was add the correct endpoint in my editor of choice (which for this demo was Cursor)

```json
"agenda": {
	"command": "npx",
	"args": [
	      "-y",
	      "mcp-remote",
	      "https://localhost:3000/api/mcp"
        ]
}
```

## Testing the MCP in Cursor (with authentication)

What this will do now is when you open up the client and it hits that endpoint, it will check for authentication, if the user doesn’t have a session it will open a popup to the loginPage we set above and ask the user to login, once we are logged in and fully setup we should see the green light to start using it:

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/solving-mcp-with-vercel-and-better-auth/image-11-115244f7.png" alt="Post image" />
</figure>

Now all we have to do is just see whats on our agenda 😃:

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/solving-mcp-with-vercel-and-better-auth/image-12-9d60ab01.png" alt="Post image" />
</figure>

And just like that it lets you access your todos _directly_ from the LLM client!

The Model Context Protocol is still very early and authentication, payments, and supported transports are still being actively discussed and hashed out. OAuth seems promising and it’s great to see more remote MCP servers, authentication providers, and infrastructure companies adopting it. Excited for what’s next in MCP!

You can check out the open source github repos for the MCP Adapter & Better Auth here:

MCP Adapter: [https://github.com/vercel/mcp-adapter](https://github.com/vercel/mcp-adapter)

Better Auth: [https://github.com/better-auth/better-auth](https://github.com/better-auth/better-auth)
