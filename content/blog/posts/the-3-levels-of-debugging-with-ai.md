---
title: The 3 Levels of Debugging With AI
description: Get the debugging cheat codes
excerpt: >-
  Nothing works first time: if you are coding, you are debugging. This used to
  mean console.log(), print statements scattered like breadcrumbs, and hours
  spent staring at stacktraces trying to decipher what went wrong and where. No
  longer. Now, errors are chucked into Claude to dec...
date: '2025-05-22T17:40:11'
updatedOn: '2025-05-22T17:58:09'
category: product
categories:
  - product
authors:
  - andrew-tate
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/the-3-levels-of-debugging-with-ai/cover.jpg
  alt: null
isFeatured: false
seo:
  title: The 3 Levels of Debugging With AI - Neon
  description: >-
    If you are coding, you are debugging. Get tips on how to use AI to get the
    most bang for your debugging buck.
  keywords: []
  noindex: false
  ogTitle: The 3 Levels of Debugging With AI - Neon
  ogDescription: >-
    If you are coding, you are debugging. Get tips on how to use AI to get the
    most bang for your debugging buck.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/the-3-levels-of-debugging-with-ai/social.png
---

Nothing works first time: if you are coding, you are debugging. This used to mean console.log(), print statements scattered like breadcrumbs, and hours spent staring at stacktraces trying to decipher what went wrong and where.

No longer. Now, errors are chucked into Claude to decipher in seconds rather than hours. On the surface, this feels like cheating. But AI is genuinely good at debugging, and is only about to improve. By learning how to use AI to debug more effectively, you can build more robust software and learn how not to make these mistakes in the first place.

Here, we want to think about how AI debugging works, from “lazy” AI debugging to interactive debugging agents that actively explore your code’s execution. By understanding these three levels of AI-assisted debugging, you’ll know exactly when to use each approach and how to get the most bang for your debugging buck.

## Debug on Vibes: Chucking Works!

