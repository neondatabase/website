---
title: How to Build GitHub Copilot Extensions
description: 'At Layer, we built Neon’s Copilot Extension—and we can build yours too'
excerpt: >-
  As soon as GitHub Copilot burst onto the scene, everyone started asking, “How
  do we teach Copilot about our platform?” Whether you’re building a managed
  Postgres service (like Neon) or a specialized set of APIs, it’s no longer
  enough to rely on devs hunting through documentation....
date: '2025-02-06T19:44:05'
updatedOn: '2025-02-06T20:23:26'
category: community
categories:
  - community
authors:
  - andrew-hamilton
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-build-github-copilot-extensions/cover.jpg
  alt: null
isFeatured: false
seo:
  title: How to Build GitHub Copilot Extensions - Neon
  description: >-
    Layer can help you create a Copilot extension—written in any language—that
    injects your product’s intelligence into GitHub Copilot.
  keywords: []
  noindex: false
  ogTitle: How to Build GitHub Copilot Extensions - Neon
  ogDescription: >-
    Layer can help you create a Copilot extension—written in any language—that
    injects your product’s intelligence into GitHub Copilot.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/how-to-build-github-copilot-extensions/cover.jpg
source:
  wpId: 8426
  wpSlug: how-to-build-github-copilot-extensions
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/how-to-build-github-copilot-extensions/neon-layer-2-1024x576-275695b7.jpg)

