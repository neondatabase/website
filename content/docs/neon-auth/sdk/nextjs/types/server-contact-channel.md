---
title: ServerContactChannel
subtitle: Reference for the ServerContactChannel object
enableTableOfContents: true
tag: beta
---

## `ServerContactChannel`

The `ServerContactChannel` object is used on the server side to represent a contact channel. It includes all the functionality of a `ContactChannel` object, plus additional server-side functionality.

### Table of Contents

```typescript
type ServerContactChannel =
  // Inherits all functionality from ContactChannel
  & ContactChannel
  & {
    serverMetadata: Json;
    serverReadOnlyMetadata: Json;
  };
```

### `serverContactChannel.serverMetadata`

The server metadata of the contact channel as a `Json` object. This can be modified by the server.

```typescript
declare const serverMetadata: Json;
```

### `serverContactChannel.serverReadOnlyMetadata`

The server read-only metadata of the contact channel as a `Json` object. This cannot be modified by the server.

```typescript
declare const serverReadOnlyMetadata: Json;
``` 