If it’s good enough for [Andrew Ng](https://x.com/AndrewYNg/status/1907843984158036137), it should be good enough for you:

<blockquote>
<p><em>When debugging code, many developers copy-paste error messages — sometimes pages of them — into an LLM without further instructions. Most LLMs are smart enough to figure out that you want them to help understand and propose fixes, so you don’t need to explicitly tell them. </em></p>
</blockquote>

This is akin to Andréj Karpathy’s [vibe coding](https://neon.tech/blog/tab-coding-cursor), but the debugging version. Ng calls this “lazy prompting”—instead of presuming the LLM needs a complex prompt to decipher, just rely on the LLM’s innate ability to know what any error means. For instance, say we have this error:

```bash
Uncaught TypeError: Cannot read properties of undefined (reading 'map')
    at UserList (UserList.jsx:23)
    at renderWithHooks (react-dom.development.js:16305)
    at mountIndeterminateComponent (react-dom.development.js:20074)
```

If we chuck this into Claude, we get:

_This TypeError occurs when your code is trying to use the_ _map_ _function on something that is_ _undefined\*\*._

_Looking at the error message, the issue is happening:_

- _In a component called `UserList`_
- _Specifically at line 23 of `UserList.jsx`_
- _While React is trying to render your component_

_The most likely cause is that you’re trying to map over a variable that hasn’t been initialized properly. For example, you might have code like `users.map(...)` but `users` is undefined when the component first renders._

_To fix this error, you need to add a check to ensure the variable isn’t undefined before trying to map over it. Here’s how you could fix it:_

```
// In UserList.jsx, around line 23
// Instead of:
// users.map(user => ...)

// Do this:
{users && users.map(user => (
  // your mapping logic here
))}
```

Of course, developers are now using AI-powered IDEs such as Cursor. In that case, you can set it to Agent mode, chuck the error in, and have the agent implement the fix.

This zero-friction approach works surprisingly well for shallow bugs – those surface-level issues with clear error messages. It’s particularly effective for deciphering cryptic stack traces, catching syntax errors, or performing quick sanity checks when you’re not sure you’re using an API correctly.

However, vibe-based debugging has clear limitations. Without access to your actual code, models can only make educated guesses based on error patterns they’ve seen before. This can lead to hallucinations or overly generic fixes that don’t address your specific implementation. Worse, a quick fix might mask deeper design flaws that will cause bigger problems down the road.

To get the most from this approach:

- Copy only the relevant portions of error messages rather than entire logs.
- Ask the model to explain why its proposed fix works. This builds your intuition and helps you learn.
- Time-box your efforts. If you haven’t made progress after two iterations with the model, it’s time to move to a more sophisticated debugging approach.

Also, don’t think this is the “basic” approach to AI debugging. As Ng says:

<blockquote>
<p><em>Lazy prompting is an advanced technique. On average, I see more people giving too little context to LLMs than too much. Laziness is a good technique only when you’ve learned how to provide enough context, and then deliberately step back to see how little context you can get away with and still have it work.</em></p>
</blockquote>

Use this judiciously when you have a good idea of what the code is doing. Before you get to that, get better at prompting.

## Building Better Prompts for Better Debugging

Between “chuck it in and hope” and fully automated luxury debugging lies the art of crafting structured debugging prompts. This approach treats your AI interaction like a proper bug report, with context, code snippets, and clear expectations.

When you provide a well-structured debugging prompt, you create a mini-specification that gives the AI exactly what it needs to understand your problem space. Here’s what makes this approach powerful:

```
Error: TypeError: Cannot read properties of undefined (reading 'filter')
Code:
function FilterableList({ items, filterFn }) {
  const filteredItems = items.filter(filterFn);
  return (
    <ul>
      {filteredItems.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}

Environment: React 18, Next.js 14
Expected: Component should filter and display items when filterFn is provided
Actual: Component crashes on first render with the error above
What I've tried: Added a console.log before filter, items shows as undefined
```

This structured, context-rich approach dramatically reduces hallucinations and improves answer quality. It also forces you to reason about the bug before offloading it to the model, creating a rubber-duck effect that sometimes helps you solve the problem before you even finish typing your prompt.

The best debugging prompts follow this checklist:

1. **Scope the snippet**: Include the failing function and how and where it’s called. Context is crucial.
2. **Clarify intent**: Be explicit about what you expected versus what actually happened: “I expected [3,2,1], but I got [1,2,3].”
3. **Set a role if useful**: “You are a senior React developer with expertise in state management…”
4. **Iterate with feedback**: When you get a fix, don’t implement it blindly. Feed back the results: “I tried your solution, but now I’m getting this new error…”
5. **Always verify**: Rerun tests, scan the diff, and lint your code. Never trust AI-generated fixes without verification.

These practices align with general prompt-engineering guidance: clarity, context, constraints, and explicit goals. The difference is that you’re applying these principles specifically to debugging scenarios.

This approach is so effective because it mimics how senior developers communicate about bugs: precise, context-aware, and focused on symptoms and surrounding conditions. By structuring your prompt this way, you’re teaching the AI to think about your code the way an experienced developer would.

## Debugging Agents Are Coming For Your Mistakes

The two options above are how you are probably debugging with AI now. But what about in the future? Cursor et al can already use your error inputs to correct code, but there is an alternative—give AI regular debugging tools and let it go through the debug cycle itself.

The future of debugging will be AI agents that actively drive a real debugger, set breakpoints, inspect variables, and patch code, all in an automated loop. Instead of just receiving error messages and trying to diagnose issues from static information, these agents can interactively explore the program’s behavior during execution.

Microsoft’s [debug-gym](https://www.microsoft.com/en-us/research/blog/debug-gym-an-environment-for-ai-coding-tools-to-learn-how-to-debug-code-like-programmers/) exemplifies this approach by providing a sandbox environment where an LLM-based agent can:

- Set breakpoints using the Python debugger (pdb)
- Navigate through repositories and codebases
- Print and inspect variable values at runtime
- Create and execute test functions on the fly
- Generate patches based on gathered information

![Image](https://cdn.neonapi.io/public/images/pages/blog/the-3-levels-of-debugging-with-ai/ad4nxcnnsisthckugviygoh3t5o02byb2vwubzam4zch6atp5wa9411b-arntmlacua5lnehk9rmqioxhipilxzjnutxsisqruvxuuzh-lpr8s0wywdvtfr790ptsb3q-4vltrjrvovq-2a702ba9.png)

This significantly expands the agent’s “action and observation space,” enabling it to debug more like a human developer. By allowing AI to gather relevant runtime information through interactive debugging, debug-gym will enable agents to make more informed decisions about code fixes. The debug-gym environment is designed with several key capabilities:

1. **Repository-level understanding**: Rather than dealing with individual files or code snippets, debug-gym gives agents access to entire codebases, allowing them to navigate between files and understand the broader context.
2. **Safety through sandboxing**: All debugging happens within Docker containers, preventing potentially harmful actions while enabling thorough testing and debugging.
3. **Extensibility**: The environment is built with a modular design, making adding new tools or capabilities easy as debugging techniques evolve.
4. **Text-based interaction**: The environment uses structured text for both observations and actions, making it fully compatible with modern LLM-based agents.

debug-gym has impressive results. When equipped with debugging tools, LLM agents showed significant performance improvements compared to traditional “error-message-only” agents. The most dramatic improvement came with OpenAI’s o1-preview model, which jumped from solving 10.7% to 30.2% of SWE-bench Lite issues—a 182% relative increase—when given access to debugging tools.

![Image](https://cdn.neonapi.io/public/images/pages/blog/the-3-levels-of-debugging-with-ai/ad4nxfbi7yqu2bmwgruirbnvxf8s5s8menh6nvly6yxgox6jiwyt59qbvopu4tui6su7yzklkvrfiao7raibq4-g7rgp8hvhzuo4788lnrgxlic5cfso9i-6pmgtjcbvkr58xz2-24ed5aa2.png)

Even the strongest models benefited from debugging capabilities, with Claude 3.7 Sonnet improving from 37.2% to 48.4% success rate (a 30% relative increase). This validates equipping AI agents with real debugging tools rather than having them guess solely from error messages.

Today, tools like Cursor allow GPT-4o to step through applications inside IDEs. These early implementations demonstrate the real-world applicability of tool debugging approaches. Shortly, we can expect even more sophisticated CI/CD bots that:

- Automatically reproduce failing tests
- Bisect repositories to identify offending commits
- Open pull requests with fixes plus regression tests
- Provide clear explanations of what was wrong and how it was fixed

As these powerful debugging agents become more common, following best practices becomes essential:

1. **Start small**: Begin by allowing agents to run tests, then gradually grant debugger access as confidence in their capabilities grows.
2. **Sandbox everything**: Always containerize debugging runs to prevent potential damage from stray commands or malicious inputs.
3. **Keep humans in the loop**: Require reviewer approval before merging AI-generated fixes, ensuring code quality and appropriate solutions.
4. **Implement robust telemetry**: Log every action debugging agents take to enable traceability and accountability.<br />

Is human debugging destined for the history books? Maybe. Just as calculators made manual arithmetic calculations obsolete, AI debugging tools are poised to handle the tedious aspects of tracking down bugs. The most advanced debugging agents won’t just find bugs—they’ll fix them, document them, and teach you why they happened in the first place, all while you focus on more creative design challenges.

## Learn From the Best (Machines)

Don’t make the mistake of thinking this means debugging skills are headed for obsolescence. Instead, these AI debugging partners offer an unprecedented learning opportunity. Watch how they methodically track down issues, observe the patterns they recognize, and absorb their problem-solving approaches. The smartest developers aren’t just using AI to write code faster; they’re using it to become better engineers.

Let the machines handle the what of debugging while you deepen your understanding of the why. After all, while debugging techniques can be automated, the engineering _nous_ that comes from understanding how systems fail will always be your competitive edge.

---

_Neon is the serverless Postgres database behind [Replit Agent](https://neon.tech/blog/replit-app-history-powered-by-neon-branches), it also works like a charm with AI IDEs like Cursor. [Sign up for our Free Plan](https://console.neon.tech/signup) and start building (and debugging!)_
