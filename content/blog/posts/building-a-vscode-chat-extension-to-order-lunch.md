---
title: Building a VSCode Chat Extension to Order Lunch
description: Want some cheesburgers?
excerpt: "Are you ever so deeply in the developer grindset that you forget to eat? Me neither. But like most VC-backed companies, I wanted to solve a problem that does not exist \U0001F642 (not yet at least!) So, we decided to build an extension able to order us cheesburguers for lunch. The Stack..."
date: '2025-03-07T02:21:47'
updatedOn: '2025-03-07T16:56:04'
category: community
categories:
  - community
authors:
  - andrew-hamilton
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-a-vscode-chat-extension-to-order-lunch/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Building a VSCode Chat Extension to Order Lunch - Neon
  description: >-
    The team at Layer went to work with an essential mission: to build an
    extension able to order them cheesburguers for lunch.
  keywords: []
  noindex: false
  ogTitle: Building a VSCode Chat Extension to Order Lunch - Neon
  ogDescription: >-
    The team at Layer went to work with an essential mission: to build an
    extension able to order them cheesburguers for lunch.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/building-a-vscode-chat-extension-to-order-lunch/cover.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-a-vscode-chat-extension-to-order-lunch/neonvscode675-1024x576-5711b9f3.jpg)

<Admonition type="tip" title="About Layer">
This is a guest blog post by our friends from [Layer](https://www.buildwithlayer.com), which helped us built [Neon Copilot](https://marketplace.visualstudio.com/items?itemName=buildwithlayer.neon-integration-expert-15j6N). Chech them out.
</Admonition>

Are you ever so deeply in the developer grindset that you forget to eat? Me neither. But like most VC-backed companies, I wanted to solve a problem that does not exist 🙂 _(not yet at least!)_

So, we decided to build an extension able to order us cheesburguers for lunch.

## The Stack

First, a look at the architecture we will be using. Here is the general flow:

1. **VSCode Chat API**: Developer asks Copilot to “Order lunch”
2. **LLM Determines tool calls**: GET_LUNCH_OPTIONS
3. **Copilot responds**: Copilot will list options from the restaurant of what the developer can order
4. **Developer responds**: “Cheeseburger”
5. **LLM Determines tool calls**: ORDER_LUNCH_ITEM
6. **Copilot responds**: “Your cheeseburger had been ordered, sir”

## Reverse Engineering Grubhub API like a Sigma Developer

At first, we wanted to use Doordash, but they use server-side rendering to display their menus which would make our jobs real hard. So, we settled on using Grubhub instead.

Grubhub doesn’t have an API to order food from that is public; they do have this [API](https://developer.grubhub.com/), but this is for merchants, which we are not. So we needed to reverse engineer the API. To do this, we used Chrome Dev Tools & [Postman Interceptor](https://chromewebstore.google.com/detail/postman-interceptor/aicmkgpgakddgnaphhhpliifpcfhicfo?hl=en).

## The First “Accidental” Cheeseburger

In order to intercept all the requests, we needed to place an order. With our Postman interceptor listening and the company card details ready, we walked through the checkout process, and clicked “Submit”.

Soon, hundreds of requests poured out of our computer as our credit card information was sent to the Grubhub servers. We then rapidly tried to cancel the order, but it was too late, and it arrived 30 minutes later.

Here it is in its full glory:

````
                            |\ /| /|_/|
                          |\||-|\||-/|/|
                           \\|\|//||///
          _..----.._       |\/\||//||||
        .'     o    '.     |||\\|/\\ ||
       /   o       o  \    | './\_/.' |
      |o        o     o|   |          |
      /'-.._o     __.-'\   |          |
      \      `````     /   |          |
      |``--........--'`|    '.______.'
       \              /
	    `'----------'`

I forgot to take a picture, enjoy this ascii art
````

The burgers were as good as we imagined them would be. More importantly, we had all the request information we needed to start the reverse engineering.

We found out it only takes 4 POST and 1 PUT request on Grubhub to make an order. To save you all the time, here they are:

1. **POST `/carts`:** This route creates a new cart on the user’s account
2. **POST `/carts/\{cart_id\}/lines`:** This allows us to add an item to the cart we just created
3. **PUT `/carts/\{cart_id\}/delivery_info`:** This updates the delivery address for the cart
4. **POST `/carts/\{cart_id\}/payments`:** This attaches a payment method to the cart
5. **POST `/carts/\{cart_id\}/checkout`:** This places the order

Now, there are a few more routes we are going to add to make the VSCode checkout experience smoother—but these 5 routes are all you need to place an order using the Grubhub.

## Building The VS Code Extension

Now, the next step. VSCode extensions are a bunch of Typescript accessing bunch of [APIs](https://code.visualstudio.com/api/get-started/your-first-extension). You can actually start one with a single command here:

```bash
npx --package yo --package generator-code -- yo code`
```

Let us step back for a moment, and take a look at the full project structure:

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-a-vscode-chat-extension-to-order-lunch/diagram1-1024x552-d5da843c.jpg)

You can see there are two parts to our extension:

1. The stuff (on the left-hand side) that VSCode requires for us to render a participant. And for that, I will refer you to [these docs](https://code.visualstudio.com/api/extension-guides/chat-tutorial), as they are pretty good.
2. The stuff (on the right-hand side) required to call the tools / use the LLM, which is what the rest of this blog will focus on.

## How do we Call an API With an LLM?

Function calling basically works like this:

<blockquote>
<p><strong>User:</strong><br></br>Hey LLM I have this function called add that takes parameters &#123;num1: int, num2: int&#125; only respond with JSON so I can parse it from the response. Please add 5 and 9<br></br><br></br><strong>Assistant</strong>: <br></br>&#123;num1: 5, num2: 9&#125;</p>
</blockquote>

While the LLMs that produce these JSON schemas no longer need to be prompted in this fashion, fundamentally, this is how function calling works. Here is an example of one of the tool schemas for `/get_restaurant_items`:

```json
"inputSchema": {
	"type": "object",
	"properties": {
		"restaurant_id": {
			"type": "string",
			"description": "The ID of the restaurant"
		}
	},
	"required": ["restaurant_id"]
}

--> Expected response from LLM
{
  "restaurant_id": "38427391"
}
```

This response is easy to parse with JSON.loads() and then can be validated with something like [Zod](https://zod.dev/) or [Pydantic](https://docs.pydantic.dev/latest/) to ensure it is correct. These tool schemas are declared in the `package.jsonfile` in the extension, which you can find [here](https://github.com/andrewlayer/grubhub/blob/main/package.json).

## Function Calling

Now that we have our JSON, we need to use it to invoke a function. In the case of calling an API endpoint, that mean we need to take our parameters and shove them into javascript `fetch`. Here is how we got that done for `/get_restaurant_items`:

```typescript
export class GetRestaurantItemsTool implements vscode.LanguageModelTool<GetRestaurantItemsParameters> {
    async invoke(
        options: vscode. LanguageModelToolInvocationOptions<GetRestaurantItemsParameters>,
        _token: vscode. CancellationToken
    ) {
        try {
            const res = await grubhubClient.getRestaurantItems(options.input.restaurant_id);
            
            const itemsList = response.items.map(item => 
                `- ${item.item_name} (ID: ${item.item_id})\n
                  ${item.item_description || 'No description available'}`
            ).join('\n\n');

            return new vscode. LanguageModelToolResult([
                new vscode. LanguageModelTextPart(
                    itemsList || 'No items found'
                )
            ]);
        } catch (error) {
            return new vscode. LanguageModelToolResult([
                new vscode. LanguageModelTextPart(
                    `Failed to get restaurant items: ${error instanceof Error ? error.message : 'Unknown error'}`
                )
            ]);
        }
    }
}
```

In the code above, we implement the `vscode.LanguageModelTool` class which requires the `invoke` function. This line of code is ultimately what does the “calling” of the tool:

```typescript
const res = await grubhubClient.getRestaurantItems(options.input.restaurant_id);
```

You can see that we ascertained the restaurant ID. You might be asking, “How did you parse the JSON?” By implementing the language model tool class, this is done automatically for us as long as we provide a JSON schema.

## Workflows (a Quick Aside)

**In order to make any agentic experience nice, you really need workflows.** _Why is this?, you might be asking._ Well, let me show you a hypothetical conversation to illustrate:

_**Hungry Developer**: Hey, can you list my restaurants?_

_**AI (internally panicking)**: You need to make a session first before I can list your restaurants, let me do that. (Frantically makes API calls in the background)_

_**Still-Hungry Developer**: ok can you do it now please_

_**AI (sweating)**: Getting your favorite restaurants. Here they are_

- _Restaurant 123421_
- _Restaurant 60552_
- _Restaurant 6646_

<br />_**Hangry Developer**: What?! I want the names of the restaurants, not their IDs 😡_

_**AI (having an existential crisis)**: Ah, I see. I need to get the restaurant names using this route for each ID. Here they are:_

- _Beighly’s Burgers and Bananas_
- _Jared’s Jive_
- _Dave’s Delicious Driveway_

_(Phew, crisis averted… until the next API call)_

The above conversation is the (moderately dramatized) flow of API calls required for Copilot to list restaurants for Grubhub. This obviously isn’t very user-friendly. You see, most APIs out-of-the-box are not ready to be used by AI agents because they provide bad UX and require additional information that we, as users, and LLMs, don’t care about.

Thus, we must clean and simplify the API. So how can we accomplish these workflows?

A fully managed VSCode extension is a pain to maintain for most companies. Here a way to evaluate if you should build your own:

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-a-vscode-chat-extension-to-order-lunch/diagram2-1024x621-d9c30737.jpg)

In this project, I hardcode them all. But if you are interested in _effortlessly_ cleaning your API for agents to use effectively, you should check out [Layer](https://buildwithlayer.com/).

## Are we Done Yet?

For the most part, yes. But don’t you want to order some food? 🙂

1. **Install the extension** [here](https://marketplace.visualstudio.com/items?itemName=buildwithlayer.grubhub). This will open a tab in VSCode where you can then actually add the extension.
2. **Get your bearer token & POINT**: So, this took us so long anyways—so we’re still not handling auth well. You can get your bearer token and POINT by intercepting the `https://api-gtm.grubhub.com/restaurants/availability_summaries` request made as such:

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-a-vscode-chat-extension-to-order-lunch/image-1024x474-d7e46092.png)

3\. Input those values into the VSCode Grubhub extension settings:<br />

![Image](https://cdn.neonapi.io/public/images/pages/blog/building-a-vscode-chat-extension-to-order-lunch/image-1-1024x656-2df16a45.png)

4\. Restart VSCode, and voilà 🎉!

_Bon Appétit._
