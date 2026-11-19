---
title: 'TypeScript SDK: Client'
subtitle: Subscribe to sealed queries from the browser with @neon/realtime/client
summary: Reference for the Realtime Client module, @neon/realtime/client, which subscribes to sealed live queries over one shared WebSocket, materializes their results and runs in browsers and React Native.
enableTableOfContents: true
updatedOn: '2026-11-18T00:59:49.148Z'
---

Import the Client module from `@neon/realtime/client`. It runs in the browser, where it subscribes to sealed queries over one shared WebSocket and keeps their results up to date. It's taught in the [Subscribing to queries](/docs/realtime/guides/subscribing) guide.

Create one client for your app, then subscribe to a sealed query from your backend:

```ts
import { createRealtimeClient } from "@neon/realtime/client"

const client = createRealtimeClient({ url: import.meta.env.VITE_NEON_REALTIME_URL })
const subscription = client.subscribe(sealedQuery)
subscription.onChange(({ data, status }) => render(data, status))
```

Pass a `logLevel` to see what the client is doing, as [Log client diagnostics](/docs/realtime/guides/subscribing#log-client-diagnostics) shows.

## React Native

The client also runs in React Native apps, with `@neon/realtime` 0.1.2 or later. Import it from `@neon/realtime/client` as usual.

React Native's WebSocket sends an `Origin` header derived from the Realtime endpoint. If your branch restricts Realtime to specific origins, pass a `webSocketFactory` that sends one of the allowed origins:

```ts
const client = createRealtimeClient({
  url: realtimeUrl,
  webSocketFactory: (url, protocols) =>
    new WebSocket(url, protocols, {
      headers: { origin: "https://app.example.com" },
    }),
})
```

The third `WebSocket` argument is a React Native extension and isn't available in browsers. An origin allowlist protects browser apps only. A native app can send any origin, so don't rely on it to authenticate native clients.

## Renewing sealed queries

Most apps pass a `refreshQuery` function to the [React or TanStack DB bindings](/docs/realtime/guides/reactivity), which renew for them. To renew a subscription yourself, see [Renew the sealed query](/docs/realtime/guides/subscribing#renew-the-sealed-query). Integration authors can build on [`QueryRefreshController`](#client-queryrefreshcontroller).

## API reference

<RealtimeSdkClient />