As soon as GitHub Copilot burst onto the scene, everyone started asking, _“How do we teach Copilot about our platform?”_ Whether you’re building a managed Postgres service (like [Neon](https://neon.tech/home)) or a specialized set of APIs, it’s no longer enough to rely on devs hunting through documentation. They want AI-driven integrations that bring your endpoints and best practices directly into their coding workflow.

**That’s where [Layer](https://www.buildwithlayer.com/) comes in.** We can help you create a Copilot extension—written in _any_ language—that seamlessly injects your product’s intelligence into GitHub Copilot (and any other AI surface for that matter).

In this blog post, we’ll walk you through the steps we used to built [Neon’s Copilot Extension](https://github.com/marketplace/neon-database) (and why the idea of a “Copilot extension” isn’t quite what you might expect).

## Install System Prerequisites: Python, Ngrok

First, make sure that you have the latest versions of [Python](https://www.python.org/downloads/) and [Ngrok](https://ngrok.com/) installed onto your system.

## Webhook Subscriptions: Like Building a Discord Bot

If you’ve built a Discord bot before, you’re already familiar with this pattern: you set up a server, then point the platform at it so it can deliver events to your endpoint. That’s exactly how GitHub Copilot extensions work under the hood: You create a web server—written in any language you like—and **subscribe** it to events from GitHub. Whenever Copilot needs to query your extension, it fires an HTTP request to your server.

This “subscription” approach is powerful for two reasons:

1. **Language freedom**.Because all you need is a server that handles HTTP requests, you’re not locked into Python, Java, Node, or any specific tech stack. If you can spin up a server, you can handle Copilot extension calls—whether you prefer Go, OCaml, or even Ruby.
2. **Unlimited custom logic**.Once the requests arrive, it’s entirely up to you how to process them. Want to authenticate users, pull data from a Postgres database, or call a third-party API? Go for it. The webhook subscription doesn’t dictate how your code runs; it just ensures Copilot knows where to send requests.

In other words, the only thing you really need to do is let GitHub know where your server lives. Once that’s done, you can implement your Copilot “extension” in the language of your choice, and handle incoming Copilot requests in whatever way best suits your application’s needs.

![graphicv1.png](https://lh7-rt.googleusercontent.com/docsz/AD_4nXddSaZ6qvSvjDv-at6KWas6qqn8NlrIV1EbnTmB79UCClMGxYNJ0MP6KYf_4rlSRzbEFSxp90G_y_fCYLPjix-zSjlX7x1XQejI0k3v9wBBfrq6MFYnsdB-rmdkQ87G4DfQbxVMmw?key=xZif7x-n-rhPMaEQcygPPaLp)

## Our Server

So now we get to the interesting stuff—making our copilot server. Here Layer’s starter code:

```python
import httpx
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse
import debugpy

app = FastAPI()

debugpy.listen(("0.0.0.0", 8888))

SYSTEM_MESSAGE = {
	"role": "system",
	"content": """Respond as though you have too much food in your mouth""",
}

def prepare_messages(user_messages: list) -> list:
	return user_messages + [SYSTEM_MESSAGE]

async def get_github_completion(messages: list, auth_token: str):
	async with httpx.AsyncClient() as client:
		response = await client.post(
			"https://api.githubcopilot.com/chat/completions",
			headers={
				"Authorization": f"Bearer {auth_token}",
				"Content-Type": "application/json",
			},
			json={
				"messages": prepare_messages(messages),
				"stream": True,
			},
			timeout=30.0,
		)

		return response


@app.post("/completion")
async def completion(request: Request):
	req = await request.json()
	auth_token = request.headers.get("x-github-token")
	messages = req.get("messages", [])

	if not auth_token:
		raise HTTPException(status_code=401, detail="Missing authentication token")

	response = await get_github_completion(messages, auth_token)

	return StreamingResponse(
		response.aiter_bytes(),
		media_type="text/event-stream",
		status_code=response.status_code,
	)
```

This code does has two important objectives:

1. **Create endpoint for Copilot to hit**: POST /completion route responds to Copilot requests
2. **Craft Prompt**: The system message is injected into the message history to modify the response given.

Start the server by running this command:

```bash
uvicorn {FILENAME}:app --reload
```

Now that we have created our server, we need to subscribe to it to handle Copilot requests.

## Registering Github App

Ironically, this is the hardest part of the tutorial (honestly, because Github is a beefy tool). In order to let Copilot know what URL to hit every time the `@\{YOUR_EXTENSION_NAME\}` name is used, we create a Github App for the subscription. To do this, navigate to the [Github Apps page](https://github.com/settings/apps):

![no_github_apps.png](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfsErX5F0AIOg6I40qHa2cOh8Sb7O3Ly46alRjHbm_2ZZPIWncSHwd24xsy1urSjAV7Kx65setlGKWdIU5VG0oTZQFH1i84FHcJSvHGMkBPCklY91Mgpw-Lku85bG9xFDVDd9lj8A?key=xZif7x-n-rhPMaEQcygPPaLp)

Here we are going to create a new Github App and fill in some sensible defaults so that we can hit our server.

- **Fill out a name**: (The name spacing for Github apps is _very_ restrictive, so choose something obscure)
- **Fill out Homepage URL**: This can be any URL, it’s just required by Github
- **Fill out Callback URL**: Make this `https://github.com. ` It will be called when authorizing the usage of a Github app and will redirect them back to Github afterwards.

![github_app_page1.png](https://lh7-rt.googleusercontent.com/docsz/AD_4nXeyKAKoLHxJpdMOHJBp5Zz3mDZLidaHSDtGiPy-ix7_AAytYv9TU6kWG0VfQa3iX1tG8QWGLtY-adupnXelfRcXaK6mW23wuzRu3HhTw-TgueoKYQMgidJAQWM6dWeJTEOcvwp9tA?key=xZif7x-n-rhPMaEQcygPPaLp)

- **Deactivate Webhook:** We won’t be using this feature, so nothing to worry about here.
- **Enable Account Permissions**: This step is REQUIRED, otherwise the Copilot app won’t work. Give Read-Only access to “Copilot Chat” and “Copilot Editor Context”
- **Allow Install on Any Account**: This allows you to share the extension with anyone.

![github_app_2.png](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfTIuZ54FedhHTjFeH78PnsRIObSkMNYK8-ERPLofPNkK_3C7GZRYieMht3n5JovQz6fYWolWAtzkpYbfPXAfzQSLxgTgBTjniVqHJM1HGkiMzf0Dhn4HWVGNt3rQeUcV35VEFrsQ?key=xZif7x-n-rhPMaEQcygPPaLp)

Now, hit “Create Github App”.

**_Congrats, if you have done all this, you created your first Github App!_ ** 🥳

Now lets navigate to the Copilot tab where it will ask you what “App Type” you want to try to create. Select “Agent”:

![Screenshot 2025-02-03 at 14.25.25.png](https://lh7-rt.googleusercontent.com/docsz/AD_4nXf7QDJOATdzVLwKXnWZrucRrCq4qo-knd7m663eUKyfjLdH96VCA7em0Ik8MBp_9f3MF--nb5wZr_6oIwwdMZsseIof2CIAgF2WvzIwndVjyjusPGH5KaGrdvMHBtye2Hn4gnp3vQ?key=xZif7x-n-rhPMaEQcygPPaLp)

I promise you, the Github config is just about over. Now we are going to use Ngrok to expose your local development server on the internet. It’s a pretty neat service.

First, let’s expose our local dev server to the internet so that Copilot can hit it! This should be done in a separate terminal from the `uvicorn` server. Both need to be running simultaneously.

```bash
ngrok http 8000
```

Now my VSCode window looks like this, with the left side hosting the Uvicorn server on port 8000 and the Ngrok tunnel on the right terminal with the forwarding port.

![servers.png](https://lh7-rt.googleusercontent.com/docsz/AD_4nXcTgs23PLottqR6JAKjiFsRYBLYsGNqFsaDOkR214B3gjvMhM90A-GlmBMwFvNx43pDTLKVn0VQCO6pJC0ym5PBDcq6wtGRV59kNrODL57OyFCsBYbWJvd3vdYdwgcJTJXpkaB-Kw?key=xZif7x-n-rhPMaEQcygPPaLp)

Now, take the forwarding address that I highlighted above and append /completion to the end of it and place it in the URL field of the Agent definition:

![agent_def.png](https://lh7-rt.googleusercontent.com/docsz/AD_4nXeCFH3U2VPXoqbwTveWtNwtHVh8sHfxHUHAw7AMLo_TppFDuzRd3XTOTIEQH_KJ4Rv7zt9N_0BlsUN1JSziPGl-e2ETfn5aY_sJlnWKTWc8WUG3-a3fsYSdQp4xbNhTkWVDtzMW?key=xZif7x-n-rhPMaEQcygPPaLp)

Ok, we are finally done with config! Now let’s install and use it. This can be done super easily. Just type the name of your app into the copilot chat. In my case that looks like this:

![Screenshot 2025-02-03 at 16.12.02.png](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfcdylsIZ2cmoMrLOl-SmnuGWcZuLqigT-Ee2YeGNtUs281S1julA1OqvfgU-Dh2DnHKvoQmaC3hBGzrfYqdPmEpk4-4xfC3JNFTCqlzzMiblqndGmsw1ZDMaDosDuCB_RvqHLNEA?key=xZif7x-n-rhPMaEQcygPPaLp)

Follow the prompts to connect by authorizing Github to utilize the app, and ta-da! You have your own Neon Copilot extension!

![Screenshot 2025-02-03 at 16.14.45.png](https://lh7-rt.googleusercontent.com/docsz/AD_4nXcOGy0D7bHzzlaFI3cg8TGSnhG9t9R1HbcaNE_Q7_TPwKCYfSRkDjXgqF28i0t_Qo1lHqtSSdlldh_K0MW2EOvGZzD0D0Vo2RcH_sJdlxlDjGaNzz1QGAIyFExMf6ngwlhqanxImQ?key=xZif7x-n-rhPMaEQcygPPaLp)

## Want Your Own Extension? Build it With Layer

Now, this Copilot extension is a way to dip your toes into the world of [LLM Extensibility](https://docs.buildwithlayer.com/llm_extensibility)—but going fully production-ready (like we did with Neon) means setting up retrieval-augmented generation (RAG), function calling, message analytics, and more.

Plus, you’ll have to replicate this logic across all the surfaces you plan to support.

That’s exactly why we built Layer: a unified platform for managing LLM extensions. We handle Copilot, VS Code, OpenAI GPTs, Anthropic MCP, and beyond—so you can focus on building a great user experience instead of juggling integrations. AI Agents will be writing more and more software in the future—so if you’re a company that wants to make your API easy for AI agents to use, [Layer](https://buildwithlayer.com/) is here to help. Book a demo [here](https://cal.com/team/layer/demo) if you want to learn more.
